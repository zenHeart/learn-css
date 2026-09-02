# Flexbox 布局完整指南

## 目录

1. [Flexbox 概述](#1-flexbox-概述)
2. [容器属性](#2-容器属性)
3. [项目属性](#3-项目属性)
4. [常见场景](#4-常见场景)
5. [常见问题与技巧](#5-常见问题与技巧)

---

## 1. Flexbox 概述

### 1.1 什么是 Flexbox

Flexbox（弹性盒子）是 CSS3 提出的**一维布局模型**，专门用于处理容器内元素的对齐、分布和排序问题。

- **一维**：处理一个方向上的布局（行或列）
- **主轴（Main Axis）**：Flex 项目排列的主方向
- **交叉轴（Cross Axis）**：垂直于主轴的方向

### 1.2 基本术语

```
           Main Axis（主轴）
              ←———————→
  ┌─────────────────────────────────┐
  │ ┌───┐ ┌───┐ ┌───┐ ┌───┐        │
  │ │ 1 │ │ 2 │ │ 3 │ │ 4 │        │
  │ └───┘ └───┘ └───┘ └───┘        │
  └─────────────────────────────────┘
              Cross Axis（交叉轴）
               ————————
               ↓↓↓↓↓
```

### 1.3 启用 Flexbox

```css
.container {
  display: flex;     /* 块级弹性容器 */
  /* display: inline-flex;  行内弹性容器 */
}
```

---

## 2. 容器属性

### 2.1 flex-direction — 主轴方向

```
┌─────────────────────────────────────┐
│ row（默认）：左 → 右                  │
│ row-reverse：右 → 左                  │
│ column：上 → 下                      │
│ column-reverse：下 → 上              │
└─────────────────────────────────────┘
```

| 属性值 | 描述 |
|--------|------|
| `row`（默认） | 主轴从左到右 |
| `row-reverse` | 主轴从右到左 |
| `column` | 主轴从上到下 |
| `column-reverse` | 主轴从下到上 |

```css
.container {
  flex-direction: row;          /* 默认 */
  flex-direction: row-reverse;  /* 反向水平 */
  flex-direction: column;         /* 垂直 */
  flex-direction: column-reverse; /* 反向垂直 */
}
```

### 2.2 flex-wrap — 换行方式

| 属性值 | 描述 |
|--------|------|
| `nowrap`（默认） | 不换行，项目压缩适应容器 |
| `wrap` | 换行，第一行在上 |
| `wrap-reverse` | 换行，第一行在下 |

```css
/* 不换行（默认）：项目会被压缩 */
.container {
  display: flex;
  flex-wrap: nowrap;
}

/* 换行 */
.container {
  display: flex;
  flex-wrap: wrap;
}
```

### 2.3 flex-flow — 方向 + 换行缩写

```css
/* flex-flow: <flex-direction> <flex-wrap> */
.container {
  flex-flow: row wrap;         /* 水平换行 */
  flex-flow: column nowrap;     /* 垂直不换行 */
  flex-flow: row wrap-reverse; /* 反向换行 */
}
```

### 2.4 justify-content — 主轴对齐

控制**主轴方向**上的对齐方式：

| 属性值 | 描述 |
|--------|------|
| `flex-start`（默认） | 靠主轴起点 |
| `flex-end` | 靠主轴终点 |
| `center` | 居中 |
| `space-between` | 两端对齐，项目间距相等 |
| `space-around` | 项目两侧间距相等（项目间距离是边缘的2倍） |
| `space-evenly` | 所有间距完全相等 |
| `stretch` | 项目拉伸填充（需项目无固定尺寸） |

```css
.container {
  justify-content: flex-start;    /* 默认：靠左 */
  justify-content: center;         /* 居中 */
  justify-content: space-between; /* 两端对齐 */
  justify-content: space-around;  /* 环绕对齐 */
  justify-content: space-evenly; /* 均分布局 */
}
```

**效果对比（flex-direction: row）**：

```
flex-start:    [item1][item2][item3]        ----|
center:              [item1][item2][item3]  ----|
space-between:  [item1]    [item2]    [item3]  ----|
space-around:    [item1]   [item2]   [item3]  ----|
space-evenly:   [item1]  [item2]  [item3]  ----|
```

### 2.5 align-items — 交叉轴对齐（单行）

控制**交叉轴方向**上所有项目对齐：

| 属性值 | 描述 |
|--------|------|
| `stretch`（默认） | 拉伸填满交叉轴（需项目无固定尺寸） |
| `flex-start` | 靠交叉轴起点 |
| `flex-end` | 靠交叉轴终点 |
| `center` | 居中 |
| `baseline` | 按项目文字基线对齐 |

```css
.container {
  align-items: stretch;     /* 默认：拉伸 */
  align-items: flex-start;   /* 靠顶部 */
  align-items: flex-end;     /* 靠底部 */
  align-items: center;       /* 垂直居中 */
  align-items: baseline;    /* 基线对齐 */
}
```

### 2.6 align-content — 交叉轴对齐（多行）

**仅在 `flex-wrap: wrap` 且有多行时生效**，控制多行整体在交叉轴上的分布：

| 属性值 | 描述 |
|--------|------|
| `stretch`（默认） | 拉伸占满 |
| `flex-start` | 靠交叉轴起点 |
| `flex-end` | 靠交叉轴终点 |
| `center` | 居中 |
| `space-between` | 两端对齐 |
| `space-around` | 环绕对齐 |
| `space-evenly` | 均分布局 |

```css
.container {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;    /* 多行靠上 */
  align-content: space-between; /* 两端对齐 */
}
```

### 2.7 gap — 项目间距

```css
.container {
  display: flex;
  gap: 16px;           /* 行和列间距相同 */
  gap: 10px 20px;      /* 行间距 10px，列间距 20px */
  row-gap: 10px;       /* 仅行间距 */
  column-gap: 20px;    /* 仅列间距 */
}
```

**注意**：`gap` 不会在项目外侧产生间距（边缘与容器之间）。

---

## 3. 项目属性

### 3.1 flex-grow — 放大比例

定义项目在**主轴方向**上放大填补空余空间的能力：

| 值 | 描述 |
|----|------|
| `0`（默认） | 不放大 |
| 正数 | 按比例分配剩余空间 |

```css
.item {
  flex-grow: 0;   /* 默认：不放大 */
  flex-grow: 1;   /* 放大占满 */
  flex-grow: 2;   /* 2倍于其他项目 */
}

/* 例子：三列均分 */
.flex-container {
  display: flex;
}

.flex-item {
  flex-grow: 1;  /* 每个项目等比放大 */
}
```

**剩余空间分配示例**：

```
容器宽度: 900px
项目1: 200px, flex-grow: 1
项目2: 200px, flex-grow: 2
项目3: 200px, flex-grow: 1

剩余空间: 900 - 600 = 300px
分配: 1 + 2 + 1 = 4 份
每份: 300 / 4 = 75px

最终:
项目1: 200 + 75 = 275px
项目2: 200 + 150 = 350px
项目3: 200 + 75 = 275px
```

### 3.2 flex-shrink — 缩小比例

定义项目在空间不足时**缩小**的能力：

| 值 | 描述 |
|----|------|
| `1`（默认） | 空间不足时等比缩小 |
| `0` | 不缩小（保持固定尺寸） |
| 正数 | 数值越大，缩小越多 |

```css
.item {
  flex-shrink: 1;   /* 默认：可缩小 */
  flex-shrink: 0;   /* 不缩小，最小宽度会溢出 */
  flex-shrink: 2;   /* 缩小优先级是其他项目的2倍 */
}

/* 固定宽度 + 不压缩 */
.fixed-item {
  flex-shrink: 0;
  width: 200px;
}
```

### 3.3 flex-basis — 初始尺寸

定义项目在**分配多余空间前**的初始大小：

| 值 | 描述 |
|----|------|
| `auto`（默认） | 项目自身宽度（width） |
| 长度值 | 如 `100px`、`20%`、`calc(50% - 10px)` |

```css
.item {
  flex-basis: auto;    /* 默认：按 width */
  flex-basis: 200px;   /* 固定 200px */
  flex-basis: 33.33%; /* 33% 容器宽度 */
}
```

### 3.4 flex — 缩写

```css
/* flex: <flex-grow> <flex-shrink> <flex-basis> */
.item {
  flex: 0 1 auto;      /* 完整语法（各值默认） */
  flex: 1;             /* flex: 1 1 0% */
  flex: 2;             /* flex: 2 1 0% */
  flex: auto;          /* flex: 1 1 auto */
  flex: none;          /* flex: 0 0 auto */
  flex: 0 0 200px;     /* 固定 200px */
}
```

| 缩写 | 展开 |
|------|------|
| `flex: 1` | `flex-grow: 1; flex-shrink: 1; flex-basis: 0%;` |
| `flex: auto` | `flex-grow: 1; flex-shrink: 1; flex-basis: auto;` |
| `flex: none` | `flex-grow: 0; flex-shrink: 0; flex-basis: auto;` |
| `flex: 0 0 200px` | `flex-grow: 0; flex-shrink: 0; flex-basis: 200px;` |

**推荐优先使用 `flex` 缩写**，避免复合属性分开写导致的意外行为。

### 3.5 align-self — 单项目交叉轴对齐

覆盖容器的 `align-items`，**单独设置某个项目**在交叉轴上的对齐：

| 属性值 | 描述 |
|--------|------|
| `auto`（默认） | 继承 `align-items` |
| `stretch` | 拉伸 |
| `flex-start` | 靠交叉轴起点 |
| `flex-end` | 靠交叉轴终点 |
| `center` | 居中 |
| `baseline` | 基线对齐 |

```css
.container {
  align-items: center; /* 默认垂直居中 */
}

.item-special {
  align-self: flex-end; /* 自己靠下 */
}
```

### 3.6 order — 排列顺序

控制项目在容器中的**视觉顺序**（不影响 DOM 顺序）：

| 值 | 描述 |
|----|------|
| `0`（默认） | 默认顺序 |
| 整数 | 数值越小排越前（可为负数） |

```css
.item {
  order: 0;   /* 默认 */
  order: 1;   /* 排后面 */
  order: -1;  /* 排前面 */
}

/* 典型用法：改变显示顺序 */
.first { order: -1; }   /* 视觉上排第一 */
.last { order: 1; }    /* 视觉上排最后 */
```

**注意**：应仅用于视觉顺序，不应用于非语义目的的排序（语义顺序应通过 HTML 实现）。

---

## 4. 常见场景

### 4.1 水平居中

```css
.container {
  display: flex;
  justify-content: center;
}
```

### 4.2 垂直居中

```css
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 或使用 margin:auto */
.item {
  margin: auto;
}
```

### 4.3 圣杯布局（Header + Sidebar + Main + Footer）

```css
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header { flex: 0 0 auto; }
.main {
  flex: 1;            /* 自动填充剩余空间 */
  display: flex;
}
.sidebar { flex: 0 0 250px; }
.content { flex: 1; }
.footer { flex: 0 0 auto; }
```

### 4.4 导航栏

```css
/* 品牌靠左，链接靠右 */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 24px;
}
```

### 4.5 卡片列表（自动换行均分）

```css
.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  flex: 1 1 300px;   /* 最小 300px，自动扩展填满 */
  max-width: 400px; /* 最大宽度 */
}
```

### 4.6 粘性 footer（页面总在最底）

```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main { flex: 1; }
footer { flex-shrink: 0; }
```

### 4.7 等高列

```css
.columns {
  display: flex;
}

.column {
  flex: 1; /* 默认 stretch，所有列等高 */
  padding: 16px;
}
```

### 4.8 表单布局

```css
.form-row {
  display: flex;
  gap: 16px;
  align-items: center;
}

.form-row label {
  flex: 0 0 100px;  /* 固定标签宽度 */
}

.form-row input {
  flex: 1;          /* 自动填充 */
}
```

---

## 5. 常见问题与技巧

### 5.1 项目不换行（溢出）

```css
.container {
  display: flex;
  flex-wrap: wrap; /* 加这一行 */
}

/* 或使用 min-width 防止过度压缩 */
.item {
  flex-shrink: 0;
  min-width: 200px;
}
```

### 5.2 单个项目靠右

```css
.container {
  display: flex;
}

.spacer { flex: 1; } /* 吸收所有剩余空间 */
.right-item { margin-left: auto; }
```

### 5.3 Flex 项目内文字省略

```css
.ellipsis-item {
  flex: 1;
  min-width: 0; /* 关键！允许 flex 项目收缩 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### 5.4 文字基线对齐

```css
.container {
  align-items: baseline;
}
```

### 5.5 Flex 与 `margin: auto`

```css
.item {
  margin-left: auto; /* 吸收右侧所有空间，自己靠右 */
}
```

### 5.6 百分比宽度问题

```css
/* 直接用 flex 代替百分比 */
.item {
  flex: 1; /* 而不是 width: 33.33% */
}
```

### 5.7 项目宽度 vs flex-basis vs width

优先级：**flex-basis > width > 内容宽度**

```css
/* 最终宽度计算 */
.item {
  flex-basis: 200px;  /* 优先级最高 */
  width: 100px;       /* 被 flex-basis 覆盖 */
}
```

### 5.8 与 Grid 的选择

| 场景 | 推荐 |
|------|------|
| 单行/单列布局 | Flexbox |
| 二维布局（行列同时控制） | Grid |
| 组件内部布局 | Flexbox |
| 页面整体布局 | Grid 或 Flexbox |
| 需要 `align-content`（多行分布） | Grid 或 Flexbox + wrap |
| 内容驱动的自适应 | Flexbox (`flex: 1`) |

### 5.9 浏览器兼容

Flexbox 支持情况良好：

| 特性 | 支持 |
|------|------|
| `display: flex` | IE 11+（部分前缀） |
| `gap` | 现代浏览器全支持 |
| `flex-grow/shrink/basis` | IE 11+ |

```css
/* IE 11 兼容 */
.container {
  display: -ms-flexbox;
  display: flex;
}
```

---

## 属性速查表

### 容器属性

| 属性 | 值 | 说明 |
|------|----|------|
| `display` | `flex` / `inline-flex` | 启用 Flexbox |
| `flex-direction` | `row` `row-reverse` `column` `column-reverse` | 主轴方向 |
| `flex-wrap` | `nowrap` `wrap` `wrap-reverse` | 换行方式 |
| `flex-flow` | `<direction> <wrap>` | 方向+换行缩写 |
| `justify-content` | `flex-start` `flex-end` `center` `space-between` `space-around` `space-evenly` | 主轴对齐 |
| `align-items` | `stretch` `flex-start` `flex-end` `center` `baseline` | 交叉轴对齐（单行） |
| `align-content` | `stretch` `flex-start` `flex-end` `center` `space-between` `space-around` | 交叉轴对齐（多行） |
| `gap` | `<row-gap> <col-gap>` | 项目间距 |

### 项目属性

| 属性 | 值 | 说明 |
|------|----|------|
| `flex-grow` | `0`（默认）/ 正数 | 放大比例 |
| `flex-shrink` | `1`（默认）/ 正数/`0` | 缩小比例 |
| `flex-basis` | `auto`（默认）/ 长度 | 初始尺寸 |
| `flex` | `<grow> <shrink> <basis>` | 缩写 |
| `align-self` | `auto` `stretch` `flex-start` `flex-end` `center` `baseline` | 单项目交叉轴对齐 |
| `order` | `0`（默认）/ 整数 | 排列顺序 |

---

## 总结

Flexbox 的核心思想是**弹性分配空间**：
- **容器**负责整体排列策略（方向、换行、对齐）
- **项目**负责自己如何适应剩余空间（放大、缩小、基准）

掌握 `flex: 1`（等分空间）和 `margin: auto`（占据剩余空间）两个技巧，能解决 80% 的常见布局需求。
