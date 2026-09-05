#!/usr/bin/env python3
"""下载 14 首站长收藏歌曲：Huibq(腾讯源) 优先 -> 网易云 兜底"""
import json, urllib.request, urllib.parse, time, os, sys

BASE = '/run/csi/mount-root/nas/4079184d856ecc166ed19d4887083405/workspaces/default/tools-website'
DATA = os.path.join(BASE, 'data')

def huibq(mid, source='tx', quality='128k'):
    url = f'https://lxmusicapi.onrender.com/url/{source}/{mid}/{quality}'
    req = urllib.request.Request(url, headers={
        'User-Agent': 'lx-music-desktop/v2.0.0', 'X-Request-Key': 'share-v3'})
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.loads(r.read().decode('utf-8'))

def download(url, path, referer='https://y.qq.com/'):
    req = urllib.request.Request(url, headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': referer})
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    if len(data) < 100_000:
        raise RuntimeError(f'too small: {len(data)} bytes')
    with open(path, 'wb') as f:
        f.write(data)
    return len(data)

def main():
    playlist = json.load(open(os.path.join(DATA, 'playlist_download.json')))
    os.makedirs(os.path.join(DATA, 'music'), exist_ok=True)
    ok, fail = [], []
    # 需要歌曲时长信息用于验证
    time_map = {
        '晴天': '04:29', '七里香': '04:59', '稻香': '03:43', '告白气球': '03:35',
        '夜曲': '03:46', '青花瓷': '03:59', '演员': '04:21', '第一次': '04:23',
        '童话': '04:04', '吻别': '05:02', '遥远的她': '04:17', '偷心': '04:21',
        '离开以后': '04:04', '等你等到我心痛': '04:17',
    }
    for item in playlist:
        name, nid = item['name'], item['netease_id']
        path = os.path.join(DATA, 'music', f'{nid}.mp3')
        try:
            r = huibq(item['qqmid'], 'tx', '128k')
            if r.get('code') == 0 and r.get('url'):
                size = download(r['url'], path)
                dur = time_map.get(name, '?')
                ok.append((name, nid, size, 'huibq-tx', dur))
                print(f"✅ {name}({nid}) tx源 {size/1048576:.1f}MB [{dur}]")
            else:
                raise RuntimeError(f"huibq: {r}")
        except Exception as e:
            print(f"⚠️ {name} huibq失败: {str(e)[:100]}")
            fail.append((name, nid, str(e)[:80]))
        time.sleep(0.8)
    print(f'\n=== 成功 {len(ok)} / 失败 {len(fail)} ===')
    for n, i, s, src, d in ok:
        print(f'  OK {n} id={i} {s/1048576:.1f}MB {src} {d}')
    for n, i, e in fail:
        print(f'  FAIL {n} id={i} {e}')

if __name__ == '__main__':
    main()