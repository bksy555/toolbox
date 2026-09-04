#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""下载网易云热歌榜到本地 data/music/ 作为真·本地缓存，永不失效。

用法: python3 scripts/download_music_cache.py [数量]
"""
import json, os, sys, time, urllib.request, urllib.parse

BASE = "/run/csi/mount-root/nas/4079184d856ecc166ed19d4887083405/workspaces/default/tools-website"
MUSIC_DIR = os.path.join(BASE, "data", "music")
CACHE_JSON = os.path.join(BASE, "data", "music-cache.json")
NETEASE_API = "https://netease-cloud-music-api-xi-pied.vercel.app"
API_BASE = "https://toolai.ccwu.cc/api/music"  # 线上后端（含 https 修复 + 本地优先逻辑）

os.makedirs(MUSIC_DIR, exist_ok=True)
LIMIT = int(sys.argv[1]) if len(sys.argv) > 1 else 40  # 默认下载 40 首

def http_json(url, timeout=25):
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://music.163.com/"
    })
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))

def main():
    # 1. 读取现有缓存（保留元数据）
    cache = {"songs": []}
    if os.path.exists(CACHE_JSON):
        try:
            with open(CACHE_JSON, encoding="utf-8") as f:
                cache = json.load(f)
        except Exception:
            pass
    old_by_id = {s["id"]: s for s in cache.get("songs", [])}

    # 2. 从网易云热歌榜取前 N 首
    print(f"🎵 从网易云热歌榜获取 {LIMIT} 首...")
    try:
        data = http_json(f"{NETEASE_API}/playlist/track/all?id=3778678&limit={LIMIT}")
        songs = data.get("songs") or []
    except Exception as e:
        print(f"❌ 获取热歌榜失败: {e}")
        sys.exit(1)

    if not songs:
        print("❌ 热歌榜为空")
        sys.exit(1)

    ok, fail = 0, 0
    new_songs = []
    for s in songs:
        sid = str(s["id"])
        name = s.get("name", "")
        artists = [a.get("name", "") for a in (s.get("ar") or [])]
        album = (s.get("al") or {}).get("name", "")
        albumPic = (s.get("al") or {}).get("picUrl", "")
        duration = s.get("dt") or 0
        local_path = f"/data/music/{sid}.mp3"
        local_file = os.path.join(MUSIC_DIR, f"{sid}.mp3")

        # 已存在本地文件 → 复用
        if os.path.exists(local_file) and os.path.getsize(local_file) > 100000:
            ok += 1
            print(f"  ⏭️ 已存在: {name} - {'/'.join(artists)}")
            new_songs.append({
                "id": sid, "name": name, "artists": artists, "album": album,
                "albumPic": albumPic, "duration": duration,
                "url": local_path, "br": 128000, "source": "netease",
                "local": True, "addedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            })
            continue

        # 下载
        try:
            # 通过线上后端拿 https 播放链接（后端已做 http→https 修复）
            d = http_json(f"{API_BASE}?action=url&id={sid}", timeout=25)
            url = d.get("url", "")
            if not url or d.get("source") == "none":
                fail += 1
                print(f"  ❌ 无播放链接: {name}")
                continue
            if url.startswith("/"):
                # 已经是本地文件（理论上不存在，因为文件不存在才会走到这）
                print(f"  ❌ 后端返回本地路径但文件不存在: {name}")
                fail += 1
                continue

            print(f"  ⬇️ 下载中: {name} - {'/'.join(artists)}")
            req = urllib.request.Request(url, headers={
                "User-Agent": "Mozilla/5.0",
                "Referer": "https://music.163.com/"
            })
            with urllib.request.urlopen(req, timeout=90) as r:
                content = r.read()
            if len(content) < 100000:
                fail += 1
                print(f"  ⚠️ 文件过小({len(content)}B)，跳过: {name}")
                continue
            with open(local_file, "wb") as f:
                f.write(content)
            ok += 1
            print(f"  ✅ 已保存: {local_file} ({len(content)}B)")
            new_songs.append({
                "id": sid, "name": name, "artists": artists, "album": album,
                "albumPic": albumPic, "duration": duration,
                "url": local_path, "br": 128000, "source": "netease",
                "local": True, "addedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            })
        except Exception as e:
            fail += 1
            print(f"  ❌ 下载失败: {name} ({e})")

        time.sleep(0.3)  # 温和限速

    # 3. 更新缓存 JSON（合并：本地歌曲标记 local，其余保留）
    local_ids = {s["id"] for s in new_songs}
    merged = list(new_songs)
    for old in cache.get("songs", []):
        if old.get("id") not in local_ids:
            # 非本地歌曲保留旧记录（无 url 也没关系，播放时会实时解析）
            merged.append(old)
    # 去重保序
    seen, final = set(), []
    for s in merged:
        if s["id"] not in seen:
            seen.add(s["id"])
            final.append(s)

    cache["songs"] = final
    cache["localCount"] = len(local_ids)
    cache["updatedAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    with open(CACHE_JSON, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

    total_bytes = sum(os.path.getsize(os.path.join(MUSIC_DIR, f)) for f in os.listdir(MUSIC_DIR) if f.endswith(".mp3"))
    print(f"\n✅ 完成: 成功 {ok} 首, 失败 {fail} 首")
    print(f"📦 本地缓存目录: {len([f for f in os.listdir(MUSIC_DIR) if f.endswith('.mp3')])} 个文件, 共 {total_bytes/1024/1024:.1f} MB")
    print(f"📝 缓存 JSON 已更新: {len(final)} 首 (本地 {len(local_ids)} 首)")

if __name__ == "__main__":
    main()
