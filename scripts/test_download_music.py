#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""测试下载一首网易云歌曲到本地，验证本地缓存可行性"""
import json, os, urllib.request, sys

BASE = "/run/csi/mount-root/nas/4079184d856ecc166ed19d4887083405/workspaces/default/tools-website"
TEST_DIR = "/tmp/music-test"
os.makedirs(TEST_DIR, exist_ok=True)

# 1. 通过线上 API 拿 https 播放链接
api_url = "https://toolai.ccwu.cc/api/music?action=url&id=347230"
try:
    with urllib.request.urlopen(urllib.request.Request(api_url, headers={"User-Agent": "Mozilla/5.0"}), timeout=25) as r:
        data = json.loads(r.read().decode())
    url = data.get("url", "")
    print("API返回 url 前60:", url[:60])
    if not url:
        print("❌ API 未返回 url:", data)
        sys.exit(1)
    url = url.replace("http://", "https://")
    print("https化后 前60:", url[:60])
except Exception as e:
    print("❌ 获取URL失败:", e)
    sys.exit(1)

# 2. 下载 mp3
try:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Referer": "https://music.163.com/"})
    with urllib.request.urlopen(req, timeout=90) as r:
        content = r.read()
    out = os.path.join(TEST_DIR, "347230.mp3")
    with open(out, "wb") as f:
        f.write(content)
    print("✅ 下载完成:", len(content), "bytes")
    print("文件头:", content[:4].hex(), "(ID3=49 44 33, MPEG=ff*)")
except Exception as e:
    print("❌ 下载失败:", e)
    sys.exit(1)
