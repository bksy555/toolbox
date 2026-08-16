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
var MEME_TEMPLATES = [
  { name: 'Black Guy Question', url: '' },
  { name: 'Crying Laughing', url: '' },
  { name: 'Crying', url: '' },
  { name: 'Roll Safe Think', url: '' },
  { name: 'Disaster Girl', url: '' },
  { name: 'Drake Hotline', url: '' },
  { name: 'Change My Mind', url: '' },
  { name: 'Two Buttons', url: '' },
  { name: 'Distracted BF', url: '' },
  { name: 'Is This A Pigeon', url: '' },
  { name: 'Galaxy Brain', url: '' },
  { name: 'UNO Draw 25', url: '' },
  { name: 'This Is Fine', url: '' },
  { name: 'Ight Imma Head Out', url: '' }
];

function memeSelectTemplate() {
  var sel = document.getElementById('meme-template');
  var custom = document.getElementById('meme-custom');
  var upload = document.getElementById('meme-upload-group');
  if (sel.value === 'custom') {
    custom.style.display = 'block';
    upload.style.display = 'none';
  } else {
    custom.style.display = 'none';
    upload.style.display = 'block';
    document.getElementById('meme-upload-label').textContent = 'Upload Image (or use template)';
  }
}

function memeUploadImage() {
  var file = document.getElementById('meme-upload').files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      var canvas = document.getElementById('meme-canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = Math.min(img.width, 600);
      canvas.height = Math.min(img.height, 600);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      memeDrawText();
      document.getElementById('meme-download').style.display = 'inline-flex';
      document.getElementById('meme-preview').style.display = 'block';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function memeDrawText() {
  var canvas = document.getElementById('meme-canvas');
  var ctx = canvas.getContext('2d');
  var topText = document.getElementById('meme-top').value.toUpperCase();
  var bottomText = document.getElementById('meme-bottom').value.toUpperCase();
  var fontSize = parseInt(document.getElementById('meme-fontsize').value);
  var textColor = document.getElementById('meme-color').value;
  var outline = document.getElementById('meme-outline').checked;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  if (topText) {
    var fs = Math.min(fontSize, canvas.width / topText.length * 1.2);
    ctx.font = 'bold ' + fs + 'px Impact, Arial Black, sans-serif';
    drawMemeText(ctx, topText, canvas.width / 2, 10, textColor, outline);
  }
  if (bottomText) {
    var fs = Math.min(fontSize, canvas.width / bottomText.length * 1.2);
    ctx.font = 'bold ' + fs + 'px Impact, Arial Black, sans-serif';
    ctx.textBaseline = 'bottom';
    drawMemeText(ctx, bottomText, canvas.width / 2, canvas.height - 10, textColor, outline);
  }
  document.getElementById('meme-download').style.display = 'inline-flex';
  document.getElementById('meme-preview').style.display = 'block';
}

function drawMemeText(ctx, text, x, y, color, outline) {
  if (outline) {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.strokeText(text, x, y);
  }
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function memeGenerate() {
  var canvas = document.getElementById('meme-canvas');
  var ctx = canvas.getContext('2d');
  var template = document.getElementById('meme-template').value;
  var topText = document.getElementById('meme-top').value.toUpperCase();
  var bottomText = document.getElementById('meme-bottom').value.toUpperCase();
  var fontSize = parseInt(document.getElementById('meme-fontsize').value);
  var textColor = document.getElementById('meme-color').value;
  var outline = document.getElementById('meme-outline').checked;

  if (template === 'custom') {
    memeUploadImage();
  } else {
    canvas.width = 500; canvas.height = 500;
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(0, 0, 500, 500);
    ctx.fillStyle = '#888888';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Template: ' + template, 250, 240);
    ctx.fillText('Upload image or use text only', 250, 270);
    memeDrawText();
  }
}

function memeDownload() {
  var canvas = document.getElementById('meme-canvas');
  var a = document.createElement('a');
  a.download = 'meme.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
  showToast('Downloaded');
}

// ==================== 4. 决策转盘 ====================
function spinWheel() {
  var items = document.getElementById('dw-items').value;
  if (!items.trim()) { showToast('Enter items'); return; }
  var list = items.split('\n').filter(function(i) { return i.trim(); });
  if (list.length < 2) { showToast('Need at least 2 items'); return; }
  var result = list[Math.floor(Math.random() * list.length)];
  document.getElementById('dw-result').textContent = result;
  document.getElementById('dw-result').className = 'dw-result dw-spin';
  showToast('Result: ' + result);
  setTimeout(function() { document.getElementById('dw-result').className = 'dw-result'; }, 500);
}