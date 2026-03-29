# CSS Box Alignment（盒子对齐）完全指南

> 本文档详细解析 CSS Box Alignment 模块，涵盖 Flexbox、Grid、Block 布局中的对齐规范，以及各布局系统间的对齐差异。

---

## 一、Box Alignment 模块概述

### 1.1 什么是 Box Alignment？

CSS Box Alignment 模块（CSS Alignment Properties）是 CSS 规范中定义**元素在容器内部对齐方式**的标准。它统一了 Flexbox、Grid、Block 三种布局模型的对齐属性，让开发者可以用一致的 API 控制对齐。

**核心设计思想：** 不同的布局系统（Flexbox、Grid、Block）共享一套对齐属性，但各属性在不同布局中的行为略有差异。

### 1.2 两轴体系

Box Alignment 基于两轴体系：

| 轴 | 别名 | 描述 |
|---|------|------|
| **主轴（Main Axis）** | justify axis | 元素排列方向的轴，由 `flex-direction` 决定 |
| **交叉轴（Cross Axis）** | align axis | 垂直于主轴的方向 |

```
Flexbox 主轴方向（flex-direction）：
  row        → 主轴水平（justify），交叉轴垂直（align）
  row-reverse → 主轴水平（justify），交叉轴垂直（align）
  column     → 主轴垂直（justify），交叉轴水平（align）
  column-reverse → 主轴垂直（justify），交叉轴水平（align）
```

### 1.3 与书写模式的关系

对齐属性与 CSS 书写模式（writing-mode）紧密相关：

- `start` / `end` 是逻辑值，会根据书写方向响应
- `left` / `right` 是物理值，始终对应物理左/右边

**推荐：** 在现代布局中优先使用 `start` / `end` / `self-start` / `self-end` 等逻辑值，以支持多语言场景。

---

## 二、核心属性详解

### 2.1 属性一览表

| 属性 | 作用对象 | 控制方向 | 适用布局 |
|------|---------|---------|---------|
| `justify-content` | 容器 | 主轴对齐 | Flexbox、Grid |
| `align-items` | 容器 | 交叉轴对齐 | Flexbox、Grid |
| `align-content` | 容器 | 多行/多列整体对齐 | Flexbox、Grid |
| `justify-items` | 容器 | 网格项主轴对齐 | Grid |
| `justify-self` | 网格项 | 自身主轴对齐 | Block、Grid |
| `align-self` | 网格项/flex项 | 自身交叉轴对齐 | Block、Flexbox、Grid |
| `place-items` | 容器 | 两轴同时对齐（简写） | Flexbox、Grid |
| `place-self` | 网格项 | 两轴同时对齐（简写） | Block、Grid |
| `place-content` | 容器 | 两轴同时对齐（简写） | Flexbox、Grid |

### 2.2 容器侧属性

#### justify-content（主轴对齐）

定义**主轴方向**上所有元素的对齐方式。

```css
.container {
  display: flex;
  justify-content: flex-start; /* 默认值 */
}
```

**可选值：**

| 值 | 行为 |
|---|------|
| `flex-start` / `start` | 元素向主轴起点对齐 |
| `flex-end` / `end` | 元素向主轴终点对齐 |
| `center` | 元素在主轴方向居中 |
| `space-between` | 元素之间均匀分布，首尾贴边 |
| `space-around` | 元素之间均匀分布，首尾间距为元素间距的一半 |
| `space-evenly` | 元素之间、首尾间距完全相等 |
| `stretch` | 元素拉伸填满容器（仅在未设置主尺寸时生效） |

#### align-items（交叉轴对齐）

定义**交叉轴方向**上所有元素的对齐方式。

```css
.container {
  display: flex;
  align-items: stretch; /* 默认值 */
}
```

**可选值：**

| 值 | 行为 |
|---|------|
| `stretch` | 元素拉伸填满交叉轴（默认值） |
| `flex-start` / `start` | 元素向交叉轴起点对齐 |
| `flex-end` / `end` | 元素向交叉轴终点对齐 |
| `center` | 元素在交叉轴方向居中 |
| `baseline` | 元素按基线对齐 |

#### align-content（多行对齐）

定义**多行/多列**在交叉轴上的整体对齐方式。仅在容器有多行/多列时生效。

```css
.container {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
```

**可选值：** 与 `justify-content` 相同。

#### justify-items（Grid 主轴对齐）

定义 Grid 容器中**所有网格项**在主轴方向上的默认对齐方式。

```css
.container {
  display: grid;
  justify-items: stretch; /* 默认值 */
}
```

### 2.3 元素侧属性

#### align-self（自身交叉轴对齐）

定义**单个元素**在交叉轴方向的对齐方式，会覆盖 `align-items` 的设置。

```css
.item {
  align-self: center;
}
```

#### justify-self（自身主轴对齐）

定义**单个元素**在主轴方向的对齐方式。在 Flexbox 中不生效（Flex 项目的尺寸由 `flex` 属性决定）。

```css
.item {
  justify-self: center;
}
```

### 2.4 简写属性

#### place-items

同时设置 `align-items` 和 `justify-items`。

```css
/* 两个值：<align-items> <justify-items> */
place-items: center stretch;

/* 一个值：两轴相同 */
place-items: center;
```

#### place-self

同时设置 `align-self` 和 `justify-self`。

```css
/* 两个值：<align-self> <justify-self> */
place-self: center end;

/* 一个值：两轴相同 */
place-self: center;
```

#### place-content

同时设置 `align-content` 和 `justify-content`。

```css
place-content: space-between center;
```

---

## 三、各布局系统中的对齐

### 3.1 Block 布局（Block Layout）

Block 布局是默认的文档流布局。对齐属性支持有限：

| 属性 | 支持 | 说明 |
|------|------|------|
| `justify-self` | ✅ | 块级元素自身在父容器主轴方向对齐 |
| `align-self` | ✅ | 块级元素自身在父容器交叉轴方向对齐 |
| `justify-content` | ❌ | Block 布局中不支持 |
| `align-items` | ❌ | Block 布局中不支持 |

```css
.block-container {
  display: block;
}
.block-item {
  justify-self: center;  /* 自身水平居中 */
  align-self: center;     /* 自身垂直居中（需要父容器有高度） */
}
```

**重要：** Block 布局的 `justify-self` / `align-self` 仅在父容器设置了具体尺寸（高度）时才能看到明显效果。

### 3.2 Flexbox 布局

Flexbox 提供了最完整的对齐能力：

| 属性 | 支持 | 说明 |
|------|------|------|
| `justify-content` | ✅ | 主轴对齐 |
| `align-items` | ✅ | 交叉轴对齐 |
| `align-content` | ✅ | 多行整体对齐（需要 flex-wrap: wrap） |
| `justify-self` | ❌ | Flex 项目不支持 |
| `align-self` | ✅ | 单个项目交叉轴对齐 |
| `justify-items` | ❌ | Flexbox 不支持 |

#### Flexbox 对齐示例

```css
.flex-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between; /* 主轴：两端对齐 */
  align-items: center;             /* 交叉轴：垂直居中 */
  height: 300px;
  gap: 20px;
}

.flex-item {
  flex: 1;
}
```

### 3.3 Grid 布局

Grid 布局拥有最完整的对齐属性支持：

| 属性 | 支持 | 说明 |
|------|------|------|
| `justify-content` | ✅ | 网格轨道在容器主轴方向对齐 |
| `align-content` | ✅ | 网格轨道在容器交叉轴方向对齐 |
| `justify-items` | ✅ | 所有网格项默认主轴对齐 |
| `align-items` | ✅ | 所有网格项默认交叉轴对齐 |
| `justify-self` | ✅ | 单个网格项主轴对齐 |
| `align-self` | ✅ | 单个网格项交叉轴对齐 |

#### Grid 对齐示例

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-template-rows: repeat(2, 100px);
  justify-items: center;  /* 所有项水平居中 */
  align-items: center;    /* 所有项垂直居中 */
  height: 400px;
  gap: 10px;
}

.grid-item-special {
  justify-self: stretch;  /* 覆盖默认，居中 */
  align-self: end;         /* 单独设置为底部对齐 */
}
```

### 3.4 Table 布局

Table 布局的对齐支持非常有限：

| 属性 | 支持 | 说明 |
|------|------|------|
| `vertical-align` | ✅ | 单元格内容垂直对齐 |
| `text-align` | ✅ | 单元格内容水平对齐（文本对齐） |
| `justify-content` | ❌ | 不支持 |
| `align-items` | ❌ | 不支持 |

---

## 四、关键对齐值详解

### 4.1 stretch（拉伸）

- **默认值**：`align-items`、`justify-items`、`align-self`、`justify-self` 的默认值
- **行为**：元素在对应方向上拉伸至填满容器（受 max-width / max-height 约束）
- **注意**：设置元素的 width/height 后，stretch 会失效

```css
.flex-container {
  display: flex;
  height: 200px;
}

.flex-item {
  /* 默认：stretch，高度填满容器 */
  width: 100px; /* 设置后，stretch 失效 */
}
```

### 4.2 baseline 系列

用于使元素按**文本基线**对齐。

```css
.items {
  align-items: baseline; /* 所有项基线对齐 */
}

.item-special {
  align-self: last baseline; /* 使用末行基线 */
}
```

**典型场景：** 让不同大小的文字或带有不同装饰的元素底部对齐。

```
未设置 baseline：      设置 baseline：
┌────┐                 ┌────┐
│ 文 │  ← 文字      →   │ 文 │
│字A │                  │   │──┐  ← 其他元素基线对齐
└────┘                  │字A │  │
┌──┐                    └──┘──┘
│图 │                        ↑
标                         基线
```

### 4.3 逻辑值（Logical Values）

Box Alignment 规范引入了与物理方向无关的**逻辑值**：

| 逻辑值 | 物理对应（水平LTR） | 说明 |
|--------|------------------|------|
| `start` | `left` | 起点方向 |
| `end` | `right` | 终点方向 |
| `self-start` | 动态 | 元素自身的起点方向 |
| `self-end` | 动态 | 元素自身的终点方向 |
| `match-start` | `stretch` | 匹配起点方向拉伸 |
| `match-end` | `stretch` | 匹配终点方向拉伸 |

**推荐：** 在支持多语言（RTL阿拉伯语、垂直日语）的场景中使用逻辑值。

### 4.4 space-between / space-around / space-evenly

这三个值用于**分配元素之间的剩余空间**：

```
space-between：    space-around：     space-evenly：
┌──┐    ┌──┐      ┌─┐  ┌──┐  ┌─┐      ┌─┐ ┌──┐ ┌─┐
│  │    │  │      │ │  │  │  │ │      │ │ │  │ │ │
└──┘    └──┘      └─┘  └──┘  └─┘      └─┘ └──┘ └─┘
↑首尾贴边         ↑首尾间距=1/2中间   ↑间距全部相等
```

---

## 五、gap 属性

`gap` 属性用于设置**元素之间的间距**，是间距与对齐的组合工具。

### 5.1 语法

```css
.container {
  /* 单独设置 */
  gap: 10px;           /* 行间距和列间距相同 */
  row-gap: 10px;       /* 行间距 */
  column-gap: 20px;    /* 列间距 */

  /* 简写 */
  gap: 10px 20px;      /* <row-gap> <column-gap> */
}
```

### 5.2 支持的布局

| 布局 | gap 支持 |
|------|---------|
| Flexbox | ✅（需要 flex-wrap: wrap 或多行） |
| Grid | ✅（完全支持） |
| Multi-column | ✅ |
| Block（实验性） | ❌ |

### 5.3 gap 与对齐的关系

`gap` 设置的是**固定间距**，而 `justify-content` / `align-content` 用于分配**剩余空间**。两者可以组合使用：

```css
.flex-container {
  display: flex;
  justify-content: space-between; /* 分配剩余空间 */
  gap: 20px;                      /* 额外固定间距 */
}
```

---

## 六、实战场景

### 场景一：Flexbox 水平垂直居中

```css
.center-container {
  display: flex;
  justify-content: center;  /* 水平居中 */
  align-items: center;      /* 垂直居中 */
  height: 100vh;
}
```

### 场景二：Grid 快速居中

```css
.center-container {
  display: grid;
  place-items: center;  /* 等价于 align-items: center; justify-items: center; */
  height: 100vh;
}
```

### 场景三：Flex 项目最后一项右对齐

```css
.flex-container {
  display: flex;
}

.flex-spacer {
  flex: 1; /* 占据所有剩余空间 */
}

.right-item {
  margin-left: auto; /* 或使用 justify-content: flex-end 配合 flex-grow */
}
```

### 场景四：Grid 某些项独立对齐

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: start; /* 默认：顶部对齐 */
}

.featured-item {
  align-self: stretch; /* 拉伸占满高度 */
  justify-self: center;
}
```

### 场景五：多行 Flex 内容居中

```css
.flex-container {
  display: flex;
  flex-wrap: wrap;
  align-content: center; /* 多行整体垂直居中 */
  min-height: 400px;
}
```

---

## 七、浏览器兼容性

### 7.1 基础对齐属性

| 属性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| `justify-content` | 52+ | 20+ | 9+ | 12+ |
| `align-items` | 52+ | 20+ | 9+ | 12+ |
| `align-self` | 52+ | 20+ | 9+ | 12+ |
| `justify-self` | 57+ | 45+ | 11+ | 16+ |
| `align-content` | 52+ | 20+ | 9+ | 12+ |
| `gap` | 66+ | 61+ | 12+ | 16+ |

### 7.2 逻辑值

| 值 | Chrome | Firefox | Safari | Edge |
|---|--------|---------|--------|------|
| `start` / `end` | 57+ | 52+ | 11+ | 79+ |
| `self-start` / `self-end` | 57+ | 52+ | 12.1+ | 79+ |

**建议：** 使用 `caniuse.com` 实时查询兼容性。对于需要兼容旧版浏览器的项目，可以回退到物理值（`left` / `right`）。

---

## 八、常见问题

### Q1: `justify-content` 在单行 Flexbox 中不生效？

在单行 Flexbox（`flex-wrap: nowrap`，默认值）中，`justify-content` 控制元素在主轴上的分布。如果容器没有剩余空间（即所有 flex 项刚好填满），`justify-content` 不会产生视觉效果。

**解决方案：** 确保容器有剩余空间，或使用 `flex-grow` 分配空间。

### Q2: `align-items` 和 `align-content` 的区别？

| 属性 | 作用范围 | 生效条件 |
|------|---------|---------|
| `align-items` | 所有元素 | 始终生效 |
| `align-content` | 多行/多列整体 | 仅在有多行/多列时生效 |

### Q3: Grid 中 `justify-items` 和 `justify-self` 的关系？

- `justify-items` 是**容器级别**的默认设置，作用于所有网格项
- `justify-self` 是**元素级别**的设置，作用于单个网格项，优先级高于 `justify-items`

### Q4: `gap` 会影响 flex 容器末尾的间距吗？

**不会。** `gap` 只在元素之间生效，不在首尾元素与容器边缘之间添加间距。

---

## 九、相关规范

- [CSS Box Alignment Module Level 3](https://www.w3.org/TR/css-align-3/) — W3C 官方规范
- [CSS Flexible Box Layout Module Level 1](https://www.w3.org/TR/css-flexbox-1/) — Flexbox 规范
- [CSS Grid Layout Module Level 1](https://www.w3.org/TR/css-grid-1/) — Grid 规范

---

## 十、总结

Box Alignment 模块统一了 CSS 布局中的对齐 API：

| 维度 | 核心要点 |
|------|---------|
| **属性分层** | 容器侧（-items/-content） vs 元素侧（-self） |
| **两轴分工** | 主轴（justify-*） vs 交叉轴（align-*） |
| **布局差异** | Flexbox 主轴灵活，Grid 双轴完整，Block 仅支持 self 属性 |
| **推荐用法** | 优先使用逻辑值（start/end），Grid 使用 place-* 简写 |
| **gap vs 对齐** | gap 控制固定间距，对齐属性控制剩余空间分配 |
