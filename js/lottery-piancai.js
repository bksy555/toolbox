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
// 农历日期转换（1900-2100年）
// ============================================================
const LUNAR_INFO = [
  // 每个元素代表一个农历年，数据格式：
  // [year, leapMonth, ...monthDays]
  // leapMonth: 闰月月份（0=无闰月），monthDays: 0=小月29天, 1=大月30天
  [1900,8,0,0,0,1,0,1,0,1,0,0,1,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1,0,1,0],
  [1901,0,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,0,1,0,1,0,1,0,0,1,0,0,1,0,1,0,1,0,0,1,0,0,1,0,0],
  [1902,6,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0,0,0,1,0,1,0,1,0,0,1,0,0,1,0],
  // ... 我会包含更多年份
];

// 简化版：使用近似转换（1900-2100）
// 实际项目中应使用完整的农历数据表
function lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeap) {
  // 使用内置的农历数据表进行精确转换
  // 由于数据表过大，这里使用近似算法
  // 农历月大致对应公历月的偏移
  const monthOffset = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const baseSolarDate = new Date(lunarYear, 0, 31); // 农历正月初一大约在公历1月31日左右
  
  // 累加月份天数
  let totalDays = 0;
  for (let m = 1; m < lunarMonth; m++) {
    totalDays += 29; // 近似
    // 检查是否有闰月
  }
  totalDays += lunarDay - 1;
  
  const result = new Date(baseSolarDate);
  result.setDate(result.getDate() + totalDays);
  return result;
}

// 公历转农历（简化版）
function solarToLunar(year, month, day) {
  // 简化：农历年 ≈ 公历年，月份近似
  // 农历正月初一通常在公历1月21日-2月20日之间
  const lunarYear = (month > 1 || (month === 1 && day >= 21)) ? year : year - 1;
  // 估算农历月日（不精确，仅供参考）
  const solarNewYear = new Date(lunarYear, 0, 31); // 近似
  const target = new Date(year, month - 1, day);
  const diff = Math.round((target - solarNewYear) / (24*60*60*1000));
  
  let lunarMonth = 1;
  let lunarDay = diff + 1;
  
  while (lunarDay > 30) {
    lunarDay -= 30;
    lunarMonth++;
  }
  
  return { year: lunarYear, month: lunarMonth, day: lunarDay, isLeap: false };
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

// 计算时柱（默认午时11-13点）
function getHourPillar(dayGanIdx, hourZhiIdx) {
  // 时干: 日干 × 2 + 时支序数 (mod 10)
  // 时支序数: 子=0, 丑=1, ..., 亥=11
  const ganIdx = ((dayGanIdx % 5) * 2 + hourZhiIdx) % 10;
  return { gan: TIAN_GAN[ganIdx], zhi: DI_ZHI[hourZhiIdx], ganIdx, zhiIdx };
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
function calcPiancai(solarYear, solarMonth, solarDay, gender) {
  // 1. 计算八字
  const yearPillar = getYearPillar(solarYear);
  const monthPillar = getMonthPillar(solarYear, solarMonth, solarDay);
  const dayPillar = getDayPillar(solarYear, solarMonth, solarDay);
  const hourPillar = getHourPillar(dayPillar.ganIdx, 6); // 默认午时
  
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