# backdrop-filter 使用指南

## 概述

`backdrop-filter` 是 CSS 属性，允许对一个元素**后方**的内容应用图形效果，如模糊、颜色变换等。常用于创建玻璃拟态（Glassmorphism）等现代 UI 效果。

## 核心语法

```css
.element {
  backdrop-filter: <filter-function> [<filter-function>]*;
  /* 或 */
  backdrop-filter: none;
}
```

## 可用的滤镜函数

| 函数 | 说明 | 示例 |
|------|------|------|
| `blur()` | 高斯模糊 | `blur(10px)` |
| `brightness()` | 亮度调整 | `brightness(1.2)` |
| `contrast()` | 对比度调整 | `contrast(0.8)` |
| `drop-shadow()` | 投影 | `drop-shadow(0 4px 8px rgba(0,0,0,0.3))` |
| `grayscale()` | 灰度转换 | `grayscale(100%)` |
| `hue-rotate()` | 色相旋转 | `hue-rotate(90deg)` |
| `invert()` | 反转颜色 | `invert(100%)` |
| `opacity()` | 透明度 | `opacity(0.8)` |
| `saturate()` | 饱和度 | `saturate(2)` |
| `sepia()` | 棕褐色调 | `sepia(50%)` |

## 浏览器兼容性

| 浏览器 | 支持情况 |
|--------|----------|
| Chrome | ✅ 76+ |
| Safari | ✅ 9+（需要 `-webkit-backdrop-filter`） |
| Firefox | ✅ 103+ |
| Edge | ✅ 17+ |

### Safari 兼容写法

```css
.glass {
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
```

## 玻璃拟态（Glassmorphism）

玻璃拟态是现代 UI 设计的热门风格，核心就是 `backdrop-filter: blur()`。

```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}
```

## 性能注意事项

1. **GPU 加速**：backdrop-filter 会创建新的图层，建议配合 `will-change` 使用
2. **性能开销**：模糊半径越大，性能开销越大
3. **移动端谨慎使用**：移动设备性能有限，过度使用可能导致卡顿

## 常见问题

### Q: backdrop-filter 不生效？

检查：
1. 元素是否有背景（background 或 rgba）
2. 元素下方是否有内容
3. Safari 浏览器需要添加 `-webkit-backdrop-filter`

### Q: 与 `filter` 的区别？

- `filter`：影响元素**自身**
- `backdrop-filter`：影响元素**后方**的内容

## 参考资料

- [MDN backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
- [Can I Use - backdrop-filter](https://caniuse.com/css-backdrop-filter)
