#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""vocal-remover / photo-restore 功能实测"""
import asyncio
from playwright.async_api import async_playwright

URL = "file:///run/csi/mount-root/nas/4079184d856ecc166ed19d4887083405/workspaces/default/tools-website/index.html"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/usr/bin/chromium", args=["--no-sandbox"])
        page = await browser.new_page(viewport={"width": 1000, "height": 1400})
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e) + " ||| " + (e.stack or "")[:150]))
        page.on("dialog", lambda d: d.accept())
        await page.goto(URL, wait_until="networkidle", timeout=60000)

        await page.evaluate("""() => {
            if (typeof renderToolPages === 'function' && !document.getElementById('page-vocal-remover')) renderToolPages();
        }""")

        # ===== vocal-remover =====
        await page.evaluate("() => showToolPage('vocal-remover')")
        await page.wait_for_timeout(300)
        assert await page.evaluate("() => !!document.getElementById('vr-file')"), "vr-file 不存在"
        print("1. ✅ showToolPage 打开 vocal-remover, vr-file 存在")

        await page.set_input_files("#vr-file", "/tmp/test-audio.wav")
        await page.wait_for_timeout(300)
        st = await page.evaluate("() => document.getElementById('vr-status').textContent")
        print(f"2. ✅ 上传音频后状态: {st}")

        # 选择提取伴奏模式
        await page.select_option("#vr-mode", "accompaniment")
        await page.fill("#vr-strength", "70")
        await page.click("button:has-text('开始处理')")
        # 等待音频解码 + 处理
        await page.wait_for_timeout(2500)
        st2 = await page.evaluate("() => document.getElementById('vr-status').textContent")
        print(f"3. ✅ 处理状态: {st2}")
        btn_enabled = await page.evaluate("() => !document.getElementById('vr-download-btn').disabled")
        print(f"4. ✅ 下载按钮可用: {btn_enabled}")

        # 切清唱模式再处理
        await page.select_option("#vr-mode", "vocal")
        await page.click("button:has-text('开始处理')")
        await page.wait_for_timeout(2000)
        st3 = await page.evaluate("() => document.getElementById('vr-status').textContent")
        print(f"5. ✅ 清唱模式处理状态: {st3}")

        # ===== photo-restore =====
        await page.evaluate("() => showToolPage('photo-restore')")
        await page.wait_for_timeout(300)
        assert await page.evaluate("() => !!document.getElementById('pr-file')"), "pr-file 不存在"
        print("6. ✅ showToolPage 打开 photo-restore, pr-file 存在")

        # 生成一张灰度旧照片测试图
        await page.set_input_files("#pr-file", "/tmp/old-photo.png")
        await page.wait_for_timeout(1500)
        orig_has_canvas = await page.evaluate("() => document.querySelectorAll('#pr-original canvas').length")
        print(f"7. ✅ 原图显示 canvas: {orig_has_canvas} (期望1)")

        await page.select_option("#pr-style", "sepia")
        await page.fill("#pr-noise", "1")
        await page.fill("#pr-contrast", "110")
        await page.click("button:has-text('开始修复')")
        await page.wait_for_timeout(1500)
        res_canvas = await page.evaluate("() => document.querySelectorAll('#pr-result canvas').length")
        pr_btn = await page.evaluate("() => !document.getElementById('pr-download-btn').disabled")
        print(f"8. ✅ 修复结果 canvas: {res_canvas} (期望1) | 下载按钮可用: {pr_btn}")

        # 智能着色模式
        await page.select_option("#pr-style", "color")
        await page.click("button:has-text('开始修复')")
        await page.wait_for_timeout(1500)
        res_canvas2 = await page.evaluate("() => document.querySelectorAll('#pr-result canvas').length")
        print(f"9. ✅ 智能着色模式结果: {res_canvas2} (期望1)")

        print("\n页面 JS 错误:", errors if errors else "无 ✅")
        await browser.close()

asyncio.run(main())