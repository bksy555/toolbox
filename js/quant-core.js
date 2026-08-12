// ============================================================
// quant-core.js — 小白量化交易工具核心引擎（纯前端版）
// 选股票 → 选策略 → 调参数 → 看结果
// 数据来源：腾讯财经公开接口（浏览器直连，无需服务器）
// ============================================================

// ──────────────────────────
// 1. 数据请求工具（API 支持 CORS，直接用 fetch）
// ──────────────────────────
async function qFetch(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('行情数据请求失败 (HTTP ' + resp.status + ')');
  const text = await resp.text();
  try {
    return JSON.parse(text);
  } catch(e) {
    // 尝试解析 JSONP 格式：callback({...})
    const match = text.match(/^[^(]*\(([\s\S]*)\)\s*;?\s*$/);
    if (match) return JSON.parse(match[1]);
    throw new Error('行情数据格式异常');
  }
}

// 规范股票代码为带市场前缀
function normalizeSymbol(symbol) {
  symbol = String(symbol).trim();
  if (/^(sh|sz|bj)/i.test(symbol)) return symbol.toLowerCase();
  if (/^(60|68|90)/.test(symbol)) return 'sh' + symbol;
  if (/^(00|30|20)/.test(symbol)) return 'sz' + symbol;
  if (/^(4|8|920)/.test(symbol)) return 'bj' + symbol;
  return 'sh' + symbol;
}

// ──────────────────────────
// 2. 数据获取
// ──────────────────────────
// 腾讯日K线接口（前复权）
async function fetchKline(symbol, count, endDate) {
  const code = normalizeSymbol(symbol);
  const end = endDate || '';
  // param: code,type,start,end,count,extend  extend=qfq 前复权
  // Tencent qfqday 格式: [date, open, close, high, low, volume]
  const url = `https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=${code},day,,,${count},qfq`;
  const data = await qFetch(url);
  const d = data && data.data;
  if (!d) throw new Error('未获取到行情数据');
  const stock = d[code] || d[symbol] || searchStock(d);
  if (!stock) throw new Error('未获取到行情数据，请检查股票代码');
  const lines = stock.qfqday || stock.day;
  if (!lines || !lines.length) throw new Error('未获取到K线数据');
  return lines.map(function(arr) {
    return {
      date: arr[0],
      open: Number(arr[1]),
      close: Number(arr[2]),
      high: Number(arr[3]),
      low: Number(arr[4]),
      volume: Number(arr[5]) || 0,
      amount: Number(arr[6]) || 0
    };
  });
}
function searchStock(d) {
  if (d && typeof d === 'object') {
    const keys = Object.keys(d);
    for (const k of keys) {
      if (d[k] && (d[k].qfqday || d[k].day)) return d[k];
    }
  }
  return null;
}

// 获取股票名称（腾讯实时行情接口）
async function fetchStockName(symbol) {
  const code = normalizeSymbol(symbol);
  try {
    const data = await qJsonp(`https://qt.gtimg.cn/q=${code}`, '_');
    // qt.gtimg.cn 返回 "v_sh600519=\"1~贵州茅台~...\"" 风格，走 JSONP 拿不到，改用真实查询
    return code;
  } catch (e) {
    return code;
  }
}

// ──────────────────────────
// 3. 技术指标计算（JS 实现 pandas 逻辑）
// ──────────────────────────
function sma(values, window) {
  const out = new Array(values.length).fill(null);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= window) sum -= values[i - window];
    if (i >= window - 1) out[i] = sum / window;
  }
  return out;
}
function ema(values, span) {
  const out = new Array(values.length).fill(null);
  const k = 2 / (span + 1);
  let prev = values[0];
  out[0] = prev;
  for (let i = 1; i < values.length; i++) {
    prev = values[i] * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}
function rollingStd(values, window) {
  const out = new Array(values.length).fill(null);
  let sum = 0, sumSq = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    sumSq += values[i] * values[i];
    if (i >= window) {
      sum -= values[i - window];
      sumSq -= values[i - window] * values[i - window];
    }
    if (i >= window - 1) {
      const n = window;
      const mean = sum / n;
      const variance = Math.max(0, sumSq / n - mean * mean);
      out[i] = Math.sqrt(variance);
    }
  }
  return out;
}
function rollingMin(values, window) {
  const out = new Array(values.length).fill(null);
  for (let i = window - 1; i < values.length; i++) {
    out[i] = Math.min.apply(null, values.slice(i - window + 1, i + 1));
  }
  return out;
}
function rollingMax(values, window) {
  const out = new Array(values.length).fill(null);
  for (let i = window - 1; i < values.length; i++) {
    out[i] = Math.max.apply(null, values.slice(i - window + 1, i + 1));
  }
  return out;
}
function rollingMean(values, window) {
  const out = new Array(values.length).fill(null);
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= window) sum -= values[i - window];
    if (i >= window - 1) out[i] = sum / window;
  }
  return out;
}

function addAllIndicators(rows) {
  const closes = rows.map(r => r.close);
  const volumes = rows.map(r => r.volume);
  const highs = rows.map(r => r.high);
  const lows = rows.map(r => r.low);
  // SMA
  const smaMap = {};
  [5, 10, 20, 30, 60, 120].forEach(w => {
    smaMap[w] = sma(closes, w);
  });
  // EMA + MACD
  const ema12 = ema(closes, 12);
  const ema26 = ema(closes, 26);
  const macd = closes.map((_, i) => ema12[i] - ema26[i]);
  const macdSignalTmp = ema(macd.slice(10), 9); // 对齐处理
  const macdSignal = new Array(closes.length).fill(null);
  for (let i = 0; i < macdSignalTmp.length; i++) macdSignal[i + 10] = macdSignalTmp[i];
  const macdHist = macd.map((v, i) => v - (macdSignal[i] || 0));
  // Bollinger
  const bbMiddle = rollingMean(closes, 20);
  const bbStd = rollingStd(closes, 20);
  const bbUpper = closes.map((_, i) => bbMiddle[i] + 2 * (bbStd[i] || 0));
  const bbLower = closes.map((_, i) => bbMiddle[i] - 2 * (bbStd[i] || 0));
  // RSI
  const delta = new Array(closes.length).fill(0);
  for (let i = 1; i < closes.length; i++) delta[i] = closes[i] - closes[i - 1];
  const gain = delta.map(d => d > 0 ? d : 0);
  const loss = delta.map(d => d < 0 ? -d : 0);
  const avgGain = rollingMean(gain, 14);
  const avgLoss = rollingMean(loss, 14);
  const rsi = closes.map((_, i) => {
    if (!avgLoss[i]) return 50;
    const rs = avgLoss[i] === 0 ? Infinity : avgGain[i] / avgLoss[i];
    return 100 - (100 / (1 + rs));
  });
  // KDJ
  const lowMin = rollingMin(lows, 9);
  const highMax = rollingMax(highs, 9);
  const kdjK = new Array(closes.length).fill(null);
  const kdjD = new Array(closes.length).fill(null);
  const kdjJ = new Array(closes.length).fill(null);
  let prevK = 50, prevD = 50;
  for (let i = 0; i < closes.length; i++) {
    const range = highMax[i] - lowMin[i];
    const rsv = !range || highMax[i] === null ? 50 : (closes[i] - lowMin[i]) / range * 100;
    prevK = rsv * (1 / 3) + prevK * (2 / 3);
    prevD = prevK * (1 / 3) + prevD * (2 / 3);
    kdjK[i] = prevK;
    kdjD[i] = prevD;
    kdjJ[i] = 3 * prevK - 2 * prevD;
  }

  rows.forEach((r, i) => {
    r.sma5 = smaMap[5][i];
    r.sma10 = smaMap[10][i];
    r.sma20 = smaMap[20][i];
    r.sma60 = smaMap[60][i];
    r.macd = macd[i];
    r.macdSignal = macdSignal[i];
    r.macdHist = macdHist[i];
    r.bbUpper = bbUpper[i];
    r.bbMiddle = bbMiddle[i];
    r.bbLower = bbLower[i];
    r.rsi = rsi[i];
    r.kdjK = kdjK[i];
    r.kdjD = kdjD[i];
    r.kdjJ = kdjJ[i];
  });
  return rows;
}

// ──────────────────────────
// 4. 策略实现
// ──────────────────────────
function strategyGoldenCross(df, fast, slow) {
  fast = fast || 5; slow = slow || 20;
  const signals = new Array(df.length).fill(0);
  for (let i = 1; i < df.length; i++) {
    if (df[i]['sma' + fast] > df[i]['sma' + slow] && df[i - 1]['sma' + fast] <= df[i - 1]['sma' + slow]) signals[i] = 1;
    if (df[i]['sma' + fast] < df[i]['sma' + slow] && df[i - 1]['sma' + fast] >= df[i - 1]['sma' + slow]) signals[i] = -1;
  }
  return { signals: signals };
}

function strategyMacd(df, fast, slow, signal) {
  fast = fast || 12; slow = slow || 26; signal = signal || 9;
  const signals = new Array(df.length).fill(0);
  for (let i = 1; i < df.length; i++) {
    if (df[i].macd > df[i].macdSignal && df[i - 1].macd <= df[i - 1].macdSignal) signals[i] = 1;
    if (df[i].macd < df[i].macdSignal && df[i - 1].macd >= df[i - 1].macdSignal) signals[i] = -1;
  }
  return { signals: signals };
}

function strategyBollinger(df, window, numStd) {
  window = window || 20; numStd = numStd || 2.0;
  const signals = new Array(df.length).fill(0);
  for (let i = 0; i < df.length; i++) {
    if (df[i].close <= df[i].bbLower) signals[i] = 1;
    if (df[i].close >= df[i].bbUpper) signals[i] = -1;
  }
  return { signals: signals };
}

function strategyRsi(df, window, oversold, overbought) {
  window = window || 14; oversold = oversold || 30; overbought = overbought || 70;
  const signals = new Array(df.length).fill(0);
  for (let i = 1; i < df.length; i++) {
    if (df[i].rsi < oversold && df[i - 1].rsi >= oversold) signals[i] = 1;
    if (df[i].rsi > overbought && df[i - 1].rsi <= overbought) signals[i] = -1;
  }
  return { signals: signals };
}

function strategyKdj(df, kWindow, oversold, overbought) {
  kWindow = kWindow || 9; oversold = oversold || 20; overbought = overbought || 80;
  const signals = new Array(df.length).fill(0);
  for (let i = 1; i < df.length; i++) {
    if (df[i].kdjK > df[i].kdjD && df[i - 1].kdjK <= df[i - 1].kdjD && df[i].kdjK < oversold) signals[i] = 1;
    if (df[i].kdjK < df[i].kdjD && df[i - 1].kdjK >= df[i - 1].kdjD && df[i].kdjK > overbought) signals[i] = -1;
  }
  return { signals: signals };
}

function strategyMaTrend(df, short, mid, long) {
  short = short || 5; mid = mid || 20; long = long || 60;
  const signals = new Array(df.length).fill(0);
  for (let i = 1; i < df.length; i++) {
    const bullish = df[i]['sma' + short] > df[i]['sma' + mid] && df[i]['sma' + mid] > df[i]['sma' + long];
    const wasBull = df[i - 1]['sma' + short] > df[i - 1]['sma' + mid] && df[i - 1]['sma' + mid] > df[i - 1]['sma' + long];
    const bearish = df[i]['sma' + short] < df[i]['sma' + mid] && df[i]['sma' + mid] < df[i]['sma' + long];
    const wasBear = df[i - 1]['sma' + short] < df[i - 1]['sma' + mid] && df[i - 1]['sma' + mid] < df[i - 1]['sma' + long];
    if (bullish && !wasBull) signals[i] = 1;
    if (bearish && !wasBear) signals[i] = -1;
  }
  return { signals: signals };
}

function strategyGoldenCrossVolume(df, fast, slow, volumeRatio) {
  fast = fast || 5; slow = slow || 20; volumeRatio = volumeRatio || 1.5;
  const signals = new Array(df.length).fill(0);
  const volMa20 = rollingMean(df.map(r => r.volume), 20);
  for (let i = 1; i < df.length; i++) {
    const golden = df[i]['sma' + fast] > df[i]['sma' + slow] && df[i - 1]['sma' + fast] <= df[i - 1]['sma' + slow];
    const death = df[i]['sma' + fast] < df[i]['sma' + slow] && df[i - 1]['sma' + fast] >= df[i - 1]['sma' + slow];
    const volConfirmed = volMa20[i] && df[i].volume > volMa20[i] * volumeRatio;
    if (golden && volConfirmed) signals[i] = 1;
    if (death) signals[i] = -1;
  }
  return { signals: signals };
}

// ⭐ 炫艺策略（仓位比例模式 0~1）
function strategyXuanyi(df, params) {
  const p = params || {};
  const firstBuyPct = +('firstBuyPct' in p ? p.firstBuyPct : 0.30);
  const secondBuyPct = +('secondBuyPct' in p ? p.secondBuyPct : 0.30);
  const addBuyPct = +('addBuyPct' in p ? p.addBuyPct : 0.20);
  const stop1Pct = +('stop1Pct' in p ? p.stop1Pct : 0.03) / 100;
  const stop2Pct = +('stop2Pct' in p ? p.stop2Pct : 0.06) / 100;
  const stopSellRatio = +('stopSellRatio' in p ? p.stopSellRatio : 0.50);
  const volPct = +('volPct' in p ? p.volPct : 1.30);
  const volMaRatio = +('volMaRatio' in p ? p.volMaRatio : 1.50);

  const n = df.length;
  const position = new Array(n).fill(0);
  const volMa5 = rollingMean(df.map(r => r.volume), 5);
  const lowMa5 = rollingMean(df.map(r => r.low), 5);

  let curPos = 0, holding = false, entryPrice = 0, lastWasYang = null, railLen = 0;

  for (let i = 0; i < n; i++) {
    const r = df[i];
    const o = r.open, h = r.high, l = r.low, c = r.close;
    const body = Math.abs(c - o);
    const upper = h - Math.max(o, c);
    const lower = Math.min(o, c) - l;
    const isYang = c >= o, isYin = c < o;
    const ma5 = r.sma5, ma10 = r.sma10, ma20 = r.sma20;

    if (ma20 == null || ma20 == null || lowMa5[i] == null) {
      position[i] = curPos; continue;
    }
    const multiBull = ma5 > ma10 && ma10 > ma20;

    // 空仓状态：寻找建仓
    if (!holding) {
      if (multiBull && l <= ma10) {
        curPos = firstBuyPct; holding = true; entryPrice = c; lastWasYang = isYang; railLen = 1;
      }
      position[i] = curPos; continue;
    }

    // 持仓状态
    const deviation = (c - ma20) / ma20;

    // 止损：跌破MA20的 stop2% → 清仓
    if (deviation <= -stop2Pct) {
      curPos = 0; holding = false; lastWasYang = null; railLen = 0;
      position[i] = 0; continue;
    }
    // 止损：跌破MA20的 stop1% → 卖出持仓 stopSellRatio
    if (deviation <= -stop1Pct) {
      curPos = curPos * (1 - stopSellRatio);
      if (curPos < 0.05) { curPos = 0; holding = false; }
      position[i] = curPos; continue;
    }

    // 止盈判断
    let takeProfit = false;
    const longUpper = upper >= body * 2 && upper > lower;
    if (longUpper && i > 0 && df[i - 1].volume > 0 && r.volume / df[i - 1].volume >= volPct) takeProfit = true;
    if (!takeProfit && i >= 5 && volMa5[i] > 0 && r.volume >= volMa5[i] * volMaRatio) takeProfit = true;
    if (!takeProfit && i > 0) {
      const prev = df[i - 1];
      if (isYin && o >= prev.close && c <= prev.open) takeProfit = true;
    }
    // 火车轨道线（阴阳交替）在阳线时卖出
    if (!takeProfit && lastWasYang !== null) {
      if (isYang !== lastWasYang) { railLen++; if (railLen >= 2 && isYang) takeProfit = true; }
      else railLen = 1;
    }
    lastWasYang = isYang;

    if (takeProfit) {
      curPos = 0; holding = false; lastWasYang = null; railLen = 0;
      position[i] = 0; continue;
    }

    // 加仓：价格回到近5根K线支撑线附近
    if (curPos < 1.0) {
      const support = lowMa5[i];
      if (c <= support * 1.005 && c >= support * 0.995) curPos = Math.min(curPos + addBuyPct, 1.0);
    }
    // 加仓：多头排列下回踩MA10/MA20
    if (curPos < 1.0 && multiBull && l <= ma10 && curPos < 0.6) curPos = Math.min(curPos + secondBuyPct, 0.6);
    if (curPos < 1.0 && multiBull && l <= ma20 && curPos <= 0.3) curPos = Math.min(curPos + firstBuyPct, 0.3);

    position[i] = curPos;
  }
  return { signals: position, positionMode: true };
}

// ──────────────────────────
// 5. 策略注册表
// ──────────────────────────
const STRATEGY_REGISTRY = {
  '双均线金叉死叉': {
    func: strategyGoldenCross,
    params: {
      fast: { label: '快线周期', def: 5, min: 2, max: 60, step: 1 },
      slow: { label: '慢线周期', def: 20, min: 5, max: 250, step: 1 }
    },
    desc: '短期均线上穿长期均线时买入，下穿时卖出。最经典的趋势跟踪策略。'
  },
  'MACD金叉死叉': {
    func: strategyMacd,
    params: {
      fast: { label: '快线周期(EMA)', def: 12, min: 5, max: 50, step: 1 },
      slow: { label: '慢线周期(EMA)', def: 26, min: 10, max: 100, step: 1 },
      signal: { label: '信号周期', def: 9, min: 3, max: 30, step: 1 }
    },
    desc: 'MACD线从下方穿越信号线时买入，从上方向下穿越时卖出。捕捉趋势动能变化。'
  },
  '布林带反转': {
    func: strategyBollinger,
    params: {
      window: { label: '布林周期', def: 20, min: 5, max: 60, step: 1 },
      numStd: { label: '标准差倍数', def: 2.0, min: 1.0, max: 4.0, step: 0.1 }
    },
    desc: '价格触及下轨买入（超卖反弹），触及上轨卖出（超买回调）。适合震荡行情。'
  },
  'RSI超买超卖': {
    func: strategyRsi,
    params: {
      window: { label: 'RSI周期', def: 14, min: 5, max: 30, step: 1 },
      oversold: { label: '超卖线', def: 30, min: 10, max: 45, step: 1 },
      overbought: { label: '超买线', def: 70, min: 55, max: 90, step: 1 }
    },
    desc: 'RSI低于超卖线时买入，高于超买线时卖出。经典的反转交易策略。'
  },
  'KDJ低位金叉': {
    func: strategyKdj,
    params: {
      kWindow: { label: 'KDJ周期', def: 9, min: 3, max: 30, step: 1 },
      oversold: { label: '超卖线', def: 20, min: 10, max: 40, step: 1 },
      overbought: { label: '超买线', def: 80, min: 60, max: 90, step: 1 }
    },
    desc: 'KDJ在低位金叉时买入，在高位死叉时卖出。适合波段操作。'
  },
  '均线多头排列': {
    func: strategyMaTrend,
    params: {
      short: { label: '短期均线', def: 5, min: 2, max: 30, step: 1 },
      mid: { label: '中期均线', def: 20, min: 5, max: 120, step: 1 },
      long: { label: '长期均线', def: 60, min: 10, max: 250, step: 1 }
    },
    desc: '短>中>长均线多头排列时买入，空头排列时卖出。捕捉大趋势。'
  },
  '金叉+成交量确认': {
    func: strategyGoldenCrossVolume,
    params: {
      fast: { label: '快线周期', def: 5, min: 2, max: 60, step: 1 },
      slow: { label: '慢线周期', def: 20, min: 5, max: 250, step: 1 },
      volumeRatio: { label: '成交量倍率', def: 1.5, min: 1.0, max: 5.0, step: 0.1 }
    },
    desc: '金叉出现+成交量放大时才买入，减少假突破。比纯金叉更稳健。'
  },
  '⭐ 炫艺策略': {
    func: strategyXuanyi,
    positionMode: true,
    params: {
      firstBuyPct: { label: '首次建仓比例', def: 0.30, min: 0.05, max: 0.50, step: 0.05 },
      secondBuyPct: { label: '二次加仓比例', def: 0.30, min: 0.05, max: 0.50, step: 0.05 },
      addBuyPct: { label: '持续加仓比例', def: 0.20, min: 0.05, max: 0.50, step: 0.05 },
      stop1Pct: { label: '第一止损(%)', def: 3.0, min: 1.0, max: 10.0, step: 0.5 },
      stop2Pct: { label: '第二止损(%)', def: 6.0, min: 2.0, max: 15.0, step: 0.5 },
      stopSellRatio: { label: '止损卖出比例', def: 0.50, min: 0.10, max: 1.00, step: 0.05 },
      volPct: { label: '量比阈值', def: 1.30, min: 1.00, max: 3.00, step: 0.05 },
      volMaRatio: { label: '成交量均线倍率', def: 1.50, min: 1.00, max: 5.00, step: 0.05 }
    },
    desc: '分批建仓+动态止盈止损。多头排列回踩MA10建仓30%，回踩MA20加仓30%；跌破MA20的3%止损一半，跌破6%全清；上涨中在近5K支撑线加仓20%至满仓；止盈：长上影放量/成交量暴增/阴包阳/火车轨道线。'
  }
};

function getStrategyNames() { return Object.keys(STRATEGY_REGISTRY); }

// ──────────────────────────
// 6. 回测引擎
// ──────────────────────────
function runBacktest(df, signals, options) {
  const opts = Object.assign({
    initialCapital: 100000,
    commissionRate: 0.00025,
    slippageRate: 0.0001,
    tPlus1: true,
    positionMode: false
  }, options || {});

  if (opts.positionMode) return runPositionModeBacktest(df, signals, opts);
  return runSignalModeBacktest(df, signals, opts);
}

function runSignalModeBacktest(df, signals, opts) {
  const n = df.length;
  // 信号延迟一天执行
  const execSignals = new Array(n).fill(0);
  for (let i = 1; i < n; i++) execSignals[i] = signals[i - 1] || 0;

  let position = 0, cash = opts.initialCapital, buyPrice = 0, lastBuyDate = null;
  const trades = [];
  const dailyValue = [];

  for (let i = 0; i < n; i++) {
    const r = df[i];
    const date = r.date, o = r.open, c = r.close;
    const signal = execSignals[i];
    dailyValue.push(cash + position * c);

    if (o <= 0 || c <= 0) continue;

    // T+1: 当天买入不能当天卖出
    let execSignal = signal;
    if (opts.tPlus1 && position > 0 && lastBuyDate && date === lastBuyDate && signal === -1) execSignal = 0;

    if (execSignal === 1 && position === 0) {
      const actualPrice = o * (1 + opts.slippageRate);
      const shares = Math.floor((cash - 5) / (actualPrice * 100)) * 100;
      if (shares >= 100) {
        const cost = shares * actualPrice;
        const commission = Math.max(cost * opts.commissionRate, 5);
        const total = cost + commission;
        if (total <= cash) {
          cash -= total;
          position = shares;
          buyPrice = actualPrice;
          lastBuyDate = date;
          trades.push({ date: date, type: '买入', price: +actualPrice.toFixed(2), shares: shares, commission: +commission.toFixed(2), total: +total.toFixed(2) });
        }
      }
    } else if (execSignal === -1 && position > 0) {
      const actualPrice = o * (1 - opts.slippageRate);
      const sellValue = position * actualPrice;
      const commission = Math.max(sellValue * opts.commissionRate, 5);
      const stampTax = sellValue * 0.0005;
      const income = sellValue - commission - stampTax;
      cash += income;
      const profit = sellValue - position * buyPrice;
      const profitPct = (sellValue / (position * buyPrice) - 1) * 100;
      trades.push({ date: date, type: '卖出', price: +actualPrice.toFixed(2), shares: position, commission: +commission.toFixed(2), stampTax: +stampTax.toFixed(2), profit: +profit.toFixed(2), profitPct: +profitPct.toFixed(2), total: +income.toFixed(2) });
      position = 0; buyPrice = 0; lastBuyDate = null;
    }
  }

  // 最后平仓
  if (position > 0) {
    const finalC = df[n - 1].close;
    const sellValue = position * finalC;
    const commission = Math.max(sellValue * opts.commissionRate, 5);
    const stampTax = sellValue * 0.0005;
    cash += sellValue - commission - stampTax;
    trades.push({ date: df[n - 1].date, type: '平仓', price: +finalC.toFixed(2), shares: position, commission: +commission.toFixed(2), stampTax: +stampTax.toFixed(2), profit: +(sellValue - position * buyPrice).toFixed(2), total: +(sellValue - commission - stampTax).toFixed(2) });
    position = 0;
  }

  return buildResult(df, trades, opts.initialCapital);
}

function runPositionModeBacktest(df, positionRatios, opts) {
  // 延迟一天执行
  const n = df.length;
  const targetRatios = new Array(n).fill(0);
  for (let i = 1; i < n; i++) targetRatios[i] = Math.max(0, Math.min(1, positionRatios[i - 1] || 0));

  let position = 0, cash = opts.initialCapital, buyPrice = 0, lastBuyDate = null;
  const trades = [];
  const dailyValue = [];

  for (let i = 0; i < n; i++) {
    const r = df[i];
    const date = r.date, o = r.open, c = r.close;
    const target = targetRatios[i];
    const currentValue = cash + position * c;
    dailyValue.push(currentValue);

    if (o <= 0 || c <= 0) continue;

    const currentRatio = currentValue > 0 ? (position * c) / currentValue : 0;
    const ratioDiff = target - currentRatio;

    if (Math.abs(ratioDiff) > 0.02) {
      if (ratioDiff > 0) {
        // 加仓
        const buyAmount = currentValue * ratioDiff;
        if (buyAmount > 100) {
          const actualPrice = o * (1 + opts.slippageRate);
          const shares = Math.floor((buyAmount - 5) / (actualPrice * 100)) * 100;
          if (shares >= 100) {
            const cost = shares * actualPrice;
            const commission = Math.max(cost * opts.commissionRate, 5);
            const total = cost + commission;
            if (total <= cash) {
              cash -= total;
              if (position + shares > 0) buyPrice = (position * buyPrice + shares * actualPrice) / (position + shares);
              position += shares;
              lastBuyDate = date;
              trades.push({ date: date, type: '买入', price: +actualPrice.toFixed(2), shares: shares, commission: +commission.toFixed(2), total: +total.toFixed(2) });
            }
          }
        }
      } else {
        // 减仓
        const ratioToSell = Math.abs(ratioDiff);
        const currentRatioSell = currentRatio > 0 ? currentRatio : 1e-9;
        const sellRatio = Math.min(ratioToSell / currentRatioSell, 1.0);
        let sharesToSell = Math.floor(position * sellRatio / 100) * 100;
        if (opts.tPlus1 && lastBuyDate && date === lastBuyDate) sharesToSell = 0;
        if (sharesToSell >= 100 && position > 0) {
          const actualPrice = o * (1 - opts.slippageRate);
          const sellValue = sharesToSell * actualPrice;
          const commission = Math.max(sellValue * opts.commissionRate, 5);
          const stampTax = sellValue * 0.0005;
          const income = sellValue - commission - stampTax;
          cash += income;
          const profit = sellValue - sharesToSell * buyPrice;
          const profitPct = (actualPrice / buyPrice - 1) * 100;
          trades.push({ date: date, type: '卖出', price: +actualPrice.toFixed(2), shares: sharesToSell, commission: +commission.toFixed(2), stampTax: +stampTax.toFixed(2), profit: +profit.toFixed(2), profitPct: +profitPct.toFixed(2), total: +income.toFixed(2) });
          position -= sharesToSell;
          if (position === 0) { buyPrice = 0; lastBuyDate = null; }
        }
      }
    }
  }

  // 最后平仓
  if (position > 0) {
    const finalC = df[n - 1].close;
    const sellValue = position * finalC;
    const commission = Math.max(sellValue * opts.commissionRate, 5);
    const stampTax = sellValue * 0.0005;
    cash += sellValue - commission - stampTax;
    trades.push({ date: df[n - 1].date, type: '平仓', price: +finalC.toFixed(2), shares: position, commission: +commission.toFixed(2), stampTax: +stampTax.toFixed(2), profit: +(sellValue - position * buyPrice).toFixed(2), total: +(sellValue - commission - stampTax).toFixed(2) });
    position = 0;
  }

  return buildResult(df, trades, opts.initialCapital);
}

function buildResult(df, trades, initialCapital) {
  // 重建 daily_value
  const n = df.length;
  let position = 0, cash = initialCapital;
  const dailyValue = [], tradeIdx = {};

  // 索引交易
  trades.forEach(function(t) {
    if (!tradeIdx[t.date]) tradeIdx[t.date] = [];
    tradeIdx[t.date].push(t);
  });

  for (let i = 0; i < n; i++) {
    const date = df[i].date;
    const close = df[i].close;
    if (tradeIdx[date]) {
      tradeIdx[date].forEach(function(t) {
        if (t.type === '买入') { cash -= t.total; position += t.shares; }
        else if (t.type === '卖出' || t.type === '平仓') { cash += t.total; position -= t.shares; }
      });
    }
    dailyValue.push(cash + position * close);
  }

  const dfResult = df.map(function(r, i) {
    return { date: r.date, close: r.close, portfolioValue: dailyValue[i] };
  });

  // 计算日收益率
  const dailyReturns = new Array(n).fill(0);
  for (let i = 1; i < n; i++) {
    if (dailyValue[i - 1] > 0) dailyReturns[i] = (dailyValue[i] - dailyValue[i - 1]) / dailyValue[i - 1];
  }
  // 基准日收益率
  const benchmarkReturns = new Array(n).fill(0);
  for (let i = 1; i < n; i++) {
    if (df[i - 1].close > 0) benchmarkReturns[i] = (df[i].close - df[i - 1].close) / df[i - 1].close;
  }

  // 累计收益
  const cumReturn = new Array(n).fill(0);
  const benchmarkCumReturn = new Array(n).fill(0);
  for (let i = 1; i < n; i++) {
    cumReturn[i] = (1 + cumReturn[i - 1]) * (1 + dailyReturns[i]) - 1;
    benchmarkCumReturn[i] = (1 + benchmarkCumReturn[i - 1]) * (1 + benchmarkReturns[i]) - 1;
  }

  // 最大回撤
  const drawdown = new Array(n).fill(0);
  let peak = dailyValue[0];
  for (let i = 0; i < n; i++) {
    if (dailyValue[i] > peak) peak = dailyValue[i];
    drawdown[i] = (dailyValue[i] - peak) / peak * 100;
  }

  const metrics = calcMetrics(dailyValue, dailyReturns, benchmarkReturns, trades, initialCapital, df);

  return {
    dfResult: dfResult,
    dailyValue: dailyValue,
    dailyReturns: dailyReturns,
    cumReturn: cumReturn,
    benchmarkCumReturn: benchmarkCumReturn,
    drawdown: drawdown,
    trades: trades,
    metrics: metrics
  };
}

function calcMetrics(dailyValue, dailyReturns, benchmarkReturns, trades, initialCapital, df) {
  const finalValue = dailyValue[dailyValue.length - 1];
  const totalReturn = (finalValue / initialCapital - 1) * 100;

  const firstDate = df[0] && df[0].date ? new Date(df[0].date) : new Date();
  const lastDate = df[df.length - 1] && df[df.length - 1].date ? new Date(df[df.length - 1].date) : new Date();
  const days = Math.max(1, Math.round((lastDate - firstDate) / 86400000));
  const annualReturn = ((finalValue / initialCapital) ** (365 / days) - 1) * 100;

  const maxDrawdown = Math.min.apply(null, dailyValue.map(function(v, i) {
    const peak = Math.max.apply(null, dailyValue.slice(0, i + 1));
    return (v - peak) / peak * 100;
  }));

  // 夏普比率
  const riskFree = 0.02;
  const validReturns = dailyReturns.filter(function(v) { return v !== 0 || true; });
  const meanRet = validReturns.reduce(function(a, b) { return a + b; }, 0) / validReturns.length;
  const stdRet = Math.sqrt(validReturns.reduce(function(a, b) { return a + (b - meanRet) * (b - meanRet); }, 0) / validReturns.length);
  const sharpe = stdRet > 0 ? Math.sqrt(252) * (meanRet - riskFree / 252) / stdRet : 0;

  // 交易统计
  const sellTrades = trades.filter(function(t) { return t.type === '卖出' || t.type === '平仓'; });
  const totalTrades = sellTrades.length;
  const wins = sellTrades.filter(function(t) { return (t.profit || 0) > 0; }).length;
  const winRate = totalTrades > 0 ? wins / totalTrades * 100 : 0;
  const avgProfit = totalTrades > 0 ? sellTrades.reduce(function(a, t) { return a + (t.profitPct || 0); }, 0) / totalTrades : 0;

  const benchmarkReturn = df.length > 1 ? (df[df.length - 1].close / df[0].close - 1) * 100 : 0;
  const excessReturn = totalReturn - benchmarkReturn;

  const calmar = maxDrawdown !== 0 ? annualReturn / Math.abs(maxDrawdown / 100) : 0;

  return {
    totalReturn: +totalReturn.toFixed(2),
    annualReturn: +annualReturn.toFixed(2),
    maxDrawdown: +maxDrawdown.toFixed(2),
    sharpeRatio: +sharpe.toFixed(2),
    calmarRatio: +calmar.toFixed(2),
    totalTrades: totalTrades,
    winRate: +winRate.toFixed(2),
    avgProfitPerTrade: +avgProfit.toFixed(2),
    benchmarkReturn: +benchmarkReturn.toFixed(2),
    excessReturn: +excessReturn.toFixed(2),
    finalValue: +finalValue.toFixed(2),
    totalDays: days
  };
}

// ══════════════════════════════════════════════════════════
// 7. 实时监测扩展（新增）
// ══════════════════════════════════════════════════════════

// 解析腾讯 qt 实时行情数组（web.ifzq.gtimg.cn 的 qt 字段 / qt.gtimg.cn 的 ~ 分隔串）
function parseRealtimeQuote(arr) {
  if (!arr || !arr.length) return null;
  return {
    market: arr[0],
    name: arr[1],
    code: arr[2],
    price: Number(arr[3]),
    yesterdayClose: Number(arr[4]),
    open: Number(arr[5]),
    volume: Number(arr[6]) || 0,      // 手
    amount: Number(arr[7]) || 0,      // 元
    change: Number(arr[8]),
    changePercent: Number(arr[9]),
    high: Number(arr[10]),
    low: Number(arr[11]),
    buy1Price: Number(arr[12]),
    buy1Vol: Number(arr[13]),
    sell1Price: Number(arr[22]),
    sell1Vol: Number(arr[23]),
    date: arr[30] || '',
    time: arr[31] || ''
  };
}

// 从 fqkline 响应中提取 qt 实时行情
function extractQuoteFromStock(stock, code) {
  if (stock && stock.qt) {
    const q = stock.qt[code] || stock.qt[Object.keys(stock.qt)[0]];
    if (q) return parseRealtimeQuote(q);
  }
  return null;
}

// 获取实时行情（独立轻量请求，用于定时刷新）
async function fetchRealtimeQuote(symbol) {
  const code = normalizeSymbol(symbol);
  const url = `https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=${code},day,,,1,qfq`;
  const data = await qFetch(url);
  const d = data && data.data;
  if (!d) return null;
  const stock = d[code] || (d[symbol]) || searchStock(d);
  return stock ? extractQuoteFromStock(stock, code) : null;
}

// 获取K线 + 实时行情（一次请求同时拿到历史K线和当前实时报价）
async function fetchKlineWithQuote(symbol, count) {
  const code = normalizeSymbol(symbol);
  const url = `https://web.ifzq.gtimg.cn/appstock/app/fqkline/get?param=${code},day,,,${count},qfq`;
  const data = await qFetch(url);
  const d = data && data.data;
  if (!d) throw new Error('未获取到行情数据');
  const stock = d[code] || d[symbol] || searchStock(d);
  if (!stock) throw new Error('未获取到行情数据，请检查股票代码');
  const lines = stock.qfqday || stock.day;
  if (!lines || !lines.length) throw new Error('未获取到K线数据');
  const kline = lines.map(function(arr) {
    return {
      date: arr[0],
      open: Number(arr[1]),
      close: Number(arr[2]),
      high: Number(arr[3]),
      low: Number(arr[4]),
      volume: Number(arr[5]) || 0,
      amount: Number(arr[6]) || 0
    };
  });
  const quote = extractQuoteFromStock(stock, code);
  return { kline: kline, quote: quote };
}

// 判断当前市场趋势状态
function getMarketTrend(df, idx) {
  idx = idx == null ? df.length - 1 : idx;
  const r = df[idx];
  if (!r || r.sma5 == null || r.sma10 == null || r.sma20 == null || r.sma60 == null) return { label: '数据不足', color: '#8888aa' };
  if (r.sma5 > r.sma10 && r.sma10 > r.sma20) return { label: '多头排列 📈', color: '#10b981' };
  if (r.sma5 < r.sma10 && r.sma10 < r.sma20) return { label: '空头排列 📉', color: '#ef4444' };
  if (r.rsi != null && r.rsi > 70) return { label: '超买区间 ⚠️', color: '#f59e0b' };
  if (r.rsi != null && r.rsi < 30) return { label: '超卖区间 💎', color: '#f59e0b' };
  return { label: '震荡整理 ↔️', color: '#8888aa' };
}

// 把策略最新信号映射为操作建议
// signal: 1=买入, -1=卖出/空仓, 0=持有/观望
// prevSignal: 前一日信号（用于判断是否刚触发）
function getAdviceFromSignal(signal, prevSignal) {
  if (signal === 1 && prevSignal !== 1) return '买入';
  if (signal === -1 && prevSignal !== -1) return '卖出';
  if (signal === 1) return '持有';
  if (signal === -1) return '空仓观望';
  return '观望';
}

// 针对仓位模式（炫艺策略）把目标仓位映射为建议
function getAdviceFromPosition(ratio, prevRatio) {
  const r = ratio == null ? 0 : ratio;
  const pr = prevRatio == null ? 0 : prevRatio;
  if (r >= 0.6) return '加仓/持有';
  if (r >= 0.3) return '持有';
  if (r > 0) return '轻仓持有';
  if (pr > 0) return '清仓离场';
  return '空仓观望';
}

// 计算所有选中策略的当前信号（实时监测核心）
// configs: [{ name, params, positionMode }]
// 返回: { strategies: [...], votes: {buy, sell, hold}, advice, trend }
function computeCurrentSignals(df, configs) {
  const n = df.length;
  const strategies = [];
  let buy = 0, sell = 0, hold = 0;

  configs.forEach(function(cfg) {
    const reg = STRATEGY_REGISTRY[cfg.name];
    if (!reg) return;
    let value, prevValue, positionMode = !!cfg.positionMode;

    if (positionMode) {
      // 仓位模式：直接调用策略拿目标仓位序列
      const res = reg.func(df, cfg.params || {});
      value = res.signals[n - 1];
      prevValue = res.signals[n - 2];
    } else {
      // 信号模式：按顺序传参
      const paramKeys = Object.keys(reg.params);
      const args = [df];
      paramKeys.forEach(function(k) { args.push(cfg.params[k] !== undefined ? cfg.params[k] : reg.params[k].def); });
      const res = reg.func.apply(null, args);
      value = res.signals[n - 1];
      prevValue = res.signals[n - 2];
    }

    // 归一化成 -1/0/1 信号
    let signal, prevSignal, advice, strength;
    if (positionMode) {
      const v = value || 0, pv = prevValue || 0;
      signal = v >= 0.6 ? 1 : (v <= 0.05 ? -1 : 0);
      prevSignal = pv >= 0.6 ? 1 : (pv <= 0.05 ? -1 : 0);
      advice = getAdviceFromPosition(v, pv);
      strength = Math.min(1, Math.abs(v - 0.5) * 2);
    } else {
      signal = value || 0;
      prevSignal = prevValue || 0;
      advice = getAdviceFromSignal(signal, prevSignal);
      // 信号强度：结合趋势与指标偏离度
      const r = df[n - 1];
      let s = 0.5;
      if (signal === 1 && r.sma5 != null && r.sma20 != null) s = Math.min(1, 0.5 + Math.abs(r.sma5 - r.sma20) / r.sma20 * 5);
      if (signal === -1 && r.sma5 != null && r.sma20 != null) s = Math.min(1, 0.5 + Math.abs(r.sma5 - r.sma20) / r.sma20 * 5);
      strength = s;
    }

    if (signal === 1) buy++;
    else if (signal === -1) sell++;
    else hold++;

    strategies.push({
      name: cfg.name,
      positionMode: positionMode,
      signal: signal,
      prevSignal: prevSignal,
      advice: advice,
      strength: Math.round(strength * 100),
      value: value
    });
  });

  // 综合建议（投票制，buy 优先）
  let advice;
  if (buy > sell && buy >= hold) advice = { label: '建议买入', desc: buy + ' 个策略看多，' + sell + ' 个看空', cls: 'buy' };
  else if (sell > buy && sell >= hold) advice = { label: '建议卖出/观望', desc: sell + ' 个策略看空，' + buy + ' 个看多', cls: 'sell' };
  else if (buy > 0 && sell === 0) advice = { label: '建议持有', desc: buy + ' 个策略看多，' + hold + ' 个观望', cls: 'hold' };
  else if (sell > 0 && buy === 0) advice = { label: '建议空仓观望', desc: sell + ' 个策略看空，' + hold + ' 个观望', cls: 'wait' };
  else advice = { label: '观望为主', desc: '信号分歧，' + buy + ' 多 / ' + sell + ' 空 / ' + hold + ' 观望', cls: 'wait' };

  return {
    strategies: strategies,
    votes: { buy: buy, sell: sell, hold: hold },
    advice: advice
  };
}