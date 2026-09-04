#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""更新深探专栏 2026-09-04：瓦伦蒂奇失踪案"""
import json, os

BASE = "/run/csi/mount-root/nas/4079184d856ecc166ed19d4887083405/workspaces/default/tools-website"
path = os.path.join(BASE, "data", "wikileaks.json")

with open(path, encoding="utf-8") as f:
    data = json.load(f)

# 新今日文章
new_today = {
  "id": "valentich-1978",
  "title": "1978年巴斯海峡：飞行员最后一句\"它不是飞机\"，20岁青年连人带机消失至今",
  "tag": "🛩️ 未解之谜",
  "date": "2026年9月4日",
  "readTime": "约6分钟",
  "image": "wikileaks-images/article19.jpg",
  "image_home": "wikileaks-images/thumb19.jpg",
  "content": [
    {
      "type": "text",
      "text": "1978年10月21日傍晚6点多，澳大利亚墨尔本飞行服务站的话务员接进一名年轻飞行员的无线电。20岁的弗雷德里克·瓦伦蒂奇正驾驶一架塞斯纳182L单引擎飞机，从墨尔本莫拉宾机场飞往巴斯海峡对岸的国王岛，航程232公里。通话那头的声音越来越紧张：\"有一架不明飞机在我上方约300米处伴飞……它在我上方绕圈……引擎开始发顿……它不是一架飞机。\"随后，无线电里传来一阵金属刮擦般的刺耳噪音，通话戛然而止。瓦伦蒂奇和那架塞斯纳182，再也没有出现。"
    },
    {
      "type": "text",
      "text": "瓦伦蒂奇不是新手，却也不算老练——他累计飞行约150小时，持有四级仪表等级。他两次申请加入澳大利亚皇家空军都被拒，理由是学历不够；一直在业余考商用执照，却两次五科全挂，失踪前一个月刚又挂掉三科。更引人注意的是他的背景：父亲说他是 UFO 的狂热信徒，一直担心被不明飞行物攻击；失踪前6天，他还跟女友讨论过\"被UFO带走\"的可能性，女友事后回忆\"他看起来是认真的\"。当天他告诉航管去国王岛接朋友，对别人说去取龙虾——后来的调查发现两个说法都不是真的，他甚至没有按流程向国王岛机场报备降落意向。"
    },
    {
      "type": "text",
      "text": "当晚的通话记录成了这起失踪案最诡异的部分。7点06分，瓦伦蒂奇报告有不明飞行器在4500英尺高度跟着他，航管答复该高度没有已知航班。他说看到的是一架大型不明飞机，亮着四盏明亮的着陆灯，从他头顶300米处高速掠过，然后从东侧接近，\"对方可能是在故意戏弄我\"。他描述那东西在他上方绕圈，有闪亮的金属表面和一道绿光。7点08分，被要求确认机型时，他给出了那句著名的回答：\"它不是一架飞机。\"——随后是约17秒的金属刮擦声，信号中断，再没有任何联系。"
    },
    {
      "type": "text",
      "text": "救援立刻展开：澳大利亚皇家空军出动P-3猎户座巡逻机，8架民用飞机和海上船只加入，搜索范围超过2600平方公里，覆盖整个巴斯海峡。4天后的10月25日，搜索停止，一无所获。官方调查最终无法确定事故原因，只将瓦伦蒂奇\"推定死亡\"。5年后的1983年7月，一块发动机整流罩活门被冲上弗林德斯岛海岸，经鉴定属于序列号区间涵盖瓦伦蒂奇飞机的塞斯纳182——却始终没有下文。那架飞机和飞行员，至今下落不明。"
    },
    {
      "type": "text",
      "text": "几十年来，解释层出不穷。官方一度猜测他可能倒飞时把水面倒影误认为灯光，或因天体错觉陷入\"墓地螺旋\"坠海——2013年退休美军飞行员麦加哈与乔·尼克尔的分析就主张，地平线倾斜错觉让缺乏经验的瓦伦蒂奇误入螺旋，旋转产生的G力导致燃油供给不稳，才有了\"引擎发顿\"的无线电报告，而他头顶的\"灯光\"其实是金星、火星、水星和心宿二。也有人怀疑他自导自演了失踪：航程中飞机从未出现在雷达上，同一时间墨尔本警方还接到过轻型飞机在奥德韦角附近神秘降落的报告；还有人认为是自杀——但采访过他的医生和同事几乎都排除了这种可能。而 UFO 研究者则坚信他被\"带走\"了：当晚有人看到天上移动的绿光，水管工罗伊·曼尼福德的照片疑似拍到一个物体从海面跃出，尽管后来连打假网站 Snopes 都认为那更像\"失焦的苍蝇或飞过的鸟\"。"
    },
    {
      "type": "highlight",
      "text": "📍 核心真相：瓦伦蒂奇失踪案至今是一桩\"无法结案\"的悬案——没有残骸、没有遗体、没有坠机证据，只有一盘记录了\"它不是一架飞机\"和金属刮擦声的录音。主流理性解释（天体错觉+墓地螺旋）与 UFO 传说（被绿色光球带走）都有支持者，但没有任何一方能完全自圆其说。它和1953年在美国上空同样遭遇不明飞行物后失踪的美军飞行员菲利克斯·蒙克拉一起，并称航空史上最著名的两起\"伴飞消失\"案例。"
    },
    {
      "type": "text",
      "text": "更令人玩味的是时间背景：就在瓦伦蒂奇失踪不到一年前，电影《第三类接触》席卷全球——片尾正是飞行员遭遇UFO、被光束接走的桥段。怀疑论者布莱恩·邓宁指出，瓦伦蒂奇的无线电对话与片中场景高度相似，他可能是在模仿剧情\"玩一把\"，结果玩脱了。而巴斯海峡本身，也因这起事件和其他多起船只、飞机神秘失踪，被 UFO 爱好者冠上了\"澳大利亚百慕大\"的绰号。真实的瓦伦蒂奇究竟遭遇了什么，我们或许永远不会知道。但那声\"它不是一架飞机\"，连同频道里17秒的金属刮擦声，成了航空史上最经典的谜团——每次被重提，都会让听者脊背发凉。"
    }
  ],
  "sources": [
    {
      "name": "Wikipedia: Disappearance of Frederick Valentich（瓦伦蒂奇失踪案）",
      "url": "https://en.wikipedia.org/wiki/Disappearance_of_Frederick_Valentich"
    },
    {
      "name": "澳大利亚国家档案馆：Department of Transport 官方调查摘要报告",
      "url": "https://recordsearch.naa.gov.au/NAAMedia/ShowImage.asp?B=10491375&S=8&T=P"
    },
    {
      "name": "Snopes: Frederick Valentich's 'UFO' Sighting and Disappearance",
      "url": "https://www.snopes.com/articles/383824/frederick-valentich-ufo-disappearance/"
    },
    {
      "name": "Skeptical Inquirer: The Valentich Disappearance: Another UFO Cold Case Solved",
      "url": "https://skepticalinquirer.org/2013/11/the-valentich-disappearance-another-ufo-cold-case-solved/"
    }
  ]
}

# 将旧 today 移到 archive 顶部
data["archive"].insert(0, data["today"])
data["today"] = new_today
data["updateTime"] = "2026-09-04 13:10 UTC"

with open(path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=1)

print("✅ 已更新")
print("today:", data["today"]["title"])
print("archive 数量:", len(data["archive"]))
print("updateTime:", data["updateTime"])