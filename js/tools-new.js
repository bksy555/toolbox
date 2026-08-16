// ============================================================
// 新工具：九宫格切图、表情包生成器、决策转盘、文字转手写体
// ============================================================

// ==================== 1. 九宫格切图 ====================
function nineGridSplit() {
  var file = document.getElementById('ng-file').files[0];
  if (!file) { showToast('⚠️ 请先选择图片'); return; }
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var w = img.width, h = img.height;
      var size = Math.min(w, h);
      var sx = (w - size) / 2, sy = (h - size) / 2;
      var cw = size / 3, ch = size / 3;
      var container = document.getElementById('ng-result');
      container.innerHTML = '';
      for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 3; col++) {
          (function(r, c) {
            canvas.width = cw;
            canvas.height = ch;
            ctx.clearRect(0, 0, cw, ch);
            ctx.drawImage(img, sx + c * cw, sy + r * ch, cw, ch, 0, 0, cw, ch);
            var dataUrl = canvas.toDataURL('image/png');
            var wrapper = document.createElement('div');
            wrapper.style.cssText = 'display:inline-block;margin:2px;position:relative;';
            var imgEl = document.createElement('img');
            imgEl.src = dataUrl;
            imgEl.style.cssText = 'width:100px;height:100px;object-fit:cover;border-radius:4px;border:1px solid var(--border);';
            wrapper.appendChild(imgEl);
            var btn = document.createElement('button');
            btn.textContent = '下载';
            btn.style.cssText = 'position:absolute;bottom:2px;right:2px;font-size:11px;padding:2px 6px;border:none;border-radius:4px;background:#6366f1;color:white;cursor:pointer;';
            btn.onclick = function() { var a = document.createElement('a'); a.href = dataUrl; a.download = '九宫格_' + (r*3+c+1) + '.png'; a.click(); };
            wrapper.appendChild(btn);
            container.appendChild(wrapper);
          })(row, col);
        }
      }
      document.getElementById('ng-download-all').style.display = 'inline-flex';
      document.getElementById('ng-preview').style.display = 'block';
      showToast('✅ 九宫格切图完成');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function nineGridDownloadAll() {
  var imgs = document.querySelectorAll('#ng-result img');
  if (imgs.length === 0) return;
  var zip = new JSZip();
  var folder = zip.folder('九宫格');
  var promises = [];
  imgs.forEach(function(img, i) {
    promises.push(fetch(img.src).then(function(r) { return r.blob(); }).then(function(blob) { folder.file('九宫格_' + (i+1) + '.png', blob); }));
  });
  Promise.all(promises).then(function() {
    zip.generateAsync({ type: 'blob' }).then(function(blob) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = '九宫格.zip';
      a.click();
      showToast('✅ 已下载 ZIP 包');
    });
  });
}

// ==================== 2. 文字转手写体 ====================
var TH_FONTS = {
  'kaiti': '"KaiTi","STKaiti","楷体","华文楷体",serif',
  'xingshu': '"Xingkai SC","STXingkai","华文行楷","行楷",cursive',
  'caoshu': '"STCaiyun","华文彩云","LiSu",cursive',
  'handwrite': '"Ma Shan Zheng","ZCOOL XiaoWei","LXGW WenKai",cursive',
  'fangsong': '"FangSong","STFangsong","仿宋",serif',
  'lishu': '"LiSu","STLiti","隶书",cursive',
  'qingsong': '"ZCOOL QingKe HuangYou","LXGW WenKai",cursive',
  'child': '"ZCOOL KuaiLe","Comic Sans MS",cursive'
};

function drawPaperBg(ctx, w, h, paper, bgColor, fontSize, lineHeight) {
  switch (paper) {
    case 'rice':
      ctx.fillStyle = '#faf6ed'; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#e0d5c0'; ctx.lineWidth = 0.5;
      for (var y = 60; y < h - 60; y += lineHeight) { ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(w - 60, y); ctx.stroke(); }
      break;
    case 'grid':
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#d0d0d0'; ctx.lineWidth = 0.5;
      for (var gx = 0; gx <= w; gx += fontSize) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
      for (var gy = 0; gy <= h; gy += fontSize) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }
      break;
    case 'essay':
      ctx.fillStyle = '#fefefe'; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#c8c8c8'; ctx.lineWidth = 0.5;
      var cellSize = fontSize + 4; var cols = Math.floor((w - 60) / cellSize); var rows = Math.floor((h - 60) / lineHeight);
      for (var r = 0; r < rows; r++) { for (var c = 0; c < cols; c++) { ctx.strokeRect(60 + c * cellSize - 30, 60 + r * lineHeight - 10, cellSize, lineHeight); } }
      break;
    case 'tian':
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#e06060'; ctx.lineWidth = 1;
      var cellSize = fontSize + 4; var cols = Math.floor((w - 60) / cellSize); var rows = Math.floor((h - 60) / lineHeight);
      for (var r = 0; r < rows; r++) { for (var c = 0; c < cols; c++) {
        var x = 60 + c * cellSize - 30; var y = 60 + r * lineHeight - 10;
        ctx.strokeRect(x, y, cellSize, lineHeight);
        ctx.setLineDash([2, 3]); ctx.strokeStyle = '#e0a0a0';
        ctx.beginPath(); ctx.moveTo(x + cellSize/2, y); ctx.lineTo(x + cellSize/2, y + lineHeight); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y + lineHeight/2); ctx.lineTo(x + cellSize, y + lineHeight/2); ctx.stroke();
        ctx.setLineDash([]); ctx.strokeStyle = '#e06060';
      }}
      break;
    case 'pinyin':
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#b0b0b0'; ctx.lineWidth = 0.5;
      for (var py = 60; py < h - 60; py += lineHeight + 20) {
        ctx.beginPath(); ctx.moveTo(60, py); ctx.lineTo(w - 60, py); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(60, py + (lineHeight+20)/2); ctx.lineTo(w - 60, py + (lineHeight+20)/2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(60, py + lineHeight + 20); ctx.lineTo(w - 60, py + lineHeight + 20); ctx.stroke();
      }
      break;
    case 'english':
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#c0c0c0'; ctx.lineWidth = 0.5;
      for (var ey = 60; ey < h - 60; ey += lineHeight + 20) {
        ctx.beginPath(); ctx.moveTo(60, ey); ctx.lineTo(w - 60, ey); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(60, ey + lineHeight/2 + 10); ctx.lineTo(w - 60, ey + lineHeight/2 + 10); ctx.stroke();
        ctx.strokeStyle = '#e06060'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(60, ey + lineHeight + 20); ctx.lineTo(w - 60, ey + lineHeight + 20); ctx.stroke();
        ctx.strokeStyle = '#c0c0c0'; ctx.lineWidth = 0.5;
      }
      break;
    case 'vintage':
      var grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#f5e6c8'); grad.addColorStop(0.5, '#efe0c0'); grad.addColorStop(1, '#e8d5a8');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#c4a97d'; ctx.lineWidth = 1;
      ctx.strokeRect(15, 15, w - 30, h - 30); ctx.strokeRect(20, 20, w - 40, h - 40);
      ctx.fillStyle = 'rgba(180,150,100,0.06)';
      for (var i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(Math.random()*(w-100)+50, Math.random()*(h-100)+50, 40, 0, Math.PI*2); ctx.fill(); }
      ctx.strokeStyle = 'rgba(180,150,100,0.3)'; ctx.lineWidth = 0.5;
      for (var v = 60; v < h - 60; v += lineHeight) { ctx.beginPath(); ctx.moveTo(40, v); ctx.lineTo(w - 40, v); ctx.stroke(); }
      break;
    default:
      ctx.fillStyle = bgColor; ctx.fillRect(0, 0, w, h);
      break;
  }
}

function textToHandwriting() {
  var text = document.getElementById('th-text').value;
  if (!text) { showToast('请输入文字'); return; }
  var bgColor = document.getElementById('th-bg').value;
  var inkColor = document.getElementById('th-ink').value;
  var fontSize = parseInt(document.getElementById('th-size').value);
  var lineHeight = parseInt(document.getElementById('th-lineheight').value);
  var spacing = parseFloat(document.getElementById('th-spacing').value);
  var paperStyle = document.getElementById('th-paper').value;
  var fontStyle = document.getElementById('th-font').value;
  var maxW = parseInt(document.getElementById('th-width').value);
  var messLevel = parseFloat(document.getElementById('th-mess').value);
  var bleedLevel = parseFloat(document.getElementById('th-bleed').value);
  var title = document.getElementById('th-title').value;

  var canvas = document.getElementById('th-canvas');
  var ctx = canvas.getContext('2d');
  var padding = 60;
  var lines = text.split('\n');
  var fontFamily = TH_FONTS[fontStyle] || TH_FONTS['kaiti'];

  ctx.font = fontSize + 'px ' + fontFamily;
  var maxLine = '';
  for (var i = 0; i < lines.length; i++) { if (lines[i].length > maxLine.length) maxLine = lines[i]; }
  var charW = ctx.measureText('测').width * spacing;
  var canvasW = Math.min(Math.max(maxLine.length * charW + padding * 2, 300), maxW);
  var titleH = title ? 60 : 0;
  var canvasH = titleH + lines.length * lineHeight + padding * 2 + 60;
  canvas.width = canvasW; canvas.height = canvasH;

  drawPaperBg(ctx, canvasW, canvasH, paperStyle, bgColor, fontSize, lineHeight);

  if (title) {
    ctx.font = 'bold 24px "KaiTi","STKaiti","楷体",serif';
    ctx.fillStyle = inkColor; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(title, canvasW / 2, 35);
    ctx.strokeStyle = inkColor; ctx.lineWidth = 1;
    var tw = ctx.measureText(title).width;
    ctx.beginPath(); ctx.moveTo(canvasW / 2 - tw / 2 - 10, 48); ctx.lineTo(canvasW / 2 + tw / 2 + 10, 48); ctx.stroke();
  }

  var startY = padding + titleH;
  for (var l = 0; l < lines.length; l++) {
    var line = lines[l]; if (!line.trim()) continue;
    var x = padding;
    var y = startY + l * lineHeight + (lineHeight - fontSize) / 2;
    var lineFontSize = fontSize + (Math.random() - 0.5) * 2;
    ctx.font = lineFontSize + 'px ' + fontFamily;

    for (var c = 0; c < line.length; c++) {
      ctx.save();
      var rot = (Math.random() - 0.5) * messLevel * 2;
      var ox = (Math.random() - 0.5) * 3;
      var oy = (Math.random() - 0.5) * 3;
      var lineShift = Math.sin(c * 0.3) * 1.5;
      ctx.globalAlpha = bleedLevel * (0.9 + Math.random() * 0.2);
      var charSize = lineFontSize * (0.95 + Math.random() * 0.1);
      ctx.font = charSize + 'px ' + fontFamily;
      ctx.translate(x + c * charW * spacing + ox, y + oy + lineShift);
      ctx.rotate(rot);
      ctx.fillStyle = inkColor; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText(line[c], 0, 0);
      ctx.restore();
    }
  }

  document.getElementById('th-download').style.display = 'inline-flex';
  document.getElementById('th-download-jpg').style.display = 'inline-flex';
  document.getElementById('th-preview').style.display = 'block';
  document.getElementById('th-status').textContent = '已生成手写体 ' + canvasW + 'x' + canvasH + 'px';
  showToast('已生成手写体');
}

function downloadHandwriting() {
  var canvas = document.getElementById('th-canvas');
  var text = document.getElementById('th-text').value.trim() || 'handwriting';
  var a = document.createElement('a');
  a.download = text.substring(0, 10) + '_handwriting.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
  showToast('Downloaded PNG');
}

function downloadHandwritingJPG() {
  var canvas = document.getElementById('th-canvas');
  var text = document.getElementById('th-text').value.trim() || 'handwriting';
  var a = document.createElement('a');
  a.download = text.substring(0, 10) + '_handwriting.jpg';
  a.href = canvas.toDataURL('image/jpeg', 0.95);
  a.click();
  showToast('Downloaded JPG');
}

function randomHandwritingStyle() {
  var papers = ['plain', 'rice', 'grid', 'essay', 'tian', 'pinyin', 'english', 'vintage'];
  var fonts = ['kaiti', 'xingshu', 'caoshu', 'handwrite', 'fangsong', 'lishu', 'qingsong', 'child'];
  var sizes = [24, 28, 36, 48];
  var linehts = [40, 50, 60, 80];
  var messes = [0.02, 0.06, 0.12, 0.2];
  var bleeds = [1, 0.85, 0.7, 0.5];
  var bgs = ['#faf6ed', '#ffffff', '#fefefe', '#f5f0e8', '#f0f5ff'];
  var inks = ['#1a1a2e', '#2d2d44', '#4a3728', '#1e3a5f', '#000000'];
  document.getElementById('th-paper').value = papers[Math.floor(Math.random()*papers.length)];
  document.getElementById('th-font').value = fonts[Math.floor(Math.random()*fonts.length)];
  document.getElementById('th-size').value = sizes[Math.floor(Math.random()*sizes.length)];
  document.getElementById('th-lineheight').value = linehts[Math.floor(Math.random()*linehts.length)];
  document.getElementById('th-mess').value = messes[Math.floor(Math.random()*messes.length)];
  document.getElementById('th-bleed').value = bleeds[Math.floor(Math.random()*bleeds.length)];
  document.getElementById('th-bg').value = bgs[Math.floor(Math.random()*bgs.length)];
  document.getElementById('th-ink').value = inks[Math.floor(Math.random()*inks.length)];
  textToHandwriting();
  showToast('Random style applied!');
}

// ==================== 3. 表情包生成器 ====================
function initMemeGenerator() {
  var canvas = document.getElementById('meme-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    canvas.width = 500; canvas.height = 300;
    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, 500, 300);
    ctx.fillStyle = '#bbbbbb';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('上传图片或输入文字，点击生成', 250, 150);
  }
}

function generateMeme() {
  var canvas = document.getElementById('meme-canvas');
  var ctx = canvas.getContext('2d');
  var file = document.getElementById('meme-file').files[0];
  var topText = document.getElementById('meme-top-text').value.toUpperCase();
  var bottomText = document.getElementById('meme-bottom-text').value.toUpperCase();
  var fontSize = parseInt(document.getElementById('meme-fontsize').value);
  var textColor = document.getElementById('meme-color').value;
  var outline = document.getElementById('meme-outline').checked;

  if (!topText && !bottomText) { showToast('请输入文字'); return; }

  if (file) {
    memeUploadImage();
  } else {
    // 纯文字模式 - 生成emoji背景
    canvas.width = 500; canvas.height = 500;
    var grad = ctx.createLinearGradient(0, 0, 500, 500);
    grad.addColorStop(0, '#667eea');
    grad.addColorStop(1, '#764ba2');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 500, 500);
    // 装饰性圆圈
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    for (var i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(50 + Math.random() * 400, 50 + Math.random() * 400, 30 + Math.random() * 60, 0, Math.PI * 2);
      ctx.fill();
    }
    drawMemeTexts(ctx, topText, bottomText, 500, 500, fontSize, textColor, outline);
    document.getElementById('meme-download').style.display = 'inline-flex';
    document.getElementById('meme-hint').textContent = '✅ 表情包已生成';
    showToast('表情包已生成');
  }
}

function memeUploadImage() {
  var file = document.getElementById('meme-file').files[0];
  if (!file) return;
  document.getElementById('meme-filename').textContent = file.name;
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      var canvas = document.getElementById('meme-canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = Math.min(img.width, 600);
      canvas.height = Math.min(img.height, 600);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      var topText = document.getElementById('meme-top-text').value.toUpperCase();
      var bottomText = document.getElementById('meme-bottom-text').value.toUpperCase();
      var fontSize = parseInt(document.getElementById('meme-fontsize').value);
      var textColor = document.getElementById('meme-color').value;
      var outline = document.getElementById('meme-outline').checked;
      drawMemeTexts(ctx, topText, bottomText, canvas.width, canvas.height, fontSize, textColor, outline);
      document.getElementById('meme-download').style.display = 'inline-flex';
      document.getElementById('meme-hint').textContent = '✅ 表情包已生成';
      showToast('表情包已生成');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function drawMemeTexts(ctx, topText, bottomText, w, h, fontSize, textColor, outline) {
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 4;

  if (topText) {
    var fs = Math.min(fontSize, w / topText.length * 1.5);
    ctx.font = 'bold ' + fs + 'px Impact, Arial Black, sans-serif';
    ctx.textBaseline = 'top';
    if (outline) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 5;
      ctx.lineJoin = 'round';
      ctx.strokeText(topText, w / 2, 10);
    }
    ctx.fillStyle = textColor;
    ctx.fillText(topText, w / 2, 10);
  }
  if (bottomText) {
    var fs = Math.min(fontSize, w / bottomText.length * 1.5);
    ctx.font = 'bold ' + fs + 'px Impact, Arial Black, sans-serif';
    ctx.textBaseline = 'bottom';
    if (outline) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 5;
      ctx.lineJoin = 'round';
      ctx.strokeText(bottomText, w / 2, h - 10);
    }
    ctx.fillStyle = textColor;
    ctx.fillText(bottomText, w / 2, h - 10);
  }
  ctx.shadowBlur = 0;
}

function clearMemeImage() {
  document.getElementById('meme-file').value = '';
  document.getElementById('meme-filename').textContent = '';
  var canvas = document.getElementById('meme-canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = 500; canvas.height = 300;
  ctx.fillStyle = '#f8f8f8';
  ctx.fillRect(0, 0, 500, 300);
  ctx.fillStyle = '#bbbbbb';
  ctx.font = '18px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('上传图片或输入文字，点击生成', 250, 150);
  document.getElementById('meme-hint').textContent = '图片已清除';
  showToast('已清除图片');
}

// ==================== 4. 决策转盘 ====================
function spinWheel() {
  var items = document.getElementById('dw-items').value;
  if (!items.trim()) { showToast('请输入选项'); return; }
  var list = items.split('\n').filter(function(i) { return i.trim(); });
  if (list.length < 2) { showToast('至少需要2个选项'); return; }
  var result = list[Math.floor(Math.random() * list.length)];
  document.getElementById('dw-result').textContent = result;
  document.getElementById('dw-result').className = 'dw-result dw-spin';
  showToast('结果: ' + result);
  setTimeout(function() { document.getElementById('dw-result').className = 'dw-result'; }, 500);
}

// ==================== 5. SVG 在线编辑器 ====================
var svgCurrentTool = 'select';
var svgElements = [];
var svgSelected = null;
var svgIdCounter = 0;

function initSvgEditor() {
  svgElements = [];
  svgSelected = null;
  svgIdCounter = 0;
  var canvas = document.getElementById('svg-canvas');
  if (canvas) {
    canvas.innerHTML = '<rect width="100%" height="100%" fill="#ffffff" onclick="svgDeselect()"/>';
    // 添加默认示例
    svgAddRect();
    svgAddCircle();
  }
}

function svgSetTool(tool) {
  svgCurrentTool = tool;
  var btns = document.querySelectorAll('.tool-card button');
  btns.forEach(function(b) { b.style.outline = 'none'; });
  showToast('工具: ' + {rect:'矩形',circle:'圆形',line:'线条',text:'文字',select:'选择'}[tool] || tool);
}

function svgGetStyle() {
  return {
    fill: document.getElementById('svg-fill').value,
    stroke: document.getElementById('svg-stroke').value,
    'stroke-width': document.getElementById('svg-stroke-width').value
  };
}

function svgUpdateStyle() {
  if (svgSelected) {
    svgSelected.setAttribute('fill', document.getElementById('svg-fill').value);
    svgSelected.setAttribute('stroke', document.getElementById('svg-stroke').value);
    svgSelected.setAttribute('stroke-width', document.getElementById('svg-stroke-width').value);
  }
}

function svgAddRect() {
  var style = svgGetStyle();
  var canvas = document.getElementById('svg-canvas');
  var w = canvas.clientWidth || 600;
  var x = 50 + Math.random() * (w - 200);
  var y = 50 + Math.random() * 200;
  var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', x);
  rect.setAttribute('y', y);
  rect.setAttribute('width', 80 + Math.random() * 60);
  rect.setAttribute('height', 50 + Math.random() * 40);
  rect.setAttribute('fill', style.fill);
  rect.setAttribute('stroke', style.stroke);
  rect.setAttribute('stroke-width', style['stroke-width']);
  rect.setAttribute('rx', '4');
  rect.setAttribute('id', 'svg-elem-' + (svgIdCounter++));
  rect.setAttribute('class', 'svg-element');
  rect.style.cursor = 'pointer';
  rect.onclick = function(e) { e.stopPropagation(); svgSelect(this); };
  rect.ondblclick = function() { svgStartDrag(this); };
  canvas.appendChild(rect);
  svgElements.push(rect);
  svgSelect(rect);
  showToast('已添加矩形');
}

function svgAddCircle() {
  var style = svgGetStyle();
  var canvas = document.getElementById('svg-canvas');
  var w = canvas.clientWidth || 600;
  var cx = 80 + Math.random() * (w - 200);
  var cy = 80 + Math.random() * 200;
  var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', cx);
  circle.setAttribute('cy', cy);
  circle.setAttribute('r', 30 + Math.random() * 30);
  circle.setAttribute('fill', style.fill);
  circle.setAttribute('stroke', style.stroke);
  circle.setAttribute('stroke-width', style['stroke-width']);
  circle.setAttribute('id', 'svg-elem-' + (svgIdCounter++));
  circle.setAttribute('class', 'svg-element');
  circle.style.cursor = 'pointer';
  circle.onclick = function(e) { e.stopPropagation(); svgSelect(this); };
  canvas.appendChild(circle);
  svgElements.push(circle);
  svgSelect(circle);
  showToast('已添加圆形');
}

function svgAddLine() {
  var style = svgGetStyle();
  var canvas = document.getElementById('svg-canvas');
  var w = canvas.clientWidth || 600;
  var x1 = 50 + Math.random() * (w - 150);
  var y1 = 50 + Math.random() * 200;
  var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x1 + 80 + Math.random() * 60);
  line.setAttribute('y2', y1 + 40 + Math.random() * 60);
  line.setAttribute('stroke', style.stroke);
  line.setAttribute('stroke-width', style['stroke-width']);
  line.setAttribute('id', 'svg-elem-' + (svgIdCounter++));
  line.setAttribute('class', 'svg-element');
  line.style.cursor = 'pointer';
  line.onclick = function(e) { e.stopPropagation(); svgSelect(this); };
  canvas.appendChild(line);
  svgElements.push(line);
  svgSelect(line);
  showToast('已添加线条');
}

function svgAddText() {
  var style = svgGetStyle();
  var canvas = document.getElementById('svg-canvas');
  var w = canvas.clientWidth || 600;
  var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', 50 + Math.random() * (w - 200));
  text.setAttribute('y', 100 + Math.random() * 150);
  text.setAttribute('fill', style.fill);
  text.setAttribute('font-size', '24');
  text.setAttribute('font-family', 'sans-serif');
  text.setAttribute('id', 'svg-elem-' + (svgIdCounter++));
  text.setAttribute('class', 'svg-element');
  text.textContent = '双击编辑文字';
  text.style.cursor = 'pointer';
  text.onclick = function(e) { e.stopPropagation(); svgSelect(this); };
  text.ondblclick = function() {
    var newText = prompt('编辑文字:', this.textContent);
    if (newText) this.textContent = newText;
  };
  canvas.appendChild(text);
  svgElements.push(text);
  svgSelect(text);
  showToast('已添加文字');
}

function svgSelect(el) {
  svgDeselect();
  if (!el) return;
  svgSelected = el;
  el.setAttribute('stroke-width', parseInt(el.getAttribute('stroke-width') || 2) + 2);
  el.style.outline = '2px dashed #6366f1';
  el.style.outlineOffset = '2px';
  document.getElementById('svg-fill').value = el.getAttribute('fill') || '#6366f1';
  document.getElementById('svg-stroke').value = el.getAttribute('stroke') || '#333333';
  document.getElementById('svg-stroke-width').value = el.getAttribute('stroke-width') || '2';
}

function svgDeselect() {
  if (svgSelected) {
    var sw = parseInt(svgSelected.getAttribute('stroke-width') || 2);
    svgSelected.setAttribute('stroke-width', Math.max(1, sw - 2));
    svgSelected.style.outline = 'none';
    svgSelected = null;
  }
}

function svgDeleteSelected() {
  if (svgSelected) {
    svgSelected.remove();
    svgElements = svgElements.filter(function(e) { return e !== svgSelected; });
    svgSelected = null;
    showToast('已删除选中元素');
  } else {
    showToast('请先点击选中一个元素');
  }
}

function svgClear() {
  if (!confirm('确定清空全部？')) return;
  svgElements.forEach(function(e) { e.remove(); });
  svgElements = [];
  svgSelected = null;
  showToast('已清空');
}

function svgExport() {
  var canvas = document.getElementById('svg-canvas');
  var clone = canvas.cloneNode(true);
  // 移除点击事件
  clone.querySelectorAll('*').forEach(function(el) { el.onclick = null; el.ondblclick = null; el.style = ''; });
  var svgData = new XMLSerializer().serializeToString(clone);
  var blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'my-drawing.svg';
  a.click();
  URL.revokeObjectURL(url);
  showToast('SVG 已导出');
}

// ==================== 6. 图片颜色提取器 ====================
function ceExtract() {
  var file = document.getElementById('ce-file').files[0];
  if (!file) return;
  document.getElementById('ce-filename').textContent = file.name;
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      var canvas = document.getElementById('ce-preview');
      var ctx = canvas.getContext('2d');
      canvas.width = Math.min(img.width, 400);
      canvas.height = Math.min(img.height, 200);
      var scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      var dw = img.width * scale, dh = img.height * scale;
      canvas.width = dw; canvas.height = dh;
      ctx.drawImage(img, 0, 0, dw, dh);
      canvas.style.display = 'block';
      document.getElementById('ce-placeholder').style.display = 'none';

      // 提取颜色
      var imageData = ctx.getImageData(0, 0, dw, dh);
      var data = imageData.data;
      var colorMap = {};
      var step = 4; // 采样步长，提高性能
      for (var i = 0; i < data.length; i += step * 4) {
        var r = Math.round(data[i] / 16) * 16;
        var g = Math.round(data[i+1] / 16) * 16;
        var b = Math.round(data[i+2] / 16) * 16;
        var key = r + ',' + g + ',' + b;
        if (colorMap[key]) colorMap[key]++;
        else colorMap[key] = 1;
      }

      // 排序
      var sorted = Object.keys(colorMap).sort(function(a, b) {
        return colorMap[b] - colorMap[a];
      });

      var count = parseInt(document.getElementById('ce-count').value);
      var topColors = sorted.slice(0, count);

      // 显示调色板
      var palette = document.getElementById('ce-colors');
      palette.innerHTML = '';
      document.getElementById('ce-palette').style.display = 'block';

      topColors.forEach(function(key) {
        var parts = key.split(',');
        var r = parseInt(parts[0]), g = parseInt(parts[1]), b = parseInt(parts[2]);
        var hex = '#' + [r,g,b].map(function(v) {
          var h = Math.round(v).toString(16);
          return h.length === 1 ? '0' + h : h;
        }).join('');
        var rgb = 'rgb(' + r + ',' + g + ',' + b + ')';
        var pct = Math.round(colorMap[key] / sorted.length * 100);

        var div = document.createElement('div');
        div.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;background:#f8f8f8;cursor:pointer;';
        div.onclick = function() { navigator.clipboard.writeText(hex); showToast('已复制 ' + hex); };
        div.innerHTML = '<span style="display:inline-block;width:32px;height:32px;border-radius:6px;background:' + hex + ';border:1px solid #ddd;flex-shrink:0;"></span>' +
          '<span style="font-family:monospace;font-size:13px;font-weight:600;">' + hex + '</span>' +
          '<span style="font-size:11px;color:#999;flex:1;">' + rgb + '</span>' +
          '<span style="font-size:11px;color:#999;">' + pct + '%</span>';
        palette.appendChild(div);
      });

      showToast('已提取 ' + topColors.length + ' 种颜色');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function ceCopyAllHex() {
  var colors = document.querySelectorAll('#ce-colors span:first-of-type');
  var hexes = [];
  document.querySelectorAll('#ce-colors > div').forEach(function(div) {
    var span = div.querySelector('span:nth-child(2)');
    if (span) hexes.push(span.textContent);
  });
  if (hexes.length) {
    navigator.clipboard.writeText(hexes.join(', '));
    showToast('已复制 ' + hexes.length + ' 个 HEX 色值');
  }
}

function ceCopyAllRGB() {
  var rgbs = [];
  document.querySelectorAll('#ce-colors > div').forEach(function(div) {
    var span = div.querySelector('span:nth-child(3)');
    if (span) rgbs.push(span.textContent);
  });
  if (rgbs.length) {
    navigator.clipboard.writeText(rgbs.join(', '));
    showToast('已复制 ' + rgbs.length + ' 个 RGB 色值');
  }
}

function ceExportCSS() {
  var cssLines = [];
  document.querySelectorAll('#ce-colors > div').forEach(function(div, i) {
    var span = div.querySelector('span:nth-child(2)');
    if (span) cssLines.push('  --color-' + (i+1) + ': ' + span.textContent + ';');
  });
  if (cssLines.length) {
    var css = ':root {\n' + cssLines.join('\n') + '\n}';
    navigator.clipboard.writeText(css);
    showToast('已复制 CSS 变量');
  }
}