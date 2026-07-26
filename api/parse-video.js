// 视频解析 API - Vercel Serverless Function
// 自研，不依赖任何第三方服务
// 通过抓取页面解析视频下载地址

export default async function handler(req, res) {
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
    let result;
    if (url.includes('tiktok.com')) {
      result = await parseTikTok(url);
    } else if (url.includes('douyin.com') || url.includes('v.douyin')) {
      result = await parseDouyin(url);
    } else if (url.includes('bilibili.com') || url.includes('b23.tv')) {
      result = await parseBilibili(url);
    } else {
      return res.status(400).json({ error: '暂不支持该平台，仅支持 TikTok、抖音、B站' });
    }
    
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: '解析失败: ' + err.message });
  }
}

// TikTok - 解析视频页面获取无水印视频地址
async function parseTikTok(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7'
    }
  });
  
  if (!response.ok) throw new Error('TikTok 页面请求失败 (HTTP ' + response.status + ')');
  
  const html = await response.text();
  
  // 方法1: 从 JSON-LD script 中提取
  let videoUrl = null;
  let thumbnail = '';
  let title = '';
  let author = '';
  
  // 尝试匹配 __UNIVERSAL_DATA_FOR_VIEWER 或 __NEXT_DATA__
  const dataMatch = html.match(/<script[^>]*id="__UNIVERSAL_DATA_FOR_VIEWER"[^>]*>([^<]+)<\/script>/);
  if (dataMatch) {
    try {
      const jsonData = JSON.parse(dataMatch[1]);
      // 从 TikTok 的通用数据中提取视频信息
      const seo = jsonData?.__DEFAULT_SCOPE__?.webapp?.videoDetail?.seo || {};
      const video = jsonData?.__DEFAULT_SCOPE__?.webapp?.videoDetail?.itemInfo?.itemStruct || {};
      
      title = seo?.title || video?.desc || '';
      author = video?.author?.uniqueId || video?.author?.nickname || '';
      thumbnail = video?.video?.cover || video?.video?.originCover || '';
      
      // 获取无水印视频地址
      if (video?.video?.playAddr) {
        videoUrl = video.video.playAddr;
      } else if (video?.video?.downloadAddr) {
        videoUrl = video.video.downloadAddr;
      }
    } catch(e) {
      // 继续尝试其他方法
    }
  }
  
  // 方法2: 从 video 标签中提取
  if (!videoUrl) {
    const videoMatch = html.match(/<video[^>]*src="([^"]+)"[^>]*>/);
    if (videoMatch) {
      videoUrl = videoMatch[1];
    }
  }
  
  // 方法3: 从 og:image 提取封面
  if (!thumbnail) {
    const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"[^>]*>/);
    if (ogImageMatch) thumbnail = ogImageMatch[1];
  }
  
  if (!title) {
    const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"[^>]*>/);
    if (ogTitleMatch) title = ogTitleMatch[1];
  }
  
  return {
    platform: 'tiktok',
    title: title || 'TikTok Video',
    author: author || '',
    thumbnail: thumbnail || '',
    videoUrl: videoUrl || '',
    note: videoUrl ? '' : '无法获取视频下载地址，TikTok 可能已更新页面结构'
  };
}

// 抖音 - 解析视频页面
async function parseDouyin(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
    }
  });
  
  if (!response.ok) throw new Error('抖音页面请求失败 (HTTP ' + response.status + ')');
  
  const html = await response.text();
  
  let videoUrl = null;
  let thumbnail = '';
  let title = '';
  let author = '';
  
  // 方法1: 从 video 标签 src 中提取
  const videoMatch = html.match(/<video[^>]*src="([^"]+)"[^>]*>/);
  if (videoMatch) {
    videoUrl = videoMatch[1];
  }
  
  // 方法2: 从 JSON 数据中提取
  const jsonMatch = html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([^<]+)<\/script>/);
  if (jsonMatch) {
    try {
      const jsonData = JSON.parse(jsonMatch[1]);
      const props = jsonData?.props?.pageProps || {};
      const videoData = props?.videoData || {};
      if (videoData?.playAddr) videoUrl = videoUrl || videoData.playAddr;
      if (videoData?.downloadAddr) videoUrl = videoUrl || videoData.downloadAddr;
      thumbnail = videoData?.cover || '';
      title = videoData?.desc || '';
      author = videoData?.author?.nickname || '';
    } catch(e) {}
  }
  
  // 方法3: 从 og 标签提取
  if (!thumbnail) {
    const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"[^>]*>/);
    if (ogImageMatch) thumbnail = ogImageMatch[1];
  }
  
  const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"[^>]*>/);
  if (ogTitleMatch) title = ogTitleMatch[1];
  
  return {
    platform: 'douyin',
    title: title || '抖音视频',
    author: author || '',
    thumbnail: thumbnail || '',
    videoUrl: videoUrl || '',
    note: videoUrl ? '' : '无法获取抖音视频下载地址，请尝试使用官方抖音应用'
  };
}

// B站 - 使用官方 API
async function parseBilibili(url) {
  let videoId = '';
  const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
  const avMatch = url.match(/av(\d+)/i);
  
  if (bvMatch) {
    videoId = bvMatch[0];
  } else if (avMatch) {
    videoId = 'av' + avMatch[1];
  } else {
    // 短链接
    const resp = await fetch(url, { redirect: 'manual' });
    const location = resp.headers.get('location') || '';
    const bv2 = location.match(/BV[a-zA-Z0-9]+/);
    if (bv2) videoId = bv2[0];
  }
  
  if (!videoId) throw new Error('无法识别B站视频ID');
  
  const apiUrl = `https://api.bilibili.com/x/web-interface/view?bvid=${videoId}`;
  const apiResp = await fetch(apiUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  
  if (!apiResp.ok) throw new Error('B站API请求失败');
  
  const data = await apiResp.json();
  if (data.code !== 0) throw new Error('B站视频信息获取失败: ' + (data.message || ''));
  
  const video = data.data;
  
  return {
    platform: 'bilibili',
    title: video?.title || '',
    author: video?.owner?.name || '',
    thumbnail: video?.pic || '',
    videoUrl: `https://www.bilibili.com/video/${videoId}`,
    viewCount: video?.stat?.view || 0,
    duration: video?.duration || 0,
    note: 'B站视频下载请使用官方客户端'
  };
}