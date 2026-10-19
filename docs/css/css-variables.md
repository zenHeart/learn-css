# CSS Variables 完全指南

> CSS 自定义属性（Custom Properties）深度学习

## 目录

- [基础语法](#基础语法)
- [作用域与继承](#作用域与继承)
- [JavaScript 交互](#javascript-交互)
- [常见用法](#常见用法)
- [主题切换实战](#主题切换实战)
- [高级技巧](#高级技巧)
- [浏览器兼容性](#浏览器兼容性)

---

## 基础语法

### 定义与使用

CSS 变量是以 `--` 开头的自定义属性：

```css
/* 定义 */
:root {
  --primary-color: #3b82f6;
  --spacing: 16px;
  --font-size-large: 1.5rem;
}

/* 使用 */
.button {
  background-color: var(--primary-color);
  padding: var(--spacing);
  font-size: var(--font-size-large);
}
```

### var() 函数

```css
/* 基本用法 */
property: var(--variable-name);

/* 带默认值 */
property: var(--variable-name, default-value);

/* 多个默认值 */
property: var(--variable-name, default1, default2);
```

### 支持的类型

```css
:root {
  /* 颜色 */
  --color: #3b82f6;
  
  /* 数值 */
  --spacing: 16px;
  --opacity: 0.5;
  
  /* 字符串 */
  --font-family: "Helvetica Neue", sans-serif;
  
  /* 多值 */
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  /* URL */
  --logo-url: url("/logo.png");
  
  /* 多个值 */
  --border: 1px solid var(--color);
}
```

---

## 作用域与继承

### 全局作用域

```css
:root {
  --global-var: value;
}
```

`:root` 是文档最高层级，等同于 `html` 选择器。

### 局部作用域

```css
.component {
  --component-var: value; /* 仅在该组件内有效 */
}

.nested {
  /* 继承父级的 CSS 变量 */
  background: var(--component-var);
}
```

### 层级覆盖

CSS 变量会沿着 DOM 树向上查找：

```css
:root { --color: blue; }
.parent { --color: red; }
.child { --color: green; }

<div class="root">
  <div class="parent">
    <div class="child">
      <!-- color = green -->
    </div>
  </div>
</div>
```

### 继承机制

```html
<style>
  .parent {
    --custom-prop: "from parent";
  }
</style>

<div class="parent">
  <div class="child">
    <!-- 自动继承 parent 的 --custom-prop -->
  </div>
</div>
```

---

## JavaScript 交互

### 读取变量

```javascript
// 读取计算样式中的变量
const styles = getComputedStyle(element);
const color = styles.getPropertyValue('--primary-color');

// 或使用 ES6 解构
const value = element.style.getPropertyValue('--var-name');
```

### 写入变量

```javascript
// 设置变量
element.style.setProperty('--primary-color', '#10b981');

// 带单位
element.style.setProperty('--spacing', '24px');

// 移除变量
element.style.removeProperty('--primary-color');
```

### 完整示例

```javascript
// 动态主题切换
function setTheme(themeName) {
  const root = document.documentElement;
  
  const themes = {
    light: {
      '--bg-color': '#ffffff',
      '--text-color': '#111827',
      '--primary': '#3b82f6'
    },
    dark: {
      '--bg-color': '#111827',
      '--text-color': '#f9fafb',
      '--primary': '#60a5fa'
    }
  };
  
  const theme = themes[themeName];
  Object.entries(theme).forEach(([prop, value]) => {
    root.style.setProperty(prop, value);
  });
}
```

### 监听变量变化

```javascript
// 使用 MutationObserver 监听 style 属性变化
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'style') {
      console.log('Styles changed!');
    }
  });
});

observer.observe(document.documentElement, { attributes: true });

// CSS 中监听（需要浏览器支持）
@property --color {
  syntax: '<color>';
  inherits: true;
  initial-value: #3b82f6;
}
```

---

## 常见用法

### 1. 统一管理值

```css
:root {
  /* 间距系统 */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  
  /* 颜色系统 */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-500: #6b7280;
  --gray-700: #374151;
  --gray-900: #111827;
  
  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
}

.button {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
}
```

### 2. 组件变体

```css
.button {
  --btn-bg: var(--primary);
  --btn-color: white;
  --btn-padding: 12px 24px;
  
  background: var(--btn-bg);
  color: var(--btn-color);
  padding: var(--btn-padding);
}

.button--secondary {
  --btn-bg: transparent;
  --btn-color: var(--primary);
  --btn-padding: 8px 16px;
}

.button--large {
  --btn-padding: 16px 32px;
  font-size: 1.25rem;
}
```

### 3. 响应式设计

```css
:root {
  --container-width: 100%;
  --columns: 1;
  --gap: 16px;
}

@media (min-width: 640px) {
  :root {
    --container-width: 640px;
    --columns: 2;
  }
}

@media (min-width: 1024px) {
  :root {
    --container-width: 1024px;
    --columns: 3;
    --gap: 24px;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  gap: var(--gap);
  max-width: var(--container-width);
}
```

### 4. 动画与过渡

```css
:root {
  --transition-duration: 0.3s;
  --transition-easing: ease;
}

.interactive {
  transition: 
    transform var(--transition-duration) var(--transition-easing),
    box-shadow var(--transition-duration) var(--transition-easing);
}

.interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

---

## 主题切换实战

### 多主题系统

```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f3f4f6;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --border-color: #374151;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* 使用 */
.card {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}
```

```javascript
// 主题切换
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

// 初始化
const saved = localStorage.getItem('theme');
if (saved) {
  document.documentElement.setAttribute('data-theme', saved);
}
```

### 品牌主题

```css
:root {
  /* 默认蓝色主题 */
  --brand-hue: 217;
  --brand-saturation: 91%;
  --brand-lightness: 60%;
  --brand-color: hsl(var(--brand-hue), var(--brand-saturation), var(--brand-lightness));
}

/* 绿色主题 */
[data-brand="green"] {
  --brand-hue: 142;
}

/* 紫色主题 */
[data-brand="purple"] {
  --brand-hue: 270;
}

/* 使用 */
.button {
  background: var(--brand-color);
}
```

---

## 高级技巧

### 条件变量

```css
/* 使用 @supports 检查 */
@supports (background: var(--primary)) {
  .element {
    background: var(--primary);
  }
}

/* 组合多个变量 */
.complex {
  background: linear-gradient(
    to right,
    var(--color-start),
    var(--color-end)
  );
}
```

### 字符串拼接

```css
:root {
  --icon-prefix: "icon-";
  --icon-name: "home";
}

.icon::before {
  /* 注意：CSS 变量不支持真正的字符串拼接 */
  /* 需要使用 content 或其他方式 */
}
```

### 数学运算

```css
:root {
  --base-size: 16px;
  --scale-ratio: 1.25;
}

.heading-1 { font-size: calc(var(--base-size) * var(--scale-ratio) * var(--scale-ratio)); }
.heading-2 { font-size: calc(var(--base-size) * var(--scale-ratio)); }
.heading-3 { font-size: var(--base-size); }
```

### @property 定义（Houdini）

```css
@property --gradient-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.rotating-gradient {
  background: conic-gradient(
    from var(--gradient-angle),
    #3b82f6,
    #10b981,
    #3b82f6
  );
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  to { --gradient-angle: 360deg; }
}
```

---

## 浏览器兼容性

### 支持情况

| 浏览器 | 版本 | 支持 |
|--------|------|------|
| Chrome | 49+ | ✅ |
| Firefox | 31+ | ✅ |
| Safari | 9.1+ | ✅ |
| Edge | 15+ | ✅ |
| IE | 不支持 | ❌ |

### 渐进增强

```css
/* 基础样式（所有浏览器） */
.element {
  color: #3b82f6;
  padding: 16px;
}

/* 增强样式（支持 CSS 变量的浏览器） */
@supports (color: var(--primary)) {
  .element {
    color: var(--primary);
    padding: var(--spacing);
  }
}
```

### 回退方案

```css
.button {
  /* 回退值 */
  background-color: #3b82f6;
  background-color: var(--primary-color, #3b82f6);
}
```

---

## 最佳实践

1. **命名规范**
   - 使用 kebab-case：`--primary-color`
   - 使用语义化命名：`--color-text-primary`
   - 避免过于通用的名称：`--temp-1`

2. **组织结构**
   ```css
   :root {
     /* 颜色 */
     --color-primary: ...;
     --color-secondary: ...;
     
     /* 间距 */
     --space-xs: ...;
     --space-sm: ...;
     
     /* 字体 */
     --font-size-sm: ...;
     --font-size-md: ...;
     
     /* 组件变量 */
     --button-bg: ...;
     --button-color: ...;
   }
   ```

3. **默认值**
   - 始终提供合理的默认值
   - 使用 `var(--name, fallback)` 语法

4. **性能注意**
   - 避免在 CSS 动画中频繁修改 CSS 变量
   - 使用 `@property` 定义类型以启用 GPU 加速

---

## 相关资源

- [MDN: CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Tricks: Custom Properties](https://css-tricks.com/css-custom-properties/)
- [Google Web Fundamentals](https://web.dev/learn/css/custom-properties/)
