// ============================================================
// 彩票缩水工具 - 在线过滤/缩水 渲染与逻辑
// ============================================================

// ---- 当前状态 ----
let filterState = { red: [], blue: [], dantuo: [], blueDantuo: [] };
let randomState = { count: 5 };
let dantuoState = { red: [], blue: [], redDantuo: [], blueDantuo: [] };
let compoundState = { red: [], blue: [] };

// ============================================================
// 在线过滤/缩水
// ============================================================
function renderFilterTool() {
  const lt = LOTTERY_TYPES[currentLottery];
  if (lt.isDigit) return render3DFilterTool();
  if (currentLottery === 'qxc') return renderQxcFilterTool();

  const isSSQ = currentLottery === 'ssq';
  const isDLT = currentLottery === 'dlt';

  return `
    <div class="lottery-tool-section">
      <h3>🔍 ${lt.name} 在线过滤缩水</h3>
      <div class="lottery-tip">选择号码并设置过滤条件，系统将自动计算符合条件的注数。</div>

      <div style="margin-bottom:16px;">
        <div class="ball-row">
          <span class="ball-row-label">${lt.redName}：</span>
          <div id="filterRedBalls" class="selected-balls"></div>
        </div>
        <div id="filterRedGrid"></div>
        <div class="action-row" style="margin-top:4px;">
          <button class="action-btn" onclick="filterSelectAll('red')">全选</button>
          <button class="action-btn" onclick="filterClearAll('red')">清除</button>
          <button class="action-btn" onclick="filterSelectOdd('red')">选奇数</button>
          <button class="action-btn" onclick="filterSelectEven('red')">选偶数</button>
          <span id="filterRedCount" style="font-size:12px;color:var(--text-light);margin-left:8px;">已选 0 个</span>
        </div>
      </div>

      ${!isSSQ && !isDLT ? '' : `
      <div style="margin-bottom:16px;">
        <div class="ball-row">
          <span class="ball-row-label">${lt.blueName}：</span>
          <div id="filterBlueBalls" class="selected-balls"></div>
        </div>
        <div id="filterBlueGrid"></div>
        <div class="action-row" style="margin-top:4px;">
          <button class="action-btn" onclick="filterSelectAll('blue')">全选</button>
          <button class="action-btn" onclick="filterClearAll('blue')">清除</button>
          <span id="filterBlueCount" style="font-size:12px;color:var(--text-light);margin-left:8px;">已选 0 个</span>
        </div>
      </div>
      `}

      <div class="section-divider"></div>

      <div class="section-desc">
        <strong>📌 缩水条件</strong>（不选则不限制）
      </div>

      ${isSSQ ? renderSSQFilterConditions() : isDLT ? renderDLTFilterConditions() : renderSimpleFilterConditions()}

      <div class="btn-group" style="margin-top:16px;">
        <button class="btn btn-primary" onclick="runFilter()">🔍 开始过滤</button>
        <button class="btn btn-secondary" onclick="resetFilter()">🔄 重置</button>
      </div>

      <div class="lottery-result" id="filterResult">
        <div class="result-title">📊 过滤结果</div>
        <div class="result-count" id="filterCount">共 0 注</div>
        <div class="result-cost" id="filterCost">0 元</div>
        <div style="margin-top:8px;font-size:13px;" id="filterDetail"></div>
      </div>
    </div>
  `;
}

function renderSSQFilterConditions() {
  return `
    <div class="lottery-input-row">
      <label>AC值：</label>
      <div class="filter-options" id="filterAC">
        <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'filterAC')">不限</span>
        ${Array.from({length:11},(_,i)=>`<span class="filter-chip" data-v="${i}" onclick="toggleFilterChip(this,'filterAC')">${i}</span>`).join('')}
      </div>
    </div>
    <div class="lottery-input-row">
      <label>和值范围：</label>
      <input type="number" id="filterSumMin" placeholder="最小" style="width:70px;"> ~
      <input type="number" id="filterSumMax" placeholder="最大" style="width:70px;">
      <span style="font-size:12px;color:var(--text-light);">(21-183)</span>
    </div>
    <div class="lottery-input-row">
      <label>奇偶比：</label>
      <div class="filter-options" id="filterOE">
        <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'filterOE')">不限</span>
        ${['0:6','1:5','2:4','3:3','4:2','5:1','6:0'].map(v=>`<span class="filter-chip" data-v="${v}" onclick="toggleFilterChip(this,'filterOE')">${v}</span>`).join('')}
      </div>
    </div>
    <div class="lottery-input-row">
      <label>大小比：</label>
      <div class="filter-options" id="filterBS">
        <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'filterBS')">不限</span>
        ${['0:6','1:5','2:4','3:3','4:2','5:1','6:0'].map(v=>`<span class="filter-chip" data-v="${v}" onclick="toggleFilterChip(this,'filterBS')">${v}</span>`).join('')}
      </div>
      <span style="font-size:12px;color:var(--text-light);">(16以上为大)</span>
    </div>
    <div class="lottery-input-row">
      <label>质合比：</label>
      <div class="filter-options" id="filterPC">
        <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'filterPC')">不限</span>
        ${['0:6','1:5','2:4','3:3','4:2','5:1','6:0'].map(v=>`<span class="filter-chip" data-v="${v}" onclick="toggleFilterChip(this,'filterPC')">${v}</span>`).join('')}
      </div>
    </div>
    <div class="lottery-input-row">
      <label>连号组数：</label>
      <div class="filter-options" id="filterCG">
        <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'filterCG')">不限</span>
        ${['无连号','1连号','2连号','3连号','4连号','5连号'].map((v,i)=>`<span class="filter-chip" data-v="${i}" onclick="toggleFilterChip(this,'filterCG')">${v}</span>`).join('')}
      </div>
    </div>
    <div class="lottery-input-row">
      <label>尾数不同数：</label>
      <div class="filter-options" id="filterTail">
        <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'filterTail')">不限</span>
        ${[2,3,4,5,6].map(v=>`<span class="filter-chip" data-v="${v}" onclick="toggleFilterChip(this,'filterTail')">${v}</span>`).join('')}
      </div>
    </div>
    <div class="lottery-input-row">
      <label>首位奇偶：</label>
      <div class="filter-options" id="filterFirstOE">
        <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'filterFirstOE')">不限</span>
        <span class="filter-chip" data-v="odd" onclick="toggleFilterChip(this,'filterFirstOE')">奇数</span>
        <span class="filter-chip" data-v="even" onclick="toggleFilterChip(this,'filterFirstOE')">偶数</span>
      </div>
    </div>
    <div class="lottery-input-row">
      <label>末位奇偶：</label>
      <div class="filter-options" id="filterLastOE">
        <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'filterLastOE')">不限</span>
        <span class="filter-chip" data-v="odd" onclick="toggleFilterChip(this,'filterLastOE')">奇数</span>
        <span class="filter-chip" data-v="even" onclick="toggleFilterChip(this,'filterLastOE')">偶数</span>
      </div>
    </div>
  `;
}

function renderDLTFilterConditions() {
  return `
    <div class="section-divider-label">前区条件</div>
    <div class="lottery-input-row">
      <label>AC值：</label>
      <div class="filter-options" id="filterAC">
        <span class="filter-chip selected" data-v="any" onclick="toggleFilterChip(this,'filterAC')">不限</span>
        ${Array.from({length:10},(_,i)=>`<span class="filter-chip" data-v="${i}" onclick="toggleFilterChip(this,'filterAC')">${i}</span>`).join('')}
      </div>
    </div>
    <div class="lottery-input-row">
      <label>和值范围：</label>
      <input type="number" id="filterSumMin" placeholder="最小" style="width:70px;"> ~
      <input type="number" id="filterSumMax" placeholder="最大" style="width:70px;">
    </div>
    <div class="lottery-input-row">
      <label>奇偶比：</label>
      <div class="filter-options" id="filterOE">
        <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'filterOE')">不限</span>
        ${['0:5','1:4','2:3','3:2','4:1','5:0'].map(v=>`<span class="filter-chip" data-v="${v}" onclick="toggleFilterChip(this,'filterOE')">${v}</span>`).join('')}
      </div>
    </div>
    <div class="lottery-input-row">
      <label>大小比：</label>
      <div class="filter-options" id="filterBS">
        <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'filterBS')">不限</span>
        ${['0:5','1:4','2:3','3:2','4:1','5:0'].map(v=>`<span class="filter-chip" data-v="${v}" onclick="toggleFilterChip(this,'filterBS')">${v}</span>`).join('')}
      </div>
      <span style="font-size:12px;color:var(--text-light);">(17以上为大)</span>
    </div>
    <div class="lottery-input-row">
      <label>质合比：</label>
      <div class="filter-options" id="filterPC">
        <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'filterPC')">不限</span>
        ${['0:5','1:4','2:3','3:2','4:1','5:0'].map(v=>`<span class="filter-chip" data-v="${v}" onclick="toggleFilterChip(this,'filterPC')">${v}</span>`).join('')}
      </div>
    </div>
    <div class="lottery-input-row">
      <label>连号组数：</label>
      <div class="filter-options" id="filterCG">
        <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'filterCG')">不限</span>
        ${['无连号','1连号','2连号','3连号','4连号'].map((v,i)=>`<span class="filter-chip" data-v="${i}" onclick="toggleFilterChip(this,'filterCG')">${v}</span>`).join('')}
      </div>
    </div>
    <div class="lottery-input-row">
      <label>尾数不同数：</label>
      <div class="filter-options" id="filterTail">
        <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'filterTail')">不限</span>
        ${[2,3,4,5].map(v=>`<span class="filter-chip" data-v="${v}" onclick="toggleFilterChip(this,'filterTail')">${v}</span>`).join('')}
      </div>
    </div>
    <div class="section-divider"></div>
    <div class="section-divider-label">后区条件</div>
    <div class="lottery-input-row">
      <label>和值范围：</label>
      <input type="number" id="filterBlueSumMin" placeholder="最小" style="width:70px;"> ~
      <input type="number" id="filterBlueSumMax" placeholder="最大" style="width:70px;">
    </div>
    <div class="lottery-input-row">
      <label>奇偶比：</label>
      <div class="filter-options" id="filterBlueOE">
        <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'filterBlueOE')">不限</span>
        ${['0:2','1:1','2:0'].map(v=>`<span class="filter-chip" data-v="${v}" onclick="toggleFilterChip(this,'filterBlueOE')">${v}</span>`).join('')}
      </div>
    </div>
    <div class="lottery-input-row">
      <label>大小比：</label>
      <div class="filter-options" id="filterBlueBS">
        <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'filterBlueBS')">不限</span>
        ${['0:2','1:1','2:0'].map(v=>`<span class="filter-chip" data-v="${v}" onclick="toggleFilterChip(this,'filterBlueBS')">${v}</span>`).join('')}
      </div>
      <span style="font-size:12px;color:var(--text-light);">(7以上为大)</span>
    </div>
    <div class="lottery-input-row">
      <label>质合比：</label>
      <div class="filter-options" id="filterBluePC">
        <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'filterBluePC')">不限</span>
        ${['0:2','1:1','2:0'].map(v=>`<span class="filter-chip" data-v="${v}" onclick="toggleFilterChip(this,'filterBluePC')">${v}</span>`).join('')}
      </div>
    </div>
    <div class="lottery-input-row">
      <label>连号组数：</label>
      <div class="filter-options" id="filterBlueCG">
        <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'filterBlueCG')">不限</span>
        <span class="filter-chip" data-v="0" onclick="toggleFilterChip(this,'filterBlueCG')">无连号</span>
        <span class="filter-chip" data-v="1" onclick="toggleFilterChip(this,'filterBlueCG')">1连号</span>
      </div>
    </div>
  `;
}

function renderSimpleFilterConditions() {
  return `
    <div class="lottery-input-row">
      <label>和值范围：</label>
      <input type="number" id="filterSumMin" placeholder="最小" style="width:70px;"> ~
      <input type="number" id="filterSumMax" placeholder="最大" style="width:70px;">
    </div>
    <div class="lottery-input-row">
      <label>奇偶比：</label>
      <div class="filter-options" id="filterOE">
        <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'filterOE')">不限</span>
        ${getOERatios().map(v=>`<span class="filter-chip" data-v="${v}" onclick="toggleFilterChip(this,'filterOE')">${v}</span>`).join('')}
      </div>
    </div>
    <div class="lottery-input-row">
      <label>大小比：</label>
      <div class="filter-options" id="filterBS">
        <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'filterBS')">不限</span>
        ${getBSRatios().map(v=>`<span class="filter-chip" data-v="${v}" onclick="toggleFilterChip(this,'filterBS')">${v}</span>`).join('')}
      </div>
    </div>
  `;
}

function getOERatios() {
  const lt = LOTTERY_TYPES[currentLottery];
  const n = lt.redCount || lt.digitCount || 5;
  return Array.from({length: n+1}, (_, i) => `${i}:${n-i}`);
}

function getBSRatios() {
  const lt = LOTTERY_TYPES[currentLottery];
  const n = lt.redCount || lt.digitCount || 5;
  return Array.from({length: n+1}, (_, i) => `${i}:${n-i}`);
}

// ---- 过滤芯片切换 ----
function toggleFilterChip(el, groupId) {
  el.classList.toggle('selected');
  // 如果点击"不限"，取消其他选择
  if (el.dataset.v === 'any' && el.classList.contains('selected')) {
    document.querySelectorAll(`#${groupId} .filter-chip`).forEach(c => {
      if (c !== el) c.classList.remove('selected');
    });
  } else {
    // 如果其他有选中，取消"不限"
    const any = document.querySelector(`#${groupId} .filter-chip[data-v="any"]`);
    if (any) any.classList.remove('selected');
  }
}

// ---- 获取过滤芯片选中值 ----
function getFilterChipValues(groupId) {
  const chips = document.querySelectorAll(`#${groupId} .filter-chip.selected`);
  const vals = [];
  chips.forEach(c => {
    const v = c.dataset.v;
    if (v !== 'any') vals.push(v);
  });
  return vals;
}

// ============================================================
// 过滤初始化
// ============================================================
function initFilterTool() {
  const lt = LOTTERY_TYPES[currentLottery];
  filterState = { red: [], blue: [], dantuo: [], blueDantuo: [] };

  if (lt.isDigit) {
    init3DFilterTool();
    return;
  }
  if (currentLottery === 'qxc') {
    initQxcFilterTool();
    return;
  }

  // 渲染红球
  renderNumGrid('filterRedGrid', lt.redRange, filterState.red, (n) => {
    const idx = filterState.red.indexOf(n);
    if (idx >= 0) filterState.red.splice(idx, 1);
    else filterState.red.push(n);
    updateFilterRedDisplay();
  }, { ballClass: 'red-ball' });

  // 渲染蓝球
  if (lt.blueRange > 0) {
    renderNumGrid('filterBlueGrid', lt.blueRange, filterState.blue, (n) => {
      const idx = filterState.blue.indexOf(n);
      if (idx >= 0) filterState.blue.splice(idx, 1);
      else filterState.blue.push(n);
      updateFilterBlueDisplay();
    }, { ballClass: 'blue-ball' });
  }

  updateFilterRedDisplay();
  updateFilterBlueDisplay();
}

function updateFilterRedDisplay() {
  const container = document.getElementById('filterRedBalls');
  if (!container) return;
  container.innerHTML = filterState.red.map(n => `<span class="selected-ball red">${n < 10 ? '0' + n : n}</span>`).join('');
  document.getElementById('filterRedCount').textContent = `已选 ${filterState.red.length} 个`;
  // 更新按钮状态
  document.querySelectorAll('#filterRedGrid .num-btn').forEach(btn => {
    const n = parseInt(btn.textContent);
    btn.classList.toggle('selected', filterState.red.includes(n));
  });
}

function updateFilterBlueDisplay() {
  const container = document.getElementById('filterBlueBalls');
  if (!container) return;
  container.innerHTML = filterState.blue.map(n => `<span class="selected-ball blue">${n < 10 ? '0' + n : n}</span>`).join('');
  document.getElementById('filterBlueCount').textContent = `已选 ${filterState.blue.length} 个`;
  document.querySelectorAll('#filterBlueGrid .num-btn').forEach(btn => {
    const n = parseInt(btn.textContent);
    btn.classList.toggle('selected', filterState.blue.includes(n));
  });
}

// ---- 全选/清除 ----
function filterSelectAll(color) {
  const lt = LOTTERY_TYPES[currentLottery];
  if (color === 'red') {
    filterState.red = Array.from({length: lt.redRange}, (_, i) => i + 1);
    updateFilterRedDisplay();
  } else {
    filterState.blue = Array.from({length: lt.blueRange}, (_, i) => i + 1);
    updateFilterBlueDisplay();
  }
}

function filterClearAll(color) {
  if (color === 'red') {
    filterState.red = [];
    updateFilterRedDisplay();
  } else {
    filterState.blue = [];
    updateFilterBlueDisplay();
  }
}

function filterSelectOdd(color) {
  const lt = LOTTERY_TYPES[currentLottery];
  if (color === 'red') {
    filterState.red = Array.from({length: lt.redRange}, (_, i) => i + 1).filter(n => n % 2 === 1);
    updateFilterRedDisplay();
  }
}

function filterSelectEven(color) {
  const lt = LOTTERY_TYPES[currentLottery];
  if (color === 'red') {
    filterState.red = Array.from({length: lt.redRange}, (_, i) => i + 1).filter(n => n % 2 === 0);
    updateFilterRedDisplay();
  }
}

// ============================================================
// 执行过滤
// ============================================================
function runFilter() {
  const lt = LOTTERY_TYPES[currentLottery];
  if (lt.isDigit) { run3DFilter(); return; }
  if (currentLottery === 'qxc') { runQxcFilter(); return; }

  const reds = [...filterState.red].sort((a, b) => a - b);
  const blues = [...filterState.blue].sort((a, b) => a - b);
  const redCount = lt.redCount;
  const blueCount = lt.blueCount || 0;

  if (reds.length < redCount) {
    ltToast(`⚠️ 请至少选择 ${redCount} 个${lt.redName}`);
    return;
  }

  // 获取条件
  const filterAC = getFilterChipValues('filterAC');
  const filterSumMin = parseInt(document.getElementById('filterSumMin')?.value);
  const filterSumMax = parseInt(document.getElementById('filterSumMax')?.value);
  const filterOE = getFilterChipValues('filterOE');
  const filterBS = getFilterChipValues('filterBS');
  const filterPC = getFilterChipValues('filterPC');
  const filterCG = getFilterChipValues('filterCG');
  const filterTail = getFilterChipValues('filterTail');
  const filterFirstOE = getFilterChipValues('filterFirstOE');
  const filterLastOE = getFilterChipValues('filterLastOE');

  // 大乐透后区条件
  const filterBlueSumMin = parseInt(document.getElementById('filterBlueSumMin')?.value);
  const filterBlueSumMax = parseInt(document.getElementById('filterBlueSumMax')?.value);
  const filterBlueOE = getFilterChipValues('filterBlueOE');
  const filterBlueBS = getFilterChipValues('filterBlueBS');
  const filterBluePC = getFilterChipValues('filterBluePC');
  const filterBlueCG = getFilterChipValues('filterBlueCG');

  const bigThreshold = currentLottery === 'dlt' ? 17 : 16;

  // 遍历所有组合
  let total = 0;
  let totalCost = 0;
  const sampleResults = [];

  for (const redCombo of combinations(reds, redCount)) {
    // 红球过滤
    if (filterAC.length > 0) {
      const ac = calcAC(redCombo);
      if (!filterAC.includes('' + ac)) continue;
    }
    if (!isNaN(filterSumMin) && arrSum(redCombo) < filterSumMin) continue;
    if (!isNaN(filterSumMax) && arrSum(redCombo) > filterSumMax) continue;
    if (filterOE.length > 0) {
      const oe = oddEvenRatio(redCombo);
      if (!filterOE.includes(oe)) continue;
    }
    if (filterBS.length > 0) {
      const bs = bigSmallRatio(redCombo, bigThreshold);
      if (!filterBS.includes(bs)) continue;
    }
    if (filterPC.length > 0) {
      const pc = primeCompositeRatio(redCombo);
      if (!filterPC.includes(pc)) continue;
    }
    if (filterCG.length > 0) {
      const cg = countConsecutiveGroups(redCombo);
      const cgVal = cg === 0 ? '0' : '' + cg;
      if (!filterCG.includes(cgVal) && !(cg === 0 && filterCG.includes('无连号'))) continue;
    }
    if (filterTail.length > 0) {
      const tail = countTailDiff(redCombo);
      if (!filterTail.includes('' + tail)) continue;
    }
    if (filterFirstOE.length > 0) {
      const first = redCombo[0];
      if (filterFirstOE.includes('odd') && first % 2 === 0) continue;
      if (filterFirstOE.includes('even') && first % 2 === 1) continue;
    }
    if (filterLastOE.length > 0) {
      const last = redCombo[redCombo.length - 1];
      if (filterLastOE.includes('odd') && last % 2 === 0) continue;
      if (filterLastOE.includes('even') && last % 2 === 1) continue;
    }

    if (blueCount === 0) {
      total++;
      if (sampleResults.length < 100) {
        sampleResults.push({ red: redCombo, blue: [] });
      }
    } else {
      // 蓝球组合
      for (const blueCombo of combinations(blues, blueCount)) {
        // 大乐透后区过滤
        if (currentLottery === 'dlt') {
          if (!isNaN(filterBlueSumMin) && arrSum(blueCombo) < filterBlueSumMin) continue;
          if (!isNaN(filterBlueSumMax) && arrSum(blueCombo) > filterBlueSumMax) continue;
          if (filterBlueOE.length > 0) {
            const oe = oddEvenRatio(blueCombo);
            if (!filterBlueOE.includes(oe)) continue;
          }
          if (filterBlueBS.length > 0) {
            const bs = bigSmallRatio(blueCombo, 7);
            if (!filterBlueBS.includes(bs)) continue;
          }
          if (filterBluePC.length > 0) {
            const pc = primeCompositeRatio(blueCombo);
            if (!filterBluePC.includes(pc)) continue;
          }
          if (filterBlueCG.length > 0) {
            const cg = countConsecutiveGroups(blueCombo);
            if (filterBlueCG.includes('0') && cg > 0) continue;
            if (filterBlueCG.includes('1') && cg !== 1) continue;
          }
        }
        total++;
        if (sampleResults.length < 100) {
          sampleResults.push({ red: redCombo, blue: blueCombo });
        }
      }
    }
  }

  const pricePer = currentLottery === 'dlt' ? 2 : 2;
  totalCost = total * pricePer;

  // 显示结果
  document.getElementById('filterCount').textContent = `共 ${total.toLocaleString()} 注`;
  document.getElementById('filterCost').textContent = `共计 ${totalCost.toLocaleString()} 元`;

  if (sampleResults.length > 0) {
    let detailHtml = '<div style="font-size:12px;color:var(--text-light);margin-bottom:8px;">前100注示例：</div>';
    sampleResults.forEach((r, i) => {
      const redStr = r.red.map(n => `<span class="selected-ball red" style="width:24px;height:24px;font-size:11px;display:inline-flex;">${n < 10 ? '0'+n : n}</span>`).join('');
      let blueStr = '';
      if (r.blue.length > 0) {
        blueStr = ' + ' + r.blue.map(n => `<span class="selected-ball blue" style="width:24px;height:24px;font-size:11px;display:inline-flex;">${n < 10 ? '0'+n : n}</span>`).join('');
      }
      detailHtml += `<div style="margin:2px 0;font-size:12px;">${i+1}. ${redStr}${blueStr}</div>`;
    });
    document.getElementById('filterDetail').innerHTML = detailHtml;
  } else {
    document.getElementById('filterDetail').innerHTML = '<div style="color:var(--text-light);">无符合条件的组合，请调整条件</div>';
  }
}

function resetFilter() {
  filterState = { red: [], blue: [], dantuo: [], blueDantuo: [] };
  updateFilterRedDisplay();
  updateFilterBlueDisplay();
  document.getElementById('filterCount').textContent = '共 0 注';
  document.getElementById('filterCost').textContent = '0 元';
  document.getElementById('filterDetail').innerHTML = '';
  // 重置条件
  document.querySelectorAll('.filter-chip').forEach(c => {
    if (c.dataset.v === 'any') c.classList.add('selected');
    else c.classList.remove('selected');
  });
  ['filterSumMin','filterSumMax','filterBlueSumMin','filterBlueSumMax'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}