#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
本地合并热歌缓存：新歌来自 API（可能无URL），旧缓存保留已有URL
用法: python3 scripts/merge_music_cache.py [api_response.json]
如果省略参数，则直接修正现有缓存文件的 URL 合并逻辑（基于上次 backup）
"""
import json, sys, os, shutil

CACHE_FILE = 'data/music-cache.json'

# 读取当前缓存
with open(CACHE_FILE, 'r', encoding='utf-8') as f:
    current = json.load(f)

# 读取旧备份（上一次有 URL 的完整缓存）
BACKUP = 'data/music-cache.backup.json'
old = {'songs': []}
if os.path.exists(BACKUP):
    try:
        with open(BACKUP, 'r', encoding='utf-8') as f:
            old = json.load(f)
    except Exception:
        old = {'songs': []}

def key(s):
    return f'{s.get("name","")}|{",".join(s.get("artists") or [])}'

old_map = {}
for s in old.get('songs', []):
    old_map[key(s)] = s

# 合并：current 优先，但缺 url 的从 old_map 补
seen = set()
merged = []
for s in current.get('songs', []):
    k = key(s)
    if k in seen:
        continue
    seen.add(k)
    ns = dict(s)
    if not ns.get('url') and k in old_map and old_map[k].get('url'):
        ns['url'] = old_map[k]['url']
        ns['br'] = old_map[k].get('br', ns.get('br'))
    merged.append(ns)

current['songs'] = merged
current['total'] = len(merged)

with_url = sum(1 for s in merged if s.get('url'))
print(f'合并完成: {len(merged)} 首, 其中带URL: {with_url} 首')

# 写回
with open(CACHE_FILE, 'w', encoding='utf-8') as f:
    json.dump(current, f, ensure_ascii=False, indent=2)
print('已保存')