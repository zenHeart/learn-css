# CSS Scroll 滚动详解

## 概述

CSS 滚动机制涉及多个属性，涵盖溢出滚动、平滑滚动、滚动吸附、移动端性能优化等场景。掌握这些属性可以构建流畅的用户滚动体验。

## 1. overflow 属性详解

`overflow` 控制内容超出容器时的显示行为，是最基础的滚动控制属性。

### 语法

```css
.container {
  overflow: visible | hidden | scroll | auto | clip | hidden | scroll;
}
```

### 四种值对比

| 值 | 超出时显示滚动条 | 超出时可滚动 | 超出时内容可见 | 典型场景 |
|----|:---:|:---:|:---:|----------|
| `visible` | ❌ | ❌ | ✅ | 默认值，内容溢出容器 |
| `hidden` | ❌ | ❌ | ❌ | 裁剪溢出内容 |
| `scroll` | ✅（始终显示） | ✅ | ❌ | 始终显示滚动条区域 |
| `auto` | ❌（内容溢出时才显示） | ✅ | ❌ | 按需显示滚动条 |

### 代码示例

```html
<div class="scroll-container visible-demo">
  <p>这是 visible 值，内容会溢出到容器外部显示。</p>
</div>

<div class="scroll-container hidden-demo">
  <p>这是 hidden 值，超出部分被直接裁剪。</p>
</div>

<div class="scroll-container scroll-demo">
  <p>这是 scroll 值，始终显示滚动条（即使内容未溢出）。</p>
</div>

<div class="scroll-container auto-demo">
  <p>这是 auto 值，只有内容溢出时才显示滚动条。</p>
</div>

<style>
.scroll-container {
  width: 200px;
  height: 100px;
  border: 1px solid #ccc;
  margin-bottom: 16px;
}

.visible-demo { overflow: visible; }
.hidden-demo  { overflow: hidden; }
.scroll-demo  { overflow: scroll; }
.auto-demo    { overflow: auto; }
</style>
```

### 常见误区

- **`visible` + `hidden` 组合无效**：在现代 CSS 中，`overflow: visible` 与 `overflow: hidden` 同时设置在一轴上会导致该轴变为 `auto` 行为。
- **`overflow: hidden` 不阻止滚动**：如果内容被固定定位在视口外部，`overflow: hidden` 不会阻止滚动传播。

## 2. overflow-x 和 overflow-y

`overflow-x` 和 `overflow-y` 分别控制水平方向和垂直方向的溢出行为。

### 语法

```css
.container {
  overflow-x: visible | hidden | scroll | auto;  /* 水平方向 */
  overflow-y: visible | hidden | scroll | auto;  /* 垂直方向 */
}
```

### 使用场景

#### 场景一：横向溢出文本（文字换行控制）

```css
/* 不换行，超出显示省略号 */
.no-wrap {
  white-space: nowrap;
  overflow-x: auto;   /* 水平滚动查看全部内容 */
  overflow-y: hidden;
}

/* 不换行，溢出隐藏 */
.no-wrap-clip {
  white-space: nowrap;
  overflow-x: hidden;  /* 溢出部分直接裁剪 */
  overflow-y: hidden;
}
```

#### 场景二：仅垂直滚动（禁止水平滚动）

```css
.vert-scroll {
  overflow-x: hidden;  /* 隐藏水平溢出 */
  overflow-y: auto;    /* 允许垂直滚动 */
}
```

#### 场景三：仅水平滚动（禁止垂直滚动）

```css
.horiz-scroll {
  overflow-x: auto;
  overflow-y: hidden;
}
```

### 独立设置 x/y 的实际效果

| overflow-x | overflow-y | 实际行为 |
|------------|------------|----------|
| `hidden` | `auto` | 水平裁剪，垂直滚动 |
| `auto` | `hidden` | 水平滚动，垂直裁剪 |
| `hidden` | `hidden` | 完全裁剪，不可滚动 |
| `scroll` | `scroll` | 两轴始终显示滚动条 |

> **注意**：当 `overflow-x` 和 `overflow-y` 其中一个为 `visible` 而另一个不是 `visible` 时，`visible` 会被浏览器重置为 `auto`。这是 CSS 规范中的"unsafe non-visible value"规则。

## 3. scroll-behavior 实现平滑滚动

`scroll-behavior` 控制锚点跳转或 `scrollTo()` 触发时的滚动动画。

### 语法

```css
html {
  scroll-behavior: auto;   /* 立即跳转到目标（默认） */
  scroll-behavior: smooth;  /* 平滑滚动动画 */
}
```

### 代码示例

#### 基础用法

```html
<nav>
  <a href="#section1">章节1</a>
  <a href="#section2">章节2</a>
  <a href="#section3">章节3</a>
</nav>

<section id="section1">第一章内容...</section>
<section id="section2">第二章内容...</section>
<section id="section3">第三章内容...</section>

<style>
html {
  scroll-behavior: smooth;
}

nav a {
  scroll-margin-top: 20px; /* 滚动时留出顶部导航空间 */
}
</style>
```

#### JavaScript 触发平滑滚动

```javascript
// 方法一：scrollIntoView
element.scrollIntoView({ behavior: 'smooth' });

// 方法二：scrollTo + CSS scroll-behavior
element.scrollTo({ top: 1000, behavior: 'smooth' });

// 方法三：CSS scroll-behavior: smooth + 改变 scrollTop
element.scrollTop = 1000; // 配合 CSS 平滑过渡
```

#### 进阶：自定义滚动持续时间

`scroll-behavior` 由浏览器控制，无法自定义时长。如果需要精确控制，使用 JavaScript：

```javascript
function smoothScrollTo(target, duration = 800) {
  const start = window.scrollY;
  const end = typeof target === 'number' ? target : target.offsetTop;
  const change = end - start;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // easeInOutCubic 缓动函数
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, start + change * ease);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}
```

### 浏览器支持

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| `scroll-behavior` | ✅ 61+ | ✅ 36+ | ✅ 15.4+ | ✅ 79+ |
| `scroll-margin` | ✅ 56+ | ✅ 68+ | ✅ 15.4+ | ✅ 79+ |

## 4. 移动端滚动性能优化

### 4.1 -webkit-overflow-scrolling（iOS 惯性滚动）

在 iOS Safari 中，`overflow: auto` 或 `scroll` 的元素默认没有惯性滚动效果，需要开启 `-webkit-overflow-scrolling`。

```css
.scroll-container {
  overflow: auto;
  -webkit-overflow-scrolling: touch; /* 开启惯性滚动（iOS） */
  /* 可选：auto = 无惯性，touch = 有惯性 */
}
```

> **注意**：
> - `auto` 值在 iOS Safari 14+ 默认为惯性滚动
> - 该属性为 WebKit 私有前缀，现代 iOS Safari（14+）已逐步废弃此属性，默认为惯性滚动
> - 兼容性考虑：Android 设备无需此属性，原生支持惯性滚动

### 4.2 scroll-snap 滚动吸附

`scroll-snap` 控制滚动结束后将视口吸附到指定的"捕捉点"，常用于轮播图、照片墙、标签切换等场景。

#### 核心属性

| 属性 | 说明 | 可选值 |
|------|------|--------|
| `scroll-snap-type` | 吸附类型和方向 | `none`、`x`、`y`、`both`、`mandatory`、`proximity` |
| `scroll-snap-align` | 子元素的吸附对齐方式 | `none`、`start`、`center`、`end` |
| `scroll-snap-stop` | 是否禁止跳过吸附点 | `normal`、`always` |

#### 语法

```css
/* 容器 */
.scroller {
  scroll-snap-type: x mandatory;  /* 水平方向，强制吸附 */
  scroll-snap-type: y proximity;   /* 垂直方向，靠近时吸附 */
  overflow-x: auto;
  display: flex;
}

/* 子元素 */
.snap-item {
  scroll-snap-align: start;   /* 吸附到起始边缘 */
  scroll-snap-align: center;   /* 吸附到中心 */
  scroll-snap-align: end;     /* 吸附到结束边缘 */
}
```

#### 实用示例：水平轮播图

```html
<div class="carousel">
  <div class="carousel-track">
    <div class="carousel-item" style="background: #3b82f6;">Slide 1</div>
    <div class="carousel-item" style="background: #a371f7;">Slide 2</div>
    <div class="carousel-item" style="background: #3fb950;">Slide 3</div>
    <div class="carousel-item" style="background: #f0883e;">Slide 4</div>
    <div class="carousel-item" style="background: #db61a2;">Slide 5</div>
  </div>
  <div class="carousel-dots">
    <span class="dot active"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  </div>
</div>

<style>
.carousel {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.carousel-track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 12px;
  scrollbar-width: none;      /* Firefox 隐藏滚动条 */
  -ms-overflow-style: none;
  padding-bottom: 12px;
}

.carousel-track::-webkit-scrollbar {
  display: none;               /* Chrome/Safari 隐藏滚动条 */
}

.carousel-item {
  flex: 0 0 85%;              /* 每个 item 占 85% 宽度 */
  height: 200px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 600;
  scroll-snap-align: center;
}
</style>
```

#### 吸附类型对比

| 类型 | 说明 | 适用场景 |
|------|------|---------|
| `mandatory` | 滚动结束必须停在吸附点 | 精确分页（轮播图、相册） |
| `proximity` | 浏览器自行决定是否吸附（接近时吸附） | 灵活吸附（标签切换） |

#### 进阶：分页吸附（每页多个 item）

```css
.gallery {
  scroll-snap-type: x mandatory;
  overflow-x: auto;
  display: grid;
  grid-columns: repeat(3, 1fr); /* 每行3个 */
  gap: 8px;
}

.gallery-item {
  scroll-snap-align: start;
}
```

### 4.3 overscroll-behavior 滚动边界处理

`overscroll-behavior` 控制滚动到达边界时的行为（是否触发父容器滚动、是否显示橡胶效果）。

```css
.container {
  overscroll-behavior: contain;  /* 阻止滚动传播，禁用橡胶效果 */
  overscroll-behavior: none;    /* 完全禁用 */
  overscroll-behavior: auto;    /* 默认行为 */
}
```

#### 使用场景

| 值 | 行为 | 场景 |
|----|------|------|
| `contain` | 阻止滚动链，禁用边界拉扯效果 | 地图、嵌套滚动区域 |
| `none` | 禁用所有边界效果 | 全屏游戏、App-like 界面 |
| `auto` | 默认，边界拉扯可传播 | 普通页面 |

```html
<!-- 嵌套滚动示例 -->
<div class="outer-scroll">
  <div class="inner-scroll">
    <!-- 滚动到边界不会触发 outer 滚动 -->
    <p>内容...</p>
  </div>
</div>

<style>
.inner-scroll {
  overscroll-behavior: contain; /* 滚动隔离 */
}
</style>
```

## 5. 隐藏滚动条但保持滚动功能

### 方法对比

| 方法 | 兼容性 | 视觉 | 滚动功能 | 可访问性 |
|------|--------|------|----------|---------|
| `::-webkit-scrollbar { display: none }` | WebKit | ✅ 完全隐藏 | ✅ 正常 | ⚠️ 需确保键盘可滚动 |
| `scrollbar-width: none` | Firefox | ✅ 完全隐藏 | ✅ 正常 | ⚠️ 需确保键盘可滚动 |
| 宽度设为 0 + padding | 通用 | ✅ 隐藏 | ✅ 正常 | ✅ 更好 |
| `scrollbar-gutter` | 现代浏览器 | 保留空白 | ✅ 正常 | ✅ 最好 |

### 方法一：伪元素遮罩（推荐）

```css
.hide-scrollbar {
  overflow: auto;
  scrollbar-width: none;           /* Firefox */
  -ms-overflow-style: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;                   /* Chrome, Safari, Edge */
}
```

### 方法二：使用 padding 缩小滚动条（保持功能）

```css
.reduce-scrollbar {
  overflow-y: auto;
  padding-right: 8px;              /* 为滚动条腾出空间 */
}

.reduce-scrollbar::-webkit-scrollbar {
  width: 4px;                      /* 滚动条变细 */
}
.reduce-scrollbar::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 2px;
}
```

### 方法三：滚动区域外嵌套 div

```html
<div class="scroll-wrapper">
  <div class="scroll-content">
    长内容区域...
  </div>
</div>

<style>
.scroll-wrapper {
  overflow: hidden;               /* 隐藏原生滚动条 */
  height: 200px;
}

.scroll-content {
  overflow-y: auto;
  height: calc(100% + 20px);      /* 撑开一点以显示完整内容 */
  padding-right: 20px;            /* 补偿隐藏滚动条的空间 */
}

.scroll-content::-webkit-scrollbar {
  width: 0;                        /* 隐藏滚动条 */
}
</style>
```

### 方法四：使用 `scrollbar-gutter`（现代方案）

```css
.gutter-scroll {
  overflow: auto;
  scrollbar-gutter: stable;        /* 保留滚动条空间，不覆盖内容 */
  scrollbar-width: thin;           /* Firefox 细滚动条 */
}

.gutter-scroll::-webkit-scrollbar {
  width: 6px;                      /* Chrome 细滚动条 */
}
```

### 键盘可滚动性保障

隐藏滚动条后，确保用户仍可通过键盘（Tab + 方向键）滚动：

```css
.hide-scrollbar:focus-visible {
  outline: 2px solid #58a6ff;
  outline-offset: 2px;
}
```

```html
<div class="hide-scrollbar" tabindex="0" role="region" aria-label="可滚动区域">
  <!-- 内容 -->
</div>
```

## 6. 固定表头/列的表格滚动方案

### 方案一：display: block + 独立表头（推荐）

```html
<div class="table-wrapper">
  <div class="table-header">
    <table>
      <thead>
        <tr>
          <th>姓名</th>
          <th>部门</th>
          <th>职位</th>
          <th>邮箱</th>
          <th>电话</th>
        </tr>
      </thead>
    </table>
  </div>
  <div class="table-body">
    <table>
      <tbody>
        <tr>
          <td>张三</td>
          <td>技术部</td>
          <td>前端工程师</td>
          <td>zhangsan@example.com</td>
          <td>13800138000</td>
        </tr>
        <!-- 更多行... -->
      </tbody>
    </table>
  </div>
</div>

<style>
.table-wrapper {
  display: flex;
  flex-direction: column;
  max-height: 300px;         /* 表格最大高度 */
  width: 100%;
  overflow: hidden;
  border: 1px solid #30363d;
  border-radius: 6px;
}

.table-header table,
.table-body table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;        /* 列宽固定 */
}

.table-header {
  flex: 0 0 auto;             /* 表头不压缩 */
}

.table-body {
  flex: 1 1 auto;             /* 表体可滚动 */
  overflow-y: auto;
  overflow-x: auto;
}

th, td {
  padding: 10px 16px;
  text-align: left;
  border-bottom: 1px solid #30363d;
  width: 150px;               /* 固定列宽 */
  min-width: 150px;
}

th {
  background: #161b22;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 1;
}

.table-body td {
  background: #0d1117;
}

.table-body tr:hover td {
  background: #161b22;
}
</style>
```

### 方案二：CSS `position: sticky` 固定表头

```css
table {
  border-collapse: collapse;
  width: 100%;
}

thead th {
  position: sticky;
  top: 0;
  background: #f5f5f5;
  z-index: 1;
}

/* 固定左侧列 */
tbody th {
  position: sticky;
  left: 0;
  background: #f5f5f5;
  z-index: 1;
}
```

### 方案三：双层表格 + 滚动同步

当需要同时固定表头和左侧列时：

```html
<div class="table-scroll" id="tableScroll">
  <div class="thead-fixed">
    <table>
      <thead>...</thead>
    </table>
  </div>
  <div class="tbody-scroll">
    <table>
      <tbody>...</tbody>
    </table>
  </div>
</div>

<script>
// 水平滚动同步
document.querySelector('.tbody-scroll').addEventListener('scroll', (e) => {
  document.querySelector('.thead-fixed').scrollLeft = e.target.scrollLeft;
});
</script>
```

### 方案对比

| 方案 | 表头固定 | 左侧列固定 | 右侧列固定 | 复杂度 |
|------|:---:|:---:|:---:|:---:|
| `display: block` | ✅ | ❌ | ❌ | 低 |
| `position: sticky` | ✅ | ✅ | ✅ | 低 |
| 双层表格 + JS 同步 | ✅ | ✅ | ✅ | 中 |
| CSS `has()` 伪类 | ✅ | ✅ | ❌ | 低（现代浏览器） |

## 7. 惯性滚动与滚动边界处理

### 7.1 惯性滚动的启用与禁用

```css
/* 启用惯性滚动（iOS Safari 默认） */
.scrollable {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

/* 禁用惯性滚动（立即停止） */
.no-bounce {
  overflow: auto;
  -webkit-overflow-scrolling: auto; /* iOS */
  overscroll-behavior: none;        /* 通用，禁用拉扯效果 */
}
```

### 7.2 滚动边界拉扯效果（Pull-to-Refresh 场景）

```css
/* 允许边界拉扯（默认） */
.normal-scroll {
  overscroll-behavior: auto;
}

/* 禁用边界拉扯 */
.no-overscroll {
  overscroll-behavior: contain;
}

/* 禁止拉扯 + 禁用父级滚动链 */
.isolate-scroll {
  overscroll-behavior: none contain;
}
```

### 7.3 自定义惯性滚动参数（高级）

JavaScript 可以精细控制惯性滚动的物理参数：

```javascript
// 使用 WheelEvent 模拟自定义滚动行为
let velocity = 0;
let friction = 0.95;
let isScrolling = false;

element.addEventListener('wheel', (e) => {
  e.preventDefault();
  velocity += e.deltaY * 0.5;
  isScrolling = true;
  requestAnimationFrame(applyScroll);
});

function applyScroll() {
  if (!isScrolling) return;

  velocity *= friction;
  element.scrollTop += velocity;

  if (Math.abs(velocity) > 0.1) {
    requestAnimationFrame(applyScroll);
  } else {
    isScrolling = false;
  }
}
```

### 7.4 滚动边界检测事件

```javascript
// 检测滚动是否到达边界
element.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight, scrollWidth, clientWidth } = element;

  const isAtTop    = scrollTop === 0;
  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
  const isAtLeft   = scrollLeft === 0;
  const isAtRight  = scrollLeft + clientWidth >= scrollWidth - 1;

  console.log({ isAtTop, isAtBottom, isAtLeft, isAtRight });
});

// 使用 Intersection Observer 检测"拉过头"（overscroll）
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      // 元素被推出了视口（overscroll 场景）
      console.log('Overscroll detected on:', entry.target);
    }
  });
}, { threshold: [0, 1] });
```

### 7.5 完整示例：禁止滚动穿透的弹层

```html
<div class="modal" id="modal">
  <div class="modal-content">
    <p>模态框内容，可滚动查看</p>
    <div class="scrollable-area">
      <!-- 长内容 -->
    </div>
    <button onclick="closeModal()">关闭</button>
  </div>
</div>

<style>
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #161b22;
  padding: 24px;
  border-radius: 8px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-content .scrollable-area {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain; /* 关键：防止滚动穿透 */
}
</style>

<script>
let scrollPosition = 0;

function openModal() {
  scrollPosition = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = '100%';
}

function closeModal() {
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  window.scrollTo(0, scrollPosition);
}
</script>
```

## 8. 实用技巧汇总

### 8.1 让整个页面平滑滚动到顶部

```css
html {
  scroll-behavior: smooth;
}
```

```javascript
// 回到顶部
window.scrollTo({ top: 0, behavior: 'smooth' });

// 或锚点
<a href="#top">回到顶部</a>
```

### 8.2 检测元素是否在视口中

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      console.log('元素进入视口');
    }
  });
}, { threshold: 0.1 });

observer.observe(document.querySelector('.target'));
```

### 8.3 自定义滚动条样式（Chrome/Edge/Safari）

```css
.custom-scrollbar {
  overflow-y: auto;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
```

### 8.4 滚动驱动动画（Scroll-Driven Animations）

现代浏览器支持 CSS 滚动驱动动画：

```css
@keyframes progress {
  from { width: 0; }
  to   { width: 100%; }
}

.progress-bar {
  animation: progress linear;
  animation-timeline: scroll(root); /* 绑定到根滚动 */
}
```

## 9. 浏览器支持

| 属性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| `overflow` | ✅ 1+ | ✅ 1+ | ✅ 1+ | ✅ 12+ |
| `overflow-x/y` | ✅ 1+ | ✅ 1+ | ✅ 1+ | ✅ 12+ |
| `scroll-behavior` | ✅ 61+ | ✅ 36+ | ✅ 15.4+ | ✅ 79+ |
| `scroll-snap` | ✅ 69+ | ✅ 39+ | ✅ 11+ | ✅ 79+ |
| `overscroll-behavior` | ✅ 63+ | ✅ 59+ | ✅ 16+ | ✅ 18+ |
| `-webkit-overflow-scrolling` | ✅ (WebKit) | ❌ | ✅ (Safari) | ✅ |
| `scrollbar-width` | ❌ | ✅ 68+ | ❌ | ❌ |
| `scrollbar-gutter` | ✅ 112+ | ✅ 64+ | ✅ 17.2+ | ✅ 112+ |

## 参考资源

- [MDN overflow](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)
- [MDN scroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior)
- [MDN scroll-snap](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type)
- [MDN overscroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior)
- [CSS Scrollbars Styling](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scrollbars/styling_scrollbars)
