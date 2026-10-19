# CSS Text Overflow 文本溢出详解

## 概述

文本溢出处理是前端开发中的常见需求。当文字内容超过容器宽度时，我们需要决定如何处理这些溢出的文字——是隐藏、换行还是显示省略号。CSS 提供了多个属性来精确控制文本溢出行为。

## 核心属性

### 1. overflow

控制内容溢出容器时的行为。

```css
.container {
  overflow: visible | hidden | scroll | auto | clip | hidden | scroll;
}
```

| 值 | 说明 |
|----|------|
| `visible` | 溢出内容可见（默认） |
| `hidden` | 溢出内容被裁剪 |
| `scroll` | 显示滚动条 |
| `auto` | 需要时显示滚动条 |

### 2. text-overflow

定义溢出文本的显示方式。

```css
.container {
  text-overflow: clip | ellipsis | <string>;
}
```

| 值 | 说明 |
|----|------|
| `clip` | 直接裁剪（默认） |
| `ellipsis` | 显示省略号（...） |
| `<string>` | 显示自定义字符串 |

### 3. white-space

控制空白字符的处理和换行行为。

```css
.container {
  white-space: normal | nowrap | pre | pre-wrap | pre-line | break-spaces;
}
```

| 值 | 说明 |
|------|------|
| `normal` | 合并空白，允许换行（默认） |
| `nowrap` | 合并空白，禁止换行 |
| `pre` | 保留空白，不允许换行 |
| `pre-wrap` | 保留空白，允许换行 |
| `pre-line` | 合并空白，允许换行 |
| `break-spaces` | 类似 pre-wrap，但行尾空格占用空间 |

### 4. word-wrap / overflow-wrap

控制长单词是否换行。

```css
.container {
  word-wrap: normal | break-word;  /* 旧语法 */
  overflow-wrap: normal | break-word;  /* 新语法 */
}
```

### 5. word-break

控制单词内换行规则。

```css
.container {
  word-break: normal | break-all | keep-all | break-word;
}
```

| 值 | 说明 |
|------|------|
| `normal` | 使用默认换行规则（默认） |
| `break-all` | 在任意字符间断行 |
| `keep-all` | 禁止在某些语言中标点处换行 |
| `break-word` | 长单词在必要时刻断换行 |

## 单行文本省略号

最常见的场景：文本超过一行时显示省略号。

```css
.single-line {
  /* 必要条件 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

```html
<div class="card">
  <p class="title">这是一段很长的文字内容，超过容器宽度时会显示省略号</p>
</div>

<style>
.card {
  width: 300px;
  padding: 16px;
  border: 1px solid #ccc;
}

.title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
```

## 多行文本省略号

### CSS 多行省略（仅 WebKit）

```css
.multi-line {
  display: -webkit-box;
  -webkit-line-clamp: 3;  /* 限制行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

```html
<div class="article">
  <p class="content">
    这是一段很长的文字内容，会在第三行末尾显示省略号。
    这是一段很长的文字内容，会在第三行末尾显示省略号。
    这是一段很长的文字内容，会在第三行末尾显示省略号。
    这是一段很长的文字内容，会在第三行末尾显示省略号。
  </p>
</div>

<style>
.article {
  width: 300px;
}

.content {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
```

### 多行省略号兼容方案

```css
.multi-line-ellipsis {
  position: relative;
  max-height: 4.5em;  /* line-height * 行数 */
  line-height: 1.5em;
  overflow: hidden;
}

.multi-line-ellipsis::after {
  content: "...";
  position: absolute;
  bottom: 0;
  right: 0;
  padding-left: 8px;
  background: linear-gradient(to right, transparent, white 50%);
}
```

## 自定义省略号内容

```css
.custom-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-overflow: ">>>";     /* Firefox 支持 */
  text-overflow: "..." ellipsis;
}
```

## 省略号与"查看更多"结合

```html
<div class="article">
  <p class="content">
    这是文章内容摘要区域，当文字超过三行时会显示省略号，
    并且在右下角显示"查看更多"的链接按钮...
  </p>
  <button class="expand-btn">查看更多</button>
</div>

<style>
.article {
  position: relative;
  width: 300px;
}

.content {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expand-btn {
  display: none;
  margin-top: 8px;
}

.article.expanded .content {
  -webkit-line-clamp: unset;
  overflow: visible;
}

.article.expanded .expand-btn {
  display: none;
}
</style>
```

## 表格单元格省略号

```html
<table class="data-table">
  <thead>
    <tr>
      <th class="col-id">ID</th>
      <th class="col-name">姓名</th>
      <th class="col-desc">描述</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>001</td>
      <td>张三</td>
      <td class="ellipsis">这是一个很长的描述文本，需要在单元格内显示省略号</td>
    </tr>
  </tbody>
</table>

<style>
.data-table {
  width: 100%;
  table-layout: fixed;  /* 关键：固定表格布局 */
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  border: 1px solid #ccc;
  padding: 8px;
}

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
```

## 固定宽度容器中的省略号

### 场景一：文字列表

```css
.nav-list {
  width: 200px;
}

.nav-item {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 8px;
  border-bottom: 1px solid #eee;
}
```

### 场景二：标签/徽章

```css
.tag {
  display: inline-block;
  max-width: 100px;
  padding: 4px 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background: #e0e0e0;
  border-radius: 4px;
}
```

## 溢出时显示完整内容

### hover 显示完整内容

```css
.hover-reveal {
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.hover-reveal:hover {
  overflow: visible;
  white-space: normal;
  word-break: break-all;
}
```

### title 属性提示

```html
<p class="ellipsis" title="完整的文字内容在这里显示">
  完整的文字内容在这里显示
</p>

<style>
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: help;
}
</style>
```

## 处理长单词和 URL

```css
.word-break-all {
  overflow-wrap: break-word;  /* 或 word-wrap: break-word */
  word-break: break-word;     /* 在单词中断行 */
  hyphens: auto;              /* 自动添加连字符 */
}
```

## 滚动显示溢出内容

```css
.scroll-container {
  overflow-x: auto;      /* 水平滚动 */
  overflow-y: hidden;    /* 垂直隐藏 */
  white-space: nowrap;   /* 禁止换行 */
  -webkit-overflow-scrolling: touch;  /* iOS 滚动优化 */
}

/* 滚动条样式 */
.scroll-container::-webkit-scrollbar {
  height: 8px;
}

.scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
```

## 响应式省略号

```css
.responsive-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .responsive-ellipsis {
    /* 小屏幕显示更多内容 */
    white-space: normal;
    text-overflow: clip;
  }
}
```

## 常见问题

### 问题 1：省略号不显示

```css
/* 检查清单： */
.ellipsis {
  overflow: hidden;           /* 1. 必须设置 overflow */
  white-space: nowrap;        /* 2. 必须设置 white-space */
  text-overflow: ellipsis;    /* 3. 设置 text-overflow */
  width: 200px;               /* 4. 确保容器有宽度 */
}
```

### 问题 2：flex 容器中的省略号失效

```css
.flex-container {
  display: flex;
}

.flex-item {
  flex: 1;
  min-width: 0;  /* 关键：flex 子元素需要设置 min-width: 0 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

### 问题 3：grid 容器中的省略号

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.grid-item {
  min-width: 0;  /* 关键：防止网格项撑破容器 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

### 问题 4：省略号与 padding 的冲突

```css
/* 方案一：使用 box-shadow 模拟内边距 */
.container {
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.container::after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 20px;  /* 右侧留白 */
  background: linear-gradient(to right, transparent, white);
}

/* 方案二：使用 padding + background */
.container {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-right: 20px;
  background: linear-gradient(to right, transparent 50%, white 100%);
}
```

## 浏览器支持

| 属性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| `overflow` | ✅ 1+ | ✅ 1+ | ✅ 1+ | ✅ 12+ |
| `text-overflow: ellipsis` | ✅ 1+ | ✅ 7+ | ✅ 1+ | ✅ 12+ |
| `text-overflow: <string>` | ❌ | ✅ 9+ | ❌ | ❌ |
| `-webkit-line-clamp` | ✅ 1+ | ❌ | ✅ 7+ | ✅ 17+ |
| `overflow-wrap` | ✅ 1+ | ✅ 3.5+ | ✅ 1+ | ✅ 12+ |

## 最佳实践

```css
/* 单行省略号标准写法 */
.single-line-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 多行省略号标准写法 */
.multi-line-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Flex 容器中的省略号 */
.flex-ellipsis {
  display: flex;
  min-width: 0;  /* 必须 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

## 参考资源

- [MDN text-overflow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-overflow)
- [MDN white-space](https://developer.mozilla.org/zh-CN/docs/Web/CSS/white-space)
- [CSS Tricks - text-overflow](https://css-tricks.com/almanac/properties/t/text-overflow/)
- [Line Clampin (WebKit)](https://webkit.org/blog/10298/introducing-the-line-clamp-property/)
