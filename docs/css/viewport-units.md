# CSS Viewport 单位与 100vh 问题

> 本文档介绍 CSS Viewport 单位的概念，以及移动端 100vh 的经典问题及其解决方案。

## 什么是 Viewport 单位？

Viewport 单位是相对于浏览器视口（viewport）尺寸的 CSS 单位：

| 单位 | 含义 | 说明 |
|------|------|------|
| `vw` | Viewport Width | 视口宽度的 1% |
| `vh` | Viewport Height | 视口高度的 1% |
| `vmin` | Viewport Minimum | 视口宽高中较小值的 1% |
| `vmax` | Viewport Maximum | 视口宽高中较大值的 1% |

```css
/* 示例 */
.element {
  width: 50vw;   /* 视口宽度的 50% */
  height: 100vh;  /* 视口高度的 100% */
}
```

---

## 100vh 在移动端的问题

### 问题描述

在移动端浏览器中，使用 `100vh` 并不能让元素占满整个屏幕高度。原因在于：

**移动端浏览器将 `vh` 基于"最大可能视口高度"计算**，而不是"当前可见视口高度"。

当地址栏可见时，实际可见区域小于 `vh` 计算的值；当地址栏收起时，可见区域又大于 `vh` 计算的值。

### 问题示意图

```
┌─────────────────────────┐
│      地址栏 (60px)       │  ← 不在 100vh 计算范围内
├─────────────────────────┤
│                         │
│    实际可见区域          │  ← 100vh 基于这个计算
│    (可用高度)            │
│                         │
├─────────────────────────┤
│      导航栏 (50px)       │  ← 不在 100vh 计算范围内
└─────────────────────────┘

100vh = 地址栏 + 实际可见区域 + 导航栏
      = 全部加起来的高度
```

### 实际表现

```css
/* 在桌面浏览器正常 */
.full-height {
  height: 100vh;
}

/* 在移动端 Chrome/Android 中：
   元素高度 = 地址栏收起时的视口高度
   但地址栏展开时，内容会溢出或被遮挡
*/
```

---

## 解决方案

### 方案一：使用 dvh / svh / lvh（现代浏览器）

现代浏览器提供了动态视口单位：

| 单位 | 含义 |
|------|------|
| `dvh` (Dynamic VH) | 当前可见视口高度，随地址栏变化 |
| `svh` (Small VH) | 地址栏展开时的视口高度 |
| `lvh` (Large VH) | 地址栏收起时的视口高度 |

```css
/* 推荐：在移动端使用 dvh */
.full-height {
  height: 100dvh;  /* 始终等于当前可见区域高度 */
}

/* 降级方案 */
.full-height {
  height: 100vh;      /* 旧浏览器 */
  height: 100dvh;     /* 现代浏览器 */
}
```

**浏览器支持情况**：
- iOS Safari 15+ 支持
- Chrome 108+ 支持
- Firefox 126+ 支持

### 方案二：CSS 变通写法

```css
/* 方法：使用 100% + min-height */
.full-screen {
  height: 100%;
  min-height: 100vh;  /* fallback */
}

/* 或使用 calc */
.full-screen {
  min-height: 100vh;
  min-height: 100dvh;  /* 现代浏览器 */
}
```

### 方案三：JavaScript 动态计算

```javascript
// 使用 window.innerHeight 动态计算
const setFullHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

setFullHeight();
window.addEventListener('resize', setFullHeight);
```

```css
/* CSS 中使用自定义属性 */
.full-height {
  height: calc(var(--vh, 1vh) * 100);
}
```

### 方案四：使用 fixed 定位

```css
/* 将底部栏使用 fixed 固定 */
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.content {
  flex: 1;
  overflow-y: auto;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
```

---

## 各方案对比

| 方案 | 优点 | 缺点 | 兼容性 |
|------|------|------|--------|
| dvh/svh/lvh | 简单直接 | 旧浏览器不支持 | 现代浏览器 |
| min-height 变通 | 兼容性好 | 可能有边界情况 | 所有浏览器 |
| JS 动态计算 | 完全可控 | 需要 JavaScript | 所有浏览器 |
| fixed 定位 | 布局灵活 | 可能影响其他布局 | 所有浏览器 |

---

## 最佳实践

### 1. 优先使用 dvh（现代浏览器）

```css
.hero {
  min-height: 100vh;
  min-height: 100dvh;  /* 现代浏览器的最佳选择 */
}
```

### 2. 移动端适配策略

```css
/* 基础：100vh 作为 fallback */
.full-page {
  min-height: 100vh;
}

/* 增强：使用 dvh 支持 */
@supports (height: 100dvh) {
  .full-page {
    min-height: 100dvh;
  }
}
```

### 3. 全面屏 / 刘海屏适配

```css
/* 使用 env() 处理安全区域 */
.full-screen {
  height: 100vh;
  height: 100dvh;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

## 常见场景

### 场景一：登录页全屏背景

```css
.login-page {
  /* 使用 dvh + fallback */
  height: 100vh;
  height: 100dvh;
  
  /* 或者使用 min-height */
  min-height: 100vh;
  min-height: 100dvh;
}
```

### 场景二：固定底部按钮

```css
.page-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}

.main-content {
  flex: 1;
  overflow-y: auto;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  /* 处理安全区域 */
  padding-bottom: env(safe-area-inset-bottom);
}
```

### 场景三：整页滚动

```css
.full-page-scroll {
  height: 100vh;
  height: 100dvh;
  overflow-y: auto;
  /* 支持平滑滚动 */
  scroll-behavior: smooth;
}
```

---

## 浏览器兼容性

| 单位 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| vh/vw | 所有版本 | 所有版本 | 所有版本 | 所有版本 |
| dvh/svh/lvh | 108+ | 126+ | 15+ | 108+ |
| vmin | 所有版本 | 所有版本 | 所有版本 | 所有版本 |
| vmax | 所有版本 | 所有版本 | 所有版本 | 所有版本 |

### 降级策略

```css
.card {
  /* 旧浏览器 */
  height: 600px;
  
  /* 现代浏览器 */
  height: 100vh;
  height: 100dvh;
}
```

---

## 总结

1. **问题本质**：`100vh` 在移动端基于最大视口计算，而非当前可见区域
2. **根本原因**：移动端浏览器地址栏的显示/隐藏会改变视口高度
3. **推荐方案**：
   - 优先使用 `100dvh`（现代浏览器）
   - 使用 `min-height` + fallback 作为降级
   - 必要时使用 JavaScript 动态计算
4. **注意事项**：处理全面屏、iPhone刘海屏等特殊情况

---

## 参考资料

- [MDN: CSS Viewport units](https://developer.mozilla.org/en-US/docs/Web/CSS/length#viewport-percentage_lengths)
- [CSS Tricks: The trick to viewport units on mobile](https://css-tricks.com/the-trick-to-viewport-units-on-mobile/)
- [web.dev: Large, small, and dynamic viewport units](https://web.dev/viewport-units/)
