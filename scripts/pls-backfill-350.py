#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
排列三（P3）历史 350 期批量回填脚本
- 从 datachart.500.com/pls/history/inc/history.php?limit=350 抓取
- 每期计算时干天干3胆 dans（与 fc3d-prediction-cron.sh 的 Node 算法一致）
- 合并写入 data/p3-prediction.json
"""
import datetime
import json
import os
import re
import urllib.request

# ===== 与 fc3d-prediction-cron.sh 一致的时干天干算法 =====
GAN_TO_DAN = {
    '甲': [1, 4, 8], '乙': [3, 4, 8], '丙': [3, 4, 9],
    '丁': [2, 4, 9], '戊': [3, 4, 9], '己': [2, 4, 9],
    '庚': [2, 7, 9], '辛': [2, 6, 7], '壬': [1, 6, 7], '癸': [1, 6, 8],
}
TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
REF_GAN_OFFSET = 10  # 与 Node 版 cycleOffset 一致（经 2014-10-16=庚申日 验证）


def get_day_pillar(year, month, day):
    ref = datetime.date(1900, 1, 1)
    target = datetime.date(year, month, day)
    diff = (target - ref).days
    cycle_num = ((diff + REF_GAN_OFFSET) % 60 + 60) % 60
    return {"ganIdx": cycle_num % 10, "zhiIdx": cycle_num % 12}


def get_hour_pillar(day_gan_idx, hour_zhi_idx):
    gan_idx = ((day_gan_idx % 5) * 2 + hour_zhi_idx) % 10
    return {"ganIdx": gan_idx, "zhiIdx": hour_zhi_idx}


def get_hai_hour_gan(year, month, day):
    day_pillar = get_day_pillar(year, month, day)
    hour_pillar = get_hour_pillar(day_pillar["ganIdx"], 11)  # 亥时
    return TIAN_GAN[hour_pillar["ganIdx"]]


def dans_for_date(year, month, day):
    gan = get_hai_hour_gan(year, month, day)
    return GAN_TO_DAN.get(gan, [])


def period_to_date(period):
    year = int(str(period)[:4])
    seq = int(str(period)[4:])
    target = datetime.date(year, 1, 1) + datetime.timedelta(days=seq + 9)
    return target


def calc_result(dans, draw_num):
    if not draw_num:
        return None
    draw_arr = [int(c) for c in str(draw_num)]
    hits = sum(1 for d in dans if d in draw_arr)
    return "✅" if hits >= 1 else "❌"


def fetch_history(limit=350):
    url = f"https://datachart.500.com/pls/history/inc/history.php?limit={limit}"
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://datachart.500.com/pls/history/history.shtml",
        "Accept-Language": "zh-CN,zh;q=0.9",
    })
    with urllib.request.urlopen(req, timeout=30) as resp:
        html = resp.read().decode("gbk", errors="ignore")

    rows = []
    for m in re.finditer(r'<tr class="t_tr1">(.*?)</tr>', html, re.S):
        row_html = re.sub(r"<!--.*?-->", "", m.group(1), flags=re.S)
        cells = re.findall(r"<td[^>]*>(.*?)</td>", row_html, re.S)
        if len(cells) < 2:
            continue
        period5 = re.sub(r"<[^>]+>", "", cells[0]).strip()
        nums = re.findall(r"\d", cells[1])
        if not period5 or len(nums) < 3:
            continue
        date = ""
        if len(cells) >= 12:
            date = re.sub(r"<[^>]+>", "", cells[11]).strip()
        rows.append({
            "period": "20" + period5,
            "num": nums[0] + nums[1] + nums[2],
            "date": date,
        })
    return rows


def main():
    work_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
    p3_file = os.path.join(work_dir, "data", "p3-prediction.json")
    try:
        with open(p3_file, encoding="utf-8") as f:
            p3 = json.load(f)
    except Exception:
        p3 = {}
    print(f"现有排列三记录: {len(p3)} 期")

    rows = fetch_history(350)
    print(f"从500抓取到 {len(rows)} 期历史开奖 (limit=350)")

    successes = 0
    for r in rows:
        key = r["period"]
        entry = p3.get(key, {})
        existing = entry.get("drawNum")
        d = (
            datetime.date(*map(int, r["date"].split("-")))
            if r.get("date")
            else period_to_date(key)
        )
        entry["period"] = key
        entry["drawNum"] = r["num"]
        entry["updatedAt"] = datetime.datetime.utcnow().isoformat() + "Z"
        entry["year"] = d.year
        entry["month"] = d.month
        entry["day"] = d.day
        entry["weekday"] = d.isoweekday()
        # 时干天干3胆（与3D同日一致）
        entry["haiGan"] = get_hai_hour_gan(d.year, d.month, d.day)
        entry["dans"] = dans_for_date(d.year, d.month, d.day)
        entry["result"] = calc_result(entry["dans"], r["num"])
        p3[key] = entry
        if not existing:
            successes += 1

    with open(p3_file, "w", encoding="utf-8") as f:
        json.dump(p3, f, ensure_ascii=False, indent=2)
    print(f"完成: 新增 {successes} 期，总计 {len(p3)} 期记录")


if __name__ == "__main__":
    main()