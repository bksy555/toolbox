// Vercel Serverless Function - 视频解析 API
// 纯自研，不依赖任何第三方服务
// 使用各平台官方 API 或直接解析页面获取视频信息

export default async function handler(req, res) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const url = req.query.url || (req.body && req.body.url);
  if (!url) {
    return res.status(400).json({ error: '请提供视频链接' });
  }
  
  try {
    // 判断平台
    let result;
    if (url.includes('tiktok.com')) {
      result = await parseTikTok(url);
    } else if (url.includes('douyin.com') || url.includes('douyin')) {
      result = await parseDouyin(url);
    } else if (url.includes('bilibili.com') || url.includes('b23.tv')) {
      result = await parseBilibili(url);
    } else if (url.includes('xiaohongshu.com') || url.includes('xhslink.com')) {
      result = await parseXiaohongshu(url);
    } else if (url.includes('kuaishou.com') || url.includes('gifshow.com')) {
      result = await parseKuaishou(url);
    } else {
      return res.status(400).json({ error: '暂不支持该平台' });
    }
    
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: '解析失败: ' + err.message });
  }
}

// TikTok - 使用 oEmbed API
async function parseTikTok(url) {
  const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
  const response = await fetch(oembedUrl);
  if (!response.ok) throw new Error('TikTok oEmbed API 请求失败');
  
  const data = await response.json();
  
  // 从 embed HTML 中提取视频 URL
  let videoUrl = null;
  if (data.html) {
    const match = data.html.match(/video_id=([^"&]+)/);
    if (match) {
      videoUrl = `https://www.tiktok.com/@${data.author_name}/video/${match[1]}?is_from_webapp=1`;
    }
  }
  
  return {
    platform: 'tiktok',
    title: data.title || '',
    author: data.author_name || '',
    thumbnail: data.thumbnail_url || '',
    authorUrl: data.author_url || '',
    videoUrl: videoUrl,
    embedHtml: data.html || ''
  };
}

// 抖音 - 解析页面获取视频信息
async function parseDouyin(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
    }
  });
  
  if (!response.ok) throw new Error('抖音页面请求失败');
  
  const html = await response.text();
  
  // 尝试从页面中提取视频信息
  // 方法1: 从 JSON-LD 中提取
  let videoUrl = null;
  let thumbnail = '';
  let title = '';
  let author = '';
  
  // 尝试匹配 video 标签
  const videoMatch = html.match(/<video[^>]*src="([^"]+)"[^>]*>/);
  if (videoMatch) {
    videoUrl = videoMatch[1];
  }
  
  // 尝试匹配 JSON 数据
  const jsonMatch = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([^<]+)<\/script>/);
  if (jsonMatch) {
    try {
      const jsonData = JSON.parse(jsonMatch[1]);
      // 从 JSON 中提取视频信息
      const props = jsonData.props?.pageProps || {};
      if (props.videoData) {
        videoUrl = videoUrl || props.videoData.playAddr || props.videoData.downloadAddr;
        thumbnail = props.videoData.cover || '';
        title = props.videoData.desc || '';
        author = props.videoData.author?.nickname || '';
      }
    } catch(e) {
      // JSON 解析失败，继续尝试其他方法
    }
  }
  
  // 方法3: 从 og:image 中提取封面
  const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"[^>]*>/);
  if (ogImageMatch) {
    thumbnail = ogImageMatch[1];
  }
  
  const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"[^>]*>/);
  if (ogTitleMatch) {
    title = ogTitleMatch[1];
  }
  
  return {
    platform: 'douyin',
    title: title || '抖音视频',
    author: author || '',
    thumbnail: thumbnail || '',
    videoUrl: videoUrl || '',
    note: videoUrl ? '' : '无法直接获取视频下载地址，请尝试使用官方抖音应用下载'
  };
}

// Bilibili - 使用官方 API
async function parseBilibili(url) {
  // 提取 BV 号或 AV 号
  let videoId = '';
  const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
  const avMatch = url.match(/av(\d+)/i);
  const b23Match = url.match(/b23\.tv\/([a-zA-Z0-9]+)/);
  
  if (bvMatch) {
    videoId = bvMatch[0];
  } else if (avMatch) {
    videoId = 'av' + avMatch[1];
  } else if (b23Match) {
    // 短链接需要先解析
    const resp = await fetch(url, { redirect: 'manual' });
    const location = resp.headers.get('location') || '';
    const bv2 = location.match(/BV[a-zA-Z0-9]+/);
    if (bv2) videoId = bv2[0];
  }
  
  if (!videoId) throw new Error('无法识别B站视频ID');
  
  // 使用 Bilibili 官方 API
  const apiUrl = `https://api.bilibili.com/x/web-interface/view?aid=${videoId.replace('av', '')}`;
  const apiResp = await fetch(apiUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  
  if (!apiResp.ok) throw new Error('B站API请求失败');
  
  const data = await apiResp.json();
  if (data.code !== 0) {
    // 尝试使用 BV 号
    const bvApiUrl = `https://api.bilibili.com/x/web-interface/view?bvid=${videoId}`;
    const bvResp = await fetch(bvApiUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const bvData = await bvResp.json();
    if (bvData.code !== 0) throw new Error('B站视频信息获取失败');
    data.data = bvData.data;
  }
  
  const video = data.data;
  const videoUrl = video?.videos?.[0]?.video_url || 
                   video?.dash?.video?.[0]?.base_url || '';
  
  return {
    platform: 'bilibili',
    title: video?.title || '',
    author: video?.owner?.name || '',
    thumbnail: video?.pic || '',
    videoUrl: videoUrl || '',
    viewCount: video?.stat?.view || 0,
    duration: video?.duration || 0
  };
}

// 小红书 - 解析页面
async function parseXiaohongshu(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'zh-CN,zh;q=0.9'
    }
  });
  
  if (!response.ok) throw new Error('小红书页面请求失败');
  
  const html = await response.text();
  
  let videoUrl = '';
  let thumbnail = '';
  let title = '';
  let author = '';
  
  // 提取视频 URL
  const videoMatch = html.match(/<video[^>]*src="([^"]+)"[^>]*>/);
  if (videoMatch) videoUrl = videoMatch[1];
  
  const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"[^>]*>/);
  if (ogImageMatch) thumbnail = ogImageMatch[1];
  
  const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"[^>]*>/);
  if (ogTitleMatch) title = ogTitleMatch[1];
  
  return {
    platform: 'xiaohongshu',
    title: title || '小红书笔记',
    author: author || '',
    thumbnail: thumbnail || '',
    videoUrl: videoUrl || '',
    note: videoUrl ? '' : '小红书视频暂不支持直接下载，请使用官方应用'
  };
}

// 快手 - 解析页面
async function parseKuaishou(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml',
      'Accept-Language': 'zh-CN,zh;q=0.9'
    }
  });
  
  if (!response.ok) throw new Error('快手页面请求失败');
  
  const html = await response.text();
  
  let videoUrl = '';
  let thumbnail = '';
  let title = '';
  let author = '';
  
  const videoMatch = html.match(/<video[^>]*src="([^"]+)"[^>]*>/);
  if (videoMatch) videoUrl = videoMatch[1];
  
  const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"[^>]*>/);
  if (ogImageMatch) thumbnail = ogImageMatch[1];
  
  return {
    platform: 'kuaishou',
    title: title || '快手视频',
    author: author || '',
    thumbnail: thumbnail || '',
    videoUrl: videoUrl || '',
    note: videoUrl ? '' : '快手视频暂不支持直接下载，请使用官方应用'
  };
}