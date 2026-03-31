# CSS 选择器完整知识整理

> 整理 CSS 选择器完整分类体系、优先级计算规则、Sass 选择器特性与最佳实践。

## 目录

- [1. 选择器分类体系](#1-选择器分类体系)
  - [1.1 基础选择器](#11-基础选择器)
  - [1.2 属性选择器](#12-属性选择器)
  - [1.3 组合选择器](#13-组合选择器)
  - [1.4 伪类](#14-伪类)
  - [1.5 伪元素](#15-伪元素)
- [2. 选择器优先级（Specificity）](#2-选择器优先级specificity)
  - [2.1 计算规则](#21-计算规则)
  - [2.2 !important 的特殊性](#22-important-的特殊性)
- [3. Sass 选择器特性](#3-sass-选择器特性)
  - [3.1 嵌套选择器](#31-嵌套选择器)
  - [3.2 属性嵌套](#32-属性嵌套)
  - [3.3 @at-root 跳出嵌套](#33-at-root-跳出嵌套)
  - [3.4 SassScript 选择器函数](#34-sassscript-选择器函数)
- [4. 最佳实践](#4-最佳实践)
  - [4.1 避免过深嵌套](#41-避免过深嵌套)
  - [4.2 选择器性能考量](#42-选择器性能考量)
  - [4.3 命名规范对比](#43-命名规范对比)

---

## 1. 选择器分类体系

### 1.1 基础选择器

| 选择器 | 语法 | 示例 | 说明 |
|--------|------|------|------|
| 通用选择器 | `*` | `*` | 匹配所有元素 |
| 元素选择器 | `element` | `div` | 匹配所有指定元素 |
| 类选择器 | `.classname` | `.btn` | 匹配所有 class 包含该类的元素 |
| ID 选择器 | `#idname` | `#header` | 匹配 id 为该值的元素（应唯一） |
| 属性选择器 | `[attr]` | `[disabled]` | 匹配具有指定属性的元素 |

```css
/* 基础选择器示例 */
* {
  margin: 0;
  padding: 0;
}

div {
  color: #333;
}

.btn {
  padding: 8px 16px;
}

#header {
  height: 60px;
}
```

### 1.2 属性选择器

| 选择器 | 示例 | 含义 |
|--------|------|------|
| `[attr]` | `[disabled]` | 匹配具有该属性的元素 |
| `[attr=value]` | `[type="text"]` | 属性值完全等于 |
| `[attr~=value]` | `[class~="important"]` | 属性值包含该词（空格分隔） |
| `[attr\|=value]` | `[lang\|="en"]` | 属性值等于或开头是"en-" |
| `[attr^=value]` | `[href^="https"]` | 属性值以该字符串开头 |
| `[attr$=value]` | `[src$=".png"]` | 属性值以该字符串结尾 |
| `[attr*=value]` | `[class*="col-"]` | 属性值包含该子字符串 |

```css
/* 属性选择器示例 */
[a href^="https"] {
  color: green;
}

[src$=".png"] {
  border: 1px solid #ccc;
}

[class~="btn"] {
  cursor: pointer;
}
```

### 1.3 组合选择器

| 选择器 | 名称 | 示例 | 说明 |
|--------|------|------|------|
| `A B` | 后代选择器 | `div p` | 匹配 div 内所有后代 p |
| `A > B` | 子选择器 | `ul > li` | 匹配 ul 的直接子元素 li |
| `A + B` | 相邻兄弟 | `.title + p` | 匹配 .title 后的第一个 p |
| `A ~ B` | 通用兄弟 | `.title ~ p` | 匹配 .title 后所有 p |
| `A, B` | 分组选择器 | `div, p` | 同时匹配 div 和 p |
| `A B C` | 深层后代 | `nav ul li` | 多层嵌套匹配 |

```css
/* 组合选择器示例 */
.article > h2 {
  font-size: 1.5em;
}

h2 + p {
  text-indent: 2em;
}

.special ~ .item {
  background: #f5f5f5;
}
```

### 1.4 伪类

伪类以 `:` 开头，用于选择元素的特定状态。

#### 链接伪类
```css
/* LVHA 顺序：link → visited → hover → active */
a:link { color: blue; }
a:visited { color: purple; }
a:hover { color: red; }
a:active { color: orange; }
```

#### 结构性伪类
```css
/* :first-child / :last-child / :nth-child */
li:first-child { font-weight: bold; }
li:last-child { border-bottom: none; }
tr:nth-child(even) { background: #f0f0f0; }

/* :nth-child(an+b) 公式 */
li:nth-child(3n) { color: red; }      /* 3, 6, 9... */
li:nth-child(3n+1) { color: blue; }   /* 1, 4, 7... */
li:nth-child(-n+3) { font-weight: bold; } /* 前3个 */

/* 其他结构性伪类 */
:root { --primary: #007bff; }         /* 根元素 */
div:empty { display: none; }          /* 空元素 */
p:first-of-type { margin-top: 0; }    /* 同级第一个该类型 */
p:last-of-type { margin-bottom: 0; } /* 同级最后一个该类型 */
```

#### 逻辑伪类
```css
/* :not() 否定选择器 */
input:not([type="submit"]) { border: 1px solid #ccc; }

/* :is() / :where() 容错选择器 */
:is(h1, h2, h3) { line-height: 1.2; }
:where(.container) p { padding: 1em; }

/* :has() 父选择器（现代浏览器）*/
div:has(img) { border: 1px solid #ccc; }
label:has(input:checked) { font-weight: bold; }
```

### 1.5 伪元素

伪元素以 `::` 开头，用于创建不在 DOM 中的元素。

| 伪元素 | 说明 | 常用场景 |
|--------|------|----------|
| `::before` | 元素内容前插入 | 添加图标、装饰 |
| `::after` | 元素内容后插入 | 清除浮动、添加符号 |
| `::first-line` | 首行样式 | 段落首行特殊格式 |
| `::first-letter` | 首字母样式 | 段落首字母大写 |
| `::placeholder` | 占位符样式 | 输入框占位符颜色 |
| `::selection` | 选中内容样式 | 选中文字背景色 |

```css
/* 伪元素示例 */
.btn::before {
  content: "► ";
}

.card::after {
  content: "";
  display: table;
  clear: both;
}

.article::first-letter {
  font-size: 3em;
  float: left;
  line-height: 1;
  padding-right: 0.1em;
}

::selection {
  background: #007bff;
  color: white;
}
```

---

## 2. 选择器优先级（Specificity）

### 2.1 计算规则

Specificity 由三部分组成 `(a, b, c)`：

| 等级 | 选择器类型 | 分值 |
|------|------------|------|
| a | 行内样式（`<style>` 或 `style=""`） | 1000 |
| b | ID 选择器（`#id`） | 100 |
| c | 类选择器（`.class`）、属性选择器（`[attr]`）、伪类（`:hover`） | 10 |
| c | 元素选择器（`div`）、伪元素（`::before`） | 1 |

```css
/* Specificity 计算示例 */
#header .nav li:first-child  /* (0, 1, 2) → 120 */
.nav .link:hover             /* (0, 0, 22) → 22 */
div ul li                     /* (0, 0, 3) → 3 */
```

**优先级比较**：按 `(a, b, c)` 从左到右逐位比较，不是十进制相加。

```
(1, 0, 0) > (0, 99, 99)    ✓ ID 比任何数量的 class/element 高
(0, 1, 0) > (0, 0, 99)     ✓ 1个 class 比 99个 element 高
```

### 2.2 !important 的特殊性

`!important` 会覆盖普通优先级规则，但本身也遵循一定规律：

```css
/* !important 覆盖规则 */
1. 所有 !important 一起比较 → 优先级仍起作用
2. 作者样式（author）!important > 用户代理（user agent）!important
3. 建议尽量避免使用 !important
```

```css
/* 实战中的 !important 用法 */
.clearfix::after {
  content: "" !important;
  display: block !important;
  clear: both !important;
}
```

---

## 3. Sass 选择器特性

### 3.1 嵌套选择器

```scss
/* Sass 嵌套 */
.nav {
  padding: 0;
  
  & ul {
    list-style: none;
  }
  
  & li {
    display: inline-block;
    
    &:hover {
      background: #f0f0f0;
    }
    
    // & 指向父选择器
    &:first-child {
      margin-left: 0;
    }
    
    // 属性名嵌套
    &-item {
      padding: 10px;
    }
  }
}

// 编译为：
.nav { padding: 0; }
.nav ul { list-style: none; }
.nav li { display: inline-block; }
.nav li:hover { background: #f0f0f0; }
.nav li:first-child { margin-left: 0; }
.nav li-item { padding: 10px; }
```

### 3.2 属性嵌套

```scss
/* 属性嵌套 */
.container {
  font: {
    family: Arial, sans-serif;
    size: 16px;
    weight: bold;
  }
  
  border: 1px solid {
    color: #333;
    radius: 4px;
  }
}

// 编译为：
.container {
  font-family: Arial, sans-serif;
  font-size: 16px;
  font-weight: bold;
  border: 1px solid #333;
  border-radius: 4px;
}
```

### 3.3 @at-root 跳出嵌套

```scss
/* @at-root 跳出嵌套 */
.article {
  color: #333;
  
  @at-root .special {
    color: red;
  }
}

// 编译为：
.article { color: #333; }
.special { color: red; }

/* 配合 @media 使用 */
@media print {
  .page {
    width: 100%;
    
    @at-root (without: media) {
      .no-print {
        display: none;
      }
    }
  }
}
```

### 3.4 SassScript 选择器函数

| 函数 | 说明 | 示例 |
|------|------|------|
| `selector-append()` | 追加选择器 | `selector-append(.btn, .primary)` → `.btnprimary` |
| `selector-nest()` | 嵌套选择器 | `selector-nest(.btn, &:hover)` → `.btn:hover` |
| `selector-unify()` | 合并选择器 | `selector-unify(.btn, .primary)` → `.btn.primary` |
| `selector-extend()` | 扩展选择器 | 用于 @extend |

```scss
/* Sass 选择器函数示例 */
$base: ".btn";
$states: "hover", "active", "focus";

@each $state in $states {
  #{selector-append($base, ':' + $state)} {
    background: blue;
  }
}
```

---

## 4. 最佳实践

### 4.1 避免过深嵌套

```scss
/* ❌ 过度嵌套 - 难维护、选择器臃肿 */
.article {
  .content {
    .sidebar {
      .menu {
        .item {
          .link {
            color: blue;
          }
        }
      }
    }
  }
}

/* ✅ 扁平化 - 使用类名直接命中 */
.article-content { }
.article-sidebar-menu-item-link { color: blue; }

/* ✅ 合理嵌套（最多3-4层）*/
.article {
  &-content { }
  &-sidebar {
    .menu-item { color: blue; }
  }
}
```

### 4.2 选择器性能考量

| 优化方向 | 说明 | 示例 |
|----------|------|------|
| 避免通配符 | `*` 匹配所有元素，性能差 | 改用具体选择器 |
| 避免标签选择器在 class 后 | `.btn div` 比 `div .btn` 差 | 保持选择器简短 |
| 避免派生选择器 | `ul li` 匹配所有 li | 使用直接子选择器 `ul > li` |
| 缓存选择器 | 重复选择同一元素 | 使用变量或 BEM |

```scss
/* ✅ 性能优化示例 */

/* Bad: 通配符 */
* { box-sizing: border-box; }

/* Good: 明确指定 */
html, body, div, span, applet { box-sizing: border-box; }

/* Bad: 后代选择器开销大 */
.container ul li span { }

/* Good: 直接子选择器 */
.container > ul > li > span { }

/* Good: BEM 命名直接命中 */
.nav__item-text { }
```

### 4.3 命名规范对比

#### BEM (Block Element Modifier)
```scss
// Block
.card { }

// Element (属于 Block)
.card__title { }
.card__body { }

// Modifier (Block 或 Element 的变体)
.card--featured { }
.card__title--highlighted { }
```

#### SMACSS (Scalable Modular Architecture)
```scss
// Base: 默认样式
body { color: #333; }

// Layout: 布局组件
.l-container { max-width: 1200px; }
.l-sidebar { float: left; }

// Module: 可复用模块
.module { }
.module-title { }
.module--featured { }

// State: 状态类
.is-active { }
.is-disabled { }
```

#### ITCSS (Inverted Triangle CSS)
```
1. Settings    — 变量、配置
2. Tools       — mixins、functions
3. Generic      — 重置、normalize
4. Base        — 元素选择器
5. Objects     — 结构化选择器（如 OOCSS）
6. Components  — 特定UI组件
7. Utilities   — 工具类（最高优先级）
```

---

## 参考资料

- [MDN CSS Selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors)
- [MDN Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)
- [CSS Tricks - A Complete Guide to CSS Media Queries](https://css-tricks.com/a-complete-guide-to-css-media-queries/)
- [Sass Documentation - Selectors](https://sass-lang.com/documentation/modules/selector/)
- [Polypane - The Complete Guide to CSS Media Queries](https://polypane.app/blog/the-complete-guide-to-css-media-queries/)

---

> 交互演示：打开 `examples/css/demos/selectors.html` 体验选择器实时效果
