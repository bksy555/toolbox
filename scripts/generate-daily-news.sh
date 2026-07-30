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

# 尝试多个数据源
python3 -c "
import urllib.request, ssl, re, json, sys

items = []
seen = set()
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
ctx = ssl.create_default_context()

# 数据源1: 央视网 (tv.cctv.com)
try:
    req = urllib.request.Request('https://tv.cctv.com/lm/xwlb/', headers={'User-Agent': UA})
    resp = urllib.request.urlopen(req, context=ctx, timeout=10)
    html = resp.read().decode('utf-8', errors='replace')
    pattern = re.compile(r'<a\s+href=\"(https://tv\.cctv\.com/2026/[^\"]+)\"[^>]*>(.*?)</a>', re.DOTALL)
    for m in pattern.finditer(html):
        url = m.group(1)
        title = m.group(2).strip()
        title = re.sub(r'<[^>]+>', '', title).strip()
        title = re.sub(r'^完整版\[视频\]', '', title).strip()
        if title not in seen and len(title) > 8 and '完整版' not in title and '新闻联播' not in title:
            seen.add(title)
            items.append({'title': title, 'url': url})
    print(f'  央视网: 获取到 {len(items)} 条新闻')
except Exception as e:
    print(f'  央视网失败: {e}')

# 数据源2: mrxwlb.com (备用)
if len(items) < 5:
    try:
        req = urllib.request.Request('https://mrxwlb.com/', headers={'User-Agent': UA})
        ctx2 = ssl.create_default_context()
        ctx2.check_hostname = False
        ctx2.verify_mode = ssl.CERT_NONE
        resp = urllib.request.urlopen(req, context=ctx2, timeout=10)
        html = resp.read().decode('utf-8', errors='replace')
        pattern = re.compile(r'<a\s+href=\"([^\"]+)\"[^>]*>([^<]{10,})</a>')
        for m in pattern.finditer(html):
            url = m.group(1)
            if not url.startswith('http'):
                url = 'https://mrxwlb.com' + url
            title = m.group(2).strip()
            if title not in seen and len(title) > 6 and '广告' not in title and '首页' not in title:
                seen.add(title)
                items.append({'title': title, 'url': url})
        print(f'  mrxwlb: 获取到 {len(items)} 条新闻 (累计)')
    except Exception as e:
        print(f'  mrxwlb失败: {e}')

with open('$DATA_DIR/news_items.json', 'w', encoding='utf-8') as f:
    json.dump(items[:20], f, ensure_ascii=False)
print(f'  ✅ 共获取 {len(items)} 条新闻联播')
" 2>&1

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