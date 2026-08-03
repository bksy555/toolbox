#!/bin/bash
# ============================================================
# 福彩3D中奖号码自动更新脚本（百度搜索方式）
# 每天北京时间22:00执行，搜索最新开奖号码
# ============================================================
set -e

cd "$(dirname "$0")/.."
echo "=== 福彩3D中奖号码自动更新（百度搜索）==="
echo "时间: $(date '+%Y-%m-%d %H:%M:%S %Z')"

# 获取北京时间
BJ_DATE=$(TZ='Asia/Shanghai' date '+%Y-%m-%d')
BJ_YEAR=$(TZ='Asia/Shanghai' date '+%Y')
BJ_MONTH=$(TZ='Asia/Shanghai' date '+%-m')
BJ_DAY=$(TZ='Asia/Shanghai' date '+%-d')

# 计算当前期号（2026年1月1日=2026001，每期+1，每天1期，但有周日休市）
# 从已知数据推：2026-07-21 = 2026192，差13天到今天
# 用更简单的方式：从已知的最近期号推算
# 2026-08-03 = 2026205，所以今天 = 2026-08-03 + 天数差
# 直接用已知的最近期号+天数差

# 读取最近期号
LATEST_PERIOD=$(python3 -c "
import json
with open('data/fc3d-prediction.json') as f:
    d = json.load(f)
keys = sorted([k for k in d.keys() if k.startswith('2026') and d[k].get('drawNum') and d[k]['drawNum'] != '' and d[k]['drawNum'] != ' '], reverse=True)
print(keys[0] if keys else '2026200')
")
LATEST_DATE=$(python3 -c "
import json
from datetime import date
with open('data/fc3d-prediction.json') as f:
    d = json.load(f)
k = '$LATEST_PERIOD'
if k in d:
    v = d[k]
    print(f'{v[\"year\"]}-{v[\"month\"]}-{v[\"day\"]}')
else:
    print('2026-01-01')
")
LATEST_NUM=$(python3 -c "
import json
with open('data/fc3d-prediction.json') as f:
    d = json.load(f)
k = '$LATEST_PERIOD'
if k in d:
    print(d[k].get('drawNum',''))
else:
    print('')
")

echo "最近已知: 第${LATEST_PERIOD}期 = ${LATEST_NUM} (${LATEST_DATE})"

# 计算今天应该查询的期号
# 3D每天开奖（周一到周六），周日休市
TODAY_PERIOD=$(python3 -c "
from datetime import date, datetime
import json

latest_date_str = '$LATEST_DATE'
latest_period = int('$LATEST_PERIOD')
latest_num = '$LATEST_NUM'

# 最近有数据的日期
parts = latest_date_str.split('-')
latest_date = date(int(parts[0]), int(parts[1]), int(parts[2]))

# 今天的北京时间
bj_now = datetime.now()
bj_date = date(bj_now.year, bj_now.month, bj_now.day)

# 如果最近日期 >= 今天，说明已经是最新
if latest_date >= bj_date:
    print(latest_period)
else:
    # 计算天数差
    days_diff = (bj_date - latest_date).days
    # 期号 = 最近期号 + 天数差（每天1期，周日休市）
    # 简化：直接加天数差，后续再修正
    next_period = latest_period + days_diff
    # 如果最近号码为空，说明当天可能还没开奖，用昨天的期号
    if not latest_num or latest_num.strip() == '':
        next_period = latest_period
    print(next_period)
")

echo "今天预计期号: 第${TODAY_PERIOD}期"

# 搜索今天的3D开奖结果
SEARCH_TERM="福彩3D+第${TODAY_PERIOD}期+开奖结果"
echo "搜索: ${SEARCH_TERM}"

# 用curl搜索百度
BAIDU_HTML=$(curl -sL --connect-timeout 10 --max-time 20 \
  "https://www.baidu.com/s?wd=${SEARCH_TERM}" \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' \
  -H 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' 2>/dev/null)

# 提取官方福彩卡片中的三位数
# 百度卡片格式: 第XXXX期 日期 然后三个单独的数字
DRAW_NUM=$(echo "$BAIDU_HTML" | python3 -c "
import sys, re
html = sys.stdin.read()

# 方法1: 找第XXX期后面的三个单独数字
# 先找期号
period = '$TODAY_PERIOD'
# 找卡片中的数字 - 在期号附近找3个独立的数字
# 模式: 第XXXX期 ... 后面跟着三个数字
match = re.search(r'第' + period + r'期[^<]*?(?:<[^>]*>)*?\s*(\d)\s*.*?(?:<[^>]*>)*?\s*(\d)\s*.*?(?:<[^>]*>)*?\s*(\d)', html, re.DOTALL)
if match:
    print(match.group(1) + match.group(2) + match.group(3))
    sys.exit(0)

# 方法2: 找官方福彩卡片中的数字
# 在包含'福彩3D'的区域找三个连续的数字
section = re.search(r'福彩3D[^<]*(?:<[^>]*>)*?\s*' + period + r'[^<]*(?:<[^>]*>)*?(\d)[^<]*(?:<[^>]*>)*?(\d)[^<]*(?:<[^>]*>)*?(\d)', html, re.DOTALL)
if section:
    print(section.group(1) + section.group(2) + section.group(3))
    sys.exit(0)

# 方法3: 在页面中找'第' + period + '期'附近的三个数字
pos = html.find('第' + period + '期')
if pos > 0:
    chunk = html[pos:pos+2000]
    # 提取所有数字
    nums = re.findall(r'(?<=>)(\d)(?=<)', chunk)
    if len(nums) >= 3:
        print(nums[0] + nums[1] + nums[2])
        sys.exit(0)

# 方法4: 单词提取
nums = re.findall(r'(?<![0-9])(\d{3})(?![0-9])', html)
# 过滤掉明显不是开奖号码的数字
for n in nums:
    if n not in ['000', '111', '222', '333', '444', '555', '666', '777', '888', '999']:
        print(n)
        sys.exit(0)

print('')
")

echo "提取到号码: ${DRAW_NUM:-'(未找到)'}"

if [ -z "$DRAW_NUM" ]; then
    echo "❌ 未找到开奖号码，可能还没开奖"
    exit 0
fi

# 更新数据文件
python3 -c "
import json
from datetime import datetime, timezone, timedelta

BJ_TZ = timezone(timedelta(hours=8))
bj_now = datetime.now(BJ_TZ)

with open('data/fc3d-prediction.json') as f:
    d = json.load(f)

key = '${TODAY_PERIOD}'
num = '${DRAW_NUM}'

if key in d:
    v = d[key]
    # 检查是否已更新
    if v.get('drawNum') == num:
        print(f'✅ 第{key}期 = {num} 已是最新，无需更新')
    else:
        v['drawNum'] = num
        v['updatedAt'] = bj_now.isoformat()
        # 计算3胆中1结果
        dans = v.get('dans', [])
        if dans and len(num) == 3:
            draw_arr = [int(c) for c in num]
            match_count = sum(1 for x in dans if x in draw_arr)
            v['result'] = '✅' if match_count >= 1 else '❌'
        print(f'✅ 更新第{key}期 = {num}')
else:
    print(f'⚠️ 期号{key}不在数据中，新建记录')
    # 计算日期
    d[key] = {
        'period': key,
        'year': ${BJ_YEAR},
        'month': ${BJ_MONTH},
        'day': ${BJ_DAY},
        'drawNum': num,
        'dans': [],
        'result': '',
        'updatedAt': bj_now.isoformat()
    }
    print(f'✅ 新增第{key}期 = {num}')

with open('data/fc3d-prediction.json', 'w') as f:
    json.dump(d, f, ensure_ascii=False, indent=2)
"

# 更新 piancai.html 的 KNOWN_DRAW_NUMS
python3 -c "
import json, re

with open('piancai.html') as f:
    html = f.read()

key = '${TODAY_PERIOD}'
num = '${DRAW_NUM}'

# 更新KNOWN_DRAW_NUMS
pattern = r\"('\" + key + r\"')\s*:\s*'\d{3}'\"
replacement = r\"'\" + key + r\"': '\" + num + r\"'\"
if re.search(pattern, html):
    html = re.sub(pattern, replacement, html)
    print(f'✅ 更新piancai.html KNOWN_DRAW_NUMS: {key}={num}')
else:
    # 添加到字典中
    # 找到最后一个期号的位置
    import re
    match = re.search(r\"'(\d{7})'\s*:\s*'\d{3}'\s*\n\s*}\", html)
    if match:
        last_key = match.group(1)
        insert_pos = match.end() - 2  # 在 } 之前
        html = html[:insert_pos] + f\"    '{key}': '{num}',\\n\" + html[insert_pos:]
        print(f'✅ 新增piancai.html KNOWN_DRAW_NUMS: {key}={num}')
    else:
        print('⚠️ 未找到KNOWN_DRAW_NUMS结束位置')

with open('piancai.html', 'w') as f:
    f.write(html)
"

# 推送GitHub
echo ""
echo "--- 推送到 GitHub ---"
git add -A
git commit -m "🤖 福彩3D自动更新 第${TODAY_PERIOD}期 = ${DRAW_NUM} $(TZ='Asia/Shanghai' date '+%Y-%m-%d %H:%M')"
git push 2>&1
echo "✅ 推送完成"