# Table 表格布局与固定行头方案

## 目录

1. [table/table-row/table-cell 基本用法](#1-tabletable-rowtable-cell-基本用法)
2. [固定行头实现方案](#2-固定行头实现方案)
3. [常见问题与最佳实践](#3-常见问题与最佳实践)

---

## 1. table/table-row/table-cell 基本用法

### 1.1 HTML 表格结构

HTML 表格由以下核心元素组成：

| 元素 | 作用 |
|------|------|
| `<table>` | 表格容器 |
| `<thead>` | 表头行组 |
| `<tbody>` | 表体行组 |
| `<tfoot>` | 表尾行组 |
| `<tr>` | 表格行 |
| `<th>` | 表头单元格 |
| `<td>` | 数据单元格 |

### 1.2 基本示例

```html
<table class="data-table">
  <thead>
    <tr>
      <th>姓名</th>
      <th>年龄</th>
      <th>部门</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>张三</td>
      <td>28</td>
      <td>前端组</td>
    </tr>
    <tr>
      <td>李四</td>
      <td>32</td>
      <td>后端组</td>
    </tr>
  </tbody>
</table>
```

### 1.3 CSS 表格布局属性

#### display 属性值

| 属性值 | 描述 |
|--------|------|
| `table` | 块级表格，表格前后产生换行符 |
| `inline-table` | 行内表格，表格前后不产生换行符 |
| `table-row` | 表格行 |
| `table-cell` | 表格单元格 |
| `table-column` | 表格列（仅影响列样式） |
| `table-column-group` | 表格列组 |
| `table-header-group` | 表头组（类似 `<thead>`） |
| `table-row-group` | 表行组（类似 `<tbody>`） |
| `table-footer-group` | 表尾组（类似 `<tfoot>`） |
| `table-caption` | 表格标题 |

#### 常用样式属性

```css
.data-table {
  width: 100%;
  border-collapse: collapse;       /* 合并边框 */
  border-spacing: 0;              /* 单元格间距 */
  table-layout: auto | fixed;     /* 表格布局算法 */
}

.data-table th,
.data-table td {
  padding: 8px 12px;
  border: 1px solid #ddd;
  text-align: left;
}

.data-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}
```

### 1.4 table-layout: fixed vs auto

| 特性 | `auto` | `fixed` |
|------|--------|---------|
| 列宽计算 | 根据内容 | 根据首行或设定的 width |
| 布局性能 | 较慢（需遍历所有内容） | 快（只需解析首行） |
| 适用场景 | 内容不固定 | 列宽固定的表格 |
| 单元格宽度 | 由内容决定 | 平等分配（除非设 width） |

```css
/* fixed 布局优势：渲染快，支持固定列宽 */
.data-table {
  table-layout: fixed;
  width: 100%;
}

.data-table th:nth-child(1) { width: 20%; }
.data-table th:nth-child(2) { width: 60%; }
.data-table th:nth-child(3) { width: 20%; }
```

### 1.5 单元格合并

```html
<!-- 横向合并 -->
<td colspan="2">跨两列</td>

<!-- 纵向合并 -->
<td rowspan="2">跨两行</td>
```

---

## 2. 固定行头实现方案

### 方案一：纯 CSS — `position: sticky`

最推荐的现代方案，浏览器支持良好（>= IE7 通过 polyfill）。

#### 固定表头

```css
.table-container {
  max-height: 400px;
  overflow-y: auto;
}

.data-table thead th {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f5f5f5;
}
```

#### 固定首列

```css
.table-container {
  overflow-x: auto;
}

.data-table td:first-child,
.data-table th:first-child {
  position: sticky;
  left: 0;
  z-index: 5;
  background-color: inherit; /* 需要 JS 同步背景色 */
}

.data-table thead th:first-child {
  z-index: 15; /* 表头优先 */
}
```

#### 同时固定表头 + 首列

```css
.table-container {
  max-height: 400px;
  overflow: auto;
}

.data-table thead th {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f5f5f5;
}

.data-table td:first-child,
.data-table th:first-child {
  position: sticky;
  left: 0;
  z-index: 5;
}

/* 表头首列交叉处要最高 */
.data-table thead th:first-child {
  z-index: 20;
}
```

**注意事项**：sticky 依赖 `overflow` 父容器生效，且边框颜色需要仔细处理。

### 方案二：双表结构（经典方案）

使用两个独立的表格，一个控制表头，一个控制表体，通过相同宽度实现对齐。

#### HTML 结构

```html
<div class="table-wrapper">
  <!-- 表头 -->
  <div class="table-header">
    <table>
      <thead>
        <tr>
          <th>姓名</th>
          <th>年龄</th>
          <th>部门</th>
        </tr>
      </thead>
    </table>
  </div>

  <!-- 表体 -->
  <div class="table-body">
    <table>
      <tbody>
        <tr>
          <td>张三</td>
          <td>28</td>
          <td>前端组</td>
        </tr>
        <!-- 更多行 -->
      </tbody>
    </table>
  </div>
</div>
```

#### CSS 样式

```css
.table-wrapper {
  position: relative;
}

.table-header,
.table-body {
  overflow: auto;
  max-height: 400px;
}

.table-header {
  overflow: hidden; /* 只显示表头滚动条 */
}

.table-header table,
.table-body table {
  table-layout: fixed;
  width: 100%;
}

.table-header {
  background: #f5f5f5;
}

/* 两表列宽必须一致 */
.table-header th,
.table-body td {
  padding: 8px 12px;
  border: 1px solid #ddd;
  width: 33.33%; /* 模拟三列 */
}
```

**缺点**：需 JS 同步两表宽度，列多时维护复杂。

### 方案三：JavaScript 动态计算（兼容性方案）

适用于需要兼容老旧浏览器的场景。

```javascript
function fixTableHeader(tableSelector, containerSelector) {
  const table = document.querySelector(tableSelector);
  const container = document.querySelector(containerSelector);
  
  // 复制表头到容器顶部
  const thead = table.querySelector('thead');
  const headerClone = thead.cloneNode(true);
  
  // 创建固定表头容器
  const fixedHeader = document.createElement('div');
  fixedHeader.className = 'fixed-thead';
  fixedHeader.appendChild(headerClone);
  container.insertBefore(fixedHeader, table);
  
  // 同步表头与表格宽度
  function syncWidth() {
    const originalCells = table.querySelectorAll('thead th');
    const cloneCells = fixedHeader.querySelectorAll('th');
    
    originalCells.forEach((cell, i) => {
      cloneCells[i].style.width = cell.offsetWidth + 'px';
    });
  }
  
  syncWidth();
  window.addEventListener('resize', syncWidth);
}
```

### 方案四：CSS Grid + JS 混合方案

利用 Grid 布局实现更灵活的固定效果：

```css
.table-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 列数 */
  max-height: 400px;
  overflow-y: auto;
}

.grid-cell {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: #fff;
}

.grid-header {
  position: sticky;
  top: 0;
  background: #f5f5f5;
  font-weight: bold;
  z-index: 1;
}
```

---

## 3. 常见问题与最佳实践

### 3.1 边框问题

```css
/* 合并边框 */
table { border-collapse: collapse; }

/* 消除单元格间隙 */
table { border-spacing: 0; }
```

### 3.2 文字溢出

```css
td {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 允许换行 */
td {
  white-space: normal;
  word-break: break-word;
}
```

### 3.3 行高亮（斑马纹）

```css
tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

tbody tr:hover {
  background-color: #f0f0f0;
}
```

### 3.4 响应式表格

```css
/* 水平滚动 */
.table-container {
  overflow-x: auto;
}

/* 小屏幕转卡片布局 */
@media (max-width: 600px) {
  table, thead, tbody, tr, th, td {
    display: block;
  }
  
  thead { display: none; }
  
  tr {
    margin-bottom: 1rem;
    border: 1px solid #ddd;
  }
  
  td {
    padding-left: 40%;
    position: relative;
  }
  
  td::before {
    content: attr(data-label);
    position: absolute;
    left: 8px;
    font-weight: bold;
  }
}
```

配合 HTML：
```html
<td data-label="姓名">张三</td>
```

### 3.5 大表格性能

| 优化手段 | 说明 |
|----------|------|
| `table-layout: fixed` | 快速渲染 |
| 虚拟滚动 | 大量数据时按需渲染 |
| 懒加载 | 分页加载数据 |
| CSS `will-change` | 优化 sticky 性能 |

```css
.data-table {
  table-layout: fixed;
}

.data-table thead th {
  will-change: transform;
}
```

### 3.6 打印样式

```css
@media print {
  .table-container {
    overflow: visible;
    max-height: none;
  }
  
  .data-table {
    page-break-inside: avoid;
  }
}
```

---

## 总结

| 方案 | 优点 | 缺点 | 推荐场景 |
|------|------|------|----------|
| `position: sticky` | 纯 CSS、性能好 | 需处理边框 | 现代浏览器首选 |
| 双表结构 | 兼容性好 | 维护复杂 | 老旧浏览器 |
| JS 动态固定 | 完全可控 | 依赖 JS | 复杂定制场景 |
| Grid 布局 | 灵活 | 需手动管理 | 创新布局 |

**优先推荐**：纯 CSS `position: sticky` 方案，简单可靠，配合 `border-collapse: collapse` 解决边框问题即可满足大多数场景。
