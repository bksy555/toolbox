#!/usr/bin/env python3
import json, os, subprocess

# 检查新闻文件
news_file = "data/daily-news.json"
if os.path.exists(news_file):
    with open(news_file) as f:
        data = json.load(f)
    items = []
    if isinstance(data, list):
        items = data
    elif isinstance(data, dict):
        items = data.get('items', data.get('news', []))
    
    dates = sorted(set(d.get('date','') for d in items if d.get('date')))
    print(f"新闻条目数: {len(items)}")
    print(f"日期范围: {dates[0] if dates else '无'} ~ {dates[-1] if dates else '无'}")
    print(f"最新日期: {dates[-1] if dates else '无'}")
    print(f"所有日期: {dates}")
else:
    print(f"文件不存在: {news_file}")

# 检查新闻联播文件
xwlb_file = "data/xinwenlianbo.json"
if os.path.exists(xwlb_file):
    with open(xwlb_file) as f:
        data = json.load(f)
    items = []
    if isinstance(data, list):
        items = data
    elif isinstance(data, dict):
        items = data.get('items', data.get('news', []))
    dates = sorted(set(d.get('date','')[:10] for d in items if d.get('date')))
    print(f"\n新闻联播条目数: {len(items)}")
    print(f"新闻联播日期: {dates[-1] if dates else '无'}")

# 检查 cron 定时任务
print("\n=== 检查定时任务 ===")
result = subprocess.run(["qwenpaw", "cron", "list", "--agent-id", "default"], 
                       capture_output=True, text=True, timeout=10)
print(result.stdout[-2000:] if len(result.stdout) > 2000 else result.stdout)
if result.stderr:
    print("STDERR:", result.stderr[-500:])