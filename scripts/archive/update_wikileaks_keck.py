#!/usr/bin/env python3
"""深探专栏每日更新：Kecksburg UFO 1965"""
import json, os, datetime

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(BASE, 'data', 'wikileaks.json')

with open(DATA, encoding='utf-8') as f:
    data = json.load(f)

new_today = {
    "id": "kecksburg-1965",
    "title": "橡果形金属物从天而降：美军为何连夜封锁宾州小镇？1965年凯克斯堡事件始末",
    "tag": "🌌 未解之谜",
    "date": "2026年8月23日",
    "readTime": "约6分钟",
    "image": "wikileaks-images/article9.jpg",
    "image_home": "wikileaks-images/thumb9.jpg",
    "content": [
        {
            "type": "text",
            "text": "1965年12月9日下午4点44分，美国宾夕法尼亚州、俄亥俄州、密歇根州、印第安纳州、纽约州、西弗吉尼亚州的天空，同时被一道刺眼的白光撕开。一个拖着火花尾巴的巨大火球，从底特律—温莎上空飞掠而过，尾迹清晰得连飞机驾驶员都能看见。密歇根、俄亥俄多地报告金属碎片坠落、草地起火、音爆轰鸣——紧接着，宾州匹兹堡东南约50公里处的小镇凯克斯堡（Kecksburg），有人听到了沉闷的\"砰\"的一声。"
        },
        {
            "type": "highlight",
            "text": "🔑 核心事件：1965年12月9日，美加大湖区上空飞过一颗巨大火球，目击范围横跨至少6个州和加拿大安大略省。匹兹堡东南的凯克斯堡镇居民报告\"有东西从天上掉进了树林\"。镇民詹姆斯·罗曼斯基（James Romansky）赶到现场，看到一个约大众甲壳虫汽车大小、橡果形状的金属物体半埋在土里，表面布满类似象形文字的奇特符号。随后陆军与州警迅速封锁现场，直升机在夜色中将某个物体运走。官方结论却是：\"什么都没找到。\""
        },
        {
            "type": "text",
            "text": "最耐人寻味的，是官方反应的速度。事发当天，当地报纸《格林斯堡论坛评论报》就刊出报道：\"物体着陆区域已应美国陆军和州警官员的命令立即封锁，以进行'近距离检查'。\"州警下令拉起警戒线，等待陆军工兵和民间科学家的到来。可当州警和空军人员在树林里打着盖革计数器搜了几个小时后，却宣布\"绝对没找到任何东西\"，随即收队。几个小时后，一则更短的消息见报，标题只有五个字：\"搜索未果\"。"
        },
        {
            "type": "text",
            "text": "然而，军用直升机和军车连夜进出的痕迹，成了小镇居民抹不去的记忆。10岁的男孩约翰·海斯（John Hays）回忆，那天傍晚他亲眼看到一辆平板卡车从自家附近的树林开出，车上载着一个\"和大众汽车差不多大\"的东西，用帆布裹得严严实实。几十年后，他在电视节目里描述的细节，与1990年代初第一个讲述此事的《未解之谜》节目里，一字不差。"
        },
        {
            "type": "text",
            "text": "关于那个橡果形物体到底是什么，四十年间众说纷纭。2005年12月——事件40周年纪念前夕——NASA突然发布声明，称专家曾检验过当地发现的金属碎片，认定它们来自一颗苏联卫星再入大气层后的残骸，\"但相关记录在1980年代遗失了\"。这一句\"记录遗失\"激怒了调查记者莱斯利·基恩（Leslie Kean）。她以《信息自由法》起诉NASA，2007年10月法院下令NASA搜寻相关文件。庭审中，NASA公共联络官史蒂夫·麦康奈尔作证：\"与凯克斯堡事件同时期的两箱文件，不见了。\""
        },
        {
            "type": "text",
            "text": "文件\"失踪\"的戏码并不陌生——人类登月的原始录像带，也曾在NASA的仓库里不翼而飞。但凯克斯堡的悬案不止于NASA。2015年，《匹兹堡邮报》发表调查报道：MUFON（互助UFO网络）调查员约翰·文特尔（John Ventre）经过多年排查，提出一个大胆猜测——坠落的可能是美国空军秘密间谍卫星\"通用电气Mark 2再入飞行器\"，一种橡果形状的返回舱，外形与目击者描述高度吻合。讽刺的是，如果这个猜测成立，那么1965年那晚的\"不明飞行物\"，恰恰不是外星来客，而是美国自己的绝密技术——而军方封锁现场、连夜秘密回收，就完全说得通了。"
        },
        {
            "type": "text",
            "text": "当然，也有天文学家的更朴素解释：那只是一颗陨石。1967年《加拿大皇家天文学会杂志》上，两位天文学家根据地震仪记录和目击者拍摄的轨迹照片推断，火球以陡峭角度斜穿大气层，最终很可能坠入湖面。NASA后来的声明也称其\"更可能是来自小行星带的流星\"——与苏联卫星Kosmos 96的轨道数据还对不上号。"
        },
        {
            "type": "highlight",
            "text": "💡 深层思考：凯克斯堡事件最值得玩味的地方，不是\"有没有外星人\"，而是\"为什么那么多人同时看见了同一件事，却没有任何官方记录留下来\"。一颗陨石不需要军队连夜封锁，一颗坠毁的卫星不需要直升机深夜回收，一份正常的调查报告更不需要在四十年后\"恰好遗失\"。当官方给出的每一个答案都自相矛盾时——\"什么都没找到\"、\"是苏联卫星，但记录丢了\"、\"可能是流星\"——公众自然而然地会问：你们到底在藏什么？有时候，破绽不是答案的错误，而是解释得太多。"
        },
        {
            "type": "text",
            "text": "今天的凯克斯堡，已经是美国UFO文化的地标。小镇消防站旁陈列着当年《未解之谜》节目制作的道具模型，供络绎不绝的游客打卡。关于这个事件，1990年《未解之谜》做了专题，2003年科幻频道拍了两小时纪录片《新罗斯威尔：凯克斯堡曝光》，Discovery频道2008年提出\"纳粹钟\"理论，《历史频道》的《远古外星人》也来探访过现场——2026年，斯皮尔伯格的新片《解密日》（Disclosure Day）更是把凯克斯堡事故作为公开政府影像的一部分搬上银幕。被称为\"宾夕法尼亚州的罗斯威尔\"的这桩悬案，在问世六十年后，依然吸引着全世界好奇的目光。"
        },
        {
            "type": "text",
            "text": "橡果形物体被军车连夜运走的那一幕，再也没有人见过后续。NASA遗失的档案箱、失踪的原始记录、已经离世或沉默的目击者——所有线索都指向一个方向，却又全部通向死胡同。1965年冬天的那个傍晚，划过美加大湖区上空的到底是什么？答案也许就藏在某个档案室的某个积灰角落，也许永远也不会再有答案。但正如这座小镇用60年时间证明的那样：有些谜题，恰恰因为无人解答，才让一代又一代人忍不住追问下去。"
        }
    ],
    "sources": [
        {
            "name": "Wikipedia: Kecksburg UFO incident",
            "url": "https://en.wikipedia.org/wiki/Kecksburg_UFO_incident"
        },
        {
            "name": "UFOPulse: Kecksburg UFO Incident 1965: Analyzing Evidence from a Historical UAP Encounter",
            "url": "https://ufopulse.com/kecksburg-ufo-incident-1965-analyzing-evidence-from-a-historical-uap-encounter/"
        },
        {
            "name": "Pittsburgh Post-Gazette: Five decades later, the Kecksburg UFO is identified (probably)",
            "url": "https://www.post-gazette.com/news/science/2015/12/06/50-years-later-the-Kecksburg-Westmoreland-County-UFO-is-identified-probably/stories/201512060146"
        },
        {
            "name": "Wired: NASA Will Re-Open Kecksburg UFO Files",
            "url": "https://www.wired.com/2007/10/nasa-opens-keck/"
        }
    ]
}

# 将当前 today 移入 archive 最前
old_today = data.get('today')
if old_today:
    data['archive'].insert(0, old_today)

data['today'] = new_today
data['updateTime'] = '2026-08-23 22:10 UTC'

with open(DATA, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('OK. archive count:', len(data['archive']))
print('new today:', data['today']['title'])
print('archive[0]:', data['archive'][0]['title']) if data['archive'] else None