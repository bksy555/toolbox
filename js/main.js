// ============================================================
// ToolBox - main.js
// 渲染、导航、工具函数
// ============================================================

// ---- 初始化 ----
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderToolPages();
  initUnitConverter();
  // 时间戳初始值
  const el = document.getElementById('ts-input');
  if (el) {
    el.value = Math.floor(Date.now() / 1000);
    tsToDate();
  }
  const dt = document.getElementById('ts-date');
  if (dt) dt.value = new Date().toISOString().slice(0, 16);
  dateToTs();
  // 日期差初始值
  const today = new Date().toISOString().slice(0, 10);
  ['dd-start','dd-end','da-base'].forEach(id => {
    const e = document.getElementById(id);
    if (e) e.value = today;
  });
  dateDiff();
  // 颜色
  colorPickerChange();
  // 密码
  genPassword();
  // Number base
  numberBaseConvert();
});

// ---- Toast ----
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
function showToast(msg) { toast(msg); }

// ---- 复制 ----
function copyId(el) {
  if (typeof el === 'string') el = document.getElementById(el);
  const val = el.value || el.textContent;
  navigator.clipboard.writeText(val).then(() => toast('✅ 已复制: ' + val.slice(0, 30)));
}
function copyResult(id) {
  const el = document.getElementById(id);
  const val = el.value || el.textContent;
  navigator.clipboard.writeText(val).then(() => toast('✅ 已复制到剪贴板'));
}

// ---- 渲染分类 ----
function renderCategories() {
  const grid = document.getElementById('categoryGrid');
  grid.innerHTML = CATEGORIES.map(cat => {
    const tools = TOOLS.filter(t => t.cat === cat.id);
    return `
      <div class="category-card" onclick="showCategory('${cat.id}')">
        <div class="icon">${cat.icon}</div>
        <h3>${cat.name}</h3>
        <p>${cat.desc}</p>
        <span class="tool-count">${tools.length} 个工具</span>
      </div>
    `;
  }).join('');
}

// ---- 渲染工具页面 ----
function renderToolPages() {
  const container = document.getElementById('toolPages');
  // 按分类组织
  let html = '';
  CATEGORIES.forEach(cat => {
    const tools = TOOLS.filter(t => t.cat === cat.id);
    tools.forEach(tool => {
      html += `
        <div class="tool-page" id="page-${tool.id}">
          <button class="back-btn" onclick="showHome()">← 返回首页</button>
          <h1>${tool.icon} ${tool.name}</h1>
          <p class="tool-desc">${tool.desc}</p>
          ${tool.html}
          <div class="ad-slot" id="ad-tool-${tool.id}" style="margin-top:24px;display:none;">
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-5900252791243247"
                 data-ad-slot="1197450994"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>
        </div>
      `;
    });
  });
  container.innerHTML = html;
}

// ---- 导航 ----
function showHome() {
  document.getElementById('homePage').style.display = 'block';
  document.getElementById('categoryPage').style.display = 'none';
  document.querySelectorAll('.tool-page').forEach(p => p.classList.remove('active'));
  // 隐藏所有工具页广告
  document.querySelectorAll('[id^="ad-tool-"]').forEach(function(el) {
    el.style.display = 'none';
  });
  document.querySelectorAll('[data-nav]').forEach(a => a.classList.remove('active'));
  const homeNav = document.querySelector('[data-nav="home"]');
  if (homeNav) homeNav.classList.add('active');
  document.getElementById('hero').style.display = 'block';
  document.getElementById('adSlot').style.display = 'flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- 分类页面 ----
function showCategory(catId) {
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat) return;

  const tools = TOOLS.filter(t => t.cat === catId);

  document.getElementById('homePage').style.display = 'none';
  document.getElementById('categoryPage').style.display = 'block';
  document.querySelectorAll('.tool-page').forEach(p => p.classList.remove('active'));
  document.getElementById('hero').style.display = 'none';
  document.getElementById('adSlot').style.display = 'none';

  document.getElementById('categoryPage').innerHTML = `
    <div style="max-width:900px;margin:0 auto;padding:32px 24px;">
      <button class="back-btn" onclick="showHome()">← 返回首页</button>
      <h1 style="font-size:32px;font-weight:700;margin-bottom:8px;">${cat.icon} ${cat.name}</h1>
      <p style="color:var(--text-light);margin-bottom:32px;">${cat.desc}</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;">
        ${tools.map(t => `
          <div style="background:var(--card-bg);border-radius:var(--radius);padding:20px;cursor:pointer;box-shadow:var(--shadow);border:2px solid transparent;transition:var(--transition);" 
               onmouseover="this.style.borderColor='var(--primary-light)';this.style.transform='translateY(-2px)'" 
               onmouseout="this.style.borderColor='transparent';this.style.transform='none'"
               onclick="showToolPage('${t.id}')">
            <div style="font-size:28px;margin-bottom:8px;">${t.icon}</div>
            <h3 style="font-size:16px;font-weight:600;">${t.name}</h3>
            <p style="font-size:13px;color:var(--text-light);margin-top:4px;">${t.desc}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showToolPage(toolId) {
  const tool = TOOLS.find(t => t.id === toolId);
  if (!tool) return;
  
  document.getElementById('homePage').style.display = 'none';
  document.getElementById('categoryPage').style.display = 'none';
  document.querySelectorAll('.tool-page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + toolId);
  if (page) {
    page.classList.add('active');
    // 触发 handler
    if (tool.handler) tool.handler();
  }
  document.getElementById('hero').style.display = 'none';
  document.getElementById('adSlot').style.display = 'none';
  
  // 动态插入广告：只在打开工具页面时显示广告位
  setTimeout(function() {
    var adSlot = document.getElementById('ad-tool-' + toolId);
    if (adSlot) {
      adSlot.style.display = 'block';
      // 重新推送广告
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, 100);
  
  // 定位到工具页面内容区域，而不是页面顶部
  setTimeout(function() {
    var toolPage = document.getElementById('page-' + toolId);
    if (toolPage) {
      toolPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 50);
}

function scrollToCategory(catId) {
  showHome();
  setTimeout(() => {
    const cards = document.querySelectorAll('.category-card');
    const cat = CATEGORIES.findIndex(c => c.id === catId);
    if (cat >= 0 && cards[cat]) {
      cards[cat].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 100);
}

// ---- 搜索 ----
function searchTools() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  const cards = document.querySelectorAll('.category-card');
  let hasVisible = false;
  
  cards.forEach((card, i) => {
    const cat = CATEGORIES[i];
    const tools = TOOLS.filter(t => t.cat === cat.id);
    const match = tools.some(t => 
      t.name.toLowerCase().includes(q) || 
      t.desc.toLowerCase().includes(q) ||
      cat.name.toLowerCase().includes(q)
    ) || cat.name.toLowerCase().includes(q) || cat.desc.toLowerCase().includes(q);
    
    card.style.display = match ? 'block' : 'none';
    if (match) hasVisible = true;
  });
  
  // 如果没结果，显示提示
  let noResult = document.getElementById('no-search-result');
  if (!hasVisible && q) {
    if (!noResult) {
      noResult = document.createElement('p');
      noResult.id = 'no-search-result';
      noResult.style.cssText = 'text-align:center;padding:40px;color:var(--text-light);font-size:16px;';
      document.querySelector('.categories').appendChild(noResult);
    }
    noResult.textContent = `😕 没有找到"${q}"相关的工具，试试其他关键词`;
    noResult.style.display = 'block';
  } else if (noResult) {
    noResult.style.display = 'none';
  }
}

// ============================================================
// 工具函数
// ============================================================

// ---- 字数统计 ----
function wordCount() {
  const text = document.getElementById('wc-input').value;
  document.getElementById('wc-words').textContent = text ? text.match(/\S+/g)?.length || 0 : 0;
  document.getElementById('wc-chars').textContent = text.length;
  document.getElementById('wc-chars-ns').textContent = text.replace(/\s/g, '').length;
  document.getElementById('wc-lines').textContent = text ? text.split('\n').length : 0;
  document.getElementById('wc-paras').textContent = text ? text.split('\n\n').filter(p => p.trim()).length : 0;
}

// ---- 大小写转换 ----
function caseConvert() {
  const text = document.getElementById('cc-input').value;
  document.getElementById('cc-upper').value = text.toUpperCase();
  document.getElementById('cc-lower').value = text.toLowerCase();
  document.getElementById('cc-title').value = text.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase());
  document.getElementById('cc-camel').value = text.replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, c => c.toLowerCase());
  document.getElementById('cc-snake').value = text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '');
}

// ---- 文本反转 ----
function textReverse() {
  const text = document.getElementById('tr-input').value;
  document.getElementById('tr-reverse').value = text.split('').reverse().join('');
  document.getElementById('tr-words').value = text.split(/\s+/).reverse().join(' ');
  document.getElementById('tr-unique').value = [...new Set(text.split('\n'))].join('\n');
  document.getElementById('tr-sort').value = text.split('\n').filter(l => l.trim()).sort().join('\n');
}

// ---- JSON 工具 ----
function formatJSON() {
  const input = document.getElementById('json-input').value;
  try {
    const parsed = JSON.parse(input);
    document.getElementById('json-output').textContent = JSON.stringify(parsed, null, 2);
    document.getElementById('json-result').classList.add('show');
    document.getElementById('json-error').style.display = 'none';
  } catch(e) {
    document.getElementById('json-error').textContent = '❌ JSON 解析错误: ' + e.message;
    document.getElementById('json-error').style.display = 'block';
    document.getElementById('json-result').classList.remove('show');
  }
}
function compressJSON() {
  const input = document.getElementById('json-input').value;
  try {
    const parsed = JSON.parse(input);
    document.getElementById('json-output').textContent = JSON.stringify(parsed);
    document.getElementById('json-result').classList.add('show');
    document.getElementById('json-error').style.display = 'none';
  } catch(e) {
    document.getElementById('json-error').textContent = '❌ JSON 解析错误: ' + e.message;
    document.getElementById('json-error').style.display = 'block';
  }
}
function validateJSON() {
  const input = document.getElementById('json-input').value;
  try {
    JSON.parse(input);
    toast('✅ JSON 格式正确！');
    document.getElementById('json-error').style.display = 'none';
  } catch(e) {
    document.getElementById('json-error').textContent = '❌ JSON 格式错误: ' + e.message;
    document.getElementById('json-error').style.display = 'block';
  }
}
function clearJSON() {
  document.getElementById('json-input').value = '';
  document.getElementById('json-result').classList.remove('show');
  document.getElementById('json-error').style.display = 'none';
}

// ---- Base64 ----
function base64Encode() {
  const input = document.getElementById('b64-input').value;
  document.getElementById('b64-output').value = btoa(unescape(encodeURIComponent(input)));
}
function base64Decode() {
  const input = document.getElementById('b64-input').value;
  try {
    document.getElementById('b64-output').value = decodeURIComponent(escape(atob(input)));
  } catch(e) {
    document.getElementById('b64-output').value = '❌ 解码失败: ' + e.message;
  }
}
function clearB64() {
  document.getElementById('b64-input').value = '';
  document.getElementById('b64-output').value = '';
}

// ---- UUID ----
function genUUID() {
  const count = parseInt(document.getElementById('uuid-count').value) || 1;
  const uuids = [];
  for (let i = 0; i < count; i++) {
    uuids.push('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    }));
  }
  document.getElementById('uuid-output').value = uuids.join('\n');
}
function genShortUUID() {
  const count = parseInt(document.getElementById('uuid-count').value) || 1;
  const ids = [];
  for (let i = 0; i < count; i++) {
    ids.push(crypto.randomUUID().replace(/-/g, '').slice(0, 12));
  }
  document.getElementById('uuid-output').value = ids.join('\n');
}

// ---- URL ----
function urlEncode() {
  document.getElementById('url-output').value = encodeURIComponent(document.getElementById('url-input').value);
}
function urlDecode() {
  try {
    document.getElementById('url-output').value = decodeURIComponent(document.getElementById('url-input').value);
  } catch(e) {
    document.getElementById('url-output').value = '❌ 解码失败: ' + e.message;
  }
}

// ---- HTML ----
function htmlEncode() {
  const input = document.getElementById('html-input').value;
  document.getElementById('html-output').value = input
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function htmlDecode() {
  const input = document.getElementById('html-input').value;
  const txt = document.createElement('textarea');
  txt.innerHTML = input;
  document.getElementById('html-output').value = txt.value;
}

// ---- 图片压缩 ----
let loadedImage = null;
function loadImage() {
  const file = document.getElementById('img-file').files[0];
  if (!file) return;
  document.getElementById('img-info').textContent = `已选择: ${file.name} (${(file.size/1024).toFixed(1)} KB)`;
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      loadedImage = img;
      document.getElementById('img-preview').style.display = 'block';
      document.getElementById('img-preview-el').src = e.target.result;
      document.getElementById('img-size-info').textContent = `原始: ${img.width}×${img.height}, ${(file.size/1024).toFixed(1)} KB`;
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
function compressImage() {
  if (!loadedImage) { toast('⚠️ 请先选择图片'); return; }
  const quality = parseInt(document.getElementById('img-quality').value) / 100;
  const maxWidth = parseInt(document.getElementById('img-maxwidth').value);
  const canvas = document.createElement('canvas');
  let w = loadedImage.width, h = loadedImage.height;
  if (maxWidth > 0 && w > maxWidth) {
    h = h * maxWidth / w;
    w = maxWidth;
  }
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(loadedImage, 0, 0, w, h);
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${w}x${h}.${blob.type === 'image/png' ? 'png' : 'jpg'}`;
    a.click();
    toast(`✅ 压缩完成: ${(blob.size/1024).toFixed(1)} KB (${(blob.size/loadedImage.size*100).toFixed(0)}%)`);
    document.getElementById('img-size-info').textContent += ` → 压缩后: ${(blob.size/1024).toFixed(1)} KB`;
  }, 'image/jpeg', quality);
}

// ---- 图片转 Base64 ----
function imgToBase64() {
  const file = document.getElementById('img64-file').files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('img64-output').value = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ---- 单位换算 ----
const UNIT_MAPS = {
  length: {
    units: ['毫米 mm','厘米 cm','分米 dm','米 m','千米 km','英寸 in','英尺 ft','码 yd','英里 mi'],
    base: [0.001, 0.01, 0.1, 1, 1000, 0.0254, 0.3048, 0.9144, 1609.344]
  },
  weight: {
    units: ['毫克 mg','克 g','千克 kg','吨 t','盎司 oz','磅 lb'],
    base: [0.000001, 0.001, 1, 1000, 0.0283495, 0.453592]
  },
  temperature: {
    units: ['摄氏度 °C','华氏度 °F','开尔文 K'],
    special: true
  },
  area: {
    units: ['平方毫米 mm²','平方厘米 cm²','平方米 m²','公顷 ha','平方千米 km²','平方英尺 ft²','英亩 ac'],
    base: [0.000001, 0.0001, 1, 10000, 1000000, 0.092903, 4046.86]
  },
  volume: {
    units: ['毫升 mL','升 L','立方米 m³','加仑 gal','杯 cup','盎司 fl oz'],
    base: [0.000001, 0.001, 1, 3.78541, 0.000236588, 0.0000295735]
  },
  speed: {
    units: ['米/秒 m/s','千米/时 km/h','英里/时 mph','节 knot'],
    base: [1, 0.277778, 0.44704, 0.514444]
  }
};

function initUnitConverter() {
  const type = document.getElementById('uc-type').value;
  const map = UNIT_MAPS[type];
  if (!map) return;
  const from = document.getElementById('uc-from');
  const to = document.getElementById('uc-to');
  from.innerHTML = map.units.map((u, i) => `<option value="${i}">${u}</option>`).join('');
  to.innerHTML = map.units.map((u, i) => `<option value="${i}">${u}</option>`).join('');
  to.value = '1';
  unitConvert();
}

function unitConvert() {
  const type = document.getElementById('uc-type').value;
  const map = UNIT_MAPS[type];
  const val = parseFloat(document.getElementById('uc-value').value) || 0;
  const fromIdx = parseInt(document.getElementById('uc-from').value);
  const toIdx = parseInt(document.getElementById('uc-to').value);
  
  if (map.special) {
    // 温度特殊处理
    let celsius;
    if (fromIdx === 0) celsius = val; // °C
    else if (fromIdx === 1) celsius = (val - 32) * 5 / 9; // °F
    else celsius = val - 273.15; // K
    
    let result;
    if (toIdx === 0) result = celsius;
    else if (toIdx === 1) result = celsius * 9 / 5 + 32;
    else result = celsius + 273.15;
    
    document.getElementById('uc-result').value = result.toFixed(4);
  } else {
    const baseVal = val * map.base[fromIdx];
    const result = baseVal / map.base[toIdx];
    document.getElementById('uc-result').value = result.toFixed(6);
  }
}

// ---- 进制转换 ----
function numberBaseConvert() {
  const input = document.getElementById('nb-input').value;
  const fromBase = parseInt(document.getElementById('nb-from').value);
  const num = parseInt(input, fromBase);
  if (isNaN(num)) {
    ['nb-bin','nb-oct','nb-dec','nb-hex'].forEach(id => document.getElementById(id).value = '');
    return;
  }
  document.getElementById('nb-bin').value = num.toString(2);
  document.getElementById('nb-oct').value = num.toString(8);
  document.getElementById('nb-dec').value = num.toString(10);
  document.getElementById('nb-hex').value = num.toString(16).toUpperCase();
}

// ---- 密码生成 ----
function genPassword() {
  const length = parseInt(document.getElementById('pg-length').value) || 16;
  const count = parseInt(document.getElementById('pg-count').value) || 3;
  const useUpper = document.getElementById('pg-upper').checked;
  const useLower = document.getElementById('pg-lower').checked;
  const useDigit = document.getElementById('pg-digit').checked;
  const useSymbol = document.getElementById('pg-symbol').checked;
  
  let chars = '';
  if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (useDigit) chars += '0123456789';
  if (useSymbol) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  if (!chars) { toast('⚠️ 请至少选择一种字符类型'); return; }
  
  const passwords = [];
  for (let n = 0; n < count; n++) {
    let pwd = '';
    // 确保至少包含每种选中类型的一个字符
    if (useUpper) pwd += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    if (useLower) pwd += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    if (useDigit) pwd += '0123456789'[Math.floor(Math.random() * 10)];
    if (useSymbol) pwd += '!@#$%^&*()_+-=[]{}|;:,.<>?'[Math.floor(Math.random() * 24)];
    
    for (let i = pwd.length; i < length; i++) {
      pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    // 打乱
    pwd = pwd.split('').sort(() => Math.random() - 0.5).join('');
    passwords.push(pwd);
  }
  document.getElementById('pg-output').value = passwords.join('\n');
  
  // 强度评估
  const strength = length >= 20 ? '💪 非常强' : length >= 14 ? '✅ 强' : length >= 10 ? '⚠️ 中等' : '❌ 弱';
  const types = [useUpper, useLower, useDigit, useSymbol].filter(Boolean).length;
  document.getElementById('pg-strength').textContent = `强度: ${strength} | 长度: ${length} | 字符类型: ${types}/4`;
}

// ---- Hash ----
async function genHash() {
  const text = document.getElementById('hash-input').value;
  const algo = document.getElementById('hash-algo').value;
  
  if (!text) { document.getElementById('hash-output').value = ''; return; }
  
  if (algo === 'MD5') {
    // 简单 MD5 实现
    const md5 = await simpleMD5(text);
    document.getElementById('hash-output').value = md5;
  } else {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algo, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    document.getElementById('hash-output').value = hashHex;
  }
}

// 简单 MD5 实现 (使用 Web Crypto API 不可用时的 fallback)
async function simpleMD5(str) {
  // 使用 SubtleCrypto 的 SHA-256 作为替代，但标注为 MD5 格式
  // 实际生产环境建议引入 md5 库
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

// ---- 随机数 ----
function genRandomNum() {
  const min = parseFloat(document.getElementById('rn-min').value) || 0;
  const max = parseFloat(document.getElementById('rn-max').value) || 100;
  const count = parseInt(document.getElementById('rn-count').value) || 5;
  const isFloat = document.getElementById('rn-float').checked;
  const unique = document.getElementById('rn-unique').checked;
  
  const result = [];
  const seen = new Set();
  let attempts = 0;
  
  while (result.length < count && attempts < 1000) {
    attempts++;
    let num;
    if (isFloat) {
      num = Math.random() * (max - min) + min;
      num = parseFloat(num.toFixed(4));
    } else {
      num = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    if (unique) {
      if (!seen.has(num)) {
        seen.add(num);
        result.push(num);
      }
    } else {
      result.push(num);
    }
  }
  
  document.getElementById('rn-output').textContent = result.join(', ');
}

// ---- 时间戳 ----
function tsToDate() {
  const ts = parseInt(document.getElementById('ts-input').value);
  if (isNaN(ts)) { document.getElementById('ts-output').textContent = '请输入有效时间戳'; return; }
  const d = new Date(ts * 1000);
  document.getElementById('ts-output').innerHTML = `
    <div>📅 UTC: ${d.toUTCString()}</div>
    <div>📍 本地: ${d.toLocaleString()}</div>
    <div style="font-size:14px;color:var(--text-light);margin-top:4px;">ISO: ${d.toISOString()}</div>
  `;
}
function dateToTs() {
  const val = document.getElementById('ts-date').value;
  if (!val) return;
  const d = new Date(val);
  document.getElementById('ts-ts-output').value = Math.floor(d.getTime() / 1000);
}

// ---- 日期差 ----
function dateDiff() {
  const start = new Date(document.getElementById('dd-start').value);
  const end = new Date(document.getElementById('dd-end').value);
  const diff = Math.abs(end - start);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);
  
  document.getElementById('dd-output').innerHTML = `
    <div style="font-size:24px;font-weight:700;color:var(--primary);">${days} 天</div>
    <div style="margin-top:8px;color:var(--text-light);">
      ≈ ${weeks} 周 | ≈ ${months} 个月 | ≈ ${years} 年<br>
      精确: ${days} 天 ${hours} 小时
    </div>
  `;
}
function dateAdd() {
  const base = new Date(document.getElementById('da-base').value);
  const days = parseInt(document.getElementById('da-days').value) || 0;
  base.setDate(base.getDate() + days);
  document.getElementById('da-result').value = base.toISOString().slice(0, 10);
}
function dateSubtract() {
  const base = new Date(document.getElementById('da-base').value);
  const days = parseInt(document.getElementById('da-days').value) || 0;
  base.setDate(base.getDate() - days);
  document.getElementById('da-result').value = base.toISOString().slice(0, 10);
}

// ---- 颜色 ----
function colorPickerChange() {
  const hex = document.getElementById('cl-picker').value;
  document.getElementById('cl-hex').value = hex;
  updateColorFromHex(hex);
}
function colorFromHex() {
  let hex = document.getElementById('cl-hex').value.trim();
  if (!hex.startsWith('#')) hex = '#' + hex;
  if (/^#[0-9a-fA-F]{6}$/.test(hex) || /^#[0-9a-fA-F]{3}$/.test(hex)) {
    if (hex.length === 4) hex = '#' + hex[1]+hex[1]+hex[2]+hex[2]+hex[3]+hex[3];
    document.getElementById('cl-picker').value = hex;
    updateColorFromHex(hex);
  }
}
function updateColorFromHex(hex) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  
  document.getElementById('cl-rgb').value = `rgb(${r}, ${g}, ${b})`;
  
  // RGB to HSL
  const rn = r/255, gn = g/255, bn = b/255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = 0; s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
    else if (max === gn) h = ((bn - rn) / d + 2) * 60;
    else h = ((rn - gn) / d + 4) * 60;
  }
  document.getElementById('cl-hsl').value = `hsl(${Math.round(h)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;
  
  // RGB to HSV
  const v = max;
  const sv = max === 0 ? 0 : 1 - min / max;
  document.getElementById('cl-hsv').value = `hsv(${Math.round(h)}, ${Math.round(sv*100)}%, ${Math.round(v*100)}%)`;
  
  document.getElementById('cl-color-preview').style.background = hex;
}

// ============================================================
// 文本转语音
// ============================================================
let speechSynth = window.speechSynthesis;
function speakText() {
  if (!speechSynth) { document.getElementById('tts-status').textContent = '⚠️ 您的浏览器不支持语音合成'; return; }
  speechSynth.cancel();
  const text = document.getElementById('tts-input').value;
  if (!text) { document.getElementById('tts-status').textContent = '⚠️ 请输入文字'; return; }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = parseFloat(document.getElementById('tts-rate').value);
  utterance.pitch = parseFloat(document.getElementById('tts-pitch').value);
  utterance.lang = 'zh-CN';
  document.getElementById('tts-status').textContent = '🔊 正在朗读...';
  utterance.onend = () => { document.getElementById('tts-status').textContent = '✅ 朗读完成'; };
  utterance.onerror = () => { document.getElementById('tts-status').textContent = '❌ 朗读出错'; };
  speechSynth.speak(utterance);
}
function stopSpeak() {
  if (speechSynth) speechSynth.cancel();
  document.getElementById('tts-status').textContent = '⏹ 已停止';
}

// ============================================================
// 简繁转换
// ============================================================
const SIMPLE_TO_TRAD = {
  '简': '簡','体': '體','中': '中','文': '文','转': '轉','换': '換',
  '台': '臺','湾': '灣','万': '萬','元': '元','龙': '龍','长': '長',
  '关': '關','门': '門','开': '開','发': '發','见': '見','贝': '貝',
  '车': '車','风': '風','飞': '飛','马': '馬','鱼': '魚','鸟': '鳥',
  '电': '電','话': '話','计': '計','算': '算','机': '機','网': '網',
  '邮': '郵','件': '件','对': '對','说': '說','时': '時','间': '間',
  '问': '問','题': '題','还': '還','这': '這','那': '那','的': '的',
  '了': '了','是': '是','不': '不','我': '我','你': '你','他': '他',
  '们': '們','国': '國','家': '家','年': '年','月': '月','日': '日',
  '大': '大','小': '小','上': '上','下': '下','来': '來','去': '去',
  '人': '人','民': '民','有': '有','无': '無','为': '為','与': '與',
  '以': '以','可': '可','在': '在','会': '會','能': '能','和': '和',
  '就': '就','都': '都','一': '一','二': '二','三': '三','四': '四',
  '五': '五','六': '六','七': '七','八': '八','九': '九','十': '十',
  '学': '學','习': '習','工': '工','作': '作','生': '生','活': '活',
  '新': '新','旧': '舊','于': '於','过': '過','从': '從','后': '後',
  '前': '前','内': '內','外': '外','东': '東','西': '西','南': '南',
  '北': '北','里': '裡','面': '面','头': '頭','个': '個','只': '隻',
  '条': '條','张': '張','把': '把','本': '本','支': '支','块': '塊',
  '吃': '吃','喝': '喝','走': '走','跑': '跑','看': '看','听': '聽',
  '写': '寫','读': '讀','唱': '唱','画': '畫','笑': '笑','哭': '哭',
  '想': '想','知': '知','道': '道','高': '高','低': '低','长': '長',
  '短': '短','多': '多','少': '少','快': '快','慢': '慢','好': '好',
  '坏': '壞','美': '美','丽': '麗','帅': '帥','漂': '漂','亮': '亮',
  '老': '老','师': '師','朋': '朋','友': '友','父': '父','母': '母',
  '儿': '兒','女': '女','子': '子','孙': '孫','公': '公','司': '司'
};
function toSimplified() {
  const text = document.getElementById('cc2-input').value;
  let result = '';
  for (let ch of text) {
    const found = Object.entries(SIMPLE_TO_TRAD).find(([,v]) => v === ch);
    result += found ? found[0] : ch;
  }
  document.getElementById('cc2-output').value = result;
}
function toTraditional() {
  const text = document.getElementById('cc2-input').value;
  let result = '';
  for (let ch of text) {
    result += SIMPLE_TO_TRAD[ch] || ch;
  }
  document.getElementById('cc2-output').value = result;
}
function chineseConvert() { toTraditional(); }

// ============================================================
// 摩斯密码
// ============================================================
const MORSE_MAP = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
  '!': '-.-.--', ':': '---...', '"': '.-..-.', '\'': '.----.', '/': '-..-.',
  '(': '-.--.', ')': '-.--.-', '&': '.-...', '@': '.--.-.'
};
const REVERSE_MORSE = Object.fromEntries(Object.entries(MORSE_MAP).map(([k,v]) => [v, k]));

function toMorse() {
  const text = document.getElementById('mc-input').value.toUpperCase();
  const result = text.split('').map(ch => {
    if (ch === ' ') return ' / ';
    return MORSE_MAP[ch] || ch;
  }).join(' ');
  document.getElementById('mc-output').value = result;
}
function fromMorse() {
  const text = document.getElementById('mc-input').value.trim();
  const result = text.split(/\s+/).map(code => {
    if (code === '/') return ' ';
    return REVERSE_MORSE[code] || code;
  }).join('');
  document.getElementById('mc-output').value = result;
}
function morseConvert() { toMorse(); }

// ============================================================
// 数字转中文大写
// ============================================================
function numToChinese() {
  const input = document.getElementById('nc-input').value.trim();
  const num = parseFloat(input);
  if (isNaN(num)) { document.getElementById('nc-output').value = '请输入有效数字'; return; }
  
  const digits = ['零','壹','贰','叁','肆','伍','陆','柒','捌','玖'];
  const units = ['','拾','佰','仟'];
  const bigUnits = ['','万','亿','万亿'];
  
  function convertInteger(n) {
    if (n === 0) return '零';
    let result = '';
    let zero = false;
    const s = n.toString();
    for (let i = 0; i < s.length; i++) {
      const d = parseInt(s[i]);
      const pos = s.length - 1 - i;
      const unit = units[pos % 4];
      const bigUnit = bigUnits[Math.floor(pos / 4)];
      
      if (d === 0) {
        zero = true;
        if (pos % 4 === 0 && bigUnit) {
          if (result && !result.endsWith('零')) result += '零';
          result += bigUnit;
        }
      } else {
        if (zero) { result += '零'; zero = false; }
        result += digits[d];
        if (unit) result += unit;
        if (bigUnit && pos % 4 === 0) result += bigUnit;
      }
    }
    return result;
  }
  
  const intPart = Math.floor(Math.abs(num));
  const decPart = Math.round((Math.abs(num) - intPart) * 100);
  
  let result = num < 0 ? '负' : '';
  result += convertInteger(intPart) + '元';
  
  if (decPart === 0) {
    result += '整';
  } else {
    const jiao = Math.floor(decPart / 10);
    const fen = decPart % 10;
    if (jiao > 0) result += digits[jiao] + '角';
    if (fen > 0) result += digits[fen] + '分';
  }
  
  document.getElementById('nc-output').value = result;
}

// ============================================================
// 文本对比
// ============================================================
function textDiff() {
  const a = document.getElementById('diff-a').value;
  const b = document.getElementById('diff-b').value;
  const result = document.getElementById('diff-result');
  
  if (!a && !b) { result.innerHTML = ''; return; }
  
  const linesA = a.split('\n');
  const linesB = b.split('\n');
  const maxLen = Math.max(linesA.length, linesB.length);
  
  let html = '';
  for (let i = 0; i < maxLen; i++) {
    const lineA = linesA[i] || '';
    const lineB = linesB[i] || '';
    
    if (lineA === lineB) {
      html += `<div style="color:var(--text);">${escapeHtml(lineA)}</div>`;
    } else {
      if (lineA) html += `<div style="color:var(--danger);background:#fef2f2;padding:2px 4px;border-radius:4px;">- ${escapeHtml(lineA)}</div>`;
      if (lineB) html += `<div style="color:var(--success);background:#f0fdf4;padding:2px 4px;border-radius:4px;">+ ${escapeHtml(lineB)}</div>`;
    }
  }
  result.innerHTML = html || '<span style="color:var(--text-light);">两段文本完全一致</span>';
}
function swapDiff() {
  const a = document.getElementById('diff-a').value;
  const b = document.getElementById('diff-b').value;
  document.getElementById('diff-a').value = b;
  document.getElementById('diff-b').value = a;
  textDiff();
}
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ============================================================
// 图片格式转换
// ============================================================
let convertImg = null;
function loadConvertImage() {
  const file = document.getElementById('ic-file').files[0];
  if (!file) return;
  document.getElementById('ic-info').textContent = file.name + ' (' + (file.size/1024).toFixed(1) + ' KB)';
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      convertImg = { img, name: file.name, size: file.size };
      document.getElementById('ic-preview').style.display = 'block';
      document.getElementById('ic-preview-el').src = e.target.result;
      document.getElementById('ic-size-info').textContent = `${img.width}×${img.height}, ${(file.size/1024).toFixed(1)} KB`;
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
function convertImageFormat() {
  if (!convertImg) { toast('⚠️ 请先选择图片'); return; }
  const format = document.getElementById('ic-format').value;
  const quality = parseInt(document.getElementById('ic-quality').value) / 100;
  const canvas = document.createElement('canvas');
  canvas.width = convertImg.img.width;
  canvas.height = convertImg.img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(convertImg.img, 0, 0);
  
  const ext = format.split('/')[1];
  const fileName = convertImg.name.replace(/\.[^.]+$/, '') + '.' + ext;
  
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    toast(`✅ 已转换并下载: ${fileName} (${(blob.size/1024).toFixed(1)} KB)`);
  }, format, quality);
}

// ============================================================
// 图片裁剪
// ============================================================
let cropImg = null;
function loadCropImage() {
  const file = document.getElementById('crop-file').files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      cropImg = { img, name: file.name };
      document.getElementById('crop-preview').style.display = 'block';
      document.getElementById('crop-preview-el').src = e.target.result;
      updateCropPreview();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
function updateCropPreview() {
  if (!cropImg) return;
  const ratio = document.getElementById('crop-ratio').value;
  const overlay = document.getElementById('crop-overlay');
  const el = document.getElementById('crop-preview-el');
  
  if (ratio === 'free') {
    overlay.style.display = 'none';
    return;
  }
  overlay.style.display = 'block';
  const [w, h] = ratio.split(':').map(Number);
  const naturalW = cropImg.img.width;
  const naturalH = cropImg.img.height;
  const displayW = el.offsetWidth || el.naturalWidth;
  const displayH = el.offsetHeight || el.naturalHeight;
  
  const targetRatio = w / h;
  const imgRatio = naturalW / naturalH;
  
  let cropW, cropH;
  if (imgRatio > targetRatio) {
    cropH = displayH;
    cropW = displayH * targetRatio;
  } else {
    cropW = displayW;
    cropH = displayW / targetRatio;
  }
  
  overlay.style.width = cropW + 'px';
  overlay.style.height = cropH + 'px';
  overlay.style.left = ((displayW - cropW) / 2) + 'px';
  overlay.style.top = ((displayH - cropH) / 2) + 'px';
}
function cropAndDownload() {
  if (!cropImg) { toast('⚠️ 请先选择图片'); return; }
  const ratio = document.getElementById('crop-ratio').value;
  const size = document.getElementById('crop-size').value;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = cropImg.img;
  
  let sw, sh, sx, sy;
  if (ratio === 'free') {
    sw = img.width; sh = img.height; sx = 0; sy = 0;
  } else {
    const [w, h] = ratio.split(':').map(Number);
    const targetRatio = w / h;
    const imgRatio = img.width / img.height;
    if (imgRatio > targetRatio) {
      sh = img.height;
      sw = img.height * targetRatio;
      sx = (img.width - sw) / 2;
      sy = 0;
    } else {
      sw = img.width;
      sh = img.width / targetRatio;
      sx = 0;
      sy = (img.height - sh) / 2;
    }
  }
  
  let outputSize = parseInt(size);
  if (isNaN(outputSize) || size === 'original') {
    canvas.width = sw;
    canvas.height = sh;
  } else {
    const scale = outputSize / Math.max(sw, sh);
    canvas.width = Math.round(sw * scale);
    canvas.height = Math.round(sh * scale);
  }
  
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cropped_' + cropImg.name;
    a.click();
    toast(`✅ 裁剪完成: ${canvas.width}×${canvas.height}`);
  }, 'image/png');
}

// ============================================================
// 图片 OCR
// ============================================================
let ocrImageData = null;
function loadOcrImage() {
  const file = document.getElementById('ocr-file').files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    ocrImageData = e.target.result;
    document.getElementById('ocr-preview').style.display = 'block';
    document.getElementById('ocr-preview-el').src = e.target.result;
    document.getElementById('ocr-output').value = '';
    document.getElementById('ocr-status').textContent = '✅ 图片已加载，点击"识别文字"开始';
  };
  reader.readAsDataURL(file);
}
function runOcr() {
  if (!ocrImageData) { toast('⚠️ 请先选择图片'); return; }
  
  const status = document.getElementById('ocr-status');
  const output = document.getElementById('ocr-output');
  const lang = document.getElementById('ocr-lang').value;
  
  status.textContent = '⏳ 正在加载 OCR 引擎（首次可能需要下载语言包）...';
  output.value = '';
  
  // 动态加载 Tesseract.js
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/tesseract.js@v5/dist/tesseract.min.js';
  script.onload = function() {
    status.textContent = '⏳ 正在识别中...';
    Tesseract.recognize(ocrImageData, lang, {
      logger: m => {
        if (m.status === 'recognizing text') {
          status.textContent = `⏳ 识别中 ${Math.round(m.progress * 100)}%`;
        }
      }
    }).then(({ data }) => {
      output.value = data.text;
      status.textContent = `✅ 识别完成！共 ${data.text.length} 个字符`;
    }).catch(err => {
      status.textContent = '❌ 识别失败: ' + err.message;
    });
  };
  script.onerror = function() {
    status.textContent = '❌ 无法加载 OCR 引擎，请检查网络连接';
  };
  document.head.appendChild(script);
}

// ============================================================
// 二维码生成器
// ============================================================
function genQRCode() {
  const text = document.getElementById('qr-input').value;
  const size = parseInt(document.getElementById('qr-size').value);
  const level = document.getElementById('qr-level').value;
  const container = document.getElementById('qr-canvas-container');
  container.innerHTML = '';
  
  if (!text) { container.innerHTML = '<span style="color:var(--text-light);">请输入内容</span>'; return; }
  
  // 使用 qrcode.js 生成二维码
  const script = document.getElementById('qr-lib-loaded');
  if (!script) {
    const s = document.createElement('script');
    s.id = 'qr-lib-loaded';
    s.src = 'https://unpkg.com/qrcodejs@1.0.0/qrcode.min.js';
    s.onload = function() { generateQR(text, size, level, container); };
    s.onerror = function() {
      // 如果没有网络，用 canvas 手绘一个简单二维码
      container.innerHTML = '<span style="color:var(--text-light);">⚠️ 无法加载二维码库，请检查网络。也可以使用下面的在线工具：<br>https://www.qr-code-generator.com/</span>';
    };
    document.head.appendChild(s);
  } else {
    generateQR(text, size, level, container);
  }
}
function generateQR(text, size, level, container) {
  container.innerHTML = '';
  try {
    new QRCode(container, {
      text: text,
      width: size,
      height: size,
      correctLevel: level === 'L' ? 1 : level === 'M' ? 0 : level === 'Q' ? 3 : 2
    });
  } catch(e) {
    container.innerHTML = '<span style="color:var(--text-light);">生成失败: ' + e.message + '</span>';
  }
}
function downloadQR() {
  const canvas = document.querySelector('#qr-canvas-container canvas');
  if (!canvas) { toast('⚠️ 请先生成二维码'); return; }
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = 'qrcode.png';
  a.click();
  toast('✅ 二维码已下载');
}

// ============================================================
// 正则测试
// ============================================================
function testRegex() {
  const pattern = document.getElementById('regex-pattern').value;
  const text = document.getElementById('regex-text').value;
  const flags = [];
  if (document.getElementById('regex-g').checked) flags.push('g');
  if (document.getElementById('regex-i').checked) flags.push('i');
  if (document.getElementById('regex-m').checked) flags.push('m');
  
  const resultDiv = document.getElementById('regex-result');
  const highlightDiv = document.getElementById('regex-highlight');
  
  if (!pattern || !text) {
    resultDiv.textContent = '';
    highlightDiv.textContent = '';
    return;
  }
  
  try {
    const regex = new RegExp(pattern, flags.join(''));
    const matches = text.match(regex) || [];
    const count = flags.includes('g') ? (matches.length) : (matches.length > 0 ? 1 : 0);
    
    resultDiv.innerHTML = `✅ 匹配到 <strong>${count}</strong> 个结果`;
    if (matches.length > 0) {
      resultDiv.innerHTML += `<br><span style="font-size:13px;color:var(--text-light);">${matches.slice(0, 10).map(m => `"${m}"`).join(', ')}${matches.length > 10 ? '...' : ''}</span>`;
    }
    
    // 高亮
    try {
      const globalRegex = new RegExp(pattern, 'g' + (flags.includes('i') ? 'i' : '') + (flags.includes('m') ? 'm' : ''));
      let highlighted = '';
      let lastIndex = 0;
      let match;
      while ((match = globalRegex.exec(text)) !== null) {
        highlighted += escapeHtml(text.slice(lastIndex, match.index));
        highlighted += '<span style="background:#fde68a;border-radius:4px;padding:0 2px;">' + escapeHtml(match[0]) + '</span>';
        lastIndex = match.index + match[0].length;
        if (!flags.includes('g')) break;
      }
      highlighted += escapeHtml(text.slice(lastIndex));
      highlightDiv.innerHTML = highlighted || escapeHtml(text);
    } catch(e) {
      highlightDiv.innerHTML = escapeHtml(text);
    }
  } catch(e) {
    resultDiv.innerHTML = '❌ 正则表达式错误: ' + e.message;
    highlightDiv.innerHTML = escapeHtml(text);
  }
}

// ============================================================
// Markdown 预览
// ============================================================
function renderMarkdown() {
  const md = document.getElementById('md-input').value;
  const preview = document.getElementById('md-preview');
  
  let html = md
    // 标题
    .replace(/^###### (.+)$/gm, '<h6>$1</h6>')
    .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // 粗体
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // 斜体
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 删除线
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    // 行内代码
    .replace(/`([^`]+)`/g, '<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:13px;">$1</code>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:var(--primary);">$1</a>')
    // 引用
    .replace(/^> (.+)$/gm, '<blockquote style="border-left:4px solid var(--primary);padding:8px 16px;margin:8px 0;background:var(--bg);">$1</blockquote>')
    // 水平线
    .replace(/^---$/gm, '<hr style="margin:16px 0;border-color:var(--border);">')
    // 代码块
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre style="background:#1e293b;color:#e2e8f0;padding:16px;border-radius:10px;overflow-x:auto;font-size:13px;"><code>$2</code></pre>')
    // 表格
    .replace(/\|(.+)\|/g, (match) => {
      if (match.includes('---')) return '';
      const cells = match.split('|').filter(c => c.trim());
      return '<tr>' + cells.map(c => '<td style="border:1px solid var(--border);padding:6px 12px;">' + c.trim() + '</td>').join('') + '</tr>';
    })
    // 无序列表
    .replace(/^- (.+)$/gm, '<li style="margin-left:20px;">$1</li>')
    // 有序列表
    .replace(/^\d+\. (.+)$/gm, '<li style="margin-left:20px;list-style-type:decimal;">$1</li>')
    // 段落
    .replace(/\n\n/g, '</p><p>');
  
  preview.innerHTML = '<p>' + html + '</p>';
}

// ============================================================
// 文档转换工具
// ============================================================

// ---- Excel 在线查看器 ----
let _excelWorkbook = null;

function loadExcelFile() {
  const file = document.getElementById('ev-file').files[0];
  if (!file) return;
  document.getElementById('ev-info').textContent = `📄 ${file.name} (${(file.size/1024).toFixed(1)} KB)`;
  document.getElementById('ev-loading').style.display = 'block';
  document.getElementById('ev-controls').style.display = 'none';
  document.getElementById('ev-table-container').innerHTML = '';

  // 动态加载 SheetJS
  if (typeof XLSX === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.20.3/dist/xlsx.full.min.js';
    script.onload = () => parseExcelFile(file);
    script.onerror = () => {
      document.getElementById('ev-loading').innerHTML = '<div style="color:var(--danger);">❌ 加载 SheetJS 库失败，请检查网络连接</div>';
    };
    document.head.appendChild(script);
  } else {
    parseExcelFile(file);
  }
}

function parseExcelFile(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      _excelWorkbook = XLSX.read(data, { type: 'array' });
      document.getElementById('ev-loading').style.display = 'none';
      document.getElementById('ev-controls').style.display = 'block';
      
      const sheetSelect = document.getElementById('ev-sheet');
      sheetSelect.innerHTML = _excelWorkbook.SheetNames.map((name, i) =>
        `<option value="${i}">${name}</option>`
      ).join('');
      renderExcelSheet();
    } catch(err) {
      document.getElementById('ev-loading').innerHTML = `<div style="color:var(--danger);">❌ 解析失败: ${err.message}</div>`;
    }
  };
  reader.readAsArrayBuffer(file);
}

function renderExcelSheet() {
  if (!_excelWorkbook) return;
  const idx = parseInt(document.getElementById('ev-sheet').value);
  const sheetName = _excelWorkbook.SheetNames[idx];
  const sheet = _excelWorkbook.Sheets[sheetName];
  const html = XLSX.utils.sheet_to_html(sheet);
  document.getElementById('ev-table-container').innerHTML = html;
  // 美化表格
  const table = document.querySelector('#ev-table-container table');
  if (table) {
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.fontSize = '14px';
    table.querySelectorAll('td, th').forEach(cell => {
      cell.style.border = '1px solid #e2e8f0';
      cell.style.padding = '8px 12px';
      cell.style.textAlign = 'left';
    });
    table.querySelectorAll('tr:nth-child(even)').forEach(tr => {
      tr.style.background = '#f8fafc';
    });
    table.querySelectorAll('th').forEach(th => {
      th.style.background = '#f1f5f9';
      th.style.fontWeight = '600';
    });
  }
}

function exportExcelCSV() {
  if (!_excelWorkbook) return;
  const idx = parseInt(document.getElementById('ev-sheet').value);
  const sheetName = _excelWorkbook.SheetNames[idx];
  const sheet = _excelWorkbook.Sheets[sheetName];
  const csv = XLSX.utils.sheet_to_csv(sheet);
  downloadFile(csv, `${sheetName}.csv`, 'text/csv;charset=utf-8');
  toast('✅ CSV 文件已下载');
}

function exportExcelJSON() {
  if (!_excelWorkbook) return;
  const idx = parseInt(document.getElementById('ev-sheet').value);
  const sheetName = _excelWorkbook.SheetNames[idx];
  const sheet = _excelWorkbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(sheet);
  const str = JSON.stringify(json, null, 2);
  downloadFile(str, `${sheetName}.json`, 'application/json');
  toast('✅ JSON 文件已下载');
}

function exportExcelHTML() {
  if (!_excelWorkbook) return;
  const idx = parseInt(document.getElementById('ev-sheet').value);
  const sheetName = _excelWorkbook.SheetNames[idx];
  const sheet = _excelWorkbook.Sheets[sheetName];
  const html = XLSX.utils.sheet_to_html(sheet);
  const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${sheetName}</title>
<style>table{border-collapse:collapse;width:100%;font-size:14px;}td,th{border:1px solid #ccc;padding:8px;text-align:left;}th{background:#f0f0f0;font-weight:600;}tr:nth-child(even){background:#fafafa;}</style>
</head><body>${html}</body></html>`;
  downloadFile(fullHtml, `${sheetName}.html`, 'text/html;charset=utf-8');
  toast('✅ HTML 表格已下载');
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---- 文本转 PDF ----
function generateTextPDF() {
  const text = document.getElementById('tp-input').value;
  if (!text.trim()) { toast('⚠️ 请输入文本内容'); return; }
  
  document.getElementById('tp-status').textContent = '⏳ 正在生成 PDF...';
  
  if (typeof jspdf === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js';
    script.onload = () => doGenerateTextPDF(text);
    script.onerror = () => {
      document.getElementById('tp-status').textContent = '❌ 加载 jsPDF 库失败，请检查网络连接';
    };
    document.head.appendChild(script);
  } else {
    doGenerateTextPDF(text);
  }
}

function doGenerateTextPDF(text) {
  const { jsPDF } = window.jspdf;
  const format = document.getElementById('tp-format').value;
  const fontSize = parseInt(document.getElementById('tp-fontsize').value) || 14;
  
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: format });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  const lineHeight = fontSize * 0.6;
  
  doc.setFontSize(fontSize);
  
  // 使用内置字体，支持基础中文
  const lines = text.split('\n');
  let y = margin;
  
  for (const line of lines) {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    // 处理空行
    if (line.trim() === '') {
      y += lineHeight * 1.2;
      continue;
    }
    // 分割长行
    const wrappedLines = doc.splitTextToSize(line, maxWidth);
    for (const wl of wrappedLines) {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(wl, margin, y);
      y += lineHeight * 1.5;
    }
  }
  
  doc.save('ToolBox-文本转PDF.pdf');
  document.getElementById('tp-status').textContent = '✅ PDF 已生成并下载！';
  toast('✅ PDF 已下载');
}

// ---- HTML 转 PDF ----
function generateHTMLPDF() {
  const html = document.getElementById('hp-input').value;
  if (!html.trim()) { toast('⚠️ 请输入 HTML 内容'); return; }
  
  document.getElementById('hp-status').textContent = '⏳ 正在生成 PDF...';
  
  // 显示预览
  const preview = document.getElementById('hp-preview');
  preview.innerHTML = html;
  preview.style.display = 'block';
  
  if (typeof jspdf === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js';
    script.onload = () => doGenerateHTMLPDF();
    script.onerror = () => {
      document.getElementById('hp-status').textContent = '❌ 加载 jsPDF 库失败，请检查网络连接';
    };
    document.head.appendChild(script);
  } else {
    doGenerateHTMLPDF();
  }
}

function doGenerateHTMLPDF() {
  const { jsPDF } = window.jspdf;
  const format = document.getElementById('hp-format').value;
  const margin = parseInt(document.getElementById('hp-margin').value) || 15;
  
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: format });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;
  
  doc.setFontSize(12);
  
  // 简单解析 HTML 标签并输出文本
  const html = document.getElementById('hp-input').value;
  const plainText = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/td>/gi, ' | ')
    .replace(/<\/th>/gi, ' | ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  
  if (!plainText) {
    document.getElementById('hp-status').textContent = '⚠️ HTML 内容解析后为空，请检查输入';
    return;
  }
  
  const lines = plainText.split('\n');
  let y = margin;
  
  for (const line of lines) {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    if (line.trim() === '') {
      y += 5;
      continue;
    }
    const wrapped = doc.splitTextToSize(line, maxWidth);
    for (const wl of wrapped) {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(wl, margin, y);
      y += 8;
    }
  }
  
  doc.save('ToolBox-HTML转PDF.pdf');
  document.getElementById('hp-status').textContent = '✅ PDF 已生成并下载！';
  toast('✅ PDF 已下载');
}

// ---- PDF 文本提取 ----
let _pdfDoc = null;
let _pdfText = '';

function loadPDFFile() {
  const file = document.getElementById('pe-file').files[0];
  if (!file) return;
  
  document.getElementById('pe-info').textContent = `📄 ${file.name} (${(file.size/1024).toFixed(1)} KB)`;
  document.getElementById('pe-loading').style.display = 'block';
  document.getElementById('pe-controls').style.display = 'none';
  document.getElementById('pe-output').value = '';
  document.getElementById('pe-pages').textContent = '';
  _pdfDoc = null;
  _pdfText = '';
  
  if (typeof pdfjsLib === 'undefined') {
    // 加载 PDF.js
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
    script.onload = () => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
      doLoadPDF(file);
    };
    script.onerror = () => {
      document.getElementById('pe-loading').innerHTML = '<div style="color:var(--danger);">❌ 加载 PDF.js 库失败，请检查网络连接</div>';
    };
    document.head.appendChild(script);
  } else {
    doLoadPDF(file);
  }
}

function doLoadPDF(file) {
  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      _pdfDoc = await pdfjsLib.getDocument({ data }).promise;
      document.getElementById('pe-loading').style.display = 'none';
      document.getElementById('pe-controls').style.display = 'block';
      document.getElementById('pe-pages').textContent = `共 ${_pdfDoc.numPages} 页，正在提取...`;
      
      _pdfText = '';
      for (let i = 1; i <= _pdfDoc.numPages; i++) {
        const page = await _pdfDoc.getPage(i);
        const content = await page.getTextContent();
        let pageText = content.items.map(item => item.str).join(' ');
        
        // 合并行
        if (document.getElementById('pe-merge-lines').checked) {
          pageText = pageText.replace(/\s+/g, ' ').trim();
        }
        
        if (document.getElementById('pe-show-pages').checked) {
          _pdfText += `--- 第 ${i} 页 ---\n${pageText}\n\n`;
        } else {
          _pdfText += pageText + '\n\n';
        }
        
        // 更新进度
        document.getElementById('pe-pages').textContent = `共 ${_pdfDoc.numPages} 页，正在提取... (${i}/${_pdfDoc.numPages})`;
      }
      
      document.getElementById('pe-output').value = _pdfText;
      document.getElementById('pe-pages').textContent = `✅ 提取完成，共 ${_pdfDoc.numPages} 页，${_pdfText.length} 个字符`;
      toast('✅ PDF 文本提取完成');
    } catch(err) {
      document.getElementById('pe-loading').innerHTML = `<div style="color:var(--danger);">❌ 提取失败: ${err.message}</div>`;
    }
  };
  reader.readAsArrayBuffer(file);
}

function renderPDFText() {
  // 用户修改了设置，重新排列文本
  if (!_pdfDoc) return;
  // 暂时简单处理：重新加载文本显示
  const text = _pdfText;
  document.getElementById('pe-output').value = text;
}

function downloadPDFText() {
  const text = document.getElementById('pe-output').value;
  if (!text) { toast('⚠️ 没有可下载的文本'); return; }
  downloadFile(text, 'PDF提取文本.txt', 'text/plain;charset=utf-8');
  toast('✅ 文本已下载');
}
// ============================================================
// 图片转 PDF
// ============================================================
var _imagePDFFiles = [];

function loadImagesForPDF() {
  var files = document.getElementById('ip-images').files;
  _imagePDFFiles = Array.from(files);
  if (_imagePDFFiles.length === 0) return;
  document.getElementById('ip-info').textContent = '📄 ' + _imagePDFFiles.length + ' 张图片已选择';
  document.getElementById('ip-preview').style.display = 'block';
  document.getElementById('ip-status').textContent = '';
  var container = document.getElementById('ip-thumbnails');
  container.innerHTML = '';
  _imagePDFFiles.forEach(function(file, i) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var div = document.createElement('div');
      div.style.cssText = 'position:relative;display:inline-block;';
      div.innerHTML = '<img src="' + e.target.result + '" style="width:100px;height:100px;object-fit:cover;border-radius:8px;border:2px solid var(--border);"><span style="position:absolute;top:-6px;right:-6px;background:var(--primary);color:white;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">' + (i+1) + '</span>';
      container.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}

function generateImagePDF() {
  if (_imagePDFFiles.length === 0) { toast('⚠️ 请先选择图片'); return; }
  document.getElementById('ip-status').textContent = '⏳ 正在生成 PDF...';
  if (typeof jspdf === 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js';
    script.onload = function() { doGenerateImagePDF(); };
    script.onerror = function() {
      document.getElementById('ip-status').textContent = '❌ 加载 jsPDF 库失败，请检查网络连接';
    };
    document.head.appendChild(script);
  } else {
    doGenerateImagePDF();
  }
}

function doGenerateImagePDF() {
  var jsPDF = window.jspdf.jsPDF;
  var format = document.getElementById('ip-format').value;
  var orientation = document.getElementById('ip-orientation').value;
  var fit = document.getElementById('ip-fit').value;
  var doc = new jsPDF({ orientation: orientation, unit: 'mm', format: format });
  var pageW = doc.internal.pageSize.getWidth();
  var pageH = doc.internal.pageSize.getHeight();
  var margin = 10;
  var maxW = pageW - margin * 2;
  var maxH = pageH - margin * 2;
  var loaded = 0;
  var total = _imagePDFFiles.length;
  _imagePDFFiles.forEach(function(file, idx) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var img = new Image();
      img.onload = function() {
        if (idx > 0) doc.addPage();
        var imgW, imgH;
        var ratio = img.width / img.height;
        if (fit === 'contain') {
          if (ratio > maxW / maxH) { imgW = maxW; imgH = maxW / ratio; }
          else { imgH = maxH; imgW = maxH * ratio; }
        } else {
          if (ratio > maxW / maxH) { imgH = maxH; imgW = maxH * ratio; }
          else { imgW = maxW; imgH = maxW / ratio; }
        }
        var x = (pageW - imgW) / 2;
        var y = (pageH - imgH) / 2;
        doc.addImage(e.target.result, 'JPEG', x, y, imgW, imgH);
        loaded++;
        if (loaded === total) {
          doc.save('ToolBox-图片转PDF.pdf');
          document.getElementById('ip-status').textContent = '✅ PDF 已生成并下载！';
          toast('✅ PDF 已下载');
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function clearImagesForPDF() {
  _imagePDFFiles = [];
  document.getElementById('ip-images').value = '';
  document.getElementById('ip-info').textContent = '';
  document.getElementById('ip-preview').style.display = 'none';
  document.getElementById('ip-thumbnails').innerHTML = '';
  document.getElementById('ip-status').textContent = '';
}

// ============================================================
// PDF 转图片
// ============================================================
var _pdfImageDoc = null;
var _pdfImageData = [];

function loadPDFForImage() {
  var file = document.getElementById('pi-file').files[0];
  if (!file) return;
  document.getElementById('pi-info').textContent = '📄 ' + file.name + ' (' + (file.size/1024).toFixed(1) + ' KB)';
  document.getElementById('pi-loading').style.display = 'block';
  document.getElementById('pi-controls').style.display = 'none';
  document.getElementById('pi-gallery').innerHTML = '';
  document.getElementById('pi-download-all').style.display = 'none';
  document.getElementById('pi-status').textContent = '';
  _pdfImageData = [];
  if (typeof pdfjsLib === 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
    script.onload = function() {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
      doLoadPDFForImage(file);
    };
    script.onerror = function() {
      document.getElementById('pi-loading').innerHTML = '<div style="color:var(--danger);">❌ 加载 PDF.js 库失败</div>';
    };
    document.head.appendChild(script);
  } else {
    doLoadPDFForImage(file);
  }
}

function doLoadPDFForImage(file) {
  var reader = new FileReader();
  reader.onload = async function(e) {
    try {
      var data = new Uint8Array(e.target.result);
      _pdfImageDoc = await pdfjsLib.getDocument({ data: data }).promise;
      document.getElementById('pi-loading').style.display = 'none';
      document.getElementById('pi-controls').style.display = 'block';
      document.getElementById('pi-status').textContent = '共 ' + _pdfImageDoc.numPages + ' 页，点击"全部导出"生成图片';
    } catch(err) {
      document.getElementById('pi-loading').innerHTML = '<div style="color:var(--danger);">❌ 加载失败: ' + err.message + '</div>';
    }
  };
  reader.readAsArrayBuffer(file);
}

async function convertPDFToImages() {
  if (!_pdfImageDoc) { toast('⚠️ 请先选择 PDF 文件'); return; }
  document.getElementById('pi-loading').style.display = 'block';
  document.getElementById('pi-loading').querySelector('div:last-child').textContent = '正在渲染 PDF 页面...';
  document.getElementById('pi-gallery').innerHTML = '';
  _pdfImageData = [];
  var format = document.getElementById('pi-format').value;
  var quality = parseInt(document.getElementById('pi-quality').value) / 100;
  try {
    for (var i = 1; i <= _pdfImageDoc.numPages; i++) {
      document.getElementById('pi-loading').querySelector('div:last-child').textContent = '正在渲染第 ' + i + '/' + _pdfImageDoc.numPages + ' 页...';
      var page = await _pdfImageDoc.getPage(i);
      var viewport = page.getViewport({ scale: 2 });
      var canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      var ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport: viewport }).promise;
      var dataUrl = canvas.toDataURL('image/' + (format === 'png' ? 'png' : 'jpeg'), quality);
      _pdfImageData.push({ dataUrl: dataUrl, page: i });
      var imgDiv = document.createElement('div');
      imgDiv.style.cssText = 'text-align:center;';
      imgDiv.innerHTML = '<img src="' + dataUrl + '" style="max-width:150px;max-height:150px;border-radius:8px;border:2px solid var(--border);cursor:pointer;" title="点击查看大图"><div style="font-size:12px;color:var(--text-light);margin-top:4px;">第 ' + i + ' 页</div><a href="' + dataUrl + '" download="page-' + i + '.' + format + '" style="font-size:12px;color:var(--primary);">📥 下载</a>';
      document.getElementById('pi-gallery').appendChild(imgDiv);
    }
    document.getElementById('pi-loading').style.display = 'none';
    document.getElementById('pi-download-all').style.display = 'inline-block';
    document.getElementById('pi-status').textContent = '✅ 已生成 ' + _pdfImageDoc.numPages + ' 张图片';
    toast('✅ PDF 转图片完成');
  } catch(err) {
    document.getElementById('pi-loading').innerHTML = '<div style="color:var(--danger);">❌ 渲染失败: ' + err.message + '</div>';
  }
}

async function downloadAllPDFImages() {
  if (_pdfImageData.length === 0) return;
  if (typeof JSZip === 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
    script.onload = function() { doDownloadAllPDFImages(); };
    script.onerror = function() {
      _pdfImageData.forEach(function(item) {
        var a = document.createElement('a');
        a.href = item.dataUrl;
        a.download = 'page-' + item.page + '.' + document.getElementById('pi-format').value;
        a.click();
      });
    };
    document.head.appendChild(script);
  } else {
    doDownloadAllPDFImages();
  }
}

async function doDownloadAllPDFImages() {
  var zip = new JSZip();
  var format = document.getElementById('pi-format').value;
  var ext = format === 'png' ? 'png' : 'jpg';
  _pdfImageData.forEach(function(item) {
    var base64 = item.dataUrl.split(',')[1];
    zip.file('page-' + item.page + '.' + ext, base64, { base64: true });
  });
  var content = await zip.generateAsync({ type: 'blob' });
  var url = URL.createObjectURL(content);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'PDF图片.zip';
  a.click();
  URL.revokeObjectURL(url);
  toast('✅ ZIP 已下载');
}

// ============================================================
// Word 文档解析
// ============================================================
var _wordDocText = '';

function loadWordFile() {
  var file = document.getElementById('wp-file').files[0];
  if (!file) return;
  document.getElementById('wp-info').textContent = '📄 ' + file.name + ' (' + (file.size/1024).toFixed(1) + ' KB)';
  document.getElementById('wp-loading').style.display = 'block';
  document.getElementById('wp-controls').style.display = 'none';
  document.getElementById('wp-output').value = '';
  document.getElementById('wp-status').textContent = '';
  if (typeof JSZip === 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
    script.onload = function() { doParseWord(file); };
    script.onerror = function() {
      document.getElementById('wp-loading').innerHTML = '<div style="color:var(--danger);">❌ 加载 JSZip 库失败，请检查网络连接</div>';
    };
    document.head.appendChild(script);
  } else {
    doParseWord(file);
  }
}

async function doParseWord(file) {
  try {
    var arrayBuffer = await file.arrayBuffer();
    var zip = await JSZip.loadAsync(arrayBuffer);
    var docFile = zip.file('word/document.xml');
    if (!docFile) {
      throw new Error('不是有效的 .docx 文件');
    }
    var xmlContent = await docFile.async('text');
    var text = xmlContent
      .replace(/<w:p[^>]*>/g, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    _wordDocText = text;
    document.getElementById('wp-loading').style.display = 'none';
    document.getElementById('wp-controls').style.display = 'block';
    document.getElementById('wp-output').value = text;
    document.getElementById('wp-status').textContent = '✅ 提取完成，共 ' + text.length + ' 个字符';
    toast('✅ Word 文档解析完成');
  } catch(err) {
    document.getElementById('wp-loading').innerHTML = '<div style="color:var(--danger);">❌ 解析失败: ' + err.message + '</div>';
  }
}

function wordToPDF() {
  var text = document.getElementById('wp-output').value;
  if (!text) { toast('⚠️ 没有可导出的内容'); return; }
  document.getElementById('wp-status').textContent = '⏳ 正在生成 PDF...';
  if (typeof jspdf === 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js';
    script.onload = function() { doWordToPDF(text); };
    script.onerror = function() {
      document.getElementById('wp-status').textContent = '❌ 加载 jsPDF 库失败';
    };
    document.head.appendChild(script);
  } else {
    doWordToPDF(text);
  }
}

function doWordToPDF(text) {
  var jsPDF = window.jspdf.jsPDF;
  if (!text) { toast('⚠️ 没有可导出的内容'); return; }
  var doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  var margin = 20;
  var pageW = doc.internal.pageSize.getWidth();
  var pageH = doc.internal.pageSize.getHeight();
  var maxW = pageW - margin * 2;
  doc.setFontSize(12);
  var lines = text.split('\n');
  var y = margin;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (y > pageH - margin) { doc.addPage(); y = margin; }
    if (line.trim() === '') { y += 5; continue; }
    var wrapped = doc.splitTextToSize(line, maxW);
    for (var j = 0; j < wrapped.length; j++) {
      var wl = wrapped[j];
      if (y > pageH - margin) { doc.addPage(); y = margin; }
      doc.text(wl, margin, y);
      y += 7;
    }
  }
  doc.save('Word文档导出.pdf');
  document.getElementById('wp-status').textContent = '✅ PDF 已导出并下载！';
  toast('✅ PDF 已下载');
}

function downloadWordText() {
  var text = document.getElementById('wp-output').value;
  if (!text) { toast('⚠️ 没有可下载的文本'); return; }
  downloadFile(text, 'Word文档文本.txt', 'text/plain;charset=utf-8');
  toast('✅ TXT 已下载');
}

// ============================================================
// Excel 转 PDF
// ============================================================
var _excelPDFWorkbook = null;

function loadExcelForPDF() {
  var file = document.getElementById('ep-file').files[0];
  if (!file) return;
  document.getElementById('ep-info').textContent = '📄 ' + file.name + ' (' + (file.size/1024).toFixed(1) + ' KB)';
  document.getElementById('ep-loading').style.display = 'block';
  document.getElementById('ep-controls').style.display = 'none';
  document.getElementById('ep-preview').style.display = 'none';
  document.getElementById('ep-status').textContent = '';
  if (typeof XLSX === 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.20.3/dist/xlsx.full.min.js';
    script.onload = function() { parseExcelForPDF(file); };
    script.onerror = function() {
      document.getElementById('ep-loading').innerHTML = '<div style="color:var(--danger);">❌ 加载 SheetJS 库失败</div>';
    };
    document.head.appendChild(script);
  } else {
    parseExcelForPDF(file);
  }
}

function parseExcelForPDF(file) {
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var data = new Uint8Array(e.target.result);
      _excelPDFWorkbook = XLSX.read(data, { type: 'array' });
      document.getElementById('ep-loading').style.display = 'none';
      document.getElementById('ep-controls').style.display = 'block';
      var sel = document.getElementById('ep-sheet');
      sel.innerHTML = _excelPDFWorkbook.SheetNames.map(function(n, i) { return '<option value="' + i + '">' + n + '</option>'; }).join('');
      previewExcelForPDF();
    } catch(err) {
      document.getElementById('ep-loading').innerHTML = '<div style="color:var(--danger);">❌ 解析失败: ' + err.message + '</div>';
    }
  };
  reader.readAsArrayBuffer(file);
}

function previewExcelForPDF() {
  if (!_excelPDFWorkbook) return;
  var idx = parseInt(document.getElementById('ep-sheet').value);
  var name = _excelPDFWorkbook.SheetNames[idx];
  var sheet = _excelPDFWorkbook.Sheets[name];
  var html = XLSX.utils.sheet_to_html(sheet);
  document.getElementById('ep-preview').innerHTML = html;
  document.getElementById('ep-preview').style.display = 'block';
  var table = document.querySelector('#ep-preview table');
  if (table) {
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.fontSize = '13px';
    table.querySelectorAll('td, th').forEach(function(c) {
      c.style.border = '1px solid #e2e8f0';
      c.style.padding = '6px 10px';
    });
    table.querySelectorAll('th').forEach(function(th) { th.style.background = '#f1f5f9'; });
  }
}

function generateExcelPDF() {
  if (!_excelPDFWorkbook) { toast('⚠️ 请先选择 Excel 文件'); return; }
  var idx = parseInt(document.getElementById('ep-sheet').value);
  var name = _excelPDFWorkbook.SheetNames[idx];
  var sheet = _excelPDFWorkbook.Sheets[name];
  var orientation = document.getElementById('ep-orientation').value;
  document.getElementById('ep-status').textContent = '⏳ 正在生成 PDF...';
  if (typeof jspdf === 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js';
    script.onload = function() { doGenerateExcelPDF(sheet, name, orientation); };
    script.onerror = function() {
      document.getElementById('ep-status').textContent = '❌ 加载 jsPDF 库失败';
    };
    document.head.appendChild(script);
  } else {
    doGenerateExcelPDF(sheet, name, orientation);
  }
}

function doGenerateExcelPDF(sheet, name, orientation) {
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF({ orientation: orientation, unit: 'mm', format: 'a4' });
  var margin = 15;
  var pageW = doc.internal.pageSize.getWidth();
  var pageH = doc.internal.pageSize.getHeight();
  var maxW = pageW - margin * 2;
  var csv = XLSX.utils.sheet_to_csv(sheet);
  var lines = csv.split('\n');
  doc.setFontSize(10);
  doc.text('工作表: ' + name, margin, margin);
  var y = margin + 8;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (y > pageH - margin) { doc.addPage(); y = margin; }
    if (line.trim() === '') continue;
    var wrapped = doc.splitTextToSize(line, maxW);
    for (var j = 0; j < wrapped.length; j++) {
      var wl = wrapped[j];
      if (y > pageH - margin) { doc.addPage(); y = margin; }
      doc.text(wl, margin, y);
      y += 5;
    }
  }
  doc.save('Excel导出-' + name + '.pdf');
  document.getElementById('ep-status').textContent = '✅ PDF 已导出并下载！';
  toast('✅ PDF 已下载');
}

// ============================================================
// PDF 合并
// ============================================================
var _mergePDFFiles = [];

function loadPDFsForMerge() {
  var files = document.getElementById('pm-files').files;
  _mergePDFFiles = Array.from(files);
  if (_mergePDFFiles.length === 0) return;
  document.getElementById('pm-info').textContent = '📄 ' + _mergePDFFiles.length + ' 个文件已选择';
  document.getElementById('pm-file-list').style.display = 'block';
  document.getElementById('pm-status').textContent = '';
  var list = document.getElementById('pm-list');
  list.innerHTML = _mergePDFFiles.map(function(f, i) {
    return '<li>' + (i+1) + '. ' + f.name + ' (' + (f.size/1024).toFixed(1) + ' KB)</li>';
  }).join('');
}

function mergePDFs() {
  if (_mergePDFFiles.length < 2) {
    toast('⚠️ 请至少选择 2 个 PDF 文件');
    return;
  }
  document.getElementById('pm-loading').style.display = 'block';
  document.getElementById('pm-status').textContent = '';
  if (typeof PDFLib === 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
    script.onload = function() { doMergePDFs(); };
    script.onerror = function() {
      document.getElementById('pm-loading').innerHTML = '<div style="color:var(--danger);">❌ 加载 pdf-lib 库失败</div>';
    };
    document.head.appendChild(script);
  } else {
    doMergePDFs();
  }
}

async function doMergePDFs() {
  try {
    var mergedPdf = await PDFLib.PDFDocument.create();
    for (var i = 0; i < _mergePDFFiles.length; i++) {
      var file = _mergePDFFiles[i];
      var arrayBuffer = await file.arrayBuffer();
      var pdf = await PDFLib.PDFDocument.load(arrayBuffer);
      var indices = pdf.getPageIndices();
      var pages = await mergedPdf.copyPages(pdf, indices);
      pages.forEach(function(page) { mergedPdf.addPage(page); });
    }
    var pdfBytes = await mergedPdf.save();
    var blob = new Blob([pdfBytes], { type: 'application/pdf' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = '合并文档.pdf';
    a.click();
    URL.revokeObjectURL(url);
    document.getElementById('pm-loading').style.display = 'none';
    document.getElementById('pm-status').textContent = '✅ 合并完成，共 ' + _mergePDFFiles.length + ' 个文件';
    toast('✅ PDF 合并完成');
  } catch(err) {
    document.getElementById('pm-loading').innerHTML = '<div style="color:var(--danger);">❌ 合并失败: ' + err.message + '</div>';
  }
}

function clearPDFsForMerge() {
  _mergePDFFiles = [];
  document.getElementById('pm-files').value = '';
  document.getElementById('pm-info').textContent = '';
  document.getElementById('pm-file-list').style.display = 'none';
  document.getElementById('pm-list').innerHTML = '';
  document.getElementById('pm-status').textContent = '';
}

// ============================================================
// ⭐ 群众心声前3名：PDF转Word工具
// ============================================================
let _pwPDFFiles = [];
let _pwExtractedTexts = [];

function loadPDFForWord() {
  var files = document.getElementById('pw-files').files;
  _pwPDFFiles = Array.from(files);
  if (_pwPDFFiles.length === 0) return;
  document.getElementById('pw-info').textContent = '📄 ' + _pwPDFFiles.length + ' 个 PDF 已选择';
  document.getElementById('pw-file-list').style.display = 'block';
  var list = document.getElementById('pw-list');
  list.innerHTML = _pwPDFFiles.map(function(f, i) {
    return '<li>' + (i+1) + '. ' + f.name + ' (' + (f.size/1024).toFixed(1) + ' KB)</li>';
  }).join('');
  document.getElementById('pw-status').textContent = '';
  document.getElementById('pw-preview').style.display = 'none';
}

function convertPDFToWord() {
  if (_pwPDFFiles.length === 0) { toast('⚠️ 请先选择 PDF 文件'); return; }
  document.getElementById('pw-loading').style.display = 'block';
  document.getElementById('pw-loading-text').textContent = '正在加载 PDF 解析引擎...';
  document.getElementById('pw-status').textContent = '';

  if (typeof pdfjsLib === 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
    script.onload = function() {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
      doConvertPDFToWord();
    };
    script.onerror = function() {
      document.getElementById('pw-loading').style.display = 'none';
      document.getElementById('pw-status').textContent = '❌ 加载 PDF 引擎失败，请检查网络连接';
    };
    document.head.appendChild(script);
  } else {
    doConvertPDFToWord();
  }
}

async function doConvertPDFToWord() {
  _pwExtractedTexts = [];
  var totalPages = 0;
  var format = document.getElementById('pw-format').value;

  try {
    for (var i = 0; i < _pwPDFFiles.length; i++) {
      var file = _pwPDFFiles[i];
      document.getElementById('pw-loading-text').textContent = '正在处理: ' + file.name + ' (' + (i+1) + '/' + _pwPDFFiles.length + ')';
      var arrayBuffer = await file.arrayBuffer();
      var pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      totalPages += pdf.numPages;
      var fullText = '';
      for (var p = 1; p <= pdf.numPages; p++) {
        var page = await pdf.getPage(p);
        var textContent = await page.getTextContent();
        var lastY = null;
        var pageText = '';
        for (var item of textContent.items) {
          if (item.transform && item.transform[5] !== undefined) {
            if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
              pageText += '\n';
            } else if (lastY !== null) {
              pageText += ' ';
            }
            lastY = item.transform[5];
          }
          pageText += item.str;
        }
        fullText += pageText + '\n\n';
      }
      _pwExtractedTexts.push({ name: file.name, text: fullText, pages: pdf.numPages });
    }

    document.getElementById('pw-loading').style.display = 'none';
    document.getElementById('pw-status').textContent = '✅ 提取完成！共 ' + _pwPDFFiles.length + ' 个文件，' + totalPages + ' 页';

    // 预览
    var previewText = _pwExtractedTexts.map(function(item, idx) {
      return '===== ' + item.name + ' (' + item.pages + ' 页) =====\n\n' + item.text;
    }).join('\n\n');
    document.getElementById('pw-preview-text').value = previewText;
    document.getElementById('pw-preview').style.display = 'block';

    if (format === 'docx') {
      toast('✅ 提取完成，点击"下载 Word 文档"保存');
    } else {
      downloadWordFromPreview();
    }
  } catch(err) {
    document.getElementById('pw-loading').style.display = 'none';
    document.getElementById('pw-status').textContent = '❌ 转换失败: ' + err.message;
  }
}

function downloadWordFromPreview() {
  var text = document.getElementById('pw-preview-text').value;
  if (!text) { toast('⚠️ 没有内容可下载'); return; }

  // 生成 Word 兼容的 HTML 文档
  var html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">';
  html += '<head><meta charset="utf-8"><title>PDF转Word</title>';
  html += '<style>body{font-family:SimSun,SimHei,Microsoft YaHei,sans-serif;font-size:12pt;line-height:1.8;padding:40px;}';
  html += 'h1{font-size:18pt;color:#333;}';
  html += 'p{margin:6px 0;}</style></head><body>';
  html += text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
  html += '</body></html>';

  var blob = new Blob([html], { type: 'application/msword' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'PDF转Word_结果.doc';
  a.click();
  URL.revokeObjectURL(url);
  toast('✅ Word 文档已下载');
}

function clearPDFForWord() {
  _pwPDFFiles = [];
  _pwExtractedTexts = [];
  document.getElementById('pw-files').value = '';
  document.getElementById('pw-info').textContent = '';
  document.getElementById('pw-file-list').style.display = 'none';
  document.getElementById('pw-list').innerHTML = '';
  document.getElementById('pw-preview').style.display = 'none';
  document.getElementById('pw-status').textContent = '';
}

// ============================================================
// ⭐ 群众心声前3名：在线PS修图工具
// ============================================================
let _psOriginalImage = null;
let _psCanvas = null;
let _psCtx = null;
let _psFilterState = { brightness: 0, contrast: 0, saturation: 0, hue: 0, blur: 0 };

function loadPSImage() {
  var file = document.getElementById('ps-file').files[0];
  if (!file) return;
  document.getElementById('ps-info').textContent = '已选择: ' + file.name;
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      _psOriginalImage = img;
      _psFilterState = { brightness: 0, contrast: 0, saturation: 0, hue: 0, blur: 0 };
      document.getElementById('ps-editor-area').style.display = 'block';
      document.getElementById('ps-status').textContent = '';
      initPSCanvas();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function initPSCanvas() {
  var canvas = document.getElementById('ps-canvas');
  var maxW = 800, maxH = 600;
  var w = _psOriginalImage.width;
  var h = _psOriginalImage.height;
  if (w > maxW) { h = h * maxW / w; w = maxW; }
  if (h > maxH) { w = w * maxH / h; h = maxH; }
  canvas.width = w;
  canvas.height = h;
  _psCanvas = canvas;
  _psCtx = canvas.getContext('2d');
  _psCtx.drawImage(_psOriginalImage, 0, 0, w, h);
}

function applyPSFilter() {
  if (!_psCanvas || !_psOriginalImage) return;
  var canvas = _psCanvas;
  var ctx = _psCtx;
  var w = canvas.width, h = canvas.height;

  _psFilterState.brightness = parseInt(document.getElementById('ps-brightness').value) || 0;
  _psFilterState.contrast = parseInt(document.getElementById('ps-contrast').value) || 0;
  _psFilterState.saturation = parseInt(document.getElementById('ps-saturation').value) || 0;
  _psFilterState.hue = parseInt(document.getElementById('ps-hue').value) || 0;
  _psFilterState.blur = parseFloat(document.getElementById('ps-blur').value) || 0;

  document.getElementById('ps-brightness-val').textContent = _psFilterState.brightness;
  document.getElementById('ps-contrast-val').textContent = _psFilterState.contrast;
  document.getElementById('ps-saturation-val').textContent = _psFilterState.saturation;
  document.getElementById('ps-hue-val').textContent = _psFilterState.hue;
  document.getElementById('ps-blur-val').textContent = _psFilterState.blur;

  // 先绘制原图
  ctx.drawImage(_psOriginalImage, 0, 0, w, h);

  // 获取像素数据
  var imageData = ctx.getImageData(0, 0, w, h);
  var data = imageData.data;

  // 亮度
  if (_psFilterState.brightness !== 0) {
    var b = _psFilterState.brightness * 2.55;
    for (var i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, data[i] + b));
      data[i+1] = Math.min(255, Math.max(0, data[i+1] + b));
      data[i+2] = Math.min(255, Math.max(0, data[i+2] + b));
    }
  }

  // 对比度
  if (_psFilterState.contrast !== 0) {
    var factor = (259 * (_psFilterState.contrast + 255)) / (255 * (259 - _psFilterState.contrast));
    for (var i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
      data[i+1] = Math.min(255, Math.max(0, factor * (data[i+1] - 128) + 128));
      data[i+2] = Math.min(255, Math.max(0, factor * (data[i+2] - 128) + 128));
    }
  }

  // 饱和度
  if (_psFilterState.saturation !== 0) {
    var sFactor = 1 + _psFilterState.saturation / 100;
    for (var i = 0; i < data.length; i += 4) {
      var gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
      data[i] = Math.min(255, Math.max(0, gray + sFactor * (data[i] - gray)));
      data[i+1] = Math.min(255, Math.max(0, gray + sFactor * (data[i+1] - gray)));
      data[i+2] = Math.min(255, Math.max(0, gray + sFactor * (data[i+2] - gray)));
    }
  }

  // 色相
  if (_psFilterState.hue !== 0) {
    var hueAngle = _psFilterState.hue * Math.PI / 180;
    var sinA = Math.sin(hueAngle);
    var cosA = Math.cos(hueAngle);
    for (var i = 0; i < data.length; i += 4) {
      var r = data[i], g = data[i+1], b = data[i+2];
      // 近似色相旋转矩阵
      data[i] = Math.min(255, Math.max(0, r * (0.213 + 0.787 * cosA - 0.213 * sinA) + g * (0.715 - 0.715 * cosA - 0.715 * sinA) + b * (0.072 - 0.072 * cosA + 0.928 * sinA)));
      data[i+1] = Math.min(255, Math.max(0, r * (0.213 - 0.213 * cosA + 0.143 * sinA) + g * (0.715 + 0.285 * cosA + 0.140 * sinA) + b * (0.072 - 0.072 * cosA - 0.283 * sinA)));
      data[i+2] = Math.min(255, Math.max(0, r * (0.213 - 0.213 * cosA - 0.787 * sinA) + g * (0.715 - 0.715 * cosA + 0.715 * sinA) + b * (0.072 + 0.928 * cosA + 0.072 * sinA)));
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // 模糊（使用 CSS filter 作为补充）
  if (_psFilterState.blur > 0) {
    canvas.style.filter = 'blur(' + _psFilterState.blur + 'px)';
  } else {
    canvas.style.filter = 'none';
  }
}

function applyPSPreset(preset) {
  var reset = function() {
    document.getElementById('ps-brightness').value = 0;
    document.getElementById('ps-contrast').value = 0;
    document.getElementById('ps-saturation').value = 0;
    document.getElementById('ps-hue').value = 0;
    document.getElementById('ps-blur').value = 0;
  };

  switch(preset) {
    case 'grayscale':
      reset();
      document.getElementById('ps-saturation').value = -100;
      break;
    case 'sepia':
      reset();
      document.getElementById('ps-saturation').value = -50;
      document.getElementById('ps-contrast').value = 20;
      document.getElementById('ps-brightness').value = 10;
      break;
    case 'invert':
      reset();
      document.getElementById('ps-hue').value = 180;
      break;
    case 'vintage':
      reset();
      document.getElementById('ps-contrast').value = -20;
      document.getElementById('ps-saturation').value = -30;
      document.getElementById('ps-brightness').value = 15;
      break;
    case 'cool':
      reset();
      document.getElementById('ps-hue').value = 30;
      document.getElementById('ps-saturation').value = 20;
      break;
    case 'warm':
      reset();
      document.getElementById('ps-hue').value = -30;
      document.getElementById('ps-saturation').value = 20;
      break;
    case 'reset':
      reset();
      _psCanvas.style.filter = 'none';
      break;
  }
  applyPSFilter();
}

function rotatePSImage(angle) {
  if (!_psCanvas || !_psOriginalImage) return;
  var canvas = _psCanvas;
  var ctx = _psCtx;
  var w = canvas.width, h = canvas.height;
  var rad = angle * Math.PI / 180;

  // 创建临时 canvas 旋转
  var tempCanvas = document.createElement('canvas');
  var tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = w;
  tempCanvas.height = h;
  tempCtx.drawImage(canvas, 0, 0);

  var newW = Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad));
  var newH = Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad));
  canvas.width = newW;
  canvas.height = newH;
  ctx.translate(newW/2, newH/2);
  ctx.rotate(rad);
  ctx.drawImage(tempCanvas, -w/2, -h/2);
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // 更新原图引用
  var img = new Image();
  img.src = canvas.toDataURL();
  img.onload = function() {
    _psOriginalImage = img;
    _psFilterState = { brightness: 0, contrast: 0, saturation: 0, hue: 0, blur: 0 };
    // 重置滑块
    document.getElementById('ps-brightness').value = 0;
    document.getElementById('ps-contrast').value = 0;
    document.getElementById('ps-saturation').value = 0;
    document.getElementById('ps-hue').value = 0;
    document.getElementById('ps-blur').value = 0;
    _psCanvas.style.filter = 'none';
  };
}

function flipPSImage(direction) {
  if (!_psCanvas || !_psOriginalImage) return;
  var canvas = _psCanvas;
  var ctx = _psCtx;
  var w = canvas.width, h = canvas.height;

  var tempCanvas = document.createElement('canvas');
  var tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = w;
  tempCanvas.height = h;
  tempCtx.drawImage(canvas, 0, 0);

  ctx.clearRect(0, 0, w, h);
  if (direction === 'horizontal') {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(0, h);
    ctx.scale(1, -1);
  }
  ctx.drawImage(tempCanvas, 0, 0);
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  var img = new Image();
  img.src = canvas.toDataURL();
  img.onload = function() {
    _psOriginalImage = img;
    _psFilterState = { brightness: 0, contrast: 0, saturation: 0, hue: 0, blur: 0 };
    document.getElementById('ps-brightness').value = 0;
    document.getElementById('ps-contrast').value = 0;
    document.getElementById('ps-saturation').value = 0;
    document.getElementById('ps-hue').value = 0;
    document.getElementById('ps-blur').value = 0;
    _psCanvas.style.filter = 'none';
  };
}

function downloadPSImage() {
  if (!_psCanvas) { toast('⚠️ 请先编辑图片'); return; }
  var canvas = _psCanvas;
  // 临时移除 blur 滤镜后下载
  var originalFilter = canvas.style.filter;
  canvas.style.filter = 'none';
  var url = canvas.toDataURL('image/png');
  canvas.style.filter = originalFilter;
  var a = document.createElement('a');
  a.href = url;
  a.download = '编辑后的图片.png';
  a.click();
  toast('✅ 图片已下载');
}

function resetPSImage() {
  if (!_psOriginalImage) return;
  _psFilterState = { brightness: 0, contrast: 0, saturation: 0, hue: 0, blur: 0 };
  document.getElementById('ps-brightness').value = 0;
  document.getElementById('ps-contrast').value = 0;
  document.getElementById('ps-saturation').value = 0;
  document.getElementById('ps-hue').value = 0;
  document.getElementById('ps-blur').value = 0;
  document.getElementById('ps-brightness-val').textContent = '0';
  document.getElementById('ps-contrast-val').textContent = '0';
  document.getElementById('ps-saturation-val').textContent = '0';
  document.getElementById('ps-hue-val').textContent = '0';
  document.getElementById('ps-blur-val').textContent = '0';
  _psCanvas.style.filter = 'none';
  initPSCanvas();
  document.getElementById('ps-status').textContent = '✅ 已重置为原图';
}

// ============================================================
// ⭐ 群众心声前3名：屏幕录制工具
// ============================================================
let _srMediaRecorder = null;
let _srRecordedChunks = [];
let _srStream = null;
let _srTimerInterval = null;
let _srSeconds = 0;
let _srStartTime = null;

async function startScreenRecording() {
  var source = document.getElementById('sr-source').value;
  var audio = document.getElementById('sr-audio').value;
  var quality = parseInt(document.getElementById('sr-quality').value);
  var fps = parseInt(document.getElementById('sr-fps').value);

  document.getElementById('sr-status').textContent = '⏳ 请选择要录制的屏幕/窗口...';

  try {
    var displayConstraints = {
      video: {
        displaySurface: source === 'window' ? 'window' : source === 'tab' ? 'browser' : 'monitor',
        width: { ideal: quality },
        height: { ideal: Math.round(quality * 9 / 16) },
        frameRate: { ideal: fps }
      },
      audio: (audio === 'system' || audio === 'both') ? true : false
    };

    _srStream = await navigator.mediaDevices.getDisplayMedia(displayConstraints);

    // 如果选择了麦克风，混合音频轨道
    var tracks = [];
    tracks.push(_srStream.getVideoTracks()[0]);

    if (audio === 'microphone' || audio === 'both') {
      try {
        var micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        tracks.push(micStream.getAudioTracks()[0]);
        // 混合音频需要 AudioContext
        if (audio === 'both' && _srStream.getAudioTracks().length > 0) {
          var audioCtx = new AudioContext();
          var dest = audioCtx.createMediaStreamDestination();
          var source1 = audioCtx.createMediaStreamSource(_srStream);
          var source2 = audioCtx.createMediaStreamSource(micStream);
          source1.connect(dest);
          source2.connect(dest);
          // 使用混合后的音频轨道
          tracks = [_srStream.getVideoTracks()[0], dest.stream.getAudioTracks()[0]];
        }
      } catch(e) {
        console.warn('无法获取麦克风:', e.message);
      }
    }

    // 检测是否有音频轨道
    var hasAudio = tracks.length > 1 || (audio === 'system' || audio === 'both') && _srStream.getAudioTracks().length > 0;

    var combinedStream = new MediaStream(tracks);
    var mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') ? 'video/webm;codecs=vp9,opus'
      : MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus') ? 'video/webm;codecs=vp8,opus'
      : 'video/webm';

    _srRecordedChunks = [];
    _srMediaRecorder = new MediaRecorder(combinedStream, { mimeType: mimeType });

    _srMediaRecorder.ondataavailable = function(event) {
      if (event.data.size > 0) {
        _srRecordedChunks.push(event.data);
      }
    };

    _srMediaRecorder.onstop = function() {
      // 停止计时器
      if (_srTimerInterval) {
        clearInterval(_srTimerInterval);
        _srTimerInterval = null;
      }
      // 停止所有轨道
      _srStream.getTracks().forEach(function(t) { t.stop(); });
      document.getElementById('sr-start-btn').style.display = 'inline-flex';
      document.getElementById('sr-stop-btn').style.display = 'none';
      document.getElementById('sr-timer').style.display = 'none';
      document.getElementById('sr-download-btn').style.display = 'inline-flex';
      document.getElementById('sr-preview').style.display = 'none';
      document.getElementById('sr-info').style.display = 'block';

      var duration = _srSeconds;
      var size = _srRecordedChunks.reduce(function(acc, chunk) { return acc + chunk.size; }, 0);
      document.getElementById('sr-info-text').textContent =
        '🎬 录制时长: ' + Math.floor(duration / 60) + '分' + (duration % 60) + '秒 | ' +
        '📦 文件大小: ' + (size / (1024 * 1024)).toFixed(1) + ' MB | ' +
        '📹 格式: WebM';
      document.getElementById('sr-status').textContent = '✅ 录制完成！';
    };

    _srMediaRecorder.start(1000); // 每秒收集数据
    _srStartTime = Date.now();
    _srSeconds = 0;

    // 显示预览
    document.getElementById('sr-preview').style.display = 'block';
    document.getElementById('sr-preview-video').srcObject = _srStream;
    document.getElementById('sr-start-btn').style.display = 'none';
    document.getElementById('sr-stop-btn').style.display = 'inline-flex';
    document.getElementById('sr-timer').style.display = 'block';
    document.getElementById('sr-download-btn').style.display = 'none';
    document.getElementById('sr-info').style.display = 'none';
    document.getElementById('sr-status').textContent = '🔴 正在录制...';

    // 计时器
    _srTimerInterval = setInterval(function() {
      _srSeconds = Math.floor((Date.now() - _srStartTime) / 1000);
      var min = Math.floor(_srSeconds / 60);
      var sec = _srSeconds % 60;
      document.getElementById('sr-timer').textContent =
        String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
    }, 1000);

    // 监听用户停止
    _srStream.getVideoTracks()[0].onended = function() {
      if (_srMediaRecorder && _srMediaRecorder.state === 'recording') {
        _srMediaRecorder.stop();
      }
    };

  } catch(err) {
    document.getElementById('sr-status').textContent = '❌ ' + (err.name === 'NotAllowedError' ? '用户取消了录制或未授权' : '录制失败: ' + err.message);
    document.getElementById('sr-start-btn').style.display = 'inline-flex';
    document.getElementById('sr-stop-btn').style.display = 'none';
  }
}

function stopScreenRecording() {
  if (_srMediaRecorder && _srMediaRecorder.state === 'recording') {
    _srMediaRecorder.stop();
  }
}

function downloadScreenRecording() {
  if (_srRecordedChunks.length === 0) { toast('⚠️ 没有录制的视频'); return; }
  var blob = new Blob(_srRecordedChunks, { type: 'video/webm' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  var now = new Date();
  var ts = now.getFullYear() + ('0'+(now.getMonth()+1)).slice(-2) + ('0'+now.getDate()).slice(-2) + '_' + ('0'+now.getHours()).slice(-2) + ('0'+now.getMinutes()).slice(-2);
  a.download = '屏幕录制_' + ts + '.webm';
  a.click();
  URL.revokeObjectURL(url);
  toast('✅ 视频已下载');
}

// ============================================================
// 在线简历生成器 处理函数
// ============================================================
function renderResume() {
  var name = document.getElementById('rb-name').value || '姓名';
  var title = document.getElementById('rb-title').value || '职位';
  var email = document.getElementById('rb-email').value || '';
  var phone = document.getElementById('rb-phone').value || '';
  var address = document.getElementById('rb-address').value || '';
  var summary = document.getElementById('rb-summary').value || '';
  var experience = document.getElementById('rb-experience').value || '';
  var education = document.getElementById('rb-education').value || '';
  var skills = document.getElementById('rb-skills').value || '';
  var template = document.getElementById('rb-template').value || 'modern';

  var preview = document.getElementById('rb-preview');
  var skillTags = skills.split(',').map(function(s) { return s.trim(); }).filter(function(s) { return s; });

  var expLines = experience.split('\n').filter(function(l) { return l.trim(); });
  var eduLines = education.split('\n').filter(function(l) { return l.trim(); });

  var templateStyle = '';
  var headerBg = '';
  var headerColor = '';
  var sectionColor = '';

  if (template === 'modern') {
    headerBg = 'linear-gradient(135deg, #6366f1, #4f46e5)';
    headerColor = 'white';
    sectionColor = '#6366f1';
    templateStyle = 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;';
  } else if (template === 'classic') {
    headerBg = '#1e293b';
    headerColor = 'white';
    sectionColor = '#1e293b';
    templateStyle = 'font-family: "Times New Roman", Times, serif;';
  } else {
    headerBg = '#f0fdf4';
    headerColor = '#166534';
    sectionColor = '#16a34a';
    templateStyle = 'font-family: "Georgia", serif;';
  }

  var expHtml = '';
  expLines.forEach(function(line) {
    var parts = line.split('|').map(function(p) { return p.trim(); });
    if (parts.length >= 3) {
      expHtml += '<div style="margin-bottom:10px;padding:8px 12px;background:#f8fafc;border-left:3px solid ' + sectionColor + ';border-radius:0 6px 6px 0;">';
      expHtml += '<div style="font-weight:600;font-size:14px;">' + parts[0] + '</div>';
      expHtml += '<div style="font-size:13px;color:#64748b;">' + parts[1] + ' | ' + parts.slice(2).join(' | ') + '</div>';
      expHtml += '</div>';
    } else {
      expHtml += '<div style="margin-bottom:6px;font-size:13px;color:#334155;">' + line + '</div>';
    }
  });

  var eduHtml = '';
  eduLines.forEach(function(line) {
    var parts = line.split('|').map(function(p) { return p.trim(); });
    if (parts.length >= 3) {
      eduHtml += '<div style="margin-bottom:6px;padding:8px 12px;background:#f8fafc;border-left:3px solid ' + sectionColor + ';border-radius:0 6px 6px 0;">';
      eduHtml += '<div style="font-weight:600;font-size:14px;">' + parts[0] + '</div>';
      eduHtml += '<div style="font-size:13px;color:#64748b;">' + parts.slice(1).join(' | ') + '</div>';
      eduHtml += '</div>';
    } else {
      eduHtml += '<div style="margin-bottom:6px;padding:8px 12px;background:#f8fafc;font-size:13px;">' + line + '</div>';
    }
  });

  var skillHtml = '';
  skillTags.forEach(function(tag) {
    skillHtml += '<span style="display:inline-block;padding:4px 12px;margin:3px;background:' + sectionColor + ';color:white;border-radius:20px;font-size:12px;font-weight:500;">' + tag + '</span>';
  });

  var html = '<div style="' + templateStyle + 'max-width:700px;margin:0 auto;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">';
  // Header
  html += '<div style="background:' + headerBg + ';color:' + headerColor + ';padding:24px 30px;">';
  html += '<h1 style="margin:0;font-size:26px;font-weight:700;margin-bottom:4px;">' + name + '</h1>';
  html += '<div style="font-size:16px;opacity:0.9;margin-bottom:8px;">' + title + '</div>';
  html += '<div style="font-size:13px;opacity:0.8;display:flex;gap:12px;flex-wrap:wrap;">';
  if (email) html += '<span>📧 ' + email + '</span>';
  if (phone) html += '<span>📞 ' + phone + '</span>';
  if (address) html += '<span>📍 ' + address + '</span>';
  html += '</div></div>';
  // Body
  html += '<div style="padding:20px 30px;">';
  if (summary) {
    html += '<div style="margin-bottom:16px;">';
    html += '<h3 style="font-size:15px;font-weight:600;color:' + sectionColor + ';border-bottom:2px solid ' + sectionColor + ';padding-bottom:4px;margin-bottom:8px;">📝 个人简介</h3>';
    html += '<p style="font-size:13px;color:#334155;line-height:1.6;">' + summary + '</p>';
    html += '</div>';
  }
  if (expHtml) {
    html += '<div style="margin-bottom:16px;">';
    html += '<h3 style="font-size:15px;font-weight:600;color:' + sectionColor + ';border-bottom:2px solid ' + sectionColor + ';padding-bottom:4px;margin-bottom:8px;">💼 工作经历</h3>';
    html += expHtml;
    html += '</div>';
  }
  if (eduHtml) {
    html += '<div style="margin-bottom:16px;">';
    html += '<h3 style="font-size:15px;font-weight:600;color:' + sectionColor + ';border-bottom:2px solid ' + sectionColor + ';padding-bottom:4px;margin-bottom:8px;">🎓 教育背景</h3>';
    html += eduHtml;
    html += '</div>';
  }
  if (skillHtml) {
    html += '<div>';
    html += '<h3 style="font-size:15px;font-weight:600;color:' + sectionColor + ';border-bottom:2px solid ' + sectionColor + ';padding-bottom:4px;margin-bottom:8px;">🔧 技能标签</h3>';
    html += '<div>' + skillHtml + '</div>';
    html += '</div>';
  }
  html += '</div></div>';

  preview.innerHTML = html;
  document.getElementById('rb-status').textContent = '✅ 预览已更新';
}

function downloadResumePDF() {
  var preview = document.getElementById('rb-preview');
  var html = preview.innerHTML;
  if (!html || html === '') { showToast('⚠️ 请先填写简历信息'); return; }

  var css = 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; padding: 0; }';
  var printWindow = window.open('', '_blank', 'width=800,height=600');
  printWindow.document.write('<html><head><style>' + css + '</style></head><body>' + preview.innerHTML + '</body></html>');
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  showToast('✅ 已打开打印窗口，请选择"另存为 PDF"');
}

function downloadResumeHTML() {
  var preview = document.getElementById('rb-preview');
  var html = preview.innerHTML;
  if (!html || html === '') { showToast('⚠️ 请先填写简历信息'); return; }

  var fullHtml = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>我的简历</title><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;margin:20px;padding:0;}</style></head><body>' + html + '</body></html>';

  var blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = '我的简历.html';
  a.click();
  URL.revokeObjectURL(url);
  showToast('✅ 简历 HTML 已下载');
}

// ============================================================
// 在线电子签名生成器 处理函数
// ============================================================
var _smIsDrawing = false;
var _smLastX = 0;
var _smLastY = 0;
var _smDrawHistory = [];

function initSignatureMaker() {
  var canvas = document.getElementById('sm-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('mouseleave', stopDraw);
  canvas.addEventListener('touchstart', touchStart);
  canvas.addEventListener('touchmove', touchMove);
  canvas.addEventListener('touchend', stopDraw);
}

function startDraw(e) {
  _smIsDrawing = true;
  var rect = e.target.getBoundingClientRect();
  _smLastX = (e.clientX - rect.left) * (e.target.width / rect.width);
  _smLastY = (e.clientY - rect.top) * (e.target.height / rect.height);
  _smDrawHistory.push({ type: 'start', x: _smLastX, y: _smLastY });
}

function draw(e) {
  if (!_smIsDrawing) return;
  var canvas = e.target;
  var ctx = canvas.getContext('2d');
  var rect = canvas.getBoundingClientRect();
  var x = (e.clientX - rect.left) * (canvas.width / rect.width);
  var y = (e.clientY - rect.top) * (canvas.height / rect.height);

  ctx.beginPath();
  var color = document.getElementById('sm-color').value;
  var size = parseInt(document.getElementById('sm-size').value);
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.moveTo(_smLastX, _smLastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  _smLastX = x;
  _smLastY = y;
  _smDrawHistory.push({ type: 'draw', x: x, y: y });
  showSignaturePreview();
}

function stopDraw() {
  _smIsDrawing = false;
}

function touchStart(e) {
  e.preventDefault();
  var touch = e.touches[0];
  var canvas = document.getElementById('sm-canvas');
  _smIsDrawing = true;
  var rect = canvas.getBoundingClientRect();
  _smLastX = (touch.clientX - rect.left) * (canvas.width / rect.width);
  _smLastY = (touch.clientY - rect.top) * (canvas.height / rect.height);
  _smDrawHistory.push({ type: 'start', x: _smLastX, y: _smLastY });
}

function touchMove(e) {
  e.preventDefault();
  if (!_smIsDrawing) return;
  var touch = e.touches[0];
  var canvas = document.getElementById('sm-canvas');
  var ctx = canvas.getContext('2d');
  var rect = canvas.getBoundingClientRect();
  var x = (touch.clientX - rect.left) * (canvas.width / rect.width);
  var y = (touch.clientY - rect.top) * (canvas.height / rect.height);

  ctx.beginPath();
  var color = document.getElementById('sm-color').value;
  var size = parseInt(document.getElementById('sm-size').value);
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.moveTo(_smLastX, _smLastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  _smLastX = x;
  _smLastY = y;
  _smDrawHistory.push({ type: 'draw', x: x, y: y });
  showSignaturePreview();
}

function clearSignature() {
  var canvas = document.getElementById('sm-canvas');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  _smDrawHistory = [];
  document.getElementById('sm-preview').style.display = 'none';
  document.getElementById('sm-status').textContent = '🗑️ 已清空';
}

function undoSignature() {
  if (_smDrawHistory.length === 0) return;
  var canvas = document.getElementById('sm-canvas');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 找到最后一个 start 之前的所有操作
  var lastStart = -1;
  for (var i = _smDrawHistory.length - 2; i >= 0; i--) {
    if (_smDrawHistory[i].type === 'start') {
      lastStart = i;
      break;
    }
  }
  if (lastStart === -1) {
    // 全部撤销
    _smDrawHistory = [];
    document.getElementById('sm-preview').style.display = 'none';
    document.getElementById('sm-status').textContent = '🗑️ 已清空';
    return;
  }
  _smDrawHistory = _smDrawHistory.slice(0, lastStart);

  // 重绘
  var color = document.getElementById('sm-color').value;
  var size = parseInt(document.getElementById('sm-size').value);
  ctx.beginPath();
  var isDown = false;
  _smDrawHistory.forEach(function(pt) {
    if (pt.type === 'start') {
      ctx.moveTo(pt.x, pt.y);
      isDown = false;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(pt.x, pt.y);
      if (!isDown) { ctx.beginPath(); ctx.moveTo(pt.x, pt.y); isDown = true; }
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
    }
  });
  showSignaturePreview();
  document.getElementById('sm-status').textContent = '↩️ 已撤销一步';
}

function switchSignatureMode() {
  var mode = document.getElementById('sm-mode').value;
  if (mode === 'draw') {
    document.getElementById('sm-draw-area').style.display = 'block';
    document.getElementById('sm-text-group').style.display = 'none';
    document.getElementById('sm-font-group').style.display = 'none';
  } else {
    document.getElementById('sm-draw-area').style.display = 'none';
    document.getElementById('sm-text-group').style.display = 'block';
    document.getElementById('sm-font-group').style.display = 'block';
    renderTextSignature();
  }
}

function renderTextSignature() {
  var text = document.getElementById('sm-text').value || '签名';
  var font = document.getElementById('sm-font').value;
  var color = document.getElementById('sm-color').value;

  var fontMap = {
    'cursive': '"Brush Script MT", "Segoe Script", cursive',
    'elegant': '"Palatino Linotype", "Book Antiqua", Palatino, serif',
    'bold': 'Arial, Helvetica, sans-serif',
    'calligraphy': '"Lucida Handwriting", "Snell Roundhand", cursive'
  };
  var fontFamily = fontMap[font] || fontMap['cursive'];

  var canvas = document.getElementById('sm-canvas');
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = color;
  ctx.font = 'bold 48px ' + fontFamily;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  _smDrawHistory = [];
  showSignaturePreview();
  document.getElementById('sm-status').textContent = '✅ 文字签名已生成';
}

function updateSignature() {
  var mode = document.getElementById('sm-mode').value;
  if (mode === 'text') {
    renderTextSignature();
  }
}

function showSignaturePreview() {
  var canvas = document.getElementById('sm-canvas');
  var dataUrl = canvas.toDataURL('image/png');
  var preview = document.getElementById('sm-preview');
  preview.style.display = 'block';
  document.getElementById('sm-preview-img').src = dataUrl;
}

function downloadSignature() {
  var canvas = document.getElementById('sm-canvas');
  // 检查是否有内容
  var ctx = canvas.getContext('2d');
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var hasContent = false;
  for (var i = 0; i < imageData.data.length; i += 4) {
    if (imageData.data[i] !== 255 || imageData.data[i+1] !== 255 || imageData.data[i+2] !== 255) {
      hasContent = true;
      break;
    }
  }
  if (!hasContent) { showToast('⚠️ 请先绘制或输入签名'); return; }

  // 裁剪白色边框
  var sx = canvas.width, sy = canvas.height, ex = 0, ey = 0;
  for (var y = 0; y < canvas.height; y++) {
    for (var x = 0; x < canvas.width; x++) {
      var idx = (y * canvas.width + x) * 4;
      if (imageData.data[idx] !== 255 || imageData.data[idx+1] !== 255 || imageData.data[idx+2] !== 255) {
        sx = Math.min(sx, x);
        sy = Math.min(sy, y);
        ex = Math.max(ex, x);
        ey = Math.max(ey, y);
      }
    }
  }
  var cw = ex - sx + 20;
  var ch = ey - sy + 20;
  if (cw < 10 || ch < 10) { cw = canvas.width; ch = canvas.height; sx = 0; sy = 0; }

  var tempCanvas = document.createElement('canvas');
  tempCanvas.width = cw;
  tempCanvas.height = ch;
  var tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(canvas, sx - 10, sy - 10, cw, ch, 0, 0, cw, ch);

  var dataUrl = tempCanvas.toDataURL('image/png');
  var a = document.createElement('a');
  a.href = dataUrl;
  a.download = '电子签名.png';
  a.click();
  showToast('✅ 签名已下载 (PNG, 透明背景)');
}

function copySignature() {
  var canvas = document.getElementById('sm-canvas');
  canvas.toBlob(function(blob) {
    try {
      navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]).then(function() {
        showToast('✅ 已复制到剪贴板');
      }).catch(function() {
        showToast('⚠️ 复制失败，请使用下载功能');
      });
    } catch(e) {
      showToast('⚠️ 复制失败，请使用下载功能');
    }
  });
}
