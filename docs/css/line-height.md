# CSS 行间距理解

## 1. line-height 基本概念与取值

`line-height` 属性用于设置行框（line box）的高度，即一行文字的高度。它影响文本行与行之间的垂直间距。

### 取值类型

| 值 | 描述 | 示例 |
|---|---|---|
| `normal` | 浏览器默认值，通常约为 1.2 | `line-height: normal;` |
| `number` | 无单位数值，相对于 `font-size` 计算 | `line-height: 1.5;` |
| `length` | 固定长度值（px, em, rem 等） | `line-height: 20px;` |
| `percentage` | 相对于 `font-size` 的百分比 | `line-height: 150%;` |

### 推荐用法

```css
/* 推荐：无单位数值 - 保持相对于 font-size 的比例 */
.line { line-height: 1.5; }

/* 不推荐：固定长度 - 不会随字体大小缩放 */
.bad { line-height: 20px; }

/* 谨慎使用：百分比 */
.ok { line-height: 150%; }
```

---

## 2. 行间距计算原理

`line-height` 减去 `font-size` 的差值，会均匀分布在文本的顶部和底部。

```
┌─────────────────────────────┐
│           half-leading       │  ← (line-height - font-size) / 2
│  ┌───────────────────────┐  │
│  │      font-size        │  │  ← 文字实际高度
│  └───────────────────────┘  │
│           half-leading       │  ← (line-height - font-size) / 2
└─────────────────────────────┘
           line-height
```

### 关键公式

```css
/* 行间距 = line-height - font-size */
leading = line-height - font-size;
half-leading = leading / 2;

/* 应用：文字垂直居中 */
.container {
  height: 100px;
  line-height: 100px; /* 仅适用于单行文本 */
}
```

---

## 3. 行内元素 vs 块级元素的影响差异

### 块级元素

块级元素的 `line-height` 影响其内部文本行的整体高度：

```css
p {
  font-size: 16px;
  line-height: 1.5; /* 每行高度 = 16 * 1.5 = 24px */
}
```

### 行内元素

行内元素的 `line-height` 仅影响自身内容，不影响父元素的行高：

```css
/* 行内元素不会创建新的行框 */
span {
  line-height: 3; /* 仅影响 <span> 内的文本 */
}

/* 注意：这不会让父元素段落的高度增加 */
```

### inline-block 的特殊行为

```css
.inline-block {
  display: inline-block;
  line-height: 3; /* 会影响元素本身的高度 */
}
```

---

## 4. Vertical Rhythm（垂直节奏）

垂直节奏是一种排版理念，让页面元素在垂直方向上保持一致的间距基准。

### 核心思想

```css
/* 建立基础节奏 */
:root {
  --base-font-size: 16px;
  --base-line-height: 24px; /* 基准行高 */
}

/* 元素高度应为基准的倍数 */
h1 { font-size: 32px; line-height: 48px; }  /* 2x */
h2 { font-size: 24px; line-height: 48px; }  /* 1.5x but aligns to 2x */
h3 { font-size: 20px; line-height: 24px; }  /* 1x */
p  { font-size: 16px; line-height: 24px; }  /* 1x */
```

### 自动实现工具

- [Compass](https://compass-style.org/) 的 `rhythm()` 函数
- [Vertical Rhythm](https://github.com/stephan83/vertical-rhythm) 工具

---

## 5. line-height 继承特性与最佳实践

### 继承特性

`line-height` 会被子元素继承，但继承的是计算后的值（对于无单位数值）：

```css
/* 父元素 */
.parent {
  font-size: 20px;
  line-height: 1.5; /* 计算值：30px */
}

/* 子元素继承的是 1.5（无单位），会相对于自身 font-size 计算 */
.child {
  font-size: 10px;
  /* 继承的 line-height: 1.5
     实际 line-height = 10px * 1.5 = 15px */
}
```

### 最佳实践

```css
/* ✅ 推荐：无单位数值 */
body { line-height: 1.5; }

/* ✅ 可接受：百分比（但需注意继承行为） */
body { line-height: 150%; }

/* ❌ 避免：固定长度（不支持响应式） */
body { line-height: 20px; }

/* ✅ 多行文本垂直居中 */
.card {
  display: flex;
  align-items: center; /* 更可靠的垂直居中 */
}
```

---

## 6. line-height 与 vertical-align 的关系

### 基本关系

`vertical-align` 属性影响行内元素在其父元素的行框中的垂直位置：

```css
/* 默认值是 baseline */
img {
  vertical-align: baseline; /* 默认对齐方式 */
}

/* 常见取值 */
img { vertical-align: top; }       /* 与行框顶部对齐 */
img { vertical-align: middle; }    /* 与父元素 x-height 的中点对齐 */
img { vertical-align: bottom; }    /* 与行框底部对齐 */
img { vertical-align: text-top; }   /* 与父元素字体的顶部对齐 */
img { vertical-align: text-bottom; } /* 与父元素字体的底部对齐 */
```

### line-height 对 vertical-align 的影响

当 `line-height` 大于字体大小时，行框高度增加，影响 `vertical-align: middle` 的效果：

```css
/* 调整前：图片与文字基线对齐，可能不对齐 */
p { line-height: 1; }
img { vertical-align: middle; }

/* 调整后：更好的垂直对齐效果 */
p { line-height: 0; }  /* 消除行框高度影响 */
img { vertical-align: middle; }
```

---

## 7. 常见错误：line-height < font-size 导致文字重叠

### 问题原因

```css
/* ❌ 错误：line-height 小于 font-size */
.bad {
  font-size: 20px;
  line-height: 0.8; /* line-height = 16px < font-size = 20px */
  /* 结果：文字上下重叠 */
}
```

### 正确做法

```css
/* ✅ 正确：确保 line-height 足够大 */
.good {
  font-size: 20px;
  line-height: 1.2; /* line-height = 24px > font-size = 20px */
}

/* ✅ 特殊情况：仅设置背景时可用较小值 */
.tag {
  font-size: 12px;
  line-height: 1;
  /* 适合紧凑的标签布局 */
}
```

### 调试方法

```css
/* 添加背景快速发现问题 */
.debug {
  background: rgba(255, 0, 0, 0.1);
  line-height: 0.5; /* 文字重叠时红色会叠加变深 */
}
```

---

## 8. 交互式 Demo

### Demo 1：不同 line-height 值对比

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .demo { font-size: 16px; }
    .demo-1 { line-height: 0.8; background: #ff6b6b20; }
    .demo-2 { line-height: 1.2; background: #4ecdc420; }
    .demo-3 { line-height: 1.8; background: #45b7d120; }
  </style>
</head>
<body>
  <div class="demo demo-1">line-height: 0.8 (文字重叠!)</div>
  <div class="demo demo-2">line-height: 1.2 (紧凑)</div>
  <div class="demo demo-3">line-height: 1.8 (宽松)</div>
</body>
</html>
```

### Demo 2：单行文字垂直居中

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .button {
      height: 40px;
      line-height: 40px; /* 等于 height 实现单行垂直居中 */
      background: #4ecdc4;
      color: white;
      padding: 0 20px;
      display: inline-block;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <span class="button">单行按钮文字</span>
</body>
</html>
```

### Demo 3：多行文字垂直居中

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .card {
      height: 200px;
      display: flex;
      align-items: center; /* 推荐：flexbox 垂直居中 */
      background: #f7f7f7;
      padding: 20px;
    }
    
    /* 旧方法：使用 line-height + vertical-align */
    .card-old {
      line-height: 200px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="card">
    <p>多行文字<br>垂直居中<br>使用 flexbox</p>
  </div>
</body>
</html>
```

---

## 参考资料

- [MDN: line-height](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Reference/Properties/line-height)
- [CSS-Tricks: Deep Dive on line-height](https://css-tricks.com/css-basics-understanding-line-height/)
- [Vertical Rhythm in CSS](https://www.smashingmagazine.com/2012/12/css-basics-understanding-line-height/)
