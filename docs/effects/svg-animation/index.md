# SVG 动画效果完全指南

> SVG 提供了强大的动画能力，可以在不依赖 JavaScript 的情况下创建丰富的动画效果。

## 目录

1. [动画基础](#1-动画基础)
2. [SMIL 动画](#2-smil-动画)
3. [CSS 动画](#3-css-动画)
4. [JavaScript 动画](#4-javascript-动画)
5. [实战示例](#5-实战示例)
6. [性能优化](#6-性能优化)

---

## 1. 动画基础

### 1.1 SVG 动画的三大方式

| 方式 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **SMIL** | 声明式、原生、强大 | 浏览器兼容性、deprecated | 复杂路径动画 |
| **CSS** | 熟悉、性能好 | 能力有限 | 简单过渡动画 |
| **JS** | 完全控制 | 代码复杂 | 交互式动画 |

### 1.2 动画属性分类

**只能被动画的属性（可插值）：**
- `opacity`、`visibility`、`transform`
- 数值类属性（`x`、`y`、`r`、`cx`、`cy`）
- 颜色类属性（`fill`、`stroke`）

**不能直接动画的属性：**
- `d`（路径命令）- 需要相同命令数量
- `points`（多边形）
- `visibility`（需要特殊处理）

---

## 2. SMIL 动画

### 2.1 `<animate>` - 属性动画

最基本的 SMIL 动画元素，用于动画单个属性：

```html
<svg width="200" height="100">
  <circle cx="50" cy="50" r="30" fill="#667eea">
    <!-- 动画 fill 属性 -->
    <animate
      attributeName="fill"
      values="#667eea;#764ba2;#f093fb;#667eea"
      dur="3s"
      repeatCount="indefinite"
    />
  </circle>
</svg>
```

### 2.2 `<animateTransform>` - 变换动画

用于动画 `transform` 属性：

```html
<svg width="200" height="100">
  <rect x="30" y="30" width="40" height="40" fill="#48bb78">
    <!-- 旋转动画 -->
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="0 50 50"
      to="360 50 50"
      dur="2s"
      repeatCount="indefinite"
    />
  </rect>
</svg>
```

### 2.3 `<animateMotion>` - 路径动画

让元素沿路径运动：

```html
<svg width="200" height="100" viewBox="0 0 200 100">
  <!-- 定义路径 -->
  <path id="motionPath" d="M10,50 Q100,10 190,50" fill="none" stroke="#ddd"/>
  
  <!-- 运动的圆 -->
  <circle r="10" fill="#667eea">
    <animateMotion dur="3s" repeatCount="indefinite">
      <mpath href="#motionPath"/>
    </animateMotion>
  </circle>
</svg>
```

### 2.4 关键帧动画 `keyTimes` 和 `keySplines`

```html
<circle cx="50" cy="50" r="20" fill="#667eea">
  <!-- 贝塞尔缓动效果 -->
  <animate
    attributeName="cx"
    values="50;150;50"
    keyTimes="0;0.5;1"
    keySplines="0.4 0 0.2 1;0.4 0 0.2 1"
    dur="2s"
    repeatCount="indefinite"
  />
</circle>
```

### 2.5 动画事件

```html
<rect id="animatedRect" width="50" height="50" fill="#667eea">
  <animate
    id="fadeAnim"
    attributeName="opacity"
    from="1"
    to="0"
    dur="1s"
    begin="0s"
    onbegin="console.log('动画开始')"
    onend="console.log('动画结束')"
    onrepeat="console.log('动画重复')"
  />
</rect>
```

---

## 3. CSS 动画

### 3.1 基本用法

```css
@keyframes colorChange {
  0% { fill: #667eea; }
  50% { fill: #764ba2; }
  100% { fill: #667eea; }
}

.animated-circle {
  animation: colorChange 3s ease-in-out infinite;
}
```

```html
<svg>
  <circle class="animated-circle" cx="50" cy="50" r="30"/>
</svg>
```

### 3.2 Transform 动画

```css
@keyframes rotateAndScale {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.2);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.box {
  transform-origin: center;
  animation: rotateAndScale 2s ease-in-out infinite;
}
```

### 3.3 Motion Path CSS

现代浏览器支持 `offset-path`：

```css
@keyframes followPath {
  0% { offset-distance: 0%; }
  100% { offset-distance: 100%; }
}

.mover {
  offset-path: path('M10,50 Q100,10 190,50');
  animation: followPath 3s linear infinite;
}
```

---

## 4. JavaScript 动画

### 4.1 使用 Web Animation API

```javascript
const element = document.querySelector('.animated-element');

const animation = element.animate([
  { transform: 'translateX(0)', fill: '#667eea' },
  { transform: 'translateX(100px)', fill: '#764ba2' },
  { transform: 'translateX(0)', fill: '#667eea' }
], {
  duration: 1000,
  easing: 'ease-in-out',
  iterations: Infinity
});

// 控制动画
animation.pause();
animation.play();
animation.reverse();
```

### 4.2 路径动画库

**GSAP (GreenSock)** - 最强大的动画库：

```javascript
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

// 沿路径运动
gsap.to('.ball', {
  motionPath: {
    path: '#motionPath',
    align: '#motionPath',
    alignOrigin: [0.5, 0.5]
  },
  duration: 2,
  ease: 'power1.inOut',
  repeat: -1,
  yoyo: true
});
```

---

## 5. 实战示例

### 5.1 加载动画

```html
<svg width="100" height="100" viewBox="0 0 100 100">
  <style>
    .spinner {
      transform-origin: center;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  </style>
  
  <circle cx="50" cy="50" r="40" fill="none" stroke="#eee" stroke-width="8"/>
  <circle class="spinner" cx="50" cy="50" r="40" fill="none" 
    stroke="#667eea" stroke-width="8" stroke-linecap="round"
    stroke-dasharray="200" stroke-dashoffset="50"/>
</svg>
```

### 5.2 波浪动画

```html
<svg width="200" height="100" viewBox="0 0 200 100" preserveAspectRatio="none">
  <style>
    .wave {
      animation: waveMove 3s ease-in-out infinite;
    }
    .wave2 {
      animation: waveMove 3s ease-in-out infinite reverse;
      opacity: 0.5;
    }
    @keyframes waveMove {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(-25px); }
    }
  </style>
  
  <path class="wave" fill="#667eea" opacity="0.7"
    d="M0,50 Q25,30 50,50 T100,50 T150,50 T200,50 V100 H0 Z"/>
  <path class="wave2" fill="#764ba2" opacity="0.7"
    d="M0,50 Q25,70 50,50 T100,50 T150,50 T200,50 V100 H0 Z"/>
</svg>
```

### 5.3 路径绘制动画

```html
<svg width="200" height="100">
  <style>
    .draw-path {
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: draw 3s ease forwards;
    }
    @keyframes draw {
      to { stroke-dashoffset: 0; }
    }
  </style>
  
  <path class="draw-path" d="M10,50 L50,20 L90,50 L130,20 L170,50"
    fill="none" stroke="#667eea" stroke-width="3" stroke-linecap="round"/>
</svg>
```

### 5.4 渐变动画

```html
<svg width="200" height="100">
  <defs>
    <linearGradient id="animatedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#667eea">
        <animate attributeName="stop-color" 
          values="#667eea;#764ba2;#f093fb;#667eea"
          dur="3s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="#764ba2">
        <animate attributeName="stop-color"
          values="#764ba2;#f093fb;#667eea;#764ba2"
          dur="3s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
  </defs>
  
  <rect x="10" y="25" width="180" height="50" rx="25" fill="url(#animatedGradient)"/>
</svg>
```

---

## 6. 性能优化

### 6.1 启用 GPU 加速

```css
.animated-element {
  will-change: transform;
  transform: translateZ(0); /* 强制 GPU 渲染 */
}
```

### 6.2 优先使用 Transform

| 属性 | 性能 | 说明 |
|------|------|------|
| `transform` | ✅ 好 | GPU 加速 |
| `opacity` | ✅ 好 | GPU 加速 |
| `fill` / `stroke` | ⚠️ 中 | 可能触发重绘 |
| `width` / `height` | ❌ 差 | 触发布局 |

### 6.3 减少重绘

```javascript
// ❌ 不好：每次修改都触发重绘
element.setAttribute('x', x++);
element.setAttribute('y', y++);

// ✅ 好：批量更新
element.style.transform = `translate(${x++}px, ${y++}px)`;
```

### 6.4 使用 `requestAnimationFrame`

```javascript
function animate() {
  updateAnimationState();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
```

---

## 参考资料

- [SVG 动画 MDN](https://developer.mozilla.org/zh-CN/docs/Web/SVG/SVG_animation_with_SMIL)
- [CSS 动画 MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Animations)
- [Web Animation API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Animations_API)
- [GSAP](https://greensock.com/docs/v3/Plugins/MotionPathPlugin)
