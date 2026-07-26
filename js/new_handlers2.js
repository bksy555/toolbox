// ============================================================
// 视频解析 - 自研，纯前端实现
// ============================================================

function parseVideoUrl() {
  var url = document.getElementById('vdl-url').value.trim();
  if (!url) { toast('⚠️ 请粘贴视频链接'); return; }
  
  document.getElementById('vdl-loading').style.display = 'block';
  document.getElementById('vdl-result').style.display = 'none';
  document.getElementById('vdl-status').textContent = '';
  
  var platform = detectPlatform(url);
  if (!platform) {
    document.getElementById('vdl-loading').style.display = 'none';
    document.getElementById('vdl-status').textContent = '❌ 暂不支持该平台，仅支持抖音、TikTok、B站、小红书、快手';
    return;
  }
  
  switch (platform) {
    case 'tiktok':
      parseTikTokEmbed(url);
      break;
    case 'bilibili':
      parseBilibiliVideo(url);
      break;
    case 'douyin':
    case 'xiaohongshu':
    case 'kuaishou':
      document.getElementById('vdl-loading').style.display = 'none';
      document.getElementById('vdl-result').style.display = 'none';
      document.getElementById('vdl-status').textContent = 'ℹ️ ' + platformName(platform) + '暂不支持直接下载，请使用官方应用或网页版查看';
      break;
  }
}

function detectPlatform(url) {
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('douyin.com') || url.includes('v.douyin')) return 'douyin';
  if (url.includes('bilibili.com') || url.includes('b23.tv')) return 'bilibili';
  if (url.includes('xiaohongshu.com') || url.includes('xhslink.com')) return 'xiaohongshu';
  if (url.includes('kuaishou.com') || url.includes('gifshow.com')) return 'kuaishou';
  return null;
}

function platformName(p) {
  var names = { tiktok: 'TikTok', douyin: '抖音', bilibili: 'B站', xiaohongshu: '小红书', kuaishou: '快手' };
  return names[p] || p;
}

// TikTok - 使用官方 oEmbed API（纯前端，无需后端）
function parseTikTokEmbed(url) {
  var oembedUrl = 'https://www.tiktok.com/oembed?url=' + encodeURIComponent(url);
  
  fetch(oembedUrl)
    .then(function(resp) {
      if (!resp.ok) throw new Error('TikTok API 请求失败');
      return resp.json();
    })
    .then(function(data) {
      document.getElementById('vdl-loading').style.display = 'none';
      
      var thumb = document.getElementById('vdl-thumb');
      if (data.thumbnail_url) {
        thumb.innerHTML = '<img src="' + data.thumbnail_url + '" style="max-width:100%;max-height:250px;border-radius:10px;border:1px solid var(--border);">';
      } else {
        thumb.innerHTML = '<div style="padding:30px;background:var(--bg);border-radius:10px;color:var(--text-light);">暂无封面</div>';
      }
      
      var info = document.getElementById('vdl-info');
      info.innerHTML = '<div style="font-size:12px;color:var(--text-light);margin-bottom:4px;">📺 TikTok</div>' +
        '<div style="font-weight:600;font-size:16px;">' + (data.title || 'TikTok 视频') + '</div>' +
        (data.author_name ? '<div style="font-size:13px;color:var(--text-light);margin-top:4px;">👤 ' + data.author_name + '</div>' : '') +
        (data.author_url ? '<div style="font-size:12px;color:var(--text-light);margin-top:2px;"><a href="' + data.author_url + '" target="_blank" style="color:var(--primary);">查看作者主页 →</a></div>' : '');
      
      var actions = document.getElementById('vdl-actions');
      actions.innerHTML = '<button class="btn btn-primary" onclick="window.open(\'' + url + '\', \'_blank\')">▶️ 在 TikTok 中打开</button>';
      
      // 尝试从 embed HTML 中提取视频播放地址
      if (data.html) {
        var vidMatch = data.html.match(/video_id=([^"&]+)/);
        if (vidMatch) {
          var videoPageUrl = 'https://www.tiktok.com/@' + data.author_name + '/video/' + vidMatch[1];
          actions.innerHTML += '<button class="btn btn-success" onclick="window.open(\'' + videoPageUrl + '\', \'_blank\')">📥 查看视频页</button>';
        }
      }
      
      document.getElementById('vdl-result').style.display = 'block';
    })
    .catch(function(err) {
      document.getElementById('vdl-loading').style.display = 'none';
      document.getElementById('vdl-status').textContent = '❌ 解析失败: ' + err.message + '。请确认链接是否正确';
    });
}

// Bilibili - 使用官方 API（纯前端，无需后端）
function parseBilibiliVideo(url) {
  // 提取视频 ID
  var videoId = '';
  var bvMatch = url.match(/BV[a-zA-Z0-9]+/);
  var avMatch = url.match(/av(\d+)/i);
  
  if (bvMatch) {
    videoId = bvMatch[0];
  } else if (avMatch) {
    videoId = 'av' + avMatch[1];
  } else {
    document.getElementById('vdl-loading').style.display = 'none';
    document.getElementById('vdl-status').textContent = '❌ 无法识别B站视频ID';
    return;
  }
  
  // B站官方 API（支持跨域）
  var apiUrl = 'https://api.bilibili.com/x/web-interface/view?bvid=' + videoId;
  
  fetch(apiUrl)
    .then(function(resp) { return resp.json(); })
    .then(function(data) {
      document.getElementById('vdl-loading').style.display = 'none';
      
      if (data.code !== 0) {
        throw new Error(data.message || 'B站API返回错误');
      }
      
      var video = data.data;
      
      var thumb = document.getElementById('vdl-thumb');
      thumb.innerHTML = '<img src="' + (video.pic || '') + '" style="max-width:100%;max-height:250px;border-radius:10px;border:1px solid var(--border);">';
      
      var info = document.getElementById('vdl-info');
      info.innerHTML = '<div style="font-size:12px;color:var(--text-light);margin-bottom:4px;">📺 Bilibili</div>' +
        '<div style="font-weight:600;font-size:16px;">' + (video.title || 'B站视频') + '</div>' +
        (video.owner ? '<div style="font-size:13px;color:var(--text-light);margin-top:4px;">👤 ' + video.owner.name + '</div>' : '') +
        (video.stat ? '<div style="font-size:12px;color:var(--text-light);margin-top:4px;">👁️ ' + formatCount(video.stat.view) + ' 播放</div>' : '');
      
      var actions = document.getElementById('vdl-actions');
      actions.innerHTML = '<button class="btn btn-primary" onclick="window.open(\'https://www.bilibili.com/video/' + videoId + '\', \'_blank\')">▶️ 在B站打开</button>';
      
      if (video.duration) {
        var mins = Math.floor(video.duration / 60);
        var secs = video.duration % 60;
        info.innerHTML += '<div style="font-size:12px;color:var(--text-light);margin-top:2px;">⏱️ ' + mins + ':' + (secs < 10 ? '0' : '') + secs + '</div>';
      }
      
      document.getElementById('vdl-result').style.display = 'block';
    })
    .catch(function(err) {
      document.getElementById('vdl-loading').style.display = 'none';
      document.getElementById('vdl-status').textContent = '❌ 解析失败: ' + err.message;
    });
}

function formatCount(n) {
  if (!n) return '0';
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  return n.toString();
}

// ============================================================
// 图片去背景 + 证件照换底色
// ============================================================
var _bgImage = null;
var _bgResultDataUrl = null;

function loadBgImage() {
  var file = document.getElementById('bg-file').files[0];
  if (!file) return;
  document.getElementById('bg-info').textContent = '📄 ' + file.name + ' (' + (file.size/1024).toFixed(1) + ' KB)';
  document.getElementById('bg-canvas-area').style.display = 'none';
  document.getElementById('bg-download-btn').style.display = 'none';
  document.getElementById('bg-status').textContent = '';
  _bgResultDataUrl = null;
  
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      _bgImage = img;
      // 显示原图
      var canvas = document.getElementById('bg-source-canvas');
      canvas.width = Math.min(img.width, 500);
      canvas.height = img.height * (canvas.width / img.width);
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      document.getElementById('bg-canvas-area').style.display = 'block';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  
  // 监听颜色选择变化
  document.getElementById('bg-color').onchange = function() {
    document.getElementById('bg-custom-color-group').style.display = this.value === 'custom' ? 'block' : 'none';
  };
}

function removeBg() {
  if (!_bgImage) { toast('⚠️ 请先上传图片'); return; }
  document.getElementById('bg-status').textContent = '⏳ 正在处理...';
  
  try {
    var tolerance = parseInt(document.getElementById('bg-tolerance').value);
    var bgColor = document.getElementById('bg-color').value;
    if (bgColor === 'custom') bgColor = document.getElementById('bg-custom-color').value;
    
    var canvas = document.getElementById('bg-result-canvas');
    var img = _bgImage;
    canvas.width = Math.min(img.width, 500);
    canvas.height = img.height * (canvas.width / img.width);
    var ctx = canvas.getContext('2d');
    
    // 绘制原图
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // 获取像素数据
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imageData.data;
    
    // 找左上角像素颜色作为背景色参考
    // 取四个角和中心点的平均色作为背景参考
    var samples = [
      {x: 0, y: 0}, {x: canvas.width-1, y: 0},
      {x: 0, y: canvas.height-1}, {x: canvas.width-1, y: canvas.height-1},
      {x: Math.floor(canvas.width/2), y: 0},
      {x: 0, y: Math.floor(canvas.height/2)}
    ];
    
    var sumR = 0, sumG = 0, sumB = 0, count = 0;
    for (var s = 0; s < samples.length; s++) {
      var p = samples[s];
      var idx = (p.y * canvas.width + p.x) * 4;
      if (idx >= 0 && idx < data.length) {
        sumR += data[idx];
        sumG += data[idx+1];
        sumB += data[idx+2];
        count++;
      }
    }
    
    var bgR = Math.round(sumR / count);
    var bgG = Math.round(sumG / count);
    var bgB = Math.round(sumB / count);
    
    // 移除背景色（基于颜色距离）
    var threshold = tolerance * 2.55; // 0-255范围
    for (var i = 0; i < data.length; i += 4) {
      var r = data[i], g = data[i+1], b = data[i+2];
      var dist = Math.sqrt(
        (r - bgR) * (r - bgR) +
        (g - bgG) * (g - bgG) +
        (b - bgB) * (b - bgB)
      );
      if (dist < threshold) {
        data[i+3] = 0; // 透明
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // 替换背景色
    if (bgColor !== 'transparent') {
      // 创建一个新 canvas 绘制背景色
      var finalCanvas = document.createElement('canvas');
      finalCanvas.width = canvas.width;
      finalCanvas.height = canvas.height;
      var finalCtx = finalCanvas.getContext('2d');
      
      // 绘制背景色
      finalCtx.fillStyle = bgColor;
      finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      
      // 绘制去背景后的图片
      finalCtx.drawImage(canvas, 0, 0);
      
      // 替换结果 canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(finalCanvas, 0, 0);
    }
    
    // 保存结果
    _bgResultDataUrl = canvas.toDataURL('image/png');
    
    document.getElementById('bg-download-btn').style.display = 'inline-block';
    document.getElementById('bg-status').textContent = '✅ 处理完成！点击下载按钮保存';
    toast('✅ 去背景完成');
  } catch(err) {
    document.getElementById('bg-status').textContent = '❌ 处理失败: ' + err.message;
  }
}

function downloadBgResult() {
  if (!_bgResultDataUrl) { toast('⚠️ 请先处理图片'); return; }
  var a = document.createElement('a');
  a.href = _bgResultDataUrl;
  a.download = '去背景结果.png';
  a.click();
  toast('✅ 已下载');
}

// ============================================================
// 批量图片压缩
// ============================================================
var _bcImages = [];
var _bcResults = [];

function loadBatchCompress() {
  var files = document.getElementById('bc-files').files;
  _bcImages = Array.from(files);
  if (_bcImages.length === 0) return;
  document.getElementById('bc-info').textContent = '📄 ' + _bcImages.length + ' 张图片已选择';
  document.getElementById('bc-loading').style.display = 'none';
  document.getElementById('bc-download-btn').style.display = 'none';
  document.getElementById('bc-list').innerHTML = '';
  document.getElementById('bc-status').textContent = '';
  
  // 显示文件列表
  var html = '<div style="font-weight:600;margin-bottom:8px;">已选择文件：</div>';
  _bcImages.forEach(function(f, i) {
    html += '<div style="font-size:13px;color:var(--text-light);padding:4px 0;">' + (i+1) + '. ' + f.name + ' (' + (f.size/1024).toFixed(1) + ' KB)</div>';
  });
  document.getElementById('bc-list').innerHTML = html;
}

async function runBatchCompress() {
  if (_bcImages.length === 0) { toast('⚠️ 请先选择图片'); return; }
  document.getElementById('bc-loading').style.display = 'block';
  document.getElementById('bc-download-btn').style.display = 'none';
  _bcResults = [];
  
  var quality = parseInt(document.getElementById('bc-quality').value) / 100;
  var maxWidth = parseInt(document.getElementById('bc-maxwidth').value) || 0;
  var format = document.getElementById('bc-format').value;
  var mimeType = 'image/' + (format === 'jpeg' ? 'jpeg' : format);
  
  var html = '<div style="font-weight:600;margin-bottom:8px;">压缩结果：</div>';
  
  for (var i = 0; i < _bcImages.length; i++) {
    var file = _bcImages[i];
    document.getElementById('bc-loading').querySelector('div:last-child').textContent = '正在压缩 ' + (i+1) + '/' + _bcImages.length + '...';
    
    try {
      var result = await compressSingleImage(file, quality, maxWidth, mimeType, format);
      _bcResults.push(result);
      var ratio = ((1 - result.size / file.size) * 100).toFixed(1);
      var color = ratio > 0 ? '#16a34a' : '#dc2626';
      html += '<div style="font-size:13px;padding:4px 0;color:var(--text-light);">' +
        (i+1) + '. ' + file.name + ' <span style="color:' + color + ';">' +
        (file.size/1024).toFixed(1) + 'KB → ' + (result.size/1024).toFixed(1) + 'KB (' + (ratio > 0 ? '-' : '') + ratio + '%)</span></div>';
    } catch(err) {
      html += '<div style="font-size:13px;padding:4px 0;color:var(--danger);">' + (i+1) + '. ' + file.name + ' ❌ 压缩失败</div>';
    }
  }
  
  document.getElementById('bc-loading').style.display = 'none';
  document.getElementById('bc-list').innerHTML = html;
  if (_bcResults.length > 1) {
    document.getElementById('bc-download-btn').style.display = 'inline-block';
  }
  document.getElementById('bc-status').textContent = '✅ 压缩完成，共 ' + _bcResults.length + ' / ' + _bcImages.length + ' 张成功';
  toast('✅ 批量压缩完成');
}

function compressSingleImage(file, quality, maxWidth, mimeType, format) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var img = new Image();
      img.onload = function() {
        var canvas = document.createElement('canvas');
        var w = img.width, h = img.height;
        if (maxWidth > 0 && w > maxWidth) {
          h = h * maxWidth / w;
          w = maxWidth;
        }
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob(function(blob) {
          if (blob) {
            resolve({ blob: blob, size: blob.size, name: file.name.replace(/\.[^.]+$/, '') + '.' + format });
          } else {
            reject(new Error('压缩失败'));
          }
        }, mimeType, quality);
      };
      img.onerror = function() { reject(new Error('图片加载失败')); };
      img.src = e.target.result;
    };
    reader.onerror = function() { reject(new Error('文件读取失败')); };
    reader.readAsDataURL(file);
  });
}

async function downloadBatchCompressed() {
  if (_bcResults.length === 0) { toast('⚠️ 没有可下载的文件'); return; }
  
  if (typeof JSZip === 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
    script.onload = function() { doDownloadBatchCompressed(); };
    script.onerror = function() {
      // 降级：逐个下载
      _bcResults.forEach(function(r) {
        var url = URL.createObjectURL(r.blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = r.name;
        a.click();
        URL.revokeObjectURL(url);
      });
    };
    document.head.appendChild(script);
  } else {
    doDownloadBatchCompressed();
  }
}

async function doDownloadBatchCompressed() {
  var zip = new JSZip();
  _bcResults.forEach(function(r) {
    zip.file(r.name, r.blob);
  });
  var content = await zip.generateAsync({ type: 'blob' });
  var url = URL.createObjectURL(content);
  var a = document.createElement('a');
  a.href = url;
  a.download = '压缩图片.zip';
  a.click();
  URL.revokeObjectURL(url);
  toast('✅ ZIP 已下载');
}

// ============================================================
// 批量加水印
// ============================================================
var _wmImages = [];
var _wmResults = [];
var _wmWatermarkImage = null;

function loadWatermarkImages() {
  var files = document.getElementById('wm-files').files;
  _wmImages = Array.from(files);
  if (_wmImages.length === 0) return;
  document.getElementById('wm-info').textContent = '📄 ' + _wmImages.length + ' 张图片已选择';
  document.getElementById('wm-loading').style.display = 'none';
  document.getElementById('wm-download-btn').style.display = 'none';
  document.getElementById('wm-list').innerHTML = '';
  document.getElementById('wm-status').textContent = '';
  
  var html = '<div style="font-weight:600;margin-bottom:8px;">已选择文件：</div>';
  _wmImages.forEach(function(f, i) {
    html += '<div style="font-size:13px;color:var(--text-light);padding:4px 0;">' + (i+1) + '. ' + f.name + ' (' + (f.size/1024).toFixed(1) + ' KB)</div>';
  });
  document.getElementById('wm-list').innerHTML = html;
}

function toggleWatermarkType() {
  var type = document.getElementById('wm-type').value;
  document.getElementById('wm-text-group').style.display = type === 'text' ? 'block' : 'none';
  document.getElementById('wm-image-group').style.display = type === 'image' ? 'block' : 'none';
}

async function runWatermark() {
  if (_wmImages.length === 0) { toast('⚠️ 请先选择图片'); return; }
  document.getElementById('wm-loading').style.display = 'block';
  document.getElementById('wm-download-btn').style.display = 'none';
  _wmResults = [];
  
  var wmType = document.getElementById('wm-type').value;
  var position = document.getElementById('wm-position').value;
  var opacity = parseInt(document.getElementById('wm-opacity').value) / 100;
  var size = parseInt(document.getElementById('wm-size').value);
  
  // 如果是图片水印，加载水印图片
  if (wmType === 'image') {
    var wmFile = document.getElementById('wm-image-file').files[0];
    if (!wmFile) { toast('⚠️ 请选择水印图片'); document.getElementById('wm-loading').style.display = 'none'; return; }
    _wmWatermarkImage = await loadImageAsElement(wmFile);
  }
  
  var wmText = document.getElementById('wm-text').value || 'ToolBox';
  
  var html = '<div style="font-weight:600;margin-bottom:8px;">处理结果：</div>';
  
  for (var i = 0; i < _wmImages.length; i++) {
    var file = _wmImages[i];
    document.getElementById('wm-loading').querySelector('div:last-child').textContent = '正在处理 ' + (i+1) + '/' + _wmImages.length + '...';
    
    try {
      var img = await loadImageAsElement(file);
      var result = await addWatermarkToImage(img, wmType, wmText, position, opacity, size, file.name);
      _wmResults.push(result);
      html += '<div style="font-size:13px;padding:4px 0;color:var(--text-light);">' + (i+1) + '. ' + file.name + ' ✅</div>';
    } catch(err) {
      html += '<div style="font-size:13px;padding:4px 0;color:var(--danger);">' + (i+1) + '. ' + file.name + ' ❌ 失败</div>';
    }
  }
  
  document.getElementById('wm-loading').style.display = 'none';
  document.getElementById('wm-list').innerHTML = html;
  if (_wmResults.length > 0) {
    document.getElementById('wm-download-btn').style.display = 'inline-block';
  }
  document.getElementById('wm-status').textContent = '✅ 处理完成，共 ' + _wmResults.length + ' 张';
  toast('✅ 水印添加完成');
}

function loadImageAsElement(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var img = new Image();
      img.onload = function() { resolve(img); };
      img.onerror = function() { reject(new Error('图片加载失败')); };
      img.src = e.target.result;
    };
    reader.onerror = function() { reject(new Error('文件读取失败')); };
    reader.readAsDataURL(file);
  });
}

function addWatermarkToImage(img, wmType, wmText, position, opacity, size, fileName) {
  return new Promise(function(resolve) {
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    
    // 绘制原图
    ctx.drawImage(img, 0, 0);
    
    ctx.globalAlpha = opacity;
    
    var wmW, wmH, x, y;
    
    // 计算水印尺寸
    if (wmType === 'text') {
      ctx.font = 'bold ' + size + 'px sans-serif';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      var metrics = ctx.measureText(wmText);
      wmW = metrics.width;
      wmH = size;
    } else {
      wmW = _wmWatermarkImage.width;
      wmH = _wmWatermarkImage.height;
      // 缩放水印
      var maxW = img.width * 0.3;
      if (wmW > maxW) {
        wmH = wmH * maxW / wmW;
        wmW = maxW;
      }
    }
    
    // 计算位置
    var margin = 20;
    switch(position) {
      case 'center': x = (img.width - wmW) / 2; y = (img.height - wmH) / 2; break;
      case 'topleft': x = margin; y = margin + wmH; break;
      case 'topright': x = img.width - wmW - margin; y = margin + wmH; break;
      case 'bottomleft': x = margin; y = img.height - margin; break;
      case 'bottomright': x = img.width - wmW - margin; y = img.height - margin; break;
      case 'tile': x = 0; y = 0; break;
    }
    
    if (position === 'tile') {
      // 平铺水印
      var stepX = wmW + 80;
      var stepY = wmH + 80;
      for (var ty = 0; ty < img.height; ty += stepY) {
        for (var tx = 0; tx < img.width; tx += stepX) {
          if (wmType === 'text') {
            ctx.strokeText(wmText, tx, ty + wmH);
            ctx.fillText(wmText, tx, ty + wmH);
          } else {
            ctx.drawImage(_wmWatermarkImage, tx, ty, wmW, wmH);
          }
        }
      }
    } else {
      if (wmType === 'text') {
        ctx.strokeText(wmText, x, y);
        ctx.fillText(wmText, x, y);
      } else {
        ctx.drawImage(_wmWatermarkImage, x, y, wmW, wmH);
      }
    }
    
    ctx.globalAlpha = 1;
    
    canvas.toBlob(function(blob) {
      var ext = fileName.match(/\.\w+$/);
      ext = ext ? ext[0] : '.png';
      var name = fileName.replace(/\.[^.]+$/, '') + '_带水印' + ext;
      resolve({ blob: blob, name: name, size: blob.size });
    }, 'image/png');
  });
}

async function downloadWatermarked() {
  if (_wmResults.length === 0) { toast('⚠️ 没有可下载的文件'); return; }
  
  if (typeof JSZip === 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';
    script.onload = function() { doDownloadWatermarked(); };
    script.onerror = function() {
      _wmResults.forEach(function(r) {
        var url = URL.createObjectURL(r.blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = r.name;
        a.click();
        URL.revokeObjectURL(url);
      });
    };
    document.head.appendChild(script);
  } else {
    doDownloadWatermarked();
  }
}

async function doDownloadWatermarked() {
  var zip = new JSZip();
  _wmResults.forEach(function(r) {
    zip.file(r.name, r.blob);
  });
  var content = await zip.generateAsync({ type: 'blob' });
  var url = URL.createObjectURL(content);
  var a = document.createElement('a');
  a.href = url;
  a.download = '带水印图片.zip';
  a.click();
  URL.revokeObjectURL(url);
  toast('✅ ZIP 已下载');
}

// ============================================================
// 长图拼接
// ============================================================
var _stImages = [];

function loadStitchImages() {
  var files = document.getElementById('st-files').files;
  _stImages = Array.from(files);
  if (_stImages.length === 0) return;
  document.getElementById('st-info').textContent = '📄 ' + _stImages.length + ' 张图片已选择';
  document.getElementById('st-loading').style.display = 'none';
  document.getElementById('st-download-btn').style.display = 'none';
  document.getElementById('st-preview').innerHTML = '';
  document.getElementById('st-status').textContent = '';
}

async function runStitch() {
  if (_stImages.length < 2) { toast('⚠️ 请至少选择 2 张图片'); return; }
  document.getElementById('st-loading').style.display = 'block';
  document.getElementById('st-download-btn').style.display = 'none';
  document.getElementById('st-preview').innerHTML = '';
  
  var direction = document.getElementById('st-direction').value;
  var gap = parseInt(document.getElementById('st-gap').value) || 0;
  var bgColor = document.getElementById('st-bgcolor').value;
  
  try {
    // 加载所有图片
    var images = [];
    for (var i = 0; i < _stImages.length; i++) {
      document.getElementById('st-loading').querySelector('div:last-child').textContent = '正在加载图片 ' + (i+1) + '/' + _stImages.length + '...';
      var img = await loadImageAsElement(_stImages[i]);
      images.push(img);
    }
    
    document.getElementById('st-loading').querySelector('div:last-child').textContent = '正在拼接...';
    
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    
    if (direction === 'vertical') {
      var totalWidth = Math.max.apply(null, images.map(function(img) { return img.width; }));
      var totalHeight = images.reduce(function(sum, img) { return sum + img.height; }, 0) + gap * (images.length - 1);
      canvas.width = totalWidth;
      canvas.height = totalHeight;
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      var y = 0;
      for (var i = 0; i < images.length; i++) {
        var img = images[i];
        var x = (totalWidth - img.width) / 2;
        ctx.drawImage(img, x, y, img.width, img.height);
        y += img.height + gap;
      }
    } else {
      var totalHeight = Math.max.apply(null, images.map(function(img) { return img.height; }));
      var totalWidth = images.reduce(function(sum, img) { return sum + img.width; }, 0) + gap * (images.length - 1);
      canvas.width = totalWidth;
      canvas.height = totalHeight;
      
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      var x = 0;
      for (var i = 0; i < images.length; i++) {
        var img = images[i];
        var y = (totalHeight - img.height) / 2;
        ctx.drawImage(img, x, y, img.width, img.height);
        x += img.width + gap;
      }
    }
    
    document.getElementById('st-loading').style.display = 'none';
    
    var dataUrl = canvas.toDataURL('image/png');
    document.getElementById('st-preview').innerHTML = '<img src="' + dataUrl + '" style="max-width:100%;max-height:400px;border-radius:10px;border:1px solid var(--border);">';
    document.getElementById('st-preview').querySelector('img').onclick = function() { window.open(dataUrl); };
    
    _stResultDataUrl = dataUrl;
    document.getElementById('st-download-btn').style.display = 'inline-block';
    document.getElementById('st-status').textContent = '✅ 拼接完成，尺寸: ' + canvas.width + 'x' + canvas.height + 'px';
    toast('✅ 拼接完成');
  } catch(err) {
    document.getElementById('st-loading').style.display = 'none';
    document.getElementById('st-status').textContent = '❌ 拼接失败: ' + err.message;
  }
}

var _stResultDataUrl = null;

function downloadStitchResult() {
  if (!_stResultDataUrl) { toast('⚠️ 请先拼接图片'); return; }
  var a = document.createElement('a');
  a.href = _stResultDataUrl;
  a.download = '拼接长图.png';
  a.click();
  toast('✅ 已下载');
}

// ============================================================
// 视频转 GIF
// ============================================================
var _gifVideo = null;

function loadVideoForGif() {
  var file = document.getElementById('vg-file').files[0];
  if (!file) return;
  document.getElementById('vg-info').textContent = '📄 ' + file.name + ' (' + (file.size/1024).toFixed(1) + ' KB)';
  document.getElementById('vg-controls').style.display = 'none';
  document.getElementById('vg-result').style.display = 'none';
  document.getElementById('vg-status').textContent = '';
  
  var url = URL.createObjectURL(file);
  var video = document.getElementById('vg-video');
  video.src = url;
  video.load();
  video.onloadedmetadata = function() {
    document.getElementById('vg-controls').style.display = 'block';
    document.getElementById('vg-info').textContent = '📄 ' + file.name + ' (' + (file.size/1024).toFixed(1) + ' KB) - ' + 
      Math.floor(video.duration) + '秒 ' + video.videoWidth + 'x' + video.videoHeight;
    // 设置最大时长
    var dur = document.getElementById('vg-duration');
    dur.max = Math.floor(video.duration);
  };
  _gifVideo = video;
}

async function generateGif() {
  if (!_gifVideo) { toast('⚠️ 请先选择视频'); return; }
  
  var startTime = parseFloat(document.getElementById('vg-start').value) || 0;
  var duration = parseFloat(document.getElementById('vg-duration').value) || 3;
  var fps = parseInt(document.getElementById('vg-fps').value) || 10;
  var targetWidth = parseInt(document.getElementById('vg-width').value) || 0;
  var colors = parseInt(document.getElementById('vg-colors').value) || 256;
  
  // 暂时用 GIF.js 库
  document.getElementById('vg-loading').style.display = 'block';
  document.getElementById('vg-result').style.display = 'none';
  document.getElementById('vg-status').textContent = '';
  
  if (typeof GIF === 'undefined') {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.js';
    script.onload = function() { doGenerateGif(startTime, duration, fps, targetWidth, colors); };
    script.onerror = function() {
      document.getElementById('vg-loading').style.display = 'none';
      document.getElementById('vg-status').textContent = '❌ 加载 GIF 库失败，请检查网络连接';
    };
    document.head.appendChild(script);
  } else {
    doGenerateGif(startTime, duration, fps, targetWidth, colors);
  }
}

async function doGenerateGif(startTime, duration, fps, targetWidth, colors) {
  try {
    var video = _gifVideo;
    video.currentTime = startTime;
    
    var totalFrames = Math.ceil(duration * fps);
    var delay = 1000 / fps;
    
    var width = targetWidth > 0 ? targetWidth : video.videoWidth;
    var height = video.videoHeight * (width / video.videoWidth);
    
    var gif = new GIF({
      workers: 2,
      quality: 10,
      width: Math.round(width),
      height: Math.round(height),
      workerScript: 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js'
    });
    
    var canvas = document.createElement('canvas');
    canvas.width = Math.round(width);
    canvas.height = Math.round(height);
    var ctx = canvas.getContext('2d');
    
    for (var i = 0; i < totalFrames; i++) {
      var time = startTime + (i / fps);
      document.getElementById('vg-loading').querySelector('div:last-child').textContent = '正在生成帧 ' + (i+1) + '/' + totalFrames + '...';
      
      video.currentTime = time;
      await waitForVideoSeek(video);
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      gif.addFrame(ctx, { copy: true, delay: delay });
    }
    
    document.getElementById('vg-loading').querySelector('div:last-child').textContent = '正在编码 GIF...';
    
    gif.on('progress', function(p) {
      document.getElementById('vg-loading').querySelector('div:last-child').textContent = '编码中: ' + Math.round(p * 100) + '%';
    });
    
    gif.on('finished', function(blob) {
      document.getElementById('vg-loading').style.display = 'none';
      var url = URL.createObjectURL(blob);
      document.getElementById('vg-result').innerHTML = '<img src="' + url + '" style="max-width:100%;max-height:300px;border-radius:10px;border:1px solid var(--border);"><div class="btn-group" style="margin-top:12px;justify-content:center;"><button class="btn btn-primary" onclick="var a=document.createElement(\'a\');a.href=\'' + url + '\';a.download=\'视频转GIF.gif\';a.click();this.textContent=\'✅ 已下载\'">📥 下载 GIF</button></div>';
      document.getElementById('vg-result').style.display = 'block';
      document.getElementById('vg-status').textContent = '✅ GIF 生成完成！大小: ' + (blob.size/1024).toFixed(1) + ' KB';
      toast('✅ GIF 已生成');
    });
    
    gif.render();
  } catch(err) {
    document.getElementById('vg-loading').style.display = 'none';
    document.getElementById('vg-status').textContent = '❌ 生成失败: ' + err.message;
  }
}

function waitForVideoSeek(video) {
  return new Promise(function(resolve) {
    video.onseeked = function() { resolve(); };
    // 如果已经 seek 完成，直接 resolve
    setTimeout(resolve, 100);
  });
}