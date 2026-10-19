# CSS 媒体查询（Media Queries）详解

## 概述

媒体查询是 CSS3 引入的一种强大特性，允许我们根据设备类型、屏幕尺寸、屏幕方向等条件来应用不同的样式。通过媒体查询，我们可以构建响应式网页，让同一份 HTML/CSS 适配手机、平板、电脑等各种设备。

## 基本语法

### 方式一：@import 导入

```css
@import url("tablet.css") screen and (min-width: 768px);
```

### 方式二：@media 规则

```css
/* 基础样式（移动优先） */
body {
  font-size: 16px;
}

/* 当屏幕宽度 >= 768px 时生效 */
@media screen and (min-width: 768px) {
  body {
    font-size: 18px;
  }
}
```

### 方式三：link 标签的 media 属性

```html
<link rel="stylesheet" href="mobile.css" media="screen and (max-width: 767px)">
<link rel="stylesheet" href="desktop.css" media="screen and (min-width: 768px)">
```

## 媒体类型（Media Types）

| 类型 | 说明 |
|------|------|
| `all` | 所有设备（默认值） |
| `screen` | 屏幕设备（电脑、手机、平板） |
| `print` | 打印预览和打印输出 |
| `speech` | 语音合成器 |
| `braille` | 盲文触摸设备 |
| `embossed` | 盲文打印机 |
| `handheld` | 手持设备（已过时） |
| `projection` | 投影仪 |
| `tty` | 电传打字机 |
| `tv` | 电视设备 |

## 媒体特性（Media Features）

### 视口/屏幕尺寸

```css
/* 最小宽度 */
@media (min-width: 768px) { }

/* 最大宽度 */
@media (max-width: 767px) { }

/* 宽度范围 */
@media (min-width: 768px) and (max-width: 1023px) { }

/* 高度相关 */
@media (min-height: 600px) { }
@media (max-height: 599px) { }
```

### 设备特性

```css
/* 设备宽度（整个屏幕，不是视口） */
@media (device-width: 768px) { }

/* 设备高度 */
@media (device-height: 1024px) { }

/* 设备宽高比 */
@media (device-aspect-ratio: 16/9) { }

/* 视口宽高比 */
@media (aspect-ratio: 16/9) { }
```

### 屏幕方向

```css
/* 纵向模式（高度 > 宽度） */
@media (orientation: portrait) {
  .container {
    flex-direction: column;
  }
}

/* 横向模式（宽度 > 高度） */
@media (orientation: landscape) {
  .container {
    flex-direction: row;
  }
}
```

### 屏幕分辨率

```css
/* 高清屏幕（点每英寸 >= 2） */
@media (resolution: 2dppx) { }

/* 最小分辨率 */
@media (min-resolution: 192dpi) { }
```

### 颜色特性

```css
/* 检查设备是否支持颜色 */
@media (color) { }

/* 颜色位深 */
@media (min-color: 8) { }
```

### 交互特性

```css
/* 是否支持 hover */
@media (hover: hover) { }
@media (hover: none) { }

/* 是否有指针设备 */
@media (pointer: fine) { }   /* 鼠标 */
@media (pointer: coarse) { }  /* 触摸 */
@media (pointer: none) { }    /* 键盘/语音 */
```

### 脚本支持

```css
/* JavaScript 是否可用 */
@media (scripting: none) { }
@media (scripting: enabled) { }
@media (scripting: initial-only) { }
```

### 动画和过渡

```css
/* 是否支持动画 */
@media (prefers-reduced-motion: no-preference) { }
@media (prefers-reduced-motion: reduce) { }
```

## 逻辑运算符

### and（并且）

```css
/* 同时满足多个条件 */
@media (min-width: 768px) and (max-width: 1023px) and (orientation: landscape) {
  .sidebar {
    display: block;
  }
}
```

### ,（或）

```css
/* 满足任一条件 */
@media (min-width: 768px), (print) {
  .sidebar {
    display: block;
  }
}
```

### not（取反）

```css
/* 取反整个媒体查询（注意：not 必须放在最前面） */
@media not screen and (min-width: 768px) {
  /* 不是屏幕且宽度 >= 768px */
}

/* 正确写法 */
@media not all and (min-width: 768px) {
  /* 等价于 not (all and (min-width: 768px)) */
}
```

### only（仅）

```css
/* 仅对支持媒体查询的设备生效，防止老浏览器误解 */
@media only screen and (min-width: 768px) {
  .sidebar {
    display: block;
  }
}
```

## 响应式设计策略

### 移动优先（Mobile First）

```css
/* 基础样式：移动设备 */
.container {
  padding: 16px;
}

.column {
  display: block;
}

/* 平板及以上 */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }

  .column {
    display: flex;
    gap: 16px;
  }
}

/* 桌面及以上 */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}

/* 大屏幕 */
@media (min-width: 1440px) {
  .container {
    max-width: 1400px;
  }
}
```

### 桌面优先（Desktop First）

```css
/* 基础样式：桌面设备 */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.column {
  display: flex;
}

/* 平板及以下 */
@media (max-width: 1023px) {
  .column {
    display: block;
  }
}

/* 移动设备 */
@media (max-width: 767px) {
  .container {
    padding: 16px;
  }
}
```

## 常用断点参考

### Bootstrap 断点

| 断点 | 设备 | 宽度范围 |
|------|------|----------|
| `xs` | 手机 | < 576px |
| `sm` | 平板 | ≥ 576px |
| `md` | 桌面 | ≥ 768px |
| `lg` | 桌面 | ≥ 992px |
| `xl` | 大桌面 | ≥ 1200px |
| `xxl` | 超大桌面 | ≥ 1400px |

### Tailwind CSS 断点

| 断点 | 宽度 |
|------|------|
| `sm` | ≥ 640px |
| `md` | ≥ 768px |
| `lg` | ≥ 1024px |
| `xl` | ≥ 1280px |
| `2xl` | ≥ 1536px |

## 实战示例

### 示例 1：响应式导航栏

```css
/* 移动优先：汉堡菜单 */
.navbar {
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.menu {
  display: none;
  flex-direction: column;
  gap: 12px;
}

/* 平板及以上：横向菜单 */
@media (min-width: 768px) {
  .navbar {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .menu {
    display: flex;
    flex-direction: row;
    gap: 24px;
  }
}
```

### 示例 2：响应式网格布局

```css
.grid {
  display: grid;
  gap: 16px;
}

/* 默认：单列 */
.grid {
  grid-template-columns: 1fr;
}

/* 平板：双列 */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 桌面：三列 */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 大屏：四列 */
@media (min-width: 1440px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### 示例 3：响应式文字大小

```css
/* 使用 clamp() 实现流畅响应式字体 */
.heading {
  font-size: clamp(1.5rem, 4vw, 3rem);
  /* 最小 1.5rem，最大 3rem，中间范围随视口缩放 */
}

/* 或使用媒体查询 */
.title {
  font-size: 24px;
}

@media (min-width: 768px) {
  .title {
    font-size: 32px;
  }
}

@media (min-width: 1024px) {
  .title {
    font-size: 40px;
  }
}
```

### 示例 4：响应式图片

```css
/* 使用 srcset 和 sizes */
.responsive-image {
  width: 100%;
  height: auto;
}

/* 背景图片响应式 */
.hero {
  background-image: url('mobile-bg.jpg');
  background-size: cover;
}

@media (min-width: 768px) {
  .hero {
    background-image: url('tablet-bg.jpg');
  }
}

@media (min-width: 1024px) {
  .hero {
    background-image: url('desktop-bg.jpg');
  }
}
```

### 示例 5：深色模式适配

```css
/* 系统深色模式 */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #121212;
    color: #ffffff;
  }

  .card {
    background-color: #1e1e1e;
    border-color: #333;
  }
}

/* 自定义深色模式 */
@media (max-width: 767px) {
  body.dark-mode {
    background-color: #121212;
    color: #ffffff;
  }
}
```

### 示例 6：触摸设备适配

```css
/* 非触摸设备：显示悬停效果 */
@media (hover: hover) and (pointer: fine) {
  .button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
  }
}

/* 触摸设备：禁用悬停效果 */
@media (hover: none) or (pointer: coarse) {
  .button:active {
    background-color: #004494;
  }
}
```

## 减少动画偏好

```css
/* 允许动画 */
@media (prefers-reduced-motion: no-preference) {
  .animation {
    animation: spin 1s linear infinite;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .animation {
    animation: none;
    transition: none;
  }
}
```

## 调试技巧

### 使用浏览器开发者工具

1. 打开 DevTools（F12）
2. 点击设备模拟图标（或按 Ctrl+Shift+M）
3. 选择设备或自定义尺寸
4. 实时查看媒体查询生效情况

### 在 CSS 中添加调试信息

```css
/* 临时添加断点标识 */
body::before {
  content: "Mobile";
  display: none;
}

@media (min-width: 768px) {
  body::before {
    content: "Tablet";
  }
}

@media (min-width: 1024px) {
  body::before {
    content: "Desktop";
  }
}
```

## 性能注意事项

### 1. 避免嵌套过深

```css
/* 不推荐：过多嵌套 */
@media (min-width: 768px) {
  .container {
    @media (min-width: 1024px) {
      /* 嵌套过深 */
    }
  }
}
```

### 2. 合并相同媒体查询

```css
/* 不推荐：分散的相同媒体查询 */
@media (min-width: 768px) {
  .container { padding: 24px; }
}

@media (min-width: 768px) {
  .sidebar { display: block; }
}

/* 推荐：合并 */
@media (min-width: 768px) {
  .container { padding: 24px; }
  .sidebar { display: block; }
}
```

### 3. 使用层叠合理组织

```css
/* 基础样式 */
.card {
  padding: 16px;
  font-size: 14px;
}

/* 平板及以上 */
@media (min-width: 768px) {
  .card {
    padding: 24px;
    font-size: 16px;
  }
}
```

## 浏览器支持

媒体查询在所有现代浏览器中得到良好支持：

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| 媒体类型 | ✅ 1+ | ✅ 1+ | ✅ 1+ | ✅ 12+ |
| 宽度/高度特性 | ✅ 1+ | ✅ 1+ | ✅ 3+ | ✅ 12+ |
| orientation | ✅ 3+ | ✅ 6+ | ✅ 5+ | ✅ 12+ |
| resolution | ✅ 29+ | ✅ 16+ | ✅ 6+ | ✅ 12+ |
| hover/pointer | ✅ 49+ | ✅ 64+ | ✅ 9+ | ✅ 41+ |
| prefers-color-scheme | ✅ 76+ | ✅ 67+ | ✅ 12.1+ | ✅ 79+ |
| prefers-reduced-motion | ✅ 74+ | ✅ 63+ | ✅ 10.1+ | ✅ 79+ |

## 总结

| 媒体特性 | 说明 | 示例 |
|----------|------|------|
| `width/height` | 视口尺寸 | `(min-width: 768px)` |
| `device-width/height` | 设备屏幕尺寸 | `(max-device-width: 480px)` |
| `orientation` | 屏幕方向 | `(orientation: landscape)` |
| `hover` | 是否支持悬停 | `(hover: hover)` |
| `pointer` | 指针设备类型 | `(pointer: coarse)` |
| `prefers-color-scheme` | 深色/浅色模式 | `(prefers-color-scheme: dark)` |
| `prefers-reduced-motion` | 减少动画偏好 | `(prefers-reduced-motion: reduce)` |

## 参考资源

- [MDN Media Queries](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Media_Queries)
- [CSS Tricks - Media Queries](https://css-tricks.com/css-media-queries/)
- [Media Queries Standard](https://www.w3.org/TR/mediaqueries-4/)
- [Use DevTools to debug media queries](https://developer.chrome.com/docs/devtools/css/testing/)
