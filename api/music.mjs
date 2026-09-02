// /api/music.mjs - 音乐播放器 API（基于 LX Music 生态 + 网易云音乐）
// 搜索：网易云 API
// 播放：ChKSz API（https://api.chksz.top/）- 来自 LX Music 生态
// 热歌缓存：网易云热歌榜 → ChKSz 解析播放链接

const NETEASE_API = 'https://netease-cloud-music-api-xi-pied.vercel.app';
const CHKSZ_API = 'https://api.chksz.top/api/163_music';
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

// ==================== 搜索（仅网易云） ====================

async function handleSearch(req, res) {
  const keyword = req.query.keyword || '';
  const page = parseInt(req.query.page) || 1;
  const limit = 24;
  const offset = (page - 1) * limit;
  
  if (!keyword.trim()) {
    return res.json({ songs: [], total: 0 });
  }
  
  try {
    const url = `${NETEASE_API}/search?keywords=${encodeURIComponent(keyword)}&offset=${offset}&limit=${limit}`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://music.163.com/' }
    });
    const data = await resp.json();
    const songs = data.result?.songs || [];
    
    const result = songs.map(s => ({
      id: String(s.id),
      name: s.name,
      artists: s.artists ? s.artists.map(a => a.name) : [],
      album: s.album?.name || '',
      albumPic: s.album?.picUrl || '',
      duration: s.duration || 0,
      source: 'netease'
    }));
    
    res.json({ songs: result, total: data.result?.songCount || result.length });
  } catch (e) {
    console.error('搜索失败:', e);
    res.json({ songs: [], total: 0 });
  }
}

// ==================== 获取播放 URL（通过 ChKSz API） ====================

async function handleUrl(req, res) {
  const id = req.query.id;
  const songName = req.query.name || '';
  const artistName = req.query.artist || '';
  
  if (!id) {
    return res.status(400).json({ error: 'no song id' });
  }
  
  // 1. 先检查缓存
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
      source: 'netease',
      br: cachedResult.br || 128000,
      cached: true
    });
  }
  
  // 2. 缓存未命中，通过 ChKSz API 获取
  try {
    const result = await getNeteaseUrl(id);
    if (result) {
      // 写入缓存
      const songInfo = cache.songs.find(s => s.id === id);
      if (songInfo) {
        songInfo.url = result.url;
        songInfo.br = result.br;
        saveCache(cache);
      }
      return res.json({ url: result.url, source: 'netease', br: result.br || 128000, cached: false });
    }
  } catch (e) {
    console.error('ChKSz API 错误:', e.message);
  }
  
  res.json({ url: null, source: 'none' });
}

async function getNeteaseUrl(id) {
  // 1. 优先使用网易云官方 API（netease-cloud-music-api-xi-pied.vercel.app，已验证可用）
  //    realIP 模拟国内访问，绕过 Vercel 海外 IP 的地区版权限制
  const CN_IPS = ['116.25.146.177', '223.104.22.0', '59.110.22.22'];
  const realIP = CN_IPS[Math.floor(Math.random() * CN_IPS.length)];
  try {
    const resp = await fetch(`${NETEASE_API}/song/url?id=${id}&realIP=${realIP}`, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://music.163.com/' }
    });
    const data = await resp.json();
    const item = data?.data?.[0];
    if (data.code === 200 && item?.url) {
      return {
        url: item.url,
        source: 'netease',
        br: item.br || 128000
      };
    }
    // 单个 IP 可能失败，轮流尝试其他 IP
    for (const ip of CN_IPS) {
      if (ip === realIP) continue;
      const resp2 = await fetch(`${NETEASE_API}/song/url?id=${id}&realIP=${ip}`, {
        headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://music.163.com/' }
      });
      const data2 = await resp2.json();
      const item2 = data2?.data?.[0];
      if (data2.code === 200 && item2?.url) {
        return {
          url: item2.url,
          source: 'netease',
          br: item2.br || 128000
        };
      }
    }
    console.log(`⚠️ 网易云API未返回url (id=${id}, code=${data.code})，尝试ChKSz兜底`);
  } catch (e) {
    console.log('网易云API请求失败，尝试ChKSz兜底:', e.message);
  }

  // 2. ChKSz API 兜底（原逻辑）
  const levels = ['jymaster', 'sky', 'hires', 'flac', '320k', '192k', '128k'];
  
  for (const level of levels) {
    try {
      const url = `${CHKSZ_API}?id=${id}&level=${level}`;
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://music.163.com/' }
      });
      const data = await resp.json();
      
      if (data.code === 200 && data.data?.url) {
        return {
          url: data.data.url,
          source: 'netease',
          br: data.data.br || 128000
        };
      }
    } catch (e) {
      // 继续尝试下一个音质级别
    }
  }
  
  return null;
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

// 刷新热歌缓存（从网易云热歌榜获取 + ChKSz 解析）
async function handleRefreshCache(req, res) {
  const maxSongs = Math.min(parseInt(req.query.max) || 300, 500);
  const key = req.query.key || '';
  
  // 简单鉴权
  if (key !== 'toolbox-music-cache-2026') {
    return res.status(403).json({ error: 'invalid key' });
  }
  
  const results = [];
  const errors = [];
  
  // 从网易云多个榜单获取热门歌曲
  const topListIds = [
    { name: '热歌榜', id: 3778678, limit: 100 },
    { name: '新歌榜', id: 3779629, limit: 100 },
    { name: '飙升榜', id: 19723756, limit: 100 },
    { name: '网络热歌榜', id: 6723173524, limit: 100 },
    { name: '黑胶VIP热歌榜', id: 7785066739, limit: 50 },
  ];
  
  for (const list of topListIds) {
    try {
      const songs = await fetchNeteaseTopList(list.id, list.limit);
      console.log(`  📋 ${list.name}: 获取到 ${songs.length} 首`);
      
      for (const song of songs) {
        if (results.length >= maxSongs) break;
        
        // ⚡ 优化：URL 按需获取（播放时自动缓存），这里只存歌曲元数据
        // 避免 Vercel 60s 超时（5 榜单 × 100 首 × 200ms 延迟 > 60s）
        results.push({
          id: song.id,
          name: song.name,
          artists: song.artists,
          album: song.album || '',
          albumPic: song.albumPic || '',
          duration: song.duration || 0,
          url: null,          // URL 在 handleUrl 播放时按需获取
          source: 'netease',
          br: null,
          addedAt: new Date().toISOString()
        });
      }
    } catch (e) {
      console.error(`  ❌ ${list.name}: ${e.message}`);
    }
    
    if (results.length >= maxSongs) break;
  }
  
  // 更新缓存（去重合并：新歌优先，但保留旧缓存中已有的播放URL）
  const cache = getCache();
  const seen = new Set();
  const merged = [];
  const oldByKey = new Map();
  for (const song of cache.songs) {
    const key = `${song.name}|${song.artists?.join(',') || ''}`;
    oldByKey.set(key, song);
  }
  
  for (const song of [...results, ...cache.songs]) {
    const key = `${song.name}|${song.artists?.join(',') || ''}`;
    if (!seen.has(key)) {
      seen.add(key);
      // 新歌没有URL，但从旧缓存能拿到URL则补上（保留播放能力）
      const enrichedSong = { ...song };
      if (!enrichedSong.url) {
        const old = oldByKey.get(key);
        if (old && old.url) {
          enrichedSong.url = old.url;
          enrichedSong.br = old.br || enrichedSong.br;
        }
      }
      merged.push(enrichedSong);
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
    updatedAt: cache.updatedAt,
    songs: cache.songs.slice(0, 500)
  });
}

// 获取网易云榜单歌曲
async function fetchNeteaseTopList(topId, limit) {
  try {
    const url = `${NETEASE_API}/playlist/track/all?id=${topId}&limit=${limit}`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://music.163.com/' }
    });
    const data = await resp.json();
    const songs = data.songs || [];
    
    return songs.map(s => ({
      id: String(s.id),
      name: s.name,
      artists: (s.ar || []).map(a => a.name),
      album: s.al?.name || '',
      albumPic: s.al?.picUrl || '',
      duration: s.dt || 0
    })).filter(s => s.id && s.name);
  } catch (e) {
    console.error('获取榜单失败:', e.message);
    return [];
  }
}