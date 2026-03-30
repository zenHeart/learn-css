# CSS 滚动（Scroll）完全指南

## 概述

CSS 提供了丰富的滚动相关属性，用于控制内容溢出时的显示行为、平滑滚动、滚动吸附等。本文档全面介绍 overflow、scroll-behavior、scroll-snap 等核心属性的用法，以及移动端滚动优化和隐藏滚动条的各种方案。

## CSS overflow 属性

### 基本概念

`overflow` 属性控制内容溢出元素盒子时的显示行为。当元素内容超过其设置的高度/宽度时，浏览器会根据 overflow 的值决定如何处理。

```css
.container {
  width: 200px;
  height: 200px;
  overflow: visible; /* 默认值 */
}
```

### 五个属性值详解

| 属性值 | 滚动条 | 溢出内容 | 描述 |
|--------|--------|----------|------|
| `visible` | ❌ | 显示在盒子外 | 默认值，内容会溢出显示 |
| `hidden` | ❌ | 裁剪隐藏 | 溢出内容不可见，不可滚动 |
| `scroll` | ✅ 始终显示 | 裁剪隐藏 | 始终显示滚动条，内容可滚动 |
| `auto` | ✅ 按需显示 | 裁剪隐藏 | 内容溢出时才显示滚动条 |
| `clip` | ❌ | 裁剪隐藏 | 类似 hidden，但溢出区域不可滚动（现代属性） |

### 逐个讲解

#### visible（默认）

内容会溢出元素边界，在盒子外显示。**这是最容易踩坑的点**——如果没设置 overflow，内容会直接溢出到外部布局中。

```css
.box {
  width: 200px;
  height: 100px;
  border: 1px solid #333;
  overflow: visible; /* 默认 */
}
```

```html
<div class="box">
  这是一段很长的文本内容，它会溢出容器边界显示在外部。
</div>
```

#### hidden

溢出内容被直接裁剪，不显示滚动条，无法通过滚动查看溢出部分。**注意**：`overflow: hidden` 不会禁用滚动，只是隐藏了滚动条。如果内容通过 JavaScript 滚动，溢出内容仍然可以查看。

```css
.box {
  overflow: hidden;
}
```

#### scroll

**始终**显示滚动条（即使内容没有溢出）。这在需要始终提示用户这里可以滚动时很有用，比如聊天消息列表、固定高度的文章目录。

```css
.box {
  overflow: scroll;
}
```

#### auto

**按需显示**滚动条——只有内容溢出时才显示滚动条，没溢出就不显示。这是日常开发中最常用的值，兼顾了视觉整洁和功能完整。

```css
.box {
  overflow: auto;
}
```

#### clip（现代属性）

`overflow: clip` 是 `hidden` 的**严格版本**：

- 相同点：都裁剪溢出内容，都不显示滚动条
- 区别：`hidden` 实际上仍然可以通过编程方式滚动（如 JS 修改 scrollTop）；`clip` 则是完全裁剪，连编程滚动都无效

```css
.box {
  overflow: clip;
}
```

> ⚠️ **浏览器支持**：`overflow: clip` 是 CSS Overflow Level 3 中的新属性，Chrome 90+、Firefox 71+ 支持。Safari 16.4+ 支持。如需兼容旧版浏览器，请使用 `overflow: hidden`。

---

## overflow-x 和 overflow-y

这两个属性允许**分别**控制水平方向和垂直方向的溢出行为。

```css
.container {
  overflow-x: hidden; /* 隐藏水平溢出 */
  overflow-y: auto;   /* 垂直方向按需显示滚动条 */
}
```

### 常见使用场景

#### 场景一：水平溢出容器

```css
.scroll-x {
  overflow-x: auto;
  overflow-y: hidden; /* 禁止垂直滚动 */
  white-space: nowrap; /* 强制单行显示 */
}
```

#### 场景二：顶部 banner 溢出

```css
.hero {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  overflow-x: visible;
}
```

#### 场景三：模拟 iOS 风格的安全区

```css
.safe-area {
  overflow-x: clip;
  overflow-y: auto;
  overscroll-behavior: contain;
}
```

### 注意事项

- 如果 `overflow-x` 和 `overflow-y` 的组合导致没有滚动方向可滚动（即内容同时在两个方向都被裁剪），该元素**不会建立 BFC（块级格式化上下文）**
- `overflow: hidden` 等同于 `overflow-x: hidden; overflow-y: hidden`
- 单独设置一个轴为 `visible` 而另一个为非 `visible`，在某些浏览器中会被重置为 `auto`

---

## scroll-behavior 属性

### 基本用法

`scroll-behavior` 控制用户点击锚链接或 JavaScript 触发滚动时，页面/元素的滚动过渡效果。

```css
html {
  scroll-behavior: auto; /* 默认，立即跳到目标位置 */
  scroll-behavior: smooth; /* 平滑滚动 */
}
```

### 场景一：页面内平滑锚点跳转

```html
<style>
  html {
    scroll-behavior: smooth;
  }
  nav a {
    display: block;
    padding: 10px;
  }
</style>

<nav>
  <a href="#section1">第一章</a>
  <a href="#section2">第二章</a>
  <a href="#section3">第三章</a>
</nav>

<section id="section1">第一章内容...</section>
<section id="section2">第二章内容...</section>
<section id="section3">第三章内容...</section>
```

点击导航链接后，页面会**平滑滚动**到对应章节，而不是瞬间跳转。

### 场景二：局部容器的平滑滚动

```css
.chat-container {
  overflow-y: auto;
  scroll-behavior: smooth;
}
```

### 场景三：JS 触发滚动

```javascript
// 点击按钮滚动到顶部
btn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
```

### 注意事项

- `scroll-behavior: smooth` 会影响 CSS 锚点跳转和 `Element.scrollIntoView()` 的行为
- 性能考虑：全局启用平滑滚动时，每次点击锚点都会触发动画，如果页面锚点很多可能影响体验
- 可以在特定容器上启用，而不是全局启用

---

## 移动端滚动性能优化

### -webkit-overflow-scrolling

这是 WebKit 内核的私有属性，用于控制 iOS Safari 中 `overflow: auto/scroll` 容器的滚动行为。

```css
.scroll-container {
  overflow: auto;
  -webkit-overflow-scrolling: touch; /* 启用惯性滚动 */
  -webkit-overflow-scrolling: auto;   /* 禁用惯性滚动 */
}
```

| 值 | 效果 |
|----|------|
| `auto` | 普通滚动，无惯性效果 |
| `touch` | 启用 iOS 惯性滚动，手指离开后会有减速效果 |

```css
/* 推荐写法：兼顾功能和兼容 */
.scrollable {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  /* 其他优化 */
  overscroll-behavior: contain; /* 防止滚动链传递到父元素 */
}
```

> ⚠️ **注意**：该属性在 iOS 13+ 的某些场景下已被浏览器默认行为取代。但对于兼容旧版 iOS（< iOS 13）和特定场景，仍然需要显式设置。

### scroll-snap 滚动吸附

`scroll-snap` 让滚动操作结束后，元素自动"吸附"到指定的临界点，类似于轮播图的居中效果。

#### 核心属性

```css
/* 父容器：声明滚动类型和对齐方式 */
.snap-container {
  overflow-x: auto;
  scroll-snap-type: x mandatory; /* 水平方向，强制吸附 */
  scroll-snap-type: y proximity;  /* 垂直方向，接近时吸附 */
}

/* 子元素：声明吸附点 */
.snap-item {
  scroll-snap-align: start;   /* 子元素左边缘对齐容器左边缘 */
  scroll-snap-align: center;   /* 子元素居中对齐 */
  scroll-snap-align: end;      /* 子元素右边缘对齐容器右边缘 */
}
```

#### scroll-snap-type 取值

| 值 | 含义 |
|----|------|
| `none` | 不启用吸附 |
| `x` | 仅水平方向吸附 |
| `y` | 仅垂直方向吸附 |
| `both` | 两个方向都吸附 |
| `mandatory` | 滚动结束后**必须**吸附到某个点 |
| `proximity` | 滚动结束后**接近**临界点时吸附（浏览器决定） |

#### scroll-snap-align 取值

| 值 | 含义 |
|----|------|
| `none` | 此元素不定义吸附点 |
| `start` | 吸附到滚动方向的起点 |
| `center` | 吸附到滚动方向的中心 |
| `end` | 吸附到滚动方向的终点 |

#### 实战示例：水平轮播图

```css
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 16px;
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;
}
.carousel::-webkit-scrollbar {
  display: none;
}

.carousel-item {
  flex: 0 0 80%; /* 每个卡片占 80% 宽度 */
  scroll-snap-align: start;
  height: 200px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
}
```

```html
<div class="carousel">
  <div class="carousel-item">卡片 1</div>
  <div class="carousel-item">卡片 2</div>
  <div class="carousel-item">卡片 3</div>
  <div class="carousel-item">卡片 4</div>
</div>
```

#### 实战示例：垂直列表吸附

```css
.snap-list {
  height: 400px;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
}

.snap-list-item {
  height: 400px; /* 与容器同高，保证每次吸附一屏 */
  scroll-snap-align: start;
}
```

### overscroll-behavior 滚动链控制

阻止滚动到底部时触发父元素的滚动（滚动链）。

```css
.modal-content {
  overflow: auto;
  overscroll-behavior: contain; /* 滚动到底部不会触发 body 滚动 */
  overscroll-behavior: none;   /* 完全阻止滚动链 */
}
```

| 值 | 效果 |
|----|------|
| `auto` | 默认，滚动链正常传递 |
| `contain` | 阻止滚动链，但允许自我滚动到达边界时的视觉反馈（如橡皮筋效果） |
| `none` | 完全阻止滚动链和边界效果 |

---

## 隐藏滚动条但保持滚动功能

### 方案一：伪元素遮罩（兼容性最佳）⭐

```css
.hide-scrollbar {
  overflow: auto;
}

/* 仅 Firefox */
.hide-scrollbar {
  scrollbar-width: none; /* 隐藏滚动条 */
}

/* Chrome/Safari/Edge (旧) */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
```

```css
/* 更完整的兼容写法 */
.scrollable {
  overflow: auto;
  scrollbar-width: none;      /* Firefox */
  -ms-overflow-style: none;   /* IE/Edge 旧版 */
}
.scrollable::-webkit-scrollbar {
  display: none;              /* Chrome/Safari/Opera */
}
```

### 方案二：使用 padding 撑开内容 + 滚动区域嵌套

```css
.scroll-wrapper {
  /* 父容器设置足够宽，让滚动条溢出 */
  width: calc(100% + 20px);
  overflow: hidden;
}

.scroll-inner {
  overflow-x: auto;
  overflow-y: hidden;
  /* 把滚动条推到可视区域外 */
  margin-bottom: -20px;
  padding-bottom: 20px; /* 保持内容不被裁剪 */
}
```

### 方案三：自定义滚动条样式（仅 WebKit）

如果只是想让滚动条更美观而不是完全隐藏：

```css
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;      /* 宽度 */
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1; /* 轨道背景 */
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;     /* 滑块颜色 */
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;     /* 悬停颜色 */
}
```

### 方案四：JavaScript 模拟滚动（完全自定义外观）

适用于需要完全自定义滚动体验的场景：

```javascript
// 使用 CSS scroll-snap + 自定义滑块实现完全自定义滚动条
// 配合 CSS scroll-snap 实现吸附效果
```

---

## 常见踩坑点

### 踩坑一：overflow: visible 导致布局错乱

**问题**：父容器没有设置高度，子元素绝对定位后溢出，布局混乱。

```css
/* 错误写法 */
.container {
  position: relative;
  overflow: visible; /* 默认值，内容会溢出 */
}

/* 正确写法 */
.container {
  position: relative;
  overflow: hidden; /* 或 auto/scroll */
}
```

### 踩坑二：overflow: hidden 阻止了 transform 动画

**问题**：`overflow: hidden` 会创建新的 BFC，可能影响内部使用 `position: fixed` 或 `transform` 的元素的定位参考。

**解决方案**：使用 `overflow: clip` 或在动画元素上添加 `will-change: transform`。

### 踩坑三：移动端滚动卡顿

**问题**：在 iOS Safari 中，`overflow: auto` 容器滚动不流畅。

**解决方案**：
```css
.smooth-scroll {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  /* 或 */
  overflow: auto;
  overscroll-behavior-y: contain;
}
```

### 踩坑四：overflow-x/y 组合使用导致无法滚动

**问题**：同时设置 `overflow-x: hidden` 和 `overflow-y: hidden`，导致内容完全不可见且无法滚动。

**解决方案**：明确每个轴的滚动需求，合理设置值。

### 踩坑五：scroll-behavior: smooth 影响页面性能

**问题**：页面有大量锚点链接时，平滑滚动动画可能导致性能问题。

**解决方案**：只在需要的局部容器上启用，而非全局。

### 踩坑六：隐藏滚动条后无法确认滚动位置

**问题**：用户看不到滚动条，不知道内容是否还有更多。

**解决方案**：
- 添加视觉提示（如渐变遮罩、滚动指示图标）
- 使用方案一（伪元素）保持滚动条存在但视觉上更轻量

### 踩坑七：overflow: auto 导致内容闪烁

**问题**：内容高度动态变化时，滚动条在显示/隐藏之间闪烁。

**解决方案**：统一使用 `overflow: scroll` 配合 `scrollbar-width: thin`（Firefox）或自定义细滚动条样式。

---

## 实战技巧汇总

### 水平溢出容器

```css
.horizontal-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}
```

### 固定高度的内容区域

```css
.content-area {
  height: 300px;
  overflow-y: auto;
  overscroll-behavior: contain;
}
```

### 全屏滚动section（类似 One Page Scroll）

```css
.fullpage {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-snap-align: start;
}

.section {
  height: 100vh;
  scroll-snap-align: start;
}
```

### 局部容器内的锚点平滑滚动

```css
.article {
  overflow-y: auto;
  scroll-behavior: smooth;
  /* 需要在 html 标签上同时启用 smooth */
}

html {
  scroll-behavior: smooth;
}
```

---

## 浏览器兼容速查

| 属性 | Chrome | Firefox | Safari | Edge (旧) | Edge (Chromium) |
|------|--------|---------|--------|-----------|-----------------|
| `overflow` (全部值) | 1+ | 1+ | 1+ | 12+ | 79+ |
| `overflow: clip` | 90+ | 71+ | 16.4+ | 79+ | 79+ |
| `scroll-behavior` | 61+ | 36+ | 15.4+ | 79+ | 79+ |
| `scroll-snap-type` | 69+ | 68+ | 15.4+ | 79+ | 79+ |
| `scroll-snap-align` | 69+ | 68+ | 15.4+ | 79+ | 79+ |
| `-webkit-overflow-scrolling` | 所有版本 | 不支持 | 所有版本 | 不支持 | 不支持 |
| `overscroll-behavior` | 63+ | 59+ | 16+ | 18+ | 79+ |
| `scrollbar-width` | 69+ | 64+ | 不支持 | 不支持 | 79+ |

> 💡 **提示**：使用 [Can I Use](https://caniuse.com/) 可查询最新兼容数据。
