#!/usr/bin/env python3
import json, subprocess, datetime

# 检查当前时间
now_utc = datetime.datetime.utcnow()
now_local = datetime.datetime.now()
print(f"UTC: {now_utc.isoformat()}")
print(f"本地: {now_local.isoformat()}")

# 检查 git 提交时间
result = subprocess.run(
    ["git", "log", "--oneline", "--format=%h %ai %s", "--grep=每日新闻", "-10"],
    capture_output=True, text=True, timeout=10
)
print("\n=== 新闻提交时间 ===")
print(result.stdout)

# 检查 daily-news.json
with open("data/daily-news.json") as f:
    d = json.load(f)
print("\n=== daily-news.json ===")
print(f"date: {d.get('date')}")
print(f"updateTime: {d.get('updateTime')}")
for item in d.get("items", []):
    sub = item.get("data", {})
    items = sub.get("items", [])
    print(f"  {item.get('label')}: {len(items)} 条")
    if items:
        print(f"  第一条: {items[0].get('title','')[:60]}")
        if items[0].get("url"):
            print(f"  URL: {items[0]['url']}")

# 检查 cron 运行记录
print("\n=== 检查 cron inbox ===")
result2 = subprocess.run(
    ["qwenpaw", "cron", "list", "--agent-id", "default"],
    capture_output=True, text=True, timeout=10
)
# 提取每日新闻的 cron 任务
import re
for line in result2.stdout.split("\n"):
    if "每日新闻" in line or "fc3d" in line or "热歌" in line or "群众" in line:
        print(line)