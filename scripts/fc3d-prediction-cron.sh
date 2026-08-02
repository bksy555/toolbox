#!/bin/bash
# ============================================================
# 福彩3D预测 - 3胆中1 数据更新脚本
# ============================================================
# 每天19:25（北京时间）更新次日预测
# 每天04:30（北京时间）更新前一日中奖号码
# 说明：开奖时间21:15，但zhcw.com分析文章次日04:01才发布（含"上期开奖结果"）
#       22:00时文章未发布，静态HTML抓不到动态数据，所以改为次日04:30执行
# ============================================================

WORK_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DATA_FILE="$WORK_DIR/data/fc3d-prediction.json"
cd "$WORK_DIR" || exit 1

echo "=== 福彩3D预测 - 3胆中1 数据更新 ==="
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"

# ============================================
# 步骤1：从网络获取最新中奖号码
# ============================================
echo "--- 步骤1: 从 zhcw.com 获取最新中奖号码 ---"

# 从3D分析列表页获取最新分析文章URL
# 这个页面列出了所有分析文章，比首页更容易解析
curl -sL 'https://www.zhcw.com/czfw/sjfx/3d/' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' \
  --max-time 15 -o /tmp/zhcw_analysis.html 2>/dev/null

FETCHED_DRAW=""
FETCHED_PERIOD=""

# 用node解析列表页，提取最新组选分析文章的URL和期号
PARSED=$(node -e "
const fs = require('fs');
const html = fs.readFileSync('/tmp/zhcw_analysis.html', 'utf8');
// 找到所有福彩3D第X期组选分析的文章链接
const regex = /href=\"(\/c\/2026-\d{2}-\d{2}\/\d+\.shtml)\"[\s\S]*?福彩3D第(\d+)期组选分析/g;
let match;
let results = [];
while ((match = regex.exec(html)) !== null) {
  results.push({ url: match[1], issue: parseInt(match[2]) });
}
// 按期号排序，取最新的
results.sort((a, b) => b.issue - a.issue);
if (results.length > 0) {
  console.log(results[0].url + '|' + results[0].issue);
} else {
  console.log('');
}
")

if [ -n "$PARSED" ]; then
  ARTICLE_URL=$(echo "$PARSED" | cut -d'|' -f1)
  LATEST_ISSUE=$(echo "$PARSED" | cut -d'|' -f2)
  echo "最新分析文章: 福彩3D第${LATEST_ISSUE}期组选分析"
  echo "文章URL: https://www.zhcw.com${ARTICLE_URL}"
  
  # 获取文章内容
  ARTICLE_HTML=$(curl -sL "https://www.zhcw.com${ARTICLE_URL}" \
    -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' \
    --max-time 15 2>/dev/null)
  
  # 提取上期开奖结果
  DRAW_RESULT=$(echo "$ARTICLE_HTML" | grep -oP '福彩3D上期开奖结果\d \d \d' | head -1)
  
  if [ -n "$DRAW_RESULT" ]; then
    PREV_ISSUE=$((LATEST_ISSUE - 1))
    FETCHED_DRAW=$(echo "$DRAW_RESULT" | grep -oP '\d \d \d' | tr -d ' ')
    FETCHED_PERIOD="$PREV_ISSUE"
    echo "✅ 获取到中奖号码: 第${FETCHED_PERIOD}期 = ${FETCHED_DRAW}"
  else
    echo "⚠️ 文章内容中未找到开奖结果"
  fi
else
  echo "⚠️ 未找到福彩3D分析文章"
fi

# ============================================
# 步骤2：生成预测数据（Node.js脚本）
# ============================================
echo "--- 步骤2: 生成预测数据 ---"

node -e "
const fs = require('fs');
const DATA_FILE = '$DATA_FILE';

// 网络获取的最新中奖号码
const FETCHED_PERIOD = '$FETCHED_PERIOD';
const FETCHED_DRAW = '$FETCHED_DRAW';

// 天干→3胆映射
const GAN_TO_DAN = {
  '甲': [1, 4, 8], '乙': [3, 4, 8], '丙': [3, 4, 9],
  '丁': [2, 4, 9], '戊': [3, 4, 9], '己': [2, 4, 9],
  '庚': [2, 7, 9], '辛': [2, 6, 7], '壬': [1, 6, 7], '癸': [1, 6, 8]
};

const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 计算日柱
function getDayPillar(year, month, day) {
  const ref = new Date(1900, 0, 1);
  const target = new Date(year, month - 1, day);
  const diff = Math.round((target - ref) / (24 * 60 * 60 * 1000));
  const cycleOffset = 11;
  const cycleNum = ((diff + cycleOffset) % 60 + 60) % 60;
  return { ganIdx: cycleNum % 10, zhiIdx: cycleNum % 12 };
}

// 计算时柱
function getHourPillar(dayGanIdx, hourZhiIdx) {
  const ganIdx = ((dayGanIdx % 5) * 2 + hourZhiIdx) % 10;
  return { ganIdx, zhiIdx: hourZhiIdx };
}

// 获取北京日期
function getBeijingDate() {
  const now = new Date();
  const beijing = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return {
    year: beijing.getUTCFullYear(),
    month: beijing.getUTCMonth() + 1,
    day: beijing.getUTCDate(),
    hour: beijing.getUTCHours(),
    weekday: beijing.getUTCDay()
  };
}

// 获取期号
function getPeriodNum(year, month, day) {
  const start = new Date(year, 0, 0);
  const target = new Date(year, month - 1, day);
  const dayOfYear = Math.round((target - start) / (24 * 60 * 60 * 1000));
  return year + String(dayOfYear).padStart(3, '0');
}

// 获取亥时天干
function getHaiHourGan(year, month, day) {
  const dayPillar = getDayPillar(year, month, day);
  const hourPillar = getHourPillar(dayPillar.ganIdx, 11);
  return TIAN_GAN[hourPillar.ganIdx];
}

// 判断中奖结果
function calcResult(dans, drawNum) {
  if (!drawNum || drawNum.length !== 3) return null;
  const drawArr = drawNum.split('').map(Number);
  const matchCount = dans.filter(d => drawArr.includes(d)).length;
  return matchCount >= 1 ? '✅' : '❌';
}

// 主逻辑
const bj = getBeijingDate();
const today = new Date(bj.year, bj.month - 1, bj.day);

// 生成15期预测（从今天往前14天 + 明天 = 共15期）
const predictions = [];
const start = new Date(today);
start.setDate(start.getDate() - 14);

for (let i = 0; i < 16; i++) {
  const cursor = new Date(start);
  cursor.setDate(start.getDate() + i);
  const y = cursor.getFullYear();
  const m = cursor.getMonth() + 1;
  const d = cursor.getDate();
  const w = cursor.getDay();

  const gan = getHaiHourGan(y, m, d);
  const dans = GAN_TO_DAN[gan] || [];
  const period = getPeriodNum(y, m, d);
  
  predictions.push({
    period: period,
    year: y,
    month: m,
    day: d,
    weekday: w,
    haiGan: gan,
    dans: dans,
    isPast: (y < bj.year || (y === bj.year && m < bj.month) || (y === bj.year && m === bj.month && d < bj.day)),
    isToday: (y === bj.year && m === bj.month && d === bj.day)
  });
}

// 只保留15期
while (predictions.length > 15) {
  predictions.shift();
}

// 读取已有数据
let stored = {};
try {
  if (fs.existsSync(DATA_FILE)) {
    stored = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    console.log('读取已有数据: ' + Object.keys(stored).length + ' 期记录');
  }
} catch(e) {
  console.warn('读取已有数据失败，将新建');
}

// 如果有从网络获取的最新中奖号码，更新到stored
if (FETCHED_PERIOD && FETCHED_DRAW) {
  const key = FETCHED_PERIOD;
  if (!stored[key]) {
    stored[key] = { period: key };
  }
  stored[key].drawNum = FETCHED_DRAW;
  stored[key].updatedAt = new Date().toISOString();
  console.log('📥 从网络更新中奖号码: 第' + key + '期 = ' + FETCHED_DRAW);
}

// 合并新预测
for (const p of predictions) {
  const key = p.period;
  if (!stored[key]) {
    stored[key] = {
      period: p.period,
      year: p.year,
      month: p.month,
      day: p.day,
      weekday: p.weekday,
      haiGan: p.haiGan,
      dans: p.dans,
      drawNum: null,
      result: null,
      updatedAt: null
    };
  } else {
    // 更新预测胆码（如果天干变了）
    stored[key].haiGan = p.haiGan;
    stored[key].dans = p.dans;
    // 补充缺失的日期信息
    if (!stored[key].year) Object.assign(stored[key], { year: p.year, month: p.month, day: p.day, weekday: p.weekday });
  }
  // 如果有中奖号码，更新结果
  if (stored[key].drawNum) {
    stored[key].result = calcResult(stored[key].dans, stored[key].drawNum);
  }
}

// 保存
fs.writeFileSync(DATA_FILE, JSON.stringify(stored, null, 2), 'utf8');
console.log('✅ 预测数据已保存: ' + Object.keys(stored).length + ' 期记录');

// 显示最近有中奖号码的记录
const entries = Object.entries(stored)
  .filter(([k, v]) => v.drawNum)
  .sort(([a], [b]) => b.localeCompare(a))
  .slice(0, 5);
console.log('最近中奖号码:');
for (const [k, v] of entries) {
  console.log('  第' + k + '期: ' + v.drawNum + ' ' + (v.result || ''));
}
"

# 推送到GitHub
echo "--- 步骤3: 推送到 GitHub ---"
git add -A
git commit -m "🤖 福彩3D预测自动更新 $(date '+%Y-%m-%d %H:%M')" 2>/dev/null || echo "  无新变更"
git push 2>/dev/null && echo "  ✅ 已推送到 GitHub" || echo "  ⚠️ 推送失败（可能无变更）"

echo "=== 完成 ==="