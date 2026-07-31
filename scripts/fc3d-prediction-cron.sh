#!/bin/bash
# ============================================================
# 福彩3D预测 - 3胆中1 数据更新脚本
# ============================================================
# 每天19:25（北京时间）更新次日预测
# 每天22:00（北京时间）更新当日中奖号码
# ============================================================

WORK_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DATA_FILE="$WORK_DIR/data/fc3d-prediction.json"
cd "$WORK_DIR" || exit 1

echo "=== 福彩3D预测 - 3胆中1 数据更新 ==="
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"

# 生成预测数据（Node.js脚本）
node -e "
// 天干→3胆映射
const GAN_TO_DAN = {
  '甲': [1, 4, 8], '乙': [3, 4, 8], '丙': [3, 4, 9],
  '丁': [2, 4, 9], '戊': [3, 4, 9], '己': [2, 4, 9],
  '庚': [2, 7, 9], '辛': [2, 6, 7], '壬': [1, 6, 7], '癸': [1, 6, 8]
};

const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

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

// 判断是否有效开奖日（周日不开奖）
function isValidDrawDay(weekday) {
  return weekday !== 0;
}

// 获取亥时天干
function getHaiHourGan(year, month, day) {
  const dayPillar = getDayPillar(year, month, day);
  const hourPillar = getHourPillar(dayPillar.ganIdx, 11);
  return TIAN_GAN[hourPillar.ganIdx];
}

// 主逻辑
const bj = getBeijingDate();
const today = new Date(bj.year, bj.month - 1, bj.day);

// 生成15期预测（从明天开始，跳过周日）
const predictions = [];
let cursor = new Date(today);
cursor.setDate(cursor.getDate() + 1);

while (predictions.length < 15) {
  const y = cursor.getFullYear();
  const m = cursor.getMonth() + 1;
  const d = cursor.getDate();
  const w = cursor.getDay();

  if (isValidDrawDay(w)) {
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
  cursor.setDate(cursor.getDate() + 1);
}

// 读取已有数据
let stored = {};
try {
  const fs = require('fs');
  if (fs.existsSync('$DATA_FILE')) {
    stored = JSON.parse(fs.readFileSync('$DATA_FILE', 'utf8'));
  }
} catch(e) {
  console.warn('读取已有数据失败，将新建');
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
  }
}

// 保存
const fs = require('fs');
fs.writeFileSync('$DATA_FILE', JSON.stringify(stored, null, 2), 'utf8');
console.log('✅ 预测数据已保存: ' + Object.keys(stored).length + ' 期记录');
"

# 推送到GitHub
echo "📤 推送到 GitHub..."
git add -A
git commit -m "🤖 福彩3D预测自动更新 $(date '+%Y-%m-%d %H:%M')" 2>/dev/null || echo "  无新变更"
git push 2>/dev/null && echo "  ✅ 已推送到 GitHub" || echo "  ⚠️ 推送失败（可能无变更）"

echo "=== 完成 ==="