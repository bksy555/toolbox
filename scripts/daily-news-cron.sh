#!/bin/bash
# ============================================================
# 每日新闻数据生成与部署脚本
# 由 QwenPaw cron 每天6:00 AM 调用
# 1. 生成 data/daily-news.json
# 2. 推送到 GitHub（触发 Vercel 自动部署）
# ============================================================

set -e
WORKSPACE="/run/csi/mount-root/nas/4079184d856ecc166ed19d4887083405/workspaces/default"
TOOLS_WEBSITE="$WORKSPACE/tools-website"

echo "=== 每日新闻数据生成与部署 ==="
echo "时间: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo ""

# 1. 运行新闻数据生成脚本
echo "📝 生成新闻数据..."
bash "$TOOLS_WEBSITE/scripts/generate-daily-news.sh" 2>&1

echo ""
echo "📤 推送到 GitHub..."

# 2. 推送到 GitHub
cd "$TOOLS_WEBSITE"

# 检查是否有变更
git add data/daily-news.json
if git diff --cached --quiet; then
  echo "  ⚠️ 没有新数据变更"
else
  git commit -m "🤖 每日新闻自动更新 $(date -u '+%Y-%m-%d')"
  git push 2>&1 || echo "  ⚠️ 推送失败，可能无权限"
  echo "  ✅ 已推送到 GitHub"
fi

echo ""
echo "=== 完成 ==="