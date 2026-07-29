// ============================================================
// 每日新闻摘要 API - Vercel Serverless Function
// 获取新闻联播 + AI科技日报，返回摘要JSON
// ============================================================

// 允许的跨域来源
const ALLOW_ORIGIN = '*';

// 缓存时间（秒）
const CACHE_TTL = 600; // 10分钟

// 新闻联播数据源
async function fetchNewsLianbo() {
  try {
    // 使用 mrxwlb.com 获取最新新闻联播
    const resp = await fetch('https://mrxwlb.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(10000)
    });
    const html = await resp.text();
    
    // 提取文章标题和链接
    const titles = [];
    const titleRegex = /<h[23][^>]*>.*?<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>.*?<\/h[23]>/gi;
    let match;
    while ((match = titleRegex.exec(html)) !== null) {
      const title = match[2].trim();
      const url = match[1].startsWith('http') ? match[1] : 'https://mrxwlb.com' + match[1];
      if (title.length > 5 && !title.includes('新闻联播') && !title.includes('广告')) {
        titles.push({ title, url });
      }
    }
    
    // 如果上面的正则没匹配到，尝试更宽松的匹配
    if (titles.length === 0) {
      const linkRegex = /<a\s+href="([^"]+)"[^>]*>([^<]{8,})<\/a>/gi;
      while ((match = linkRegex.exec(html)) !== null) {
        const title = match[2].trim();
        const url = match[1].startsWith('http') ? match[1] : 'https://mrxwlb.com' + match[1];
        if (title.length > 6 && !title.includes('新闻联播') && !title.includes('广告') && !title.includes('首页') && !title.includes('关于')) {
          titles.push({ title, url });
        }
      }
    }
    
    // 取前15条
    return {
      source: '新闻联播',
      items: titles.slice(0, 15),
      updateTime: new Date().toISOString()
    };
  } catch (e) {
    console.error('新闻联播获取失败:', e.message);
    // 尝试备用数据源
    try {
      // 备用：使用 govopendata
      const now = new Date();
      const dateStr = now.getFullYear() + 
        String(now.getMonth() + 1).padStart(2, '0') + 
        String(now.getDate()).padStart(2, '0');
      const resp2 = await fetch(`https://cn.govopendata.com/xinwenlianbo/${dateStr}/`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: AbortSignal.timeout(8000)
      });
      const html2 = await resp2.text();
      const items = [];
      const regex = /<li[^>]*>.*?<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>.*?<\/li>/gi;
      while ((match = regex.exec(html2)) !== null) {
        const title = match[2].trim();
        const url = match[1].startsWith('http') ? match[1] : 'https://cn.govopendata.com' + match[1];
        if (title.length > 5) {
          items.push({ title, url });
        }
      }
      return {
        source: '新闻联播(备用)',
        items: items.slice(0, 15),
        updateTime: new Date().toISOString()
      };
    } catch (e2) {
      return {
        source: '新闻联播',
        items: [{ title: '今日新闻联播暂未更新', url: 'https://mrxwlb.com/' }],
        updateTime: new Date().toISOString(),
        error: e2.message
      };
    }
  }
}

// AI科技日报数据源
async function fetchAIHot() {
  try {
    const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
    
    // 先尝试获取日报
    const resp = await fetch('https://aihot.virxact.com/api/public/daily', {
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(8000)
    });
    
    if (resp.ok) {
      const data = await resp.json();
      // 提取摘要
      const sections = data.sections || [];
      const items = [];
      for (const section of sections) {
        const label = section.label || '';
        const entries = section.entries || [];
        for (const entry of entries.slice(0, 5)) {
          items.push({
            title: entry.title || '',
            summary: entry.summary || '',
            url: entry.sourceUrl || entry.url || '',
            category: label
          });
        }
      }
      return {
        source: 'AI科技日报',
        items: items.slice(0, 20),
        updateTime: new Date().toISOString()
      };
    }
    
    // 备用：获取精选条目
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const resp2 = await fetch(`https://aihot.virxact.com/api/public/items?mode=selected&since=${since}&take=20`, {
      headers: { 'User-Agent': UA },
      signal: AbortSignal.timeout(8000)
    });
    if (resp2.ok) {
      const data2 = await resp2.json();
      const items = (data2.items || data2.data || []).map(item => ({
        title: item.title || '',
        summary: item.summary || '',
        url: item.sourceUrl || item.url || '',
        category: item.category || ''
      }));
      return {
        source: 'AI科技日报',
        items: items.slice(0, 20),
        updateTime: new Date().toISOString()
      };
    }
    
    throw new Error('AI HOT API 不可用');
  } catch (e) {
    console.error('AI HOT 获取失败:', e.message);
    return {
      source: 'AI科技日报',
      items: [{ title: 'AI科技日报暂未更新', url: 'https://aihot.virxact.com/' }],
      updateTime: new Date().toISOString(),
      error: e.message
    };
  }
}

// 主处理函数
export default async function handler(req, res) {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', ALLOW_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 缓存控制
  res.setHeader('Cache-Control', `s-maxage=${CACHE_TTL}, stale-while-revalidate`);
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // 并行获取两个数据源
    const [newsLianbo, aiHot] = await Promise.all([
      fetchNewsLianbo(),
      fetchAIHot()
    ]);
    
    const now = new Date();
    const today = now.getFullYear() + '-' + 
      String(now.getMonth() + 1).padStart(2, '0') + '-' + 
      String(now.getDate()).padStart(2, '0');
    
    const result = {
      date: today,
      updateTime: now.toISOString(),
      items: [
        {
          type: 'news',
          icon: '📺',
          label: '新闻联播',
          data: newsLianbo
        },
        {
          type: 'ai',
          icon: '🤖',
          label: 'AI科技日报',
          data: aiHot
        }
      ]
    };
    
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({
      error: '获取新闻摘要失败',
      message: e.message,
      updateTime: new Date().toISOString()
    });
  }
}