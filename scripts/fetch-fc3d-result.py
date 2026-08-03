#!/usr/bin/env python3
"""
福彩3D 开奖结果获取脚本
尝试多个数据源获取最新开奖号码，更新到 piancai.html 的 KNOWN_DRAW_NUMS
"""
import re
import json
import os
import sys
from datetime import datetime, timezone, timedelta

# 当前脚本目录
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
WORK_DIR = os.path.dirname(SCRIPT_DIR)

# 北京时区
BJ_TZ = timezone(timedelta(hours=8))

def get_beijing_date():
    """获取北京日期"""
    now = datetime.now(BJ_TZ)
    return now.year, now.month, now.day

def get_period_num(year, month, day):
    """获取期号：2026年福彩3D从1月11日才开始出第一期，所以期号=日历年天数-10"""
    from datetime import date
    start = date(year, 1, 1)
    target = date(year, month, day)
    day_of_year = (target - start).days + 1
    period_num = day_of_year - 10  # 前10天无开奖，减10得到真实期号
    return f"{year}{period_num:03d}"

def try_source_zhcw():
    """数据源1: 中彩网 zhcw.com"""
    try:
        import requests
        url = 'https://jc.zhcw.com/port/client_json.php'
        params = {
            'transactionType': '10001001',
            'lotteryId': '2',
            'issueCount': '5',
            'type': '0',
            'pageNum': '1',
            'pageSize': '5'
        }
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://www.zhcw.com/kjxx/3d/',
            'Accept': 'application/json, text/javascript, */*; q=0.01'
        }
        resp = requests.get(url, params=params, headers=headers, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            results = []
            for item in data.get('result', []):
                code = item.get('code', '')
                red = item.get('red', '')
                results.append({'period': code, 'drawNum': red})
            return results
    except Exception as e:
        print(f"  [zhcw] 失败: {e}")
    return []

def try_source_500com():
    """数据源2: 500.com"""
    try:
        import requests
        # 尝试500.com的静态JSON
        url = 'https://kaijiang.500.com/static/info/kaijiang/xml/3d/lately100.xml'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://kaijiang.500.com/'
        }
        resp = requests.get(url, headers=headers, timeout=15)
        if resp.status_code == 200:
            # 解析XML
            import xml.etree.ElementTree as ET
            root = ET.fromstring(resp.content)
            results = []
            for item in root.findall('.//item'):
                period = item.get('period', '')
                code = item.get('code', '')
                if period and code:
                    results.append({'period': period, 'drawNum': code})
            return results
    except Exception as e:
        print(f"  [500com] 失败: {e}")
    return []

def try_source_opencai():
    """数据源3: opencai API"""
    try:
        import requests
        url = 'https://api.opencai.net/lottery/latest'
        params = {'code': 'fc3d', 'limit': '5'}
        headers = {'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json'}
        resp = requests.get(url, params=params, headers=headers, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            results = []
            for item in data.get('data', []):
                period = item.get('issue', '')
                draw = item.get('number', '')
                if period and draw:
                    # 号码格式可能是 "1,2,3" 或 "123"
                    draw = draw.replace(',', '')
                    results.append({'period': period, 'drawNum': draw})
            return results
    except Exception as e:
        print(f"  [opencai] 失败: {e}")
    return []

def try_source_juhe():
    """数据源4: 聚合数据 juhe.cn"""
    try:
        import requests
        # 使用免费API KEY
        url = 'http://apis.juhe.cn/lottery/query'
        params = {
            'key': 'free',  # 免费额度
            'lottery_id': '3D',
            'count': '5'
        }
        headers = {'User-Agent': 'Mozilla/5.0'}
        resp = requests.get(url, params=params, headers=headers, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            if data.get('error_code') == 0:
                results = []
                for item in data.get('result', []):
                    period = item.get('lottery_num', '')
                    draw = item.get('lottery_res', '')
                    if period and draw:
                        results.append({'period': period, 'drawNum': draw})
                return results
    except Exception as e:
        print(f"  [juhe] 失败: {e}")
    return []

def try_source_baidu():
    """数据源5: 百度搜索"""
    try:
        import requests
        import re
        url = 'https://www.baidu.com/s?wd=福彩3D开奖结果'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        resp = requests.get(url, headers=headers, timeout=15)
        if resp.status_code == 200:
            html = resp.text
            # 尝试匹配开奖号码
            # 常见格式: 期号 2026213 开奖号码 1 2 3
            patterns = [
                r'(\d{7}).*?开奖号码[：:]\s*(\d)\s*(\d)\s*(\d)',
                r'(\d{7}).*?(\d)\s*(\d)\s*(\d)',
            ]
            results = []
            for pattern in patterns:
                matches = re.findall(pattern, html)
                if matches:
                    for m in matches:
                        period = m[0]
                        draw = m[1] + m[2] + m[3]
                        results.append({'period': period, 'drawNum': draw})
                    return results
    except Exception as e:
        print(f"  [baidu] 失败: {e}")
    return []

def try_source_wangyi():
    """数据源6: 网易彩票"""
    try:
        import requests
        url = 'https://cai.163.com/kaijiang/3d/'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html'
        }
        resp = requests.get(url, headers=headers, timeout=15)
        if resp.status_code == 200:
            html = resp.text
            # 匹配开奖号码
            import re
            patterns = [
                r'(\d{7}).*?<em[^>]*>(\d)</em><em[^>]*>(\d)</em><em[^>]*>(\d)</em>',
                r'(\d{7}).*?class="[^"]*ball[^"]*"[^>]*>(\d)<',
            ]
            for pattern in patterns:
                matches = re.findall(pattern, html, re.DOTALL)
                if matches:
                    results = []
                    for m in matches:
                        period = m[0]
                        if len(m) == 4:
                            draw = m[1] + m[2] + m[3]
                        else:
                            continue
                        results.append({'period': period, 'drawNum': draw})
                    return results
    except Exception as e:
        print(f"  [wangyi] 失败: {e}")
    return []

def update_piancai_html(new_draws):
    """更新 piancai.html 中的 KNOWN_DRAW_NUMS"""
    if not new_draws:
        return False
    
    piancai_path = os.path.join(WORK_DIR, 'piancai.html')
    if not os.path.exists(piancai_path):
        print(f"  文件不存在: {piancai_path}")
        return False
    
    with open(piancai_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 查找 KNOWN_DRAW_NUMS 对象
    pattern = r"(const KNOWN_DRAW_NUMS\s*=\s*\{)([^}]*)(\})"
    match = re.search(pattern, content, re.DOTALL)
    if not match:
        print("  KNOWN_DRAW_NUMS 未找到")
        return False
    
    # 解析已有数据
    existing = {}
    inner = match.group(2)
    for line in inner.strip().split('\n'):
        line = line.strip().rstrip(',')
        m = re.match(r"'(\d+)':\s*'(\d+)'", line)
        if m:
            existing[m.group(1)] = m.group(2)
    
    updated = False
    for nd in new_draws:
        period = nd['period']
        draw = nd['drawNum']
        if period not in existing and len(draw) == 3 and draw.isdigit():
            existing[period] = draw
            updated = True
            print(f"  新增: {period} -> {draw}")
        elif period in existing and existing[period] != draw:
            print(f"  更新: {period} {existing[period]} -> {draw}")
            existing[period] = draw
            updated = True
        elif period in existing:
            print(f"  已存在: {period} -> {draw}")
    
    if not updated:
        print("  无新数据需要更新")
        return True
    
    # 按期号排序
    sorted_items = sorted(existing.items(), key=lambda x: x[0])
    
    # 构建新的 KNOWN_DRAW_NUMS
    new_inner = '\n'
    for k, v in sorted_items:
        new_inner += f"      '{k}': '{v}',\n"
    new_inner += '    '
    
    new_content = content.replace(match.group(0), match.group(1) + new_inner + match.group(3))
    
    with open(piancai_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("  piancai.html 已更新")
    return True


def main():
    print(f"=== 福彩3D 开奖结果获取 ===")
    print(f"时间: {datetime.now(BJ_TZ).strftime('%Y-%m-%d %H:%M:%S')}")
    
    # 获取今天的期号
    y, m, d = get_beijing_date()
    today_period = get_period_num(y, m, d)
    print(f"今日期号: {today_period}")
    
    # 尝试所有数据源
    sources = [
        ('500.com', try_source_500com),
        ('zhcw', try_source_zhcw),
        ('opencai', try_source_opencai),
        ('juhe', try_source_juhe),
        ('baidu', try_source_baidu),
        ('wangyi', try_source_wangyi),
    ]
    
    all_results = []
    for name, func in sources:
        print(f"  尝试 {name}...")
        try:
            results = func()
            if results:
                print(f"  ✅ {name} 成功: {len(results)} 条")
                for r in results:
                    print(f"    {r['period']} -> {r['drawNum']}")
                all_results.extend(results)
                break  # 找到数据就停止
        except Exception as e:
            print(f"  ❌ {name} 异常: {e}")
    
    if not all_results:
        print("❌ 所有数据源均失败")
        return False
    
    # 更新 piancai.html
    print("\n更新 piancai.html...")
    update_piancai_html(all_results)
    
    print("✅ 完成")
    return True


if __name__ == '__main__':
    main()