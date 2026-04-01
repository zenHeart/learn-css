# 典型 CSS 布局 (Typical CSS Layouts)

## 概述

CSS 布局是前端开发的核心技能。本文系统梳理常用布局模式，从传统方案到现代方案，帮助开发者根据场景选择最优实现。

## 布局方案演进

| 时代 | 方案 | 特点 |
|------|------|------|
| 上古 | Table 布局 | 简单但语义差 |
| 古典 | Float + Margin | 浮动闭合问题 |
| 过渡 | Flexbox | 一维布局神器 |
| 现代 | CSS Grid | 二维布局王者 |
| 新潮 | Container Queries | 组件自适应 |

## 一、单栏布局 (Single Column)

最基础的布局，内容居中显示。

### 方案一：Flexbox（推荐）

```html
<div class="single-column">
  <header>头部</header>
  <main>主内容</main>
  <footer>底部</footer>
</div>
```

```css
.single-column {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.single-column main {
  flex: 1; /* 主内容区自动撑满 */
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
```

### 方案二：Grid

```css
.single-column {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
```

**适用场景**：博客、文档、简单页面

---

## 二、两栏布局 (Two Column)

左侧边栏 + 右侧内容。

### 方案一：Flexbox（推荐）

```html
<div class="two-column">
  <aside class="sidebar">侧边栏</aside>
  <main class="content">主内容</main>
</div>
```

```css
.two-column {
  display: flex;
}
.sidebar {
  width: 250px;
  flex-shrink: 0; /* 防止压缩 */
}
.content {
  flex: 1; /* 自动填充剩余空间 */
}
```

### 方案二：Float（传统）

```css
.sidebar {
  float: left;
  width: 250px;
}
.content {
  margin-left: 250px;
}
```

### 方案三：Grid

```css
.two-column {
  display: grid;
  grid-template-columns: 250px 1fr;
}
```

**适用场景**：管理后台、博客侧边栏、产品列表

---

## 三、三栏布局 (Three Column)

左右侧栏 + 中间主内容。

### 方案一：Flexbox

```css
.three-column {
  display: flex;
}
.left-sidebar, .right-sidebar {
  width: 200px;
  flex-shrink: 0;
}
.main {
  flex: 1;
}
```

### 方案二：Grid（最简洁）

```css
.three-column {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
}
```

### 方案三：圣杯布局（Float 传统）

```css
.container {
  padding: 0 200px; /* 为左右栏预留空间 */
}
.main {
  float: left;
  width: 100%;
}
.left-sidebar {
  float: left;
  width: 200px;
  margin-left: -100%;
  position: relative;
  left: -200px;
}
.right-sidebar {
  float: left;
  width: 200px;
  margin-left: -200px;
  position: relative;
  right: -200px;
}
```

**适用场景**：门户网站、邮件客户端、仪表盘

---

## 四、圣杯布局 (Holy Grail)

经典五区域布局：头、主、尾 + 左右侧栏。

```html
<div class="holy-grail">
  <header>Header</header>
  <div class="body">
    <aside class="left">Left</aside>
    <main>Main</main>
    <aside class="right">Right</aside>
  </div>
  <footer>Footer</footer>
</div>
```

```css
.holy-grail {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.holy-grail .body {
  display: flex;
  flex: 1;
}
.holy-grail main {
  flex: 1;
}
.holy-grail .left, .holy-grail .right {
  width: 200px;
  flex-shrink: 0;
}
```

---

## 五、双飞翼布局 (Double Wing)

圣杯布局的改进版，解决内容区域 padding 问题。

```html
<div class="double-wing">
  <header>Header</header>
  <div class="bd">
    <main class="main-wrap">
      <div class="main">Main Content</div>
    </main>
    <aside class="left">Left</aside>
    <aside class="right">Right</aside>
  </div>
  <footer>Footer</footer>
</div>
```

```css
.double-wing .bd {
  display: flex;
}
.double-wing .main-wrap {
  flex: 1;
}
.double-wing .main {
  margin: 0 200px; /* 左右边距避免被侧栏遮挡 */
}
.double-wing .left,
.double-wing .right {
  width: 200px;
  flex-shrink: 0;
}
.double-wing .left { order: -1; } /* Flex 改变顺序 */
```

---

## 六、Flex Box 布局

现代 Flexbox 是最强大的布局方案。

### 常用属性

| 属性 | 说明 |
|------|------|
| `display: flex` | 启用 Flex 容器 |
| `flex-direction` | 主轴方向 |
| `justify-content` | 主轴对齐 |
| `align-items` | 交叉轴对齐 |
| `flex-wrap` | 换行控制 |
| `gap` | 间距 |

### 典型场景

#### 导航栏

```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background: #333;
  padding: 0 20px;
}
.nav-links {
  display: flex;
  gap: 20px;
}
```

#### 居中布局

```css
.center-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  background: #f5f5f5;
}
```

#### 底部固定

```css
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content {
  flex: 1;
}
footer {
  height: 60px;
}
```

---

## 七、Grid 布局

CSS Grid 是二维布局的终极方案。

### 基础语法

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3列等宽 */
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  min-height: 100vh;
}
```

### 常用模板

#### 响应式网格

```css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
```

#### 圣杯布局（Grid 版）

```css
.holy-grail {
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 200px 1fr 200px;
  min-height: 100vh;
}
header { grid-column: 1 / -1; }
footer { grid-column: 1 / -1; }
```

#### 瀑布流

```css
.masonry {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 10px;
  grid-auto-flow: dense; /* 填充空隙 */
}
.masonry-item:nth-child(odd) {
  grid-row: span 20;
}
.masonry-item:nth-child(even) {
  grid-row: span 15;
}
```

### Grid vs Flexbox

| 维度 | Flexbox | Grid |
|------|---------|------|
| 维度 | 一维（行或列） | 二维（行和列） |
| 控制粒度 | 子元素分布 | 容器轨道定义 |
| 适用场景 | 导航、列表、卡片 | 页面整体布局、复杂网格 |
| 学习曲线 | 较平缓 | 较陡 |

---

## 八、容器查询 (Container Queries)

新一代布局技术，让组件根据容器尺寸自适应。

### 基础用法

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}
.card {
  display: flex;
  flex-direction: column;
}
/* 容器宽度 > 400px 时，切换为水平布局 */
@container card (min-width: 400px) {
  .card {
    flex-direction: row;
  }
}
```

### 与 Media Query 的区别

| 维度 | Container Queries | Media Queries |
|------|-------------------|---------------|
| 参照物 | 父容器宽度 | 视口宽度 |
| 适用场景 | 可复用组件 | 页面整体响应式 |
| 灵活性 | 更高 | 较低 |

---

## 九、常见布局技巧

### 1. 等宽多列（平均分布）

```css
.equal-columns {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
/* 或 Flexbox */
.equal-columns {
  display: flex;
}
.equal-columns > * {
  flex: 1;
}
```

### 2. 最后一个元素靠右

```css
.flex-row {
  display: flex;
  gap: 10px;
}
.spacer {
  flex: 1;
}
```

### 3. 固定宽度 + 自适应

```css
.layout {
  display: flex;
}
.fixed {
  width: 200px;
  flex-shrink: 0;
}
.auto {
  flex: 1;
}
```

### 4. Sticky Footer（页脚固定底部）

```css
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content {
  flex: 1;
}
```

---

## 十、布局方案选择指南

| 场景 | 推荐方案 |
|------|----------|
| 简单页面/博客 | Flexbox 单栏 |
| 后台管理侧边栏 | Flexbox 两栏 |
| 门户网站 | CSS Grid 三栏 |
| 卡片网格 | Grid auto-fit |
| 导航栏 | Flexbox |
| 居中弹窗 | Flexbox 或 Grid |
| 组件内部布局 | Container Queries |
| 复杂二维布局 | CSS Grid |

---

## 十一、现代布局最佳实践

1. **优先 Flexbox**：简单一维布局首选
2. **复杂布局用 Grid**：二维布局毫无疑问选 Grid
3. **避免 Float**：现代浏览器无需 Float 做布局
4. **使用 gap**：Flexbox/Grid 的 gap 比手动 margin 更优雅
5. **响应式优先 Grid**：使用 `auto-fit/minmax` 实现自适应
6. **组件化思维**：用 Container Queries 替代部分 Media Queries
7. **性能考虑**：避免嵌套过深的 Flex/Grid

---

## 相关资源

- [CSS Flexbox 完全指南](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS Grid 完全指南](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Container Queries 介绍](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries)
