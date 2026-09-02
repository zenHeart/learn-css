# CSS 定位完全指南

> 本文档整理 CSS 定位各模式的原理、定位上下文、定位与布局的关系及常见问题。

---

## 目录

- [1. 定位模式概述](#1-定位模式概述)
- [2. 定位上下文（Containing Block）](#2-定位上下文-containing-block)
- [3. static（静态定位）](#3-static静态定位)
- [4. relative（相对定位）](#4-relative相对定位)
- [5. absolute（绝对定位）](#5-absolute绝对定位)
- [6. fixed（固定定位）](#6-fixed固定定位)
- [7. sticky（粘性定位）](#7-sticky粘性定位)
- [8. 定位与 Flex/Grid 的关系](#8-定位与-flexgrid-的关系)
- [9. 常见问题与解决方案](#9-常见问题与解决方案)
- [10. 实战场景](#10-实战场景)

---

## 1. 定位模式概述

CSS 定位通过 `position` 属性控制元素的定位方式，共有 5 种模式：

| 定位模式 | `position` 值 | 文档流 | 定位参考 | 使用场景 |
|---------|--------------|--------|----------|---------|
| 静态定位 | `static` | 正常 | 无 | 默认布局 |
| 相对定位 | `relative` | 保留 | 自身原始位置 | 轻微调整、微动效 |
| 绝对定位 | `absolute` | 脱离 | 最近已定位祖先 | 悬浮层、tooltip |
| 固定定位 | `fixed` | 脱离 | 视口（viewport） | 固定导航、回到顶部 |
| 粘性定位 | `sticky` | 保留 | 最近滚动祖先 | 吸顶/吸底效果 |

---

## 2. 定位上下文（Containing Block）

理解定位上下文是掌握定位的关键。

### 2.1 如何确定定位上下文

元素的定位上下文由最近的**已定位祖先元素**决定：

> **已定位元素**：position 不等于 `static` 的元素

```
定位上下文查找规则：
1. 向上遍历 DOM 树
2. 找到第一个 position ≠ static 的祖先
3. 该祖先的 padding-box 边缘即为定位上下文
4. 如果没有找到，则根元素（<html>）为定位上下文
```

### 2.2 各定位模式的上下文

| 定位模式 | 定位参考 |
|---------|---------|
| `relative` | 自身在正常文档流中的位置 |
| `absolute` | 最近已定位祖先的 padding-box |
| `fixed` | 视口（viewport） |
| `sticky` | 最近滚动祖先的滚动区域 |

### 2.3 实战：定位上下文可视化

```css
.container { /* position: relative → 成为定位上下文 */
  position: relative;
  width: 500px;
  height: 300px;
}

.tooltip {
  position: absolute;
  top: 10px;
  left: 10px;
  /* 相对于 .container 定位，而非页面 */
}
```

---

## 3. static（静态定位）

### 3.1 特性

- **默认定位模式**，所有元素初始都是 static
- 元素按正常文档流排列
- `top`、`right`、`bottom`、`left`、`z-index` **无效**

### 3.2 用法

```css
.element {
  position: static; /* 默认值，可以不写 */
}
```

---

## 4. relative（相对定位）

### 4.1 特性

- 保留在正常文档流中的位置（空间不释放）
- 相对于**自身原始位置**偏移
- `top`/`right`/`bottom`/`left` 控制偏移量
- 支持 `z-index`，可创建新的堆叠上下文

### 4.2 用法

```css
.element {
  position: relative;
  top: 10px;      /* 向下偏移 10px */
  left: 20px;     /* 向右偏移 20px */
  /* 负值也有效 */
}
```

### 4.3 应用场景

```css
/* 微动效：hover 时轻微移动 */
.button:hover {
  position: relative;
  top: -2px; /* 向上移动 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 作为 absolute 子元素的定位上下文 */
.card {
  position: relative;
}
.card .badge {
  position: absolute;
  top: 10px;
  right: 10px;
}
```

### 4.4 注意事项

```css
/* ❌ 常见误区：以为 relative 会脱离文档流 */
.box {
  position: relative;
  top: 50px;
  /* 元素仍在文档流中，原有空间保留 */
  /* 视觉上向右下偏移，但后面的元素不会挤上来 */
}
```

---

## 5. absolute（绝对定位）

### 5.1 特性

- **脱离文档流**（不占用空间）
- 相对于最近已定位祖先定位
- 如果没有已定位祖先，则相对于初始包含块（<html>）
- 宽高默认由内容决定（可手动设置）

### 5.2 用法

```css
.modal-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* 覆盖整个父容器 */
}
```

### 5.3 居中定位技巧

```css
/* 方法一：margin auto（需设置宽高）*/
.absolute-center {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 200px;
  height: 100px;
}

/* 方法二：transform（不需要知道宽高）*/
.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 方法三：flexbox */
.parent {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.child {
  position: absolute;
}
```

### 5.4 常见应用

```css
/* Tooltip */
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}
.tooltip {
  position: absolute;
  bottom: 100%;      /* 显示在元素上方 */
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
}

/* 图片水印 */
.watermarked-image {
  position: relative;
}
.watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-30deg);
  opacity: 0.3;
  pointer-events: none; /* 不影响图片交互 */
}

/* 下拉菜单 */
.dropdown {
  position: relative;
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
}
```

---

## 6. fixed（固定定位）

### 6.1 特性

- **脱离文档流**
- 相对于**视口（viewport）**定位
- 不随页面滚动移动
- 始终保持在同一位置
- 始终创建新的堆叠上下文

### 6.2 用法

```css
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 1000;
}

.back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
}
```

### 6.3 移动端适配注意

```css
/* 移动端安全区域 */
.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  /* 适配 iPhone 刘海屏 */
  padding-top: env(safe-area-inset-top);
}

/* 适配 iPhone 底部横条 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: env(safe-area-inset-bottom);
}
```

### 6.4 常见陷阱

```css
/* ❌ fixed 元素在 transform 父元素内时失效 */
.transform-parent {
  transform: translateZ(0); /* 破坏 fixed 定位 */
}
.fixed-element {
  position: fixed;
  top: 0;
  /* 相对于 .transform-parent 而非视口定位！ */
}
```

---

## 7. sticky（粘性定位）

### 7.1 特性

- 混合了 relative 和 fixed 的行为
- 在滚动容器内表现为 relative
- 滚动到阈值后表现为 fixed
- **需要指定 `top`/`bottom` 等阈值**

### 7.2 用法

```css
.sticky-header {
  position: sticky;
  top: 0;  /* 距离顶部 0px 时固定 */
  background: white;
  z-index: 10;
}
```

### 7.3 适用场景

```html
<!-- 表格列头吸顶 -->
<table>
  <thead>
    <tr>
      <th style="position: sticky; top: 0;">列1</th>
    </tr>
  </thead>
</table>

<!-- 侧边栏吸顶 -->
<style>
.sidebar {
  position: sticky;
  top: 20px;  /* 距离顶部 20px 时开始固定 */
  align-self: flex-start;
}
</style>
```

### 7.4 注意事项

- **需要滚动祖先**：没有可滚动祖先则无效
- **支持性**：IE 不支持，Safari 需 `-webkit-sticky`
- **阈值必须指定**：否则等同于 relative

```css
/* Safari 兼容 */
.sticky-header {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}
```

---

## 8. 定位与 Flex/Grid 的关系

### 8.1 Flex 容器中的定位

```css
/* ❌ 绝对定位在 flex 项目上会相对于 flex 容器定位 */
.flex-container {
  display: flex;
  position: relative; /* 成为 absolute 子元素的定位上下文 */
}
.flex-item {
  position: absolute;
  /* 相对于 flex-container 定位，而非 flex 项目自身 */
}
```

### 8.2 Grid 容器中的定位

```css
/* Grid 区域定位 */
.grid-container {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
.grid-item {
  position: relative;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  /* 相对于 grid-item 定位 */
}
```

### 8.3 定位在 Flex/Grid 中的实际行为

```css
/* Flex 项目使用 absolute 定位 */
.flex-wrapper {
  display: flex;
  height: 200px;
}
.sibling {
  flex: 1;
  background: lightblue;
}
.abs-child {
  position: absolute;
  top: 0;
  right: 0;
  /* 相对于 .flex-wrapper（因为它有 position: relative） */
  /* 而不是相对于 .sibling */
}
```

---

## 9. 常见问题与解决方案

### 9.1 绝对定位元素居中

```css
/* 方案一：calc() */
.center {
  position: absolute;
  top: calc(50% - 50px);
  left: calc(50% - 100px);
  width: 200px;
  height: 100px;
}

/* 方案二：transform（推荐）*/
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 方案三：margin auto（需设宽高）*/
.center {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 200px;
  height: 100px;
}
```

### 9.2 绝对定位导致父元素高度塌陷

```html
<!-- 问题：父容器高度为 0 -->
<div class="parent">
  <div class="child">绝对定位元素</div>
</div>

<!-- 解决方案 1：父元素设置 padding -->
.parent {
  position: relative;
  padding-bottom: 100px; /* 或 min-height */
}

/* 解决方案 2：伪元素撑开高度 */
.parent::after {
  content: '';
  display: block;
}

/* 解决方案 3：父元素 min-height */
.parent {
  position: relative;
  min-height: 200px;
}
```

### 9.3 fixed 定位失效

```css
/* ❌ 祖先有 transform/perspective/filter 时失效 */
.has-transform {
  transform: translateZ(0);
}

/* ✅ 解决方案：将 fixed 元素移到 body 下 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  /* 确保没有 transform 祖先 */
}
```

### 9.4 z-index 不生效

```css
/* ❌ 父元素没有创建堆叠上下文 */
.parent-1 { z-index: 10; }
.parent-2 { z-index: 5; }
.child { z-index: 100; /* 被父元素限制 */ }

/* ✅ 解决方案：使用更高层级的 z-index 或打破父元素限制 */
.parent-1 { z-index: 10; }
.parent-2 { z-index: 5; }
.child { z-index: 100; /* 实际渲染在 parent-1 之上 */ }
```

### 9.5 粘性定位不生效

```css
/* ❌ 没有滚动祖先 */
.outer {
  overflow: hidden; /* 滚动祖先被破坏了 */
}
.sticky {
  position: sticky;
  top: 0;
  /* 无效！ */
}

/* ✅ 解决方案：确保有可滚动祖先 */
.outer {
  overflow: auto; /* 保留滚动能力 */
  height: 100vh;
}
.sticky {
  position: sticky;
  top: 0;
}
```

---

## 10. 实战场景

### 10.1 吸顶导航栏

```css
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 备用方案 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
/* 内容需要 padding-top 避免被遮挡 */
.main-content {
  padding-top: 60px;
}
```

### 10.2 模态框

```css
.modal-overlay {
  position: fixed;
  inset: 0;  /* top:0; right:0; bottom:0; left:0 的简写 */
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  position: relative; /* 作为关闭按钮的定位上下文 */
  background: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
}
```

### 10.3 浮动小徽章

```css
.badge-container {
  position: relative;
  display: inline-block;
}
.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: red;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 10.4 图片画廊灯箱

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.gallery-item {
  position: relative;
  cursor: pointer;
}
.gallery-item:hover::after {
  content: '🔍';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}
```

### 10.5 圣杯布局（经典三栏）

```css
.container {
  display: flex;
}
.left {
  position: relative;
  flex-shrink: 0;
  width: 200px;
}
.right {
  position: relative;
  flex-shrink: 0;
  width: 200px;
}
.main {
  flex: 1;
  /* 中间栏自适应 */
}
```

---

## 参考资料

- [MDN: CSS Position](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
- [CSS-TRICKS: Position](https://css-tricks.com/almanac/properties/p/position/)
- [MDN: Layout and the containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block)
