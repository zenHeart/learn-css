# CSS 媒体查询完整指南

## 概述

媒体查询是 CSS3 引入的特性，允许根据设备类型、屏幕尺寸、分辨率等条件应用不同的样式。

## 基本语法

```css
@media media-type and (media-feature) {
  /* CSS 规则 */
}
```

## 媒体类型 (Media Types)

| 类型 | 说明 |
|------|------|
| all | 所有设备（默认） |
| screen | 屏幕设备 |
| print | 打印预览 |
| speech | 语音合成器 |
| handheld | 手持设备 |
| tv | 电视 |

### 基本示例

```css
/* 屏幕设备 */
@media screen {
  body {
    font-family: Arial, sans-serif;
  }
}

/* 打印时隐藏导航 */
@media print {
  nav {
    display: none;
  }
}
```

## 媒体特性 (Media Features)

### 1. 视口宽度

```css
/* 最小宽度 */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

/* 最大宽度 */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
}

/* 范围 */
@media (min-width: 768px) and (max-width: 1024px) {
  .sidebar {
    width: 200px;
  }
}
```

### 2. 视口高度

```css
@media (min-height: 600px) {
  .hero {
    min-height: 400px;
  }
}
```

### 3. 设备像素比 (DPR)

```css
/* 高清屏幕 (Retina) */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .logo {
    background-image: url(logo@2x.png);
  }
}
```

### 4. 横竖屏

```css
/* 竖屏 */
@media (orientation: portrait) {
  .layout {
    flex-direction: column;
  }
}

/* 横屏 */
@media (orientation: landscape) {
  .layout {
    flex-direction: row;
  }
}
```

### 5. 颜色

```css
/* 检查颜色支持 */
@media (color) {
  .alert {
    background-color: #ff6b6b;
  }
}

/* 颜色位数 */
@media (min-color: 8) {
  .gradient {
    background: linear-gradient(red, blue);
  }
}
```

### 6. 交互特性

```css
/* 支持 hover 的设备 */
@media (hover: hover) {
  .button:hover {
    background-color: #0056b3;
  }
}

/* 支持指针设备 */
@media (pointer: fine) {
  .dropdown {
    cursor: pointer;
  }
}
```

## 常用断点

### 移动优先断点

```css
/* 默认（手机） */
.container {
  padding: 0 1rem;
}

/* 平板竖屏 */
@media (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}

/* 平板横屏 */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

/* 小屏电脑 */
@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}

/* 大屏电脑 */
@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}

/* 超大屏 */
@media (min-width: 1400px) {
  .container {
    max-width: 1320px;
  }
}
```

### Bootstrap 5 断点

| 断点 | 设备 | 尺寸 |
|------|------|------|
| sm | 手机竖屏 | ≥576px |
| md | 平板竖屏/手机横屏 | ≥768px |
| lg | 平板横屏/小屏电脑 | ≥992px |
| xl | 大屏电脑 | ≥1200px |
| xxl | 超大屏 | ≥1400px |

## 媒体查询语法

### 1. 基本样式表引入

```html
<link rel="stylesheet" media="screen and (min-width: 768px)" href="tablet.css" />
```

### 2. @import

```css
@import url("tablet.css") screen and (min-width: 768px);
```

### 3. @media

```css
@media screen and (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}
```

## 逻辑操作符

### and

```css
@media (min-width: 768px) and (max-width: 1024px) {
  .sidebar {
    display: block;
  }
}
```

### 逗号 (或)

```css
@media (min-width: 768px), (orientation: portrait) {
  .sidebar {
    display: block;
  }
}
```

### not

```css
@media not screen and (hover: none) {
  /* 非触屏设备 */
  .tooltip {
    display: none;
  }
}
```

### only

```css
/* 仅在支持媒体查询的设备上应用 */
@media only screen {
  body {
    font-size: 16px;
  }
}
```

## 实用示例

### 1. 响应式导航

```css
/* 默认：移动端（汉堡菜单） */
.nav-menu {
  display: none;
}

@media (min-width: 768px) {
  .nav-menu {
    display: flex;
    gap: 2rem;
  }
  
  .menu-toggle {
    display: none;
  }
}
```

### 2. 响应式网格

```css
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 576px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1200px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### 3. 响应式字体

```css
:root {
  --base-font-size: 16px;
}

html {
  font-size: var(--base-font-size);
}

@media (min-width: 768px) {
  :root {
    --base-font-size: 18px;
  }
}

@media (min-width: 1200px) {
  :root {
    --base-font-size: 20px;
  }
}
```

### 4. 暗色模式

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1a1a1a;
    --text-color: #f0f0f0;
  }
}
```

## 最佳实践

### 1. 移动优先 vs 桌面优先

**移动优先**（推荐）：
```css
/* 基样式（手机） */
.container {
  padding: 0 1rem;
}

/* 平板及以上 */
@media (min-width: 768px) {
  .container {
    padding: 0 2rem;
  }
}
```

**桌面优先**：
```css
/* 基样式（桌面） */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 平板及以下 */
@media (max-width: 991px) {
  .container {
    max-width: 100%;
  }
}
```

### 2. 避免过度使用

```css
/* 不好：太多断点 */
@media (min-width: 320px) { ... }
@media (min-width: 375px) { ... }
@media (min-width: 425px) { ... }

/* 好：合理断点 */
@media (min-width: 576px) { ... }
@media (min-width: 768px) { ... }
@media (min-width: 992px) { ... }
```

### 3. 使用相对单位

```css
/* 好：使用 em 或 rem */
@media (min-width: 48em) {
  body {
    font-size: 1.125rem;
  }
}
```

## 兼容性

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| @media | 1+ | 1+ | 1+ | 12+ |
| min/max-width | 1+ | 3.5+ | 4+ | 12+ |
| orientation | 9+ | 6+ | 5+ | 12+ |
| aspect-ratio | 38+ | 38+ | 9+ | 79+ |
| color | 1+ | 3+ | 3+ | 12+ |

## 相关属性

- [@media](./media-queries.md)
- [prefers-color-scheme](./prefers-color-scheme.md)
- [prefers-reduced-motion](./prefers-reduced-motion.md)

## 参考资源

- [MDN @media](https://developer.mozilla.org/en-US/docs/Web/CSS/@media)
- [CSS Media Queries Level 4](https://www.w3.org/TR/mediaqueries-4/)
