# CSS object-fit 使用详解

## 概述

`object-fit` 属性指定替换元素（如 `<img>`、`<video>`、`<object>`）应该如何适应到其父容器。这个属性类似于 `background-size` 对背景图的处理方式，但适用于替换元素。

## 基本语法

```css
.media {
  object-fit: fill | contain | cover | none | scale-down;
}
```

## 值详解

### 1. fill（默认值）

```css
.fill {
  object-fit: fill;
}
```

- **特性**：拉伸图片以完全填充容器
- **不保持宽高比**：图片会被拉伸变形
- **完全覆盖容器**：没有空白区域

```
┌─────────────┐
│█████████████│
│█████████████│
│█████████████│
└─────────────┘
```

### 2. contain

```css
.contain {
  object-fit: contain;
}
```

- **特性**：保持宽高比，缩放图片以完整显示
- **保持宽高比**：图片不会变形
- **可能产生空白**：容器的某些区域可能是空白

```
┌─────────────┐
│   ┌─────┐   │
│   │     │   │
│   └─────┘   │
│             │
└─────────────┘
```

### 3. cover

```css
.cover {
  object-fit: cover;
}
```

- **特性**：保持宽高比，缩放图片以完全覆盖容器
- **保持宽高比**：图片不会变形
- **可能裁剪**：图片的某些部分会被裁剪

```
┌─────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓│
└─────────────┘
```

### 4. none

```css
.none {
  object-fit: none;
}
```

- **特性**：图片保持原始尺寸，不进行任何缩放
- **不调整大小**：图片以其自然尺寸显示
- **可能溢出**：图片可能超出容器

```
┌─────────────┐
│    ┌────┐   │
│    │    │   │
│    │    │   │
│    └────┘   │
│             │
└─────────────┘
```

### 5. scale-down

```css
.scale-down {
  object-fit: scale-down;
}
```

- **特性**：比较 `none` 和 `contain` 的结果，选择较小的那个
- **保持宽高比**：图片不会变形
- **智能缩放**：在容器比图片小时才会缩小

## object-position

`object-position` 属性控制替换元素在容器中的位置，通常与 `object-fit` 配合使用。

```css
.positioned {
  object-fit: cover;
  object-position: top center;  /* 默认值：50% 50% */
  /* 或使用具体值 */
  object-position: 20px 30px;
  object-position: 75% 50%;
}
```

### 常用位置值

```css
/* 角落定位 */
.top-left    { object-position: left top; }
.top-center  { object-position: center top; }
.top-right   { object-position: right top; }
.center-left { object-position: left center; }
.center      { object-position: center center; }
.center-right{ object-position: right center; }
.bottom-left { object-position: left bottom; }
.bottom-center { object-position: center bottom; }
.bottom-right  { object-position: right bottom; }
```

## 实战示例

### 示例 1：响应式图片卡片

```html
<div class="card">
  <div class="image-wrapper">
    <img src="photo.jpg" alt="风景照">
  </div>
  <div class="content">
    <h3>图片标题</h3>
    <p>图片描述内容</p>
  </div>
</div>

<style>
.card {
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}

.image-wrapper {
  width: 100%;
  height: 200px;
  background: #f0f0f0;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  padding: 16px;
}
</style>
```

### 示例 2：头像图片

```html
<div class="avatar-grid">
  <div class="avatar large">
    <img src="person1.jpg" alt="用户1">
  </div>
  <div class="avatar medium">
    <img src="person2.jpg" alt="用户2">
  </div>
  <div class="avatar small">
    <img src="person3.jpg" alt="用户3">
  </div>
</div>

<style>
.avatar-grid {
  display: flex;
  gap: 16px;
}

.avatar {
  border-radius: 50%;
  overflow: hidden;
  background: #e0e0e0;
}

.avatar.large {
  width: 120px;
  height: 120px;
}

.avatar.medium {
  width: 80px;
  height: 80px;
}

.avatar.small {
  width: 48px;
  height: 48px;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
```

### 示例 3：图片画廊

```html
<div class="gallery">
  <div class="gallery-item">
    <img src="image1.jpg" alt="图片1">
  </div>
  <div class="gallery-item wide">
    <img src="image2.jpg" alt="图片2">
  </div>
  <div class="gallery-item">
    <img src="image3.jpg" alt="图片3">
  </div>
</div>

<style>
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.gallery-item {
  aspect-ratio: 1 / 1;  /* 正方形 */
  overflow: hidden;
}

.gallery-item.wide {
  grid-column: span 2;  /* 横跨两列 */
  aspect-ratio: 2 / 1;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
```

### 示例 4：固定比例容器中的图片

```html
<div class="video-wrapper">
  <img src="video-poster.jpg" alt="视频封面">
  <div class="play-button">▶</div>
</div>

<style>
.video-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%;  /* 16:9 比例 */
  background: #000;
}

.video-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
}
</style>
```

### 示例 5：焦点区域控制

```html
<div class="focus-demo">
  <img src="portrait.jpg" alt="人像" class="focus-top">
  <img src="portrait.jpg" alt="人像" class="focus-center">
  <img src="portrait.jpg" alt="人像" class="focus-bottom">
</div>

<style>
.focus-demo {
  display: flex;
  gap: 16px;
}

.focus-demo img {
  width: 150px;
  height: 200px;
  object-fit: cover;
}

.focus-top {
  object-position: top;  /* 显示顶部区域 */
}

.focus-center {
  object-position: center;  /* 显示中间区域（默认） */
}

.focus-bottom {
  object-position: bottom;  /* 显示底部区域 */
}
</style>
```

### 示例 6：背景图片替代（object-fit）

```css
/* 替代 background-size: cover */
.hero-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  object-position: center top;
}

/* 替代 background-size: contain */
.icon-container {
  width: 100px;
  height: 100px;
  padding: 16px;
  border: 1px solid #ccc;
}

.icon-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
```

## 视频的 object-fit

### 响应式视频容器

```html
<div class="video-container">
  <video src="video.mp4" autoplay loop muted></video>
</div>

<style>
.video-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%;  /* 16:9 */
  background: #000;
}

.video-container video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;  /* 视频填充容器，可能裁剪 */
}
</style>
```

### 视频与 object-fit

```css
/* 全屏覆盖（类似 background-size: cover） */
.fullscreen-video {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}

/* 保持比例显示（类似 background-size: contain） */
.contained-video {
  width: 100%;
  max-height: 100vh;
  object-fit: contain;
  background: #000;  /* 保持比例时的空白区域 */
}
```

## 配合其他 CSS 属性

### 与 transform 配合

```css
.zoomed-image {
  width: 300px;
  height: 300px;
  overflow: hidden;
}

.zoomed-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.zoomed-image:hover img {
  transform: scale(1.1);  /* 鼠标悬停时放大 */
}
```

### 与 filter 配合

```css
.filtered-image {
  width: 300px;
  height: 200px;
}

.filtered-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

.filtered-image:hover img {
  filter: grayscale(0%);
}
```

### 与混合模式配合

```css
.blend-image {
  width: 300px;
  height: 300px;
  background: #3498db;
  mix-blend-mode: multiply;
}

.blend-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

## 浏览器兼容性与替代方案

### 现代浏览器支持

```css
.modern-fit {
  object-fit: cover;
  object-position: center;
}
```

### 旧浏览器兼容方案

```css
/* 使用 @supports 检测 */
@supports (object-fit: cover) {
  .image {
    object-fit: cover;
    object-position: center;
  }
}

@supports not (object-fit: cover) {
  /* 旧浏览器回退方案 */
  .image {
    /* 使用 background-image 替代 */
    background-image: url("image.jpg");
    background-size: cover;
    background-position: center;
  }

  .image img {
    opacity: 0;  /* 隐藏原图 */
  }
}
```

### 旧浏览器兼容完整方案

```html
<div class="image-container">
  <!-- 现代浏览器使用 img + object-fit -->
  <img src="image.jpg" alt="描述">

  <!-- 旧浏览器使用背景图 -->
  <div class="fallback-bg"></div>
</div>

<style>
.image-container {
  position: relative;
  width: 300px;
  height: 200px;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fallback-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("image.jpg");
  background-size: cover;
  background-position: center;
}

/* 隐藏回退背景（现代浏览器） */
@supports (object-fit: cover) {
  .fallback-bg {
    display: none;
  }
}
</style>
```

## object-fit 与 background-size 对比

| 特性 | `object-fit` | `background-size` |
|------|--------------|-------------------|
| 适用元素 | 替换元素（img, video） | 背景图片 |
| 设置位置 | 元素本身 | 元素背景 |
| 配合属性 | `object-position` | `background-position` |
| 动画支持 | 支持 | 支持 |
| 打印支持 | 支持 | 不支持 |

## 常见问题

### 问题 1：object-fit 不生效

```css
/* 检查清单 */
.image {
  width: 300px;      /* 1. 必须设置宽度 */
  height: 200px;     /* 2. 必须设置高度 */
  object-fit: cover;  /* 3. 设置 object-fit */
}
```

### 问题 2：SVG 模糊

```css
/* SVG 被拉伸时可能模糊 */
.preserve-aspect {
  object-fit: fill;  /* 拉伸会导致模糊 */
}

/* 解决方案：使用 contain */
.preserve-aspect {
  object-fit: contain;  /* 保持比例 */
}
```

### 问题 3：与 flex 布局配合

```css
.flex-container {
  display: flex;
}

.flex-image {
  flex: 1;           /* 占据可用空间 */
  height: 200px;     /* 固定高度 */
  object-fit: cover; /* 保持比例填充 */
}
```

## 浏览器支持

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| `object-fit` | ✅ 31+ | ✅ 36+ | ✅ 10+ | ✅ 16+ |
| `object-position` | ✅ 31+ | ✅ 36+ | ✅ 10+ | ✅ 16+ |

## 总结

| 值 | 宽高比 | 可能裁剪 | 可能空白 | 变形 |
|----|--------|----------|----------|------|
| `fill` | ❌ | ❌ | ❌ | ✅ |
| `contain` | ✅ | ❌ | ✅ | ❌ |
| `cover` | ✅ | ✅ | ❌ | ❌ |
| `none` | ❌ | ✅ | ✅ | ❌ |
| `scale-down` | ✅ | ❌ | ✅ | ❌ |

## 参考资源

- [MDN object-fit](https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit)
- [MDN object-position](https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-position)
- [CSS Tricks - object-fit](https://css-tricks.com/almanac/properties/o/object-fit/)
- [Can I Use - object-fit](https://caniuse.com/object-fit)
