# CSS 0.5px 像素实现方法研究

## 概述

在 Retina 屏幕（高清屏）上，CSS 中的 1px 对应的是 2 个甚至 3 个物理像素。这意味着传统的 1px 边框在线retina 屏幕上会显得过粗。本文档介绍如何实现 0.5px 的精细线条。

## 为什么 0.5px 有意义

### Retina / 高清屏背景

| 设备 | DPR (Device Pixel Ratio) | CSS 1px = 物理像素 |
|------|--------------------------|-------------------|
| 普通屏幕 | 1x | 1px |
| Retina (iPhone) | 2x | 2px |
| iPhone Pro Max | 3x | 3px |
| 部分 Android 旗舰 | 3x | 3px |

**DPR（设备像素比）** = 物理像素 / CSS 像素

在 2x 屏幕上，如果设计稿要求 1px 的边框，实际需要显示为 0.5px 的 CSS 像素，才能在物理上呈现为 1px 的线条。

### 问题演示

```css
/* 普通屏幕：显示 1px 物理像素 */
/* Retina 屏幕：显示 2px 物理像素（看起来更粗） */
border: 1px solid #333;
```

解决方案：使用 0.5px 的 CSS 线条，在 Retina 屏幕上渲染出 1px 的物理效果。

## 实现方案

### 方案一：transform: scale(0.5) ⭐ 推荐

**原理**：使用 CSS transform 缩放元素，实现 0.5px 效果。

```css
/* 原始 1px 线条，缩小到 50% */
.half-pixel-line {
  height: 1px;
  background: #333;
  transform: scaleY(0.5);
  transform-origin: top center;
}
```

**进阶用法（支持任意方向）**：

```css
/* 上边框 */
.half-pixel-top {
  height: 1px;
  background: linear-gradient(to bottom, #333, #333);
  transform: scaleY(0.5);
  transform-origin: top center;
}

/* 下边框 */
.half-pixel-bottom {
  height: 1px;
  background: linear-gradient(to bottom, #333, #333);
  transform: scaleY(0.5);
  transform-origin: bottom center;
}

/* 容器方案（不污染子元素） */
.half-pixel-container::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: #333;
  transform: scaleY(0.5);
  transform-origin: bottom center;
}
```

**优点**：
- 兼容性好，所有现代浏览器支持
- 可以精确控制线条位置
- 不影响元素内部布局

**缺点**：
- 可能影响子元素的 `position: fixed` 定位（相对于变换后的坐标）
- 需要设置 `transform-origin` 控制线条方向

---

### 方案二：box-shadow: 0 0 0 0.5px ⭐⭐⭐⭐

**原理**：利用 box-shadow 的扩散半径实现 0.5px 线条。

```css
/* 底部 0.5px 边框 */
.half-pixel-shadow {
  box-shadow: 0 0.5px 0 #333;
}

/* 多边边框 */
.half-pixel-all {
  box-shadow: 0.5px 0 0 #333,   /* 左边 */
              0 -0.5px 0 #333,  /* 上边 */
              -0.5px 0 0 #333,  /* 右边 */
              0 0.5px 0 #333;  /* 下边 */
}
```

**优点**：
- 语法简洁
- 不产生额外 DOM 元素
- 不会影响子元素的定位

**缺点**：
- 只能实现纯色线条
- 阴影颜色会自动继承文字颜色（需要显式指定）
- 不支持虚线等特殊样式

---

### 方案三：background-image + SVG

**原理**：使用 SVG 作为背景图片，实现 0.5px 线条。

```css
/* 单边 SVG 线条 */
.half-pixel-svg-bottom {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='1'%3E%3Crect width='100' height='0.5' fill='%23333'/%3E%3C/svg%3E") repeat-x left bottom;
  background-size: 100px 1px;
}

/* 多边 SVG 边框 */
.half-pixel-svg-border {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='100'%3E%3Crect x='0' y='0' width='0.5' height='100' fill='%23333'/%3E%3C/svg%3E") repeat-y left top,
              url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='100'%3E%3Crect x='0.5' y='0' width='0.5' height='100' fill='%23333'/%3E%3C/svg%3E") repeat-y right top;
  background-size: 1px 100%, 1px 100%;
}
```

**优点**：
- 可以自定义线条样式（虚线、渐变等）
- 支持任意颜色
- 可扩展性强

**缺点**：
- SVG 编码可读性差
- 需要计算 background-size
- 不如纯 CSS 方案简洁

---

### 方案四：background: linear-gradient

**原理**：使用透明到实色的渐变实现 0.5px 线条。

```css
/* 底部 0.5px */
.half-pixel-gradient-bottom {
  background: linear-gradient(to bottom, transparent 50%, #333 50%, #333 100%);
  background-size: 100% 2px;  /* 1px 高，分成两半 */
  background-repeat: no-repeat;
  background-position: left bottom;
}

/* 使用伪元素 */
.half-pixel-gradient::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 1px;
  background: linear-gradient(to right, 
    transparent, 
    #333 10%, 
    #333 90%, 
    transparent
  );
  /* 实际只显示下半部分 0.5px */
  transform: scaleY(0.5);
  transform-origin: top center;
}
```

**优点**：
- 可以实现渐变效果
- 支持多色过渡
- 可配合伪元素使用

**缺点**：
- 语法较复杂
- 需要精确计算背景尺寸
- 维护成本较高

---

### 方案五：直接写 0.5px（Chrome 89+ 原生支持）

**原理**：现代浏览器直接支持小数像素值。

```css
/* 简单直接 */
.half-pixel-native {
  height: 0.5px;
  background: #333;
}

/* border 也支持小数 */
.half-pixel-border {
  border-bottom: 0.5px solid #333;
}
```

**浏览器支持**：

| 浏览器 | 最低版本 | 备注 |
|--------|---------|------|
| Chrome | 89+ | 2021年3月发布 |
| Edge | 89+ | 同 Chromium |
| Safari | 不支持 | 截至 Safari 17 |
| Firefox | 不支持 | 截至 Firefox 120 |
| iOS Safari | 不支持 | WebKit 未实现 |
| Android Chrome | 89+ | 支持 |

**优点**：
- 语法最简洁
- 语义清晰
- 性能最好（无 hack）

**缺点**：
- iOS Safari 和 Firefox 不支持
- 需要结合其他方案做兼容

**兼容写法**：

```css
.half-pixel-fallback {
  height: 1px;
  background: #333;
  transform: scaleY(0.5);
  transform-origin: top center;
}

@supports (height: 0.5px) {
  .half-pixel-fallback {
    height: 0.5px;
    transform: none;
  }
}
```

---

## 方案对比

| 方案 | 兼容性 | 简洁性 | 灵活性 | 性能 | 推荐场景 |
|------|--------|--------|--------|------|----------|
| transform: scale | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 通用，推荐 |
| box-shadow | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | 单边边框 |
| SVG | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 特殊样式 |
| linear-gradient | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | 渐变边框 |
| 原生 0.5px | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 渐进增强 |

## 适用场景

### 场景一：列表分隔线

```css
/* 推荐：box-shadow 方案 */
.list-item {
  position: relative;
  padding: 12px 16px;
  box-shadow: 0 0.5px 0 #e0e0e0;
}

.list-item:last-child {
  box-shadow: none;
}
```

### 场景二：头像描边

```css
/* 推荐：transform 方案 */
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: relative;
}

.avatar::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 50%;
  border: 1px solid #333;
  transform: scale(0.5);
}
```

### 场景三：输入框边框

```css
/* 推荐：box-shadow 方案 */
.input-field {
  border: none;
  outline: none;
  box-shadow: inset 0 0.5px 0 #333;
}
```

### 场景四：卡片边框

```css
/* 推荐：transform 容器方案 */
.card {
  position: relative;
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  border: 1px solid #333;
  transform: scale(0.5);
  pointer-events: none;  /* 重要：允许点击穿透 */
}
```

## 最佳实践

### 1. 使用语义化类名

```css
/* ✅ 语义清晰 */
.hairline-bottom { box-shadow: 0 0.5px 0 #ccc; }

/* ❌ 不推荐 */
.border-05 { box-shadow: 0 0.5px 0 #ccc; }
```

### 2. 封装为工具类

```css
/* 0.5px 边框工具类 */
.hairline {
  position: relative;
}

.hairline::after {
  content: '';
  position: absolute;
  pointer-events: none;
}

.hairline--top::after {
  left: 0; right: 0; top: 0;
  height: 1px;
  background: var(--hairline-color, #ccc);
  transform: scaleY(0.5);
  transform-origin: top center;
}

.hairline--bottom::after {
  left: 0; right: 0; bottom: 0;
  height: 1px;
  background: var(--hairline-color, #ccc);
  transform: scaleY(0.5);
  transform-origin: bottom center;
}
```

### 3. 结合 PostCSS 插件

使用 `postcss-0.5px` 或类似插件自动处理：

```css
/* 输入 */
.my-border {
  border: 0.5px solid #ccc;
}

/* 输出（自动添加降级方案） */
.my-border {
  border: none;
  box-shadow: 0 0.5px 0 #ccc;
}
```

### 4. 渐进增强策略

```css
/* 基础样式（所有浏览器） */
.precise-border {
  box-shadow: 0 0.5px 0 #333;
}

/* 增强样式（支持 0.5px 的浏览器） */
@supports (height: 0.5px) {
  .precise-border {
    border-bottom: 0.5px solid #333;
    box-shadow: none;
  }
}
```

## 总结

| 需求 | 推荐方案 |
|------|---------|
| 通用单边线条 | `box-shadow: 0 0.5px 0 #color` |
| 多边精细边框 | `transform: scale(0.5)` |
| 渐变/特殊样式 | `background-image + SVG` |
| 追求简洁 | 原生 `0.5px`（Chrome 89+） |
| 最佳兼容性 | `transform: scale(0.5)` |

**最终建议**：大多数场景下，`box-shadow` 方案是最优选择——简洁、兼容性好、不影响布局。复杂场景使用 `transform: scale(0.5)` 配合容器伪元素。
