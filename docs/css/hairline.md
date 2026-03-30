# 0.5px 像素实现指南

> Retina 等高 DPI 屏幕下，如何用 CSS 实现 0.5px 物理像素的细线？

## 1. 问题背景

### 1.1 设备像素比（DPR）

| 屏幕 | DPR | 1 CSS 像素 = 物理像素 |
|------|-----|----------------------|
| 普通屏幕 | 1x | 1px |
| Retina (iPhone) | 2x | 2px |
| Retina (iPhone Plus) | 3x | 3px |
| 部分 Android | 2x/3x | 2-3px |

当 DPR=2 时，设计稿中的 1px 边框实际需要 0.5px 物理像素才能显示为"真正的 1px"。

### 1.2 问题

直接写 `border-width: 0.5px` 在低 DPI 屏幕正常，但在高 DPI 下可能被渲染为 1px（因为浏览器会四舍五入）。

---

## 2. 实现方案

### 2.1 方案一：transform: scale()（推荐）

```css
.hairline {
  height: 1px;
  background: #333;
  transform: scaleY(0.5);
  transform-origin: left top;
}
```

**优点**：效果最精确，支持任意边
**缺点**：需要正确处理包含块（containing block）

### 2.2 方案二：box-shadow

```css
.hairline {
  box-shadow: 0 0.5px 0 #333;
}
```

**优点**：简单，适合单边
**缺点**：边缘有模糊感，不够锐利

### 2.3 方案三：SVG background-image

```css
.hairline {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='1'%3E%3Crect fill='%23333' width='100%25' height='0.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: 100% 1px;
  background-position: left bottom;
}
```

**优点**：可自定义图案，支持高清渲染
**缺点**：需要 base64 或 SVG 字符串，略复杂

### 2.4 方案四：linear-gradient

```css
.hairline {
  background: linear-gradient(to bottom, #333 50%, transparent 50%) no-repeat;
  background-size: 100% 2px;
}
```

**优点**：适合渐变分隔线，灵活
**缺点**：需要精确计算 background-size

### 2.5 方案五：直接 0.5px（渐进增强）

```css
@supports (height: 0.5px) {
  .hairline {
    height: 0.5px;
  }
}
```

**优点**：最简洁
**缺点**：仅 Chrome 89+ 支持

---

## 3. 浏览器兼容性

| 方案 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| transform: scale() | ✅ | ✅ | ✅ | ✅ |
| box-shadow | ✅ | ✅ | ✅ | ✅ |
| SVG background | ✅ | ✅ | ✅ | ✅ |
| linear-gradient | ✅ | ✅ | ✅ | ✅ |
| 0.5px 原生 | ✅ 89+ | ❌ | ❌ | ✅ |

---

## 4. 常见场景

### 4.1 边框线

```css
/* 四边 */
.hairline-border {
  position: relative;
}
.hairline-border::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid #333;
  transform: scale(0.5);
  transform-origin: 0 0;
  pointer-events: none;
}

/* 底边 */
.hairline-bottom {
  height: 0;
  box-shadow: inset 0 -0.5px 0 #333;
}
```

### 4.2 分隔线

```css
/* 单像素分隔线 */
.divider {
  height: 1px;
  background: linear-gradient(to bottom, transparent 50%, #e5e5e5 50%);
  background-size: 100% 2px;
}
```

### 4.3 圆角 + 边框

```css
/* 圆角卡片需要 box-shadow 方案 */
.card {
  border-radius: 8px;
  box-shadow: 0 0 0 0.5px #333;
}
```

---

## 5. 最佳实践

```css
/*
 * Hairline 工具类
 * 使用方式: <div class="hairline hairline--bottom"></div>
 */

.hairline {
  position: relative;
}

.hairline--top::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  background: #333;
  transform: scaleY(0.5);
  transform-origin: 0 0;
}

.hairline--bottom::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  background: #333;
  transform: scaleY(0.5);
  transform-origin: 0 0;
}

.hairline--left::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #333;
  transform: scaleX(0.5);
  transform-origin: 0 0;
}

.hairline--right::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: #333;
  transform: scaleX(0.5);
  transform-origin: 0 0;
}
```

---

## 6. 参考资源

- [CSS Transforms Level 1](https://www.w3.org/TR/css-transforms-1/)
- [Can I Use: CSS transform scale for DPR handling](https://caniuse.com/css-transforms)
- [MDN: box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)

---

## 7. 相关主题

- [Retina 屏幕适配](../css/retina-display.md)
- [CSS 单位详解](../css/units.md)
