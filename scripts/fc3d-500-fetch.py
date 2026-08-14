#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
500彩票网 福彩3D 最新开奖号码抓取（curl 即可，无验证码）
用法: python3 fc3d-500-fetch.py
输出: 匹配则打印 "期号|号码|日期"，否则打印空
"""
import re
import sys
import urllib.request

def fetch():
    req = urllib.request.Request(
        "https://zx.500.com/sd/",
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "zh-CN,zh;q=0.9",
        },
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        raw = resp.read()
    html = raw.decode("gbk", errors="ignore")

    # 期号: <option ... >2026215</option> 且 selected="selected"
    m_period = re.search(r'([0-9]{7})"\s+selected="selected"', html)
    if not m_period:
        m_period = re.search(r'(20\d{5})', html)
    if not m_period:
        return None
    period = m_period.group(1)

    # 号码: 开奖号码： <li>1</li><li>7</li><li>2</li> 或分隔数字
    idx = html.find("开奖号码：")
    num = None
    if idx > 0:
        chunk = html[idx:idx + 400]
        # 提取数字（去标签）
        txt = re.sub(r'<[^>]+>', '|', chunk)
        nums = re.findall(r'[0-9]', txt)
        # 找连续三个数字（1|7|2 -> '1','7','2'，试机号前的）
        if len(nums) >= 3:
            num = nums[0] + nums[1] + nums[2]

    # 日期
    m_date = re.search(r'开奖时间：(\d{4}-\d{2}-\d{2})', html)
    date = m_date.group(1) if m_date else ""

    if num:
        return {"period": period, "num": num, "date": date}
    return None

if __name__ == "__main__":
    res = fetch()
    if res:
        print(f"{res['period']}|{res['num']}|{res['date']}")
    else:
        print("")