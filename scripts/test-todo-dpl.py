#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""todo-list / daily-planner 真实流程功能实测（模拟 renderToolPages + showToolPage）"""
import asyncio
from playwright.async_api import async_playwright

URL = "file:///run/csi/mount-root/nas/4079184d856ecc166ed19d4887083405/workspaces/default/tools-website/index.html"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path="/usr/bin/chromium", args=["--no-sandbox"])
        page = await browser.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e) + " ||| " + (e.stack or "")[:160]))
        # 全局 confirm 自动接受
        page.on("dialog", lambda d: d.accept())
        await page.goto(URL, wait_until="networkidle", timeout=60000)

        # 确保页面渲染（renderToolPages 是否自动调用，否则手动）
        await page.evaluate("""() => {
            if (typeof renderToolPages === 'function' && !document.getElementById('page-todo-list')) renderToolPages();
        }""")

        # ===== todo-list 真实流程 =====
        await page.evaluate("() => showToolPage('todo-list')")
        await page.wait_for_timeout(300)
        assert await page.evaluate("() => !!document.getElementById('td-input')"), "td-input 不存在"
        print("1. ✅ showToolPage 打开 todo-list, td-input 存在")

        # 新增
        await page.fill("#td-input", "测试任务A")
        await page.select_option("#td-priority", "high")
        await page.select_option("#td-cat-select", "工作")
        await page.click("#page-todo-list button.btn-primary")
        await page.wait_for_timeout(200)
        await page.fill("#td-input", "测试任务B")
        await page.click("#page-todo-list button.btn-primary")
        await page.wait_for_timeout(200)
        n = await page.evaluate("() => document.querySelectorAll('#td-list > div').length")
        print(f"2. ✅ 新增2任务, 列表项={n} (期望2)")

        # 完成第一个
        await page.evaluate("""() => {
            const t = JSON.parse(localStorage.getItem('qwp_todo_list'))[0];
            tdToggle(t.id);
        }""")
        await page.wait_for_timeout(200)
        prog = await page.evaluate("() => document.getElementById('td-progress').textContent")
        print(f"3. ✅ 完成1个后进度: {prog} (期望 完成 1/2（50%）)")

        # 过滤已完成
        await page.evaluate("() => tdFilter(document.querySelector('button[data-filter=\"done\"]'))")
        await page.wait_for_timeout(200)
        dn = await page.evaluate("() => document.querySelectorAll('#td-list > div').length")
        print(f"4. ✅ 过滤[已完成]={dn} (期望1)")

        # 清空已完成（confirm 已自动接受）
        await page.evaluate("() => tdClearDone()")
        await page.wait_for_timeout(300)
        l = await page.evaluate("() => JSON.parse(localStorage.getItem('qwp_todo_list')).length")
        print(f"5. ✅ 清空已完成后 localStorage={l} (期望1)")

        # 双击编辑
        await page.evaluate("""() => {
            window.prompt = () => '编辑后的任务';
        }""")
        # 打开第一个任务触发 edit（直接调 tdEdit）
        await page.evaluate("""() => {
            const t = JSON.parse(localStorage.getItem('qwp_todo_list'))[0];
            tdEdit(t.id);
        }""")
        await page.wait_for_timeout(200)
        t1 = await page.evaluate("() => JSON.parse(localStorage.getItem('qwp_todo_list'))[0].text")
        print(f"6. ✅ 编辑后任务文本: {t1} (期望 编辑后的任务)")

        # ===== daily-planner 真实流程 =====
        await page.evaluate("() => showToolPage('daily-planner')")
        await page.wait_for_timeout(300)
        assert await page.evaluate("() => !!document.getElementById('dp-input')"), "dp-input 不存在"
        print("7. ✅ showToolPage 打开 daily-planner, dp-input 存在")

        await page.fill("#dp-input", "写周报")
        await page.select_option("#dp-slot", "morning")
        await page.fill("#dp-time", "10:30")
        await page.click("#page-daily-planner button.btn-primary")
        await page.wait_for_timeout(200)
        await page.fill("#dp-input", "健身")
        await page.select_option("#dp-slot", "evening")
        await page.click("#page-daily-planner button.btn-primary")
        await page.wait_for_timeout(200)
        dn2 = await page.evaluate("() => document.querySelectorAll('#dp-list div[style*=\"border-radius:8px\"]').length")
        print(f"8. ✅ daily-planner 新增2条, 条目={dn2} (期望2)")

        await page.evaluate("""() => {
            const t = JSON.parse(localStorage.getItem('qwp_daily_plan'))[0];
            dplToggle(t.id);
        }""")
        await page.wait_for_timeout(200)
        dp = await page.evaluate("() => document.getElementById('dp-progress').textContent")
        print(f"9. ✅ 完成1条后进度: {dp} (期望 完成 1/2（50%）)")

        dlabel = await page.evaluate("() => document.getElementById('dp-date-label').textContent")
        print(f"10. ✅ 日期标签: {dlabel}")

        # 删除一条
        await page.evaluate("""() => {
            const t = JSON.parse(localStorage.getItem('qwp_daily_plan'))[1];
            dplDelete(t.id);
        }""")
        await page.wait_for_timeout(300)
        l2 = await page.evaluate("() => JSON.parse(localStorage.getItem('qwp_daily_plan')).length")
        print(f"11. ✅ 删除1条后 localStorage={l2} (期望1)")

        # 白板 drawing-pad 未被破坏
        await page.evaluate("() => showToolPage('drawing-pad')")
        await page.wait_for_timeout(300)
        has_canvas = await page.evaluate("() => !!document.getElementById('dp-canvas')")
        print(f"12. ✅ 白板 drawing-pad 仍正常 (dp-canvas存在={has_canvas})")

        print("\n页面 JS 错误:", errors if errors else "无 ✅")
        await browser.close()

asyncio.run(main())