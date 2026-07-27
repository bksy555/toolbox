// ============================================================
// 彩票缩水工具 - 3D/排列三/排列五/七星彩 过滤工具
// ============================================================

// ---- 3D 过滤状态 ----
let d3FilterState = {
  bai: [], shi: [], ge: [],
  baiKill: [], shiKill: [], geKill: [],
  baiDan: [], shiDan: [], geDan: [],
  erMaHe: [], erMaCha: [], erMa: [],
  d012: [], heZhi: [], heWei: [], kuaDu: [],
  dazhongxiao: [], daxiao: [], jiou: [], zhihe: [],
  shunzi: 'none', // none, filter, ban
  zuxuan: [],
  dadan: ''
};

// ---- 3D 过滤渲染 ----
function render3DFilterTool() {
  const lt = LOTTERY_TYPES[currentLottery];
  const is3D = currentLottery === 'd3' || currentLottery === 'p3';

  return `
    <div class="lottery-tool-section">
      <h3>🔍 ${lt.name} 在线过滤</h3>
      <div class="lottery-tip">选择号码后使用下方过滤条件进行缩水，支持定位、杀号、胆码、和值、跨度等多种过滤方式。</div>

      <div style="margin-bottom:16px;">
        <div class="section-desc"><strong>1. 选择投注号码</strong></div>
        ${render3DWeiSelect('bai', '百位')}
        ${render3DWeiSelect('shi', '十位')}
        ${render3DWeiSelect('ge', '个位')}
      </div>

      <div class="section-divider"></div>

      <div style="margin-bottom:16px;">
        <div class="section-desc"><strong>2. 大底输入</strong></div>
        <textarea class="big-bet-textarea" id="d3Dadi" placeholder="输入大底号码，每注一行或逗号分隔（如：012, 123, 456）"></textarea>
        <div style="font-size:12px;color:var(--text-light);margin-top:4px;">大底生效时，上方定位选号将被忽略</div>
      </div>

      <div class="section-divider"></div>

      <div style="margin-bottom:16px;">
        <div class="section-desc"><strong>3. 杀号过滤</strong>（排除选中号码）</div>
        ${render3DWeiSelect('baiKill', '百位杀号', true)}
        ${render3DWeiSelect('shiKill', '十位杀号', true)}
        ${render3DWeiSelect('geKill', '个位杀号', true)}
      </div>

      <div class="section-divider"></div>

      <div style="margin-bottom:16px;">
        <div class="section-desc"><strong>4. 胆码过滤</strong>（包含选中号码）</div>
        ${render3DWeiSelect('baiDan', '百位胆码', true)}
        ${render3DWeiSelect('shiDan', '十位胆码', true)}
        ${render3DWeiSelect('geDan', '个位胆码', true)}
      </div>

      <div class="section-divider"></div>

      <div style="margin-bottom:16px;">
        <div class="section-desc"><strong>5. 二码过滤</strong></div>
        <div class="lottery-input-row">
          <label>二码和：</label>
          <div class="filter-options" id="d3ErMaHe">
            <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'d3ErMaHe')">不限</span>
            ${Array.from({length:19},(_,i)=>`<span class="filter-chip" data-v="${i}" onclick="toggleFilterChip(this,'d3ErMaHe')">${i < 10 ? '0'+i : i}</span>`).join('')}
          </div>
        </div>
        <div class="lottery-input-row">
          <label>二码差：</label>
          <div class="filter-options" id="d3ErMaCha">
            <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'d3ErMaCha')">不限</span>
            ${Array.from({length:10},(_,i)=>`<span class="filter-chip" data-v="${i}" onclick="toggleFilterChip(this,'d3ErMaCha')">${i}</span>`).join('')}
          </div>
        </div>
        <div class="lottery-input-row">
          <label>二码组合：</label>
          <div class="filter-options" id="d3ErMa" style="max-height:120px;overflow-y:auto;">
            <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'d3ErMa')">不限</span>
            ${['00','01','02','03','04','05','06','07','08','09','11','12','13','14','15','16','17','18','19','22','23','24','25','26','27','28','29','33','34','35','36','37','38','39','44','45','46','47','48','49','55','56','57','58','59','66','67','68','69','77','78','79','88','89','99'].map(v=>`<span class="filter-chip" data-v="${v}" onclick="toggleFilterChip(this,'d3ErMa')">${v}</span>`).join('')}
          </div>
        </div>
      </div>

      <div class="section-divider"></div>

      <div style="margin-bottom:16px;">
        <div class="section-desc"><strong>6. 012路过滤</strong></div>
        <div class="filter-options" id="d3012">
          <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'d3012')">不限</span>
          ${['000','001','002','010','011','012','020','021','022','100','101','102','110','111','112','120','121','122','200','201','202','210','211','212','220','221','222'].map(v=>`<span class="filter-chip" data-v="${v}" onclick="toggleFilterChip(this,'d3012')">${v}</span>`).join('')}
        </div>
      </div>

      <div class="section-divider"></div>

      <div style="margin-bottom:16px;">
        <div class="section-desc"><strong>7. 和值过滤</strong></div>
        <div class="lottery-input-row">
          <label>和值范围：</label>
          <input type="number" id="d3SumMin" placeholder="最小" style="width:70px;" value="0"> ~
          <input type="number" id="d3SumMax" placeholder="最大" style="width:70px;" value="27">
          <span style="font-size:12px;color:var(--text-light);">(0-27)</span>
        </div>
        <div class="lottery-input-row">
          <label>和尾：</label>
          <div class="filter-options" id="d3HeWei">
            <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'d3HeWei')">不限</span>
            ${Array.from({length:10},(_,i)=>`<span class="filter-chip" data-v="${i}" onclick="toggleFilterChip(this,'d3HeWei')">${i}</span>`).join('')}
          </div>
        </div>
        <div class="lottery-input-row">
          <label>跨度：</label>
          <div class="filter-options" id="d3KuaDu">
            <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'d3KuaDu')">不限</span>
            ${Array.from({length:10},(_,i)=>`<span class="filter-chip" data-v="${i}" onclick="toggleFilterChip(this,'d3KuaDu')">${i}</span>`).join('')}
          </div>
        </div>
      </div>

      <div class="section-divider"></div>

      <div style="margin-bottom:16px;">
        <div class="section-desc"><strong>8. 形态过滤</strong></div>
        <div class="lottery-input-row">
          <label>大中小：</label>
          <div class="filter-options" id="d3DZX" style="max-height:120px;overflow-y:auto;">
            <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'d3DZX')">不限</span>
            ${['小小小','小小中','小小大','小中小','小中中','小中大','小大小','小大中','小大大','中小小','中小中','中小大','中中小','中中中','中中大','中大小','中大中','中大大','大小小','大小中','大小大','大中小','大中中','大中大','大大小','大大中','大大大'].map(v=>`<span class="filter-chip" data-v="${v}" onclick="toggleFilterChip(this,'d3DZX')">${v}</span>`).join('')}
          </div>
        </div>
        <div class="lottery-input-row">
          <label>大小：</label>
          <div class="filter-options" id="d3Daxiao">
            <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'d3Daxiao')">不限</span>
            ${['大大大','大大小','大小大','小大大','小小小','小小大','小大小','大小小'].map(v=>`<span class="filter-chip" data-v="${v}" onclick="toggleFilterChip(this,'d3Daxiao')">${v}</span>`).join('')}
          </div>
        </div>
        <div class="lottery-input-row">
          <label>奇偶：</label>
          <div class="filter-options" id="d3Jiou">
            <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'d3Jiou')">不限</span>
            ${['奇奇奇','奇奇偶','奇偶奇','偶奇奇','偶偶偶','偶偶奇','偶奇偶','奇偶偶'].map(v=>`<span class="filter-chip" data-v="${v}" onclick="toggleFilterChip(this,'d3Jiou')">${v}</span>`).join('')}
          </div>
        </div>
        <div class="lottery-input-row">
          <label>质合：</label>
          <div class="filter-options" id="d3Zhihe">
            <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'d3Zhihe')">不限</span>
            ${['质质质','质质合','质合质','合质质','合合合','合合质','合质合','质合合'].map(v=>`<span class="filter-chip" data-v="${v}" onclick="toggleFilterChip(this,'d3Zhihe')">${v}</span>`).join('')}
          </div>
        </div>
        <div class="lottery-input-row">
          <label>顺子/半顺：</label>
          <div class="filter-options" id="d3Shunzi">
            <span class="filter-chip selected" data-v="none" onclick="toggleFilterChip(this,'d3Shunzi')">不过滤</span>
            <span class="filter-chip" data-v="filter" onclick="toggleFilterChip(this,'d3Shunzi')">过滤顺子</span>
            <span class="filter-chip" data-v="ban" onclick="toggleFilterChip(this,'d3Shunzi')">过滤半顺</span>
          </div>
        </div>
      </div>

      <div class="section-divider"></div>

      <div style="margin-bottom:16px;">
        <div class="section-desc"><strong>9. 组合选项</strong></div>
        <div class="lottery-input-row">
          <label>号码类型：</label>
          <div class="filter-options" id="d3Zuxuan">
            <span class="filter-chip" data-v="any" onclick="toggleFilterChip(this,'d3Zuxuan')">全部</span>
            <span class="filter-chip" data-v="zhixuan" onclick="toggleFilterChip(this,'d3Zuxuan')">直选</span>
            <span class="filter-chip" data-v="zusan" onclick="toggleFilterChip(this,'d3Zuxuan')">组三</span>
            <span class="filter-chip" data-v="zuliu" onclick="toggleFilterChip(this,'d3Zuxuan')">组六</span>
            <span class="filter-chip" data-v="baozi" onclick="toggleFilterChip(this,'d3Zuxuan')">豹子</span>
          </div>
        </div>
      </div>

      <div class="btn-group" style="margin-top:16px;">
        <button class="btn btn-primary" onclick="run3DFilter()">🔍 开始过滤</button>
        <button class="btn btn-secondary" onclick="reset3DFilter()">🔄 重置</button>
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

function render3DWeiSelect(id, label, isSmall) {
  const nums = Array.from({length:10}, (_, i) => i);
  return `
    <div class="wei-row">
      <span class="wei-label">${label}</span>
      <div class="wei-balls" id="${id}Grid">
        ${nums.map(n => `
          <button class="num-btn small ${isSmall ? '' : ''}" onclick="toggle3DWei('${id}', ${n})">
            ${n}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

// ---- 3D 位选切换 ----
function toggle3DWei(id, num) {
  if (!d3FilterState[id]) d3FilterState[id] = [];
  const idx = d3FilterState[id].indexOf(num);
  if (idx >= 0) {
    d3FilterState[id].splice(idx, 1);
  } else {
    d3FilterState[id].push(num);
  }
  // 更新UI
  const grid = document.getElementById(id + 'Grid');
  if (grid) {
    const btns = grid.querySelectorAll('.num-btn');
    btns.forEach(btn => {
      const n = parseInt(btn.textContent);
      btn.classList.toggle('selected', d3FilterState[id].includes(n));
    });
  }
}

// ---- 3D 过滤初始化 ----
function init3DFilterTool() {
  d3FilterState = {
    bai: Array.from({length:10}, (_, i) => i),
    shi: Array.from({length:10}, (_, i) => i),
    ge: Array.from({length:10}, (_, i) => i),
    baiKill: [], shiKill: [], geKill: [],
    baiDan: [], shiDan: [], geDan: [],
    erMaHe: [], erMaCha: [], erMa: [],
    d012: [], heZhi: [], heWei: [], kuaDu: [],
    dazhongxiao: [], daxiao: [], jiou: [], zhihe: [],
    shunzi: 'none',
    zuxuan: ['any'],
    dadan: ''
  };
  // 更新UI
  ['bai','shi','ge','baiKill','shiKill','geKill','baiDan','shiDan','geDan'].forEach(id => {
    const grid = document.getElementById(id + 'Grid');
    if (grid) {
      const btns = grid.querySelectorAll('.num-btn');
      btns.forEach(btn => {
        const n = parseInt(btn.textContent);
        btn.classList.toggle('selected', d3FilterState[id].includes(n));
      });
    }
  });
}

// ---- 3D 执行过滤 ----
function run3DFilter() {
  // 收集所有号码
  let allNums = [];

  // 检查大底
  const dadi = document.getElementById('d3Dadi')?.value.trim();
  if (dadi) {
    const lines = dadi.split(/[\n,，\s]+/).filter(l => l.trim());
    allNums = lines.map(l => {
      const s = l.trim();
      if (s.length === 3) return [parseInt(s[0]), parseInt(s[1]), parseInt(s[2])];
      return null;
    }).filter(n => n !== null);
  } else {
    if (d3FilterState.bai.length === 0 || d3FilterState.shi.length === 0 || d3FilterState.ge.length === 0) {
      ltToast('⚠️ 请选择至少一个百位、十位、个位号码');
      return;
    }
    for (const b of d3FilterState.bai) {
      for (const s of d3FilterState.shi) {
        for (const g of d3FilterState.ge) {
          allNums.push([b, s, g]);
        }
      }
    }
  }

  if (allNums.length === 0) {
    ltToast('⚠️ 请选择号码或输入大底');
    return;
  }

  // 杀号过滤
  if (d3FilterState.baiKill.length > 0) {
    allNums = allNums.filter(n => !d3FilterState.baiKill.includes(n[0]));
  }
  if (d3FilterState.shiKill.length > 0) {
    allNums = allNums.filter(n => !d3FilterState.shiKill.includes(n[1]));
  }
  if (d3FilterState.geKill.length > 0) {
    allNums = allNums.filter(n => !d3FilterState.geKill.includes(n[2]));
  }

  // 胆码过滤
  if (d3FilterState.baiDan.length > 0) {
    allNums = allNums.filter(n => d3FilterState.baiDan.includes(n[0]));
  }
  if (d3FilterState.shiDan.length > 0) {
    allNums = allNums.filter(n => d3FilterState.shiDan.includes(n[1]));
  }
  if (d3FilterState.geDan.length > 0) {
    allNums = allNums.filter(n => d3FilterState.geDan.includes(n[2]));
  }

  // 二码和
  const erMaHe = getFilterChipValues('d3ErMaHe');
  if (erMaHe.length > 0) {
    allNums = allNums.filter(n => {
      const sums = calcTwoCodeSum(n).map(s => '' + s);
      return erMaHe.some(v => sums.includes(v));
    });
  }

  // 二码差
  const erMaCha = getFilterChipValues('d3ErMaCha');
  if (erMaCha.length > 0) {
    allNums = allNums.filter(n => {
      const diffs = calcTwoCodeDiff(n).map(d => '' + d);
      return erMaCha.some(v => diffs.includes(v));
    });
  }

  // 二码组合
  const erMa = getFilterChipValues('d3ErMa');
  if (erMa.length > 0) {
    allNums = allNums.filter(n => {
      const codes = calcTwoCode(n).map(c => c < 10 ? '0' + c : '' + c);
      return erMa.some(v => codes.includes(v));
    });
  }

  // 012路
  const d012 = getFilterChipValues('d3012');
  if (d012.length > 0) {
    allNums = allNums.filter(n => {
      const r = calc3D012(n);
      return d012.includes(r);
    });
  }

  // 和值
  const sumMin = parseInt(document.getElementById('d3SumMin')?.value);
  const sumMax = parseInt(document.getElementById('d3SumMax')?.value);
  if (!isNaN(sumMin) || !isNaN(sumMax)) {
    allNums = allNums.filter(n => {
      const s = calc3DSum(n);
      if (!isNaN(sumMin) && s < sumMin) return false;
      if (!isNaN(sumMax) && s > sumMax) return false;
      return true;
    });
  }

  // 和尾
  const heWei = getFilterChipValues('d3HeWei');
  if (heWei.length > 0) {
    allNums = allNums.filter(n => heWei.includes('' + calc3DTail(n)));
  }

  // 跨度
  const kuaDu = getFilterChipValues('d3KuaDu');
  if (kuaDu.length > 0) {
    allNums = allNums.filter(n => kuaDu.includes('' + calc3DSpan(n)));
  }

  // 大中小
  const dzx = getFilterChipValues('d3DZX');
  if (dzx.length > 0) {
    allNums = allNums.filter(n => dzx.includes(get3DDZX(n)));
  }

  // 大小
  const dx = getFilterChipValues('d3Daxiao');
  if (dx.length > 0) {
    allNums = allNums.filter(n => dx.includes(get3DDaxiao(n)));
  }

  // 奇偶
  const jo = getFilterChipValues('d3Jiou');
  if (jo.length > 0) {
    allNums = allNums.filter(n => jo.includes(get3DJiou(n)));
  }

  // 质合
  const zh = getFilterChipValues('d3Zhihe');
  if (zh.length > 0) {
    allNums = allNums.filter(n => zh.includes(get3DZhihe(n)));
  }

  // 顺子
  const sz = getFilterChipValues('d3Shunzi');
  if (sz.includes('filter')) {
    allNums = allNums.filter(n => !is3DShunzi(n));
  }
  if (sz.includes('ban')) {
    allNums = allNums.filter(n => !is3DBanshunzi(n));
  }

  // 组合选项
  const zx = getFilterChipValues('d3Zuxuan');
  if (zx.length > 0 && !zx.includes('any')) {
    allNums = allNums.filter(n => {
      if (zx.includes('baozi') && is3DBaozi(n)) return true;
      if (zx.includes('zusan') && is3DZusan(n)) return true;
      if (zx.includes('zuliu') && is3DZuliu(n)) return true;
      if (zx.includes('zhixuan')) return true;
      return false;
    });
  }

  // 显示结果
  const total = allNums.length;
  document.getElementById('filterCount').textContent = `共 ${total.toLocaleString()} 注`;
  document.getElementById('filterCost').textContent = `共计 ${(total * 2).toLocaleString()} 元`;

  if (total > 0) {
    const show = allNums.slice(0, 100);
    let detailHtml = `<div style="font-size:12px;color:var(--text-light);margin-bottom:8px;">前${Math.min(100, total)}注示例：</div>`;
    show.forEach((n, i) => {
      detailHtml += `<div style="margin:2px 0;font-size:13px;font-family:monospace;">${i+1}. ${n.join(' ')}</div>`;
    });
    document.getElementById('filterDetail').innerHTML = detailHtml;
  } else {
    document.getElementById('filterDetail').innerHTML = '<div style="color:var(--text-light);">无符合条件的组合，请调整条件</div>';
  }
}

function reset3DFilter() {
  init3DFilterTool();
  document.getElementById('filterCount').textContent = '共 0 注';
  document.getElementById('filterCost').textContent = '0 元';
  document.getElementById('filterDetail').innerHTML = '';
  document.getElementById('d3Dadi').value = '';
  document.getElementById('d3SumMin').value = '0';
  document.getElementById('d3SumMax').value = '27';
  document.querySelectorAll('.filter-chip').forEach(c => {
    if (c.dataset.v === 'any' || c.dataset.v === 'none') c.classList.add('selected');
    else c.classList.remove('selected');
  });
}

// ============================================================
// 七星彩过滤
// ============================================================
function renderQxcFilterTool() {
  let html = `
    <div class="lottery-tool-section">
      <h3>🔍 七星彩 组号缩水</h3>
      <div class="lottery-tip">选择每位号码，系统将生成所有组合</div>`;
  for (let i = 0; i < 7; i++) {
    html += `
      <div class="wei-row">
        <span class="wei-label">第${i+1}位</span>
        <div class="wei-balls" id="qxcWei${i}Grid">
          ${Array.from({length:10}, (_, n) => `
            <button class="num-btn small" onclick="toggleQxcWei(${i}, ${n})">${n}</button>
          `).join('')}
        </div>
      </div>`;
  }
  html += `
      <div class="btn-group" style="margin-top:16px;">
        <button class="btn btn-primary" onclick="runQxcFilter()">🔍 生成</button>
      </div>
      <div class="lottery-result" id="filterResult">
        <div class="result-title">📊 结果</div>
        <div class="result-count" id="filterCount">共 0 注</div>
        <div class="result-cost" id="filterCost">0 元</div>
        <div style="margin-top:8px;font-size:13px;" id="filterDetail"></div>
      </div>
    </div>`;
  return html;
}

let qxcState = Array.from({length: 7}, () => Array.from({length: 10}, (_, i) => i));

function toggleQxcWei(wei, num) {
  const idx = qxcState[wei].indexOf(num);
  if (idx >= 0) qxcState[wei].splice(idx, 1);
  else qxcState[wei].push(num);
  qxcState[wei].sort((a, b) => a - b);
  const grid = document.getElementById('qxcWei' + wei + 'Grid');
  if (grid) {
    grid.querySelectorAll('.num-btn').forEach(btn => {
      const n = parseInt(btn.textContent);
      btn.classList.toggle('selected', qxcState[wei].includes(n));
    });
  }
}

function initQxcFilterTool() {
  qxcState = Array.from({length: 7}, () => Array.from({length: 10}, (_, i) => i));
  for (let i = 0; i < 7; i++) {
    const grid = document.getElementById('qxcWei' + i + 'Grid');
    if (grid) {
      grid.querySelectorAll('.num-btn').forEach(btn => {
        btn.classList.add('selected');
      });
    }
  }
}

function runQxcFilter() {
  let total = 1;
  for (let i = 0; i < 7; i++) {
    total *= qxcState[i].length;
  }
  document.getElementById('filterCount').textContent = `共 ${total.toLocaleString()} 注`;
  document.getElementById('filterCost').textContent = `共计 ${(total * 2).toLocaleString()} 元`;
  if (total > 1000) {
    document.getElementById('filterDetail').innerHTML = '<div style="color:var(--text-light);">注数过多，请选择更少的号码以查看示例</div>';
  } else if (total > 0) {
    const show = [];
    for (const a of qxcState[0]) {
      for (const b of qxcState[1]) {
        for (const c of qxcState[2]) {
          for (const d of qxcState[3]) {
            for (const e of qxcState[4]) {
              for (const f of qxcState[5]) {
                for (const g of qxcState[6]) {
                  show.push([a,b,c,d,e,f,g]);
                  if (show.length >= 50) break;
                }
                if (show.length >= 50) break;
              }
              if (show.length >= 50) break;
            }
            if (show.length >= 50) break;
          }
          if (show.length >= 50) break;
        }
        if (show.length >= 50) break;
      }
      if (show.length >= 50) break;
    }
    let detailHtml = '<div style="font-size:12px;color:var(--text-light);margin-bottom:8px;">前50注示例：</div>';
    show.forEach((n, i) => {
      detailHtml += `<div style="margin:2px 0;font-size:13px;font-family:monospace;">${i+1}. ${n.join(' ')}</div>`;
    });
    document.getElementById('filterDetail').innerHTML = detailHtml;
  }
}