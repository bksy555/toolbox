// /api/music.mjs - 音乐播放器 API 代理（多源回退版）
// 多源搜索和获取播放链接，支持 NetEase → QQ → Kugou → Kuwo 回退

const NETEASE_API = 'https://netease-cloud-music-api-xi-pied.vercel.app';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const action = req.query.action;
  
  try {
    switch (action) {
      case 'search':
        return await handleSearch(req, res);
      case 'url':
        return await handleUrl(req, res);
      case 'search_all':
        return await handleSearchAll(req, res);
      default:
        res.status(400).json({ error: 'unknown action' });
    }
  } catch (e) {
    console.error('API error:', e);
    res.status(500).json({ error: e.message });
  }
}

// ==================== 搜索 ====================

// 仅 NetEase 搜索（用于首页搜索结果）
async function handleSearch(req, res) {
  const keyword = req.query.keyword || '';
  const page = parseInt(req.query.page) || 1;
  const limit = 24;
  const offset = (page - 1) * limit;
  
  if (!keyword.trim()) {
    return res.json({ songs: [], total: 0 });
  }
  
  const songs = await searchNetease(keyword, offset, limit);
  res.json(songs);
}

// 全平台搜索（聚合结果）
async function handleSearchAll(req, res) {
  const keyword = req.query.keyword || '';
  if (!keyword.trim()) {
    return res.json({ songs: [] });
  }
  
  const [neteaseSongs, qqSongs, kugouSongs] = await Promise.all([
    searchNetease(keyword, 0, 10),
    searchQQ(keyword),
    searchKugou(keyword)
  ]);
  
  // 合并去重
  const seen = new Set();
  const allSongs = [];
  
  for (const song of [...neteaseSongs.songs, ...qqSongs, ...kugouSongs]) {
    const key = `${song.name}|${song.artists?.join(',') || ''}`;
    if (!seen.has(key)) {
      seen.add(key);
      allSongs.push(song);
    }
  }
  
  res.json({ songs: allSongs.slice(0, 30) });
}

// ==================== 多源搜索实现 ====================

async function searchNetease(keyword, offset, limit) {
  const url = `${NETEASE_API}/search?keywords=${encodeURIComponent(keyword)}&offset=${offset}&limit=${limit}`;
  try {
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://music.163.com/' }
    });
    const data = await resp.json();
    if (!data.result?.songs) return { songs: [], total: 0 };
    return {
      songs: data.result.songs.map(s => ({
        id: String(s.id),
        name: s.name,
        artists: s.artists ? s.artists.map(a => a.name) : [],
        album: s.album?.name || '',
        albumPic: s.album?.picUrl || s.album?.artist?.img1v1Url || '',
        duration: s.duration || 0,
        source: 'netease'
      })),
      total: data.result.songCount || 0
    };
  } catch {
    return { songs: [], total: 0 };
  }
}

async function searchQQ(keyword) {
  try {
    const url = `https://c.y.qq.com/soso/fcgi-bin/client_search_cp?w=${encodeURIComponent(keyword)}&format=json&p=1&n=10&cr=1&aggr=1`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://y.qq.com/' }
    });
    const data = await resp.json();
    const list = data?.data?.song?.list || [];
    return list.map(s => ({
      id: s.songmid,
      name: s.songname || s.name || '',
      artists: (s.singer || []).map(a => a.name),
      album: s.albumname || '',
      albumPic: s.albummid ? `https://y.gtimg.cn/music/photo_new/T002R300x300M000${s.albummid}.jpg` : '',
      duration: (s.interval || 0) * 1000,
      source: 'qq'
    }));
  } catch {
    return [];
  }
}

async function searchKugou(keyword) {
  try {
    const url = `https://search.kugou.com/api/v3/search/song?keyword=${encodeURIComponent(keyword)}&page=1&pagesize=10&platform=web&filter=0`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.kugou.com/' }
    });
    const data = await resp.json();
    const list = data?.data?.lists || data?.data?.info || [];
    return list.map(s => ({
      id: s.hash || s.FileHash || '',
      name: s.SongName || s.songname || s.Name || '',
      artists: [(s.SingerName || s.singername || s.AuthorName || '').replace(/、/g, '/')],
      album: s.AlbumName || s.album_name || '',
      albumPic: s.img || s.album_img || `https://www.kugou.com/static/images/singer/singer_placeholder.png`,
      duration: (s.duration || s.Duration || 0) * 1000,
      source: 'kugou',
      albumId: s.album_id || s.AlbumID || ''
    }));
  } catch {
    return [];
  }
}

// ==================== 多源获取播放 URL ====================

async function handleUrl(req, res) {
  const id = req.query.id;
  const source = req.query.source || 'auto';
  
  if (!id) {
    return res.status(400).json({ error: 'no song id' });
  }
  
  // 按来源获取播放链接，自动多源回退
  let result = null;
  const sources = source === 'auto' 
    ? ['netease', 'qq', 'kugou']
    : [source];
  
  for (const s of sources) {
    switch (s) {
      case 'netease':
        result = await getNeteaseUrl(id);
        break;
      case 'qq':
        result = await getQQUrl(id);
        break;
      case 'kugou':
        result = await getKugouUrl(id, req.query.album_id);
        break;
    }
    if (result) break;
  }
  
  if (result) {
    res.json({ url: result.url, source: result.source, br: result.br || 128000 });
  } else {
    res.json({ url: null, source: 'none' });
  }
}

async function getNeteaseUrl(id) {
  try {
    const url = `${NETEASE_API}/song/url?id=${id}&br=320000`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://music.163.com/' }
    });
    const data = await resp.json();
    if (data.data?.[0]?.url) {
      return { url: data.data[0].url, source: 'netease', br: data.data[0].br || 320000 };
    }
    return null;
  } catch {
    return null;
  }
}

async function getQQUrl(songmid) {
  try {
    // QQ Music 获取播放链接需要先获取 vkey
    const dataStr = JSON.stringify({
      req: {
        module: 'CDN.SrfCdnDispatchServer',
        method: 'GetCdnDispatch',
        param: { guid: '1234567890', calltype: 0, userip: '' }
      },
      req_0: {
        module: 'vkey.GetVkeyServer',
        method: 'CgiGetVkey',
        param: {
          guid: '1234567890',
          songmid: [songmid],
          songtype: [0],
          uin: '0',
          loginflag: 1,
          platform: '20'
        }
      }
    });
    
    const url = `https://u.y.qq.com/cgi-bin/musicu.fcg?data=${encodeURIComponent(dataStr)}`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://y.qq.com/' }
    });
    const data = await resp.json();
    const sip = data?.req_0?.data?.sip?.[0] || 'https://ws.stream.qqmusic.qq.com/';
    const midUrlInfo = data?.req_0?.data?.midurlinfo?.[0];
    
    if (midUrlInfo?.purl) {
      return { url: sip + midUrlInfo.purl, source: 'qq', br: 128000 };
    }
    return null;
  } catch {
    return null;
  }
}

async function getKugouUrl(hash, albumId) {
  try {
    // Kugou 获取播放链接
    const url = `https://www.kugou.com/yy/index.php?r=play/getdata&hash=${hash}&album_id=${albumId || ''}`;
    const resp = await fetch(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0', 
        'Referer': 'https://www.kugou.com/',
        'Cookie': 'kg_mid=1234567890'
      }
    });
    const data = await resp.json();
    if (data?.data?.play_url) {
      return { url: data.data.play_url, source: 'kugou', br: data.data.bitRate || 128000 };
    }
    return null;
  } catch {
    return null;
  }
}