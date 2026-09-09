#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""3D/P3 回测 300 期（新规则：交集=1 才中；0/2/3 均不中）+ 策略分析
赔率：每期投入 8.84 元，中出得 19.6 元（盈亏平衡点 = 8.84/19.6 = 45.1%）
"""
import datetime, json, io, os

GAN_TO_DAN = {"甲":[1,4,8],"乙":[3,4,8],"丙":[3,4,9],"丁":[2,4,9],"戊":[3,4,9],"己":[2,4,9],"庚":[2,7,9],"辛":[2,6,7],"壬":[1,6,7],"癸":[1,6,8]}
TIAN_GAN = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"]

def get_hai_hour_gan(y,m,d):
    diff = (datetime.date(y,m,d)-datetime.date(1900,1,1)).days
    cycle = ((diff+10)%60+60)%60
    return TIAN_GAN[(((cycle%10)%5)*2+11)%10]
def dans_for(y,m,d): return GAN_TO_DAN[get_hai_hour_gan(y,m,d)]
def period_to_date(p):
    return datetime.date(int(p[:4]),1,1)+datetime.timedelta(days=int(p[4:])+9)
def inter(draw,dans): return len(set(str(draw))&set(str(x) for x in dans))

COST, PRIZE = 8.84, 19.6

def build_rows(path, limit=300):
    data = json.load(io.open(path, encoding='utf-8'))
    rows = []
    for k,v in data.items():
        if not v.get('drawNum'): continue
        if v.get('year'): date = datetime.date(v['year'],v['month'],v['day'])
        else: date = period_to_date(k)
        rows.append({'period':str(k),'date':date,'dans':dans_for(date.year,date.month,date.day),
                     'draw':str(v['drawNum']),'cold':v.get('coldDans')})
    rows.sort(key=lambda r:r['period'])
    return rows[-limit:]

def stat(rs, pick, label):
    wins=ti=to=0; maxl=cur=0
    for r in rs:
        dans = r[pick] if pick=='cold' else r['dans']
        if not dans: return None
        hit = inter(r['draw'], dans) == 1   # 新规则：交集=1 才中
        ti += COST
        if hit: wins+=1; to+=PRIZE; cur=0
        else: cur+=1; maxl=max(maxl,cur)
    return {'label':label,'n':len(rs),'wins':wins,'rate':f"{wins/len(rs)*100:.1f}%",
            'cost':round(ti,2),'return':round(to,2),'profit':round(to-ti,2),'maxlose':maxl}

def main():
    base = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
    r3 = build_rows(os.path.join(base,'data','fc3d-prediction.json'))
    rp = build_rows(os.path.join(base,'data','p3-prediction.json'))
    print('='*80)
    print(f'📊 新规则回测最近 300 期：预测3码 ∩ 开奖号去重 = 1 个才算中；0/2/3 个都不算')
    print(f'   赔率：每期投入 {COST} 元，中得 {PRIZE} 元 | 盈亏平衡点 {COST/PRIZE*100:.1f}%')
    print('='*80)
    for name, rows in [('福彩3D', r3), ('排列三', rp)]:
        print(f'\n【{name}】共 {len(rows)} 期（有冷号 {sum(1 for r in rows if r["cold"])} 期）')
        r_cold = [r for r in rows if r['cold']]
        r_res = [r for r in r_cold if set(str(x) for x in r['dans']) & set(str(x) for x in r['cold'])]
        r_nres = [r for r in r_cold if not (set(str(x) for x in r['dans']) & set(str(x) for x in r['cold']))]
        s1 = stat(rows, 'dans', '全期 投时干')
        print(f'  {s1["label"]}: {s1["n"]}期 | 中{s1["wins"]} | 中出率{s1["rate"]} | 投入{s1["cost"]} | 净{s1["profit"]} | 最大连错{s1["maxlose"]}')
        if r_cold:
            s2 = stat(r_cold, 'cold', '全期 投冷号')
            print(f'  {s2["label"]}: {s2["n"]}期 | 中{s2["wins"]} | 中出率{s2["rate"]} | 投入{s2["cost"]} | 净{s2["profit"]} | 最大连错{s2["maxlose"]}')
            s3 = stat(r_res, 'dans', '共振期 投时干')
            print(f'  {s3["label"]}: {s3["n"]}期 | 中{s3["wins"]} | 中出率{s3["rate"]} | 投入{s3["cost"]} | 净{s3["profit"]} | 最大连错{s3["maxlose"]}')
            s4 = stat(r_res, 'cold', '共振期 投冷号')
            print(f'  {s4["label"]}: {s4["n"]}期 | 中{s4["wins"]} | 中出率{s4["rate"]} | 投入{s4["cost"]} | 净{s4["profit"]} | 最大连错{s4["maxlose"]} ★')
            s5 = stat(r_nres, 'dans', '非共振期 投时干')
            print(f'  {s5["label"]}: {s5["n"]}期 | 中{s5["wins"]} | 中出率{s5["rate"]} | 投入{s5["cost"]} | 净{s5["profit"]} | 最大连错{s5["maxlose"]}（对照：跳过的期）')
    print('\n' + '='*80)
    print(f'盈亏平衡点: {COST/PRIZE*100:.1f}% 中出率 → 高于此才盈利')

if __name__ == '__main__':
    main()
