# CSS 环绕下划线动画

> 原文：[CSS Animated Wrapping Underline](https://nickymeuleman.netlify.app/blog/css-animated-wrapping-underline)

## 问题

传统的 `text-decoration: underline` 在多行文本中效果不佳——下划线不会跟随每行文字，而是贯穿整个段落。

```html
<p class="traditional">
  Lorem ipsum dolor sit amet,
  <span class="highlight">consectetur adipiscing elit.</span>
  Sed do eiusmod tempor incididunt ut labore.
</p>
```

```css
.traditional .highlight {
  text-decoration: underline;
  /* 问题：下划线从 "consectetur" 开始，到 "elit." 结束，
     中间换行的地方没有下划线 */
}
```

## 解决方案

### 1. 背景渐变法（推荐）

使用 `background-image` + `background-size` + `background-position` 实现跟随每行的下划线。

```css
.link {
  /* 基础设置 */
  background-image: linear-gradient(#000, #000);
  background-size: 100% 2px;        /* 下划线高度 2px */
  background-position: 0 100%;      /* 定位到文字底部 */
  background-repeat: no-repeat;
  text-decoration: none;            /* 移除默认下划线 */

  /* 动画 */
  transition: background-size 0.3s ease;
}

.link:hover {
  background-size: 0% 2px;          /* 从 100% 到 0% 的动画 */
}
```

#### 原理

- `background-position: 0 100%` 让背景始终从文字底部开始
- 每行文字下方的背景形成独立的"下划线"
- 通过 `background-size` 控制下划线宽度实现动画

#### 入场动画 vs 退场动画

```css
/* 从右向左展开（入场） */
.slide-in {
  background-size: 0% 2px;          /* 默认 */
}
.slide-in:hover {
  background-size: 100% 2px;        /* 展开 */
}

/* 从左向右收缩（退场） */
.slide-out {
  background-size: 100% 2px;        /* 默认 */
}
.slide-out:hover {
  background-size: 0% 2px;          /* 收缩 */
}
```

### 2. 渐变色下划线

```css
.gradient-underline {
  background-image: linear-gradient(to right, #ff6b6b, #ffd93d, #6bcb77);
  background-size: 100% 2px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size 0.4s ease;
}

.gradient-underline:hover {
  background-size: 0% 2px;
}
```

### 3. 传统方案对比

| 方案 | 多行支持 | 样式控制 | 动画支持 | 推荐度 |
|------|---------|---------|---------|-------|
| `text-decoration: underline` | ❌ | 有限 | ❌ | ⭐ |
| `border-bottom` | ❌ | 中等 | 有限 | ⭐⭐ |
| `background-gradient` | ✅ | 完全 | ✅ | ⭐⭐⭐⭐⭐ |
| `SVG underline` | ✅ | 完全 | ✅ | ⭐⭐⭐⭐ |

### 4. SVG 下划线（最高灵活性）

```html
<svg class="svg-underline" viewBox="0 0 100 10" preserveAspectRatio="none">
  <path d="M0,8 L100,8" stroke="currentColor" stroke-width="2"/>
</svg>
```

```css
.svg-underline {
  width: 100%;
  height: 10px;
  color: #000;
  transition: color 0.3s ease;
}

.svg-underline:hover {
  color: #ff6b6b;
}
```

## 完整示例

```html
<!DOCTYPE html>
<html lang="zh">
<head>
  <style>
    .demo {
      font-size: 18px;
      line-height: 1.8;
      max-width: 600px;
      padding: 20px;
      font-family: system-ui, sans-serif;
    }

    .wrap-underline {
      /* 核心样式 */
      background-image: linear-gradient(#333, #333);
      background-size: 100% 2px;
      background-position: 0 100%;
      background-repeat: no-repeat;
      text-decoration: none;

      /* 动画 */
      transition: background-size 0.3s ease;
    }

    .wrap-underline:hover {
      background-size: 0% 2px;
    }

    /* 渐变色变体 */
    .gradient {
      background-image: linear-gradient(to right, #ff6b6b, #ffd93d, #6bcb77);
    }
  </style>
</head>
<body>
  <p class="demo">
    这是第一行文字，
    <span class="wrap-underline">这是第二行，鼠标悬停时下划线会从右向左收起</span>，
    这是第三行文字。
  </p>
</body>
</html>
```

## 注意事项

1. **避免文字重叠**：确保 `line-height` 足够大，防止下划线与下一行文字重叠
2. **颜色对比**：下划线颜色应与背景有足够对比度
3. **性能**：动画使用 `transition` 而非 `animation`，性能更好
4. **可访问性**：确保下划线不会降低文字可读性

## 使用场景

- 链接悬停效果
- 导航菜单hover
- 强调关键文字
- CTA 按钮样式
