# CSS 最佳编写顺序

## 概述

CSS 属性的编写顺序会影响代码的可读性和维护性。一致的编写顺序让团队协作更高效，也让代码审查更容易。本文介绍几种广泛采用的 CSS 编写顺序规范。

## 属性分类法（Concentric CSS）

将 CSS 属性按从外到内、从布局到装饰的顺序编写：

```css
.selector {
  /* 1. 位置与布局（Positioning） */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;

  /* 2. 盒模型（Box Model） */
  display: flex;
  width: 100%;
  height: 200px;
  padding: 20px;
  margin: 10px;
  border: 1px solid #ccc;
  overflow: hidden;

  /* 3. 视觉样式（Visual） */
  background: #f5f5f5;
  color: #333;
  font-size: 16px;
  line-height: 1.5;
  opacity: 1;

  /* 4. 交互与动画（Interactive） */
  cursor: pointer;
  transform: scale(1.05);
  transition: all 0.3s ease;

  /* 5. 其他（Misc） */
  visibility: visible;
  pointer-events: auto;
}
```

## 分类顺序表

### 1. 布局属性（Layout）

```css
display
float
clear
position
top
right
bottom
left
z-index
```

### 2. 盒模型属性（Box Model）

```css
width
height
padding
margin
border
border-radius
overflow
box-sizing
```

### 3. 背景与装饰（Visual）

```css
background
background-color
background-image
background-position
background-size
background-repeat
color
opacity
visibility
```

### 4. 文本属性（Typography）

```css
font
font-family
font-size
font-weight
font-style
font-variant
line-height
text-align
text-decoration
text-indent
text-overflow
text-transform
white-space
word-break
letter-spacing
```

### 5. 变换与动画（Transform & Animation）

```css
transform
transition
animation
```

### 6. 其他属性（Misc）

```css
cursor
pointer-events
list-style
outline
resize
user-select
```

## 通用顺序模板

```css
.selector {
  /* 定位 */
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;

  /* 盒模型 */
  display: flex;
  width: 100px;
  height: 100px;
  padding: 10px;
  margin: 10px;
  border: 1px solid #000;
  border-radius: 4px;
  overflow: hidden;
  box-sizing: border-box;

  /* 背景 */
  background-color: #fff;
  background-image: url();
  background-position: center;
  background-size: cover;

  /* 文本 */
  color: #333;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.5;
  text-align: center;

  /* 装饰 */
  opacity: 1;
  visibility: visible;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  /* 变换与动画 */
  transform: translateX(10px);
  transition: all 0.3s ease;
  animation: fadeIn 0.3s ease;

  /* 其他 */
  cursor: pointer;
  pointer-events: auto;
}
```

## 常见框架的编写顺序

### Tailwind CSS 的思路

Tailwind 采用**原子化 CSS** 思路，将属性分解为单一职责的类：

```html
<!-- 相当于：position: relative; padding: 16px; background: white; -->
<div class="relative p-4 bg-white">
  内容
</div>
```

### BEM 命名 + 分类顺序

BEM（Block Element Modifier）命名规范：

```css
/* Block */
.card {
  /* 布局 */
  display: flex;
  flex-direction: column;

  /* 盒模型 */
  padding: 20px;
  margin: 16px;

  /* 视觉 */
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Element */
.card__header {
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.card__title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* Modifier */
.card--featured {
  border: 2px solid #0066cc;
}

.card--featured .card__title {
  color: #0066cc;
}
```

## 实用技巧

### 1. 按字母顺序排列（同类别内）

```css
.box {
  /* 同类别内按字母顺序 */
  background-attachment: fixed;
  background-color: #fff;
  background-image: url();
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
```

### 2. 使用 CSS 属性简写

```css
/* 推荐：使用简写 */
padding: 10px 20px;
margin: 0 auto;
font: 14px/1.5 Arial, sans-serif;
border: 1px solid #ccc;
background: #f5f5f5 url() center/cover no-repeat;

/* 注意：明确设置时可以分开写 */
padding-top: 10px;
padding-right: 20px;
padding-bottom: 10px;
padding-left: 20px;
```

### 3. 合理分组，添加注释

```css
.component {
  /*
   * 布局
   */
  position: relative;
  display: flex;

  /*
   * 盒模型
   */
  width: 100%;
  height: auto;
  padding: 16px;
  margin: 0;

  /*
   * 视觉
   */
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  /*
   * 文本
   */
  font-size: 14px;
  line-height: 1.5;
  color: #333;

  /*
   * 交互
   */
  cursor: pointer;
  transition: all 0.2s ease;
}
```

## 常见场景示例

### 场景 1：按钮样式

```css
.btn {
  /* 布局 */
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* 盒模型 */
  padding: 8px 16px;
  margin: 4px;
  border: none;
  border-radius: 4px;
  box-sizing: border-box;

  /* 文本 */
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  text-align: center;
  text-decoration: none;
  color: #fff;

  /* 视觉 */
  background-color: #0066cc;

  /* 交互 */
  cursor: pointer;
  opacity: 1;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.btn:hover {
  background-color: #0052a3;
}

.btn:active {
  transform: scale(0.98);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
```

### 场景 2：卡片组件

```css
.card {
  /* 布局 */
  position: relative;
  display: flex;
  flex-direction: column;

  /* 盒模型 */
  width: 300px;
  min-height: 200px;
  padding: 0;
  margin: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;

  /* 视觉 */
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  /* 文本 */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #333;

  /* 交互 */
  cursor: pointer;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card__image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.card__content {
  padding: 16px;
}

.card__title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.card__description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}
```

### 场景 3：表单输入框

```css
.input {
  /* 盒模型 */
  display: block;
  width: 100%;
  padding: 10px 12px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;

  /* 文本 */
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  color: #333;

  /* 视觉 */
  background-color: #fff;
  outline: none;

  /* 交互 */
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input:focus {
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
}

.input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.input--error {
  border-color: #dc3545;
}

.input--error:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}
```

## 编辑器配置

### ESLint + stylelint 规则

```json
{
  "rules": {
    "order/properties-order": [
      "position",
      "top",
      "right",
      "bottom",
      "left",
      "z-index",
      "display",
      "flex",
      "flex-direction",
      "flex-wrap",
      "justify-content",
      "align-items",
      "width",
      "height",
      "padding",
      "margin",
      "border",
      "border-radius",
      "background",
      "color",
      "font",
      "line-height",
      "text-align",
      "transition",
      "transform",
      "opacity",
      "cursor"
    ]
  }
}
```

### Prettier 配置

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

## 最佳实践总结

| 原则 | 说明 |
|------|------|
| **一致性** | 整个项目使用统一的编写顺序 |
| **分类清晰** | 按属性类别分组，必要时添加注释 |
| **重要优先** | 更重要的属性（定位、盒模型）放在前面 |
| **字母顺序** | 同类别内可按字母顺序排列 |
| **简写优先** | 合理使用 CSS 简写属性 |
| **移动端优先** | 移动端相关属性放在前面 |

## 常见排序规范推荐

### Idiomatic CSS 顺序

```css
1. Positioning
2. Box Model
3. Typography
4. Visual
5. Misc
```

### Google HTML/CSS Style Guide 顺序

```css
1. display
2. list-style
3. position
4. float
5. clear
6. width / height
7. padding / margin
8. border / background
9. color / font
10. text-decoration
11. vertical-align
12. white-space
13. other text properties
14. content
```

### SMACSS 规则顺序

```css
1. Base (reset/normalize)
2. Layout (header, footer, grid)
3. Module (reusable components)
4. State (hover, active, disabled)
5. Theme (colors, fonts)
```

## 参考资源

- [CSS Guidelines - Property Ordering](https://cssguidelin.es/#property-ordering)
- [CodeGuide - CSS Property Order](http://codeguide.co/#css-property-order)
- [Idiomatic CSS - Property Order](https://github.com/necolas/idiomatic-css#declaration-order)
- [Google CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html#CSS_Property_Order)
- [SMACSS - CSS File Organization](https://smacss.com/book/categorizing)
