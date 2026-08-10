#!/bin/bash
echo "=== 每日新闻预热 ==="
echo "时间: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo ""
echo "1. 预热首页..."
C1=$(curl -sI -o /dev/null -w "%{http_code}" "https://tools-website-rust.vercel.app/")
echo "  首页 HTTP 状态码: $C1"
echo "2. 预热新闻数据..."
C2=$(curl -sI -o /dev/null -w "%{http_code}" "https://tools-website-rust.vercel.app/data/daily-news.json")
echo "  新闻数据 HTTP 状态码: $C2"
echo ""
if [ "$C1" = "200" ] && [ "$C2" = "200" ]; then
  echo "✅ 预热成功，两个资源均返回 HTTP 200"
else
  echo "⚠️ 部分资源预热异常，重试一次..."
  C1=$(curl -sI -o /dev/null -w "%{http_code}" "https://tools-website-rust.vercel.app/")
  C2=$(curl -sI -o /dev/null -w "%{http_code}" "https://tools-website-rust.vercel.app/data/daily-news.json")
  echo "  重试后 首页: $C1, 新闻数据: $C2"
fi
echo "=== 完成 ==="