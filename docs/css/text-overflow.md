# CSS text-overflow 完全指南

> 本文档整理 CSS text-overflow 属性的用法、必须配合的属性、多行文本溢出处理方案。

---

## 目录

- [1. text-overflow 基础](#1-text-overflow-基础)
- [2. 必须配合的属性](#2-必须配合的属性)
- [3. clip vs ellipsis vs string](#3-clip-vs-ellipsis-vs-string)
- [4. 单行文本溢出](#4-单行文本溢出)
- [5. 多行文本溢出](#5-多行文本溢出)
- [6. 双方向溢出](#6-双方向溢出)
- [7. 与 Flex/Grid 布局的配合](#7-与-flexgrid-布局的配合)
- [8. 常见问题与解决方案](#8-常见问题与解决方案)

---

## 1. text-overflow 基础

### 1.1 概念

`text-overflow` 属性指定当文本溢出其块容器时如何发出信号通知用户。

### 1.2 关键前置条件

> ⚠️ **必须同时满足以下两个条件才能生效**：
> 1. `white-space: nowrap`（禁止换行）
> 2. `overflow: hidden`（隐藏溢出）

### 1.3 语法

```css
text-overflow: clip;        /* 默认值，截断 */
text-overflow: ellipsis;    /* 显示省略号 ... */
text-overflow: "***";       /* 自定义字符串（需引号）*/
text-overflow: fade;        /* 淡出效果（实验性）*/
text-overflow: ellipsis "...";  /* 省略号 + 自定义字符串 */
```

### 1.4 只影响内联方向

text-overflow **只影响内联进展方向**的溢出（即横向溢出），不是底部溢出。

---

## 2. 必须配合的属性

```css
/* ❌ 错误：缺少任何一个都不生效 */
.wrong {
  text-overflow: ellipsis;
  /* white-space 缺失 → 文本会换行 */
  overflow: hidden;
}

/* ✅ 正确：三个属性缺一不可 */
.correct {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
```

---

## 3. clip vs ellipsis vs string

### 3.1 clip（默认值）

```css
.clip {
  text-overflow: clip;
  white-space: nowrap;
  overflow: hidden;
}
/* 效果：直接截断，无省略号 */
```

### 3.2 ellipsis

```css
.ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
/* 效果：显示 ... */
```

### 3.3 自定义字符串（现代浏览器支持）

```css
.custom {
  text-overflow: "→";  /* 显示 → */
  white-space: nowrap;
  overflow: hidden;
}
```

### 3.4 双方向省略号

```css
/* CSS4 语法：可以指定左右两侧的省略号 */
.double {
  text-overflow: ellipsis ellipsis;  /* 左省略号 右省略号 */
  white-space: nowrap;
  overflow: hidden;
  direction: rtl;  /* 从右到左方向 */
}
```

---

## 4. 单行文本溢出

### 4.1 基础写法

```css
.single-line {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
```

### 4.2 完整示例

```html
<style>
.card-title {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  /* 可选：添加渐变提示 */
  background: linear-gradient(90deg, transparent, white 90%);
}

.card-title::after {
  content: "...";
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 0 4px;
  background: white;
}
</style>

<div class="card">
  <h3 class="card-title">这是一段很长的标题文本，超出容器宽度时会显示省略号</h3>
</div>
```

### 4.3 带渐变提示

```css
.card-title {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
}

/* 渐变遮罩提示（现代方案） */
.card-title::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  background: linear-gradient(90deg, transparent, white);
  pointer-events: none;
}
```

---

## 5. 多行文本溢出

### 5.1 纯 CSS 方案（line-clamp）

```css
/* WebKit/Blink 浏览器（Chrome, Safari, Edge） */
.multi-line {
  display: -webkit-box;
  -webkit-line-clamp: 3;   /* 限制最多 3 行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;  /* 可选，配合 ellipsis */
}
```

### 5.2 兼容方案

```css
/* 标准写法 + 降级 */
.multi-line {
  /* WebKit/Blink */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  /* Firefox（较新版本）*/
  display: block;
  overflow: hidden;
  max-height: 4.5em; /* line-height(1.5) * 3行 = 4.5em，需计算调整 */
  line-height: 1.5;
}

/* 渐进增强：仅在支持 line-clamp 的浏览器使用 */
@supports (-webkit-line-clamp: 2) {
  .multi-line {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    max-height: none; /* 移除 Firefox 降级 */
  }
}
```

### 5.3 JS 方案（更广泛兼容）

```js
/**
 * 多行文本溢出 JS 实现
 * @param {HTMLElement} el - 目标元素
 * @param {number} lineClamp - 最大行数
 */
function lineClamp(el, lineClamp) {
  const style = getComputedStyle(el);
  const lineHeight = parseFloat(style.lineHeight);
  const maxHeight = lineHeight * lineClamp + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);

  if (el.scrollHeight <= maxHeight) return; // 不需要截断

  const text = el.textContent;
  let low = 0, high = text.length;

  while (low < high) {
    const mid = Math.floor((low + high + 1) / 2);
    el.textContent = text.slice(0, mid) + '...';
    if (el.scrollHeight <= maxHeight) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }

  el.textContent = text.slice(0, low) + '...';

  // 处理单词边界
  if (el.scrollHeight > maxHeight) {
    el.textContent = text.slice(0, low - 1) + '...';
  }
}
```

---

## 6. 双方向溢出

### 6.1 overflow-x 和 overflow-y

```css
/* 仅水平方向溢出处理 */
.horizontal-only {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: visible; /* 允许垂直方向显示 */
}

/* 两个方向都溢出处理 */
.both-directions {
  text-overflow: ellipsis ellipsis;
  white-space: nowrap;
  overflow: hidden;
  writing-mode: horizontal-tb; /* 默认 */
}
```

### 6.2 RTL（从右到左）方向

```css
[dir="rtl"] .text {
  text-overflow: ellipsis ellipsis; /* 左侧显示省略号 */
  direction: rtl;
}
```

---

## 7. 与 Flex/Grid 布局的配合

### 7.1 Flex 布局中的文本溢出

```css
/* ❌ 问题：flex 项目默认不收缩到内容以下 */
.flex-container {
  display: flex;
}
.flex-item {
  flex: 1;
  min-width: 0; /* 关键！允许 flex 项目收缩 */
}
.flex-item .text {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

/* ✅ 正确 */
```

### 7.2 Grid 布局中的文本溢出

```css
.grid-cell {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  /* 配合 min-width: 0 防止网格区域撑开 */
  min-width: 0;
}
```

### 7.3 防止容器被撑开

```css
/* 使用 max-width 限制容器宽度 */
.container {
  max-width: 300px;
}

/* 使用 table-layout: fixed */
table {
  table-layout: fixed;
  width: 300px;
}
td {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
```

---

## 8. 常见问题与解决方案

### 8.1 text-overflow 不生效

```css
/* ❌ 常见错误： */
.element {
  text-overflow: ellipsis;
  overflow: hidden;
  /* white-space 缺失！文本会换行 */
  white-space: normal; /* 默认值，不换行需要 nowrap */
}

/* ✅ 解决：必须同时设置 */
.element {
  text-overflow: ellipsis;
  white-space: nowrap;  /* 禁止换行 */
  overflow: hidden;     /* 隐藏溢出 */
}
```

### 8.2 省略号位置不正确

```css
/* ❌ 省略号出现在中间（文字从右往左排列） */
.element {
  direction: rtl;  /* 可能是 direction 问题 */
  text-align: left;
}

/* ✅ 解决：明确设置 direction */
.element {
  direction: ltr;
  text-align: left;
}
```

### 8.3 省略号后面仍有文字

```css
/* 可能是 min-width 或 width 问题 */
.element {
  width: 100%;  /* 可能被子元素撑开 */
  min-width: 0; /* 关键：允许收缩 */
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
```

### 8.4 line-clamp 在 Firefox 不生效

```css
/* Firefox 68+ 支持 -webkit-line-clamp */
@supports not (-webkit-line-clamp: 2) {
  .multi-line {
    /* Firefox 降级方案：使用 max-height + overflow */
    display: block;
    overflow: hidden;
    max-height: 4.5em; /* line-height(1.5) * 3 */
    line-height: 1.5;
  }
}
```

### 8.5 配合 tooltip 使用

```css
/* 悬停显示完整文本 */
.title {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  cursor: help;
}

.title:hover {
  white-space: normal;
  overflow: visible;
  word-break: break-all; /* 允许换行显示完整内容 */
}
```

---

## 参考资料

- [MDN: text-overflow](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow)
- [CSS-TRICKS: The CSS white-space Property](https://css-tricks.com/almanac/properties/w/whitespace/)
- [CSS-TRICKS: line-clamp](https://css-tricks.com/line-clampin/)
- [W3Schools: CSS text-overflow](https://www.w3schools.com/css/css_text_overflow.asp)
