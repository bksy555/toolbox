#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
排列三（P3）历史开奖批量回填脚本
从 datachart.500.com/pls/history/inc/history.php 抓取最近30期开奖（5位期号），
合并写入 data/p3-prediction.json
用法: python3 pls-backfill.py [期数]，默认30期
"""
import datetime
import json
import os
import re
import sys
import urllib.request

URL = "https://datachart.500.com/pls/history/inc/history.php"


def fetch_history():
    req = urllib.request.Request(URL, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://datachart.500.com/pls/history/history.shtml",
        "Accept-Language": "zh-CN,zh;q=0.9",
    })
    with urllib.request.urlopen(req, timeout=20) as resp:
        raw = resp.read()
    html = raw.decode("gbk", errors="ignore")

    rows = []
    # 每行: <tr class="t_tr1">...<td class="t_tr1">26238</td><td class="cfont2">3 6 1</td>...<td class="t_tr1">2026-09-05</td></tr>
    for m in re.finditer(r'<tr class="t_tr1">(.*?)</tr>', html, re.S):
        row_html = m.group(1)
        # 剥离 HTML 注释，避免 <!--<td>2</td>--> 干扰
        row_html = re.sub(r'<!--.*?-->', '', row_html, flags=re.S)
        cells = re.findall(r'<td[^>]*>(.*?)</td>', row_html, re.S)
        if len(cells) < 2:
            continue
        period5 = re.sub(r'<[^>]+>', '', cells[0]).strip()
        nums = re.findall(r'\d', cells[1])
        if not period5 or len(nums) < 3:
            continue
        date = ""
        if len(cells) >= 12:
            date = re.sub(r'<[^>]+>', '', cells[11]).strip()
        rows.append({
            "period": "20" + period5,
            "num": nums[0] + nums[1] + nums[2],
            "date": date,
        })
    return rows


def calc_result(dans, draw_num):
    if not draw_num:
        return None
    draw_arr = [int(c) for c in str(draw_num)]
    hits = sum(1 for d in dans if d in draw_arr)
    return "✅" if hits >= 1 else "❌"


def main():
    work_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
    p3_file = os.path.join(work_dir, "data", "p3-prediction.json")
    try:
        with open(p3_file, encoding="utf-8") as f:
            p3 = json.load(f)
    except Exception:
        p3 = {}
    print(f"现有排列三记录: {len(p3)} 期")

    rows = fetch_history()
    print(f"从500抓取到 {len(rows)} 期历史开奖")

    successes = 0
    for r in rows:
        key = r["period"]
        entry = p3.get(key, {})
        existing = entry.get("drawNum")
        entry["period"] = key
        entry["drawNum"] = r["num"]
        entry["updatedAt"] = datetime.datetime.utcnow().isoformat() + "Z"
        if r["date"]:
            y, m, d = r["date"].split("-")
            entry["year"] = int(y)
            entry["month"] = int(m)
            entry["day"] = int(d)
            dt = datetime.date(int(y), int(m), int(d))
            entry["weekday"] = dt.isoweekday()  # 1=周一..7=周日
        if entry.get("dans"):
            entry["result"] = calc_result(entry["dans"], r["num"])
        p3[key] = entry
        flag = "更新" if existing else "新增"
        print(f"  {flag} {key} = {r['num']} ({r.get('date','')})")
        successes += 1

    with open(p3_file, "w", encoding="utf-8") as f:
        json.dump(p3, f, ensure_ascii=False, indent=2)
    print(f"完成: 写入 {successes} 期，总计 {len(p3)} 期记录")


if __name__ == "__main__":
    main()