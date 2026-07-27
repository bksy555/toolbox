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
      // 取正方形区域（中间裁剪）
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
            wrapper.style.cssText = 'display:inline-block;margin:6px;text-align:center;';
            var idx = r * 3 + c + 1;
            wrapper.innerHTML = '<div style="font-size:12px;color:var(--text-light);margin-bottom:4px;">第' + idx + '块</div>' +
              '<img src="' + dataUrl + '" style="width:120px;height:120px;object-fit:cover;border-radius:6px;border:1px solid var(--border);cursor:pointer;" onclick="downloadNineGridImage(\'' + dataUrl + '\',\'九宫格_' + idx + '.png\')" title="点击下载">';
            container.appendChild(wrapper);
          })(row, col);
        }
      }
      document.getElementById('ng-info').textContent = '✅ 已分割为9张图片，点击任意块可单独下载';
      // 一键下载全部
      var allBtn = document.getElementById('ng-download-all');
      allBtn.style.display = 'inline-flex';
      allBtn._images = [];
      for (var r = 0; r < 3; r++) {
        for (var c = 0; c < 3; c++) {
          (function(rr, cc) {
            var c2 = document.createElement('canvas');
            c2.width = cw; c2.height = ch;
            var c2ctx = c2.getContext('2d');
            c2ctx.drawImage(img, sx + cc * cw, sy + rr * ch, cw, ch, 0, 0, cw, ch);
            allBtn._images.push(c2.toDataURL('image/png'));
          })(r, c);
        }
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function downloadNineGridImage(dataUrl, filename) {
  var link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

function downloadNineGridAll() {
  var btn = document.getElementById('ng-download-all');
  var imgs = btn._images || [];
  if (imgs.length === 0) { showToast('⚠️ 请先分割图片'); return; }
  // 打包成ZIP（使用JSZip库）
  if (typeof JSZip === 'undefined') {
    showToast('⚠️ 正在加载JSZip库...');
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script.onload = function() {
      downloadNineGridAll();
    };
    document.head.appendChild(script);
    return;
  }
  var zip = new JSZip();
  for (var i = 0; i < imgs.length; i++) {
    var base64 = imgs[i].split(',')[1];
    zip.file('九宫格_' + (i+1) + '.png', base64, {base64: true});
  }
  zip.generateAsync({type: 'blob'}).then(function(content) {
    var link = document.createElement('a');
    link.download = '九宫格图片.zip';
    link.href = URL.createObjectURL(content);
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('✅ 已下载全部9张图片');
  });
}


// ==================== 2. 文字转手写体 ====================
function textToHandwriting() {
  var text = document.getElementById('th-text').value;
  if (!text) { showToast('⚠️ 请输入文字'); return; }
  var bgColor = document.getElementById('th-bg').value;
  var inkColor = document.getElementById('th-ink').value;
  var fontSize = parseInt(document.getElementById('th-size').value);
  var lineHeight = parseInt(document.getElementById('th-lineheight').value);
  var paperStyle = document.getElementById('th-paper').value;
  var canvas = document.getElementById('th-canvas');
  var ctx = canvas.getContext('2d');
  // 计算画布尺寸
  var maxW = 800, padding = 60;
  var lines = text.split('\n');
  var maxLine = '';
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].length > maxLine.length) maxLine = lines[i];
  }
  ctx.font = fontSize + 'px "KaiTi","STKaiti","楷体","华文楷体",serif';
  var textW = ctx.measureText(maxLine).width;
  var canvasW = Math.min(Math.max(textW + padding * 2, 300), maxW);
  var lineCount = lines.length;
  var canvasH = Math.max(lineCount * lineHeight + padding * 2, 200);
  canvas.width = canvasW;
  canvas.height = canvasH;
  ctx.clearRect(0, 0, canvasW, canvasH);
  // 纸张背景
  if (paperStyle === 'rice') {
    ctx.fillStyle = '#faf6ed';
    ctx.fillRect(0, 0, canvasW, canvasH);
    // 横线
    ctx.strokeStyle = '#e0d5c0';
    ctx.lineWidth = 0.5;
    for (var y = padding; y < canvasH - padding; y += lineHeight) {
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvasW - padding, y);
      ctx.stroke();
    }
  } else if (paperStyle === 'grid') {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.strokeStyle = '#d0d0d0';
    ctx.lineWidth = 0.5;
    for (var x = padding; x < canvasW - padding; x += fontSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasH);
      ctx.stroke();
    }
    for (var y = padding; y < canvasH - padding; y += fontSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasW, y);
      ctx.stroke();
    }
  } else {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasW, canvasH);
  }
  // 写字（模拟手写：轻微旋转和偏移）
  ctx.font = fontSize + 'px "KaiTi","STKaiti","楷体","华文楷体",serif';
  ctx.fillStyle = inkColor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  for (var l = 0; l < lines.length; l++) {
    var line = lines[l];
    var x = padding;
    var y = padding + l * lineHeight + (lineHeight - fontSize) / 2;
    for (var c = 0; c < line.length; c++) {
      ctx.save();
      // 轻微随机偏移和旋转，模拟手写
      var rot = (Math.random() - 0.5) * 0.06;
      var ox = (Math.random() - 0.5) * 2;
      var oy = (Math.random() - 0.5) * 2;
      ctx.translate(x + c * fontSize * 0.95 + ox, y + oy);
      ctx.rotate(rot);
      ctx.fillText(line[c], 0, 0);
      ctx.restore();
    }
  }
  document.getElementById('th-download').style.display = 'inline-flex';
  document.getElementById('th-preview').style.display = 'block';
  showToast('✅ 已生成手写体');
}

function downloadHandwriting() {
  var canvas = document.getElementById('th-canvas');
  var text = document.getElementById('th-text').value.trim() || '手写体';
  var link = document.createElement('a');
  link.download = text.substring(0, 10) + '_手写体.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('✅ 已下载');
}


// ==================== 3. 表情包生成器 ====================
var MEME_TEMPLATES = [
  { name: '🤔 黑人问号', url: '' },
  { name: '😂 笑哭', url: '' },
  { name: '😭 大哭', url: '' },
  { name: '🔥 燃起来了', url: '' },
  { name: '💪 加油', url: '' },
  { name: '🐶 狗头', url: '' },
  { name: '🙄 无语', url: '' },
  { name: '😏 偷笑', url: '' },
  { name: '🤡 小丑', url: '' },
  { name: '👴 老人手机', url: '' },
  { name: '🐱 猫猫', url: '' },
  { name: '🦆 可达鸭', url: '' }
];

function initMemeGenerator() {
  var select = document.getElementById('meme-template');
  if (!select) return;
  select.innerHTML = '<option value="">-- 选择模板或上传自定义图片 --</option>';
  for (var i = 0; i < MEME_TEMPLATES.length; i++) {
    select.innerHTML += '<option value="' + i + '">' + MEME_TEMPLATES[i].name + '</option>';
  }
}

function memeSelectTemplate() {
  var idx = document.getElementById('meme-template').value;
  var fileInput = document.getElementById('meme-file');
  if (idx === '') {
    // 用户上传自定义
    fileInput.click();
    return;
  }
  // 使用内置模板（生成彩色文字背景）
  var names = ['黑人问号','笑哭','大哭','燃起来了','加油','狗头','无语','偷笑','小丑','老人手机','猫猫','可达鸭'];
  var colors = ['#4a90d9','#f5a623','#f5a623','#e74c3c','#27ae60','#8e44ad','#7f8c8d','#2ecc71','#e74c3c','#95a5a6','#e67e22','#3498db'];
  var idxNum = parseInt(idx);
  renderMeme(names[idxNum], colors[idxNum], '没有模板图片？' + names[idxNum], '改成你的文字');
}

function memeUploadImage() {
  var file = document.getElementById('meme-file').files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('meme-custom-img').src = e.target.result;
    document.getElementById('meme-custom-img').style.display = 'block';
    renderMemeWithImage(e.target.result);
  };
  reader.readAsDataURL(file);
}

function renderMeme(title, bgColor, topText, bottomText) {
  var canvas = document.getElementById('meme-canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = 500;
  canvas.height = 500;
  ctx.clearRect(0, 0, 500, 500);
  // 背景
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 500, 500);
  // 标题
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px "Microsoft YaHei","PingFang SC",sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 250, 100);
  // 表情符号（大号）
  ctx.font = '180px sans-serif';
  ctx.fillText(getMemeEmoji(title), 250, 280);
  // 顶部文字
  ctx.font = 'bold 28px "Microsoft YaHei","PingFang SC",sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(topText, 250, 360);
  // 底部文字
  ctx.font = 'bold 24px "Microsoft YaHei","PingFang SC",sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(bottomText, 250, 420);
  // 边框
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, 500, 500);
  document.getElementById('meme-download').style.display = 'inline-flex';
  showToast('✅ 表情包已生成');
}

function getMemeEmoji(name) {
  var map = {
    '黑人问号': '🤔', '笑哭': '😂', '大哭': '😭', '燃起来了': '🔥',
    '加油': '💪', '狗头': '🐶', '无语': '🙄', '偷笑': '😏',
    '小丑': '🤡', '老人手机': '👴', '猫猫': '🐱', '可达鸭': '🦆'
  };
  return map[name] || '😊';
}

function renderMemeWithImage(imgSrc) {
  var topText = document.getElementById('meme-top-text').value || '顶部文字';
  var bottomText = document.getElementById('meme-bottom-text').value || '底部文字';
  var img = new Image();
  img.onload = function() {
    var canvas = document.getElementById('meme-canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;
    ctx.clearRect(0, 0, 500, 500);
    // 绘制图片（居中裁剪）
    var s = Math.min(img.width, img.height);
    var sx = (img.width - s) / 2, sy = (img.height - s) / 2;
    ctx.drawImage(img, sx, sy, s, s, 0, 0, 500, 500);
    // 添加黑色半透明条
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, 500, 80);
    ctx.fillRect(0, 420, 500, 80);
    // 文字
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Microsoft YaHei","PingFang SC",sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(topText, 250, 40);
    ctx.fillText(bottomText, 250, 460);
    document.getElementById('meme-download').style.display = 'inline-flex';
    showToast('✅ 表情包已生成');
  };
  img.src = imgSrc;
}

function generateMeme() {
  var topText = document.getElementById('meme-top-text').value || '顶部文字';
  var bottomText = document.getElementById('meme-bottom-text').value || '底部文字';
  var customImg = document.getElementById('meme-custom-img');
  if (customImg.style.display !== 'none' && customImg.src) {
    renderMemeWithImage(customImg.src);
  } else {
    var idx = document.getElementById('meme-template').value;
    if (idx === '') {
      showToast('⚠️ 请选择模板或上传图片');
      return;
    }
    var names = ['黑人问号','笑哭','大哭','燃起来了','加油','狗头','无语','偷笑','小丑','老人手机','猫猫','可达鸭'];
    var colors = ['#4a90d9','#f5a623','#f5a623','#e74c3c','#27ae60','#8e44ad','#7f8c8d','#2ecc71','#e74c3c','#95a5a6','#e67e22','#3498db'];
    var idxNum = parseInt(idx);
    renderMeme(names[idxNum], colors[idxNum], topText, bottomText);
  }
}

function downloadMeme() {
  var canvas = document.getElementById('meme-canvas');
  var link = document.createElement('a');
  link.download = '表情包.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('✅ 表情包已下载');
}


// ==================== 4. 决策转盘 ====================
var _wheelItems = [];
var _wheelAngle = 0;
var _wheelSpinning = false;

function wheelAddOption() {
  var input = document.getElementById('wheel-input');
  var text = input.value.trim();
  if (!text) { showToast('⚠️ 请输入选项'); return; }
  _wheelItems.push(text);
  input.value = '';
  wheelRenderList();
  wheelDraw();
}

function wheelAddFromText() {
  var textarea = document.getElementById('wheel-textarea');
  var text = textarea.value.trim();
  if (!text) { showToast('⚠️ 请输入选项（每行一个）'); return; }
  var lines = text.split('\n').filter(function(s) { return s.trim() !== ''; });
  for (var i = 0; i < lines.length; i++) {
    _wheelItems.push(lines[i].trim());
  }
  textarea.value = '';
  wheelRenderList();
  wheelDraw();
}

function wheelRemoveItem(idx) {
  _wheelItems.splice(idx, 1);
  wheelRenderList();
  wheelDraw();
}

function wheelClear() {
  _wheelItems = [];
  wheelRenderList();
  wheelDraw();
  document.getElementById('wheel-result').textContent = '';
  document.getElementById('wheel-result').style.display = 'none';
}

function wheelRenderList() {
  var container = document.getElementById('wheel-list');
  if (_wheelItems.length === 0) {
    container.innerHTML = '<div style="color:var(--text-light);padding:10px;">暂无选项，请添加</div>';
    return;
  }
  var html = '';
  for (var i = 0; i < _wheelItems.length; i++) {
    html += '<div class="wheel-item" style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:var(--card-bg);border:1px solid var(--border);border-radius:6px;margin-bottom:4px;">' +
      '<span style="font-size:14px;">' + (i+1) + '. ' + _wheelItems[i] + '</span>' +
      '<button class="btn btn-secondary" style="padding:2px 8px;font-size:12px;" onclick="wheelRemoveItem(' + i + ')">✕</button></div>';
  }
  container.innerHTML = html;
  document.getElementById('wheel-count').textContent = '共 ' + _wheelItems.length + ' 个选项';
}

function wheelDraw() {
  var canvas = document.getElementById('wheel-canvas');
  var ctx = canvas.getContext('2d');
  var cx = 200, cy = 200, R = 190;
  canvas.width = 400;
  canvas.height = 400;
  ctx.clearRect(0, 0, 400, 400);
  if (_wheelItems.length === 0) {
    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#999';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('添加选项后显示转盘', cx, cy);
    return;
  }
  var n = _wheelItems.length;
  var arc = (Math.PI * 2) / n;
  var colors = ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#E7E9ED','#F7464A','#00BFFF','#7B68EE','#FFD700','#3CB371','#FF69B4','#00CED1','#FF6347','#ADFF2F'];
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(_wheelAngle);
  for (var i = 0; i < n; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, R, i * arc, (i + 1) * arc);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    // 文字
    ctx.save();
    ctx.rotate(i * arc + arc / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    var txt = _wheelItems[i];
    if (txt.length > 4) txt = txt.substring(0, 4) + '…';
    ctx.fillText(txt, R - 15, 4);
    ctx.restore();
  }
  ctx.restore();
  // 指针
  ctx.beginPath();
  ctx.moveTo(cx + 15, 10);
  ctx.lineTo(cx - 15, 10);
  ctx.lineTo(cx, 40);
  ctx.closePath();
  ctx.fillStyle = '#e74c3c';
  ctx.fill();
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 2;
  ctx.stroke();
  // 中心圆
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function wheelSpin() {
  if (_wheelSpinning) return;
  if (_wheelItems.length < 2) { showToast('⚠️ 至少需要2个选项'); return; }
  _wheelSpinning = true;
  document.getElementById('wheel-result').style.display = 'none';
  // 随机旋转
  var spins = 5 + Math.random() * 5;
  var targetAngle = _wheelAngle + spins * Math.PI * 2 + Math.random() * Math.PI * 2;
  var duration = 3000;
  var startTime = Date.now();
  var startAngle = _wheelAngle;
  function animate() {
    var elapsed = Date.now() - startTime;
    var progress = Math.min(elapsed / duration, 1);
    // easeOutCubic
    var eased = 1 - Math.pow(1 - progress, 3);
    _wheelAngle = startAngle + (targetAngle - startAngle) * eased;
    wheelDraw();
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      _wheelAngle = targetAngle % (Math.PI * 2);
      _wheelSpinning = false;
      // 确定结果
      var n = _wheelItems.length;
      var arc = (Math.PI * 2) / n;
      // 指针在顶部（-π/2方向）
      var pointerAngle = -Math.PI / 2;
      var normalizedAngle = ((pointerAngle - _wheelAngle) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      var idx = Math.floor(normalizedAngle / arc);
      if (idx >= n) idx = n - 1;
      var result = _wheelItems[idx];
      document.getElementById('wheel-result').textContent = '🎉 结果：' + result;
      document.getElementById('wheel-result').style.display = 'block';
      showToast('🎯 抽中：' + result);
    }
  }
  animate();
}


// ==================== 页面初始化 ====================
function initNewTools() {
  if (document.getElementById('meme-template')) initMemeGenerator();
  if (document.getElementById('wheel-canvas')) wheelDraw();
}