#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""mockup-maker 实际操作截图"""
import asyncio
from playwright.async_api import async_playwright

URL = "file:///run/csi/mount-root/nas/4079184d856ecc166ed19d4887083405/workspaces/default/tools-website/index.html"
OUT = "/run/csi/mount-root/nas/4079184d856ecc166ed19d4887083405/workspaces/default/tools-website/guides/images/"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/usr/bin/chromium", args=["--no-sandbox"])
        page = await browser.new_page(viewport={"width": 900, "height": 1200})
        await page.goto(URL, wait_until="networkidle", timeout=60000)

        # 打开 mockup-maker
        await page.evaluate("() => showToolPage('mockup-maker')")
        await page.wait_for_timeout(500)
        # 滚动到工具卡片区域
        await page.evaluate("() => document.getElementById('page-mockup-maker').scrollIntoView({block:'start'})")
        await page.wait_for_timeout(300)

        # 截图1: 初始界面（上传前）
        el = await page.query_selector("#page-mockup-maker .tool-card")
        await el.screenshot(path=OUT + "mockup-step1-upload.png")
        print("✅ 截图1: 初始界面")

        # 上传截图
        await page.set_input_files("#mk-file", "/tmp/test-screenshot.png")
        await page.wait_for_timeout(300)
        # 选择 iPhone 设备
        await page.select_option("#mk-device", "iphone")
        await page.select_option("#mk-shadow", "soft")
        await page.wait_for_timeout(200)
        # 点击生成
        await page.click("button:has-text('生成样机')")
        await page.wait_for_timeout(800)

        # 截图2: 生成 iPhone 样机
        el2 = await page.query_selector("#page-mockup-maker .tool-card")
        await el2.screenshot(path=OUT + "mockup-step2-iphone.png")
        print("✅ 截图2: iPhone 样机已生成")

        # 换浏览器窗口设备 + 改背景色
        await page.select_option("#mk-device", "browser")
        await page.fill("#mk-bg", "#0ea5e9")
        await page.wait_for_timeout(200)
        await page.click("button:has-text('生成样机')")
        await page.wait_for_timeout(800)

        # 截图3: 浏览器窗口样机
        el3 = await page.query_selector("#page-mockup-maker .tool-card")
        await el3.screenshot(path=OUT + "mockup-step3-browser.png")
        print("✅ 截图3: 浏览器窗口样机")

        # 换笔记本 + 硬阴影
        await page.select_option("#mk-device", "laptop")
        await page.select_option("#mk-shadow", "hard")
        await page.fill("#mk-bg", "#10b981")
        await page.wait_for_timeout(200)
        await page.click("button:has-text('生成样机')")
        await page.wait_for_timeout(800)

        # 截图4: 笔记本样机
        el4 = await page.query_selector("#page-mockup-maker .tool-card")
        await el4.screenshot(path=OUT + "mockup-step4-laptop.png")
        print("✅ 截图4: 笔记本样机")

        await browser.close()

asyncio.run(main())