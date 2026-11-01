#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
百度移动版搜索排列三（P3）开奖号码（官方体彩卡片）
用法: python3 pls-baidu-fetch.py <期号>  例如 2026287
输出: 匹配则打印 "期号|号码|日期"，否则打印空
注意: 排列三期号与福彩3D一致（日历年天数-10），每天开奖。
"""
import sys
import re
from playwright.sync_api import sync_playwright


def fetch(period):
    url = f"https://m.baidu.com/s?word=%E6%8E%92%E5%88%97%E4%B8%89%20{period}%E6%9C%9F%20%E5%BC%80%E5%A5%96%E7%BB%93%E6%9E%9C"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path="/usr/bin/chromium", args=['--no-sandbox', '--disable-dev-shm-usage'])
        ctx = browser.new_context(
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
            locale="zh-CN",
            viewport={"width": 390, "height": 844},
        )
        page = ctx.new_page()
        page.goto(url, timeout=30000, wait_until="domcontentloaded")
        page.wait_for_timeout(3000)
        text = page.inner_text("body")
        browser.close()

    # 官方体彩卡片: 第XXXXXXXX期 YYYY-MM-DD(周X) 数字 数字 数字
    m = re.search(r'第\s*' + period + r'\s*期[^\d]*(\d{4}-\d{2}-\d{2})[^\d]*([0-9])\s*([0-9])\s*([0-9])', text)
    if m:
        num = m.group(2) + m.group(3) + m.group(4)
        return {"period": period, "num": num, "date": m.group(1)}
    # 宽松匹配: 直接找三个空格分隔数字前有日期
    m2 = re.search(r'(\d{4}-\d{2}-\d{2})[^\d]*\s*([0-9])\s+([0-9])\s+([0-9])', text)
    if m2:
        return {"period": period, "num": m2.group(2) + m2.group(3) + m2.group(4), "date": m2.group(1)}
    return None


if __name__ == "__main__":
    period = sys.argv[1] if len(sys.argv) > 1 else "2026287"
    res = fetch(period)
    if res:
        print(f"{res['period']}|{res['num']}|{res['date']}")
    else:
        print("")