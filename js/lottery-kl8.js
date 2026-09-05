// ============================================================
// 彩票缩水工具 - 福彩快乐8 缩水/尾数配号
// 快乐8：从 1-80 中开 20 个号码
// 尾数 0-9 出几个：按号码个位尾数分组，指定每个尾数出现个数
// ============================================================

let kl8State = { red: [] };
let kl8TailCond = Array(10).fill(''); // 每个尾数的出号数（'' = 不限）

// ============================================================
// 快乐8 缩水渲染
// ============================================================
function renderKl8FilterTool() {
  const lt = LOTTERY_TYPES[currentLottery];
  return `
    <div class="lottery-tool-section">
      <h3>🔍 ${lt.name} 尾数缩水（0-9出几个）</h3>
      <div class="lottery-tip">从 1-80 中选择大底号码，设置每个尾数（0-9）出几个，系统自动生成满足条件的号码组合。</div>

      <div style="margin-bottom:16px;">
        <div class="section-desc"><strong>1. 选择大底号码</strong></div>
        <div class="ball-row">
          <span class="ball-row-label">号码：</span>
          <div id="kl8RedBalls" class="selected-balls"></div>
        </div>
        <div id="kl8RedGrid"></div>
        <div class="action-row" style="margin-top:4px;">
          <button class="action-btn" onclick="kl8SelectAll()">全选</button>
          <button class="action-btn" onclick="kl8ClearAll()">清除</button>
          <button class="action-btn" onclick="kl8SelectOdd()">选奇数</button>
          <button class="action-btn" onclick="kl8SelectEven()">选偶数</button>
          <button class="action-btn" onclick="kl8PickByTail()">按尾均选</button>
          <span id="kl8RedCount" style="font-size:12px;color:var(--text-light);margin-left:8px;">已选 0 个</span>
        </div>
      </div>

      <div class="section-divider"></div>

      <div style="margin-bottom:16px;">
        <div class="section-desc"><strong>2. 玩法（每注号码数）</strong></div>
        <div class="lottery-input-row">
          <label>每注号码数：</label>
          <select id="kl8PerBet" style="width:110px;" onchange="kl8PerBetChanged()">
            <option value="1">1（选一）</option>
            <option value="2">2（选二）</option>
            <option value="3">3（选三）</option>
            <option value="4">4（选四）</option>
            <option value="5">5（选五）</option>
            <option value="6">6（选六）</option>
            <option value="7">7（选七）</option>
            <option value="8" selected>8（选八）</option>
            <option value="9">9（选九）</option>
            <option value="10">10（选十）</option>
          </select>
          <span style="font-size:12px;color:var(--text-light);margin-left:8px;">官方玩法：从 80 个号码中任选 1~10 个组成一注</span>
        </div>
        <div style="font-size:12px;color:var(--text-light);margin-top:6px;">
          💡 每期开奖摇出 <strong style="color:var(--text);">20 个号码</strong>，你选的号码命中其中多少个，按玩法中奖（选十中十最高 500 万）。大底不超过 <strong style="color:var(--text);">24 个号码</strong> 时穷举输出全部满足条件的组合。
        </div>
      </div>

      <div class="section-divider"></div>

      <div style="margin-bottom:16px;">
        <div class="section-desc"><strong>3. 尾数出号条件（0-9 出几个）</strong>（留空 = 不限制该尾数）</div>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:8px;">
          ${Array.from({length:10}, (_, t) => `
            <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:8px;text-align:center;">
              <div style="font-size:12px;color:var(--text-light);margin-bottom:4px;">${t}尾</div>
              <input type="number" id="kl8Tail${t}" value="${kl8TailCond[t]}" min="0" max="8" placeholder="不限" style="width:52px;text-align:center;background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:6px;padding:4px;">
            </div>
          `).join('')}
        </div>
        <div style="font-size:12px;color:var(--text-light);margin-top:6px;">
          💡 每个尾数含 8 个号码（如 0尾：10,20,...,80；1尾：1,11,...,71），指定各尾数出几个，系统按条件配号。
        </div>
      </div>

      <div class="section-divider"></div>

      <div style="margin-bottom:16px;">
        <div class="section-desc"><strong>4. 附加过滤</strong>（可选）</div>
        <div class="lottery-input-row">
          <label>奇偶比：</label>
          <div class="filter-options" id="kl8OE" data-ratio="oe">
            ${kl8RatioChipsHtml('kl8OE')}
          </div>
        </div>
        <div class="lottery-input-row">
          <label>大小比：</label>
          <div class="filter-options" id="kl8BS" data-ratio="bs">
            ${kl8RatioChipsHtml('kl8BS')}
          </div>
          <span style="font-size:12px;color:var(--text-light);">(41以上为大)</span>
        </div>
      </div>

      <div class="btn-group" style="margin-top:16px;">
        <button class="btn btn-primary" onclick="runKl8Filter()">🎲 按条件配号生成</button>
        <button class="btn btn-secondary" onclick="resetKl8Filter()">🔄 重置</button>
      </div>

      <div class="lottery-result" id="kl8Result">
        <div class="result-title">📊 生成结果</div>
        <div class="result-count" id="kl8ResultCount">共 0 注</div>
        <div style="margin-top:8px;font-size:13px;" id="kl8Detail"></div>
      </div>
    </div>
  `;
}

// ============================================================
// 快乐8 初始化
// ============================================================
function initKl8FilterTool() {
  const lt = LOTTERY_TYPES[currentLottery];
  kl8State = { red: [] };
  kl8TailCond = Array(10).fill('');

  renderNumGrid('kl8RedGrid', lt.redRange, kl8State.red, (n) => {
    const idx = kl8State.red.indexOf(n);
    if (idx >= 0) kl8State.red.splice(idx, 1);
    else kl8State.red.push(n);
    updateKl8RedDisplay();
  }, { ballClass: 'red-ball' });

  updateKl8RedDisplay();
}

function updateKl8RedDisplay() {
  const container = document.getElementById('kl8RedBalls');
  if (container) {
    const balls = [...kl8State.red].sort((a, b) => a - b);
    container.innerHTML = balls.map(n => `<span class="selected-ball red" style="width:26px;height:26px;font-size:12px;">${n < 10 ? '0' + n : n}</span>`).join('');
  }
  const count = document.getElementById('kl8RedCount');
  if (count) count.textContent = `已选 ${kl8State.red.length} 个`;
  document.querySelectorAll('#kl8RedGrid .num-btn').forEach(btn => {
    const n = parseInt(btn.textContent);
    btn.classList.toggle('selected', kl8State.red.includes(n));
  });
}

// ---- 全选/清除/奇偶 ----
function kl8SelectAll() {
  kl8State.red = Array.from({length: 80}, (_, i) => i + 1);
  updateKl8RedDisplay();
}
function kl8ClearAll() {
  kl8State.red = [];
  updateKl8RedDisplay();
}
function kl8SelectOdd() {
  kl8State.red = Array.from({length: 80}, (_, i) => i + 1).filter(n => n % 2 === 1);
  updateKl8RedDisplay();
}
function kl8SelectEven() {
  kl8State.red = Array.from({length: 80}, (_, i) => i + 1).filter(n => n % 2 === 0);
  updateKl8RedDisplay();
}
// 按尾均选：每个尾数随机选1个，共10个作为示例大底
function kl8PickByTail() {
  kl8State.red = [];
  for (let t = 0; t < 10; t++) {
    const pool = Array.from({length: 80}, (_, i) => i + 1).filter(n => n % 10 === t);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    kl8State.red.push(pick);
  }
  kl8State.red.sort((a, b) => a - b);
  updateKl8RedDisplay();
}

// ============================================================
// 快乐8 执行配号
// ============================================================
function runKl8Filter() {
  const lt = LOTTERY_TYPES[currentLottery];
  const perBet = parseInt(document.getElementById('kl8PerBet')?.value) || 8;
  const oe = getFilterChipValues('kl8OE');
  const bs = getFilterChipValues('kl8BS');

  // 每次生成前先清空上次结果
  const _countEl = document.getElementById('kl8ResultCount');
  if (_countEl) _countEl.textContent = '共 0 注';
  const _detailEl = document.getElementById('kl8Detail');
  if (_detailEl) _detailEl.innerHTML = '';

  // 读取尾数条件
  const tails = [];
  let tailSum = 0;
  let anyTailSet = false;
  for (let t = 0; t < 10; t++) {
    const v = document.getElementById('kl8Tail' + t)?.value;
    if (v !== undefined && v !== '') {
      const n = parseInt(v);
      if (isNaN(n) || n < 0) { ltToast(`⚠️ 尾数${t}请输入 0-8 的数字`); return; }
      if (n > 8) { ltToast(`⚠️ 尾数${t}最多出 8 个（每尾仅8个号码）`); return; }
      tails[t] = n;
      tailSum += n;
      anyTailSet = true;
    }
  }
  if (anyTailSet && tailSum > perBet) {
    ltToast(`⚠️ 尾数出号总数(${tailSum})超过每注号码数(${perBet})`);
    return;
  }

  // 大底校验
  if (kl8State.red.length < perBet) {
    ltToast(`⚠️ 大底至少选择 ${perBet} 个号码`);
    return;
  }

  // 按尾数分组大底（用于可行性校验）
  const tailPool = Array.from({ length: 10 }, () => []);
  kl8State.red.forEach(n => tailPool[n % 10].push(n));

  // 尾数可行性：指定出几个的尾数，大底里必须够数
  for (let t = 0; t < 10; t++) {
    if (tails[t] !== undefined && tails[t] > 0 && tailPool[t].length < tails[t]) {
      ltToast(`⚠️ 大底中 ${t} 尾仅有 ${tailPool[t].length} 个号码，不够出 ${tails[t]} 个`);
      return;
    }
  }

  // 穷举前先校验：大底数量不能超过 24（组合爆炸，无法穷举）
  if (kl8State.red.length > 24) {
    ltToast(`⚠️ 大底 ${kl8State.red.length} 个号码超出穷举上限（24 个），请缩小大底，或使用「🎲 在线机选」随机配号。`);
    return;
  }
  const totalCombos = combination(kl8State.red.length, perBet);
  const MAX_COMBOS = 1961256; // 24选10=1,961,256 是该玩法组合数上限（大底24、每注10）
  if (totalCombos > MAX_COMBOS) {
    ltToast(`⚠️ 大底 ${kl8State.red.length} 个 × 每注 ${perBet} 个 = ${totalCombos.toLocaleString()} 注，组合数过大无法穷举。请减少大底号码或改用「🎲 在线机选」随机配号。`);
    return;
  }

  // 穷举所有组合并过滤
  const reds = [...kl8State.red].sort((a, b) => a - b);
  const results = [];
  for (const combo of combinations(reds, perBet)) {
    // 尾数条件
    if (anyTailSet) {
      let tailOk = true;
      for (let t = 0; t < 10; t++) {
        if (tails[t] !== undefined) {
          const cnt = combo.filter(n => n % 10 === t).length;
          if (cnt !== tails[t]) { tailOk = false; break; }
        }
      }
      if (!tailOk) continue;
    }
    // 奇偶/大小过滤
    if (oe.length > 0 && !oe.includes(oddEvenRatio(combo))) continue;
    if (bs.length > 0 && !bs.includes(bigSmallRatio(combo, 41))) continue;
    results.push(combo);
  }

  // 显示结果
  const countEl = document.getElementById('kl8ResultCount');
  if (countEl) countEl.textContent = `共 ${results.length.toLocaleString()} 注`;
  const detail = document.getElementById('kl8Detail');
  if (!detail) return;

  if (results.length === 0) {
    detail.innerHTML = '<div style="color:var(--text-light);">未找到满足条件的组合，请放宽尾数条件或增加大底号码</div>';
    return;
  }

  // 构建复制文本（全部注数）
  const textLines = [];
  let lineNums = [];
  results.forEach(combo => {
    lineNums.push(combo.map(n => n < 10 ? '0' + n : n).join(' '));
    if (lineNums.length === 2) { textLines.push(lineNums.join('  ')); lineNums = []; }
  });
  if (lineNums.length > 0) textLines.push(lineNums.join('  '));
  const copyText = textLines.join('\n');
  const tooLarge = results.length > 50000;
  window._kl8CopyText = copyText;

  let html = '<div style="margin-bottom:8px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">';
  html += `<span style="font-size:12px;color:var(--text-light);">共 ${results.length.toLocaleString()} 注 · 每注 ${perBet} 个号码${results.length > 1500 ? ' · 下方仅显示前1500注' : ''}</span>`;
  if (tooLarge) {
    html += '<button onclick="downloadKl8Result()" style="padding:4px 12px;font-size:12px;cursor:pointer;border:1px solid var(--border);border-radius:4px;background:var(--bg);color:var(--text);">📥 下载全部 (.txt)</button>';
    html += '<span style="font-size:12px;color:#f59e0b;">⚠️ 注数过多，浏览器复制会卡死，请下载 txt 文件</span>';
  } else {
    html += '<button onclick="copyKl8Result()" style="padding:4px 12px;font-size:12px;cursor:pointer;border:1px solid var(--border);border-radius:4px;background:var(--bg);color:var(--text);">📋 一键复制全部</button>';
  }
  html += '</div>';
  if (!tooLarge) {
    html += '<div id="kl8ResultText" style="display:none;">' + copyText.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
  }
  detail.innerHTML = html + '<div style="font-size:12px;font-family:monospace;line-height:2;">';

  const previewCount = Math.min(results.length, 1500);
  for (let i = 0; i < previewCount; i++) {
    const combo = results[i];
    const balls = combo.map(n => `<span class="selected-ball red" style="width:24px;height:24px;font-size:11px;display:inline-flex;">${n < 10 ? '0' + n : n}</span>`).join('');
    // 尾数分布摘要
    const dist = [];
    for (let t = 0; t < 10; t++) {
      const cnt = combo.filter(n => n % 10 === t).length;
      dist.push(cnt);
    }
    html += `<div style="margin:4px 0;">${i + 1}. ${balls} <span style="color:var(--text-light);font-size:11px;">尾数分布 [${dist.join(' ')}]</span></div>`;
  }
  if (results.length > 1500) {
    html += `<div style="margin:8px 0;color:var(--text-light);font-size:12px;">⋯ 共 ${results.length.toLocaleString()} 注，已省略 ${(results.length - 1500).toLocaleString()} 注（完整列表可复制/下载）</div>`;
  }
  html += '</div>';
  detail.innerHTML = html;
}

// ---- 复制/下载结果 ----
function copyKl8Result() {
  const el = document.getElementById('kl8ResultText');
  const text = window._kl8CopyText || (el ? (el.textContent || el.innerText) : '');
  if (!text) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.querySelector('[onclick="copyKl8Result()"]');
      if (btn) { btn.textContent = '✅ 已复制'; setTimeout(() => { btn.textContent = '📋 一键复制全部'; }, 2000); }
    }).catch(() => { fallbackKl8Copy(text); });
  } else { fallbackKl8Copy(text); }
}
function fallbackKl8Copy(text) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  document.execCommand('copy'); document.body.removeChild(ta);
  const btn = document.querySelector('[onclick="copyKl8Result()"]');
  if (btn) { btn.textContent = '✅ 已复制'; setTimeout(() => { btn.textContent = '📋 一键复制全部'; }, 2000); }
}
function downloadKl8Result() {
  const text = window._kl8CopyText || '';
  if (!text) return;
  const blob = new Blob(['\ufeff' + text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = '快乐8缩水结果.txt';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// 生成奇偶比/大小比 chips（根据当前每注号码数动态生成，如每注8个 → 0:8 ~ 8:0）
function kl8RatioChipsHtml(groupId) {
  const perBet = parseInt(document.getElementById('kl8PerBet')?.value) || 8;
  let html = `<span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'${groupId}')">不限</span>`;
  for (let i = 0; i <= perBet; i++) {
    html += `<span class="filter-chip" data-v="${i}:${perBet - i}" onclick="toggleFilterChip(this,'${groupId}')">${i}:${perBet - i}</span>`;
  }
  return html;
}

// 切换每注号码数时：更新奇偶/大小比 chips，并清空结果
function kl8PerBetChanged() {
  ['kl8OE', 'kl8BS'].forEach(gid => {
    const el = document.getElementById(gid);
    if (el) el.innerHTML = kl8RatioChipsHtml(gid);
  });
  const countEl = document.getElementById('kl8ResultCount');
  if (countEl) countEl.textContent = '共 0 注';
  const detail = document.getElementById('kl8Detail');
  if (detail) detail.innerHTML = '';
}

function resetKl8Filter() {
  kl8State = { red: [] };
  kl8TailCond = Array(10).fill('');
  updateKl8RedDisplay();
  const countEl = document.getElementById('kl8ResultCount');
  if (countEl) countEl.textContent = '共 0 注';
  const detail = document.getElementById('kl8Detail');
  if (detail) detail.innerHTML = '';
  for (let t = 0; t < 10; t++) {
    const el = document.getElementById('kl8Tail' + t);
    if (el) el.value = '';
  }
  document.querySelectorAll('#kl8OE .filter-chip, #kl8BS .filter-chip').forEach(c => {
    if (c.dataset.v === 'any') c.classList.add('selected');
    else c.classList.remove('selected');
  });
}

// ---- 工具函数：洗牌 ----
function shuffleArr(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
