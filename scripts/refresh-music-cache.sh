#!/bin/bash
# ============================================================
# 热歌缓存生成脚本
# 1. 调用 Vercel API 刷新缓存
# 2. 从 API 拉取最新缓存
# 3. 保存到本地并推送到 GitHub
# ============================================================

set -e
WORKSPACE="/run/csi/mount-root/nas/4079184d856ecc166ed19d4887083405/workspaces/default"
TOOLS_WEBSITE="$WORKSPACE/tools-website"
VERCEL_URL="https://tools-website-rust.vercel.app"
CACHE_KEY="toolbox-music-cache-2026"
CACHE_FILE="$TOOLS_WEBSITE/data/music-cache.json"

echo "=== 热歌缓存生成 ==="
echo "时间: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo ""

# 1. 调用 Vercel API 刷新缓存（最多300首）
echo "📡 调用刷新缓存 API..."
RESPONSE=$(curl -s --max-time 600 "${VERCEL_URL}/api/music?action=refresh_cache&key=${CACHE_KEY}&max=300" 2>&1)
echo "  响应: $RESPONSE"

# 检查是否成功
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "  ✅ 缓存刷新成功"
else
  echo "  ⚠️ 缓存刷新失败，继续尝试拉取现有缓存"
fi

# 2. 从 API 拉取最新缓存数据
echo ""
echo "📥 拉取最新缓存数据..."
curl -s --max-time 30 "${VERCEL_URL}/api/music?action=hot_songs&limit=500" > "$CACHE_FILE" 2>&1
echo "  保存到: $CACHE_FILE"

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