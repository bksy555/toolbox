#!/bin/bash
# ============================================================
# 群众心声 - 每日更新脚本
# 每天凌晨0点自动执行（由 cron 触发）
# 1. 读取 suggestions.json 计算排名
# 2. 更新 rankings.json
# 3. 自动创建前3名工具
# ============================================================

WORKSPACE="/run/csi/mount-root/nas/4079184d856ecc166ed19d4887083405/workspaces/default"

echo "=== 群众心声每日更新 ==="
echo "时间: $(date)"

# 从 GitHub 读取最新数据（使用 GIT_ASKPASS 认证）
TOKEN_FILE="/tmp/git-askpass.sh"
if [ -f "$TOKEN_FILE" ]; then
  TOKEN=$(cat "$TOKEN_FILE" | head -1)
else
  echo "⚠️ 未找到认证文件，尝试无认证读取"
  TOKEN=""
fi

# 1. 读取 GitHub 上最新的 suggestions.json
echo "--- 读取建议数据 ---"
if [ -n "$TOKEN" ]; then
  SUGGESTIONS=$(curl -s -H "Authorization: Bearer $TOKEN" \
    https://api.github.com/repos/bksy555/toolbox/contents/data/suggestions.json 2>/dev/null)
else
  SUGGESTIONS=$(curl -s \
    https://api.github.com/repos/bksy555/toolbox/contents/data/suggestions.json 2>/dev/null)
fi

if [ -z "$SUGGESTIONS" ] || echo "$SUGGESTIONS" | grep -q "Not Found"; then
  echo "❌ 无法读取 suggestions.json，使用本地文件"
  # 使用本地文件
  if [ -f "$WORKSPACE/tools-website/data/suggestions.json" ]; then
    CONTENT=$(cat "$WORKSPACE/tools-website/data/suggestions.json")
  else
    echo "❌ 本地也没有数据，退出"
    exit 1
  fi
else
  # 从 GitHub API 响应中提取内容
  CONTENT=$(echo "$SUGGESTIONS" | python3 -c "
import sys, json, base64
d = json.load(sys.stdin)
if 'content' in d:
    print(base64.b64decode(d['content']).decode('utf-8'))
else:
    print('ERROR')
" 2>/dev/null)
  
  if [ "$CONTENT" = "ERROR" ] || [ -z "$CONTENT" ]; then
    echo "⚠️ 解析失败，使用本地文件"
    CONTENT=$(cat "$WORKSPACE/tools-website/data/suggestions.json")
  fi
fi

# 2. 计算排名
echo "--- 计算排名 ---"
RANKING=$(echo "$CONTENT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
suggestions = sorted(data['suggestions'], key=lambda x: x['votes'], reverse=True)
top10 = []
for i, s in enumerate(suggestions[:10]):
    top10.append({
        'rank': i + 1,
        'name': s['name'],
        'votes': s['votes'],
        'desc': s['desc']
    })
print(json.dumps({
    'ranking': top10,
    'last_updated': data.get('last_updated', ''),
    'note': '由定时任务每天凌晨0点自动更新'
}, ensure_ascii=False, indent=2))
")

echo "$RANKING" > "$WORKSPACE/tools-website/data/rankings.json"
echo "✅ rankings.json 已更新"

# 3. 获取前3名工具
TOP3=$(echo "$RANKING" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for s in data['ranking'][:3]:
    print(f\"{s['rank']}|{s['name']}|{s['desc']}|{s['votes']}\")
")

echo "--- 前3名工具 ---"
echo "$TOP3"

# 4. 检查是否需要创建新工具
echo "--- 检查现有工具 ---"
while IFS='|' read -r rank name desc votes; do
  # 检查工具名称是否已出现在 tools.js 中
  if grep -qi "$name" "$WORKSPACE/tools-website/js/tools.js" 2>/dev/null; then
    echo "  ✅ 已存在: $name - 跳过"
  else
    echo "  🆕 需要创建: $name ($votes票)"
    echo "  （自动生成功能开发中，需要手动实现）"
  fi
done <<< "$TOP3"

# 5. 提交到 GitHub
echo "--- 提交到 GitHub ---"
cd "$WORKSPACE/tools-website"
git add -A
git commit -m "🤖 群众心声每日更新 $(date +%Y-%m-%d)" 2>/dev/null

if [ $? -eq 0 ]; then
  # 使用 GIT_ASKPASS 推送
  if [ -f "$TOKEN_FILE" ]; then
    GIT_ASKPASS="$TOKEN_FILE" git push -f origin main 2>&1
    echo "✅ 已推送到 GitHub"
  else
    echo "⚠️ 无认证文件，跳过推送"
  fi
else
  echo "ℹ️ 没有新的变更需要提交"
fi

echo "=== 更新完成 ==="