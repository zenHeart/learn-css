# CSS 层叠上下文与组件可见性判断

> 本文详细介绍 CSS 层叠上下文（Stacking Context）机制，以及如何用 JavaScript 判断元素是否可见、是否被遮挡。

## 一、层叠上下文基础

### 1.1 什么是层叠上下文

层叠上下文（Stacking Context）是 HTML 文档中的一个三维概念。拥有相同层叠上下文的元素，在 z 轴上按照特定顺序层叠。

**根层叠上下文**：浏览器窗口对应的层叠上下文，由 `<html>` 元素创建。

### 1.2 层叠顺序（从低到高）

```
1. 层叠上下文根元素的 background 和 border
2. z-index < 0 的子元素
3. block 流式布局子元素（display: block）
4. float 子元素
5. inline/inline-block 子元素
6. z-index: auto / z-index: 0 的子元素
7. z-index > 0 的子元素
```

### 1.3 触发层叠上下文的条件

以下属性会创建新的层叠上下文：

| 属性 | 说明 |
|------|------|
| `position: fixed` / `position: absolute` + `z-index` | 定位元素 |
| `z-index` 不为 `auto` | 任何 z-index 生效的元素 |
| `opacity` < 1 | 透明元素 |
| `transform` ≠ `none` | 变换元素 |
| `filter` ≠ `none` | 滤镜元素 |
| `mix-blend-mode` ≠ `normal` | 混合模式 |
| `isolation` 为 `isolate` | 隔离属性 |
| `will-change` 触发组合层 | GPU 加速 |
| `position: sticky` | 粘性定位元素 |
| `contain` 为 `layout` / `paint` / `strict` | 布局包含 |

```css
/* 这些都会创建新的层叠上下文 */
.modal { opacity: 0.9; }
.banner { transform: scale(1); }
.card { filter: blur(1px); }
.container { isolation: isolate; }
```

---

## 二、z-index 与层叠上下文的关系

### 2.1 z-index 只在层叠上下文内有意义

z-index 只在同一层叠上下文内的元素之间比较才有意义。子元素的 z-index 再高，也无法超过父层叠上下文的边界。

**示例**：

```html
<div style="position: relative; z-index: 1;">   <!-- 层叠上下文 A -->
  <div style="position: absolute; z-index: 9999;">  <!-- 永远在层叠上下文 A 内 -->
    嵌套元素
  </div>
</div>

<div style="position: relative; z-index: 0;">
  元素 B（即使上面是 z-index: 9999，也在元素 B 之上）
</div>
```

### 2.2 常见误区

**误区 1**：`z-index` 越大越在上
```css
/* 父元素 z-index: 0，子元素 z-index: 9999 */
.parent { position: relative; z-index: 0; }
.child { position: absolute; z-index: 9999; }

/* 父元素的 z-index 决定了整个层叠顺序 */
```

**误区 2**：`position: static` 时 z-index 有效
```css
/* 只有 position 为 relative/absolute/fixed/sticky 时 z-index 才生效 */
.element {
  position: static;    /* z-index: 100 无效 */
  position: relative;  /* z-index: 100 有效 */
}
```

---

## 三、判断元素可见性

### 3.1 使用 getBoundingClientRect

```javascript
function isElementVisible(el) {
  const rect = el.getBoundingClientRect();
  const viewHeight = window.innerHeight;
  const viewWidth = window.innerWidth;
  
  // 检查元素是否有尺寸
  if (rect.width === 0 || rect.height === 0) return false;
  
  // 检查元素是否在视口内
  const inView = (
    rect.top < viewHeight &&
    rect.bottom > 0 &&
    rect.left < viewWidth &&
    rect.right > 0
  );
  
  return inView;
}
```

### 3.2 使用 element.checkVisibility()（现代 API）

```javascript
// 检查元素是否可见
if (element.checkVisibility()) {
  console.log('元素可见');
}

// 检查 CSS 属性影响
if (element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) {
  console.log('元素可见（考虑 opacity 和 visibility 属性）');
}
```

### 3.3 检查 CSS 样式属性

```javascript
function isStyleHidden(el) {
  const style = window.getComputedStyle(el);
  
  const isHidden = (
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    style.opacity === '0' ||
    style.visibility === 'collapse' ||
    (style.clipPath !== 'none' && style.clipPath !== 'inset(0)')
  );
  
  return isHidden;
}
```

---

## 四、判断元素是否被遮挡

### 4.1 使用 elementFromPoint

```javascript
function isElementObscured(el) {
  const rect = el.getBoundingClientRect();
  
  // 获取元素中心点
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // 检查中心点的元素
  const topElement = document.elementFromPoint(centerX, centerY);
  
  // 判断
  if (!topElement) return true;  // 无元素 = 被遮挡
  if (topElement === el) return false;  // 自己 = 可见
  if (el.contains(topElement)) return false;  // 包含顶部元素 = 可见
  
  return true;  // 被其他元素遮挡
}
```

### 4.2 完整遮挡检测

```javascript
function isFullyObscured(el) {
  const rect = el.getBoundingClientRect();
  const points = [
    { x: rect.left + 2, y: rect.top + 2 },           // 左上
    { x: rect.right - 2, y: rect.top + 2 },          // 右上
    { x: rect.left + 2, y: rect.bottom - 2 },        // 左下
    { x: rect.right - 2, y: rect.bottom - 2 },      // 右下
    { x: rect.left + rect.width / 2, y: rect.top + 2 },           // 上中
    { x: rect.left + rect.width / 2, y: rect.bottom - 2 },       // 下中
  ];
  
  for (const { x, y } of points) {
    const elementAtPoint = document.elementFromPoint(x, y);
    if (!elementAtPoint || elementAtNode === el || el.contains(elementAtPoint)) {
      return false;  // 至少有一个点没被完全遮挡
    }
  }
  
  return true;  // 所有点都被遮挡
}
```

---

## 五、层叠顺序计算方法

### 5.1 手动计算层叠顺序

```javascript
/**
 * 获取元素的层叠顺序值
 * 返回值越大，越靠前显示
 */
function getStackingOrder(el) {
  const style = window.getComputedStyle(el);
  const position = style.position;
  const zIndex = parseInt(style.zIndex, 10);
  
  // 基础分数
  let order = 0;
  
  // position 影响
  if (position === 'static') {
    order += 0;  // block 流式布局
  } else if (position === 'relative' || position === 'absolute' || position === 'fixed') {
    order += 50;  // 定位元素
  }
  
  // z-index 影响
  if (!isNaN(zIndex)) {
    if (zIndex < 0) {
      order += zIndex;  // 负数 z-index 可能比 block 还低
    } else {
      order += 1000 + zIndex;  // 正数 z-index 最高
    }
  }
  
  // 是否有父层叠上下文
  // 如果有，需要加上父层叠上下文的 z-index
  const parentStackingContext = getParentStackingContext(el);
  if (parentStackingContext) {
    order += getStackingOrder(parentStackingContext) * 10000;
  }
  
  return order;
}

function getParentStackingContext(el) {
  let parent = el.parentElement;
  while (parent) {
    const style = window.getComputedStyle(parent);
    if (
      style.position !== 'static' && !isNaN(parseInt(style.zIndex, 10)) ||
      parseFloat(style.opacity) < 1 ||
      style.transform !== 'none' ||
      style.filter !== 'none'
    ) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}
```

### 5.2 比较两个元素的层叠顺序

```javascript
function compareStackingOrder(el1, el2) {
  const order1 = getStackingOrder(el1);
  const order2 = getStackingOrder(el2);
  return order1 - order2;  // 正数 = el1 在上
}
```

---

## 六、Stacking Context 对组件可见性的影响

### 6.1 跨层叠上下文的行为

**子元素不能超越父元素的层叠边界**：

```html
<!-- 父元素 z-index: 1 -->
<div style="position: relative; z-index: 1; opacity: 0.9;">
  子元素 z-index: 9999
  <!-- 即使子元素 z-index 很高，也只能在父元素的层叠范围内 -->
</div>

<!-- 父元素 z-index: 0 -->
<div style="position: relative; z-index: 0;">
  <!-- 任何 z-index > 0 的元素都会在上面的 opacity: 0.9 元素之上 -->
</div>
```

### 6.2 常见问题场景

**场景 1：Modal 背后的按钮仍可点击**

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  z-index: 1001; /* 在 overlay 之上 */
}

.button-behind {
  position: relative;
  z-index: 999; /* 虽然高于 overlay，但仍低于 modal 的层叠上下文 */
}
```

**解决方案**：给 modal-overlay 所在的父容器设置合理的 z-index，确保在其内部的 z-index 都能正常工作。

**场景 2：Dropdown 被 Carousel 遮挡**

```css
.dropdown {
  position: absolute;
  z-index: 100; /* 在 Carousel 之下 */
}

.carousel {
  position: relative;
  z-index: 50;
}

/* 解决：让 dropdown 和 carousel 在同一个层叠上下文 */
.container {
  position: relative;
  z-index: 1; /* 共同父容器 */
}

.dropdown {
  z-index: 100; /* 现在能超过 carousel */
}

.carousel {
  z-index: 50;
}
```

---

## 七、调试工具推荐

### 7.1 Chrome DevTools Layers 面板

1. 打开 DevTools → More tools → Layers
2. 查看页面中所有层叠上下文
3. 显示每个层的 z-index、大小、组合原因

### 7.2 z-index 高亮插件

- **What Z-index?**：高亮页面中所有 z-index 值
- **CSS Stacking Contexts Inspector**：可视化层叠上下文

### 7.3 可视化脚本

```javascript
// 在控制台运行，标记所有层叠上下文
(function() {
  function highlightStackingContexts(el, depth = 0) {
    if (!el) return;
    
    const style = window.getComputedStyle(el);
    const position = style.position;
    const zIndex = style.zIndex;
    const opacity = style.opacity;
    
    const createsContext = 
      (position !== 'static' && zIndex !== 'auto') ||
      parseFloat(opacity) < 1 ||
      style.transform !== 'none' ||
      style.filter !== 'none';
    
    if (createsContext) {
      const color = `hsl(${(parseInt(zIndex) || 0) % 360}, 70%, 50%)`;
      el.style.outline = `3px solid ${color}`;
      el.setAttribute('data-z-index', zIndex);
      console.log(`${'  '.repeat(depth)}${el.tagName} z-index: ${zIndex}`);
    }
    
    Array.from(el.children).forEach(child => {
      highlightStackingContexts(child, depth + 1);
    });
  }
  
  highlightStackingContexts(document.body);
})();
```

---

## 八、常见问题

### Q1：为什么 z-index 很大的元素还是被遮挡？

**原因**：父元素没有创建更高的层叠上下文

```css
/* 错误示例 */
.parent {
  position: relative; /* 没有 z-index，不创建层叠上下文 */
}
.child {
  position: absolute;
  z-index: 9999;
}

/* 正确示例 */
.parent {
  position: relative;
  z-index: 1; /* 创建层叠上下文 */
}
.child {
  position: absolute;
  z-index: 9999;
}
```

### Q2：如何让一个元素在所有其他元素之上？

**方案 1**：使用足够大的 z-index
```css
.top-element {
  position: fixed; /* fixed 天然在普通流之上 */
  z-index: 2147483647; /* 最大值 */
}
```

**方案 2**：使用 `<dialog>` 元素
```javascript
const dialog = document.createElement('dialog');
dialog.showModal(); /* 自动获得最高层叠上下文 */
```

### Q3：transform: translateZ(0) 为什么会改变 z-index 行为？

**原因**：`transform` 会创建新的层叠上下文，子元素的 z-index 只在该上下文内有意义。

```css
.container {
  transform: translateZ(0); /* 创建新层叠上下文 */
}
.child {
  position: absolute;
  z-index: 9999; /* 只在 .container 内有效 */
}
```

---

## 九、总结

**判断组件可见性的完整流程**：

```
1. 检查 display: none / visibility: hidden / opacity: 0
       ↓
2. 检查元素尺寸（getBoundingClientRect 宽高 > 0）
       ↓
3. 检查元素是否在视口内
       ↓
4. 检查元素是否被其他元素遮挡（elementFromPoint）
       ↓
5. 检查层叠上下文（z-index 比较）
```

**关键原则**：

1. 子元素的 z-index 再高，也不能超越父层叠上下文的边界
2. 任何创建层叠上下文的属性都会影响子元素的层叠行为
3. 使用 `element.checkVisibility()` 可快速判断可见性
4. 调试时使用 Chrome DevTools Layers 面板查看层叠结构
