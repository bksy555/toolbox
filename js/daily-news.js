// ============================================================
// 每日新闻摘要 - 客户端脚本
// 从 API 获取并展示在首页
// ============================================================

var _dailyNewsTimer = null;
var _dailyNewsIndex = 0;
var _dailyNewsData = null;

// 获取新闻数据
function fetchDailyNews() {
  var apiUrl = '/api/daily-news';
  // 如果是本地文件，用 Vercel 部署路径
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    apiUrl = 'https://toolbox-qlkw-jbbxa0ths-bksy556.vercel.app/api/daily-news';
  }
  
  fetch(apiUrl)
    .then(function(r) { return r.json(); })
    .then(function(data) {
      _dailyNewsData = data;
      renderDailyNews(data);
    })
    .catch(function(err) {
      console.log('每日新闻获取失败:', err);
      // 显示静态占位
      var banner = document.getElementById('daily-news-banner');
      if (banner) {
        banner.innerHTML = '<div class="news-banner-inner" style="text-align:center;padding:20px;">' +
          '<span style="font-size:14px;color:var(--text-light);">📰 今日资讯加载中… 刷新页面重试</span></div>';
      }
    });
}

// 渲染新闻
function renderDailyNews(data) {
  var banner = document.getElementById('daily-news-banner');
  if (!banner || !data || !data.items) return;
  
  var allItems = [];
  for (var i = 0; i < data.items.length; i++) {
    var section = data.items[i];
    var items = section.data.items || [];
    for (var j = 0; j < items.length; j++) {
      allItems.push({
        type: section.type,
        icon: section.icon,
        label: section.label,
        title: items[j].title,
        url: items[j].url,
        summary: items[j].summary || ''
      });
    }
  }
  
  if (allItems.length === 0) {
    banner.innerHTML = '<div class="news-banner-inner" style="text-align:center;padding:20px;">' +
      '<span style="font-size:14px;color:var(--text-light);">📰 暂无今日资讯</span></div>';
    return;
  }
  
  _dailyNewsData = allItems;
  _dailyNewsIndex = 0;
  
  // 构建HTML
  var html = '<div class="news-banner-inner">' +
    '<div class="news-tabs">';
  
  // 标签
  var types = {};
  for (var i = 0; i < data.items.length; i++) {
    var s = data.items[i];
    types[s.type] = s;
  }
  var typeKeys = Object.keys(types);
  var first = true;
  for (var i = 0; i < typeKeys.length; i++) {
    var t = types[typeKeys[i]];
    html += '<span class="news-tab' + (first ? ' active' : '') + '" data-type="' + t.type + '" onclick="switchNewsTab(\'' + t.type + '\')">' +
      t.icon + ' ' + t.label + '</span>';
    first = false;
  }
  
  html += '<span class="news-date">' + (data.date || '') + '</span>';
  html += '</div>'; // news-tabs
  
  // 内容区域
  html += '<div class="news-content" id="news-content">';
  for (var i = 0; i < typeKeys.length; i++) {
    var t = types[typeKeys[i]];
    var sectionItems = getItemsByType(allItems, t.type);
    html += '<div class="news-items" id="news-items-' + t.type + '"' + (i === 0 ? '' : ' style="display:none;"') + '>';
    html += '<div class="news-scroll" id="news-scroll-' + t.type + '">';
    for (var j = 0; j < sectionItems.length; j++) {
      var item = sectionItems[j];
      html += '<a href="' + (item.url || '#') + '" target="_blank" class="news-item" title="' + escapeHtml(item.summary || item.title) + '">';
      html += '<span class="news-badge">' + (j + 1) + '</span>';
      html += '<span class="news-text">' + escapeHtml(item.title) + '</span>';
      html += '</a>';
    }
    html += '</div></div>';
  }
  
  html += '</div>'; // news-content
  html += '</div>'; // news-banner-inner
  
  banner.innerHTML = html;
  
  // 启动滚动
  startNewsScroll(typeKeys[0]);
}

function getItemsByType(allItems, type) {
  var result = [];
  for (var i = 0; i < allItems.length; i++) {
    if (allItems[i].type === type) {
      result.push(allItems[i]);
    }
  }
  return result;
}

function escapeHtml(text) {
  if (!text) return '';
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 切换新闻标签
function switchNewsTab(type) {
  // 停止旧的滚动
  if (_dailyNewsTimer) {
    clearInterval(_dailyNewsTimer);
    _dailyNewsTimer = null;
  }
  
  // 切换标签
  var tabs = document.querySelectorAll('.news-tab');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active');
    if (tabs[i].getAttribute('data-type') === type) {
      tabs[i].classList.add('active');
    }
  }
  
  // 切换内容
  var contents = document.querySelectorAll('[id^="news-items-"]');
  for (var i = 0; i < contents.length; i++) {
    contents[i].style.display = 'none';
  }
  var target = document.getElementById('news-items-' + type);
  if (target) target.style.display = 'block';
  
  // 启动滚动
  startNewsScroll(type);
}

// 滚动新闻
function startNewsScroll(type) {
  var scrollContainer = document.getElementById('news-scroll-' + type);
  if (!scrollContainer) return;
  
  var items = scrollContainer.querySelectorAll('.news-item');
  if (items.length <= 1) return;
  
  // 自动滚动：每隔几秒滚动到下一个
  var currentIdx = 0;
  items[0].classList.add('highlight');
  
  _dailyNewsTimer = setInterval(function() {
    items[currentIdx].classList.remove('highlight');
    currentIdx = (currentIdx + 1) % items.length;
    items[currentIdx].classList.add('highlight');
    // 滚动到可见区域
    items[currentIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 4000);
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
  // 延迟加载，确保页面其他元素已渲染
  setTimeout(fetchDailyNews, 500);
});