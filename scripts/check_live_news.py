#!/usr/bin/env python3
import json, urllib.request

url = "https://tools-website-rust.vercel.app/data/daily-news.json?v=9999"
try:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    resp = urllib.request.urlopen(req, timeout=20)
    d = json.loads(resp.read().decode("utf-8"))
    print("线上 date:", d.get("date"))
    print("线上 updateTime:", d.get("updateTime"))
    for item in (d.get("items") or []):
        sub = item.get("data") or {}
        items = sub.get("items") or []
        print(f"  {item.get('label')}: {len(items)} 条")
        if items:
            print(f"  第一条URL: {items[0].get('url','')}")
except Exception as e:
    print("获取失败:", e)