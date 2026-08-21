},
  {
    id: 'id-photo',
    cat: 'image',
    icon: '📷',
    name: '证件照制作',
    desc: '在线制作一寸/二寸证件照，自动换底色（红白蓝），支持6寸排版8张，免费下载',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>上传照片（建议纯色背景人像照）</label>
          <input type="file" id="idp-file" accept="image/*">
        </div>
        <div class="row" style="gap:12px;flex-wrap:wrap;margin-top:6px;">
          <div class="input-group" style="min-width:150px;">
            <label>证件照类型</label>
            <select id="idp-type" onchange="idpRender()" style="width:100%;">
              <option value="1inch">一寸 25×35mm</option>
              <option value="2inch">二寸 35×49mm</option>
              <option value="small1">小一寸 22×32mm</option>
              <option value="small2">小二寸 35×45mm</option>
              <option value="passport">护照 33×48mm</option>
            </select>
          </div>
          <div class="input-group" style="min-width:130px;">
            <label>目标底色</label>
            <select id="idp-bg" onchange="idpRender()" style="width:100%;">
              <option value="#ffffff">⬜ 白色</option>
              <option value="#d9001b">🟥 红色</option>
              <option value="#438edb">🟦 蓝色</option>
              <option value="#f0f0f0">浅灰</option>
              <option value="#000000">黑色</option>
            </select>
          </div>
          <div class="input-group" style="min-width:120px;">
            <label>源背景色（自动取四角）</label>
            <input type="color" id="idp-srcbg" value="#ffffff" oninput="idpRender()" style="width:100%;height:38px;padding:2px;cursor:pointer;">
          </div>
          <div class="input-group" style="min-width:180px;">
            <label>抠图容差：<span id="idp-tol-val">60</span></label>
            <input type="range" id="idp-tolerance" min="10" max="140" value="60" oninput="idpTol()" style="width:100%;">
          </div>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);">
          💡 色差算法自动把接近"源背景色"的像素替换为目标底色并羽化边缘，纯本地处理不上传照片。
        </div>
        <div class="row" style="gap:20px;margin-top:12px;flex-wrap:wrap;">
          <div style="flex:1;min-width:180px;text-align:center;">
            <canvas id="idp-canvas" style="max-width:100%;border:1px solid var(--border);border-radius:12px;background:#f3f4f6;"></canvas>
            <div class="btn-group" style="margin-top:10px;justify-content:center;">
              <button class="btn btn-primary" onclick="idpDownload()">⬇️ 下载单张</button>
              <button class="btn btn-secondary" onclick="idpDownloadSheet()">🖨️ 6寸排版8张</button>
            </div>
            <div style="font-size:12px;color:var(--text-light);margin-top:6px;">标准300DPI分辨率，可直接上传报名系统</div>
          </div>
          <div style="flex:1;min-width:180px;text-align:center;">
            <canvas id="idp-sheet-canvas" style="max-width:100%;border:1px dashed var(--border);border-radius:12px;background:#fff;"></canvas>
            <div style="font-size:12px;color:var(--text-light);margin-top:6px;">6寸相纸（102×152mm）排版预览，可下载去照相馆冲印</div>
          </div>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于微信/支付宝证件照、妙鸭相机等付费证件照服务（5-15元/张），本工具免费生成标准尺寸证件照并支持冲印排版。
        </div>
      </div>
    `,
    handler: () => { setTimeout(idpInit, 100); }
  },
  {
    id: 'logo-maker',
    cat: 'image',
    icon: '🎨',
    name: '在线Logo制作',
    desc: '免费生成品牌Logo：20+图标×10色系×多字体组合，导出高清PNG/SVG',
    html: `
      <div class="tool-card">
        <div class="row" style="gap:12px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:150px;">
            <label>品牌名称</label>
            <input type="text" id="lg-name" placeholder="例如：星火科技" oninput="lgRender()" style="width:100%;">
          </div>
          <div class="input-group" style="flex:1;min-width:150px;">
            <label>副标题（可选）</label>
            <input type="text" id="lg-slogan" placeholder="例如：SINCE 2026 / 点亮未来" oninput="lgRender()" style="width:100%;">
          </div>
        </div>
        <div class="row" style="gap:12px;flex-wrap:wrap;margin-top:6px;">
          <div class="input-group" style="min-width:140px;">
            <label>图标</label>
            <select id="lg-icon" onchange="lgRender()" style="width:100%;">
              <option value="🚀">🚀 火箭</option>
              <option value="💎">💎 钻石</option>
              <option value="⚡">⚡ 闪电</option>
              <option value="🔥">🔥 火焰</option>
              <option value="🌿">🌿 绿叶</option>
              <option value="🎯">🎯 靶心</option>
              <option value="⭐">⭐ 星星</option>
              <option value="🎵">🎵 音乐</option>
              <option value="🦁">🦁 狮子</option>
              <option value="🌙">🌙 月亮</option>
              <option value="☕">☕ 咖啡</option>
              <option value="🍀">🍀 四叶草</option>
              <option value="🌈">🌈 彩虹</option>
              <option value="🔧">🔧 扳手</option>
              <option value="📈">📈 增长</option>
              <option value="🛡️">🛡️ 盾牌</option>
              <option value="🎨">🎨 调色板</option>
              <option value="💡">💡 灯泡</option>
              <option value="🏆">🏆 奖杯</option>
              <option value="✈️">✈️ 飞机</option>
            </select>
          </div>
          <div class="input-group" style="min-width:140px;">
            <label>配色方案</label>
            <select id="lg-color" onchange="lgRender()" style="width:100%;">
              <option value="0">🔵 科技蓝</option>
              <option value="1">🟠 活力橙</option>
              <option value="2">🟢 翡翠绿</option>
              <option value="3">🌸 玫瑰红</option>
              <option value="4">🟡 土豪金</option>
              <option value="5">🩵 海洋青</option>
              <option value="6">🟣 紫罗兰</option>
              <option value="7">🌲 森林绿</option>
              <option value="8">⚫ 酷黑金</option>
              <option value="9">🩷 珊瑚粉</option>
            </select>
          </div>
          <div class="input-group" style="min-width:140px;">
            <label>版式</label>
            <select id="lg-layout" onchange="lgRender()" style="width:100%;">
              <option value="horizontal">◧ 图标+文字（横排）</option>
              <option value="vertical">◨ 图标+文字（竖排）</option>
              <option value="badge">◉ 徽章式</option>
            </select>
          </div>
          <div class="input-group" style="min-width:130px;">
            <label>品牌字体</label>
            <select id="lg-font" onchange="lgRender()" style="width:100%;">
              <option value="'PingFang SC','Microsoft YaHei',sans-serif">雅黑</option>
              <option value="Georgia,serif">Georgia衬线</option>
              <option value="'Courier New',monospace">等宽</option>
              <option value="'Comic Sans MS',cursive">手写风</option>
              <option value="Impact,sans-serif">Impact粗体</option>
            </select>
          </div>
        </div>
        <div class="btn-group" style="margin-top:10px;">
          <button class="btn btn-primary" onclick="lgDownload('png')">⬇️ 下载PNG</button>
          <button class="btn btn-secondary" onclick="lgDownload('svg')">📄 下载SVG</button>
          <button class="btn btn-secondary" onclick="lgCopyBg()">🎨 切换透明/白底</button>
        </div>
        <div style="margin-top:10px;text-align:center;">
          <canvas id="lg-canvas" style="max-width:100%;border-radius:12px;background:repeating-conic-gradient(#f5f5f5 0% 25%, #fff 0% 50%) 50% / 20px 20px;border:1px solid var(--border);"></canvas>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Looka（$20-96/月）、Brandmark（$25/月）、Tailor Brands 等付费 AI Logo 生成器，本工具免费生成 20图标×10色系×3版式组合，导出高清 PNG/SVG。
        </div>
      </div>
    `,
    handler: () => { setTimeout(lgInit, 100); }
  }
];