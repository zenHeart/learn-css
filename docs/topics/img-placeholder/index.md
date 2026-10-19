# img 标签无图片时背景色控制

## 问题描述

在开发中，我们经常遇到这样的需求：当 `img` 标签的 `src` 无效、图片加载中或图片加载失败时，希望显示一个背景色占位。

但 `img` 标签本身的背景色样式在以下情况不生效：
- 图片加载中（浏览器默认显示空白）
- 图片加载失败（浏览器显示破碎图标）
- `src` 为空时的默认行为

## 核心原理

### 为什么不生效？

`img` 元素是替换元素（Replaced Element），其渲染由资源内容决定，而非 CSS 内容。当没有有效图片内容时，`img` 元素的高度可能为 0 或显示浏览器默认的错误图标。

```css
/* ❌ 直接设置 background-color 无效 */
img {
  background-color: #f0f0f0; /* 不生效 */
}
```

### 解决方案

使用 **CSS 背景色 + padding** 技巧，让背景色成为图片的"底板"：

```css
/* ✅ 正确：利用背景色 + 内边距模拟占位 */
.img-wrapper {
  background-color: #f0f0f0; /* 占位背景色 */
  padding-bottom: 66.67%;    /* 16:9 比例 = 9/16 = 0.5625 */
  position: relative;
}

.img-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

## 方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|-----|------|------|---------|
| 背景色 + padding | 纯 CSS、比例自适应 | 需要 wrapper 元素 | 响应式图片 |
| 背景色 + aspect-ratio | 纯 CSS、简洁 | 需要 wrapper | 现代浏览器 |
| ::before 伪元素 | 无需 HTML 改动 | 兼容性稍差 | 快速实现 |
| JS 检测 + class | 可自定义错误UI | 需要 JS | 复杂交互 |

## 方案 1：CSS aspect-ratio（推荐）

```css
.img-wrapper {
  background-color: #e0e0e0;
  aspect-ratio: 16 / 9; /* 控制比例 */
  position: relative;
}

.img-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 加载中/失败状态 */
.img-wrapper img[src=""],
.img-wrapper img:not([src]) {
  opacity: 0;
}

/* 使用 CSS 动画实现淡入效果 */
.img-wrapper img.loaded {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

```html
<div class="img-wrapper">
  <img src="example.jpg" alt="示例图片" 
       onload="this.classList.add('loaded')"
       onerror="this.style.display='none'">
</div>
```

## 方案 2：使用 ::before 伪元素

```css
.img-container {
  position: relative;
  display: inline-block;
}

/* 背景占位层 */
.img-container::before {
  content: '';
  display: block;
  background-color: #f5f5f5;
  /* 使用 padding-bottom 维持比例 */
  padding-bottom: 75%; /* 4:3 比例 */
}

/* 图片绝对定位覆盖 */
.img-container img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

## 方案 3：图片加载失败时显示占位

```javascript
// 监听图片加载错误
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    // 显示占位背景
    this.style.opacity = '0';
    this.parentElement.classList.add('img-error');
  });
  
  img.addEventListener('load', function() {
    this.style.opacity = '1';
    this.parentElement.classList.remove('img-error');
    this.classList.add('loaded');
  });
});
```

```css
/* 占位图标 */
.img-error::after {
  content: '🖼️';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
}
```

## 方案 4：纯 CSS 实现加载状态

```css
/* 使用 CSS 动画模拟加载中 */
img {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

img[src]:not([src=""]) {
  animation: none;
  background: none;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

## 实际应用：头像占位

```css
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #e0e0e0;
  overflow: hidden;
  position: relative;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 图片加载失败时不显示破碎图标 */
  onerror: "this.style.display='none'";
}
```

```html
<!-- 带默认头像的写法 -->
<div class="avatar">
  <img src="user.jpg" alt="用户头像" 
       onerror="this.src='default-avatar.png'">
</div>
```

## 最佳实践

### 1. 使用 aspect-ratio 控制比例

```css
.img-wrapper {
  background-color: #f0f0f0;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### 2. 优雅的图片加载动画

```css
/* 初始隐藏 */
.img-wrapper img {
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* 加载完成淡入 */
.img-wrapper img.loaded {
  opacity: 1;
}
```

```javascript
// 页面加载完成后添加 loaded 类
document.querySelectorAll('.img-wrapper img').forEach(img => {
  if (img.complete) {
    img.classList.add('loaded');
  } else {
    img.addEventListener('load', () => img.classList.add('loaded'));
  }
});
```

### 3. 响应式图片场景

```css
/* 容器保持比例，图片自适应填充 */
.picture-card {
  background-color: #f8f8f8;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.picture-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.picture-card:hover img {
  transform: scale(1.05);
}
```

## 常见问题

### Q1: 为什么 background-color 不直接在 img 上生效？

因为 `img` 是替换元素。当 `src` 有效时，图片内容覆盖了整个元素区域；当 `src` 无效时，元素的渲染由浏览器决定，通常高度为 0。

### Q2: 如何在图片加载前显示背景色？

使用 wrapper 元素，将背景色设置在 wrapper 上，图片 absolute 定位覆盖。

### Q3: 如何避免加载失败时显示破碎图标？

```css
/* 隐藏破碎图标 */
img[src=""],
img:not([src]) {
  visibility: hidden;
}

/* 或者使用 onerror 隐藏 */
img.onerror = function() { this.style.visibility = 'hidden'; }
```

### Q4: 如何实现骨架屏效果？

```css
.skeleton {
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #e0e0e0 50%,
    #f0f0f0 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

## 总结

| 场景 | 推荐方案 |
|-----|---------|
| 响应式图片占位 | `aspect-ratio` + wrapper |
| 加载动画 | shimmer skeleton CSS |
| 错误占位 | `onerror` + 自定义 UI |
| 头像占位 | 圆形 wrapper + 默认图 |

**核心思想**：背景色必须设置在 img 的容器上，而非 img 本身。使用 wrapper + 绝对定位是处理图片占位的标准做法。
