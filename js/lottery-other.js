// ============================================================
// 彩票缩水工具 - 随机选号/AC值/胆拖/复式计算器
// ============================================================

// ============================================================
// 在线机选/随机选号
// ============================================================
function renderRandomTool() {
  const lt = LOTTERY_TYPES[currentLottery];
  if (lt.isDigit) return render3DRandomTool();

  return `
    <div class="lottery-tool-section">
      <h3>🎲 ${lt.name} 在线机选</h3>
      <div class="lottery-tip">设置过滤条件，随机生成符合要求的号码组合</div>
      <div class="lottery-input-row">
        <label>生成注数：</label>
        <input type="number" id="randCount" value="5" min="1" max="100" style="width:80px;">
      </div>
      <div class="lottery-input-row">
        <label>奇偶比：</label>
        <select id="randOE" style="width:100px;">
          <option value="any">随机</option>
          ${getOERatios().map(v => `<option value="${v}">${v}</option>`).join('')}
        </select>
      </div>
      <div class="lottery-input-row">
        <label>大小比：</label>
        <select id="randBS" style="width:100px;">
          <option value="any">随机</option>
          ${getBSRatios().map(v => `<option value="${v}">${v}</option>`).join('')}
        </select>
      </div>
      <div class="lottery-input-row">
        <label>产生连号：</label>
        <select id="randCG" style="width:100px;">
          <option value="any">随机</option>
          <option value="yes">是</option>
          <option value="no">否</option>
        </select>
      </div>
      ${lt.blueRange > 0 ? `
      <div class="lottery-input-row">
        <label>${lt.blueName}大小：</label>
        <select id="randBlueBS" style="width:100px;">
          <option value="any">随机</option>
          <option value="big">大</option>
          <option value="small">小</option>
        </select>
      </div>
      <div class="lottery-input-row">
        <label>${lt.blueName}奇偶：</label>
        <select id="randBlueOE" style="width:100px;">
          <option value="any">随机</option>
          <option value="odd">奇</option>
          <option value="even">偶</option>
        </select>
      </div>
      ` : ''}
      <div class="btn-group" style="margin-top:16px;">
        <button class="btn btn-primary" onclick="runRandom()">🎲 开始机选</button>
      </div>
      <div class="lottery-result" id="randResult">
        <div class="result-title">📊 机选结果</div>
        <div id="randNums"></div>
      </div>
    </div>
  `;
}

function render3DRandomTool() {
  const lt = LOTTERY_TYPES[currentLottery];
  return `
    <div class="lottery-tool-section">
      <h3>🎲 ${lt.name} 在线机选</h3>
      <div class="lottery-input-row">
        <label>生成注数：</label>
        <input type="number" id="randCount" value="5" min="1" max="100" style="width:80px;">
      </div>
      <div class="btn-group" style="margin-top:16px;">
        <button class="btn btn-primary" onclick="run3DRandom()">🎲 开始机选</button>
      </div>
      <div class="lottery-result" id="randResult">
        <div class="result-title">📊 机选结果</div>
        <div id="randNums"></div>
      </div>
    </div>
  `;
}

function runRandom() {
  const lt = LOTTERY_TYPES[currentLottery];
  const count = parseInt(document.getElementById('randCount')?.value) || 5;
  const oe = document.getElementById('randOE')?.value || 'any';
  const bs = document.getElementById('randBS')?.value || 'any';
  const cg = document.getElementById('randCG')?.value || 'any';
  const blueBS = document.getElementById('randBlueBS')?.value || 'any';
  const blueOE = document.getElementById('randBlueOE')?.value || 'any';
  const bigThreshold = currentLottery === 'dlt' ? 17 : 16;

  const results = [];
  let attempts = 0;
  const maxAttempts = 10000;

  while (results.length < count && attempts < maxAttempts) {
    attempts++;
    // 生成红球
    const reds = [];
    while (reds.length < lt.redCount) {
      const n = Math.floor(Math.random() * lt.redRange) + 1;
      if (!reds.includes(n)) reds.push(n);
    }
    reds.sort((a, b) => a - b);

    // 检查条件
    if (oe !== 'any') {
      const r = oddEvenRatio(reds);
      if (r !== oe) continue;
    }
    if (bs !== 'any') {
      const r = bigSmallRatio(reds, bigThreshold);
      if (r !== bs) continue;
    }
    if (cg === 'yes' && countConsecutiveGroups(reds) === 0) continue;
    if (cg === 'no' && countConsecutiveGroups(reds) > 0) continue;

    // 蓝球
    let blues = [];
    if (lt.blueCount > 0) {
      while (blues.length < lt.blueCount) {
        const n = Math.floor(Math.random() * lt.blueRange) + 1;
        if (!blues.includes(n)) blues.push(n);
      }
      blues.sort((a, b) => a - b);

      if (blueBS !== 'any') {
        const bigNums = blues.filter(n => n >= 7).length;
        if (blueBS === 'big' && bigNums === 0) continue;
        if (blueBS === 'small' && bigNums > 0) continue;
      }
      if (blueOE !== 'any') {
        if (blueOE === 'odd' && blues.filter(n => n % 2 === 1).length === 0) continue;
        if (blueOE === 'even' && blues.filter(n => n % 2 === 0).length === 0) continue;
      }
    }

    // 去重
    const key = reds.join(',') + '|' + blues.join(',');
    if (results.some(r => r.key === key)) continue;

    results.push({ red: reds, blue: blues, key });
  }

  displayRandomResults(results);
}

function run3DRandom() {
  const count = parseInt(document.getElementById('randCount')?.value) || 5;
  const results = [];
  for (let i = 0; i < count; i++) {
    const n = [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10)
    ];
    results.push({ red: n, blue: [] });
  }
  displayRandomResults(results);
}

function displayRandomResults(results) {
  const container = document.getElementById('randNums');
  if (!container) return;
  if (results.length === 0) {
    container.innerHTML = '<div style="color:var(--text-light);">未找到符合条件的号码，请放宽条件</div>';
    return;
  }
  let html = '';
  results.forEach((r, i) => {
    const redStr = r.red.map(n => `<span class="selected-ball red" style="width:32px;height:32px;font-size:13px;">${n < 10 ? '0'+n : n}</span>`).join('');
    let blueStr = '';
    if (r.blue.length > 0) {
      blueStr = ' + ' + r.blue.map(n => `<span class="selected-ball blue" style="width:32px;height:32px;font-size:13px;">${n < 10 ? '0'+n : n}</span>`).join('');
    }
    html += `<div style="margin:6px 0;font-size:14px;">${i+1}. ${redStr}${blueStr}</div>`;
  });
  container.innerHTML = html;
}

function initRandomTool() {}

// ============================================================
// AC值计算器
// ============================================================
function renderACTool() {
  const lt = LOTTERY_TYPES[currentLottery];
  const range = lt.redRange || 33;
  return `
    <div class="lottery-tool-section">
      <h3>📐 AC值计算器</h3>
      <div class="lottery-tip">选择${lt.redCount}个红球号码，计算AC值。AC值 = 所有两两差值的不同个数 - (红球个数 - 1)</div>
      <div style="margin-bottom:12px;">
        <div class="ball-row">
          <span class="ball-row-label">选择号码：</span>
          <div id="acBalls" class="selected-balls"></div>
        </div>
        <div id="acGrid"></div>
        <div class="action-row" style="margin-top:4px;">
          <button class="action-btn" onclick="acClear()">清除</button>
          <button class="action-btn" onclick="acRandom()">随机选号</button>
          <span id="acCount" style="font-size:12px;color:var(--text-light);margin-left:8px;">已选 0/${lt.redCount}</span>
        </div>
      </div>
      <div class="btn-group">
        <button class="btn btn-primary" onclick="calcACValue()">📐 计算AC值</button>
      </div>
      <div class="lottery-result" id="acResult">
        <div class="result-title">📊 计算结果</div>
        <div id="acDetail" style="font-size:14px;line-height:1.8;"></div>
      </div>
    </div>
  `;
}

let acState = [];

function initACTool() {
  const lt = LOTTERY_TYPES[currentLottery];
  acState = [];
  renderNumGrid('acGrid', lt.redRange || 33, acState, (n) => {
    const idx = acState.indexOf(n);
    if (idx >= 0) {
      acState.splice(idx, 1);
    } else if (acState.length < lt.redCount) {
      acState.push(n);
    } else {
      ltToast(`⚠️ 最多选择 ${lt.redCount} 个号码`);
      return;
    }
    updateACDisplay();
  }, { ballClass: 'red-ball' });
  updateACDisplay();
}

function updateACDisplay() {
  const lt = LOTTERY_TYPES[currentLottery];
  const container = document.getElementById('acBalls');
  if (container) {
    container.innerHTML = acState.map(n => `<span class="selected-ball red">${n < 10 ? '0'+n : n}</span>`).join('');
  }
  const count = document.getElementById('acCount');
  if (count) count.textContent = `已选 ${acState.length}/${lt.redCount}`;
  document.querySelectorAll('#acGrid .num-btn').forEach(btn => {
    const n = parseInt(btn.textContent);
    btn.classList.toggle('selected', acState.includes(n));
  });
}

function acClear() {
  acState = [];
  updateACDisplay();
}

function acRandom() {
  const lt = LOTTERY_TYPES[currentLottery];
  acState = [];
  while (acState.length < lt.redCount) {
    const n = Math.floor(Math.random() * lt.redRange) + 1;
    if (!acState.includes(n)) acState.push(n);
  }
  acState.sort((a, b) => a - b);
  updateACDisplay();
}

function calcACValue() {
  const lt = LOTTERY_TYPES[currentLottery];
  if (acState.length !== lt.redCount) {
    ltToast(`⚠️ 请选择 ${lt.redCount} 个号码`);
    return;
  }
  const nums = [...acState].sort((a, b) => a - b);
  const ac = calcAC(nums);

  // 计算所有差值
  const diffs = [];
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      diffs.push(Math.abs(nums[i] - nums[j]));
    }
  }
  const uniqueDiffs = [...new Set(diffs)].sort((a, b) => a - b);

  let html = `
    <div style="font-size:18px;font-weight:700;color:var(--primary);margin-bottom:8px;">AC值 = ${ac}</div>
    <div>号码：${nums.join(', ')}</div>
    <div>两两差值：${diffs.join(', ')}</div>
    <div>不同差值个数：${uniqueDiffs.length}</div>
    <div>不同差值：${uniqueDiffs.join(', ')}</div>
    <div style="font-size:12px;color:var(--text-light);margin-top:4px;">AC值 = ${uniqueDiffs.length} - (${nums.length} - 1) = ${ac}</div>
  `;
  document.getElementById('acDetail').innerHTML = html;
}

// ============================================================
// 胆拖计算器
// ============================================================
function renderDantuoTool() {
  const lt = LOTTERY_TYPES[currentLottery];
  if (lt.isDigit) return '<div class="lottery-tool-section"><p>该彩票类型暂无胆拖计算器</p></div>';

  return `
    <div class="lottery-tool-section">
      <h3>🎯 ${lt.name} 胆拖计算器</h3>
      <div class="lottery-tip">设置胆码（必出号码）和拖码（可选号码），系统自动计算注数和金额</div>
      <div style="margin-bottom:16px;">
        <div class="ball-row">
          <span class="ball-row-label">胆码：</span>
          <div id="dtDanBalls" class="selected-balls"></div>
        </div>
        <div id="dtDanGrid"></div>
        <div class="action-row" style="margin-top:4px;">
          <button class="action-btn" onclick="dtClear('dan')">清除</button>
          <span id="dtDanCount" style="font-size:12px;color:var(--text-light);">已选 0 个胆码</span>
        </div>
      </div>
      <div style="margin-bottom:16px;">
        <div class="ball-row">
          <span class="ball-row-label">拖码：</span>
          <div id="dtTuoBalls" class="selected-balls"></div>
        </div>
        <div id="dtTuoGrid"></div>
        <div class="action-row" style="margin-top:4px;">
          <button class="action-btn" onclick="dtClear('tuo')">清除</button>
          <span id="dtTuoCount" style="font-size:12px;color:var(--text-light);">已选 0 个拖码</span>
        </div>
      </div>
      ${lt.blueRange > 0 ? `
      <div class="section-divider"></div>
      <div style="margin-bottom:16px;">
        <div class="ball-row">
          <span class="ball-row-label">${lt.blueName}胆码：</span>
          <div id="dtBlueDanBalls" class="selected-balls"></div>
        </div>
        <div id="dtBlueDanGrid"></div>
        <div class="action-row" style="margin-top:4px;">
          <button class="action-btn" onclick="dtClear('blueDan')">清除</button>
          <span id="dtBlueDanCount" style="font-size:12px;color:var(--text-light);">已选 0 个蓝胆</span>
        </div>
      </div>
      <div style="margin-bottom:16px;">
        <div class="ball-row">
          <span class="ball-row-label">${lt.blueName}拖码：</span>
          <div id="dtBlueTuoBalls" class="selected-balls"></div>
        </div>
        <div id="dtBlueTuoGrid"></div>
        <div class="action-row" style="margin-top:4px;">
          <button class="action-btn" onclick="dtClear('blueTuo')">清除</button>
          <span id="dtBlueTuoCount" style="font-size:12px;color:var(--text-light);">已选 0 个蓝拖</span>
        </div>
      </div>
      ` : ''}
      <div class="btn-group">
        <button class="btn btn-primary" onclick="calcDantuo()">🧮 计算</button>
      </div>
      <div class="lottery-result" id="dtResult">
        <div class="result-title">📊 计算结果</div>
        <div class="result-count" id="dtCount">共 0 注</div>
        <div class="result-cost" id="dtCost">0 元</div>
        <div id="dtDetail" style="margin-top:8px;font-size:13px;"></div>
      </div>
    </div>
  `;
}

let dtState = { dan: [], tuo: [], blueDan: [], blueTuo: [] };

function initDantuoTool() {
  const lt = LOTTERY_TYPES[currentLottery];
  dtState = { dan: [], tuo: [], blueDan: [], blueTuo: [] };

  renderNumGrid('dtDanGrid', lt.redRange, dtState.dan, (n) => {
    const idx = dtState.dan.indexOf(n);
    if (idx >= 0) dtState.dan.splice(idx, 1);
    else if (!dtState.tuo.includes(n)) {
      dtState.dan.push(n);
      dtState.tuo = dtState.tuo.filter(v => v !== n);
    }
    updateDTDisplay();
  }, { ballClass: 'red-ball' });

  renderNumGrid('dtTuoGrid', lt.redRange, dtState.tuo, (n) => {
    const idx = dtState.tuo.indexOf(n);
    if (idx >= 0) dtState.tuo.splice(idx, 1);
    else if (!dtState.dan.includes(n)) {
      dtState.tuo.push(n);
      dtState.dan = dtState.dan.filter(v => v !== n);
    }
    updateDTDisplay();
  }, { ballClass: 'red-ball' });

  if (lt.blueRange > 0) {
    renderNumGrid('dtBlueDanGrid', lt.blueRange, dtState.blueDan, (n) => {
      const idx = dtState.blueDan.indexOf(n);
      if (idx >= 0) dtState.blueDan.splice(idx, 1);
      else if (!dtState.blueTuo.includes(n)) {
        dtState.blueDan.push(n);
        dtState.blueTuo = dtState.blueTuo.filter(v => v !== n);
      }
      updateDTDisplay();
    }, { ballClass: 'blue-ball' });

    renderNumGrid('dtBlueTuoGrid', lt.blueRange, dtState.blueTuo, (n) => {
      const idx = dtState.blueTuo.indexOf(n);
      if (idx >= 0) dtState.blueTuo.splice(idx, 1);
      else if (!dtState.blueDan.includes(n)) {
        dtState.blueTuo.push(n);
        dtState.blueDan = dtState.blueDan.filter(v => v !== n);
      }
      updateDTDisplay();
    }, { ballClass: 'blue-ball' });
  }

  updateDTDisplay();
}

function updateDTDisplay() {
  const lt = LOTTERY_TYPES[currentLottery];
  ['dan','tuo','blueDan','blueTuo'].forEach(k => {
    const container = document.getElementById('dt' + k.charAt(0).toUpperCase() + k.slice(1) + 'Balls');
    if (container) {
      const cls = k.startsWith('blue') ? 'blue' : 'red';
      container.innerHTML = dtState[k].map(n => `<span class="selected-ball ${cls}">${n < 10 ? '0'+n : n}</span>`).join('');
    }
    const count = document.getElementById('dt' + k.charAt(0).toUpperCase() + k.slice(1) + 'Count');
    if (count) count.textContent = `已选 ${dtState[k].length} 个${k.includes('dan') ? '胆' : '拖'}`;
    const grid = document.getElementById('dt' + k.charAt(0).toUpperCase() + k.slice(1) + 'Grid');
    if (grid) {
      grid.querySelectorAll('.num-btn').forEach(btn => {
        const n = parseInt(btn.textContent);
        btn.classList.toggle('selected', dtState[k].includes(n));
      });
    }
  });
}

function dtClear(type) {
  if (type === 'dan') dtState.dan = [];
  else if (type === 'tuo') dtState.tuo = [];
  else if (type === 'blueDan') dtState.blueDan = [];
  else if (type === 'blueTuo') dtState.blueTuo = [];
  updateDTDisplay();
}

function calcDantuo() {
  const lt = LOTTERY_TYPES[currentLottery];
  const danCount = lt.redCount;
  const blueCount = lt.blueCount || 0;

  if (dtState.dan.length >= danCount) {
    ltToast(`⚠️ 胆码数量不能超过或等于${danCount}个`);
    return;
  }
  if (dtState.dan.length + dtState.tuo.length < danCount) {
    ltToast('⚠️ 胆码+拖码数量不足');
    return;
  }

  const needFromTuo = danCount - dtState.dan.length;
  const redCombos = combination(dtState.tuo.length, needFromTuo);

  let blueCombos = 1;
  if (blueCount > 0) {
    if (dtState.blueDan.length > blueCount) {
      ltToast(`⚠️ 蓝球胆码不能超过${blueCount}个`);
      return;
    }
    const needBlue = blueCount - dtState.blueDan.length;
    if (dtState.blueDan.length + dtState.blueTuo.length < blueCount) {
      ltToast('⚠️ 蓝球胆码+拖码数量不足');
      return;
    }
    blueCombos = combination(dtState.blueTuo.length, needBlue);
  }

  const total = redCombos * blueCombos;
  const cost = total * 2;

  document.getElementById('dtCount').textContent = `共 ${total.toLocaleString()} 注`;
  document.getElementById('dtCost').textContent = `共计 ${cost.toLocaleString()} 元`;

  let detail = `红球胆码 ${dtState.dan.length} 个，拖码 ${dtState.tuo.length} 个`;
  detail += `，需从拖码中选 ${needFromTuo} 个，共 ${redCombos.toLocaleString()} 种组合`;
  if (blueCount > 0) {
    const needBlue = blueCount - dtState.blueDan.length;
    detail += `<br>${lt.blueName}胆码 ${dtState.blueDan.length} 个，拖码 ${dtState.blueTuo.length} 个`;
    detail += `，需从拖码中选 ${needBlue} 个，共 ${blueCombos.toLocaleString()} 种组合`;
  }
  document.getElementById('dtDetail').innerHTML = detail;
}

// ============================================================
// 复式计算器
// ============================================================
function renderCompoundTool() {
  const lt = LOTTERY_TYPES[currentLottery];
  if (lt.isDigit) return renderDigitCompoundTool();
  if (currentLottery === 'qxc') return renderQxcCompoundTool();

  return `
    <div class="lottery-tool-section">
      <h3>🧮 ${lt.name} 复式计算器</h3>
      <div class="lottery-tip">选择多于标准数量的号码，计算复式投注的注数和金额</div>
      <div style="margin-bottom:16px;">
        <div class="ball-row">
          <span class="ball-row-label">${lt.redName}：</span>
          <div id="cpRedBalls" class="selected-balls"></div>
        </div>
        <div id="cpRedGrid"></div>
        <div class="action-row" style="margin-top:4px;">
          <button class="action-btn" onclick="cpClear('red')">清除</button>
          <span id="cpRedCount" style="font-size:12px;color:var(--text-light);">已选 0 个</span>
        </div>
      </div>
      ${lt.blueRange > 0 ? `
      <div style="margin-bottom:16px;">
        <div class="ball-row">
          <span class="ball-row-label">${lt.blueName}：</span>
          <div id="cpBlueBalls" class="selected-balls"></div>
        </div>
        <div id="cpBlueGrid"></div>
        <div class="action-row" style="margin-top:4px;">
          <button class="action-btn" onclick="cpClear('blue')">清除</button>
          <span id="cpBlueCount" style="font-size:12px;color:var(--text-light);">已选 0 个</span>
        </div>
      </div>
      ` : ''}
      <div class="btn-group">
        <button class="btn btn-primary" onclick="calcCompound()">🧮 计算</button>
      </div>
      <div class="lottery-result" id="cpResult">
        <div class="result-title">📊 计算结果</div>
        <div class="result-count" id="cpCount">共 0 注</div>
        <div class="result-cost" id="cpCost">0 元</div>
      </div>
    </div>
  `;
}

function renderDigitCompoundTool() {
  return `
    <div class="lottery-tool-section">
      <h3>🧮 复式全排列组号器</h3>
      <div class="lottery-tip">选择每位号码，系统自动计算所有组合</div>
      ${render3DWeiSelect('cpBai', '百位')}
      ${render3DWeiSelect('cpShi', '十位')}
      ${render3DWeiSelect('cpGe', '个位')}
      <div class="btn-group" style="margin-top:16px;">
        <button class="btn btn-primary" onclick="calcDigitCompound()">🧮 计算</button>
      </div>
      <div class="lottery-result" id="cpResult">
        <div class="result-title">📊 计算结果</div>
        <div class="result-count" id="cpCount">共 0 注</div>
        <div class="result-cost" id="cpCost">0 元</div>
      </div>
    </div>
  `;
}

function renderQxcCompoundTool() {
  return '<div class="lottery-tool-section"><p>七星彩复式功能请使用「组号缩水」工具</p></div>';
}

let cpState = { red: [], blue: [] };

function initCompoundTool() {
  const lt = LOTTERY_TYPES[currentLottery];
  cpState = { red: [], blue: [] };

  if (lt.isDigit) {
    // 3D复式直接用位选
    ['cpBai','cpShi','cpGe'].forEach((id, i) => {
      const grid = document.getElementById(id + 'Grid');
      if (grid) {
        grid.querySelectorAll('.num-btn').forEach(btn => {
          btn.classList.add('selected');
        });
      }
    });
    return;
  }

  renderNumGrid('cpRedGrid', lt.redRange, cpState.red, (n) => {
    const idx = cpState.red.indexOf(n);
    if (idx >= 0) cpState.red.splice(idx, 1);
    else cpState.red.push(n);
    updateCPDisplay();
  }, { ballClass: 'red-ball' });

  if (lt.blueRange > 0) {
    renderNumGrid('cpBlueGrid', lt.blueRange, cpState.blue, (n) => {
      const idx = cpState.blue.indexOf(n);
      if (idx >= 0) cpState.blue.splice(idx, 1);
      else cpState.blue.push(n);
      updateCPDisplay();
    }, { ballClass: 'blue-ball' });
  }

  updateCPDisplay();
}

function updateCPDisplay() {
  const lt = LOTTERY_TYPES[currentLottery];
  ['red','blue'].forEach(k => {
    const container = document.getElementById('cp' + k.charAt(0).toUpperCase() + k.slice(1) + 'Balls');
    if (container) {
      const cls = k === 'red' ? 'red' : 'blue';
      container.innerHTML = cpState[k].map(n => `<span class="selected-ball ${cls}">${n < 10 ? '0'+n : n}</span>`).join('');
    }
    const count = document.getElementById('cp' + k.charAt(0).toUpperCase() + k.slice(1) + 'Count');
    if (count) count.textContent = `已选 ${cpState[k].length} 个`;
    const grid = document.getElementById('cp' + k.charAt(0).toUpperCase() + k.slice(1) + 'Grid');
    if (grid) {
      grid.querySelectorAll('.num-btn').forEach(btn => {
        const n = parseInt(btn.textContent);
        btn.classList.toggle('selected', cpState[k].includes(n));
      });
    }
  });
}

function cpClear(type) {
  if (type === 'red') cpState.red = [];
  else if (type === 'blue') cpState.blue = [];
  updateCPDisplay();
}

function calcCompound() {
  const lt = LOTTERY_TYPES[currentLottery];
  if (lt.isDigit) { calcDigitCompound(); return; }

  const reds = cpState.red.length;
  const blues = cpState.blue.length;
  const redCount = lt.redCount;
  const blueCount = lt.blueCount || 0;

  if (reds < redCount) {
    ltToast(`⚠️ 请至少选择 ${redCount} 个${lt.redName}`);
    return;
  }

  const redCombos = combination(reds, redCount);
  let blueCombos = 1;
  if (blueCount > 0) {
    if (blues < blueCount) {
      ltToast(`⚠️ 请至少选择 ${blueCount} 个${lt.blueName}`);
      return;
    }
    blueCombos = combination(blues, blueCount);
  }

  const total = redCombos * blueCombos;
  const cost = total * 2;

  document.getElementById('cpCount').textContent = `共 ${total.toLocaleString()} 注`;
  document.getElementById('cpCost').textContent = `共计 ${cost.toLocaleString()} 元`;
}

function calcDigitCompound() {
  // 3D/排列五等
  const lt = LOTTERY_TYPES[currentLottery];
  const digitCount = lt.digitCount || 3;

  let total = 1;
  for (let i = 0; i < digitCount; i++) {
    const id = `cp${['Bai','Shi','Ge','Qian','Wan'][i] || 'Wei'+i}`;
    const grid = document.getElementById(id + 'Grid');
    if (!grid) { total = 0; break; }
    const selected = grid.querySelectorAll('.num-btn.selected').length;
    if (selected === 0) { total = 0; break; }
    total *= selected;
  }

  document.getElementById('cpCount').textContent = `共 ${total.toLocaleString()} 注`;
  document.getElementById('cpCost').textContent = `共计 ${(total * 2).toLocaleString()} 元`;
}

// ============================================================
// 金额计算器
// ============================================================
function renderMoneyCalcTool() {
  const lt = LOTTERY_TYPES[currentLottery];
  return `
    <div class="lottery-tool-section">
      <h3>💰 金额计算器</h3>
      <div class="lottery-tip">计算${lt.name}各奖级中奖金额及税费</div>
      <div class="lottery-input-row">
        <label>中奖等级：</label>
        <select id="mcPrizeLevel" style="width:200px;">
          <option value="1">一等奖（浮动奖金）</option>
          <option value="2">二等奖（浮动奖金）</option>
          <option value="3">三等奖（固定奖金）</option>
          <option value="4">四等奖</option>
          <option value="5">五等奖</option>
          <option value="6">六等奖</option>
        </select>
      </div>
      <div class="lottery-input-row">
        <label>预估奖金金额（元）：</label>
        <input type="number" id="mcPrizeAmount" value="5000000" min="1" style="width:150px;">
        <span class="lottery-tip" style="display:inline;margin:0 0 0 8px;">（浮动奖按预估计算）</span>
      </div>
      <div class="lottery-input-row">
        <label>投注方式：</label>
        <select id="mcBetType" style="width:150px;">
          <option value="single">单式</option>
          <option value="multiple">复式</option>
          <option value="dantuo">胆拖</option>
        </select>
      </div>
      <div class="lottery-input-row">
        <label>倍数：</label>
        <input type="number" id="mcMultiplier" value="1" min="1" max="99" style="width:80px;">
      </div>
      <div class="btn-group" style="margin-top:16px;">
        <button class="btn btn-primary" onclick="calcMoney()">🧮 计算奖金</button>
      </div>
      <div class="lottery-result" id="mcResult">
        <div class="result-title">📊 奖金计算</div>
        <div id="mcDetail"></div>
      </div>
      <div class="omit-table-wrapper" style="margin-top:12px;">
        <table class="omit-table" id="mcTable">
          <thead>
            <tr>
              <th>项目</th>
              <th>金额（元）</th>
            </tr>
          </thead>
          <tbody id="mcBody"></tbody>
        </table>
      </div>
    </div>
  `;
}

function initMoneyCalcTool() {}

function calcMoney() {
  const level = parseInt(document.getElementById('mcPrizeLevel').value) || 1;
  const amount = parseFloat(document.getElementById('mcPrizeAmount').value) || 5000000;
  const multiplier = parseInt(document.getElementById('mcMultiplier').value) || 1;

  const tbody = document.getElementById('mcBody');
  if (!tbody) return;

  let prizeName = '';
  let taxRate = 0.2;
  let isFixed = false;

  if (level <= 2) {
    prizeName = level === 1 ? '一等奖' : '二等奖';
    taxRate = 0.2;
    isFixed = false;
  } else {
    prizeName = ['三等奖', '四等奖', '五等奖', '六等奖'][level - 3];
    isFixed = true;
  }

  const totalPrize = amount * multiplier;
  const taxFree = level <= 2 ? 0 : 10000;
  const taxable = Math.max(0, totalPrize - taxFree);
  const tax = level <= 2 ? Math.max(0, totalPrize * taxRate) : Math.max(0, taxable * taxRate);
  const afterTax = totalPrize - tax;

  const rows = [
    ['中奖等级', prizeName],
    ['预估奖金（单注）', amount.toLocaleString()],
    ['投注倍数', multiplier + '倍'],
    ['税前总奖金', totalPrize.toLocaleString()],
    ['免税额', taxFree.toLocaleString()],
    ['应纳税额', taxable.toLocaleString()],
    ['税率', (taxRate * 100) + '%'],
    ['应缴税款', tax.toLocaleString()],
    ['税后实得', `<strong style="color:#10b981;font-size:16px;">${afterTax.toLocaleString()}</strong>`]
  ];

  let html = '';
  rows.forEach(r => {
    html += `<tr><td style="font-weight:600;">${r[0]}</td><td>${r[1]}</td></tr>`;
  });
  tbody.innerHTML = html;

  document.getElementById('mcDetail').innerHTML = `
    <div style="font-size:14px;line-height:1.8;">
      <strong>${prizeName}</strong>（${multiplier}倍）<br>
      ⚠️ 单注奖金超过1万元需缴纳${(taxRate*100)}%个人所得税<br>
      ${level <= 2 ? '💡 浮动奖金按输入预估计算，实际以官方公布为准' : '💡 固定奖金按财政部规定'}
    </div>
  `;
}