#!/usr/bin/env python3
import json

with open("data/daily-news.json") as f:
    data = json.load(f)
print("类型:", type(data).__name__)
if isinstance(data, list):
    print("条目数:", len(data))
    for d in data[:3]:
        print("  ", json.dumps(d, ensure_ascii=False)[:150])
elif isinstance(data, dict):
    print("keys:", list(data.keys()))
    for k, v in data.items():
        if isinstance(v, list):
            print(f"  {k}: {len(v)} 条")
            if v:
                print("  第1条:", json.dumps(v[0], ensure_ascii=False)[:200])
        elif isinstance(v, str):
            print(f"  {k}: {v[:100]}")

# 检查新闻联播
try:
    with open("data/xinwenlianbo.json") as f:
        xwlb = json.load(f)
    print("\n新闻联播:")
    print("类型:", type(xwlb).__name__)
    if isinstance(xwlb, list):
        print("条目数:", len(xwlb))
        for d in xwlb[:3]:
            print("  ", json.dumps(d, ensure_ascii=False)[:150])
    elif isinstance(xwlb, dict):
        print("keys:", list(xwlb.keys()))
except FileNotFoundError:
    print("新闻联播文件不存在")