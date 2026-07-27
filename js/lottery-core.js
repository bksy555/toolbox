// ============================================================
// 彩票缩水工具 - 核心定义与引擎
// ============================================================

// ---- 彩票类型定义 ----
const LOTTERY_TYPES = {
  ssq: {
    name: '双色球',
    icon: '🟥',
    desc: '6个红球(1-33) + 1个蓝球(1-16)',
    redRange: 33, redCount: 6,
    blueRange: 16, blueCount: 1,
    redName: '红球', blueName: '蓝球',
    tools: ['filter', 'random', 'ac', 'dantuo', 'compound', 'red-omit', 'blue-omit', 'history', 'today']
  },
  dlt: {
    name: '大乐透',
    icon: '🟡',
    desc: '5个前区(1-35) + 2个后区(1-12)',
    redRange: 35, redCount: 5,
    blueRange: 12, blueCount: 2,
    redName: '前区', blueName: '后区',
    tools: ['filter', 'random', 'dantuo', 'compound', 'history', 'today']
  },
  qlc: {
    name: '七乐彩',
    icon: '🟢',
    desc: '7个号码(1-30)',
    redRange: 30, redCount: 7, blueRange: 0, blueCount: 0,
    redName: '基本号', blueName: '',
    tools: ['filter', 'random', 'dantuo', 'compound', 'money-calc', 'history']
  },
  qxc: {
    name: '七星彩',
    icon: '🔵',
    desc: '7位数字，每位0-9',
    isDigit: true, digitCount: 7, digitRange: 10,
    tools: ['filter', 'random', 'compound']
  },
  d3: {
    name: '福彩3D',
    icon: '🔢',
    desc: '3位数字，每位0-9（直选/组三/组六/豹子）',
    isDigit: true, digitCount: 3, digitRange: 10,
    tools: ['filter', 'random', 'zhui-hao', 'omits', 'sum-omit', 'num-omit', 'oe-omit', 'size-omit', 'prime-omit', 'span-omit', 'd012-omit', 'tail-omit', 'daxiao-array', 'jiou-array', 'hz-array']
  },
  p3: {
    name: '排列三',
    icon: '🔢',
    desc: '3位数字，每位0-9（直选/组三/组六/豹子）',
    isDigit: true, digitCount: 3, digitRange: 10,
    tools: ['filter', 'random', 'zhui-hao', 'omits', 'sum-omit', 'num-omit', 'oe-omit', 'size-omit', 'prime-omit', 'span-omit', 'd012-omit', 'tail-omit', 'daxiao-array', 'jiou-array', 'hz-array']
  },
  p5: {
    name: '排列五',
    icon: '🔢',
    desc: '5位数字，每位0-9',
    isDigit: true, digitCount: 5, digitRange: 10,
    tools: ['filter', 'random']
  },
  x15: {
    name: '15选5',
    icon: '🎯',
    desc: '5个号码(1-15)',
    redRange: 15, redCount: 5, blueRange: 0, blueCount: 0,
    tools: ['filter', 'random']
  },
  x11: {
    name: '11选5',
    icon: '🎯',
    desc: '5个号码(1-11)',
    redRange: 11, redCount: 5, blueRange: 0, blueCount: 0,
    tools: ['filter', 'random']
  },
  x22: {
    name: '22选5',
    icon: '🎯',
    desc: '5个号码(1-22)',
    redRange: 22, redCount: 5, blueRange: 0, blueCount: 0,
    redName: '号码', blueName: '',
    tools: ['filter', 'random', 'dantuo', 'compound', 'money-calc']
  }
};

// ---- 工具名称映射 ----
const TOOL_NAMES = {
  filter: '在线过滤/缩水',
  random: '在线机选',
  ac: 'AC值计算器',
  dantuo: '胆拖计算器',
  compound: '复式计算器',
  'red-omit': '红球遗漏',
  'blue-omit': '蓝球遗漏',
  history: '历史对比',
  omits: '号码遗漏',
  'zhui-hao': '追号计算器',
  'sum-omit': '和值遗漏',
  'num-omit': '数字遗漏',
  'oe-omit': '单双遗漏',
  'size-omit': '大小遗漏',
  'prime-omit': '质合遗漏',
  'span-omit': '跨度遗漏',
  'd012-omit': '012路遗漏',
  'tail-omit': '和尾遗漏',
  'daxiao-array': '大小排列',
  'jiou-array': '奇偶排列',
  'hz-array': '和值排列',
  'money-calc': '金额计算器',
  'today': '历史上的今天'
};

const TOOL_ICONS = {
  filter: '🔍',
  random: '🎲',
  ac: '📐',
  dantuo: '🎯',
  compound: '🧮',
  'red-omit': '📊',
  'blue-omit': '📊',
  history: '📅',
  omits: '📊',
  'zhui-hao': '🏃',
  'sum-omit': '📊',
  'num-omit': '📊',
  'oe-omit': '📊',
  'size-omit': '📊',
  'prime-omit': '📊',
  'span-omit': '📊',
  'd012-omit': '📊',
  'tail-omit': '📊',
  'daxiao-array': '🔢',
  'jiou-array': '🔢',
  'hz-array': '🔢',
  'money-calc': '💰',
  'today': '📅'
};

// ---- 当前状态 ----
let currentLottery = 'ssq';
let currentTool = 'filter';

// ---- 工具函数 ----
function ltToast(msg) {
  const t = document.getElementById('lotteryToast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function arrSum(arr) { return arr.reduce((s, v) => s + v, 0); }
function combination(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let r = 1;
  for (let i = 1; i <= k; i++) r = r * (n - i + 1) / i;
  return Math.round(r);
}

// 判断质数
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

// 计算AC值
function calcAC(nums) {
  if (nums.length < 2) return 0;
  const diffs = new Set();
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      diffs.add(Math.abs(nums[i] - nums[j]));
    }
  }
  return diffs.size - (nums.length - 1);
}

// 生成所有组合
function* combinations(arr, k) {
  if (k === 0) { yield []; return; }
  if (arr.length < k) return;
  for (let i = 0; i <= arr.length - k; i++) {
    for (const rest of combinations(arr.slice(i + 1), k - 1)) {
      yield [arr[i], ...rest];
    }
  }
}

// 判断连号组数
function countConsecutiveGroups(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  let groups = 0;
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j++;
    if (j > i) groups++;
    i = j + 1;
  }
  return groups;
}

// 获取尾数不同数量
function countTailDiff(nums) {
  const tails = new Set(nums.map(n => n % 10));
  return tails.size;
}

// 计算奇偶比
function oddEvenRatio(nums) {
  const odd = nums.filter(n => n % 2 === 1).length;
  return `${odd}:${nums.length - odd}`;
}

// 计算大小比
function bigSmallRatio(nums, bigThreshold) {
  const big = nums.filter(n => n >= bigThreshold).length;
  return `${big}:${nums.length - big}`;
}

// 计算质合比
function primeCompositeRatio(nums) {
  const prime = nums.filter(n => isPrime(n)).length;
  return `${prime}:${nums.length - prime}`;
}

// 3D 相关
function calc3DSum(nums) { return arrSum(nums); }
function calc3DSpan(nums) { return Math.max(...nums) - Math.min(...nums); }
function calc3DTail(nums) { return arrSum(nums) % 10; }
function calc3D012(nums) { return nums.map(n => n % 3).join(''); }
function is3DShunzi(nums) {
  const s = [...nums].sort((a, b) => a - b);
  return s[2] - s[0] === 2 && new Set(s).size === 3;
}
function is3DBanshunzi(nums) {
  const s = [...nums].sort((a, b) => a - b);
  return (s[1] - s[0] === 1 || s[2] - s[1] === 1) && !is3DShunzi(nums);
}
function is3DBaozi(nums) { return new Set(nums).size === 1; }
function is3DZusan(nums) { return new Set(nums).size === 2; }
function is3DZuliu(nums) { return new Set(nums).size === 3; }

// 3D 大小分类
function get3DDaxiao(nums) {
  return nums.map(n => n >= 5 ? '大' : '小').join('');
}
// 3D 奇偶分类
function get3DJiou(nums) {
  return nums.map(n => n % 2 === 1 ? '奇' : '偶').join('');
}
// 3D 质合分类
function get3DZhihe(nums) {
  return nums.map(n => isPrime(n) ? '质' : '合').join('');
}
// 3D 大中小
function get3DDZX(nums) {
  return nums.map(n => n >= 7 ? '大' : n >= 4 ? '中' : '小').join('');
}

// 生成3D直选所有组合
function generate3DAll() {
  const all = [];
  for (let i = 0; i < 10; i++)
    for (let j = 0; j < 10; j++)
      for (let k = 0; k < 10; k++)
        all.push([i, j, k]);
  return all;
}

// 2码和
function calcTwoCodeSum(nums) {
  const sums = new Set();
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      sums.add(nums[i] + nums[j]);
  return [...sums].sort((a, b) => a - b);
}

// 2码差
function calcTwoCodeDiff(nums) {
  const diffs = new Set();
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      diffs.add(Math.abs(nums[i] - nums[j]));
  return [...diffs].sort((a, b) => a - b);
}

// 2码组合
function calcTwoCode(nums) {
  const codes = [];
  for (let i = 0; i < nums.length; i++)
    for (let j = i; j < nums.length; j++)
      codes.push(nums[i] * 10 + nums[j]);
  return codes;
}

// ---- 号码渲染 ----
function renderNumGrid(containerId, range, selected, onClick, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const { cols, extraClass, ballClass } = options;
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.gap = '6px';
  container.innerHTML = '';
  for (let i = 1; i <= range; i++) {
    const btn = document.createElement('button');
    btn.className = `num-btn ${ballClass || ''} ${selected.includes(i) ? 'selected' : ''}`;
    btn.textContent = i < 10 ? '0' + i : '' + i;
    btn.onclick = () => onClick(i);
    container.appendChild(btn);
  }
}

// ---- 渲染彩票选择器（首页） ----
function renderLotteryPicker() {
  const html = `<div class="page-title">🎰 彩票缩水工具集</div>
    <p class="page-desc">选择彩票类型，使用在线过滤、缩水、选号、机选、计算器等工具，全部自研，无需跳转</p>
    <div class="lottery-picker">` +
    Object.entries(LOTTERY_TYPES).map(([id, lt]) => `
      <div class="lottery-picker-item" onclick="switchLottery('${id}')">
        <div class="lp-icon">${lt.icon}</div>
        <div class="lp-name">${lt.name}</div>
        <div class="lp-desc">${lt.desc}</div>
        <div class="lp-tools">${lt.tools.map(t => TOOL_NAMES[t]).join(' · ')}</div>
      </div>
    `).join('') + `</div>`;
  document.getElementById('lotteryContent').innerHTML = html;
}

// ---- 切换彩票 ----
function switchLottery(id) {
  currentLottery = id;
  currentTool = 'filter';
  // 更新侧边栏高亮
  document.querySelectorAll('.lottery-nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll(`.lottery-nav-item[onclick*="${id}"]`).forEach(el => el.classList.add('active'));
  renderLotteryToolPage();
}

// ---- 渲染彩票工具页 ----
function renderLotteryToolPage() {
  const lt = LOTTERY_TYPES[currentLottery];
  if (!lt) { renderLotteryPicker(); return; }

  const html = `
    <div class="lottery-header">
      <h1>${lt.icon} ${lt.name} 工具</h1>
      <p>${lt.desc}</p>
    </div>
    <div class="tool-tabs">
      ${lt.tools.map(t => `
        <div class="tool-tab ${t === currentTool ? 'active' : ''}" onclick="switchTool('${t}')">
          ${TOOL_ICONS[t]} ${TOOL_NAMES[t]}
        </div>
      `).join('')}
    </div>
    <div id="lotteryToolContent">
      ${renderToolContent(currentTool)}
    </div>
  `;

  document.getElementById('lotteryContent').innerHTML = html;
  // 触发工具初始化
  setTimeout(() => initTool(currentTool), 50);
}

// ---- 切换工具 ----
function switchTool(toolId) {
  currentTool = toolId;
  document.querySelectorAll('.tool-tab').forEach(el => el.classList.remove('active'));
  const tabs = document.querySelectorAll('.tool-tab');
  const lt = LOTTERY_TYPES[currentLottery];
  const idx = lt.tools.indexOf(toolId);
  if (idx >= 0 && tabs[idx]) tabs[idx].classList.add('active');
  document.getElementById('lotteryToolContent').innerHTML = renderToolContent(toolId);
  setTimeout(() => initTool(toolId), 50);
}

// ---- 渲染工具内容 ----
function renderToolContent(toolId) {
  switch (toolId) {
    case 'filter': return renderFilterTool();
    case 'random': return renderRandomTool();
    case 'ac': return renderACTool();
    case 'dantuo': return renderDantuoTool();
    case 'compound': return renderCompoundTool();
    case 'red-omit': return renderRedOmitTool();
    case 'blue-omit': return renderBlueOmitTool();
    case 'history': return renderHistoryTool();
    case 'omits': return render3DOmitsTool();
    case 'zhui-hao': return renderZhuiHaoTool();
    case 'sum-omit': return renderSumOmitTool();
    case 'num-omit': return renderNumOmitTool();
    case 'oe-omit': return renderOeOmitTool();
    case 'size-omit': return renderSizeOmitTool();
    case 'prime-omit': return renderPrimeOmitTool();
    case 'span-omit': return renderSpanOmitTool();
    case 'd012-omit': return renderD012OmitTool();
    case 'tail-omit': return renderTailOmitTool();
    case 'daxiao-array': return renderDaxiaoArrayTool();
    case 'jiou-array': return renderJiouArrayTool();
    case 'hz-array': return renderHzArrayTool();
    case 'money-calc': return renderMoneyCalcTool();
    case 'today': return renderTodayTool();
    default: return '<p>工具加载中...</p>';
  }
}

// ---- 工具初始化 ----
function initTool(toolId) {
  switch (toolId) {
    case 'filter': initFilterTool(); break;
    case 'random': initRandomTool(); break;
    case 'ac': initACTool(); break;
    case 'dantuo': initDantuoTool(); break;
    case 'compound': initCompoundTool(); break;
    case 'red-omit': initRedOmitTool(); break;
    case 'blue-omit': initBlueOmitTool(); break;
    case 'history': initHistoryTool(); break;
    case 'omits': init3DOmitsTool(); break;
    case 'zhui-hao': initZhuiHaoTool(); break;
    case 'sum-omit': initSumOmitTool(); break;
    case 'num-omit': initNumOmitTool(); break;
    case 'oe-omit': initOeOmitTool(); break;
    case 'size-omit': initSizeOmitTool(); break;
    case 'prime-omit': initPrimeOmitTool(); break;
    case 'span-omit': initSpanOmitTool(); break;
    case 'd012-omit': initD012OmitTool(); break;
    case 'tail-omit': initTailOmitTool(); break;
    case 'daxiao-array': initDaxiaoArrayTool(); break;
    case 'jiou-array': initJiouArrayTool(); break;
    case 'hz-array': initHzArrayTool(); break;
    case 'money-calc': initMoneyCalcTool(); break;
    case 'today': initTodayTool(); break;
  }
}

// ============================================================
// 后续工具函数在 lottery-tools.js 中定义
// ============================================================

// ---- 初始化 ----
document.addEventListener('DOMContentLoaded', () => {
  renderLotteryPicker();
});