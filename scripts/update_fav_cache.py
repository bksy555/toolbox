#!/usr/bin/env python3
"""更新 music-cache.json：取消旧12首 local 标记，加入新14首站长收藏并标记 local"""
import json, os, time

BASE = '/run/csi/mount-root/nas/4079184d856ecc166ed19d4887083405/workspaces/default/tools-website'
CACHE = os.path.join(BASE, 'data/music-cache.json')

# 旧12首 id（取消 local）
OLD_LOCAL_IDS = {'1303464858','1391891631','1456890009','1827600686','1842728629',
                 '1851652156','1918576268','1973665667','2018733994','2163210456',
                 '3333988321','3404238777'}

# 新14首（站长收藏）：netease_id, name, artists, album
NEW_FAV = [
    {'id': '186016', 'name': '晴天', 'artists': ['周杰伦'], 'album': '叶惠美', 'duration': 269000},
    {'id': '186001', 'name': '七里香', 'artists': ['周杰伦'], 'album': '七里香', 'duration': 299000},
    {'id': '185709', 'name': '稻香', 'artists': ['周杰伦'], 'album': '魔杰座', 'duration': 223000},
    {'id': '418603077', 'name': '告白气球', 'artists': ['周杰伦'], 'album': '周杰伦的床边故事', 'duration': 215000},
    {'id': '185904', 'name': '夜曲', 'artists': ['周杰伦'], 'album': '十一月的萧邦', 'duration': 226000},
    {'id': '185811', 'name': '青花瓷', 'artists': ['周杰伦'], 'album': '我很忙', 'duration': 239000},
    {'id': '32507038', 'name': '演员', 'artists': ['薛之谦'], 'album': '绅士', 'duration': 261000},
    {'id': '85621', 'name': '第一次', 'artists': ['光良'], 'album': '第一次个人创作专辑', 'duration': 263000},
    {'id': '85580', 'name': '童话', 'artists': ['光良'], 'album': '童话', 'duration': 244000},
    {'id': '190449', 'name': '吻别', 'artists': ['张学友'], 'album': '吻别', 'duration': 302000},
    {'id': '191232', 'name': '遥远的她', 'artists': ['张学友'], 'album': '遥远的她AMOUR', 'duration': 257000},
    {'id': '190233', 'name': '偷心', 'artists': ['张学友'], 'album': '偷心', 'duration': 261000},
    {'id': '189841', 'name': '离开以后', 'artists': ['张学友'], 'album': '拥友', 'duration': 244000},
    {'id': '190360', 'name': '等你等到我心痛', 'artists': ['张学友'], 'album': '等你等到我心痛 精选集', 'duration': 257000},
]

d = json.load(open(CACHE, encoding='utf-8'))
songs = d['songs']
by_id = {s['id']: s for s in songs}

# 1) 取消旧12首 local
removed_local = 0
for sid in OLD_LOCAL_IDS:
    if sid in by_id and by_id[sid].get('local'):
        by_id[sid]['local'] = False
        removed_local += 1

# 2) 加入新14首并标记 local（已存在则更新标记，不存在则插入）
added = 0
for nf in NEW_FAV:
    sid = nf['id']
    if sid in by_id:
        by_id[sid]['local'] = True
        by_id[sid]['url'] = f'/data/music/{sid}.mp3'
        by_id[sid]['br'] = 128000
    else:
        songs.append({
            'id': sid, 'name': nf['name'], 'artists': nf['artists'],
            'album': nf['album'], 'albumPic': '',
            'duration': nf['duration'], 'url': f'/data/music/{sid}.mp3',
            'source': 'netease', 'br': 128000, 'local': True,
            'addedAt': time.strftime('%Y-%m-%dT%H:%M:%S.000Z', time.gmtime()),
        })
        added += 1

d['total'] = len(songs)
d['localCount'] = sum(1 for s in songs if s.get('local'))
d['updatedAt'] = time.strftime('%Y-%m-%dT%H:%M:%S.000Z', time.gmtime())

json.dump(d, open(CACHE, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f'✅ 取消旧local {removed_local} 首, 新增 {added} 首')
print(f'✅ 缓存总数 {d["total"]}, localCount={d["localCount"]}')
print('当前 local 歌曲:')
for s in songs:
    if s.get('local'):
        print(f'  💿 {s["name"]} id={s["id"]}')