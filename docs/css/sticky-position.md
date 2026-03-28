# CSS Sticky 定位完全指南

> 本文档详细解析 CSS `position: sticky` 的工作原理、实现卡片内部按钮固定效果的方案，以及常见陷阱与最佳实践。

---

## 一、Sticky 定位核心原理

### 1.1 什么是 Sticky 定位？

`position: sticky` 是一种**混合定位模式**，元素在滚动容器中表现为：

- **未滚动时**：相当于 `position: relative`
- **滚动超过阈值时**：相当于 `position: fixed`

```css
.sticky-element {
  position: sticky;
  top: 0; /* 距离顶部 0px 时固定 */
}
```

### 1.2 生效的必要条件

Sticky 要正常工作，必须满足以下条件：

| 条件 | 说明 | 常见错误 |
|------|------|----------|
| 父容器不能有 `overflow: hidden/auto/scroll` | 否则会创建 BFC，阻断滚动传播 | 父元素设置了 `overflow: hidden` |
| 父容器高度必须大于 sticky 元素 | 否则没有滚动空间 | 父元素高度为 0 或 auto |
| 必须指定 top/bottom/left/right 之一 | 否则行为等同于 `position: relative` | 忘记写 `top: 0` |
| 祖先元素不能有 `transform` 属性 | transform 会创建新的 containing block | 祖先有 `transform: translateZ(0)` |

### 1.3 滚动阈值计算

```
sticky 触发位置 = sticky 元素顶部位置 - top 值
sticky 解除位置 = 父容器底部 - sticky 元素高度 - top 值
```

---

## 二、Sticky vs 其他定位对比

| 定位类型 | 参照物 | 脱标 | 滚动时行为 |
|----------|--------|------|------------|
| `relative` | 元素原位置 | 否 | 随页面滚动 |
| `absolute` | 最近的定位祖先 | 是 | 随容器滚动 |
| `fixed` | 视口 | 是 | 固定不动 |
| `sticky` | 滚动容器 | 否 | 未达阈值随页面滚动，超过后固定 |

---

## 三、Sticky 实现卡片内按钮固定

### 3.1 核心场景

需求：卡片在页面中滚动，当卡片顶部滚过视口顶部时，卡片内部的「操作按钮」需要固定在视口顶部。

```
初始状态：
┌─────────────────────┐
│        页面         │
│  ┌─────────────────┐│
│  │    卡片内容      ││
│  │                 ││
│  │    [按钮]       ││  ← 按钮在卡片内部
│  └─────────────────┘│
└─────────────────────┘

滚动后：
┌─────────────────────┐
│  [按钮]              │  ← 按钮固定在视口顶部
├─────────────────────┤
│  卡片内容（继续滚动）  │
│  ...                │
└─────────────────────┘
```

### 3.2 实现方案

#### 方案一：Sticky 包裹按钮（推荐）

```html
<div class="card">
  <div class="card-content">
    <!-- 卡片内容 -->
    <p>这里是很长的卡片内容...</p>
    <p>会随着页面滚动而滚动...</p>
  </div>
  <div class="card-sticky-footer">
    <button class="sticky-btn">操作按钮</button>
  </div>
</div>
```

```css
.card {
  position: relative;
  margin-bottom: 20px;
}

.card-sticky-footer {
  position: sticky;
  bottom: 0;
  background: white;
  padding: 10px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
}

.sticky-btn {
  width: 100%;
  padding: 12px;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
```

#### 方案二：按钮独立 sticky

```css
.card {
  position: relative;
  padding-bottom: 60px; /* 为固定按钮留出空间 */
}

.sticky-btn {
  position: sticky;
  bottom: 10px;
  width: calc(100% - 20px);
  margin: 0 10px;
  padding: 12px;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 8px;
}
```

### 3.3 完整示例代码

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Sticky 卡片按钮固定示例</title>
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f5f5f5;
  }

  h1 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
  }

  .container {
    max-width: 400px;
    margin: 0 auto;
  }

  /* 卡片样式 */
  .card {
    position: relative;
    background: white;
    border-radius: 12px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
  }

  .card-image {
    width: 100%;
    height: 150px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    object-fit: cover;
  }

  .card-body {
    padding: 16px;
  }

  .card-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
  }

  .card-text {
    font-size: 14px;
    color: #666;
    line-height: 1.6;
  }

  /* Sticky 按钮容器 */
  .card-footer {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 12px 16px;
    border-top: 1px solid #eee;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  }

  /* 固定按钮 */
  .btn-primary {
    width: 100%;
    padding: 12px 20px;
    background: #007AFF;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-primary:hover {
    background: #0056b3;
  }

  /* 滚动提示 */
  .scroll-hint {
    text-align: center;
    padding: 20px;
    color: #999;
    font-size: 14px;
  }
</style>
</head>
<body>
  <div class="container">
    <h1>卡片内按钮 Sticky 固定效果</h1>

    <div class="scroll-hint">↓ 向下滚动查看效果 ↓</div>

    <!-- 卡片 1 -->
    <div class="card">
      <img src="https://picsum.photos/400/150?random=1" alt="卡片图片" class="card-image">
      <div class="card-body">
        <h3 class="card-title">卡片标题 1</h3>
        <p class="card-text">
          这是卡片的内容区域。向下滚动页面，当这个卡片滚过视口顶部时，底部的按钮将自动固定在视口底部...
        </p>
      </div>
      <div class="card-footer">
        <button class="btn-primary">操作按钮 1</button>
      </div>
    </div>

    <!-- 卡片 2 -->
    <div class="card">
      <img src="https://picsum.photos/400/150?random=2" alt="卡片图片" class="card-image">
      <div class="card-body">
        <h3 class="card-title">卡片标题 2</h3>
        <p class="card-text">
          继续滚动。每个卡片的按钮都是独立固定的，不会互相影响...
        </p>
      </div>
      <div class="card-footer">
        <button class="btn-primary">操作按钮 2</button>
      </div>
    </div>

    <!-- 卡片 3 -->
    <div class="card">
      <img src="https://picsum.photos/400/150?random=3" alt="卡片图片" class="card-image">
      <div class="card-body">
        <h3 class="card-title">卡片标题 3</h3>
        <p class="card-text">
          这是第三张卡片。Sticky 定位只在父容器内有效，所以每个卡片都有独立的 sticky 行为。
        </p>
      </div>
      <div class="card-footer">
        <button class="btn-primary">操作按钮 3</button>
      </div>
    </div>

    <div class="scroll-hint">↑ 已到底部 ↑</div>
  </div>
</body>
</html>
```

---

## 四、常见问题与解决方案

### 4.1 Sticky 不生效

**检查清单：**

```css
/* 1. 父容器 overflow 检查 */
.parent {
  overflow: visible; /* 不是 hidden/auto/scroll */
}

/* 2. 父容器高度检查 */
.parent {
  min-height: 100vh; /* 确保有滚动空间 */
}

/* 3. top/bottom/left/right 至少写一个 */
.sticky {
  position: sticky;
  top: 0; /* 必写！ */
}

/* 4. 祖先元素 transform 检查 */
.ancestor:not(.no-transform) {
  transform: none; /* 移除 transform */
}
```

### 4.2 Sticky 在 iOS Safari 失效

iOS Safari 的某些版本对 sticky 支持有问题，解决方案：

```css
.sticky-element {
  position: sticky;
  top: 0;
  -webkit-position: sticky; /* iOS Safari hack */
  transform: translateZ(0); /* 触发 GPU 加速但不创建新 stacking context */
}
```

### 4.3 多个 Sticky 元素重叠

```css
/* 确保每个 sticky 元素有不同的高度或偏移 */
.sticky-1 { top: 0; }
.sticky-2 { top: 50px; } /* 错开位置 */
```

---

## 五、实际应用场景

### 5.1 表单提交按钮固定

```html
<div class="form-container">
  <div class="form-content">
    <!-- 长表单内容 -->
  </div>
  <div class="form-footer">
    <button type="submit">提交表单</button>
  </div>
</div>

<style>
.form-container {
  position: relative;
  padding-bottom: 70px;
}

.form-footer {
  position: sticky;
  bottom: 0;
  background: white;
  padding: 15px;
  border-top: 1px solid #ddd;
}
</style>
```

### 5.2 表格列头固定

```html
<table class="sticky-table">
  <thead>
    <tr>
      <th>列1</th>
      <th>列2</th>
      <th>列3</th>
    </tr>
  </thead>
  <tbody>
    <!-- 大量数据行 -->
  </tbody>
</table>

<style>
.sticky-table thead th {
  position: sticky;
  top: 0;
  background: #f5f5f5;
  z-index: 1;
}
</style>
```

### 5.3 导航项高亮跟随

```html
<div class="nav-container">
  <div class="nav-item active">Section 1</div>
  <div class="nav-item">Section 2</div>
  <div class="nav-item">Section 3</div>
</div>
<div class="content">
  <section id="s1">...</section>
  <section id="s2">...</section>
  <section id="s3">...</section>
</div>

<style>
.nav-container {
  position: sticky;
  top: 0;
  background: white;
}
</style>
```

---

## 六、浏览器兼容性

| 浏览器 | 支持版本 | 备注 |
|--------|----------|------|
| Chrome | 56+ | 完全支持 |
| Firefox | 59+ | 完全支持 |
| Safari | 6.1+ (iOS 7.1+) | 需要 -webkit- 前缀 |
| Edge | 16+ | 完全支持 |
| IE | 不支持 | 使用 position: fixed 降级 |

### 降级方案

```css
@supports (position: sticky) {
  .sticky-element {
    position: sticky;
    top: 0;
  }
}

@supports not (position: sticky) {
  .sticky-element {
    position: fixed;
    top: 0;
    width: 100%;
  }
}
```

---

## 七、决策树：选择哪种定位方案？

```
需要元素固定在视口？
    │
    ├── 是 → 是否需要随页面滚动而进入/退出？
    │       │
    │       ├── 是 → position: sticky + top/bottom
    │       └── 否 → position: fixed
    │
    └── 否 → 元素是否相对于自身位置偏移？
            │
            ├── 是 → position: relative
            └── 否 → 是否需要相对于祖先定位？
                    │
                    ├── 是 → position: absolute
                    └── 否 → position: static (默认)
```

---

## 八、关键总结

1. **Sticky = relative + fixed 的混合体**，在阈值前后表现不同
2. **父容器是关键**，overflow/height/transform 都会影响 sticky 行为
3. **必须指定 top/bottom/left/right**，否则等同于 relative
4. **iOS Safari 需要 -webkit- 前缀**和一些 hack
5. **没有完美的 sticky**，复杂场景考虑 JavaScript 或 fixed 替代

---

## 九、参考资料

- [MDN: position](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
- [CSS Tricks: Sticky](https://css-tricks.com/position-sticky/)
- [Caniuse: position: sticky](https://caniuse.com/css-sticky)
