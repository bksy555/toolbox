#!/bin/bash
# ============================================================
# 热歌缓存生成脚本
# 1. 直接从 QQ Music API 获取热门榜单数据（UTF-8）
# 2. 保存到本地缓存文件
# 3. 推送到 GitHub
# ============================================================

set -e
WORKSPACE="/run/csi/mount-root/nas/4079184d856ecc166ed19d4887083405/workspaces/default"
TOOLS_WEBSITE="$WORKSPACE/tools-website"
CACHE_FILE="$TOOLS_WEBSITE/data/music-cache.json"

echo "=== 热歌缓存生成 ==="
echo "时间: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo ""

# 1. 直接从 QQ Music API 获取热门歌曲
echo "📡 从 QQ Music 获取热门歌曲..."
cd "$TOOLS_WEBSITE"
python3 -c "
import json, urllib.request, re, time

top_lists = [
    ('QQ热歌榜', 4),
    ('QQ新歌榜', 27),
    ('QQ流行指数榜', 26),
    ('QQ网络歌曲榜', 36),
    ('QQ内地榜', 28),
    ('QQ港台榜', 29),
    ('QQKTV金曲榜', 52),
    ('QQ影视金曲榜', 65),
    ('QQACG榜', 78),
    ('QQ欧美榜', 106),
]

all_songs = []
seen = set()

for name, topid in top_lists:
    url = f'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?topid={topid}&type=top&song_begin=0&song_num=30'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        resp = urllib.request.urlopen(req, timeout=15)
        text = resp.read().decode('utf-8')
        start = text.index('{')
        text = text[start:]
        data = json.loads(text)
        songlist = data.get('songlist', [])
        for s in songlist:
            info = s.get('data', {})
            songmid = info.get('songmid', '')
            songname = info.get('songname', '')
            if not songmid or not songname:
                continue
            singer = info.get('singer', [])
            artists = [sg.get('name', '') for sg in singer]
            albumname = info.get('albumname', '')
            albummid = info.get('albummid', '')
            album_pic = f'https://y.gtimg.cn/music/photo_new/T002R300x300M000{albummid}.jpg' if albummid else ''
            duration = (info.get('interval', 0) or 0) * 1000
            
            key = f'{songname}|{\",\".join(artists)}'
            if key not in seen:
                seen.add(key)
                all_songs.append({
                    'id': songmid,
                    'name': songname,
                    'artists': artists,
                    'album': albumname,
                    'albumPic': album_pic,
                    'duration': duration,
                    'url': '',
                    'source': 'qq',
                    'br': 128000,
                    'cacheSource': 'qq',
                    'addedAt': ''
                })
        print(f'  ✅ {name}: 获取到 {len(songlist)} 首')
    except Exception as e:
        print(f'  ⚠️ {name}: 失败 - {e}')
    time.sleep(0.5)

cache = {'songs': all_songs, 'total': len(all_songs), 'updatedAt': '$(date -u '+%Y-%m-%dT%H:%M:%SZ')'}
with open('$CACHE_FILE', 'w', encoding='utf-8') as f:
    json.dump(cache, f, ensure_ascii=False, indent=2)
print(f'\n✅ 共获取 {len(all_songs)} 首歌曲（去重后）')
" 2>&1

# 3. 验证缓存文件
echo ""
echo "🔍 验证缓存..."
CACHE_SIZE=$(wc -c < "$CACHE_FILE")
echo "  文件大小: $CACHE_SIZE bytes"
if [ "$CACHE_SIZE" -gt 100 ]; then
  echo "  ✅ 缓存文件有效"
else
  echo "  ⚠️ 缓存文件太小，可能无效"
  cat "$CACHE_FILE"
fi

# 4. 推送到 GitHub
echo ""
echo "📤 推送到 GitHub..."
cd "$TOOLS_WEBSITE"

git add data/music-cache.json
if git diff --cached --quiet; then
  echo "  ⚠️ 缓存无变更"
else
  git commit -m "🤖 热歌缓存自动更新 $(date -u '+%Y-%m-%d')"
  git push 2>&1 || echo "  ⚠️ 推送失败，可能无权限"
  echo "  ✅ 已推送到 GitHub"
fi

echo ""
echo "=== 完成 ==="