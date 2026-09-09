#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""3D/P3 回测 300 期（用户新规则）+ 投注策略分析
规则：预测3码 ∩ 开奖号去重数字，交集=1或2 → 中出；交集=0或3（全中）→ 未中
投注：每期固定 1 倍 6.3 元，中得 9.8 元，不加倍
时干预测3码：标准天干算法重算（与 fc3d-prediction-cron.sh 一致）
"""
import datetime, json

# ===== 时干天干3胆算法（与 fc3d-prediction-cron.sh / backtest-300 一致） =====
GAN_TO_DAN = {
    "甲": [1, 4, 8], "乙": [3, 4, 8], "丙": [3, 4, 9],
    "丁": [2, 4, 9], "戊": [3, 4, 9], "己": [2, 4, 9],
    "庚": [2, 7, 9], "辛": [2, 6, 7], "壬": [1, 6, 7], "癸": [1, 6, 8],
}
TIAN_GAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]

def get_hai_hour_gan(y, m, d):
    diff = (datetime.date(y, m, d) - datetime.date(1900, 1, 1)).days
    cycle_num = ((diff + 10) % 60 + 60) % 60
    day_gan_idx = cycle_num % 10
    gan_idx = ((day_gan_idx % 5) * 2 + 11) % 10  # 亥时
    return TIAN_GAN[gan_idx]

def dans_for(y, m, d):
    return GAN_TO_DAN[get_hai_hour_gan(y, m, d)]

def period_to_date(period):
    p = str(period)
    year = int(p[:4])
    day_of_year = int(p[4:]) + 10
    return datetime.date(year, 1, 1) + datetime.timedelta(days=day_of_year - 1)

def load(path):
    return json.load(open(path, encoding='utf-8'))

def judge(drawNum, dans):
    """新规则：交集 1-2 个 = 中出；0 或 3（全中）= 未中"""
    inter = set(str(drawNum)) & set(str(x) for x in dans)
    return len(inter) in (1, 2), len(inter)

def build_rows(data, limit=300, with_cold=False):
    """最近 limit 期（有号码），标准算法重算时干 dans；coldDans 用存储值"""
    rows = []
    for k, v in data.items():
        if not v.get("drawNum"):
            continue
        if v.get("year"):
            date = datetime.date(v["year"], v["month"], v["day"])
        else:
            date = period_to_date(k)
        row = {
            "period": str(k), "date": date,
            "dans": dans_for(date.year, date.month, date.day),
            "draw": str(v["drawNum"]),
            "coldDans": v.get("coldDans"),
        }
        rows.append(row)
    rows.sort(key=lambda r: r["period"])
    return rows[-limit:]

def backtest(rows, pick='dans'):
    """固定 1 倍回测"""
    wins = total_in = total_out = max_lose = cur_lose = 0
    all3 = 0
    for r in rows:
        dans = r[pick] if pick == 'coldDans' else r['dans']
        if not dans:
            continue
        hit, inter = judge(r['draw'], dans)
        if inter == 3:
            all3 += 1
        total_in += 6.3
        if hit:
            wins += 1; total_out += 9.8; cur_lose = 0
        else:
            cur_lose += 1; max_lose = max(max_lose, cur_lose)
    n = len(rows)
    return {
        '期数': n, '中出': wins, '未中': n - wins,
        '中出率': f"{wins/n*100:.1f}%", '全中未中': all3,
        '总投入': round(total_in, 1), '总回报': round(total_out, 1),
        '净盈亏': round(total_out - total_in, 1), '最大连错': max_lose
    }

def backtest_chase(rows, pick='dans', mults=(1,3,9,27,81)):
    """追号倍投：连错按 1/3/9/27/81 倍，中出回 1 倍"""
    costs = [6.3*m for m in mults]; prizes = [9.8*m for m in mults]
    total_in = total_out = streak = max_streak = rounds = win_rounds = 0
    for r in rows:
        dans = r[pick] if pick == 'coldDans' else r['dans']
        if not dans:
            continue
        idx = min(streak, len(mults)-1)
        total_in += costs[idx]
        hit, _ = judge(r['draw'], dans)
        if hit:
            total_out += prizes[idx]; win_rounds += 1; streak = 0
        else:
            streak += 1; max_streak = max(max_streak, streak)
        rounds += 1
    return {'轮数': rounds, '中出轮': win_rounds, '最大连错': max_streak,
            '总投入': round(total_in,1), '总回报': round(total_out,1),
            '净盈亏': round(total_out-total_in,1)}

def main():
    fc3d = load('data/fc3d-prediction.json')
    p3 = load('data/p3-prediction.json')
    r3 = build_rows(fc3d, 300)
    rp = build_rows(p3, 300)
    # 共振筛选：时干∩冷号≥1 才投（3D）
    r3_res = [r for r in r3 if r['coldDans'] and (set(str(x) for x in r['dans']) & set(str(x) for x in r['coldDans']))]
    # 有冷号数据的3D期
    r3_cold = [r for r in r3 if r['coldDans']]

    print('='*74)
    print('📊 新规则回测最近 300 期（交集1-2个=中出；0或3=未中）| 固定1倍 6.3元/期，中得9.8元')
    print('='*74)
    for name, rows in [('福彩3D', r3), ('排列三', rp)]:
        b = backtest(rows)
        print(f'\n【{name}】{b["期数"]} 期 | 中出 {b["中出"]} | 未中 {b["未中"]} | 中出率 {b["中出率"]}'
              f' | 其中全中按未中 {b["全中未中"]} 期')
        print(f'   投入 {b["总投入"]} 元 | 回报 {b["总回报"]} 元 | 净盈亏 {b["净盈亏"]} 元 | 最大连错 {b["最大连错"]} 期')

    print('\n' + '='*74)
    print('💡 投注策略对比（目标：花最少的钱）')
    print('='*74)
    print('\n【福彩3D】')
    b0 = backtest(r3)
    print(f'① 策略A 全期固定1倍投:     {b0["期数"]}期 x6.3 = {b0["总投入"]}元 → 净盈亏 {b0["净盈亏"]}元 | 中出率 {b0["中出率"]}')
    if r3_res:
        b1 = backtest(r3_res)
        saved = (len(r3)-len(r3_res))*6.3
        print(f'② 策略B 时干∩冷号共振才投: {len(r3_res)}期 x6.3 = {b1["总投入"]}元（省{len(r3)-len(r3_res)}期 {saved:.1f}元）→ 净盈亏 {b1["净盈亏"]}元 | 中出率 {b1["中出率"]}')
    if r3_cold:
        b2 = backtest(r3_cold, pick='coldDans')
        print(f'③ 策略C 只投冷号3胆:      {len(r3_cold)}期 x6.3 = {b2["总投入"]}元 → 净盈亏 {b2["净盈亏"]}元 | 中出率 {b2["中出率"]}')
    if r3_res:
        b5 = backtest(r3_res, pick='coldDans')
        print(f'⑤ 策略F 共振期投冷号3胆:   {len(r3_res)}期 x6.3 = {b5["总投入"]}元（省{len(r3)-len(r3_res)}期 {(len(r3)-len(r3_res))*6.3:.1f}元）→ 净盈亏 {b5["净盈亏"]}元 | 中出率 {b5["中出率"]} ★最优')
    b3 = backtest_chase(r3)
    print(f'④ 策略D 追号倍投1/3/9/27/81: 投入 {b3["总投入"]}元 → 净盈亏 {b3["净盈亏"]}元 | 最大连错 {b3["最大连错"]}期（对照：钱花得多）')

    print('\n【排列三】（无冷号数据）')
    bp0 = backtest(rp)
    print(f'① 策略A 全期固定1倍投:     {bp0["期数"]}期 x6.3 = {bp0["总投入"]}元 → 净盈亏 {bp0["净盈亏"]}元 | 中出率 {bp0["中出率"]}')
    bp1 = backtest_chase(rp)
    print(f'④ 策略D 追号倍投1/3/9/27/81: 投入 {bp1["总投入"]}元 → 净盈亏 {bp1["净盈亏"]}元 | 最大连错 {bp1["最大连错"]}期（对照）')

    print('\n' + '='*74)
    print('📐 盈亏平衡点：中出率需 > %.1f%% 才盈利' % (6.3/9.8*100))
    print('='*74)

if __name__ == '__main__':
    main()
