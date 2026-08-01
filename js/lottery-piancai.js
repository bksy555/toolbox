// ============================================================
// 八字偏财日查询 - 核心算法
// 基于《子平渊海》《子平真诠》原理
// ============================================================

// ---- 基础常量 ----
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 天干五行
const GAN_WUXING = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];

// 地支五行
const ZHI_WUXING = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水'];

// 地支藏干
const ZHI_CANG_GAN = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲']
};

// 五行生克关系
const WUXING_SHENG = {'木': '火', '火': '土', '土': '金', '金': '水', '水': '木'};
const WUXING_KE = {'木': '土', '土': '水', '水': '火', '火': '金', '金': '木'};

// 干支同五行组合（天干和地支五行相同）
const GANZHI_SAME_WUXING = {
  '木': ['甲寅', '乙卯'],
  '火': ['丙午', '丁巳'],
  '土': ['戊辰', '己丑', '戊戌', '己未'],
  '金': ['庚申', '辛酉'],
  '水': ['壬子', '癸亥']
};

// 所有干支同五行的组合（平铺）
const ALL_SAME_GANZHI = ['甲寅', '乙卯', '丙午', '丁巳', '戊辰', '己丑', '戊戌', '己未', '庚申', '辛酉', '壬子', '癸亥'];

// 时辰对应
const SHICHEN = [
  { name: '子时', zhi: '子', start: '23:00', end: '01:00' },
  { name: '丑时', zhi: '丑', start: '01:00', end: '03:00' },
  { name: '寅时', zhi: '寅', start: '03:00', end: '05:00' },
  { name: '卯时', zhi: '卯', start: '05:00', end: '07:00' },
  { name: '辰时', zhi: '辰', start: '07:00', end: '09:00' },
  { name: '巳时', zhi: '巳', start: '09:00', end: '11:00' },
  { name: '午时', zhi: '午', start: '11:00', end: '13:00' },
  { name: '未时', zhi: '未', start: '13:00', end: '15:00' },
  { name: '申时', zhi: '申', start: '15:00', end: '17:00' },
  { name: '酉时', zhi: '酉', start: '17:00', end: '19:00' },
  { name: '戌时', zhi: '戌', start: '19:00', end: '21:00' },
  { name: '亥时', zhi: '亥', start: '21:00', end: '23:00' }
];

// 地支对应方位
const ZHI_FANGWEI = {
  '子': '正北',
  '丑': '东北', '寅': '东北',
  '卯': '正东',
  '辰': '东南', '巳': '东南',
  '午': '正南',
  '未': '西南', '申': '西南',
  '酉': '正西',
  '戌': '西北', '亥': '西北'
};

// ============================================================
// 农历日期转换（1900-2100年）- 精确版
// 使用标准农历数据表，支持闰月
// ============================================================
// 农历数据编码（每项对应一个农历年）：
// 位0-3: 闰月（0=无闰月，1-12=闰几月）
// 位4-15: 12个月大小（1=30天，0=29天），从正月到腊月
// 位16: 闰月大小（1=30天，0=29天）
const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, //1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, //1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, //1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, //1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, //1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, //1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, //1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, //1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, //1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0, //1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, //2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, //2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, //2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, //2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, //2040-2049
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06aa0, 0x1a6c4, 0x0aae0, //2050-2059
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, //2060-2069
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, //2070-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, //2080-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a4d0, 0x0d150, 0x0f252, //2090-2099
  0x0d520 //2100
];

// 获取农历年的天数
function lunarYearDays(y) {
  let sum = 348; // 12个月 × 29天
  const info = LUNAR_INFO[y - 1900];
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (info & i) ? 1 : 0;
  }
  return sum + leapDays(y);
}

// 获取农历年闰月的天数
function leapDays(y) {
  const info = LUNAR_INFO[y - 1900];
  if (info & 0xf) { // 有闰月
    return (info & 0x10000) ? 30 : 29;
  }
  return 0;
}

// 获取农历年闰月月份（0=无闰月）
function leapMonth(y) {
  return LUNAR_INFO[y - 1900] & 0xf;
}

// 获取农历年某月的天数
function monthDays(y, m) {
  const info = LUNAR_INFO[y - 1900];
  return (info & (0x10000 >> m)) ? 30 : 29;
}

// 公历转农历（精确版）
function solarToLunar(year, month, day) {
  // 以1900年1月31日（农历正月初一）为基准
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(year, month - 1, day);
  let offset = Math.round((targetDate - baseDate) / 86400000);
  
  if (offset < 0) return { year: 1900, month: 1, day: 1, isLeap: false };
  
  // 计算农历年
  let lunarYear, i, daysInYear;
  for (i = 1900; i < 2101 && offset > 0; i++) {
    daysInYear = lunarYearDays(i);
    offset -= daysInYear;
  }
  if (offset < 0) {
    offset += daysInYear;
    i--;
  }
  lunarYear = i;
  
  const leap = leapMonth(i); // 闰月月份
  let isLeap = false;
  
  // 计算农历月
  for (i = 1; i < 13 && offset > 0; i++) {
    // 闰月
    if (leap > 0 && i === (leap + 1) && !isLeap) {
      --i;
      isLeap = true;
      const days = leapDays(lunarYear);
      offset -= days;
      if (offset < 0) {
        offset += days;
        break;
      }
      continue;
    }
    if (isLeap && i === (leap + 1)) {
      isLeap = false;
    }
    const days = monthDays(lunarYear, i);
    offset -= days;
    if (offset < 0) {
      offset += days;
      break;
    }
  }
  
  const lunarMonth = i;
  const lunarDay = offset + 1;
  
  return { year: lunarYear, month: lunarMonth, day: lunarDay, isLeap };
}

// 农历转公历（精确版）
function lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeap) {
  if (lunarYear < 1900 || lunarYear > 2100) return new Date(1900, 0, 1);
  
  // 以1900年1月31日（农历正月初一）为基准
  let offset = 0;
  
  // 累加整年的天数
  for (let i = 1900; i < lunarYear; i++) {
    offset += lunarYearDays(i);
  }
  
  // 累加月份天数
  const leap = leapMonth(lunarYear);
  let passed = false;
  
  for (let i = 1; i < lunarMonth; i++) {
    // 处理闰月
    if (leap > 0 && i === (leap + 1) && !passed) {
      // 如果请求的是闰月，不跳过
      if (isLeap) {
        passed = true;
        i--;
        continue;
      }
      // 否则跳过闰月
      i--;
      passed = true;
      offset += leapDays(lunarYear);
      continue;
    }
    if (passed && i === (leap + 1)) {
      passed = false;
    }
    offset += monthDays(lunarYear, i);
  }
  
  // 闰月天数
  if (isLeap && leap > 0) {
    offset += leapDays(lunarYear);
  }
  
  offset += lunarDay - 1;
  
  const result = new Date(1900, 0, 31);
  result.setDate(result.getDate() + offset);
  return result;
}

// 农历月份名称
const LUNAR_MONTH_NAMES = ['', '正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
const LUNAR_DAY_NAMES = ['', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

// ============================================================
// 八字核心计算
// ============================================================

// 计算年柱
function getYearPillar(year) {
  // 年柱以立春为界
  // 天干: (year - 4) % 10
  // 地支: (year - 4) % 12
  const ganIdx = ((year - 4) % 10 + 10) % 10;
  const zhiIdx = ((year - 4) % 12 + 12) % 12;
  return { gan: TIAN_GAN[ganIdx], zhi: DI_ZHI[zhiIdx], ganIdx, zhiIdx };
}

// 判断是否在立春之后（2月4日左右）
function isAfterLichun(month, day) {
  return month > 2 || (month === 2 && day >= 4);
}

// 获取节气日（简化版，仅用于月柱判断）
const JIEQI_DAYS = [
  { name: '立春', month: 2, day: 4 },
  { name: '惊蛰', month: 3, day: 6 },
  { name: '清明', month: 4, day: 5 },
  { name: '立夏', month: 5, day: 6 },
  { name: '芒种', month: 6, day: 6 },
  { name: '小暑', month: 7, day: 7 },
  { name: '立秋', month: 8, day: 8 },
  { name: '白露', month: 9, day: 8 },
  { name: '寒露', month: 10, day: 8 },
  { name: '立冬', month: 11, day: 7 },
  { name: '大雪', month: 12, day: 7 },
  { name: '小寒', month: 1, day: 6 }
];

// 根据公历日期获取月支索引
function getMonthZhiIndex(month, day) {
  // 节气分界
  const boundaries = [
    { jieqi: 0, zhi: 2 },   // 立春 → 寅月
    { jieqi: 1, zhi: 3 },   // 惊蛰 → 卯月
    { jieqi: 2, zhi: 4 },   // 清明 → 辰月
    { jieqi: 3, zhi: 5 },   // 立夏 → 巳月
    { jieqi: 4, zhi: 6 },   // 芒种 → 午月
    { jieqi: 5, zhi: 7 },   // 小暑 → 未月
    { jieqi: 6, zhi: 8 },   // 立秋 → 申月
    { jieqi: 7, zhi: 9 },   // 白露 → 酉月
    { jieqi: 8, zhi: 10 },  // 寒露 → 戌月
    { jieqi: 9, zhi: 11 },  // 立冬 → 亥月
    { jieqi: 10, zhi: 0 },  // 大雪 → 子月
    { jieqi: 11, zhi: 1 }   // 小寒 → 丑月
  ];

  for (const b of boundaries) {
    const jq = JIEQI_DAYS[b.jieqi];
    if (month < jq.month || (month === jq.month && day < jq.day)) {
      // 在这个节气之前，取上一个节气对应的月支
      const idx = boundaries.indexOf(b);
      const prev = boundaries[(idx - 1 + 12) % 12];
      return prev.zhi;
    }
  }
  // 过了最后一个节气（小寒之后，立春之前）
  return 1; // 丑月
}

// 计算月柱
function getMonthPillar(year, month, day) {
  const zhiIdx = getMonthZhiIndex(month, day);
  
  // 月干：年干 × 2 + 月支序数 (mod 10)
  // 月支序数: 寅=2, 卯=3, ..., 丑=1
  const yearPillar = getYearPillar(year);
  const monthZhiOrder = (zhiIdx - 2 + 12) % 12; // 寅=0, 卯=1, ...
  const ganIdx = ((yearPillar.ganIdx % 5) * 2 + monthZhiOrder) % 10;
  
  return { gan: TIAN_GAN[ganIdx], zhi: DI_ZHI[zhiIdx], ganIdx, zhiIdx };
}

// 计算日柱（从1900-01-01起算，调整偏移使2026-01-01=丙子日）
function getDayPillar(year, month, day) {
  const ref = new Date(1900, 0, 1); // 1900-01-01
  const target = new Date(year, month - 1, day);
  const diff = Math.round((target - ref) / (24 * 60 * 60 * 1000));
  
  // 60天周期偏移量，使2026-01-01=丙子日（60-cycle=12）
  // 46021 % 60 = 1, 需要 offset = 12 - 1 = 11
  const cycleOffset = 11;
  const cycleNum = ((diff + cycleOffset) % 60 + 60) % 60;
  const ganIdx = cycleNum % 10;
  const zhiIdx = cycleNum % 12;
  
  return { gan: TIAN_GAN[ganIdx], zhi: DI_ZHI[zhiIdx], ganIdx, zhiIdx };
}

// 计算时柱
function getHourPillar(dayGanIdx, hourZhiIdx) {
  // 时干: 日干 × 2 + 时支序数 (mod 10)
  // 时支序数: 子=0, 丑=1, ..., 亥=11
  const ganIdx = ((dayGanIdx % 5) * 2 + hourZhiIdx) % 10;
  return { gan: TIAN_GAN[ganIdx], zhi: DI_ZHI[hourZhiIdx], ganIdx, zhiIdx: hourZhiIdx };
}

// ============================================================
// 身强/身弱判断
// ============================================================

// 获取五行计数
function getWuxingCount(bazi) {
  // bazi: { year, month, day, hour } 每个包含 { gan, zhi, ganIdx, zhiIdx }
  const count = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  
  const allElements = [];
  
  // 天干
  const pillars = ['year', 'month', 'day', 'hour'];
  for (const p of pillars) {
    const gan = bazi[p].gan;
    const zhi = bazi[p].zhi;
    // 天干五行
    allElements.push(GAN_WUXING[bazi[p].ganIdx]);
    // 地支藏干
    const cangGans = ZHI_CANG_GAN[zhi];
    for (const cg of cangGans) {
      const cgIdx = TIAN_GAN.indexOf(cg);
      allElements.push(GAN_WUXING[cgIdx]);
    }
  }
  
  for (const el of allElements) {
    count[el] = (count[el] || 0) + 1;
  }
  
  return count;
}

// 判断身强/身弱
function judgeStrength(bazi, dayGanIdx) {
  const dayWuxing = GAN_WUXING[dayGanIdx];
  const count = getWuxingCount(bazi);
  
  // 生扶日主的五行：同五行 + 生我者
  let support = count[dayWuxing]; // 同五行
  const shengWo = Object.entries(WUXING_SHENG).find(([k, v]) => v === dayWuxing)?.[0];
  if (shengWo) support += count[shengWo] || 0;
  
  // 克泄日主的五行：我克者 + 克我者 + 我生者
  let drain = 0;
  const woKe = WUXING_KE[dayWuxing]; // 我克
  if (woKe) drain += count[woKe] || 0;
  const keWo = Object.entries(WUXING_KE).find(([k, v]) => v === dayWuxing)?.[0]; // 克我
  if (keWo) drain += count[keWo] || 0;
  const woSheng = WUXING_SHENG[dayWuxing]; // 我生
  if (woSheng) drain += count[woSheng] || 0;
  
  return { support, drain, isStrong: support > drain, score: support - drain };
}

// ============================================================
// 大运计算
// ============================================================
function getDayun(bazi, gender) {
  // 阳年: 年干为甲、丙、戊、庚、壬 (索引0,2,4,6,8)
  const yearGan = bazi.year.ganIdx;
  const isYang = yearGan % 2 === 0;
  
  // 阳年男/阴年女 → 顺排; 阴年男/阳年女 → 逆排
  const isShun = (isYang && gender === 'male') || (!isYang && gender === 'female');
  
  // 计算起运年龄（简化：从出生日到下一个/上一个节气）
  // 此处简化计算，假设每10年一运
  const dayun = [];
  const base = isShun ? 0 : -1;
  
  for (let i = 0; i < 8; i++) {
    const step = isShun ? i : -i;
    const ganIdx = ((bazi.month.ganIdx + step) % 10 + 10) % 10;
    const zhiIdx = ((bazi.month.zhiIdx + step) % 12 + 12) % 12;
    dayun.push({
      gan: TIAN_GAN[ganIdx],
      zhi: DI_ZHI[zhiIdx],
      ganIdx,
      zhiIdx,
      startAge: i * 10,
      endAge: (i + 1) * 10 - 1
    });
  }
  
  return dayun;
}

// 获取当前大运
function getCurrentDayun(dayun, age) {
  for (const dy of dayun) {
    if (age >= dy.startAge && age <= dy.endAge) {
      return dy;
    }
  }
  return dayun[dayun.length - 1];
}

// ============================================================
// 综合判断身强/身弱（考虑大运和流年）
// ============================================================
function judgeOverallStrength(bazi, gender, birthDate, currentYear) {
  // 年龄
  const age = currentYear - birthDate.getFullYear();
  
  // 原局判断
  const base = judgeStrength(bazi, bazi.day.ganIdx);
  
  // 大运判断
  const dayun = getDayun(bazi, gender);
  const currentDayun = getCurrentDayun(dayun, age);
  const dayunWuxing = GAN_WUXING[currentDayun.ganIdx];
  
  // 流年
  const currentYearPillar = getYearPillar(currentYear);
  const liunianWuxing = GAN_WUXING[currentYearPillar.ganIdx];
  
  // 大运和流年对日主的影响
  const dayWuxing = GAN_WUXING[bazi.day.ganIdx];
  
  let adjustment = 0;
  
  // 大运天干对日主的影响
  if (dayunWuxing === dayWuxing) adjustment += 2;
  else if (WUXING_SHENG[dayunWuxing] === dayWuxing) adjustment += 1.5;
  else if (WUXING_KE[dayunWuxing] === dayWuxing) adjustment -= 1.5;
  
  // 流年天干对日主的影响
  if (liunianWuxing === dayWuxing) adjustment += 1;
  else if (WUXING_SHENG[liunianWuxing] === dayWuxing) adjustment += 0.5;
  else if (WUXING_KE[liunianWuxing] === dayWuxing) adjustment -= 0.5;
  
  const finalScore = base.score + adjustment;
  const isStrong = finalScore > 0;
  
  return {
    isStrong,
    score: finalScore,
    baseScore: base.score,
    adjustment,
    dayun: currentDayun,
    dayunWuxing,
    liunianWuxing,
    detail: {
      baseSupport: base.support,
      baseDrain: base.drain,
      baseIsStrong: base.isStrong,
      age,
      currentDayun: `${currentDayun.gan}${currentDayun.zhi}（${currentDayun.startAge}-${currentDayun.endAge}岁）`,
      liunian: `${currentYearPillar.gan}${currentYearPillar.zhi}`
    }
  };
}

// ============================================================
// 获取偏财日
// ============================================================
function getPiancaiDates(bazi, gender, birthDate, year) {
  const strength = judgeOverallStrength(bazi, gender, birthDate, year);
  const dayGanIdx = bazi.day.ganIdx;
  const dayWuxing = GAN_WUXING[dayGanIdx];
  
  let targetGanzhi = [];
  
  if (strength.isStrong) {
    // 身强 → 选择日主五行所克的干支
    // 如甲木克土 → 选土的同五行干支
    const keWuxing = WUXING_KE[dayWuxing];
    targetGanzhi = GANZHI_SAME_WUXING[keWuxing] || [];
  } else {
    // 身弱 → 选择生助日主或与日主同五行的干支
    // 生我者
    const shengWo = Object.entries(WUXING_SHENG).find(([k, v]) => v === dayWuxing)?.[0];
    const shengGanzhi = shengWo ? GANZHI_SAME_WUXING[shengWo] : [];
    // 同我者
    const sameGanzhi = GANZHI_SAME_WUXING[dayWuxing] || [];
    targetGanzhi = [...shengGanzhi, ...sameGanzhi];
  }
  
  if (targetGanzhi.length === 0) return [];
  
  // 在指定年份中查找匹配的日期
  const results = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const pillar = getDayPillar(d.getFullYear(), d.getMonth() + 1, d.getDate());
    const ganzhi = pillar.gan + pillar.zhi;
    
    if (targetGanzhi.includes(ganzhi)) {
      // 找对应的时辰（与日支一致）
      const zhiIdx = pillar.zhiIdx;
      const shichen = SHICHEN[zhiIdx];
      const fangwei = ZHI_FANGWEI[pillar.zhi];
      
      results.push({
        date: new Date(d),
        ganzhi,
        ganzhiFull: `${pillar.gan}${pillar.zhi}`,
        zhi: pillar.zhi,
        shichen,
        fangwei,
        // 时辰对应的所有时间
        shichenPeriod: `${shichen.name}（${shichen.start}-${shichen.end}）`
      });
    }
  }
  
  // 按日期排序
  results.sort((a, b) => a.date - b.date);
  
  return {
    results,
    strength,
    dayGan: bazi.day.gan,
    dayWuxing,
    targetGanzhi
  };
}

// ============================================================
// 生成八字四柱字符串
// ============================================================
function getBaziString(bazi) {
  return `${bazi.year.gan}${bazi.year.zhi} ${bazi.month.gan}${bazi.month.zhi} ${bazi.day.gan}${bazi.day.zhi} ${bazi.hour.gan}${bazi.hour.zhi}`;
}

// ============================================================
// 主入口：计算偏财日
// ============================================================
function calcPiancai(solarYear, solarMonth, solarDay, gender, hourZhiIdx) {
  // 1. 计算八字
  const yearPillar = getYearPillar(solarYear);
  const monthPillar = getMonthPillar(solarYear, solarMonth, solarDay);
  const dayPillar = getDayPillar(solarYear, solarMonth, solarDay);
  // 使用用户输入的时辰；如果未知（-1）则默认午时
  const hIdx = (hourZhiIdx !== undefined && hourZhiIdx >= 0) ? hourZhiIdx : 6;
  const hourPillar = getHourPillar(dayPillar.ganIdx, hIdx);
  
  const bazi = {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar
  };
  
  // 2. 计算偏财日
  const birthDate = new Date(solarYear, solarMonth - 1, solarDay);
  const currentYear = 2026; // 当前年份
  const result = getPiancaiDates(bazi, gender, birthDate, currentYear);
  
  return {
    bazi,
    baziString: getBaziString(bazi),
    dayMaster: dayPillar.gan,
    ...result
  };
}

// ============================================================
// 公历农历互转辅助
// ============================================================
function getLunarYearName(year) {
  const gan = TIAN_GAN[(year - 4) % 10];
  const zhi = DI_ZHI[(year - 4) % 12];
  // 生肖
  const SHENGXIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  const zhiIdx = ((year - 4) % 12 + 12) % 12;
  const shengxiao = SHENGXIAO[zhiIdx];
  return `${gan}${zhi}年（${shengxiao}年）`;
}

// 获取农历日期字符串
function getLunarDateString(year, month, day) {
  const lunar = solarToLunar(year, month, day);
  return `${LUNAR_MONTH_NAMES[lunar.month]}${LUNAR_DAY_NAMES[lunar.day]}`;
}