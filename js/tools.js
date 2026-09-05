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

  // ==================== 印章工具 ====================
  {
    id: 'stamp-maker',
    cat: 'image',
    icon: '📜',
    name: '在线制作印章',
    desc: '在线生成多种风格、多种字体的个性印章，支持12种样式、8种字体，支持下载PNG',
    html: `
      <div class="tool-card">
        <div class="row-2">
          <div class="input-group">
            <label>印章字体</label>
            <select id="stamp-font" onchange="renderStamp()">
              <option value="weibei">魏碑</option>
              <option value="songti">宋体</option>
              <option value="fangsong" selected>方篆</option>
              <option value="zhuanshu">篆书</option>
              <option value="lishu">隶书</option>
              <option value="heiti">黑体</option>
              <option value="yuanti">圆体</option>
              <option value="jinwen">金文</option>
            </select>
          </div>
          <div class="input-group">
            <label>印章样式</label>
            <select id="stamp-style" onchange="renderStamp()">
              <option value="1">样式一：方形阳刻圆角</option>
              <option value="2">样式二：方形阴刻圆角</option>
              <option value="3">样式三：方形阳刻印章</option>
              <option value="4">样式四：方形阴刻印章</option>
              <option value="5">样式五：圆形阴刻印章</option>
              <option value="6">样式六：圆形阳刻印章</option>
              <option value="7">样式七：圆形龙纹印章</option>
              <option value="8">样式八：长方形印章</option>
              <option value="9">样式九：仿古方形阴刻印章</option>
              <option value="10">样式十：仿古方形阳刻汉印</option>
              <option value="11">样式十一：仿古圆形阳刻印戳</option>
              <option value="12">样式十二：仿古圆形阴刻印章</option>
            </select>
          </div>
        </div>
        <div class="input-group">
          <label>输入印章文字（2~4个汉字）</label>
          <input type="text" id="stamp-text" placeholder="例如：李白、王羲之、浩然印" value="李白" maxlength="4" oninput="renderStamp()" style="font-size:18px;max-width:300px;">
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="renderStamp()">🖌️ 制作印章</button>
          <button class="btn btn-secondary" id="stamp-download-btn" onclick="downloadStamp()" style="display:none;">⬇️ 下载印章PNG</button>
        </div>
        <div id="stamp-preview" style="margin-top:20px;text-align:center;min-height:260px;display:flex;flex-direction:column;align-items:center;">
          <canvas id="stamp-canvas" width="400" height="400" style="max-width:100%;border:1px dashed var(--border);border-radius:8px;background:#fafafa;"></canvas>
          <div id="stamp-tip" style="margin-top:10px;font-size:13px;color:var(--text-light);"></div>
        </div>
      </div>
    `,
    handler: () => { renderStamp(); }
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

  // ==================== 古文加密（Abracadabra 魔曰） ====================
  {
    id: 'wenyan-encrypt',
    cat: 'security',
    icon: '📜',
    name: '古文加密',
    desc: '魔曰(Abracadabra) — 将文本加密为文言文风格密文，或解密恢复原文',
    html: `
      <div class="tool-card">
        <div id="we-loading" style="text-align:center;padding:40px;color:var(--text-light);font-size:14px;">
          ⏳ 正在加载魔曰加密引擎...
        </div>
        <div id="we-body" style="display:none;">
          <div class="form-row" style="margin-bottom:12px;gap:8px;flex-wrap:wrap;">
            <label style="font-weight:600;min-width:auto;">模式：</label>
            <select id="we-mode" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:14px;">
              <option value="wenyan-encrypt">文言文加密</option>
              <option value="wenyan-decrypt">文言文解密</option>
              <option value="old-encrypt">传统加密</option>
              <option value="old-decrypt">传统解密</option>
            </select>
            <label style="font-weight:600;min-width:auto;margin-left:12px;">密钥：</label>
            <input type="text" id="we-key" value="ABRACADABRA" style="padding:6px 12px;border:1px solid var(--border);border-radius:8px;font-size:14px;width:160px;">
          </div>
          <div class="input-group">
            <label>输入文本</label>
            <textarea id="we-input" placeholder="输入要加密的文本，或粘贴古文/传统密文来解密..." rows="4"></textarea>
          </div>
          <div class="btn-group">
            <button class="btn btn-primary" onclick="wenyanEncrypt()">✨ 执行</button>
            <button class="btn btn-secondary" onclick="document.getElementById('we-input').value='';document.getElementById('we-output').value=''">清空</button>
          </div>
          <div class="input-group" style="margin-top:12px;">
            <label>结果</label>
            <textarea id="we-output" readonly rows="6" onclick="this.select();navigator.clipboard.writeText(this.value);showToast('✅ 已复制')" style="cursor:pointer;"></textarea>
          </div>
          <div class="hint" style="margin-top:8px;font-size:12px;color:var(--text-light);padding:8px 12px;background:rgba(99,102,241,0.06);border-radius:6px;line-height:1.8;">
            💡 <strong>文言文加密</strong>：将文本加密为仿真文言文密文，参考《古文观止》等典籍。<br>
            💡 <strong>传统加密</strong>：经典加密模式，输出汉字密文，兼容熊曰解密。<br>
            💡 基于 <a href="https://github.com/SheepChef/Abracadabra" target="_blank" style="color:var(--primary);">Abracadabra 魔曰</a> v3.5.0 开源项目（2.4k ⭐）。
          </div>
        </div>
      </div>
    `,
    handler: () => { loadAbracadabra(); }
  },

  // ==================== 电子教材（ChinaTextbook） ====================
  {
    id: 'textbook-browser',
    cat: 'edu',
    icon: '📖',
    name: '电子教材',
    desc: '小学到高中全科目人教版PDF教材在线阅读，免费无广告',
    html: `
      <div class="tool-card">
        <div class="textbook-header" style="margin-bottom:16px;">
          <p style="color:var(--text-light);font-size:14px;margin-bottom:12px;">
            收录人教版小学、初中、高中全科目教材PDF，数据来源于 
            <a href="https://github.com/TapXWorld/ChinaTextbook" target="_blank" style="color:var(--primary);">TapXWorld/ChinaTextbook</a> 开源项目（76.2k ⭐）。
          </p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-sm" onclick="tbSelectLevel('小学')" style="background:rgba(99,102,241,0.1);border:1px solid var(--primary);">📚 小学</button>
            <button class="btn btn-sm" onclick="tbSelectLevel('初中')" style="background:rgba(6,182,212,0.1);border:1px solid #06b6d4;">📚 初中</button>
            <button class="btn btn-sm" onclick="tbSelectLevel('高中')" style="background:rgba(245,158,11,0.1);border:1px solid #f59e0b;">📚 高中</button>
            <button class="btn btn-sm" onclick="tbSelectLevel('大学')" style="background:rgba(239,68,68,0.1);border:1px solid #ef4444;">📚 大学</button>
          </div>
        </div>
        <div id="tb-subjects" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;"></div>
        <div id="tb-books" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;margin-bottom:12px;"></div>
        <div id="tb-viewer" style="display:none;border:1px solid var(--border);border-radius:10px;overflow:hidden;margin-top:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 16px;background:var(--bg);border-bottom:1px solid var(--border);">
            <span id="tb-viewer-title" style="font-weight:600;font-size:14px;"></span>
            <button class="btn btn-sm" onclick="document.getElementById('tb-viewer').style.display='none'">关闭 ✕</button>
          </div>
          <iframe id="tb-viewer-frame" style="width:100%;height:600px;border:none;"></iframe>
        </div>
        <div class="hint" style="font-size:12px;color:var(--text-light);padding:8px 12px;background:rgba(99,102,241,0.06);border-radius:6px;line-height:1.8;">
          💡 点击教材名称即可在线阅读。教材PDF文件来源于GitHub，较大文件需等待加载。
        </div>
      </div>
    `,
    handler: () => { tbSelectLevel('小学'); }
  },

  // ==================== B站视频解析（BiliTools 风格） ====================
  {
    id: 'bilibili-tool',
    cat: 'media',
    icon: '📺',
    name: 'B站视频解析',
    desc: '解析B站视频信息，获取BV号、播放量、封面图等',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>B站视频链接 / BV号</label>
          <div class="row" style="gap:8px;">
            <input type="text" id="bili-input" placeholder="例如：https://www.bilibili.com/video/BV1GJ411x7G7 或 BV1GJ411x7G7" style="flex:1;">
            <button class="btn btn-primary" onclick="biliParse()">🔍 解析</button>
          </div>
          <div class="hint" style="font-size:12px;color:var(--text-light);margin-top:6px;">💡 输入B站视频链接或BV号，获取视频的详细信息</div>
        </div>
        <div id="bili-result" style="display:none;margin-top:16px;">
          <div style="display:flex;gap:20px;flex-wrap:wrap;">
            <div id="bili-cover" style="flex-shrink:0;width:200px;height:125px;background:var(--bg);border-radius:8px;overflow:hidden;border:1px solid var(--border);"></div>
            <div style="flex:1;min-width:200px;">
              <h3 id="bili-title" style="margin-bottom:8px;font-size:16px;"></h3>
              <div id="bili-stats" style="font-size:13px;color:var(--text-light);line-height:2;"></div>
              <div id="bili-desc" style="font-size:13px;color:var(--text);margin-top:8px;max-height:80px;overflow-y:auto;padding:8px;background:var(--bg);border-radius:6px;"></div>
            </div>
          </div>
        </div>
        <div id="bili-error" style="display:none;margin-top:12px;padding:12px;background:rgba(239,68,68,0.08);border-radius:8px;color:var(--danger);font-size:14px;"></div>
        <div class="hint" style="margin-top:12px;font-size:12px;color:var(--text-light);padding:8px 12px;background:rgba(99,102,241,0.06);border-radius:6px;line-height:1.8;">
          💡 使用B站官方公开API解析视频信息，<strong>仅获取公开信息，不提供下载功能</strong>。<br>
          灵感来源于 <a href="https://github.com/btjawa/BiliTools" target="_blank" style="color:var(--primary);">BiliTools</a> 开源项目（已归档）。
        </div>
      </div>
    `,
    handler: () => {}
  },

  // ==================== 文档解析（MinerU 风格） ====================
  {
    id: 'doc-parser',
    cat: 'document',
    icon: '🔍',
    name: '文档解析',
    desc: '在线解析PDF/DOCX文档，提取文本内容，支持预览',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>上传文档</label>
          <div style="border:2px dashed var(--border);border-radius:12px;padding:30px;text-align:center;background:var(--bg);transition:all 0.3s;" id="dp-dropzone" ondrop="dpDrop(event)" ondragover="event.preventDefault()">
            <div style="font-size:40px;margin-bottom:10px;">📄</div>
            <p style="color:var(--text-light);">拖拽文件到此处，或点击选择文件</p>
            <p style="font-size:12px;color:var(--text-light);margin-top:4px;">支持 PDF、TXT 格式</p>
            <input type="file" id="dp-file" accept=".pdf,.txt" style="display:none;" onchange="dpFileSelected(this.files[0])">
            <button class="btn btn-primary" style="margin-top:12px;" onclick="document.getElementById('dp-file').click()">选择文件</button>
          </div>
        </div>
        <div id="dp-result" style="display:none;margin-top:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <label>提取结果</label>
            <button class="btn btn-sm" onclick="dpCopyText()">📋 复制</button>
          </div>
          <textarea id="dp-output" readonly style="width:100%;height:400px;border:1px solid var(--border);border-radius:8px;padding:12px;font-size:13px;font-family:monospace;background:var(--bg);resize:vertical;" onclick="this.select()"></textarea>
          <div style="font-size:12px;color:var(--text-light);margin-top:6px;">
            <span id="dp-info">共 0 字</span>
          </div>
        </div>
        <div class="hint" style="margin-top:12px;font-size:12px;color:var(--text-light);padding:8px 12px;background:rgba(99,102,241,0.06);border-radius:6px;line-height:1.8;">
          💡 使用浏览器原生 <a href="https://mozilla.github.io/pdf.js/" target="_blank" style="color:var(--primary);">PDF.js</a> 解析PDF文档，所有数据处理在本地完成，不会上传到服务器。<br>
          灵感来源于 <a href="https://github.com/opendatalab/MinerU" target="_blank" style="color:var(--primary);">MinerU</a> 开源项目（75.8k ⭐）。
        </div>
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
    desc: '双色球、大乐透、福彩3D、快乐8、排列三、七星彩等11种彩票的在线过滤缩水、选号、计算器',
    html: `
      <div class="tool-card" style="text-align:center;padding:60px 20px;">
        <div style="font-size:80px;margin-bottom:20px;">🎰</div>
        <h3 style="font-size:28px;margin-bottom:10px;">彩票缩水工具集</h3>
        <p style="font-size:15px;color:var(--text-light);line-height:1.8;margin-bottom:24px;max-width:500px;margin-left:auto;margin-right:auto;">
          双色球 · 大乐透 · 福彩3D · 排列三 · 七乐彩<br>
          七星彩 · 排列五 · 15选5 · 11选5 · 22选5 · 快乐8<br><br>
          🔍 在线过滤缩水 &nbsp;🎲 随机选号 &nbsp;📐 AC值计算<br>
          🎯 胆拖计算 &nbsp;🧮 复式计算 &nbsp;📊 遗漏统计
        </p>
        <a href="lottery.html" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#ef4444);color:white;padding:16px 40px;border-radius:30px;text-decoration:none;font-size:18px;font-weight:700;box-shadow:0 4px 14px rgba(239,68,68,0.3);transition:all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
          🚀 进入彩票工具 →
        </a>
      </div>
    `,
    handler: () => {}
  },

  // ==================== 新工具：九宫格切图 ====================
  {
    id: '9grid',
    cat: 'image',
    icon: '🧩',
    name: '九宫格切图',
    desc: '把图片切成3×3九宫格，发朋友圈专用，支持一键打包下载',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>选择图片（会自动裁剪为正方形）</label>
          <input type="file" id="ng-file" accept="image/*" class="file-input" style="width:100%;">
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="nineGridSplit()">✂️ 分割九宫格</button>
          <button class="btn btn-secondary" id="ng-download-all" onclick="downloadNineGridAll()" style="display:none;">📦 打包下载全部</button>
        </div>
        <div id="ng-info" style="font-size:13px;color:var(--text-light);margin-top:8px;"></div>
        <div id="ng-result" style="margin-top:12px;text-align:center;"></div>
      </div>
    `,
    handler: () => {}
  },

  // ==================== 新工具：文字转手写体 ====================
  {
    id: 'text-handwriting',
    cat: 'image',
    icon: '✍️',
    name: '文字转手写体',
    desc: '将文字转为逼真手写体，支持多种字体、纸张样式和个性化效果',
    html: `
      <div class="tool-card">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div style="border-right:1px solid var(--border);padding-right:16px;">
            <h4 style="font-size:15px;font-weight:600;margin-bottom:12px;color:var(--primary);">📝 文字输入</h4>
            <div class="input-group" style="margin-bottom:10px;">
              <label>输入文字（支持换行）</label>
              <textarea id="th-text" placeholder="在此输入文字，每行一个自然段..." rows="6" style="width:100%;"></textarea>
            </div>
            <div class="input-group" style="margin-bottom:10px;">
              <label>📌 标题（可选，会显示在顶部）</label>
              <input type="text" id="th-title" placeholder="例如：读书笔记、心得体会..." style="width:100%;">
            </div>
          </div>
          <div style="padding-left:16px;">
            <h4 style="font-size:15px;font-weight:600;margin-bottom:12px;color:var(--primary);">🎨 个性化设计</h4>
            <div class="row-2" style="margin-bottom:10px;">
              <div class="input-group">
                <label>📄 纸张样式</label>
                <select id="th-paper" onchange="textToHandwriting()" style="width:100%;">
                  <option value="plain">纯色背景</option>
                  <option value="rice" selected>米黄信纸（横线）</option>
                  <option value="grid">方格纸</option>
                  <option value="essay">作文纸</option>
                  <option value="tian">田字格</option>
                  <option value="pinyin">拼音格</option>
                  <option value="english">英文四线格</option>
                  <option value="vintage">复古信纸</option>
                </select>
              </div>
              <div class="input-group">
                <label>✍️ 手写字体</label>
                <select id="th-font" onchange="textToHandwriting()" style="width:100%;">
                  <option value="kaiti">楷体（标准）</option>
                  <option value="xingshu">行书</option>
                  <option value="caoshu">草书</option>
                  <option value="handwrite">手写体</option>
                  <option value="fangsong">仿宋</option>
                  <option value="lishu">隶书</option>
                  <option value="qingsong">轻松手写</option>
                  <option value="child">儿童体</option>
                </select>
              </div>
            </div>
            <div class="row-2" style="margin-bottom:10px;">
              <div class="input-group">
                <label>🎨 背景色</label>
                <input type="color" id="th-bg" value="#faf6ed" onchange="textToHandwriting()" style="width:100%;height:36px;padding:2px;cursor:pointer;">
              </div>
              <div class="input-group">
                <label>🖊️ 墨色</label>
                <input type="color" id="th-ink" value="#1a1a2e" onchange="textToHandwriting()" style="width:100%;height:36px;padding:2px;cursor:pointer;">
              </div>
            </div>
            <div class="row-2" style="margin-bottom:10px;">
              <div class="input-group">
                <label>📏 字号</label>
                <select id="th-size" onchange="textToHandwriting()" style="width:100%;">
                  <option value="24">特小</option>
                  <option value="28">小</option>
                  <option value="36" selected>中</option>
                  <option value="48">大</option>
                  <option value="56">特大</option>
                </select>
              </div>
              <div class="input-group">
                <label>↕️ 行距</label>
                <select id="th-lineheight" onchange="textToHandwriting()" style="width:100%;">
                  <option value="40">紧凑</option>
                  <option value="50">偏小</option>
                  <option value="60" selected>标准</option>
                  <option value="80">宽松</option>
                  <option value="100">特宽</option>
                </select>
              </div>
            </div>
            <div class="row-2" style="margin-bottom:10px;">
              <div class="input-group">
                <label>↔️ 字间距</label>
                <select id="th-spacing" onchange="textToHandwriting()" style="width:100%;">
                  <option value="0.9">紧凑</option>
                  <option value="0.95" selected>标准</option>
                  <option value="1.0">偏宽</option>
                  <option value="1.1">宽松</option>
                </select>
              </div>
              <div class="input-group">
                <label>📐 纸张宽度</label>
                <select id="th-width" onchange="textToHandwriting()" style="width:100%;">
                  <option value="600">窄（600px）</option>
                  <option value="800" selected>标准（800px）</option>
                  <option value="1000">宽（1000px）</option>
                </select>
              </div>
            </div>
            <div class="row-2" style="margin-bottom:10px;">
              <div class="input-group">
                <label>🔀 手写凌乱度</label>
                <select id="th-mess" onchange="textToHandwriting()" style="width:100%;">
                  <option value="0.02">工整</option>
                  <option value="0.06" selected>适中</option>
                  <option value="0.12">潦草</option>
                  <option value="0.2">非常潦草</option>
                </select>
              </div>
              <div class="input-group">
                <label>💧 墨迹浓淡</label>
                <select id="th-bleed" onchange="textToHandwriting()" style="width:100%;">
                  <option value="1">正常</option>
                  <option value="0.85">淡墨</option>
                  <option value="0.7">很淡</option>
                  <option value="0.5">极淡（铅笔感）</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="btn-group" style="justify-content:center;margin-top:12px;">
          <button class="btn btn-primary" onclick="textToHandwriting()">✍️ 生成手写体</button>
          <button class="btn btn-secondary" id="th-download" onclick="downloadHandwriting()" style="display:none;">⬇️ 下载 PNG</button>
          <button class="btn btn-secondary" id="th-download-jpg" onclick="downloadHandwritingJPG()" style="display:none;">⬇️ 下载 JPG</button>
          <button class="btn btn-secondary" onclick="randomHandwritingStyle()">🎲 随机风格</button>
        </div>
        <div id="th-preview" style="margin-top:16px;text-align:center;display:none;">
          <div class="label" style="margin-bottom:8px;">手写体预览</div>
          <canvas id="th-canvas" style="max-width:100%;border:1px solid var(--border);border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);"></canvas>
        </div>
        <div id="th-status" style="margin-top:8px;font-size:13px;color:var(--text-light);text-align:center;"></div>
      </div>
    `,
    handler: () => {}
  },

  // ==================== 新工具：表情包生成器 ====================
  {
    id: 'meme-maker',
    cat: 'image',
    icon: '😂',
    name: '表情包生成器',
    desc: '上传图片或纯文字，添加顶部/底部文字，一键生成经典表情包，支持多种样式',
    html: `
      <div class="tool-card">
        <div class="row-2" style="margin-bottom:12px;">
          <div class="input-group">
            <label>📁 上传图片（可选）</label>
            <div style="display:flex;gap:8px;align-items:center;">
              <input type="file" id="meme-file" accept="image/*" style="display:none;" onchange="memeUploadImage()">
              <button class="btn btn-secondary" onclick="document.getElementById('meme-file').click()" style="flex:1;">📁 选择图片</button>
              <span id="meme-filename" style="font-size:12px;color:var(--text-light);flex:1;"></span>
            </div>
          </div>
          <div class="input-group">
            <label>🎨 文字样式</label>
            <div style="display:flex;gap:6px;align-items:center;">
              <select id="meme-fontsize" onchange="memeUploadImage()" style="flex:1;">
                <option value="36">小字号</option>
                <option value="48" selected>中字号</option>
                <option value="60">大字号</option>
                <option value="72">特大字号</option>
              </select>
              <input type="color" id="meme-color" value="#ffffff" onchange="memeUploadImage()" style="width:40px;height:36px;padding:2px;cursor:pointer;border:none;border-radius:6px;">
              <label style="font-size:12px;display:flex;align-items:center;gap:4px;cursor:pointer;white-space:nowrap;">
                <input type="checkbox" id="meme-outline" checked onchange="memeUploadImage()"> 描边
              </label>
            </div>
          </div>
        </div>
        <div class="row-2">
          <div class="input-group">
            <label>⬆️ 顶部文字</label>
            <input type="text" id="meme-top-text" placeholder="顶部文字" value="我太难了" style="width:100%;font-size:15px;font-family:Impact,'Arial Black',sans-serif;">
          </div>
          <div class="input-group">
            <label>⬇️ 底部文字</label>
            <input type="text" id="meme-bottom-text" placeholder="底部文字" value="真的太难了" style="width:100%;font-size:15px;font-family:Impact,'Arial Black',sans-serif;">
          </div>
        </div>
        <div class="btn-group" style="justify-content:center;margin-top:10px;">
          <button class="btn btn-primary" onclick="generateMeme()">😂 生成表情包</button>
          <button class="btn btn-secondary" id="meme-download" onclick="downloadMeme()" style="display:none;">⬇️ 下载PNG</button>
          <button class="btn btn-secondary" onclick="clearMemeImage()">🔄 清除图片</button>
        </div>
        <div style="margin-top:12px;text-align:center;min-height:260px;display:flex;flex-direction:column;align-items:center;">
          <canvas id="meme-canvas" style="max-width:100%;border:1px solid var(--border);border-radius:8px;background:#f8f8f8;max-height:400px;object-fit:contain;"></canvas>
          <div id="meme-hint" style="margin-top:8px;font-size:13px;color:var(--text-light);">上传图片或直接输入文字，点击生成</div>
        </div>
      </div>
    `,
    handler: () => { initMemeGenerator(); }
  },

  // ==================== 新工具：决策转盘 ====================
  {
    id: 'decision-wheel',
    cat: 'fun',
    icon: '🎯',
    name: '决策转盘',
    desc: '输入选项，转动转盘随机决定，选择困难症神器！支持抽奖/抽签',
    html: `
      <div class="tool-card">
        <div class="row-2">
          <div class="input-group" style="flex:1;">
            <label>添加选项</label>
            <div style="display:flex;gap:6px;">
              <input type="text" id="wheel-input" placeholder="输入选项" style="flex:1;" onkeydown="if(event.key==='Enter')wheelAddOption()">
              <button class="btn btn-primary" onclick="wheelAddOption()" style="white-space:nowrap;">➕ 添加</button>
            </div>
            <textarea id="wheel-textarea" placeholder="或批量输入（每行一个选项）" rows="3" style="width:100%;margin-top:6px;font-size:13px;"></textarea>
            <button class="btn btn-secondary" onclick="wheelAddFromText()" style="margin-top:4px;width:100%;">📋 批量导入</button>
          </div>
          <div style="flex:0 0 180px;text-align:center;">
            <div id="wheel-list" style="max-height:200px;overflow-y:auto;margin-bottom:6px;">
              <div style="color:var(--text-light);padding:10px;font-size:13px;">暂无选项，请添加</div>
            </div>
            <div id="wheel-count" style="font-size:12px;color:var(--text-light);margin-bottom:4px;">共 0 个选项</div>
            <button class="btn btn-secondary" onclick="wheelClear()" style="font-size:12px;padding:4px 12px;">🗑️ 清空</button>
          </div>
        </div>
        <div style="text-align:center;margin-top:12px;position:relative;">
          <canvas id="wheel-canvas" width="400" height="400" style="max-width:100%;border-radius:8px;cursor:pointer;" onclick="wheelSpin()"></canvas>
          <div id="wheel-result" style="display:none;margin-top:10px;font-size:22px;font-weight:bold;color:var(--primary);"></div>
          <div style="font-size:13px;color:var(--text-light);margin-top:6px;">👆 点击转盘开始转动</div>
        </div>
      </div>
    `,
    handler: () => { wheelDraw(); }
  },

  // ==================== 新工具：CSS渐变生成器 ====================
  {
    id: 'css-gradient',
    cat: 'color',
    icon: '🌈',
    name: 'CSS渐变生成器',
    desc: '可视化生成CSS渐变背景代码，支持线性渐变、多色阶、角度控制，一键复制',
    html: `
      <div class="tool-card">
        <div class="gradient-preview" id="gd-preview" style="height:120px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#ec4899);margin-bottom:16px;transition:background 0.3s;"></div>
        <div class="row-3">
          <div class="input-group">
            <label>起始颜色</label>
            <div style="display:flex;gap:8px;align-items:center;">
              <input type="color" id="gd-color1" value="#6366f1" onchange="updateGradient()" style="width:48px;height:40px;border:none;cursor:pointer;padding:0;border-radius:6px;">
              <input type="text" id="gd-color1-hex" value="#6366f1" oninput="syncGradientColor(1)" style="flex:1;font-family:monospace;font-size:13px;">
            </div>
          </div>
          <div class="input-group">
            <label>结束颜色</label>
            <div style="display:flex;gap:8px;align-items:center;">
              <input type="color" id="gd-color2" value="#ec4899" onchange="updateGradient()" style="width:48px;height:40px;border:none;cursor:pointer;padding:0;border-radius:6px;">
              <input type="text" id="gd-color2-hex" value="#ec4899" oninput="syncGradientColor(2)" style="flex:1;font-family:monospace;font-size:13px;">
            </div>
          </div>
          <div class="input-group">
            <label>中间色（可选）</label>
            <div style="display:flex;gap:8px;align-items:center;">
              <input type="color" id="gd-color3" value="#ffffff" onchange="updateGradient()" style="width:48px;height:40px;border:none;cursor:pointer;padding:0;border-radius:6px;">
              <input type="text" id="gd-color3-hex" value="#ffffff" oninput="syncGradientColor(3)" style="flex:1;font-family:monospace;font-size:13px;">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="input-group">
            <label>角度：<strong id="gd-angle-val">135</strong>°</label>
            <input type="range" id="gd-angle" min="0" max="360" value="135" oninput="document.getElementById('gd-angle-val').textContent=this.value;updateGradient()">
          </div>
          <div class="input-group">
            <label>渐变类型</label>
            <select id="gd-type" onchange="updateGradient()">
              <option value="linear">线性渐变 (linear)</option>
              <option value="radial">径向渐变 (radial)</option>
            </select>
          </div>
        </div>
        <div class="input-group">
          <label>CSS 代码</label>
          <div style="display:flex;gap:8px;">
            <input type="text" id="gd-css-output" readonly style="flex:1;font-family:monospace;font-size:13px;background:#1a1a2e;color:#a78bfa;padding:10px 14px;" value="background: linear-gradient(135deg, #6366f1, #ec4899);">
            <button class="btn btn-secondary" onclick="copyGradientCSS()">📋 复制</button>
          </div>
        </div>
        <div class="row" style="margin-top:8px;">
          <button class="btn btn-secondary" onclick="randomGradient()">🎲 随机渐变</button>
          <button class="btn btn-secondary" onclick="document.getElementById('gd-color3-hex').value='#ffffff';updateGradient()">❌ 清除中间色</button>
        </div>
      </div>
    `,
    handler: () => { updateGradient(); }
  },

  // ==================== 新工具：社交媒体图片尺寸调整 ====================
  {
    id: 'social-resizer',
    cat: 'image',
    icon: '📱',
    name: '社交媒体图片尺寸调整',
    desc: '一键将图片调整为各大社交媒体平台推荐尺寸，支持Facebook、Instagram、Twitter、LinkedIn、YouTube等',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>上传图片</label>
          <input type="file" id="sr-upload" accept="image/*" onchange="loadSocialImage(event)" style="width:100%;">
        </div>
        <div class="row">
          <div class="input-group">
            <label>选择平台</label>
            <select id="sr-platform" onchange="socialPlatformChange()">
              <option value="ig-square">Instagram 正方形 (1080×1080)</option>
              <option value="ig-portrait">Instagram 竖版 (1080×1350)</option>
              <option value="ig-story">Instagram 快拍 (1080×1920)</option>
              <option value="fb-post">Facebook 帖子 (1200×630)</option>
              <option value="fb-cover">Facebook 封面 (820×312)</option>
              <option value="tw-post">Twitter/X 帖子 (1200×675)</option>
              <option value="tw-header">Twitter/X 横幅 (1500×500)</option>
              <option value="li-post">LinkedIn 帖子 (1200×627)</option>
              <option value="li-banner">LinkedIn 封面 (1584×396)</option>
              <option value="yt-thumb">YouTube 缩略图 (1280×720)</option>
              <option value="yt-banner">YouTube 横幅 (2560×1440)</option>
              <option value="pin">Pinterest 图钉 (1000×1500)</option>
            </select>
          </div>
          <div class="input-group">
            <label>缩放模式</label>
            <select id="sr-fit">
              <option value="cover">裁剪填充 (cover)</option>
              <option value="contain">适应留白 (contain)</option>
              <option value="fill">拉伸填充 (fill)</option>
            </select>
          </div>
        </div>
        <div id="sr-preview-area" style="text-align:center;min-height:160px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px dashed var(--border);border-radius:12px;padding:20px;margin:12px 0;">
          <div style="font-size:40px;opacity:0.4;">🖼️</div>
          <div style="font-size:14px;color:var(--text-light);margin-top:8px;">请先上传图片</div>
        </div>
        <div class="row">
          <button class="btn btn-primary" id="sr-resize-btn" onclick="resizeSocialImage()" disabled style="flex:1;">🔄 调整尺寸</button>
          <button class="btn btn-secondary" id="sr-download-btn" onclick="downloadSocialImage()" disabled>⬇️ 下载</button>
        </div>
        <div id="sr-info" style="font-size:13px;color:var(--text-light);text-align:center;margin-top:8px;"></div>
      </div>
    `,
    handler: () => {}
  },

  // ==================== 新工具：在线简历生成器 ====================
  {
    id: 'resume-builder',
    cat: 'document',
    icon: '📋',
    name: '在线简历生成器',
    desc: '在线制作专业简历，支持丰富的个性化设计选项，告别千篇一律',
    html: `      <div class="tool-card">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <!-- 左侧：内容输入 -->
          <div style="border-right:1px solid var(--border);padding-right:16px;">
            <h4 style="font-size:15px;font-weight:600;margin-bottom:12px;color:var(--primary);">📝 简历内容</h4>
            <div class="input-group" style="margin-bottom:10px;">
              <label>👤 姓名</label>
              <input type="text" id="rb-name" value="张三" oninput="renderResume()" style="font-size:18px;font-weight:700;">
            </div>
            <div class="input-group" style="margin-bottom:10px;">
              <label>🏷️ 求职意向 / 职位</label>
              <input type="text" id="rb-title" value="高级前端工程师" oninput="renderResume()">
            </div>
            <div class="row-2" style="margin-bottom:10px;">
              <div class="input-group">
                <label>📧 邮箱</label>
                <input type="email" id="rb-email" value="zhangsan@example.com" oninput="renderResume()">
              </div>
              <div class="input-group">
                <label>📞 电话</label>
                <input type="tel" id="rb-phone" value="138-0000-0000" oninput="renderResume()">
              </div>
            </div>
            <div class="input-group" style="margin-bottom:10px;">
              <label>📍 地址</label>
              <input type="text" id="rb-address" value="北京市海淀区" oninput="renderResume()">
            </div>
            <div class="input-group" style="margin-bottom:10px;">
              <label>📝 个人简介</label>
              <textarea id="rb-summary" rows="2" oninput="renderResume()" placeholder="简短介绍自己...">拥有8年前端开发经验，精通React、Vue、TypeScript等技术栈，曾在多家知名互联网公司担任技术负责人，具备良好的团队协作和项目管理能力。</textarea>
            </div>
            <div class="input-group" style="margin-bottom:10px;">
              <label>💼 工作经历（每行一条，格式：公司 | 职位 | 时间 | 描述）</label>
              <textarea id="rb-experience" rows="3" oninput="renderResume()" placeholder="例如：字节跳动 | 高级前端工程师 | 2020-2024 | 负责核心业务前端架构设计...">字节跳动 | 高级前端工程师 | 2020-2024 | 负责核心业务前端架构设计与开发，带领5人团队完成多个大型项目，提升开发效率30%。
阿里巴巴 | 前端工程师 | 2017-2020 | 参与电商平台前端开发，主导组件库建设，服务200+业务线。</textarea>
            </div>
            <div class="input-group" style="margin-bottom:10px;">
              <label>🎓 教育背景（每行一条，格式：学校 | 专业 | 时间 | 学历）</label>
              <textarea id="rb-education" rows="2" oninput="renderResume()" placeholder="例如：北京大学 | 计算机科学与技术 | 2013-2017 | 本科">北京大学 | 计算机科学与技术 | 2013-2017 | 本科</textarea>
            </div>
            <div class="input-group" style="margin-bottom:10px;">
              <label>🔧 技能标签（逗号分隔）</label>
              <input type="text" id="rb-skills" value="JavaScript,TypeScript,React,Vue,Node.js,CSS,Webpack,Git" oninput="renderResume()">
            </div>
            <div class="input-group" style="margin-bottom:10px;">
              <label>📸 头像照片（可选）</label>
              <div class="file-input-wrapper">
                <span class="file-btn">📁 选择头像</span>
                <input type="file" id="rb-avatar" accept="image/*" onchange="loadResumeAvatar()">
              </div>
              <div id="rb-avatar-preview" style="margin-top:6px;display:none;">
                <img id="rb-avatar-img" style="width:60px;height:60px;border-radius:50%;object-fit:cover;border:2px solid var(--border);">
                <span style="font-size:12px;color:var(--text-light);margin-left:8px;cursor:pointer;" onclick="document.getElementById('rb-avatar').value='';document.getElementById('rb-avatar-preview').style.display='none';renderResume()">✕ 移除</span>
              </div>
            </div>
          </div>

          <!-- 右侧：个性化设计 -->
          <div style="padding-left:16px;">
            <h4 style="font-size:15px;font-weight:600;margin-bottom:12px;color:var(--primary);">🎨 个性化设计</h4>

            <div class="input-group" style="margin-bottom:10px;">
              <label>📐 整体布局</label>
              <select id="rb-layout" onchange="renderResume()" style="width:100%;">
                <option value="standard">上下布局（标准）</option>
                <option value="sidebar">左右分栏（侧边栏）</option>
                <option value="card">卡片式布局</option>
                <option value="compact">紧凑型布局</option>
              </select>
            </div>

            <div class="input-group" style="margin-bottom:10px;">
              <label>🎨 Header 背景</label>
              <select id="rb-header-bg" onchange="renderResume()" style="width:100%;">
                <option value="gradient1">渐变紫蓝</option>
                <option value="gradient2">渐变深蓝</option>
                <option value="gradient3">渐变青绿</option>
                <option value="gradient4">渐变橙红</option>
                <option value="gradient5">渐变粉紫</option>
                <option value="solid1">纯色深灰</option>
                <option value="solid2">纯色深蓝</option>
                <option value="solid3">纯色墨绿</option>
                <option value="solid4">纯色酒红</option>
                <option value="light1">浅色灰蓝</option>
                <option value="light2">浅色米白</option>
                <option value="none">无背景头</option>
                <option value="custom">自定义颜色</option>
              </select>
              <div id="rb-header-custom" style="display:none;margin-top:4px;">
                <input type="color" id="rb-header-color" value="#6366f1" onchange="renderResume()">
                <input type="color" id="rb-header-color2" value="#4f46e5" onchange="renderResume()" style="margin-left:4px;">
                <span style="font-size:11px;color:var(--text-light);">左色 → 右色（相同为纯色）</span>
              </div>
            </div>

            <div class="input-group" style="margin-bottom:10px;">
              <label>📄 Body 背景</label>
              <select id="rb-body-bg" onchange="renderResume()" style="width:100%;">
                <option value="white">纯白</option>
                <option value="lightgray">浅灰</option>
                <option value="warm">米黄暖色</option>
                <option value="lightblue">浅蓝</option>
                <option value="custom">自定义</option>
              </select>
              <div id="rb-body-custom" style="display:none;margin-top:4px;">
                <input type="color" id="rb-body-color" value="#f8fafc" onchange="renderResume()">
              </div>
            </div>

            <div class="row-2" style="margin-bottom:10px;">
              <div class="input-group">
                <label>🔤 全局字体</label>
                <select id="rb-font" onchange="renderResume()" style="width:100%;">
                  <option value="system">系统默认</option>
                  <option value="songti">宋体</option>
                  <option value="heiti">黑体</option>
                  <option value="kaiti">楷体</option>
                  <option value="fangsong">仿宋</option>
                  <option value="yahei">微软雅黑</option>
                  <option value="times">Times New Roman</option>
                  <option value="georgia">Georgia</option>
                  <option value="arial">Arial</option>
                  <option value="noto">Noto Sans SC</option>
                </select>
              </div>
              <div class="input-group">
                <label>🔤 标题字体</label>
                <select id="rb-heading-font" onchange="renderResume()" style="width:100%;">
                  <option value="same">同全局字体</option>
                  <option value="songti">宋体</option>
                  <option value="heiti">黑体</option>
                  <option value="kaiti">楷体</option>
                  <option value="fangsong">仿宋</option>
                  <option value="yahei">微软雅黑</option>
                  <option value="times">Times New Roman</option>
                  <option value="georgia">Georgia</option>
                  <option value="arial">Arial</option>
                </select>
              </div>
            </div>

            <div class="row-2" style="margin-bottom:10px;">
              <div class="input-group">
                <label>🎨 主题色</label>
                <input type="color" id="rb-accent" value="#6366f1" onchange="renderResume()" style="width:100%;height:36px;padding:2px;cursor:pointer;">
              </div>
              <div class="input-group">
                <label>📄 文字颜色</label>
                <input type="color" id="rb-text-color" value="#334155" onchange="renderResume()" style="width:100%;height:36px;padding:2px;cursor:pointer;">
              </div>
            </div>

            <div class="row-2" style="margin-bottom:10px;">
              <div class="input-group">
                <label>〰️ 分割线样式</label>
                <select id="rb-divider-style" onchange="renderResume()" style="width:100%;">
                  <option value="solid">实线</option>
                  <option value="dashed">虚线</option>
                  <option value="dotted">点线</option>
                  <option value="double">双线</option>
                  <option value="gradient">渐变线</option>
                  <option value="none">无分割线</option>
                </select>
              </div>
              <div class="input-group">
                <label>📏 分割线粗细</label>
                <select id="rb-divider-width" onchange="renderResume()" style="width:100%;">
                  <option value="1">1px 细</option>
                  <option value="2" selected>2px 标准</option>
                  <option value="3">3px 中等</option>
                  <option value="4">4px 粗</option>
                </select>
              </div>
            </div>

            <div class="row-2" style="margin-bottom:10px;">
              <div class="input-group">
                <label>⬜ 卡片圆角</label>
                <select id="rb-radius" onchange="renderResume()" style="width:100%;">
                  <option value="0">无圆角</option>
                  <option value="4">小圆角</option>
                  <option value="8" selected>中圆角</option>
                  <option value="16">大圆角</option>
                </select>
              </div>
              <div class="input-group">
                <label>↕️ 内容间距</label>
                <select id="rb-spacing" onchange="renderResume()" style="width:100%;">
                  <option value="compact">紧凑</option>
                  <option value="normal" selected>标准</option>
                  <option value="spacious">宽松</option>
                </select>
              </div>
            </div>

            <div class="row-2" style="margin-bottom:10px;">
              <div class="input-group">
                <label>🏷️ 标签样式</label>
                <select id="rb-badge-style" onchange="renderResume()" style="width:100%;">
                  <option value="round">圆角填充</option>
                  <option value="square">方形填充</option>
                  <option value="outline">线框</option>
                  <option value="gradient-badge">渐变填充</option>
                  <option value="underline">下划线</option>
                </select>
              </div>
              <div class="input-group">
                <label>📸 头像显示</label>
                <select id="rb-avatar-style" onchange="renderResume()" style="width:100%;">
                  <option value="circle">圆形</option>
                  <option value="square">方形</option>
                  <option value="rounded">圆角方形</option>
                  <option value="none">不显示</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <hr style="margin:16px 0;border-color:var(--border);">

        <div class="btn-group" style="justify-content:center;">
          <button class="btn btn-primary" onclick="downloadResumePDF()">📄 下载 PDF</button>
          <button class="btn btn-secondary" onclick="downloadResumeHTML()">🌐 下载 HTML</button>
          <button class="btn btn-secondary" onclick="randomizeResumeStyle()">🎲 随机换风格</button>
        </div>
        <div class="result-box show" style="margin-top:16px;overflow:hidden;">
          <div class="label">简历预览</div>
          <div id="rb-preview" style="background:white;border-radius:8px;min-height:300px;padding:0;overflow:hidden;"></div>
        </div>
        <div id="rb-status" style="margin-top:8px;font-size:13px;color:var(--text-light);text-align:center;"></div>
        <div style="margin-top:10px;padding:10px;background:#f0f9ff;border-radius:8px;font-size:12px;color:#075985;line-height:1.6;">💡 灵感来源于 Novoresume、Zety 等付费简历工具（$20-30/月），我们的免费版支持丰富的个性化选项，所有数据保存在本地浏览器。</div>
      </div>
    `,
    handler: () => { setTimeout(renderResume, 100); }
  },

  // ==================== 新工具：在线电子签名生成器 ====================
  {
    id: 'signature-maker',
    cat: 'document',
    icon: '✍️',
    name: '在线电子签名',
    desc: '在线生成手写电子签名，支持多种笔触风格、背景样式，可导出透明PNG',
    html: `      <div class="tool-card">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <!-- 左侧：签名输入 -->
          <div style="border-right:1px solid var(--border);padding-right:16px;">
            <h4 style="font-size:15px;font-weight:600;margin-bottom:12px;color:var(--primary);">✍️ 签名输入</h4>
            <div class="row-2" style="margin-bottom:10px;">
              <div class="input-group">
                <label>签名方式</label>
                <select id="sm-mode" onchange="switchSignatureMode()" style="width:100%;">
                  <option value="draw">手写绘制</option>
                  <option value="text">文字签名</option>
                </select>
              </div>
              <div class="input-group" id="sm-font-group" style="display:none;">
                <label>字体风格</label>
                <select id="sm-font" onchange="renderTextSignature()" style="width:100%;">
                  <option value="cursive">手写体</option>
                  <option value="elegant">优雅体</option>
                  <option value="bold">粗体</option>
                  <option value="calligraphy">书法体</option>
                  <option value="signature">签名体</option>
                  <option value="comic">漫画体</option>
                </select>
              </div>
            </div>
            <div class="input-group" id="sm-text-group" style="display:none;margin-bottom:10px;">
              <label>输入签名文字</label>
              <input type="text" id="sm-text" value="张三" oninput="renderTextSignature()" placeholder="输入你的名字" style="font-size:20px;max-width:300px;">
            </div>
            <div class="row-2" style="margin-bottom:10px;">
              <div class="input-group">
                <label>🎨 笔触颜色</label>
                <input type="color" id="sm-color" value="#1e40af" onchange="updateSignature()" style="width:100%;height:36px;padding:2px;cursor:pointer;">
              </div>
              <div class="input-group">
                <label>📏 笔触粗细</label>
                <select id="sm-size" onchange="updateSignature()" style="width:100%;">
                  <option value="1">极细</option>
                  <option value="2">细</option>
                  <option value="4" selected>中</option>
                  <option value="6">粗</option>
                  <option value="8">特粗</option>
                  <option value="12">极粗</option>
                </select>
              </div>
            </div>
            <div class="row-2" style="margin-bottom:10px;">
              <div class="input-group">
                <label>🖊️ 画笔风格</label>
                <select id="sm-brush" onchange="updateSignature()" style="width:100%;">
                  <option value="pen">🖊️ 钢笔</option>
                  <option value="brush">🖌️ 毛笔</option>
                  <option value="marker">🖍️ 马克笔</option>
                  <option value="highlighter">🟡 荧光笔</option>
                </select>
              </div>
              <div class="input-group">
                <label>📐 画布尺寸</label>
                <select id="sm-canvas-size" onchange="resizeSignatureCanvas()" style="width:100%;">
                  <option value="small">小 (300×120)</option>
                  <option value="medium" selected>中 (500×200)</option>
                  <option value="large">大 (700×280)</option>
                </select>
              </div>
            </div>
            <div class="row-2" style="margin-bottom:10px;">
              <div class="input-group">
                <label>↔️ 文字对齐</label>
                <select id="sm-align" onchange="renderTextSignature()" style="width:100%;">
                  <option value="center">居中</option>
                  <option value="left">左对齐</option>
                  <option value="right">右对齐</option>
                </select>
              </div>
              <div class="input-group">
                <label>🔄 旋转角度</label>
                <div style="display:flex;align-items:center;gap:6px;">
                  <input type="range" id="sm-rotate" min="-30" max="30" value="0" oninput="document.getElementById('sm-rotate-val').textContent=this.value+'°';updateSignature()" style="flex:1;">
                  <span id="sm-rotate-val" style="font-size:13px;color:var(--text-light);min-width:30px;">0°</span>
                </div>
              </div>
            </div>
            <div class="row-2" style="margin-bottom:10px;">
              <div class="input-group">
                <label>📄 签名背景</label>
                <select id="sm-bg" onchange="redrawSignatureCanvas()" style="width:100%;">
                  <option value="transparent">透明背景</option>
                  <option value="white">白底</option>
                  <option value="lined">信纸横线</option>
                  <option value="contract">合同横线</option>
                  <option value="grid">网格纸</option>
                </select>
              </div>
              <div class="input-group">
                <label>〰️ 签名线</label>
                <select id="sm-underline" onchange="redrawSignatureCanvas()" style="width:100%;">
                  <option value="none">无</option>
                  <option value="solid">实线</option>
                  <option value="dashed">虚线</option>
                  <option value="dotted">点线</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 右侧：签名绘制区 -->
          <div style="padding-left:16px;">
            <h4 style="font-size:15px;font-weight:600;margin-bottom:12px;color:var(--primary);">🎨 签名绘制</h4>
            <div class="input-group" id="sm-draw-area">
              <label>绘制区域（鼠标或手指拖动）</label>
              <div id="sm-canvas-wrapper" style="border:2px dashed var(--border);border-radius:10px;position:relative;overflow:hidden;touch-action:none;width:100%;max-width:500px;margin:8px auto;">
                <canvas id="sm-canvas" width="500" height="200" style="width:100%;height:auto;display:block;cursor:crosshair;"></canvas>
              </div>
              <div style="display:flex;gap:8px;justify-content:center;margin-top:8px;flex-wrap:wrap;">
                <button class="btn btn-secondary" onclick="clearSignature()">🗑️ 清空</button>
                <button class="btn btn-secondary" onclick="undoSignature()">↩️ 撤销</button>
                <button class="btn btn-secondary" onclick="randomSignatureStyle()">🎲 随机风格</button>
              </div>
            </div>
            <div class="btn-group" style="justify-content:center;margin-top:12px;flex-wrap:wrap;">
              <button class="btn btn-primary" onclick="downloadSignature()">📥 下载 PNG</button>
              <button class="btn btn-secondary" onclick="copySignature()">📋 复制到剪贴板</button>
              <button class="btn btn-secondary" onclick="downloadSignatureSVG()">📄 下载 SVG</button>
            </div>
            <div id="sm-preview" style="text-align:center;margin-top:12px;min-height:80px;display:none;background:var(--bg);border-radius:10px;padding:20px;border:1px solid var(--border);">
              <div class="label" style="margin-bottom:8px;">签名预览</div>
              <img id="sm-preview-img" style="max-height:120px;border-radius:4px;padding:8px;">
            </div>
            <div id="sm-status" style="margin-top:8px;font-size:13px;color:var(--text-light);text-align:center;"></div>
          </div>
        </div>
        <div style="margin-top:10px;padding:10px;background:#f0f9ff;border-radius:8px;font-size:12px;color:#075985;line-height:1.6;">💡 灵感来源于 DocuSign、HelloSign 等付费电子签名工具（$10-15/月），我们的免费版支持多种笔触风格和背景，生成的PNG带透明背景，可用于合同、文件等场景。</div>
      </div>
    `,
    handler: () => { setTimeout(initSignatureMaker, 100); }
  },

  // ==================== SVG 在线编辑器 ====================
  {
    id: 'svg-editor',
    cat: 'image',
    icon: '🎨',
    name: 'SVG 在线编辑器',
    desc: '在线绘制和编辑SVG图形，支持矩形、圆形、线条、文字，可导出为SVG文件',
    html: `
      <div class="tool-card">
        <div class="row-2" style="margin-bottom:10px;">
          <div class="input-group">
            <label>🟦 形状工具</label>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button class="btn btn-secondary" onclick="svgSetTool('rect')" style="font-size:12px;padding:4px 10px;flex:1;">⬜ 矩形</button>
              <button class="btn btn-secondary" onclick="svgSetTool('circle')" style="font-size:12px;padding:4px 10px;flex:1;">⚪ 圆形</button>
              <button class="btn btn-secondary" onclick="svgSetTool('line')" style="font-size:12px;padding:4px 10px;flex:1;">📏 线条</button>
              <button class="btn btn-secondary" onclick="svgSetTool('text')" style="font-size:12px;padding:4px 10px;flex:1;">🔤 文字</button>
              <button class="btn btn-secondary" onclick="svgSetTool('select')" style="font-size:12px;padding:4px 10px;flex:1;">👆 选择</button>
            </div>
          </div>
          <div class="input-group">
            <label>🎨 样式</label>
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
              <input type="color" id="svg-fill" value="#6366f1" onchange="svgUpdateStyle()" style="width:36px;height:32px;padding:1px;border:none;cursor:pointer;border-radius:4px;">
              <span style="font-size:11px;">填充</span>
              <input type="color" id="svg-stroke" value="#333333" onchange="svgUpdateStyle()" style="width:36px;height:32px;padding:1px;border:none;cursor:pointer;border-radius:4px;">
              <span style="font-size:11px;">描边</span>
              <select id="svg-stroke-width" onchange="svgUpdateStyle()" style="width:60px;font-size:12px;">
                <option value="1">1px</option>
                <option value="2" selected>2px</option>
                <option value="3">3px</option>
                <option value="4">4px</option>
              </select>
              <span style="font-size:11px;">粗细</span>
            </div>
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="svgAddRect()" style="font-size:12px;padding:4px 12px;">+ 矩形</button>
          <button class="btn btn-primary" onclick="svgAddCircle()" style="font-size:12px;padding:4px 12px;">+ 圆形</button>
          <button class="btn btn-primary" onclick="svgAddLine()" style="font-size:12px;padding:4px 12px;">+ 线条</button>
          <button class="btn btn-primary" onclick="svgAddText()" style="font-size:12px;padding:4px 12px;">+ 文字</button>
          <button class="btn btn-secondary" onclick="svgDeleteSelected()" style="font-size:12px;padding:4px 12px;">🗑️ 删除选中</button>
          <button class="btn btn-secondary" onclick="svgClear()" style="font-size:12px;padding:4px 12px;">🗑️ 清空全部</button>
          <button class="btn btn-success" onclick="svgExport()" style="font-size:12px;padding:4px 12px;">⬇️ 导出 SVG</button>
        </div>
        <div style="text-align:center;">
          <svg id="svg-canvas" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:400px;border:1px solid var(--border);border-radius:8px;background:#ffffff;cursor:crosshair;overflow:visible;"></svg>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 点击「+」按钮添加图形，或点击图形选中后按 Delete 删除。灵感来源于 Sketch、Figma 等付费设计工具（$12-15/月）。
        </div>
      </div>
    `,
    handler: () => { setTimeout(initSvgEditor, 100); }
  },

  // ==================== 图片颜色提取器 ====================
  {
    id: 'color-extractor',
    cat: 'color',
    icon: '🎨',
    name: '图片颜色提取器',
    desc: '从图片中提取主要颜色，生成调色板，一键复制色值，支持HEX/RGB格式',
    html: `
      <div class="tool-card">
        <div class="row-2" style="margin-bottom:12px;">
          <div class="input-group">
            <label>📁 上传图片</label>
            <div style="display:flex;gap:8px;align-items:center;">
              <input type="file" id="ce-file" accept="image/*" style="display:none;" onchange="ceExtract()">
              <button class="btn btn-secondary" onclick="document.getElementById('ce-file').click()" style="flex:1;">📁 选择图片</button>
              <span id="ce-filename" style="font-size:12px;color:var(--text-light);"></span>
            </div>
          </div>
          <div class="input-group">
            <label>⚙️ 提取设置</label>
            <div style="display:flex;gap:6px;align-items:center;">
              <select id="ce-count" onchange="ceExtract()" style="width:100px;font-size:13px;">
                <option value="5">5 种颜色</option>
                <option value="8" selected>8 种颜色</option>
                <option value="12">12 种颜色</option>
                <option value="16">16 种颜色</option>
              </select>
              <label style="font-size:12px;display:flex;align-items:center;gap:4px;cursor:pointer;">
                <input type="checkbox" id="ce-sort" checked onchange="ceExtract()"> 按占比排序
              </label>
            </div>
          </div>
        </div>
        <div class="row-2" style="margin-bottom:12px;">
          <div style="text-align:center;">
            <canvas id="ce-preview" style="max-width:100%;max-height:200px;border-radius:8px;border:1px solid var(--border);display:none;"></canvas>
            <div id="ce-placeholder" style="height:120px;display:flex;align-items:center;justify-content:center;border:2px dashed var(--border);border-radius:8px;color:var(--text-light);font-size:14px;background:#fafafa;">
              📁 上传图片自动提取颜色
            </div>
          </div>
          <div>
            <div id="ce-palette" style="display:none;">
              <div style="font-size:14px;font-weight:600;margin-bottom:8px;color:var(--primary);">🎨 提取的调色板</div>
              <div id="ce-colors" style="display:grid;grid-template-columns:1fr 1fr;gap:6px;"></div>
              <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
                <button class="btn btn-secondary" onclick="ceCopyAllHex()" style="font-size:12px;padding:4px 10px;">📋 复制全部 HEX</button>
                <button class="btn btn-secondary" onclick="ceCopyAllRGB()" style="font-size:12px;padding:4px 10px;">📋 复制全部 RGB</button>
                <button class="btn btn-secondary" onclick="ceExportCSS()" style="font-size:12px;padding:4px 10px;">📋 导出 CSS</button>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Adobe Color、Coolors 等付费色彩工具（$9.99-19.99/月），免费版支持图片上传提取主色调、一键复制色值。
        </div>
      </div>
    `,
    handler: () => {}
  },

  // ---- 付费工具转免费：思维导图工具 (Miro/MindMeister替代) ----
  {
    id: 'mind-map',
    cat: 'dev',
    icon: '🧠',
    name: '思维导图工具',
    desc: '在线绘制思维导图，支持节点编辑、拖拽布局、导出PNG，无需注册',
    html: `
      <div class="tool-card">
        <div class="input-group" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="mmAddChild()">➕ 添加子节点</button>
          <button class="btn btn-secondary" onclick="mmAddSibling()">➕ 添加同级节点</button>
          <button class="btn btn-secondary" onclick="mmDeleteSelected()" style="background:#ef4444;">🗑️ 删除节点</button>
          <button class="btn btn-secondary" onclick="mmExportPNG()">⬇️ 导出PNG</button>
          <button class="btn btn-secondary" onclick="mmReset()">🔄 重置</button>
        </div>
        <div style="position:relative;width:100%;height:480px;background:#1a1a2e;border:1px solid #2a2a44;border-radius:12px;overflow:hidden;margin-top:8px;">
          <canvas id="mm-canvas" style="width:100%;height:100%;cursor:grab;"></canvas>
          <div id="mm-tooltip" style="display:none;position:absolute;bottom:12px;left:50%;transform:translateX(-50%);background:#2a2a44;color:#ccc;padding:6px 14px;border-radius:20px;font-size:12px;pointer-events:none;white-space:nowrap;">
            🖱️ 点击选中节点 · 拖拽移动 · 双击编辑文字
          </div>
        </div>
        <div id="mm-edit-panel" style="display:none;margin-top:12px;padding:16px;background:var(--card-bg);border:1px solid var(--border);border-radius:10px;">
          <div class="row" style="gap:8px;align-items:center;">
            <label style="font-size:13px;white-space:nowrap;">编辑文字：</label>
            <input type="text" id="mm-edit-text" style="flex:1;" onkeydown="if(event.key==='Enter')mmConfirmEdit()">
            <button class="btn btn-primary" onclick="mmConfirmEdit()" style="padding:6px 16px;">确定</button>
          </div>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Miro（$8-16/月）、MindMeister（$5-13/月）等付费思维导图工具，免费版支持节点编辑、拖拽和导出PNG。
        </div>
      </div>
    `,
    handler: () => { setTimeout(mmInit, 100); }
  },

  // ---- 付费工具转免费：图片艺术效果 (Prisma/PicsArt替代) ----
  {
    id: 'art-filter',
    cat: 'image',
    icon: '✨',
    name: '图片艺术效果',
    desc: '在线给图片添加艺术滤镜，支持素描、油画、马赛克、浮雕、漫画等效果',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>选择图片</label>
          <input type="file" id="af-input" accept="image/*" onchange="afLoadImage(event)">
        </div>
        <div class="row" style="gap:8px;margin-top:8px;flex-wrap:wrap;">
          <button class="btn btn-secondary" onclick="afApplyFilter('pencil')" style="font-size:13px;">✏️ 素描</button>
          <button class="btn btn-secondary" onclick="afApplyFilter('oil')" style="font-size:13px;">🎨 油画</button>
          <button class="btn btn-secondary" onclick="afApplyFilter('mosaic')" style="font-size:13px;">🧩 马赛克</button>
          <button class="btn btn-secondary" onclick="afApplyFilter('emboss')" style="font-size:13px;">🏛️ 浮雕</button>
          <button class="btn btn-secondary" onclick="afApplyFilter('comic')" style="font-size:13px;">🖍️ 漫画</button>
          <button class="btn btn-secondary" onclick="afApplyFilter('vintage')" style="font-size:13px;">📻 复古</button>
          <button class="btn btn-secondary" onclick="afApplyFilter('edge')" style="font-size:13px;">✒️ 边缘检测</button>
          <button class="btn btn-secondary" onclick="afReset()" style="font-size:13px;">🔄 原图</button>
        </div>
        <div style="position:relative;width:100%;min-height:300px;background:#1a1a2e;border:1px solid #2a2a44;border-radius:12px;margin-top:8px;display:flex;align-items:center;justify-content:center;overflow:hidden;">
          <canvas id="af-canvas" style="display:none;max-width:100%;max-height:500px;"></canvas>
          <div id="af-placeholder" style="color:var(--text-light);padding:40px;text-align:center;">
            <div style="font-size:48px;margin-bottom:12px;">🖼️</div>
            <div>上传图片后选择滤镜效果</div>
          </div>
        </div>
        <div class="btn-group" style="margin-top:8px;">
          <button class="btn btn-primary" id="af-download-btn" style="display:none;" onclick="afDownload()">⬇️ 下载效果图</button>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Prisma（$7.99/月）、PicsArt Premium（$11.99/月）等付费艺术滤镜应用，免费版支持多种图片艺术效果，纯本地处理不上传。
        </div>
      </div>
    `,
    handler: () => {}
  },

  // ---- 付费工具转免费：在线表单制作工具 (Typeform替代) ----
  {
    id: 'form-builder',
    cat: 'document',
    icon: '📋',
    name: '在线表单制作工具',
    desc: '创建问卷、报名表、投票表单，支持单选/多选/填空/评分，一键生成分享链接',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>📋 在线表单制作工具</label>
          <p style="font-size:13px;color:var(--text-light);margin-top:4px;">免费创建问卷、报名表、投票表单，生成链接分享给朋友填写</p>
        </div>
        <!-- 编辑模式 -->
        <div id="fb-editor">
          <div id="fb-questions"></div>
          <div class="btn-group" style="flex-wrap:wrap;">
            <button class="btn btn-secondary" onclick="fbAddQuestion('radio')" style="font-size:13px;">➕ 单选题</button>
            <button class="btn btn-secondary" onclick="fbAddQuestion('checkbox')" style="font-size:13px;">➕ 多选题</button>
            <button class="btn btn-secondary" onclick="fbAddQuestion('text')" style="font-size:13px;">➕ 填空题</button>
            <button class="btn btn-secondary" onclick="fbAddQuestion('rating')" style="font-size:13px;">➕ 评分题</button>
          </div>
          <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="fbPreview()">👀 预览</button>
            <button class="btn btn-primary" onclick="fbShare()" style="background:#16a34a;">🔗 生成分享链接</button>
          </div>
          <div style="margin-top:8px;font-size:12px;color:var(--text-light);">
            💡 Tip：问题之间用"添加"按钮顺序排列，最多建议10个问题，链接会自动携带全部表单内容。
          </div>
        </div>
        <!-- 分享链接面板 -->
        <div id="fb-share-panel" style="display:none;margin-top:12px;padding:16px;background:#f0fdf4;border:1px solid #86efac;border-radius:10px;">
          <label style="font-weight:600;font-size:14px;">🔗 表单链接已生成</label>
          <p style="font-size:12px;color:var(--text-light);margin:6px 0;">把下面的链接发给别人，对方打开即可填写（链接包含全部题目，建议先测试一遍）。</p>
          <textarea id="fb-share-url" readonly style="min-height:60px;font-size:12px;word-break:break-all;"></textarea>
          <div class="btn-group" style="margin-top:8px;">
            <button class="btn btn-primary" onclick="fbCopyUrl()" style="font-size:13px;">📋 复制链接</button>
            <button class="btn btn-secondary" onclick="fbOpenForm()" style="font-size:13px;">🌐 预览填写页</button>
            <button class="btn btn-secondary" onclick="fbBackEditor()" style="font-size:13px;">⬅️ 返回编辑</button>
          </div>
        </div>
        <!-- 预览模式 -->
        <div id="fb-preview" style="display:none;margin-top:12px;">
          <div class="input-group"><label>👀 预览模式</label></div>
          <div id="fb-preview-questions"></div>
          <div class="btn-group" style="margin-top:12px;">
            <button class="btn btn-secondary" onclick="fbBackEditor()">⬅️ 返回编辑</button>
          </div>
        </div>
        <!-- 填写模式 -->
        <div id="fb-form" style="display:none;margin-top:12px;">
          <div class="input-group">
            <label id="fb-form-title">📋 表单</label>
          </div>
          <div id="fb-form-questions"></div>
          <div class="btn-group" style="margin-top:12px;">
            <button class="btn btn-primary" onclick="fbSubmit()">✅ 提交</button>
            <button class="btn btn-secondary" onclick="fbResetForm()">🔄 重填</button>
          </div>
        </div>
        <!-- 结果模式 -->
        <div id="fb-result" style="display:none;margin-top:12px;">
          <div class="input-group"><label>✅ 提交成功，您的回答：</label></div>
          <div id="fb-result-content" style="background:var(--card-bg);border:1px solid var(--border);border-radius:10px;padding:16px;"></div>
          <div class="btn-group" style="margin-top:12px;">
            <button class="btn btn-primary" onclick="fbCopyResult()">📋 复制我的答案</button>
            <button class="btn btn-secondary" onclick="fbResetForm()">🔄 重新填写</button>
          </div>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Typeform（$25/月）等付费表单工具，免费版支持4种题型、链接分享、结果导出，数据只存在链接里，不上传服务器。
        </div>
      </div>
    `,
    handler: () => { setTimeout(fbInit, 100); }
  },

  // ---- 付费工具转免费：词云生成器 (WordArt.com替代) ----
  {
    id: 'word-cloud',
    cat: 'fun',
    icon: '☁️',
    name: '词云生成器',
    desc: '在线生成词云图，支持中文分词、自定义颜色布局，一键下载PNG',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>输入文字</label>
          <textarea id="wc-input" style="min-height:140px;" placeholder="输入或粘贴文字，支持中英文。例：&#10;梦想 未来 奋斗 梦想 科技 未来 创新 梦想 学习 进步 科技 未来 奋斗 坚持 梦想"></textarea>
        </div>
        <div class="row" style="gap:12px;align-items:center;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>布局形状</label>
            <select id="wc-shape" style="width:100%;">
              <option value="circle">⚪ 圆形</option>
              <option value="heart">❤️ 心形</option>
              <option value="cloud">☁️ 云朵</option>
              <option value="diamond">💎 菱形</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>配色风格</label>
            <select id="wc-palette" style="width:100%;">
              <option value="rainbow">🌈 彩虹</option>
              <option value="blue">🔵 深海蓝</option>
              <option value="warm">🔥 暖橙红</option>
              <option value="fresh">🌿 清新绿</option>
              <option value="dark">🌑 暗夜紫</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>最大词数</label>
            <select id="wc-max" style="width:100%;">
              <option value="30">30 个</option>
              <option value="50" selected>50 个</option>
              <option value="80">80 个</option>
            </select>
          </div>
        </div>
        <div class="btn-group" style="margin-top:10px;">
          <button class="btn btn-primary" onclick="wcGenerate()">☁️ 生成词云</button>
          <button class="btn btn-secondary" id="wc-download-btn" style="display:none;" onclick="wcDownload()">⬇️ 下载PNG</button>
        </div>
        <div style="position:relative;width:100%;height:460px;background:var(--card-bg);border:1px solid var(--border);border-radius:12px;margin-top:8px;overflow:hidden;">
          <canvas id="wc-canvas" style="width:100%;height:100%;"></canvas>
          <div id="wc-placeholder" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-light);">
            <div style="font-size:48px;margin-bottom:12px;">☁️</div>
            <div>输入文字后点击"生成词云"</div>
          </div>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 WordArt.com（$39/年）、WordClouds 等付费词云工具，免费版支持中文分词、4种形状、5种配色，纯本地生成不上传。
        </div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'pixel-art',
    cat: 'image',
    icon: '👾',
    name: '像素画生成器',
    desc: '图片一键转像素画（复古像素风），可调像素块大小与色阶，支持网格线，导出PNG',
    html: `
      <div class="tool-card">
        <div class="row" style="gap:12px;align-items:flex-end;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:200px;">
            <label>上传图片</label>
            <input type="file" id="pa-file" accept="image/*" style="width:100%;">
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>像素块大小</label>
            <select id="pa-pixel" style="width:100%;">
              <option value="4">4px（细腻）</option>
              <option value="8" selected>8px（经典）</option>
              <option value="12">12px（粗犷）</option>
              <option value="16">16px（马赛克）</option>
              <option value="24">24px（超大块）</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>色彩细腻度</label>
            <select id="pa-colors" style="width:100%;">
              <option value="4">极简 4级色</option>
              <option value="8" selected>复古 8级色</option>
              <option value="16">丰富 16级色</option>
              <option value="64">细腻 64级色</option>
              <option value="256">全彩 256级</option>
            </select>
          </div>
          <div class="input-group" style="min-width:120px;">
            <label><input type="checkbox" id="pa-grid" onchange="paGenerate()"> 显示网格线</label>
          </div>
        </div>
        <div class="btn-group" style="margin-top:10px;">
          <button class="btn btn-primary" onclick="paGenerate()">👾 生成像素画</button>
          <button class="btn btn-secondary" id="pa-download-btn" style="display:none;" onclick="paDownload()">⬇️ 下载PNG</button>
          <button class="btn btn-secondary" onclick="paReset()">🔄 重新选择</button>
        </div>
        <div style="position:relative;width:100%;height:420px;background:var(--card-bg);border:1px solid var(--border);border-radius:12px;margin-top:8px;overflow:auto;display:flex;align-items:center;justify-content:center;">
          <canvas id="pa-canvas" style="display:none;image-rendering:pixelated;image-rendering:crisp-edges;max-width:100%;height:auto;"></canvas>
          <div id="pa-placeholder" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-light);">
            <div style="font-size:48px;margin-bottom:12px;">👾</div>
            <div>上传图片后点击"生成像素画"</div>
          </div>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 PixelMe（$10）、PixelIt 等付费像素画工具，本工具纯前端本地转换，图片不上传服务器，支持导出无损PNG。
        </div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'email-signature',
    cat: 'document',
    icon: '✉️',
    name: '邮件签名生成器',
    desc: '免费制作专业邮件签名，输入信息即生成HTML代码，支持Gmail/Outlook/QQ邮箱一键粘贴',
    html: `
      <div class="tool-card">
        <div class="row-2">
          <div>
            <div class="input-group">
              <label>姓名 *</label>
              <input type="text" id="es-name" placeholder="张三" oninput="esPreview()">
            </div>
            <div class="input-group">
              <label>职位</label>
              <input type="text" id="es-title" placeholder="产品经理" oninput="esPreview()">
            </div>
            <div class="input-group">
              <label>公司</label>
              <input type="text" id="es-company" placeholder="某某科技有限公司" oninput="esPreview()">
            </div>
            <div class="row" style="gap:12px;">
              <div class="input-group" style="flex:1;">
                <label>手机</label>
                <input type="text" id="es-phone" placeholder="13800138000" oninput="esPreview()">
              </div>
              <div class="input-group" style="flex:1;">
                <label>邮箱</label>
                <input type="text" id="es-email" placeholder="name@example.com" oninput="esPreview()">
              </div>
            </div>
            <div class="input-group">
              <label>个人网站 / 微信</label>
              <input type="text" id="es-web" placeholder="www.example.com" oninput="esPreview()">
            </div>
            <div class="row" style="gap:12px;align-items:center;flex-wrap:wrap;">
              <div class="input-group" style="width:180px;">
                <label>主题色</label>
                <input type="color" id="es-color" value="#4f46e5" oninput="esPreview()" style="width:100%;height:38px;padding:2px;cursor:pointer;">
              </div>
              <div class="input-group" style="flex:1;min-width:180px;">
                <label>布局风格</label>
                <select id="es-layout" onchange="esPreview()" style="width:100%;">
                  <option value="classic">经典 · 分隔线</option>
                  <option value="modern">现代 · 色块</option>
                  <option value="simple">简约 · 无边框</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <label>实时预览</label>
            <div id="es-preview" style="background:#ffffff;border:1px solid var(--border);border-radius:12px;padding:20px;min-height:220px;overflow:auto;"></div>
            <div class="btn-group" style="margin-top:10px;">
              <button class="btn btn-primary" onclick="esCopyHtml()">📋 复制HTML代码</button>
              <button class="btn btn-secondary" onclick="esCopyText()">📝 复制纯文本</button>
            </div>
          </div>
        </div>
        <div class="input-group" style="margin-top:14px;">
          <label>生成的HTML代码（粘贴到邮箱设置→签名）</label>
          <textarea id="es-code" style="min-height:130px;font-family:monospace;font-size:12px;" readonly></textarea>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 WiseStamp（$3-6/月）、Newoldstamp 等付费邮件签名工具，本工具免费生成兼容Gmail/Outlook/QQ邮箱的响应式签名。
        </div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'chart-maker',
    cat: 'dev',
    icon: '📊',
    name: '在线图表生成器',
    desc: '免费在线制作柱状图、折线图、饼图、雷达图，输入数据一键生成，支持导出PNG',
    html: `
      <div class="tool-card">
        <div class="row" style="gap:12px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:200px;">
            <label>图表类型</label>
            <select id="cm-type" onchange="cmPreview()" style="width:100%;">
              <option value="bar">📊 柱状图</option>
              <option value="line">📈 折线图</option>
              <option value="pie">🥧 饼图</option>
              <option value="barh">📊 条形图（横向）</option>
              <option value="radar">🕸️ 雷达图</option>
            </select>
          </div>
          <div class="input-group" style="width:160px;">
            <label>主题色</label>
            <input type="color" id="cm-color" value="#4f46e5" oninput="cmPreview()" style="width:100%;height:38px;padding:2px;cursor:pointer;">
          </div>
          <div class="input-group" style="width:160px;">
            <label>背景色</label>
            <input type="color" id="cm-bg" value="#ffffff" oninput="cmPreview()" style="width:100%;height:38px;padding:2px;cursor:pointer;">
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>图表标题</label>
            <input type="text" id="cm-title" placeholder="输入标题" oninput="cmPreview()" style="width:100%;">
          </div>
        </div>
        <div class="row" style="gap:12px;margin-top:6px;">
          <div class="input-group" style="flex:1;">
            <label>数据（每行一个：标签,数值）</label>
            <textarea id="cm-data" style="min-height:140px;font-family:monospace;font-size:13px;" oninput="cmPreview()">一月,85
二月,120
三月,95
四月,150
五月,110
六月,135</textarea>
          </div>
          <div class="input-group" style="flex:1;">
            <label>数据系列2（可选，每行数值）</label>
            <textarea id="cm-data2" style="min-height:140px;font-family:monospace;font-size:13px;" oninput="cmPreview()" placeholder="65
98
78
120
90
110"></textarea>
          </div>
        </div>
        <div class="btn-group" style="margin-top:10px;">
          <button class="btn btn-primary" onclick="cmGenerate()">📊 生成图表</button>
          <button class="btn btn-secondary" id="cm-download-btn" style="display:none;" onclick="cmDownload()">⬇️ 下载PNG</button>
          <button class="btn btn-secondary" onclick="cmResetData()">🔄 重置数据</button>
        </div>
        <div style="position:relative;width:100%;height:480px;background:var(--card-bg);border:1px solid var(--border);border-radius:12px;margin-top:8px;overflow:hidden;">
          <canvas id="cm-canvas" style="width:100%;height:100%;"></canvas>
          <div id="cm-placeholder" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-light);">
            <div style="font-size:48px;margin-bottom:12px;">📊</div>
            <div>编辑数据后点击"生成图表"</div>
          </div>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Visme（$25/月）、Piktochart 等付费数据可视化工具，本工具免费生成5种图表+双系列对比，纯本地绘制不上传数据。
        </div>
      </div>
    `,
    handler: () => {}
  },
  {
    id: 'mockup-maker',
    cat: 'image',
    icon: '📱',
    name: '截图美化/设备样机',
    desc: '上传截图套上手机/笔记本/浏览器设备壳，自定义背景，一键生成精美展示图',
    html: `
      <div class="tool-card">
        <div class="row" style="gap:12px;align-items:flex-end;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:200px;">
            <label>上传截图</label>
            <input type="file" id="mm-file" accept="image/*" style="width:100%;">
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>设备样式</label>
            <select id="mm-device" style="width:100%;">
              <option value="iphone">📱 iPhone 手机</option>
              <option value="android">📱 安卓手机</option>
              <option value="browser">🌐 浏览器窗口</option>
              <option value="laptop">💻 笔记本电脑</option>
              <option value="ipad">📟 iPad 平板</option>
            </select>
          </div>
          <div class="input-group" style="min-width:140px;">
            <label>背景色</label>
            <input type="color" id="mm-bg" value="#667eea" style="width:100%;height:38px;padding:2px;cursor:pointer;">
          </div>
          <div class="input-group" style="min-width:120px;">
            <label>内阴影</label>
            <select id="mm-shadow" style="width:100%;">
              <option value="none">无</option>
              <option value="soft" selected>柔和阴影</option>
              <option value="hard">硬阴影</option>
            </select>
          </div>
        </div>
        <div class="btn-group" style="margin-top:10px;">
          <button class="btn btn-primary" onclick="mmGenerate()">📱 生成样机</button>
          <button class="btn btn-secondary" id="mm-download-btn" style="display:none;" onclick="mmDownload()">⬇️ 下载PNG</button>
          <button class="btn btn-secondary" onclick="mmReset()">🔄 重新选择</button>
        </div>
        <div style="position:relative;width:100%;min-height:380px;background:var(--card-bg);border:1px solid var(--border);border-radius:12px;margin-top:8px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
          <canvas id="mm-canvas" style="display:none;max-width:100%;max-height:500px;"></canvas>
          <div id="mm-placeholder" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-light);">
            <div style="font-size:48px;margin-bottom:12px;">📱</div>
            <div>上传截图后点击"生成样机"</div>
          </div>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Screenshot Guru（$9-19/月）、Screely 等付费样机工具，本工具免费生成5种设备样机，纯本地处理不上传图片。
        </div>
      </div>
    `,
    handler: () => {}
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
  },

  // ==================== 配色方案生成器 (替代 Coolors.co) ====================
  {
    id: 'color-palette',
    cat: 'color',
    icon: '🎭',
    name: '配色方案生成器',
    desc: '灵感来源于 Coolors（$36/年），一键生成和谐配色方案，支持锁定颜色、多种配色模式、导出CSS变量',
    html: `
      <div class="tool-card">
        <div class="row" style="gap:8px;margin-bottom:12px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>配色模式</label>
            <select id="cp-mode" onchange="cpGenerate()" style="width:100%;">
              <option value="random">🎲 随机配色</option>
              <option value="complementary">🔄 互补色</option>
              <option value="analogous">🌈 类似色</option>
              <option value="triadic">🔺 三色系</option>
              <option value="monochromatic">◐ 单色系</option>
              <option value="tetradic">🔲 四色系</option>
            </select>
          </div>
          <div class="input-group" style="flex:0 0 auto;min-width:120px;">
            <label>颜色数量</label>
            <select id="cp-count" onchange="cpGenerate()" style="width:100%;">
              <option value="3">3 色</option>
              <option value="4">4 色</option>
              <option value="5" selected>5 色</option>
              <option value="6">6 色</option>
            </select>
          </div>
        </div>
        <div id="cp-palette" style="display:flex;gap:6px;border-radius:12px;overflow:hidden;min-height:120px;flex-wrap:wrap;"></div>
        <div class="row" style="margin-top:12px;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="cpGenerate()" style="flex:1;">🎲 生成新配色</button>
          <button class="btn btn-secondary" onclick="cpCopyAll()">📋 复制全部</button>
          <button class="btn btn-secondary" onclick="cpExportCSS()">🎨 导出CSS</button>
        </div>
        <div id="cp-css-output" style="display:none;margin-top:10px;">
          <div class="input-group">
            <label>CSS 自定义属性</label>
            <div style="display:flex;gap:8px;">
              <input type="text" id="cp-css-text" readonly style="flex:1;font-family:monospace;font-size:12px;background:#1a1a2e;color:#a78bfa;padding:10px 14px;">
              <button class="btn btn-secondary" onclick="copyId('cp-css-text')">📋 复制</button>
            </div>
          </div>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Coolors.co — 按 <kbd>空格键</kbd> 快速换色 · 点击颜色可锁定/解锁
        </div>
      </div>
    `,
    handler: () => { setTimeout(cpInit, 50); }
  },

  // ==================== 在线录音工具 (替代 Online Voice Recorder) ====================
  {
    id: 'audio-recorder',
    cat: 'media',
    icon: '🎤',
    name: '在线录音工具',
    desc: '灵感来源于 Online Voice Recorder（付费），浏览器内录音、回放、下载，无需安装任何软件',
    html: `
      <div class="tool-card">
        <div class="ar-status" id="ar-status" style="text-align:center;padding:10px;background:var(--bg-card);border-radius:10px;margin-bottom:12px;font-size:15px;color:var(--text-light);">
          🎤 点击下方按钮开始录音
        </div>
        <div style="text-align:center;margin-bottom:12px;">
          <canvas id="ar-waveform" style="width:100%;height:80px;border-radius:10px;background:#1a1a2e;"></canvas>
        </div>
        <div class="btn-group" style="justify-content:center;gap:10px;">
          <button class="btn btn-primary" id="ar-record-btn" onclick="arToggleRecord()">🔴 开始录音</button>
          <button class="btn btn-secondary" id="ar-play-btn" onclick="arTogglePlay()" disabled>▶️ 播放</button>
          <button class="btn btn-secondary" id="ar-download-btn" onclick="arDownload()" disabled>⬇️ 下载WAV</button>
        </div>
        <div class="row" style="margin-top:12px;gap:8px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:100px;">
            <label>录音时长</label>
            <div id="ar-duration" style="font-size:22px;font-weight:700;font-family:monospace;text-align:center;color:var(--text-light);">00:00</div>
          </div>
          <div class="input-group" style="flex:1;min-width:100px;">
            <label>音频格式</label>
            <select id="ar-format" style="width:100%;">
              <option value="wav">WAV (无损)</option>
              <option value="mp3">MP3 (压缩)</option>
            </select>
          </div>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Online Voice Recorder — 纯浏览器录音，数据不上传服务器，隐私安全
        </div>
      </div>
    `,
    handler: () => { setTimeout(arInit, 50); }
  },
  {
    id: 'image-upscaler',
    cat: 'image',
    icon: '🔍',
    name: '图片高清放大',
    desc: '灵感来源于 Bigjpg/AI图片放大（付费），纯前端高清放大图片 2x/3x/4x，附带智能锐化增强画质',
    html: `
      <div class="tool-card">
        <div style="text-align:center;margin-bottom:12px;">
          <input type="file" id="iu-file" accept="image/*" style="display:none;" onchange="iuLoadFile(this)">
          <button class="btn btn-primary" onclick="document.getElementById('iu-file').click()">📂 选择图片</button>
          <button class="btn btn-secondary" id="iu-download" onclick="iuDownload()" disabled>⬇️ 下载放大图</button>
        </div>
        <div class="row" style="margin-bottom:12px;gap:10px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>放大倍数</label>
            <select id="iu-scale" style="width:100%;" onchange="iuRender()">
              <option value="2">2x (2倍)</option>
              <option value="3">3x (3倍)</option>
              <option value="4">4x (4倍)</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>锐化强度</label>
            <select id="iu-sharpen" style="width:100%;" onchange="iuRender()">
              <option value="0">无</option>
              <option value="1" selected>轻度</option>
              <option value="2">中度</option>
              <option value="3">强力</option>
            </select>
          </div>
        </div>
        <div style="text-align:center;color:var(--text-light);font-size:13px;margin-bottom:10px;" id="iu-info">请选择一张图片开始</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
          <div style="flex:1;min-width:240px;">
            <div style="font-size:12px;color:var(--text-light);text-align:center;margin-bottom:4px;">原图</div>
            <div style="border:1px dashed var(--border);border-radius:10px;overflow:hidden;background:var(--bg-card);"><img id="iu-orig" style="width:100%;display:block;min-height:60px;" alt="原图"></div>
          </div>
          <div style="flex:1;min-width:240px;">
            <div style="font-size:12px;color:var(--text-light);text-align:center;margin-bottom:4px;">放大后</div>
            <div style="border:1px dashed var(--border);border-radius:10px;overflow:auto;background:var(--bg-card);max-height:320px;"><img id="iu-result" style="width:100%;display:block;min-height:60px;" alt="放大结果"></div>
          </div>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Bigjpg AI 放大（付费）— 纯浏览器 Canvas 高清重采样 + 锐化，图片不上传服务器
        </div>
      </div>
    `,
    handler: () => { setTimeout(iuInit, 50); }
  },
  {
    id: 'audio-speed-changer',
    cat: 'media',
    icon: '🎚️',
    name: '音频变速变调',
    desc: '灵感来源于付费音频变速器（如 AnyMP4/Video Speed Changer），在线改变音频速度与音调，保持音调变速或保持速度变调',
    html: `
      <div class="tool-card">
        <div style="text-align:center;margin-bottom:12px;">
          <input type="file" id="asc-file" accept="audio/*" style="display:none;" onchange="ascLoadFile(this)">
          <button class="btn btn-primary" onclick="document.getElementById('asc-file').click()">🎵 选择音频</button>
          <button class="btn btn-secondary" id="asc-play" onclick="ascTogglePlay()" disabled>▶️ 试听</button>
          <button class="btn btn-secondary" id="asc-download" onclick="ascDownload()" disabled>⬇️ 下载处理结果</button>
        </div>
        <div class="row" style="margin-bottom:12px;gap:10px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>速度 <span id="asc-speed-val" style="color:var(--accent);">1.00x</span></label>
            <input type="range" id="asc-speed" min="0.25" max="3" step="0.05" value="1" style="width:100%;" oninput="ascUpdateLabel()" onchange="ascSchedulePlay()">
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>音调 <span id="asc-pitch-val" style="color:var(--accent);">0 半音</span></label>
            <input type="range" id="asc-pitch" min="-12" max="12" step="1" value="0" style="width:100%;" oninput="ascUpdateLabel()" onchange="ascSchedulePlay()">
          </div>
        </div>
        <div class="row" style="gap:10px;flex-wrap:wrap;margin-bottom:12px;">
          <div class="input-group" style="flex:1;min-width:200px;">
            <label>预设</label>
            <select id="asc-preset" style="width:100%;" onchange="ascApplyPreset()">
              <option value="">— 选择预设 —</option>
              <option value="0.5,0">🎓 慢速学习 (0.5x)</option>
              <option value="0.75,0">🐢 适中慢速 (0.75x)</option>
              <option value="1,0">➡️ 正常 (1x)</option>
              <option value="1.25,0">🐇 快速收听 (1.25x)</option>
              <option value="1.5,0">⚡ 常用快速 (1.5x)</option>
              <option value="2,0">🚀 极速 (2x)</option>
              <option value="1,4">🎤 升调 +4</option>
              <option value="1,-4">🐻 降调 -4</option>
            </select>
          </div>
        </div>
        <div style="text-align:center;color:var(--text-light);font-size:13px;margin-bottom:10px;" id="asc-info">请选择一段音频（支持 MP3/WAV/M4A 等）</div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于付费音频变速器 — 基于 Web Audio API 实时变速（保持音调）、变调（保持速度），全程本地处理，隐私安全
        </div>
      </div>
    `,
    handler: () => { setTimeout(ascInit, 50); }
  },
  {
    id: 'code-shot',
    cat: 'dev',
    icon: '📸',
    name: '代码图片生成',
    desc: '灵感来源于 Carbon（付费），代码一键转精美分享图，语法高亮+多主题+Mac窗口风格，导出高清PNG',
    html: `
      <div class="tool-card">
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;">
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>主题</label>
            <select id="cs-theme" style="width:100%;" onchange="csRender()">
              <option value="dark">🌙 暗色 One Dark</option>
              <option value="light">☀️ 亮色 GitHub</option>
              <option value="dracula">🧛 Dracula</option>
              <option value="nord">❄️ Nord</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>语言</label>
            <select id="cs-lang" style="width:100%;" onchange="csRender()">
              <option value="js">JavaScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="bash">Shell</option>
              <option value="json">JSON</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>字号</label>
            <select id="cs-size" style="width:100%;" onchange="csRender()">
              <option value="14">14px</option>
              <option value="16" selected>16px</option>
              <option value="18">18px</option>
              <option value="20">20px</option>
            </select>
          </div>
        </div>
        <div class="input-group" style="margin-bottom:10px;">
          <label>粘贴代码</label>
          <textarea id="cs-code" rows="8" style="width:100%;font-family:monospace;font-size:14px;background:#1a1a2e;color:#e0e0e0;border:1px solid var(--border);border-radius:8px;padding:10px;" oninput="csRender()">function greet(name) {
  // 输出问候语
  const msg = 'Hello, ' + name + '!';
  console.log(msg);
  return msg.length;
}

greet('世界');</textarea>
        </div>
        <div style="text-align:center;margin-bottom:10px;">
          <button class="btn btn-secondary" onclick="csRandExample()">🎲 随机示例</button>
          <button class="btn btn-primary" onclick="csDownload()">⬇️ 下载PNG截图</button>
        </div>
        <div style="text-align:center;font-size:12px;color:var(--text-light);margin-bottom:8px;">实时预览（点击图片可查看大图）</div>
        <div style="text-align:center;border:1px dashed var(--border);border-radius:12px;padding:12px;background:var(--bg-card);overflow:auto;">
          <canvas id="cs-canvas" style="max-width:100%;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,0.3);"></canvas>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Carbon（付费）— 代码截图美化分享利器，纯浏览器 Canvas 绘制，代码不上传服务器
        </div>
      </div>
    `,
    handler: () => { setTimeout(csInit, 50); }
  },
  {
    id: 'table-converter',
    cat: 'dev',
    icon: '📊',
    name: '表格数据转换',
    desc: '灵感来源于 TableConvert（付费），JSON / CSV / HTML表格 三格式一键互转，自动识别数据格式',
    html: `
      <div class="tool-card">
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;">
          <div class="input-group" style="flex:1;min-width:130px;">
            <label>输入格式</label>
            <select id="tc-from" style="width:100%;">
              <option value="auto">🤖 自动识别</option>
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="html">HTML表格</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:130px;">
            <label>输出格式</label>
            <select id="tc-to" style="width:100%;">
              <option value="json">JSON</option>
              <option value="csv" selected>CSV</option>
              <option value="html">HTML表格</option>
            </select>
          </div>
          <div style="display:flex;align-items:flex-end;gap:8px;">
            <button class="btn btn-primary" onclick="tcConvert()">🔄 转换</button>
          </div>
        </div>
        <div class="row" style="gap:10px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:280px;">
            <label>输入数据</label>
            <textarea id="tc-input" rows="10" style="width:100%;font-family:monospace;font-size:13px;background:#1a1a2e;color:#e0e0e0;border:1px solid var(--border);border-radius:8px;padding:10px;">[{"name":"张三","age":28,"city":"北京"},{"name":"李四","age":32,"city":"上海"},{"name":"王五","age":25,"city":"广州"}]</textarea>
          </div>
          <div class="input-group" style="flex:1;min-width:280px;">
            <label>输出结果 <button class="btn btn-secondary" style="padding:2px 10px;font-size:12px;margin-left:6px;" onclick="tcCopy()">📋 复制</button> <button class="btn btn-secondary" style="padding:2px 10px;font-size:12px;" onclick="tcDownload()">⬇️ 下载</button></label>
            <textarea id="tc-output" rows="10" readonly style="width:100%;font-family:monospace;font-size:13px;background:#0f0f1a;color:#7ee787;border:1px solid var(--border);border-radius:8px;padding:10px;"></textarea>
          </div>
        </div>
        <div style="margin-top:10px;text-align:center;"><button class="btn btn-secondary" onclick="tcExample()">🎲 换一个示例</button></div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 TableConvert（付费）— 在线表格数据格式转换神器，纯本地解析，无需登录
        </div>
      </div>
    `,
    handler: () => { setTimeout(tcInit, 50); }
  },
  {
    id: 'drawing-pad',
    cat: 'fun',
    icon: '🎨',
    name: '涂鸦画板',
    desc: '灵感来源于 Paper / Sketchbook（付费），自由手绘涂鸦，多种笔刷颜色、画笔粗细，支持清空和下载PNG',
    html: `
      <div class="tool-card">
        <div class="row" style="gap:10px;flex-wrap:wrap;margin-bottom:10px;">
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>颜色</label>
            <input type="color" id="dp-color" value="#1a1a2e" style="width:100%;height:36px;border:none;border-radius:6px;cursor:pointer;" onchange="dpUpdate()">
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>画笔粗细</label>
            <select id="dp-size" style="width:100%;" onchange="dpUpdate()">
              <option value="2">细 (2px)</option>
              <option value="4">中 (4px) </option>
              <option value="8" selected>粗 (8px)</option>
              <option value="16">极粗 (16px)</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>画笔模式</label>
            <select id="dp-mode" style="width:100%;" onchange="dpUpdate()">
              <option value="pen">✏️ 普通画笔</option>
              <option value="eraser">🧹 橡皮擦</option>
              <option value="spray">💨 喷枪</option>
            </select>
          </div>
        </div>
        <div style="text-align:center;margin-bottom:10px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
          <button class="btn btn-primary" onclick="dpClear()">🗑️ 清空画板</button>
          <button class="btn btn-secondary" onclick="dpUndo()">↩️ 撤销</button>
          <button class="btn btn-secondary" onclick="dpDownload()">⬇️ 下载PNG</button>
        </div>
        <div style="border:2px dashed var(--border);border-radius:10px;overflow:hidden;background:#fff;touch-action:none;">
          <canvas id="dp-canvas" style="display:block;width:100%;height:400px;cursor:crosshair;background:#fff;"></canvas>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Paper / Sketchbook（付费）— 纯浏览器 Canvas 绘图，数据不上传服务器，隐私安全
        </div>
      </div>
    `,
    handler: () => { setTimeout(dpInit, 50); }
  },
  {
    id: 'image-to-lineart',
    cat: 'image',
    icon: '✏️',
    name: '图片转线稿',
    desc: '灵感来源于 Vector Magic（付费），一键将照片转为黑白线稿/轮廓图，边缘检测+Sobel算子，支持下载PNG',
    html: `
      <div class="tool-card">
        <div style="text-align:center;margin-bottom:12px;">
          <input type="file" id="il-file" accept="image/*" style="display:none;" onchange="ilLoadFile(this)">
          <button class="btn btn-primary" onclick="document.getElementById('il-file').click()">📂 选择图片</button>
          <button class="btn btn-secondary" id="il-download" onclick="ilDownload()" disabled>⬇️ 下载线稿</button>
        </div>
        <div class="row" style="margin-bottom:12px;gap:10px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>边缘增强</label>
            <select id="il-strength" style="width:100%;" onchange="ilRender()">
              <option value="1">轻度</option>
              <option value="2" selected>适中</option>
              <option value="3">强力</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>线条颜色</label>
            <select id="il-color" style="width:100%;" onchange="ilRender()">
              <option value="black">黑色线条</option>
              <option value="white">白色线条</option>
              <option value="blue">蓝色线条</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>背景</label>
            <select id="il-bg" style="width:100%;" onchange="ilRender()">
              <option value="white">白色背景</option>
              <option value="black">黑色背景</option>
              <option value="transparent">透明背景</option>
            </select>
          </div>
        </div>
        <div style="text-align:center;color:var(--text-light);font-size:13px;margin-bottom:10px;" id="il-info">请选择一张图片转为线稿</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
          <div style="flex:1;min-width:240px;">
            <div style="font-size:12px;color:var(--text-light);text-align:center;margin-bottom:4px;">原图</div>
            <div style="border:1px dashed var(--border);border-radius:10px;overflow:hidden;background:var(--bg-card);"><img id="il-orig" style="width:100%;display:block;min-height:60px;" alt="原图"></div>
          </div>
          <div style="flex:1;min-width:240px;">
            <div style="font-size:12px;color:var(--text-light);text-align:center;margin-bottom:4px;">线稿</div>
            <div style="border:1px dashed var(--border);border-radius:10px;overflow:hidden;background:var(--bg-card);"><img id="il-result" style="width:100%;display:block;min-height:60px;" alt="线稿结果"></div>
          </div>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Vector Magic（付费）— 纯浏览器 Canvas Sobel 边缘检测，图片不上传服务器
        </div>
      </div>
    `,
    handler: () => { setTimeout(ilInit, 50); }
  },
  {
    id: 'gradient-bg',
    cat: 'image',
    icon: '🌈',
    name: '渐变背景生成器',
    desc: '灵感来源于 CoolBackgrounds / Gradienta（付费），一键生成平滑渐变背景，多款配色预设、自由选色，支持导出高清PNG/JPG',
    html: `
      <div class="tool-card">
        <div class="row" style="gap:10px;flex-wrap:wrap;margin-bottom:10px;">
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>起始颜色</label>
            <input type="color" id="gb-color1" value="#6366f1" style="width:100%;height:36px;border:none;border-radius:6px;cursor:pointer;" onchange="gbRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>结束颜色</label>
            <input type="color" id="gb-color2" value="#ec4899" style="width:100%;height:36px;border:none;border-radius:6px;cursor:pointer;" onchange="gbRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>方向</label>
            <select id="gb-angle" style="width:100%;" onchange="gbRender()">
              <option value="0">→ 左到右</option>
              <option value="90" selected>↓ 上到下</option>
              <option value="45">↘ 对角线</option>
              <option value="135">↙ 反向对角</option>
              <option value="180">← 右到左</option>
              <option value="360">◎ 径向</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>尺寸</label>
            <select id="gb-size" style="width:100%;" onchange="gbRender()">
              <option value="1920x1080">1920×1080</option>
              <option value="1280x720">1280×720</option>
              <option value="1080x1920">1080×1920</option>
              <option value="800x600">800×600</option>
              <option value="400x300">400×300</option>
            </select>
          </div>
        </div>
        <div style="text-align:center;margin-bottom:10px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
          <button class="btn btn-primary" onclick="gbPreset()">🎲 随机配色</button>
          <button class="btn btn-secondary" onclick="gbDownload('png')">⬇️ 下载PNG</button>
          <button class="btn btn-secondary" onclick="gbDownload('jpg')">⬇️ 下载JPG</button>
        </div>
        <div style="border:2px solid var(--border);border-radius:10px;overflow:hidden;">
          <canvas id="gb-canvas" style="display:block;width:100%;max-height:420px;"></canvas>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 CoolBackgrounds / Gradienta（付费）— 纯浏览器 Canvas 渐变渲染，色彩任意搭配，导出即用
        </div>
      </div>
    `,
    handler: () => { setTimeout(gbInit, 50); }
  },
  {
    id: 'text-effect',
    cat: 'image',
    icon: '🪄',
    name: '文字特效生成器',
    desc: '灵感来源于 CoolText / MockoFony（付费），为文字添加霓虹、3D、描边、阴影等特效，一键生成艺术字图片并下载PNG',
    html: `
      <div class="tool-card">
        <div class="input-group" style="margin-bottom:10px;">
          <label>输入文字</label>
          <input type="text" id="te-text" value="酷炫特效" style="width:100%;padding:10px;background:#1a1a2e;color:#e0e0e0;border:1px solid var(--border);border-radius:8px;font-size:16px;" oninput="teRender()">
        </div>
        <div class="row" style="gap:10px;flex-wrap:wrap;margin-bottom:10px;">
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>文字颜色</label>
            <input type="color" id="te-color" value="#ffffff" style="width:100%;height:36px;border:none;border-radius:6px;cursor:pointer;" onchange="teRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>背景色</label>
            <input type="color" id="te-bg" value="#1a1a2e" style="width:100%;height:36px;border:none;border-radius:6px;cursor:pointer;" onchange="teRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>特效样式</label>
            <select id="te-style" style="width:100%;" onchange="teRender()">
              <option value="neon" selected>🟢 霓虹发光</option>
              <option value="3d">🧊 3D立体</option>
              <option value="outline">⭕ 描边</option>
              <option value="shadow">🌑 投影</option>
              <option value="gradient">🌈 渐变填充</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>字号</label>
            <select id="te-size" style="width:100%;" onchange="teRender()">
              <option value="48">48px</option>
              <option value="64" selected>64px</option>
              <option value="96">96px</option>
              <option value="128">128px</option>
            </select>
          </div>
        </div>
        <div style="text-align:center;margin-bottom:10px;">
          <button class="btn btn-primary" onclick="teDownload()">⬇️ 下载特效文字PNG</button>
        </div>
        <div style="border:2px solid var(--border);border-radius:10px;overflow:hidden;">
          <canvas id="te-canvas" style="display:block;width:100%;max-height:360px;"></canvas>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 CoolText / MockoFony（付费）— 纯浏览器 Canvas 渲染，文字特效即时预览，导出高清PNG
        </div>
      </div>
    `,
    handler: () => { setTimeout(teInit, 50); }
  },
  {
    id: 'photo-collage',
    cat: 'image',
    icon: '🧩',
    name: '图片拼贴画',
    desc: '灵感来源于 Canva / Fotor 拼贴功能（付费），多张图片自由拖拽拼接，模板+间距+背景任意调，一键导出高清PNG',
    html: `
      <div class="tool-card">
        <div class="row" style="gap:10px;flex-wrap:wrap;margin-bottom:10px;">
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>拼贴模板</label>
            <select id="pc-layout" style="width:100%;" onchange="pcRender()">
              <option value="2v" selected>2张竖排</option>
              <option value="2h">2张横排</option>
              <option value="3h">3张横排</option>
              <option value="4g">4宫格</option>
              <option value="3+1">3+1混合</option>
              <option value="2+2r">2+2田字</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>背景色</label>
            <input type="color" id="pc-bg" value="#ffffff" style="width:100%;height:36px;border:none;border-radius:6px;cursor:pointer;" onchange="pcRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>间距</label>
            <select id="pc-gap" style="width:100%;" onchange="pcRender()">
              <option value="0">无间距</option>
              <option value="10" selected>小 (10px)</option>
              <option value="20">中 (20px)</option>
              <option value="30">大 (30px)</option>
            </select>
          </div>
        </div>
        <div style="text-align:center;margin-bottom:10px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
          <button class="btn btn-primary" onclick="document.getElementById('pc-file1').click()">📂 选择图片(可多选)</button>
          <button class="btn btn-secondary" onclick="pcDownload()">⬇️ 下载拼贴PNG</button>
        </div>
        <input type="file" id="pc-file1" accept="image/*" multiple style="display:none;" onchange="pcLoadFiles(this)">
        <div style="border:2px dashed var(--border);border-radius:10px;overflow:hidden;">
          <canvas id="pc-canvas" style="display:block;width:100%;max-height:460px;"></canvas>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Canva / Fotor 拼贴（付费）— 选择图片后自动按模板排版，图片本地处理，隐私安全
        </div>
      </div>
    `,
    handler: () => { setTimeout(pcInit, 50); }
  },
  {
    id: 'photo-frame',
    cat: 'image',
    icon: '🖼️',
    name: '图片相框',
    desc: '灵感来源于付费相框应用，为照片添加艺术相框、圆角、阴影和文字水印，导出带框美图PNG',
    html: `
      <div class="tool-card">
        <div style="text-align:center;margin-bottom:12px;">
          <input type="file" id="pf-file" accept="image/*" style="display:none;" onchange="pfLoadFile(this)">
          <button class="btn btn-primary" onclick="document.getElementById('pf-file').click()">📂 选择照片</button>
          <button class="btn btn-secondary" id="pf-download" onclick="pfDownload()" disabled>⬇️ 下载带框图片</button>
        </div>
        <div class="row" style="gap:10px;flex-wrap:wrap;margin-bottom:12px;">
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>相框样式</label>
            <select id="pf-style" style="width:100%;" onchange="pfRender()">
              <option value="classic" selected>👑 经典金框</option>
              <option value="wood">🪵 木纹框</option>
              <option value="minimal">⬜ 极简白框</option>
              <option value="black">⬛ 黑框</option>
              <option value="polaroid">📸 拍立得</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>圆角</label>
            <select id="pf-radius" style="width:100%;" onchange="pfRender()">
              <option value="0">直角</option>
              <option value="20" selected>圆角</option>
              <option value="50">大圆角</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>文字水印</label>
            <input type="text" id="pf-text" value="" placeholder="可留空" style="width:100%;padding:8px;background:#1a1a2e;color:#e0e0e0;border:1px solid var(--border);border-radius:6px;" oninput="pfRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>水印颜色</label>
            <input type="color" id="pf-textcolor" value="#ffffff" style="width:100%;height:36px;border:none;border-radius:6px;cursor:pointer;" onchange="pfRender()">
          </div>
        </div>
        <div style="border:2px dashed var(--border);border-radius:10px;overflow:hidden;text-align:center;background:#1a1a2e;padding:10px;">
          <canvas id="pf-canvas" style="display:block;max-width:100%;max-height:420px;margin:0 auto;"></canvas>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于付费相框应用 — 纯浏览器 Canvas 渲染，照片不上传服务器，导出即用
        </div>
      </div>
    `,
    handler: () => { setTimeout(pfInit, 50); }
  },
  {
    id: 'function-plotter',
    cat: 'convert',
    icon: '📊',
    name: '函数绘图器',
    desc: '灵感来源于 Desmos / GeoGebra（付费版），输入数学函数表达式即时绘制曲线，可多函数叠加、缩放平移坐标轴，导出PNG',
    html: `
      <div class="tool-card">
        <div class="row" style="gap:10px;flex-wrap:wrap;margin-bottom:10px;">
          <div class="input-group" style="flex:2;min-width:200px;">
            <label>函数表达式</label>
            <input type="text" id="fp-expr" value="sin(x),cos(x)" style="width:100%;padding:10px;background:#1a1a2e;color:#e0e0e0;border:1px solid var(--border);border-radius:8px;font-family:monospace;" oninput="fpRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>X范围</label>
            <input type="text" id="fp-range" value="-10,10" style="width:100%;padding:10px;background:#1a1a2e;color:#e0e0e0;border:1px solid var(--border);border-radius:8px;font-family:monospace;" oninput="fpRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>网格密度</label>
            <select id="fp-grid" style="width:100%;" onchange="fpRender()">
              <option value="1" selected>标准</option>
              <option value="2">细密</option>
              <option value="0.5">稀疏</option>
            </select>
          </div>
        </div>
        <div style="text-align:center;margin-bottom:10px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
          <button class="btn btn-primary" onclick="fpZoom(-1)">➕ 放大</button>
          <button class="btn btn-secondary" onclick="fpZoom(1)">➖ 缩小</button>
          <button class="btn btn-secondary" onclick="fpReset()">🔄 重置</button>
          <button class="btn btn-secondary" onclick="fpDownload()">⬇️ 下载PNG</button>
        </div>
        <div style="border:2px solid var(--border);border-radius:10px;overflow:hidden;">
          <canvas id="fp-canvas" style="display:block;width:100%;max-height:480px;"></canvas>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Desmos / GeoGebra（付费）— 支持 sin/cos/tan/log/exp/sqrt/abs/pow，多个函数用英文逗号分隔，颜色自动分配
        </div>
      </div>
    `,
    handler: () => { setTimeout(fpInit, 50); }
  },
  {
    id: 'color-blind-sim',
    cat: 'image',
    icon: '👁️',
    name: '颜色盲区模拟',
    desc: '灵感来源于 Stark / Coblis（付费无障碍工具），模拟红绿色盲/蓝黄色盲/全色盲看到的图像效果，帮助设计师检查配色可读性',
    html: `
      <div class="tool-card">
        <div style="text-align:center;margin-bottom:12px;">
          <input type="file" id="cb-file" accept="image/*" style="display:none;" onchange="cbLoadFile(this)">
          <button class="btn btn-primary" onclick="document.getElementById('cb-file').click()">📂 选择图片</button>
        </div>
        <div class="row" style="gap:10px;flex-wrap:wrap;margin-bottom:12px;">
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>模拟类型</label>
            <select id="cb-type" style="width:100%;" onchange="cbRender()">
              <option value="protanopia" selected>🔴 红色盲</option>
              <option value="deuteranopia">🟢 绿色盲</option>
              <option value="tritanopia">🔵 蓝黄色盲</option>
              <option value="achromatopsia">⚫ 全色盲</option>
            </select>
          </div>
        </div>
        <div style="text-align:center;color:var(--text-light);font-size:13px;margin-bottom:10px;" id="cb-info">请选择一张图片查看色盲模拟效果</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
          <div style="flex:1;min-width:240px;">
            <div style="font-size:12px;color:var(--text-light);text-align:center;margin-bottom:4px;">正常视角</div>
            <div style="border:1px dashed var(--border);border-radius:10px;overflow:hidden;background:var(--bg-card);"><img id="cb-orig" style="width:100%;display:block;min-height:60px;" alt="原图"></div>
          </div>
          <div style="flex:1;min-width:240px;">
            <div style="font-size:12px;color:var(--text-light);text-align:center;margin-bottom:4px;">色盲模拟</div>
            <div style="border:1px dashed var(--border);border-radius:10px;overflow:hidden;background:var(--bg-card);"><img id="cb-result" style="width:100%;display:block;min-height:60px;" alt="模拟结果"></div>
          </div>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Stark / Coblis（付费）— 无障碍设计必备，检查你的配色在色盲群体眼中的可读性，图片不上传服务器
        </div>
      </div>
    `,
    handler: () => { setTimeout(cbInit, 50); }
  },
  {
    id: 'periodic-table',
    cat: 'edu',
    icon: '⚗️',
    name: '元素周期表',
    desc: '灵感来源于付费化学学习应用，交互式元素周期表，点击元素查看原子量、电子排布、物理性质等详情，中英双语',
    html: `
      <div class="tool-card">
        <div style="text-align:center;color:var(--text-light);font-size:13px;margin-bottom:10px;">点击任意元素查看详情</div>
        <div id="pt-table" style="display:flex;flex-wrap:wrap;gap:3px;justify-content:center;margin-bottom:12px;"></div>
        <div id="pt-detail" style="background:#1a1a2e;border:1px solid var(--border);border-radius:10px;padding:16px;min-height:80px;">
          <div style="text-align:center;color:var(--text-light);font-size:14px;">👆 点击上方元素查看详细信息</div>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于付费化学学习应用 — 118个元素完整数据，学习化学的好帮手
        </div>
      </div>
    `,
    handler: () => { setTimeout(ptInit, 50); }
  },
  {
    id: 'qr-beautify',
    cat: 'dev',
    icon: '🔳',
    name: '二维码美化器',
    desc: '灵感来源于付费QR美化工具，在基础二维码上自定义前景/背景颜色、添加中心Logo、圆角样式，生成个性二维码PNG',
    html: `
      <div class="tool-card">
        <div class="input-group" style="margin-bottom:10px;">
          <label>二维码内容</label>
          <input type="text" id="qb-text" value="https://toolai.ccwu.cc" style="width:100%;padding:10px;background:#1a1a2e;color:#e0e0e0;border:1px solid var(--border);border-radius:8px;" oninput="qbRender()">
        </div>
        <div class="row" style="gap:10px;flex-wrap:wrap;margin-bottom:10px;">
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>前景颜色</label>
            <input type="color" id="qb-fg" value="#1a1a2e" style="width:100%;height:36px;border:none;border-radius:6px;cursor:pointer;" onchange="qbRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>背景颜色</label>
            <input type="color" id="qb-bg" value="#ffffff" style="width:100%;height:36px;border:none;border-radius:6px;cursor:pointer;" onchange="qbRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>尺寸</label>
            <select id="qb-size" style="width:100%;" onchange="qbRender()">
              <option value="300" selected>300×300</option>
              <option value="500">500×500</option>
              <option value="800">800×800</option>
            </select>
          </div>
        </div>
        <div style="text-align:center;margin-bottom:10px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
          <button class="btn btn-primary" onclick="document.getElementById('qb-logo').click()">🖼️ 上传Logo</button>
          <button class="btn btn-secondary" onclick="qbRemoveLogo()">🗑️ 移除Logo</button>
          <button class="btn btn-secondary" onclick="qbDownload()">⬇️ 下载PNG</button>
        </div>
        <input type="file" id="qb-logo" accept="image/*" style="display:none;" onchange="qbLoadLogo(this)">
        <div style="border:2px dashed var(--border);border-radius:10px;overflow:hidden;text-align:center;padding:10px;">
          <div id="qb-container" style="display:inline-block;"></div>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于付费QR美化工具 — 自定义颜色+中心Logo，让二维码更有个性，生成过程完全在本地
        </div>
      </div>
    `,
    handler: () => { setTimeout(qbInit, 50); }
  },
  {
    id: 'speech-to-text',
    cat: 'media',
    icon: '🎙️',
    name: '录音转文字',
    desc: '灵感来源于 Otter / 讯飞听见（付费），浏览器实时语音识别转文字，支持中文/英文，可导出TXT，纯本地运行保护隐私',
    html: `
      <div class="tool-card">
        <div id="stt-status" style="text-align:center;padding:10px;background:var(--bg-card);border-radius:10px;margin-bottom:12px;font-size:15px;color:var(--text-light);">
          🎙️ 点击下方"开始识别"并允许麦克风权限，开始说话即可实时转文字
        </div>
        <div class="btn-group" style="justify-content:center;gap:10px;margin-bottom:12px;">
          <button class="btn btn-primary" id="stt-start" onclick="sttToggle()">🔴 开始识别</button>
          <button class="btn btn-secondary" id="stt-clear" onclick="sttClear()">🗑️ 清空</button>
          <button class="btn btn-secondary" onclick="sttDownload()">⬇️ 导出TXT</button>
        </div>
        <div class="row" style="margin-bottom:12px;gap:10px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:130px;">
            <label>识别语言</label>
            <select id="stt-lang" style="width:100%;">
              <option value="zh-CN">中文（普通话）</option>
              <option value="zh-TW">中文（台湾）</option>
              <option value="en-US">English (US)</option>
              <option value="ja-JP">日本語</option>
              <option value="ko-KR">한국어</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:130px;">
            <label>状态</label>
            <div id="stt-state" style="font-size:16px;color:var(--text-light);">未开始</div>
          </div>
        </div>
        <textarea id="stt-result" style="width:100%;min-height:220px;padding:12px;background:#1a1a2e;color:#e0e0e0;border:1px solid var(--border);border-radius:8px;font-size:15px;line-height:1.6;" placeholder="识别结果将实时显示在这里…" readonly></textarea>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Otter.ai / 讯飞听见（付费）— 使用浏览器内置语音识别，录音与识别全部在本地完成，数据不上传服务器，隐私安全
        </div>
      </div>
    `,
    handler: () => { setTimeout(sttInit, 50); }
  },
  {
    id: 'sticky-notes',
    cat: 'media',
    icon: '📝',
    name: '在线便签',
    desc: '灵感来源于 Notezilla / 便签助手（付费），可拖拽的彩色便签墙，支持增删改、颜色、自动保存到本地，永不丢失',
    html: `
      <div class="tool-card">
        <div style="text-align:center;margin-bottom:12px;">
          <button class="btn btn-primary" onclick="snAddNote()">➕ 新建便签</button>
          <button class="btn btn-secondary" onclick="snClearAll()">🗑️ 清空全部</button>
          <button class="btn btn-secondary" onclick="snExport()">📦 导出JSON</button>
        </div>
        <div id="sn-board" style="display:flex;flex-wrap:wrap;gap:12px;align-items:flex-start;min-height:200px;padding:10px;background:var(--bg-card);border:1px dashed var(--border);border-radius:10px;"></div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Notezilla（付费）— 便签自动保存在浏览器本地，刷新不丢失；支持5种颜色、拖拽移动、双击编辑、一键置顶
        </div>
      </div>
    `,
    handler: () => { setTimeout(snInit, 50); }
  },
  {
    id: 'shape-crop',
    cat: 'image',
    icon: '✂️',
    name: '图片异形裁剪',
    desc: '灵感来源于 Canva Pro / 美图秀秀会员（付费），将图片裁剪为圆形、心形、星形、菱形等异形，一键透明背景导出PNG，社交头像利器',
    html: `
      <div class="tool-card">
        <div style="text-align:center;margin-bottom:12px;">
          <input type="file" id="sc-file" accept="image/*" style="display:none;" onchange="scLoadFile(this)">
          <button class="btn btn-primary" onclick="document.getElementById('sc-file').click()">📂 选择图片</button>
          <button class="btn btn-secondary" onclick="scSave()" id="sc-save-btn" disabled>⬇️ 下载PNG</button>
        </div>
        <div class="row" style="margin-bottom:12px;gap:10px;flex-wrap:wrap;align-items:flex-end;">
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>异形形状</label>
            <select id="sc-shape" style="width:100%;" onchange="scRender()">
              <option value="circle">⭕ 圆形</option>
              <option value="heart">❤️ 心形</option>
              <option value="star">⭐ 五角星</option>
              <option value="diamond">💎 菱形</option>
              <option value="hexagon">⬡ 六边形</option>
              <option value="leaf">🍂 胶囊/橄榄</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>尺寸</label>
            <select id="sc-size" style="width:100%;" onchange="scRender()">
              <option value="200">200×200</option>
              <option value="400" selected>400×400</option>
              <option value="800">800×800</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>背景</label>
            <select id="sc-bg" style="width:100%;" onchange="scRender()">
              <option value="transparent" selected>透明</option>
              <option value="white">白色</option>
              <option value="black">黑色</option>
              <option value="gradient">渐变</option>
            </select>
          </div>
        </div>
        <div style="text-align:center;">
          <canvas id="sc-canvas" style="max-width:100%;border-radius:10px;background:repeating-conic-gradient(#e8e8e8 0% 25%, #fff 0% 50%) 50% / 16px 16px;"></canvas>
        </div>
        <div id="sc-tip" style="text-align:center;color:var(--text-light);font-size:13px;margin-top:8px;">请选择一张图片开始异形裁剪</div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Canva Pro（付费）— 异形头像/贴纸制作利器，裁剪结果透明背景，图片完全在本地处理
        </div>
      </div>
    `,
    handler: () => { setTimeout(scInit, 50); }
  },
  {
    id: 'audio-waveform',
    cat: 'media',
    icon: '📊',
    name: '音频波形可视化',
    desc: '灵感来源于 Adobe Audition / 波形分析工具（付费），上传本地音频即时生成高清波形图，自定义颜色主题，可导出PNG用于封面/音乐可视化',
    html: `
      <div class="tool-card">
        <div style="text-align:center;margin-bottom:12px;">
          <input type="file" id="aw-file" accept="audio/*" style="display:none;" onchange="awLoadFile(this)">
          <button class="btn btn-primary" onclick="document.getElementById('aw-file').click()">🎵 选择音频</button>
          <button class="btn btn-secondary" onclick="awSave()" id="aw-save-btn" disabled>⬇️ 导出PNG</button>
          <button class="btn btn-secondary" onclick="awPlayToggle()" id="aw-play-btn" disabled>▶️ 播放</button>
        </div>
        <div class="row" style="margin-bottom:12px;gap:10px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:130px;">
            <label>波形颜色</label>
            <input type="color" id="aw-color" value="#6366f1" style="width:100%;height:36px;border:none;border-radius:6px;cursor:pointer;" onchange="awRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:130px;">
            <label>背景风格</label>
            <select id="aw-style" style="width:100%;" onchange="awRender()">
              <option value="dark">🌙 深色</option>
              <option value="light">☀️ 浅色</option>
              <option value="gradient">🌈 渐变</option>
              <option value="transparent">透明</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:130px;">
            <label>线条样式</label>
            <select id="aw-line" style="width:100%;" onchange="awRender()">
              <option value="bars">▮ 条形</option>
              <option value="line">〜 连线</option>
              <option value="mirror">♒ 镜像</option>
            </select>
          </div>
        </div>
        <div style="text-align:center;">
          <canvas id="aw-canvas" style="width:100%;max-width:640px;border-radius:10px;"></canvas>
        </div>
        <div id="aw-info" style="text-align:center;color:var(--text-light);font-size:13px;margin-top:8px;">请选择一段音频开始分析（支持 MP3/WAV/OGG）</div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Adobe Audition（付费）— 音乐可视化/播客封面必备，波形图可用于专辑封面、短视频背景，全程本地处理
        </div>
      </div>
    `,
    handler: () => { setTimeout(awInit, 50); }
  },
  {
    id: 'white-noise',
    cat: 'media',
    icon: '🎧',
    name: '白噪音发生器',
    desc: '灵感来源于 Noisli / Rainy Mood（付费），在线生成雨声、白噪音、粉噪音、海浪声等助眠环境音，自定义音量与混合，纯本地运行无需下载App',
    html: `
      <div class="tool-card">
        <div style="text-align:center;margin-bottom:12px;">
          <button class="btn btn-primary" id="wn-toggle" onclick="wnToggle()">▶️ 播放噪音</button>
          <button class="btn btn-secondary" onclick="wnStopAll()">⏹️ 停止</button>
        </div>
        <div class="row" style="margin-bottom:8px;gap:12px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:130px;">
            <label>主音量：<span id="wn-vol-val">50%</span></label>
            <input type="range" id="wn-volume" min="0" max="100" value="50" style="width:100%;" oninput="wnVolume()">
          </div>
          <div class="input-group" style="flex:1;min-width:130px;">
            <label>雨声强度（雨林模式）</label>
            <input type="range" id="wn-rain" min="0" max="100" value="0" style="width:100%;" oninput="wnMix()">
          </div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:8px;" id="wn-mixer"></div>
        <p style="margin:10px 0;color:var(--text-light);font-size:13px;">
          ☔ 雨声：布朗噪声低频过滤，模拟雨点打在地面的沙沙声<br>
          🎚️ 白噪音：均匀覆盖全频段，帮助屏蔽环境杂音，是专注学习办公的理想背景音<br>
          🌊 粉噪音：低频更强、听感更柔和，被称为"最接近自然"的噪音<br>
          🎵 粉暴：粉噪音+雨声叠加，营造安静的雨天氛围<br>
          🌙 全部混合：雨声+粉噪+白噪，适合深度睡眠
        </p>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 Noisli / Rainy Mood（付费）— 用 Web Audio API 实时合成音频，无需任何音频文件，完全在本地生成，可伴随你入睡、专注、冥想
        </div>
      </div>
    `,
    handler: () => { setTimeout(wnInit, 50); }
  },
  {
    id: 'mosaic-blur',
    cat: 'image',
    icon: '🧩',
    name: '图片马赛克打码',
    desc: '灵感来源于打码工具 / 美图隐私保护（付费），对图片人脸、车牌、隐私信息涂抹马赛克或模糊，可涂抹可擦除，导出PNG，社交发图必备',
    html: `
      <div class="tool-card">
        <div style="text-align:center;margin-bottom:12px;">
          <input type="file" id="mb-file" accept="image/*" style="display:none;" onchange="mbLoadFile(this)">
          <button class="btn btn-primary" onclick="document.getElementById('mb-file').click()">📂 选择图片</button>
          <button class="btn btn-secondary" onclick="mbExport()">⬇️ 导出PNG</button>
        </div>
        <div class="row" style="margin-bottom:8px;gap:10px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>打码方式</label>
            <select id="mb-mode" style="width:100%;">
              <option value="mosaic">🧩 马赛克</option>
              <option value="blur">🌫️ 高斯模糊</option>
              <option value="solid">⬛ 纯色涂块</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>画笔大小</label>
            <input type="range" id="mb-size" min="10" max="80" value="32" style="width:100%;" oninput="document.getElementById('mb-size-val').textContent=this.value">
            <span id="mb-size-val">32</span>
          </div>
        </div>
        <p style="margin:7px 0;color:var(--text-light);font-size:13px;">🖱️ 在图片上按住鼠标拖动涂抹即可打码；选择「擦除」可恢复原有区域</p>
        <div style="display:flex;gap:6px;justify-content:center;margin-bottom:8px;">
          <button class="btn btn-secondary" onclick="mbSetBrush('code')">🎨 涂抹</button>
          <button class="btn btn-secondary" onclick="mbSetBrush('erase')">🧽 擦除</button>
          <button class="btn btn-secondary" onclick="mbUndo()">↩️ 撤销一步</button>
          <button class="btn btn-secondary" onclick="mbReset()">🔄 重置</button>
        </div>
        <div style="text-align:center;">
          <canvas id="mb-canvas" style="max-width:100%;border-radius:10px;cursor:crosshair;display:none;background:#1a1a2e;"></canvas>
        </div>
        <div id="mb-tip" style="text-align:center;color:var(--text-light);font-size:13px;margin-top:8px;">请选择一张图片开始打码（人脸、车牌、地址等信息打码后发布更安全）</div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于付费打码应用 — 马赛克/模糊/纯色三种模式自由切换，图片完全在本地处理，绝不泄露原图
        </div>
      </div>
    `,
    handler: () => { setTimeout(mbInit, 50); }
  },
  {
    id: 'duotone',
    cat: 'image',
    icon: '🎨',
    name: '双色调滤镜',
    desc: '灵感来源于 VSCO / Prisma（付费滤镜），一键将照片转为双色海报风格，自定义主色+辅色渐变映射，社交封面、专辑封面神器',
    html: `
      <div class="tool-card">
        <div style="text-align:center;margin-bottom:12px;">
          <input type="file" id="dt-file" accept="image/*" style="display:none;" onchange="dtLoadFile(this)">
          <button class="btn btn-primary" onclick="document.getElementById('dt-file').click()">📂 选择图片</button>
          <button class="btn btn-secondary" onclick="dtExport()">⬇️ 下载PNG</button>
        </div>
        <div class="row" style="margin-bottom:12px;gap:10px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:130px;">
            <label>主色（高光）</label>
            <input type="color" id="dt-c1" value="#f97316" style="width:100%;height:36px;border:none;border-radius:6px;cursor:pointer;" onchange="dtRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:130px;">
            <label>辅色（阴影）</label>
            <input type="color" id="dt-c2" value="#0ea5e9" style="width:100%;height:36px;border:none;border-radius:6px;cursor:pointer;" onchange="dtRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:130px;">
            <label>预设</label>
            <select id="dt-preset" style="width:100%;" onchange="dtPreset()">
              <option value="">自定义</option>
              <option value="sunset">🌅 日落（橙→紫）</option>
              <option value="ocean">🌊 海洋（蓝→青）</option>
              <option value="neon">💜 霓虹（紫→粉）</option>
              <option value="mint">🌿 薄荷（绿→青）</option>
              <option value="mono">⚫ 单色（黑→白）</option>
            </select>
          </div>
        </div>
        <div style="text-align:center;">
          <canvas id="dt-canvas" style="max-width:100%;border-radius:10px;display:none;background:#1a1a2e;"></canvas>
        </div>
        <div id="dt-tip" style="text-align:center;color:var(--text-light);font-size:13px;margin-top:8px;">请选择一张图片，生成专属双色海报</div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 VSCO / Prisma（付费滤镜）— 亮度映射双色渐变，图片完全本地处理，导出高清PNG
        </div>
      </div>
    `,
    handler: () => { setTimeout(dtInit, 50); }
  },
  {
    id: 'ascii-art',
    cat: 'image',
    icon: '🔤',
    name: '图片转字符画',
    desc: '灵感来源于付费 ASCII 生成器，将照片转成复古字符画，支持黑白/彩色模式、密度调节、多种字符集，文艺封面与极客风头像必备',
    html: `
      <div class="tool-card">
        <div style="text-align:center;margin-bottom:12px;">
          <input type="file" id="aa-file" accept="image/*" style="display:none;" onchange="aaLoadFile(this)">
          <button class="btn btn-primary" onclick="document.getElementById('aa-file').click()">📂 选择图片</button>
          <button class="btn btn-secondary" onclick="aaCopy()">📋 复制文本</button>
          <button class="btn btn-secondary" onclick="aaExport()">⬇️ 导出PNG</button>
        </div>
        <div class="row" style="margin-bottom:12px;gap:10px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:130px;">
            <label>字符密度</label>
            <select id="aa-density" style="width:100%;" onchange="aaRender()">
              <option value="low">细（字符多）</option>
              <option value="mid" selected>中</option>
              <option value="high">粗（字符少）</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:130px;">
            <label>颜色模式</label>
            <select id="aa-color" style="width:100%;" onchange="aaRender()">
              <option value="bw" selected>⚫ 黑白</option>
              <option value="color">🌈 彩色</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:130px;">
            <label>字符集</label>
            <select id="aa-charset" style="width:100%;" onchange="aaRender()">
              <option value="standard">@%#*+=-:. 标准</option>
              <option value="block">██▓▒░ 方块</option>
              <option value="complex">$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~i!lI;:,^'. 完整</option>
            </select>
          </div>
        </div>
        <div style="max-height:420px;overflow:auto;background:#0f0f1a;border:1px solid var(--border);border-radius:10px;padding:10px;">
          <pre id="aa-output" style="font-family:monospace;font-size:5px;line-height:5px;letter-spacing:0;margin:0;white-space:pre;color:#e0e0e0;">选择一张图片生成字符画</pre>
        </div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于付费 ASCII 生成器 — 亮度映射字符密度，可复制为纯文本或导出PNG，极客风十足
        </div>
      </div>
    `,
    handler: () => { setTimeout(aaInit, 50); }
  },
  {
    id: 'pomodoro-timer',
    cat: 'time',
    icon: '🍅',
    name: '番茄钟专注计时器',
    desc: '灵感来源于 Forest / 番茄Todo（付费专注App），25分钟专注+5分钟休息循环，可自定义时长、环形倒计时、完成提示音、今日番茄统计，学习工作提效神器',
    html: `
      <div class="tool-card">
        <div style="text-align:center;">
          <div style="position:relative;width:210px;height:210px;margin:0 auto 14px;">
            <svg viewBox="0 0 210 210" width="210" height="210">
              <circle cx="105" cy="105" r="92" fill="none" stroke="#2a2a44" stroke-width="12"/>
              <circle id="pt-progress" cx="105" cy="105" r="92" fill="none" stroke="#f97316" stroke-width="12" stroke-linecap="round" stroke-dasharray="578" stroke-dashoffset="0" transform="rotate(-90 105 105)" style="transition:stroke-dashoffset 1s linear;"/>
            </svg>
            <div id="pt-time" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-60%);font-size:52px;font-weight:700;font-family:monospace;color:#e0e0e0;">25:00</div>
            <div id="pt-mode-tag" style="position:absolute;top:70%;left:50%;transform:translateX(-50%);font-size:14px;color:var(--text-light);white-space:nowrap;">🍅 专注中</div>
          </div>
          <div style="margin-bottom:14px;">
            <button class="btn btn-primary" id="pt-start" onclick="ptToggle()">▶️ 开始</button>
            <button class="btn btn-secondary" onclick="ptReset()">🔄 重置</button>
          </div>
          <div class="row" style="margin-bottom:12px;gap:10px;justify-content:center;flex-wrap:wrap;">
            <div class="input-group" style="min-width:100px;">
              <label>专注分钟</label>
              <input type="number" id="pt-focus" value="25" min="1" max="120" style="width:100%;" onchange="ptApply()">
            </div>
            <div class="input-group" style="min-width:100px;">
              <label>休息分钟</label>
              <input type="number" id="pt-break" value="5" min="1" max="60" style="width:100%;" onchange="ptApply()">
            </div>
            <div class="input-group" style="min-width:110px;">
              <label>长休间隔</label>
              <select id="pt-long" style="width:100%;" onchange="ptApply()">
                <option value="4">每4个番茄</option>
                <option value="3">每3个番茄</option>
                <option value="2">每2个番茄</option>
              </select>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:10px 16px;margin-bottom:8px;">
            <span style="font-size:13px;color:var(--text-light);">今日已完成番茄</span>
            <span id="pt-count" style="font-size:20px;font-weight:700;color:#f97316;">0 🍅</span>
          </div>
          <div id="pt-tip" style="text-align:center;color:var(--text-light);font-size:13px;">🎯 专注一次，收获一颗番茄 —— 专注统计自动保存在本机浏览器</div>
        </div>
      </div>
    `,
    handler: () => { setTimeout(ptInit, 50); }
  },
  {
    id: 'photo-cartoon',
    cat: 'image',
    icon: '🎭',
    name: '照片卡通化',
    desc: '灵感来源于 ToonMe / 美图动漫化（付费会员功能），一键把照片变成扁平插画/漫画风格，色阶、描边、饱和度可调，多款预设，纯本地处理导出PNG',
    html: `
      <div class="tool-card">
        <div style="text-align:center;margin-bottom:12px;">
          <input type="file" id="pcc-file" accept="image/*" style="display:none;" onchange="pccLoad(this)">
          <button class="btn btn-primary" onclick="document.getElementById('pcc-file').click()">📂 选择图片</button>
          <button class="btn btn-secondary" onclick="pccExport()">⬇️ 下载PNG</button>
        </div>
        <div style="margin-bottom:12px;text-align:center;">
          <span style="font-size:13px;color:var(--text-light);margin-right:6px;">🎨 预设：</span>
          <button class="btn btn-secondary" style="padding:6px 14px;font-size:13px;" onclick="pccPreset('flat')">扁平插画</button>
          <button class="btn btn-secondary" style="padding:6px 14px;font-size:13px;" onclick="pccPreset('manga')">漫画风</button>
          <button class="btn btn-secondary" style="padding:6px 14px;font-size:13px;" onclick="pccPreset('retro')">复古低饱和</button>
          <button class="btn btn-secondary" style="padding:6px 14px;font-size:13px;" onclick="pccPreset('bold')">高对比描边</button>
        </div>
        <div class="row" style="margin-bottom:12px;gap:14px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:130px;">
            <label>色阶 <span id="pcc-levels-val">8</span></label>
            <input type="range" id="pcc-levels" min="2" max="16" value="8" style="width:100%;" oninput="document.getElementById('pcc-levels-val').textContent=this.value;pccRender();">
          </div>
          <div class="input-group" style="flex:1;min-width:130px;">
            <label>描边 <span id="pcc-edge-val">40</span></label>
            <input type="range" id="pcc-edge" min="0" max="100" value="40" style="width:100%;" oninput="document.getElementById('pcc-edge-val').textContent=this.value;pccRender();">
          </div>
          <div class="input-group" style="flex:1;min-width:130px;">
            <label>饱和度 <span id="pcc-sat-val">110%</span></label>
            <input type="range" id="pcc-sat" min="40" max="200" value="110" style="width:100%;" oninput="document.getElementById('pcc-sat-val').textContent=this.value+'%';pccRender();">
          </div>
        </div>
        <div style="text-align:center;">
          <canvas id="pcc-canvas" style="max-width:100%;border-radius:10px;display:none;background:#1a1a2e;"></canvas>
        </div>
        <div id="pcc-tip" style="text-align:center;color:var(--text-light);font-size:13px;margin-top:8px;">请选择一张人像或风景照片，一键生成卡通插画风格</div>
        <div style="margin-top:10px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 灵感来源于 ToonMe / 美图动漫化（付费功能）— 颜色量化 + 边缘检测，图片完全本地处理，导出高清PNG
        </div>
      </div>
    `,
    handler: () => { setTimeout(pccInit, 50); }
  },
  {
    id: 'barcode-generator',
    cat: 'dev',
    icon: '🏷️',
    name: '条形码生成器',
    desc: '灵感来源于付费条码生成器（Barcode Generator / TEC-IT），支持 EAN-13 与 CODE39 编码，自动计算校验位，纯前端绘制高清条形码，电商价签、ISBN、库存标签必备',
    html: `
      <div class="tool-card">
        <div class="row" style="margin-bottom:12px;gap:12px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>条码类型</label>
            <select id="bc-type" style="width:100%;" onchange="bcRender()">
              <option value="ean13">EAN-13（13位数字）</option>
              <option value="code39">CODE39（字母数字）</option>
            </select>
          </div>
          <div class="input-group" style="flex:2;min-width:220px;">
            <label>条码内容</label>
            <input type="text" id="bc-input" value="692345065771" style="width:100%;" placeholder="输入数字或字母" oninput="bcRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:100px;">
            <label>条码高度</label>
            <select id="bc-height" style="width:100%;" onchange="bcRender()">
              <option value="90">标准</option>
              <option value="130">高</option>
              <option value="60">低</option>
            </select>
          </div>
        </div>
        <div style="text-align:center;">
          <canvas id="bc-canvas" style="max-width:100%;background:#fff;border-radius:8px;"></canvas>
        </div>
        <div id="bc-tip" style="text-align:center;color:var(--text-light);font-size:13px;margin-top:8px;">输入内容后自动生成，可下载高清PNG</div>
        <div style="text-align:center;margin-top:10px;">
          <button class="btn btn-secondary" onclick="bcDownload()">⬇️ 下载PNG</button>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 EAN-13 自动补齐校验位；CODE39 支持 0-9 / A-Z / 常用符号 — 纹理由浏览器本地绘制
        </div>
      </div>
    `,
    handler: () => { setTimeout(bcInit, 50); }
  },
  {
    id: 'favicon-maker',
    cat: 'dev',
    icon: '🖥️',
    name: 'Favicon图标生成器',
    desc: '灵感来源于 Favicon.io / RealFaviconGenerator（付费/高级工具），上传图片或输入文字一键生成 16-512px 全套网站图标，支持打包下载 ICO 与各尺寸 PNG，站长必备',
    html: `
      <div class="tool-card">
        <div style="margin-bottom:12px;">
          <button class="btn btn-primary" style="font-size:14px;padding:8px 18px;" onclick="favMode('image')">🖼️ 图片生成</button>
          <button class="btn btn-secondary" style="font-size:14px;padding:8px 18px;" onclick="favMode('text')">🔤 文字生成</button>
        </div>
        <div id="fav-image-section">
          <div style="text-align:center;margin-bottom:10px;">
            <input type="file" id="fav-file" accept="image/*" style="display:none;" onchange="favLoad(this)">
            <button class="btn btn-secondary" onclick="document.getElementById('fav-file').click()">📂 选择图片</button>
            <span style="font-size:12px;color:var(--text-light);margin-left:6px;">建议正方形图片，自动居中裁剪</span>
          </div>
        </div>
        <div id="fav-text-section" style="display:none;">
          <div class="row" style="margin-bottom:12px;gap:12px;flex-wrap:wrap;">
            <div class="input-group" style="flex:2;min-width:160px;">
              <label>图标文字（1-3字符）</label>
              <input type="text" id="fav-text" value="TB" maxlength="3" style="width:100%;" oninput="favTextChange()">
            </div>
            <div class="input-group" style="flex:1;min-width:100px;">
              <label>背景色</label>
              <input type="color" id="fav-bg" value="#6366f1" style="width:100%;height:38px;padding:2px;" oninput="favTextChange()">
            </div>
            <div class="input-group" style="flex:1;min-width:100px;">
              <label>文字颜色</label>
              <input type="color" id="fav-fg" value="#ffffff" style="width:100%;height:38px;padding:2px;" oninput="favTextChange()">
            </div>
          </div>
        </div>
        <div id="fav-preview" style="display:none;margin-bottom:12px;">
          <div style="display:flex;align-items:flex-end;gap:14px;flex-wrap:wrap;justify-content:center;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:14px;">
            <div style="text-align:center;"><canvas id="fav-p16" width="16" height="16"></canvas><div style="font-size:11px;color:var(--text-light);margin-top:4px;">16px</div></div>
            <div style="text-align:center;"><canvas id="fav-p32" width="32" height="32"></canvas><div style="font-size:11px;color:var(--text-light);margin-top:4px;">32px</div></div>
            <div style="text-align:center;"><canvas id="fav-p48" width="48" height="48"></canvas><div style="font-size:11px;color:var(--text-light);margin-top:4px;">48px</div></div>
            <div style="text-align:center;"><canvas id="fav-p180" width="180" height="180"></canvas><div style="font-size:11px;color:var(--text-light);margin-top:4px;">180px</div></div>
            <div style="text-align:center;"><canvas id="fav-p512" width="512" height="512"></canvas><div style="font-size:11px;color:var(--text-light);margin-top:4px;">512px</div></div>
          </div>
        </div>
        <div id="fav-actions" style="display:none;text-align:center;gap:10px;margin-top:6px;">
          <button class="btn btn-primary" onclick="favDownloadICO()">⬇️ 下载 ICO</button>
          <button class="btn btn-secondary" onclick="favDownloadAll()">⬇️ 下载全部 PNG</button>
        </div>
        <div id="fav-tip" style="text-align:center;color:var(--text-light);font-size:13px;margin-top:10px;">选择图片或输入文字，一键生成全套网站图标（ICO / PNG 各尺寸）</div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">
          💡 全部在浏览器本地完成，不会上传你的图片；生成的 ICO 兼容主流浏览器与系统
        </div>
      </div>
    `,
    handler: () => { setTimeout(favInit, 50); }
  },

  // ==================== 新工具：流程图绘制 ====================
  {
    id: 'flowchart-maker',
    cat: 'dev',
    icon: '🔀',
    name: '流程图绘制',
    desc: '灵感来源于 ProcessOn / draw.io（付费会员），在线绘制流程图、组织结构图、泳道图，节点拖拽连线、8种节点类型，一键导出高清PNG，产品经理/程序员/学生必备',
    html: `
      <div class="tool-card">
        <div style="margin-bottom:10px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
          <button class="btn btn-primary" style="font-size:13px;padding:6px 14px;" onclick="fcAddNode('rect')">▭ 矩形</button>
          <button class="btn btn-secondary" style="font-size:13px;padding:6px 14px;" onclick="fcAddNode('round')">◻ 圆角</button>
          <button class="btn btn-secondary" style="font-size:13px;padding:6px 14px;" onclick="fcAddNode('diamond')">◇ 菱形</button>
          <button class="btn btn-secondary" style="font-size:13px;padding:6px 14px;" onclick="fcAddNode('ellipse')">◯ 椭圆</button>
          <button class="btn btn-secondary" style="font-size:13px;padding:6px 14px;" onclick="fcAddNode('text')">🅣 文本</button>
          <button class="btn btn-secondary" style="font-size:13px;padding:6px 14px;" onclick="fcLinkMode()" id="fc-link-btn">🔗 连线</button>
          <button class="btn btn-danger" style="font-size:13px;padding:6px 14px;background:#ef4444;color:#fff;" onclick="fcDeleteSelected()">🗑️ 删除</button>
          <span style="margin-left:auto;display:flex;gap:6px;">
            <button class="btn btn-secondary" style="font-size:13px;padding:6px 14px;" onclick="fcClear()">🔄 清空</button>
            <button class="btn btn-primary" style="font-size:13px;padding:6px 14px;" onclick="fcExportPNG()">⬇️ 导出PNG</button>
          </span>
        </div>
        <div style="position:relative;border:1px solid var(--border);border-radius:8px;overflow:hidden;background:
          repeating-conic-gradient(#1c1c33 0% 25%, #1a1a2e 0% 50%) 0 0/20px 20px;" id="fc-canvas-wrap">
          <svg id="fc-svg" width="100%" height="460" style="display:block;cursor:crosshair;touch-action:none;">
            <defs>
              <marker id="fc-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#8b8bb8"></path>
              </marker>
            </defs>
            <g id="fc-links"></g>
            <g id="fc-nodes"></g>
          </svg>
        </div>
        <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-size:13px;color:var(--text-light);">
          <span>✏️ 双击节点编辑文字</span>
          <span>🖱️ 拖拽节点移动</span>
          <span>🔗 点「连线」后点两个节点</span>
          <span>🎨 选中节点后可换色：
            <input type="color" id="fc-fill" value="#2d2d5e" style="width:36px;height:26px;border:none;border-radius:4px;vertical-align:middle;" onchange="fcApplyStyle()">
          </span>
        </div>
        <div style="margin-top:6px;font-size:12px;color:var(--text-light);text-align:center;">💡 纯本地绘制，不保存不上传；适合流程图、组织结构、泳道草稿，画完直接导出高清图</div>
      </div>
    `,
    handler: () => { setTimeout(fcInit, 50); }
  },

  // ==================== 新工具：房贷计算器 ====================
  {
    id: 'loan-calculator',
    cat: 'convert',
    icon: '🏠',
    name: '房贷计算器',
    desc: '灵感来源于房贷计算类App（付费会员），等额本息/等额本金双模式，月供、总利息、利率趋势图、逐月还款明细表一次算清，买房贷款必用',
    html: `
      <div class="tool-card">
        <div class="row" style="margin-bottom:12px;gap:12px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>贷款金额（万元）</label>
            <input type="number" id="lc-amount" value="100" min="1" step="1" style="width:100%;">
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>年利率（%）</label>
            <input type="number" id="lc-rate" value="3.85" min="0.1" max="20" step="0.01" style="width:100%;">
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>贷款年限（年）</label>
            <input type="number" id="lc-years" value="30" min="1" max="40" step="1" style="width:100%;">
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>还款方式</label>
            <select id="lc-type" style="width:100%;">
              <option value="equal">等额本息</option>
              <option value="principal">等额本金</option>
            </select>
          </div>
        </div>
        <div style="text-align:center;margin-bottom:14px;">
          <button class="btn btn-primary" onclick="lcCalc()">🧮 开始计算</button>
        </div>
        <div id="lc-result" style="display:none;">
          <div class="row" style="gap:12px;flex-wrap:wrap;margin-bottom:12px;">
            <div style="flex:1;min-width:140px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:14px;text-align:center;">
              <div style="font-size:12px;color:var(--text-light);">每月月供</div>
              <div id="lc-monthly" style="font-size:24px;font-weight:700;color:#34d399;margin-top:4px;">--</div>
            </div>
            <div style="flex:1;min-width:140px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:14px;text-align:center;">
              <div style="font-size:12px;color:var(--text-light);">利息总额</div>
              <div id="lc-interest" style="font-size:24px;font-weight:700;color:#f59e0b;margin-top:4px;">--</div>
            </div>
            <div style="flex:1;min-width:140px;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:14px;text-align:center;">
              <div style="font-size:12px;color:var(--text-light);">还款总额</div>
              <div id="lc-total" style="font-size:24px;font-weight:700;color:#a78bfa;margin-top:4px;">--</div>
            </div>
          </div>
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:12px;">
            <div style="font-size:13px;color:var(--text-light);margin-bottom:6px;">📈 剩余本金与月供走势（前36期）</div>
            <canvas id="lc-chart" width="820" height="220" style="width:100%;height:auto;display:block;"></canvas>
          </div>
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:12px;">
            <div style="font-size:13px;color:var(--text-light);margin-bottom:8px;">📋 逐月还款明细（前24期）</div>
            <div style="max-height:280px;overflow-y:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:12px;">
                <thead><tr style="color:var(--text-light);"><th style="text-align:left;padding:6px;">期数</th><th style="text-align:right;padding:6px;">月供</th><th style="text-align:right;padding:6px;">本金</th><th style="text-align:right;padding:6px;">利息</th><th style="text-align:right;padding:6px;">剩余本金</th></tr></thead>
                <tbody id="lc-table"></tbody>
              </table>
            </div>
          </div>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">💡 计算结果仅供参考，实际以银行审批为准；数据全部在本地计算，不上传</div>
      </div>
    `,
    handler: () => { setTimeout(lcInit, 50); }
  },

  // ==================== 第19轮：PDF拆分 ====================
  {
    id: 'pdf-split',
    cat: 'document',
    icon: '✂️',
    name: 'PDF拆分工具',
    desc: '在线免费拆分PDF，按页拆分或提取指定页码范围，纯本地处理不上传',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>选择 PDF 文件</label>
          <input type="file" id="pds-file" accept=".pdf" onchange="pdsLoad()">
        </div>
        <div id="pds-panel" style="display:none;margin-top:14px;">
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:12px;">
            <div style="font-size:13px;color:var(--text-light);margin-bottom:8px;">📄 <span id="pds-info"></span></div>
            <div style="margin-bottom:10px;">
              <label style="display:block;font-size:13px;margin-bottom:4px;">拆分模式</label>
              <select id="pds-mode" onchange="pdsModeChange()" style="width:100%;">
                <option value="every">每页拆分成一个文件</option>
                <option value="range">按页码范围提取（如 1-3, 5, 7-9）</option>
                <option value="custom">每 N 页拆分为一份</option>
              </select>
            </div>
            <div id="pds-range-wrap" style="display:none;margin-bottom:10px;">
              <label style="display:block;font-size:13px;margin-bottom:4px;">页码范围（逗号分隔，支持 - 区间）</label>
              <input type="text" id="pds-range" placeholder="例：1-3, 5, 7-9" style="width:100%;">
            </div>
            <div id="pds-n-wrap" style="display:none;margin-bottom:10px;">
              <label style="display:block;font-size:13px;margin-bottom:4px;">每组页数</label>
              <input type="number" id="pds-n" value="5" min="1" style="width:100%;">
            </div>
            <div style="text-align:center;">
              <button class="btn btn-primary" onclick="pdsSplit()">✂️ 开始拆分</button>
            </div>
          </div>
          <div id="pds-loading" style="display:none;text-align:center;padding:30px;color:var(--text-light);">
            <div style="font-size:42px;margin-bottom:10px;">⏳</div>
            <div>正在拆分 PDF...</div>
          </div>
          <div id="pds-result" style="display:none;">
            <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:12px;">
              <div style="font-size:13px;color:var(--text-light);margin-bottom:8px;">📦 拆分结果（点击下载）：</div>
              <div id="pds-list"></div>
            </div>
          </div>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">💡 灵感来源于 Adobe Acrobat / iLovePDF 付费功能；文件全部在浏览器本地处理，不会上传到服务器</div>
      </div>
    `,
    handler: () => { setTimeout(pdsInit, 50); }
  },

  // ==================== 第19轮：音频剪辑拼接 ====================
  {
    id: 'audio-cutter',
    cat: 'media',
    icon: '🎚️',
    name: '音频剪辑拼接',
    desc: '在线免费剪辑拼接音频，裁剪片段、多段拼接、调整音量，导出 WAV，纯本地处理',
    html: `
      <div class="tool-card">
        <div class="input-group">
          <label>选择音频文件（MP3/WAV/M4A/OGG）</label>
          <input type="file" id="auc-file" accept="audio/*" onchange="aucLoad()">
        </div>
        <div id="auc-panel" style="display:none;margin-top:14px;">
          <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:12px;">
            <div style="font-size:13px;color:var(--text-light);margin-bottom:8px;">🎵 <span id="auc-info"></span></div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;">
              <div style="flex:1;min-width:130px;">
                <label style="display:block;font-size:13px;margin-bottom:4px;">开始（秒）</label>
                <input type="number" id="auc-start" value="0" min="0" step="0.1" style="width:100%;">
              </div>
              <div style="flex:1;min-width:130px;">
                <label style="display:block;font-size:13px;margin-bottom:4px;">结束（秒）</label>
                <input type="number" id="auc-end" step="0.1" style="width:100%;">
              </div>
              <div style="flex:1;min-width:130px;">
                <label style="display:block;font-size:13px;margin-bottom:4px;">音量（%）</label>
                <input type="number" id="auc-volume" value="100" min="0" max="200" step="5" style="width:100%;">
              </div>
            </div>
            <div style="text-align:center;margin-bottom:10px;">
              <button class="btn btn-primary" onclick="aucAddClip()">➕ 添加片段</button>
              <button class="btn btn-secondary" onclick="aucPlayClip()">▶️ 试听当前片段</button>
              <button class="btn btn-secondary" onclick="aucStopPlay()">⏹ 停止</button>
            </div>
          </div>
          <div id="auc-clips-wrap" style="display:none;background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:12px;">
            <div style="font-size:13px;color:var(--text-light);margin-bottom:8px;">🎬 已添加片段：</div>
            <div id="auc-clips"></div>
            <div style="text-align:center;margin-top:10px;">
              <button class="btn btn-primary" onclick="aucExport()">⬇️ 拼接导出 WAV</button>
              <button class="btn btn-secondary" onclick="aucClear()">🗑️ 清空全部</button>
            </div>
          </div>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">💡 灵感来源于 Kapwing / 剪映付费功能；音频全部在浏览器本地处理，不会上传到服务器</div>
      </div>
    `,
    handler: () => { setTimeout(aucInit, 50); }
  },
  {
    id: 'invoice-generator',
    cat: 'document',
    icon: '🧾',
    name: '发票/收据生成器',
    desc: '灵感来源于 Zoho Invoice / Invoice Simple（付费订阅），在线制作发票、收据、报价单，添加商品明细自动算价，支持含税/不含税、多行项目、备注，一键打印或导出 PDF，商务必备纯本地生成',
    html: `
      <div class="tool-card">
        <div class="row" style="margin-bottom:12px;gap:12px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:150px;">
            <label>单据类型</label>
            <select id="inv-type">
              <option value="发票">🧾 发票</option>
              <option value="收据">📋 收据</option>
              <option value="报价单">📑 报价单</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:150px;">
            <label>发票编号</label>
            <input type="text" id="inv-no" placeholder="INV-20260903-001">
          </div>
          <div class="input-group" style="flex:1;min-width:150px;">
            <label>开票日期</label>
            <input type="date" id="inv-date">
          </div>
        </div>
        <div class="row" style="margin-bottom:12px;gap:12px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:200px;">
            <label>销售方（公司/个人）</label>
            <input type="text" id="inv-seller" placeholder="你的公司名称或个人名称">
          </div>
          <div class="input-group" style="flex:1;min-width:200px;">
            <label>购买方（客户）</label>
            <input type="text" id="inv-buyer" placeholder="客户名称">
          </div>
        </div>
        <div style="font-size:13px;color:var(--text-light);margin-bottom:8px;">📦 商品明细</div>
        <div id="inv-items" style="margin-bottom:8px;"></div>
        <div style="text-align:center;margin-bottom:12px;">
          <button class="btn btn-secondary" onclick="invAddItem()">➕ 添加商品行</button>
        </div>
        <div class="row" style="margin-bottom:12px;gap:12px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>税率（%）</label>
            <input type="number" id="inv-tax" value="0" min="0" max="100" step="0.01">
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>折扣（%）</label>
            <input type="number" id="inv-discount" value="0" min="0" max="100" step="0.01">
          </div>
          <div class="input-group" style="flex:1;min-width:200px;">
            <label>币种</label>
            <select id="inv-currency">
              <option value="¥">¥ 人民币</option>
              <option value="$">$ 美元</option>
              <option value="€">€ 欧元</option>
              <option value="£">£ 英镑</option>
            </select>
          </div>
        </div>
        <div class="input-group" style="margin-bottom:12px;">
          <label>备注</label>
          <textarea id="inv-note" rows="2" placeholder="付款方式、发票说明等"></textarea>
        </div>
        <div style="text-align:center;margin-bottom:12px;">
          <button class="btn btn-primary" onclick="invRender()">🔄 生成预览</button>
          <button class="btn btn-secondary" onclick="invPrint()">🖨️ 打印 / 导出 PDF</button>
        </div>
        <div id="inv-preview" style="margin-top:14px;background:#fff;color:#222;border-radius:10px;padding:18px;max-width:720px;margin-left:auto;margin-right:auto;box-shadow:0 2px 12px rgba(0,0,0,.08);"></div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">💡 灵感来源于 Zoho Invoice / Invoice Simple 付费订阅；数据仅存在本地浏览器，不会上传服务器</div>
      </div>
    `,
    handler: () => { setTimeout(invInit, 50); }
  },
  {
    id: 'thumbnail-maker',
    cat: 'media',
    icon: '🖥️',
    name: '视频缩略图制作器',
    desc: '灵感来源于 Canva Pro / Placeit（付费），为 YouTube、B站、抖音视频制作 16:9 缩略图，自定义背景、大标题文字、颜色字体任意调，一键导出高清 PNG，提升点击率',
    html: `
      <div class="tool-card">
        <div class="row" style="margin-bottom:12px;gap:12px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:200px;">
            <label>背景方式</label>
            <select id="thm-bgmode" onchange="thmBgMode()">
              <option value="solid">🎨 纯色背景</option>
              <option value="gradient">🌈 渐变背景</option>
              <option value="image">🖼️ 上传图片背景</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:150px;" id="thm-color-wrap">
            <label>背景颜色</label>
            <input type="color" id="thm-bgcolor" value="#1a1a2e" onchange="thmRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:150px;display:none;" id="thm-color2-wrap">
            <label>渐变第二色</label>
            <input type="color" id="thm-bgcolor2" value="#e94560" onchange="thmRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:150px;display:none;" id="thm-image-wrap">
            <label>上传背景图</label>
            <input type="file" id="thm-bgfile" accept="image/*" onchange="thmBgFile()">
          </div>
        </div>
        <div class="row" style="margin-bottom:12px;gap:12px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:220px;">
            <label>主标题文字</label>
            <input type="text" id="thm-title" value="点进来！不看后悔" placeholder="主标题（支持换行 \\n）" oninput="thmRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>标题颜色</label>
            <input type="color" id="thm-titlecolor" value="#ffffff" onchange="thmRender()">
          </div>
        </div>
        <div class="row" style="margin-bottom:12px;gap:12px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:220px;">
            <label>副标题/角标文字</label>
            <input type="text" id="thm-sub" value="最新出炉 🔥" placeholder="副标题或角标" oninput="thmRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>副标题颜色</label>
            <input type="color" id="thm-subcolor" value="#ffd700" onchange="thmRender()">
          </div>
        </div>
        <div class="row" style="margin-bottom:12px;gap:12px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>标题大小</label>
            <input type="range" id="thm-titlesize" min="28" max="110" value="64" oninput="thmRender()">
            <span id="thm-titlesize-val" style="font-size:12px;color:var(--text-light);">64</span>
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>副标题大小</label>
            <input type="range" id="thm-subsie" min="14" max="56" value="28" oninput="thmRender()">
            <span id="thm-subsie-val" style="font-size:12px;color:var(--text-light);">28</span>
          </div>
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>样式</label>
            <select id="thm-style" onchange="thmRender()">
              <option value="bold">🔥 粗体描边</option>
              <option value="shadow">🌑 阴影</option>
              <option value="outline">⭕ 描边+渐变字</option>
              <option value="badge">🏷️ 标签风格</option>
            </select>
          </div>
        </div>
        <div style="text-align:center;margin-bottom:12px;">
          <button class="btn btn-primary" onclick="thmExport()">⬇️ 导出 PNG (1280×720)</button>
        </div>
        <div style="text-align:center;">
          <canvas id="thm-canvas" width="1280" height="720" style="max-width:100%;border-radius:10px;border:1px solid var(--border);box-shadow:0 2px 12px rgba(0,0,0,.2);"></canvas>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">💡 灵感来源于 Canva Pro / Placeit 付费功能；全部在浏览器本地生成，不会上传素材</div>
      </div>
    `,
    handler: () => { setTimeout(thmInit, 50); }
  },
  {
    id: 'certificate-maker',
    cat: 'document',
    icon: '🏅',
    name: '证书生成器',
    desc: '灵感来源于 Certifier / Canva Pro 付费模板，在线制作荣誉证书、奖状、培训结业证书，选择模板颜色、填写姓名正文、一键导出高清 PNG，机构/日期/编号一应俱全，本地生成不上传',
    html: `
      <div class="tool-card">
        <div class="row" style="margin-bottom:12px;gap:12px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:160px;">
            <label>证书模板</label>
            <select id="cert-style" onchange="certRender()">
              <option value="classic">🎖️ 经典红金</option>
              <option value="blue">💠 简约蓝金</option>
              <option value="green">🌿 清新绿金</option>
              <option value="tech">🚀 科技渐变</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:160px;">
            <label>证书标题</label>
            <input type="text" id="cert-title" value="荣 誉 证 书" oninput="certRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:160px;">
            <label>获证者姓名</label>
            <input type="text" id="cert-recipient" value="张三" placeholder="姓名" oninput="certRender()">
          </div>
        </div>
        <div class="row" style="margin-bottom:12px;gap:12px;flex-wrap:wrap;">
          <div class="input-group" style="flex:2;min-width:260px;">
            <label>证书正文</label>
            <textarea id="cert-body" rows="2" oninput="certRender()">鉴于该同志在 2026 年度工作中表现突出、成绩优异，特发此证，以资鼓励。</textarea>
          </div>
        </div>
        <div class="row" style="margin-bottom:12px;gap:12px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:160px;">
            <label>颁发机构</label>
            <input type="text" id="cert-org" value="某某科技有限公司" oninput="certRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:130px;">
            <label>日期</label>
            <input type="date" id="cert-date" onchange="certRender()">
          </div>
          <div class="input-group" style="flex:1;min-width:160px;">
            <label>证书编号</label>
            <input type="text" id="cert-no" placeholder="如 CERT-2026-001" oninput="certRender()">
          </div>
        </div>
        <div style="text-align:center;margin-bottom:12px;">
          <button class="btn btn-primary" onclick="certExport()">⬇️ 导出 PNG</button>
          <button class="btn btn-secondary" onclick="certPrint()">🖨️ 打印</button>
        </div>
        <div style="text-align:center;">
          <canvas id="cert-canvas" width="1200" height="848" style="max-width:100%;border-radius:10px;border:1px solid var(--border);box-shadow:0 2px 12px rgba(0,0,0,.2);"></canvas>
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">💡 灵感来源于 Certifier / Canva Pro 付费模板；证书在浏览器本地生成，不会上传任何内容</div>
      </div>
    `,
    handler: () => { setTimeout(certInit, 50); }
  },
  {
    id: 'ledger-book',
    cat: 'finance',
    icon: '💰',
    name: '家庭记账本',
    desc: '灵感来源于 Money Manager / 鲨鱼记账 等付费订阅，日常收支记账、分类统计、月度汇总，数据保存在本地浏览器，一键导出 CSV，家庭理财必备',
    html: `
      <div class="tool-card">
        <div class="row" style="margin-bottom:12px;gap:12px;flex-wrap:wrap;">
          <div class="input-group" style="flex:1;min-width:120px;">
            <label>收支类型</label>
            <select id="led-type">
              <option value="expense">💸 支出</option>
              <option value="income">💰 收入</option>
            </select>
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>金额（元）</label>
            <input type="number" id="led-amount" placeholder="0.00" min="0" step="0.01">
          </div>
          <div class="input-group" style="flex:1;min-width:140px;">
            <label>分类</label>
            <select id="led-cat"></select>
          </div>
          <div class="input-group" style="flex:1;min-width:150px;">
            <label>日期</label>
            <input type="date" id="led-date">
          </div>
        </div>
        <div class="input-group" style="margin-bottom:12px;">
          <label>备注</label>
          <input type="text" id="led-note" placeholder="买什么 / 收入来源 等">
        </div>
        <div style="text-align:center;margin-bottom:16px;">
          <button class="btn btn-primary" onclick="ledAdd()">➕ 记一笔</button>
          <button class="btn btn-secondary" onclick="ledExportCsv()">📥 导出 CSV</button>
          <button class="btn btn-secondary" onclick="ledClearAll()">🗑️ 清空记录</button>
        </div>
        <div class="row" style="margin-bottom:12px;gap:12px;flex-wrap:wrap;">
          <div class="led-stat" style="flex:1;min-width:130px;background:linear-gradient(135deg,#ef4444,#f97316);border-radius:10px;padding:10px 14px;color:#fff;">
            <div style="font-size:12px;opacity:.9;">本月支出</div>
            <div id="led-total-expense" style="font-size:20px;font-weight:700;">¥0.00</div>
          </div>
          <div class="led-stat" style="flex:1;min-width:130px;background:linear-gradient(135deg,#10b981,#059669);border-radius:10px;padding:10px 14px;color:#fff;">
            <div style="font-size:12px;opacity:.9;">本月收入</div>
            <div id="led-total-income" style="font-size:20px;font-weight:700;">¥0.00</div>
          </div>
          <div class="led-stat" style="flex:1;min-width:130px;background:linear-gradient(135deg,#3b82f6,#6366f1);border-radius:10px;padding:10px 14px;color:#fff;">
            <div style="font-size:12px;opacity:.9;">本月结余</div>
            <div id="led-balance" style="font-size:20px;font-weight:700;">¥0.00</div>
          </div>
          <div class="led-stat" style="flex:1;min-width:130px;background:linear-gradient(135deg,#8b5cf6,#a855f7);border-radius:10px;padding:10px 14px;color:#fff;">
            <div style="font-size:12px;opacity:.9;">累计笔数</div>
            <div id="led-count" style="font-size:20px;font-weight:700;">0</div>
          </div>
        </div>
        <div id="led-chart" style="margin-bottom:12px;"></div>
        <div id="led-list" style="max-height:380px;overflow-y:auto;border:1px solid var(--border);border-radius:10px;padding:8px;"></div>
        <div style="margin-top:8px;font-size:12px;color:var(--text-light);text-align:center;">💡 灵感来源于 Money Manager / 鲨鱼记账 付费订阅；全部数据保存在本地浏览器 localStorage，不上传服务器</div>
      </div>
    `,
    handler: () => { setTimeout(ledInit, 50); }
  }
];

// ============================================================
// 思维导图工具 处理函数
// ============================================================
var mmNodes = [], mmSelected = null, mmDragNode = null, mmDragOffset = {x:0,y:0}, mmNextId = 1;
var mmCanvas, mmCtx, mmIsDragging = false, mmIsPanning = false, mmPanStart = {x:0,y:0}, mmOffset = {x:0,y:0};

function mmInit() {
  mmCanvas = document.getElementById('mm-canvas');
  if (!mmCanvas) return;
  mmCanvas.width = mmCanvas.clientWidth * 2;
  mmCanvas.height = mmCanvas.clientHeight * 2;
  mmCtx = mmCanvas.getContext('2d');
  mmOffset = {x: mmCanvas.width/2, y: 100};
  if (mmNodes.length === 0) {
    mmNodes = [{id: 1, text: '中心主题', x: 0, y: 0, children: [], parent: null}];
    mmNextId = 2;
  }
  mmCanvas.onmousedown = mmOnMouseDown;
  mmCanvas.onmousemove = mmOnMouseMove;
  mmCanvas.onmouseup = mmOnMouseUp;
  mmCanvas.ondblclick = mmOnDblClick;
  mmCanvas.oncontextmenu = function(e) { e.preventDefault(); };
  mmRender();
  document.getElementById('mm-tooltip').style.display = 'block';
  setTimeout(function() {
    document.getElementById('mm-tooltip').style.display = 'none';
  }, 5000);
}

function mmGetNodePos(node) {
  return {x: mmOffset.x + node.x, y: mmOffset.y + node.y};
}

function mmGetNodeRect(node) {
  var pos = mmGetNodePos(node);
  var w = node.text.length * 14 + 24;
  var h = 36;
  return {x: pos.x - w/2, y: pos.y - h/2, w: w, h: h};
}

function mmRender() {
  var ctx = mmCtx, c = mmCanvas;
  ctx.clearRect(0, 0, c.width, c.height);
  // Draw connections
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 3]);
  mmNodes.forEach(function(node) {
    if (node.parent) {
      var parent = mmNodes.find(function(n) { return n.id === node.parent; });
      if (parent) {
        var p = mmGetNodePos(parent), n = mmGetNodePos(node);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y + 18);
        ctx.lineTo(n.x, n.y - 18);
        ctx.stroke();
      }
    }
  });
  ctx.setLineDash([]);
  // Draw nodes
  mmNodes.forEach(function(node) {
    var r = mmGetNodeRect(node);
    var isSel = mmSelected === node.id;
    ctx.fillStyle = isSel ? '#4f46e5' : '#2a2a44';
    ctx.strokeStyle = isSel ? '#818cf8' : '#6366f1';
    ctx.lineWidth = isSel ? 3 : 1;
    mmRoundRect(ctx, r.x, r.y, r.w, r.h, 10);
    ctx.fill();
    ctx.stroke();
    // Text
    ctx.fillStyle = '#e0e0e0';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.text, r.x + r.w/2, r.y + r.h/2);
  });
}

function mmRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function mmNodeAt(x, y) {
  for (var i = mmNodes.length - 1; i >= 0; i--) {
    var r = mmGetNodeRect(mmNodes[i]);
    if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return mmNodes[i];
  }
  return null;
}

function mmOnMouseDown(e) {
  var rect = mmCanvas.getBoundingClientRect();
  var x = (e.clientX - rect.left) * 2, y = (e.clientY - rect.top) * 2;
  var node = mmNodeAt(x, y);
  if (node) {
    mmSelected = node.id;
    mmDragNode = node;
    mmDragOffset = {x: x - (mmOffset.x + node.x), y: y - (mmOffset.y + node.y)};
    mmIsDragging = true;
    mmCanvas.style.cursor = 'grabbing';
    mmRender();
    document.getElementById('mm-edit-panel').style.display = 'none';
  } else {
    mmSelected = null;
    mmIsPanning = true;
    mmPanStart = {x: e.clientX, y: e.clientY};
    mmCanvas.style.cursor = 'grabbing';
    mmRender();
    document.getElementById('mm-edit-panel').style.display = 'none';
  }
}

function mmOnMouseMove(e) {
  if (mmIsDragging && mmDragNode) {
    var rect = mmCanvas.getBoundingClientRect();
    var x = (e.clientX - rect.left) * 2, y = (e.clientY - rect.top) * 2;
    mmDragNode.x = x - mmOffset.x - mmDragOffset.x;
    mmDragNode.y = y - mmOffset.y - mmDragOffset.y;
    mmRender();
  } else if (mmIsPanning) {
    var dx = (e.clientX - mmPanStart.x) * 2, dy = (e.clientY - mmPanStart.y) * 2;
    mmOffset.x += dx;
    mmOffset.y += dy;
    mmPanStart = {x: e.clientX, y: e.clientY};
    mmRender();
  }
}

function mmOnMouseUp(e) {
  mmIsDragging = false;
  mmIsPanning = false;
  mmDragNode = null;
  mmCanvas.style.cursor = 'grab';
}

function mmOnDblClick(e) {
  var rect = mmCanvas.getBoundingClientRect();
  var x = (e.clientX - rect.left) * 2, y = (e.clientY - rect.top) * 2;
  var node = mmNodeAt(x, y);
  if (node) {
    mmSelected = node.id;
    document.getElementById('mm-edit-text').value = node.text;
    document.getElementById('mm-edit-panel').style.display = 'block';
    document.getElementById('mm-edit-text').focus();
    mmRender();
  }
}

function mmAddChild() {
  if (!mmSelected) { showToast('请先点击选中一个父节点'); return; }
  var parent = mmNodes.find(function(n) { return n.id === mmSelected; });
  if (!parent) return;
  var node = {id: mmNextId++, text: '新节点', x: parent.x + (Math.random() - 0.5) * 200, y: parent.y + 80, children: [], parent: parent.id};
  mmNodes.push(node);
  parent.children.push(node.id);
  mmRender();
  showToast('✅ 已添加子节点');
}

function mmAddSibling() {
  if (!mmSelected) { showToast('请先点击选中一个节点'); return; }
  var current = mmNodes.find(function(n) { return n.id === mmSelected; });
  if (!current || !current.parent) { showToast('根节点没有同级节点'); return; }
  var parent = mmNodes.find(function(n) { return n.id === current.parent; });
  if (!parent) return;
  var node = {id: mmNextId++, text: '新节点', x: current.x + 140, y: current.y, children: [], parent: parent.id};
  mmNodes.push(node);
  parent.children.push(node.id);
  mmRender();
  showToast('✅ 已添加同级节点');
}

function mmDeleteSelected() {
  if (!mmSelected) { showToast('请先点击选中一个节点'); return; }
  if (mmSelected === 1) { showToast('不能删除根节点'); return; }
  function removeNode(id) {
    var node = mmNodes.find(function(n) { return n.id === id; });
    if (!node) return;
    (node.children || []).forEach(function(cid) { removeNode(cid); });
    mmNodes = mmNodes.filter(function(n) { return n.id !== id; });
  }
  removeNode(mmSelected);
  mmSelected = null;
  mmRender();
  showToast('✅ 已删除节点');
}

function mmConfirmEdit() {
  var text = document.getElementById('mm-edit-text').value.trim();
  if (!text || !mmSelected) { document.getElementById('mm-edit-panel').style.display = 'none'; return; }
  var node = mmNodes.find(function(n) { return n.id === mmSelected; });
  if (node) { node.text = text; }
  document.getElementById('mm-edit-panel').style.display = 'none';
  mmRender();
}

function mmExportPNG() {
  // Render at high quality
  var exportCanvas = document.createElement('canvas');
  // Calculate bounds
  var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  mmNodes.forEach(function(node) {
    var r = mmGetNodeRect(node);
    if (r.x < minX) minX = r.x;
    if (r.y < minY) minY = r.y;
    if (r.x + r.w > maxX) maxX = r.x + r.w;
    if (r.y + r.h > maxY) maxY = r.y + r.h;
  });
  var pad = 40;
  var w = (maxX - minX) + pad * 2, h = (maxY - minY) + pad * 2;
  exportCanvas.width = w;
  exportCanvas.height = h;
  var ctx = exportCanvas.getContext('2d');
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, w, h);
  // Save & restore offset
  var savedOffset = mmOffset;
  mmOffset = {x: pad - minX + mmOffset.x - (mmOffset.x - (mmCanvas.width/2)), y: pad - minY + mmOffset.y - (mmOffset.y - 100)};
  // Actually simpler: re-render with adjusted offset
  mmOffset = {x: pad - minX, y: pad - minY};
  // Draw connections
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 3]);
  mmNodes.forEach(function(node) {
    if (node.parent) {
      var parent = mmNodes.find(function(n) { return n.id === node.parent; });
      if (parent) {
        var p = {x: mmOffset.x + parent.x, y: mmOffset.y + parent.y};
        var n = {x: mmOffset.x + node.x, y: mmOffset.y + node.y};
        ctx.beginPath();
        ctx.moveTo(p.x, p.y + 18);
        ctx.lineTo(n.x, n.y - 18);
        ctx.stroke();
      }
    }
  });
  ctx.setLineDash([]);
  // Draw nodes
  mmNodes.forEach(function(node) {
    var origX = mmOffset.x + node.x, origY = mmOffset.y + node.y;
    var rw = node.text.length * 14 + 24, rh = 36;
    ctx.fillStyle = '#2a2a44';
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 1;
    mmRoundRect(ctx, origX - rw/2, origY - rh/2, rw, rh, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#e0e0e0';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.text, origX, origY);
  });
  mmOffset = savedOffset;
  // Download
  var link = document.createElement('a');
  link.download = '思维导图_' + new Date().toISOString().slice(0,10) + '.png';
  link.href = exportCanvas.toDataURL('image/png');
  link.click();
  showToast('✅ 已导出思维导图');
}

function mmReset() {
  mmNodes = [{id: 1, text: '中心主题', x: 0, y: 0, children: [], parent: null}];
  mmNextId = 2;
  mmSelected = null;
  mmOffset = {x: mmCanvas.width/2, y: 100};
  document.getElementById('mm-edit-panel').style.display = 'none';
  mmRender();
  showToast('🔄 已重置');
}

// ============================================================
// 图片艺术效果 处理函数
// ============================================================
var afOriginalImage = null, afCurrentImage = null;

function afLoadImage(e) {
  var file = e.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(ev) {
    var img = new Image();
    img.onload = function() {
      afOriginalImage = img;
      afCurrentImage = img;
      var canvas = document.getElementById('af-canvas');
      canvas.style.display = 'block';
      document.getElementById('af-placeholder').style.display = 'none';
      document.getElementById('af-download-btn').style.display = 'inline-flex';
      // Scale to fit
      var maxW = 800, maxH = 500;
      var scale = Math.min(maxW / img.width, maxH / img.height, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      showToast('✅ 图片已加载，点击滤镜效果');
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function afApplyFilter(type) {
  if (!afOriginalImage) { showToast('请先上传图片'); return; }
  var canvas = document.getElementById('af-canvas');
  var ctx = canvas.getContext('2d');
  var w = canvas.width, h = canvas.height;
  // Draw original
  ctx.drawImage(afOriginalImage, 0, 0, w, h);
  var imageData = ctx.getImageData(0, 0, w, h);
  var data = imageData.data;
  var output = new Uint8ClampedArray(data);

  switch (type) {
    case 'pencil':
      // Grayscale edge detection
      for (var i = 0; i < data.length; i += 4) {
        var gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
        data[i] = data[i+1] = data[i+2] = gray;
      }
      // Simple edge
      for (var y = 1; y < h - 1; y++) {
        for (var x = 1; x < w - 1; x++) {
          var idx = (y * w + x) * 4;
          var idxL = (y * w + (x-1)) * 4;
          var idxR = (y * w + (x+1)) * 4;
          var idxU = ((y-1) * w + x) * 4;
          var idxD = ((y+1) * w + x) * 4;
          var dx = data[idxR] - data[idxL];
          var dy = data[idxD] - data[idxU];
          var edge = Math.sqrt(dx*dx + dy*dy);
          var val = 255 - Math.min(edge, 255);
          output[idx] = output[idx+1] = output[idx+2] = val;
        }
      }
      break;
    case 'oil':
      for (var y = 2; y < h - 2; y++) {
        for (var x = 2; x < w - 2; x++) {
          var buckets = new Array(16);
          for (var b = 0; b < 16; b++) buckets[b] = {r:0,g:0,b:0,count:0};
          for (var dy = -2; dy <= 2; dy++) {
            for (var dx = -2; dx <= 2; dx++) {
              var idx = ((y+dy) * w + (x+dx)) * 4;
              var gray = Math.floor((0.299 * data[idx] + 0.587 * data[idx+1] + 0.114 * data[idx+2]) / 16);
              buckets[gray].r += data[idx];
              buckets[gray].g += data[idx+1];
              buckets[gray].b += data[idx+2];
              buckets[gray].count++;
            }
          }
          var maxIdx = 0, maxCount = 0;
          for (var b = 0; b < 16; b++) {
            if (buckets[b].count > maxCount) { maxCount = buckets[b].count; maxIdx = b; }
          }
          var idx = (y * w + x) * 4;
          output[idx] = buckets[maxIdx].r / maxCount;
          output[idx+1] = buckets[maxIdx].g / maxCount;
          output[idx+2] = buckets[maxIdx].b / maxCount;
        }
      }
      break;
    case 'mosaic':
      var block = 10;
      for (var y = 0; y < h; y += block) {
        for (var x = 0; x < w; x += block) {
          var idx = (y * w + x) * 4;
          var mr = data[idx], mg = data[idx+1], mb = data[idx+2];
          for (var dy = 0; dy < block && y + dy < h; dy++) {
            for (var dx = 0; dx < block && x + dx < w; dx++) {
              var i = ((y + dy) * w + (x + dx)) * 4;
              output[i] = mr; output[i+1] = mg; output[i+2] = mb;
            }
          }
        }
      }
      break;
    case 'emboss':
      for (var y = 1; y < h - 1; y++) {
        for (var x = 1; x < w - 1; x++) {
          var idx = (y * w + x) * 4;
          var idxTL = ((y-1) * w + (x-1)) * 4;
          var idxBR = ((y+1) * w + (x+1)) * 4;
          var grayTL = 0.299 * data[idxTL] + 0.587 * data[idxTL+1] + 0.114 * data[idxTL+2];
          var grayBR = 0.299 * data[idxBR] + 0.587 * data[idxBR+1] + 0.114 * data[idxBR+2];
          var val = Math.min(255, Math.max(0, grayTL - grayBR + 128));
          output[idx] = output[idx+1] = output[idx+2] = val;
        }
      }
      break;
    case 'comic':
      // Posterize + saturate
      for (var i = 0; i < data.length; i += 4) {
        var r = data[i], g = data[i+1], b = data[i+2];
        // Posterize to 4 levels
        output[i] = Math.floor(r / 64) * 64 + 32;
        output[i+1] = Math.floor(g / 64) * 64 + 32;
        output[i+2] = Math.floor(b / 64) * 64 + 32;
        // Boost saturation
        var gray = 0.299 * output[i] + 0.587 * output[i+1] + 0.114 * output[i+2];
        output[i] = Math.min(255, output[i] + (output[i] - gray) * 0.5);
        output[i+1] = Math.min(255, output[i+1] + (output[i+1] - gray) * 0.5);
        output[i+2] = Math.min(255, output[i+2] + (output[i+2] - gray) * 0.5);
      }
      break;
    case 'vintage':
      for (var i = 0; i < data.length; i += 4) {
        var r = data[i], g = data[i+1], b = data[i+2];
        var gray = 0.299 * r + 0.587 * g + 0.114 * b;
        output[i] = Math.min(255, gray * 1.1 + 20);
        output[i+1] = Math.min(255, gray * 0.95 + 10);
        output[i+2] = Math.min(255, gray * 0.85);
      }
      break;
    case 'edge':
      // Sobel edge detection
      for (var y = 1; y < h - 1; y++) {
        for (var x = 1; x < w - 1; x++) {
          var idx = (y * w + x) * 4;
          var gx = 0, gy = 0;
          var sobelX = [-1,0,1,-2,0,2,-1,0,1];
          var sobelY = [-1,-2,-1,0,0,0,1,2,1];
          for (var ky = -1; ky <= 1; ky++) {
            for (var kx = -1; kx <= 1; kx++) {
              var i = ((y+ky) * w + (x+kx)) * 4;
              var gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
              var ki = (ky+1)*3 + (kx+1);
              gx += gray * sobelX[ki];
              gy += gray * sobelY[ki];
            }
          }
          var edge = Math.sqrt(gx*gx + gy*gy);
          var val = 255 - Math.min(edge, 255);
          output[idx] = output[idx+1] = output[idx+2] = val;
        }
      }
      break;
  }
  var outImageData = new ImageData(output, w, h);
  ctx.putImageData(outImageData, 0, 0);
  showToast('✅ ' + {pencil:'素描',oil:'油画',mosaic:'马赛克',emboss:'浮雕',comic:'漫画',vintage:'复古',edge:'边缘检测'}[type] + '效果已应用');
}

function afReset() {
  if (!afOriginalImage) return;
  var canvas = document.getElementById('af-canvas');
  var ctx = canvas.getContext('2d');
  ctx.drawImage(afOriginalImage, 0, 0, canvas.width, canvas.height);
  showToast('🔄 已恢复原图');
}

function afDownload() {
  var canvas = document.getElementById('af-canvas');
  var link = document.createElement('a');
  link.download = '艺术效果_' + new Date().toISOString().slice(0,10) + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('✅ 已下载');
}

// ============================================================
// 在线表单制作工具 处理函数
// ============================================================
var fbQuestions = [];
var fbNextId = 1;

function fbInit() {
  var hash = location.hash || '';
  if (hash.indexOf('#fb=') === 0) {
    try {
      var dec = decodeURIComponent(hash.substring(4));
      fbQuestions = JSON.parse(dec);
      fbShowForm();
      return;
    } catch(e) {
      fbQuestions = [];
    }
  }
  if (fbQuestions.length === 0) {
    fbQuestions = [
      { id: fbNextId++, type: 'text', question: '您的称呼是？', options: [], required: true },
      { id: fbNextId++, type: 'radio', question: '您觉得这个工具好用吗？', options: ['非常好用', '还不错', '一般般', '有待改进'], required: true }
    ];
  }
  fbRenderEditor();
}

function fbTypeName(t) {
  return {radio:'单选题', checkbox:'多选题', text:'填空题', rating:'评分题'}[t] || t;
}

function fbRenderEditor() {
  var box = document.getElementById('fb-questions');
  if (!box) return;
  if (fbQuestions.length === 0) {
    box.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-light);border:1px dashed var(--border);border-radius:10px;">点击下方按钮添加第一道题目</div>';
    return;
  }
  var html = '';
  fbQuestions.forEach(function(q, qi) {
    html += '<div style="padding:14px;background:var(--card-bg);border:1px solid var(--border);border-radius:10px;margin-bottom:10px;">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
    html += '<span style="font-size:12px;padding:2px 8px;background:#6366f1;color:#fff;border-radius:12px;">' + fbTypeName(q.type) + ' ' + (qi+1) + '</span>';
    html += '<button class="btn btn-secondary" onclick="fbDeleteQuestion(' + q.id + ')" style="font-size:12px;padding:2px 10px;background:#ef4444;">🗑️</button>';
    html += '</div>';
    html += '<input type="text" value="' + (q.question || '').replace(/"/g,'&quot;') + '" placeholder="输入问题…" oninput="fbUpdateQuestion(' + q.id + ', this.value)" style="width:100%;">';
    if (q.type === 'radio' || q.type === 'checkbox') {
      html += '<div style="margin-top:8px;" id="fb-opts-' + q.id + '">';
      q.options.forEach(function(op, oi) {
        html += '<div style="display:flex;gap:6px;margin-top:6px;align-items:center;">';
        html += '<span style="min-width:20px;font-size:13px;">' + (q.type==='radio'?'◯':'☐') + '</span>';
        html += '<input type="text" value="' + op.replace(/"/g,'&quot;') + '" placeholder="选项 ' + (oi+1) + '" oninput="fbUpdateOption(' + q.id + ',' + oi + ', this.value)" style="flex:1;">';
        html += '<button class="btn btn-secondary" onclick="fbDeleteOption(' + q.id + ',' + oi + ')" style="font-size:12px;padding:2px 8px;">✖</button>';
        html += '</div>';
      });
      html += '<button class="btn btn-secondary" onclick="fbAddOption(' + q.id + ')" style="font-size:12px;padding:3px 12px;margin-top:6px;">➕ 添加选项</button>';
      html += '</div>';
    }
    if (q.type === 'rating') {
      html += '<div style="margin-top:8px;font-size:13px;color:var(--text-light);">⭐ 1-5 星评分（填写者点击星星选择）</div>';
    }
    html += '<label style="display:flex;align-items:center;gap:6px;margin-top:8px;font-size:12px;color:var(--text-light);"><input type="checkbox" ' + (q.required ? 'checked' : '') + ' onchange="fbToggleRequired(' + q.id + ', this.checked)"> 必填</label>';
    html += '</div>';
  });
  box.innerHTML = html;
}

function fbAddQuestion(type) {
  var q = { id: fbNextId++, type: type, question: '', options: type === 'radio' || type === 'checkbox' ? ['选项1', '选项2'] : [], required: false };
  fbQuestions.push(q);
  fbRenderEditor();
}

function fbDeleteQuestion(id) {
  fbQuestions = fbQuestions.filter(function(q) { return q.id !== id; });
  fbRenderEditor();
}

function fbUpdateQuestion(id, val) {
  var q = fbQuestions.find(function(x) { return x.id === id; });
  if (q) q.question = val;
}

function fbUpdateOption(qid, oi, val) {
  var q = fbQuestions.find(function(x) { return x.id === qid; });
  if (q && q.options[oi] !== undefined) q.options[oi] = val;
}

function fbAddOption(qid) {
  var q = fbQuestions.find(function(x) { return x.id === qid; });
  if (q) { q.options.push('选项' + (q.options.length + 1)); fbRenderEditor(); }
}

function fbDeleteOption(qid, oi) {
  var q = fbQuestions.find(function(x) { return x.id === qid; });
  if (q) { q.options.splice(oi, 1); fbRenderEditor(); }
}

function fbToggleRequired(qid, checked) {
  var q = fbQuestions.find(function(x) { return x.id === qid; });
  if (q) q.required = checked;
}

function fbValidateEditor() {
  for (var i = 0; i < fbQuestions.length; i++) {
    var q = fbQuestions[i];
    if (!q.question || !q.question.trim()) {
      showToast('⚠️ 第' + (i+1) + '题还没有输入问题文字');
      return false;
    }
    if ((q.type === 'radio' || q.type === 'checkbox') && q.options.filter(function(o){return o.trim();}).length < 2) {
      showToast('⚠️ 第' + (i+1) + '题至少需要2个选项');
      return false;
    }
  }
  return true;
}

function fbPreview() {
  if (!fbValidateEditor()) return;
  document.getElementById('fb-editor').style.display = 'none';
  document.getElementById('fb-share-panel').style.display = 'none';
  document.getElementById('fb-form').style.display = 'none';
  document.getElementById('fb-result').style.display = 'none';
  var pv = document.getElementById('fb-preview');
  pv.style.display = 'block';
  var html = '';
  fbQuestions.forEach(function(q, qi) {
    html += '<div style="padding:12px;background:var(--card-bg);border:1px solid var(--border);border-radius:10px;margin-bottom:8px;">';
    html += '<div style="font-weight:600;font-size:14px;margin-bottom:8px;">' + (qi+1) + '. ' + q.question + (q.required ? ' <span style="color:#ef4444;">*</span>' : '') + '</div>';
    if (q.type === 'text') {
      html += '<div style="border-bottom:1px dashed var(--border);height:32px;"></div>';
    } else if (q.type === 'rating') {
      html += '<div style="font-size:20px;letter-spacing:4px;">☆☆☆☆☆</div>';
    } else {
      q.options.forEach(function(op) {
        html += '<div style="margin:4px 0;font-size:14px;">' + (q.type==='radio'?'◯':'☐') + ' ' + op + '</div>';
      });
    }
    html += '</div>';
  });
  document.getElementById('fb-preview-questions').innerHTML = html;
}

function fbBackEditor() {
  document.getElementById('fb-preview').style.display = 'none';
  document.getElementById('fb-share-panel').style.display = 'none';
  document.getElementById('fb-form').style.display = 'none';
  document.getElementById('fb-result').style.display = 'none';
  document.getElementById('fb-editor').style.display = 'block';
  fbRenderEditor();
}

function fbShare() {
  if (!fbValidateEditor()) return;
  var enc = encodeURIComponent(JSON.stringify(fbQuestions));
  var url = location.origin + location.pathname + '#fb=' + enc;
  document.getElementById('fb-share-url').value = url;
  document.getElementById('fb-editor').style.display = 'none';
  document.getElementById('fb-preview').style.display = 'none';
  document.getElementById('fb-form').style.display = 'none';
  document.getElementById('fb-result').style.display = 'none';
  document.getElementById('fb-share-panel').style.display = 'block';
}

function fbCopyUrl() {
  var ta = document.getElementById('fb-share-url');
  ta.select();
  ta.setSelectionRange(0, 99999);
  document.execCommand('copy');
  navigator.clipboard && navigator.clipboard.writeText(ta.value).catch(function(){});
  showToast('✅ 链接已复制，发给朋友即可填写');
}

function fbOpenForm() {
  var url = document.getElementById('fb-share-url').value;
  window.open(url, '_blank');
}

function fbShowForm() {
  document.getElementById('fb-editor').style.display = 'none';
  document.getElementById('fb-share-panel').style.display = 'none';
  document.getElementById('fb-preview').style.display = 'none';
  document.getElementById('fb-result').style.display = 'none';
  var f = document.getElementById('fb-form');
  f.style.display = 'block';
  document.getElementById('fb-form-title').textContent = '📋 请填写以下表单';
  var html = '';
  fbQuestions.forEach(function(q, qi) {
    html += '<div style="padding:14px;background:var(--card-bg);border:1px solid var(--border);border-radius:10px;margin-bottom:10px;">';
    html += '<div style="font-weight:600;font-size:14px;margin-bottom:8px;">' + (qi+1) + '. ' + q.question + (q.required ? ' <span style="color:#ef4444;">*</span>' : '') + '</div>';
    if (q.type === 'text') {
      html += '<input type="text" id="fb-ans-' + q.id + '" placeholder="请输入…" style="width:100%;">';
    } else if (q.type === 'rating') {
      html += '<div style="font-size:30px;letter-spacing:8px;cursor:pointer;" id="fb-rating-' + q.id + '">☆☆☆☆☆</div>';
      html += '<input type="hidden" id="fb-ans-' + q.id + '" value="0">';
    } else {
      q.options.forEach(function(op, oi) {
        var inputId = 'fb-ans-' + q.id + '-' + oi;
        html += '<label style="display:flex;align-items:center;gap:8px;margin:6px 0;font-size:14px;cursor:pointer;">';
        html += '<input type="' + (q.type==='radio'?'radio':'checkbox') + '" name="fb-ans-' + q.id + '" value="' + op.replace(/"/g,'&quot;') + '" id="' + inputId + '" style="width:auto;"> ' + op;
        html += '</label>';
      });
    }
    html += '</div>';
  });
  document.getElementById('fb-form-questions').innerHTML = html;
  // 绑定评分星级点击
  fbQuestions.forEach(function(q) {
    if (q.type === 'rating') {
      (function(qid) {
        var el = document.getElementById('fb-rating-' + qid);
        if (el) {
          el.onclick = function(ev) {
            var stars = el.textContent;
            var idx = Math.floor((ev.offsetX / el.offsetWidth) * 5) + 1;
            idx = Math.min(5, Math.max(1, idx));
            el.textContent = '★'.repeat(idx) + '☆'.repeat(5 - idx);
            document.getElementById('fb-ans-' + qid).value = idx;
          };
        }
      })(q.id);
    }
  });
}

function fbSubmit() {
  var answers = [];
  var ok = true;
  fbQuestions.forEach(function(q) {
    var ans = '';
    if (q.type === 'text') {
      ans = (document.getElementById('fb-ans-' + q.id) || {}).value || '';
    } else if (q.type === 'rating') {
      var v = parseInt((document.getElementById('fb-ans-' + q.id) || {}).value || '0', 10);
      ans = '⭐'.repeat(Math.max(0, Math.min(5, v))) || '未评分';
    } else {
      var checked = document.querySelectorAll('input[name="fb-ans-' + q.id + '"]:checked');
      ans = Array.prototype.map.call(checked, function(c) { return c.value; }).join('、');
    }
    if (q.required && !ans) {
      ok = false;
      showToast('⚠️ 请回答必答题：' + q.question);
      return;
    }
    answers.push({ q: q.question, a: ans || '（未填写）' });
  });
  if (!ok) return;
  var html = '';
  answers.forEach(function(x, i) {
    html += '<div style="padding:10px 0;border-bottom:1px dashed var(--border);"><div style="font-size:13px;color:var(--text-light);">' + (i+1) + '. ' + x.q + '</div><div style="font-weight:600;font-size:14px;margin-top:4px;">' + x.a + '</div></div>';
  });
  document.getElementById('fb-result-content').innerHTML = html;
  document.getElementById('fb-form').style.display = 'none';
  document.getElementById('fb-result').style.display = 'block';
  window._fbAnswers = answers;
}

function fbCopyResult() {
  if (!window._fbAnswers) return;
  var text = window._fbAnswers.map(function(x, i) { return (i+1) + '. ' + x.q + '\n   答：' + x.a; }).join('\n\n');
  navigator.clipboard.writeText(text).then(function() {
    showToast('✅ 回答已复制');
  }).catch(function() {
    var ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    showToast('✅ 回答已复制');
  });
}

function fbResetForm() {
  document.getElementById('fb-result').style.display = 'none';
  fbShowForm();
}

// ============================================================
// 词云生成器 处理函数
// ============================================================
var wcPalettes = {
  rainbow: ['#ef4444', '#f97316', '#facc15', '#22c55e', '#06b6d4', '#6366f1', '#a855f7', '#ec4899'],
  blue: ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#0369a1', '#bae6fd', '#1d4ed8'],
  warm: ['#ea580c', '#f97316', '#fb923c', '#fde047', '#dc2626', '#f59e0b', '#fdba74'],
  fresh: ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#15803d', '#a3e635', '#65a30d'],
  dark: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed', '#6d28d9', '#9333ea', '#b45309']
};

function wcSplit(text) {
  // 中英文分词：按标点/空格切分，中文连续汉字按2字窗口滑动补词
  var words = [];
  var en = text.split(/[\s,，。．.、；;\n\t！!？?：:""''（）()【】\[\]《》<>"'`~@#$%^&*_+=\-\/\\|]+/).filter(function(w){ return w && w.trim(); });
  en.forEach(function(w) {
    if (/[\u4e00-\u9fa5]/.test(w)) {
      // 中文：拆成单字和双字词
      var chars = w.replace(/[^\u4e00-\u9fa5]/g, '');
      for (var i = 0; i < chars.length; i++) words.push(chars[i]);
      for (var i2 = 0; i2 < chars.length - 1; i2++) words.push(chars.substr(i2, 2));
    } else {
      words.push(w);
    }
  });
  return words;
}

function wcGenerate() {
  var text = document.getElementById('wc-input').value.trim();
  if (!text) { showToast('⚠️ 请先输入文字'); return; }
  var words = wcSplit(text);
  if (words.length === 0) { showToast('⚠️ 未识别到有效词语'); return; }
  // 统计词频
  var freq = {};
  words.forEach(function(w) { freq[w] = (freq[w] || 0) + 1; });
  var items = Object.keys(freq).map(function(k) { return { word: k, count: freq[k] }; });
  // 过滤只出现1次的单字（避免全是单字）
  var singles = items.filter(function(x) { return x.count === 1 && x.word.length === 1; });
  var multi = items.filter(function(x) { return x.count > 1 || x.word.length > 1; });
  items = multi.concat(singles);
  items.sort(function(a, b) { return b.count - a.count; });
  var maxCount = items[0].count;
  var maxWords = parseInt(document.getElementById('wc-max').value, 10) || 50;
  items = items.slice(0, maxWords);
  // 画布
  var canvas = document.getElementById('wc-canvas');
  canvas.width = 900;
  canvas.height = 500;
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  document.getElementById('wc-placeholder').style.display = 'none';
  document.getElementById('wc-download-btn').style.display = 'inline-flex';
  // 布局 & 碰撞检测
  var placed = [];
  var shape = document.getElementById('wc-shape').value;
  var palette = wcPalettes[document.getElementById('wc-palette').value] || wcPalettes.rainbow;
  var cx = canvas.width / 2, cy = canvas.height / 2;
  function inShape(x, y) {
    var dx = (x - cx) / (canvas.width / 2), dy = (y - cy) / (canvas.height / 2);
    var r = Math.sqrt(dx * dx + dy * dy);
    if (shape === 'circle') return r <= 1;
    if (shape === 'diamond') return Math.abs(dx) + Math.abs(dy) <= 1;
    if (shape === 'heart') {
      var nx = (x - cx) / 34, ny = (y - cy) / 34;
      if (nx < -3.5 || nx > 3.5 || ny < -2.5 || ny > 2.8) return false;
      var val = Math.pow(nx * nx + ny * ny - 1, 3) - nx * nx * ny * ny * ny;
      return val <= 0;
    }
    // cloud: 椭圆 + 顶部凸起
    if (shape === 'cloud') {
      if (r <= 0.55) return true;
      var local = Math.sqrt(Math.pow((x - cx) / (canvas.width / 2 * 0.7), 2) + Math.pow((y - cy + 20) / (canvas.height / 2 * 0.9), 2));
      return local <= 1 && y > cy * 0.55 && y < canvas.height * 0.9;
    }
    return r <= 1;
  }
  function overlaps(rect) {
    for (var i = 0; i < placed.length; i++) {
      var p = placed[i];
      if (rect.x < p.x + p.w && rect.x + rect.w > p.x && rect.y < p.y + p.h && rect.y + rect.h > p.y) return true;
    }
    return false;
  }
  items.forEach(function(item, idx) {
    var fontSize = Math.max(14, Math.round(18 + (item.count / maxCount) * 52));
    ctx.font = 'bold ' + fontSize + 'px "PingFang SC", "Microsoft YaHei", sans-serif';
    var w = ctx.measureText(item.word).width;
    var h = fontSize * 1.2;
    var angle = idx % 5 === 0 ? Math.PI / 2 * ((idx / 5) % 2 === 0 ? 1 : -1) : 0;
    // 螺旋搜索位置
    var found = false, place = null;
    for (var t = 0; t < 700 && !found; t += 0.12) {
      var rr = 0.6 * t;
      var ang = t;
      var x = cx + rr * Math.cos(ang);
      var y = cy + rr * Math.sin(ang) * 0.8;
      // 尝试两个角度
      [angle, 0].forEach(function(a2) {
        if (found) return;
        var dxr = Math.cos(-a2), dyr = Math.sin(-a2);
        var test = { x: x - (w * Math.abs(dxr) + h * Math.abs(dyr)) / 2, y: y - (w * Math.abs(dyr) + h * Math.abs(dxr)) / 2, w: w * Math.abs(dxr) + h * Math.abs(dyr), h: w * Math.abs(dyr) + h * Math.abs(dxr) };
        if (!overlaps(test) && inShape(x, y)) { found = true; place = { x: test.x, y: test.y, w: test.w, h: test.h, word: item.word, fontSize: fontSize, angle: a2 }; }
      });
    }
    if (!place) return;
    placed.push(place);
    ctx.save();
    ctx.translate(place.x + place.w / 2, place.y + place.h / 2);
    ctx.rotate(place.angle);
    ctx.fillStyle = palette[Math.floor(Math.random() * palette.length)];
    ctx.font = 'bold ' + place.fontSize + 'px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(place.word, 0, 0);
    ctx.restore();
  });
  if (placed.length === 0) { showToast('⚠️ 没有足够空间绘制，请减少词数'); }
}

function wcDownload() {
  var canvas = document.getElementById('wc-canvas');
  var link = document.createElement('a');
  link.download = '词云_' + new Date().toISOString().slice(0, 10) + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('✅ 已下载词云PNG');
}

// ============================================================
// CSS渐变生成器 处理函数
// ============================================================
function updateGradient() {
  var c1 = document.getElementById('gd-color1').value;
  var c2 = document.getElementById('gd-color2').value;
  var c3 = document.getElementById('gd-color3-hex').value;
  var angle = document.getElementById('gd-angle').value;
  var type = document.getElementById('gd-type').value;
  var preview = document.getElementById('gd-preview');
  var output = document.getElementById('gd-css-output');
  
  // Sync hex inputs
  document.getElementById('gd-color1-hex').value = c1;
  document.getElementById('gd-color2-hex').value = c2;
  
  var css;
  if (type === 'linear') {
    if (c3 && c3 !== '#ffffff' && c3 !== '#FFFFFF') {
      css = 'background: linear-gradient(' + angle + 'deg, ' + c1 + ', ' + c3 + ', ' + c2 + ');';
      preview.style.background = 'linear-gradient(' + angle + 'deg, ' + c1 + ', ' + c3 + ', ' + c2 + ')';
    } else {
      css = 'background: linear-gradient(' + angle + 'deg, ' + c1 + ', ' + c2 + ');';
      preview.style.background = 'linear-gradient(' + angle + 'deg, ' + c1 + ', ' + c2 + ')';
    }
  } else {
    if (c3 && c3 !== '#ffffff' && c3 !== '#FFFFFF') {
      css = 'background: radial-gradient(circle, ' + c1 + ', ' + c3 + ', ' + c2 + ');';
      preview.style.background = 'radial-gradient(circle, ' + c1 + ', ' + c3 + ', ' + c2 + ')';
    } else {
      css = 'background: radial-gradient(circle, ' + c1 + ', ' + c2 + ');';
      preview.style.background = 'radial-gradient(circle, ' + c1 + ', ' + c2 + ')';
    }
  }
  output.value = css;
}

function syncGradientColor(idx) {
  var hex = document.getElementById('gd-color' + idx + '-hex').value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    document.getElementById('gd-color' + idx).value = hex;
    updateGradient();
  }
}

function copyGradientCSS() {
  var output = document.getElementById('gd-css-output');
  output.select();
  navigator.clipboard.writeText(output.value).then(function() {
    showToast('✅ CSS代码已复制');
  }).catch(function() {
    document.execCommand('copy');
    showToast('✅ CSS代码已复制');
  });
}

function randomGradient() {
  function randColor() { return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0'); }
  document.getElementById('gd-color1').value = randColor();
  document.getElementById('gd-color2').value = randColor();
  document.getElementById('gd-angle').value = Math.floor(Math.random() * 360);
  document.getElementById('gd-angle-val').textContent = document.getElementById('gd-angle').value;
  updateGradient();
}

// ============================================================
// 社交媒体图片尺寸调整 处理函数
// ============================================================
var _srImage = null;
var _srCanvas = null;
var _srResultBlob = null;

var SR_PLATFORMS = {
  'ig-square': { name: 'Instagram 正方形', w: 1080, h: 1080 },
  'ig-portrait': { name: 'Instagram 竖版', w: 1080, h: 1350 },
  'ig-story': { name: 'Instagram 快拍', w: 1080, h: 1920 },
  'fb-post': { name: 'Facebook 帖子', w: 1200, h: 630 },
  'fb-cover': { name: 'Facebook 封面', w: 820, h: 312 },
  'tw-post': { name: 'Twitter/X 帖子', w: 1200, h: 675 },
  'tw-header': { name: 'Twitter/X 横幅', w: 1500, h: 500 },
  'li-post': { name: 'LinkedIn 帖子', w: 1200, h: 627 },
  'li-banner': { name: 'LinkedIn 封面', w: 1584, h: 396 },
  'yt-thumb': { name: 'YouTube 缩略图', w: 1280, h: 720 },
  'yt-banner': { name: 'YouTube 横幅', w: 2560, h: 1440 },
  'pin': { name: 'Pinterest 图钉', w: 1000, h: 1500 }
};

function loadSocialImage(event) {
  var file = event.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      _srImage = img;
      document.getElementById('sr-resize-btn').disabled = false;
      document.getElementById('sr-preview-area').innerHTML = '<img src="' + e.target.result + '" style="max-width:100%;max-height:240px;border-radius:8px;object-fit:contain;" alt="预览">';
      document.getElementById('sr-info').textContent = '原始尺寸: ' + img.width + ' × ' + img.height + 'px';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function socialPlatformChange() {
  if (_srImage) {
    resizeSocialImage();
  }
}

function resizeSocialImage() {
  if (!_srImage) { showToast('⚠️ 请先上传图片'); return; }
  
  var platform = document.getElementById('sr-platform').value;
  var fit = document.getElementById('sr-fit').value;
  var info = SR_PLATFORMS[platform];
  var tw = info.w, th = info.h;
  
  var canvas = document.createElement('canvas');
  canvas.width = tw;
  canvas.height = th;
  var ctx = canvas.getContext('2d');
  
  // 背景（白色）
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, tw, th);
  
  var sw = _srImage.width, sh = _srImage.height;
  var sx = 0, sy = 0, sww = sw, shh = sh;
  var dx = 0, dy = 0, dww = tw, dhh = th;
  
  if (fit === 'cover') {
    // 裁剪填充：保持比例，裁剪多余部分
    var scale = Math.max(tw / sw, th / sh);
    sww = tw / scale;
    shh = th / scale;
    sx = (sw - sww) / 2;
    sy = (sh - shh) / 2;
  } else if (fit === 'contain') {
    // 适应留白
    var scale = Math.min(tw / sw, th / sh);
    dww = sw * scale;
    dhh = sh * scale;
    dx = (tw - dww) / 2;
    dy = (th - dhh) / 2;
  }
  // fill: 拉伸，直接画满
  
  ctx.drawImage(_srImage, sx, sy, sww, shh, dx, dy, dww, dhh);
  
  _srCanvas = canvas;
  var preview = document.getElementById('sr-preview-area');
  preview.innerHTML = '<canvas id="sr-result-canvas" style="max-width:100%;max-height:240px;border-radius:8px;"></canvas>';
  var resultCanvas = document.getElementById('sr-result-canvas');
  resultCanvas.width = tw;
  resultCanvas.height = th;
  var rctx = resultCanvas.getContext('2d');
  // 缩放显示
  var displayScale = Math.min(240 / th, preview.offsetWidth / tw, 1);
  resultCanvas.style.width = Math.round(tw * displayScale) + 'px';
  resultCanvas.style.height = Math.round(th * displayScale) + 'px';
  rctx.drawImage(canvas, 0, 0, resultCanvas.width, resultCanvas.height);
  
  document.getElementById('sr-download-btn').disabled = false;
  document.getElementById('sr-info').textContent = info.name + ': ' + tw + ' × ' + th + 'px';
  
  // 生成下载blob
  canvas.toBlob(function(blob) {
    _srResultBlob = blob;
  }, 'image/png');
}

function downloadSocialImage() {
  if (!_srResultBlob) { showToast('⚠️ 请先调整尺寸'); return; }
  var platform = document.getElementById('sr-platform').value;
  var info = SR_PLATFORMS[platform];
  var a = document.createElement('a');
  a.href = URL.createObjectURL(_srResultBlob);
  a.download = info.name.replace(/\s+/g, '_') + '_' + info.w + 'x' + info.h + '.png';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('✅ 图片已下载');
}

// ============================================================
// 新工具：古文加密（Abracadabra 魔曰）处理函数
// ============================================================
let _abraLoaded = false;

function loadAbracadabra() {
  if (_abraLoaded) {
    document.getElementById('we-loading').style.display = 'none';
    document.getElementById('we-body').style.display = 'block';
    return;
  }
  document.getElementById('we-loading').style.display = 'block';
  document.getElementById('we-body').style.display = 'none';
  const script = document.createElement('script');
  script.type = 'module';
  script.textContent = `
    import { Abracadabra } from 'https://cdn.jsdelivr.net/npm/abracadabra-cn@3.5.0/dist/abracadabra-cn.js';
    window.Abracadabra = Abracadabra;
    window._abraReady = true;
    document.getElementById('we-loading').style.display = 'none';
    document.getElementById('we-body').style.display = 'block';
  `;
  document.body.appendChild(script);
  _abraLoaded = true;
}

function wenyanEncrypt() {
  const mode = document.getElementById('we-mode').value;
  const key = document.getElementById('we-key').value || 'ABRACADABRA';
  const input = document.getElementById('we-input').value;
  const output = document.getElementById('we-output');
  if (!input) { showToast('⚠️ 请输入文本'); return; }
  
  if (!window.Abracadabra) {
    showToast('⚠️ 魔曰引擎尚未加载完毕，请稍候...');
    return;
  }
  
  try {
    const Abra = window.Abracadabra;
    
    if (mode === 'wenyan-encrypt') {
      // 文言文加密
      const abra = new Abra(Abra.TEXT, Abra.TEXT);
      abra.WenyanInput(input, Abra.ENCRYPT, key);
      output.value = abra.Output();
      showToast('✅ 加密成功！已生成文言文密文');
    } else if (mode === 'wenyan-decrypt') {
      // 文言文解密
      const abra = new Abra(Abra.TEXT, Abra.TEXT);
      abra.WenyanInput(input, Abra.DECRYPT, key);
      output.value = abra.Output();
      showToast('✅ 解密成功！');
    } else if (mode === 'old-encrypt') {
      // 传统加密
      const abra = new Abra(Abra.TEXT, Abra.TEXT);
      abra.OldInput(input, Abra.ENCRYPT, key);
      output.value = abra.Output();
      showToast('✅ 加密成功！已生成汉字密文');
    } else if (mode === 'old-decrypt') {
      // 传统解密（自动识别密文类型）
      const abra = new Abra(Abra.TEXT, Abra.TEXT);
      abra.OldInput(input, Abra.AUTO, key);
      output.value = abra.Output();
      showToast('✅ 解密成功！');
    }
  } catch(e) {
    output.value = '❌ 操作失败: ' + e.message;
    showToast('❌ 操作失败');
    console.error('Abracadabra error:', e);
  }
}

// ============================================================
// 新工具：电子教材 处理函数（全科目，使用 GitHub API 动态加载）
// ============================================================
// 所有学段和科目定义（科目映射到GitHub路径）
const TEXTBOOK_LEVELS = {
  '小学': {
    icon: '📚',
    subjects: [
      '数学', '语文', '英语', '科学', '道德与法治',
      '体育与健康', '音乐', '美术', '艺术', '语文·书法练习指导'
    ]
  },
  '初中': {
    icon: '📚',
    subjects: [
      '数学', '语文', '英语', '物理', '化学', '生物学',
      '历史', '地理', '地理图册', '道德与法治', '体育与健康',
      '科学', '美术', '艺术', '音乐', '人文地理',
      '俄语', '日语'
    ]
  },
  '高中': {
    icon: '📚',
    subjects: [
      '数学', '语文', '英语', '物理', '化学', '生物学',
      '历史', '地理', '地理图册', '思想政治', '体育与健康',
      '信息技术', '通用技术', '美术', '艺术', '音乐',
      '俄语', '日语'
    ]
  },
  '大学': {
    icon: '🎓',
    subjects: [
      '高等数学', '线性代数', '概率论', '离散数学'
    ]
  }
};

// 部分科目的固定教材数据（直接已知PDF路径）
const TEXTBOOK_FIXED_DATA = {
  '小学': {
    '数学': [
      { name: '一年级上册', url: 'https://github.com/TapXWorld/ChinaTextbook/blob/master/%E5%B0%8F%E5%AD%A6/%E6%95%B0%E5%AD%A6/%E4%BA%BA%E6%95%99%E7%89%88/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%20%C2%B7%20%E6%95%B0%E5%AD%A6%E4%B8%80%E5%B9%B4%E7%BA%A7%E4%B8%8A%E5%86%8C.pdf' },
      { name: '一年级下册', url: 'https://github.com/TapXWorld/ChinaTextbook/blob/master/%E5%B0%8F%E5%AD%A6/%E6%95%B0%E5%AD%A6/%E4%BA%BA%E6%95%99%E7%89%88/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%C2%B7%E6%95%B0%E5%AD%A6%E4%B8%80%E5%B9%B4%E7%BA%A7%E4%B8%8B%E5%86%8C.pdf' },
      { name: '二年级上册', url: 'https://github.com/TapXWorld/ChinaTextbook/blob/master/%E5%B0%8F%E5%AD%A6/%E6%95%B0%E5%AD%A6/%E4%BA%BA%E6%95%99%E7%89%88/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%20%C2%B7%20%E6%95%B0%E5%AD%A6%E4%BA%8C%E5%B9%B4%E7%BA%A7%E4%B8%8A%E5%86%8C.pdf' },
      { name: '二年级下册', url: 'https://github.com/TapXWorld/ChinaTextbook/blob/master/%E5%B0%8F%E5%AD%A6/%E6%95%B0%E5%AD%A6/%E4%BA%BA%E6%95%99%E7%89%88/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%C2%B7%E6%95%B0%E5%AD%A6%E4%BA%8C%E5%B9%B4%E7%BA%A7%E4%B8%8B%E5%86%8C.pdf' },
      { name: '三年级上册', url: 'https://github.com/TapXWorld/ChinaTextbook/blob/master/%E5%B0%8F%E5%AD%A6/%E6%95%B0%E5%AD%A6/%E4%BA%BA%E6%95%99%E7%89%88/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%20%C2%B7%20%E6%95%B0%E5%AD%A6%E4%B8%89%E5%B9%B4%E7%BA%A7%E4%B8%8A%E5%86%8C.pdf' },
      { name: '三年级下册', url: 'https://github.com/TapXWorld/ChinaTextbook/blob/master/%E5%B0%8F%E5%AD%A6/%E6%95%B0%E5%AD%A6/%E4%BA%BA%E6%95%99%E7%89%88/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%C2%B7%E6%95%B0%E5%AD%A6%E4%B8%89%E5%B9%B4%E7%BA%A7%E4%B8%8B%E5%86%8C.pdf' },
      { name: '四年级上册', url: 'https://github.com/TapXWorld/ChinaTextbook/blob/master/%E5%B0%8F%E5%AD%A6/%E6%95%B0%E5%AD%A6/%E4%BA%BA%E6%95%99%E7%89%88/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%20%C2%B7%20%E6%95%B0%E5%AD%A6%E5%9B%9B%E5%B9%B4%E7%BA%A7%E4%B8%8A%E5%86%8C.pdf' },
      { name: '四年级下册', url: 'https://github.com/TapXWorld/ChinaTextbook/blob/master/%E5%B0%8F%E5%AD%A6/%E6%95%B0%E5%AD%A6/%E4%BA%BA%E6%95%99%E7%89%88/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%C2%B7%E6%95%B0%E5%AD%A6%E5%9B%9B%E5%B9%B4%E7%BA%A7%E4%B8%8B%E5%86%8C.pdf' },
      { name: '五年级上册', url: 'https://github.com/TapXWorld/ChinaTextbook/blob/master/%E5%B0%8F%E5%AD%A6/%E6%95%B0%E5%AD%A6/%E4%BA%BA%E6%95%99%E7%89%88/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%20%C2%B7%20%E6%95%B0%E5%AD%A6%E4%BA%94%E5%B9%B4%E7%BA%A7%E4%B8%8A%E5%86%8C.pdf' },
      { name: '五年级下册', url: 'https://github.com/TapXWorld/ChinaTextbook/blob/master/%E5%B0%8F%E5%AD%A6/%E6%95%B0%E5%AD%A6/%E4%BA%BA%E6%95%99%E7%89%88/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%C2%B7%E6%95%B0%E5%AD%A6%E4%BA%94%E5%B9%B4%E7%BA%A7%E4%B8%8B%E5%86%8C.pdf' },
      { name: '六年级上册', url: 'https://github.com/TapXWorld/ChinaTextbook/blob/master/%E5%B0%8F%E5%AD%A6/%E6%95%B0%E5%AD%A6/%E4%BA%BA%E6%95%99%E7%89%88/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%20%C2%B7%20%E6%95%B0%E5%AD%A6%E5%85%AD%E5%B9%B4%E7%BA%A7%E4%B8%8A%E5%86%8C.pdf' },
      { name: '六年级下册', url: 'https://github.com/TapXWorld/ChinaTextbook/blob/master/%E5%B0%8F%E5%AD%A6/%E6%95%B0%E5%AD%A6/%E4%BA%BA%E6%95%99%E7%89%88/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%C2%B7%E6%95%B0%E5%AD%A6%E5%85%AD%E5%B9%B4%E7%BA%A7%E4%B8%8B%E5%86%8C.pdf' }
    ]
  },
  '初中': {
    '数学': [
      { name: '七年级上册', url: 'https://github.com/TapXWorld/ChinaTextbook/blob/master/%E5%88%9D%E4%B8%AD/%E6%95%B0%E5%AD%A6/%E4%BA%BA%E6%95%99%E7%89%88-%E4%BA%BA%E6%B0%91%E6%95%99%E8%82%B2%E5%87%BA%E7%89%88%E7%A4%BE/%E4%B8%83%E5%B9%B4%E7%BA%A7/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%C2%B7%E6%95%B0%E5%AD%A6%E4%B8%83%E5%B9%B4%E7%BA%A7%E4%B8%8A%E5%86%8C.pdf' },
      { name: '七年级下册', url: 'https://github.com/TapXWorld/ChinaTextbook/blob/master/%E5%88%9D%E4%B8%AD/%E6%95%B0%E5%AD%A6/%E4%BA%BA%E6%95%99%E7%89%88-%E4%BA%BA%E6%B0%91%E6%95%99%E8%82%B2%E5%87%BA%E7%89%88%E7%A4%BE/%E4%B8%83%E5%B9%B4%E7%BA%A7/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%C2%B7%E6%95%B0%E5%AD%A6%E4%B8%83%E5%B9%B4%E7%BA%A7%E4%B8%8B%E5%86%8C.pdf' },
      { name: '八年级上册', url: 'https://github.com/TapXWorld/ChinaTextbook/blob/master/%E5%88%9D%E4%B8%AD/%E6%95%B0%E5%AD%A6/%E4%BA%BA%E6%95%99%E7%89%88-%E4%BA%BA%E6%B0%91%E6%95%99%E8%82%B2%E5%87%BA%E7%89%88%E7%A4%BE/%E5%85%AB%E5%B9%B4%E7%BA%A7/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%C2%B7%E6%95%B0%E5%AD%A6%E5%85%AB%E5%B9%B4%E7%BA%A7%E4%B8%8A%E5%86%8C.pdf' },
      { name: '八年级下册', url: 'https://github.com/TapXWorld/ChinaTextbook/blob/master/%E5%88%9D%E4%B8%AD/%E6%95%B0%E5%AD%A6/%E4%BA%BA%E6%95%99%E7%89%88-%E4%BA%BA%E6%B0%91%E6%95%99%E8%82%B2%E5%87%BA%E7%89%88%E7%A4%BE/%E5%85%AB%E5%B9%B4%E7%BA%A7/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%C2%B7%E6%95%B0%E5%AD%A6%E5%85%AB%E5%B9%B4%E7%BA%A7%E4%B8%8B%E5%86%8C.pdf' },
      { name: '九年级上册', url: 'https://github.com/TapXWorld/ChinaTextbook/blob/master/%E5%88%9D%E4%B8%AD/%E6%95%B0%E5%AD%A6/%E4%BA%BA%E6%95%99%E7%89%88-%E4%BA%BA%E6%B0%91%E6%95%99%E8%82%B2%E5%87%BA%E7%89%88%E7%A4%BE/%E4%B9%9D%E5%B9%B4%E7%BA%A7/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%C2%B7%E6%95%B0%E5%AD%A6%E4%B9%9D%E5%B9%B4%E7%BA%A7%E4%B8%8A%E5%86%8C.pdf' },
      { name: '九年级下册', url: 'https://github.com/TapXWorld/ChinaTextbook/blob/master/%E5%88%9D%E4%B8%AD/%E6%95%B0%E5%AD%A6/%E4%BA%BA%E6%95%99%E7%89%88-%E4%BA%BA%E6%B0%91%E6%95%99%E8%82%B2%E5%87%BA%E7%89%88%E7%A4%BE/%E4%B9%9D%E5%B9%B4%E7%BA%A7/%E4%B9%89%E5%8A%A1%E6%95%99%E8%82%B2%E6%95%99%E7%A7%91%E4%B9%A6%C2%B7%E6%95%B0%E5%AD%A6%E4%B9%9D%E5%B9%B4%E7%BA%A7%E4%B8%8B%E5%86%8C.pdf' }
    ]
  }
};

// 科目对应的GitHub路径映射
const TEXTBOOK_PATH_MAP = {
  '小学': {
    '数学': '小学/数学/人教版',
    '语文': '小学/语文/统编版',
    '英语': '小学/英语',
    '科学': '小学/科学',
    '道德与法治': '小学/道德与法治/统编版',
    '体育与健康': '小学/体育与健康',
    '音乐': '小学/音乐',
    '美术': '小学/美术',
    '艺术': '小学/艺术',
    '语文·书法练习指导': '小学/语文·书法练习指导'
  },
  '初中': {
    '数学': '初中/数学/人教版-人民教育出版社',
    '语文': '初中/语文/统编版-人民教育出版社',
    '英语': '初中/英语',
    '物理': '初中/物理',
    '化学': '初中/化学',
    '生物学': '初中/生物学',
    '历史': '初中/历史/统编版-人民教育出版社',
    '地理': '初中/地理',
    '地理图册': '初中/地理图册',
    '道德与法治': '初中/道德与法治/统编版-人民教育出版社',
    '体育与健康': '初中/体育与健康',
    '科学': '初中/科学',
    '美术': '初中/美术',
    '艺术': '初中/艺术',
    '音乐': '初中/音乐',
    '人文地理': '初中/人文地理/统编版-人民教育出版社',
    '俄语': '初中/俄语/人教版-人民教育出版社',
    '日语': '初中/日语/人教版-人民教育出版社'
  },
  '高中': {
    '数学': '高中/数学',
    '语文': '高中/语文/统编版-人民教育出版社',
    '英语': '高中/英语',
    '物理': '高中/物理',
    '化学': '高中/化学',
    '生物学': '高中/生物学',
    '历史': '高中/历史/统编版-人民教育出版社',
    '地理': '高中/地理',
    '地理图册': '高中/地理图册',
    '思想政治': '高中/思想政治/统编版-人民教育出版社',
    '体育与健康': '高中/体育与健康',
    '信息技术': '高中/信息技术',
    '通用技术': '高中/通用技术',
    '美术': '高中/美术',
    '艺术': '高中/艺术',
    '音乐': '高中/音乐',
    '俄语': '高中/俄语/人教版-人民教育出版社',
    '日语': '高中/日语/人教版-人民教育出版社'
  },
  '大学': {
    '高等数学': '大学/高等数学/同济大学高等数学第七版',
    '线性代数': '大学/线性代数',
    '概率论': '大学/概率论',
    '离散数学': '大学/离散数学'
  }
};

function tbSelectLevel(level) {
  const levelData = TEXTBOOK_LEVELS[level];
  if (!levelData) return;
  const subjectsDiv = document.getElementById('tb-subjects');
  const booksDiv = document.getElementById('tb-books');
  booksDiv.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-light);">⬆️ 请选择上方科目查看教材</div>';
  // 显示科目按钮
  subjectsDiv.innerHTML = levelData.subjects.map(s =>
    `<button class="btn btn-sm" onclick="tbSelectSubject('${level}','${s}')" style="background:rgba(99,102,241,0.1);border:1px solid var(--primary);font-size:13px;margin:2px;">${s}</button>`
  ).join('');
  // 默认选中第一个科目
  tbSelectSubject(level, levelData.subjects[0]);
}

function tbSelectSubject(level, subject) {
  const div = document.getElementById('tb-books');
  div.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-light);">⏳ 加载中...</div>';
  
  // 先检查是否有固定数据（如数学）
  const fixed = TEXTBOOK_FIXED_DATA[level] && TEXTBOOK_FIXED_DATA[level][subject];
  if (fixed && fixed.length > 0) {
    tbRenderBooks(fixed);
    return;
  }
  
  // 获取科目路径
  const path = TEXTBOOK_PATH_MAP[level] && TEXTBOOK_PATH_MAP[level][subject];
  if (!path) {
    const ghUrl = `https://github.com/TapXWorld/ChinaTextbook/tree/master/${encodeURIComponent(level)}/${encodeURIComponent(subject)}`;
    div.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-light);">
      暂无该科目教材数据。<br>
      <a href="${ghUrl}" target="_blank" style="color:var(--primary);">去 GitHub 查看 →</a>
    </div>`;
    return;
  }
  
  // 尝试从缓存读取
  const cacheKey = 'tb_tree_' + path;
  let cached;
  try { cached = JSON.parse(localStorage.getItem(cacheKey)); } catch(e) {}
  if (cached && cached.length > 0) {
    tbRenderBooks(cached);
    return;
  }
  
  // 加载整个仓库树（递归），然后本地过滤
  tbLoadTree(path, cacheKey, div);
}

// 全局缓存：整个仓库的树结构
var _tbRepoTree = null;

function tbLoadTree(path, cacheKey, div) {
  // 先尝试全局缓存
  if (_tbRepoTree) {
    var books = tbFilterBooks(_tbRepoTree, path);
    if (books.length > 0) {
      try { localStorage.setItem(cacheKey, JSON.stringify(books)); } catch(e) {}
      tbRenderBooks(books);
    } else {
      tbShowFallback(path, div);
    }
    return;
  }
  
  // 尝试从 localStorage 读取全局树
  var globalCache;
  try { globalCache = JSON.parse(localStorage.getItem('tb_repo_tree')); } catch(e) {}
  if (globalCache && globalCache.tree) {
    _tbRepoTree = globalCache;
    var books = tbFilterBooks(_tbRepoTree, path);
    if (books.length > 0) {
      try { localStorage.setItem(cacheKey, JSON.stringify(books)); } catch(e) {}
      tbRenderBooks(books);
    } else {
      tbShowFallback(path, div);
    }
    return;
  }
  
  // 请求整个仓库树（一次请求，覆盖所有科目）
  div.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-light);">⏳ 正在加载教材目录，请稍候...</div>';
  fetch('https://api.github.com/repos/TapXWorld/ChinaTextbook/git/trees/master?recursive=1')
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(data) {
      if (!data || !data.tree || data.tree.length === 0) throw new Error('无数据');
      _tbRepoTree = data;
      // 缓存全局树（7天有效）
      try {
        localStorage.setItem('tb_repo_tree', JSON.stringify(data));
        // 设置过期时间
        localStorage.setItem('tb_repo_tree_expire', String(Date.now() + 7 * 86400000));
      } catch(e) {}
      
      var books = tbFilterBooks(data, path);
      if (books.length > 0) {
        try { localStorage.setItem(cacheKey, JSON.stringify(books)); } catch(e) {}
        tbRenderBooks(books);
      } else {
        tbShowFallback(path, div);
      }
    })
    .catch(function(err) {
      // 尝试逐个目录请求（降级）
      tbFetchLegacy(path, cacheKey, div);
    });
}

function tbFilterBooks(treeData, path) {
  var prefix = path;
  var results = [];
  if (!treeData || !treeData.tree) return results;
  
  for (var i = 0; i < treeData.tree.length; i++) {
    var item = treeData.tree[i];
    // 只匹配该路径下的文件
    if (item.type === 'blob' && item.path.startsWith(prefix + '/') && item.path.endsWith('.pdf')) {
      var name = item.path.replace(prefix + '/', '').replace('.pdf', '');
      var rawUrl = 'https://raw.githubusercontent.com/TapXWorld/ChinaTextbook/master/' + item.path;
      results.push({ name: name, url: rawUrl });
    }
  }
  return results;
}

function tbShowFallback(path, div) {
  var ghUrl = 'https://github.com/TapXWorld/ChinaTextbook/tree/master/' + path;
  div.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text-light);">' +
    '该目录下未找到PDF文件，请直接在 GitHub 上浏览。<br>' +
    '<a href="' + ghUrl + '" target="_blank" style="color:var(--primary);font-size:14px;margin-top:8px;display:inline-block;">📂 在 GitHub 上浏览 →</a>' +
    '</div>';
}

// 降级方案：逐个目录请求（兼容旧API）
function tbFetchLegacy(path, cacheKey, div) {
  var apiUrl = 'https://api.github.com/repos/TapXWorld/ChinaTextbook/contents/' + path;
  fetch(apiUrl)
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(data) {
      if (!Array.isArray(data)) throw new Error('无数据');
      var files = data.filter(function(item) { return item.type === 'file' && item.name.endsWith('.pdf'); });
      var dirs = data.filter(function(item) { return item.type === 'dir'; });
      
      if (files.length > 0) {
        var books = files.map(function(f) { return { name: f.name.replace('.pdf', ''), url: f.download_url }; });
        try { localStorage.setItem(cacheKey, JSON.stringify(books)); } catch(e) {}
        tbRenderBooks(books);
      } else if (dirs.length > 0) {
        // 有子目录，递归读取
        tbFetchLegacyDirs(dirs, path, div, 0, []);
      } else {
        tbShowFallback(path, div);
      }
    })
    .catch(function() {
      tbShowFallback(path, div);
    });
}

function tbFetchLegacyDirs(dirs, basePath, div, idx, allBooks) {
  if (idx >= dirs.length) {
    if (allBooks.length > 0) {
      var cacheKey = 'tb_tree_' + basePath;
      try { localStorage.setItem(cacheKey, JSON.stringify(allBooks)); } catch(e) {}
      tbRenderBooks(allBooks);
    } else {
      tbShowFallback(basePath, div);
    }
    return;
  }
  
  fetch(dirs[idx].url)
    .then(function(r) { return r.ok ? r.json() : []; })
    .then(function(subData) {
      if (Array.isArray(subData)) {
        subData.forEach(function(item) {
          if (item.type === 'file' && item.name.endsWith('.pdf')) {
            allBooks.push({ name: item.name.replace('.pdf', ''), url: item.download_url });
          }
        });
      }
      tbFetchLegacyDirs(dirs, basePath, div, idx + 1, allBooks);
    })
    .catch(function() {
      tbFetchLegacyDirs(dirs, basePath, div, idx + 1, allBooks);
    });
}

function tbRenderBooks(books) {
  const div = document.getElementById('tb-books');
  div.innerHTML = books.map(b => `
    <div style="padding:12px 16px;background:var(--card-bg);border:1px solid var(--border);border-radius:10px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:10px;"
         onmouseover="this.style.borderColor='var(--primary)';this.style.boxShadow='0 2px 8px rgba(99,102,241,0.1)'"
         onmouseout="this.style.borderColor='var(--border)';this.style.boxShadow='none'"
         onclick="tbOpenBook('${b.name.replace(/'/g, "\\'")}','${b.url}')">
      <span style="font-size:24px;">📖</span>
      <div>
        <div style="font-weight:600;font-size:14px;">${b.name}</div>
        <div style="font-size:12px;color:var(--text-light);">点击在线阅读</div>
      </div>
    </div>
  `).join('');
}

function tbOpenBook(name, url) {
  const viewer = document.getElementById('tb-viewer');
  document.getElementById('tb-viewer-title').textContent = name;
  // 将GitHub blob URL转换为raw URL，或直接使用raw URL
  let rawUrl = url;
  if (url.includes('github.com') && url.includes('/blob/')) {
    rawUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
  }
  document.getElementById('tb-viewer-frame').src = `https://docs.google.com/viewer?url=${encodeURIComponent(rawUrl)}&embedded=true`;
  viewer.style.display = 'block';
  viewer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================================
// 新工具：B站视频解析 处理函数
// ============================================================
function biliParse() {
  const input = document.getElementById('bili-input').value.trim();
  const resultDiv = document.getElementById('bili-result');
  const errorDiv = document.getElementById('bili-error');
  resultDiv.style.display = 'none';
  errorDiv.style.display = 'none';
  
  if (!input) {
    errorDiv.textContent = '⚠️ 请输入B站视频链接或BV号';
    errorDiv.style.display = 'block';
    return;
  }
  
  // 提取BV号
  let bvid = '';
  const bvMatch = input.match(/BV[a-zA-Z0-9]+/);
  if (bvMatch) bvid = bvMatch[0];
  else if (input.startsWith('BV')) bvid = input;
  else {
    errorDiv.textContent = '⚠️ 未识别到有效的BV号，请输入B站视频链接或BV号';
    errorDiv.style.display = 'block';
    return;
  }
  
  // 使用B站公开API（通过CORS代理）
  const apiUrl = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`;
  
  const btn = document.querySelector('.btn-primary[onclick="biliParse()"]');
  if (btn) btn.textContent = '⏳ 解析中...';
  
  fetch(proxyUrl, { signal: AbortSignal.timeout(10000) })
    .then(r => r.json())
    .then(data => {
      if (btn) btn.textContent = '🔍 解析';
      if (data.code !== 0) {
        errorDiv.textContent = '❌ API返回错误: ' + (data.message || '未知错误');
        errorDiv.style.display = 'block';
        return;
      }
      const v = data.data;
      document.getElementById('bili-title').textContent = v.title;
      document.getElementById('bili-stats').innerHTML = `
        <div>📺 BV号：${v.bvid}</div>
        <div>🎬 UP主：${v.owner.name}</div>
        <div>👁️ 播放：${(v.stat.view / 10000).toFixed(1)}万</div>
        <div>👍 点赞：${(v.stat.like / 10000).toFixed(1)}万</div>
        <div>💬 弹幕：${(v.stat.danmaku / 10000).toFixed(1)}万</div>
        <div>📅 发布时间：${v.pubdate ? new Date(v.pubdate * 1000).toLocaleDateString('zh-CN') : '未知'}</div>
        <div>⏱️ 时长：${Math.floor(v.duration / 60)}分${v.duration % 60}秒</div>
      `;
      document.getElementById('bili-desc').textContent = v.desc || '暂无简介';
      document.getElementById('bili-cover').innerHTML = v.pic ? `<img src="${v.pic}@200w_125h" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='${v.pic}'">` : '暂无封面';
      resultDiv.style.display = 'block';
    })
    .catch(err => {
      if (btn) btn.textContent = '🔍 解析';
      // 如果代理失败，尝试直接请求
      fetch(apiUrl, { mode: 'no-cors' }).then(() => {
        errorDiv.textContent = '⚠️ 浏览器跨域限制导致无法直接获取数据，请尝试使用B站直接查看视频信息。\n\n或者试试其他视频解析工具。';
        errorDiv.style.display = 'block';
      }).catch(() => {
        errorDiv.textContent = '❌ 请求失败，此工具需要后端代理支持。您可以手动在B站搜索该视频。\n\n错误: ' + err.message;
        errorDiv.style.display = 'block';
      });
    });
}

// ============================================================
// 新工具：文档解析 处理函数
// ============================================================
function dpDrop(e) {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) dpProcessFile(file);
}

function dpFileSelected(file) {
  if (file) dpProcessFile(file);
}

function dpProcessFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext !== 'pdf' && ext !== 'txt') {
    showToast('⚠️ 仅支持 PDF 和 TXT 格式');
    return;
  }
  document.getElementById('dp-result').style.display = 'block';
  document.getElementById('dp-output').value = '正在解析文件...';
  
  if (ext === 'txt') {
    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      document.getElementById('dp-output').value = text;
      document.getElementById('dp-info').textContent = `共 ${text.length} 字`;
    };
    reader.readAsText(file);
  } else {
    // PDF - 使用PDF.js
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const typedarray = new Uint8Array(e.target.result);
        pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
          let fullText = '';
          const totalPages = pdf.numPages;
          const promises = [];
          for (let i = 1; i <= totalPages; i++) {
            promises.push(pdf.getPage(i).then(function(page) {
              return page.getTextContent().then(function(textContent) {
                return textContent.items.map(item => item.str).join(' ');
              });
            }));
          }
          Promise.all(promises).then(function(pages) {
            fullText = pages.map((text, i) => `--- 第 ${i+1} 页 ---\n${text}`).join('\n\n');
            document.getElementById('dp-output').value = fullText;
            document.getElementById('dp-info').textContent = `共 ${totalPages} 页，${fullText.length} 字`;
          });
        });
      } catch(err) {
        document.getElementById('dp-output').value = '❌ 解析PDF失败: ' + err.message + '\n\n请确保已加载PDF.js库。';
      }
    };
    reader.readAsArrayBuffer(file);
  }
}

function dpCopyText() {
  const text = document.getElementById('dp-output').value;
  navigator.clipboard.writeText(text).then(() => {
    showToast('✅ 已复制到剪贴板');
  }).catch(() => {
    document.getElementById('dp-output').select();
    document.execCommand('copy');
    showToast('✅ 已复制');
  });
}

// ============================================================
// 分类定义
// ============================================================
const CATEGORIES = [
  { id: 'text', icon: '✏️', name: '文本工具', desc: '字数统计、简繁转换、摩斯密码、文本转语音、文本对比' },
  { id: 'dev', icon: '💻', name: '开发者工具', desc: 'JSON格式化、二维码生成、二维码美化、条形码生成、Favicon图标生成、正则测试、Markdown、IP查询、思维导图、图表生成、代码图片生成、表格数据转换' },
  { id: 'image', icon: '🖼️', name: '图片处理', desc: '去背景换底色、批量压缩、加水印、长图拼接、格式转换、裁剪、异形裁剪、马赛克打码、双色调滤镜、图片转字符画、照片卡通化、OCR、印章制作、九宫格切图、文字转手写体、表情包、社交媒体图片尺寸调整、艺术效果、像素画、设备样机、图片高清放大、图片转线稿、渐变背景、文字特效、拼贴画、图片相框、颜色盲区模拟' },
  { id: 'document', icon: '📄', name: '文档转换', desc: '图片转PDF、PDF转图片、Word解析、Excel转PDF、PDF合并、PDF拆分、简历生成、电子签名、表单制作、邮件签名、发票/收据生成器、证书生成器' },
  { id: 'convert', icon: '🔄', name: '转换工具', desc: '单位换算、进制转换、函数绘图' },
  { id: 'security', icon: '🔒', name: '安全工具', desc: '密码生成、Hash计算、随机数' },
  { id: 'time', icon: '⏱️', name: '时间工具', desc: '时间戳转换、日期计算、番茄钟专注计时' },
  { id: 'color', icon: '🎨', name: '颜色工具', desc: 'HEX/RGB/HSL颜色转换、CSS渐变生成器、配色方案生成器' },
  { id: 'media', icon: '🎬', name: '媒体工具', desc: '抖音/TikTok去水印下载、视频转GIF、在线录音、录音转文字、音频波形可视化、白噪音发生器、音频变速变调、音频剪辑拼接、视频缩略图制作器、在线便签' },
  { id: 'ai', icon: '🤖', name: 'AI工具', desc: 'AI聊天、AI Agent安装、免费AI工具推荐' },
  { id: 'voice', icon: '🗣️', name: '群众心声', desc: '提交工具建议、投票排行榜、前3名自动实现' },
  { id: 'lottery', icon: '🎰', name: '彩票工具', desc: '双色球、大乐透、福彩3D、快乐8、排列三…在线过滤缩水、选号、计算器' },
  { id: 'fun', icon: '🎪', name: '趣味工具', desc: '表情包生成、决策转盘、抽奖抽签、词云生成、涂鸦画板、娱乐好玩' },
  { id: 'finance', icon: '💰', name: '财务工具', desc: '家庭记账本、收支统计、月度汇总' },
  { id: 'edu', icon: '📚', name: '教育资源', desc: '电子教材在线阅读、学习资源导航、元素周期表' }
];

// ============================================================
// 配色方案生成器 处理函数 (替代 Coolors.co)
// ============================================================
let cpColors = [];
let cpLocked = [];
let cpInitialized = false;

function cpInit() {
  if (cpInitialized) return;
  cpInitialized = true;
  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      cpGenerate();
    }
  });
  cpGenerate();
}

function cpGenerate() {
  const mode = document.getElementById('cp-mode').value;
  const count = parseInt(document.getElementById('cp-count').value);
  const palette = document.getElementById('cp-palette');
  
  let baseHue = Math.random() * 360;
  
  if (mode === 'random') {
    baseHue = Math.random() * 360;
  }
  
  const hues = [];
  for (let i = 0; i < count; i++) {
    if (cpLocked[i] && cpColors[i]) {
      hues.push(cpColors[i].h);
      continue;
    }
    let h = baseHue;
    switch (mode) {
      case 'random':
        h = Math.random() * 360;
        break;
      case 'complementary':
        h = (baseHue + (360 / count) * i) % 360;
        if (i === 1) h = (baseHue + 180) % 360;
        if (i >= 2) h = (baseHue + 30 * (i - 1)) % 360;
        break;
      case 'analogous':
        h = (baseHue + (i - Math.floor(count/2)) * 30 + 360) % 360;
        break;
      case 'triadic':
        h = (baseHue + Math.floor(360 / 3) * i) % 360;
        if (i >= 3) h = (baseHue + 30 * (i - 2)) % 360;
        break;
      case 'monochromatic':
        h = baseHue;
        break;
      case 'tetradic':
        const offsets = [0, 90, 180, 270];
        h = (baseHue + (offsets[i % 4] || 0) + (i >= 4 ? 20 : 0)) % 360;
        break;
    }
    hues.push(h);
  }
  
  cpColors = hues.map((h, i) => {
    if (cpLocked[i] && cpColors[i]) return cpColors[i];
    const s = mode === 'monochromatic' ? 40 + Math.random() * 40 : 55 + Math.random() * 35;
    const l = 35 + Math.random() * 30;
    const hex = cpHSLToHex(h, s, l);
    // Check contrast - ensure it's not too similar to locked ones
    return { h, s, l, hex };
  });
  
  cpRender();
}

function cpRender() {
  const palette = document.getElementById('cp-palette');
  palette.innerHTML = cpColors.map((c, i) => {
    const isDark = c.l < 50;
    const textColor = isDark ? '#ffffff' : '#1a1a2e';
    const locked = cpLocked[i];
    return `
      <div class="cp-swatch" style="flex:1;min-width:80px;background:${c.hex};border-radius:10px;padding:12px 8px;cursor:pointer;text-align:center;position:relative;transition:all 0.2s;border:${locked ? '3px solid #fff' : '3px solid transparent'};box-shadow:${locked ? '0 0 12px rgba(255,255,255,0.5)' : 'none'};" onclick="cpToggleLock(${i})">
        <div style="color:${textColor};font-family:monospace;font-size:14px;font-weight:700;text-shadow:${isDark ? '0 1px 3px rgba(0,0,0,0.5)' : 'none'};">${c.hex}</div>
        <div style="margin-top:6px;color:${textColor};font-size:11px;opacity:0.8;">${locked ? '🔒' : '🔓'}</div>
        <div style="margin-top:4px;"><button class="btn btn-secondary" style="font-size:11px;padding:3px 8px;background:${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};color:${textColor};border:none;border-radius:6px;cursor:pointer;" onclick="event.stopPropagation();cpCopyHex('${c.hex}')">📋 复制</button></div>
      </div>
    `;
  }).join('');
}

function cpToggleLock(index) {
  cpLocked[index] = !cpLocked[index];
  cpRender();
}

function cpCopyHex(hex) {
  navigator.clipboard.writeText(hex).then(() => toast('✅ 已复制: ' + hex));
}

function cpCopyAll() {
  const hexes = cpColors.map(c => c.hex).join(', ');
  navigator.clipboard.writeText(hexes).then(() => toast('✅ 已复制全部颜色'));
}

function cpExportCSS() {
  const output = document.getElementById('cp-css-output');
  const text = document.getElementById('cp-css-text');
  const css = ':root {\n' + cpColors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n') + '\n}';
  text.value = css;
  output.style.display = 'block';
  toast('✅ CSS 已生成');
}

function cpHSLToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r, g, b;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  const toHex = (v) => {
    const hex = Math.round((v + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

// ============================================================
// 在线录音工具 处理函数 (替代 Online Voice Recorder)
// ============================================================
let arMediaRecorder = null;
let arAudioChunks = [];
let arAudioBlob = null;
let arAudioUrl = null;
let arAudioEl = null;
let arIsRecording = false;
let arStartTime = 0;
let arTimerInterval = null;
let arAnalyser = null;
let arDataArray = null;
let arAnimFrame = null;
let arStream = null;
let arInitialized = false;

function arInit() {
  if (arInitialized) return;
  arInitialized = true;
  arAudioEl = new Audio();
  arAudioEl.onended = function() {
    document.getElementById('ar-play-btn').textContent = '▶️ 播放';
  };
}

function arToggleRecord() {
  const btn = document.getElementById('ar-record-btn');
  if (!arIsRecording) {
    // Start recording
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function(stream) {
      arStream = stream;
      arMediaRecorder = new MediaRecorder(stream);
      arAudioChunks = [];
      
      arMediaRecorder.ondataavailable = function(e) {
        arAudioChunks.push(e.data);
      };
      
      arMediaRecorder.onstop = function() {
        arAudioBlob = new Blob(arAudioChunks, { type: 'audio/webm' });
        arAudioUrl = URL.createObjectURL(arAudioBlob);
        arAudioEl.src = arAudioUrl;
        document.getElementById('ar-play-btn').disabled = false;
        document.getElementById('ar-download-btn').disabled = false;
        // Stop all tracks
        arStream.getTracks().forEach(function(t) { t.stop(); });
        arStream = null;
        if (arAnimFrame) cancelAnimationFrame(arAnimFrame);
      };
      
      arMediaRecorder.start();
      arIsRecording = true;
      arStartTime = Date.now();
      btn.textContent = '⏹ 停止录音';
      btn.className = 'btn btn-danger';
      document.getElementById('ar-play-btn').disabled = true;
      document.getElementById('ar-download-btn').disabled = true;
      document.getElementById('ar-status').textContent = '🔴 正在录音...';
      document.getElementById('ar-status').style.color = '#ef4444';
      
      // Start timer
      arTimerInterval = setInterval(arUpdateTimer, 100);
      
      // Start waveform visualization
      arStartWaveform(stream);
    }).catch(function(err) {
      toast('❌ 无法访问麦克风: ' + err.message);
    });
  } else {
    // Stop recording
    if (arMediaRecorder && arMediaRecorder.state !== 'inactive') {
      arMediaRecorder.stop();
    }
    arIsRecording = false;
    btn.textContent = '🔴 开始录音';
    btn.className = 'btn btn-primary';
    document.getElementById('ar-status').textContent = '✅ 录音完成，点击播放试听';
    document.getElementById('ar-status').style.color = 'var(--text-light)';
    clearInterval(arTimerInterval);
  }
}

function arStartWaveform(stream) {
  const canvas = document.getElementById('ar-waveform');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaStreamSource(stream);
  arAnalyser = audioCtx.createAnalyser();
  arAnalyser.fftSize = 256;
  source.connect(arAnalyser);
  arDataArray = new Uint8Array(arAnalyser.frequencyBinCount);
  
  function draw() {
    if (!arIsRecording) {
      // Draw a flat line when not recording
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      return;
    }
    arAnimFrame = requestAnimationFrame(draw);
    arAnalyser.getByteTimeDomainData(arDataArray);
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#6366f1';
    ctx.beginPath();
    const sliceWidth = canvas.width / arDataArray.length;
    let x = 0;
    for (let i = 0; i < arDataArray.length; i++) {
      const v = arDataArray[i] / 128.0;
      const y = v * canvas.height / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }
  draw();
}

function arUpdateTimer() {
  const elapsed = Math.floor((Date.now() - arStartTime) / 1000);
  const min = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const sec = String(elapsed % 60).padStart(2, '0');
  document.getElementById('ar-duration').textContent = min + ':' + sec;
}

function arTogglePlay() {
  if (!arAudioEl || !arAudioUrl) return;
  const btn = document.getElementById('ar-play-btn');
  if (arAudioEl.paused) {
    arAudioEl.play();
    btn.textContent = '⏸ 暂停';
  } else {
    arAudioEl.pause();
    btn.textContent = '▶️ 播放';
  }
}

function arDownload() {
  if (!arAudioBlob) return;
  const format = document.getElementById('ar-format').value;
  const a = document.createElement('a');
  if (format === 'wav') {
    // Convert webm to wav
    const reader = new FileReader();
    reader.onload = function(e) {
      const audioData = e.target.result;
      const wavBlob = arConvertToWav(audioData);
      a.href = URL.createObjectURL(wavBlob);
      a.download = 'recording.wav';
      a.click();
      URL.revokeObjectURL(a.href);
    };
    reader.readAsArrayBuffer(arAudioBlob);
  } else {
    a.href = arAudioUrl;
    a.download = 'recording.mp3';
    a.click();
  }
}

function arConvertToWav(audioData) {
  // Simple WAV conversion from raw PCM
  const samples = new Float32Array(audioData);
  const numChannels = 1;
  const sampleRate = 44100;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const dataSize = samples.length * numChannels * bitsPerSample / 8;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  
  function writeString(offset, str) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }
  
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);
  
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    offset += 2;
  }
  
  return new Blob([buffer], { type: 'audio/wav' });
}

// ============================================================
// 像素画生成器 处理函数
// ============================================================
let paImage = null;
let paGenerated = false;

function paReset() {
  paImage = null;
  paGenerated = false;
  document.getElementById('pa-file').value = '';
  document.getElementById('pa-canvas').style.display = 'none';
  document.getElementById('pa-placeholder').style.display = 'flex';
  document.getElementById('pa-download-btn').style.display = 'none';
}

function paGenerate() {
  const fileInput = document.getElementById('pa-file');
  if (!fileInput.files || !fileInput.files[0]) {
    showToast('⚠️ 请先上传一张图片');
    return;
  }
  if (!paImage) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        paImage = img;
        paRender();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
    return;
  }
  paRender();
}

function paRender() {
  if (!paImage) return;
  const pixel = parseInt(document.getElementById('pa-pixel').value, 10);
  const level = parseInt(document.getElementById('pa-colors').value, 10);
  const grid = document.getElementById('pa-grid').checked;

  const img = paImage;
  const smallW = Math.max(8, Math.round(img.width / pixel));
  const smallH = Math.max(8, Math.round(img.height / pixel));

  // 1) 缩小到像素网格
  const tmp = document.createElement('canvas');
  tmp.width = smallW;
  tmp.height = smallH;
  const tctx = tmp.getContext('2d');
  tctx.imageSmoothingEnabled = true; // 缩小取平均更均匀
  tctx.drawImage(img, 0, 0, smallW, smallH);
  let data = tctx.getImageData(0, 0, smallW, smallH).data;

  // 2) 色阶量化（posterize）：level 为每通道级数
  const steps = Math.max(2, Math.round(Math.pow(level, 1/3)));
  const px = tctx.createImageData(smallW, smallH);
  if (level >= 256) {
    px.data.set(data);
  } else {
    for (let i = 0; i < data.length; i += 4) {
      px.data[i] = Math.round(data[i] / 255 * (steps - 1)) * Math.floor(255 / (steps - 1));
      px.data[i+1] = Math.round(data[i+1] / 255 * (steps - 1)) * Math.floor(255 / (steps - 1));
      px.data[i+2] = Math.round(data[i+2] / 255 * (steps - 1)) * Math.floor(255 / (steps - 1));
      px.data[i+3] = 255;
    }
  }

  // 3) 放大回显示尺寸（最近邻，保持硬边）
  const scale = Math.max(1, Math.floor(600 / Math.max(smallW, smallH)));
  const canvas = document.getElementById('pa-canvas');
  canvas.width = smallW * scale;
  canvas.height = smallH * scale;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 先画缩小后的临画布，再放大
  const big = document.createElement('canvas');
  big.width = smallW * scale;
  big.height = smallH * scale;
  const bctx = big.getContext('2d');
  bctx.imageSmoothingEnabled = false;
  bctx.putImageData(px, 0, 0);
  bctx.drawImage(big, 0, 0, smallW, smallH, 0, 0, smallW * scale, smallH * scale);
  ctx.drawImage(big, 0, 0);

  // 网格线
  if (grid) {
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= smallW; x++) {
      ctx.moveTo(x * scale, 0);
      ctx.lineTo(x * scale, canvas.height);
    }
    for (let y = 0; y <= smallH; y++) {
      ctx.moveTo(0, y * scale);
      ctx.lineTo(canvas.width, y * scale);
    }
    ctx.stroke();
  }

  canvas.style.display = 'block';
  document.getElementById('pa-placeholder').style.display = 'none';
  document.getElementById('pa-download-btn').style.display = 'inline-block';
  paGenerated = true;
  showToast('✅ 像素画生成完成');
}

function paDownload() {
  const canvas = document.getElementById('pa-canvas');
  if (!paGenerated) return;
  const a = document.createElement('a');
  a.download = 'pixel-art-' + Date.now() + '.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
  showToast('✅ PNG已下载');
}

// ============================================================
// 邮件签名生成器 处理函数
// ============================================================
function esEsc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function esBuildHtml(escapeIt) {
  const name = document.getElementById('es-name').value.trim();
  const title = document.getElementById('es-title').value.trim();
  const company = document.getElementById('es-company').value.trim();
  const phone = document.getElementById('es-phone').value.trim();
  const email = document.getElementById('es-email').value.trim();
  const web = document.getElementById('es-web').value.trim();
  const color = document.getElementById('es-color').value;
  const layout = document.getElementById('es-layout').value;
  const esc = escapeIt ? esEsc : function(x){ return x; };

  const info = [
    name ? '<div style="font-size:16px;font-weight:bold;color:' + color + ';">' + esc(name) + '</div>' : '',
    (title || company) ? '<div style="font-size:13px;color:#666;margin-top:2px;">' + esc([title, company].filter(Boolean).join(' | ')) + '</div>' : '',
    phone ? '<div style="font-size:13px;color:#888;margin-top:2px;">📱 ' + esc(phone) + '</div>' : '',
    email ? '<div style="font-size:13px;color:#888;">✉️ <a href="mailto:' + esc(email) + '" style="color:#888;text-decoration:none;">' + esc(email) + '</a></div>' : '',
    web ? '<div style="font-size:13px;color:#888;">🌐 <a href="https://' + esc(web) + '" style="color:#888;text-decoration:none;">' + esc(web) + '</a></div>' : ''
  ].filter(Boolean).join('');

  let html = '';
  if (layout === 'classic') {
    html = '<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;">' +
      '<tr><td style="padding:16px 18px 16px 0;border-right:3px solid ' + color + ';">' + info + '</td></tr></table>';
  } else if (layout === 'modern') {
    html = '<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;">' +
      '<tr><td style="padding:16px;border:2px solid ' + color + ';border-left-width:6px;border-radius:8px;">' + info + '</td></tr></table>';
  } else {
    html = '<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;">' +
      '<tr><td style="padding:12px 0;">' + info + '</td></tr></table>';
  }
  return html;
}

function esPreview() {
  const preview = document.getElementById('es-preview');
  const code = esBuildHtml(false);
  preview.innerHTML = code || '<div style="color:#999;text-align:center;padding-top:40px;">输入左侧信息即可预览</div>';
  document.getElementById('es-code').value = esBuildHtml(true) || '<!-- 请填写姓名 -->';
}

function esCopyHtml() {
  const code = document.getElementById('es-code').value;
  if (!code || code.indexOf('姓名') !== -1 && code.indexOf('请填写') !== -1) {
    showToast('⚠️ 请先填写姓名');
    return;
  }
  navigator.clipboard.writeText(code).then(function() {
    showToast('✅ HTML签名代码已复制');
  }).catch(function() {
    document.getElementById('es-code').select();
    document.execCommand('copy');
    showToast('✅ 已复制');
  });
}

function esCopyText() {
  const name = document.getElementById('es-name').value.trim();
  const title = document.getElementById('es-title').value.trim();
  const company = document.getElementById('es-company').value.trim();
  const phone = document.getElementById('es-phone').value.trim();
  const email = document.getElementById('es-email').value.trim();
  const web = document.getElementById('es-web').value.trim();
  if (!name) { showToast('⚠️ 请先填写姓名'); return; }
  const lines = [name, [title, company].filter(Boolean).join(' | '), phone, email, web].filter(Boolean);
  const text = lines.join('\n');
  navigator.clipboard.writeText(text).then(function() {
    showToast('📝 纯文本签名已复制');
  }).catch(function() {
    showToast('❌ 复制失败，请手动选择');
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', esPreview);
} else {
  setTimeout(esPreview, 300);
}

// ============================================================
// 在线图表生成器 处理函数
// ============================================================
function cmResetData() {
  document.getElementById('cm-data').value = '一月,85\n二月,120\n三月,95\n四月,150\n五月,110\n六月,135';
  document.getElementById('cm-data2').value = '';
  document.getElementById('cm-title').value = '';
  document.getElementById('cm-canvas').style.display = 'none';
  document.getElementById('cm-placeholder').style.display = 'flex';
  document.getElementById('cm-download-btn').style.display = 'none';
  showToast('🔄 数据已重置');
}

function cmPreview() {
  // Live preview on type/color change
}

function cmGenerate() {
  const canvas = document.getElementById('cm-canvas');
  const ctx = canvas.getContext('2d');
  const type = document.getElementById('cm-type').value;
  const color = document.getElementById('cm-color').value;
  const bg = document.getElementById('cm-bg').value;
  const title = document.getElementById('cm-title').value.trim();
  const raw1 = document.getElementById('cm-data').value.trim();
  const raw2 = document.getElementById('cm-data2').value.trim();

  if (!raw1) { showToast('⚠️ 请输入数据'); return; }

  const lines1 = raw1.split('\n').filter(Boolean);
  const labels = [], values1 = [];
  for (const line of lines1) {
    const parts = line.split(',');
    if (parts.length >= 2) {
      labels.push(parts[0].trim());
      values1.push(parseFloat(parts[1]) || 0);
    }
  }
  if (labels.length === 0) { showToast('⚠️ 数据格式错误，请使用 标签,数值 格式'); return; }

  const values2 = [];
  if (raw2) {
    const lines2 = raw2.split('\n').filter(Boolean);
    for (let i = 0; i < labels.length && i < lines2.length; i++) {
      values2.push(parseFloat(lines2[i]) || 0);
    }
  }

  const has2 = values2.length > 0;
  const color2 = has2 ? '#ef4444' : null;

  // Set canvas size
  const rect = canvas.parentElement.getBoundingClientRect();
  const w = canvas.parentElement.clientWidth || 700;
  const h = canvas.parentElement.clientHeight || 440;
  canvas.width = w * 2;
  canvas.height = h * 2;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(2, 2);

  const pad = { top: 50, bottom: 50, left: 60, right: 40 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  // Background
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Title
  if (title) {
    ctx.fillStyle = '#333';
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, w / 2, 30);
  }

  // Find max value
  const allVals = [...values1, ...(has2 ? values2 : [])];
  const maxVal = Math.max(...allVals, 1) * 1.15;

  ctx.font = '12px Arial, sans-serif';
  ctx.textAlign = 'right';

  if (type === 'pie') {
    const cx = w / 2, cy = h / 2;
    const radius = Math.min(chartW, chartH) / 2 - 10;
    const total = values1.reduce((a, b) => a + b, 0);
    if (total === 0) { showToast('⚠️ 数据之和不能为0'); return; }

    let startAngle = -Math.PI / 2;
    const pieColors = ['#4f46e5', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

    for (let i = 0; i < values1.length; i++) {
      const sliceAngle = (values1[i] / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = pieColors[i % pieColors.length];
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      startAngle += sliceAngle;
    }

    // Legend
    let ly = pad.top + 10;
    ctx.textAlign = 'left';
    ctx.font = '11px Arial, sans-serif';
    for (let i = 0; i < labels.length; i++) {
      if (ly > h - 20) break;
      ctx.fillStyle = pieColors[i % pieColors.length];
      ctx.fillRect(w - 140, ly, 10, 10);
      ctx.fillStyle = '#555';
      const pct = ((values1[i] / total) * 100).toFixed(1);
      ctx.fillText(labels[i] + ' ' + pct + '%', w - 124, ly + 9);
      ly += 20;
    }
  } else if (type === 'radar') {
    const cx = w / 2, cy = (pad.top + h - pad.bottom) / 2;
    const r = Math.min(chartW, chartH) / 2 - 10;
    const n = labels.length;
    if (n < 3) { showToast('⚠️ 雷达图需要至少3个数据点'); return; }

    // Draw grid
    for (let ring = 1; ring <= 4; ring++) {
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const x = cx + (r * ring / 4) * Math.cos(angle);
        const y = cy + (r * ring / 4) * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Axis lines
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.stroke();
    }

    // Data series 1
    function drawRadar(vals, color, alpha) {
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const idx = i % n;
        const angle = (Math.PI * 2 * idx) / n - Math.PI / 2;
        const val = (vals[idx] || 0) / maxVal * r;
        const x = cx + val * Math.cos(angle);
        const y = cy + val * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = color.replace(')', ',' + alpha + ')').replace('rgb', 'rgba');
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    drawRadar(values1, color, '0.25');
    if (has2) drawRadar(values2, color2, '0.25');

    // Labels
    ctx.textAlign = 'center';
    ctx.font = '11px Arial, sans-serif';
    ctx.fillStyle = '#555';
    for (let i = 0; i < n; i++) {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const lx = cx + (r + 22) * Math.cos(angle);
      const ly = cy + (r + 22) * Math.sin(angle);
      ctx.fillText(labels[i], lx, ly + 4);
    }
  } else {
    // Bar, Line, BarH
    const isBar = type === 'bar';
    const isBarH = type === 'barh';
    const isLine = type === 'line';
    const n = labels.length;
    const step = chartW / (isBar ? n : Math.max(n - 1, 1));
    const barWidth = isBar ? Math.min(step * 0.5, 40) : 0;
    const halfBar = isBar ? barWidth / 2 : 0;

    // Y axis
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const y = pad.top + (chartH * (ySteps - i)) / ySteps;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
      ctx.fillStyle = '#999';
      ctx.textAlign = 'right';
      ctx.fillText((maxVal * i / ySteps).toFixed(maxVal < 10 ? 1 : 0), pad.left - 8, y + 4);
    }

    // X axis labels
    ctx.textAlign = 'center';
    ctx.fillStyle = '#666';
    ctx.font = '11px Arial, sans-serif';

    if (isBarH) {
      // Horizontal bar chart
      const barH = Math.min(chartH / n * 0.6, 30);
      for (let i = 0; i < n; i++) {
        const y = pad.top + (chartH * (i + 0.5)) / n;
        ctx.fillStyle = '#666';
        ctx.textAlign = 'right';
        ctx.fillText(labels[i], pad.left - 8, y + 4);
        const v1 = (values1[i] / maxVal) * chartW;
        ctx.fillStyle = color;
        ctx.fillRect(pad.left, y - barH / 2, v1, barH);
        if (has2) {
          const v2 = (values2[i] / maxVal) * chartW;
          ctx.fillStyle = color2;
          ctx.fillRect(pad.left + v1, y - barH / 2, v2 - v1, barH);
        }
      }
    } else if (isLine) {
      // Line chart
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const x = pad.left + (i * chartW) / Math.max(n - 1, 1);
        const y = pad.top + chartH - (values1[i] / maxVal) * chartH;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Fill area
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const x = pad.left + (i * chartW) / Math.max(n - 1, 1);
        const y = pad.top + chartH - (values1[i] / maxVal) * chartH;
        i === 0 ? ctx.moveTo(x, pad.top + chartH) : '';
        ctx.lineTo(x, y);
      }
      ctx.lineTo(pad.left + chartW, pad.top + chartH);
      ctx.closePath();
      ctx.fillStyle = color.replace(')', ',0.15)').replace('rgb', 'rgba');
      ctx.fill();

      if (has2) {
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const x = pad.left + (i * chartW) / Math.max(n - 1, 1);
          const y = pad.top + chartH - (values2[i] / maxVal) * chartH;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = color2;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Fill area 2
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const x = pad.left + (i * chartW) / Math.max(n - 1, 1);
          const y = pad.top + chartH - (values2[i] / maxVal) * chartH;
          i === 0 ? ctx.moveTo(x, pad.top + chartH) : '';
          ctx.lineTo(x, y);
        }
        ctx.lineTo(pad.left + chartW, pad.top + chartH);
        ctx.closePath();
        ctx.fillStyle = color2.replace(')', ',0.15)').replace('rgb', 'rgba');
        ctx.fill();
      }

      // Points
      for (let i = 0; i < n; i++) {
        const x = pad.left + (i * chartW) / Math.max(n - 1, 1);
        const y = pad.top + chartH - (values1[i] / maxVal) * chartH;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // X labels
      for (let i = 0; i < n; i++) {
        const x = pad.left + (i * chartW) / Math.max(n - 1, 1);
        ctx.fillText(labels[i], x, h - pad.bottom + 18);
      }
    } else {
      // Bar chart (vertical)
      for (let i = 0; i < n; i++) {
        const x = pad.left + step * i + (step - barWidth) / 2;
        const barH_val = (values1[i] / maxVal) * chartH;
        ctx.fillStyle = color;
        ctx.fillRect(x, pad.top + chartH - barH_val, barWidth, barH_val);
        if (has2) {
          const barH2 = (values2[i] / maxVal) * chartH;
          ctx.fillStyle = color2;
          ctx.fillRect(x + barWidth + 2, pad.top + chartH - barH2, barWidth, barH2);
        }
        ctx.fillText(labels[i], x + barWidth / 2, h - pad.bottom + 18);
      }
    }
  }

  // Legend for multi-series
  if (has2 && type !== 'pie' && type !== 'radar') {
    const lx = w - 160, ly = 10;
    ctx.fillStyle = color;
    ctx.fillRect(lx, ly, 14, 14);
    ctx.fillStyle = '#333';
    ctx.textAlign = 'left';
    ctx.font = '11px Arial, sans-serif';
    ctx.fillText('系列1', lx + 18, ly + 11);
    ctx.fillStyle = color2;
    ctx.fillRect(lx + 70, ly, 14, 14);
    ctx.fillStyle = '#333';
    ctx.fillText('系列2', lx + 88, ly + 11);
  }

  canvas.style.display = 'block';
  document.getElementById('cm-placeholder').style.display = 'none';
  document.getElementById('cm-download-btn').style.display = 'inline-block';
  showToast('✅ 图表生成完成');
}

function cmDownload() {
  const canvas = document.getElementById('cm-canvas');
  const a = document.createElement('a');
  a.download = 'chart-' + Date.now() + '.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
  showToast('✅ PNG已下载');
}

// ============================================================
// 截图美化/设备样机 处理函数
// ============================================================
var mmImage = null;

function mmReset() {
  mmImage = null;
  document.getElementById('mm-file').value = '';
  document.getElementById('mm-canvas').style.display = 'none';
  document.getElementById('mm-placeholder').style.display = 'flex';
  document.getElementById('mm-download-btn').style.display = 'none';
}

function mmGenerate() {
  const fileInput = document.getElementById('mm-file');
  if (!fileInput.files || !fileInput.files[0]) {
    showToast('⚠️ 请先上传一张截图');
    return;
  }
  if (!mmImage) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        mmImage = img;
        mmRender();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(fileInput.files[0]);
    return;
  }
  mmRender();
}

function mmRender() {
  if (!mmImage) return;
  const device = document.getElementById('mm-device').value;
  const bgColor = document.getElementById('mm-bg').value;
  const shadow = document.getElementById('mm-shadow').value;

  const img = mmImage;
  const canvas = document.getElementById('mm-canvas');
  const ctx = canvas.getContext('2d');

  // Target image display size
  const maxContentW = 600, maxContentH = 420;
  let contentW = img.width, contentH = img.height;
  const scale = Math.min(maxContentW / contentW, maxContentH / contentH, 1);
  contentW = Math.round(contentW * scale);
  contentH = Math.round(contentH * scale);

  // Device frame margins
  let frameW, frameH, bezelSize, topBar, bottomBar, borderRadius;
  if (device === 'iphone') {
    bezelSize = 16; topBar = 44; bottomBar = 36;
    borderRadius = 28;
    frameW = contentW + bezelSize * 2;
    frameH = contentH + topBar + bottomBar + bezelSize * 2;
  } else if (device === 'android') {
    bezelSize = 14; topBar = 40; bottomBar = 32;
    borderRadius = 20;
    frameW = contentW + bezelSize * 2;
    frameH = contentH + topBar + bottomBar + bezelSize * 2;
  } else if (device === 'ipad') {
    bezelSize = 20; topBar = 0; bottomBar = 0;
    borderRadius = 16;
    frameW = contentW + bezelSize * 2;
    frameH = contentH + bezelSize * 2;
  } else if (device === 'browser') {
    topBar = 40; bottomBar = 0;
    borderRadius = 8;
    frameW = contentW + 2;
    frameH = contentH + topBar + 2;
    bezelSize = 0;
  } else { // laptop
    topBar = 0; bottomBar = 0;
    borderRadius = 0;
    frameW = contentW + 20;
    frameH = contentH + 20;
    bezelSize = 10;
  }

  // Canvas size with padding
  const pad = 40;
  const totalW = frameW + pad * 2;
  const totalH = frameH + pad * 2;

  canvas.width = totalW * 2;
  canvas.height = totalH * 2;
  canvas.style.width = totalW + 'px';
  canvas.style.height = totalH + 'px';
  ctx.scale(2, 2);

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, totalW, totalH);

  // Shadow
  if (shadow !== 'none') {
    ctx.shadowColor = 'rgba(0,0,0,' + (shadow === 'hard' ? '0.3' : '0.15') + ')';
    ctx.shadowBlur = shadow === 'hard' ? 30 : 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = shadow === 'hard' ? 8 : 4;
  }

  // Frame
  const fx = pad, fy = pad;
  ctx.fillStyle = '#1a1a1a';
  mmRoundRect(ctx, fx, fy, frameW, frameH, borderRadius);
  ctx.fill();

  // Reset shadow for content
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  if (device === 'iphone' || device === 'android') {
    // Top bar (notch area)
    ctx.fillStyle = '#1a1a1a';
    const notchW = 80, notchH = 24;
    const notchX = fx + (frameW - notchW) / 2;
    const notchY = fy + 12;
    ctx.beginPath();
    mmRoundRect(ctx, notchX, notchY, notchW, notchH, 12);
    ctx.fillStyle = '#0a0a0a';
    ctx.fill();

    // Camera dot
    ctx.beginPath();
    ctx.arc(notchX + notchW / 2, notchY + notchH / 2, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(notchX + notchW / 2, notchY + notchH / 2, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#2a2a4e';
    ctx.fill();

    // Status bar
    ctx.fillStyle = '#fff';
    ctx.font = '10px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('9:41', fx + 20, fy + 10);
    ctx.textAlign = 'right';
    ctx.fillText('📶 🔋', fx + frameW - 20, fy + 10);
  } else if (device === 'browser') {
    // Browser top bar
    ctx.fillStyle = '#e8e8e8';
    ctx.fillRect(fx, fy, frameW, topBar);
    // Traffic light dots
    const dotR = 5;
    ctx.beginPath(); ctx.arc(fx + 16, fy + 20, dotR, 0, Math.PI * 2); ctx.fillStyle = '#ff5f57'; ctx.fill();
    ctx.beginPath(); ctx.arc(fx + 34, fy + 20, dotR, 0, Math.PI * 2); ctx.fillStyle = '#febc2e'; ctx.fill();
    ctx.beginPath(); ctx.arc(fx + 52, fy + 20, dotR, 0, Math.PI * 2); ctx.fillStyle = '#28c840'; ctx.fill();
    // URL bar
    ctx.fillStyle = '#fff';
    mmRoundRect(ctx, fx + 66, fy + 12, frameW - 82, 18, 4);
    ctx.fill();
    ctx.fillStyle = '#bbb';
    ctx.font = '9px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('https://toolai.ccwu.cc', fx + frameW / 2 + 8, fy + 24);
  } else if (device === 'laptop') {
    // Laptop base
    ctx.fillStyle = '#2a2a2a';
    const baseY = fy + frameH;
    ctx.beginPath();
    ctx.moveTo(fx + 30, baseY);
    ctx.lineTo(fx + frameW - 30, baseY);
    ctx.lineTo(fx + frameW - 10, baseY + 12);
    ctx.lineTo(fx + 10, baseY + 12);
    ctx.closePath();
    ctx.fill();
    // Keyboard hint
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(fx + frameW / 2 - 30, baseY + 2, 60, 4);
  }

  // Content area
  let cx, cy, cw, ch;
  if (device === 'iphone' || device === 'android') {
    cx = fx + bezelSize;
    cy = fy + bezelSize + topBar;
    cw = contentW;
    ch = contentH;
  } else if (device === 'ipad') {
    cx = fx + bezelSize;
    cy = fy + bezelSize;
    cw = contentW;
    ch = contentH;
  } else if (device === 'browser') {
    cx = fx + 1;
    cy = fy + topBar + 1;
    cw = contentW;
    ch = contentH;
  } else { // laptop
    cx = fx + 10;
    cy = fy + 10;
    cw = contentW;
    ch = contentH;
  }

  // Clip content to frame
  ctx.save();
  ctx.beginPath();
  ctx.rect(cx, cy, cw, ch);
  ctx.clip();

  // Draw the screenshot
  ctx.drawImage(img, cx, cy, cw, ch);
  ctx.restore();

  canvas.style.display = 'block';
  document.getElementById('mm-placeholder').style.display = 'none';
  document.getElementById('mm-download-btn').style.display = 'inline-block';
  showToast('✅ 样机生成完成');
}

function mmRoundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function mmDownload() {
  const canvas = document.getElementById('mm-canvas');
  const a = document.createElement('a');
  a.download = 'mockup-' + Date.now() + '.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
  showToast('✅ PNG已下载');
}
// ============================================================
// 证件照制作工具 处理函数
// ============================================================
var idpImg = null;
var IDP_TYPES = {
  '1inch':   { name: '一寸',   w: 295, h: 413, mm: '25×35mm' },
  '2inch':   { name: '二寸',   w: 413, h: 579, mm: '35×49mm' },
  'small1':  { name: '小一寸', w: 260, h: 378, mm: '22×32mm' },
  'small2':  { name: '小二寸', w: 413, h: 531, mm: '35×45mm' },
  'passport':{ name: '护照',   w: 390, h: 567, mm: '33×48mm' }
};

function idpInit() {
  var f = document.getElementById('idp-file');
  if (!f) return;
  f.addEventListener('change', idpLoad, false);
  idpRender();
}

function idpLoad() {
  var file = document.getElementById('idp-file').files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      idpImg = img;
      // 自动检测四角背景色
      var c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      var ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      try {
        var d = ctx.getImageData(0, 0, img.width, img.height).data;
        var corners = [[5,5],[img.width-6,5],[5,img.height-6],[img.width-6,img.height-6]];
        var r=0,g=0,b=0;
        corners.forEach(function(p){
          var i = (p[1]*img.width + p[0]) * 4;
          r+=d[i]; g+=d[i+1]; b+=d[i+2];
        });
        var avg = [Math.round(r/4), Math.round(g/4), Math.round(b/4)];
        var hex = '#' + avg.map(function(v){ return ('0'+v.toString(16)).slice(-2); }).join('');
        document.getElementById('idp-srcbg').value = hex;
      } catch(e2) {}
      idpRender();
      showToast('✅ 照片已加载，自动检测背景色');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function idpHexToRgb(hex) {
  hex = (hex || '#ffffff').replace('#','');
  if (hex.length === 3) hex = hex.split('').map(function(c){return c+c;}).join('');
  return [parseInt(hex.substr(0,2),16), parseInt(hex.substr(2,2),16), parseInt(hex.substr(4,2),16)];
}

function idpRemoveBg(data, w, h, src, tgt, tol) {
  var tol2 = tol * tol;
  var edge = tol * 1.9;
  var edge2 = edge * edge;
  for (var i = 0; i < data.length; i += 4) {
    var dr = data[i]-src[0], dg = data[i+1]-src[1], db = data[i+2]-src[2];
    var d2 = dr*dr + dg*dg + db*db;
    if (d2 < tol2) {
      data[i]=tgt[0]; data[i+1]=tgt[1]; data[i+2]=tgt[2];
    } else if (d2 < edge2) {
      var k = (Math.sqrt(d2) - tol) / (edge - tol);
      data[i]   = Math.round(tgt[0]*(1-k) + data[i]*k);
      data[i+1] = Math.round(tgt[1]*(1-k) + data[i+1]*k);
      data[i+2] = Math.round(tgt[2]*(1-k) + data[i+2]*k);
    }
  }
}

function idpDrawCover(ctx, img, tx, ty, tw, th) {
  var ir = img.width / img.height;
  var tr = tw / th;
  var sw, sh, sx, sy;
  if (ir > tr) { sh = img.height; sw = Math.round(img.height * tr); sx = Math.round((img.width - sw)/2); sy = 0; }
  else { sw = img.width; sh = Math.round(img.width / tr); sy = Math.round((img.height - sh)/2); sx = 0; }
  ctx.drawImage(img, sx, sy, sw, sh, tx, ty, tw, th);
}

function idpRender() {
  var canvas = document.getElementById('idp-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var type = IDP_TYPES[document.getElementById('idp-type').value] || IDP_TYPES['1inch'];
  var target = document.getElementById('idp-bg').value;
  var tol = parseInt(document.getElementById('idp-tolerance').value, 10) || 60;
  var srcHex = document.getElementById('idp-srcbg').value;
  var pw = 300, ph = Math.round(pw * type.h / type.w);
  canvas.width = pw; canvas.height = ph;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, pw, ph);
  if (!idpImg) {
    ctx.fillStyle = '#9ca3af'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('上传照片后自动生成', pw/2, ph/2);
    return;
  }
  idpDrawCover(ctx, idpImg, 0, 0, pw, ph);
  var imgData = ctx.getImageData(0, 0, pw, ph);
  idpRemoveBg(imgData.data, pw, ph, idpHexToRgb(srcHex), idpHexToRgb(target), tol);
  ctx.putImageData(imgData, 0, 0);
  idpRenderSheet(type, tol, srcHex, target);
}

function idpTol() {
  var t = document.getElementById('idp-tolerance');
  document.getElementById('idp-tol-val').textContent = t.value;
  idpRender();
}

function idpBuildPhoto(type, tol, srcHex, target) {
  var c = document.createElement('canvas');
  c.width = type.w; c.height = type.h;
  var ctx = c.getContext('2d');
  ctx.fillStyle = target;
  ctx.fillRect(0, 0, type.w, type.h);
  if (idpImg) {
    idpDrawCover(ctx, idpImg, 0, 0, type.w, type.h);
    var imgData = ctx.getImageData(0, 0, type.w, type.h);
    idpRemoveBg(imgData.data, type.w, type.h, idpHexToRgb(srcHex), idpHexToRgb(target), tol);
    ctx.putImageData(imgData, 0, 0);
  }
  return c;
}

function idpRenderSheet(type, tol, srcHex, target) {
  var sheet = document.getElementById('idp-sheet-canvas');
  if (!sheet) return;
  var ctx = sheet.getContext('2d');
  var W = 1800, H = 1200; // 6寸 300DPI
  sheet.width = W; sheet.height = H;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  if (!idpImg) {
    ctx.fillStyle = '#c0c0c0'; ctx.font = '24px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('上传照片后显示排版', W/2, H/2);
    return;
  }
  var photo = idpBuildPhoto(type, tol, srcHex, target);
  var cols, rows;
  if (type.w <= 300) { cols = 4; rows = 2; }      // 一寸/小一寸 → 8张
  else if (type.w <= 400) { cols = 2; rows = 2; } // 小二寸 → 4张
  else { cols = 2; rows = 2; }                     // 二寸 → 4张
  var gapX = (W - cols * type.w) / (cols + 1);
  var gapY = (H - rows * type.h) / (rows + 1);
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      var x = gapX + c * (type.w + gapX);
      var y = gapY + r * (type.h + gapY);
      ctx.drawImage(photo, x, y, type.w, type.h);
    }
  }
}

function idpDownload() {
  var type = IDP_TYPES[document.getElementById('idp-type').value] || IDP_TYPES['1inch'];
  var target = document.getElementById('idp-bg').value;
  var tol = parseInt(document.getElementById('idp-tolerance').value, 10) || 60;
  var srcHex = document.getElementById('idp-srcbg').value;
  var c = idpBuildPhoto(type, tol, srcHex, target);
  var a = document.createElement('a');
  a.download = '证件照-' + type.name + '-' + type.mm + '.png';
  a.href = c.toDataURL('image/png');
  a.click();
  showToast('✅ 证件照已下载');
}

function idpDownloadSheet() {
  var type = IDP_TYPES[document.getElementById('idp-type').value] || IDP_TYPES['1inch'];
  var target = document.getElementById('idp-bg').value;
  var tol = parseInt(document.getElementById('idp-tolerance').value, 10) || 60;
  var srcHex = document.getElementById('idp-srcbg').value;
  var c = document.createElement('canvas');
  c.width = 1800; c.height = 1200;
  var ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1800, 1200);
  var photo = idpBuildPhoto(type, tol, srcHex, target);
  var cols = type.w <= 300 ? 4 : 2;
  var rows = 2;
  var gapX = (1800 - cols * type.w) / (cols + 1);
  var gapY = (1200 - rows * type.h) / (rows + 1);
  for (var r = 0; r < rows; r++) {
    for (var cc = 0; cc < cols; cc++) {
      var x = gapX + cc * (type.w + gapX);
      var y = gapY + r * (type.h + gapY);
      ctx.drawImage(photo, x, y, type.w, type.h);
    }
  }
  var a = document.createElement('a');
  a.download = '证件照6寸排版-' + type.name + '.png';
  a.href = c.toDataURL('image/png');
  a.click();
  showToast('✅ 6寸排版已下载，可去冲印');
}

// ============================================================
// 在线Logo制作工具 处理函数
// ============================================================
var LG_COLORS = [
  { name:'科技蓝', c1:'#4f46e5', c2:'#7c3aed', text:'#1e1b4b' },
  { name:'活力橙', c1:'#f97316', c2:'#ef4444', text:'#7c2d12' },
  { name:'翡翠绿', c1:'#10b981', c2:'#059669', text:'#064e3b' },
  { name:'玫瑰红', c1:'#ec4899', c2:'#db2777', text:'#831843' },
  { name:'土豪金', c1:'#f59e0b', c2:'#d97706', text:'#78350f' },
  { name:'海洋青', c1:'#06b6d4', c2:'#3b82f6', text:'#172554' },
  { name:'紫罗兰', c1:'#8b5cf6', c2:'#6366f1', text:'#312e81' },
  { name:'森林绿', c1:'#22c55e', c2:'#16a34a', text:'#14532d' },
  { name:'酷黑金', c1:'#111827', c2:'#374151', text:'#f59e0b' },
  { name:'珊瑚粉', c1:'#fb7185', c2:'#f43f5e', text:'#881337' }
];
var lgCanvas, lgCtx, lgShowBg = false;

function lgInit() {
  lgCanvas = document.getElementById('lg-canvas');
  if (!lgCanvas) return;
  lgCtx = lgCanvas.getContext('2d');
  lgRender();
}

function lgState() {
  return {
    name: document.getElementById('lg-name').value || '星火科技',
    slogan: document.getElementById('lg-slogan').value || '',
    icon: document.getElementById('lg-icon').value || '🚀',
    color: LG_COLORS[parseInt(document.getElementById('lg-color').value,10) || 0],
    layout: document.getElementById('lg-layout').value || 'horizontal',
    font: document.getElementById('lg-font').value || "'PingFang SC','Microsoft YaHei',sans-serif"
  };
}

function lgRender() {
  if (!lgCanvas) return;
  var s = lgState();
  var W = 1200, H = 600;
  lgCanvas.width = W; lgCanvas.height = H;
  var ctx = lgCtx;
  ctx.clearRect(0, 0, W, H);
  if (lgShowBg) { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H); }

  var grad = ctx.createLinearGradient(100, 0, W-100, 0);
  grad.addColorStop(0, s.color.c1);
  grad.addColorStop(1, s.color.c2);

  ctx.textBaseline = 'middle';

  if (s.layout === 'vertical') {
    // 图标上、文字下
    ctx.font = '220px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.icon, W/2, 200);
    ctx.fillStyle = grad;
    ctx.font = 'bold 110px ' + s.font;
    ctx.fillText(s.name, W/2, 420);
    if (s.slogan) {
      ctx.fillStyle = s.color.text;
      ctx.font = '34px ' + s.font;
      ctx.fillText(s.slogan, W/2, 500);
    }
  } else if (s.layout === 'badge') {
    // 圆角徽章
    var bw = 560, bh = 560, bx = (W-bw)/2, by = (H-bh)/2;
    ctx.beginPath();
    ctx.moveTo(bx+40, by);
    ctx.arcTo(bx+bw, by, bx+bw, by+bh, 40);
    ctx.arcTo(bx+bw, by+bh, bx, by+bh, 40);
    ctx.arcTo(bx, by+bh, bx, by, 40);
    ctx.arcTo(bx, by, bx+bw, by, 40);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.font = '150px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.icon, W/2, by+bh/2+30);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px ' + s.font;
    ctx.fillText(s.name, W/2, by+bh/2+150);
    if (s.slogan) {
      ctx.font = '26px ' + s.font;
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fillText(s.slogan, W/2, by+bh/2+205);
    }
  } else {
    // 横排：图标左、文字右
    ctx.font = '220px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.icon, 220, H/2 + 10);
    ctx.fillStyle = grad;
    ctx.font = 'bold 120px ' + s.font;
    ctx.textAlign = 'left';
    ctx.fillText(s.name, 460, H/2 - (s.slogan ? 40 : 0));
    if (s.slogan) {
      ctx.fillStyle = s.color.text;
      ctx.font = '38px ' + s.font;
      ctx.fillText(s.slogan, 470, H/2 + 70);
    }
  }
}

function lgCopyBg() {
  lgShowBg = !lgShowBg;
  lgRender();
  showToast(lgShowBg ? '白底预览' : '透明网格预览');
}

function lgDownload(fmt) {
  var s = lgState();
  if (fmt === 'svg') {
    var svg = lgBuildSvg(s);
    var blob = new Blob([svg], {type: 'image/svg+xml;charset=utf-8'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'logo-' + s.name + '.svg';
    a.click();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
    showToast('✅ SVG已下载');
  } else {
    lgRender();
    var a = document.createElement('a');
    a.download = 'logo-' + s.name + '.png';
    a.href = lgCanvas.toDataURL('image/png');
    a.click();
    showToast('✅ PNG已下载');
  }
}

function lgBuildSvg(s) {
  var W = 1200, H = 600;
  var font = s.font.replace(/'/g, '').split(',')[0];
  var parts = [];
  parts.push('<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">');
  parts.push('<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + s.color.c1 + '"/><stop offset="1" stop-color="' + s.color.c2 + '"/></linearGradient></defs>');
  if (s.layout === 'vertical') {
    parts.push('<text x="600" y="200" font-size="220" text-anchor="middle">' + s.icon + '</text>');
    parts.push('<text x="600" y="420" font-size="110" font-weight="bold" fill="url(#g)" font-family="' + font + '" text-anchor="middle">' + s.name + '</text>');
    if (s.slogan) parts.push('<text x="600" y="500" font-size="34" fill="' + s.color.text + '" font-family="' + font + '" text-anchor="middle">' + s.slogan + '</text>');
  } else if (s.layout === 'badge') {
    parts.push('<rect x="320" y="20" width="560" height="560" rx="40" fill="url(#g)"/>');
    parts.push('<text x="600" y="330" font-size="150" text-anchor="middle">' + s.icon + '</text>');
    parts.push('<text x="600" y="450" font-size="44" font-weight="bold" fill="#ffffff" font-family="' + font + '" text-anchor="middle">' + s.name + '</text>');
    if (s.slogan) parts.push('<text x="600" y="505" font-size="26" fill="rgba(255,255,255,0.85)" font-family="' + font + '" text-anchor="middle">' + s.slogan + '</text>');
  } else {
    parts.push('<text x="220" y="310" font-size="220" text-anchor="middle">' + s.icon + '</text>');
    parts.push('<text x="460" y="' + (s.slogan ? 260 : 310) + '" font-size="120" font-weight="bold" fill="url(#g)" font-family="' + font + '">' + s.name + '</text>');
    if (s.slogan) parts.push('<text x="470" y="370" font-size="38" fill="' + s.color.text + '" font-family="' + font + '">' + s.slogan + '</text>');
  }
  parts.push('</svg>');
  return parts.join('\n');
}

// ============================================================
// 图片高清放大 处理函数 (替代 Bigjpg / AI图片超分 付费工具)
// ============================================================
var iuOrigImg = null;
var iuCanvas = null;
var iuCtx = null;

function iuInit() {
  iuCanvas = document.createElement('canvas');
  iuCtx = iuCanvas.getContext('2d');
}

function iuLoadFile(input) {
  var f = input.files && input.files[0];
  if (!f) return;
  var img = new Image();
  img.onload = function() {
    iuOrigImg = img;
    document.getElementById('iu-orig').src = img.src;
    document.getElementById('iu-download').disabled = false;
    document.getElementById('iu-info').textContent = '原图 ' + img.naturalWidth + ' x ' + img.naturalHeight + ' px';
    iuRender();
  };
  img.onerror = function() { showToast('❌ 图片加载失败'); };
  img.src = URL.createObjectURL(f);
}

function iuRender() {
  if (!iuOrigImg) return;
  var scale = parseInt(document.getElementById('iu-scale').value, 10);
  var sharpen = parseInt(document.getElementById('iu-sharpen').value, 10);
  var w = iuOrigImg.naturalWidth, h = iuOrigImg.naturalHeight;
  var nw = w * scale, nh = h * scale;
  if (nw * nh > 26000000) {
    document.getElementById('iu-info').textContent = '⚠️ 放大后像素过大，请减小倍数';
    iuCtx.clearRect(0, 0, iuCanvas.width, iuCanvas.height);
    document.getElementById('iu-result').src = '';
    return;
  }
  iuCanvas.width = nw;
  iuCanvas.height = nh;
  iuCtx.imageSmoothingEnabled = true;
  iuCtx.imageSmoothingQuality = 'high';
  iuCtx.drawImage(iuOrigImg, 0, 0, nw, nh);
  if (sharpen > 0) {
    var imgData = iuCtx.getImageData(0, 0, nw, nh);
    iuSharpen(imgData, nw, nh, sharpen * 0.5);
    iuCtx.putImageData(imgData, 0, 0);
  }
  document.getElementById('iu-result').src = iuCanvas.toDataURL('image/png');
  document.getElementById('iu-info').textContent = '✅ 放大完成: ' + nw + ' x ' + nh + ' px（' + scale + 'x）';
}

function iuSharpen(imgData, w, h, a) {
  var src = new Uint8ClampedArray(imgData.data);
  var d = imgData.data;
  var i, c, val, yy, xx, nx, ny;
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      i = (y * w + x) * 4;
      for (c = 0; c < 3; c++) {
        ny = y - 1 < 0 ? 0 : y - 1; yy = y + 1 >= h ? h - 1 : y + 1;
        nx = x - 1 < 0 ? 0 : x - 1; xx = x + 1 >= w ? w - 1 : x + 1;
        val = src[i + c] * (1 + 4 * a)
          - a * src[(ny * w + x) * 4 + c]
          - a * src[(yy * w + x) * 4 + c]
          - a * src[(y * w + nx) * 4 + c]
          - a * src[(y * w + xx) * 4 + c];
        d[i + c] = val < 0 ? 0 : (val > 255 ? 255 : val);
      }
    }
  }
}

function iuDownload() {
  if (!iuOrigImg || !iuCanvas) return;
  var a = document.createElement('a');
  a.download = '高清放大-' + iuCanvas.width + 'x' + iuCanvas.height + '.png';
  a.href = iuCanvas.toDataURL('image/png');
  a.click();
  showToast('✅ 高清图已下载');
}

// ============================================================
// 音频变速变调 处理函数 (替代付费音频变速器)
// ============================================================
var ascAudioCtx = null;
var ascBuffer = null;
var ascSource = null;
var ascIsPlaying = false;

function ascInit() {
  if (!ascAudioCtx) {
    ascAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function ascLoadFile(input) {
  var f = input.files && input.files[0];
  if (!f) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    if (!ascAudioCtx) ascInit();
    ascAudioCtx.decodeAudioData(e.target.result, function(buf) {
      ascBuffer = buf;
      document.getElementById('asc-play').disabled = false;
      document.getElementById('asc-download').disabled = false;
      var mins = Math.floor(buf.duration / 60), secs = Math.round(buf.duration % 60);
      document.getElementById('asc-info').textContent = '🎵 音频 ' + mins + '分' + secs + '秒，' + (buf.numberOfChannels || 1) + '声道，采样率 ' + buf.sampleRate + 'Hz';
    }, function() { showToast('❌ 无法解码该音频'); });
  };
  reader.readAsArrayBuffer(f);
}

function ascUpdateLabel() {
  var s = parseFloat(document.getElementById('asc-speed').value);
  var p = parseInt(document.getElementById('asc-pitch').value, 10);
  document.getElementById('asc-speed-val').textContent = s.toFixed(2) + 'x';
  document.getElementById('asc-pitch-val').textContent = (p > 0 ? '+' : '') + p + ' 半音';
}

function ascApplyPreset() {
  var v = document.getElementById('asc-preset').value;
  if (!v) return;
  var parts = v.split(',');
  document.getElementById('asc-speed').value = parts[0];
  document.getElementById('asc-pitch').value = parts[1];
  ascUpdateLabel();
  if (ascIsPlaying) { ascStop(); ascTogglePlay(); }
}

function ascTogglePlay() {
  if (ascIsPlaying) { ascStop(); return; }
  if (!ascBuffer || !ascAudioCtx) return;
  var speed = parseFloat(document.getElementById('asc-speed').value);
  var pitch = parseInt(document.getElementById('asc-pitch').value, 10);
  ascSource = ascAudioCtx.createBufferSource();
  ascSource.buffer = ascBuffer;
  ascSource.playbackRate.value = speed;
  ascSource.detune.value = pitch * 100;
  try { ascSource.preservePitch = true; } catch (e) {}
  ascSource.connect(ascAudioCtx.destination);
  ascSource.start();
  ascSource.onended = function() {
    ascIsPlaying = false;
    document.getElementById('asc-play').textContent = '▶️ 试听';
  };
  ascIsPlaying = true;
  document.getElementById('asc-play').textContent = '⏸️ 停止';
}

function ascStop() {
  if (ascSource) {
    try { ascSource.stop(); } catch (e) {}
    ascSource.disconnect();
    ascSource = null;
  }
  ascIsPlaying = false;
  document.getElementById('asc-play').textContent = '▶️ 试听';
}

function ascDownload() {
  if (!ascBuffer) return;
  var speed = parseFloat(document.getElementById('asc-speed').value);
  var pitch = parseInt(document.getElementById('asc-pitch').value, 10);
  var channels = ascBuffer.numberOfChannels || 2;
  var rate = ascBuffer.sampleRate;
  var dur = Math.ceil(ascBuffer.duration / speed * rate);
  if (dur < 1) dur = 1;
  var offline = new OfflineAudioContext(channels, dur, rate);
  var src = offline.createBufferSource();
  src.buffer = ascBuffer;
  src.playbackRate.value = speed;
  src.detune.value = pitch * 100;
  try { src.preservePitch = true; } catch (e) {}
  src.connect(offline.destination);
  src.start(0);
  offline.startRendering().then(function(rendered) {
    var wav = ascBufferToWav(rendered);
    var blob = new Blob([wav], { type: 'audio/wav' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '变速' + speed + 'x-变调' + (pitch > 0 ? '+' : '') + pitch + '.wav';
    a.click();
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 2000);
    showToast('✅ 处理完成，WAV 已下载');
  }).catch(function() { showToast('❌ 渲染失败，请缩短音频'); });
}

function ascBufferToWav(buffer) {
  var numCh = buffer.numberOfChannels;
  var sampleRate = buffer.sampleRate;
  var len = buffer.length * numCh * 2;
  var arrayBuffer = new ArrayBuffer(44 + len);
  var view = new DataView(arrayBuffer);
  ascWriteString(view, 0, 'RIFF');
  view.setUint32(4, 36 + len, true);
  ascWriteString(view, 8, 'WAVE');
  ascWriteString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numCh, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numCh * 2, true);
  view.setUint16(32, numCh * 2, true);
  view.setUint16(34, 16, true);
  ascWriteString(view, 36, 'data');
  view.setUint32(40, len, true);
  var offset = 44;
  for (var i = 0; i < buffer.length; i++) {
    for (var ch = 0; ch < numCh; ch++) {
      var s = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      offset += 2;
    }
  }
  return arrayBuffer;
}

function ascWriteString(view, offset, str) {
  for (var i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}// ============================================================
// 代码图片生成 处理函数 (替代 Carbon)
// ============================================================
var csCanvas = null;
var csCtx = null;

var CS_THEMES = {
  dark:    { bg: '#282c34', fg: '#abb2bf', bar: '#21252b', title: '#9da5b4', kw: '#c678dd', str: '#98c379', num: '#d19a66', com: '#5c6370', fn: '#61afef', var: '#e06c75' },
  light:   { bg: '#ffffff', fg: '#24292e', bar: '#f6f8fa', title: '#6a737d', kw: '#d73a49', str: '#032f62', num: '#005cc5', com: '#6a737d', fn: '#6f42c1', var: '#e36209' },
  dracula: { bg: '#282a36', fg: '#f8f8f2', bar: '#21222c', title: '#6272a4', kw: '#ff79c6', str: '#f1fa8c', num: '#bd93f9', com: '#6272a4', fn: '#50fa7b', var: '#8be9fd' },
  nord:    { bg: '#2e3440', fg: '#d8dee9', bar: '#3b4252', title: '#88c0d0', kw: '#81a1c1', str: '#a3be8c', num: '#b48ead', com: '#616e88', fn: '#88c0d0', var: '#ebcb8b' }
};

var CS_EXAMPLES = [
  ['js', 'function debounce(fn, delay = 300) {\n  let timer = null;\n  return function (...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      fn.apply(this, args);\n    }, delay);\n  };\n}'],
  ['python', 'def fibonacci(n):\n    """返回前n个斐波那契数"""\n    a, b = 0, 1\n    result = []\n    for _ in range(n):\n        result.append(a)\n        a, b = b, a + b\n    return result\n\nprint(fibonacci(10))'],
  ['html', '<div class="card">\n  <h2>工具箱</h2>\n  <p>免费在线实用工具集</p>\n  <button onclick="start()">开始使用</button>\n</div>'],
  ['css', '.card {\n  border-radius: 12px;\n  box-shadow: 0 4px 20px rgba(0,0,0,.1);\n  transition: transform .2s ease;\n}\n\n.card:hover {\n  transform: translateY(-4px);\n}'],
  ['bash', '#!/bin/bash\n# 一键部署脚本\necho "🚀 开始部署..."\ncd /var/www/toolbox\nnpm install && npm run build\npm2 restart toolbox\necho "✅ 部署完成！"'],
  ['json', '{\n  "name": "ToolBox",\n  "version": "1.0.0",\n  "features": [\n    "tools",\n    "guides",\n    "news"\n  ],\n  "free": true\n}']
];

function csInit() {
  csCanvas = document.getElementById('cs-canvas');
  if (csCanvas) {
    csCtx = csCanvas.getContext('2d');
    csRender();
  }
}

function csRandExample() {
  var pick = CS_EXAMPLES[Math.floor(Math.random() * CS_EXAMPLES.length)];
  document.getElementById('cs-lang').value = pick[0];
  document.getElementById('cs-code').value = pick[1];
  csRender();
}

function csTokenize(code, lang) {
  var tokens = [];
  var i = 0;
  var n = code.length;
  var lineStart = 0;
  var buf = '';
  function flush(type) {
    if (buf) {
      tokens.push({ text: buf, type: type, line: lineStart });
      buf = '';
    }
  }
  while (i < n) {
    var ch = code[i];
    if (ch === '\n') { flush('plain'); lineStart++; i++; continue; }
    if (ch === '/' && code[i+1] === '/') {
      flush('plain');
      while (i < n && code[i] !== '\n') { buf += code[i]; i++; }
      flush('comment');
      continue;
    }
    if (ch === '#' && (lang === 'python' || lang === 'bash')) {
      flush('plain');
      while (i < n && code[i] !== '\n') { buf += code[i]; i++; }
      flush('comment');
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      flush('plain');
      var q = ch;
      buf += ch; i++;
      while (i < n && code[i] !== q) { if (code[i] === '\\' && i + 1 < n) { buf += code[i] + code[i+1]; i += 2; } else { buf += code[i]; i++; } }
      if (i < n) { buf += code[i]; i++; }
      flush('string');
      continue;
    }
    if (/[0-9]/.test(ch) && (i === 0 || /[^A-Za-z_]/.test(code[i-1]))) {
      flush('plain');
      while (i < n && /[0-9.]/.test(code[i])) { buf += code[i]; i++; }
      flush('number');
      continue;
    }
    buf += ch; i++;
  }
  flush('plain');
  return tokens;
}

function csKeywords() {
  return /function|const|let|var|return|if|else|for|while|class|new|import|export|def|print|async|await|try|catch|throw|typeof|this|true|false|null|undefined|echo|npm|pm2|cd|&&/;
}

function csClassify(tok) {
  if (tok.type === 'comment' || tok.type === 'string' || tok.type === 'number') return tok.type;
  var t = tok.text.trim();
  if (!t) return 'plain';
  if (csKeywords().test(t)) return 'kw';
  return 'plain';
}

function csRender() {
  if (!csCanvas || !csCtx) return;
  var code = document.getElementById('cs-code').value || '';
  var themeName = document.getElementById('cs-theme').value;
  var lang = document.getElementById('cs-lang').value;
  var fontSize = parseInt(document.getElementById('cs-size').value, 10) || 16;
  var theme = CS_THEMES[themeName] || CS_THEMES.dark;
  var ctx = csCtx;
  var padX = 24, padY = 24;
  var barH = 42;
  var lineH = Math.round(fontSize * 1.5);
  var font = fontSize + 'px "SF Mono","JetBrains Mono","Consolas",monospace';
  ctx.font = font;
  var maxWidth = 860 - padX * 2 - 30;
  var rawLines = code.split('\n');
  var wrapped = [];
  for (var li = 0; li < rawLines.length; li++) {
    var l = rawLines[li];
    if (ctx.measureText(l).width > maxWidth) {
      var parts = [];
      var cur = '';
      for (var ci = 0; ci < l.length; ci++) {
        cur += l[ci];
        if (ctx.measureText(cur).width > maxWidth) {
          parts.push(cur.slice(0, -1));
          cur = l[ci];
        }
      }
      if (cur) parts.push(cur);
      wrapped = wrapped.concat(parts);
    } else {
      wrapped.push(l);
    }
  }
  var contentH = wrapped.length * lineH;
  var W = 860;
  var H = barH + padY * 2 + contentH + 16;
  csCanvas.width = W;
  csCanvas.height = H;
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = theme.bar;
  ctx.fillRect(0, 0, W, barH);
  ctx.beginPath(); ctx.arc(24, barH/2, 6, 0, Math.PI*2); ctx.fillStyle = '#ff5f56'; ctx.fill();
  ctx.beginPath(); ctx.arc(46, barH/2, 6, 0, Math.PI*2); ctx.fillStyle = '#ffbd2e'; ctx.fill();
  ctx.beginPath(); ctx.arc(68, barH/2, 6, 0, Math.PI*2); ctx.fillStyle = '#27c93f'; ctx.fill();
  ctx.font = '13px sans-serif';
  ctx.fillStyle = theme.title;
  ctx.textAlign = 'left';
  ctx.fillText('code.' + lang, 92, barH/2 + 5);
  ctx.font = font;
  var x0 = padX, y0 = barH + padY + lineH - 6;
  for (var r = 0; r < wrapped.length; r++) {
    var tokens = csTokenize(wrapped[r], lang);
    var x = x0;
    var y = y0 + r * lineH;
    for (var ti = 0; ti < tokens.length; ti++) {
      var tok = tokens[ti];
      if (tok.type === 'comment') ctx.fillStyle = theme.com;
      else if (tok.type === 'string') ctx.fillStyle = theme.str;
      else if (tok.type === 'number') ctx.fillStyle = theme.num;
      else if (csClassify(tok) === 'kw') ctx.fillStyle = theme.kw;
      else ctx.fillStyle = theme.fg;
      ctx.fillText(tok.text, x, y);
      x += ctx.measureText(tok.text).width;
    }
  }
}

function csDownload() {
  if (!csCanvas) return;
  var a = document.createElement('a');
  a.download = 'code-screenshot.png';
  a.href = csCanvas.toDataURL('image/png');
  a.click();
  showToast('✅ 代码截图已下载');
}

// ============================================================
// 表格数据转换 处理函数 (替代 TableConvert)
// ============================================================
var TC_EXAMPLES = [
  ['json', '[{"name":"张三","age":28,"city":"北京"},{"name":"李四","age":32,"city":"上海"}]'],
  ['csv', 'name,age,city\n张三,28,北京\n李四,32,上海'],
  ['html', '<table><tr><th>name</th><th>age</th><th>city</th></tr><tr><td>张三</td><td>28</td><td>北京</td></tr><tr><td>李四</td><td>32</td><td>上海</td></tr></table>']
];

function tcInit() {
  tcConvert();
}

function tcExample() {
  var pick = TC_EXAMPLES[Math.floor(Math.random() * TC_EXAMPLES.length)];
  document.getElementById('tc-input').value = pick[1];
  document.getElementById('tc-from').value = pick[0];
  document.getElementById('tc-to').value = pick[0] === 'json' ? 'csv' : 'json';
  tcConvert();
}

function tcDetect(text) {
  var t = text.trim();
  if (!t) return 'auto';
  if (t[0] === '[' || t[0] === '{') return 'json';
  if (/<table[\s>]/i.test(t)) return 'html';
  if (t.indexOf(',') >= 0 || t.indexOf('\t') >= 0) return 'csv';
  return 'csv';
}

function tcParseCSV(text) {
  var lines = [];
  var cur = '';
  var inQ = false;
  for (var i = 0; i < text.length; i++) {
    var c = text[i];
    if (c === '"') { inQ = !inQ; cur += c; }
    else if (c === '\n' && !inQ) { lines.push(cur); cur = ''; }
    else cur += c;
  }
  if (cur) lines.push(cur);
  return lines.filter(function(x) { return x.trim() !== ''; }).map(function(line) {
    var cells = [];
    var cell = '';
    var q = false;
    for (var i = 0; i < line.length; i++) {
      var c = line[i];
      if (c === '"') {
        if (q && line[i+1] === '"') { cell += '"'; i++; }
        else q = !q;
      } else if (c === ',' && !q) { cells.push(cell.trim()); cell = ''; }
      else cell += c;
    }
    cells.push(cell.trim());
    return cells;
  });
}

function tcParseHtml(text) {
  var rows = [];
  var trs = text.match(/<tr[\s>][\s\S]*?<\/tr>/gi) || [];
  for (var i = 0; i < trs.length; i++) {
    var tds = trs[i].match(/<t[dh][\s>][\s\S]*?<\/t[dh]>/gi) || [];
    var row = tds.map(function(td) {
      var inner = td.replace(/<t[dh][\s>][\s\S]*?>/i, '').replace(/<\/t[dh]>/i, '');
      return inner.replace(/<[^>]+>/g, '').trim();
    });
    rows.push(row);
  }
  return rows;
}

function tcEscapeCSV(cell) {
  var s = String(cell == null ? '' : cell);
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function tcToCSV(rows, headers) {
  var out = [];
  if (headers && headers.length) out.push(headers.map(tcEscapeCSV).join(','));
  rows.forEach(function(row) { out.push(row.map(tcEscapeCSV).join(',')); });
  return out.join('\n');
}

function tcToJSON(rows, headers) {
  var objs = rows.map(function(row) {
    var obj = {};
    (headers || row.map(function(_, i) { return 'column' + (i+1); })).forEach(function(h, i) {
      obj[h] = row[i];
    });
    return obj;
  });
  return JSON.stringify(objs, null, 2);
}

function tcToHTML(rows, headers) {
  var h = '<table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">\n';
  if (headers && headers.length) h += '<tr>' + headers.map(function(x) { return '<th>' + x + '</th>'; }).join('') + '</tr>\n';
  rows.forEach(function(row) {
    h += '<tr>' + row.map(function(x) { return '<td>' + String(x) + '</td>'; }).join('') + '</tr>\n';
  });
  h += '</table>';
  return h;
}

function tcConvert() {
  var input = document.getElementById('tc-input').value;
  var from = document.getElementById('tc-from').value;
  var to = document.getElementById('tc-to').value;
  var out = document.getElementById('tc-output');
  try {
    if (from === 'auto') from = tcDetect(input);
    var rows = [];
    var headers = [];
    if (from === 'json') {
      var parsed = JSON.parse(input);
      if (!Array.isArray(parsed)) parsed = [parsed];
      headers = parsed.length && typeof parsed[0] === 'object' && parsed[0] !== null ? Object.keys(parsed[0]) : [];
      rows = parsed.map(function(o) {
        if (typeof o !== 'object' || o === null) return [String(o)];
        return headers.map(function(h) { return o[h] == null ? '' : o[h]; });
      });
    } else if (from === 'csv') {
      rows = tcParseCSV(input);
      if (rows.length) {
        headers = rows[0];
        rows = rows.slice(1);
      }
    } else if (from === 'html') {
      rows = tcParseHtml(input);
    } else {
      throw new Error('无法识别的输入格式');
    }
    var result;
    if (to === 'json') result = tcToJSON(rows, headers);
    else if (to === 'csv') result = tcToCSV(rows, headers);
    else if (to === 'html') result = tcToHTML(rows, headers);
    else result = tcToCSV(rows, headers);
    out.value = result;
  } catch (e) {
    out.value = '❌ 转换失败: ' + e.message;
  }
}

function tcCopy() {
  var out = document.getElementById('tc-output');
  if (!out.value) { showToast('⚠️ 没有可复制的内容'); return; }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(out.value).then(function(){ showToast('✅ 已复制'); });
  } else {
    out.select();
    document.execCommand('copy');
    showToast('✅ 已复制');
  }
}

function tcDownload() {
  var out = document.getElementById('tc-output');
  var to = document.getElementById('tc-to').value;
  if (!out.value) { showToast('⚠️ 没有可下载的内容'); return; }
  var ext = to === 'json' ? 'json' : (to === 'html' ? 'html' : 'csv');
  var mime = to === 'json' ? 'application/json' : (to === 'html' ? 'text/html' : 'text/csv');
  var blob = new Blob([out.value], { type: mime + ';charset=utf-8' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'table-data.' + ext;
  a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); }, 2000);
  showToast('✅ 文件已下载');
}

// ============================================================
// 涂鸦画板 处理函数 (替代 Paper / Sketchbook)
// ============================================================
var dpCanvas, dpCtx, dpDrawing = false, dpHistory = [], dpHistoryIdx = -1;

function dpInit() {
  dpCanvas = document.getElementById('dp-canvas');
  if (!dpCanvas) return;
  dpCtx = dpCanvas.getContext('2d');
  dpResize();
  window.addEventListener('resize', dpResize);
  dpCanvas.addEventListener('mousedown', dpStart);
  dpCanvas.addEventListener('mousemove', dpDraw);
  dpCanvas.addEventListener('mouseup', dpEnd);
  dpCanvas.addEventListener('mouseleave', dpEnd);
  dpCanvas.addEventListener('touchstart', function(e) { e.preventDefault(); dpStart(e.touches[0]); }, {passive:false});
  dpCanvas.addEventListener('touchmove', function(e) { e.preventDefault(); dpDraw(e.touches[0]); }, {passive:false});
  dpCanvas.addEventListener('touchend', function(e) { e.preventDefault(); dpEnd(); }, {passive:false});
  dpSaveState();
}

function dpResize() {
  if (!dpCanvas) return;
  var rect = dpCanvas.getBoundingClientRect();
  dpCanvas.width = Math.round(rect.width * (window.devicePixelRatio || 1));
  dpCanvas.height = Math.round(rect.height * (window.devicePixelRatio || 1));
  dpCtx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  dpCtx.lineCap = 'round';
  dpCtx.lineJoin = 'round';
  dpRestoreState();
}

function dpGetPos(e) {
  var rect = dpCanvas.getBoundingClientRect();
  return { x: (e.clientX || e.pageX) - rect.left, y: (e.clientY || e.pageY) - rect.top };
}

function dpStart(e) {
  dpDrawing = true;
  var pos = dpGetPos(e);
  dpCtx.beginPath();
  dpCtx.moveTo(pos.x, pos.y);
}

function dpDraw(e) {
  if (!dpDrawing) return;
  var pos = dpGetPos(e);
  var mode = document.getElementById('dp-mode').value;
  var color = document.getElementById('dp-color').value;
  var size = parseInt(document.getElementById('dp-size').value, 10);
  if (mode === 'eraser') {
    dpCtx.globalCompositeOperation = 'destination-out';
    dpCtx.strokeStyle = 'rgba(0,0,0,1)';
  } else if (mode === 'spray') {
    dpCtx.globalCompositeOperation = 'source-over';
    dpCtx.strokeStyle = color;
    var r = size * 2;
    for (var i = 0; i < 12; i++) {
      var ox = (Math.random() - 0.5) * r;
      var oy = (Math.random() - 0.5) * r;
      dpCtx.fillStyle = color;
      dpCtx.beginPath();
      dpCtx.arc(pos.x + ox, pos.y + oy, size * 0.5, 0, Math.PI * 2);
      dpCtx.fill();
    }
    return;
  } else {
    dpCtx.globalCompositeOperation = 'source-over';
    dpCtx.strokeStyle = color;
  }
  dpCtx.lineWidth = size;
  dpCtx.lineTo(pos.x, pos.y);
  dpCtx.stroke();
  dpCtx.beginPath();
  dpCtx.moveTo(pos.x, pos.y);
}

function dpEnd() {
  if (!dpDrawing) return;
  dpDrawing = false;
  dpCtx.beginPath();
  dpCtx.globalCompositeOperation = 'source-over';
  dpSaveState();
}

function dpSaveState() {
  if (!dpCanvas) return;
  if (dpHistoryIdx < dpHistory.length - 1) {
    dpHistory = dpHistory.slice(0, dpHistoryIdx + 1);
  }
  dpHistory.push(dpCanvas.toDataURL());
  dpHistoryIdx = dpHistory.length - 1;
  if (dpHistory.length > 30) { dpHistory.shift(); dpHistoryIdx--; }
}

function dpRestoreState() {
  if (dpHistoryIdx >= 0 && dpHistoryIdx < dpHistory.length) {
    var img = new Image();
    img.onload = function() {
      dpCtx.drawImage(img, 0, 0, dpCanvas.width, dpCanvas.height);
    };
    img.src = dpHistory[dpHistoryIdx];
  }
}

function dpClear() {
  if (!dpCtx || !dpCanvas) return;
  dpCtx.clearRect(0, 0, dpCanvas.width, dpCanvas.height);
  dpCtx.fillStyle = '#ffffff';
  dpCtx.fillRect(0, 0, dpCanvas.width, dpCanvas.height);
  dpHistory = []; dpHistoryIdx = -1;
  dpSaveState();
  showToast('🗑️ 画板已清空');
}

function dpUndo() {
  if (dpHistoryIdx <= 0) { showToast('⚠️ 没有更多步骤可撤销'); return; }
  dpHistoryIdx--;
  dpCtx.clearRect(0, 0, dpCanvas.width, dpCanvas.height);
  dpRestoreState();
  showToast('↩️ 已撤销');
}

function dpDownload() {
  if (!dpCanvas) return;
  var a = document.createElement('a');
  a.download = 'drawing.png';
  a.href = dpCanvas.toDataURL('image/png');
  a.click();
  showToast('✅ 涂鸦已下载');
}

function dpUpdate() {
  // 切换颜色/大小/模式时自动更新（无需额外操作）
}

// ============================================================
// 图片转线稿 处理函数 (替代 Vector Magic)
// ============================================================
var ilImage = null;

function ilInit() {
  // 初始化完成
}

function ilLoadFile(input) {
  if (!input.files || !input.files[0]) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    ilImage = new Image();
    ilImage.onload = function() {
      document.getElementById('il-orig').src = ilImage.src;
      ilRender();
    };
    ilImage.src = e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
}

function ilRender() {
  if (!ilImage) return;
  var strength = parseFloat(document.getElementById('il-strength').value);
  var lineColor = document.getElementById('il-color').value;
  var bgColor = document.getElementById('il-bg').value;
  var canvas = document.createElement('canvas');
  var maxW = 800, maxH = 600;
  var w = ilImage.naturalWidth, h = ilImage.naturalHeight;
  if (w > maxW) { h = h * maxW / w; w = maxW; }
  if (h > maxH) { w = w * maxH / h; h = maxH; }
  canvas.width = Math.round(w);
  canvas.height = Math.round(h);
  var ctx = canvas.getContext('2d');
  ctx.drawImage(ilImage, 0, 0, canvas.width, canvas.height);
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;
  var gray = new Float32Array(canvas.width * canvas.height);
  for (var i = 0; i < canvas.width * canvas.height; i++) {
    var idx = i * 4;
    gray[i] = data[idx] * 0.299 + data[idx+1] * 0.587 + data[idx+2] * 0.114;
  }
  var sobel = new Float32Array(canvas.width * canvas.height);
  var maxG = 0;
  for (var y = 1; y < canvas.height - 1; y++) {
    for (var x = 1; x < canvas.width - 1; x++) {
      var p = y * canvas.width + x;
      var gx = gray[p - canvas.width - 1] * -1 + gray[p - canvas.width + 1] * 1
             + gray[p - 1] * -2 + gray[p + 1] * 2
             + gray[p + canvas.width - 1] * -1 + gray[p + canvas.width + 1] * 1;
      var gy = gray[p - canvas.width - 1] * -1 + gray[p - canvas.width] * -2 + gray[p - canvas.width + 1] * -1
             + gray[p + canvas.width - 1] * 1 + gray[p + canvas.width] * 2 + gray[p + canvas.width + 1] * 1;
      var g = Math.sqrt(gx * gx + gy * gy);
      sobel[p] = g;
      if (g > maxG) maxG = g;
    }
  }
  var threshold = maxG * (0.08 / strength);
  var outCanvas = document.createElement('canvas');
  outCanvas.width = canvas.width;
  outCanvas.height = canvas.height;
  var outCtx = outCanvas.getContext('2d');
  var outData = outCtx.createImageData(canvas.width, canvas.height);
  var outPixels = outData.data;
  var lineRGB = lineColor === 'white' ? [255,255,255] : (lineColor === 'blue' ? [66,133,244] : [0,0,0]);
  var bgRGB = bgColor === 'black' ? [0,0,0] : (bgColor === 'transparent' ? [255,255,255,0] : [255,255,255]);
  for (var i = 0; i < canvas.width * canvas.height; i++) {
    var idx = i * 4;
    var val = sobel[i] > threshold ? 1 : 0;
    if (val) {
      outPixels[idx] = lineRGB[0];
      outPixels[idx+1] = lineRGB[1];
      outPixels[idx+2] = lineRGB[2];
      outPixels[idx+3] = 255;
    } else {
      if (bgColor === 'transparent') {
        outPixels[idx] = 0;
        outPixels[idx+1] = 0;
        outPixels[idx+2] = 0;
        outPixels[idx+3] = 0;
      } else {
        outPixels[idx] = bgRGB[0];
        outPixels[idx+1] = bgRGB[1];
        outPixels[idx+2] = bgRGB[2];
        outPixels[idx+3] = 255;
      }
    }
  }
  outCtx.putImageData(outData, 0, 0);
  document.getElementById('il-result').src = outCanvas.toDataURL('image/png');
  document.getElementById('il-info').textContent = '✅ 线稿已生成（' + canvas.width + '×' + canvas.height + '）';
  document.getElementById('il-download').disabled = false;
}

function ilDownload() {
  var img = document.getElementById('il-result');
  if (!img.src || img.src === window.location.href) { showToast('⚠️ 请先选择图片'); return; }
  var a = document.createElement('a');
  a.download = 'lineart.png';
  a.href = img.src;
  a.click();
  showToast('✅ 线稿已下载');
}

// ============================================================
// 渐变背景生成器 处理函数 (替代 CoolBackgrounds / Gradienta)
// ============================================================
var gbCanvas, gbCtx;

function gbInit() {
  gbCanvas = document.getElementById('gb-canvas');
  if (!gbCanvas) return;
  gbCtx = gbCanvas.getContext('2d');
  gbRender();
}

function gbPreset() {
  var presets = [
    ['#667eea', '#764ba2'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
    ['#30cfd0', '#330867'],
    ['#a8edea', '#fed6e3'],
    ['#ff9a9e', '#fecfef'],
    ['#5ee7df', '#b490ca'],
    ['#c471f5', '#fa71cd']
  ];
  var pick = presets[Math.floor(Math.random() * presets.length)];
  document.getElementById('gb-color1').value = pick[0];
  document.getElementById('gb-color2').value = pick[1];
  gbRender();
  showToast('🎲 已应用随机配色');
}

function gbRender() {
  if (!gbCanvas || !gbCtx) return;
  var c1 = document.getElementById('gb-color1').value;
  var c2 = document.getElementById('gb-color2').value;
  var angle = parseInt(document.getElementById('gb-angle').value, 10);
  var size = document.getElementById('gb-size').value.split('x');
  var w = parseInt(size[0], 10);
  var h = parseInt(size[1], 10);
  gbCanvas.width = w;
  gbCanvas.height = h;
  var ctx = gbCtx;
  if (angle === 360) {
    // Radial gradient
    var rg = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h)/2);
    rg.addColorStop(0, c1);
    rg.addColorStop(1, c2);
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, w, h);
  } else {
    var rad = angle * Math.PI / 180;
    var cx = Math.cos(rad) * 0.5;
    var cy = Math.sin(rad) * 0.5;
    var x0 = w * (0.5 - cx);
    var y0 = h * (0.5 - cy);
    var x1 = w * (0.5 + cx);
    var y1 = h * (0.5 + cy);
    var lg = ctx.createLinearGradient(x0, y0, x1, y1);
    lg.addColorStop(0, c1);
    lg.addColorStop(1, c2);
    ctx.fillStyle = lg;
    ctx.fillRect(0, 0, w, h);
  }
}

function gbDownload(fmt) {
  if (!gbCanvas) return;
  var a = document.createElement('a');
  a.download = 'gradient-background.' + fmt;
  a.href = gbCanvas.toDataURL('image/' + fmt);
  a.click();
  showToast('✅ 渐变背景已下载 (' + fmt.toUpperCase() + ')');
}

// ============================================================
// 文字特效生成器 处理函数 (替代 CoolText / MockoFony)
// ============================================================
var teCanvas, teCtx;

function teInit() {
  teCanvas = document.getElementById('te-canvas');
  if (!teCanvas) return;
  teCtx = teCanvas.getContext('2d');
  teRender();
}

function teRender() {
  if (!teCanvas || !teCtx) return;
  var text = document.getElementById('te-text').value || '文字';
  var color = document.getElementById('te-color').value;
  var bg = document.getElementById('te-bg').value;
  var style = document.getElementById('te-style').value;
  var fontSize = parseInt(document.getElementById('te-size').value, 10);
  var ctx = teCtx;
  var W = 860;
  var H = Math.max(300, fontSize * 2 + 100);
  teCanvas.width = W;
  teCanvas.height = H;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold ' + fontSize + 'px "Microsoft YaHei","PingFang SC","Noto Sans SC",sans-serif';
  var cx = W / 2;
  var cy = H / 2;

  if (style === 'neon') {
    ctx.shadowColor = color;
    for (var i = 0; i < 3; i++) {
      ctx.shadowBlur = 60 + i * 30;
      ctx.fillStyle = color;
      ctx.fillText(text, cx, cy);
    }
    ctx.shadowBlur = 0;
    ctx.fillStyle = color;
    ctx.fillText(text, cx, cy);
  } else if (style === '3d') {
    for (var d = 8; d >= 1; d--) {
      ctx.fillStyle = '#334155';
      ctx.fillText(text, cx + d, cy + d);
    }
    ctx.fillStyle = color;
    ctx.fillText(text, cx, cy);
  } else if (style === 'outline') {
    ctx.strokeStyle = color;
    ctx.lineWidth = fontSize * 0.15;
    ctx.lineJoin = 'round';
    ctx.strokeText(text, cx, cy);
    ctx.fillStyle = bg;
    ctx.fillText(text, cx, cy);
  } else if (style === 'shadow') {
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = fontSize * 0.12;
    ctx.fillStyle = color;
    ctx.fillText(text, cx, cy);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  } else if (style === 'gradient') {
    var g = ctx.createLinearGradient(0, cy - fontSize, 0, cy + fontSize);
    g.addColorStop(0, color);
    g.addColorStop(1, bg);
    ctx.fillStyle = g;
    ctx.fillText(text, cx, cy);
  }
}

function teDownload() {
  if (!teCanvas) return;
  var a = document.createElement('a');
  a.download = 'text-effect.png';
  a.href = teCanvas.toDataURL('image/png');
  a.click();
  showToast('✅ 特效文字已下载');
}

// ============================================================
// 图片拼贴画 处理函数 (替代 Canva / Fotor 拼贴)
// ============================================================
var pcCanvas, pcCtx, pcImages = [];

function pcInit() {
  pcCanvas = document.getElementById('pc-canvas');
  if (!pcCanvas) return;
  pcCtx = pcCanvas.getContext('2d');
  pcRender();
}

function pcLoadFiles(input) {
  if (!input.files || !input.files.length) return;
  pcImages = [];
  var files = Array.prototype.slice.call(input.files).slice(0, 8);
  var loaded = 0;
  files.forEach(function(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var img = new Image();
      img.onload = function() {
        pcImages.push(img);
        loaded++;
        if (loaded === files.length) {
          pcRender();
          showToast('✅ 已加载 ' + pcImages.length + ' 张图片，选择模板查看效果');
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function pcRender() {
  if (!pcCanvas || !pcCtx) return;
  var layout = document.getElementById('pc-layout').value;
  var bg = document.getElementById('pc-bg').value;
  var gap = parseInt(document.getElementById('pc-gap').value, 10);
  var W = 800, H = 600;
  pcCanvas.width = W;
  pcCanvas.height = H;
  var ctx = pcCtx;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  var imgs = pcImages;
  var cells = [];
  if (layout === '2v') { cells = [[0,0,W/2-gap/2,H],[W/2+gap/2,0,W/2-gap/2,H]]; }
  else if (layout === '2h') { cells = [[0,0,W,H/2-gap/2],[0,H/2+gap/2,W,H/2-gap/2]]; }
  else if (layout === '3h') { cells = [[0,0,W/3-gap*2/3,H],[W/3+gap/3,0,W/3-gap*2/3,H],[W*2/3+gap*2/3,0,W/3-gap*2/3,H]]; }
  else if (layout === '4g') { cells = [[0,0,W/2-gap/2,H/2-gap/2],[W/2+gap/2,0,W/2-gap/2,H/2-gap/2],[0,H/2+gap/2,W/2-gap/2,H/2-gap/2],[W/2+gap/2,H/2+gap/2,W/2-gap/2,H/2-gap/2]]; }
  else if (layout === '3+1') {
    cells = [[0,0,W*2/3,H/2-gap/2],[W*2/3+gap,0,W/3-gap,H/2-gap/2],[0,H/2+gap/2,W/2-gap/2,H/2-gap/2],[W/2+gap/2,H/2+gap/2,W/2-gap/2,H/2-gap/2]];
  }
  else if (layout === '2+2r') {
    cells = [[0,0,W/2-gap/2,H/2-gap/2],[W/2+gap/2,0,W/2-gap/2,H/2-gap/2],[0,H/2+gap/2,W/2-gap/2,H/2-gap/2],[W/2+gap/2,H/2+gap/2,W/2-gap/2,H/2-gap/2]];
  }
  // Draw placeholder cells
  cells.forEach(function(c, i) {
    if (i < imgs.length) {
      var img = imgs[i];
      var cw = c[2], ch = c[3];
      var ir = img.width / img.height;
      var cr = cw / ch;
      var dw, dh;
      if (ir > cr) { dh = ch; dw = ch * ir; } else { dw = cw; dh = cw / ir; }
      ctx.drawImage(img, c[0] + (cw-dw)/2, c[1] + (ch-dh)/2, dw, dh);
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      var cx = c[0] + c[2]/2, cy = c[1] + c[3]/2;
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📷 空', cx, cy);
    }
  });
}

function pcDownload() {
  if (!pcCanvas) return;
  var a = document.createElement('a');
  a.download = 'collage.png';
  a.href = pcCanvas.toDataURL('image/png');
  a.click();
  showToast('✅ 拼贴画已下载');
}

// ============================================================
// 图片相框 处理函数 (替代付费相框应用)
// ============================================================
var pfCanvas, pfCtx, pfImage = null;

function pfInit() {
  pfCanvas = document.getElementById('pf-canvas');
  if (!pfCanvas) return;
  pfCtx = pfCanvas.getContext('2d');
}

function pfLoadFile(input) {
  if (!input.files || !input.files[0]) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    pfImage = new Image();
    pfImage.onload = function() {
      pfRender();
      document.getElementById('pf-download').disabled = false;
    };
    pfImage.src = e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
}

function pfRender() {
  if (!pfCanvas || !pfCtx || !pfImage) return;
  var style = document.getElementById('pf-style').value;
  var radius = parseInt(document.getElementById('pf-radius').value, 10);
  var text = document.getElementById('pf-text').value;
  var textColor = document.getElementById('pf-textcolor').value;
  var ctx = pfCtx;
  var iw = pfImage.naturalWidth, ih = pfImage.naturalHeight;
  var maxW = 700;
  var scale = maxW / iw;
  var dw = maxW, dh = ih * scale;
  var frame = 40;
  var W = Math.round(dw + frame * 2), H = Math.round(dh + frame * 2);
  pfCanvas.width = W;
  pfCanvas.height = H;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  var fx = frame, fy = frame;
  // Draw frame
  if (style === 'classic') {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#f5d76e'); g.addColorStop(0.5, '#b8860b'); g.addColorStop(1, '#f5d76e');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.strokeStyle = '#8b6914';
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, W-12, H-12);
    ctx.restore();
    fx = frame + 6; fy = frame + 6; dw -= 12; dh -= 12;
  } else if (style === 'wood') {
    ctx.fillStyle = '#8B5A2B';
    ctx.fillRect(0, 0, W, H);
    for (var i = 0; i < W; i += 12) {
      ctx.fillStyle = 'rgba(120,70,30,0.4)';
      ctx.fillRect(i, 0, 3, H);
    }
    ctx.strokeStyle = '#5c3a1e';
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, W-12, H-12);
  } else if (style === 'minimal') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(frame-12, frame-12, dw+24, dh+24);
  } else if (style === 'black') {
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#333333';
    ctx.fillRect(frame-8, frame-8, dw+16, dh+16);
  } else if (style === 'polaroid') {
    // White bottom-heavy frame
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, W, H + 60);
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(frame-15, frame-15, dw+30, dh+30);
  }
  // Rounded photo
  ctx.save();
  roundRect(ctx, fx, fy, dw, dh, radius);
  ctx.clip();
  ctx.drawImage(pfImage, fx, fy, dw, dh);
  ctx.restore();
  // Border on photo
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 2;
  ctx.strokeRect(fx, fy, dw, dh);
  // Polaroid bottom text
  if (style === 'polaroid') {
    var pt = text || 'POLAROID';
    ctx.fillStyle = '#444';
    ctx.font = '32px cursive';
    ctx.textAlign = 'center';
    ctx.fillText(pt, W/2, H + 40);
  }
  // Watermark bottom-right
  if (text && style !== 'polaroid') {
    ctx.fillStyle = textColor;
    ctx.globalAlpha = 0.8;
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(text, W - 20, H - 15);
    ctx.globalAlpha = 1;
  }
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function pfDownload() {
  if (!pfCanvas) return;
  var a = document.createElement('a');
  a.download = 'photo-frame.png';
  a.href = pfCanvas.toDataURL('image/png');
  a.click();
  showToast('✅ 带框图片已下载');
}

// ============================================================
// 函数绘图器 处理函数 (替代 Desmos / GeoGebra)
// ============================================================
var fpCanvas, fpCtx, fpScale = 60, fpOffsetX = 0, fpOffsetY = 0;

function fpInit() {
  fpCanvas = document.getElementById('fp-canvas');
  if (!fpCanvas) return;
  fpCtx = fpCanvas.getContext('2d');
  fpRender();
}

function fpParseExpr(expr) {
  // Replace ^ with ** and support functions
  var e = expr.trim().replace(/\^/g, '**');
  e = e.replace(/(\d)([a-zA-Z(])/g, '$1*$2');
  e = e.replace(/\)([a-zA-Z(])/g, ')*$1');
  e = e.replace(/sin\(/g, 'Math.sin(');
  e = e.replace(/cos\(/g, 'Math.cos(');
  e = e.replace(/tan\(/g, 'Math.tan(');
  e = e.replace(/log\(/g, 'Math.log10(');
  e = e.replace(/ln\(/g, 'Math.log(');
  e = e.replace(/exp\(/g, 'Math.exp(');
  e = e.replace(/sqrt\(/g, 'Math.sqrt(');
  e = e.replace(/abs\(/g, 'Math.abs(');
  e = e.replace(/pow\(/g, 'Math.pow(');
  e = e.replace(/pi/g, 'Math.PI');
  e = e.replace(/PI/g, 'Math.PI');
  e = e.replace(/e/g, 'Math.E');
  return e;
}

function fpEval(expr, x) {
  try {
    var e = fpParseExpr(expr);
    // x already substituted in loop
    var body = e.replace(/x/g, '(' + x + ')');
    return eval(body);
  } catch (err) {
    return null;
  }
}

function fpRender() {
  if (!fpCanvas || !fpCtx) return;
  var exprText = document.getElementById('fp-expr').value || 'sin(x)';
  var rangeText = document.getElementById('fp-range').value || '-10,10';
  var gridDensity = parseFloat(document.getElementById('fp-grid').value) || 1;
  var exprs = exprText.split(',').map(function(s){ return s.trim(); }).filter(Boolean);
  var range = rangeText.split(',').map(function(s){ return parseFloat(s.trim()); });
  var xMin = isNaN(range[0]) ? -10 : range[0];
  var xMax = isNaN(range[1]) ? 10 : range[1];
  var palette = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#84cc16'];
  var W = 800, H = 500;
  fpCanvas.width = W;
  fpCanvas.height = H;
  var ctx = fpCtx;
  // background
  ctx.fillStyle = '#101018';
  ctx.fillRect(0, 0, W, H);
  // grid
  var cx = W / 2 + fpOffsetX;
  var cy = H / 2 + fpOffsetY;
  var step = fpScale * gridDensity;
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1;
  for (var gx = cx % step; gx < W; gx += step) {
    ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
  }
  for (var gy = cy % step; gy < H; gy += step) {
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
  }
  // axes
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
  // arrow heads
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath(); ctx.moveTo(cx, 5); ctx.lineTo(cx-6, 20); ctx.lineTo(cx+6, 20); ctx.fill();
  ctx.beginPath(); ctx.moveTo(W-5, cy); ctx.lineTo(W-20, cy-6); ctx.lineTo(W-20, cy+6); ctx.fill();
  // tick labels
  ctx.fillStyle = '#888';
  ctx.font = '11px monospace';
  ctx.textAlign = 'center';
  for (var v = -100; v <= 100; v++) {
    var px = cx + v * fpScale;
    if (px > 20 && px < W-20) {
      ctx.fillText(v, px, cy + 16);
    }
    var py = cy - v * fpScale;
    if (py > 15 && py < H-10) {
      ctx.fillText(v, cx + 8, py + 3);
    }
  }
  // functions
  exprs.forEach(function(expr, idx) {
    var color = palette[idx % palette.length];
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    var started = false;
    var prevValid = false;
    var pxPrev, pyPrev;
    for (var i = 0; i <= W; i += 2) {
      var wx = (i - cx) / fpScale;
      if (wx < xMin || wx > xMax) { prevValid = false; continue; }
      var val = fpEval(expr, wx);
      if (val === null || !isFinite(val)) { prevValid = false; continue; }
      var py = cy - val * fpScale;
      if (Math.abs(val) > 10000) { prevValid = false; continue; }
      if (!started) { ctx.moveTo(i, py); started = true; }
      else {
        // skip big jumps
        if (prevValid && Math.abs(py - pyPrev) < fpScale * 8) {
          ctx.lineTo(i, py);
        } else {
          ctx.moveTo(i, py);
        }
      }
      pxPrev = i; pyPrev = py; prevValid = true;
    }
    ctx.stroke();
    // legend
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.fillText('y=' + expr, 10, 20 + idx * 20);
  });
}

function fpZoom(dir) {
  fpScale *= dir < 0 ? 1.4 : 0.7;
  fpScale = Math.min(300, Math.max(5, fpScale));
  fpRender();
}

function fpReset() {
  fpScale = 60; fpOffsetX = 0; fpOffsetY = 0;
  document.getElementById('fp-expr').value = 'sin(x),cos(x)';
  document.getElementById('fp-range').value = '-10,10';
  fpRender();
}

function fpDownload() {
  if (!fpCanvas) return;
  var a = document.createElement('a');
  a.download = 'function-graph.png';
  a.href = fpCanvas.toDataURL('image/png');
  a.click();
  showToast('✅ 函数图像已下载');
}

// ============================================================
// 颜色盲区模拟 处理函数 (替代 Stark / Coblis)
// ============================================================
var cbImage = null;

function cbInit() {
  // ready
}

function cbLoadFile(input) {
  if (!input.files || !input.files[0]) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    cbImage = new Image();
    cbImage.onload = function() {
      document.getElementById('cb-orig').src = cbImage.src;
      cbRender();
    };
    cbImage.src = e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
}

function cbRender() {
  if (!cbImage) return;
  var type = document.getElementById('cb-type').value;
  var canvas = document.createElement('canvas');
  var maxW = 800, maxH = 560;
  var w = cbImage.naturalWidth, h = cbImage.naturalHeight;
  if (w > maxW) { h = h * maxW / w; w = maxW; }
  if (h > maxH) { w = w * maxH / h; h = maxH; }
  canvas.width = Math.round(w);
  canvas.height = Math.round(h);
  var ctx = canvas.getContext('2d');
  ctx.drawImage(cbImage, 0, 0, canvas.width, canvas.height);
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imageData.data;
  for (var i = 0; i < data.length; i += 4) {
    var r = data[i], g = data[i+1], b = data[i+2];
    var nr, ng, nb;
    if (type === 'protanopia') {
      nr = 0.567 * r + 0.433 * g;
      ng = 0.558 * r + 0.442 * g;
      nb = b;
    } else if (type === 'deuteranopia') {
      nr = 0.625 * r + 0.375 * g;
      ng = 0.7 * r + 0.3 * g;
      nb = b;
    } else if (type === 'tritanopia') {
      nr = r;
      ng = 0.3 * g + 0.7 * b;
      nb = 0.3 * g + 0.7 * b;
    } else {
      var gray = 0.299 * r + 0.587 * g + 0.114 * b;
      nr = gray; ng = gray; nb = gray;
    }
    data[i] = Math.min(255, Math.max(0, nr));
    data[i+1] = Math.min(255, Math.max(0, ng));
    data[i+2] = Math.min(255, Math.max(0, nb));
  }
  ctx.putImageData(imageData, 0, 0);
  document.getElementById('cb-result').src = canvas.toDataURL('image/png');
  document.getElementById('cb-info').textContent = '✅ 已生成模拟效果（' + canvas.width + '×' + canvas.height + '）';
}

// ============================================================
// 元素周期表 处理函数 (替代付费化学学习应用)
// ============================================================
var PT_ELEMENTS = [
  {n:1,s:'H',name:'氢',en:'Hydrogen',m:'1.008',cat:'noble'},
  {n:2,s:'He',name:'氦',en:'Helium',m:'4.003',cat:'noble'},
  {n:3,s:'Li',name:'锂',en:'Lithium',m:'6.94',cat:'alkali'},
  {n:4,s:'Be',name:'铍',en:'Beryllium',m:'9.012',cat:'alkaline'},
  {n:5,s:'B',name:'硼',en:'Boron',m:'10.81',cat:'metalloid'},
  {n:6,s:'C',name:'碳',en:'Carbon',m:'12.01',cat:'nonmetal'},
  {n:7,s:'N',name:'氮',en:'Nitrogen',m:'14.01',cat:'nonmetal'},
  {n:8,s:'O',name:'氧',en:'Oxygen',m:'16.00',cat:'nonmetal'},
  {n:9,s:'F',name:'氟',en:'Fluorine',m:'19.00',cat:'halogen'},
  {n:10,s:'Ne',name:'氖',en:'Neon',m:'20.18',cat:'noble'},
  {n:11,s:'Na',name:'钠',en:'Sodium',m:'22.99',cat:'alkali'},
  {n:12,s:'Mg',name:'镁',en:'Magnesium',m:'24.31',cat:'alkaline'},
  {n:13,s:'Al',name:'铝',en:'Aluminium',m:'26.98',cat:'post'},
  {n:14,s:'Si',name:'硅',en:'Silicon',m:'28.09',cat:'metalloid'},
  {n:15,s:'P',name:'磷',en:'Phosphorus',m:'30.97',cat:'nonmetal'},
  {n:16,s:'S',name:'硫',en:'Sulfur',m:'32.06',cat:'nonmetal'},
  {n:17,s:'Cl',name:'氯',en:'Chlorine',m:'35.45',cat:'halogen'},
  {n:18,s:'Ar',name:'氩',en:'Argon',m:'39.95',cat:'noble'},
  {n:19,s:'K',name:'钾',en:'Potassium',m:'39.10',cat:'alkali'},
  {n:20,s:'Ca',name:'钙',en:'Calcium',m:'40.08',cat:'alkaline'},
  {n:21,s:'Sc',name:'钪',en:'Scandium',m:'44.96',cat:'transition'},
  {n:22,s:'Ti',name:'钛',en:'Titanium',m:'47.87',cat:'transition'},
  {n:23,s:'V',name:'钒',en:'Vanadium',m:'50.94',cat:'transition'},
  {n:24,s:'Cr',name:'铬',en:'Chromium',m:'52.00',cat:'transition'},
  {n:25,s:'Mn',name:'锰',en:'Manganese',m:'54.94',cat:'transition'},
  {n:26,s:'Fe',name:'铁',en:'Iron',m:'55.85',cat:'transition'},
  {n:27,s:'Co',name:'钴',en:'Cobalt',m:'58.93',cat:'transition'},
  {n:28,s:'Ni',name:'镍',en:'Nickel',m:'58.69',cat:'transition'},
  {n:29,s:'Cu',name:'铜',en:'Copper',m:'63.55',cat:'transition'},
  {n:30,s:'Zn',name:'锌',en:'Zinc',m:'65.38',cat:'transition'},
  {n:31,s:'Ga',name:'镓',en:'Gallium',m:'69.72',cat:'post'},
  {n:32,s:'Ge',name:'锗',en:'Germanium',m:'72.63',cat:'metalloid'},
  {n:33,s:'As',name:'砷',en:'Arsenic',m:'74.92',cat:'metalloid'},
  {n:34,s:'Se',name:'硒',en:'Selenium',m:'78.97',cat:'nonmetal'},
  {n:35,s:'Br',name:'溴',en:'Bromine',m:'79.90',cat:'halogen'},
  {n:36,s:'Kr',name:'氪',en:'Krypton',m:'83.80',cat:'noble'},
  {n:37,s:'Rb',name:'铷',en:'Rubidium',m:'85.47',cat:'alkali'},
  {n:38,s:'Sr',name:'锶',en:'Strontium',m:'87.62',cat:'alkaline'},
  {n:39,s:'Y',name:'钇',en:'Yttrium',m:'88.91',cat:'transition'},
  {n:40,s:'Zr',name:'锆',en:'Zirconium',m:'91.22',cat:'transition'},
  {n:41,s:'Nb',name:'铌',en:'Niobium',m:'92.91',cat:'transition'},
  {n:42,s:'Mo',name:'钼',en:'Molybdenum',m:'95.95',cat:'transition'},
  {n:43,s:'Tc',name:'锝',en:'Technetium',m:'98',cat:'transition'},
  {n:44,s:'Ru',name:'钌',en:'Ruthenium',m:'101.1',cat:'transition'},
  {n:45,s:'Rh',name:'铑',en:'Rhodium',m:'102.9',cat:'transition'},
  {n:46,s:'Pd',name:'钯',en:'Palladium',m:'106.4',cat:'transition'},
  {n:47,s:'Ag',name:'银',en:'Silver',m:'107.9',cat:'transition'},
  {n:48,s:'Cd',name:'镉',en:'Cadmium',m:'112.4',cat:'transition'},
  {n:49,s:'In',name:'铟',en:'Indium',m:'114.8',cat:'post'},
  {n:50,s:'Sn',name:'锡',en:'Tin',m:'118.7',cat:'post'},
  {n:51,s:'Sb',name:'锑',en:'Antimony',m:'121.8',cat:'metalloid'},
  {n:52,s:'Te',name:'碲',en:'Tellurium',m:'127.6',cat:'metalloid'},
  {n:53,s:'I',name:'碘',en:'Iodine',m:'126.9',cat:'halogen'},
  {n:54,s:'Xe',name:'氙',en:'Xenon',m:'131.3',cat:'noble'},
  {n:55,s:'Cs',name:'铯',en:'Caesium',m:'132.9',cat:'alkali'},
  {n:56,s:'Ba',name:'钡',en:'Barium',m:'137.3',cat:'alkaline'},
  {n:57,s:'La',name:'镧',en:'Lanthanum',m:'138.9',cat:'lanthanide'},
  {n:58,s:'Ce',name:'铈',en:'Cerium',m:'140.1',cat:'lanthanide'},
  {n:59,s:'Pr',name:'镨',en:'Praseodymium',m:'140.9',cat:'lanthanide'},
  {n:60,s:'Nd',name:'钕',en:'Neodymium',m:'144.2',cat:'lanthanide'},
  {n:61,s:'Pm',name:'钷',en:'Promethium',m:'145',cat:'lanthanide'},
  {n:62,s:'Sm',name:'钐',en:'Samarium',m:'150.4',cat:'lanthanide'},
  {n:63,s:'Eu',name:'铕',en:'Europium',m:'152.0',cat:'lanthanide'},
  {n:64,s:'Gd',name:'钆',en:'Gadolinium',m:'157.3',cat:'lanthanide'},
  {n:65,s:'Tb',name:'铽',en:'Terbium',m:'158.9',cat:'lanthanide'},
  {n:66,s:'Dy',name:'镝',en:'Dysprosium',m:'162.5',cat:'lanthanide'},
  {n:67,s:'Ho',name:'钬',en:'Holmium',m:'164.9',cat:'lanthanide'},
  {n:68,s:'Er',name:'铒',en:'Erbium',m:'167.3',cat:'lanthanide'},
  {n:69,s:'Tm',name:'铥',en:'Thulium',m:'168.9',cat:'lanthanide'},
  {n:70,s:'Yb',name:'镱',en:'Ytterbium',m:'173.0',cat:'lanthanide'},
  {n:71,s:'Lu',name:'镥',en:'Lutetium',m:'175.0',cat:'lanthanide'},
  {n:72,s:'Hf',name:'铪',en:'Hafnium',m:'178.5',cat:'transition'},
  {n:73,s:'Ta',name:'钽',en:'Tantalum',m:'180.9',cat:'transition'},
  {n:74,s:'W',name:'钨',en:'Tungsten',m:'183.8',cat:'transition'},
  {n:75,s:'Re',name:'铼',en:'Rhenium',m:'186.2',cat:'transition'},
  {n:76,s:'Os',name:'锇',en:'Osmium',m:'190.2',cat:'transition'},
  {n:77,s:'Ir',name:'铱',en:'Iridium',m:'192.2',cat:'transition'},
  {n:78,s:'Pt',name:'铂',en:'Platinum',m:'195.1',cat:'transition'},
  {n:79,s:'Au',name:'金',en:'Gold',m:'197.0',cat:'transition'},
  {n:80,s:'Hg',name:'汞',en:'Mercury',m:'200.6',cat:'transition'},
  {n:81,s:'Tl',name:'铊',en:'Thallium',m:'204.4',cat:'post'},
  {n:82,s:'Pb',name:'铅',en:'Lead',m:'207.2',cat:'post'},
  {n:83,s:'Bi',name:'铋',en:'Bismuth',m:'209.0',cat:'post'},
  {n:84,s:'Po',name:'钋',en:'Polonium',m:'209',cat:'post'},
  {n:85,s:'At',name:'砹',en:'Astatine',m:'210',cat:'halogen'},
  {n:86,s:'Rn',name:'氡',en:'Radon',m:'222',cat:'noble'},
  {n:87,s:'Fr',name:'钫',en:'Francium',m:'223',cat:'alkali'},
  {n:88,s:'Ra',name:'镭',en:'Radium',m:'226',cat:'alkaline'},
  {n:89,s:'Ac',name:'锕',en:'Actinium',m:'227',cat:'actinide'},
  {n:90,s:'Th',name:'钍',en:'Thorium',m:'232.0',cat:'actinide'},
  {n:91,s:'Pa',name:'镤',en:'Protactinium',m:'231.0',cat:'actinide'},
  {n:92,s:'U',name:'铀',en:'Uranium',m:'238.0',cat:'actinide'},
  {n:93,s:'Np',name:'镎',en:'Neptunium',m:'237',cat:'actinide'},
  {n:94,s:'Pu',name:'钚',en:'Plutonium',m:'244',cat:'actinide'},
  {n:95,s:'Am',name:'镅',en:'Americium',m:'243',cat:'actinide'},
  {n:96,s:'Cm',name:'锔',en:'Curium',m:'247',cat:'actinide'},
  {n:97,s:'Bk',name:'锫',en:'Berkelium',m:'247',cat:'actinide'},
  {n:98,s:'Cf',name:'锎',en:'Californium',m:'251',cat:'actinide'},
  {n:99,s:'Es',name:'锿',en:'Einsteinium',m:'252',cat:'actinide'},
  {n:100,s:'Fm',name:'镄',en:'Fermium',m:'257',cat:'actinide'},
  {n:101,s:'Md',name:'钔',en:'Mendelevium',m:'258',cat:'actinide'},
  {n:102,s:'No',name:'锘',en:'Nobelium',m:'259',cat:'actinide'},
  {n:103,s:'Lr',name:'铹',en:'Lawrencium',m:'266',cat:'actinide'},
  {n:104,s:'Rf',name:'𬬻',en:'Rutherfordium',m:'267',cat:'transition'},
  {n:105,s:'Db',name:'𬭊',en:'Dubnium',m:'268',cat:'transition'},
  {n:106,s:'Sg',name:'𬭳',en:'Seaborgium',m:'269',cat:'transition'},
  {n:107,s:'Bh',name:'𬭛',en:'Bohrium',m:'270',cat:'transition'},
  {n:108,s:'Hs',name:'𬭶',en:'Hassium',m:'277',cat:'transition'},
  {n:109,s:'Mt',name:'鿏',en:'Meitnerium',m:'278',cat:'transition'},
  {n:110,s:'Ds',name:'𫟼',en:'Darmstadtium',m:'281',cat:'transition'},
  {n:111,s:'Rg',name:'𬬭',en:'Roentgenium',m:'282',cat:'transition'},
  {n:112,s:'Cn',name:'鎶',en:'Copernicium',m:'285',cat:'transition'},
  {n:113,s:'Nh',name:'鉨',en:'Nihonium',m:'286',cat:'post'},
  {n:114,s:'Fl',name:'𫓧',en:'Flerovium',m:'289',cat:'post'},
  {n:115,s:'Mc',name:'镆',en:'Moscovium',m:'290',cat:'post'},
  {n:116,s:'Lv',name:'𫟷',en:'Livermorium',m:'293',cat:'post'},
  {n:117,s:'Ts',name:'鿬',en:'Tennessine',m:'294',cat:'halogen'},
  {n:118,s:'Og',name:'鿫',en:'Oganesson',m:'294',cat:'noble'}
];

var PT_CAT_COLORS = {
  'alkali': '#ff8f6b', 'alkaline': '#ffd46b', 'transition': '#a8d8ea',
  'post': '#b8e0b8', 'metalloid': '#c9b8e8', 'nonmetal': '#8fdcff',
  'halogen': '#b8f0dc', 'noble': '#e8b8e8', 'lanthanide': '#ffb8c8',
  'actinide': '#ff9db0'
};

function ptInit() {
  var container = document.getElementById('pt-table');
  if (!container) return;
  PT_ELEMENTS.forEach(function(el) {
    var d = document.createElement('div');
    d.style.width = '52px';
    d.style.height = '56px';
    d.style.margin = '1px';
    d.style.borderRadius = '6px';
    d.style.cursor = 'pointer';
    d.style.background = PT_CAT_COLORS[el.cat] || '#aaa';
    d.style.color = '#1a1a2e';
    d.style.textAlign = 'center';
    d.style.fontSize = '11px';
    d.style.padding = '3px';
    d.style.transition = 'transform 0.15s';
    d.onmouseover = function(){ d.style.transform = 'scale(1.1)'; d.style.boxShadow = '0 0 8px rgba(255,255,255,0.4)'; };
    d.onmouseout = function(){ d.style.transform = 'scale(1)'; d.style.boxShadow = 'none'; };
    d.onclick = function(){ ptShowDetail(el); };
    d.innerHTML = '<div style="font-size:10px;text-align:left;">' + el.n + '</div><div style="font-size:17px;font-weight:700;">' + el.s + '</div><div>' + el.name + '</div>';
    container.appendChild(d);
  });
}

function ptShowDetail(el) {
  var box = document.getElementById('pt-detail');
  if (!box) return;
  var catName = {
    'alkali':'碱金属','alkaline':'碱土金属','transition':'过渡金属','post':'后过渡金属',
    'metalloid':'类金属','nonmetal':'非金属','halogen':'卤素','noble':'稀有气体',
    'lanthanide':'镧系元素','actinide':'锕系元素'
  }[el.cat] || el.cat;
  box.innerHTML = '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;">'
    + '<div style="width:70px;height:76px;border-radius:8px;background:' + (PT_CAT_COLORS[el.cat]||'#aaa') + ';color:#1a1a2e;text-align:center;padding:6px;">'
    + '<div style="font-size:11px;text-align:left;">' + el.n + '</div>'
    + '<div style="font-size:24px;font-weight:700;">' + el.s + '</div>'
    + '<div style="font-size:11px;">' + el.name + '</div></div>'
    + '<div><div style="font-size:18px;font-weight:700;">' + el.name + ' (' + el.en + ')</div>'
    + '<div style="margin-top:6px;color:#ccc;">元素符号：' + el.s + '</div>'
    + '<div style="color:#ccc;">原子序数：' + el.n + '</div>'
    + '<div style="color:#ccc;">相对原子质量：' + el.m + '</div>'
    + '<div style="color:#ccc;">分类：' + catName + '</div></div></div>';
}

// ============================================================
// 二维码美化器 处理函数 (替代付费QR美化工具)
// ============================================================
var qbLogoImg = null;

function qbInit() {
  qbRender();
}

function qbEnsureLib(cb) {
  if (typeof QRCode !== 'undefined') { cb(); return; }
  var s = document.createElement('script');
  s.src = 'https://unpkg.com/qrcodejs@1.0.0/qrcode.min.js';
  s.onload = cb;
  s.onerror = function() { showToast('⚠️ 二维码库加载失败，请检查网络'); };
  document.head.appendChild(s);
}

function qbRender() {
  var text = document.getElementById('qb-text').value || 'https://toolai.ccwu.cc';
  var fg = document.getElementById('qb-fg').value;
  var bg = document.getElementById('qb-bg').value;
  var size = parseInt(document.getElementById('qb-size').value, 10);
  qbEnsureLib(function() {
    var container = document.getElementById('qb-container');
    container.innerHTML = '';
    var qr = new QRCode(container, {
      text: text,
      width: size,
      height: size,
      colorDark: fg,
      colorLight: bg,
      correctLevel: QRCode.CorrectLevel.H
    });
    var qrCanvas = container.querySelector('canvas') || container.querySelector('img');
    if (!qrCanvas) return;
    // Draw logo overlay on top of QR
    if (qbLogoImg) {
      var overlay = document.createElement('canvas');
      overlay.width = size;
      overlay.height = size;
      var ctx = overlay.getContext('2d');
      ctx.drawImage(qrCanvas, 0, 0, size, size);
      var logoSize = size * 0.22;
      var lx = (size - logoSize) / 2;
      var ly = (size - logoSize) / 2;
      ctx.fillStyle = bg;
      ctx.fillRect(lx - 6, ly - 6, logoSize + 12, logoSize + 12);
      ctx.drawImage(qbLogoImg, lx, ly, logoSize, logoSize);
      container.innerHTML = '';
      container.appendChild(overlay);
    }
  });
}

function qbLoadLogo(input) {
  if (!input.files || !input.files[0]) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    qbLogoImg = new Image();
    qbLogoImg.onload = function() { qbRender(); showToast('✅ Logo已添加'); };
    qbLogoImg.src = e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
}

function qbRemoveLogo() {
  qbLogoImg = null;
  document.getElementById('qb-logo').value = '';
  qbRender();
  showToast('🗑️ Logo已移除');
}

function qbDownload() {
  var container = document.getElementById('qb-container');
  var el = container.querySelector('canvas') || container.querySelector('img');
  if (!el) return;
  var a = document.createElement('a');
  a.download = 'qr-code.png';
  if (el.tagName === 'CANVAS') {
    a.href = el.toDataURL('image/png');
  } else {
    a.href = el.src;
  }
  a.click();
  showToast('✅ 美化二维码已下载');
}

// ============================================================
// 录音转文字 处理函数 (替代付费 Otter/讯飞听见)
// ============================================================
var sttRecognition = null;
var sttRecording = false;
var sttFinalText = '';

function sttInit() {
  var lang = document.getElementById('stt-lang');
  if (lang) {
    lang.addEventListener('change', function() {
      if (sttRecording) { sttStop(); }
      sttInitRecognition();
    });
  }
  sttInitRecognition();
  // 页面关闭前停止
  window.addEventListener('beforeunload', function() { if (sttRecording) sttStop(); });
}

function sttInitRecognition() {
  var wsr = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!wsr) {
    var s = document.getElementById('stt-status');
    if (s) s.innerHTML = '❌ 当前浏览器不支持语音识别，请使用 Chrome / Edge 浏览器';
    return;
  }
  sttRecognition = new wsr();
  sttRecognition.continuous = true;
  sttRecognition.interimResults = true;
  var langSel = document.getElementById('stt-lang');
  sttRecognition.lang = langSel ? langSel.value : 'zh-CN';
  sttRecognition.onresult = function(e) {
    var interim = '';
    for (var i = e.resultIndex; i < e.results.length; i++) {
      var res = e.results[i];
      if (res.isFinal) {
        sttFinalText += res[0].transcript;
      } else {
        interim += res[0].transcript;
      }
    }
    var ta = document.getElementById('stt-result');
    if (ta) ta.value = sttFinalText + (interim ? (' [正在听…] ' + interim) : '');
    ta.scrollTop = ta.scrollHeight;
  };
  sttRecognition.onerror = function(e) {
    if (e.error === 'not-allowed') {
      sttSetStatus('🚫 麦克风权限被拒绝，请在浏览器地址栏允许麦克风访问');
    } else if (e.error === 'no-speech') {
      sttSetStatus('🤫 未检测到语音，请靠近麦克风说话');
    } else {
      sttSetStatus('⚠️ 识别出错: ' + e.error);
    }
  };
  sttRecognition.onend = function() {
    sttRecording = false;
    var btn = document.getElementById('stt-start');
    if (btn) { btn.innerHTML = '🔴 开始识别'; btn.classList.remove('btn-secondary'); btn.classList.add('btn-primary'); }
    var st = document.getElementById('stt-state');
    if (st) st.innerHTML = '已停止';
  };
}

function sttToggle() {
  if (sttRecording) { sttStop(); return; }
  if (!sttRecognition) { sttInitRecognition(); }
  if (!sttRecognition) return;
  try {
    sttRecognition.start();
    sttRecording = true;
    sttSetStatus('🎙️ 正在聆听… 请开始说话');
    var btn = document.getElementById('stt-start');
    if (btn) { btn.innerHTML = '⏹️ 停止识别'; btn.classList.remove('btn-primary'); btn.classList.add('btn-secondary'); }
    var st = document.getElementById('stt-state');
    if (st) st.innerHTML = '🔴 识别中';
  } catch (err) {
    // 可能已经启动
  }
}

function sttStop() {
  if (sttRecognition) {
    try { sttRecognition.stop(); } catch (e) {}
  }
  sttRecording = false;
  sttSetStatus('⏹️ 已停止，识别结果保留在下方文本框');
  var st = document.getElementById('stt-state');
  if (st) st.innerHTML = '已停止';
}

function sttSetStatus(msg) {
  var s = document.getElementById('stt-status');
  if (s) s.innerHTML = msg;
}

function sttClear() {
  sttFinalText = '';
  var ta = document.getElementById('stt-result');
  if (ta) ta.value = '';
  showToast('🗑️ 已清空');
}

function sttDownload() {
  var ta = document.getElementById('stt-result');
  var text = ta ? ta.value : '';
  if (!text) { showToast('⚠️ 没有可导出的内容'); return; }
  var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = '语音转文字_' + new Date().toISOString().slice(0, 10) + '.txt';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('✅ 已导出TXT文件');
}

// ============================================================
// 在线便签 处理函数 (替代付费 Notezilla)
// ============================================================
var snNotes = [];
var snColors = ['#ffe08a', '#ffb3ba', '#baffc9', '#a0e7e5', '#b5b8ff', '#fff'];
var snDragId = null;

function snInit() {
  try {
    var saved = localStorage.getItem('sticky_notes_data');
    if (saved) snNotes = JSON.parse(saved);
  } catch (e) { snNotes = []; }
  snRender();
}

function snSave() {
  try { localStorage.setItem('sticky_notes_data', JSON.stringify(snNotes)); } catch (e) {}
}

function snAddNote() {
  var id = 'sn-' + Date.now();
  snNotes.push({ id: id, text: '', color: '#ffe08a', pinned: false, x: 0, y: 0 });
  snSave();
  snRender();
  // 自动聚焦新便签
  setTimeout(function() {
    var t = document.getElementById(id + '-text');
    if (t) t.focus();
  }, 100);
}

function snRender() {
  var board = document.getElementById('sn-board');
  if (!board) return;
  board.innerHTML = '';
  var ordered = snNotes.slice().sort(function(a, b) { return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0); });
  ordered.forEach(function(note) {
    var el = document.createElement('div');
    el.id = note.id;
    el.style.cssText = 'width:190px;min-height:150px;background:' + note.color + ';border-radius:4px;box-shadow:0 3px 8px rgba(0,0,0,0.2);padding:10px;display:flex;flex-direction:column;position:relative;';
    el.draggable = true;
    el.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;cursor:move;user-select:none;">' +
      '<div style="display:flex;gap:3px;">' +
        '<span style="width:11px;height:11px;border-radius:50%;background:#ff5f57;display:inline-block;"></span>' +
        '<span style="width:11px;height:11px;border-radius:50%;background:#febc2e;display:inline-block;"></span>' +
        '<span style="width:11px;height:11px;border-radius:50%;background:#28c840;display:inline-block;"></span>' +
      '</div>' +
      '<div>' +
        (note.pinned ? '<button class="btn btn-sm" style="padding:1px 6px;font-size:11px;margin-right:3px;" onclick="snTogglePin(\'' + note.id + '\')" title="取消置顶">📌</button>' : '<button class="btn btn-sm" style="padding:1px 6px;font-size:11px;margin-right:3px;" onclick="snTogglePin(\'' + note.id + '\')" title="置顶">📍</button>') +
        '<button class="btn btn-sm" style="padding:1px 6px;font-size:11px;" onclick="snDelNote(\'' + note.id + '\')" title="删除">✖</button>' +
      '</div>' +
    '</div>' +
    '<div style="display:flex;gap:2px;flex-wrap:wrap;margin-bottom:6px;">' +
      snColors.map(function(c) { return '<span onclick="snSetColor(\'' + note.id + '\',\'' + c + '\')" style="width:14px;height:14px;border-radius:3px;background:' + c + ';cursor:pointer;border:1px solid rgba(0,0,0,0.15);display:inline-block;"></span>'; }).join('') +
    '</div>' +
    '<textarea id="' + note.id + '-text" oninput="snEdit(\'' + note.id + '\',this.value)" style="flex:1;background:transparent;border:none;outline:none;resize:none;color:#333;font-size:14px;font-family:inherit;min-height:90px;" placeholder="双击编辑…">' + (note.text || '') + '</textarea>';
    el.addEventListener('dragstart', function(e) {
      snDragId = note.id;
      e.dataTransfer.setData('text/plain', note.id);
      setTimeout(function() { el.style.opacity = '0.4'; }, 0);
    });
    el.addEventListener('dragend', function(e) {
      el.style.opacity = '1';
    });
    el.addEventListener('dragover', function(e) { e.preventDefault(); });
    el.addEventListener('drop', function(e) {
      e.preventDefault();
      if (snDragId && snDragId !== note.id) {
        var from = snNotes.findIndex(function(n) { return n.id === snDragId; });
        var to = snNotes.findIndex(function(n) { return n.id === note.id; });
        if (from > -1 && to > -1) {
          var moved = snNotes.splice(from, 1)[0];
          snNotes.splice(to, 0, moved);
          snSave();
          snRender();
        }
      }
    });
    board.appendChild(el);
  });
}

function snEdit(id, val) {
  var n = snNotes.find(function(x) { return x.id === id; });
  if (n) { n.text = val; snSave(); }
}

function snSetColor(id, color) {
  var n = snNotes.find(function(x) { return x.id === id; });
  if (n) { n.color = color; snSave(); snRender(); }
}

function snTogglePin(id) {
  var n = snNotes.find(function(x) { return x.id === id; });
  if (n) { n.pinned = !n.pinned; snSave(); snRender(); }
}

function snDelNote(id) {
  snNotes = snNotes.filter(function(x) { return x.id !== id; });
  snSave();
  snRender();
}

function snClearAll() {
  if (snNotes.length === 0) { showToast('⚠️ 没有便签可清空'); return; }
  if (confirm('确定要清空所有便签吗？')) {
    snNotes = [];
    snSave();
    snRender();
    showToast('🗑️ 已清空全部便签');
  }
}

function snExport() {
  var blob = new Blob([JSON.stringify(snNotes, null, 2)], { type: 'application/json' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = '便签备份_' + new Date().toISOString().slice(0, 10) + '.json';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('✅ 已导出备份');
}
// ============================================================
// 图片异形裁剪 处理函数 (替代付费 Canva Pro 异形裁剪)
// ============================================================
var scImg = null;

function scInit() {
  // 无额外初始化，等待用户选择图片
}

function scLoadFile(input) {
  if (!input.files || !input.files[0]) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    scImg = new Image();
    scImg.onload = function() {
      document.getElementById('sc-save-btn').disabled = false;
      document.getElementById('sc-tip').textContent = '原图 ' + scImg.width + '×' + scImg.height + 'px — 裁剪为异形';
      scRender();
      showToast('✅ 图片已加载');
    };
    scImg.src = e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
}

function scRender() {
  var canvas = document.getElementById('sc-canvas');
  if (!canvas || !scImg) return;
  var size = parseInt(document.getElementById('sc-size').value, 10);
  var shape = document.getElementById('sc-shape').value;
  var bg = document.getElementById('sc-bg').value;
  canvas.width = size;
  canvas.height = size;
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);

  // 背景
  if (bg === 'white') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, size, size); }
  else if (bg === 'black') { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, size, size); }
  else if (bg === 'gradient') {
    var g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0, '#6366f1');
    g.addColorStop(1, '#ec4899');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }

  // 裁剪路径
  ctx.save();
  ctx.beginPath();
  var cx = size / 2, cy = size / 2;
  if (shape === 'circle') {
    ctx.arc(cx, cy, size / 2 - 2, 0, Math.PI * 2);
  } else if (shape === 'heart') {
    ctx.moveTo(cx, cy + size * 0.34);
    ctx.bezierCurveTo(cx - size * 0.5, cy - size * 0.08, cx - size * 0.21, cy - size * 0.42, cx, cy - size * 0.12);
    ctx.bezierCurveTo(cx + size * 0.21, cy - size * 0.42, cx + size * 0.5, cy - size * 0.08, cx, cy + size * 0.34);
  } else if (shape === 'star') {
    var spikes = 5, outer = size * 0.46, inner = size * 0.19;
    for (var i = 0; i < spikes * 2; i++) {
      var r = (i % 2 === 0) ? outer : inner;
      var a = (Math.PI / spikes) * i - Math.PI / 2;
      var px = cx + r * Math.cos(a), py = cy + r * Math.sin(a);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
  } else if (shape === 'diamond') {
    ctx.moveTo(cx, 2); ctx.lineTo(size - 2, cy); ctx.lineTo(cx, size - 2); ctx.lineTo(2, cy);
    ctx.closePath();
  } else if (shape === 'hexagon') {
    for (var hi = 0; hi < 6; hi++) {
      var ang = Math.PI / 3 * hi + Math.PI / 6;
      var hx = cx + size * 0.46 * Math.cos(ang), hy = cy + size * 0.46 * Math.sin(ang);
      if (hi === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
  } else if (shape === 'leaf') {
    ctx.moveTo(cx, 2);
    ctx.bezierCurveTo(cx + size * 0.48, cy - size * 0.12, cx + size * 0.48, cy + size * 0.12, cx, size - 2);
    ctx.bezierCurveTo(cx - size * 0.48, cy + size * 0.12, cx - size * 0.48, cy - size * 0.12, cx, 2);
  }
  ctx.closePath();
  ctx.clip();

  // 绘制图片（cover模式）
  var imgRatio = scImg.width / scImg.height;
  var canvasRatio = size / size; // 1
  var drawW, drawH, dx, dy;
  if (imgRatio > canvasRatio) {
    drawH = size; drawW = size * imgRatio; dx = (size - drawW) / 2; dy = 0;
  } else {
    drawW = size; drawH = size / imgRatio; dx = 0; dy = (size - drawH) / 2;
  }
  ctx.drawImage(scImg, dx, dy, drawW, drawH);
  ctx.restore();

  // 边框
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 4;
  ctx.stroke();
}

function scSave() {
  var canvas = document.getElementById('sc-canvas');
  if (!canvas) return;
  var link = document.createElement('a');
  link.download = '异形裁剪_' + document.getElementById('sc-shape').value + '_' + Date.now() + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('✅ 已下载透明背景PNG');
}

// ============================================================
// 音频波形可视化 处理函数 (替代付费 Adobe Audition)
// ============================================================
var awAudioBuffer = null;
var awAudioCtx = null;
var awAudioSrc = null;
var awAudioUrl = null;
var awPlaying = false;

function awInit() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
}

function awLoadFile(input) {
  if (!input.files || !input.files[0]) return;
  var file = input.files[0];
  awAudioUrl = URL.createObjectURL(file);
  if (!awAudioCtx) awAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var reader = new FileReader();
  reader.onload = function(e) {
    awAudioCtx.decodeAudioData(e.target.result, function(buffer) {
      awAudioBuffer = buffer;
      document.getElementById('aw-save-btn').disabled = false;
      document.getElementById('aw-play-btn').disabled = false;
      document.getElementById('aw-info').textContent = '音频时长 ' + buffer.duration.toFixed(1) + ' 秒 — 已生成波形图';
      awRender();
      showToast('✅ 音频分析完成');
    }, function(err) {
      showToast('⚠️ 音频解码失败，请换一个文件');
    });
  };
  reader.readAsArrayBuffer(file);
}

function awRender() {
  var canvas = document.getElementById('aw-canvas');
  if (!canvas || !awAudioBuffer) return;
  canvas.width = 640;
  canvas.height = 200;
  var ctx = canvas.getContext('2d');
  var color = document.getElementById('aw-color').value;
  var style = document.getElementById('aw-style').value;
  var line = document.getElementById('aw-line').value;

  if (style === 'dark') { ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, 640, 200); }
  else if (style === 'light') { ctx.fillStyle = '#f8fafc'; ctx.fillRect(0, 0, 640, 200); }
  else if (style === 'gradient') {
    var g = ctx.createLinearGradient(0, 0, 640, 0);
    g.addColorStop(0, '#6366f1'); g.addColorStop(0.5, '#a855f7'); g.addColorStop(1, '#ec4899');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 640, 200);
  }

  var data = awAudioBuffer.getChannelData(0);
  var step = Math.ceil(data.length / 640);
  var amp = 80;

  if (line === 'bars') {
    for (var x = 0; x < 640; x++) {
      var min = 1, max = -1;
      for (var i = x * step; i < Math.min((x + 1) * step, data.length); i++) {
        var v = data[i];
        if (v < min) min = v;
        if (v > max) max = v;
      }
      var barH = Math.max(2, (max - min) * amp * 1.8);
      ctx.fillStyle = color;
      ctx.fillRect(x, 100 - barH / 2, 2, barH);
    }
  } else if (line === 'line') {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    for (var lx = 0; lx < 640; lx++) {
      var avg = 0, count = 0;
      for (var li = lx * step; li < Math.min((lx + 1) * step, data.length); li++) {
        avg += Math.abs(data[li]); count++;
      }
      if (count > 0) avg /= count;
      var ly = 100 - avg * amp * 1.5;
      if (lx === 0) ctx.moveTo(lx, ly); else ctx.lineTo(lx, ly);
    }
    ctx.stroke();
  } else { // mirror 镜像
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    for (var mx = 0; mx < 640; mx++) {
      var mavg = 0, mcount = 0;
      for (var mi = mx * step; mi < Math.min((mx + 1) * step, data.length); mi++) {
        mavg += data[mi]; mcount++;
      }
      if (mcount > 0) mavg /= mcount;
      var my = 100 - mavg * amp;
      if (mx === 0) ctx.moveTo(mx, my); else ctx.lineTo(mx, my);
    }
    ctx.stroke();
    ctx.beginPath();
    for (var mx2 = 0; mx2 < 640; mx2++) {
      var mavg2 = 0, mcount2 = 0;
      for (var mi2 = mx2 * step; mi2 < Math.min((mx2 + 1) * step, data.length); mi2++) {
        mavg2 += data[mi2]; mcount2++;
      }
      if (mcount2 > 0) mavg2 /= mcount2;
      var my2 = 100 - mavg2 * amp * -1;
      if (mx2 === 0) ctx.moveTo(mx2, my2); else ctx.lineTo(mx2, my2);
    }
    ctx.stroke();
  }
}

function awPlayToggle() {
  if (!awAudioBuffer) return;
  var btn = document.getElementById('aw-play-btn');
  if (awPlaying) {
    awAudioSrc.stop();
    awPlaying = false;
    btn.innerHTML = '▶️ 播放';
    return;
  }
  if (!awAudioCtx) awAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  awAudioSrc = awAudioCtx.createBufferSource();
  awAudioSrc.buffer = awAudioBuffer;
  awAudioSrc.connect(awAudioCtx.destination);
  awAudioSrc.onended = function() {
    awPlaying = false;
    btn.innerHTML = '▶️ 播放';
  };
  awAudioSrc.start();
  awPlaying = true;
  btn.innerHTML = '⏸️ 暂停';
}

function awSave() {
  var canvas = document.getElementById('aw-canvas');
  if (!canvas) return;
  // 保存前先确保有内容
  awRender();
  var link = document.createElement('a');
  link.download = '音频波形_' + Date.now() + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('✅ 波形图已导出PNG');
}

// ============================================================
// 白噪音发生器 处理函数 (替代付费 Noisli/Rainy Mood)
// ============================================================
var wnCtx = null;
var wnMaster = null;
var wnNodes = {};
var wnPlaying = false;
var wnType = 'white';

function wnInit() {
  wnBuildMixer();
}

function wnBuildMixer() {
  var mixer = document.getElementById('wn-mixer');
  if (!mixer) return;
  var types = [
    { id: 'white', label: '🎚️ 白噪音' },
    { id: 'pink', label: '🌊 粉噪音' },
    { id: 'rain', label: '☔ 雨声' },
    { id: 'pinkrain', label: '🎵 粉暴' },
    { id: 'all', label: '🌙 全部混合' }
  ];
  mixer.innerHTML = '';
  types.forEach(function(t) {
    var btn = document.createElement('button');
    btn.className = 'btn btn-secondary';
    btn.style.margin = '0';
    btn.id = 'wn-type-' + t.id;
    btn.textContent = t.label;
    btn.onclick = function() { wnSetType(t.id); };
    mixer.appendChild(btn);
  });
  wnSetType('white');
}

function wnEnsureCtx() {
  if (!wnCtx) {
    wnCtx = new (window.AudioContext || window.webkitAudioContext)();
    wnMaster = wnCtx.createGain();
    wnMaster.gain.value = 0.5;
    wnMaster.connect(wnCtx.destination);
  }
  if (wnCtx.state === 'suspended') wnCtx.resume();
  return wnCtx;
}

function wnSetType(type) {
  wnType = type;
  ['white','pink','rain','pinkrain','all'].forEach(function(t) {
    var b = document.getElementById('wn-type-' + t);
    if (b) {
      if (t === type) { b.classList.remove('btn-secondary'); b.classList.add('btn-primary'); }
      else { b.classList.remove('btn-primary'); b.classList.add('btn-secondary'); }
    }
  });
  if (wnPlaying) wnBuild();
}

function wnToggle() {
  var btn = document.getElementById('wn-toggle');
  if (wnPlaying) {
    wnStop();
    btn.innerHTML = '▶️ 播放噪音';
    btn.classList.remove('btn-secondary'); btn.classList.add('btn-primary');
  } else {
    wnEnsureCtx();
    wnBuild();
    wnPlaying = true;
    btn.innerHTML = '⏸️ 暂停';
    btn.classList.remove('btn-primary'); btn.classList.add('btn-secondary');
  }
}

function wnBuild() {
  // 停止旧节点
  Object.keys(wnNodes).forEach(function(k) {
    try { wnNodes[k].stop(); } catch(e) {}
  });
  wnNodes = {};

  var ctx = wnEnsureCtx();
  var bufferSize = 2 * ctx.sampleRate;
  var rainGain = ctx.createGain();
  rainGain.gain.value = parseFloat(document.getElementById('wn-rain') ? document.getElementById('wn-rain').value : 0) / 100;
  rainGain.connect(wnMaster);

  function makeNoiseBuffer() {
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    var lastOut = 0;
    for (var i = 0; i < bufferSize; i++) {
      var white = Math.random() * 2 - 1;
      if (wnType === 'white') {
        data[i] = white;
      } else if (wnType === 'pink' || wnType === 'pinkrain' || wnType === 'all') {
        // Paul Kellet 粉噪音近似
        lastOut = (lastOut + (0.02 * white)) / 1.02;
        data[i] = white * 0.8 + lastOut * 60;
      } else if (wnType === 'rain' || wnType === 'all') {
        // 雨声：低通白噪
        data[i] = white * 0.15;
      }
    }
    return buffer;
  }

  function playNoise(name, gainVal) {
    var src = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer();
    src.loop = true;
    var g = ctx.createGain();
    g.gain.value = gainVal;
    // 雨声加低通滤波
    if (name === 'rain' || wnType === 'rain' || wnType === 'pinkrain' || (wnType === 'all' && name === 'rain')) {
      var filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1200;
      src.connect(filter);
      filter.connect(g);
    } else {
      src.connect(g);
    }
    if (name === 'rain' && (wnType === 'pinkrain' || wnType === 'all')) {
      g.connect(rainGain);
      // 雨声不受 rain slider 影响时保持固定
    } else {
      g.connect(wnMaster);
    }
    src.start();
    wnNodes[name] = src;
  }

  if (wnType === 'white') playNoise('white', 0.45);
  else if (wnType === 'pink') playNoise('pink', 0.4);
  else if (wnType === 'rain') playNoise('rain', 0.9);
  else if (wnType === 'pinkrain') { playNoise('pink', 0.3); playNoise('rain', 0.9); }
  else if (wnType === 'all') { playNoise('white', 0.2); playNoise('pink', 0.25); playNoise('rain', 0.9); }
}

function wnVolume() {
  var v = document.getElementById('wn-volume').value / 100;
  var val = document.getElementById('wn-vol-val');
  if (val) val.textContent = Math.round(v * 100) + '%';
  if (wnMaster) wnMaster.gain.value = v;
}

function wnMix() {
  // 雨声强度调节（all 模式）
  if (wnPlaying && wnNodes['rain'] && wnType === 'all') {
    var g = wnNodes['rain'].gain || null;
  }
  wnBuild();
}

function wnStop() {
  Object.keys(wnNodes).forEach(function(k) {
    try { wnNodes[k].stop(); } catch(e) {}
  });
  wnNodes = {};
  wnPlaying = false;
}

function wnStopAll() {
  wnStop();
  var btn = document.getElementById('wn-toggle');
  if (btn) {
    btn.innerHTML = '▶️ 播放噪音';
    btn.classList.remove('btn-secondary'); btn.classList.add('btn-primary');
  }
}

// ============================================================
// 图片马赛克打码 处理函数 (替代付费打码工具)
// ============================================================
var mbImg = null;
var mbCanvas = null;
var mbCtx = null;
var mbDrawing = false;
var mbLastX = 0, mbLastY = 0;
var mbBrush = 'code';
var mbUndoStack = [];

function mbInit() {
  var c = document.getElementById('mb-canvas');
  if (!c) return;
  mbCanvas = c;
  mbCtx = c.getContext('2d');
  mbBindEvents();
  var modeSel = document.getElementById('mb-mode');
  if (modeSel) modeSel.onchange = function() { mbSetBrush(mbBrush === 'erase' ? 'erase' : 'code'); };
}

function mbLoadFile(input) {
  if (!input.files || !input.files[0]) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    mbImg = new Image();
    mbImg.onload = function() {
      var maxW = 800;
      var scale = Math.min(1, maxW / mbImg.width);
      mbCanvas.width = mbImg.width * scale;
      mbCanvas.height = mbImg.height * scale;
      mbCanvas.style.display = 'block';
      mbCtx.drawImage(mbImg, 0, 0, mbCanvas.width, mbCanvas.height);
      mbUndoStack = [];
      document.getElementById('mb-tip').textContent = '🖱️ 按住鼠标涂抹需要打码的区域';
      showToast('✅ 图片已加载，开始涂抹打码');
    };
    mbImg.src = e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
}

function mbSetBrush(b) {
  mbBrush = b;
  var btns = document.querySelectorAll('#mb-canvas');
  // 简单切换按钮状态
  var codeBtn = document.querySelectorAll('button');
  showToast(b === 'erase' ? '🧽 擦除模式：涂抹恢复原图' : '🎨 涂抹模式：开始打码');
}

function mbPos(e) {
  var rect = mbCanvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * (mbCanvas.width / rect.width),
    y: (e.clientY - rect.top) * (mbCanvas.height / rect.height)
  };
}

function mbStart(e) {
  if (!mbImg) return;
  e.preventDefault();
  mbDrawing = true;
  var p = mbPos(e);
  mbLastX = p.x; mbLastY = p.y;
  // 保存快照用于撤销
  mbUndoStack.push(mbCtx.getImageData(0, 0, mbCanvas.width, mbCanvas.height));
  if (mbUndoStack.length > 8) mbUndoStack.shift();
}

function mbMove(e) {
  if (!mbDrawing || !mbImg) return;
  e.preventDefault();
  var p = mbPos(e);
  var size = parseInt(document.getElementById('mb-size').value, 10);
  var mode = document.getElementById('mb-mode').value;

  if (mbBrush === 'erase' && mbImg) {
    // 擦除：将画笔圆形区域恢复为原图
    mbCtx.save();
    mbCtx.beginPath();
    mbCtx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
    mbCtx.lineTo(p.x + size, p.y);
    mbCtx.closePath();
    mbCtx.clip();
    mbCtx.drawImage(mbImg, 0, 0, mbCanvas.width, mbCanvas.height);
    mbCtx.restore();
    // 沿路径做连续擦除
    mbCtx.save();
    mbCtx.beginPath();
    mbCtx.moveTo(mbLastX, mbLastY);
    mbCtx.lineTo(p.x, p.y);
    mbCtx.lineWidth = size;
    mbCtx.lineCap = 'round';
    mbCtx.strokeStyle = 'white';
    mbCtx.globalCompositeOperation = 'source-in';
    mbCtx.clip();
    mbCtx.drawImage(mbImg, 0, 0, mbCanvas.width, mbCanvas.height);
    mbCtx.restore();
  } else if (mode === 'solid') {
    mbCtx.fillStyle = '#000000';
    mbCtx.beginPath();
    mbCtx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
    mbCtx.fill();
    mbCtx.beginPath();
    mbCtx.moveTo(mbLastX, mbLastY);
    mbCtx.lineTo(p.x, p.y);
    mbCtx.lineWidth = size;
    mbCtx.lineCap = 'round';
    mbCtx.stroke();
  } else if (mode === 'blur') {
    // 高斯模糊简化：较重的半透明堆叠
    mbCtx.filter = 'blur(14px)';
    mbCtx.drawImage(mbCanvas, 0, 0);
    mbCtx.filter = 'none';
    mbCtx.beginPath();
    mbCtx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
    mbCtx.fillStyle = 'rgba(0,0,0,0.15)';
    mbCtx.fill();
  } else {
    // mosaic 马赛克：像素块
    var block = size / 2;
    var bx = Math.floor(p.x / block) * block;
    var by = Math.floor(p.y / block) * block;
    for (var dx = -2; dx <= 2; dx++) {
      for (var dy = -2; dy <= 2; dy++) {
        var cx = bx + dx * block;
        var cy = by + dy * block;
        if (cx < 0 || cy < 0 || cx + block > mbCanvas.width || cy + block > mbCanvas.height) continue;
        var imgData = mbCtx.getImageData(cx, cy, block, block);
        var r = 0, g = 0, b = 0, count = 0;
        for (var i = 0; i < imgData.data.length; i += 4) {
          r += imgData.data[i]; g += imgData.data[i+1]; b += imgData.data[i+2]; count++;
        }
        r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count);
        mbCtx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
        mbCtx.fillRect(cx, cy, block, block);
      }
    }
  }
  mbLastX = p.x; mbLastY = p.y;
}

function mbEnd(e) {
  mbDrawing = false;
}

function mbUndo() {
  if (mbUndoStack.length === 0) { showToast('⚠️ 没有可撤销的操作'); return; }
  var imgData = mbUndoStack.pop();
  mbCtx.putImageData(imgData, 0, 0);
  showToast('↩️ 已撤销');
}

function mbReset() {
  if (!mbImg) return;
  mbUndoStack = [];
  mbCtx.drawImage(mbImg, 0, 0, mbCanvas.width, mbCanvas.height);
  showToast('🔄 已重置');
}

function mbExport() {
  if (!mbCanvas) return;
  var link = document.createElement('a');
  link.download = '打码图片_' + Date.now() + '.png';
  link.href = mbCanvas.toDataURL('image/png');
  link.click();
  showToast('✅ 已导出打码PNG');
}

// 绑定画布事件（在工具打开时调用）
function mbBindEvents() {
  var c = document.getElementById('mb-canvas');
  if (!c) return;
  c.addEventListener('mousedown', mbStart);
  c.addEventListener('mousemove', mbMove);
  c.addEventListener('mouseup', mbEnd);
  c.addEventListener('mouseleave', mbEnd);
  c.addEventListener('touchstart', function(e) { e.preventDefault(); var t = e.touches[0]; mbStart({clientX: t.clientX, clientY: t.clientY, preventDefault: function(){}}); });
  c.addEventListener('touchmove', function(e) { e.preventDefault(); var t = e.touches[0]; mbMove({clientX: t.clientX, clientY: t.clientY, preventDefault: function(){}}); });
  c.addEventListener('touchend', mbEnd);
}

// ============================================================
// 双色调滤镜 处理函数 (替代付费 VSCO/Prisma 双色滤镜)
// ============================================================
var dtImg = null;
var dtCanvas = null;
var dtCtx = null;

function dtInit() {
  var c = document.getElementById('dt-canvas');
  if (c) { dtCanvas = c; dtCtx = c.getContext('2d'); }
}

function dtLoadFile(input) {
  if (!input.files || !input.files[0]) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    dtImg = new Image();
    dtImg.onload = function() {
      var maxW = 900;
      var scale = Math.min(1, maxW / dtImg.width);
      dtCanvas.width = dtImg.width * scale;
      dtCanvas.height = dtImg.height * scale;
      dtCanvas.style.display = 'block';
      dtCtx.drawImage(dtImg, 0, 0, dtCanvas.width, dtCanvas.height);
      document.getElementById('dt-tip').textContent = '✅ 图片已加载，调节颜色或选择预设生成双色海报';
      dtRender();
      showToast('✅ 图片已加载');
    };
    dtImg.src = e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
}

function dtPreset() {
  var p = document.getElementById('dt-preset').value;
  var presets = {
    sunset: ['#f97316', '#8b5cf6'],
    ocean: ['#0ea5e9', '#14b8a6'],
    neon: ['#a855f7', '#ec4899'],
    mint: ['#22c55e', '#06b6d4'],
    mono: ['#ffffff', '#000000']
  };
  if (presets[p]) {
    document.getElementById('dt-c1').value = presets[p][0];
    document.getElementById('dt-c2').value = presets[p][1];
    dtRender();
  }
}

function dtRender() {
  if (!dtImg || !dtCtx) return;
  var c1 = document.getElementById('dt-c1').value;
  var c2 = document.getElementById('dt-c2').value;
  // 解析颜色
  function hex2rgb(h) {
    var r = parseInt(h.slice(1,3), 16), g = parseInt(h.slice(3,5), 16), b = parseInt(h.slice(5,7), 16);
    return [r, g, b];
  }
  var hi = hex2rgb(c1); // 高光色
  var lo = hex2rgb(c2); // 阴影色
  var imgData = dtCtx.getImageData(0, 0, dtCanvas.width, dtCanvas.height);
  var data = imgData.data;
  for (var i = 0; i < data.length; i += 4) {
    var lum = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
    var t = lum / 255;
    data[i]     = Math.round(lo[0] + (hi[0] - lo[0]) * t);
    data[i + 1] = Math.round(lo[1] + (hi[1] - lo[1]) * t);
    data[i + 2] = Math.round(lo[2] + (hi[2] - lo[2]) * t);
  }
  dtCtx.putImageData(imgData, 0, 0);
}

function dtExport() {
  if (!dtCanvas) return;
  dtRender();
  var link = document.createElement('a');
  link.download = '双色调_' + Date.now() + '.png';
  link.href = dtCanvas.toDataURL('image/png');
  link.click();
  showToast('✅ 双色调海报已导出');
}

// ============================================================
// 图片转字符画 处理函数 (替代付费 ASCII 生成器)
// ============================================================
var aaImg = null;
var aaCanvas = null;
var aaPlainText = '';
var aaColorMode = 'bw';
var aaColorGrid = [];  // 二维: aaColorGrid[y][x] = 'rgb(...)' 或 null

function aaInit() {
  aaCanvas = document.createElement('canvas');
}

function aaLoadFile(input) {
  if (!input.files || !input.files[0]) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    aaImg = new Image();
    aaImg.onload = function() {
      aaRender();
      showToast('✅ 字符画已生成');
    };
    aaImg.src = e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
}

function aaRender() {
  if (!aaImg) return;
  var density = document.getElementById('aa-density').value;
  var colorMode = document.getElementById('aa-color').value;
  var charset = document.getElementById('aa-charset').value;
  aaColorMode = colorMode;
  var chars;
  if (charset === 'block') chars = ' ░▒▓█';
  else if (charset === 'standard') chars = ' .,:;irsXA253hMHGS#9B&@';
  else chars = " $@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~i!lI;:,^`'.";
  chars = chars.split('').reverse().join('');

  // 计算字符画网格尺寸
  var cols, rows;
  if (density === 'low') cols = 200;
  else if (density === 'mid') cols = 120;
  else cols = 70;
  var aspect = aaImg.height / aaImg.width;
  rows = Math.round(cols * aspect * 0.5);

  aaCanvas.width = cols;
  aaCanvas.height = rows;
  var ctx = aaCanvas.getContext('2d');
  ctx.drawImage(aaImg, 0, 0, cols, rows);
  var imgData = ctx.getImageData(0, 0, cols, rows);
  var data = imgData.data;

  var out = '';
  aaPlainText = '';
  aaColorGrid = [];
  for (var y = 0; y < rows; y++) {
    var lineText = '';
    var lineColors = [];
    for (var x = 0; x < cols; x++) {
      var idx = (y * cols + x) * 4;
      var r = data[idx], g = data[idx+1], b = data[idx+2];
      var lum = 0.299 * r + 0.587 * g + 0.114 * b;
      var ci = Math.min(chars.length - 1, Math.floor(lum / 255 * (chars.length - 1)));
      var ch = chars[ci];
      if (colorMode === 'color') {
        out += '<span style="color:rgb(' + r + ',' + g + ',' + b + ')">' + ch + '</span>';
        lineColors.push('rgb(' + r + ',' + g + ',' + b + ')');
      } else {
        out += ch;
        lineColors.push(null);
      }
      lineText += ch;
    }
    out += '\n';
    aaPlainText += lineText + '\n';
    aaColorGrid.push(lineColors);
  }
  var pre = document.getElementById('aa-output');
  if (colorMode === 'color') {
    pre.innerHTML = out;
    pre.style.color = '#e0e0e0';
  } else {
    pre.textContent = out;
  }
}

function aaCopy() {
  if (!aaPlainText || aaPlainText.trim().length === 0) { showToast('⚠️ 请先选择图片'); return; }
  var clean = aaPlainText.split('\n').filter(function(l) { return l.trim().length > 0; }).join('\n');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(clean).then(function() {
      showToast('📋 字符画已复制');
    });
  } else {
    var ta = document.createElement('textarea');
    ta.value = clean;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('📋 字符画已复制');
  }
}

function aaExport() {
  if (!aaPlainText || aaPlainText.trim().length === 0) { showToast('⚠️ 请先选择图片'); return; }
  var lines = aaPlainText.split('\n').filter(function(l) { return l.trim().length > 0; });
  var maxLen = 0;
  lines.forEach(function(l) { if (l.length > maxLen) maxLen = l.length; });
  var charW = 10, charH = 14;
  var canvas = document.createElement('canvas');
  canvas.width = maxLen * charW;
  canvas.height = lines.length * charH;
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0f0f1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '12px monospace';
  ctx.textBaseline = 'top';
  var isColor = (aaColorMode === 'color');
  lines.forEach(function(l, i) {
    var colors = aaColorGrid[i] || [];
    for (var x = 0; x < l.length; x++) {
      var col = colors[x];
      if (isColor && col) ctx.fillStyle = col;
      else ctx.fillStyle = '#e0e0e0';
      ctx.fillText(l[x], x * charW, i * charH);
    }
  });
  var link = document.createElement('a');
  link.download = '字符画_' + Date.now() + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  showToast('✅ 字符画已导出PNG');
}

// ============================================================
// 番茄钟专注计时器 处理函数 (灵感来源: Forest / 番茄Todo)
// ============================================================
var ptTimer = null, ptRemaining = 0, ptTotal = 0, ptMode = 'focus', ptPhaseCount = 0, ptRunning = false;
var PT_RING = 578; // 2*PI*92

function ptInit() {
  ptLoadCount();
  var focus = parseInt(localStorage.getItem('pt_focus') || '25');
  var brk = parseInt(localStorage.getItem('pt_break') || '5');
  var elF = document.getElementById('pt-focus'), elB = document.getElementById('pt-break');
  if (elF) elF.value = focus;
  if (elB) elB.value = brk;
  ptMode = 'focus';
  ptTotal = focus * 60;
  ptRemaining = ptTotal;
  ptUpdateUI(false);
}

function ptLoadCount() {
  var n = parseInt(localStorage.getItem('pt_count') || '0');
  var day = localStorage.getItem('pt_day');
  var today = new Date().toDateString();
  if (day !== today) { n = 0; localStorage.setItem('pt_day', today); localStorage.setItem('pt_count', '0'); }
  var el = document.getElementById('pt-count');
  if (el) el.textContent = n + ' 🍅';
}

function ptToggle() {
  if (ptRunning) {
    clearInterval(ptTimer);
    ptRunning = false;
    document.getElementById('pt-start').textContent = '▶️ 继续';
  } else {
    if (ptRemaining <= 0) { ptReset(); }
    ptTimer = setInterval(ptTick, 1000);
    ptRunning = true;
    document.getElementById('pt-start').textContent = '⏸️ 暂停';
  }
}

function ptTick() {
  ptRemaining--;
  if (ptRemaining <= 0) {
    ptRemaining = 0;
    ptFinish();
  }
  ptUpdateUI(true);
}

function ptFinish() {
  clearInterval(ptTimer);
  ptRunning = false;
  document.getElementById('pt-start').textContent = '▶️ 开始';
  ptBeep();
  if (ptMode === 'focus') {
    var n = parseInt(localStorage.getItem('pt_count') || '0') + 1;
    localStorage.setItem('pt_count', String(n));
    localStorage.setItem('pt_day', new Date().toDateString());
    ptLoadCount();
    ptPhaseCount++;
    var longEvery = parseInt(document.getElementById('pt-long') ? document.getElementById('pt-long').value : '4');
    if (ptPhaseCount >= longEvery) {
      ptPhaseCount = 0;
      ptMode = 'long';
      ptTotal = (parseInt(document.getElementById('pt-break') ? document.getElementById('pt-break').value : '5') * 3);
      showToast('✅ 专注完成！进入长休息 ' + Math.round(ptTotal/60) + ' 分钟');
    } else {
      ptMode = 'break';
      ptTotal = (parseInt(document.getElementById('pt-break') ? document.getElementById('pt-break').value : '5') * 60);
      showToast('✅ 专注完成！休息 ' + Math.round(ptTotal/60) + ' 分钟');
    }
    localStorage.setItem('pt_break', String(Math.round(ptTotal/60)));
  } else {
    ptMode = 'focus';
    ptTotal = (parseInt(document.getElementById('pt-focus') ? document.getElementById('pt-focus').value : '25') * 60);
    showToast('✅ 休息结束，开始新一轮专注！');
  }
  ptRemaining = ptTotal;
  ptUpdateUI(false);
}

function ptReset() {
  clearInterval(ptTimer);
  ptRunning = false;
  document.getElementById('pt-start').textContent = '▶️ 开始';
  ptTotal = ptMode === 'focus'
    ? (parseInt(document.getElementById('pt-focus') ? document.getElementById('pt-focus').value : '25') * 60)
    : (parseInt(document.getElementById('pt-break') ? document.getElementById('pt-break').value : '5') * 60);
  ptRemaining = ptTotal;
  ptUpdateUI(false);
}

function ptApply() {
  if (ptMode === 'focus') {
    ptTotal = (parseInt(document.getElementById('pt-focus').value || '25') * 60);
    localStorage.setItem('pt_focus', document.getElementById('pt-focus').value);
  } else {
    ptTotal = (parseInt(document.getElementById('pt-break').value || '5') * 60);
    localStorage.setItem('pt_break', document.getElementById('pt-break').value);
  }
  if (!ptRunning) {
    ptRemaining = ptTotal;
    ptUpdateUI(false);
  }
}

function ptUpdateUI(animate) {
  var mm = Math.floor(ptRemaining / 60);
  var ss = ptRemaining % 60;
  var elT = document.getElementById('pt-time');
  var elP = document.getElementById('pt-progress');
  var elM = document.getElementById('pt-mode-tag');
  if (elT) elT.textContent = (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss;
  if (elP) {
    var frac = ptTotal > 0 ? (ptRemaining / ptTotal) : 0;
    elP.style.strokeDashoffset = String(PT_RING * (1 - frac));
  }
  if (elM) {
    if (ptMode === 'focus') { elM.textContent = '🍅 专注中'; elP && (elP.style.stroke = '#f97316'); }
    else if (ptMode === 'long') { elM.textContent = '🌿 长休息'; elP && (elP.style.stroke = '#10b981'); }
    else { elM.textContent = '☕ 休息中'; elP && (elP.style.stroke = '#0ea5e9'); }
  }
  if (ptRemaining <= 0 && elM) { elM.textContent = ptMode === 'focus' ? '🍅 准备开始' : '☕ 准备休息'; }
}

function ptBeep() {
  try {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    var ctx = new Ctx();
    [880, 660, 880, 1100].forEach(function(f, i) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.25);
      g.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + i * 0.25 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.25 + 0.22);
      o.connect(g); g.connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.25); o.stop(ctx.currentTime + i * 0.25 + 0.25);
    });
  } catch (e) {}
}

// ============================================================
// 照片卡通化 处理函数 (灵感来源: ToonMe / 美图动漫化)
// ============================================================
var pccCanvas = null, pccCtx = null, pccSrcImg = null, pccSrcData = null;

function pccInit() {
  pccCanvas = document.getElementById('pcc-canvas');
  if (!pccCanvas) return;
  pccCtx = pccCanvas.getContext('2d');
}

function pccLoad(input) {
  var f = input.files && input.files[0];
  if (!f) return;
  var img = new Image();
  img.onload = function() {
    pccSrcImg = img;
    pccSrcData = null;
    var w = img.width, h = img.height;
    var maxW = 1000;
    if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
    pccCanvas.width = w;
    pccCanvas.height = h;
    pccCtx.drawImage(img, 0, 0, w, h);
    pccSrcData = pccCtx.getImageData(0, 0, w, h);
    pccCanvas.style.display = 'block';
    document.getElementById('pcc-tip').textContent = '✅ 图片已加载，拖动滑块或点击预设调整卡通效果';
    pccRender();
  };
  img.onerror = function() { showToast('⚠️ 图片加载失败，请换一张试试'); };
  img.src = URL.createObjectURL(f);
}

function pccPreset(name) {
  var p = { flat: [8, 40, 110], manga: [5, 75, 135], retro: [4, 25, 70], bold: [3, 95, 100] }[name];
  if (!p) return;
  document.getElementById('pcc-levels').value = p[0];
  document.getElementById('pcc-edge').value = p[1];
  document.getElementById('pcc-sat').value = p[2];
  document.getElementById('pcc-levels-val').textContent = p[0];
  document.getElementById('pcc-edge-val').textContent = p[1];
  document.getElementById('pcc-sat-val').textContent = p[2] + '%';
  pccRender();
}

function pccRender() {
  if (!pccSrcData) return;
  var levels = parseInt(document.getElementById('pcc-levels').value) || 8;
  var edge = parseInt(document.getElementById('pcc-edge').value) || 40;
  var sat = (parseInt(document.getElementById('pcc-sat').value) || 110) / 100;
  var src = pccSrcData.data;
  var w = pccSrcData.width, h = pccSrcData.height;
  var out = pccCtx.createImageData(w, h);
  var od = out.data;
  var step = 255 / (levels - 1);
  var gray = new Uint8Array(w * h);
  // 第一步：灰度图（用于边缘检测）
  for (var i = 0; i < w * h; i++) {
    var r = src[i*4], g = src[i*4+1], b = src[i*4+2];
    gray[i] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }
  // 第二步：颜色量化 + 饱和度 + Sobel 边缘
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var idx = (y * w + x) * 4;
      var r = src[idx], g = src[idx+1], b = src[idx+2];
      // 饱和度调整
      var gr = Math.round(0.299*r + 0.587*g + 0.114*b);
      r = Math.max(0, Math.min(255, Math.round(gr + (r - gr) * sat)));
      g = Math.max(0, Math.min(255, Math.round(gr + (g - gr) * sat)));
      b = Math.max(0, Math.min(255, Math.round(gr + (b - gr) * sat)));
      // 颜色量化
      r = Math.round(Math.round(r / step) * step);
      g = Math.round(Math.round(g / step) * step);
      b = Math.round(Math.round(b / step) * step);
      od[idx] = r; od[idx+1] = g; od[idx+2] = b; od[idx+3] = 255;
    }
  }
  // 第三步：Sobel 边缘叠加
  if (edge > 0) {
    var thresh = 255 - edge * 2.0;
    for (var y2 = 1; y2 < h - 1; y2++) {
      for (var x2 = 1; x2 < w - 1; x2++) {
        var tl = gray[(y2-1)*w + x2-1], t = gray[(y2-1)*w + x2], tr = gray[(y2-1)*w + x2+1];
        var ml = gray[y2*w + x2-1], mr = gray[y2*w + x2+1];
        var bl = gray[(y2+1)*w + x2-1], bm = gray[(y2+1)*w + x2], br = gray[(y2+1)*w + x2+1];
        var gx = (tr + 2*mr + br) - (tl + 2*ml + bl);
        var gy = (bl + 2*bm + br) - (tl + 2*t + tr);
        var mag = Math.sqrt(gx*gx + gy*gy);
        if (mag > thresh) {
          var i2 = (y2 * w + x2) * 4;
          od[i2] = 20; od[i2+1] = 20; od[i2+2] = 20;
        }
      }
    }
  }
  pccCtx.putImageData(out, 0, 0);
}

function pccExport() {
  if (!pccCanvas || pccCanvas.style.display === 'none') { showToast('⚠️ 请先选择一张图片'); return; }
  var a = document.createElement('a');
  a.download = '卡通照片_' + Date.now() + '.png';
  a.href = pccCanvas.toDataURL('image/png');
  a.click();
  showToast('✅ 卡通化图片已导出PNG');
}

// ============================================================
// 条形码生成器 处理函数 (灵感来源: Barcode Generator / TEC-IT)
// ============================================================
var BC_EAN_L = {0:'0001101',1:'0011001',2:'0010011',3:'0111101',4:'0100011',5:'0110001',6:'0101111',7:'0111011',8:'0110111',9:'0001011'};
var BC_EAN_G = {0:'0100111',1:'0110011',2:'0011011',3:'0100001',4:'0011101',5:'0111001',6:'0000101',7:'0010001',8:'0001001',9:'0010111'};
var BC_EAN_R = {0:'1110010',1:'1100110',2:'1101100',3:'1000010',4:'1011100',5:'1001110',6:'1010000',7:'1000100',8:'1001000',9:'1110100'};
var BC_EAN_P = {'0':'LLLLLL','1':'LLGLGG','2':'LLGGLG','3':'LLGGGL','4':'LGLLGG','5':'LGGLLG','6':'LGGGLL','7':'LGLGLG','8':'LGLGGL','9':'LGGLGL'};
var BC_39 = {
 '0':'000110100','1':'100100001','2':'001100001','3':'101100000','4':'000110001','5':'100110000','6':'001110000','7':'000100101','8':'100100100','9':'001100100',
 'A':'100001001','B':'001001001','C':'101001000','D':'000011001','E':'100011000','F':'001011000','G':'000001101','H':'100001100','I':'001001100','J':'000011100',
 'K':'100000011','L':'001000011','M':'101000010','N':'000010011','O':'100010010','P':'001010010','Q':'000000111','R':'100000110','S':'001000110','T':'000010110',
 'U':'110000001','V':'011000001','W':'111000000','X':'010010001','Y':'110010000','Z':'011010000',
 '-':'010000101','.':'110000100',' ':'011000100','$':'010101000','/':'010100010','+':'010001010','%':'000101010','*':'010010100'
};

function bcInit() {
  bcRender();
}

function bcEAN13(value) {
  var digits = String(value).replace(/[^0-9]/g, '').slice(0, 13);
  while (digits.length < 12) digits += '0';
  var raw = digits.slice(0, 12);
  // 计算校验位
  var sum = 0;
  for (var i = 0; i < 12; i++) {
    var d = parseInt(raw[i]);
    sum += (i % 2 === 0) ? d : d * 3;
  }
  var check = (10 - (sum % 10)) % 10;
  digits = raw + String(check);
  // 生成位模式
  var pattern = '101';
  var lead = parseInt(digits[0]);
  var par = BC_EAN_P[lead];
  for (var j = 0; j < 6; j++) {
    var t = parseInt(digits[1 + j]);
    var table = par[j] === 'L' ? BC_EAN_L : BC_EAN_G;
    pattern += table[t];
  }
  pattern += '01010';
  for (var k = 7; k < 13; k++) {
    pattern += BC_EAN_R[parseInt(digits[k])];
  }
  pattern += '101';
  return { pattern: pattern, text: digits };
}

function bcCode39(value) {
  var s = String(value).toUpperCase().replace(/[^0-9A-Z\-. $\/+%]/g, '');
  if (s === '') s = '1234';
  var out = '*';
  var pattern = '';
  for (var i = 0; i < s.length; i++) {
    var c = s[i];
    var code = BC_39[c];
    if (i > 0) pattern += '0'; // 字符间隔(窄空)
    pattern += code;
    out += c;
  }
  pattern += '0' + BC_39['*'];
  out += '*';
  return { pattern: pattern, text: out };
}

function bcRender() {
  var canvas = document.getElementById('bc-canvas');
  if (!canvas) return;
  var type = document.getElementById('bc-type').value;
  var input = document.getElementById('bc-input').value;
  var hSel = parseInt(document.getElementById('bc-height').value) || 90;
  var res;
  if (type === 'ean13') res = bcEAN13(input);
  else res = bcCode39(input);
  var ctx = canvas.getContext('2d');
  var unit = 2; // 每模块宽度
  var pat = res.pattern;
  var wPx = pat.length * unit;
  var textH = 26;
  var padding = 10;
  canvas.width = wPx + padding * 2;
  canvas.height = hSel + textH + padding * 2;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#000000';
  var x = padding;
  for (var b = 0; b < pat.length; b++) {
    if (pat[b] === '1') {
      ctx.fillRect(x, padding, unit, hSel);
    }
    x += unit;
  }
  // 文字
  ctx.fillStyle = '#000000';
  ctx.font = '14px monospace';
  ctx.textAlign = 'center';
  var textY = padding + hSel + 18;
  if (type === 'ean13') {
    ctx.font = '13px monospace';
    ctx.fillText(res.text[0], padding + 12, textY);
    ctx.fillText(res.text.slice(1, 7), padding + 7 * 7 * unit * 0.5 + 8, textY);
    ctx.fillText(res.text.slice(7), padding + 7 * 7 * unit * 1.5 + 8, textY);
  } else {
    ctx.fillText(res.text, canvas.width / 2, textY);
  }
  var tip = document.getElementById('bc-tip');
  if (tip) tip.textContent = '✅ 已生成（' + res.text.length + ' 字符）— 点击下载PNG';
}

function bcDownload() {
  var canvas = document.getElementById('bc-canvas');
  if (!canvas || canvas.width === 0) { showToast('⚠️ 请先输入条码内容'); return; }
  var a = document.createElement('a');
  a.download = '条形码_' + Date.now() + '.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
  showToast('✅ 条形码已导出PNG');
}

// ============================================================
// Favicon图标生成器 处理函数 (灵感来源: Favicon.io / RealFaviconGenerator)
// ============================================================
var favBaseImg = null; // HTMLImageElement
var favBaseCanvas = document.createElement('canvas');

function favInit() {
  favBaseCanvas.width = 512;
  favBaseCanvas.height = 512;
}

function favMode(mode) {
  var imgSec = document.getElementById('fav-image-section');
  var txtSec = document.getElementById('fav-text-section');
  var tip = document.getElementById('fav-tip');
  if (mode === 'image') {
    imgSec.style.display = 'block';
    txtSec.style.display = 'none';
    if (tip) tip.textContent = '选择图片后自动生成全套图标（ICO / PNG）';
  } else {
    imgSec.style.display = 'none';
    txtSec.style.display = 'block';
    if (tip) tip.textContent = '输入文字与配色后自动生成全套图标（ICO / PNG）';
    favTextChange();
  }
}

function favLoad(input) {
  var f = input.files && input.files[0];
  if (!f) return;
  var img = new Image();
  img.onload = function() {
    favBaseImg = img;
    var ctx = favBaseCanvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);
    // 居中裁剪正方形
    var s = Math.min(img.width, img.height);
    var sx = (img.width - s) / 2, sy = (img.height - s) / 2;
    ctx.drawImage(img, sx, sy, s, s, 0, 0, 512, 512);
    favRenderAll();
    if (document.getElementById('fav-tip')) document.getElementById('fav-tip').textContent = '✅ 图标已生成！点击下方按钮下载';
  };
  img.onerror = function() { showToast('⚠️ 图片加载失败'); };
  img.src = URL.createObjectURL(f);
}

function favTextChange() {
  var txt = document.getElementById('fav-text').value || 'TB';
  var bg = document.getElementById('fav-bg').value || '#6366f1';
  var fg = document.getElementById('fav-fg').value || '#ffffff';
  var ctx = favBaseCanvas.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = fg;
  ctx.font = 'bold 300px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // 圆角背景（不画圆角避免复杂，直接画）
  ctx.fillText(txt, 256, 275);
  favRenderAll();
}

function favRenderAll() {
  var sizes = [16, 32, 48, 180, 512];
  var ids = ['fav-p16', 'fav-p32', 'fav-p48', 'fav-p180', 'fav-p512'];
  for (var i = 0; i < sizes.length; i++) {
    var cv = document.getElementById(ids[i]);
    if (!cv) continue;
    var ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, sizes[i], sizes[i]);
    ctx.drawImage(favBaseCanvas, 0, 0, sizes[i], sizes[i]);
  }
  document.getElementById('fav-preview').style.display = 'block';
  document.getElementById('fav-actions').style.display = 'flex';
}

function favCanvasBlob(canvas) {
  return new Promise(function(resolve) {
    canvas.toBlob(function(b) { resolve(b); }, 'image/png');
  });
}

async function favBuildICO() {
  var sizes = [16, 32, 48, 64, 128, 256];
  var blobs = [];
  for (var i = 0; i < sizes.length; i++) {
    var c = document.createElement('canvas');
    c.width = sizes[i]; c.height = sizes[i];
    var ctx = c.getContext('2d');
    ctx.drawImage(favBaseCanvas, 0, 0, sizes[i], sizes[i]);
    var b = await favCanvasBlob(c);
    if (b) blobs.push({ size: sizes[i], data: await b.arrayBuffer() });
  }
  var count = blobs.length;
  var headerSize = 6 + 16 * count;
  var totalSize = headerSize + blobs.reduce(function(s, x) { return s + x.data.byteLength; }, 0);
  var buf = new ArrayBuffer(totalSize);
  var dv = new DataView(buf);
  var off = 0;
  // ICONDIR
  dv.setUint16(0, 0, true); dv.setUint16(2, 1, true); dv.setUint16(4, count, true);
  off = 6;
  var imgOff = headerSize;
  for (var k = 0; k < count; k++) {
    var s = blobs[k].size;
    dv.setUint8(off, s >= 256 ? 0 : s); // width
    dv.setUint8(off + 1, s >= 256 ? 0 : s); // height
    dv.setUint8(off + 2, 0); // palette
    dv.setUint8(off + 3, 0); // reserved
    dv.setUint16(off + 4, 1, true); // planes
    dv.setUint16(off + 6, 32, true); // bpp
    dv.setUint32(off + 8, blobs[k].data.byteLength, true);
    dv.setUint32(off + 12, imgOff, true);
    imgOff += blobs[k].data.byteLength;
    off += 16;
  }
  for (var m = 0; m < count; m++) {
    new Uint8Array(buf).set(new Uint8Array(blobs[m].data), off);
    off += blobs[m].data.byteLength;
  }
  return new Blob([buf], { type: 'image/x-icon' });
}

function favDownloadICO() {
  favBuildICO().then(function(blob) {
    var a = document.createElement('a');
    a.download = 'favicon.ico';
    a.href = URL.createObjectURL(blob);
    a.click();
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 3000);
    showToast('✅ favicon.ico（16-256px 多尺寸）已下载');
  });
}

function favDownloadAll() {
  var sizes = [16, 32, 48, 64, 180, 192, 512];
  var delay = 200;
  sizes.forEach(function(s, i) {
    setTimeout(function() {
      var c = document.createElement('canvas');
      c.width = s; c.height = s;
      var ctx = c.getContext('2d');
      ctx.drawImage(favBaseCanvas, 0, 0, s, s);
      var a = document.createElement('a');
      a.download = 'favicon-' + s + 'x' + s + '.png';
      a.href = c.toDataURL('image/png');
      a.click();
    }, delay * i);
  });
  showToast('✅ 开始下载全部 PNG 尺寸');
}

// ============================================================
// 流程图绘制器 处理函数
// ============================================================
let fcNodes = [];
let fcLinks = [];
let fcSelected = null;
let fcDragging = null;
let fcLinkModeOn = false;
let fcLinkFrom = null;
let fcId = 0;

function fcInit() {
  const wrap = document.getElementById('fc-svg');
  if (!wrap) return;
  // 默认画一个示例流程
  fcClear();
  const start = fcAddNodeData('round', 60, 60, '开始');
  const step = fcAddNodeData('rect', 200, 60, '输入参数');
  const judge = fcAddNodeData('diamond', 320, 140, '验证通过?');
  const ok = fcAddNodeData('rect', 200, 230, '执行成功');
  const no = fcAddNodeData('rect', 440, 210, '返回修改');
  fcAddLinkData(start, step);
  fcAddLinkData(step, judge);
  fcAddLinkData(judge, ok);
  fcAddLinkData(judge, no);
  fcRender();
}

function fcAddNode(type) {
  const n = fcAddNodeData(type, 80 + Math.random() * 260, 60 + Math.random() * 220, type === 'text' ? '文本' : '节点');
  fcRender();
  fcSelectNode(n.id);
}

function fcAddNodeData(type, x, y, label) {
  const n = { id: 'fc' + (++fcId), type: type, x: x, y: y, w: 120, h: 46, label: label, fill: '#2d2d5e', color: '#e6e6f0' };
  if (type === 'diamond') { n.w = 130; n.h = 72; }
  if (type === 'ellipse') { n.w = 130; n.h = 50; }
  if (type === 'text') { n.w = 140; n.h = 40; }
  fcNodes.push(n);
  return n;
}

function fcAddLinkData(from, to) {
  fcLinks.push({ from: from.id, to: to.id });
}

function fcLinkMode() {
  fcLinkModeOn = !fcLinkModeOn;
  fcLinkFrom = null;
  const btn = document.getElementById('fc-link-btn');
  if (btn) {
    btn.style.background = fcLinkModeOn ? '#f59e0b' : '';
    btn.textContent = fcLinkModeOn ? '🔗 连线中(点起止节点)' : '🔗 连线';
  }
}

function fcRender() {
  const g = document.getElementById('fc-nodes');
  const lg = document.getElementById('fc-links');
  if (!g || !lg) return;
  let linksHtml = '';
  fcLinks.forEach(function(link) {
    const a = fcNodes.find(function(n) { return n.id === link.from; });
    const b = fcNodes.find(function(n) { return n.id === link.to; });
    if (!a || !b) return;
    const p1 = fcPort(a, b), p2 = fcPort(b, a);
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    linksHtml += '<path d="M' + p1.x + ',' + p1.y + ' C' + mx + ',' + p1.y + ' ' + mx + ',' + p2.y + ' ' + p2.x + ',' + p2.y + '" fill="none" stroke="#8b8bb8" stroke-width="1.6" marker-end="url(#fc-arrow)" opacity="0.9"></path>';
  });
  lg.innerHTML = linksHtml;

  let nodesHtml = '';
  fcNodes.forEach(function(n) {
    const sel = fcSelected === n.id ? ' stroke="#a78bfa" stroke-width="2" ' : '';
    if (n.type === 'diamond') {
      const cx = n.x + n.w / 2, cy = n.y + n.h / 2;
      nodesHtml += '<g data-id="' + n.id + '" cursor="move">'
        + '<polygon points="' + cx + ',' + (n.y) + ' ' + (n.x + n.w) + ',' + cy + ' ' + cx + ',' + (n.y + n.h) + ' ' + (n.x) + ',' + cy + '" fill="' + n.fill + '" stroke="#6366f1"' + sel + ' stroke-width="1.5"></polygon>'
        + '<text x="' + cx + '" y="' + cy + '" text-anchor="middle" dominant-baseline="middle" fill="' + n.color + '" font-size="13">' + fcEsc(n.label) + '</text></g>';
    } else if (n.type === 'ellipse') {
      const cx = n.x + n.w / 2, cy = n.y + n.h / 2;
      nodesHtml += '<g data-id="' + n.id + '" cursor="move">'
        + '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + n.w / 2 + '" ry="' + n.h / 2 + '" fill="' + n.fill + '" stroke="#6366f1"' + sel + ' stroke-width="1.5"></ellipse>'
        + '<text x="' + cx + '" y="' + cy + '" text-anchor="middle" dominant-baseline="middle" fill="' + n.color + '" font-size="13">' + fcEsc(n.label) + '</text></g>';
    } else {
      const rx = n.type === 'round' ? 12 : 3;
      nodesHtml += '<g data-id="' + n.id + '" cursor="move">'
        + '<rect x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" rx="' + rx + '" fill="' + n.fill + '" stroke="#6366f1"' + sel + ' stroke-width="1.5"></rect>'
        + '<text x="' + (n.x + n.w / 2) + '" y="' + (n.y + n.h / 2) + '" text-anchor="middle" dominant-baseline="middle" fill="' + n.color + '" font-size="13">' + fcEsc(n.label) + '</text></g>';
    }
  });
  g.innerHTML = nodesHtml;

  // 绑定事件（点击选中/连线、双击编辑、拖拽）
  Array.prototype.forEach.call(g.querySelectorAll('g'), function(el) {
    el.addEventListener('mousedown', function(e) { fcOnNodeDown(e, el); });
    el.addEventListener('dblclick', function(e) { fcOnDblClick(e, el); });
  });
}

function fcPort(n, target) {
  // 计算节点朝向目标节点的连接点
  const cx = n.x + n.w / 2, cy = n.y + n.h / 2;
  const tx = target.x + target.w / 2, ty = target.y + target.h / 2;
  const dx = tx - cx, dy = ty - cy;
  if (Math.abs(dx) > Math.abs(dy)) {
    return { x: dx > 0 ? n.x + n.w : n.x, y: cy };
  }
  return { x: cx, y: dy > 0 ? n.y + n.h : n.y };
}

function fcOnNodeDown(e, el) {
  if (fcLinkModeOn) {
    const id = el.getAttribute('data-id');
    if (!fcLinkFrom) {
      fcLinkFrom = id;
      el.style.opacity = '0.6';
    } else if (fcLinkFrom !== id) {
      fcLinks.push({ from: fcLinkFrom, to: id });
      fcLinkFrom = null;
      fcLinkModeOn = false;
      const btn = document.getElementById('fc-link-btn');
      if (btn) { btn.style.background = ''; btn.textContent = '🔗 连线'; }
      fcRender();
    } else {
      fcLinkFrom = null;
    }
    return;
  }
  const id = el.getAttribute('data-id');
  fcSelectNode(id);
  const svg = document.getElementById('fc-svg');
  const rect = svg.getBoundingClientRect();
  const scaleX = svg.clientWidth ? svg.clientWidth.getBoundingClientRect ? 1 : 1 : 1;
  const startX = e.clientX, startY = e.clientY;
  const n = fcNodes.find(function(x) { return x.id === id; });
  const origX = n.x, origY = n.y;
  fcDragging = { id: id, startX: startX, startY: startY, origX: origX, origY: origY };
  e.preventDefault();
}

function fcOnDblClick(e, el) {
  if (fcLinkModeOn) return;
  const id = el.getAttribute('data-id');
  const n = fcNodes.find(function(x) { return x.id === id; });
  if (!n) return;
  const label = prompt('编辑节点文字：', n.label);
  if (label !== null) {
    n.label = label || '节点';
    fcRender();
  }
}

function fcSelectNode(id) {
  fcSelected = id;
  fcRender();
}

function fcApplyStyle() {
  const c = document.getElementById('fc-fill');
  if (c && fcSelected) {
    const n = fcNodes.find(function(x) { return x.id === fcSelected; });
    if (n) { n.fill = c.value; fcRender(); }
  }
}

function fcDeleteSelected() {
  if (!fcSelected) { showToast('⚠️ 请先选中一个节点'); return; }
  const id = fcSelected;
  fcNodes = fcNodes.filter(function(n) { return n.id !== id; });
  fcLinks = fcLinks.filter(function(l) { return l.from !== id && l.to !== id; });
  fcSelected = null;
  fcRender();
}

function fcClear() {
  fcNodes = [];
  fcLinks = [];
  fcSelected = null;
  fcRender();
}

function fcEsc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// 画布级事件：全局拖拽
document.addEventListener('mousemove', function(e) {
  if (!fcDragging) return;
  const id = fcDragging.id;
  const n = fcNodes.find(function(x) { return x.id === id; });
  if (!n) return;
  const svg = document.getElementById('fc-svg');
  const rect = svg.getBoundingClientRect();
  const scale = rect.width / (svg.viewBox ? (svg.viewBox.baseVal ? svg.viewBox.baseVal.width : 820) : 820);
  n.x = fcDragging.origX + (e.clientX - fcDragging.startX) / (scale || 1);
  n.y = fcDragging.origY + (e.clientY - fcDragging.startY) / (scale || 1);
  fcRender();
});
document.addEventListener('mouseup', function() {
  fcDragging = null;
});

function fcExportPNG() {
  const svg = document.getElementById('fc-svg');
  if (!svg) { showToast('⚠️ 流程图不存在'); return; }
  const rect = svg.getBoundingClientRect();
  const W = 1200, H = Math.max(600, Math.round(rect.height * (1200 / rect.width)));
  const clone = svg.cloneNode(true);
  clone.setAttribute('width', W);
  clone.setAttribute('height', H);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const style = document.createElement('style');
  style.textContent = 'text{font-family:sans-serif;}';
  clone.insertBefore(style, clone.firstChild);
  const data = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = function() {
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#14142a';
    ctx.fillRect(0, 0, W, H);
    ctx.drawImage(img, 0, 0, W, H);
    const a = document.createElement('a');
    a.download = 'flowchart.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
    URL.revokeObjectURL(url);
    showToast('✅ 流程图片已导出');
  };
  img.onerror = function() { showToast('⚠️ 导出失败，请重试'); URL.revokeObjectURL(url); };
  img.src = url;
}

// ============================================================
// 房贷计算器 处理函数
// ============================================================
function lcInit() {
  lcCalc();
}

function lcCalc() {
  const el = function(id) { return document.getElementById(id); };
  const amountWan = parseFloat(el('lc-amount').value);
  const ratePct = parseFloat(el('lc-rate').value);
  const years = parseInt(el('lc-years').value, 10);
  const type = el('lc-type').value;
  if (!amountWan || amountWan <= 0 || !ratePct || ratePct <= 0 || !years || years <= 0) {
    showToast('⚠️ 请填写正确的贷款金额/利率/年限');
    return;
  }
  const P = amountWan * 10000;
  const n = years * 12;
  const r = ratePct / 100 / 12;

  const rows = [];
  let monthly = 0, totalInterest = 0;
  if (type === 'equal') {
    monthly = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    let remain = P;
    for (let i = 1; i <= n; i++) {
      const interest = remain * r;
      const principal = monthly - interest;
      remain -= principal;
      rows.push({ no: i, pay: monthly, principal: principal, interest: interest, remain: Math.max(remain, 0) });
    }
    totalInterest = monthly * n - P;
  } else {
    const basePrincipal = P / n;
    let remain = P;
    for (let i = 1; i <= n; i++) {
      const interest = remain * r;
      const principal = basePrincipal;
      const pay = principal + interest;
      remain -= principal;
      rows.push({ no: i, pay: pay, principal: principal, interest: interest, remain: Math.max(remain, 0) });
      totalInterest += interest;
    }
    monthly = rows[0].pay;
  }

  const fmt = function(v) { return '¥' + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); };
  el('lc-monthly').textContent = fmt(monthly);
  el('lc-interest').textContent = fmt(totalInterest);
  el('lc-total').textContent = fmt(P + totalInterest);

  // 明细表（前24期）
  let tableHtml = '';
  rows.slice(0, 24).forEach(function(row) {
    tableHtml += '<tr><td style="padding:6px;text-align:left;">' + row.no + '</td>'
      + '<td style="padding:6px;text-align:right;">' + fmt(row.pay) + '</td>'
      + '<td style="padding:6px;text-align:right;">' + fmt(row.principal) + '</td>'
      + '<td style="padding:6px;text-align:right;">' + fmt(row.interest) + '</td>'
      + '<td style="padding:6px;text-align:right;">' + fmt(row.remain) + '</td></tr>';
  });
  el('lc-table').innerHTML = tableHtml;
  el('lc-result').style.display = 'block';

  // 画折线图：剩余本金 + 月供（36期或全部）
  lcDrawChart(rows, P);
}

function lcDrawChart(rows, P) {
  const canvas = document.getElementById('lc-chart');
  if (!canvas) return;
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  const count = Math.min(rows.length, 360);
  const slice = rows.slice(0, count);

  const padL = 56, padR = 20, padT = 16, padB = 30;
  const cw = W - padL - padR, ch = H - padT - padB;
  ctx.font = '11px sans-serif';

  // 网格与 Y 轴（剩余本金 0~P）
  const yMax = P;
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.fillStyle = '#8888aa';
  for (let i = 0; i <= 4; i++) {
    const y = padT + ch * (1 - i / 4);
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
    ctx.fillText('¥' + Math.round(yMax * i / 4 / 10000) + '万', 4, y + 4);
  }
  // X 轴刻度
  for (let i = 0; i <= 6; i++) {
    const x = padL + cw * i / 6;
    ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, H - padB); ctx.stroke();
    ctx.fillText(i === 6 ? rows.length + '期' : (Math.round(count * i / 6)) + '期', x - 16, H - 12);
  }

  // 剩余本金曲线（蓝）
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  slice.forEach(function(row, idx) {
    const x = padL + cw * (idx / (count - 1 || 1));
    const y = padT + ch * (1 - row.remain / yMax);
    if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // 月供曲线（绿）
  ctx.strokeStyle = '#34d399';
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  slice.forEach(function(row, idx) {
    const x = padL + cw * (idx / (count - 1 || 1));
    const y = padT + ch * (1 - row.pay / yMax);
    if (idx === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.setLineDash([]);
  ctx.stroke();

  // 图例
  ctx.fillStyle = '#a78bfa';
  ctx.fillRect(padL, 6, 16, 4);
  ctx.fillStyle = '#ccc';
  ctx.fillText('剩余本金', padL + 22, 12);
  ctx.strokeStyle = '#34d399';
  ctx.setLineDash([5, 4]);
  ctx.beginPath(); ctx.moveTo(padL + 100, 10); ctx.lineTo(padL + 130, 10); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#ccc';
  ctx.fillText('月供', padL + 136, 12);
}

// ============================================================
// PDF拆分工具 处理函数（第19轮）
// ============================================================
var pdsPDFBytes = null;
var pdsPageCount = 0;

function pdsInit() {
  document.getElementById('pds-file').addEventListener('change', pdsLoad);
}

function pdsLoad() {
  var file = document.getElementById('pds-file').files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    pdsPDFBytes = e.target.result;
    ensurePDFLib().then(function() {
      return PDFLib.PDFDocument.load(pdsPDFBytes);
    }).then(function(doc) {
      pdsPageCount = doc.getPageCount();
      document.getElementById('pds-info').textContent = file.name + ' · 共 ' + pdsPageCount + ' 页';
      document.getElementById('pds-panel').style.display = 'block';
      document.getElementById('pds-end').value = pdsPageCount;
      document.getElementById('pds-result').style.display = 'none';
    }).catch(function() { showToast('❌ 无法解析 PDF 文件'); });
  };
  reader.readAsArrayBuffer(file);
}

function ensurePDFLib() {
  return new Promise(function(resolve, reject) {
    if (typeof PDFLib !== 'undefined') { resolve(); return; }
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
    script.onload = resolve;
    script.onerror = function() { reject(new Error('加载 pdf-lib 失败')); };
    document.head.appendChild(script);
  });
}

function pdsModeChange() {
  var mode = document.getElementById('pds-mode').value;
  document.getElementById('pds-range-wrap').style.display = mode === 'range' ? 'block' : 'none';
  document.getElementById('pds-n-wrap').style.display = mode === 'custom' ? 'block' : 'none';
}

function pdsParseRanges(str, total) {
  var pages = [];
  var parts = String(str).split(/[,，;；]/);
  parts.forEach(function(part) {
    part = part.trim();
    if (!part) return;
    var m = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      var a = parseInt(m[1], 10), b = parseInt(m[2], 10);
      if (a > b) { var t = a; a = b; b = t; }
      for (var i = a; i <= b; i++) pages.push(i);
    } else if (/^\d+$/.test(part)) {
      pages.push(parseInt(part, 10));
    }
  });
  return pages.filter(function(p) { return p >= 1 && p <= total; });
}

function pdsSplit() {
  if (!pdsPDFBytes) { showToast('⚠️ 请先选择 PDF 文件'); return; }
  var mode = document.getElementById('pds-mode').value;
  var groups = [];
  if (mode === 'every') {
    for (var i = 1; i <= pdsPageCount; i++) groups.push([i, i]);
  } else if (mode === 'range') {
    var pages = pdsParseRanges(document.getElementById('pds-range').value, pdsPageCount);
    if (!pages.length) { showToast('⚠️ 页码范围无效'); return; }
    // 将连续页合并为区间
    var start = pages[0], prev = pages[0];
    for (var j = 1; j <= pages.length; j++) {
      if (pages[j] === prev + 1) { prev = pages[j]; continue; }
      groups.push([start, prev]);
      start = pages[j]; prev = pages[j];
    }
  } else {
    var n = parseInt(document.getElementById('pds-n').value, 10) || 5;
    for (var k = 1; k <= pdsPageCount; k += n) {
      groups.push([k, Math.min(k + n - 1, pdsPageCount)]);
    }
  }
  document.getElementById('pds-loading').style.display = 'block';
  document.getElementById('pds-result').style.display = 'none';
  var parts = [];
  var baseName = '拆分文件';
  ensurePDFLib().then(function() {
    var chain = Promise.resolve();
    groups.forEach(function(g) {
      chain = chain.then(function() {
        return PDFLib.PDFDocument.load(pdsPDFBytes).then(function(srcDoc) {
          return PDFLib.PDFDocument.create().then(function(newDoc) {
            var idxs = [];
            for (var p = g[0]; p <= g[1]; p++) idxs.push(p - 1);
            return newDoc.copyPages(srcDoc, idxs).then(function(copied) {
              copied.forEach(function(pg) { newDoc.addPage(pg); });
              return newDoc.save();
            }).then(function(bytes) {
              parts.push({ name: baseName + '_' + g[0] + '-' + g[1] + '.pdf', bytes: bytes });
            });
          });
        });
      });
    });
    return chain;
  }).then(function() {
    document.getElementById('pds-loading').style.display = 'none';
    var list = document.getElementById('pds-list');
    list.innerHTML = '';
    parts.forEach(function(part, idx) {
      var blob = new Blob([part.bytes], { type: 'application/pdf' });
      var url = URL.createObjectURL(blob);
      var div = document.createElement('div');
      div.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px;';
      div.innerHTML = '<span>' + (idx + 1) + '. ' + part.name + '</span>';
      var a = document.createElement('a');
      a.href = url;
      a.download = part.name;
      a.textContent = '⬇️ 下载';
      a.style.color = 'var(--primary)';
      div.appendChild(a);
      list.appendChild(div);
    });
    document.getElementById('pds-result').style.display = 'block';
    showToast('✅ 拆分完成，共 ' + parts.length + ' 个文件');
  }).catch(function() {
    document.getElementById('pds-loading').style.display = 'none';
    showToast('❌ 拆分失败，请重试');
  });
}

// ============================================================
// 音频剪辑拼接工具 处理函数（第19轮）
// ============================================================
var aucBuffer = null;
var aucClips = [];
var aucPlaySrc = null;

function aucInit() {
  document.getElementById('auc-file').addEventListener('change', aucLoad);
}

function aucLoad() {
  var file = document.getElementById('auc-file').files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctx.decodeAudioData(e.target.result).then(function(buf) {
      aucBuffer = buf;
      var secs = Math.floor(buf.duration);
      var mins = Math.floor(secs / 60);
      secs = secs % 60;
      document.getElementById('auc-info').textContent = file.name + ' · 时长 ' + mins + '分' + secs + '秒，' + (buf.numberOfChannels || 1) + '声道，采样率 ' + buf.sampleRate + 'Hz';
      document.getElementById('auc-end').value = buf.duration.toFixed(1);
      document.getElementById('auc-end').max = buf.duration.toFixed(1);
      document.getElementById('auc-panel').style.display = 'block';
      aucClips = [];
      aucRenderClips();
    }).catch(function() { showToast('❌ 无法解码该音频文件'); });
  };
  reader.readAsArrayBuffer(file);
}

function aucAddClip() {
  if (!aucBuffer) { showToast('⚠️ 请先选择音频文件'); return; }
  var start = parseFloat(document.getElementById('auc-start').value) || 0;
  var end = parseFloat(document.getElementById('auc-end').value) || aucBuffer.duration;
  var volume = parseInt(document.getElementById('auc-volume').value, 10) || 100;
  if (start < 0) start = 0;
  if (end > aucBuffer.duration) end = aucBuffer.duration;
  if (end <= start) { showToast('⚠️ 结束时间必须大于开始时间'); return; }
  aucClips.push({ start: start, end: end, volume: volume / 100 });
  aucRenderClips();
  showToast('✅ 已添加片段');
}

function aucRenderClips() {
  var wrap = document.getElementById('auc-clips-wrap');
  var list = document.getElementById('auc-clips');
  if (!aucClips.length) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'block';
  list.innerHTML = '';
  aucClips.forEach(function(c, idx) {
    var div = document.createElement('div');
    div.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);font-size:13px;';
    div.innerHTML = '<span>#' + (idx + 1) + ' · ' + c.start.toFixed(1) + 's ~ ' + c.end.toFixed(1) + 's（' + (c.end - c.start).toFixed(1) + 's，音量 ' + Math.round(c.volume * 100) + '%）</span>';
    var btn = document.createElement('button');
    btn.textContent = '✖';
    btn.className = 'btn btn-secondary';
    btn.style.cssText = 'font-size:12px;padding:2px 10px;';
    btn.onclick = (function(i) { return function() { aucClips.splice(i, 1); aucRenderClips(); }; })(idx);
    div.appendChild(btn);
    list.appendChild(div);
  });
}

function aucPlayClip() {
  if (!aucBuffer) return;
  aucStopPlay();
  var start = parseFloat(document.getElementById('auc-start').value) || 0;
  var end = parseFloat(document.getElementById('auc-end').value) || aucBuffer.duration;
  if (end <= start) return;
  var ctx = new (window.AudioContext || window.webkitAudioContext)();
  aucPlaySrc = ctx.createBufferSource();
  aucPlaySrc.buffer = aucBuffer;
  aucPlaySrc.connect(ctx.destination);
  aucPlaySrc.start(0, start, end - start);
}

function aucStopPlay() {
  if (aucPlaySrc) { try { aucPlaySrc.stop(); } catch (e) {} aucPlaySrc = null; }
}

function aucClear() {
  aucStopPlay();
  aucClips = [];
  aucRenderClips();
}

function aucExport() {
  if (!aucClips.length) { showToast('⚠️ 请先添加至少一个片段'); return; }
  var totalDur = 0;
  aucClips.forEach(function(c) { totalDur += (c.end - c.start); });
  var ctx = new (window.AudioContext || window.webkitAudioContext)();
  var offline = new OfflineAudioContext(aucBuffer.numberOfChannels || 1, Math.ceil(totalDur * aucBuffer.sampleRate), aucBuffer.sampleRate);
  var offset = 0;
  aucClips.forEach(function(c) {
    var src = offline.createBufferSource();
    src.buffer = aucBuffer;
    var gain = offline.createGain();
    gain.gain.value = c.volume;
    src.connect(gain);
    gain.connect(offline.destination);
    src.start(offset, c.start, c.end - c.start);
    offset += (c.end - c.start);
  });
  offline.startRendering().then(function(rendered) {
    var wav = aucBufferToWav(rendered);
    var blob = new Blob([wav], { type: 'audio/wav' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '音频拼接_' + Date.now() + '.wav';
    a.click();
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 2000);
    showToast('✅ 拼接完成，WAV 已下载');
  }).catch(function() { showToast('❌ 渲染失败，请缩短片段或减少数量'); });
}

function aucBufferToWav(buffer) {
  var numCh = buffer.numberOfChannels;
  var sampleRate = buffer.sampleRate;
  var len = buffer.length * numCh * 2;
  var arrayBuffer = new ArrayBuffer(44 + len);
  var view = new DataView(arrayBuffer);
  aucWriteString(view, 0, 'RIFF');
  view.setUint32(4, 36 + len, true);
  aucWriteString(view, 8, 'WAVE');
  aucWriteString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numCh, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numCh * 2, true);
  view.setUint16(32, numCh * 2, true);
  view.setUint16(34, 16, true);
  aucWriteString(view, 36, 'data');
  view.setUint32(40, len, true);
  var offset = 44;
  for (var i = 0; i < buffer.length; i++) {
    for (var ch = 0; ch < numCh; ch++) {
      var s = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      offset += 2;
    }
  }
  return arrayBuffer;
}

function aucWriteString(view, offset, str) {
  for (var i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

// ============================================================
// 发票/收据生成器 处理函数 (替代 Zoho Invoice / Invoice Simple)
// ============================================================
var invItems = 1;

function invInit() {
  var d = new Date();
  var ymd = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  var el = document.getElementById('inv-date');
  if (el) el.value = ymd;
  var no = document.getElementById('inv-no');
  if (no) no.value = 'INV-' + ymd.replace(/-/g,'');
  invAddItem();
  invRender();
}

function invAddItem() {
  var wrap = document.getElementById('inv-items');
  if (!wrap) return;
  invItems++;
  var div = document.createElement('div');
  div.className = 'inv-item-row';
  div.style.cssText = 'display:flex;gap:8px;margin-bottom:6px;align-items:center;';
  div.innerHTML = '<input type="text" placeholder="项目名称" style="flex:2;min-width:100px;padding:6px 8px;border:1px solid var(--border);border-radius:6px;background:var(--bg-card);color:var(--text);">' +
    '<input type="number" placeholder="数量" value="1" min="1" style="flex:1;min-width:60px;padding:6px 8px;border:1px solid var(--border);border-radius:6px;background:var(--bg-card);color:var(--text);">' +
    '<input type="number" placeholder="单价" value="0" min="0" step="0.01" style="flex:1;min-width:80px;padding:6px 8px;border:1px solid var(--border);border-radius:6px;background:var(--bg-card);color:var(--text);">' +
    '<button class="btn btn-secondary" style="padding:4px 10px;font-size:12px;" onclick="invRemoveItem(this)">✖</button>';
  wrap.appendChild(div);
  invRender();
}

function invRemoveItem(btn) {
  var wrap = document.getElementById('inv-items');
  if (wrap && wrap.children.length > 1) {
    btn.parentNode.remove();
    invRender();
  } else {
    toast('至少保留一行商品');
  }
}

function invRender() {
  var pv = document.getElementById('inv-preview');
  if (!pv) return;
  var type = document.getElementById('inv-type').value;
  var no = document.getElementById('inv-no').value || '-';
  var date = document.getElementById('inv-date').value || '';
  var seller = document.getElementById('inv-seller').value || '（销售方）';
  var buyer = document.getElementById('inv-buyer').value || '（购买方）';
  var taxRate = parseFloat(document.getElementById('inv-tax').value) || 0;
  var discRate = parseFloat(document.getElementById('inv-discount').value) || 0;
  var cur = document.getElementById('inv-currency').value;
  var note = document.getElementById('inv-note').value || '';

  var rows = [];
  var items = document.querySelectorAll('#inv-items .inv-item-row');
  var subtotal = 0;
  items.forEach(function(row) {
    var name = row.children[0].value.trim();
    var qty = parseFloat(row.children[1].value) || 0;
    var price = parseFloat(row.children[2].value) || 0;
    var amt = qty * price;
    subtotal += amt;
    rows.push({ name: name || '未命名项目', qty: qty, price: price, amt: amt });
  });

  var discount = subtotal * discRate / 100;
  var taxable = subtotal - discount;
  var tax = taxable * taxRate / 100;
  var total = taxable + tax;

  function fmt(n) { return cur + n.toFixed(2); }

  var html = '<div style="border-bottom:2px solid #1a1a2e;padding-bottom:10px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:flex-end;">' +
    '<div><div style="font-size:24px;font-weight:bold;color:#1a1a2e;">' + type + '</div>' +
    '<div style="font-size:12px;color:#666;">编号：' + no + '　日期：' + date + '</div></div>' +
    '<div style="text-align:right;font-size:12px;color:#666;">' + seller + '</div></div>' +
    '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:14px;">' +
    '<div><div style="color:#888;font-size:11px;">开给</div><b>' + buyer + '</b></div>' +
    '<div style="color:#888;font-size:11px;">' + type + '编号 ' + no + '</div></div>';

  html += '<table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:14px;"><tr style="background:#f4f4f8;color:#1a1a2e;">' +
    '<th style="padding:8px;text-align:left;">项目</th><th style="padding:8px;text-align:center;width:70px;">数量</th>' +
    '<th style="padding:8px;text-align:right;width:110px;">单价</th><th style="padding:8px;text-align:right;width:130px;">金额</th></tr>';
  rows.forEach(function(r) {
    html += '<tr style="border-bottom:1px solid #eee;"><td style="padding:7px;">' + r.name + '</td>' +
      '<td style="padding:7px;text-align:center;">' + r.qty + '</td>' +
      '<td style="padding:7px;text-align:right;">' + fmt(r.price) + '</td>' +
      '<td style="padding:7px;text-align:right;">' + fmt(r.amt) + '</td></tr>';
  });
  html += '</table>';

  html += '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:8px;"><div></div><div style="min-width:260px;">' +
    '<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="color:#666;">小计</span><b>' + fmt(subtotal) + '</b></div>';
  if (discRate > 0) {
    html += '<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="color:#666;">折扣 ' + discRate + '%</span><b style="color:#e94560;">-' + fmt(discount) + '</b></div>';
  }
  if (taxRate > 0) {
    html += '<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="color:#666;">税 ' + taxRate + '%</span><b>' + fmt(tax) + '</b></div>';
  }
  html += '<div style="display:flex;justify-content:space-between;padding-top:8px;border-top:2px solid #1a1a2e;font-size:16px;font-weight:bold;color:#1a1a2e;"><span>合计</span><span>' + fmt(total) + '</span></div></div></div>';

  if (note) {
    html += '<div style="font-size:12px;color:#666;border-top:1px dashed #ccc;padding-top:8px;">📝 ' + note + '</div>';
  }
  html += '<div style="margin-top:14px;text-align:center;font-size:11px;color:#aaa;">—— 由 ToolAI 工具箱生成 ——</div>';

  pv.innerHTML = html;
}

function invPrint() {
  invRender();
  var pv = document.getElementById('inv-preview');
  if (!pv) return;
  var content = pv.innerHTML;
  var w = window.open('', '_blank', 'width=800,height=900');
  w.document.write('<html><head><title>打印发票</title><style>body{font-family:system-ui,sans-serif;padding:30px;max-width:720px;margin:0 auto;color:#222;}@media print{body{padding:0;}}</style></head><body>' + content + '<script>window.onload=function(){window.print();}<\/script></body></html>');
  w.document.close();
}

// ============================================================
// 视频缩略图制作器 处理函数 (替代 Canva Pro / Placeit)
// ============================================================
var thmBgImage = null;

function thmInit() {
  thmRender();
}

function thmBgMode() {
  var mode = document.getElementById('thm-bgmode').value;
  document.getElementById('thm-color-wrap').style.display = (mode === 'solid') ? '' : 'none';
  document.getElementById('thm-color2-wrap').style.display = (mode === 'gradient') ? '' : 'none';
  document.getElementById('thm-image-wrap').style.display = (mode === 'image') ? '' : 'none';
  if (mode === 'gradient') thmRender();
}

function thmBgFile() {
  var f = document.getElementById('thm-bgfile').files[0];
  if (!f) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      thmBgImage = img;
      thmRender();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(f);
}

function thmWrapText(ctx, text, maxWidth) {
  var words = text.split('\n');
  var lines = [];
  words.forEach(function(w) {
    var str = w;
    var line = '';
    for (var i = 0; i < str.length; i++) {
      var test = line + str[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = str[i];
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
  });
  return lines;
}

function thmRender() {
  var cv = document.getElementById('thm-canvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var W = cv.width, H = cv.height;

  // 背景
  var mode = document.getElementById('thm-bgmode').value;
  if (mode === 'image' && thmBgImage) {
    var ir = thmBgImage.width / thmBgImage.height;
    var cr = W / H;
    var sw, sh, sx = 0, sy = 0;
    if (ir > cr) { sh = thmBgImage.height; sw = sh * cr; sx = (thmBgImage.width - sw) / 2; }
    else { sw = thmBgImage.width; sh = sw / cr; sy = (thmBgImage.height - sh) / 2; }
    ctx.drawImage(thmBgImage, sx, sy, sw, sh, 0, 0, W, H);
    // 压暗提高文字可读性
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, 0, W, H);
  } else if (mode === 'gradient') {
    var c1 = document.getElementById('thm-bgcolor').value;
    var c2 = document.getElementById('thm-bgcolor2').value;
    var g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  } else {
    ctx.fillStyle = document.getElementById('thm-bgcolor').value;
    ctx.fillRect(0, 0, W, H);
  }

  // 装饰圆点
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(W*0.85, H*0.15, 120, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(W*0.1, H*0.85, 80, 0, Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1;

  var title = document.getElementById('thm-title').value || '标题';
  var sub = document.getElementById('thm-sub').value || '';
  var tSize = parseInt(document.getElementById('thm-titlesize').value) || 64;
  var sSize = parseInt(document.getElementById('thm-subsie').value) || 28;
  var tColor = document.getElementById('thm-titlecolor').value;
  var sColor = document.getElementById('thm-subcolor').value;
  var style = document.getElementById('thm-style').value;

  document.getElementById('thm-titlesize-val').textContent = tSize;
  document.getElementById('thm-subsie-val').textContent = sSize;

  // 主标题
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold ' + tSize + 'px "Arial Black", "PingFang SC", "Microsoft YaHei", sans-serif';
  var lines = thmWrapText(ctx, title, W * 0.82);

  var blockH = lines.length * tSize * 1.2 + (sub ? sSize * 1.6 : 0);
  var startY = H / 2 - blockH / 2 + tSize / 2;

  lines.forEach(function(line, i) {
    var y = startY + i * tSize * 1.2;
    if (style === 'bold' || style === 'outline') {
      ctx.lineWidth = Math.max(6, tSize * 0.09);
      ctx.strokeStyle = 'rgba(0,0,0,0.85)';
      ctx.strokeText(line, W / 2, y);
      if (style === 'outline') {
        var g2 = ctx.createLinearGradient(W/2 - ctx.measureText(line).width/2, y - tSize/2, W/2 + ctx.measureText(line).width/2, y);
        g2.addColorStop(0, tColor);
        g2.addColorStop(1, '#ffd700');
        ctx.fillStyle = g2;
      } else {
        ctx.fillStyle = tColor;
      }
    } else if (style === 'shadow') {
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = tColor;
    } else { // badge
      ctx.fillStyle = 'rgba(233,69,96,0.9)';
      var tw = ctx.measureText(line).width;
      var pad = tSize * 0.4;
      ctx.beginPath();
      var bw = tw + pad * 2, bh = tSize * 1.5, bx = W/2 - bw/2, by = y - bh/2;
      ctx.moveTo(bx + 16, by); ctx.lineTo(bx + bw - 16, by); ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + 16);
      ctx.lineTo(bx + bw, by + bh - 16); ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - 16, by + bh);
      ctx.lineTo(bx + 16, by + bh); ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - 16);
      ctx.lineTo(bx, by + 16); ctx.quadraticCurveTo(bx, by, bx + 16, by);
      ctx.fill();
      ctx.fillStyle = tColor;
    }
    ctx.fillText(line, W / 2, y);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  });

  // 副标题
  if (sub) {
    ctx.font = 'bold ' + sSize + 'px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.lineWidth = Math.max(3, sSize * 0.08);
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.strokeText(sub, W / 2, startY + lines.length * tSize * 1.2 + sSize * 0.8);
    ctx.fillStyle = sColor;
    ctx.fillText(sub, W / 2, startY + lines.length * tSize * 1.2 + sSize * 0.8);
  }

  // 底部小标签
  ctx.font = '16px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText('▶ 1280 × 720', 30, H - 30);
}

function thmExport() {
  thmRender();
  var cv = document.getElementById('thm-canvas');
  if (!cv) return;
  var a = document.createElement('a');
  a.download = 'thumbnail-1280x720.png';
  a.href = cv.toDataURL('image/png');
  a.click();
  toast('✅ 已导出缩略图 PNG');
}

// ============================================================
// 证书生成器 处理函数 (替代 Certifier / Canva Pro 证书模板)
// ============================================================
function certInit() {
  var d = new Date();
  var ymd = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  var no = document.getElementById('cert-no');
  if (no && !no.value) no.value = 'CERT-' + d.getFullYear() + '-' + String(d.getDate()).padStart(2,'0') + '-' + String(Date.now() % 100000).padStart(5,'0');
  var dt = document.getElementById('cert-date');
  if (dt && !dt.value) dt.value = ymd;
  certRender();
}

function certTheme() {
  var s = document.getElementById('cert-style').value;
  var themes = {
    classic: { bg1: '#fff8f0', border: '#c9a227', chip: '#8b0000', title: '#8b0000', text: '#3d2c00', accent: '#c9a227' },
    blue: { bg1: '#f4f8ff', border: '#2f6fb3', chip: '#1e3a8a', title: '#1e3a8a', text: '#1f2937', accent: '#2f6fb3' },
    green: { bg1: '#f2fbf5', border: '#2e8b57', chip: '#14532d', title: '#14532d', text: '#1f2937', accent: '#2e8b57' },
    tech: { bg1: '#0f172a', border: '#22d3ee', chip: '#a855f7', title: '#f8fafc', text: '#e2e8f0', accent: '#38bdf8' }
  };
  return themes[s] || themes.classic;
}

function certWrap(ctx, text, maxWidth) {
  var words = String(text).split('\n');
  var lines = [];
  words.forEach(function(w) {
    var line = '';
    for (var i = 0; i < String(w).length; i++) {
      var test = line + w[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = w[i];
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
  });
  return lines;
}

function certRender() {
  var cv = document.getElementById('cert-canvas');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var W = cv.width, H = cv.height;
  var t = certTheme();

  // 背景
  ctx.fillStyle = t.bg1;
  ctx.fillRect(0, 0, W, H);
  // 双层边框
  ctx.strokeStyle = t.border;
  ctx.lineWidth = 6;
  ctx.strokeRect(24, 24, W - 48, H - 48);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(42, 42, W - 84, H - 84);

  // 四角装饰
  ctx.fillStyle = t.accent;
  [[60,60],[W-60,60],[60,H-60],[W-60,H-60]].forEach(function(p) {
    ctx.beginPath();
    ctx.arc(p[0], p[1], 26, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = t.bg1;
    ctx.beginPath();
    ctx.arc(p[0], p[1], 14, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = t.accent;
  });

  // 顶部徽章
  ctx.fillStyle = t.accent;
  ctx.beginPath();
  ctx.arc(W/2, 120, 44, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '30px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🏅', W/2, 120);

  // 标题
  var title = document.getElementById('cert-title').value || '荣 誉 证 书';
  ctx.fillStyle = t.title;
  ctx.font = 'bold 58px "STZhongsong", "SimSun", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, W/2, 230);

  // 分隔线
  ctx.strokeStyle = t.accent;
  ctx.lineWidth = 2;
  var lw = 320;
  ctx.beginPath();
  ctx.moveTo(W/2 - lw/2, 268);
  ctx.lineTo(W/2 + lw/2, 268);
  ctx.stroke();

  // 正文
  var recipient = document.getElementById('cert-recipient').value || '某某';
  var body = document.getElementById('cert-body').value || '';
  ctx.fillStyle = t.text;
  ctx.font = '26px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  var y = 330;
  ctx.fillText(recipient, W/2, y);
  y += 56;
  var bodyLines = certWrap(ctx, body, W * 0.72);
  ctx.font = '22px "PingFang SC", "Microsoft YaHei", sans-serif';
  bodyLines.forEach(function(line, i) {
    ctx.fillText(line, W/2, y + i * 36);
  });
  y += bodyLines.length * 36 + 20;

  // 落款：机构 + 日期
  ctx.font = '22px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'right';
  var org = document.getElementById('cert-org').value || '';
  var date = document.getElementById('cert-date').value || '';
  ctx.fillText(org, W - 130, H - 140);
  ctx.fillText(date, W - 130, H - 96);

  // 左下角编号
  var no = document.getElementById('cert-no').value || '';
  ctx.font = '15px monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(0,0,0,.4)';
  ctx.fillText('NO. ' + no, 70, H - 76);

  // 底部小标
  ctx.font = '14px sans-serif';
  ctx.fillStyle = 'rgba(0,0,0,.25)';
  ctx.textAlign = 'center';
  ctx.fillText('ToolBox 证书生成器 · 在线生成', W/2, H - 40);
}

function certExport() {
  certRender();
  var cv = document.getElementById('cert-canvas');
  if (!cv) return;
  var a = document.createElement('a');
  a.download = 'certificate.png';
  a.href = cv.toDataURL('image/png');
  a.click();
  toast('✅ 已导出证书 PNG');
}

function certPrint() {
  certRender();
  var cv = document.getElementById('cert-canvas');
  if (!cv) return;
  var win = window.open('', '_blank', 'width=900,height=700');
  if (!win) { toast('⚠️ 请允许弹出窗口'); return; }
  win.document.write('<html><head><title>打印证书</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#eee;}img{max-width:100%;max-height:100%;}</style></head><body><img src="' + cv.toDataURL('image/png') + '"><script>window.onload=function(){setTimeout(function(){window.print();},300);};<\/script></body></html>');
  win.document.close();
}

// ============================================================
// 家庭记账本 处理函数 (替代 Money Manager / 鲨鱼记账)
// ============================================================
var ledRecords = [];
var LEDGER_KEY = 'toolbox_ledger_v1';
var LEDGER_CATS = {
  expense: ['🍚 餐饮', '🛒 购物', '🚇 交通', '🏠 居住', '📱 通讯', '🎬 娱乐', '👔 服饰', '💊 医疗', '🎓 教育', '🐱 宠物', '✈️ 旅行', '🎁 人情', '📦 其他'],
  income: ['💼 工资', '🧧 奖金', '📈 理财', '💵 兼职', '🎁 红包', '💰 其他']
};

function ledInit() {
  var sel = document.getElementById('led-cat');
  if (!sel) return;
  renderLedCat();
  var d = new Date();
  var ymd = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  var dt = document.getElementById('led-date');
  if (dt) dt.value = ymd;
  ledLoad();
  ledRender();

  var typeEl = document.getElementById('led-type');
  if (typeEl) typeEl.addEventListener('change', renderLedCat);
}

function renderLedCat() {
  var typeEl = document.getElementById('led-type');
  var sel = document.getElementById('led-cat');
  if (!typeEl || !sel) return;
  var cats = LEDGER_CATS[typeEl.value] || LEDGER_CATS.expense;
  sel.innerHTML = '';
  cats.forEach(function(c) {
    var o = document.createElement('option');
    o.value = c;
    o.textContent = c;
    sel.appendChild(o);
  });
}

function ledLoad() {
  try {
    var raw = localStorage.getItem(LEDGER_KEY);
    ledRecords = raw ? JSON.parse(raw) : [];
  } catch (e) { ledRecords = []; }
}

function ledSave() {
  try { localStorage.setItem(LEDGER_KEY, JSON.stringify(ledRecords)); } catch (e) {}
}

function ledAdd() {
  var amtEl = document.getElementById('led-amount');
  var amt = parseFloat(amtEl && amtEl.value);
  if (!amt || amt <= 0) { toast('⚠️ 请输入正确的金额'); return; }
  var type = document.getElementById('led-type').value;
  var cat = document.getElementById('led-cat').value;
  var date = document.getElementById('led-date').value || new Date().toISOString().slice(0,10);
  var note = (document.getElementById('led-note').value || '').trim();
  ledRecords.unshift({ id: Date.now() + '-' + Math.random().toString(36).slice(2,6), type: type, cat: cat, amount: amt, date: date, note: note });
  ledSave();
  ledRender();
  if (amtEl) amtEl.value = '';
  document.getElementById('led-note').value = '';
  toast('✅ 已记录' + (type === 'income' ? '收入' : '支出') + ' ¥' + amt.toFixed(2));
}

function ledDel(id) {
  ledRecords = ledRecords.filter(function(r) { return r.id !== id; });
  ledSave();
  ledRender();
}

function ledClearAll() {
  if (!confirm('确定清空全部记账记录吗？此操作不可撤销！')) return;
  ledRecords = [];
  ledSave();
  ledRender();
  toast('🗑️ 已清空全部记录');
}

function ledExportCsv() {
  if (ledRecords.length === 0) { toast('⚠️ 暂无记录可导出'); return; }
  var lines = ['类型,分类,金额,日期,备注'];
  ledRecords.forEach(function(r) {
    lines.push([r.type === 'income' ? '收入' : '支出', r.cat, r.amount.toFixed(2), r.date, '"' + (r.note || '').replace(/"/g, '""') + '"'].join(','));
  });
  var blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = '家庭记账_' + new Date().toISOString().slice(0,10) + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(url); }, 5000);
  toast('📥 已导出 CSV');
}

function ledMonth() {
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0');
}

function ledRender() {
  var listEl = document.getElementById('led-list');
  var chEl = document.getElementById('led-chart');
  if (!listEl) return;
  var month = ledMonth();
  var monthRecords = ledRecords.filter(function(r) { return r.date.startsWith(month); });
  var expSum = 0, incSum = 0;
  monthRecords.forEach(function(r) {
    if (r.type === 'income') incSum += r.amount; else expSum += r.amount;
  });
  var bal = incSum - expSum;
  var totalCnt = ledRecords.length;

  var exEl = document.getElementById('led-total-expense');
  var inEl = document.getElementById('led-total-income');
  var baEl = document.getElementById('led-balance');
  var cnEl = document.getElementById('led-count');
  if (exEl) exEl.textContent = '¥' + expSum.toFixed(2);
  if (inEl) inEl.textContent = '¥' + incSum.toFixed(2);
  if (baEl) { baEl.textContent = '¥' + bal.toFixed(2); baEl.style.color = bal >= 0 ? '' : '#fca5a5'; }
  if (cnEl) cnEl.textContent = totalCnt;

  // 分类占比条形图（支出）
  if (chEl) {
    var byCat = {};
    monthRecords.forEach(function(r) {
      if (r.type === 'expense') byCat[r.cat] = (byCat[r.cat] || 0) + r.amount;
    });
    var cats = Object.keys(byCat);
    var html = '<div style="font-size:13px;color:var(--text-light);margin-bottom:8px;">📊 ' + month + ' 支出分类占比</div>';
    if (cats.length === 0) {
      html += '<div style="font-size:12px;color:var(--text-light);">本月暂无支出记录</div>';
    } else {
      var max = Math.max.apply(null, cats.map(function(c) { return byCat[c]; }));
      cats.sort(function(a, b) { return byCat[b] - byCat[a]; });
      html += '<div style="display:flex;flex-direction:column;gap:6px;">';
      cats.forEach(function(c) {
        var pct = max > 0 ? Math.round(byCat[c] / max * 100) : 0;
        html += '<div style="display:flex;align-items:center;gap:8px;font-size:12px;">';
        html += '<span style="width:90px;text-align:right;flex-shrink:0;">' + c + '</span>';
        html += '<div style="flex:1;height:14px;background:var(--bg);border-radius:7px;overflow:hidden;"><div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,#ef4444,#f97316);border-radius:7px;"></div></div>';
        html += '<span style="width:70px;flex-shrink:0;color:var(--text-light);">¥' + byCat[c].toFixed(0) + '</span>';
        html += '</div>';
      });
      html += '</div>';
    }
    chEl.innerHTML = html;
  }

  // 记录列表
  if (ledRecords.length === 0) {
    listEl.innerHTML = '<div style="text-align:center;color:var(--text-light);padding:20px;">📭 暂无记账记录，先记一笔吧！</div>';
    return;
  }
  var cards = '';
  ledRecords.slice(0, 60).forEach(function(r) {
    var sign = r.type === 'income' ? '+' : '-';
    var color = r.type === 'income' ? '#10b981' : '#ef4444';
    var icon = r.type === 'income' ? '🟢' : '🔴';
    cards += '<div style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-bottom:1px solid var(--border);font-size:13px;">';
    cards += '<span style="flex-shrink:0;">' + icon + '</span>';
    cards += '<div style="flex:1;min-width:0;">';
    cards += '<span style="font-weight:600;">' + r.cat + '</span>';
    if (r.note) cards += '<span style="color:var(--text-light);margin-left:8px;">' + r.note + '</span>';
    cards += '<div style="font-size:11px;color:var(--text-light);">' + r.date + '</div>';
    cards += '</div>';
    cards += '<span style="font-weight:700;color:' + color + ';flex-shrink:0;">' + sign + '¥' + r.amount.toFixed(2) + '</span>';
    cards += '<button onclick="ledDel(\'' + r.id + '\')" style="flex-shrink:0;background:none;border:none;cursor:pointer;font-size:14px;color:var(--text-light);" title="删除">🗑️</button>';
    cards += '</div>';
  });
  listEl.innerHTML = cards + (ledRecords.length > 60 ? '<div style="text-align:center;font-size:12px;color:var(--text-light);padding:8px;">⋯ 仅显示最近 60 条，共 ' + ledRecords.length + ' 条</div>' : '');
}
