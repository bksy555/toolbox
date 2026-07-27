// ============================================================
// 印章制作工具 - Stamp Maker (独立模块)
// ============================================================

var _stampRendered = false;

function stampFontName(font) {
  var map = {
    weibei: '"Weibei SC","KaiTi","华文楷体",serif',
    songti: '"SimSun","STSong","宋体","华文宋体",serif',
    fangsong: '"FangSong","STFangsong","仿宋","华文仿宋",serif',
    zhuanshu: '"KaiTi","STKaiti","楷体","华文楷体",serif',
    lishu: '"LiSu","STLiti","隶书",serif',
    heiti: '"SimHei","Microsoft YaHei","黑体","微软雅黑",sans-serif',
    yuanti: '"Yuanti SC","PingFang SC","Microsoft YaHei","圆体",sans-serif',
    jinwen: '"KaiTi","STKaiti","楷体",serif'
  };
  return map[font] || '"KaiTi",serif';
}

function renderStamp() {
  var text = document.getElementById('stamp-text').value.trim();
  var font = document.getElementById('stamp-font').value;
  var style = parseInt(document.getElementById('stamp-style').value);
  var canvas = document.getElementById('stamp-canvas');
  var ctx = canvas.getContext('2d');
  var size = 400;
  canvas.width = size;
  canvas.height = size;
  ctx.clearRect(0, 0, size, size);

  if (!text || text.length < 2 || text.length > 4) {
    document.getElementById('stamp-download-btn').style.display = 'none';
    document.getElementById('stamp-tip').textContent = '请输入2~4个汉字';
    return;
  }

  document.getElementById('stamp-tip').textContent = '已生成，点击下载按钮保存';
  document.getElementById('stamp-download-btn').style.display = 'inline-flex';
  _stampRendered = true;

  var fn = [null,
    drawSquareRaisedRound, drawSquareRecessedRound, drawSquareRaised, drawSquareRecessed,
    drawRoundRecessed, drawRoundRaised, drawRoundDragon, drawRectangle,
    drawAntiqueSquareRecessed, drawAntiqueSquareRaisedHan, drawAntiqueRoundRaised, drawAntiqueRoundRecessed
  ];
  if (fn[style]) fn[style](ctx, text, font, size);
}

function downloadStamp() {
  if (!_stampRendered) return;
  var canvas = document.getElementById('stamp-canvas');
  var text = document.getElementById('stamp-text').value.trim() || '印章';
  var link = document.createElement('a');
  link.download = text + '_印章.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  toast('✅ 印章已下载');
}

// ---- 辅助：绘制圆角矩形边框 ----
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ---- 辅助：方形印章文字排列 ----
function putSquareText(ctx, text, cx, cy, cell, font, color, fs) {
  ctx.font = 'bold ' + fs + 'px ' + stampFontName(font);
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (text.length === 2) {
    ctx.fillText(text[0], cx, cy - cell * 0.55);
    ctx.fillText(text[1], cx, cy + cell * 0.55);
  } else if (text.length === 3) {
    ctx.fillText(text[0], cx, cy - cell * 0.7);
    ctx.fillText(text[1], cx, cy);
    ctx.fillText(text[2], cx, cy + cell * 0.7);
  } else {
    ctx.fillText(text[0], cx - cell * 0.5, cy - cell * 0.5);
    ctx.fillText(text[1], cx + cell * 0.5, cy - cell * 0.5);
    ctx.fillText(text[2], cx - cell * 0.5, cy + cell * 0.5);
    ctx.fillText(text[3], cx + cell * 0.5, cy + cell * 0.5);
  }
}

// ---- 辅助：圆形印章文字 ----
function putRoundText(ctx, text, cx, cy, font, color, fs) {
  ctx.font = 'bold ' + fs + 'px ' + stampFontName(font);
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (text.length === 2) {
    ctx.fillText(text[0], cx, cy - fs * 0.6);
    ctx.fillText(text[1], cx, cy + fs * 0.6);
  } else if (text.length === 3) {
    ctx.fillText(text[0], cx, cy - fs * 0.85);
    ctx.fillText(text[1], cx, cy);
    ctx.fillText(text[2], cx, cy + fs * 0.85);
  } else {
    ctx.fillText(text[0], cx - fs * 0.5, cy - fs * 0.5);
    ctx.fillText(text[1], cx + fs * 0.5, cy - fs * 0.5);
    ctx.fillText(text[2], cx - fs * 0.5, cy + fs * 0.5);
    ctx.fillText(text[3], cx + fs * 0.5, cy + fs * 0.5);
  }
}

// ===== 样式1: 方形阳刻圆角 =====
function drawSquareRaisedRound(ctx, text, font, size) {
  var p = 30, b = 6;
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#c41e1e';
  ctx.lineWidth = b;
  roundRect(ctx, p, p, size - p*2, size - p*2, 18);
  ctx.stroke();
  p += 18;
  ctx.strokeStyle = '#c41e1e';
  ctx.lineWidth = 2;
  roundRect(ctx, p, p, size - p*2, size - p*2, 12);
  ctx.stroke();
  putSquareText(ctx, text, size/2, size/2, (size - p*2) * 0.35, font, '#c41e1e', 72);
}

// ===== 样式2: 方形阴刻圆角 =====
function drawSquareRecessedRound(ctx, text, font, size) {
  var p = 30, b = 6;
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#c41e1e';
  ctx.lineWidth = b;
  roundRect(ctx, p, p, size - p*2, size - p*2, 18);
  ctx.stroke();
  p += 16;
  ctx.fillStyle = '#c41e1e';
  roundRect(ctx, p, p, size - p*2, size - p*2, 12);
  ctx.fill();
  putSquareText(ctx, text, size/2, size/2, (size - p*2) * 0.35, font, '#ffffff', 72);
}

// ===== 样式3: 方形阳刻印章 =====
function drawSquareRaised(ctx, text, font, size) {
  var p = 28, b = 5;
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#c41e1e';
  ctx.lineWidth = b;
  ctx.strokeRect(p, p, size - p*2, size - p*2);
  p += 14;
  ctx.strokeStyle = '#c41e1e';
  ctx.lineWidth = 2;
  ctx.strokeRect(p, p, size - p*2, size - p*2);
  putSquareText(ctx, text, size/2, size/2, (size - p*2) * 0.35, font, '#c41e1e', 72);
}

// ===== 样式4: 方形阴刻印章 =====
function drawSquareRecessed(ctx, text, font, size) {
  var p = 28, b = 5;
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#c41e1e';
  ctx.lineWidth = b;
  ctx.strokeRect(p, p, size - p*2, size - p*2);
  p += 12;
  ctx.fillStyle = '#c41e1e';
  ctx.fillRect(p, p, size - p*2, size - p*2);
  putSquareText(ctx, text, size/2, size/2, (size - p*2) * 0.35, font, '#ffffff', 72);
}

// ===== 样式5: 圆形阴刻印章 =====
function drawRoundRecessed(ctx, text, font, size) {
  var cx = size/2, cy = size/2, R = size/2 - 30, b = 5;
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#c41e1e';
  ctx.lineWidth = b;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI*2);
  ctx.stroke();
  R -= 12;
  ctx.fillStyle = '#c41e1e';
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI*2);
  ctx.fill();
  putRoundText(ctx, text, cx, cy, font, '#ffffff', 52);
}

// ===== 样式6: 圆形阳刻印章 =====
function drawRoundRaised(ctx, text, font, size) {
  var cx = size/2, cy = size/2, R = size/2 - 30, b = 5;
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#c41e1e';
  ctx.lineWidth = b;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI*2);
  ctx.stroke();
  R -= 12;
  ctx.strokeStyle = '#c41e1e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI*2);
  ctx.stroke();
  putRoundText(ctx, text, cx, cy, font, '#c41e1e', 52);
}

// ===== 样式7: 圆形龙纹印章 =====
function drawRoundDragon(ctx, text, font, size) {
  var cx = size/2, cy = size/2, R = size/2 - 28, b = 4;
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#c41e1e';
  ctx.lineWidth = b;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI*2);
  ctx.stroke();
  for (var i = 0; i < 12; i++) {
    var a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * (R - 6), cy + Math.sin(a) * (R - 6), 4, 0, Math.PI * 2);
    ctx.stroke();
  }
  R -= 14;
  ctx.strokeStyle = '#c41e1e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI*2);
  ctx.stroke();
  putRoundText(ctx, text, cx, cy, font, '#c41e1e', 48);
}

// ===== 样式8: 长方形印章 =====
function drawRectangle(ctx, text, font, size) {
  var p = 30, b = 5;
  ctx.fillStyle = '#f5f0e8';
  ctx.fillRect(0, 0, size, size);
  var rw = size * 0.45, rh = size * 0.65;
  ctx.strokeStyle = '#c41e1e';
  ctx.lineWidth = b;
  ctx.strokeRect((size - rw)/2, (size - rh)/2, rw, rh);
  ctx.strokeStyle = '#c41e1e';
  ctx.lineWidth = 2;
  ctx.strokeRect((size - rw)/2 + 10, (size - rh)/2 + 10, rw - 20, rh - 20);
  putRoundText(ctx, text, size/2, size/2, font, '#c41e1e', 50);
}

// ===== 样式9: 仿古方形阴刻印章 =====
function drawAntiqueSquareRecessed(ctx, text, font, size) {
  var p = 26, b = 5;
  ctx.fillStyle = '#efe8d8';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#8b2500';
  ctx.lineWidth = b;
  ctx.strokeRect(p, p, size - p*2, size - p*2);
  ctx.strokeStyle = '#8b2500';
  ctx.lineWidth = 2;
  ctx.strokeRect(p + 8, p + 8, size - p*2 - 16, size - p*2 - 16);
  p += 14;
  ctx.fillStyle = '#8b2500';
  ctx.fillRect(p, p, size - p*2, size - p*2);
  putSquareText(ctx, text, size/2, size/2, (size - p*2) * 0.35, font, '#efe8d8', 64);
}

// ===== 样式10: 仿古方形阳刻汉印 =====
function drawAntiqueSquareRaisedHan(ctx, text, font, size) {
  var p = 26, b = 5;
  ctx.fillStyle = '#efe8d8';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#8b2500';
  ctx.lineWidth = b;
  ctx.strokeRect(p, p, size - p*2, size - p*2);
  ctx.strokeStyle = '#8b2500';
  ctx.lineWidth = 2;
  ctx.strokeRect(p + 8, p + 8, size - p*2 - 16, size - p*2 - 16);
  p += 14;
  ctx.strokeStyle = '#8b2500';
  ctx.lineWidth = 2;
  ctx.strokeRect(p, p, size - p*2, size - p*2);
  putSquareText(ctx, text, size/2, size/2, (size - p*2) * 0.35, font, '#8b2500', 64);
}

// ===== 样式11: 仿古圆形阳刻印戳 =====
function drawAntiqueRoundRaised(ctx, text, font, size) {
  var cx = size/2, cy = size/2, R = size/2 - 28, b = 4;
  ctx.fillStyle = '#efe8d8';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#8b2500';
  ctx.lineWidth = b;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI*2);
  ctx.stroke();
  R -= 12;
  ctx.strokeStyle = '#8b2500';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI*2);
  ctx.stroke();
  putRoundText(ctx, text, cx, cy, font, '#8b2500', 50);
}

// ===== 样式12: 仿古圆形阴刻印章 =====
function drawAntiqueRoundRecessed(ctx, text, font, size) {
  var cx = size/2, cy = size/2, R = size/2 - 28, b = 4;
  ctx.fillStyle = '#efe8d8';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#8b2500';
  ctx.lineWidth = b;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI*2);
  ctx.stroke();
  R -= 12;
  ctx.fillStyle = '#8b2500';
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI*2);
  ctx.fill();
  putRoundText(ctx, text, cx, cy, font, '#efe8d8', 50);
}