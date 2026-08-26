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
  { id: 'dev', icon: '💻', name: '开发者工具', desc: 'JSON格式化、二维码生成、正则测试、Markdown、IP查询、思维导图、图表生成、代码图片生成、表格数据转换' },
  { id: 'image', icon: '🖼️', name: '图片处理', desc: '去背景换底色、批量压缩、加水印、长图拼接、格式转换、裁剪、OCR、印章制作、九宫格切图、文字转手写体、表情包、社交媒体图片尺寸调整、艺术效果、像素画、设备样机、图片高清放大、图片转线稿、渐变背景、文字特效' },
  { id: 'document', icon: '📄', name: '文档转换', desc: '图片转PDF、PDF转图片、Word解析、Excel转PDF、PDF合并、简历生成、电子签名、表单制作、邮件签名' },
  { id: 'convert', icon: '🔄', name: '转换工具', desc: '单位换算、进制转换' },
  { id: 'security', icon: '🔒', name: '安全工具', desc: '密码生成、Hash计算、随机数' },
  { id: 'time', icon: '⏱️', name: '时间工具', desc: '时间戳转换、日期计算' },
  { id: 'color', icon: '🎨', name: '颜色工具', desc: 'HEX/RGB/HSL颜色转换、CSS渐变生成器、配色方案生成器' },
  { id: 'media', icon: '🎬', name: '媒体工具', desc: '抖音/TikTok去水印下载、视频转GIF、在线录音、音频变速变调' },
  { id: 'ai', icon: '🤖', name: 'AI工具', desc: 'AI聊天、AI Agent安装、免费AI工具推荐' },
  { id: 'voice', icon: '🗣️', name: '群众心声', desc: '提交工具建议、投票排行榜、前3名自动实现' },
  { id: 'fun', icon: '🎪', name: '趣味工具', desc: '表情包生成、决策转盘、抽奖抽签、词云生成、涂鸦画板、娱乐好玩' },
  { id: 'edu', icon: '📚', name: '教育资源', desc: '电子教材在线阅读、学习资源导航' }
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