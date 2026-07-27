// ============================================================
// ToolBox - 工具定义
// 每个工具: { id, cat, icon, name, desc, html, handler }
// ============================================================

const TOOLS = [
  // ==================== 文本工具 ====================
  {
    id: 'word-counter',
    cat: 'text',
    icon: '📊',
    name: '字数统计',
    desc: '统计文本的字数、字符数、行数、段落数',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>输入文本</label>
          <textarea id="wc-input" placeholder="在此输入或粘贴文本..." oninput="wordCount()"></textarea>
        </div>
        <div class="stats-row" id="wc-stats">
          <div class="stat-item">字数: <strong id="wc-words">0</strong></div>
          <div class="stat-item">字符数: <strong id="wc-chars">0</strong></div>
          <div class="stat-item">字符(无空格): <strong id="wc-chars-ns">0</strong></div>
          <div class="stat-item">行数: <strong id="wc-lines">0</strong></div>
          <div class="stat-item">段落: <strong id="wc-paras">0</strong></div>
        </div>
        <div class="btn-group">
          <button class="btn btn-secondary" onclick="document.getElementById('wc-input').value='';wordCount()">清空</button>
        </div>
      </div>
    `,
    handler: () => { wordCount(); }
  },
  {
    id: 'case-converter',
    cat: 'text',
    icon: '🔤',
    name: '大小写转换',
    desc: '转换为大写、小写、首字母大写、驼峰式等',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>输入文本</label>
          <textarea id="cc-input" placeholder="输入要转换的文本..." oninput="caseConvert()"></textarea>
        </div>
        <div class="row-3">
          <div class="input-group">
            <label>大写 (UPPER)</label>
            <input type="text" id="cc-upper" readonly onclick="copyId(this)" style="cursor:pointer;">
          </div>
          <div class="input-group">
            <label>小写 (lower)</label>
            <input type="text" id="cc-lower" readonly onclick="copyId(this)">
          </div>
          <div class="input-group">
            <label>首字母大写 (Title Case)</label>
            <input type="text" id="cc-title" readonly onclick="copyId(this)">
          </div>
        </div>
        <div class="row">
          <div class="input-group">
            <label>camelCase</label>
            <input type="text" id="cc-camel" readonly onclick="copyId(this)">
          </div>
          <div class="input-group">
            <label>snake_case</label>
            <input type="text" id="cc-snake" readonly onclick="copyId(this)">
          </div>
        </div>
      </div>
    `,
    handler: () => { caseConvert(); }
  },
  {
    id: 'text-reverser',
    cat: 'text',
    icon: '↔️',
    name: '文本反转',
    desc: '反转文本、单词反转、去除重复行、排序行',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>输入文本</label>
          <textarea id="tr-input" placeholder="输入文本..." oninput="textReverse()"></textarea>
        </div>
        <div class="row">
          <div class="input-group">
            <label>反转文本</label>
            <input type="text" id="tr-reverse" readonly onclick="copyId(this)">
          </div>
          <div class="input-group">
            <label>反转单词顺序</label>
            <input type="text" id="tr-words" readonly onclick="copyId(this)">
          </div>
        </div>
        <div class="row">
          <div class="input-group">
            <label>去除重复行</label>
            <textarea id="tr-unique" readonly rows="3" onclick="copyId(this)"></textarea>
          </div>
          <div class="input-group">
            <label>排序行 (A-Z)</label>
            <textarea id="tr-sort" readonly rows="3" onclick="copyId(this)"></textarea>
          </div>
        </div>
      </div>
    `,
    handler: () => { textReverse(); }
  },

  // ==================== 开发者工具 ====================
  {
    id: 'json-formatter',
    cat: 'dev',
    icon: '{ }',
    name: 'JSON 格式化',
    desc: '格式化、压缩、校验 JSON 数据',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>输入 JSON</label>
          <textarea id="json-input" placeholder='{"name":"ToolBox","version":1}' rows="5"></textarea>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="formatJSON()">✨ 格式化</button>
          <button class="btn btn-secondary" onclick="compressJSON()">📦 压缩</button>
          <button class="btn btn-secondary" onclick="validateJSON()">✅ 校验</button>
          <button class="btn btn-secondary" onclick="clearJSON()">清空</button>
        </div>
        <div class="result-box" id="json-result">
          <div class="label">输出</div>
          <pre id="json-output" style="white-space:pre-wrap;font-family:monospace;font-size:13px;"></pre>
          <button class="copy-btn" onclick="copyResult('json-output')">📋 复制</button>
        </div>
        <div id="json-error" style="color:var(--danger);margin-top:8px;display:none;"></div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'base64',
    cat: 'dev',
    icon: '🔐',
    name: 'Base64 编解码',
    desc: 'Base64 编码 / 解码，支持中文',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>输入文本</label>
          <textarea id="b64-input" placeholder="输入要编码/解码的文本..." rows="4"></textarea>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="base64Encode()">🔒 编码</button>
          <button class="btn btn-secondary" onclick="base64Decode()">🔓 解码</button>
          <button class="btn btn-secondary" onclick="clearB64()">清空</button>
        </div>
        <div class="input-group">
          <label>结果</label>
          <textarea id="b64-output" readonly rows="4" onclick="copyId(this)"></textarea>
        </div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'uuid-gen',
    cat: 'dev',
    icon: '🆔',
    name: 'UUID 生成器',
    desc: '生成 UUID v4、短 UUID、批量生成',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>生成数量</label>
          <input type="number" id="uuid-count" value="1" min="1" max="100">
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="genUUID()">🎲 生成 UUID</button>
          <button class="btn btn-secondary" onclick="genShortUUID()">🪄 短 UUID</button>
        </div>
        <div class="result-box show" id="uuid-result">
          <div class="label">结果</div>
          <textarea id="uuid-output" readonly rows="5" onclick="copyId(this)"></textarea>
          <button class="copy-btn" onclick="copyResult('uuid-output')">📋 复制</button>
        </div>
      </div>
    `,
    handler: () => { genUUID(); }
  },
  {
    id: 'url-encoder',
    cat: 'dev',
    icon: '🔗',
    name: 'URL 编解码',
    desc: 'URL 编码 / 解码',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>输入</label>
          <textarea id="url-input" placeholder="输入 URL 或文本..." rows="3"></textarea>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="urlEncode()">🔒 URL 编码</button>
          <button class="btn btn-secondary" onclick="urlDecode()">🔓 URL 解码</button>
        </div>
        <div class="input-group">
          <label>结果</label>
          <textarea id="url-output" readonly rows="3" onclick="copyId(this)"></textarea>
        </div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'html-encoder',
    cat: 'dev',
    icon: '&lt;/&gt;',
    name: 'HTML 实体编解码',
    desc: 'HTML 特殊字符转义 / 反转义',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>输入</label>
          <textarea id="html-input" placeholder="输入 HTML 或文本..." rows="3"></textarea>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="htmlEncode()">🔒 转义</button>
          <button class="btn btn-secondary" onclick="htmlDecode()">🔓 反转义</button>
        </div>
        <div class="input-group">
          <label>结果</label>
          <textarea id="html-output" readonly rows="3" onclick="copyId(this)"></textarea>
        </div>
      </div>
    `,
    handler: () => {}
  },

  // ==================== 图片工具 ====================
  {
    id: 'image-compress',
    cat: 'image',
    icon: '📦',
    name: '图片压缩',
    desc: '压缩 JPEG/PNG 图片，调整质量与尺寸',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>选择图片</label>
          <div class="file-input-wrapper">
            <span class="file-btn">📁 选择图片</span>
            <input type="file" id="img-file" accept="image/*" onchange="loadImage()">
          </div>
          <span id="img-info" style="margin-left:12px;font-size:13px;color:var(--text-light);"></span>
        </div>
        <div class="row">
          <div class="input-group">
            <label>质量 (1-100)</label>
            <input type="number" id="img-quality" value="80" min="1" max="100">
          </div>
          <div class="input-group">
            <label>最大宽度 (px, 0=不限制)</label>
            <input type="number" id="img-maxwidth" value="1920" min="0" max="7680">
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="compressImage()">📦 压缩 &amp; 下载</button>
        </div>
        <div id="img-preview" style="margin-top:16px;display:none;">
          <img id="img-preview-el" style="max-width:100%;max-height:300px;border-radius:10px;">
          <p id="img-size-info" style="margin-top:8px;font-size:13px;color:var(--text-light);"></p>
        </div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'img-to-base64',
    cat: 'image',
    icon: '🖼️',
    name: '图片转 Base64',
    desc: '将图片文件转换为 Base64 编码字符串',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>选择图片</label>
          <div class="file-input-wrapper">
            <span class="file-btn">📁 选择图片</span>
            <input type="file" id="img64-file" accept="image/*" onchange="imgToBase64()">
          </div>
        </div>
        <div class="input-group">
          <label>Base64 结果</label>
          <textarea id="img64-output" readonly rows="5" onclick="copyId(this)"></textarea>
        </div>
        <div class="btn-group">
          <button class="btn btn-success" onclick="copyResult('img64-output')">📋 复制</button>
        </div>
      </div>
    `,
    handler: () => {}
  },

  // ==================== 图片工具 (续2) ====================
  {
    id: 'bg-remover',
    cat: 'image',
    icon: '🎭',
    name: '图片去背景 + 证件照换底色',
    desc: '一键去除图片背景，支持换蓝底/白底/红底证件照',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>上传图片</label>
          <div class="file-input-wrapper">
            <span class="file-btn">📁 选择图片</span>
            <input type="file" id="bg-file" accept="image/*" onchange="loadBgImage()">
          </div>
          <span id="bg-info" style="margin-left:12px;font-size:13px;color:var(--text-light);"></span>
        </div>
        <div class="row-3">
          <div class="input-group">
            <label>容差 (0-100)</label>
            <input type="range" id="bg-tolerance" min="0" max="100" value="30" oninput="document.getElementById('bg-tol-val').textContent=this.value">
            <span id="bg-tol-val" style="font-size:13px;color:var(--text-light);">30</span>
          </div>
          <div class="input-group">
            <label>替换背景色</label>
            <select id="bg-color" style="width:120px;">
              <option value="transparent">透明</option>
              <option value="#ffffff" selected>白色</option>
              <option value="#4a90d9">蓝色 (证件照)</option>
              <option value="#cc0000">红色 (证件照)</option>
              <option value="#000000">黑色</option>
              <option value="custom">自定义</option>
            </select>
          </div>
          <div class="input-group" id="bg-custom-color-group" style="display:none;">
            <label>自定义颜色</label>
            <input type="color" id="bg-custom-color" value="#00ff00">
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="removeBg()">🎭 去背景</button>
          <button class="btn btn-success" onclick="downloadBgResult()" id="bg-download-btn" style="display:none;">📥 下载</button>
        </div>
        <div id="bg-canvas-area" style="margin-top:16px;text-align:center;display:none;">
          <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
            <div><div style="font-size:13px;color:var(--text-light);margin-bottom:6px;">原图</div><canvas id="bg-source-canvas" style="max-width:250px;max-height:250px;border:1px solid var(--border);border-radius:8px;"></canvas></div>
            <div><div style="font-size:13px;color:var(--text-light);margin-bottom:6px;">结果</div><canvas id="bg-result-canvas" style="max-width:250px;max-height:250px;border:1px solid var(--border);border-radius:8px;"></canvas></div>
          </div>
        </div>
        <div id="bg-status" style="margin-top:8px;font-size:13px;color:var(--text-light);"></div>
        <div style="margin-top:10px;padding:10px;background:#fef3c7;border-radius:8px;font-size:12px;color:#92400e;line-height:1.6;">
          <strong>💡 使用说明：</strong> 点击图片背景区域选择要移除的颜色，调整容差控制范围。适合纯色背景（如证件照白底/蓝底），复杂背景效果有限。
        </div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'batch-compress',
    cat: 'image',
    icon: '🗜️',
    name: '批量图片压缩',
    desc: '批量压缩多张图片，显示压缩率对比，支持ZIP打包下载',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>选择图片（支持多选）</label>
          <div class="file-input-wrapper">
            <span class="file-btn">📁 选择图片</span>
            <input type="file" id="bc-files" accept="image/*" multiple onchange="loadBatchCompress()">
          </div>
          <span id="bc-info" style="margin-left:12px;font-size:13px;color:var(--text-light);"></span>
        </div>
        <div class="row">
          <div class="input-group">
            <label>质量 (1-100)</label>
            <input type="range" id="bc-quality" min="1" max="100" value="70" oninput="document.getElementById('bc-q-val').textContent=this.value">
            <span id="bc-q-val" style="font-size:13px;color:var(--text-light);">70</span>
          </div>
          <div class="input-group">
            <label>最大宽度 (px)</label>
            <input type="number" id="bc-maxwidth" value="1920" min="100" max="7680" style="width:100px;">
          </div>
          <div class="input-group">
            <label>输出格式</label>
            <select id="bc-format" style="width:100px;">
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="runBatchCompress()">🗜️ 开始压缩</button>
          <button class="btn btn-secondary" onclick="downloadBatchCompressed()" id="bc-download-btn" style="display:none;">📥 下载全部 (ZIP)</button>
        </div>
        <div id="bc-loading" style="display:none;text-align:center;padding:20px;color:var(--text-light);">⏳ 正在压缩...</div>
        <div id="bc-list" style="margin-top:12px;"></div>
        <div id="bc-status" style="margin-top:8px;font-size:13px;color:var(--text-light);"></div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'image-watermark',
    cat: 'image',
    icon: '💧',
    name: '批量加水印',
    desc: '给图片添加文字或图片水印，批量处理，保护版权',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>上传图片（支持多选）</label>
          <div class="file-input-wrapper">
            <span class="file-btn">📁 选择图片</span>
            <input type="file" id="wm-files" accept="image/*" multiple onchange="loadWatermarkImages()">
          </div>
          <span id="wm-info" style="margin-left:12px;font-size:13px;color:var(--text-light);"></span>
        </div>
        <div class="row-3">
          <div class="input-group">
            <label>水印类型</label>
            <select id="wm-type" onchange="toggleWatermarkType()" style="width:120px;">
              <option value="text">文字水印</option>
              <option value="image">图片水印</option>
            </select>
          </div>
          <div class="input-group" id="wm-text-group">
            <label>水印文字</label>
            <input type="text" id="wm-text" value="ToolBox" style="width:140px;">
          </div>
          <div class="input-group" id="wm-image-group" style="display:none;">
            <label>水印图片</label>
            <input type="file" id="wm-image-file" accept="image/*">
          </div>
        </div>
        <div class="row-3">
          <div class="input-group">
            <label>位置</label>
            <select id="wm-position" style="width:100px;">
              <option value="center">居中</option>
              <option value="topleft">左上</option>
              <option value="topright">右上</option>
              <option value="bottomleft">左下</option>
              <option value="bottomright" selected>右下</option>
              <option value="tile">平铺</option>
            </select>
          </div>
          <div class="input-group">
            <label>透明度</label>
            <input type="range" id="wm-opacity" min="0" max="100" value="30" oninput="document.getElementById('wm-op-val').textContent=this.value+'%'">
            <span id="wm-op-val" style="font-size:13px;color:var(--text-light);">30%</span>
          </div>
          <div class="input-group">
            <label>大小</label>
            <input type="number" id="wm-size" value="36" min="8" max="200" style="width:80px;"> px
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="runWatermark()">💧 添加水印</button>
          <button class="btn btn-secondary" onclick="downloadWatermarked()" id="wm-download-btn" style="display:none;">📥 下载全部 (ZIP)</button>
        </div>
        <div id="wm-loading" style="display:none;text-align:center;padding:20px;color:var(--text-light);">⏳ 正在处理...</div>
        <div id="wm-list" style="margin-top:12px;"></div>
        <div id="wm-status" style="margin-top:8px;font-size:13px;color:var(--text-light);"></div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'image-stitch',
    cat: 'image',
    icon: '🧩',
    name: '长图拼接',
    desc: '将多张截图/图片垂直或水平拼接为一张长图',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>上传图片（按顺序拼接）</label>
          <div class="file-input-wrapper">
            <span class="file-btn">📁 选择图片</span>
            <input type="file" id="st-files" accept="image/*" multiple onchange="loadStitchImages()">
          </div>
          <span id="st-info" style="margin-left:12px;font-size:13px;color:var(--text-light);"></span>
        </div>
        <div class="row">
          <div class="input-group">
            <label>拼接方向</label>
            <select id="st-direction" style="width:120px;">
              <option value="vertical">垂直拼接</option>
              <option value="horizontal">水平拼接</option>
            </select>
          </div>
          <div class="input-group">
            <label>间距 (px)</label>
            <input type="number" id="st-gap" value="0" min="0" max="50" style="width:80px;">
          </div>
          <div class="input-group">
            <label>背景色</label>
            <input type="color" id="st-bgcolor" value="#ffffff">
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="runStitch()">🧩 拼接</button>
          <button class="btn btn-success" onclick="downloadStitchResult()" id="st-download-btn" style="display:none;">📥 下载长图</button>
        </div>
        <div id="st-loading" style="display:none;text-align:center;padding:20px;color:var(--text-light);">⏳ 正在拼接...</div>
        <div id="st-preview" style="margin-top:12px;text-align:center;"></div>
        <div id="st-status" style="margin-top:8px;font-size:13px;color:var(--text-light);"></div>
      </div>
    `,
    handler: () => {}
  },

  // ==================== 转换工具 ====================
  {
    id: 'unit-converter',
    cat: 'convert',
    icon: '📏',
    name: '单位换算',
    desc: '长度、重量、温度、面积、体积、速度换算',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>换算类型</label>
          <select id="uc-type" onchange="unitConvert()">
            <option value="length">长度</option>
            <option value="weight">重量</option>
            <option value="temperature">温度</option>
            <option value="area">面积</option>
            <option value="volume">体积</option>
            <option value="speed">速度</option>
          </select>
        </div>
        <div class="row">
          <div class="input-group">
            <label>从</label>
            <input type="number" id="uc-value" value="1" oninput="unitConvert()">
            <select id="uc-from" style="margin-top:8px;width:100%;" onchange="unitConvert()"></select>
          </div>
          <div class="input-group">
            <label>到</label>
            <input type="text" id="uc-result" readonly style="font-size:18px;font-weight:700;color:var(--primary);">
            <select id="uc-to" style="margin-top:8px;width:100%;" onchange="unitConvert()"></select>
          </div>
        </div>
      </div>
    `,
    handler: () => { initUnitConverter(); }
  },
  {
    id: 'number-base',
    cat: 'convert',
    icon: '🔢',
    name: '进制转换',
    desc: '2进制、8进制、10进制、16进制互转',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>输入数字</label>
          <input type="text" id="nb-input" value="255" oninput="numberBaseConvert()">
        </div>
        <div class="input-group">
          <label>输入进制</label>
          <select id="nb-from" onchange="numberBaseConvert()">
            <option value="2">2进制</option>
            <option value="8">8进制</option>
            <option value="10" selected>10进制</option>
            <option value="16">16进制</option>
          </select>
        </div>
        <div class="row-3">
          <div class="input-group"><label>2进制</label><input type="text" id="nb-bin" readonly onclick="copyId(this)"></div>
          <div class="input-group"><label>8进制</label><input type="text" id="nb-oct" readonly onclick="copyId(this)"></div>
          <div class="input-group"><label>10进制</label><input type="text" id="nb-dec" readonly onclick="copyId(this)"></div>
        </div>
        <div class="input-group">
          <label>16进制</label>
          <input type="text" id="nb-hex" readonly onclick="copyId(this)" style="font-size:18px;font-weight:600;">
        </div>
      </div>
    `,
    handler: () => { numberBaseConvert(); }
  },

  // ==================== 安全工具 ====================
  {
    id: 'password-gen',
    cat: 'security',
    icon: '🔑',
    name: '密码生成器',
    desc: '生成高强度随机密码，自定义长度和字符类型',
    html: `
      <div class="tool-card">
        <div class="row">
          <div class="input-group">
            <label>密码长度</label>
            <input type="number" id="pg-length" value="16" min="4" max="128">
          </div>
          <div class="input-group">
            <label>生成数量</label>
            <input type="number" id="pg-count" value="3" min="1" max="50">
          </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:16px;">
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
            <input type="checkbox" id="pg-upper" checked> 大写 A-Z
          </label>
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
            <input type="checkbox" id="pg-lower" checked> 小写 a-z
          </label>
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
            <input type="checkbox" id="pg-digit" checked> 数字 0-9
          </label>
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
            <input type="checkbox" id="pg-symbol" checked> 符号 !@#$%
          </label>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="genPassword()">🎲 生成密码</button>
        </div>
        <div class="result-box show" id="pg-result">
          <div class="label">生成的密码</div>
          <textarea id="pg-output" readonly rows="5" onclick="copyId(this)"></textarea>
          <button class="copy-btn" onclick="copyResult('pg-output')">📋 复制</button>
        </div>
        <div id="pg-strength" style="margin-top:8px;font-size:13px;"></div>
      </div>
    `,
    handler: () => { genPassword(); }
  },
  {
    id: 'hash-gen',
    cat: 'security',
    icon: '#️⃣',
    name: 'Hash 生成器',
    desc: 'MD5、SHA-1、SHA-256、SHA-512 哈希计算',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>输入文本</label>
          <textarea id="hash-input" placeholder="输入要计算哈希的文本..." rows="3" oninput="genHash()"></textarea>
        </div>
        <div class="input-group">
          <label>算法</label>
          <select id="hash-algo" onchange="genHash()" style="width:200px;">
            <option value="MD5">MD5</option>
            <option value="SHA-1">SHA-1</option>
            <option value="SHA-256" selected>SHA-256</option>
            <option value="SHA-512">SHA-512</option>
          </select>
        </div>
        <div class="input-group">
          <label>Hash 结果</label>
          <input type="text" id="hash-output" readonly onclick="copyId(this)" style="font-family:monospace;font-size:14px;">
        </div>
        <div class="btn-group">
          <button class="btn btn-success" onclick="copyResult('hash-output')">📋 复制</button>
        </div>
      </div>
    `,
    handler: () => { genHash(); }
  },
  {
    id: 'random-num',
    cat: 'security',
    icon: '🎲',
    name: '随机数生成器',
    desc: '生成指定范围内的随机整数或浮点数',
    html: `
      <div class="tool-card">
        <div class="row">
          <div class="input-group">
            <label>最小值</label>
            <input type="number" id="rn-min" value="1">
          </div>
          <div class="input-group">
            <label>最大值</label>
            <input type="number" id="rn-max" value="100">
          </div>
        </div>
        <div class="input-group">
          <label>生成数量</label>
          <input type="number" id="rn-count" value="5" min="1" max="100">
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:12px;">
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
            <input type="checkbox" id="rn-float"> 浮点数
          </label>
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;">
            <input type="checkbox" id="rn-unique" checked> 不重复
          </label>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="genRandomNum()">🎲 生成</button>
        </div>
        <div class="result-box show" id="rn-result">
          <div class="label">结果</div>
          <div id="rn-output" style="font-size:18px;font-weight:600;color:var(--primary);"></div>
          <button class="copy-btn" onclick="copyResult('rn-output')">📋 复制</button>
        </div>
      </div>
    `,
    handler: () => { genRandomNum(); }
  },

  // ==================== 时间工具 ====================
  {
    id: 'timestamp',
    cat: 'time',
    icon: '⏰',
    name: '时间戳转换',
    desc: 'Unix 时间戳与日期时间互转',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>时间戳 (秒)</label>
          <input type="number" id="ts-input" oninput="tsToDate()">
          <div class="btn-group" style="margin-top:8px;">
            <button class="btn btn-secondary" onclick="document.getElementById('ts-input').value=Math.floor(Date.now()/1000);tsToDate()">🕐 当前时间戳</button>
          </div>
        </div>
        <div class="result-box show" id="ts-result">
          <div class="label">转换结果</div>
          <div id="ts-output" style="font-size:18px;"></div>
        </div>
        <hr style="margin:24px 0;border-color:var(--border);">
        <div class="input-group">
          <label>日期转时间戳</label>
          <input type="datetime-local" id="ts-date" onchange="dateToTs()">
        </div>
        <div class="input-group">
          <label>结果 (秒)</label>
          <input type="text" id="ts-ts-output" readonly onclick="copyId(this)">
        </div>
      </div>
    `,
    handler: () => {
      document.getElementById('ts-input').value = Math.floor(Date.now() / 1000);
      tsToDate();
      document.getElementById('ts-date').value = new Date().toISOString().slice(0, 16);
      dateToTs();
    }
  },
  {
    id: 'date-diff',
    cat: 'time',
    icon: '📅',
    name: '日期计算器',
    desc: '计算两个日期之间的天数差，或日期加减天数',
    html: `
      <div class="tool-card">
        <h3 style="margin-bottom:16px;">📆 日期差计算</h3>
        <div class="row">
          <div class="input-group">
            <label>开始日期</label>
            <input type="date" id="dd-start">
          </div>
          <div class="input-group">
            <label>结束日期</label>
            <input type="date" id="dd-end">
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="dateDiff()">📊 计算差值</button>
        </div>
        <div class="result-box show" id="dd-result">
          <div class="label">结果</div>
          <div id="dd-output"></div>
        </div>
        <hr style="margin:24px 0;border-color:var(--border);">
        <h3 style="margin-bottom:16px;">➕ 日期加减</h3>
        <div class="row">
          <div class="input-group">
            <label>基准日期</label>
            <input type="date" id="da-base">
          </div>
          <div class="input-group">
            <label>天数</label>
            <input type="number" id="da-days" value="7">
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="dateAdd()">➕ 加</button>
          <button class="btn btn-secondary" onclick="dateSubtract()">➖ 减</button>
        </div>
        <div class="input-group">
          <label>结果</label>
          <input type="text" id="da-result" readonly onclick="copyId(this)" style="font-size:18px;font-weight:600;color:var(--primary);">
        </div>
      </div>
    `,
    handler: () => {
      const today = new Date().toISOString().slice(0, 10);
      document.getElementById('dd-start').value = today;
      document.getElementById('dd-end').value = today;
      document.getElementById('da-base').value = today;
      dateDiff();
    }
  },

  // ==================== 颜色工具 ====================
  {
    id: 'color-converter',
    cat: 'color',
    icon: '🎨',
    name: '颜色转换',
    desc: 'HEX、RGB、HSL、HSV 颜色格式互转',
    html: `
      <div class="tool-card">
        <div class="color-row">
          <input type="color" id="cl-picker" value="#6366f1" onchange="colorPickerChange()">
          <input type="text" id="cl-hex" value="#6366f1" oninput="colorFromHex()" style="flex:1;font-family:monospace;font-size:16px;font-weight:600;">
        </div>
        <div class="row-3" style="margin-top:16px;">
          <div class="input-group"><label>RGB</label><input type="text" id="cl-rgb" readonly onclick="copyId(this)"></div>
          <div class="input-group"><label>HSL</label><input type="text" id="cl-hsl" readonly onclick="copyId(this)"></div>
          <div class="input-group"><label>HSV</label><input type="text" id="cl-hsv" readonly onclick="copyId(this)"></div>
        </div>
        <div class="result-box show" id="cl-preview" style="padding:0;border:none;">
          <div id="cl-color-preview" style="height:60px;border-radius:10px;background:#6366f1;"></div>
        </div>
      </div>
    `,
    handler: () => { colorPickerChange(); }
  },

  // ==================== 新：文本工具 (续) ====================
  {
    id: 'text-to-speech',
    cat: 'text',
    icon: '🔊',
    name: '文本转语音',
    desc: '将文字转换为语音朗读，支持中文、英文等多种语言',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>输入文本</label>
          <textarea id="tts-input" placeholder="输入要朗读的文字..." rows="4">你好，欢迎使用在线工具箱！This is a text to speech demo.</textarea>
        </div>
        <div class="row">
          <div class="input-group">
            <label>语速</label>
            <input type="range" id="tts-rate" min="0.5" max="2" step="0.1" value="1" oninput="document.getElementById('tts-rate-val').textContent=this.value">
            <span id="tts-rate-val" style="font-size:13px;color:var(--text-light);">1</span>
          </div>
          <div class="input-group">
            <label>音调</label>
            <input type="range" id="tts-pitch" min="0.5" max="2" step="0.1" value="1" oninput="document.getElementById('tts-pitch-val').textContent=this.value">
            <span id="tts-pitch-val" style="font-size:13px;color:var(--text-light);">1</span>
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="speakText()">🔊 朗读</button>
          <button class="btn btn-secondary" onclick="stopSpeak()">⏹ 停止</button>
        </div>
        <div id="tts-status" style="margin-top:12px;font-size:14px;color:var(--text-light);"></div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'chinese-convert',
    cat: 'text',
    icon: '🀄',
    name: '简繁转换',
    desc: '简体中文与繁体中文互转',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>输入文本</label>
          <textarea id="cc2-input" placeholder="输入要转换的中文..." rows="4" oninput="chineseConvert()"></textarea>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="toSimplified()">📝 转简体</button>
          <button class="btn btn-secondary" onclick="toTraditional()">📜 转繁体</button>
        </div>
        <div class="input-group">
          <label>结果</label>
          <textarea id="cc2-output" readonly rows="4" onclick="copyId(this)"></textarea>
        </div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'morse-code',
    cat: 'text',
    icon: '📡',
    name: '摩斯密码',
    desc: '文本与摩斯密码互转',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>输入文本</label>
          <textarea id="mc-input" placeholder="输入文本或摩斯密码..." rows="3" oninput="morseConvert()"></textarea>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="toMorse()">📡 转摩斯密码</button>
          <button class="btn btn-secondary" onclick="fromMorse()">🔤 转文本</button>
        </div>
        <div class="input-group">
          <label>结果</label>
          <textarea id="mc-output" readonly rows="3" onclick="copyId(this)"></textarea>
        </div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'num-to-chinese',
    cat: 'text',
    icon: '💴',
    name: '数字转大写',
    desc: '阿拉伯数字金额转中文大写（人民币）',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>输入金额</label>
          <input type="text" id="nc-input" value="12345.67" oninput="numToChinese()" placeholder="输入数字金额">
        </div>
        <div class="input-group">
          <label>中文大写</label>
          <textarea id="nc-output" readonly rows="3" onclick="copyId(this)" style="font-size:18px;font-weight:600;color:var(--primary);"></textarea>
        </div>
      </div>
    `,
    handler: () => { numToChinese(); }
  },
  {
    id: 'text-diff',
    cat: 'text',
    icon: '🔍',
    name: '文本对比',
    desc: '对比两段文本的差异，高亮显示不同之处',
    html: `
      <div class="tool-card">
        <div class="row">
          <div class="input-group">
            <label>文本 A（原版）</label>
            <textarea id="diff-a" rows="6" placeholder="输入原版文本..." oninput="textDiff()"></textarea>
          </div>
          <div class="input-group">
            <label>文本 B（修改版）</label>
            <textarea id="diff-b" rows="6" placeholder="输入修改版文本..." oninput="textDiff()"></textarea>
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="textDiff()">🔄 对比</button>
          <button class="btn btn-secondary" onclick="swapDiff()">⇄ 交换</button>
        </div>
        <div id="diff-result" style="margin-top:16px;font-family:monospace;font-size:14px;line-height:1.8;white-space:pre-wrap;background:#f8fafc;padding:16px;border-radius:10px;border:1px solid var(--border);min-height:60px;"></div>
      </div>
    `,
    handler: () => {}
  },

  // ==================== 新：图片工具 (续) ====================
  {
    id: 'image-convert',
    cat: 'image',
    icon: '🔄',
    name: '图片格式转换',
    desc: 'WebP / PNG / JPG / BMP / GIF 格式互转',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>选择图片</label>
          <div class="file-input-wrapper">
            <span class="file-btn">📁 选择图片</span>
            <input type="file" id="ic-file" accept="image/*" onchange="loadConvertImage()">
          </div>
          <span id="ic-info" style="margin-left:12px;font-size:13px;color:var(--text-light);"></span>
        </div>
        <div class="input-group">
          <label>转换目标格式</label>
          <select id="ic-format" style="width:200px;">
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPG (JPEG)</option>
            <option value="image/webp">WebP</option>
            <option value="image/bmp">BMP</option>
            <option value="image/gif">GIF</option>
          </select>
        </div>
        <div class="input-group">
          <label>图片质量 (仅 JPG/WebP 有效)</label>
          <input type="range" id="ic-quality" min="10" max="100" value="90" oninput="document.getElementById('ic-q-val').textContent=this.value">
          <span id="ic-q-val" style="font-size:13px;color:var(--text-light);">90</span>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="convertImageFormat()">🔄 转换 &amp; 下载</button>
        </div>
        <div id="ic-preview" style="margin-top:16px;display:none;">
          <img id="ic-preview-el" style="max-width:100%;max-height:200px;border-radius:10px;">
          <p id="ic-size-info" style="margin-top:4px;font-size:13px;color:var(--text-light);"></p>
        </div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'image-crop',
    cat: 'image',
    icon: '✂️',
    name: '图片裁剪',
    desc: '裁剪图片为指定尺寸，支持正方形、4:3、16:9 等比例',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>选择图片</label>
          <div class="file-input-wrapper">
            <span class="file-btn">📁 选择图片</span>
            <input type="file" id="crop-file" accept="image/*" onchange="loadCropImage()">
          </div>
        </div>
        <div class="row">
          <div class="input-group">
            <label>裁剪比例</label>
            <select id="crop-ratio" onchange="updateCropPreview()">
              <option value="free">自由裁剪</option>
              <option value="1:1">1:1 正方形</option>
              <option value="4:3">4:3</option>
              <option value="3:2">3:2</option>
              <option value="16:9">16:9 宽屏</option>
              <option value="9:16">9:16 竖屏</option>
            </select>
          </div>
          <div class="input-group">
            <label>输出尺寸</label>
            <select id="crop-size">
              <option value="original">原始尺寸</option>
              <option value="800">800px</option>
              <option value="1200">1200px</option>
              <option value="1920">1920px</option>
            </select>
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="cropAndDownload()">✂️ 裁剪 &amp; 下载</button>
        </div>
        <div id="crop-preview" style="margin-top:16px;display:none;">
          <div style="position:relative;display:inline-block;max-width:100%;">
            <img id="crop-preview-el" style="max-width:100%;max-height:400px;border-radius:10px;">
            <div id="crop-overlay" style="position:absolute;border:3px dashed var(--primary);background:rgba(99,102,241,0.1);pointer-events:none;display:none;"></div>
          </div>
        </div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'image-ocr',
    cat: 'image',
    icon: '👁️',
    name: '图片文字识别 (OCR)',
    desc: '识别图片中的文字，支持中文、英文，基于 Tesseract.js',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>选择图片</label>
          <div class="file-input-wrapper">
            <span class="file-btn">📁 选择图片</span>
            <input type="file" id="ocr-file" accept="image/*" onchange="loadOcrImage()">
          </div>
        </div>
        <div class="input-group">
          <label>识别语言</label>
          <select id="ocr-lang" style="width:200px;">
            <option value="chi_sim+eng">中文 + 英文（推荐）</option>
            <option value="eng">英文</option>
            <option value="chi_sim">简体中文</option>
            <option value="chi_tra">繁体中文</option>
            <option value="jpn">日文</option>
            <option value="kor">韩文</option>
          </select>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="runOcr()">🔍 识别文字</button>
        </div>
        <div id="ocr-preview" style="margin-top:16px;display:none;">
          <img id="ocr-preview-el" style="max-width:100%;max-height:200px;border-radius:10px;">
        </div>
        <div class="input-group" style="margin-top:12px;">
          <label>识别结果</label>
          <textarea id="ocr-output" readonly rows="5" onclick="copyId(this)"></textarea>
        </div>
        <div id="ocr-status" style="font-size:13px;color:var(--text-light);margin-top:4px;"></div>
      </div>
    `,
    handler: () => {}
  },

  // ==================== 新：开发者工具 (续) ====================
  {
    id: 'qrcode-gen',
    cat: 'dev',
    icon: '📱',
    name: '二维码生成器',
    desc: '生成文本、网址、WiFi的二维码，支持下载',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>输入内容（文本、网址等）</label>
          <textarea id="qr-input" rows="3" placeholder="输入要生成二维码的内容..." oninput="genQRCode()">https://toolbox.vercel.app</textarea>
        </div>
        <div class="row">
          <div class="input-group">
            <label>尺寸</label>
            <select id="qr-size" onchange="genQRCode()">
              <option value="128">128x128</option>
              <option value="200" selected>200x200</option>
              <option value="300">300x300</option>
              <option value="500">500x500</option>
            </select>
          </div>
          <div class="input-group">
            <label>纠错等级</label>
            <select id="qr-level" onchange="genQRCode()">
              <option value="L">低 (L)</option>
              <option value="M" selected>中 (M)</option>
              <option value="Q">较高 (Q)</option>
              <option value="H">高 (H)</option>
            </select>
          </div>
        </div>
        <div id="qr-result" style="text-align:center;margin-top:16px;min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:var(--bg);border-radius:var(--radius-sm);padding:20px;">
          <div id="qr-canvas-container"></div>
        </div>
        <div class="btn-group" style="justify-content:center;margin-top:12px;">
          <button class="btn btn-success" onclick="downloadQR()">📥 下载二维码</button>
        </div>
      </div>
    `,
    handler: () => { setTimeout(genQRCode, 100); }
  },
  {
    id: 'regex-tester',
    cat: 'dev',
    icon: '🔬',
    name: '正则测试器',
    desc: '测试正则表达式，实时高亮匹配结果',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>正则表达式</label>
          <input type="text" id="regex-pattern" value="[a-zA-Z]+@[a-zA-Z]+\\.[a-zA-Z]+" placeholder="输入正则..." oninput="testRegex()" style="font-family:monospace;">
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;">
          <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" id="regex-g" checked onchange="testRegex()"> 全局 g</label>
          <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" id="regex-i" onchange="testRegex()"> 忽略大小写 i</label>
          <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" id="regex-m" onchange="testRegex()"> 多行 m</label>
        </div>
        <div class="input-group">
          <label>测试文本</label>
          <textarea id="regex-text" rows="6" oninput="testRegex()" placeholder="输入测试文本...">我的邮箱是 user@example.com，也可以联系 admin@test.org.cn</textarea>
        </div>
        <div id="regex-result" style="margin-top:12px;font-size:14px;"></div>
        <div id="regex-highlight" style="margin-top:8px;font-family:monospace;font-size:14px;line-height:1.8;white-space:pre-wrap;background:#f8fafc;padding:16px;border-radius:10px;border:1px solid var(--border);"></div>
      </div>
    `,
    handler: () => { setTimeout(testRegex, 100); }
  },
  {
    id: 'markdown-preview',
    cat: 'dev',
    icon: '📝',
    name: 'Markdown 预览',
    desc: '实时预览 Markdown 渲染效果',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>Markdown 内容</label>
          <textarea id="md-input" rows="8" oninput="renderMarkdown()"># 欢迎使用 Markdown 预览

## 这是什么？
这是一个 **Markdown** 实时预览工具。

## 功能列表
- 标题 (H1 ~ H6)
- **粗体**、*斜体*、~~删除线~~
- [链接](https://example.com)
- 列表和代码块

\`\`\`javascript
console.log("Hello World!");
\`\`\`

> 引用文字

| 列1 | 列2 |
|-----|-----|
| A | B |
</textarea>
        </div>
        <div class="input-group">
          <label>预览效果</label>
          <div id="md-preview" style="background:white;border:1px solid var(--border);border-radius:var(--radius-sm);padding:20px;min-height:200px;line-height:1.8;"></div>
        </div>
      </div>
    `,
    handler: () => { setTimeout(renderMarkdown, 100); }
  },
  {
    id: 'ip-lookup',
    cat: 'dev',
    icon: '🌐',
    name: 'IP 信息查询',
    desc: '查看当前设备的 IP 地址和网络信息',
    html: `
      <div class="tool-card">
        <div class="btn-group">
          <button class="btn btn-primary" onclick="lookupIP()">🌐 查询我的 IP</button>
        </div>
        <div id="ip-result" style="margin-top:16px;display:none;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div style="background:var(--bg);padding:16px;border-radius:10px;text-align:center;">
              <div style="font-size:12px;color:var(--text-light);">IPv4</div>
              <div id="ip-v4" style="font-size:20px;font-weight:700;color:var(--primary);">-</div>
            </div>
            <div style="background:var(--bg);padding:16px;border-radius:10px;text-align:center;">
              <div style="font-size:12px;color:var(--text-light);">IPv6</div>
              <div id="ip-v6" style="font-size:20px;font-weight:700;color:var(--primary);">-</div>
            </div>
          </div>
          <div style="background:var(--bg);padding:16px;border-radius:10px;text-align:center;margin-top:12px;">
            <div style="font-size:12px;color:var(--text-light);">浏览器</div>
            <div id="ip-ua" style="font-size:14px;margin-top:4px;word-break:break-all;"></div>
          </div>
        </div>
      </div>
    `,
    handler: () => {}
  },

  // ==================== 新分类：媒体工具 ====================
  {
    id: 'video-download-guide',
    cat: 'media',
    icon: '🎬',
    name: '抖音/TikTok 视频去水印下载',
    desc: '使用第三方工具下载抖音/TikTok无水印视频',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>📌 使用说明</label>
          <p style="font-size:14px;color:var(--text-light);line-height:1.8;">
            复制抖音/TikTok视频分享链接，粘贴到以下工具的输入框，即可下载无水印视频。
          </p>
        </div>
        <div style="display:grid;gap:12px;margin-top:16px;">
          <div style="background:var(--bg);border-radius:10px;padding:16px;border:1px solid var(--border);">
            <div style="font-weight:600;font-size:16px;display:flex;align-items:center;gap:8px;">
              <span>🎬 SSSTik.io</span>
              <span style="font-size:11px;background:#22c55e;color:white;padding:2px 8px;border-radius:4px;">推荐</span>
            </div>
            <p style="font-size:13px;color:var(--text-light);margin:4px 0 8px;">全球最流行的TikTok/抖音去水印下载工具，粘贴链接即可下载无水印视频，支持HD画质</p>
            <a href="https://ssstik.io/" target="_blank" style="color:var(--primary);font-weight:600;">https://ssstik.io/ →</a>
          </div>
          <div style="background:var(--bg);border-radius:10px;padding:16px;border:1px solid var(--border);">
            <div style="font-weight:600;font-size:16px;display:flex;align-items:center;gap:8px;">
              <span>⚡ SnapTik</span>
              <span style="font-size:11px;background:#22c55e;color:white;padding:2px 8px;border-radius:4px;">推荐</span>
            </div>
            <p style="font-size:13px;color:var(--text-light);margin:4px 0 8px;">支持抖音、TikTok、快手、小红书等，无需注册，粘贴链接即可下载</p>
            <a href="https://snaptik.app/en3" target="_blank" style="color:var(--primary);font-weight:600;">https://snaptik.app/en3 →</a>
          </div>
        </div>
        <div style="margin-top:16px;padding:12px;background:#fef3c7;border-radius:10px;font-size:13px;color:#92400e;">
          ⚠️ 第三方工具可能随时变更，使用时请注意保护个人隐私，不要输入敏感信息。
        </div>
      </div>
    `,
    handler: () => {}
  },
    {
      id: 'video-to-gif',
      cat: 'media',
      icon: '🎞️',
      name: '视频转 GIF',
      desc: '将视频片段转换为 GIF 动图，自定义时长、帧率、尺寸',
      html: `
        <div class="tool-card">
          <div class="input-group">
            <label>选择视频文件</label>
            <div class="file-input-wrapper">
              <span class="file-btn">📁 选择视频</span>
              <input type="file" id="vg-file" accept="video/*" onchange="loadVideoForGif()">
            </div>
            <span id="vg-info" style="margin-left:12px;font-size:13px;color:var(--text-light);"></span>
          </div>
          <div id="vg-controls" style="display:none;">
            <div style="margin-top:12px;">
              <video id="vg-video" controls style="max-width:100%;max-height:300px;border-radius:10px;background:black;"></video>
            </div>
            <div class="row-3" style="margin-top:12px;">
              <div class="input-group">
                <label>开始时间 (秒)</label>
                <input type="number" id="vg-start" value="0" min="0" step="0.5" style="width:100px;">
              </div>
              <div class="input-group">
                <label>时长 (秒)</label>
                <input type="number" id="vg-duration" value="3" min="0.5" max="30" step="0.5" style="width:100px;">
              </div>
              <div class="input-group">
                <label>帧率 (fps)</label>
                <input type="number" id="vg-fps" value="10" min="5" max="30" style="width:100px;">
              </div>
            </div>
            <div class="row">
              <div class="input-group">
                <label>宽度 (px, 0=原宽)</label>
                <input type="number" id="vg-width" value="0" min="0" max="1920" style="width:100px;">
              </div>
              <div class="input-group">
                <label>颜色数量</label>
                <select id="vg-colors" style="width:120px;">
                  <option value="256">256色 (高质量)</option>
                  <option value="128">128色</option>
                  <option value="64">64色 (小文件)</option>
                  <option value="32">32色</option>
                </select>
              </div>
            </div>
            <div class="btn-group" style="margin-top:12px;">
              <button class="btn btn-primary" onclick="generateGif()">🎞️ 生成 GIF</button>
            </div>
          </div>
          <div id="vg-loading" style="display:none;text-align:center;padding:30px;color:var(--text-light);">
            <div style="font-size:48px;margin-bottom:12px;">⏳</div>
            <div>正在生成 GIF，请稍候...</div>
          </div>
          <div id="vg-result" style="margin-top:12px;text-align:center;display:none;"></div>
          <div id="vg-status" style="margin-top:8px;font-size:13px;color:var(--text-light);"></div>
        </div>
      `,
      handler: () => {}
    },

  // ==================== AI工具 ====================
  {
    id: 'openclaw-install',
    cat: 'ai',
    icon: '🦞',
    name: '小龙虾 OpenClaw 安装指南',
    desc: '开源AI智能体框架 - 详细安装步骤与代码',
    html: `
      <div class="tool-card">
        <div class="ai-section">
          <h3 style="font-size:20px;margin-bottom:12px;">🦞 小龙虾 (OpenClaw) 是什么？</h3>
          <p style="font-size:14px;color:var(--text-light);line-height:1.8;">
            OpenClaw 是一个<strong>开源的个人 AI 智能体（AI Agent）</strong>，运行在你自己的设备上，数据完全私有。
            可通过 WhatsApp、Telegram、Discord、微信、钉钉等 20+ 聊天平台与你交互，
            帮你处理清理收件箱、发送邮件、管理日历等日常任务。
          </p>
        </div>

        <div class="ai-section" style="margin-top:20px;">
          <h4 style="font-size:16px;margin-bottom:10px;color:var(--primary);">📋 前置要求</h4>
          <ul style="font-size:14px;color:var(--text-light);line-height:1.8;padding-left:20px;">
            <li>Node.js 22.22.3+ 或 Node.js 24.15+（推荐）</li>
            <li>npm / pnpm / bun（包管理器）</li>
            <li>Linux / macOS / Windows 均可</li>
            <li>Docker（可选，推荐用 Docker 安装）</li>
          </ul>
        </div>

        <div class="ai-section" style="margin-top:20px;">
          <h4 style="font-size:16px;margin-bottom:10px;color:var(--primary);">🚀 方式一：一键安装（推荐）</h4>
          <p style="font-size:13px;color:var(--text-light);margin-bottom:8px;">macOS / Linux 终端执行：</p>
          <pre style="background:#1e293b;color:#e2e8f0;padding:16px;border-radius:10px;font-size:14px;overflow-x:auto;white-space:pre-wrap;word-break:break-all;"><code>curl -fsSL https://openclaw.ai/install.sh | bash</code></pre>

          <p style="font-size:13px;color:var(--text-light);margin:12px 0 8px;">Windows PowerShell 执行：</p>
          <pre style="background:#1e293b;color:#e2e8f0;padding:16px;border-radius:10px;font-size:14px;overflow-x:auto;white-space:pre-wrap;word-break:break-all;"><code>iwr -useb https://openclaw.ai/install.ps1 | iex</code></pre>
        </div>

        <div class="ai-section" style="margin-top:20px;">
          <h4 style="font-size:16px;margin-bottom:10px;color:var(--primary);">📦 方式二：npm 安装</h4>
          <pre style="background:#1e293b;color:#e2e8f0;padding:16px;border-radius:10px;font-size:14px;overflow-x:auto;"><code>npm install -g openclaw@latest</code></pre>
        </div>

        <div class="ai-section" style="margin-top:20px;">
          <h4 style="font-size:16px;margin-bottom:10px;color:var(--primary);">🐳 方式三：Docker 安装</h4>
          <p style="font-size:13px;color:var(--text-light);margin-bottom:8px;">创建 docker-compose.yml：</p>
          <pre style="background:#1e293b;color:#e2e8f0;padding:16px;border-radius:10px;font-size:13px;overflow-x:auto;"><code>services:
  openclaw-gateway:
    image: ghcr.io/openclaw/openclaw:latest
    ports:
      - "18789:18789"
    volumes:
      - ~/.openclaw:/home/node/.openclaw
    environment:
      - TZ=Asia/Shanghai
    restart: unless-stopped</code></pre>
          <p style="font-size:13px;color:var(--text-light);margin:8px 0;">启动：</p>
          <pre style="background:#1e293b;color:#e2e8f0;padding:16px;border-radius:10px;font-size:14px;overflow-x:auto;"><code>docker compose up -d</code></pre>
        </div>

        <div class="ai-section" style="margin-top:20px;">
          <h4 style="font-size:16px;margin-bottom:10px;color:var(--primary);">⚙️ 初始化配置</h4>
          <p style="font-size:14px;color:var(--text-light);line-height:1.8;">
            安装完成后，运行以下命令进行初始化设置：
          </p>
          <pre style="background:#1e293b;color:#e2e8f0;padding:16px;border-radius:10px;font-size:14px;overflow-x:auto;"><code>openclaw onboard --install-daemon</code></pre>
          <p style="font-size:13px;color:var(--text-light);margin-top:8px;line-height:1.6;">
            初始化向导会引导你设置：API密钥配置、消息渠道接入、工作空间、技能等。
            完成后 Gateway 会作为后台服务自动运行。
          </p>
        </div>

        <div class="ai-section" style="margin-top:20px;">
          <h4 style="font-size:16px;margin-bottom:10px;color:var(--primary);">🔍 常用命令</h4>
          <pre style="background:#1e293b;color:#e2e8f0;padding:16px;border-radius:10px;font-size:14px;overflow-x:auto;"><code># 查看运行状态
openclaw gateway status

# 打开控制面板
openclaw dashboard

# 发送消息测试
openclaw message send --target +1234567890 --message "你好"

# 与AI对话
openclaw agent --message "帮我写一封邮件"

# 更新版本
openclaw update</code></pre>
        </div>

        <div class="ai-section" style="margin-top:20px;">
          <h4 style="font-size:16px;margin-bottom:10px;color:var(--primary);">🌐 支持的聊天平台</h4>
          <p style="font-size:14px;color:var(--text-light);line-height:1.8;">
            WhatsApp · Telegram · Discord · Slack · Signal · iMessage · 飞书 · 钉钉 · 企业微信 · QQ · LINE · Matrix · Microsoft Teams · Google Chat · IRC · 等 20+ 平台
          </p>
        </div>

        <div style="margin-top:20px;padding:16px;background:#f0fdf4;border-radius:10px;border:1px solid #bbf7d0;">
          <p style="font-size:14px;color:#166534;line-height:1.8;">
            📌 <strong>官方网站</strong>：<a href="https://openclaw.ai" target="_blank" style="color:var(--primary);">https://openclaw.ai</a><br>
            📌 <strong>GitHub</strong>：<a href="https://github.com/openclaw/openclaw" target="_blank" style="color:var(--primary);">https://github.com/openclaw/openclaw</a><br>
            📌 <strong>中文文档</strong>：<a href="https://www.clawfather.cn/" target="_blank" style="color:var(--primary);">https://www.clawfather.cn/</a><br>
            📌 <strong>Docker 镜像</strong>：ghcr.io/openclaw/openclaw:latest
          </p>
        </div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'free-ai-tools',
    cat: 'ai',
    icon: '🤖',
    name: '免费AI工具推荐',
    desc: '精选免费AI工具合集，含ChatGPT、DeepSeek、Ollama等',
    html: `
      <div class="tool-card">
        <div class="ai-section">
          <h3 style="font-size:20px;margin-bottom:16px;">🤖 精选免费AI工具推荐</h3>
          <p style="font-size:14px;color:var(--text-light);line-height:1.8;margin-bottom:20px;">
            以下工具均经过验证，提供免费使用额度或完全免费开源，可直接在线使用或本地部署。
          </p>
        </div>

        <div style="display:grid;gap:16px;">
          <!-- ChatGPT -->
          <div style="background:var(--bg);border-radius:12px;padding:20px;border:1px solid var(--border);">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <span style="font-size:28px;">💬</span>
              <span style="font-size:18px;font-weight:600;">ChatGPT</span>
              <span style="font-size:12px;background:#dbeafe;color:#1e40af;padding:2px 8px;border-radius:20px;">免费版可用</span>
            </div>
            <p style="font-size:13px;color:var(--text-light);line-height:1.6;">
              OpenAI 出品，支持对话、编程、翻译、写作等。免费版可使用 GPT-3.5 模型，无限次数。
            </p>
            <a href="https://chat.openai.com" target="_blank" style="display:inline-block;margin-top:8px;color:var(--primary);font-size:13px;">🔗 https://chat.openai.com</a>
          </div>

          <!-- DeepSeek -->
          <div style="background:var(--bg);border-radius:12px;padding:20px;border:1px solid var(--border);">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <span style="font-size:28px;">🧠</span>
              <span style="font-size:18px;font-weight:600;">DeepSeek</span>
              <span style="font-size:12px;background:#dcfce7;color:#166534;padding:2px 8px;border-radius:20px;">完全免费</span>
            </div>
            <p style="font-size:13px;color:var(--text-light);line-height:1.6;">
              国产开源大模型，推理能力强，支持超长上下文（1M tokens）。网页版完全免费，无需注册即可使用。
            </p>
            <a href="https://chat.deepseek.com" target="_blank" style="display:inline-block;margin-top:8px;color:var(--primary);font-size:13px;">🔗 https://chat.deepseek.com</a>
          </div>

          <!-- 通义千问 -->
          <div style="background:var(--bg);border-radius:12px;padding:20px;border:1px solid var(--border);">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <span style="font-size:28px;">☁️</span>
              <span style="font-size:18px;font-weight:600;">通义千问 (Qwen)</span>
              <span style="font-size:12px;background:#dcfce7;color:#166534;padding:2px 8px;border-radius:20px;">完全免费</span>
            </div>
            <p style="font-size:13px;color:var(--text-light);line-height:1.6;">
              阿里云出品，支持对话、文档分析、图片理解、代码生成等。免费无限制使用。
            </p>
            <a href="https://tongyi.aliyun.com" target="_blank" style="display:inline-block;margin-top:8px;color:var(--primary);font-size:13px;">🔗 https://tongyi.aliyun.com</a>
          </div>

          <!-- Gemini -->
          <div style="background:var(--bg);border-radius:12px;padding:20px;border:1px solid var(--border);">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <span style="font-size:28px;">🌟</span>
              <span style="font-size:18px;font-weight:600;">Google Gemini</span>
              <span style="font-size:12px;background:#dbeafe;color:#1e40af;padding:2px 8px;border-radius:20px;">免费版可用</span>
            </div>
            <p style="font-size:13px;color:var(--text-light);line-height:1.6;">
              Google 出品，支持多模态（图片、视频、音频理解）。免费版功能强大，可上传文件分析。
            </p>
            <a href="https://gemini.google.com" target="_blank" style="display:inline-block;margin-top:8px;color:var(--primary);font-size:13px;">🔗 https://gemini.google.com</a>
          </div>

          <!-- Claude -->
          <div style="background:var(--bg);border-radius:12px;padding:20px;border:1px solid var(--border);">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <span style="font-size:28px;">🟣</span>
              <span style="font-size:18px;font-weight:600;">Claude (Anthropic)</span>
              <span style="font-size:12px;background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:20px;">免费版有限额</span>
            </div>
            <p style="font-size:13px;color:var(--text-light);line-height:1.6;">
              Anthropic 出品，编码能力强，支持长文本分析。免费版每日有使用次数限制。
            </p>
            <a href="https://claude.ai" target="_blank" style="display:inline-block;margin-top:8px;color:var(--primary);font-size:13px;">🔗 https://claude.ai</a>
          </div>

          <!-- Ollama -->
          <div style="background:var(--bg);border-radius:12px;padding:20px;border:1px solid var(--border);">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <span style="font-size:28px;">🦙</span>
              <span style="font-size:18px;font-weight:600;">Ollama（本地部署）</span>
              <span style="font-size:12px;background:#dcfce7;color:#166534;padding:2px 8px;border-radius:20px;">完全免费开源</span>
            </div>
            <p style="font-size:13px;color:var(--text-light);line-height:1.6;">
              本地运行大语言模型，支持 Llama、Qwen、DeepSeek、Mistral 等主流模型。隐私安全，无需联网。
            </p>
            <a href="https://ollama.ai" target="_blank" style="display:inline-block;margin-top:8px;color:var(--primary);font-size:13px;">🔗 https://ollama.ai</a>
            <div style="margin-top:8px;padding:8px 12px;background:#1e293b;color:#e2e8f0;border-radius:8px;font-size:12px;font-family:monospace;">
              # 一键安装 curl -fsSL https://ollama.ai/install.sh | sh<br>
              # 运行模型 ollama run qwen2.5
            </div>
          </div>

          <!-- Hugging Face -->
          <div style="background:var(--bg);border-radius:12px;padding:20px;border:1px solid var(--border);">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <span style="font-size:28px;">🤗</span>
              <span style="font-size:18px;font-weight:600;">Hugging Face</span>
              <span style="font-size:12px;background:#dcfce7;color:#166534;padding:2px 8px;border-radius:20px;">完全免费</span>
            </div>
            <p style="font-size:13px;color:var(--text-light);line-height:1.6;">
              AI模型社区，提供免费在线使用各种AI模型：文本生成、图片生成、语音识别、翻译等。
            </p>
            <a href="https://huggingface.co/chat" target="_blank" style="display:inline-block;margin-top:8px;color:var(--primary);font-size:13px;">🔗 https://huggingface.co/chat</a>
          </div>

          <!-- 文心一言 -->
          <div style="background:var(--bg);border-radius:12px;padding:20px;border:1px solid var(--border);">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <span style="font-size:28px;">🐻</span>
              <span style="font-size:18px;font-weight:600;">文心一言 (百度)</span>
              <span style="font-size:12px;background:#dbeafe;color:#1e40af;padding:2px 8px;border-radius:20px;">免费版可用</span>
            </div>
            <p style="font-size:13px;color:var(--text-light);line-height:1.6;">
              百度出品，中文理解能力强，支持对话、文档分析、图片生成。免费版功能丰富。
            </p>
            <a href="https://yiyan.baidu.com" target="_blank" style="display:inline-block;margin-top:8px;color:var(--primary);font-size:13px;">🔗 https://yiyan.baidu.com</a>
          </div>

          <!-- 豆包 -->
          <div style="background:var(--bg);border-radius:12px;padding:20px;border:1px solid var(--border);">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <span style="font-size:28px;">🔴</span>
              <span style="font-size:18px;font-weight:600;">豆包 (字节跳动)</span>
              <span style="font-size:12px;background:#dcfce7;color:#166534;padding:2px 8px;border-radius:20px;">完全免费</span>
            </div>
            <p style="font-size:13px;color:var(--text-light);line-height:1.6;">
              字节跳动出品，支持对话、图片理解、文档分析、AI绘画等。完全免费，不限次数。
            </p>
            <a href="https://www.doubao.com" target="_blank" style="display:inline-block;margin-top:8px;color:var(--primary);font-size:13px;">🔗 https://www.doubao.com</a>
          </div>

          <!-- Stable Diffusion WebUI -->
          <div style="background:var(--bg);border-radius:12px;padding:20px;border:1px solid var(--border);">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <span style="font-size:28px;">🎨</span>
              <span style="font-size:18px;font-weight:600;">Stable Diffusion WebUI</span>
              <span style="font-size:12px;background:#dcfce7;color:#166534;padding:2px 8px;border-radius:20px;">完全免费开源</span>
            </div>
            <p style="font-size:13px;color:var(--text-light);line-height:1.6;">
              本地部署的AI绘画工具，免费开源，支持文生图、图生图。需要 NVIDIA 显卡（至少4GB显存）。
            </p>
            <a href="https://github.com/AUTOMATIC1111/stable-diffusion-webui" target="_blank" style="display:inline-block;margin-top:8px;color:var(--primary);font-size:13px;">🔗 GitHub 仓库</a>
          </div>

          <!-- Perplexity -->
          <div style="background:var(--bg);border-radius:12px;padding:20px;border:1px solid var(--border);">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <span style="font-size:28px;">🔍</span>
              <span style="font-size:18px;font-weight:600;">Perplexity AI</span>
              <span style="font-size:12px;background:#dbeafe;color:#1e40af;padding:2px 8px;border-radius:20px;">免费版可用</span>
            </div>
            <p style="font-size:13px;color:var(--text-light);line-height:1.6;">
              AI搜索引擎，联网搜索+AI回答，引用来源可查。免费版每天可使用多次搜索。
            </p>
            <a href="https://www.perplexity.ai" target="_blank" style="display:inline-block;margin-top:8px;color:var(--primary);font-size:13px;">🔗 https://www.perplexity.ai</a>
          </div>
        </div>

        <div style="margin-top:24px;padding:16px;background:#f0f9ff;border-radius:10px;border:1px solid #bae6fd;">
          <p style="font-size:13px;color:#075985;line-height:1.8;">
            💡 <strong>提示</strong>：以上免费工具大多有使用限制（如免费版每日次数、功能限制等）。
            如需更强大的功能，可以考虑付费升级或使用 API 接入方式。
          </p>
        </div>
      </div>
    `,
    handler: () => {}
  },

  // ==================== 文档转换工具 ====================
  {
    id: 'excel-viewer',
    cat: 'document',
    icon: '📊',
    name: 'Excel 在线查看器',
    desc: '上传 Excel 文件，在线查看表格、导出为 CSV/JSON/HTML',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>选择 Excel 文件 (.xlsx / .xls / .csv)</label>
          <div class="file-input-wrapper">
            <span class="file-btn">📁 选择文件</span>
            <input type="file" id="ev-file" accept=".xlsx,.xls,.csv" onchange="loadExcelFile()">
          </div>
          <span id="ev-info" style="margin-left:12px;font-size:13px;color:var(--text-light);"></span>
        </div>
        <div id="ev-controls" style="display:none;margin-bottom:12px;">
          <div class="input-group">
            <label>工作表</label>
            <select id="ev-sheet" onchange="renderExcelSheet()" style="width:200px;"></select>
          </div>
          <div class="btn-group">
            <button class="btn btn-primary" onclick="exportExcelCSV()">📄 导出 CSV</button>
            <button class="btn btn-secondary" onclick="exportExcelJSON()">📦 导出 JSON</button>
            <button class="btn btn-secondary" onclick="exportExcelHTML()">🌐 导出 HTML 表格</button>
          </div>
        </div>
        <div id="ev-table-container" style="overflow-x:auto;margin-top:12px;border:1px solid var(--border);border-radius:10px;min-height:100px;padding:8px;background:white;"></div>
        <div id="ev-loading" style="display:none;text-align:center;padding:40px;color:var(--text-light);">
          <div style="font-size:48px;margin-bottom:12px;">⏳</div>
          <div>正在加载 SheetJS 库，请稍候...</div>
        </div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'text-to-pdf',
    cat: 'document',
    icon: '📄',
    name: '文本转 PDF',
    desc: '将文本内容生成可下载的 PDF 文件，支持中文和自定义字体',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>输入文本内容</label>
          <textarea id="tp-input" rows="8" placeholder="输入要转为 PDF 的文本内容...">ToolBox 在线工具集

这是一个由文本生成的 PDF 文件示例。

你可以在这里输入任意内容，
包括多行文本和段落。

支持中文、English、数字 12345。

生成后自动下载为 PDF 文件。</textarea>
        </div>
        <div class="row">
          <div class="input-group">
            <label>页面大小</label>
            <select id="tp-format" style="width:150px;">
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
              <option value="a5">A5</option>
            </select>
          </div>
          <div class="input-group">
            <label>字体大小</label>
            <input type="number" id="tp-fontsize" value="14" min="8" max="48" style="width:100px;">
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="generateTextPDF()">📄 生成 PDF</button>
          <button class="btn btn-secondary" onclick="document.getElementById('tp-input').value=''">清空</button>
        </div>
        <div id="tp-status" style="margin-top:12px;font-size:14px;color:var(--text-light);"></div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'html-to-pdf',
    cat: 'document',
    icon: '🌐',
    name: 'HTML 转 PDF',
    desc: '将 HTML 内容转换为 PDF 文件下载',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>输入 HTML 内容</label>
          <textarea id="hp-input" rows="8" placeholder="输入 HTML 代码..." style="font-family:monospace;font-size:13px;"><h1 style="color:#6366f1;">Hello, ToolBox!</h1>
<p>这是一段 <strong>HTML</strong> 内容转换成的 PDF。</p>
<ul>
  <li>支持标题、列表、表格</li>
  <li>支持颜色和样式</li>
  <li>支持中文内容</li>
</ul>
<table border="1" cellpadding="5" style="border-collapse:collapse;width:100%;">
  <tr><th>姓名</th><th>分数</th></tr>
  <tr><td>张三</td><td>95</td></tr>
  <tr><td>李四</td><td>88</td></tr>
</table></textarea>
        </div>
        <div class="row">
          <div class="input-group">
            <label>页面大小</label>
            <select id="hp-format" style="width:150px;">
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
              <option value="a5">A5</option>
            </select>
          </div>
          <div class="input-group">
            <label>边距 (mm)</label>
            <input type="number" id="hp-margin" value="15" min="5" max="50" style="width:100px;">
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="generateHTMLPDF()">🌐 生成 PDF</button>
          <div style="margin-top:8px;font-size:13px;color:var(--text-light);">💡 也可使用浏览器打印功能：右键 → 打印 → 另存为 PDF</div>
        </div>
        <div id="hp-preview" style="margin-top:16px;display:none;border:1px solid var(--border);border-radius:10px;padding:20px;background:white;min-height:100px;" id="hp-preview-div"></div>
        <div id="hp-status" style="margin-top:8px;font-size:14px;color:var(--text-light);"></div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'pdf-text-extract',
    cat: 'document',
    icon: '📃',
    name: 'PDF 文本提取',
    desc: '上传 PDF 文件，提取其中的文本内容',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>选择 PDF 文件</label>
          <div class="file-input-wrapper">
            <span class="file-btn">📁 选择 PDF</span>
            <input type="file" id="pe-file" accept=".pdf" onchange="loadPDFFile()">
          </div>
          <span id="pe-info" style="margin-left:12px;font-size:13px;color:var(--text-light);"></span>
        </div>
        <div class="input-group">
          <label>提取设置</label>
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px;">
            <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" id="pe-merge-lines" checked onchange="renderPDFText()"> 合并行</label>
            <label style="display:flex;align-items:center;gap:4px;"><input type="checkbox" id="pe-show-pages" checked onchange="renderPDFText()"> 显示页码</label>
          </div>
        </div>
        <div id="pe-controls" style="display:none;">
          <div class="btn-group">
            <button class="btn btn-success" onclick="copyResult('pe-output')">📋 复制全部</button>
            <button class="btn btn-secondary" onclick="downloadPDFText()">📥 下载文本</button>
          </div>
        </div>
        <div class="input-group" style="margin-top:12px;">
          <label>提取结果</label>
          <textarea id="pe-output" readonly rows="10" onclick="copyId(this)"></textarea>
        </div>
        <div id="pe-loading" style="display:none;text-align:center;padding:40px;color:var(--text-light);">
          <div style="font-size:48px;margin-bottom:12px;">⏳</div>
          <div>正在加载 PDF.js 库，请稍候...</div>
        </div>
        <div id="pe-pages" style="margin-top:8px;font-size:13px;color:var(--text-light);"></div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'image-to-pdf',
    cat: 'document',
    icon: '🖼️',
    name: '图片转 PDF',
    desc: '将多张图片合并为一份 PDF 文件，支持排序',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>选择图片（支持多选，按选择顺序排列）</label>
          <div class="file-input-wrapper">
            <span class="file-btn">📁 选择图片</span>
            <input type="file" id="ip-images" accept="image/*" multiple onchange="loadImagesForPDF()">
          </div>
          <span id="ip-info" style="margin-left:12px;font-size:13px;color:var(--text-light);"></span>
        </div>
        <div class="input-group">
          <label>PDF 页面设置</label>
          <div class="row" style="margin-top:8px;">
            <select id="ip-format" style="width:120px;">
              <option value="a4">A4</option>
              <option value="a3">A3</option>
              <option value="letter">Letter</option>
            </select>
            <select id="ip-orientation" style="width:120px;">
              <option value="portrait">纵向</option>
              <option value="landscape">横向</option>
            </select>
            <select id="ip-fit" style="width:120px;">
              <option value="contain">适应页面</option>
              <option value="cover">填充页面</option>
            </select>
          </div>
        </div>
        <div id="ip-preview" style="display:none;">
          <div id="ip-thumbnails" style="display:flex;flex-wrap:wrap;gap:8px;margin:12px 0;"></div>
          <div class="btn-group">
            <button class="btn btn-primary" onclick="generateImagePDF()">📄 生成 PDF</button>
            <button class="btn btn-secondary" onclick="clearImagesForPDF()">清空</button>
          </div>
        </div>
        <div id="ip-status" style="margin-top:12px;font-size:14px;color:var(--text-light);"></div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'pdf-to-image',
    cat: 'document',
    icon: '📸',
    name: 'PDF 转图片',
    desc: '将 PDF 每一页转换为 PNG/JPG 图片下载',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>选择 PDF 文件</label>
          <div class="file-input-wrapper">
            <span class="file-btn">📁 选择 PDF</span>
            <input type="file" id="pi-file" accept=".pdf" onchange="loadPDFForImage()">
          </div>
          <span id="pi-info" style="margin-left:12px;font-size:13px;color:var(--text-light);"></span>
        </div>
        <div class="row">
          <div class="input-group">
            <label>输出格式</label>
            <select id="pi-format" style="width:150px;">
              <option value="png">PNG</option>
              <option value="jpeg">JPG (较小)</option>
            </select>
          </div>
          <div class="input-group">
            <label>质量 (仅 JPG)</label>
            <input type="number" id="pi-quality" value="90" min="10" max="100" style="width:100px;">
          </div>
        </div>
        <div id="pi-controls" style="display:none;">
          <div class="btn-group">
            <button class="btn btn-primary" onclick="convertPDFToImages()">📸 全部导出</button>
            <button class="btn btn-secondary" onclick="downloadAllPDFImages()" id="pi-download-all" style="display:none;">📥 下载全部 (ZIP)</button>
          </div>
        </div>
        <div id="pi-gallery" style="display:flex;flex-wrap:wrap;gap:12px;margin-top:16px;justify-content:center;"></div>
        <div id="pi-loading" style="display:none;text-align:center;padding:40px;color:var(--text-light);">
          <div style="font-size:48px;margin-bottom:12px;">⏳</div>
          <div>正在渲染 PDF 页面...</div>
        </div>
        <div id="pi-status" style="margin-top:8px;font-size:13px;color:var(--text-light);"></div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'word-parser',
    cat: 'document',
    icon: '📝',
    name: 'Word 文档解析',
    desc: '上传 .docx 文件，提取文本内容，导出为 TXT 或 PDF',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>选择 Word 文件 (.docx)</label>
          <div class="file-input-wrapper">
            <span class="file-btn">📁 选择文件</span>
            <input type="file" id="wp-file" accept=".docx" onchange="loadWordFile()">
          </div>
          <span id="wp-info" style="margin-left:12px;font-size:13px;color:var(--text-light);"></span>
        </div>
        <div id="wp-controls" style="display:none;">
          <div class="btn-group">
            <button class="btn btn-success" onclick="copyResult('wp-output')">📋 复制文本</button>
            <button class="btn btn-primary" onclick="wordToPDF()">📄 导出为 PDF</button>
            <button class="btn btn-secondary" onclick="downloadWordText()">📥 下载 TXT</button>
          </div>
        </div>
        <div class="input-group" style="margin-top:12px;">
          <label>提取的文本内容</label>
          <textarea id="wp-output" readonly rows="10" onclick="copyId(this)"></textarea>
        </div>
        <div id="wp-loading" style="display:none;text-align:center;padding:40px;color:var(--text-light);">
          <div style="font-size:48px;margin-bottom:12px;">⏳</div>
          <div>正在解析 .docx 文件...</div>
        </div>
        <div id="wp-status" style="margin-top:8px;font-size:13px;color:var(--text-light);"></div>
        <div style="margin-top:12px;padding:12px;background:#f0f9ff;border-radius:10px;font-size:13px;color:#075985;line-height:1.6;">
          💡 .docx 文件本质是 ZIP 压缩包，我们直接在浏览器中解压提取文字内容，
          所有操作在本地完成，不会上传到任何服务器。
        </div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'excel-to-pdf',
    cat: 'document',
    icon: '📊',
    name: 'Excel 转 PDF',
    desc: '将 Excel 表格导出为 PDF 文件',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>选择 Excel 文件</label>
          <div class="file-input-wrapper">
            <span class="file-btn">📁 选择文件</span>
            <input type="file" id="ep-file" accept=".xlsx,.xls,.csv" onchange="loadExcelForPDF()">
          </div>
          <span id="ep-info" style="margin-left:12px;font-size:13px;color:var(--text-light);"></span>
        </div>
        <div id="ep-controls" style="display:none;">
          <div class="row">
            <div class="input-group">
              <label>工作表</label>
              <select id="ep-sheet" onchange="previewExcelForPDF()" style="width:200px;"></select>
            </div>
            <div class="input-group">
              <label>页面方向</label>
              <select id="ep-orientation" style="width:120px;">
                <option value="portrait">纵向</option>
                <option value="landscape" selected>横向（推荐）</option>
              </select>
            </div>
          </div>
          <div class="btn-group">
            <button class="btn btn-primary" onclick="generateExcelPDF()">📄 导出为 PDF</button>
          </div>
        </div>
        <div id="ep-preview" style="overflow-x:auto;margin-top:12px;border:1px solid var(--border);border-radius:10px;padding:8px;background:white;min-height:50px;display:none;"></div>
        <div id="ep-loading" style="display:none;text-align:center;padding:40px;color:var(--text-light);">
          <div style="font-size:48px;margin-bottom:12px;">⏳</div>
          <div>正在加载...</div>
        </div>
        <div id="ep-status" style="margin-top:8px;font-size:13px;color:var(--text-light);"></div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'pdf-merge',
    cat: 'document',
    icon: '🔗',
    name: 'PDF 合并',
    desc: '将多个 PDF 文件合并为一个 PDF 文件',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>选择 PDF 文件（支持多选，按选择顺序合并）</label>
          <div class="file-input-wrapper">
            <span class="file-btn">📁 选择 PDF 文件</span>
            <input type="file" id="pm-files" accept=".pdf" multiple onchange="loadPDFsForMerge()">
          </div>
          <span id="pm-info" style="margin-left:12px;font-size:13px;color:var(--text-light);"></span>
        </div>
        <div id="pm-file-list" style="margin:12px 0;display:none;">
          <div style="font-weight:600;margin-bottom:8px;">已选择文件：</div>
          <ul id="pm-list" style="padding-left:20px;font-size:14px;color:var(--text-light);"></ul>
          <div class="btn-group">
            <button class="btn btn-primary" onclick="mergePDFs()">🔗 合并 PDF</button>
            <button class="btn btn-secondary" onclick="clearPDFsForMerge()">清空</button>
          </div>
        </div>
        <div id="pm-loading" style="display:none;text-align:center;padding:40px;color:var(--text-light);">
          <div style="font-size:48px;margin-bottom:12px;">⏳</div>
          <div>正在合并 PDF...</div>
        </div>
        <div id="pm-status" style="margin-top:8px;font-size:13px;color:var(--text-light);"></div>
      </div>
    `,
    handler: () => {}
  },

  // ==================== 群众心声 ====================
  {
    id: 'peoples-voice',
    cat: 'voice',
    icon: '🗣️',
    name: '群众心声',
    desc: '提交你想要的工具建议，投票支持，前3名将被实现！',
    html: `
      <div class="tool-card">
        <div style="text-align:center;padding:40px 20px;">
          <div style="font-size:64px;margin-bottom:16px;">🗣️</div>
          <h3 style="font-size:22px;margin-bottom:10px;">群众心声</h3>
          <p style="font-size:15px;color:var(--text-light);line-height:1.8;margin-bottom:20px;">
            你想要的工具，告诉我们！<br>
            提交建议 → 投票支持 → 排行榜更新 → 前3名自动实现
          </p>
          <a href="voice.html" target="_blank" style="display:inline-block;background:linear-gradient(135deg,#ea580c,#f97316);color:white;padding:14px 36px;border-radius:30px;text-decoration:none;font-size:16px;font-weight:600;box-shadow:0 4px 14px rgba(249,115,22,0.3);transition:all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
            🚀 进入群众心声 →
          </a>
          <div style="margin-top:20px;display:flex;justify-content:center;gap:30px;flex-wrap:wrap;">
            <div style="text-align:center;">
              <div style="font-size:28px;font-weight:700;color:var(--primary);">📤</div>
              <div style="font-size:13px;color:var(--text-light);">提交建议</div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:28px;font-weight:700;color:var(--primary);">👍</div>
              <div style="font-size:13px;color:var(--text-light);">投票支持</div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:28px;font-weight:700;color:var(--primary);">🏆</div>
              <div style="font-size:13px;color:var(--text-light);">排行榜</div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:28px;font-weight:700;color:var(--primary);">✅</div>
              <div style="font-size:13px;color:var(--text-light);">自动实现</div>
            </div>
          </div>
        </div>
      </div>
    `,
    handler: () => {}
  },

  // ==================== ⭐ 群众心声前3名自动实现 ====================

  // ---- 第1名: PDF转Word工具 ----
  {
    id: 'pdf-to-word',
    cat: 'document',
    icon: '📄➡️📝',
    name: 'PDF转Word工具',
    desc: '在线免费将PDF文件转换为Word文档，支持批量转换',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>选择 PDF 文件（支持多选）</label>
          <div class="file-input-wrapper">
            <span class="file-btn">📁 选择 PDF 文件</span>
            <input type="file" id="pw-files" accept=".pdf" multiple onchange="loadPDFForWord()">
          </div>
          <span id="pw-info" style="margin-left:12px;font-size:13px;color:var(--text-light);"></span>
        </div>
        <div class="row">
          <div class="input-group">
            <label>输出格式</label>
            <select id="pw-format" style="width:150px;">
              <option value="docx">Word (.docx)</option>
              <option value="txt">纯文本 (.txt)</option>
            </select>
          </div>
          <div class="input-group">
            <label>提取方式</label>
            <select id="pw-mode" style="width:150px;">
              <option value="text">仅文本（快速）</option>
              <option value="rich">保留格式（慢）</option>
            </select>
          </div>
        </div>
        <div id="pw-file-list" style="display:none;margin:12px 0;">
          <ul id="pw-list" style="padding-left:20px;font-size:14px;color:var(--text-light);"></ul>
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="convertPDFToWord()" id="pw-convert-btn">📄 转换为 Word</button>
          <button class="btn btn-secondary" onclick="clearPDFForWord()">清空</button>
        </div>
        <div id="pw-loading" style="display:none;text-align:center;padding:40px;color:var(--text-light);">
          <div style="font-size:48px;margin-bottom:12px;">⏳</div>
          <div id="pw-loading-text">正在加载 PDF 解析引擎...</div>
        </div>
        <div id="pw-preview" style="display:none;margin-top:16px;">
          <div class="input-group">
            <label>提取内容预览（可编辑后下载）</label>
            <textarea id="pw-preview-text" rows="10" style="font-family:monospace;font-size:13px;"></textarea>
          </div>
          <div class="btn-group">
            <button class="btn btn-success" onclick="downloadWordFromPreview()" id="pw-download-btn">📥 下载 Word 文档</button>
            <button class="btn btn-secondary" onclick="copyResult('pw-preview-text')">📋 复制文本</button>
          </div>
        </div>
        <div id="pw-status" style="margin-top:8px;font-size:13px;color:var(--text-light);"></div>
        <div style="margin-top:12px;padding:12px;background:#f0f9ff;border-radius:10px;font-size:13px;color:#075985;line-height:1.6;">
          💡 所有处理在浏览器本地完成，文件不会上传到任何服务器。支持批量转换，每个 PDF 会生成独立的 Word 文件。
        </div>
      </div>
    `,
    handler: () => {}
  },

  // ---- 第2名: 在线PS修图工具 ----
  {
    id: 'ps-editor',
    cat: 'image',
    icon: '🎨',
    name: '在线PS修图工具',
    desc: '类似Photoshop的在线图片编辑工具，支持图层、滤镜等',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>上传图片编辑</label>
          <div class="file-input-wrapper">
            <span class="file-btn">📁 打开图片</span>
            <input type="file" id="ps-file" accept="image/*" onchange="loadPSImage()">
          </div>
          <span id="ps-info" style="margin-left:12px;font-size:13px;color:var(--text-light);"></span>
        </div>
        <div id="ps-editor-area" style="display:none;">
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin:16px 0;">
            <div style="flex:1;min-width:200px;">
              <div style="background:var(--bg);border-radius:10px;padding:16px;border:1px solid var(--border);">
                <h4 style="font-size:14px;font-weight:600;margin-bottom:12px;">🛠️ 基础调整</h4>
                <div class="input-group" style="margin-bottom:8px;">
                  <label>亮度 (-100 ~ 100)</label>
                  <input type="range" id="ps-brightness" min="-100" max="100" value="0" oninput="applyPSFilter()">
                  <span id="ps-brightness-val" style="font-size:12px;color:var(--text-light);">0</span>
                </div>
                <div class="input-group" style="margin-bottom:8px;">
                  <label>对比度 (-100 ~ 100)</label>
                  <input type="range" id="ps-contrast" min="-100" max="100" value="0" oninput="applyPSFilter()">
                  <span id="ps-contrast-val" style="font-size:12px;color:var(--text-light);">0</span>
                </div>
                <div class="input-group" style="margin-bottom:8px;">
                  <label>饱和度 (-100 ~ 100)</label>
                  <input type="range" id="ps-saturation" min="-100" max="100" value="0" oninput="applyPSFilter()">
                  <span id="ps-saturation-val" style="font-size:12px;color:var(--text-light);">0</span>
                </div>
                <div class="input-group" style="margin-bottom:8px;">
                  <label>色相 (-180 ~ 180)</label>
                  <input type="range" id="ps-hue" min="-180" max="180" value="0" oninput="applyPSFilter()">
                  <span id="ps-hue-val" style="font-size:12px;color:var(--text-light);">0</span>
                </div>
                <div class="input-group" style="margin-bottom:8px;">
                  <label>模糊 (0 ~ 20)</label>
                  <input type="range" id="ps-blur" min="0" max="20" value="0" step="0.5" oninput="applyPSFilter()">
                  <span id="ps-blur-val" style="font-size:12px;color:var(--text-light);">0</span>
                </div>
              </div>
            </div>
            <div style="flex:1;min-width:200px;">
              <div style="background:var(--bg);border-radius:10px;padding:16px;border:1px solid var(--border);">
                <h4 style="font-size:14px;font-weight:600;margin-bottom:12px;">🎨 滤镜预设</h4>
                <div class="btn-group" style="flex-wrap:wrap;">
                  <button class="btn btn-sm" onclick="applyPSPreset('grayscale')" style="font-size:12px;padding:6px 12px;">⚫ 灰度</button>
                  <button class="btn btn-sm" onclick="applyPSPreset('sepia')" style="font-size:12px;padding:6px 12px;">🟫 怀旧</button>
                  <button class="btn btn-sm" onclick="applyPSPreset('invert')" style="font-size:12px;padding:6px 12px;">🔄 反色</button>
                  <button class="btn btn-sm" onclick="applyPSPreset('vintage')" style="font-size:12px;padding:6px 12px;">📷 复古</button>
                  <button class="btn btn-sm" onclick="applyPSPreset('cool')" style="font-size:12px;padding:6px 12px;">❄️ 冷色</button>
                  <button class="btn btn-sm" onclick="applyPSPreset('warm')" style="font-size:12px;padding:6px 12px;">☀️ 暖色</button>
                  <button class="btn btn-sm" onclick="applyPSPreset('reset')" style="font-size:12px;padding:6px 12px;">🔄 重置</button>
                </div>
              </div>
              <div style="background:var(--bg);border-radius:10px;padding:16px;border:1px solid var(--border);margin-top:12px;">
                <h4 style="font-size:14px;font-weight:600;margin-bottom:12px;">✂️ 变换操作</h4>
                <div class="btn-group" style="flex-wrap:wrap;">
                  <button class="btn btn-sm" onclick="rotatePSImage(90)" style="font-size:12px;padding:6px 12px;">↻ 右旋90°</button>
                  <button class="btn btn-sm" onclick="rotatePSImage(-90)" style="font-size:12px;padding:6px 12px;">↺ 左旋90°</button>
                  <button class="btn btn-sm" onclick="flipPSImage('horizontal')" style="font-size:12px;padding:6px 12px;">⇄ 水平翻转</button>
                  <button class="btn btn-sm" onclick="flipPSImage('vertical')" style="font-size:12px;padding:6px 12px;">⇅ 垂直翻转</button>
                </div>
              </div>
            </div>
          </div>
          <div style="text-align:center;margin-bottom:16px;">
            <div style="position:relative;display:inline-block;max-width:100%;">
              <canvas id="ps-canvas" style="max-width:100%;max-height:500px;border-radius:10px;border:1px solid var(--border);background:repeating-conic-gradient(#e2e8f0 0% 25%,transparent 0% 50%) 0 0 / 20px 20px;"></canvas>
            </div>
          </div>
          <div class="btn-group" style="justify-content:center;">
            <button class="btn btn-primary" onclick="downloadPSImage()">📥 下载编辑后的图片</button>
            <button class="btn btn-secondary" onclick="resetPSImage()">🔄 重置原图</button>
          </div>
        </div>
        <div id="ps-status" style="margin-top:8px;font-size:13px;color:var(--text-light);"></div>
        <div style="margin-top:12px;padding:12px;background:#fef3c7;border-radius:10px;font-size:13px;color:#92400e;line-height:1.6;">
          💡 所有图片处理在浏览器本地完成，不会上传到服务器。支持亮度、对比度、饱和度、色相、模糊等调整，以及多种滤镜预设。
        </div>
      </div>
    `,
    handler: () => {}
  },

  // ---- 第3名: 屏幕录制工具 ----
  {
    id: 'screen-recorder',
    cat: 'media',
    icon: '🎥',
    name: '屏幕录制工具',
    desc: '在线录制屏幕，支持选择区域、录制声音，无需安装软件',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>录制设置</label>
          <div class="row" style="margin-top:8px;">
            <div class="input-group">
              <label>录制内容</label>
              <select id="sr-source" style="width:180px;">
                <option value="screen">整个屏幕</option>
                <option value="window">应用窗口</option>
                <option value="tab">浏览器标签页</option>
              </select>
            </div>
            <div class="input-group">
              <label>录制声音</label>
              <select id="sr-audio" style="width:150px;">
                <option value="microphone">麦克风</option>
                <option value="system">系统声音</option>
                <option value="both" selected>麦克风 + 系统声音</option>
                <option value="none">不录音</option>
              </select>
            </div>
          </div>
          <div class="row" style="margin-top:8px;">
            <div class="input-group">
              <label>视频质量</label>
              <select id="sr-quality" style="width:150px;">
                <option value="2160">4K (2160p)</option>
                <option value="1080" selected>1080p (推荐)</option>
                <option value="720">720p</option>
                <option value="480">480p</option>
              </select>
            </div>
            <div class="input-group">
              <label>帧率</label>
              <select id="sr-fps" style="width:100px;">
                <option value="60">60 fps</option>
                <option value="30" selected>30 fps</option>
                <option value="15">15 fps</option>
              </select>
            </div>
          </div>
        </div>
        <div style="text-align:center;margin:20px 0;">
          <div id="sr-preview" style="display:none;margin-bottom:16px;">
            <video id="sr-preview-video" autoplay muted playsinline style="width:100%;max-height:400px;border-radius:10px;background:black;border:2px solid var(--primary);"></video>
          </div>
          <div id="sr-controls" class="btn-group" style="justify-content:center;">
            <button class="btn btn-primary" onclick="startScreenRecording()" id="sr-start-btn" style="font-size:18px;padding:16px 40px;">
              🔴 开始录制
            </button>
            <button class="btn btn-danger" onclick="stopScreenRecording()" id="sr-stop-btn" style="display:none;font-size:18px;padding:16px 40px;background:var(--danger);color:white;">
              ⏹ 停止录制
            </button>
            <button class="btn btn-success" onclick="downloadScreenRecording()" id="sr-download-btn" style="display:none;font-size:16px;padding:12px 32px;">
              📥 下载视频
            </button>
          </div>
          <div id="sr-timer" style="font-size:28px;font-weight:700;font-family:monospace;margin:12px 0;color:var(--primary);display:none;">00:00</div>
          <div id="sr-status" style="margin-top:8px;font-size:14px;color:var(--text-light);"></div>
        </div>
        <div id="sr-info" style="display:none;margin-top:12px;padding:16px;background:#f0fdf4;border-radius:10px;border:1px solid #bbf7d0;">
          <h4 style="font-size:14px;font-weight:600;margin-bottom:8px;color:#166534;">✅ 录制完成</h4>
          <p id="sr-info-text" style="font-size:13px;color:#166534;line-height:1.6;"></p>
        </div>
        <div style="margin-top:12px;padding:12px;background:#f0f9ff;border-radius:10px;font-size:13px;color:#075985;line-height:1.6;">
          💡 使用浏览器内置的 Screen Capture API，无需安装任何软件。录制的视频保存在本地，不会上传到任何服务器。
          首次使用需要授予屏幕录制权限，选择要录制的屏幕/窗口/标签页。
        </div>
      </div>
    `,
    handler: () => {}
  },

  // ==================== 彩票工具 ====================
  {
    id: 'lottery-tools',
    cat: 'lottery',
    icon: '🎰',
    name: '彩票缩水工具集',
    desc: '双色球、大乐透、福彩3D、排列三、七星彩等10种彩票的在线过滤缩水、选号、计算器',
    html: `
      <div class="tool-card" style="text-align:center;padding:60px 20px;">
        <div style="font-size:80px;margin-bottom:20px;">🎰</div>
        <h3 style="font-size:28px;margin-bottom:10px;">彩票缩水工具集</h3>
        <p style="font-size:15px;color:var(--text-light);line-height:1.8;margin-bottom:24px;max-width:500px;margin-left:auto;margin-right:auto;">
          双色球 · 大乐透 · 福彩3D · 排列三 · 七乐彩<br>
          七星彩 · 排列五 · 15选5 · 11选5 · 22选5<br><br>
          🔍 在线过滤缩水 &nbsp;🎲 随机选号 &nbsp;📐 AC值计算<br>
          🎯 胆拖计算 &nbsp;🧮 复式计算 &nbsp;📊 遗漏统计
        </p>
        <a href="lottery.html" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#ef4444);color:white;padding:16px 40px;border-radius:30px;text-decoration:none;font-size:18px;font-weight:700;box-shadow:0 4px 14px rgba(239,68,68,0.3);transition:all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
          🚀 进入彩票工具 →
        </a>
      </div>
    `,
    handler: () => {}
  }
];

// ============================================================
// 分类定义
// ============================================================
const CATEGORIES = [
  { id: 'text', icon: '✏️', name: '文本工具', desc: '字数统计、简繁转换、摩斯密码、文本转语音、文本对比' },
  { id: 'dev', icon: '💻', name: '开发者工具', desc: 'JSON格式化、二维码生成、正则测试、Markdown、IP查询' },
  { id: 'image', icon: '🖼️', name: '图片处理', desc: '去背景换底色、批量压缩、加水印、长图拼接、格式转换、裁剪、OCR' },
  { id: 'document', icon: '📄', name: '文档转换', desc: '图片转PDF、PDF转图片、Word解析、Excel转PDF、PDF合并' },
  { id: 'convert', icon: '🔄', name: '转换工具', desc: '单位换算、进制转换' },
  { id: 'security', icon: '🔒', name: '安全工具', desc: '密码生成、Hash计算、随机数' },
  { id: 'time', icon: '⏱️', name: '时间工具', desc: '时间戳转换、日期计算' },
  { id: 'color', icon: '🎨', name: '颜色工具', desc: 'HEX/RGB/HSL颜色转换' },
  { id: 'media', icon: '🎬', name: '媒体工具', desc: '抖音/TikTok去水印下载、视频转GIF' },
  { id: 'ai', icon: '🤖', name: 'AI工具', desc: 'AI聊天、AI Agent安装、免费AI工具推荐' },
  { id: 'voice', icon: '🗣️', name: '群众心声', desc: '提交工具建议、投票排行榜、前3名自动实现' },
  { id: 'lottery', icon: '🎰', name: '彩票工具', desc: '双色球、大乐透、福彩3D、排列三…在线过滤缩水、选号、计算器' }
];