# word-break 属性详解

> CSS 文本换行核心属性，区分 word-break 与 overflow-wrap 的使用场景

## 1. 核心概念：两个属性的区别

在 CSS 文本换行体系中，`word-break` 和 `overflow-wrap` 是两个容易混淆但作用不同的属性。

| 属性 | 作用对象 | 典型场景 |
|------|----------|----------|
| `word-break` | **所有字符**的换行规则 | 控制 CJK/非 CJK 混合文本的断行行为 |
| `overflow-wrap`（原 `word-wrap`） | **长单词/长字符串**的换行 | 防止单行文本溢出容器 |

**关键区别**：
- `word-break: break-all` 会在**任意字符**间断行，不考虑单词完整性
- `overflow-wrap: break-word` 只在**单词本身放不下**时才断行，优先保持单词完整性

```css
/* 二者对比 */
.word-break-example {
  word-break: break-all;      /* 任意位置断行 */
  overflow-wrap: break-word;  /* 单词不放不下才断行 */
}
```

---

## 2. word-break 属性

### 2.1 属性值

```css
word-break: normal;      /* 默认换行规则 */
word-break: break-all;   /* 在任意字符间断行（CJK 文本除外） */
word-break: keep-all;    /* CJK 文本不断行，非 CJK 同 normal */
word-break: break-word;  /* ⚠️ 已废弃，不推荐使用 */
word-break: auto-phrase; /* 实验性：根据语义断行 */
```

### 2.2 各值详解

#### `normal`（默认值）

使用浏览器的默认换行规则。

```css
.normal {
  word-break: normal;
}
```

#### `break-all`

为防止溢出，在**任意字符间**插入换行点（CJK 文本除外）。

```css
.break-all {
  word-break: break-all;
}
```

**效果**：长单词和 URL 会被截断换行，不考虑完整性。

#### `keep-all`

CJK（中文、日文、韩文）文本不断行。非 CJK 文本行为等同于 `normal`。

```css
.keep-all {
  word-break: keep-all;
}
```

**场景**：中文文章阅读时不希望出现奇怪断词。

---

## 3. overflow-wrap 属性

### 3.1 属性值

```css
overflow-wrap: normal;   /* 默认，只在空格处断行 */
overflow-wrap: break-word; /* 单词放不下时断行 */
overflow-wrap: anywhere;  /* 类似 break-word，但影响 min-content 计算 */
```

### 3.2 各值详解

#### `normal`

仅在正常的单词断点（空格、连字符）处换行。

```css
.normal {
  overflow-wrap: normal;
}
```

#### `break-word`（推荐）

当单词本身在当前行放不下时，才允许在任意点断行。

```css
.break-word {
  overflow-wrap: break-word;
}
```

**特点**：优先保持单词完整性，与 `word-break: normal` 效果等价。

#### `anywhere`

与 `break-word` 类似，但软换行点**会参与** `min-content` 内在尺寸计算。

```css
.anywhere {
  overflow-wrap: anywhere;
}
```

---

## 4. break-word 废弃说明

### 4.1 word-break: break-word 已废弃

`word-break: break-word` 在 CSS Text Module Level 3 中已被标记为废弃。

**废弃原因**：`break-word` 的行为可以通过组合 `overflow-wrap: break-word` + `word-break: normal` 完全替代。

```css
/* 废弃写法 */
.deprecated {
  word-break: break-word;
}

/* 标准等价写法 */
.standard {
  overflow-wrap: break-word;
  word-break: normal;
}
```

### 4.2 推荐标准写法

| 需求 | 推荐写法 |
|------|----------|
| 防止长单词溢出 | `overflow-wrap: break-word;` |
| 任意位置断行 | `word-break: break-all;` |
| 中文不断行 | `word-break: keep-all;` |
| 语义感知断行 | `word-break: auto-phrase;`（实验性） |

---

## 5. 代码示例

### 5.1 基础对比

```html
<p class="example-normal">
  This is a long and Honorificabilitudinitatibus califragilisticexpialidocious word.
</p>

<p class="example-break-all">
  This is a long and Honorificabilitudinitatibus califragilisticexpialidocious word.
</p>

<p class="example-overflow-wrap">
  This is a long and Honorificabilitudinitatibus califragilisticexpialidocious word.
</p>
```

```css
.example-normal,
.example-break-all,
.example-overflow-wrap {
  width: 500px;
  padding: 10px;
  border: 1px solid #ccc;
  margin: 10px 0;
  font-size: 16px;
}

.example-normal {
  word-break: normal;
}

.example-break-all {
  word-break: break-all;
}

.example-overflow-wrap {
  overflow-wrap: break-word;
  word-break: normal;
}
```

**效果说明**：

- `normal`：在空格处换行，长单词可能溢出
- `break-all`：任意字符间断行，长单词被截断
- `overflow-wrap: break-word` + `word-break: normal`：长单词放不下时才断行

### 5.2 防止 URL 溢出

```css
.url-container {
  width: 300px;
  padding: 10px;
  border: 1px solid #ccc;
  overflow-wrap: break-word; /* 推荐写法 */
  word-break: normal;
}
```

```html
<div class="url-container">
  <p>访问我们的网站：https://this-is-a-very-long-url-example.com/with/many/path/segments</p>
</div>
```

### 5.3 兼容旧浏览器的安全写法

```css
/* 安全写法：同时保留 word-wrap（旧） 和 overflow-wrap（新） */
.safe-break {
  word-wrap: break-word;      /* IE/Edge 旧版兼容 */
  overflow-wrap: break-word;  /* 现代浏览器 */
  word-break: normal;
}
```

---

## 6. 浏览器兼容性

### word-break 属性

| 属性值 | Chrome | Firefox | Safari | Edge |
|--------|--------|---------|--------|------|
| `normal` | ✅ | ✅ | ✅ | ✅ |
| `break-all` | ✅ | ✅ | ✅ | ✅ |
| `keep-all` | ✅ | ✅ | ✅ | ✅ |
| `break-word` | ✅ | ✅ | ✅ | ✅（已废弃） |
| `auto-phrase` | ❌ | ❌ | ✅ | ❌ |

### overflow-wrap 属性

| 属性值 | Chrome | Firefox | Safari | Edge |
|--------|--------|---------|--------|------|
| `normal` | ✅ | ✅ | ✅ | ✅ |
| `break-word` | ✅ | ✅ | ✅ | ✅ |
| `anywhere` | ✅ 80+ | ✅ 69+ | ✅ 15.4+ | ✅ |

**兼容性提示**：
- `overflow-wrap` 是 `word-wrap` 的标准名称，二者作用相同
- 为兼容旧版 IE/Edge，建议同时写 `word-wrap` 和 `overflow-wrap`

---

## 7. 常见场景与最佳实践

### 7.1 场景选择指南

| 场景 | 推荐属性 |
|------|----------|
| 长单词/URL 防溢出 | `overflow-wrap: break-word` |
| CJK 混合英文防溢出 | `overflow-wrap: break-word` |
| 严格等宽布局（任意断行） | `word-break: break-all` |
| 中文文章保持语义完整 | `word-break: keep-all` |
| 语义感知断行（英文） | `word-break: auto-phrase` |

### 7.2 常见错误

```css
/* ❌ 错误：使用废弃值 */
.bad {
  word-break: break-word;
}

/* ✅ 正确：使用标准写法 */
.good {
  overflow-wrap: break-word;
  word-break: normal;
}
```

---

## 8. 参考资源

- [MDN: word-break](https://developer.mozilla.org/en-US/docs/Web/CSS/word-break)
- [MDN: overflow-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap)
- [CSS Text Module Level 3 规范](https://drafts.csswg.org/css-text/#word-break-property)
- [Can I Use: word-break](https://caniuse.com/css-wordbreak)
- [Can I Use: overflow-wrap](https://caniuse.com/css-overflow-wrap)

---

## 9. 相关主题

- [white-space 属性](./white-space.md)
- [line-break 属性](./line-break.md)
- [text-wrap 属性](./text-wrap.md)
- [hyphens 属性](./hyphens.md)
- [文本换行指南](https://developer.mozilla.org/en-US/docs/CSS/Guides/Text/Wrapping_breaking_text)
