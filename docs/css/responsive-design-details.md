# 响应式设计细节

## 目录

1. [Viewport 视口配置](#1-viewport-视口配置)
2. [Media Queries 媒体查询](#2-media-queries-媒体查询)
3. [断点设计](#3-断点设计)
4. [移动优先策略](#4-移动优先策略)
5. [Flex 与 Grid 响应式布局](#5-flex-与-grid-响应式布局)
6. [响应式图片与媒体](#6-响应式图片与媒体)
7. [常见问题与技巧](#7-常见问题与技巧)

---

## 1. Viewport 视口配置

### 1.1 基础配置

移动端开发的第一步，在 `<head>` 中正确声明视口：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 1.2 视口元标签详解

| 属性 | 说明 |
|------|------|
| `width=device-width` | 视口宽度等于设备宽度（单位 px，非 CSS 像素） |
| `initial-scale=1.0` | 初始缩放比例为 1（即 CSS 1px = 设备 1px） |
| `minimum-scale` | 允许的最小缩放比例 |
| `maximum-scale` | 允许的最大缩放比例 |
| `user-scalable=no` | 是否允许用户缩放（不推荐，违反无障碍标准） |

```html
<!-- 标准配置 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- 完整配置（谨慎使用） -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0">
```

### 1.3 视口单位

| 单位 | 说明 |
|------|------|
| `vw` | 视口宽度的 1% |
| `vh` | 视口高度的 1% |
| `vmin` | vw 和 vh 中较小者 |
| `vmax` | vw 和 vh 中较大者 |
| `dvw` / `dvh` | 动态视口（考虑地址栏变化） |

```css
/* 全屏布局 */
.hero {
  height: 100vh;
  width: 100vw;
}

/* 安全区域适配（iPhone刘海屏） */
.safe-area {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

## 2. Media Queries 媒体查询

### 2.1 基本语法

```css
/* 单条件 */
@media (condition) {
  /* 样式规则 */
}

/* 多条件（and） */
@media (min-width: 768px) and (max-width: 1024px) {
  /* 样式规则 */
}

/* 多条件（或） */
@media (max-width: 480px), (hover: none) {
  /* 样式规则 */
}

/* 否定条件 */
@media not (max-width: 768px) {
  /* 768px 以上 */
}
```

### 2.2 常用媒体类型

| 类型 | 说明 |
|------|------|
| `all` | 所有设备（默认） |
| `screen` | 屏幕设备 |
| `print` | 打印预览 |
| `speech` | 语音合成 |

```css
@media print {
  .no-print { display: none; }
  a::after { content: " (" attr(href) ")"; }
}
```

### 2.3 常用媒体特性

| 特性 | 说明 |
|------|------|
| `width` / `height` | 视口宽度/高度 |
| `min-width` / `max-width` | 最小/最大视口宽度 |
| `device-width` | 设备屏幕宽度（已不推荐） |
| `orientation` | 方向：`portrait` / `landscape` |
| `aspect-ratio` | 视口宽高比 |
| `resolution` | 设备分辨率 |
| `color` | 颜色位深 |
| `hover` | 是否支持 hover |
| `pointer` | 指针类型：`fine`（鼠标）、`coarse`（触屏）、`none` |

```css
/* 横屏适配 */
@media (orientation: landscape) {
  .layout { flex-direction: row; }
}

/* 触屏设备 */
@media (pointer: coarse) {
  .btn { min-height: 44px; /* 触控友好的最小尺寸 */ }
}

/* 无 hover 设备（触屏优先） */
@media (hover: none) {
  .dropdown:hover .content { display: block; }
  /* 需要点击触发的替代方案 */
}
```

### 2.4 在 CSS 中引入媒体查询

```css
/* 方式一：直接在样式表中 */
@media (max-width: 768px) {
  .container { padding: 0 16px; }
}

/* 方式二：外部样式表 */
<link rel="stylesheet" media="(max-width: 768px)" href="mobile.css">

/* 方式三：@import（不推荐，性能差） */
@import url('mobile.css') (max-width: 768px);
```

---

## 3. 断点设计

### 3.1 常见断点策略

#### Bootstrap 断点（经典参考）

| 断点 | 设备 | 尺寸 |
|------|------|------|
| `< 576px` | 超小屏幕 |
| `≥ 576px` | 小屏幕手机 |
| `≥ 768px` | 平板 |
| `≥ 992px` | 桌面 |
| `≥ 1200px` | 大桌面 |
| `≥ 1400px` | 超大桌面 |

#### Tailwind CSS 断点

```css
/* sm: 640px */
/* md: 768px */
/* lg: 1024px */
/* xl: 1280px */
/* 2xl: 1536px */
```

#### 自定义断点（推荐：根据内容设计）

```css
/* 内容驱动：组件开始异常时设置断点 */
@media (max-width: 900px) { /* 侧边栏开始堆叠 */ }
@media (max-width: 600px) { /* 导航开始折叠 */ }
```

### 3.2 断点命名规范

```css
/* 移动优先命名 */
--breakpoint-sm: 576px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;

/* 使用 CSS 变量便于维护 */
.container {
  width: 100%;
  max-width: 1200px;
}

@media (min-width: 768px) {
  .container { padding: 0 24px; }
}
```

### 3.3 断点设计原则

1. **内容驱动**：不要硬套固定数值，根据内容自然断点
2. **移动优先**：从最小屏幕开始，逐步为大屏添加样式
3. **避免过度断点**：通常 3-5 个断点足够
4. **记录设计决策**：注释说明每个断点的设计意图

```css
/*
 * 断点决策记录：
 * - 480px: 移动端单列布局
 * - 768px: 平板两列布局
 * - 1024px: 桌面三列布局
 * - 1440px: 大屏最大宽度限制
 */
```

---

## 4. 移动优先策略

### 4.1 核心理念

**先为最小屏幕设计，再逐步为大屏幕增强。**

- 默认样式：最小屏幕（手机）
- `min-width` 媒体查询：平板、桌面

### 4.2 实现方式

#### 基础样式（移动端）

```css
/* 默认（移动端）— 不使用媒体查询 */
.page-layout {
  display: flex;
  flex-direction: column;
}

.sidebar {
  display: none; /* 或 order: 2 推到底部 */
}

.main-content {
  width: 100%;
}

.nav-menu {
  display: none; /* 移动端隐藏，需要汉堡菜单触发 */
}
```

#### 平板及以上

```css
@media (min-width: 768px) {
  .page-layout {
    flex-direction: row;
  }
  
  .sidebar {
    display: block;
    width: 250px;
  }
  
  .main-content {
    flex: 1;
  }
  
  .nav-menu {
    display: flex;
  }
}
```

#### 桌面及以上

```css
@media (min-width: 1024px) {
  .sidebar {
    width: 300px;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### 4.3 移动优先 vs 桌面优先

| 对比 | 移动优先 | 桌面优先 |
|------|----------|----------|
| 默认样式 | 最小屏幕 | 最大屏幕 |
| 媒体查询 | `min-width` | `max-width` |
| 代码量 | 小屏幕少，大屏幕多 | 大屏幕少，小屏幕多 |
| 用户体验 | 核心内容优先 | 功能完整优先 |
| **推荐场景** | 内容型网站 | 复杂交互应用 |

**结论**：大多数场景推荐移动优先，内容逐级增强体验更好。

### 4.4 渐进增强与优雅降级

```css
/* 渐进增强：基础功能 + 增强 */
.card {
  display: flex;
  flex-direction: column; /* 基础 */
}

@media (min-width: 768px) {
  .card {
    flex-direction: row; /* 增强 */
  }
}

/* 优雅降级：先完整体验 + 简化基础 */
@supports (display: grid) {
  .layout {
    display: grid;
    grid-template-columns: 250px 1fr;
  }
}

/* 不支持 grid 时回退 */
.layout {
  display: flex;
}
```

---

## 5. Flex 与 Grid 响应式布局

### 5.1 Flex 响应式布局

#### 自动换行 + 均分

```css
.flex-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.flex-item {
  flex: 1 1 250px; /* 最小 250px，自动扩展 */
}
```

#### 媒体查询调整

```css
/* 移动端单列 */
.card-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 平板双列 */
@media (min-width: 768px) {
  .card-list {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .card {
    flex: 1 1 calc(50% - 8px);
  }
}

/* 桌面三列 */
@media (min-width: 1024px) {
  .card {
    flex: 1 1 calc(33.333% - 11px);
  }
}
```

#### 导航响应式

```css
/* 默认移动端：垂直 */
.nav-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 桌面水平 */
@media (min-width: 768px) {
  .nav-links {
    flex-direction: row;
    gap: 24px;
  }
}
```

### 5.2 Grid 响应式布局

#### 自动适应列数

```css
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
}
```

`minmax(250px, 1fr)` 解读：
- 每列最小 250px
- 如果空间足够，每列最大平分剩余空间
- 自动计算能容纳多少列

#### 显式列数 + 媒体查询

```css
.grid-layout {
  display: grid;
  grid-template-columns: 1fr; /* 默认单列 */
  gap: 16px;
}

@media (min-width: 768px) {
  .grid-layout {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-layout {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

#### 区域布局

```css
.page {
  display: grid;
  grid-template-areas:
    "header"
    "main"
    "sidebar"
    "footer";
  grid-template-rows: auto 1fr auto auto;
}

@media (min-width: 768px) {
  .page {
    grid-template-areas:
      "header header"
      "sidebar main"
      "footer footer";
    grid-template-columns: 250px 1fr;
  }
}

.header { grid-area: header; }
.main { grid-area: main; }
.sidebar { grid-area: sidebar; }
.footer { grid-area: footer; }
```

---

## 6. 响应式图片与媒体

### 6.1 响应式图片

#### srcset 属性

```html
<img 
  src="small.jpg" 
  srcset="small.jpg 500w, medium.jpg 1000w, large.jpg 2000w"
  sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="描述"
>
```

#### `<picture>` 元素

```html
<picture>
  <!-- 移动端 WebP -->
  <source media="(max-width: 600px)" srcset="mobile.webp" type="image/webp">
  <!-- 平板 JPEG -->
  <source media="(max-width: 1024px)" srcset="tablet.jpg" type="image/jpeg">
  <!-- 默认 -->
  <img src="desktop.jpg" alt="描述">
</picture>
```

### 6.2 响应式视频

```css
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 比例 */
  height: 0;
  overflow: hidden;
}

.video-container video,
.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

### 6.3 响应式字体

```css
/* 固定基准 + clamp 缩放 */
h1 {
  font-size: clamp(1.5rem, 2vw + 1rem, 3rem);
  /* 最小 1.5rem，最大 3rem，中间随视口平滑缩放 */
}

/* 纯 clamp 方式 */
.title {
  font-size: clamp(1rem, 0.5rem + 2vw, 2rem);
}
```

---

## 7. 常见问题与技巧

### 7.1 常见布局问题

#### 消除 4px 步长间隙（Flex/Grid 子元素）

```css
.container {
  gap: 16px; /* 直接用 gap，比 margin 更干净 */
}
```

#### 百分比 vs fr 单位

```css
/* 百分比：相对于容器 */
.sidebar { width: 25%; }

/* fr 单位：比例分配 */
.grid { grid-template-columns: 1fr 3fr; }

/* 推荐：fr 更直观，gap 处理更干净 */
```

#### 图片溢出

```css
img {
  max-width: 100%;
  height: auto;
  display: block; /* 消除底部间隙 */
}
```

### 7.2 容器查询（Container Queries）

CSS 容器查询是响应式的未来方向：

```css
/* 定义容器 */
.card-container {
  container-type: inline-size;
  container-name: card;
}

/* 根据容器宽度而非视口 */
@container card (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
```

### 7.3 触控友好尺寸

| 场景 | 最小尺寸 |
|------|----------|
| 触控目标 | 44 × 44 px |
| 按钮 | 高度 ≥ 44px |
| 链接间距 | 间距 ≥ 8px |

```css
@media (pointer: coarse) {
  .btn {
    min-height: 44px;
    padding: 12px 24px;
  }
}
```

### 7.4 打印样式

```css
@media print {
  * { visibility: hidden; }
  
  .print-only { visibility: visible; }
  
  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #666;
  }
}
```

### 7.5 性能优化

| 技巧 | 说明 |
|------|------|
| 避免过多媒体查询 | 合并相似断点 |
| 使用 CSS 变量 | 统一管理断点值 |
| 优先 Flex/Grid | 比浮动布局更高效 |
| 懒加载图片 | `loading="lazy"` |
| 减少重排重绘 | 避免频繁修改布局属性 |

---

## 总结

| 核心概念 | 要点 |
|----------|------|
| **Viewport** | 正确配置是响应式基础，`width=device-width, initial-scale=1.0` |
| **媒体查询** | 优先 `min-width`（移动优先），结合 `hover`、`pointer` 等特性 |
| **断点设计** | 内容驱动，3-5 个断点，记录设计决策 |
| **Flex** | 适合一维布局（导航、列表），`flex-wrap` 实现响应式换行 |
| **Grid** | 适合二维布局（页面、卡片），`auto-fill/auto-fit` 实现自动列数 |
| **渐进增强** | 先基础体验，再为大屏增强 |

响应式设计的核心是**内容优先、渐进增强**，从最小屏幕开始，逐步为大屏幕添加更丰富的体验。
