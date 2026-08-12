// /api/futures.mjs - 美股期货K线数据代理（通过 Yahoo Finance）
// 符号: ES=F (标普500期货), NQ=F (纳斯达克期货), CL=F (原油), GC=F (黄金)
// SI=F (白银), ZC=F (玉米), ZW=F (小麦), ZS=F (大豆), HG=F (铜)
// 使用: /api/futures?symbol=ES=F

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const symbol = req.query.symbol || 'ES=F';
  const range = req.query.range || '2y';  // 2y = 2 years of daily data
  const interval = req.query.interval || '1d';
  
  try {
    // Yahoo Finance API URL
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;
    
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://finance.yahoo.com/'
      }
    });
    
    if (!resp.ok) {
      // 尝试备用域名
      const url2 = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}`;
      const resp2 = await fetch(url2, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://finance.yahoo.com/'
        }
      });
      if (!resp2.ok) {
        return res.status(502).json({ error: 'yahoo api failed', symbol });
      }
      const data2 = await resp2.json();
      return formatResponse(data2, symbol, res);
    }
    
    const data = await resp.json();
    return formatResponse(data, symbol, res);
  } catch (e) {
    console.error('Futures API error:', e.message);
    res.status(500).json({ error: e.message });
  }
}

function formatResponse(data, symbol, res) {
  const result = data?.chart?.result?.[0];
  if (!result) {
    return res.status(404).json({ error: 'no data', symbol });
  }
  
  const timestamps = result.timestamp || [];
  const quotes = result.indicators?.quote?.[0] || {};
  const adjClose = result.indicators?.adjclose?.[0]?.adjclose || [];
  const opens = quotes.open || [];
  const highs = quotes.high || [];
  const lows = quotes.low || [];
  const closes = quotes.close || [];
  const volumes = quotes.volume || [];
  const meta = result.meta;
  
  // 转换为K线格式 [date, open, close, high, low, volume]
  const klines = [];
  for (let i = 0; i < timestamps.length; i++) {
    if (opens[i] == null || closes[i] == null) continue;
    const date = new Date(timestamps[i] * 1000);
    const dateStr = date.toISOString().split('T')[0];  // YYYY-MM-DD
    klines.push([
      dateStr,
      opens[i].toFixed(2),
      closes[i].toFixed(2),
      highs[i].toFixed(2),
      lows[i].toFixed(2),
      Math.round(volumes[i] || 0).toString()
    ]);
  }
  
  res.json({
    symbol: symbol,
    name: meta?.symbol || symbol,
    currency: meta?.currency || 'USD',
    klines: klines,
    total: klines.length
  });
}