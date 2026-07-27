// ============================================================
// 彩票缩水工具 - 3D扩展工具集
// 追号计算器、各类遗漏统计、全排列组号器
// ============================================================

// ---- 模拟3D开奖数据 ----
function generate3DMockData(count) {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push({
      term: (2026001 + i).toString(),
      nums: [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10)
      ]
    });
  }
  return data;
}

// ============================================================
// 追号计算器
// ============================================================
function renderZhuiHaoTool() {
  return `
    <div class="lottery-tool-section">
      <h3>🏃 追号计算器</h3>
      <div class="lottery-tip">计算追号方案：每期投入固定金额，计算盈亏情况</div>
      <div class="lottery-input-row">
        <label>每期投注金额（元）：</label>
        <input type="number" id="zhPerBet" value="10" min="1" style="width:100px;">
      </div>
      <div class="lottery-input-row">
        <label>追号期数：</label>
        <input type="number" id="zhPeriods" value="10" min="1" max="1000" style="width:100px;">
      </div>
      <div class="lottery-input-row">
        <label>预计奖金（元）：</label>
        <input type="number" id="zhPrize" value="1040" min="1" style="width:120px;">
        <span style="font-size:12px;color:var(--text-light);">（直选1040元，组三346元，组六173元）</span>
      </div>
      <div class="lottery-input-row">
        <label>中奖率：</label>
        <select id="zhRate" style="width:120px;">
          <option value="0.001">直选 1/1000</option>
          <option value="0.003">组三 1/333</option>
          <option value="0.006">组六 1/167</option>
          <option value="0.01">1%</option>
          <option value="0.1">10%</option>
          <option value="0.5">50%</option>
        </select>
      </div>
      <div class="btn-group" style="margin-top:16px;">
        <button class="btn btn-primary" onclick="calcZhuiHao()">🧮 计算方案</button>
      </div>
      <div class="lottery-result" id="zhResult">
        <div class="result-title">📊 追号方案</div>
        <div id="zhDetail"></div>
      </div>
      <div class="omit-table-wrapper" style="margin-top:12px;">
        <table class="omit-table" id="zhTable">
          <thead>
            <tr>
              <th>期数</th>
              <th>本期投入</th>
              <th>累计投入</th>
              <th>中奖概率</th>
              <th>中奖后收益</th>
            </tr>
          </thead>
          <tbody id="zhBody"></tbody>
        </table>
      </div>
    </div>
  `;
}

function initZhuiHaoTool() {}

function calcZhuiHao() {
  const perBet = parseFloat(document.getElementById('zhPerBet').value) || 10;
  const periods = parseInt(document.getElementById('zhPeriods').value) || 10;
  const prize = parseFloat(document.getElementById('zhPrize').value) || 1040;
  const rate = parseFloat(document.getElementById('zhRate').value) || 0.001;

  const tbody = document.getElementById('zhBody');
  if (!tbody) return;

  let html = '';
  let totalCost = 0;
  let cumulativeProb = 0;
  let noWinProb = 1;

  for (let i = 1; i <= periods; i++) {
    totalCost += perBet;
    noWinProb *= (1 - rate);
    const winProb = 1 - noWinProb;
    const profit = prize - totalCost;

    html += `<tr>
      <td>第${i}期</td>
      <td>${perBet.toFixed(0)}</td>
      <td>${totalCost.toFixed(0)}</td>
      <td>${(winProb * 100).toFixed(2)}%</td>
      <td style="color:${profit >= 0 ? '#10b981' : '#ef4444'};font-weight:${profit >= 0 ? '700' : '400'};">${profit >= 0 ? '+' : ''}${profit.toFixed(0)}</td>
    </tr>`;
  }
  tbody.innerHTML = html;

  document.getElementById('zhDetail').innerHTML = `
    <div style="font-size:14px;line-height:1.8;">
      <strong>追号方案：</strong>每期投 ${perBet.toFixed(0)} 元，追 ${periods} 期<br>
      <strong>总投入：</strong>${totalCost.toFixed(0)} 元<br>
      <strong>预期奖金：</strong>${prize.toFixed(0)} 元<br>
      <strong>${periods}期内中奖概率：</strong>${(1 - noWinProb) * 100}%<br>
      <strong>盈亏平衡点：</strong>第${Math.ceil(prize / perBet)}期（需在之前中奖才盈利）
    </div>
  `;
}

// ============================================================
// 通用遗漏统计工具
// ============================================================

// ---- 获取3D遗漏数据 ----
function get3DOmitStats(calcFn) {
  const data = generate3DMockData(100);
  const stats = [];
  const allValues = new Set();

  data.forEach(d => {
    const val = calcFn(d.nums);
    allValues.add(val);
  });

  for (const val of allValues) {
    let lastAppear = -1;
    let maxOmit = 0;
    let currentOmit = 0;
    let totalAppear = 0;

    for (let i = 0; i < data.length; i++) {
      const v = calcFn(data[i].nums);
      if (v === val) {
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
    const avgOmit = totalAppear > 0 ? (data.length - totalAppear) / totalAppear : 0;

    stats.push({
      value: val,
      appear: totalAppear,
      maxOmit: maxOmit,
      currentOmit: currentOmit,
      avgOmit: avgOmit.toFixed(2),
      desireRate: (avgOmit > 0 ? currentOmit / avgOmit : 0).toFixed(2)
    });
  }

  stats.sort((a, b) => {
    if (typeof a.value === 'number') return a.value - b.value;
    return String(a.value).localeCompare(String(b.value));
  });
  return stats;
}

function renderOmitTable(stats, valueName) {
  if (!stats || stats.length === 0) return '<div class="lottery-tip">暂无数据</div>';
  let html = `<div class="omit-table-wrapper"><table class="omit-table">
    <thead><tr>
      <th>${valueName}</th>
      <th>出现次数</th>
      <th>平均遗漏</th>
      <th>最大遗漏</th>
      <th>当前遗漏</th>
      <th>欲出几率</th>
    </tr></thead><tbody>`;
  stats.forEach(s => {
    const isHigh = s.currentOmit > s.avgOmit * 1.5;
    html += `<tr>
      <td class="num-cell" style="font-weight:700;">${s.value}</td>
      <td>${s.appear}</td>
      <td>${s.avgOmit}</td>
      <td class="${s.maxOmit > 20 ? 'omit-high' : ''}">${s.maxOmit}</td>
      <td class="${isHigh ? 'omit-high' : ''}">${s.currentOmit}</td>
      <td>${s.desireRate}</td>
    </tr>`;
  });
  html += '</tbody></table></div>';
  return html;
}

// ============================================================
// 和值遗漏
// ============================================================
function renderSumOmitTool() {
  return `
    <div class="lottery-tool-section">
      <h3>📊 和值遗漏统计</h3>
      <div class="lottery-tip">3D/排列三和值（0-27）的遗漏情况统计</div>
      <div id="sumOmitContent"></div>
      <div class="btn-group" style="margin-top:12px;">
        <button class="btn btn-primary" onclick="refreshSumOmit()">🔄 刷新</button>
      </div>
    </div>
  `;
}

function initSumOmitTool() { refreshSumOmit(); }

function refreshSumOmit() {
  const stats = get3DOmitStats(nums => calc3DSum(nums));
  document.getElementById('sumOmitContent').innerHTML = renderOmitTable(stats, '和值');
}

// ============================================================
// 数字遗漏
// ============================================================
function renderNumOmitTool() {
  return `
    <div class="lottery-tool-section">
      <h3>📊 数字遗漏统计</h3>
      <div class="lottery-tip">各数字在百十个位上的遗漏情况</div>
      <div id="numOmitContent"></div>
      <div class="btn-group" style="margin-top:12px;">
        <button class="btn btn-primary" onclick="refreshNumOmit()">🔄 刷新</button>
      </div>
    </div>
  `;
}

function initNumOmitTool() { refreshNumOmit(); }

function refreshNumOmit() {
  const data = generate3DMockData(100);
  const positions = ['百位', '十位', '个位'];
  let html = '';

  for (let pos = 0; pos < 3; pos++) {
    const stats = [];
    for (let n = 0; n < 10; n++) {
      let lastAppear = -1, maxOmit = 0, currentOmit = 0, totalAppear = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].nums[pos] === n) {
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
      const avgOmit = totalAppear > 0 ? (data.length - totalAppear) / totalAppear : 0;
      stats.push({ value: n, appear: totalAppear, maxOmit, currentOmit, avgOmit: avgOmit.toFixed(2), desireRate: (avgOmit > 0 ? currentOmit / avgOmit : 0).toFixed(2) });
    }
    html += `<div style="font-size:14px;font-weight:600;margin:12px 0 4px;">${positions[pos]}</div>`;
    html += renderOmitTable(stats, '数字');
  }
  document.getElementById('numOmitContent').innerHTML = html;
}

// ============================================================
// 单双遗漏
// ============================================================
function renderOeOmitTool() {
  return `
    <div class="lottery-tool-section">
      <h3>📊 单双遗漏统计</h3>
      <div class="lottery-tip">百十个位单双形态遗漏</div>
      <div id="oeOmitContent"></div>
      <div class="btn-group" style="margin-top:12px;">
        <button class="btn btn-primary" onclick="refreshOeOmit()">🔄 刷新</button>
      </div>
    </div>
  `;
}

function initOeOmitTool() { refreshOeOmit(); }

function refreshOeOmit() {
  const data = generate3DMockData(100);
  const positions = ['百位', '十位', '个位'];
  let html = '';

  for (let pos = 0; pos < 3; pos++) {
    const stats = [];
    for (const oe of ['奇', '偶']) {
      let lastAppear = -1, maxOmit = 0, currentOmit = 0, totalAppear = 0;
      for (let i = 0; i < data.length; i++) {
        const isOdd = data[i].nums[pos] % 2 === 1;
        const match = oe === '奇' ? isOdd : !isOdd;
        if (match) {
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
      const avgOmit = totalAppear > 0 ? (data.length - totalAppear) / totalAppear : 0;
      stats.push({ value: oe, appear: totalAppear, maxOmit, currentOmit, avgOmit: avgOmit.toFixed(2), desireRate: (avgOmit > 0 ? currentOmit / avgOmit : 0).toFixed(2) });
    }
    html += `<div style="font-size:14px;font-weight:600;margin:12px 0 4px;">${positions[pos]}</div>`;
    html += renderOmitTable(stats, '单双');
  }
  document.getElementById('oeOmitContent').innerHTML = html;
}

// ============================================================
// 大小遗漏
// ============================================================
function renderSizeOmitTool() {
  return `
    <div class="lottery-tool-section">
      <h3>📊 大小遗漏统计</h3>
      <div class="lottery-tip">百十个位大小形态遗漏（5-9为大，0-4为小）</div>
      <div id="sizeOmitContent"></div>
      <div class="btn-group" style="margin-top:12px;">
        <button class="btn btn-primary" onclick="refreshSizeOmit()">🔄 刷新</button>
      </div>
    </div>
  `;
}

function initSizeOmitTool() { refreshSizeOmit(); }

function refreshSizeOmit() {
  const data = generate3DMockData(100);
  const positions = ['百位', '十位', '个位'];
  let html = '';

  for (let pos = 0; pos < 3; pos++) {
    const stats = [];
    for (const sz of ['大', '小']) {
      let lastAppear = -1, maxOmit = 0, currentOmit = 0, totalAppear = 0;
      for (let i = 0; i < data.length; i++) {
        const isBig = data[i].nums[pos] >= 5;
        const match = sz === '大' ? isBig : !isBig;
        if (match) {
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
      const avgOmit = totalAppear > 0 ? (data.length - totalAppear) / totalAppear : 0;
      stats.push({ value: sz, appear: totalAppear, maxOmit, currentOmit, avgOmit: avgOmit.toFixed(2), desireRate: (avgOmit > 0 ? currentOmit / avgOmit : 0).toFixed(2) });
    }
    html += `<div style="font-size:14px;font-weight:600;margin:12px 0 4px;">${positions[pos]}</div>`;
    html += renderOmitTable(stats, '大小');
  }
  document.getElementById('sizeOmitContent').innerHTML = html;
}

// ============================================================
// 质合遗漏
// ============================================================
function renderPrimeOmitTool() {
  return `
    <div class="lottery-tool-section">
      <h3>📊 质合遗漏统计</h3>
      <div class="lottery-tip">百十个位质合形态遗漏（质数：1,2,3,5,7；合数：0,4,6,8,9）</div>
      <div id="primeOmitContent"></div>
      <div class="btn-group" style="margin-top:12px;">
        <button class="btn btn-primary" onclick="refreshPrimeOmit()">🔄 刷新</button>
      </div>
    </div>
  `;
}

function initPrimeOmitTool() { refreshPrimeOmit(); }

function refreshPrimeOmit() {
  const data = generate3DMockData(100);
  const positions = ['百位', '十位', '个位'];
  let html = '';

  for (let pos = 0; pos < 3; pos++) {
    const stats = [];
    for (const zh of ['质', '合']) {
      let lastAppear = -1, maxOmit = 0, currentOmit = 0, totalAppear = 0;
      for (let i = 0; i < data.length; i++) {
        const isPrime = isPrime3D(data[i].nums[pos]);
        const match = zh === '质' ? isPrime : !isPrime;
        if (match) {
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
      const avgOmit = totalAppear > 0 ? (data.length - totalAppear) / totalAppear : 0;
      stats.push({ value: zh, appear: totalAppear, maxOmit, currentOmit, avgOmit: avgOmit.toFixed(2), desireRate: (avgOmit > 0 ? currentOmit / avgOmit : 0).toFixed(2) });
    }
    html += `<div style="font-size:14px;font-weight:600;margin:12px 0 4px;">${positions[pos]}</div>`;
    html += renderOmitTable(stats, '质合');
  }
  document.getElementById('primeOmitContent').innerHTML = html;
}

function isPrime3D(n) {
  return [1, 2, 3, 5, 7].includes(n);
}

// ============================================================
// 跨度遗漏
// ============================================================
function renderSpanOmitTool() {
  return `
    <div class="lottery-tool-section">
      <h3>📊 跨度遗漏统计</h3>
      <div class="lottery-tip">跨度（最大-最小）的遗漏情况</div>
      <div id="spanOmitContent"></div>
      <div class="btn-group" style="margin-top:12px;">
        <button class="btn btn-primary" onclick="refreshSpanOmit()">🔄 刷新</button>
      </div>
    </div>
  `;
}

function initSpanOmitTool() { refreshSpanOmit(); }

function refreshSpanOmit() {
  const stats = get3DOmitStats(nums => calc3DSpan(nums));
  document.getElementById('spanOmitContent').innerHTML = renderOmitTable(stats, '跨度');
}

// ============================================================
// 012路遗漏
// ============================================================
function renderD012OmitTool() {
  return `
    <div class="lottery-tool-section">
      <h3>📊 012路遗漏统计</h3>
      <div class="lottery-tip">百十个位除3余数组合的遗漏情况</div>
      <div id="d012OmitContent"></div>
      <div class="btn-group" style="margin-top:12px;">
        <button class="btn btn-primary" onclick="refreshD012Omit()">🔄 刷新</button>
      </div>
    </div>
  `;
}

function initD012OmitTool() { refreshD012Omit(); }

function refreshD012Omit() {
  const stats = get3DOmitStats(nums => calc3D012(nums));
  document.getElementById('d012OmitContent').innerHTML = renderOmitTable(stats, '012路');
}

// ============================================================
// 和尾遗漏
// ============================================================
function renderTailOmitTool() {
  return `
    <div class="lottery-tool-section">
      <h3>📊 和尾遗漏统计</h3>
      <div class="lottery-tip">和值尾数（0-9）的遗漏情况</div>
      <div id="tailOmitContent"></div>
      <div class="btn-group" style="margin-top:12px;">
        <button class="btn btn-primary" onclick="refreshTailOmit()">🔄 刷新</button>
      </div>
    </div>
  `;
}

function initTailOmitTool() { refreshTailOmit(); }

function refreshTailOmit() {
  const stats = get3DOmitStats(nums => calc3DTail(nums));
  document.getElementById('tailOmitContent').innerHTML = renderOmitTable(stats, '和尾');
}

// ============================================================
// 大小全排列组号器
// ============================================================
function renderDaxiaoArrayTool() {
  return `
    <div class="lottery-tool-section">
      <h3>🔢 大小全排列组号器</h3>
      <div class="lottery-tip">选择大（5-9）小（0-4）的排列组合，生成所有对应号码</div>
      <div class="lottery-input-row">
        <label>选择大小形态：</label>
        <div class="filter-options" id="daxiaoArrayOpts">
          <span class="filter-chip" data-v="大" onclick="toggleFilterChip(this,'daxiaoArrayOpts')">大</span>
          <span class="filter-chip" data-v="小" onclick="toggleFilterChip(this,'daxiaoArrayOpts')">小</span>
        </div>
      </div>
      <div class="lottery-tip info">提示：每一位选"大"或"小"，选满3位后系统自动生成所有号码组合</div>
      <div class="btn-group" style="margin-top:12px;">
        <button class="btn btn-primary" onclick="genDaxiaoArray()">🔢 生成号码</button>
        <button class="btn btn-secondary" onclick="clearArrayResult()">清空</button>
      </div>
      <div class="lottery-result" id="daxiaoArrayResult">
        <div class="result-title">📊 生成结果</div>
        <div class="result-count" id="daxiaoArrayCount">共 0 注</div>
        <div style="margin-top:8px;font-size:13px;" id="daxiaoArrayDetail"></div>
      </div>
    </div>
  `;
}

function initDaxiaoArrayTool() {}

function genDaxiaoArray() {
  const selected = getFilterChipValues('daxiaoArrayOpts');
  if (selected.length < 3) {
    ltToast('⚠️ 请选择3位的大小形态');
    return;
  }
  const pattern = selected.join('');
  const bigNums = [5, 6, 7, 8, 9];
  const smallNums = [0, 1, 2, 3, 4];

  const results = [];
  for (const a of (pattern[0] === '大' ? bigNums : smallNums)) {
    for (const b of (pattern[1] === '大' ? bigNums : smallNums)) {
      for (const c of (pattern[2] === '大' ? bigNums : smallNums)) {
        results.push([a, b, c]);
      }
    }
  }

  document.getElementById('daxiaoArrayCount').textContent = `共 ${results.length} 注`;
  if (results.length > 0) {
    let html = `<div style="font-size:12px;color:var(--text-light);margin-bottom:8px;">形态：${pattern}</div>`;
    results.slice(0, 100).forEach((n, i) => {
      html += `<div style="margin:2px 0;font-size:13px;font-family:monospace;">${i+1}. ${n.join(' ')}</div>`;
    });
    if (results.length > 100) html += `<div style="color:var(--text-light);font-size:12px;">...共${results.length}注</div>`;
    document.getElementById('daxiaoArrayDetail').innerHTML = html;
  }
}

// ============================================================
// 奇偶全排列组号器
// ============================================================
function renderJiouArrayTool() {
  return `
    <div class="lottery-tool-section">
      <h3>🔢 奇偶全排列组号器</h3>
      <div class="lottery-tip">选择奇偶的排列组合，生成所有对应号码</div>
      <div class="lottery-input-row">
        <label>选择奇偶形态：</label>
        <div class="filter-options" id="jiouArrayOpts">
          <span class="filter-chip" data-v="奇" onclick="toggleFilterChip(this,'jiouArrayOpts')">奇</span>
          <span class="filter-chip" data-v="偶" onclick="toggleFilterChip(this,'jiouArrayOpts')">偶</span>
        </div>
      </div>
      <div class="lottery-tip info">每一位选"奇"或"偶"，选满3位后自动生成</div>
      <div class="btn-group" style="margin-top:12px;">
        <button class="btn btn-primary" onclick="genJiouArray()">🔢 生成号码</button>
        <button class="btn btn-secondary" onclick="clearArrayResult()">清空</button>
      </div>
      <div class="lottery-result" id="jiouArrayResult">
        <div class="result-title">📊 生成结果</div>
        <div class="result-count" id="jiouArrayCount">共 0 注</div>
        <div style="margin-top:8px;font-size:13px;" id="jiouArrayDetail"></div>
      </div>
    </div>
  `;
}

function initJiouArrayTool() {}

function genJiouArray() {
  const selected = getFilterChipValues('jiouArrayOpts');
  if (selected.length < 3) {
    ltToast('⚠️ 请选择3位的奇偶形态');
    return;
  }
  const pattern = selected.join('');
  const oddNums = [1, 3, 5, 7, 9];
  const evenNums = [0, 2, 4, 6, 8];

  const results = [];
  for (const a of (pattern[0] === '奇' ? oddNums : evenNums)) {
    for (const b of (pattern[1] === '奇' ? oddNums : evenNums)) {
      for (const c of (pattern[2] === '奇' ? oddNums : evenNums)) {
        results.push([a, b, c]);
      }
    }
  }

  document.getElementById('jiouArrayCount').textContent = `共 ${results.length} 注`;
  if (results.length > 0) {
    let html = `<div style="font-size:12px;color:var(--text-light);margin-bottom:8px;">形态：${pattern}</div>`;
    results.slice(0, 100).forEach((n, i) => {
      html += `<div style="margin:2px 0;font-size:13px;font-family:monospace;">${i+1}. ${n.join(' ')}</div>`;
    });
    if (results.length > 100) html += `<div style="color:var(--text-light);font-size:12px;">...共${results.length}注</div>`;
    document.getElementById('jiouArrayDetail').innerHTML = html;
  }
}

// ============================================================
// 和值全排列组号器
// ============================================================
function renderHzArrayTool() {
  return `
    <div class="lottery-tool-section">
      <h3>🔢 和值全排列组号器</h3>
      <div class="lottery-tip">选择和值，生成所有对应号码</div>
      <div class="lottery-input-row">
        <label>选择和值（0-27）：</label>
        <div class="filter-options" id="hzArrayOpts" style="max-height:120px;overflow-y:auto;">
          <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'hzArrayOpts')">不限</span>
          ${Array.from({length:28}, (_, i) => `<span class="filter-chip" data-v="${i}" onclick="toggleFilterChip(this,'hzArrayOpts')">${i < 10 ? '0' + i : i}</span>`).join('')}
        </div>
      </div>
      <div class="btn-group" style="margin-top:12px;">
        <button class="btn btn-primary" onclick="genHzArray()">🔢 生成号码</button>
        <button class="btn btn-secondary" onclick="clearArrayResult()">清空</button>
      </div>
      <div class="lottery-result" id="hzArrayResult">
        <div class="result-title">📊 生成结果</div>
        <div class="result-count" id="hzArrayCount">共 0 注</div>
        <div class="result-cost" id="hzArrayCost">0 元</div>
        <div style="margin-top:8px;font-size:13px;" id="hzArrayDetail"></div>
      </div>
    </div>
  `;
}

function initHzArrayTool() {}

function genHzArray() {
  const selected = getFilterChipValues('hzArrayOpts');
  if (selected.length === 0 || selected.includes('any')) {
    ltToast('⚠️ 请选择至少一个和值');
    return;
  }

  const targetSums = selected.map(Number);
  const results = [];

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      for (let k = 0; k < 10; k++) {
        if (targetSums.includes(i + j + k)) {
          results.push([i, j, k]);
        }
      }
    }
  }

  document.getElementById('hzArrayCount').textContent = `共 ${results.length} 注`;
  document.getElementById('hzArrayCost').textContent = `共计 ${(results.length * 2).toLocaleString()} 元`;

  if (results.length > 0) {
    let html = `<div style="font-size:12px;color:var(--text-light);margin-bottom:8px;">和值：${selected.join(', ')}</div>`;
    results.slice(0, 100).forEach((n, i) => {
      html += `<div style="margin:2px 0;font-size:13px;font-family:monospace;">${i+1}. ${n.join(' ')}</div>`;
    });
    if (results.length > 100) html += `<div style="color:var(--text-light);font-size:12px;">...共${results.length}注</div>`;
    document.getElementById('hzArrayDetail').innerHTML = html;
  }
}

// ---- 清空结果通用函数 ----
function clearArrayResult() {
  ['daxiaoArray', 'jiouArray', 'hzArray'].forEach(prefix => {
    const count = document.getElementById(prefix + 'Count');
    const detail = document.getElementById(prefix + 'Detail');
    const cost = document.getElementById(prefix + 'Cost');
    if (count) count.textContent = '共 0 注';
    if (detail) detail.innerHTML = '';
    if (cost) cost.textContent = '0 元';
  });
}