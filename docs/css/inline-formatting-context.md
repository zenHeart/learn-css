# Inline Formatting Context（IFC）完全指南

> 本文档系统梳理 CSS 内联格式化上下文的完整知识，包括 IFC 基本概念、Line Box 布局规则、vertical-align 对齐机制，以及与 BFC 的区别和联系。

---

## 目录

1. [IFC 基本概念](#1-ifc-基本概念)
2. [触发条件](#2-触发条件)
3. [Inline Box / Line Box / Containing Block](#3-inline-box--line-box--containing-block)
4. [vertical-align 对齐规则](#4-vertical-align-对齐规则)
5. [IFC 中的 margin/padding/border](#5-ifc-中的-marginpaddingborder)
6. [与 BFC 的区别和联系](#6-与-bfc-的区别和联系)
7. [常见踩坑场景](#7-常见踩坑场景)
8. [与 float 的交互](#8-与-float-的交互)

---

## 1. IFC 基本概念

### 1.1 什么是 IFC

IFC（Inline Formatting Context）是 CSS 布局中的一种格式化上下文。当一个块级容器内包含行内级元素时，会为这些行内级元素创建一个 IFC。

在 IFC 中，元素在**水平方向**上依次排列，形成**行框（Line Box）**。

```html
<!-- IFC 触发：块级元素包含行内元素 -->
<div class="container">
  <span>行内元素1</span>
  <span>行内元素2</span>
  <strong>加粗文本</strong>
</div>
```

### 1.2 IFC 的核心规则

1. **水平排列**：所有行内级元素在水平方向依次排列
2. **行框形成**：每个「包含所有行内子元素」的水平区域就是一个 Line Box
3. **垂直对齐**：通过 `vertical-align` 控制元素在垂直方向的对齐
4. **自动换行**：当一行放不下时，自动换行生成新的 Line Box
5. **margin 不折叠**：IFC 中的垂直 margin 不会折叠（只有 BFC 中才折叠）

---

## 2. 触发条件

### 2.1 触发 IFC 的条件

以下情况会创建 IFC（为行内元素创建 IFC）：

```css
/* 块级容器包含行内级元素 */
.block-container {
  /* 自动为子行内元素创建 IFC */
}
```

### 2.2 常见行内级元素

```html
<!-- 行内（inline）元素 -->
<span>, <a>, <strong>, <em>, <code>, <abbr>

<!-- 替换行内元素 -->
<img>, <input>, <button>, <video>

<!-- display: inline 的元素 -->
<span style="display:inline">自定义行内</span>
```

### 2.3 不触发 IFC 的情况

```css
/* display: inline-block / inline-table 在 IFC 中作为原子行内单位 */
.container {
  display: inline-block; /* 特殊处理：作为单个不可分割的盒子 */
}

/* display: flex / grid 项目是 BFC，不受父级 IFC 影响 */
```

---

## 3. Inline Box / Line Box / Containing Block

### 3.1 三个核心概念

```
┌─────────────────────────────────────────────┐
│              Containing Block                │
│  （块级父元素的 content area）               │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │  Line Box 1                          │  │
│  │  [Inline Box][Inline Box][Inline Box]│  │
│  │  ↑           ↑           ↑           │  │
│  │  text/a     span        img          │  │
│  └──────────────────────────────────────┘  │
│                                              │
│  ┌──────────────────────────────────────┐  │
│  │  Line Box 2                          │  │
│  │  [Inline Box][Inline Box]            │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

| 概念 | 说明 |
|------|------|
| **Inline Box** | 行内级元素本身（带 padding/border/margin 的盒子） |
| **Line Box** | 包裹一行所有 Inline Box 的水平矩形区域 |
| **Containing Block** | 块级父元素的 content area（包含 Line Box） |

### 3.2 Line Box 的高度计算

Line Box 的高度由所有子 Inline Box 共同决定：

```js
// Line Box 高度 = 所有子 Inline Box 的 margin-box 的最高点 - 最低点
// 公式：top = min(child.marginTop), bottom = max(child.marginBottom)
```

```css
/* 示例：混合格式 */
.container {
  font-size: 16px;
  line-height: 1.5; /* 24px */
}

.text { font-size: 14px; }     /* 高度 14px */
.image { height: 40px; }       /* 高度 40px */
.high { font-size: 20px; }    /* 高度 20px */

/* Line Box 高度 = 40px（最高的子元素） */
```

### 3.3 Line Box 宽度计算

```css
.container {
  width: 300px; /* Containing Block 宽度 */
}

.inline {
  /* Line Box 宽度 = min(Containing Block 宽度, 所有 Inline Box 宽度之和) */
  /* 如果总和超过 Containing Block → 自动换行 */
}
```

---

## 4. vertical-align 对齐规则

### 4.1 可选值

```css
.inline-element {
  vertical-align: 
    baseline     /* 默认：基线对齐 */
    top          /* 顶部对齐（与 Line Box 顶部对齐） */
    bottom       /* 底部对齐（与 Line Box 底部对齐） */
    middle       /* 中部对齐（与基线 + x-height 中点对齐） */
    text-top     /* 与父元素文字顶部对齐 */
    text-bottom  /* 与父元素文字底部对齐 */
    <length>     /* 固定值：px, em */
    <percentage> /* 相对于 line-height 的百分比 */
```

### 4.2 baseline 对齐详解

`baseline` 是默认对齐方式，子元素基线与父元素基线对齐：

```css
/* 什么是基线？ */

/*
  英文基线（alphabetic baseline）：
  
    a b c d e f
  ─────────────────── ← 基线
    g j p q y
  ─────────────────── ← descender line（下行字母底部）
*/

.parent { font-size: 20px; line-height: 40px; }
/* 父元素基线位置：通常在底部留有一定空间 */
```

**替换元素（img/input）默认对齐方式**

```css
/* ⚠️ 替换元素（img）没有真正的文本基线 */
/* 浏览器将替换元素底部作为"基线"进行对齐 */

/* 这种情况很常见： */
.container {
  font-size: 0; /* 消除行内块底部间隙 */
}
```

### 4.3 middle 对齐

```css
/* middle 对齐原理：
   元素的中点 = 基线 + x-height 的一半 */

/* 公式：element vertical-center = parent baseline + (parent line-height - parent font-size) / 2
   = parent baseline + parent x-height / 2 */

/* 这解释了为什么 middle 不等于 50% */
```

### 4.4 vertical-align 应用场景

```css
/* 1. 图片与文字垂直居中对齐 */
.img-text {
  font-size: 0; /* 消除图片底部间隙 */
}
.img-text img {
  vertical-align: middle;
}

/* 2. 让按钮与文字垂直对齐 */
.button {
  vertical-align: top; /* 或 middle */
}

/* 3. 表单控件对齐 */
label, input, select {
  vertical-align: middle; /* 统一与基线对齐 */
}

/* 4. 多行文字与图标对齐 */
.icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
```

---

## 5. IFC 中的 margin/padding/border

### 5.1 水平方向（正常流）

```css
.inline {
  margin-left: 10px;  /* ✓ 有效果 */
  margin-right: 10px; /* ✓ 有效果 */
  border-left: 1px solid red; /* ✓ 有效果 */
  border-right: 1px solid red; /* ✓ 有效果 */
  padding-left: 5px; /* ✓ 有效果 */
  padding-right: 5px; /* ✓ 有效果 */
}
```

### 5.2 垂直方向（正常流）

```css
.inline {
  /* ⚠️ margin-top/bottom 在 IFC 中通常不生效 */
  margin-top: 20px;  /* 在 IFC 中被忽略 */
  margin-bottom: 20px; /* 在 IFC 中被忽略 */
  
  /* ⚠️ border-top/bottom 在 IFC 中不占据垂直空间 */
  border-top: 1px solid red; /* 边框显示但不影响 Line Box 高度 */
  
  /* ⚠️ padding-top/bottom 在 IFC 中不占据垂直空间 */
  padding-top: 10px; /* 内边距显示但不影响 Line Box 高度 */
}
```

### 5.3 为什么垂直 margin 不生效

```html
<!-- IFC 中垂直 margin 不会推挤周围元素 -->
<span style="margin-top: 20px; background: yellow;">text</span>
<!-- margin-top 在 IFC 中被忽略，不会推开上面的元素 -->
```

**原因**：IFC 中的 Line Box 高度由子 Inline Box 的 margin-box 决定。如果垂直 margin 推开其他 Line Box，就破坏了 IFC 的水平排列特性。

### 5.4 解决方案：改用 padding 或 line-height

```css
/* 如果想让行内元素有上下间距，用 padding */
.inline {
  padding-top: 20px;
  padding-bottom: 20px; /* 会撑开 Line Box 高度 */
}

/* 或调整 line-height */
.text {
  line-height: 2; /* 增加每行的间距 */
}
```

---

## 6. 与 BFC 的区别和联系

### 6.1 BFC（Block Formatting Context）

BFC 是块级元素创建的格式化上下文，在**垂直方向**上排列块级元素。

| 特性 | IFC | BFC |
|------|-----|-----|
| 排列方向 | 水平（inline） | 垂直（block） |
| 创建者 | 行内级元素 | 块级元素 |
| 适用元素 | inline, inline-block | block, block-level |
| 垂直 margin | **不折叠** | 折叠 |
| float 处理 | 文字环绕 | 排除（clear） |
| 换行 | 自动水平换行 | 垂直堆叠 |

### 6.2 相互嵌套

```html
<!-- BFC 嵌套 IFC 的情况 -->
<div style="overflow:hidden"> <!-- BFC -->
  <p style="display:inline">inline in block</p> <!-- IFC -->
</div>

<!-- IFC 嵌套 BFC 的情况 -->
<span style="display:inline-block"> <!-- IFC 中的原子单位 -->
  <p>block in inline</p> <!-- BFC -->
</span>
```

### 6.3 触发 BFC 的 CSS 属性

```css
/* 触发 BFC 的常用属性 */
.bfc {
  display: flow-root;       /* 纯 CSS 创建 BFC */
  display: inline-block;    /* 创建 BFC 但作为行内元素 */
  overflow: hidden;         /* 除 visible 外的值 */
  position: absolute/fixed; /* 绝对定位 */
  float: left/right;        /* 浮动 */
  display: table-cell;      /* 表格单元格 */
  display: flex/grid;       /* flex/grid 容器 */
}
```

---

## 7. 常见踩坑场景

### 7.1 图片底部间隙

```html
<!-- 最常见的 IFC 问题 -->
<div class="box">
  <img src="icon.png" alt="icon">
  <span>文字</span>
</div>
```

```css
/* ⚠️ 现象：图片底部有多余空白 */

/* 原因：图片作为替换元素，默认 baseline 对齐
   而父元素基线下方有空间（用于放下行字母）
   所以图片下方会有一段间隙 */

/* 解决方案 */
.box img {
  display: block; /* 改为块级，不创建 IFC */
}

.box img {
  vertical-align: bottom; /* 改为底部对齐 */
}

.box {
  font-size: 0; /* 消除基线下方空间 */
}
```

### 7.2 两个 div 放在一起有间隙

```css
/* ⚠️ 两个行内块之间有空白 */
.parent {
  font-size: 16px; /* 空白 = font-size 的一部分 */
}

.child {
  display: inline-block;
  width: 100px;
  height: 100px;
}
/* 解决方案：font-size: 0 在父元素，或去掉 HTML 中的换行 */
```

### 7.3 vertical-align: middle 不居中

```css
/* ⚠️ middle 对齐不等于垂直居中 */

.box {
  height: 100px;
  line-height: 100px; /* 让 line-height = 容器高度 */
}

.box img {
  vertical-align: middle;
}
/* ⚠️ middle 只对齐到 x-height 中心，不是 50% 高度 */

/* 更好的垂直居中方案： */
.box {
  display: flex;
  align-items: center;
}
```

### 7.4 inline 元素设置宽高无效

```css
/* ⚠️ 行内元素不能直接设置宽高 */
span {
  width: 100px; /* ❌ 无效 */
  height: 100px; /* ❌ 无效 */
}

/* ✅ 解决方案： */
span {
  display: inline-block; /* 改为行内块 */
  width: 100px;
  height: 100px;
}

/* ✅ 或 */
span {
  display: block; /* 改为块级 */
  width: 100px;
}
```

### 7.5 多行文字最后一行垂直居中

```css
/* ⚠️ 场景：按钮文字垂直居中，但多行时表现异常 */

/* 解决方案：用 flexbox 更可靠 */
.button {
  display: inline-flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  min-height: 44px; /* iOS 点击区域最小高度 */
}
```

---

## 8. 与 float 的交互

### 8.1 float 在 IFC 中的行为

```html
<!-- float 元素会从正常流中取出，影响周围的 Line Box -->
<div class="container">
  <img src="float-left.jpg" style="float:left; width:100px;">
  <p>文字环绕图片。</p>
  <p>第二段。</p>
</div>
```

### 8.2 float 对 Line Box 的影响

```css
/* float 会缩短包含块中非浮动元素的 Line Box */

/* 示例： */
.container {
  width: 300px;
}

.float-left {
  float: left;
  width: 100px;
  height: 100px;
}

.text {
  /* Line Box 宽度 = 300 - 100 = 200px（被 float 缩短）*/
}
```

### 8.3 清除浮动

```css
/* 方案一：BFC 清除 */
.clearfix {
  overflow: hidden; /* 创建 BFC，clear 掉 float */
}

/* 方案二：clearfix 伪元素 */
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}

/* 方案三：display: flow-root（最干净）*/
.clearfix {
  display: flow-root; /* 仅创建 BFC，无副作用 */
}
```

---

## 参考资料

- [MDN: Inline formatting context](https://developer.mozilla.org/en-US/docs/Web/CSS/Inline_formatting_context)
- [CSS 规范：Inline formatting context](https://www.w3.org/TR/CSS2/visuren.html#inline-formatting)
- [MDN: vertical-align](https://developer.mozilla.org/en-US/docs/Web/CSS/vertical-align)
- [CSS 规范：Line height algorithms](https://www.w3.org/TR/CSS2/visudet.html#propdef-line-height)
- [知乎：深入理解 IFC](https://zhuanlan.zhihu.com/p/25808995)
- [掘金：CSS 格式化上下文](https://juejin.cn/post/6844903935971682312)
