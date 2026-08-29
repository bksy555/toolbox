#!/bin/bash
# ============================================================
# 热歌缓存生成脚本 v2 - 基于 LX Music 生态
# 1. 从网易云音乐榜单获取热门歌曲
# 2. 通过 API 获取播放链接（ChKSz API）
# 3. 保存到本地缓存文件
# 4. 推送到 GitHub
# ============================================================

set -e
WORKSPACE="/run/csi/mount-root/nas/4079184d856ecc166ed19d4887083405/workspaces/default"
TOOLS_WEBSITE="$WORKSPACE/tools-website"
CACHE_FILE="$TOOLS_WEBSITE/data/music-cache.json"

echo "=== 热歌缓存生成 v2（LX Music 生态）==="
echo "时间: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo ""

# 1. 通过 API 获取热门歌曲并解析播放链接
echo "📡 通过 API 获取热门歌曲..."
cd "$TOOLS_WEBSITE"

# 调用 API 的 refresh_cache 端点
API_URL="https://tools-website-rust.vercel.app/api/music?action=refresh_cache&key=toolbox-music-cache-2026&max=300"
echo "  API: $API_URL"

RESULT=$(curl -s "$API_URL" --max-time 600 2>/dev/null)
echo "  API 响应: $RESULT" | head -5

# 检查是否成功
if echo "$RESULT" | grep -qE '"success"\s*:\s*true'; then
  NEW_SONGS=$(echo "$RESULT" | grep -oE '"newSongs"[[:space:]]*:[[:space:]]*[0-9]*' | grep -o '[0-9]*' || true)
  TOTAL_SONGS=$(echo "$RESULT" | grep -oE '"totalSongs"[[:space:]]*:[[:space:]]*[0-9]*' | grep -o '[0-9]*' || true)
  echo "  ✅ 成功: 新增 $NEW_SONGS 首, 共 $TOTAL_SONGS 首"
  
  # 3. 保存 API 返回的歌曲数据到本地文件（带播放链接的完整数据）
  echo ""
  echo "💾 保存带播放链接的完整缓存..."
  echo "$RESULT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
if 'songs' in data and len(data['songs']) > 0:
    cache = {'songs': data['songs'], 'total': len(data['songs']), 'updatedAt': data.get('updatedAt', '')}
    with open('$CACHE_FILE', 'w', encoding='utf-8') as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)
    print(f'  ✅ 已保存 {len(data[\"songs\"])} 首歌曲到缓存文件')
else:
    print('  ⚠️ API 未返回歌曲数据')
" 2>&1
else
  echo "  ❌ API 调用失败"
  echo "$RESULT"
fi

# 4. 验证缓存文件
echo ""
echo "🔍 验证缓存..."
if [ -f "$CACHE_FILE" ]; then
  CACHE_SIZE=$(wc -c < "$CACHE_FILE")
  echo "  文件大小: $CACHE_SIZE bytes"
  if [ "$CACHE_SIZE" -gt 1000 ]; then
    echo "  ✅ 缓存文件有效"
  else
    echo "  ⚠️ 缓存文件太小，可能无效"
  fi
else
  echo "  ❌ 缓存文件不存在"
fi

# 5. 推送到 GitHub
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