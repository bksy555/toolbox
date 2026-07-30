#!/bin/bash
# ============================================================
# 每日新闻数据生成脚本
# 由 QwenPaw 定时任务每天6:00 AM 调用
# 生成 data/daily-news.json 供网站静态加载
# ============================================================

set -e
WORKSPACE="/run/csi/mount-root/nas/4079184d856ecc166ed19d4887083405/workspaces/default"
TOOLS_WEBSITE="$WORKSPACE/tools-website"
DATA_DIR="$TOOLS_WEBSITE/data"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"

echo "=== 每日新闻数据生成 ==="
echo "时间: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo ""

mkdir -p "$DATA_DIR"

# ---- 1. 获取新闻联播 ----
echo "📺 获取新闻联播..."

NEWS_HTML=$(curl -sL --max-time 15 -H "User-Agent: $UA" "https://mrxwlb.com/" 2>/dev/null) || NEWS_HTML=""

if [ -n "$NEWS_HTML" ]; then
  echo "$NEWS_HTML" | python3 -c "
import sys, re, json
html = sys.stdin.read()
items = []
seen = set()
for pattern in [
    re.compile(r'<h[23][^>]*>.*?<a\s+href=\"([^\"]+)\"[^>]*>([^<]+)</a>', re.DOTALL),
    re.compile(r'<a\s+href=\"([^\"]+)\"[^>]*>([^<]{10,})</a>')
]:
    for m in pattern.finditer(html):
        title = m.group(2).strip()
        url = m.group(1)
        if not url.startswith('http'):
            url = 'https://mrxwlb.com' + url
        if title not in seen and len(title) > 6 and '广告' not in title and '首页' not in title and '新闻联播' not in title:
            seen.add(title)
            items.append({'title': title, 'url': url})
with open('$DATA_DIR/news_items.json', 'w', encoding='utf-8') as f:
    json.dump(items[:20], f, ensure_ascii=False)
print(f'  获取到 {len(items)} 条新闻')
" 2>&1
else
  echo '[]' > "$DATA_DIR/news_items.json"
  echo "  获取到 0 条新闻"
fi

# ---- 2. 获取AI科技日报 ----
echo "🤖 获取AI科技日报..."

AI_RESP=$(curl -sL --max-time 15 -H "User-Agent: $UA" "https://aihot.virxact.com/api/public/daily" 2>/dev/null) || AI_RESP=""

if [ -n "$AI_RESP" ]; then
  echo "$AI_RESP" | python3 -c "
import sys, json
data = json.loads(sys.stdin.read())
items = []
if 'sections' in data:
    for section in data['sections']:
        label = section.get('label', '')
        for entry in section.get('entries', [])[:5]:
            items.append({
                'title': entry.get('title', ''),
                'summary': entry.get('summary', ''),
                'url': entry.get('sourceUrl', entry.get('url', '')),
                'category': label
            })
else:
    entries = data.get('items', data.get('data', []))
    for item in entries[:25]:
        items.append({
            'title': item.get('title', ''),
            'summary': item.get('summary', ''),
            'url': item.get('sourceUrl', item.get('url', '')),
            'category': item.get('category', '')
        })
with open('$DATA_DIR/ai_items.json', 'w', encoding='utf-8') as f:
    json.dump(items[:25], f, ensure_ascii=False)
print(f'  获取到 {len(items)} 条AI资讯')
" 2>&1
else
  echo '[]' > "$DATA_DIR/ai_items.json"
  echo "  获取到 0 条AI资讯"
fi

# 如果日报API失败，尝试精选接口
AI_COUNT=$(python3 -c "import json; print(len(json.load(open('$DATA_DIR/ai_items.json'))))" 2>/dev/null || echo "0")
if [ "$AI_COUNT" -eq 0 ]; then
  echo "  日报API失败，尝试精选接口..."
  SINCE=$(python3 -c "from datetime import datetime, timedelta; print((datetime.utcnow() - timedelta(hours=24)).isoformat() + 'Z')")
  AI_RESP2=$(curl -sL --max-time 15 -H "User-Agent: $UA" "https://aihot.virxact.com/api/public/items?mode=selected&since=$SINCE&take=25" 2>/dev/null) || AI_RESP2=""
  if [ -n "$AI_RESP2" ]; then
    echo "$AI_RESP2" | python3 -c "
import sys, json
data = json.loads(sys.stdin.read())
entries = data.get('items', data.get('data', []))
items = [{
    'title': item.get('title', ''),
    'summary': item.get('summary', ''),
    'url': item.get('sourceUrl', item.get('url', '')),
    'category': item.get('category', '')
} for item in entries]
with open('$DATA_DIR/ai_items.json', 'w', encoding='utf-8') as f:
    json.dump(items[:25], f, ensure_ascii=False)
print(f'  获取到 {len(items)} 条AI资讯')
" 2>&1
  fi
fi

# ---- 3. 生成最终 JSON ----
echo "📝 生成最终 JSON 文件..."
NOW=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
TODAY=$(date -u '+%Y-%m-%d')

python3 -c "
import json
with open('$DATA_DIR/news_items.json', 'r') as f:
    news_items = json.load(f)
with open('$DATA_DIR/ai_items.json', 'r') as f:
    ai_items = json.load(f)
result = {
    'date': '$TODAY',
    'updateTime': '$NOW',
    'items': [
        {
            'type': 'news',
            'icon': '📺',
            'label': '新闻联播',
            'data': {
                'source': '新闻联播',
                'items': news_items,
                'updateTime': '$NOW'
            }
        },
        {
            'type': 'ai',
            'icon': '🤖',
            'label': 'AI科技日报',
            'data': {
                'source': 'AI科技日报',
                'items': ai_items,
                'updateTime': '$NOW'
            }
        }
    ]
}
with open('$DATA_DIR/daily-news.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
print(f'  📰 新闻: {len(news_items)} 条')
print(f'  🤖 AI: {len(ai_items)} 条')
print(f'  ✅ 已保存: $DATA_DIR/daily-news.json')
"

echo ""
echo "=== 完成 ==="