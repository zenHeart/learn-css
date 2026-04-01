# Sentry 前端错误监控完全指南

## 目录

1. [Sentry 简介](#1-sentry-简介)
2. [核心功能](#2-核心功能)
3. [安装与配置](#3-安装与配置)
4. [初始化配置选项](#4-初始化配置选项)
5. [捕获错误的方式](#5-捕获错误的方式)
6. [Source Maps 配置](#6-source-maps-配置)
7. [高级功能](#7-高级功能)
8. [常见问题](#8-常见问题)

---

## 1. Sentry 简介

### 1.1 什么是 Sentry

Sentry 是一个开源的错误追踪和性能监控平台，帮助开发者实时发现、诊断和修复应用问题。

**官网**: https://sentry.io
**GitHub**: https://github.com/getsentry/sentry-javascript

### 1.2 Sentry 能做什么

| 功能 | 说明 |
|------|------|
| 错误监控 | 自动捕获未处理的异常和 rejections |
| 性能追踪 | 分布式追踪，查看请求链路 |
| 会话回放 | 类似视频回放用户操作过程 |
| 日志聚合 | 集中管理应用日志 |
| 用户反馈 | 收集用户遇到错误时的描述 |

### 1.3 Sentry 生态

```
┌─────────────────────────────────────────────────────────┐
│                    Sentry 平台                          │
├─────────────────────────────────────────────────────────┤
│  SDK (JavaScript, Python, Go, Rust, etc.)              │
│  ├── @sentry/browser      前端监控                      │
│  ├── @sentry/node         Node.js 后端                  │
│  ├── @sentry/react        React 集成                    │
│  ├── @sentry/vue          Vue 集成                      │
│  └── @sentry/angular      Angular 集成                  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. 核心功能

### 2.1 Issues（问题追踪）

Sentry 的核心功能，自动报告：

- 未捕获的异常 (uncaught exceptions)
- 未处理的 Promise rejections
- 语法错误
- 资源加载失败

```
错误发生 → Sentry SDK 捕获 → 发送到 Sentry → 创建 Issue → 通知开发者
```

### 2.2 Tracing（性能追踪）

跟踪软件性能，查看错误在多个系统间的影响。

```
Frontend → API → Database → External Service
   ↓         ↓        ↓            ↓
 Span     Span     Span         Span
   ↓─────────── Trace ───────────────↓
```

### 2.3 Session Replay（会话回放）

回放用户遇到问题前的操作过程。

**特点**:
- 类似视频的录屏
- 包含控制台日志
- 可以查看网络请求

### 2.4 Logs（日志）

集中化日志分析，与错误和性能问题关联。

```javascript
Sentry.logger.info("用户操作完成");
Sentry.logger.warn("检测到慢操作", { duration: 3500 });
Sentry.logger.error("验证失败", { field: "email" });
```

---

## 3. 安装与配置

### 3.1 安装 SDK

```bash
# npm
npm install @sentry/browser --save

# yarn
yarn add @sentry/browser

# pnpm
pnpm add @sentry/browser
```

### 3.2 初始化

在应用入口尽早初始化：

```javascript
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://xxxx@sentry.io/xxxx",
  
  // 应用发布版本
  release: "my-app@1.0.0",
  
  // 环境
  environment: "production",
  
  // 是否发送用户 IP
  sendDefaultPii: true,
});
```

### 3.3 HTML 快速引入

```html
<!-- 方式一: Loader Script (最简单) -->
<script src="https://browser.sentry-cdn.com/7.x/1.0.0/bundle.min.js"></script>
<script>
  Sentry.init({ dsn: "https://xxxx@sentry.io/xxxx" });
</script>

<!-- 方式二: CDN Bundle -->
<script src="https://browser.sentry-cdn.com/7.x/1.0.0/bundle.min.js"></script>
```

---

## 4. 初始化配置选项

### 4.1 常用选项

```javascript
Sentry.init({
  // 必填: 数据源标识符
  dsn: "https://xxxx@sentry.io/xxxx",
  
  // 应用版本
  release: "my-app@1.0.0",
  
  // 环境名称
  environment: "production",
  
  // 是否发送默认 PII (IP、用户名等)
  sendDefaultPii: false,
  
  // 是否启用调试模式
  debug: false,
  
  // 日志级别
  logLevel: Sentry.LogLevel.Error,
  
  // 采样率 0-1
  tracesSampleRate: 1.0,
  
  // 会话回放采样率
  replaysSessionSampleRate: 0.1,
  
  // 错误会话回放采样率
  replaysOnErrorSampleRate: 1.0,
});
```

### 4.2 集成 (Integrations)

```javascript
Sentry.init({
  dsn: "...",
  
  integrations: [
    // 性能追踪
    Sentry.browserTracingIntegration(),
    
    // 会话回放
    Sentry.replayIntegration({
      blockMedia: true,      // 阻止录制音频/视频
      maskText: true,        // 遮蔽文本内容
      colorScheme: "system", // 跟随系统配色
    }),
    
    // 用户反馈
    Sentry.feedbackIntegration({
      colorScheme: "light",
    }),
  ],
});
```

### 4.3 tracePropagationTargets

控制哪些 URL 启用 trace 传播：

```javascript
Sentry.init({
  dsn: "...",
  
  // 只有这些域名的请求会包含 trace 头
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/api\.example\.com\/api\//,
    "my-app.vercel.app",
  ],
});
```

---

## 5. 捕获错误的方式

### 5.1 自动捕获

默认情况下，Sentry 自动捕获：

- 未处理的异常
- 未处理的 Promise rejections
- 语法错误

```javascript
// Sentry 自动捕获这个错误
throw new Error("Something went wrong!");
```

### 5.2 手动捕获

```javascript
// 捕获普通错误
try {
  somethingRisky();
} catch (e) {
  Sentry.captureException(e);
}

// 捕获消息
Sentry.captureMessage("User not found", "warning");

// 捕获自定义事件
Sentry.captureEvent({
  message: "Custom event",
  contexts: {
    user: { id: "123", email: "test@example.com" },
  },
});
```

### 5.3 设置上下文

```javascript
// 设置用户信息
Sentry.setUser({
  id: "user-123",
  email: "user@example.com",
  username: "johndoe",
});

// 设置标签
Sentry.setTag("version", "1.0.0");
Sentry.setTag("platform", "android");

// 设置额外数据
Sentry.setExtra("memory", process.memoryUsage());

// 设置上下文
Sentry.setContext("profile", {
  name: "John Doe",
  role: "admin",
});
```

### 5.4  breadcrumbs（面包屑）

Sentry 自动记录一系列事件：

```javascript
// 添加自定义 breadcrumb
Sentry.addBreadcrumb({
  message: "User clicked button",
  category: "ui.click",
  data: { buttonId: "submit-btn" },
  level: "info",
});

// 清除所有 breadcrumbs
Sentry.clearBreadcrumbs();
```

### 5.5 作用域管理

```javascript
// 方式一: configureScope
Sentry.configureScope((scope) => {
  scope.setTag("page", "homepage");
  scope.setUser({ id: "123" });
});

// 方式二: withScope
Sentry.withScope((scope) => {
  scope.setTag("feature", "new-checkout");
  Sentry.captureException(error);
});
```

---

## 6. Source Maps 配置

### 6.1 为什么需要 Source Maps

压缩后的代码错误难以调试：

```
压缩前: function calculateTotal(items) { ... }
压缩后: function n(o){ ... }
```

### 6.2 使用 Sentry Wizard

自动配置 source maps 上传：

```bash
npx @sentry/wizard@latest -i sourcemaps
```

### 6.3 手动配置

#### 1. 安装 @sentry/webpack-plugin

```bash
npm install @sentry/webpack-plugin --save-dev
```

#### 2. 配置 webpack

```javascript
// webpack.config.js
const SentryWebpackPlugin = require("@sentry/webpack-plugin");

module.exports = {
  output: {
    sourceMapFilename: "~/sourcemaps/[hash].js.map",
  },
  plugins: [
    new SentryWebpackPlugin({
      include: "./dist",
      ignore: ["node_modules"],
      
      // 从 Sentry 项目设置获取
      org: "your-org",
      project: "your-project",
      
      // 使用 CLI authentication 或 API key
      authToken: process.env.SENTRY_AUTH_TOKEN,
      
      // 或使用 release 管理
      release: process.env.SENTRY_RELEASE,
    }),
  ],
};
```

#### 3. 设置环境变量

```bash
# .env
SENTRY_AUTH_TOKEN=your_auth_token_here
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

---

## 7. 高级功能

### 7.1 性能监控

```javascript
// 创建自定义 span
const span = Sentry.startSpan({
  name: "Fetch user data",
  op: "http",
}, async () => {
  const response = await fetch("/api/user");
  return response.json();
});

// 或者追踪代码块
Sentry.startSpan(
  { name: "Expensive calculation", op: "measurement" },
  () => {
    // 耗时的同步操作
    const result = heavyComputation();
    return result;
  }
);
```

### 7.2 用户反馈

当错误发生时收集用户反馈：

```javascript
// 触发用户反馈表单
const feedback = Sentry.getCurrentHub()
  .getClient()
  .getIntegration(Sentry.FeedbackIntegration);

// 显示内置反馈表单
feedback.attachToButton(document.querySelector("#feedback-btn"));

// 或者手动创建反馈
const userFeedback = {
  eventId: eventId,
  name: "User Name",
  email: "user@example.com",
  comments: "What happened...",
};
Sentry.captureUserFeedback(userFeedback);
```

### 7.3 屏蔽敏感数据

```javascript
Sentry.init({
  dsn: "...",
  
  // 屏蔽 URL 查询参数
  sendDefaultPii: false,
  
  // 静默某些异常
  ignoreErrors: [
    /^(?!.*(important|bug)).*$/,
    "Non-fatal error",
  ],
  
  // 忽略某些异常类型
  denyUrls: [
    /ad\.js$/,
    /analytics\.js$/,
  ],
});
```

### 7.4 隧道模式 (Tunneling)

避免广告拦截器拦截：

```javascript
Sentry.init({
  dsn: "...",
  
  // 添加服务端点作为隧道
  tunnel: "/tunnel",
});
```

服务端需要配置转发到 Sentry。

### 7.5 会话管理

```javascript
// 手动开始会话
Sentry.startSession();

// 结束会话
Sentry.endSession();

// 会话在以下情况自动结束：
// - 页面关闭/隐藏超过 30 分钟
// - 调用 endSession()
//```

---

## 8. 常见问题

### Q1: Sentry 如何处理广告拦截器？

**方案**: 使用 Tunnel 模式，通过自己的服务器转发事件。

### Q2: 如何限制敏感数据上传？

```javascript
Sentry.init({
  dsn: "...",
  
  // 不发送默认 PII
  sendDefaultPii: false,
  
  // 使用 beforeSend 过滤
  beforeSend(event) {
    // 移除可能的敏感信息
    delete event.user.ip_address;
    delete event.request.data.password;
    return event;
  },
});
```

### Q3: Source Maps 上传失败？

1. 检查 `SENTRY_AUTH_TOKEN` 是否正确
2. 确认 `org` 和 `project` 与 Sentry 设置一致
3. 验证 `include` 路径包含正确文件

### Q4: 如何处理 React Router 的路由变化？

```javascript
import { browserTracingIntegration } from "@sentry/react";

Sentry.init({
  dsn: "...",
  integrations: [
    browserTracingIntegration({
      // 自定义路由追踪
      instrumentRouting: (sendReq, startSpan, options) => {
        const handleRoute = (context) => {
          const transaction = startSpan({
            name: context.location.pathname,
            op: "navigation",
          });
          sendReq(context);
        };
        // 监听 React Router 变化
        // ...
      },
    }),
  ],
});
```

### Q5: 如何在 Vue 中使用？

```javascript
import { createApp } from "vue";
import * as Sentry from "@sentry/vue";

const app = createApp(App);

Sentry.init({
  app,
  dsn: "...",
  
  // 追踪 Vue 组件渲染
  tracingOptions: {
    trackComponents: true,
    timeout: 2000,
    hooks: ["mount", "update"],
  },
});

app.mount("#app");
```

---

## 9. 更多资源

- [官方文档](https://docs.sentry.io/platforms/javascript/)
- [SDK 仓库](https://github.com/getsentry/sentry-javascript)
- [React 集成](https://docs.sentry.io/platforms/javascript/react/)
- [Vue 集成](https://docs.sentry.io/platforms/javascript/vue/)
- [Angular 集成](https://docs.sentry.io/platforms/javascript/angular/)
- [Webpack 插件](https://github.com/getsentry/sentry-webpack-plugin)
- [Sentry CLI](https://docs.sentry.io/product/cli/)
