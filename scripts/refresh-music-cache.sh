#!/bin/bash
# ============================================================
# 热歌缓存生成脚本
# 调用 Vercel API 刷新热歌缓存，然后推送到 GitHub
# 由 QwenPaw cron 每天调度
# ============================================================

set -e
WORKSPACE="/run/csi/mount-root/nas/4079184d856ecc166ed19d4887083405/workspaces/default"
TOOLS_WEBSITE="$WORKSPACE/tools-website"
VERCEL_URL="https://tools-website-rust.vercel.app"
CACHE_KEY="toolbox-music-cache-2026"

echo "=== 热歌缓存生成 ==="
echo "时间: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo ""

# 1. 调用 Vercel API 刷新缓存
echo "📡 调用刷新缓存 API..."
RESPONSE=$(curl -s --max-time 600 "${VERCEL_URL}/api/music?action=refresh_cache&key=${CACHE_KEY}&max=300" 2>&1)
echo "  响应: $RESPONSE"

# 检查是否成功
if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "  ✅ 缓存刷新成功"
else
  echo "  ⚠️ 缓存刷新可能失败，检查本地缓存文件"
fi

echo ""
echo "📤 推送到 GitHub..."
cd "$TOOLS_WEBSITE"

# 2. 检查缓存文件是否有变更
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