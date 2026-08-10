#!/usr/bin/env python3
import json, sys

# 读取API响应
with open(sys.argv[1], 'r', encoding='utf-8') as f:
    data = json.load(f)

print("API success:", data.get('success'))
songs = data.get('songs', [])
print("歌曲数:", len(songs))

cache_file = sys.argv[2]
if 'songs' in data and len(songs) > 0:
    cache = {'songs': songs, 'total': len(songs), 'updatedAt': data.get('updatedAt', '')}
    with open(cache_file, 'w', encoding='utf-8') as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)
    print(f"已保存 {len(songs)} 首歌曲到缓存文件")
else:
    print("未获取到歌曲数据")