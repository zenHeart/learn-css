# CSS table-cell 百分比宽高无效问题详解

## 概述

在使用 `display: table-cell` 布局时，很多开发者会遇到一个常见问题：百分比宽度（`width: XX%`）和百分比高度（`height: XX%`）设置无效。本文深入分析这个问题的原因并提供多种解决方案。

## 问题描述

```html
<div class="table-container">
  <div class="cell">这个单元格的宽度是 50%，但可能不会生效</div>
  <div class="cell">另一个单元格</div>
</div>

<style>
.table-container {
  display: table;
  width: 100%;
}

.cell {
  display: table-cell;
  width: 50%;  /* 无效！ */
  height: 50%;  /* 无效！ */
}
</style>
```

## 问题原因

### 为什么百分比宽度无效？

`display: table-cell` 的宽度由**表格布局算法**决定：

1. **表格的默认行为**：表格默认根据内容自动调整宽度
2. **单元格宽度由整行决定**：单元格的宽度会被同行中最宽的单元格决定
3. **百分比宽度被忽略**：在自动表格布局（table-layout: auto）中，百分比宽度仅供参考

### 为什么百分比高度无效？

1. **表格行高度由最高单元格决定**：`table-row` 的高度由该行中最高的单元格决定
2. **内容撑开高度**：单元格内容会撑开高度
3. **百分比相对于谁？**：在 CSS 2.1 规范中，`table-cell` 的百分比高度相对于 **table-row**，而 table-row 的高度又由内容决定

## 解决方案

### 方案一：使用 table-layout: fixed

```css
.table-container {
  display: table;
  table-layout: fixed;  /* 关键！固定表格布局 */
  width: 100%;
}

.cell {
  display: table-cell;
  width: 50%;  /* 现在生效了！ */
}
```

**原理**：`table-layout: fixed` 使用固定表格布局算法，列宽由 `width` 属性决定，而不是内容。

### 方案二：使用 CSS Grid 替代

```css
.grid-container {
  display: grid;
  grid-template-columns: 50% 50%;  /* 两列各 50% */
}

.cell {
  /* Grid 项目天然支持百分比 */
}
```

**优点**：Grid 更现代，功能更强大，百分比支持更好。

### 方案三：使用 Flexbox 替代

```css
.flex-container {
  display: flex;
}

.cell {
  flex: 1;  /* 平分空间 */
}

/* 或者固定比例 */
.cell-half {
  flex: 0 0 50%;  /* 固定 50% 宽度 */
}
```

### 方案四：嵌套表格

```html
<table class="outer-table">
  <tr>
    <td class="cell" style="width: 50%;">
      <div class="inner-content">50% 宽度内容</div>
    </td>
    <td class="cell">
      <div class="inner-content">自动宽度</div>
    </td>
  </tr>
</table>

<style>
.cell {
  width: 50%;
}

.inner-content {
  /* 在这里设置百分比宽高 */
}
</style>
```

### 方案五：使用 CSS 变量 + calc()

```css
.table-container {
  display: table;
  table-layout: fixed;
  width: 100%;
}

.cell {
  display: table-cell;
  width: calc(100% / 3);  /* 三等分 */
}
```

## 高度问题解决方案

### 问题：table-cell 的百分比高度无效

```css
/* 这种写法无效 */
.cell {
  height: 50%;  /* 不生效 */
}

/* 解决方案一：父容器设置固定高度 */
.table-container {
  display: table;
  height: 400px;  /* 固定高度 */
  table-layout: fixed;
}

.cell {
  display: table-cell;
  height: 50%;  /* 现在相对于 400px */
}
```

### 解决方案二：使用 Grid

```css
.grid-container {
  display: grid;
  height: 400px;  /* 固定高度 */
  grid-template-rows: 50% 50%;  /* 两行各 50% */
}

.cell {
  /* Grid 项目 */
}
```

### 解决方案三：使用 Flexbox

```css
.flex-container {
  display: flex;
  flex-direction: column;
  height: 400px;
}

.cell {
  flex: 1;  /* 平分高度 */
}

/* 或者固定比例 */
.cell-half {
  flex: 0 0 50%;  /* 固定 50% 高度 */
}
```

## 实战示例

### 示例 1：等宽三列布局

```html
<div class="table-layout">
  <div class="col">第一列</div>
  <div class="col">第二列</div>
  <div class="col">第三列</div>
</div>

<style>
/* 方案一：table-layout: fixed */
.table-layout {
  display: table;
  table-layout: fixed;
  width: 100%;
}

.col {
  display: table-cell;
  width: 33.33%;  /* 生效！ */
  padding: 16px;
  border: 1px solid #ccc;
}

/* 方案二：CSS Grid */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.grid-layout .col {
  padding: 16px;
  border: 1px solid #ccc;
}
</style>
```

### 示例 2：左侧固定宽度 + 右侧自适应

```html
<div class="layout">
  <div class="sidebar">侧边栏固定宽度</div>
  <div class="main">主内容区自适应</div>
</div>

<style>
/* 方案一：table 实现 */
.layout {
  display: table;
  table-layout: fixed;
  width: 100%;
}

.sidebar {
  display: table-cell;
  width: 250px;  /* 固定宽度 */
  background: #f5f5f5;
}

.main {
  display: table-cell;
  /* 不需要设置宽度，自动填满剩余空间 */
}

/* 方案二：Flexbox 实现 */
.layout {
  display: flex;
}

.sidebar {
  flex: 0 0 250px;  /* 固定宽度 */
}

.main {
  flex: 1;  /* 自适应 */
}
</style>
```

### 示例 3：垂直水平居中

```html
<div class="table-container">
  <div class="cell">
    <div class="content">垂直水平居中的内容</div>
  </div>
</div>

<style>
/* 方案一：table-cell 实现 */
.table-container {
  display: table;
  width: 100%;
  height: 300px;  /* 需要固定高度 */
}

.cell {
  display: table-cell;
  text-align: center;  /* 水平居中 */
  vertical-align: middle;  /* 垂直居中 */
}

.content {
  display: inline-block;
}

/* 方案二：Flexbox 实现 */
.flex-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}
</style>
```

### 示例 4：响应式表格

```html
<div class="responsive-table">
  <div class="row header">
    <div class="cell">姓名</div>
    <div class="cell">年龄</div>
    <div class="cell">城市</div>
  </div>
  <div class="row">
    <div class="cell">张三</div>
    <div class="cell">25</div>
    <div class="cell">北京</div>
  </div>
</div>

<style>
.responsive-table {
  display: table;
  table-layout: fixed;
  width: 100%;
}

.row {
  display: table-row;
}

.cell {
  display: table-cell;
  width: 33.33%;  /* 三等分 */
  padding: 12px;
  border: 1px solid #ccc;
}

.row.header .cell {
  background: #f5f5f5;
  font-weight: bold;
}

/* 移动端堆叠显示 */
@media (max-width: 768px) {
  .responsive-table {
    display: block;
  }

  .row {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
  }

  .cell {
    width: 100%;
    display: block;
    border: none;
    border-bottom: 1px solid #ccc;
  }
}
</style>
```

## 深入理解：table-layout 算法

### auto 布局算法（默认）

```
1. 计算每列的最小宽度（基于内容）
2. 计算每列的最大宽度（基于内容）
3. 根据表格宽度和列数，平均分配剩余空间
4. 百分比宽度仅供参考，不保证生效
```

### fixed 布局算法

```
1. 使用列的 width 属性（或第一行的宽度）确定列宽
2. 忽略内容，使用固定宽度
3. 百分比宽度直接生效
4. 性能更好（浏览器不需要计算所有内容）
```

## 常见问题

### 问题 1：单元格之间有间隙

```css
/* 原因：表格单元格默认有间距 */

/* 解决方案一：合并边框 */
.table {
  border-collapse: collapse;
}

/* 解决方案二：设置间距 */
.table {
  border-spacing: 8px;
}
```

### 问题 2：边框重叠

```css
/* 使用 border-collapse 解决 */
.table {
  border-collapse: collapse;
}

.table-cell {
  border: 1px solid #ccc;
}
```

### 问题 3：垂直对齐不一致

```css
/* 统一使用 vertical-align */
.table-cell {
  vertical-align: top;  /* 或 middle, bottom */
}
```

### 问题 4：嵌套元素高度不生效

```html
<div class="cell">
  <div class="inner">内部元素</div>
</div>

<style>
.cell {
  display: table-cell;
  height: 100px;  /* 生效 */
}

.inner {
  height: 50%;  /* 相对于 .cell，不生效 */
}

/* 解决方案：使用绝对定位 */
.cell {
  position: relative;
}

.inner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
```

## 现代替代方案对比

| 特性 | table-cell | Flexbox | Grid |
|------|------------|---------|------|
| 百分比宽度 | 需要 `table-layout: fixed` | 支持 | 支持 |
| 百分比高度 | 不支持 | 支持 | 支持 |
| 等高列 | 原生支持 | 需要设置 | 需要设置 |
| 垂直居中 | `vertical-align` | `align-items` | `align-items` |
| 响应式 | 一般 | 优秀 | 优秀 |
| 浏览器支持 | 所有 | 所有 | 所有（现代） |

## 最佳实践建议

```css
/* 推荐：明确选择布局方式 */

/* 使用 table-cell 时 */
.table {
  display: table;
  table-layout: fixed;  /* 明确使用固定布局 */
  width: 100%;
}

.cell {
  display: table-cell;
  width: 50%;  /* 现在可靠 */
}

/* 或者直接使用 Flexbox/Grid（更推荐） */
.modern-layout {
  display: flex;
  /* 或 display: grid */
}
```

## 浏览器支持

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| display: table | ✅ 1+ | ✅ 1+ | ✅ 1+ | ✅ 12+ |
| table-layout: fixed | ✅ 1+ | ✅ 1+ | ✅ 1+ | ✅ 12+ |
| 百分比宽度（fixed 模式下） | ✅ 1+ | ✅ 1+ | ✅ 1+ | ✅ 12+ |
| 百分比高度 | ⚠️ 部分 | ⚠️ 部分 | ⚠️ 部分 | ⚠️ 部分 |

## 总结

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 百分比宽度无效 | table-layout: auto | 添加 `table-layout: fixed` |
| 百分比高度无效 | 表格行高度由内容决定 | 使用 Flexbox/Grid，或设置父容器固定高度 |
| 列宽被内容撑开 | auto 布局算法 | 使用 `table-layout: fixed` |
| 单元格间距 | 边框分离模式 | `border-collapse: collapse` |

## 参考资源

- [MDN table-layout](https://developer.mozilla.org/zh-CN/docs/Web/CSS/table-layout)
- [MDN display](https://developer.mozilla.org/zh-CN/docs/Web/CSS/display)
- [CSS Tables Layout](https://www.w3.org/TR/CSS22/tables.html)
- [Why percentage widths don't work in CSS tables](https://stackoverflow.com/questions/13964738/why-doesnt-percentage-width-work-in-css-table-cells)
