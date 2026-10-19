# CSS 选择器转义 (Selector Escape)

## 概述

当元素的 ID 以数字开头时，`document.querySelector()` 无法直接使用 `#+id` 的方式选取元素。本文档详细解释这一问题的原因、解决方案及最佳实践。

## 问题描述

### CSS ID 选择器语法

在 CSS 中，`#` 符号是 ID 选择器的标识符，用于匹配 `id` 属性。例如：

```css
#myElement { color: red; }
#header { font-weight: bold; }
```

### 核心问题

**HTML 规范** 允许 ID 包含数字开头：

```html
<div id="1">第一行</div>
<div id="2">第二行</div>
<div id="3item">以数字开头但包含字母</div>
```

但 **CSS 选择器语法** 不允许 ID 选择器直接以数字开头：

```javascript
// ❌ 错误写法 - 会抛出 DOMException
document.querySelector('#1');

// ✅ 正确写法 - 使用 CSS 转义
document.querySelector('#\\31');

// ✅ 正确写法 - 使用 6 位十六进制转义
document.querySelector('#\\000031');

// ✅ 正确写法 - 使用 getElementById
document.getElementById('1');
```

### 错误演示

```javascript
// 在浏览器控制台执行以下代码会报错
try {
  document.querySelector('#1');
} catch (e) {
  console.error(e);
  // DOMException: '#1' is not a valid selector
}
```

## 解决方案

### 方案一：getElementById（推荐）

最简单直接的方式，绕过 CSS 选择器语法限制：

```javascript
// 获取 id 为 "1" 的元素
const element = document.getElementById('1');
console.log(element.textContent); // "第一行"

// 获取 id 为 "123" 的元素
const el123 = document.getElementById('123');
```

**优点**：
- 语法简单，代码易读
- 性能与 `querySelector` 相当
- 不需要了解转义规则

**缺点**：
- 只能获取单个元素
- 不能使用复杂选择器

### 方案二：CSS 转义

`querySelector` 支持 CSS 转义序列来匹配特殊字符。

#### 3 位十六进制转义

将数字转换为 3 位十六进制（不够前面补 0）：

```javascript
// 数字 1 → \31 (hex: 1 = 0x1, 补零后: 001 → 31)
document.querySelector('#\\31');

// 数字 2 → \32
document.querySelector('#\\32');

// 数字 12 → \31 32 (每个数字分别转义)
document.querySelector('#\\31\\32');

// 数字 123 → \31 32 33
document.querySelector('#\\31\\32\\33');
```

#### 6 位十六进制转义

更明确的方式，使用 6 位十六进制（不够前面补 0）：

```javascript
// 数字 1 → \000031
document.querySelector('#\\000031');

// 数字 2 → \000032
document.querySelector('#\\000032');

// 数字 12 → \000031 32
document.querySelector('#\\000031\\32');

// 数字 123 → \000031 32 33
document.querySelector('#\\000031\\32\\33');
```

#### 转义对照表

| 字符 | 3 位转义 | 6 位转义 |
|------|---------|---------|
| 0 | `\30` | `\000030` |
| 1 | `\31` | `\000031` |
| 2 | `\32` | `\000032` |
| 3 | `\33` | `\000033` |
| ... | ... | ... |
| 9 | `\39` | `\000039` |

### 方案三：属性选择器（间接方式）

使用属性选择器绕过 ID 选择器语法限制：

```javascript
// ⚠️ 注意：引号内是字面字符串，不是 CSS 选择器
document.querySelector('[id="1"]');
document.querySelector('[id="123"]');
```

**注意**：这种方式会匹配所有具有该 ID 属性的元素，而不是仅限于 ID 选择器（ID 在 HTML 中应该是唯一的）。

## 深入说明

### CSS 语法 vs HTML 规范

| 方面 | CSS 选择器语法 | HTML ID 属性 |
|------|--------------|-------------|
| 数字开头 | ❌ 不允许 | ✅ 允许 |
| 规范来源 | W3C CSS Selectors | W3C HTML |
| 特殊字符处理 | 需要转义 | 直接使用（部分除外） |

### 为什么 querySelector 受 CSS 语法限制？

`document.querySelector()` 和 `querySelectorAll()` 接受的是 **CSS 选择器字符串**，遵循 CSS 规范。这意味着：

1. 选择器字符串首先被解析为 CSS 语法
2. 未转义的数字开头会被视为无效选择器
3. 抛出 `DOMException: '#1' is not a valid selector`

### getElementById 为什么可以？

`getElementById()` 方法直接接受 **字符串参数**，不经过 CSS 选择器解析器：

1. 参数被直接用于在文档中查找元素
2. 遵循 HTML 规范，而非 CSS 选择器语法
3. 允许数字开头的 ID

### 转义规则详解

CSS 转义使用反斜杠 `\` 后跟十六进制数字：

```
\<hex>{1,6}
```

- **1-6 位**：可以是 1 到 6 个十六进制数字
- **分隔符**：6 位转义后需要空格或其他分隔符（除非后面是空格）
- **字符类别**：几乎所有 Unicode 字符都可以转义

**示例**：

```javascript
// 获取 id="a1" 的元素
document.querySelector('#a\\31');
// a → a (不变)
// 1 → \31

// 获取 id="1a" 的元素
document.querySelector('#\\31a');
// 1 → \31
// a → a (不变)

// 获取 id="-" 的元素
document.querySelector('#\\-');
```

## 常见场景

### 场景一：动态生成表格行 ID

```javascript
// 动态生成表格行
function createTable() {
  const rows = [
    { id: '1', name: '张三' },
    { id: '2', name: '李四' },
    { id: '3', name: '王五' }
  ];
  
  const tbody = document.getElementById('table-body');
  rows.forEach(row => {
    const tr = document.createElement('tr');
    tr.id = row.id;  // id = "1", "2", "3"
    tr.innerHTML = `<td>${row.id}</td><td>${row.name}</td>`;
    tbody.appendChild(tr);
  });
}

// ❌ 错误获取方式
// const firstRow = document.querySelector('#1'); // 报错！

// ✅ 正确获取方式 1：getElementById
const firstRow = document.getElementById('1');

// ✅ 正确获取方式 2：CSS 转义
const firstRow = document.querySelector('#\\31');

// ✅ 正确获取方式 3：属性选择器
const firstRow = document.querySelector('[id="1"]');
```

### 场景二：列表索引

```javascript
// 渲染列表，索引作为 ID 前缀（推荐）
const items = ['苹果', '香蕉', '橙子'];
items.forEach((item, index) => {
  const li = document.createElement('li');
  li.id = `item-${index + 1}`;  // id = "item-1", "item-2", "item-3"
  li.textContent = item;
  document.getElementById('list').appendChild(li);
});

// 获取时直接使用
const secondItem = document.getElementById('item-2'); // ✅ 无需转义
```

### 场景三：处理用户输入的 ID

```javascript
// 处理用户可能输入的各种 ID 格式
function findElement(inputId) {
  // 尝试直接获取（字母开头）
  let el = document.getElementById(inputId);
  if (el) return el;
  
  // 如果是数字开头的 ID
  if (/^\d/.test(inputId)) {
    // 方式 1：getElementById
    return document.getElementById(inputId);
    
    // 方式 2：转换为 CSS 转义
    // const escaped = inputId.split('').map(c => {
    //   if (c.charCodeAt(0) < 128) { // ASCII 范围
    //     return '\\' + c.charCodeAt(0).toString(16).padStart(2, '0');
    //   }
    //   return '\\' + c.charCodeAt(0).toString(16).padStart(4, '0');
    // }).join('');
    // return document.querySelector('#' + escaped);
  }
  
  return null;
}
```

## 最佳实践

### 1. 避免数字开头的 ID

```html
<!-- ❌ 不推荐 -->
<div id="1">...</div>
<div id="2">...</div>

<!-- ✅ 推荐 -->
<div id="item-1">...</div>
<div id="item-2">...</div>
```

### 2. 使用有意义的字母前缀

```html
<!-- ❌ 无意义前缀 -->
<div id="a1">用户信息</div>

<!-- ✅ 有意义前缀 -->
<div id="user-1">用户信息</div>
<div id="product-123">商品信息</div>
```

### 3. 统一 ID 命名规范

```javascript
// 推荐的 ID 格式
const idPrefix = {
  user: 'user-',
  product: 'product-',
  order: 'order-',
  row: 'row-'
};

// 生成 ID
function generateId(type, index) {
  return `${idPrefix[type]}${index}`;
}

// 使用
const userId = generateId('user', 1); // "user-1"
const element = document.getElementById(userId); // ✅
```

### 4. 封装工具函数

```javascript
// 选择器工具函数
const $ = {
  /**
   * 根据 ID 获取元素（支持数字开头）
   */
  byId(id) {
    return document.getElementById(id);
  },
  
  /**
   * 根据 CSS 选择器获取元素（支持特殊字符）
   */
  query(selector) {
    try {
      return document.querySelector(selector);
    } catch (e) {
      console.warn('无效选择器:', selector);
      return null;
    }
  },
  
  /**
   * 将任意字符串转换为有效的 CSS 选择器 ID
   */
  escapeId(id) {
    return id.replace(/[^\w-]/g, char => {
      const code = char.charCodeAt(0);
      if (code < 0xFFFF) {
        return '\\' + code.toString(16).toUpperCase() + ' ';
      }
      return '\\' + code.toString(16).toUpperCase() + ' ';
    });
  }
};

// 使用
const el = $.byId('1');                    // ✅
const escaped = $.escapeId('my-id');      // "my\\-id"
```

## 总结

| 场景 | 推荐方案 |
|------|---------|
| 新项目 | 使用字母前缀命名 ID，避免问题 |
| 已有数字开头 ID | `getElementById()` 是最简单可靠的方式 |
| 必须用 `querySelector` | 使用 CSS 转义（如 `#\\31`） |
| 动态生成选择器 | 属性选择器 `[id="值"]` 可作为备选 |

**记住**：`getElementById` 遵循 HTML 规范，`querySelector` 遵循 CSS 语法。当两者冲突时，优先使用 `getElementById`。
