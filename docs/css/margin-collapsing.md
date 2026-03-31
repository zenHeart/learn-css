# CSS Margin Collapsing 与 BFC 原理

## 概述

**Margin Collapsing（外边距合并）** 是 CSS 的核心行为之一，指垂直方向相邻的两个 margin 会合并为一个，取较大值。理解这一机制对于掌握 CSS 布局至关重要。

---

## 一、Margin Collapsing 的三个场景

### 1. 兄弟元素之间的合并

上下相邻的兄弟元素，它们的 `margin-bottom` 和 `margin-top` 会合并为 `max(A, B)`：

```html
<style>
.box1 { margin-bottom: 20px; }
.box2 { margin-top: 30px; }
/* 实际间距 = 30px（取较大值），而不是 50px */
</style>
<div class="box1">上元素</div>
<div class="box2">下元素</div>
```

**目的**：让段落之间的间距一致，无论段落内容多少。

### 2. 父元素与第一个/最后一个子元素之间的合并

当父元素没有 `border-top`、`padding-top`、或 `inline` 内容时，父元素的 `margin-top` 和第一个子元素的 `margin-top` 会合并：

```html
<style>
.parent { margin-top: 0; }
/* 子元素的 margin-top "穿透"到父元素外部 */
.child { margin-top: 40px; }
</style>
<div class="parent">
  <!-- 合并后的 margin 出现在这里 -->
  <div class="child">子元素</div>
</div>
<!-- 整个父容器距离顶部的距离是 40px，而不是 0 -->
```

同理，父元素的 `margin-bottom` 和最后一个子元素的 `margin-bottom` 也会合并。

### 3. 空块级元素的合并

空块级元素的 `margin-top` 和 `margin-bottom` 会合并在一起：

```html
<style>
.empty { margin-top: 30px; margin-bottom: 30px; }
/* 实际效果 = max(30px, 30px) = 30px，不是 60px */
</style>
<div class="box1">上面的元素</div>
<div class="empty"></div> <!-- 合并为 30px -->
<div class="box2">下面的元素</div>
```

---

## 二、为什么 overflow: hidden 能阻止 margin 合并？

### 核心概念：BFC

**BFC（Block Formatting Context，块级格式化上下文）** 是 CSS 渲染模型中的一个独立区域。

**BFC 内部的规则**：
- 内部的 Box 会在垂直方向一个接一个地放置
- BFC 内部的 margin 不会与外部的 margin 合并
- BFC 不会与浮动元素重叠
- 计算 BFC 的高度时，浮动子元素也会参与计算

### overflow: hidden 如何创建 BFC

当父元素设置 `overflow: hidden` 时，它会创建一个新的 BFC：

```html
<style>
/* 没有 BFC：子元素的 margin 穿透到父元素外部 */
.parent { overflow: visible; }
/* 子元素的 margin-top 和父元素的 margin-top 合并 */

/* 有 BFC：子元素的 margin 被包含在父元素内部 */
.parent { overflow: hidden; }
/* 创建了新的 BFC，内部的 margin 不与外部合并 */
</style>
```

**根本原因**：`overflow: hidden` 触发 BFC 创建，BFC 内部的 margin 不会与外部的 margin 合并，因此子元素的 margin 被"包含"在父元素内部。

---

## 三、所有触发 BFC 的方式

| 属性 | 值 | 副作用 | 推荐度 |
|------|-----|--------|--------|
| overflow | hidden / scroll / auto | 裁剪溢出内容 | ★★★★☆ |
| display | flow-root | 无（专门创建 BFC） | ★★★★★ |
| display | inline-block | 产生匿名块盒 | ★★★☆☆ |
| position | absolute / fixed | 脱离文档流 | ★★☆☆☆ |
| float | left / right | 脱离文档流 | ★★☆☆☆ |
| flex / grid | 容器 | 改变子元素布局 | ★★★★☆ |

### 最推荐的方案：display: flow-root

```css
/* 最佳实践：使用 flow-root */
.parent {
  display: flow-root; /* 唯一作用就是创建 BFC，无副作用 */
}
```

---

## 四、阻止 margin 合并的 6 种方案

### 方案 1：overflow: hidden

```css
.parent { overflow: hidden; }
```
- ✓ 兼容性极好
- ⚠️ 副作用：裁剪溢出的内容

### 方案 2：padding-top: 0.1px

```css
.parent { padding-top: 0.1px; }
```
- ✓ 视觉无影响（0.1px 在屏幕上不可见）
- ✓ 不裁剪内容
- ⚠️ 需要同时处理 padding-bottom 的问题

### 方案 3：border-top: 1px solid transparent

```css
.parent { border-top: 1px solid transparent; }
```
- ✓ 视觉效果好
- ⚠️ 会产生 1px 的边框线

### 方案 4：display: flow-root

```css
.parent { display: flow-root; }
```
- ✓ 纯 CSS，无副作用
- ✓ 语义清晰
- ⚠️ IE 不支持（现代项目可忽略）

### 方案 5：父元素变成 flex 或 grid 容器

```css
.parent { display: flex; flex-direction: column; }
/* 或 */
.parent { display: grid; }
```
- ✓ 常用于实际项目
- ⚠️ 改变了子元素的布局方式

### 方案 6：::before 或 ::after 伪元素

```css
.parent::before {
  content: '';
  display: table; /* 触发 BFC，margin-top: -1px 可以消除上边框 */
  margin-top: -1px;
}
```
- ✓ 不改变父元素的样式
- ⚠️ 代码较复杂

---

## 五、与 Vue 的关系

### Vue 中子组件的 margin 问题

在 Vue 组件开发中，子组件的 margin 有时会出现"穿透"父组件的问题：

```vue
<!-- Parent.vue -->
<template>
  <div class="parent">
    <Child /> <!-- Child 的 margin-top 会穿透 -->
  </div>
</template>

<!-- 解决：给父元素创建 BFC -->
<style>
.parent { overflow: hidden; }
/* 或 */
.parent { display: flow-root; }
</style>
```

### React 中的同样问题

React 函数组件也会遇到相同问题：

```jsx
function Parent() {
  return (
    <div className="parent">
      <Child /> {/* Child 的 margin 会穿透 */}
    </div>
  );
}

/* 解决 */
.parent { overflow: hidden; }
/* 或使用 CSS-in-JS 的方案 */
```

---

## 六、常见踩坑场景

### 1. 第一个子元素的 margin-top 穿透

```css
/* 问题代码 */
.card {
  background: #fff;
  /* 没有 border/padding，margin-top 会穿透 */
}
.card-title {
  margin-top: 40px; /* 这 40px 会跑到 .card 外面 */
}

/* 解决方案 */
.card {
  overflow: hidden;
  /* 或 */
  display: flow-root;
}
```

### 2. 最后一个子元素的 margin-bottom 穿透

同上，使用相同的解决方案。

### 3. 空元素的高度塌陷

```css
/* 问题代码 */
.separator {
  margin-top: 20px;
  margin-bottom: 20px;
  /* 实际高度 = 20px，不是 40px */
}

/* 解决方案 */
.separator {
  padding-top: 0.1px;
  padding-bottom: 0.1px;
}
```

---

## 七、浏览器支持

- `overflow: hidden/scroll/auto`：所有浏览器
- `display: flow-root`：Chrome 58+, Firefox 59+, Safari 12.1+, Edge 79+
- `display: inline-block`：所有浏览器

现代项目推荐使用 `display: flow-root`，历史项目使用 `overflow: hidden`。

---

## 八、交互演示

完整交互演示请查看：`examples/css/demos/margin-collapsing-demo.html`

演示内容：
1. 兄弟 margin 合并（可调节数值）
2. 父子 margin 合并（margin 穿透）
3. 空元素 margin 合并
4. BFC 阻止合并（before/after 对比）
5. 6 种解决方案对比

---

## 参考资料

- [MDN: Mastering margin collapsing](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Mastering_margin_collapsing)
- [CSS 规范：Margin collapsing](https://www.w3.org/TR/CSS2/box.html#collapsing-margins)
- [BFC 触发条件](https://www.w3.org/TR/CSS2/visuren.html#block-formatting)
