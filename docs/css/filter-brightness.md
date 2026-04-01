# CSS filter brightness() 函数

## 1. 概述

`brightness()` 是 CSS `filter` 属性的函数之一，用于调整元素的亮度。值小于 100% 使图像变暗，大于 100% 使图像变亮。

## 2. 语法

```css
filter: brightness(<number> | <percentage>);
```

### 取值

| 值 | 效果 |
|---|------|
| `0%` | 完全黑色 |
| `100%` 或 `1` | 默认亮度（不变） |
| `>100%` 或 `>1` | 更亮 |
| `<100%` 或 `<1` | 更暗 |

**注意**：`number` 类型接受 0 及以上的值，`1` 等于 `100%`。

```css
/* 变暗一半 */
img { filter: brightness(0.5); }

/* 默认亮度 */
img { filter: brightness(1); }

/* 亮度加倍 */
img { filter: brightness(200%); }
```

## 3. 与其他 filter 函数配合

`filter` 属性可同时应用多个函数，用空格分隔：

```css
img {
  filter: brightness(1.2) contrast(1.1);
  filter: brightness(0.8) blur(2px);
  filter: brightness(1.5) saturate(1.3);
}
```

### 常用 filter 函数对照

| 函数 | 作用 |
|------|------|
| `brightness()` | 调整亮度 |
| `blur()` | 高斯模糊 |
| `contrast()` | 对比度调整 |
| `grayscale()` | 灰度转换 |
| `sepia()` | 棕褐色调 |
| `saturate()` | 饱和度调整 |
| `opacity()` | 透明度 |
| `hue-rotate()` | 色相旋转 |

## 4. JavaScript 动态控制

通过 `element.style.filter` 动态调整亮度：

```javascript
// 获取图片元素
const img = document.querySelector('img');

// 设置亮度
img.style.filter = 'brightness(150%)';

// 滑块交互
const slider = document.querySelector('input[type="range"]');
slider.addEventListener('input', (e) => {
  img.style.filter = `brightness(${e.target.value}%)`;
});

// 重置
img.style.filter = 'brightness(100%)';
```

## 5. 实际应用场景

### 5.1 图片高亮效果

```css
/* 鼠标悬停时提亮 */
img:hover {
  filter: brightness(1.2);
  transition: filter 0.3s ease;
}

/* 按钮悬停效果 */
button:hover {
  background-color: brightness(1.2);
}
```

### 5.2 禁用/禁用状态

```css
/* 禁用状态变暗 */
button:disabled {
  filter: brightness(0.6);
  cursor: not-allowed;
}
```

### 5.3 深色模式适配

```css
@media (prefers-color-scheme: dark) {
  img.manual-brightness {
    filter: brightness(0.85);
  }
}
```

### 5.4 图片叠加效果

```css
/* 文字与图片叠加时的亮度补偿 */
.card {
  position: relative;
}
.card img {
  filter: brightness(0.9);
}
.card-content {
  position: absolute;
  inset: 0;
  color: white;
}
```

## 6. 浏览器兼容

`filter` 属性（包括 `brightness()`）支持所有现代浏览器：

- Chrome 36+
- Firefox 35+
- Safari 9+
- Edge 13+
- iOS Safari 9+

**注意**：IE 不支持。

## 7. 性能注意事项

- `filter` 会触发 GPU 加速，适合动画场景
- 大量使用复杂 filter 可能影响性能，建议使用 `will-change: filter` 优化
- 动画推荐使用 `transform` 和 `opacity` 的组合，性能更佳

## 8. 核心要点

```
1. brightness() 调整整体亮度，不改变色相
2. 0% = 全黑，100% = 原图，>100% = 更亮
3. 支持 number（0+）和 percentage 两种写法
4. 可与其他 filter 函数组合使用
5. JS 中通过 style.filter 控制
6. 动画场景注意性能影响
```
