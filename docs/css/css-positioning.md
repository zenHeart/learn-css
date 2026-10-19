# CSS 定位（Positioning）详解

## 概述

CSS 定位是一种控制元素在页面上位置和布局方式的机制。通过 `position` 属性，我们可以将元素从正常的文档流中取出，精确控制其位置。理解定位是掌握 CSS 布局的关键。

## position 属性

```css
.element {
  position: static | relative | absolute | fixed | sticky;
}
```

## 定位值详解

### 1. static（默认值）

```css
.static-element {
  position: static;
}
```

- **特性**：元素遵循正常文档流，没有任何定位效果
- **使用场景**：默认值，不需要特殊定位时使用
- **z-index**：无效

### 2. relative（相对定位）

```css
.relative-element {
  position: relative;
  top: 20px;
  left: 30px;
}
```

- **特性**：元素相对于其**正常位置**进行偏移
- **不脱离文档流**：元素原本占据的空间仍然保留
- **使用场景**：微调元素位置、作为绝对定位子元素的参考
- **z-index**：有效，可以创建层叠上下文

### 3. absolute（绝对定位）

```css
.absolute-element {
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
}
```

- **特性**：元素相对于**最近的已定位祖先元素**定位
- **脱离文档流**：元素不占据文档空间
- **如果没有已定位祖先**：相对于初始包含块（通常是 `<html>`）定位
- **使用场景**：固定导航栏、悬浮卡片、模态框

### 4. fixed（固定定位）

```css
.fixed-element {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
```

- **特性**：元素相对于**视口（viewport）**定位
- **脱离文档流**：元素不占据文档空间
- **滚动时位置不变**：即使页面滚动，元素始终保持在指定位置
- **使用场景**：固定导航栏、回到顶部按钮、侧边广告

### 5. sticky（粘性定位）

```css
.sticky-element {
  position: sticky;
  top: 10px;
}
```

- **特性**：元素在滚动容器内"粘"在指定位置
- **未滚动时**：遵循正常文档流
- **滚动超过阈值**：相对于最近的滚动容器固定
- **使用场景**：表格表头固定、表单分组标题

## 定位偏移属性

当元素为非 static 定位时，可以使用以下属性控制位置：

```css
.positioned-element {
  /* 偏移属性 */
  top: 10px;      /* 距离顶部 */
  bottom: 10px;   /* 距离底部 */
  left: 10px;     /* 距离左侧 */
  right: 10px;    /* 距离右侧 */

  /* 偏移值类型 */
  top: 20px;              /* 固定值 */
  top: 10%;               /* 百分比（相对于包含块） */
  top: calc(50% - 50px);  /* calc() 计算 */
}
```

## 包含块（Containing Block）

理解包含块对于定位至关重要：

### 如何确定包含块

| 定位类型 | 包含块 |
|----------|--------|
| `static` / `relative` / `sticky` | 最近的块级祖先元素 |
| `absolute` | 最近的已定位祖先元素（position ≠ static） |
| `fixed` | 视口（viewport） |

### 示例

```html
<div class="container">
  <div class="parent">
    <div class="child">绝对定位元素</div>
  </div>
</div>

<style>
.container {
  position: relative; /* 为 .child 提供包含块 */
}

.parent {
  /* 没有定位，作为包含块的传递者 */
}

.child {
  position: absolute;
  top: 0;
  left: 0;
  /* 相对于 .container 定位 */
}
</style>
```

## 层叠上下文（Stacking Context）

定位元素会创建新的层叠上下文，影响元素的显示顺序：

### 创建层叠上下文的条件

- 根元素 (`<html>`)
- `position` 为 `relative` 或 `absolute` + `z-index` 不为 `auto`
- `position` 为 `fixed` 或 `sticky`
- `z-index` 不为 `auto` 的 flex 子元素
- `opacity` 小于 1 的元素
- `transform` 不为 `none` 的元素
- 其他 CSS 属性

### 层叠顺序（从底到顶）

```
1. 块级盒（block boxes）
2. 浮动元素（float elements）
3. 行内盒（inline boxes）
4. 定位元素（positioned elements）
   └── z-index: auto 或 z-index: 0
   └── z-index: 正值（越大越在上）
```

## 实战示例

### 示例 1：固定顶部导航栏

```html
<header class="navbar">
  <div class="logo">Logo</div>
  <nav>导航内容</nav>
</header>
<main>页面主要内容</main>

<style>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

main {
  /* 为固定导航栏留出空间 */
  padding-top: 60px;
}
</style>
```

### 示例 2：绝对定位居中卡片

```html
<div class="overlay">
  <div class="modal-card">
    <h2>模态框标题</h2>
    <p>模态框内容</p>
    <button>关闭</button>
  </div>
</div>

<style>
.overlay {
  position: fixed;
  inset: 0;  /* 等价于 top: 0; right: 0; bottom: 0; left: 0; */
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-card {
  position: relative;  /* 可以添加 close 按钮的相对定位 */
  background: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
}

/* 绝对定位的关闭按钮 */
.modal-card .close {
  position: absolute;
  top: 12px;
  right: 12px;
}
</style>
```

### 示例 3：粘性表头

```html
<table class="sticky-table">
  <thead>
    <tr>
      <th>姓名</th>
      <th>年龄</th>
      <th>城市</th>
    </tr>
  </thead>
  <tbody>
    <!-- 大量数据行 -->
  </tbody>
</table>

<style>
.sticky-table {
  width: 100%;
  border-collapse: collapse;
}

.sticky-table thead th {
  position: sticky;
  top: 0;
  background: #f5f5f5;
  z-index: 10;
}
</style>
```

### 示例 4：图片上的文字叠加

```html
<div class="card">
  <img src="photo.jpg" alt="照片">
  <div class="badge">热门</div>
</div>

<style>
.card {
  position: relative;
  display: inline-block;
}

.card img {
  width: 300px;
  height: 200px;
  object-fit: cover;
}

.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: red;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
```

### 示例 5：下拉菜单

```html
<nav class="dropdown-nav">
  <div class="menu-item">
    <span>菜单1</span>
    <div class="dropdown">
      <a href="#">子菜单1</a>
      <a href="#">子菜单2</a>
      <a href="#">子菜单3</a>
    </div>
  </div>
</nav>

<style>
.dropdown-nav {
  background: #333;
  padding: 10px;
}

.menu-item {
  position: relative;
  display: inline-block;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  min-width: 150px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: none;
}

.menu-item:hover .dropdown {
  display: block;
}

.dropdown a {
  display: block;
  padding: 10px;
  color: #333;
  text-decoration: none;
}
</style>
```

## 常见问题

### 问题 1：绝对定位元素消失

```css
/* 原因：包含块没有设置 position */
.parent {
  /* position: relative; 如果没有这行，.child 将相对于<html>定位 */
}

.child {
  position: absolute;
  top: 0;
  left: 0;
}

/* 解决方案：确保包含块有定位属性 */
.parent {
  position: relative;
}
```

### 问题 2：子元素溢出父元素

```css
/* 绝对定位元素超出父容器边界 */
.parent {
  position: relative;
  overflow: hidden; /* 裁剪子元素 */
}

.child {
  position: absolute;
  top: -20px; /* 这部分会被裁剪 */
}
```

### 问题 3：fixed 定位在移动端失效

```css
/* iOS Safari 的问题：滚动时 fixed 会变成 absolute */
body {
  /* 解决方案：添加必要的 meta 标签 */
  /* <meta name="viewport" content="width=device-width, initial-scale=1.0"> */
}

/* 或使用 @supports 检测 */
@supports (position: fixed) {
  .fixed-element {
    position: fixed;
  }
}
```

### 问题 4：z-index 不生效

```css
/* 原因：两个元素在不同的层叠上下文 */
.parent1 {
  position: relative;
  z-index: 10;
}

.parent2 {
  position: relative;
  z-index: 5;
}

.child {
  position: absolute;
}

/* .parent1 的 child 永远在 .parent2 的 child 上面 */
/* 因为 z-index 比较的是父元素的层叠上下文 */

/* 解决方案：将子元素的 z-index 提高 */
.parent1 {
  position: relative;
  z-index: 10;
}

.parent1 .child {
  position: absolute;
  z-index: 100; /* 在同一层叠上下文内比较 */
}
```

## 现代布局替代方案

虽然定位仍然有用，但很多场景已被 Flexbox 和 Grid 替代：

| 场景 | 传统定位 | 现代方案 |
|------|----------|----------|
| 水平居中 | relative + margin | `margin: 0 auto` 或 Flexbox |
| 垂直居中 | absolute + transform | Flexbox `align-items: center` |
| 固定导航 | fixed | 同 left（无更好替代） |
| 悬浮元素 | absolute | Grid/Flexbox 配合 gap |
| 文字环绕 | float | Flexbox 或 `shape-outside` |

## 浏览器支持

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| relative | ✅ 1+ | ✅ 1+ | ✅ 1+ | ✅ 12+ |
| absolute | ✅ 1+ | ✅ 1+ | ✅ 1+ | ✅ 12+ |
| fixed | ✅ 1+ | ✅ 1+ | ✅ 1+ | ✅ 12+ |
| sticky | ✅ 56+ | ✅ 59+ | ✅ 9+ | ✅ 16+ |

## 总结

| 定位类型 | 相对于 | 脱离文档流 | 滚动时移动 |
|----------|--------|------------|------------|
| `static` | 正常位置 | ❌ | ✅ |
| `relative` | 正常位置 | ❌ | ✅ |
| `absolute` | 最近已定位祖先 | ✅ | 取决于祖先 |
| `fixed` | 视口 | ✅ | ❌ |
| `sticky` | 滚动容器 | ❌ | 阈值后固定 |

## 参考资源

- [MDN CSS Positioning](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Positioning)
- [CSS Tricks - position](https://css-tricks.com/almanac/properties/p/position/)
- [Stacking Context - MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)
