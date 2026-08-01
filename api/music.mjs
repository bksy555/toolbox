// /api/music.mjs - 音乐播放器 API 代理
// 搜索和获取歌曲播放链接，支持多源回退

const NETEASE_API = 'https://netease-cloud-music-api-xi-pied.vercel.app';

export default async function handler(req, res) {
  // 设置 CORS 头
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
      case 'hot':
        return await handleHot(req, res);
      default:
        res.status(400).json({ error: 'unknown action' });
    }
  } catch (e) {
    console.error('API error:', e);
    res.status(500).json({ error: e.message });
  }
}

// 搜索歌曲
async function handleSearch(req, res) {
  const keyword = req.query.keyword || '';
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;
  
  if (!keyword.trim()) {
    return res.json({ songs: [], total: 0 });
  }
  
  // 从 NetEase 搜索
  const url = `${NETEASE_API}/search?keywords=${encodeURIComponent(keyword)}&offset=${offset}&limit=${limit}`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const data = await response.json();
  
  if (!data.result || !data.result.songs) {
    return res.json({ songs: [], total: 0 });
  }
  
  const songs = data.result.songs.map(s => ({
    id: s.id,
    name: s.name,
    artists: s.artists ? s.artists.map(a => a.name) : [],
    album: s.album ? s.album.name : '',
    albumPic: s.album ? (s.album.picUrl || s.album.artist?.img1v1Url || '') : '',
    duration: s.duration || 0,
    fee: s.fee || 0
  }));
  
  res.json({
    songs,
    total: data.result.songCount || 0,
    hasMore: data.result.hasMore || false
  });
}

// 获取歌曲播放链接
async function handleUrl(req, res) {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ error: 'no song id' });
  }
  
  // 尝试从 NetEase 获取
  const url = `${NETEASE_API}/song/url?id=${id}&br=320000`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const data = await response.json();
  
  if (data.data && data.data[0] && data.data[0].url) {
    return res.json({
      url: data.data[0].url,
      br: data.data[0].br || 320000,
      source: 'netease'
    });
  }
  
  // NetEase 无链接，返回不可用
  res.json({ url: null, source: 'netease' });
}

// 获取热门歌曲（热搜）
async function handleHot(req, res) {
  const url = `${NETEASE_API}/search/hot`;
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.json({ hot: [] });
  }
}