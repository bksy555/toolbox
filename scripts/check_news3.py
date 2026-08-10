#!/usr/bin/env python3
import json

with open("data/daily-news.json") as f:
    data = json.load(f)

print("=== daily-news.json 结构 ===")
print("date:", data.get("date"))
print("updateTime:", data.get("updateTime"))
items = data.get("items", [])
print("items 数:", len(items))
for i, item in enumerate(items):
    print(f"\n--- item[{i}] ---")
    print("  type:", item.get("type"))
    print("  label:", item.get("label"))
    sub_data = item.get("data", {})
    sub_items = sub_data.get("items", [])
    print(f"  子条目数: {len(sub_items)}")
    for j, sub in enumerate(sub_items[:3]):
        print(f"    [{j}] title: {sub.get('title','')[:60]}")
        print(f"        date: {sub.get('date','')}")
    if len(sub_items) > 3:
        print(f"    ... 共 {len(sub_items)} 条")

# 检查 git log
import subprocess
result = subprocess.run(["git", "log", "--oneline", "-20"], capture_output=True, text=True, timeout=10)
print("\n=== Git 最近20条提交 ===")
print(result.stdout)