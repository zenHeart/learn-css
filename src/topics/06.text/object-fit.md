# CSS object-fit 图片适配指南

## 概述

`object-fit` 属性指定替换元素（如 `<img>`、`<video>`）应该如何适应容器的宽高。

## 语法

```css
object-fit: fill | contain | cover | none | scale-down;
```

## 值

### fill
默认值。拉伸内容以填满容器（可能变形）：

```css
img {
  width: 100%;
  height: 100%;
  object-fit: fill;
}
```

### contain
保持宽高比，缩放内容以完整显示在容器内（可能有空白）：

```css
img {
  width: 100%;
  height: 300px;
  object-fit: contain;
  background: #f0f0f0; /* 空白区域背景色 */
}
```

### cover
保持宽高比，缩放内容以填满容器（超出部分被裁剪）：

```css
img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}
```

### none
保持原始尺寸，不缩放：

```css
img {
  object-fit: none;
}
```

### scale-down
在 `none` 和 `contain` 之间选择，取较小的结果：

```css
img {
  width: 100%;
  height: 300px;
  object-fit: scale-down;
}
```

## 与 background-size 对比

| 属性 | 适用元素 | 常用值 |
|------|---------|--------|
| object-fit | 替换元素（img, video, object） | fill, contain, cover |
| background-size | 背景图片 | cover, contain, 100% 100% |

## 实际应用场景

### 1. 响应式图片卡片

```html
<div class="card">
  <img src="photo.jpg" alt="照片" class="card-image" />
</div>
```

```css
.card {
  width: 300px;
  height: 200px;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### 2. 头像裁剪

```html
<div class="avatar">
  <img src="user.jpg" alt="用户头像" />
</div>
```

```css
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden; /* 圆形裁剪 */
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保填充且不变形 */
}
```

### 3. 视频自适应

```html
<div class="video-container">
  <video src="movie.mp4"></video>
</div>
```

```css
.video-container {
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 比例 */
  position: relative;
}

.video-container video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### 4. 图文混排

```html
<article class="post">
  <figure class="post-thumbnail">
    <img src="cover.jpg" alt="封面" />
  </figure>
  <div class="post-content">
    <h2>标题</h2>
    <p>正文内容...</p>
  </div>
</article>
```

```css
.post-thumbnail {
  width: 100%;
  height: 200px;
}

.post-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

## object-position

配合 `object-position` 控制内容位置：

```css
img {
  object-fit: cover;
  object-position: top center; /* 顶部居中对齐 */
  /* 或使用数值 */
  /* object-position: 50% 25%; */
}
```

### 实用示例：头像顶部裁剪

```css
.avatar-top {
  width: 100px;
  height: 150px; /* 3:2 比例 */
}

.avatar-top img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top; /* 显示顶部，底部被裁剪 */
}
```

## 兼容性

| 浏览器 | 支持版本 |
|--------|---------|
| Chrome | 31+ |
| Firefox | 36+ |
| Safari | 7.1+ |
| Edge | 16+ |

## polyfill

IE/旧 Edge 不支持，可以使用：

```html
<!-- 图片备用方案 -->
<img 
  src="photo.jpg" 
  alt="照片"
  onerror="this.style.objectFit='none'; this.style.width='auto'; this.style.height='auto';"
/>
```

## 相关属性

- [background-size](./background-size.md) - 背景图片尺寸
- [object-position](./object-position.md) - 图片位置
- [aspect-ratio](./aspect-ratio.md) - 宽高比

## 参考资源

- [MDN object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
- [CSS Images Module Level 3](https://www.w3.org/TR/css-images-3/)
