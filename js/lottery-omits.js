// ============================================================
// 彩票缩水工具 - 遗漏统计 & 历史对比
// ============================================================

// ---- 双色球模拟开奖数据（近50期模拟） ----
function generateMockSSQData() {
  const data = [];
  let baseDate = new Date('2026-01-01');
  for (let i = 0; i < 50; i++) {
    const reds = [];
    while (reds.length < 6) {
      const n = Math.floor(Math.random() * 33) + 1;
      if (!reds.includes(n)) reds.push(n);
    }
    reds.sort((a, b) => a - b);
    const blue = Math.floor(Math.random() * 16) + 1;
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i * 3);
    data.push({
      term: (2026001 + i).toString(),
      date: date.toISOString().slice(0, 10),
      reds: reds,
      blue: blue
    });
  }
  return data;
}

// ---- 计算遗漏数据 ----
function calcOmitData(totalRange, redCount, drawData) {
  const stats = [];
  for (let n = 1; n <= totalRange; n++) {
    let lastAppear = -1;
    let maxOmit = 0;
    let currentOmit = 0;
    let totalAppear = 0;
    let consecutiveCount = 0;
    let maxConsecutive = 0;
    let currentConsecutive = 0;
    let currentConsecutiveOmit = 0;

    for (let i = 0; i < drawData.length; i++) {
      const appears = drawData[i].reds.includes(n);
      if (appears) {
        totalAppear++;
        const omit = i - lastAppear - 1;
        if (omit > maxOmit) maxOmit = omit;
        currentOmit = 0;
        consecutiveCount++;
        if (consecutiveCount > maxConsecutive) maxConsecutive = consecutiveCount;
        if (consecutiveCount >= 2) currentConsecutiveOmit = 0;
        lastAppear = i;
      } else {
        currentOmit++;
        if (consecutiveCount === 1) currentConsecutiveOmit++;
        consecutiveCount = 0;
      }
    }
    // 当前遗漏
    currentOmit = drawData.length - lastAppear - 1;

    const cycle = totalRange / redCount;
    const appearRate = totalAppear / drawData.length;
    const avgOmit = totalAppear > 0 ? (drawData.length - totalAppear) / totalAppear : cycle;

    // 连出次数
    let consecAppear = 0;
    for (let i = 0; i < drawData.length - 1; i++) {
      if (drawData[i].reds.includes(n) && drawData[i + 1].reds.includes(n)) {
        consecAppear++;
      }
    }

    // 最大连出遗漏
    let maxConsecOmit = 0;
    let consecOmit = 0;
    for (let i = 0; i < drawData.length; i++) {
      if (drawData[i].reds.includes(n)) {
        if (consecOmit > maxConsecOmit) maxConsecOmit = consecOmit;
        consecOmit = 0;
      } else {
        consecOmit++;
      }
    }

    stats.push({
      num: n,
      cycle: cycle.toFixed(1),
      appear: totalAppear,
      appearRate: (appearRate * 100).toFixed(2),
      avgOmit: avgOmit.toFixed(2),
      maxOmit: maxOmit,
      lastOmit: lastAppear >= 0 ? (drawData.length - lastAppear - 2) : 0,
      currentOmit: currentOmit,
      desireRate: (avgOmit > 0 ? currentOmit / avgOmit : 0).toFixed(2),
      investValue: (currentOmit / cycle).toFixed(2),
      maxConsecutive: maxConsecutive
    });
  }
  return stats;
}

// ============================================================
// 红球遗漏统计
// ============================================================
function renderRedOmitTool() {
  return `
    <div class="lottery-tool-section">
      <h3>📊 双色球红球遗漏统计</h3>
      <div class="lottery-tip">基于模拟开奖数据计算各号码遗漏情况。数据仅供参考，实际开奖以官方为准。</div>
      <div class="omit-table-wrapper">
        <table class="omit-table" id="omitTable">
          <thead>
            <tr>
              <th>号码</th>
              <th>循环周期</th>
              <th>出现次数</th>
              <th>出现概率</th>
              <th>平均遗漏</th>
              <th>最大遗漏</th>
              <th>上期遗漏</th>
              <th>本期遗漏</th>
              <th>欲出几率</th>
              <th>投资价值</th>
              <th>最大连出</th>
            </tr>
          </thead>
          <tbody id="omitBody"></tbody>
        </table>
      </div>
      <div class="btn-group" style="margin-top:12px;">
        <button class="btn btn-primary" onclick="refreshOmitData()">🔄 刷新数据</button>
      </div>
    </div>
  `;
}

function initRedOmitTool() { refreshOmitData(); }

function refreshOmitData() {
  const data = generateMockSSQData();
  const stats = calcOmitData(33, 6, data);

  const tbody = document.getElementById('omitBody');
  if (!tbody) return;

  let html = '';
  stats.forEach(s => {
    const isHighOmit = s.currentOmit > s.avgOmit * 1.5;
    html += `<tr>
      <td class="num-cell red-num">${s.num < 10 ? '0'+s.num : s.num}</td>
      <td>${s.cycle}</td>
      <td>${s.appear}</td>
      <td>${s.appearRate}%</td>
      <td>${s.avgOmit}</td>
      <td class="${s.maxOmit > 20 ? 'omit-high' : ''}">${s.maxOmit}</td>
      <td>${s.lastOmit}</td>
      <td class="${isHighOmit ? 'omit-high' : ''}">${s.currentOmit}</td>
      <td>${s.desireRate}</td>
      <td>${s.investValue}</td>
      <td>${s.maxConsecutive}</td>
    </tr>`;
  });
  tbody.innerHTML = html;
}

// ============================================================
// 蓝球遗漏统计
// ============================================================
function renderBlueOmitTool() {
  return `
    <div class="lottery-tool-section">
      <h3>📊 双色球蓝球遗漏统计</h3>
      <div class="lottery-tip">基于模拟开奖数据计算蓝球遗漏情况。数据仅供参考。</div>
      <div class="omit-table-wrapper">
        <table class="omit-table" id="blueOmitTable">
          <thead>
            <tr>
              <th>号码</th>
              <th>循环周期</th>
              <th>出现次数</th>
              <th>出现概率</th>
              <th>平均遗漏</th>
              <th>最大遗漏</th>
              <th>上期遗漏</th>
              <th>本期遗漏</th>
              <th>欲出几率</th>
              <th>投资价值</th>
            </tr>
          </thead>
          <tbody id="blueOmitBody"></tbody>
        </table>
      </div>
      <div class="btn-group" style="margin-top:12px;">
        <button class="btn btn-primary" onclick="refreshBlueOmit()">🔄 刷新数据</button>
      </div>
    </div>
  `;
}

function initBlueOmitTool() { refreshBlueOmit(); }

function refreshBlueOmit() {
  const data = generateMockSSQData();
  const stats = [];
  for (let n = 1; n <= 16; n++) {
    let lastAppear = -1;
    let maxOmit = 0;
    let currentOmit = 0;
    let totalAppear = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i].blue === n) {
        totalAppear++;
        const omit = i - lastAppear - 1;
        if (omit > maxOmit) maxOmit = omit;
        currentOmit = 0;
        lastAppear = i;
      } else {
        currentOmit++;
      }
    }
    currentOmit = data.length - lastAppear - 1;
    const cycle = 16;
    const avgOmit = totalAppear > 0 ? (data.length - totalAppear) / totalAppear : cycle;

    stats.push({
      num: n,
      cycle: cycle.toFixed(1),
      appear: totalAppear,
      appearRate: ((totalAppear / data.length) * 100).toFixed(2),
      avgOmit: avgOmit.toFixed(2),
      maxOmit: maxOmit,
      lastOmit: lastAppear >= 0 ? (data.length - lastAppear - 2) : 0,
      currentOmit: currentOmit,
      desireRate: (avgOmit > 0 ? currentOmit / avgOmit : 0).toFixed(2),
      investValue: (currentOmit / cycle).toFixed(2)
    });
  }

  const tbody = document.getElementById('blueOmitBody');
  if (!tbody) return;
  let html = '';
  stats.forEach(s => {
    const isHigh = s.currentOmit > s.avgOmit * 1.5;
    html += `<tr>
      <td class="num-cell blue-num">${s.num < 10 ? '0'+s.num : s.num}</td>
      <td>${s.cycle}</td>
      <td>${s.appear}</td>
      <td>${s.appearRate}%</td>
      <td>${s.avgOmit}</td>
      <td class="${s.maxOmit > 20 ? 'omit-high' : ''}">${s.maxOmit}</td>
      <td>${s.lastOmit}</td>
      <td class="${isHigh ? 'omit-high' : ''}">${s.currentOmit}</td>
      <td>${s.desireRate}</td>
      <td>${s.investValue}</td>
    </tr>`;
  });
  tbody.innerHTML = html;
}

// ============================================================
// 3D 遗漏统计
// ============================================================
function render3DOmitsTool() {
  return `
    <div class="lottery-tool-section">
      <h3>📊 号码遗漏统计</h3>
      <div class="lottery-tip">各数字在各位置上的遗漏情况</div>
      <div class="omit-table-wrapper">
        <table class="omit-table" id="d3OmitTable">
          <thead>
            <tr>
              <th>数字</th>
              <th>百位遗漏</th>
              <th>十位遗漏</th>
              <th>个位遗漏</th>
              <th>总出现次数</th>
            </tr>
          </thead>
          <tbody id="d3OmitBody"></tbody>
        </table>
      </div>
      <div class="btn-group" style="margin-top:12px;">
        <button class="btn btn-primary" onclick="refresh3DOmits()">🔄 刷新</button>
      </div>
    </div>
  `;
}

function init3DOmitsTool() { refresh3DOmits(); }

function refresh3DOmits() {
  // 模拟数据
  const data = [];
  for (let i = 0; i < 100; i++) {
    data.push([
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10)
    ]);
  }

  const tbody = document.getElementById('d3OmitBody');
  if (!tbody) return;

  let html = '';
  for (let n = 0; n < 10; n++) {
    let baiOmit = 0, shiOmit = 0, geOmit = 0;
    let baiLast = -1, shiLast = -1, geLast = -1;
    let totalAppear = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i][0] === n) { baiOmit = 0; baiLast = i; }
      else if (baiLast >= 0) baiOmit++;
      if (data[i][1] === n) { shiOmit = 0; shiLast = i; }
      else if (shiLast >= 0) shiOmit++;
      if (data[i][2] === n) { geOmit = 0; geLast = i; }
      else if (geLast >= 0) geOmit++;
      if (data[i].includes(n)) totalAppear++;
    }
    baiOmit = data.length - baiLast - 1;
    shiOmit = data.length - shiLast - 1;
    geOmit = data.length - geLast - 1;

    const isHigh = baiOmit > 10 || shiOmit > 10 || geOmit > 10;
    html += `<tr>
      <td class="num-cell ${isHigh ? 'omit-high' : ''}">${n}</td>
      <td>${baiOmit}</td>
      <td>${shiOmit}</td>
      <td>${geOmit}</td>
      <td>${totalAppear}</td>
    </tr>`;
  }
  tbody.innerHTML = html;
}

// ============================================================
// 历史开奖对比
// ============================================================
function renderHistoryTool() {
  const lt = LOTTERY_TYPES[currentLottery];
  return `
    <div class="lottery-tool-section">
      <h3>📅 ${lt.name} 历史开奖对比</h3>
      <div class="lottery-tip">输入号码，与历史开奖数据进行对比</div>
      <div style="margin-bottom:16px;">
        <div class="ball-row">
          <span class="ball-row-label">${lt.redName}：</span>
          <div id="histRedBalls" class="selected-balls"></div>
        </div>
        <div id="histRedGrid"></div>
        <div class="action-row" style="margin-top:4px;">
          <button class="action-btn" onclick="histClear()">清除</button>
          <button class="action-btn" onclick="histRandom()">随机选号</button>
          <span id="histCount" style="font-size:12px;color:var(--text-light);">已选 0/${lt.redCount}</span>
        </div>
      </div>
      ${lt.blueRange > 0 ? `
      <div style="margin-bottom:16px;">
        <div class="ball-row">
          <span class="ball-row-label">${lt.blueName}：</span>
          <div id="histBlueBalls" class="selected-balls"></div>
        </div>
        <div id="histBlueGrid"></div>
        <div class="action-row" style="margin-top:4px;">
          <button class="action-btn" onclick="histClearBlue()">清除</button>
          <span id="histBlueCount" style="font-size:12px;color:var(--text-light);">已选 0/${lt.blueCount}</span>
        </div>
      </div>
      ` : ''}
      <div class="btn-group">
        <button class="btn btn-primary" onclick="runHistoryCompare()">📊 对比</button>
      </div>
      <div class="lottery-result" id="histResult">
        <div class="result-title">📊 对比结果</div>
        <div id="histDetail"></div>
      </div>
    </div>
  `;
}

let histState = { red: [], blue: [] };

function initHistoryTool() {
  const lt = LOTTERY_TYPES[currentLottery];
  histState = { red: [], blue: [] };

  if (lt.isDigit) {
    // 简化处理
    return;
  }

  renderNumGrid('histRedGrid', lt.redRange, histState.red, (n) => {
    const idx = histState.red.indexOf(n);
    if (idx >= 0) histState.red.splice(idx, 1);
    else if (histState.red.length < lt.redCount) histState.red.push(n);
    else ltToast(`⚠️ 最多选择 ${lt.redCount} 个${lt.redName}`);
    updateHistDisplay();
  }, { ballClass: 'red-ball' });

  if (lt.blueRange > 0) {
    renderNumGrid('histBlueGrid', lt.blueRange, histState.blue, (n) => {
      const idx = histState.blue.indexOf(n);
      if (idx >= 0) histState.blue.splice(idx, 1);
      else if (histState.blue.length < lt.blueCount) histState.blue.push(n);
      else ltToast(`⚠️ 最多选择 ${lt.blueCount} 个${lt.blueName}`);
      updateHistDisplay();
    }, { ballClass: 'blue-ball' });
  }

  updateHistDisplay();
}

function updateHistDisplay() {
  const lt = LOTTERY_TYPES[currentLottery];
  ['red','blue'].forEach(k => {
    const container = document.getElementById('hist' + k.charAt(0).toUpperCase() + k.slice(1) + 'Balls');
    if (container) {
      const cls = k === 'red' ? 'red' : 'blue';
      container.innerHTML = histState[k].map(n => `<span class="selected-ball ${cls}">${n < 10 ? '0'+n : n}</span>`).join('');
    }
    const count = document.getElementById('hist' + k.charAt(0).toUpperCase() + k.slice(1) + 'Count');
    if (count) count.textContent = `已选 ${histState[k].length}/${lt[k === 'red' ? 'redCount' : 'blueCount'] || 0}`;
    const grid = document.getElementById('hist' + k.charAt(0).toUpperCase() + k.slice(1) + 'Grid');
    if (grid) {
      grid.querySelectorAll('.num-btn').forEach(btn => {
        const n = parseInt(btn.textContent);
        btn.classList.toggle('selected', histState[k].includes(n));
      });
    }
  });
}

function histClear() { histState.red = []; updateHistDisplay(); }
function histClearBlue() { histState.blue = []; updateHistDisplay(); }
function histRandom() {
  const lt = LOTTERY_TYPES[currentLottery];
  histState.red = [];
  while (histState.red.length < lt.redCount) {
    const n = Math.floor(Math.random() * lt.redRange) + 1;
    if (!histState.red.includes(n)) histState.red.push(n);
  }
  histState.red.sort((a, b) => a - b);
  updateHistDisplay();
}

function runHistoryCompare() {
  const lt = LOTTERY_TYPES[currentLottery];
  if (histState.red.length !== lt.redCount) {
    ltToast(`⚠️ 请选择 ${lt.redCount} 个${lt.redName}`);
    return;
  }
  if (lt.blueCount > 0 && histState.blue.length !== lt.blueCount) {
    ltToast(`⚠️ 请选择 ${lt.blueCount} 个${lt.blueName}`);
    return;
  }

  const data = generateMockSSQData();
  let matchCount = 0;
  const matches = [];

  data.forEach(d => {
    const redMatch = d.reds.filter(n => histState.red.includes(n)).length;
    const blueMatch = lt.blueCount > 0 ? (d.blue === histState.blue[0] ? 1 : 0) : 0;
    if (redMatch >= 4 || (redMatch >= 3 && blueMatch > 0) || (redMatch === 6)) {
      matchCount++;
      matches.push({ term: d.term, date: d.date, reds: d.reds, blue: d.blue, redMatch, blueMatch });
    }
  });

  let html = `<div style="font-size:16px;font-weight:600;margin-bottom:8px;">
    您的号码：${histState.red.join(', ')}${histState.blue.length > 0 ? ' + ' + histState.blue.join(',') : ''}
  </div>`;
  html += `<div>在近50期历史中，有 <strong>${matchCount}</strong> 期匹配到较高奖项（红球≥4或3+1）</div>`;

  if (matches.length > 0) {
    html += '<div style="margin-top:8px;max-height:300px;overflow-y:auto;">';
    matches.forEach(m => {
      html += `<div style="font-size:13px;margin:4px 0;padding:4px 8px;background:${m.redMatch === 6 ? '#fef3c7' : 'var(--bg)'};border-radius:6px;">
        第${m.term}期 (${m.date})：${m.reds.map(n => `<span class="selected-ball red" style="width:22px;height:22px;font-size:10px;display:inline-flex;">${n < 10 ? '0'+n : n}</span>`).join('')}
        ${lt.blueCount > 0 ? `<span class="selected-ball blue" style="width:22px;height:22px;font-size:10px;display:inline-flex;">${m.blue < 10 ? '0'+m.blue : m.blue}</span>` : ''}
        → 红球中${m.redMatch}个${m.blueMatch > 0 ? '，蓝球中' + m.blueMatch + '个' : ''}
      </div>`;
    });
    html += '</div>';
  }

  document.getElementById('histDetail').innerHTML = html;
}

// ============================================================
// 历史上的今天
// ============================================================
function renderTodayTool() {
  const lt = LOTTERY_TYPES[currentLottery];
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `
    <div class="lottery-tool-section">
      <h3>📅 历史上的今天</h3>
      <div class="lottery-tip">${lt.name}在${month}月${day}日的历史开奖记录</div>
      <div id="todayContent">
        <div class="btn-group" style="margin-top:8px;">
          <button class="btn btn-primary" onclick="loadTodayHistory()">📅 查询</button>
        </div>
        <div class="lottery-result" id="todayResult">
          <div class="result-title">📊 历史今日开奖</div>
          <div id="todayDetail"></div>
        </div>
      </div>
    </div>
  `;
}

function initTodayTool() {
  setTimeout(() => loadTodayHistory(), 100);
}

function loadTodayHistory() {
  const lt = LOTTERY_TYPES[currentLottery];
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // 模拟历史上的今天开奖数据
  const data = [];
  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013];

  years.forEach(year => {
    if (lt.isDigit) {
      data.push({
        date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        nums: Array.from({length: lt.digitCount || 3}, () => Math.floor(Math.random() * 10))
      });
    } else {
      const reds = [];
      while (reds.length < lt.redCount) {
        const n = Math.floor(Math.random() * lt.redRange) + 1;
        if (!reds.includes(n)) reds.push(n);
      }
      reds.sort((a, b) => a - b);
      let blue = 0;
      if (lt.blueCount > 0) {
        blue = Math.floor(Math.random() * lt.blueRange) + 1;
      }
      data.push({ date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`, reds, blue });
    }
  });

  if (data.length === 0) {
    document.getElementById('todayDetail').innerHTML = '<div class="lottery-tip">暂无数据</div>';
    return;
  }

  let html = `<div style="font-size:13px;color:var(--text-light);margin-bottom:12px;">共查询到 ${data.length} 期历史记录</div>`;

  data.forEach(d => {
    if (lt.isDigit) {
      html += `<div style="font-size:13px;margin:6px 0;padding:6px 10px;background:var(--bg);border-radius:6px;display:flex;align-items:center;gap:8px;">
        <span style="font-weight:600;min-width:130px;">${d.date}</span>
        <span style="font-family:monospace;">
          ${d.nums.map(n => `<span class="selected-ball" style="width:24px;height:24px;font-size:11px;display:inline-flex;background:var(--primary);color:#fff;">${n}</span>`).join('')}
        </span>
      </div>`;
    } else {
      html += `<div style="font-size:13px;margin:6px 0;padding:6px 10px;background:var(--bg);border-radius:6px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <span style="font-weight:600;min-width:130px;">${d.date}</span>
        ${d.reds.map(n => `<span class="selected-ball red" style="width:24px;height:24px;font-size:11px;display:inline-flex;">${n < 10 ? '0' + n : n}</span>`).join('')}
        ${d.blue > 0 ? `<span class="selected-ball blue" style="width:24px;height:24px;font-size:11px;display:inline-flex;">${d.blue < 10 ? '0' + d.blue : d.blue}</span>` : ''}
      </div>`;
    }
  });

  document.getElementById('todayDetail').innerHTML = html;
}