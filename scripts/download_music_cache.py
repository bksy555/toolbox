#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""下载网易云热歌榜到本地 data/music/ 作为真·本地缓存，永不失效。

策略：
- 只保留完整版（≥2MB 或时长 ≥120s），跳过 60 秒试听片段
- 失败自动重试（限流 429/500 时等待）
- 拉取多榜单更多歌曲以提高完整版命中数

用法: python3 scripts/download_music_cache.py [数量] [重试次数]
"""
import json, os, sys, time, urllib.request, urllib.parse

BASE = "/run/csi/mount-root/nas/4079184d856ecc166ed19d4887083405/workspaces/default/tools-website"
MUSIC_DIR = os.path.join(BASE, "data", "music")
CACHE_JSON = os.path.join(BASE, "data", "music-cache.json")
NETEASE_API = "https://netease-cloud-music-api-xi-pied.vercel.app"
API_BASE = "https://toolai.ccwu.cc/api/music"  # 线上后端（含 https 修复 + 本地优先逻辑）

os.makedirs(MUSIC_DIR, exist_ok=True)
LIMIT = int(sys.argv[1]) if len(sys.argv) > 1 else 80   # 拉取数量（默认 80）
RETRY = int(sys.argv[2]) if len(sys.argv) > 2 else 3    # 单曲重试次数
MIN_BYTES = 2000000   # 2MB 以下视为试听片段

def http_json(url, timeout=25):
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://music.163.com/"
    })
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))

def fetch_with_retry(url_fn, retries=RETRY, timeout=25):
    """带重试的请求（限流时等待 2-5s）。url_fn 需接受 timeout 关键字参数。"""
    last_err = None
    for i in range(retries):
        try:
            return url_fn(timeout=timeout)
        except urllib.error.HTTPError as e:
            last_err = e
            if e.code in (429, 500, 502, 503):
                time.sleep(2 + i * 2)
                continue
            raise
        except Exception as e:
            last_err = e
            time.sleep(1)
    raise last_err

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

    # 2. 从多个网易云榜单拉歌（热歌榜 + 新歌榜 + 飙升榜）
    print(f"🎵 从网易云榜单获取歌曲（目标 {LIMIT} 首）...")
    top_lists = [
        {"name": "热歌榜", "id": 3778678, "limit": LIMIT},
        {"name": "新歌榜", "id": 3779629, "limit": 40},
        {"name": "飙升榜", "id": 19723756, "limit": 40},
    ]
    all_songs = []
    seen = set()
    for tl in top_lists:
        try:
            data = fetch_with_retry(lambda timeout=25, t=tl: http_json(
                f"{NETEASE_API}/playlist/track/all?id={t['id']}&limit={t['limit']}", timeout=timeout))
            songs = data.get("songs") or []
            for s in songs:
                sid = str(s["id"])
                if sid in seen:
                    continue
                seen.add(sid)
                all_songs.append(s)
            print(f"  📋 {tl['name']}: 累计 {len(all_songs)} 首")
        except Exception as e:
            print(f"  ❌ {tl['name']} 获取失败: {e}")

    if not all_songs:
        print("❌ 所有榜单均为空")
        sys.exit(1)

    ok, fail, skip_preview = 0, 0, 0
    new_songs = []
    for s in all_songs:
        sid = str(s["id"])
        name = s.get("name", "")
        artists = [a.get("name", "") for a in (s.get("ar") or [])]
        album = (s.get("al") or {}).get("name", "")
        albumPic = (s.get("al") or {}).get("picUrl", "")
        duration = s.get("dt") or 0
        local_path = f"/data/music/{sid}.mp3"
        local_file = os.path.join(MUSIC_DIR, f"{sid}.mp3")

        # 已存在本地文件（完整版）→ 复用
        if os.path.exists(local_file) and os.path.getsize(local_file) >= MIN_BYTES:
            ok += 1
            print(f"  ⏭️ 已存在: {name} - {'/'.join(artists)}")
            new_songs.append({
                "id": sid, "name": name, "artists": artists, "album": album,
                "albumPic": albumPic, "duration": duration,
                "url": local_path, "br": 128000, "source": "netease",
                "local": True, "addedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            })
            continue

        # 下载（带重试）
        try:
            d = fetch_with_retry(lambda timeout=25, i=sid: http_json(f"{API_BASE}?action=url&id={i}", timeout=timeout))
            url = d.get("url", "")
            if not url or d.get("source") == "none":
                fail += 1
                if fail <= 5 or fail % 10 == 0:
                    print(f"  ❌ 无播放链接: {name}")
                continue
            if url.startswith("/"):
                fail += 1
                continue

            req = urllib.request.Request(url, headers={
                "User-Agent": "Mozilla/5.0",
                "Referer": "https://music.163.com/"
            })
            with urllib.request.urlopen(req, timeout=120) as r:
                content = r.read()
            if len(content) < MIN_BYTES:
                skip_preview += 1
                if skip_preview <= 10:
                    print(f"  ⚠️ 试听片段({len(content)}B)，跳过: {name}")
                continue
            with open(local_file, "wb") as f:
                f.write(content)
            ok += 1
            print(f"  ✅ 已保存: {name} ({len(content)/1024/1024:.1f}MB)")
            new_songs.append({
                "id": sid, "name": name, "artists": artists, "album": album,
                "albumPic": albumPic, "duration": duration,
                "url": local_path, "br": 128000, "source": "netease",
                "local": True, "addedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            })
        except Exception as e:
            fail += 1
            if fail <= 5 or fail % 10 == 0:
                print(f"  ❌ 下载失败: {name} ({e})")

        time.sleep(0.3)

    # 3. 更新缓存 JSON（合并：本地歌曲标记 local，其余保留）
    local_ids = {s["id"] for s in new_songs}
    merged = list(new_songs)
    for old in cache.get("songs", []):
        if old.get("id") not in local_ids:
            merged.append(old)
    seen_ids, final = set(), []
    for s in merged:
        if s["id"] not in seen_ids:
            seen_ids.add(s["id"])
            final.append(s)

    cache["songs"] = final
    cache["localCount"] = len(local_ids)
    cache["updatedAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    with open(CACHE_JSON, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

    total_bytes = sum(os.path.getsize(os.path.join(MUSIC_DIR, f)) for f in os.listdir(MUSIC_DIR) if f.endswith(".mp3"))
    print(f"\n✅ 完成: 完整版 {ok} 首, 试听跳过 {skip_preview} 首, 失败 {fail} 首")
    print(f"📦 本地缓存: {len([f for f in os.listdir(MUSIC_DIR) if f.endswith('.mp3')])} 个文件, 共 {total_bytes/1024/1024:.1f} MB")
    print(f"📝 缓存 JSON: {len(final)} 首 (本地 {len(local_ids)} 首)")

if __name__ == "__main__":
    main()

