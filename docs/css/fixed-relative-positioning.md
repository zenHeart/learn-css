# CSS 固定定位：相对视图窗口 vs 相对元素

## 核心问题

> 如何实现一个元素既**相对视图窗口固定**（如 `position: fixed`），又**相对于某一元素定位**（如相对于父容器偏移）？

这看似矛盾，但有多种解决方案。

## Position 定位体系回顾

| 值 | 定位上下文 | 文档流 |
|----|-----------|--------|
| `static` | 正常文档流 | 保留 |
| `relative` | 自身原位置 | 保留 |
| `absolute` | 最近定位祖先 | 脱离 |
| `fixed` | 视口窗口 | 脱离 |
| `sticky` | 视口 + 滚动容器混合 | 保留 |

## 问题根源

`position: fixed` 的定位上下文是**视口**（viewport），而非父元素。这是 CSS 规范定义的行为。

```css
.parent {
  position: relative; /* 有用吗？*/
}
.child {
  position: fixed;
  top: 0; /* 相对于视口，不是 .parent */
}
```

无论 `.parent` 设置什么定位，`.child` 的 `fixed` 始终相对于视口定位。

## 解决方案

### 方案一：transform 欺骗法（推荐）

**原理**：transform 会创建新的包含块（Containing Block），使 `fixed` 相对于被 transform 的元素定位。

```css
.container {
  position: relative;
  transform: translate(0); /* 激活新的定位上下文 */
}
.fixed-element {
  position: fixed;
  top: 0;
  /* 现在相对于 .container 定位 */
}
```

**适用场景**：侧边栏固定、跟随按钮、浮层定位

### 方案二：absolute + JS 计算

**原理**：使用 `absolute` 定位，通过 JavaScript 动态计算相对于目标元素的位置。

```js
function positionFixedRelativeTo(element, target) {
  const rect = target.getBoundingClientRect();
  element.style.position = 'absolute';
  element.style.top = rect.top + 'px';
  element.style.left = rect.left + 'px';
}
```

**适用场景**：复杂交互、需要实时跟随

### 方案三：position: sticky（伪固定）

**原理**：在滚动容器内"粘"在某一位置，但会随容器滚动。

```css
.sticky-element {
  position: sticky;
  top: 10px;
}
```

**限制**：只在父容器滚动范围内有效，父容器滚出视口后不再固定。

### 方案四：JS + ResizeObserver 监听

**原理**：监听目标元素位置变化，实时更新 fixed 元素位置。

```js
const observer = new ResizeObserver(entries => {
  for (const entry of entries) {
    updatePosition(entry.target);
  }
});
observer.observe(targetElement);
```

## 实战场景

### 场景 1：相对父容器的固定浮层

```html
<div class="container">
  <button class="toggle">显示浮层</button>
  <div class="dropdown">下拉内容</div>
</div>
```

```css
.container {
  position: relative;
  transform: translate(0); /* 关键：创建新的包含块 */
}
.dropdown {
  position: fixed;
  top: 100%; /* 相对于 .container 的底部定位 */
  left: 0;
  /* 不受外部滚动影响 */
}
```

### 场景 2：固定在元素旁边的 Tooltip

```css
.wrapper {
  position: relative;
  transform: translate(0);
}
.tooltip {
  position: fixed;
  /* JS 动态设置 left/top 基于 wrapper 的位置 */
}
```

### 场景 3：吸顶但有边距

```css
.sticky-header {
  position: fixed;
  top: 20px; /* 距离视口顶部 20px */
  left: 50%;
  transform: translateX(-50%);
}
```

## 常见误区

### ❌ 误区 1：父元素设置 relative 就能影响 fixed

```css
/* 无效 */
.parent {
  position: relative;
}
.child {
  position: fixed;
  top: 20px; /* 仍然是相对于视口 */
}
```

### ❌ 误区 2：fixed 元素不需要考虑 z-index

实际上 fixed 元素会创建新的层叠上下文（Stacking Context），需要注意层叠顺序。

### ❌ 误区 3：transform 不影响 fixed

实际上 **transform 会影响 fixed**！这是 hack 的核心原理。

## 浏览器兼容性

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| transform 影响 fixed | ✅ | ✅ | ✅ | ✅ |
| position: sticky | ✅ | ✅ | ✅ | ✅ |
| CSS `anchor-positioning` | ✅ (实验) | ❌ | ❌ | ❌ |

## 决策树

```
需要固定定位?
├── 相对视口固定 → position: fixed
├── 相对父容器固定（无滚动）→ position: absolute
├── 相对父容器固定（会滚动）→ transform 欺骗法
├── 在容器内"粘住" → position: sticky
└── 需要动态跟随 → JS 计算 + ResizeObserver
```

## 相关资源

- [MDN: position](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
- [CSS Transforms 创建包含块](https://www.w3.org/TR/css-transforms-1/#transform-rendering)
- [Chrome DevTools 调试定位问题](/examples/css/demos/fixed-relative-positioning.html)
