# CSS Columns 多列布局

> 本文详细介绍 CSS Multi-column Layout（多列布局）模块，核心属性 `columns`、`column-count`、`column-width`，以及进阶用法 `column-span`、`column-fill`、`column-rule`。

## 一、Columns 是什么

CSS Columns 是 CSS2.1 之后引入的多列布局模块，用于将连续文本内容分布到多列中，类似于报纸、杂志的排版效果。

**与 Flexbox / Grid 的本质区别：**

| 特性 | Columns | Flexbox | Grid |
|------|---------|---------|------|
| 布局对象 | 连续文本流 | 独立 item | 独立 item |
| justify-content | ❌ 不生效 | ✅ | ✅ |
| align-content | ❌ 不生效 | ✅ | ✅ |
| 子元素关系 | 内容自动分栏 | 显式声明 | 显式声明 |
| 适用场景 | 文章分栏、瀑布流文字 | 导航、卡片列表 | 页面整体布局 |

**核心原则**：columns 不是把"一个个盒子"排成列，而是把**一段连续文本**切分成多列。

---

## 二、核心属性

### 2.1 columns（简写）

```css
/* 语法：columns: <column-width> <column-count> */
columns: 200px 3;      /* 列宽200px，最多3列 */
columns: 3;             /* 固定3列 */
columns: 200px;        /* 固定列宽200px，列数自适应 */
columns: auto auto;    /* 默认值 */
```

### 2.2 column-width

指定**最小**列宽。浏览器根据容器宽度自动计算列数。

```css
column-width: 200px;   /* 每列至少200px，尽可能多地分列 */
```

### 2.3 column-count

指定**最大**列数。

```css
column-count: 3;       /* 最多3列，内容足够多时会有留白 */
```

### 2.4 两者配合

```css
/* 语义：列宽200px~300px之间，列数不超过3列 */
columns: 300px 3;      
/* 等价于 */
column-width: 300px;
column-count: 3;
```

---

## 三、列间距与分割线

### 3.1 column-gap

```css
column-gap: 20px;      /* 列间距，默认 normal（约1em） */
```

### 3.2 column-rule

分割线样式，语法类似 `border`：

```css
column-rule: 1px solid #333;
column-rule: 2px dashed red;
column-rule-width: 1px;
column-rule-style: solid;
column-rule-color: #333;
```

---

## 四、column-span（跨列）

让子元素跨越所有列，类似 Flexbox/Grid 中的 `span` 能力。

```css
h1 {
  column-span: all;    /* 跨越所有列，作为分隔标题 */
}
```

**注意**：`column-span` 只支持 `all` 或 `none`，不支持指定跨越列数（如 `span 2`）。

---

## 五、column-fill（列填充）

控制列高度如何分配内容：

| 值 | 行为 |
|----|------|
| `balance`（默认） | 浏览器尽可能让各列高度接近 |
| `auto` | 按顺序填满第一列，再填第二列（类似报纸） |

```css
columns: 3;
column-fill: balance;  /* 各列高度均衡（默认） */
column-fill: auto;     /* 先填满第一列，内容溢出会换列 */
```

**高度陷阱**：当容器有固定高度时，`auto` 模式会让内容从左到右、从上到下填满各列；`balance` 则尽量均分。

---

## 六、Columns vs Flexbox vs Grid 场景对比

```
场景选择决策树：

需要将一段文字分栏排版？
  YES → Columns（报纸/杂志效果）

需要将独立元素排列成行/列？
  │
  ├── 一维排列（单行或单列）→ Flexbox
  └── 二维排列（行+列）→ Grid

需要内容等高自适应？
  ├── Columns → 各列高度自动均衡（balance）
  ├── Flexbox → align-items: stretch（默认）
  └── Grid → 默认等高
```

**典型场景：**

| 场景 | 推荐方案 | 原因 |
|------|----------|------|
| 文章正文分栏 | Columns | 内容是连续文本，不可拆分 item |
| 导航栏 | Flexbox | 一维排列，justify-content 即可 |
| 相册网格 | Grid | 二维精确控制 |
| 瀑布流文字墙 | Columns + column-fill: auto | 自然流式分布 |
| 侧边栏+主内容 | Flexbox 或 Grid | 独立区块 |
| 全屏九宫格 | Grid | 精确行、列控制 |

---

## 七、实战技巧

### 7.1 避免列内元素被截断

```css
/* 子元素设置 break-inside 防止被截断 */
.item {
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
}
```

### 7.2 列表项多列布局

```css
ul {
  columns: 3;
  list-style: none;
}
li {
  break-inside: avoid;
}
```

### 7.3 配合媒体查询响应式

```css
.article {
  columns: 2;
}
@media (max-width: 600px) {
  .article {
    columns: 1;  /* 移动端单列 */
  }
}
```

### 7.4 列对齐不能用 justify-content

columns 不是弹性盒子，以下代码**无效**：

```css
/* ❌ 不生效 */
.container {
  columns: 3;
  justify-content: center;
  align-content: center;
}

/* ✅ 列内文本对齐用 text-align */
.container {
  columns: 3;
  text-align: center;  /* 列内文本居中 */
}
```

---

## 八、浏览器兼容

所有主流浏览器均已支持 Multi-column Layout，无需前缀。

```
Chrome  50+  Firefox 52+  Safari 9+  Edge 12+  Opera 37+
```

---

## 九、属性速查表

| 属性 | 说明 | 值 |
|------|------|-----|
| `columns` | 简写 | `<column-width> <column-count>` |
| `column-width` | 最小列宽 | `auto` / `<length>` |
| `column-count` | 最大列数 | `auto` / `<integer>` |
| `column-gap` | 列间距 | `normal` / `<length>` |
| `column-rule` | 分割线 | `<width> <style> <color>` |
| `column-span` | 跨列 | `none` / `all` |
| `column-fill` | 填充方式 | `balance` / `auto` |
| `break-inside` | 防止元素内部分页/截断 | `avoid` / `auto` |

---

## 十、延伸阅读

- [CSS Multi-column Layout Module Level 1 - W3C](https://www.w3.org/TR/css-multicol-1/)
- [张鑫旭 - CSS columns与justify-content剖析](https://www.zhangxinxu.com/wordpress/2020/05/css-columns-justify-content/)
