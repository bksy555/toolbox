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
      default:
        res.status(400).json({ error: 'unknown action' });
    }
  } catch (e) {
    console.error('API error:', e);
    res.status(500).json({ error: e.message });
  }
}

// ==================== 搜索 ====================

async function handleSearch(req, res) {
  const keyword = req.query.keyword || '';
  const page = parseInt(req.query.page) || 1;
  const limit = 24;
  const offset = (page - 1) * limit;
  
  if (!keyword.trim()) {
    return res.json({ songs: [], total: 0 });
  }
  
  // 并行搜索多个平台
  const [neteaseSongs, qqSongs] = await Promise.all([
    searchNetease(keyword, offset, limit),
    searchQQ(keyword),
  ]);
  
  // 合并，优先显示 NetEase 结果，QQ 补充
  const seen = new Set();
  const merged = [];
  
  for (const song of [...neteaseSongs, ...qqSongs]) {
    const key = `${song.name}|${song.artists?.join(',') || ''}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(song);
    }
  }
  
  res.json({ songs: merged.slice(0, 30), total: merged.length });
}

async function searchNetease(keyword, offset, limit) {
  try {
    const url = `${NETEASE_API}/search?keywords=${encodeURIComponent(keyword)}&offset=${offset}&limit=${limit}`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://music.163.com/' }
    });
    const data = await resp.json();
    if (!data.result?.songs) return [];
    return data.result.songs.map(s => ({
      id: String(s.id),
      name: s.name,
      artists: s.artists ? s.artists.map(a => a.name) : [],
      album: s.album?.name || '',
      albumPic: s.album?.picUrl || s.album?.artist?.img1v1Url || '',
      duration: s.duration || 0,
      source: 'netease'
    }));
  } catch {
    return [];
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

// ==================== 多源获取播放 URL ====================

async function handleUrl(req, res) {
  const id = req.query.id;
  const source = req.query.source || 'auto';
  
  if (!id) {
    return res.status(400).json({ error: 'no song id' });
  }
  
  let result = null;
  const sources = source === 'auto' ? ['netease', 'qq'] : [source];
  
  for (const s of sources) {
    switch (s) {
      case 'netease':
        result = await getNeteaseUrl(id);
        break;
      case 'qq':
        result = await getQQUrl(id);
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
    // QQ Music 获取播放链接
    const data = {
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
    };
    
    const url = `https://u.y.qq.com/cgi-bin/musicu.fcg?data=${encodeURIComponent(JSON.stringify(data))}`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://y.qq.com/' }
    });
    const result = await resp.json();
    
    // 从响应中提取播放 URL
    const reqData = result?.req?.data;
    const req0Data = result?.req_0?.data;
    
    // 方式1: 从 keepalivefile 构建 URL
    if (reqData?.sip?.[0] && reqData?.keepalivefile) {
      const fullUrl = reqData.sip[0] + reqData.keepalivefile;
      return { url: fullUrl, source: 'qq', br: 128000 };
    }
    
    // 方式2: 从 midurlinfo 构建 URL
    if (req0Data?.sip?.[0] && req0Data?.midurlinfo?.[0]?.purl) {
      const fullUrl = req0Data.sip[0] + req0Data.midurlinfo[0].purl;
      return { url: fullUrl, source: 'qq', br: 128000 };
    }
    
    return null;
  } catch {
    return null;
  }
}