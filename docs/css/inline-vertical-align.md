# CSS 内联元素垂直对齐详解

## 概述

`vertical-align` 属性用于设置内联元素或表格单元格内容的垂直对齐方式。它是 CSS1 就存在的老牌属性，但很多开发者对其理解不够深入，常常遇到"为什么我的图片/文字没有垂直居中"的困惑。

## 基本语法

```css
.element {
  vertical-align: baseline | top | bottom | middle | text-top | text-bottom | sub | super | <length> | <percentage>;
}
```

## 值详解

### 1. 关键字值

| 值 | 说明 | 典型场景 |
|----|------|----------|
| `baseline` | 默认值，元素基线与父元素基线对齐 | 文字与图片同行 |
| `top` | 元素顶部与行内最高元素顶部对齐 | 多元素同行对齐 |
| `bottom` | 元素底部与行内最低元素底部对齐 | 多元素同行对齐 |
| `middle` | 元素中部与父元素基线加上小写字母高度的一半对齐 | 图片垂直居中 |
| `text-top` | 元素顶部与父元素文字顶部对齐 | 图标与文字对齐 |
| `text-bottom` | 元素底部与父元素文字底部对齐 | 图标与文字对齐 |
| `sub` | 元素基线降低到父元素下标位置 | 化学式 H₂O |
| `super` | 元素基线升高到父元素上标位置 | 脚注标记 |

### 2. 长度值

```css
/* 正值向上移动，负值向下移动 */
.element {
  vertical-align: 10px;   /* 向上移动 10px */
  vertical-align: -5px;   /* 向下移动 5px */
}
```

### 3. 百分比值

```css
.element {
  /* 相对于 line-height 计算 */
  vertical-align: 50%;    /* 向上移动 line-height 的 50% */
}
```

## 对比图解

```
            ┌─────────────────┐
            │     text-top    │
   ┌───────┼─────────────────┼───────┐
   │       │                 │       │
   │  top  │   ┌─────────┐   │       │
   │       │   │ middle  │   │       │
   │       │   └─────────┘   │       │
   │       │  ══════════════ │baseline│
   │       │   baseline      │       │
   └───────┼─────────────────┼───────┘
            │   text-bottom   │
            └─────────────────┘
```

## 常见场景

### 场景一：图片与文字同行对齐

```html
<span class="text">文字</span>
<img src="icon.png" class="icon" alt="图标">

<style>
/* 问题：图片底部与文字基线对齐，导致视觉上不在同一水平线 */
.icon {
  vertical-align: baseline; /* 默认值 */
}

/* 解决方案：根据需求选择对齐方式 */
.icon.align-middle {
  vertical-align: middle;
}

.icon.align-top {
  vertical-align: top;
}
</style>
```

### 场景二：让图片在容器中垂直居中

```html
<div class="container">
  <img src="photo.jpg" alt="照片">
</div>

<style>
.container {
  height: 200px;
  line-height: 200px;  /* 关键：设置与 height 相同的 line-height */
  text-align: center;
}

.container img {
  vertical-align: middle; /* 图片与文字中线对齐 */
}
</style>
```

### 场景三：多元素同行对齐

```html
<div class="row">
  <span class="short">短</span>
  <span class="tall">长的文字内容</span>
  <span class="medium">中等长度</span>
</div>

<style>
.row {
  line-height: 60px;
  border: 1px solid #ccc;
}

/* 默认 baseline 对齐，各元素基线对齐但视觉参差不齐 */
.row span {
  background: #f0f0f0;
  padding: 4px 8px;
}

/* top 对齐：所有元素顶部对齐 */
.row.align-top span {
  vertical-align: top;
}

/* middle 对齐：所有元素中部对齐 */
.row.align-middle span {
  vertical-align: middle;
}

/* bottom 对齐：所有元素底部对齐 */
.row.align-bottom span {
  vertical-align: bottom;
}
</style>
```

### 场景四：图标与文字对齐

```html
<div class="icon-text">
  <svg class="icon" viewBox="0 0 24 24">...</svg>
  <span>配合文字使用的图标</span>
</div>

<style>
.icon-text {
  line-height: 1.5;
}

.icon {
  width: 20px;
  height: 20px;
}

/* 图标与文字顶部对齐（推荐） */
.icon.align-top {
  vertical-align: text-top;
}

/* 图标与文字中部对齐 */
.icon.align-middle {
  vertical-align: middle;
}
</style>
```

### 场景五：表单元格垂直对齐

```html
<table>
  <tr>
    <td class="top">顶部对齐</td>
    <td class="middle">中间对齐</td>
    <td class="bottom">底部对齐</td>
  </tr>
</table>

<style>
table {
  border-collapse: collapse;
  width: 100%;
}

td {
  border: 1px solid #ccc;
  padding: 20px;
  height: 80px;
}

td.top {
  vertical-align: top;
}

td.middle {
  vertical-align: middle;
}

td.bottom {
  vertical-align: bottom;
}
</style>
```

## 深入理解：基线（Baseline）

基线对齐是 `vertical-align` 最复杂的部分。理解基线需要了解字体度量：

```
        ╭─ cap height (大写字母高度)
        │
   ┌────┴────┐
   │   HEllo   │  ← x-height (小写字母高度，尤其是 x)
   │   gjpqy   │
   └────┬────┘
        │ baseline (基线)
        ╰─ descender (下沉部分：g, p, q, y 的下沉)
```

### 不同元素的基线位置

| 元素类型 | 基线位置 |
|----------|----------|
| 文字（没有下沉部分的字母） | 文字底部 |
| 图片 | 图片底部（默认）或指定位置 |
| input | 输入框内容的基线 |
| inline-block（含内容） | 最后一个内容的基线 |
| inline-block（含overflow:hidden） | 块的底边框 |

## 常见问题

### 问题 1：inline-block 元素基线对齐错乱

```css
/* inline-block 元素的基线位置取决于其内容 */
.inline-block-default {
  display: inline-block;
  /* 基线是最后一个内容的基线 */
}

.inline-block-overflow {
  display: inline-block;
  overflow: hidden;
  /* 基线变成块的底边框！ */
}

/* 解决方案：统一使用 top/bottom/middle */
.inline-block-fix {
  display: inline-block;
  vertical-align: top; /* 或 middle, bottom */
}
```

### 问题 2：单行文字垂直居中仍然偏移

```css
/* 很多情况下 line-height 的居中不是真正的视觉居中 */
.center-text {
  height: 100px;
  line-height: 100px; /* 文字会偏上一点 */

/* 更好的方案：使用 flexbox */
.center-flex {
  display: flex;
  align-items: center;
  height: 100px;
}
</style>
```

### 问题 3：table-cell 的 vertical-align 与 flexbox 的 align-items

```css
/* 两者不可混用！ */
/* display: table-cell 时用 vertical-align */
.table-cell {
  display: table-cell;
  vertical-align: middle;
}

/* display: flex 时用 align-items */
.flex-cell {
  display: flex;
  align-items: center;
}
```

## 现代替代方案

虽然 `vertical-align` 仍然有效，但在现代 CSS 中有更优雅的替代方案：

### 1. Flexbox 替代方案

```css
/* 垂直居中 */
.container {
  display: flex;
  align-items: center;  /* 替代 vertical-align: middle */
}

/* 顶部对齐 */
.container {
  display: flex;
  align-items: flex-start;  /* 替代 vertical-align: top */
}
```

### 2. Grid 替代方案

```css
.container {
  display: grid;
  align-items: center;  /* 替代 vertical-align: middle */
}
```

## 浏览器支持

`vertical-align` 属性在所有现代浏览器中都得到良好支持：

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| 关键字值 | ✅ 1+ | ✅ 1+ | ✅ 1+ | ✅ 12+ |
| 长度值 | ✅ 1+ | ✅ 1+ | ✅ 1+ | ✅ 12+ |
| 百分比值 | ✅ 1+ | ✅ 1+ | ✅ 1+ | ✅ 12+ |
| sub/super | ✅ 1+ | ✅ 1+ | ✅ 1+ | ✅ 12+ |

## 总结

| 场景 | 推荐方案 |
|------|----------|
| 图片与文字同行 | `vertical-align: middle` 或 `vertical-align: top` |
| 多元素同行对齐 | `vertical-align: top/bottom/middle` |
| 容器内垂直居中 | 使用 Flexbox (`align-items: center`) |
| 表单元格内容对齐 | `vertical-align: top/middle/bottom` |
| 图标与文字对齐 | `vertical-align: text-top` 或 `vertical-align: middle` |

## 参考资源

- [MDN vertical-align](https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align)
- [CSS Vertical-Align: Everything You Need to Know](https://www.sitepoint.com/css-vertical-align/)
- [Understanding baseline alignment](https://iamvdo.me/blog/css-vertical-align-et-les-bases-de-l-alignement-de-ligne)
