#!/bin/bash
# ============================================================
# 福彩3D预测 - 3胆中1 + 冷号3胆 数据更新脚本
# ============================================================
# 每天22:00（北京时间）一次完成：更新当日中奖号码 + 下一期预测3码 + 下一期冷号3胆
# （2026-09-12 起：已取消19:25单独更新预测的旧任务，开奖号码更新后立即同步更新预测）
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

# ---- 数据源1（主源）: 百度移动版官方福彩卡片（playwright）----
# 说明：本站服务器位于国际网络（新加坡），500彩票网/中彩网等国内站点被墙/拦截，
# 百度移动版是唯一稳定可用的数据源（已验证可正常返回）。
# 百度源支持重试2次，避免偶发验证码导致获取失败。
echo "尝试数据源1: 百度移动版搜索官方福彩卡片（主源，国际网络可用） ..."
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
  for TRY in 1 2 3; do
    RESULT_BD=$(timeout 90 python3 scripts/fc3d-baidu-fetch.py "$NEXT_PERIOD" 2>/dev/null)
    if [ -n "$RESULT_BD" ] && [ "$RESULT_BD" != "" ]; then
      FETCHED_PERIOD=$(echo "$RESULT_BD" | cut -d'|' -f1)
      FETCHED_DRAW=$(echo "$RESULT_BD" | cut -d'|' -f2)
      FETCHED_DATE=$(echo "$RESULT_BD" | cut -d'|' -f3)
      echo "✅ 从百度获取: 第${FETCHED_PERIOD}期 = ${FETCHED_DRAW} (${FETCHED_DATE})（第${TRY}次尝试）"
      break
    else
      echo "⚠️ 百度第${TRY}次尝试失败（可能未开奖或触发验证码），重试..."
      sleep 3
    fi
  done
  if [ -z "$FETCHED_DRAW" ]; then
    echo "⚠️ 百度3次尝试均未成功"
  fi
fi

# ---- 数据源2（备源）: 500彩票网 首页（curl，国际网络下通常被拦截，保留作后备）----
if [ -z "$FETCHED_DRAW" ]; then
  echo "尝试数据源2: 500彩票网 zx.500.com/sd/（国际网络下可能被拦截） ..."
  RESULT_500=$(timeout 30 python3 scripts/fc3d-500-fetch.py 2>/dev/null)
  if [ -n "$RESULT_500" ] && [ "$RESULT_500" != "" ]; then
    FETCHED_PERIOD=$(echo "$RESULT_500" | cut -d'|' -f1)
    FETCHED_DRAW=$(echo "$RESULT_500" | cut -d'|' -f2)
    FETCHED_DATE=$(echo "$RESULT_500" | cut -d'|' -f3)
    echo "✅ 从500彩票网获取: 第${FETCHED_PERIOD}期 = ${FETCHED_DRAW} (${FETCHED_DATE})"
  else
    echo "⚠️ 500彩票网获取失败（国际网络限制）"
  fi
fi

# ---- 排列三（P3）最新中奖号码：kaijiang.500.com（主源）----
echo "--- 步骤1.5: 获取排列三最新中奖号码 ---"
PLS_FETCHED_DRAW=""
PLS_FETCHED_PERIOD=""
PLS_FETCHED_DATE=""
RESULT_PLS=$(timeout 30 python3 scripts/pls-500-fetch.py 2>/dev/null)
if [ -n "$RESULT_PLS" ] && [ "$RESULT_PLS" != "" ]; then
  PLS_FETCHED_PERIOD=$(echo "$RESULT_PLS" | cut -d'|' -f1)
  PLS_FETCHED_DRAW=$(echo "$RESULT_PLS" | cut -d'|' -f2)
  PLS_FETCHED_DATE=$(echo "$RESULT_PLS" | cut -d'|' -f3)
  echo "✅ 排列三从500获取: 第${PLS_FETCHED_PERIOD}期 = ${PLS_FETCHED_DRAW} (${PLS_FETCHED_DATE})"
else
  echo "⚠️ 排列三未能从500获取（可能未开奖）"
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
      # 从文章URL提取发布日期，上期开奖日期 = 文章日期 - 1 天（zhcw 分析文章滞后约1天）
      ARTICLE_DATE=$(echo "$ARTICLE_URL" | grep -oP '2026-\d{2}-\d{2}' | head -1)
      if [ -n "$ARTICLE_DATE" ]; then
        FETCHED_DATE=$(python3 -c "
from datetime import date, timedelta
y, m, d = map(int, '$ARTICLE_DATE'.split('-'))
print((date(y, m, d) - timedelta(days=1)).isoformat())
" 2>/dev/null)
      fi
      echo "✅ 从zhcw获取: 第${FETCHED_PERIOD}期 = ${FETCHED_DRAW} (${FETCHED_DATE:-日期未知})"
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
const FETCHED_DATE = '$FETCHED_DATE';

// 排列三最新中奖号码（期号与3D一致：日历年天数-10）
const PLS_FETCHED_PERIOD = '$PLS_FETCHED_PERIOD';
const PLS_FETCHED_DRAW = '$PLS_FETCHED_DRAW';
const PLS_FETCHED_DATE = '$PLS_FETCHED_DATE';

// ========== 休市日期表 ==========
// 官方休市日不开奖（国庆10/1-10/4、春节等），预测生成时需跳过这些日期。
// 注意：休市日没有对应期号，恢复开奖后续号（如2026263=09-30 → 2026264=10-05）。
// 如需增加春节休市，在此数组追加日期即可。
const HOLIDAYS = ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'];

function isHoliday(date) {
  const key = date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
  return HOLIDAYS.includes(key);
}

// 格式化为 YYYY-MM-DD
function fmtDate(date) {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}

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

// 读取已有数据（先读，才能知道最新开奖期号和日期）
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

// ========== 生成预测：连续期号 + 跳过休市日 ==========
// 说明：官方期号按开奖日连续计数（2026263=09-30 → 2026264=10-05），
// 休市日（10/1-10/4）没有期号。预测从最新开奖期号+1开始，
// 日期从最新开奖日期+1天开始，若遇休市日则继续顺延。
function generatePredictions() {
  // 确定最新开奖期号与日期
  let latestPeriod = '';
  let latestDate = null;
  const sortedKeys = Object.keys(drawNums).sort();
  if (sortedKeys.length > 0) {
    latestPeriod = sortedKeys[sortedKeys.length - 1];
    const sd = stored[latestPeriod] || {};
    if (sd.year && sd.month && sd.day) {
      latestDate = new Date(sd.year, sd.month - 1, sd.day);
    }
  }
  // 只有本地没有日期信息时，才用数据源日期兜底。
  // 注意：不能无条件下用 FETCHED_DATE 覆盖——当数据源返回滞后期号时
  // （如 zhcw 兜底源滞后1天返回2026265=10-06），会错误地把最新开奖日期
  // 提前一天，导致后续预测的日期/时干全部错位。
  if (!latestDate && FETCHED_DATE && FETCHED_DATE.length >= 10) {
    const parts = FETCHED_DATE.split('-').map(Number);
    if (!parts.some(isNaN)) {
      latestDate = new Date(parts[0], parts[1] - 1, parts[2]);
    }
  }
  // 兜底：今天
  if (!latestDate) latestDate = new Date(today);

  // 期号序列号（2026263 → 序列263）
  let seq = parseInt(latestPeriod.substring(4));
  const cursor = new Date(latestDate);
  const predictions = [];

  // 生成16期预测（含当前已开奖期，供回溯验证）
  for (let i = 0; i < 16; i++) {
    cursor.setDate(cursor.getDate() + 1);
    while (isHoliday(cursor)) {
      cursor.setDate(cursor.getDate() + 1);
    }
    seq += 1;
    const y = cursor.getFullYear();
    const m = cursor.getMonth() + 1;
    const d = cursor.getDate();
    const w = cursor.getDay();

    const gan = getHaiHourGan(y, m, d);
    const dans = GAN_TO_DAN[gan] || [];
    const period = y + String(seq).padStart(3, '0');

    predictions.push({
      period: period, year: y, month: m, day: d, weekday: w,
      haiGan: gan, dans: dans,
      isPast: (y < bj.year || (y === bj.year && m < bj.month) || (y === bj.year && m === bj.month && d < bj.day)),
      isToday: (y === bj.year && m === bj.month && d === bj.day)
    });
  }
  return predictions;
}

const predictions = generatePredictions();

// 如果有从网络获取的最新中奖号码，更新到drawNums和stored
// 注意：直接使用数据源返回的官方连续期号（如2026264=10-05），不做日历校正
if (FETCHED_PERIOD && FETCHED_DRAW) {
  drawNums[FETCHED_PERIOD] = FETCHED_DRAW;
  if (!stored[FETCHED_PERIOD]) {
    stored[FETCHED_PERIOD] = { period: FETCHED_PERIOD };
  }
  stored[FETCHED_PERIOD].drawNum = FETCHED_DRAW;
  stored[FETCHED_PERIOD].updatedAt = new Date().toISOString();
  // 用数据源返回的实际开奖日期补充日期信息（比期号反推更准确）
  if (FETCHED_DATE && FETCHED_DATE.length >= 10) {
    const dp = FETCHED_DATE.split('-').map(Number);
    if (!dp.some(isNaN)) {
      stored[FETCHED_PERIOD].year = dp[0];
      stored[FETCHED_PERIOD].month = dp[1];
      stored[FETCHED_PERIOD].day = dp[2];
      stored[FETCHED_PERIOD].weekday = new Date(dp[0], dp[1] - 1, dp[2]).getDay();
    }
  } else {
    // 兜底：从期号反推（无休市时正确）
    const year = parseInt(FETCHED_PERIOD.substring(0, 4));
    const periodNum = parseInt(FETCHED_PERIOD.substring(4));
    const targetDate = new Date(year, 0, 0);
    targetDate.setDate(targetDate.getDate() + periodNum + 10);
    stored[FETCHED_PERIOD].year = targetDate.getFullYear();
    stored[FETCHED_PERIOD].month = targetDate.getMonth() + 1;
    stored[FETCHED_PERIOD].day = targetDate.getDate();
  }
  console.log('📥 从网络更新中奖号码: 第' + FETCHED_PERIOD + '期 = ' + FETCHED_DRAW + '（日期 ' + (FETCHED_DATE || '未知') + '）');
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

// ========== 排列三（P3）预测数据生成 ==========
// 预测3码与3D一致（同一套时干天干3胆），中奖号码独立更新；冷号3胆按P3自身近20期频率计算
const P3_DATA_FILE = './data/p3-prediction.json';
let p3Stored = {};
try {
  if (fs.existsSync(P3_DATA_FILE)) {
    p3Stored = JSON.parse(fs.readFileSync(P3_DATA_FILE, 'utf8'));
  }
} catch(e) {
  p3Stored = {};
}

// 收集 P3 所有已知开奖号，用于冷号计算
const p3DrawNums = {};
for (const [k, v] of Object.entries(p3Stored)) {
  if (v.drawNum) p3DrawNums[k] = v.drawNum;
}
if (PLS_FETCHED_PERIOD && PLS_FETCHED_DRAW) p3DrawNums[PLS_FETCHED_PERIOD] = PLS_FETCHED_DRAW;

// 排列三最新期号与3D相同（日历年天数-10），直接用 predictions 生成
for (const p of predictions) {
  const key = p.period;
  if (!p3Stored[key]) {
    p3Stored[key] = {
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
    // 更新预测（时干天干3胆与3D一致）
    p3Stored[key].haiGan = p.haiGan;
    p3Stored[key].dans = p.dans;
    if (!p3Stored[key].year) Object.assign(p3Stored[key], { year: p.year, month: p.month, day: p.day, weekday: p.weekday });
  }
  // 若有中奖号码，计算结果
  if (p3Stored[key].drawNum) {
    p3Stored[key].result = calcResult(p3Stored[key].dans, p3Stored[key].drawNum);
  }
}

// 从网络更新排列三中奖号码（期号与3D一致，直接使用官方连续期号）
if (PLS_FETCHED_PERIOD && PLS_FETCHED_DRAW) {
  if (!p3Stored[PLS_FETCHED_PERIOD]) {
    p3Stored[PLS_FETCHED_PERIOD] = { period: PLS_FETCHED_PERIOD };
    // 补充日期（用数据源日期，更准确）
    if (PLS_FETCHED_DATE && PLS_FETCHED_DATE.length >= 10) {
      const dp = PLS_FETCHED_DATE.split('-').map(Number);
      if (!dp.some(isNaN)) {
        p3Stored[PLS_FETCHED_PERIOD].year = dp[0];
        p3Stored[PLS_FETCHED_PERIOD].month = dp[1];
        p3Stored[PLS_FETCHED_PERIOD].day = dp[2];
        p3Stored[PLS_FETCHED_PERIOD].weekday = new Date(dp[0], dp[1] - 1, dp[2]).getDay();
      }
    } else {
      // 兜底：从期号反推
      const fy = parseInt(PLS_FETCHED_PERIOD.substring(0, 4));
      const fpn = parseInt(PLS_FETCHED_PERIOD.substring(4));
      const fsd = new Date(fy, 0, 0);
      fsd.setDate(fsd.getDate() + (fpn + 10));
      p3Stored[PLS_FETCHED_PERIOD].year = fsd.getFullYear();
      p3Stored[PLS_FETCHED_PERIOD].month = fsd.getMonth() + 1;
      p3Stored[PLS_FETCHED_PERIOD].day = fsd.getDate();
      p3Stored[PLS_FETCHED_PERIOD].weekday = fsd.getDay();
    }
  }
  p3Stored[PLS_FETCHED_PERIOD].drawNum = PLS_FETCHED_DRAW;
  p3Stored[PLS_FETCHED_PERIOD].updatedAt = new Date().toISOString();
  if (p3Stored[PLS_FETCHED_PERIOD].dans) {
    p3Stored[PLS_FETCHED_PERIOD].result = calcResult(p3Stored[PLS_FETCHED_PERIOD].dans, PLS_FETCHED_DRAW);
  }
  console.log('📥 排列三从网络更新中奖号码: 第' + PLS_FETCHED_PERIOD + '期 = ' + PLS_FETCHED_DRAW + '（日期 ' + (PLS_FETCHED_DATE || '未知') + '）');
}

// 保存前统一为 P3 补冷号3胆（近20期频率最低3个数字）与冷号结果
// 注意：不仅给已开奖期补，也给下一期预测期补冷号（预测3码+冷号同步更新）；
// 已开奖期每次重算 coldResult，保证与 3D 侧行为一致
for (const key of Object.keys(p3Stored)) {
  if (!p3Stored[key].coldDans) {
    const cold = calcColdDans(p3DrawNums, key);
    if (cold) {
      p3Stored[key].coldDans = cold;
    }
  }
  if (p3Stored[key].coldDans && p3Stored[key].drawNum) {
    p3Stored[key].coldResult = calcResult(p3Stored[key].coldDans, p3Stored[key].drawNum);
  }
}

// 保存排列三数据
fs.writeFileSync(P3_DATA_FILE, JSON.stringify(p3Stored, null, 2), 'utf8');
console.log('✅ 排列三预测数据已保存: ' + Object.keys(p3Stored).length + ' 期记录');

// 显示排列三最近有中奖号码的记录
const p3Entries = Object.entries(p3Stored)
  .filter(([k, v]) => v.drawNum)
  .sort(([a], [b]) => b.localeCompare(a))
  .slice(0, 5);
console.log('排列三最近中奖号码:');
for (const [k, v] of p3Entries) {
  console.log('  第' + k + '期: ' + v.drawNum + ' | 时干' + (v.dans ? '[' + v.dans.join(',') + ']' : '[]') + ' ' + (v.result || '?'));
}

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

# 步骤4：验证更新是否成功（在网页上查询确认）
# 说明：推送后等待Vercel部署（约10-20秒），然后检查线上页面数据是否已包含最新中奖号码。
# 如果验证失败，自动重试一次；仍失败则告警提示人工检查。
echo "--- 步骤4: 验证线上更新 ---"
LATEST_PERIOD_FOR_CHECK=$(python3 -c "
import json
with open('data/fc3d-prediction.json') as f:
    d = json.load(f)
keys = sorted([k for k in d.keys() if d[k].get('drawNum')], reverse=True)
print(keys[0] if keys else '')
" 2>/dev/null)
LATEST_DRAW_FOR_CHECK=$(python3 -c "
import json
with open('data/fc3d-prediction.json') as f:
    d = json.load(f)
keys = sorted([k for k in d.keys() if d[k].get('drawNum')], reverse=True)
print(d[keys[0]]['drawNum'] if keys else '')
" 2>/dev/null)
echo "  本地最新开奖: 第${LATEST_PERIOD_FOR_CHECK}期 = ${LATEST_DRAW_FOR_CHECK}"

VERIFY_OK=""
sleep 15  # 等待Vercel部署
for TRY in 1 2; do
  echo "  验证尝试 $TRY: 检查线上预测数据页面..."
  ONLINE_TEXT=$(curl -s --max-time 30 "https://tools-website-rust.vercel.app/data/fc3d-prediction.json" 2>/dev/null)
  if echo "$ONLINE_TEXT" | grep -q "${LATEST_DRAW_FOR_CHECK}"; then
    echo "  ✅ 线上已更新成功: 最新中奖号码 ${LATEST_DRAW_FOR_CHECK} 已生效"
    VERIFY_OK="1"
    break
  else
    echo "  ⚠️ 线上尚未更新（可能Vercel还在部署），5秒后重试..."
    sleep 5
  fi
done

if [ -z "$VERIFY_OK" ]; then
  echo "  ❌ 线上验证失败：最新中奖号码 ${LATEST_DRAW_FOR_CHECK} 未在线上页面找到"
  echo "  ⚠️ 请人工检查 https://tools-website-rust.vercel.app/ 是否部署成功"
else
  echo "  ✅ 验证通过"
fi

echo "=== 完成 ==="