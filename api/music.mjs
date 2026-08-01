// /api/music.mjs - 音乐播放器 API 代理（多源回退 + 热歌缓存版）
// 多源搜索和获取播放链接，支持 QQ → NetEase 回退
// 热歌缓存：预加载热门歌曲播放链接，提升播放成功率

const NETEASE_API = 'https://netease-cloud-music-api-xi-pied.vercel.app';
const CACHE_FILE = './data/music-cache.json';

// 读取缓存
let musicCache = null;
function getCache() {
  if (musicCache) return musicCache;
  try {
    const fs = require('fs');
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf8');
      musicCache = JSON.parse(raw);
      console.log(`🎵 热歌缓存已加载: ${musicCache.songs?.length || 0} 首`);
    }
  } catch (e) {
    console.error('读取缓存失败:', e.message);
  }
  musicCache = musicCache || { songs: [] };
  return musicCache;
}

// 写入缓存
function saveCache(cache) {
  try {
    const fs = require('fs');
    cache.updatedAt = new Date().toISOString();
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
    console.log(`💾 缓存已保存: ${cache.songs.length} 首`);
    return true;
  } catch (e) {
    console.error('保存缓存失败:', e.message);
    return false;
  }
}

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
      case 'hot_songs':
        return await handleHotSongs(req, res);
      case 'refresh_cache':
        return await handleRefreshCache(req, res);
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
  
  // 合并，优先显示 QQ 音乐结果（链接成功率更高），NetEase 补充
  const seen = new Set();
  const merged = [];
  
  for (const song of [...qqSongs, ...neteaseSongs]) {
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
  const songName = req.query.name || '';
  const artistName = req.query.artist || '';
  
  if (!id) {
    return res.status(400).json({ error: 'no song id' });
  }
  
  // 1. 先检查缓存（按 songId 或 歌曲名+歌手名）
  const cache = getCache();
  let cachedResult = null;
  
  if (id) {
    cachedResult = cache.songs.find(s => s.id === id);
  }
  if (!cachedResult && songName && artistName) {
    cachedResult = cache.songs.find(s => 
      s.name === songName && s.artists?.join('/') === artistName
    );
  }
  
  if (cachedResult?.url) {
    console.log(`💿 命中缓存: ${cachedResult.name} - ${cachedResult.artists?.join('/')}`);
    return res.json({
      url: cachedResult.url,
      source: cachedResult.cacheSource || cachedResult.source || 'cache',
      br: cachedResult.br || 128000,
      cached: true
    });
  }
  
  // 2. 缓存未命中，从外部源获取
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
    res.json({ url: result.url, source: result.source, br: result.br || 128000, cached: false });
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
    
    // 方式3: 尝试备选 sip
    if (req0Data?.sip?.length > 1 && req0Data?.midurlinfo?.[0]?.purl) {
      for (const host of req0Data.sip) {
        if (host) {
          return { url: host + req0Data.midurlinfo[0].purl, source: 'qq', br: 128000 };
        }
      }
    }
    
    return null;
  } catch {
    return null;
  }
}

// ==================== 热歌缓存 ====================

// 获取热歌缓存列表
async function handleHotSongs(req, res) {
  const cache = getCache();
  const limit = parseInt(req.query.limit) || 50;
  res.json({
    songs: cache.songs.slice(0, limit),
    total: cache.songs.length,
    updatedAt: cache.updatedAt
  });
}

// 刷新热歌缓存（从外部API获取热门歌曲并缓存）
async function handleRefreshCache(req, res) {
  const maxSongs = Math.min(parseInt(req.query.max) || 300, 500);
  const key = req.query.key || '';
  
  // 简单鉴权，防止滥用
  if (key !== 'toolbox-music-cache-2026') {
    return res.status(403).json({ error: 'invalid key' });
  }
  
  const results = [];
  const errors = [];
  
  // 1. 从多个榜单获取热门歌曲（覆盖不同风格）
  const topLists = [
    { name: 'QQ热歌榜', topId: 4 },       // 总热榜
    { name: 'QQ新歌榜', topId: 27 },      // 新歌
    { name: 'QQ流行指数榜', topId: 26 },  // 流行趋势
    { name: 'QQ网络歌曲榜', topId: 36 },  // 网络热门
    { name: 'QQ内地榜', topId: 28 },      // 内地
    { name: 'QQ港台榜', topId: 29 },      // 港台
    { name: 'QQKTV金曲榜', topId: 52 },   // KTV经典
    { name: 'QQ影视金曲榜', topId: 65 },  // 影视OST
    { name: 'QQACG榜', topId: 78 },       // 二次元
    { name: 'QQ欧美榜', topId: 106 },     // 欧美
  ];
  
  for (const list of topLists) {
    try {
      const songs = await fetchQQTopList(list.topId, 30);
      console.log(`  📋 ${list.name}: 获取到 ${songs.length} 首`);
      
      for (const song of songs) {
        if (results.length >= maxSongs) break;
        
        // 获取播放URL
        const urlResult = await getQQUrl(song.id);
        if (urlResult) {
          results.push({
            id: song.id,
            name: song.name,
            artists: song.artists,
            album: song.album || '',
            albumPic: song.albumPic || '',
            duration: song.duration || 0,
            url: urlResult.url,
            source: urlResult.source,
            br: urlResult.br || 128000,
            cacheSource: 'qq',
            addedAt: new Date().toISOString()
          });
        } else {
          errors.push({ name: song.name, reason: 'no_url' });
        }
        
        // 控制速率
        await new Promise(r => setTimeout(r, 300));
      }
    } catch (e) {
      console.error(`  ❌ ${list.name}: ${e.message}`);
    }
    
    if (results.length >= maxSongs) break;
  }
  
  // 2. 更新缓存
  const cache = getCache();
  
  // 合并：新结果在前，旧结果补充（去重）
  const seen = new Set();
  const merged = [];
  
  for (const song of [...results, ...cache.songs]) {
    const key = `${song.name}|${song.artists?.join(',') || ''}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(song);
    }
  }
  
  cache.songs = merged;
  cache.version = (cache.version || 0) + 1;
  saveCache(cache);
  
  res.json({
    success: true,
    newSongs: results.length,
    totalSongs: cache.songs.length,
    errors: errors.length,
    updatedAt: cache.updatedAt
  });
}

// 获取 QQ 音乐榜单（使用旧版API，返回songmid格式）
async function fetchQQTopList(topId, num) {
  try {
    const url = `https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?topid=${topId}&type=top&song_begin=0&song_num=${num}`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://y.qq.com/' }
    });
    // 响应是 GBK 编码，需要处理
    const buffer = await resp.arrayBuffer();
    const decoder = new TextDecoder('gbk');
    let text = decoder.decode(buffer);
    // 找到 JSON 起始位置
    const start = text.indexOf('{');
    if (start < 0) return [];
    text = text.substring(start);
    const data = JSON.parse(text);
    const songList = data?.songlist || [];
    
    return songList.map(s => {
      const info = s.data || {};
      const singer = info.singer || [];
      return {
        id: info.songmid || '',
        name: info.songname || '',
        artists: singer.map(sg => sg.name || ''),
        album: info.albumname || '',
        albumPic: info.albummid ? `https://y.gtimg.cn/music/photo_new/T002R300x300M000${info.albummid}.jpg` : '',
        duration: (info.interval || 0) * 1000
      };
    }).filter(s => s.id && s.name);
  } catch (e) {
    console.error('获取QQ榜单失败:', e.message);
    return [];
  }
}