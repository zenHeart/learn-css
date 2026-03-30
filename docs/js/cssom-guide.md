# JavaScript CSS 操作方法详解

## 概述

CSSOM（CSS Object Model，CSS 对象模型）是 JavaScript 操作 CSS 样式的核心接口。与 `element.style` 直接操作行内样式不同，CSSOM 提供了获取计算样式、批量设置、属性级别操作等能力，是现代前端开发中不可或缺的技能。

本文档系统介绍所有 CSSOM 操作方法，涵盖行内样式操作、计算样式获取、元素尺寸测量等场景。

## 目录

- [1. element.style 行内样式操作](#1-elementstyle-行内样式操作)
  - [1.1 直接属性访问](#11-直接属性访问)
  - [1.2 cssText 批量设置](#12-csstext-批量设置)
  - [1.3 setProperty() 设置带优先级的属性](#13-setproperty-设置带优先级的属性)
  - [1.4 getPropertyValue() 获取属性值](#14-getpropertyvalue-获取属性值)
  - [1.5 removeProperty() 移除属性](#15-removeproperty-移除属性)
- [2. window.getComputedStyle() 获取计算样式](#2-windowgetcomputedstyle-获取计算样式)
- [3. element.getBoundingClientRect() 元素尺寸与位置](#3-elementgetboundingclientrect-元素尺寸与位置)
- [4. CSSStyleDeclaration 对象完整参考](#4-cssstyledeclaration-对象完整参考)
- [5. 实践指南与最佳实践](#5-实践指南与最佳实践)

---

## 1. element.style 行内样式操作

每个 HTML 元素都有一个 `style` 属性，返回该元素的行内样式对象（`CSSStyleDeclaration` 类型）。这个对象只能访问行内样式（`style` 属性中定义的样式），无法获取 `<style>` 标签或外部 CSS 文件中的样式。

### 1.1 直接属性访问

最直观的方式是通过点符号直接读写 CSS 属性。

**语法：**

```javascript
element.style.propertyName = value;
```

**驼峰命名法：** CSS 属性名中的连字符需要转换为驼峰命名：
- `background-color` → `backgroundColor`
- `font-size` → `fontSize`
- `border-left-width` → `borderLeftWidth`
- `margin-top` → `marginTop`

**示例：**

```javascript
const box = document.querySelector('.box');

// 读取行内样式
console.log(box.style.color);        // "red"
console.log(box.style.fontSize);    // "16px"

// 设置行内样式
box.style.color = 'blue';
box.style.fontSize = '20px';
box.style.backgroundColor = '#f0f0f0';
box.style.borderRadius = '8px';

// 设置多个属性
box.style.width = '200px';
box.style.height = '200px';
box.style.marginTop = '20px';
```

**注意事项：**

- 读取时返回**空字符串**（如果该属性未在行内样式中定义）
- 设置时会自动添加单位（对于数值会自动转为字符串）
- 优先级高于 CSS 选择器规则（但不高于 `!important`）

```javascript
const el = document.getElementById('myDiv');

// 未定义的属性返回空字符串
console.log(el.style.color); // ""

// 设置值
el.style.opacity = '0.5';
console.log(el.style.opacity); // "0.5"
```

### 1.2 cssText 批量设置

`cssText` 属性允许一次性读取或设置整个行内样式块内容。

**语法：**

```javascript
// 读取
const styles = element.style.cssText;

// 设置（会覆盖原有行内样式）
element.style.cssText = "color: red; font-size: 16px; background-color: #fff;";
```

**示例：**

```javascript
const box = document.querySelector('.box');

// 获取当前所有行内样式
console.log(box.style.cssText);
// 输出类似: "position: absolute; left: 100px; top: 50px;"

// 批量设置样式（覆盖原有）
box.style.cssText = `
  width: 300px;
  height: 200px;
  background-color: #3498db;
  color: white;
  border-radius: 12px;
  padding: 20px;
`;

// 追加样式（需要保留原有 cssText）
const currentStyles = box.style.cssText;
box.style.cssText = currentStyles + ' border: 2px solid #2c3e50;';
```

**⚠️ 重要注意事项：**

1. **完全覆盖**：`cssText` 设置时会**完全覆盖**元素原有的行内样式
2. **无返回值语义**：读取时返回完整的 CSS 字符串（包括分号）
3. **浏览器兼容性**：现代浏览器均支持，但在旧版 IE 中行为略有差异

```javascript
// ❌ 错误：覆盖了原有样式
box.style.cssText = "width: 100px;";
box.style.cssText = "height: 100px;"; // 宽度样式丢失！

// ✅ 正确：追加样式
box.style.cssText += "; height: 100px;"; // 注意分号分隔
```

### 1.3 setProperty() 设置带优先级的属性

`setProperty()` 方法允许精确设置 CSS 属性，包括是否添加 `!important` 优先级。

**语法：**

```javascript
element.style.setProperty(propertyName, value, priority);
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `propertyName` | string | CSS 属性名（可用连字符形式或驼峰形式） |
| `value` | string | 属性值 |
| `priority` | string | 可选，设为 `"important"` 添加 `!important` 优先级，或留空 `""` |

**示例：**

```javascript
const box = document.querySelector('.box');

// 普通设置
box.style.setProperty('color', 'red');

// 带 !important 优先级（最高优先级）
box.style.setProperty('display', 'none', 'important');

// 使用驼峰命名
box.style.setProperty('backgroundColor', '#3498db');
box.style.setProperty('fontSize', '18px');

// 设置多个属性
box.style.setProperty('width', '200px');
box.style.setProperty('height', '200px');
box.style.setProperty('margin', '10px 20px');
```

**与直接赋值的区别：**

```javascript
// 这两种写法效果相同：
element.style.setProperty('color', 'red');
element.style.color = 'red';

// 但 setProperty 可以设置优先级：
element.style.setProperty('color', 'red', 'important'); // 最高优先级
element.style.color = 'red'; // 普通优先级
```

### 1.4 getPropertyValue() 获取属性值

`getPropertyValue()` 用于精确获取某个 CSS 属性的值，返回字符串。

**语法：**

```javascript
const value = element.style.getPropertyValue(propertyName);
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `propertyName` | string | CSS 属性名（可用连字符形式或驼峰形式） |

**返回值：** 返回属性值的字符串，未设置则返回空字符串。

**示例：**

```javascript
const box = document.querySelector('.box');

// 假设元素行内样式为: style="color: red; font-size: 16px;"

// 使用连字符形式
console.log(box.style.getPropertyValue('color'));        // "red"
console.log(box.style.getPropertyValue('font-size'));    // "16px"

// 使用驼峰形式也可以
console.log(box.style.getPropertyValue('color'));        // "red"

// 未设置的属性返回空字符串
console.log(box.style.getPropertyValue('background-color')); // ""
```

**与直接属性访问对比：**

```javascript
// 这两种方式返回相同结果：
box.style.getPropertyValue('color')  // "red"
box.style.color                        // "red"

// 区别在于 getPropertyValue 需要传入字符串形式的属性名
// 直接访问需要驼峰命名
```

### 1.5 removeProperty() 移除属性

`removeProperty()` 用于移除行内样式中的某个 CSS 属性。

**语法：**

```javascript
const removedValue = element.style.removeProperty(propertyName);
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `propertyName` | string | 要移除的 CSS 属性名 |

**返回值：** 返回被移除的属性值（移除前的值）。

**示例：**

```javascript
const box = document.querySelector('.box');

// 假设元素有 style="color: red; font-size: 16px; background-color: blue;"

// 移除单个属性
const oldColor = box.style.removeProperty('color');
console.log(oldColor); // "red"
// 现在元素样式变为: style="font-size: 16px; background-color: blue;"

// 移除不存在的属性（安全操作）
box.style.removeProperty('border'); // 返回空字符串，不报错

// 移除后浏览器会使用默认/继承样式
box.style.removeProperty('background-color');
```

**应用场景：**

```javascript
// 动态主题切换
function setTheme(isDark) {
  const root = document.documentElement;
  if (isDark) {
    root.style.setProperty('--bg-color', '#1a1a1a');
    root.style.setProperty('--text-color', '#ffffff');
  } else {
    root.style.removeProperty('--bg-color');
    root.style.removeProperty('--text-color');
  }
}

// 动画结束后清除样式
element.addEventListener('transitionend', (e) => {
  if (e.propertyName === 'opacity') {
    element.style.removeProperty('transition');
    element.style.removeProperty('opacity');
  }
});
```

---

## 2. window.getComputedStyle() 获取计算样式

`getComputedStyle()` 返回元素**最终计算后**的样式，包括行内样式、CSS 选择器规则、`!important` 规则以及浏览器默认样式。

**语法：**

```javascript
const computedStyle = window.getComputedStyle(element, [pseudoElement]);
```

**参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| `element` | Element | 要获取计算样式的元素 |
| `pseudoElement` | string | 可选，伪元素选择器（如 `'::before'`、`'::after'`、`':hover'`） |

**返回值：** `CSSStyleDeclaration` 对象，包含所有计算后的 CSS 属性。

**示例：**

```javascript
const box = document.querySelector('.box');

// 获取计算样式
const styles = window.getComputedStyle(box);

// 读取计算后的值
console.log(styles.width);              // "200px"（可能经过计算）
console.log(styles.height);             // "100px"
console.log(styles.backgroundColor);    // "rgb(52, 152, 219)"（RGB格式）
console.log(styles.display);            // "block"
console.log(styles.fontSize);           // "16px"

// 获取伪元素样式
const stylesBefore = window.getComputedStyle(box, '::before');
console.log(stylesBefore.content);      // "\"\""
console.log(stylesBefore.display);      // "block"
```

**关键特点：**

1. **返回只读对象**：计算样式对象是只读的，不能直接修改
2. **返回值已计算**：
   - 相对单位（`em`、`rem`、`%`）会转换为绝对单位（`px`）
   - 颜色可能转换为 `rgb()` 或 `rgba()` 格式
   - 简写属性可能不会返回完整值

```javascript
const el = document.querySelector('.box');

// CSS: width: 50%; font-size: 2em; color: blue;
const styles = window.getComputedStyle(el);

console.log(styles.width);        // "400px"（计算后的像素值）
console.log(styles.fontSize);      // "32px"（假设根字体为16px）
console.log(styles.color);        // "rgb(0, 0, 255)"（蓝色转为RGB）
```

**与 element.style 的区别：**

| 特性 | `element.style` | `window.getComputedStyle()` |
|------|-----------------|----------------------------|
| 读取内容 | 仅行内样式 | 所有来源的样式 |
| 是否只读 | 可读写 | 只读 |
| 单位转换 | 保持原样 | 转换为绝对值 |
| 获取伪元素 | ❌ | ✅ |
| 返回值 | 原始字符串 | 计算后的值 |

```javascript
<div id="test" style="width: 50%;">内容</div>
<style>
#test { width: 25%; font-size: 20px; }
</style>

const el = document.getElementById('test');

console.log(el.style.width);                    // "50%"
console.log(window.getComputedStyle(el).width); // "400px"（假设视口800px）

console.log(el.style.fontSize);                 // ""（行内未定义）
console.log(window.getComputedStyle(el).fontSize); // "20px"
```

**常见应用场景：**

```javascript
// 1. 检测元素是否隐藏
function isHidden(el) {
  const styles = window.getComputedStyle(el);
  return styles.display === 'none' || styles.visibility === 'hidden';
}

// 2. 获取元素实际尺寸
function getElementSize(el) {
  const styles = window.getComputedStyle(el);
  return {
    width: parseFloat(styles.width),
    height: parseFloat(styles.height),
    padding: {
      top: parseFloat(styles.paddingTop),
      right: parseFloat(styles.paddingRight),
      bottom: parseFloat(styles.paddingBottom),
      left: parseFloat(styles.paddingLeft)
    }
  };
}

// 3. 获取动画/过渡的实际值
el.style.transition = 'all 0.3s ease';
const transitionDuration = window.getComputedStyle(el).transitionDuration;
console.log(transitionDuration); // "0.3s"
```

---

## 3. element.getBoundingClientRect() 元素尺寸与位置

`getBoundingClientRect()` 返回元素的大小及其相对于**视口（viewport）**的位置。

**语法：**

```javascript
const rect = element.getBoundingClientRect();
```

**返回值：** `DOMRect` 对象，包含以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| `x` / `left` | number | 元素左边框相对于视口左边的距离 |
| `y` / `top` | number | 元素上边框相对于视口顶边的距离 |
| `width` | number | 元素 border-box 的宽度（含边框） |
| `height` | number | 元素 border-box 的高度（含边框） |
| `right` | number | 元素右边框相对于视口左边的距离 |
| `bottom` | number | 元素下边框相对于视口顶边的距离 |

**示意图：**

```
视口 (viewport)
┌────────────────────────────────┐
│                                │
│    ┌─────────────────────┐     │
│    │       top           │     │
│    │  ┌───────────────┐  │     │
│    │ l│               │r│     │
│    │ e│    element    │i│     │
│    │ f│               │g│     │
│    │ t│               │h│     │
│    │  │               │t│     │
│    │  └───────────────┘  │     │
│    │       bottom        │     │
│    └─────────────────────┘     │
│          x, y (left, top)      │
└────────────────────────────────┘
```

**示例：**

```javascript
const box = document.querySelector('.box');
const rect = box.getBoundingClientRect();

// 获取位置
console.log(rect.top);    // 元素上边到视口上边的距离
console.log(rect.right);  // 元素右边到视口左边的距离
console.log(rect.bottom); // 元素下边到视口上边的距离
console.log(rect.left);   // 元素左边到视口左边的距离

// 获取尺寸
console.log(rect.width);  // 元素宽度（含边框）
console.log(rect.height); // 元素高度（含边框）

// x 和 y 是 left 和 top 的别名
console.log(rect.x);      // 等同于 rect.left
console.log(rect.y);      // 等同于 rect.top
```

**实用函数封装：**

```javascript
// 获取元素相对于文档的位置
function getElementDocumentPosition(el) {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    right: rect.right + window.scrollX,
    bottom: rect.bottom + window.scrollY
  };
}

// 获取元素相对于另一个元素的位置
function getRelativePosition(el, targetEl) {
  const elRect = el.getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();
  
  return {
    top: elRect.top - targetRect.top,
    left: elRect.left - targetRect.left,
    right: elRect.right - targetRect.right,
    bottom: elRect.bottom - targetRect.bottom
  };
}

// 检测元素是否在视口内
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// 检测两个元素是否重叠
function isOverlapping(el1, el2) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();
  
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}
```

**与 offsetWidth / offsetHeight 的对比：**

| 特性 | `getBoundingClientRect()` | `offsetWidth` / `offsetHeight` |
|------|---------------------------|-------------------------------|
| 返回类型 | DOMRect 对象 | 数值 |
| 包含内容 | width + height（含 border） | 数值（不含 margin） |
| 位置信息 | ✅ 包含 | ❌ 不包含 |
| 滚动影响 | 相对于视口 | 不受滚动影响 |
| 性能 | 稍慢（需创建对象） | 更快（直接属性访问） |

```javascript
const box = document.querySelector('.box');

// 两种方式都能获取尺寸
const rect = box.getBoundingClientRect();
console.log(rect.width);      // 包含 border
console.log(box.offsetWidth); // 包含 border，不包含 margin

// getBoundingClientRect 提供位置信息
console.log(rect.top);        // 距离视口顶部
console.log(box.offsetTop);   // 距离定位父元素顶部
```

**在动画和滚动中的应用：**

```javascript
// 懒加载：当元素进入视口时加载
function lazyLoad(element, callback) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });
  
  observer.observe(element);
}

// 平滑滚动到元素
function scrollToElement(el) {
  const rect = el.getBoundingClientRect();
  window.scrollTo({
    top: rect.top + window.scrollY - 100, // 留出偏移量
    behavior: 'smooth'
  });
}

// 拖拽实现
function enableDrag(el) {
  let offsetX, offsetY;
  
  el.addEventListener('mousedown', (e) => {
    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
  
  function onMouseMove(e) {
    el.style.position = 'fixed';
    el.style.left = (e.clientX - offsetX) + 'px';
    el.style.top = (e.clientY - offsetY) + 'px';
  }
  
  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
}
```

---

## 4. CSSStyleDeclaration 对象完整参考

`CSSStyleDeclaration` 是表示 CSS 声明块的对象，通过以下方式获取：

- `element.style` — 行内样式（可读写）
- `window.getComputedStyle(element)` — 计算样式（只读）
- `element.style.cssText` — 样式字符串

### 4.1 常用属性一览

| 属性/方法 | 类型 | 说明 | 示例 |
|-----------|------|------|------|
| `.cssText` | string | 整个样式声明块 | `"color: red; width: 100px;"` |
| `.length` | number | 声明块中的属性数量 | `3` |
| `.parentRule` | CSSRule | 关联的 CSS 规则 | 父级 CSSRule 对象 |

### 4.2 属性操作方法

| 方法 | 说明 | 返回值 |
|------|------|--------|
| `getPropertyValue(prop)` | 获取属性值 | string |
| `setProperty(prop, val, priority)` | 设置属性值 | void |
| `removeProperty(prop)` | 移除属性 | string |
| `getPropertyPriority(prop)` | 获取优先级 | string（`'important'` 或 `''`） |
| `item(index)` | 按索引获取属性名 | string |
| `[prop]` 或 `.prop` | 直接访问属性 | string |

### 4.3 遍历样式属性

```javascript
const box = document.querySelector('.box');
const styles = box.style;

// 方式1：for...of 遍历
for (const prop of styles) {
  console.log(`${prop}: ${styles.getPropertyValue(prop)}`);
}

// 方式2：使用 length 和 item()
for (let i = 0; i < styles.length; i++) {
  const prop = styles.item(i);
  console.log(`${prop}: ${styles.getPropertyValue(prop)}`);
}

// 方式3：Object.keys 遍历（需转换）
Object.keys(styles).forEach(key => {
  if (key.includes('-')) {
    console.log(`${key}: ${styles.getPropertyValue(key)}`);
  }
});
```

### 4.4 获取所有属性名（结合 computedStyle）

```javascript
function getAllStyleProperties(el) {
  const inlineStyles = el.style;
  const computedStyles = window.getComputedStyle(el);
  
  const properties = {};
  
  // 从行内样式获取
  for (let i = 0; i < inlineStyles.length; i++) {
    const prop = inlineStyles[i];
    properties[prop] = {
      inline: inlineStyles.getPropertyValue(prop),
      computed: computedStyles.getPropertyValue(prop)
    };
  }
  
  return properties;
}

// 使用
const props = getAllStyleProperties(document.querySelector('.box'));
console.log(props);
```

---

## 5. 实践指南与最佳实践

### 5.1 样式操作模式

**批量设置样式（性能优化）：**

```javascript
// ❌ 低效：每次都会触发重排/重绘
element.style.width = '100px';
element.style.height = '100px';
element.style.color = 'red';
element.style.backgroundColor = 'blue';

// ✅ 高效：使用 cssText 合并
element.style.cssText = `
  width: 100px;
  height: 100px;
  color: red;
  background-color: blue;
`;

// ✅ 高效：使用类切换
element.classList.add('active-state');

// ✅ 最高效：预先定义类，通过切换类改变样式
```

**使用 CSS 变量（自定义属性）：**

```javascript
// 设置 CSS 变量
document.documentElement.style.setProperty('--primary-color', '#3498db');

// 读取 CSS 变量
const color = getComputedStyle(document.documentElement)
  .getPropertyValue('--primary-color')
  .trim();
console.log(color); // "#3498db"

// 移除 CSS 变量
document.documentElement.style.removeProperty('--primary-color');
```

### 5.2 避免样式操作陷阱

**1. 使用类而不是直接操作样式：**

```javascript
// ❌ 直接操作样式难以维护
box.style.position = 'absolute';
box.style.left = '100px';
box.style.top = '50px';

// ✅ 更好的方式：使用类
.box-positioned {
  position: absolute;
  left: 100px;
  top: 50px;
}
// JS
box.classList.add('box-positioned');
```

**2. 注意单位：**

```javascript
// ❌ 忘记单位
element.style.width = 200; // 可能不生效

// ✅ 正确添加单位
element.style.width = '200px';
element.style.opacity = '0.5'; // opacity 不需要单位
element.style.flexGrow = '2';   // 数值属性可能需要字符串
```

**3. 处理带连字符的属性：**

```javascript
// ❌ 错误
element.style.font-size = '16px';

// ✅ 正确：驼峰命名
element.style.fontSize = '16px';

// ✅ 或者使用 setProperty
element.style.setProperty('font-size', '16px');
```

### 5.3 性能考量

**重排与重绘：**

```javascript
// ❌ 触发多次重排
for (let i = 0; i < 100; i++) {
  box.style.left = i + 'px'; // 每次都触发重排
}

// ✅ 一次性设置（触发一次重排）
box.style.transform = `translateX(${i}px)`; // 使用 transform 避免重排

// ✅ 使用 requestAnimationFrame
function animate() {
  i++;
  box.style.transform = `translateX(${i}px)`;
  requestAnimationFrame(animate);
}
```

**读取布局属性会强制重排：**

```javascript
// ❌ 读取触发重排
console.log(box.offsetWidth); // 强制重排
box.style.width = '200px';    // 又一次重排

// ✅ 先读后写，或使用 CSS 变量
const width = box.offsetWidth; // 读取
box.style.width = (width + 50) + 'px';

// ✅ 使用 CSS 变量避免重排
box.style.setProperty('--width', '250px'); // 仅重绘
```

### 5.4 完整示例：动态主题切换

```javascript
class ThemeManager {
  constructor() {
    this.cssVars = {};
  }
  
  setVariable(name, value) {
    document.documentElement.style.setProperty(name, value);
    this.cssVars[name] = value;
  }
  
  removeVariable(name) {
    document.documentElement.style.removeProperty(name);
    delete this.cssVars[name];
  }
  
  getVariable(name) {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }
  
  applyTheme(theme) {
    // 清除旧主题
    Object.keys(this.cssVars).forEach(key => {
      if (key.startsWith('--theme-')) {
        this.removeVariable(key);
      }
    });
    
    // 应用新主题
    Object.entries(theme).forEach(([key, value]) => {
      this.setVariable(`--theme-${key}`, value);
    });
  }
}

// 使用
const themeManager = new ThemeManager();

themeManager.applyTheme({
  'primary': '#3498db',
  'secondary': '#2ecc71',
  'text': '#2c3e50',
  'background': '#ecf0f1'
});

console.log(themeManager.getVariable('--theme-primary')); // "#3498db"
```

### 5.5 现代 Web API 推荐

**几何属性对比：**

| API | 用途 | 是否触发重排 |
|-----|------|-------------|
| `getBoundingClientRect()` | 位置与尺寸 | ❌（但某些浏览器可能） |
| `offsetLeft/Top` | 相对于 offsetParent | ✅ 触发 |
| `clientLeft/Top` | 边框宽度 | ❌ |
| `scrollLeft/Top` | 滚动位置 | ❌ |
| `getComputedStyle()` | 计算样式 | ❌（读取时） |

**ResizeObserver（监听尺寸变化）：**

```javascript
const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;
    console.log(`尺寸变化: ${width}x${height}`);
  }
});

observer.observe(document.querySelector('.box'));
```

---

## 总结

| 方法/属性 | 类型 | 用途 | 读写 |
|-----------|------|------|------|
| `element.style.prop` | 属性访问 | 读写行内样式 | 读写 |
| `element.style.cssText` | 字符串 | 批量读写行内样式 | 读写 |
| `element.style.setProperty()` | 方法 | 设置行内样式（可带优先级） | 写 |
| `element.style.getPropertyValue()` | 方法 | 获取行内样式值 | 读 |
| `element.style.removeProperty()` | 方法 | 移除行内样式 | 写 |
| `window.getComputedStyle()` | 方法 | 获取计算后样式 | 读 |
| `element.getBoundingClientRect()` | 方法 | 获取元素位置和尺寸 | 读 |

掌握这些 API，你就能在 JavaScript 中灵活、精确地操作 CSS，实现各种动态效果和交互功能。
