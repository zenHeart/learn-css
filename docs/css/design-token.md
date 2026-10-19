# Design Token 设计系统基础

> Design Token 是设计系统中连接设计与开发的核心桥梁，通过结构化的方式存储设计决策。

## 什么是 Design Token？

Design Token（设计令牌）是用**命名变量**存储设计决策结果的格式，用于在设计工具和代码之间传递和同步设计值。

```json
{
  "color": {
    "primary": "#3B82F6",
    "secondary": "#8B5CF6"
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px"
  }
}
```

---

## Design Token 的层级

### 1. Global Token（全局令牌）

设计的原始值，通常与品牌色板对应：

```json
{
  "color": {
    "blue-500": "#3B82F6",
    "blue-600": "#2563EB"
  }
}
```

### 2. Semantic Token（语义令牌）

描述用途而非具体值，便于主题切换：

```json
{
  "color": {
    "background": {
      "primary": "{color.blue-500}",
      "secondary": "{color.gray-100}"
    },
    "text": {
      "primary": "{color.gray-900}",
      "secondary": "{color.gray-600}"
    }
  }
}
```

### 3. Component Token（组件令牌）

组件级别的覆盖值：

```json
{
  "button": {
    "primary": {
      "background": "{color.background.primary}",
      "text": "{color.text.primary}"
    }
  }
}
```

---

## 常见 Design Token 类型

### 颜色

```css
:root {
  --color-brand-primary: #3B82F6;
  --color-brand-secondary: #8B5CF6;
  --color-status-success: #10B981;
  --color-status-warning: #F59E0B;
  --color-status-danger: #EF4444;
  --color-neutral-50: #F9FAFB;
  --color-neutral-100: #F3F4F6;
  --color-neutral-900: #111827;
}
```

### 间距

```css
:root {
  --spacing-0: 0px;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-12: 48px;
}
```

### 字体

```css
:root {
  --font-family-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-family-mono: "SF Mono", Consolas, monospace;
  
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;      /* 16px */
  --font-size-lg: 1.125rem;    /* 18px */
  --font-size-xl: 1.25rem;     /* 20px */
  
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
```

### 圆角

```css
:root {
  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

### 阴影

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
```

---

## Design Token 工具链

### 1. Token 格式转换

| 工具 | 功能 |
|------|------|
| [Style Dictionary](https://amzn.github.io/style-dictionary/) | Amazon 开源的 Token 转换工具 |
| [Theo](https://github.com/salesforce-ux/theo) | Salesforce 的 Token 管理库 |
| [Token Studio](https://tokens.studio/) | Figma 插件，直接从 Figma 生成 Token |

### 2. Style Dictionary 使用示例

```javascript
// style-dictionary.config.js
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'theme',
      buildPath: 'dist/css/',
      files: [{
        destination: 'variables.css',
        format: 'css/variables'
      }]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/js/',
      files: [{
        destination: 'tokens.js',
        format: 'javascript/es6'
      }]
    }
  }
};
```

### 3. Figma Token Studio 工作流

```
Figma 设计稿
    ↓（使用 Token Studio 插件）
Design Token（JSON/YAML）
    ↓（Style Dictionary 转换）
CSS Variables / JS Module / iOS Swift / Android XML
```

---

## 主题切换实现

### 基础：CSS Variables 主题

```css
/* 默认主题 */
:root {
  --color-primary: #3B82F6;
  --color-bg: #FFFFFF;
  --color-text: #111827;
}

/* 暗色主题 */
[data-theme="dark"] {
  --color-primary: #60A5FA;
  --color-bg: #111827;
  --color-text: #F9FAFB;
}
```

### JS 切换

```javascript
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// 读取保存的主题
const saved = localStorage.getItem('theme');
if (saved) setTheme(saved);
```

---

## Design Token 最佳实践

### 1. 命名规范

- 使用**语义化命名**：`--color-text-primary` 而非 `--blue-500`
- 使用**kebab-case**：`--spacing-md` 而非 `--spacingMd`
- 按**用途分组**：`--color-*`, `--spacing-*`, `--font-*`

### 2. 避免硬编码

```css
/* ❌ 不好：硬编码 */
.button { background: #3B82F6; padding: 16px; }

/* ✅ 好：使用 Token */
.button { background: var(--color-primary); padding: var(--spacing-4); }
```

### 3. 保持一致性

- 定义 Scale（如 spacing: 4/8/12/16/24/32/48）
- 不要随意添加不规则的 Token 值
- 定期审查和清理未使用的 Token

---

## 常见问题

### Q: Design Token 和 CSS Variables 有什么区别？

**Design Token 是一种设计决策的格式**，可以是 JSON/YAML/Dart 文件。**CSS Variables 是 CSS 的语法**，用于在浏览器中使用这些 Token。

Style Dictionary 等工具可以把 Design Token（JSON）转换为 CSS Variables。

### Q: 如何处理多品牌/多主题？

使用 Semantic Token 抽象基础值：

```json
{
  "brand": {
    "primary": "#3B82F6",
    "secondary": "#8B5CF6"
  },
  "theme-a": {
    "primary": "{brand.primary}",
    "background": "#FFFFFF"
  },
  "theme-b": {
    "primary": "#10B981",
    "background": "#F9FAFB"
  }
}
```

### Q: Token 太多难以管理怎么办？

1. **分层**：Global → Semantic → Component
2. **分组**：使用 JSON/YAML 结构组织
3. **工具**：使用 Style Dictionary 管理转换

---

## 相关资源

- [Design Tokens W3C Community Group](https://design-tokens.github.io/community-group/)
- [Style Dictionary 官方文档](https://amzn.github.io/style-dictionary/)
- [Token Studio for Figma](https://tokens.studio/)
- [Design Systems for Design Engineers](https://design-systems.io/)
