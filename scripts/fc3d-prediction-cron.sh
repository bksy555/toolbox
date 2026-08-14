#!/bin/bash
# ============================================================
# 福彩3D预测 - 3胆中1 + 冷号3胆 数据更新脚本
# ============================================================
# 每天19:25（北京时间）更新次日预测
# 每天22:00（北京时间）更新当日中奖号码
# 数据源（2026-08-14 修复，解决"抓不到当天号码"bug）：
#   主源: 500彩票网 zx.500.com/sd/（curl 直接可访问，无验证码，开奖当天即有）
#   备源: 百度移动版搜索官方福彩卡片（playwright 模拟浏览器，频率过高会触发验证码）
#   兜底: zhcw.com 分析文章（滞后约1天，仅回溯用）
# ============================================================

WORK_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DATA_FILE="$WORK_DIR/data/fc3d-prediction.json"
cd "$WORK_DIR" || exit 1

echo "=== 福彩3D预测 - 3胆中1 + 冷号3胆 数据更新 ==="
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"

# ============================================
# 步骤1：从网络获取最新中奖号码（多源回退）
# ============================================
echo "--- 步骤1: 获取最新中奖号码 ---"

FETCHED_DRAW=""
FETCHED_PERIOD=""

# ---- 数据源1（主源）: 500彩票网 首页（curl，无验证码）----
echo "尝试数据源1: 500彩票网 zx.500.com/sd/ ..."
RESULT_500=$(timeout 30 python3 scripts/fc3d-500-fetch.py 2>/dev/null)
if [ -n "$RESULT_500" ] && [ "$RESULT_500" != "" ]; then
  FETCHED_PERIOD=$(echo "$RESULT_500" | cut -d'|' -f1)
  FETCHED_DRAW=$(echo "$RESULT_500" | cut -d'|' -f2)
  FETCHED_DATE=$(echo "$RESULT_500" | cut -d'|' -f3)
  echo "✅ 从500彩票网获取: 第${FETCHED_PERIOD}期 = ${FETCHED_DRAW} (${FETCHED_DATE})"
fi

# ---- 数据源2（备源）: 百度移动版官方福彩卡片（playwright）----
if [ -z "$FETCHED_DRAW" ]; then
  echo "尝试数据源2: 百度移动版搜索官方福彩卡片 ..."
  # 先查本地最新期号，搜下一期（当天开奖后即出）
  LOCAL_LATEST=$(python3 -c "
import json
with open('$DATA_FILE') as f:
    d = json.load(f)
keys = sorted([k for k in d.keys() if k.startswith('2026') and d[k].get('drawNum') and d[k]['drawNum'] != '' and d[k]['drawNum'] != ' '], reverse=True)
print(keys[0] if keys else '')
" 2>/dev/null)
  if [ -n "$LOCAL_LATEST" ]; then
    NEXT_PERIOD=$((10#$LOCAL_LATEST + 1))
    RESULT_BD=$(timeout 90 python3 scripts/fc3d-baidu-fetch.py "$NEXT_PERIOD" 2>/dev/null)
    if [ -n "$RESULT_BD" ] && [ "$RESULT_BD" != "" ]; then
      FETCHED_PERIOD=$(echo "$RESULT_BD" | cut -d'|' -f1)
      FETCHED_DRAW=$(echo "$RESULT_BD" | cut -d'|' -f2)
      FETCHED_DATE=$(echo "$RESULT_BD" | cut -d'|' -f3)
      echo "✅ 从百度获取: 第${FETCHED_PERIOD}期 = ${FETCHED_DRAW} (${FETCHED_DATE})"
    else
      echo "⚠️ 百度未能获取（可能未开奖或触发验证码）"
    fi
  fi
fi

# ---- 数据源3（兜底，仅回溯）: zhcw.com 分析文章 ----
if [ -z "$FETCHED_DRAW" ]; then
  echo "尝试数据源3: zhcw.com 分析文章（兜底）..."
  # 从3D分析列表页获取最新分析文章URL
  curl -sL 'https://www.zhcw.com/czfw/sjfx/3d/' \
    -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' \
    --max-time 15 -o /tmp/zhcw_analysis.html 2>/dev/null

  # 用node解析列表页，提取最新组选分析文章的URL和期号
  PARSED=$(node -e "
const fs = require('fs');
const html = fs.readFileSync('/tmp/zhcw_analysis.html', 'utf8');
const regex = /href=\"(\/c\/2026-\d{2}-\d{2}\/\d+\.shtml)\"[\s\S]*?福彩3D第(\d+)期组选分析/g;
let match;
let results = [];
while ((match = regex.exec(html)) !== null) {
  results.push({ url: match[1], issue: parseInt(match[2]) });
}
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

    ARTICLE_HTML=$(curl -sL "https://www.zhcw.com${ARTICLE_URL}" \
      -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' \
      --max-time 15 2>/dev/null)

    DRAW_RESULT=$(echo "$ARTICLE_HTML" | grep -oP '福彩3D上期开奖结果\d \d \d' | head -1)

    if [ -n "$DRAW_RESULT" ]; then
      PREV_ISSUE=$((LATEST_ISSUE - 1))
      FETCHED_DRAW=$(echo "$DRAW_RESULT" | grep -oP '\d \d \d' | tr -d ' ')
      FETCHED_PERIOD="$PREV_ISSUE"
      echo "✅ 从zhcw获取: 第${FETCHED_PERIOD}期 = ${FETCHED_DRAW}"
    else
      echo "⚠️ 文章内容中未找到开奖结果"
    fi
  else
    echo "⚠️ 未找到福彩3D分析文章"
  fi
fi

# ============================================
# 步骤2：生成预测数据（Node.js脚本）
# 包括：时干天干3胆 + 冷号3胆
# ============================================
echo "--- 步骤2: 生成预测数据 ---"

node -e "
const fs = require('fs');
const DATA_FILE = '$DATA_FILE';

// 网络获取的最新中奖号码
const FETCHED_PERIOD = '$FETCHED_PERIOD';
const FETCHED_DRAW = '$FETCHED_DRAW';

// ========== 时干天干3胆 ==========
const GAN_TO_DAN = {
  '甲': [1, 4, 8], '乙': [3, 4, 8], '丙': [3, 4, 9],
  '丁': [2, 4, 9], '戊': [3, 4, 9], '己': [2, 4, 9],
  '庚': [2, 7, 9], '辛': [2, 6, 7], '壬': [1, 6, 7], '癸': [1, 6, 8]
};
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

function getDayPillar(year, month, day) {
  const ref = new Date(1900, 0, 1);
  const target = new Date(year, month - 1, day);
  const diff = Math.round((target - ref) / (24 * 60 * 60 * 1000));
  // 与前端 js/lottery-piancai.js 保持一致：offset=10（经参考点验证：2014-10-16=庚申日, 2026-01-01=乙亥日）
  const cycleOffset = 10;
  const cycleNum = ((diff + cycleOffset) % 60 + 60) % 60;
  return { ganIdx: cycleNum % 10, zhiIdx: cycleNum % 12 };
}

function getHourPillar(dayGanIdx, hourZhiIdx) {
  const ganIdx = ((dayGanIdx % 5) * 2 + hourZhiIdx) % 10;
  return { ganIdx, zhiIdx: hourZhiIdx };
}

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

function getPeriodNum(year, month, day) {
  const start = new Date(year, 0, 0);
  const target = new Date(year, month - 1, day);
  const dayOfYear = Math.round((target - start) / (24 * 60 * 60 * 1000));
  const periodNum = dayOfYear - 10;
  return year + String(periodNum).padStart(3, '0');
}

function getHaiHourGan(year, month, day) {
  const dayPillar = getDayPillar(year, month, day);
  const hourPillar = getHourPillar(dayPillar.ganIdx, 11);
  return TIAN_GAN[hourPillar.ganIdx];
}

function calcResult(dans, drawNum) {
  if (!drawNum || drawNum.length !== 3) return null;
  const drawArr = drawNum.split('').map(Number);
  const matchCount = dans.filter(d => drawArr.includes(d)).length;
  return matchCount >= 1 ? '✅' : '❌';
}

// ========== 冷号3胆计算 ==========
// 统计某期之前20期的冷号
function calcColdDans(drawNums, period) {
  // 找该期之前的所有开奖
  const keys = Object.keys(drawNums).sort();
  const before = [];
  for (const k of keys) {
    if (k < period) before.push(k);
    else break;
  }
  const window = before.slice(-20);
  if (window.length < 20) return null;
  
  const freq = new Array(10).fill(0);
  for (const k of window) {
    for (const ch of drawNums[k]) freq[parseInt(ch)]++;
  }
  const ranked = freq.map((f, d) => ({ d, f })).sort((a, b) => a.f - b.f || a.d - b.d);
  return ranked.slice(0, 3).map(x => x.d);
}

// ========== 主逻辑 ==========
const bj = getBeijingDate();
const today = new Date(bj.year, bj.month - 1, bj.day);

// 生成15期预测
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
    period: period, year: y, month: m, day: d, weekday: w,
    haiGan: gan, dans: dans,
    isPast: (y < bj.year || (y === bj.year && m < bj.month) || (y === bj.year && m === bj.month && d < bj.day)),
    isToday: (y === bj.year && m === bj.month && d === bj.day)
  });
}

while (predictions.length > 15) { predictions.shift(); }

// 读取已有数据
let stored = {};
let drawNums = {}; // 所有已知开奖号码，用于冷号计算
try {
  if (fs.existsSync(DATA_FILE)) {
    stored = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    // 提取所有有drawNum的记录
    for (const k in stored) {
      if (stored[k].drawNum) drawNums[k] = String(stored[k].drawNum);
    }
    console.log('读取已有数据: ' + Object.keys(stored).length + ' 期记录, ' + Object.keys(drawNums).length + ' 期有中奖号码');
  }
} catch(e) {
  console.warn('读取已有数据失败，将新建');
}

// 如果有从网络获取的最新中奖号码，更新到drawNums和stored
if (FETCHED_PERIOD && FETCHED_DRAW) {
  drawNums[FETCHED_PERIOD] = FETCHED_DRAW;
  if (!stored[FETCHED_PERIOD]) {
    stored[FETCHED_PERIOD] = { period: FETCHED_PERIOD };
  }
  stored[FETCHED_PERIOD].drawNum = FETCHED_DRAW;
  stored[FETCHED_PERIOD].updatedAt = new Date().toISOString();
  // 补充日期信息（从期号推算）
  const year = parseInt(FETCHED_PERIOD.substring(0, 4));
  const periodNum = parseInt(FETCHED_PERIOD.substring(4));
  const dayOfYear = periodNum + 10;
  const startDate = new Date(year, 0, 0);
  const targetDate = new Date(startDate);
  targetDate.setDate(targetDate.getDate() + dayOfYear);
  stored[FETCHED_PERIOD].year = targetDate.getFullYear();
  stored[FETCHED_PERIOD].month = targetDate.getMonth() + 1;
  stored[FETCHED_PERIOD].day = targetDate.getDate();
  console.log('📥 从网络更新中奖号码: 第' + FETCHED_PERIOD + '期 = ' + FETCHED_DRAW);
}

// 合并新预测（时干天干3胆 + 冷号3胆）
for (const p of predictions) {
  const key = p.period;
  
  if (!stored[key]) {
    // 计算冷号3胆
    const coldDans = calcColdDans(drawNums, key);
    
    stored[key] = {
      period: p.period,
      year: p.year,
      month: p.month,
      day: p.day,
      weekday: p.weekday,
      haiGan: p.haiGan,
      dans: p.dans,          // 时干天干3胆
      coldDans: coldDans,    // 冷号3胆（近20期）
      drawNum: null,
      result: null,
      coldResult: null,
      updatedAt: null
    };
  } else {
    // 更新时干天干预测
    stored[key].haiGan = p.haiGan;
    stored[key].dans = p.dans;
    if (!stored[key].year) Object.assign(stored[key], { year: p.year, month: p.month, day: p.day, weekday: p.weekday });
    
    // 计算/更新冷号3胆
    if (!stored[key].coldDans) {
      const coldDans = calcColdDans(drawNums, key);
      stored[key].coldDans = coldDans;
    }
  }
  
  // 如果有中奖号码，更新两个结果
  if (stored[key].drawNum) {
    stored[key].result = calcResult(stored[key].dans, stored[key].drawNum);
    if (stored[key].coldDans) {
      stored[key].coldResult = calcResult(stored[key].coldDans, stored[key].drawNum);
    }
  }
}

// 对冷号：如果某些历史记录没有coldDans，现在补充
const allKeys = Object.keys(stored).sort();
for (const key of allKeys) {
  if (!stored[key].coldDans && stored[key].drawNum) {
    const coldDans = calcColdDans(drawNums, key);
    if (coldDans) {
      stored[key].coldDans = coldDans;
      stored[key].coldResult = calcResult(coldDans, stored[key].drawNum);
    }
  }
}

// 保存
fs.writeFileSync(DATA_FILE, JSON.stringify(stored, null, 2), 'utf8');
console.log('✅ 预测数据已保存: ' + Object.keys(stored).length + ' 期记录（含冷号3胆）');

// 显示最近有中奖号码的记录（含冷号）
const entries = Object.entries(stored)
  .filter(([k, v]) => v.drawNum)
  .sort(([a], [b]) => b.localeCompare(a))
  .slice(0, 5);
console.log('最近中奖号码:');
for (const [k, v] of entries) {
  const ganResult = v.result || '?';
  const coldResult = v.coldResult || '?';
  const coldStr = v.coldDans ? '[' + v.coldDans.join(',') + ']' : 'N/A';
  console.log('  第' + k + '期: ' + v.drawNum + ' | 时干' + (v.dans ? '[' + v.dans.join(',') + ']' : '[]') + ' ' + ganResult + ' | 冷号' + coldStr + ' ' + coldResult);
}

// 冷号统计：已开奖记录中冷号准确率
const resolved = Object.values(stored).filter(v => v.drawNum && v.coldDans);
const coldHits = resolved.filter(v => v.coldResult === '✅').length;
const coldTotal = resolved.length;
console.log('冷号3胆统计: ' + coldHits + '/' + coldTotal + ' = ' + (coldTotal > 0 ? Math.round(coldHits/coldTotal*100) + '%' : 'N/A'));
"

# 推送到GitHub
echo "--- 步骤3: 推送到 GitHub ---"
git add -A
git commit -m "🤖 福彩3D预测自动更新（含冷号3胆）$(date '+%Y-%m-%d %H:%M')" 2>/dev/null || echo "  无新变更"
git push 2>/dev/null && echo "  ✅ 已推送到 GitHub" || echo "  ⚠️ 推送失败（可能无变更）"

echo "=== 完成 ==="