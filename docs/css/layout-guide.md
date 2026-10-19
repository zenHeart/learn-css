# CSS 布局详解

## 布局方案演进

| 时代 | 方案 | 特点 |
|------|------|------|
| 早期 | Table | 表格嵌套，语义差，不推荐 |
| 中期 | Float + Position | 浮动清理，定位层叠 |
| 现代 | Flexbox + Grid | 主流通用方案 |
| 2024+ | Grid + Subgrid + Container Queries | 响应式新特性 |

## Flexbox（一维布局）

适合**组件内**的元素排列（导航栏、卡片组、居中）。

```css
.container {
  display: flex;
  justify-content: space-between; /* 主轴分布 */
  align-items: center;            /* 交叉轴对齐 */
  gap: 10px;
}
```

**核心属性**：
- `flex-direction`: row | column
- `justify-content`: flex-start | center | space-between | space-around
- `align-items`: stretch | center | flex-start
- `flex-wrap`: nowrap | wrap

**适用场景**：导航栏、按钮组、表单对齐、卡片行。

## CSS Grid（二维布局）

适合**页面级**复杂布局（多行多列、响应式网格）。

```css
.page {
  display: grid;
  grid-template-columns: minmax(200px, 1fr) 3fr;
  gap: 20px;
}
```

**核心属性**：
- `grid-template-columns/rows`: repeat(auto-fill, minmax(200px, 1fr))
- `gap`: 行列间距统一设置
- `grid-area`: 命名区域布局
- `minmax(min, max)`: 自适应尺寸

**适用场景**：页面整体框架、仪表盘、相册网格。

## Flex vs Grid 选型

| 场景 | 推荐方案 | 原因 |
|------|----------|------|
| 导航栏按钮均匀分布 | Flex | 一维排列，justify-content 即可 |
| 页面整体两栏/三栏 | Grid | 二维控制，模板定义清晰 |
| 卡片网格（自适应列数） | Grid + auto-fit | `repeat(auto-fill, minmax(250px, 1fr))` |
| 表单项垂直对齐 | Flex column | 标签+输入框自然对齐 |
| 圣杯布局（header/footer/sidebar） | Grid | 三区域一次性定义 |

## 2024 新特性

### Subgrid（Chrome 117+, Safari 16+）

子网格继承父 Grid 行列，实现卡片内容对齐：

```css
.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.child {
  grid-column: span 3;
  display: grid;
  grid-template-columns: subgrid; /* 继承父列轨道 */
}
```

### Container Queries（组件级响应）

不依赖视口，根据容器尺寸响应：

```css
@container (min-width: 400px) {
  .card { flex-direction: row; }
}
```

### clamp() 响应式尺寸

无媒体查询的自适应：

```css
width: clamp(300px, 50%, 800px); /* min/首选/max */
font-size: clamp(14px, 2vw, 18px);
```

## 固定头部布局

主流方案：

```css
/* 方案一：absolute + padding */
body { padding-top: 60px; }
header { position: absolute; top: 0; height: 60px; }

/* 方案二：grid 模板 */
body {
  display: grid;
  grid-template-rows: 60px 1fr auto;
  grid-template-areas: "header" "main" "footer";
}
header { grid-area: header; }
```

## 参考

- [Smashing Magazine: Modern CSS Layouts](https://www.smashingmagazine.com/2024/05/modern-css-layouts-no-framework-needed/)
- [CSS Tricks: A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [CSS Tricks: A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
