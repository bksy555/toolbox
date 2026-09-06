#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
500彩票网 排列三（P3） 最新开奖号码抓取
用法: python3 pls-500-fetch.py
输出: 匹配则打印 "期号|号码|日期"，否则打印空
注意: 排列三期号与福彩3D一致（日历年天数-10），每天开奖。
"""
import re
import urllib.request


def fetch():
    req = urllib.request.Request(
        "https://kaijiang.500.com/pls.shtml",
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept-Language": "zh-CN,zh;q=0.9",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            raw = resp.read()
    except Exception:
        return None
    html = raw.decode("gbk", errors="ignore")

    # 期号: 排列3 第26238期（也可能是 第 26238 期）
    m_period = re.search(r"排列\s*3.*?第\s*(\d{5,7})\s*期", html)
    if not m_period:
        # 兜底: 找 "26238" 形式的7位期号（去掉年份前缀 20 后为 5 位）
        m2 = re.search(r"第\s*(20\d{5})\s*期", html)
        if not m2:
            m2 = re.search(r"第\s*(\d{5})\s*期", html)
        period = m2.group(1) if m2 else ""
        if period and not period.startswith("20"):
            period = "20" + period
    else:
        period = m_period.group(1)
        if not period.startswith("20"):
            period = "20" + period

    if not period:
        return None

    # 号码: 开奖号码：<li>3</li><li>6</li><li>1</li>，取前3个数字
    idx = html.find("开奖号码：")
    num = None
    if idx > 0:
        chunk = html[idx:idx + 400]
        plain_txt = re.sub(r"<[^>]+>", "", chunk)
        if "等待开奖" in plain_txt or "开奖直播" in plain_txt and len(re.findall(r"\d", plain_txt)) < 3:
            return None
        txt = re.sub(r"<[^>]+>", "|", chunk)
        nums = re.findall(r"\d", txt)
        if len(nums) >= 3:
            num = nums[0] + nums[1] + nums[2]

    # 日期: 开奖日期：2026年9月5日
    m_date = re.search(r"开奖日期：(\d{4})年(\d{1,2})月(\d{1,2})日", html)
    date = ""
    if m_date:
        date = "%s-%02d-%02d" % (m_date.group(1), int(m_date.group(2)), int(m_date.group(3)))

    if num:
        return {"period": period, "num": num, "date": date}
    return None


def fetch_backup():
    """备源: datachart.500.com 历史数据（最近30期），取最新一期"""
    req = urllib.request.Request(
        "https://datachart.500.com/pls/history/inc/history.php",
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://datachart.500.com/pls/history/history.shtml",
            "Accept-Language": "zh-CN,zh;q=0.9",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            raw = resp.read()
    except Exception:
        return None
    html = raw.decode("gbk", errors="ignore")
    row = re.search(r'<tr class="t_tr1">(.*?)</tr>', html, re.S)
    if not row:
        return None
    row_html = re.sub(r"<!--.*?-->", "", row.group(1), flags=re.S)
    cells = re.findall(r"<td[^>]*>(.*?)</td>", row_html, re.S)
    if len(cells) < 2:
        return None
    period5 = re.sub(r"<[^>]+>", "", cells[0]).strip()
    nums = re.findall(r"\d", cells[1])
    if not period5 or len(nums) < 3:
        return None
    date = ""
    if len(cells) >= 12:
        date = re.sub(r"<[^>]+>", "", cells[11]).strip()
    return {"period": "20" + period5, "num": nums[0] + nums[1] + nums[2], "date": date}


if __name__ == "__main__":
    res = fetch()
    if not res:
        res = fetch_backup()
    if res:
        print("%s|%s|%s" % (res["period"], res["num"], res["date"]))
    else:
        print("")