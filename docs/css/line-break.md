# line-break 属性详解

> 控制亚洲语言文本换行点的 CSS 属性

## 1. 核心概念

`line-break` 属性专门用于控制**亚洲语言文本**（中文、日文、韩文）的换行规则，处理标点符号和某些字符在行尾的处理方式。

```css
line-break: auto;  /* 默认值 */
```

## 2. 属性值

```css
line-break: auto;       /* 浏览器自动选择换行规则 */
line-break: loose;      /* 最小限制：允许在部分标点后换行 */
line-break: normal;      /* 普通限制：标准换行规则 */
line-break: strict;      /* 严格限制：标点不能出现在行首 */
line-break: anywhere;    /* 允许在任意字符后换行，包括标点 */
```

## 3. 各值详解

### 3.1 `auto`（默认值）

浏览器自动选择合适的换行规则。

```css
line-break: auto;
```

**说明**：浏览器根据语言和上下文选择换行策略，现代浏览器通常表现良好。

### 3.2 `loose`

最小限制的换行规则，允许在部分标点（如 "、" 、"。"）后换行。

```css
line-break: loose;
```

**场景**：文章排版，追求更宽松的换行体验。

### 3.3 `normal`

标准换行规则，浏览器默认行为。

```css
line-break: normal;
```

### 3.4 `strict`

严格换行规则，某些标点符号不能出现在行首。

```css
line-break: strict;
```

**说明**：标点符号（如 "、" 、"。" 、"」"）会尽量保持在行尾。

### 3.5 `anywhere`

允许在**任意字符后**插入软换行点，包括标点和单词内部。

```css
line-break: anywhere;
```

**注意**：与 `word-break: break-all` 不同，`anywhere` 会产生软换行点参与 `min-content` 计算。

## 4. 换行限制等级

```
loose（最小限制）
  ↓
normal（标准）
  ↓
strict（严格）
  ↓
anywhere（最宽松）
```

| 等级 | 标点行首限制 | 适用场景 |
|------|-------------|----------|
| `loose` | 部分放宽 | 长文章排版 |
| `normal` | 标准 | 默认行为 |
| `strict` | 严格 | 正式文档排版 |
| `anywhere` | 无 | 代码/技术内容 |

## 5. 实际应用

### 5.1 中文文章排版

```css
.article {
  line-break: strict;  /* 严格换行，避免标点在行首 */
  white-space: pre-line;
}
```

### 5.2 日语文档

```css
.japanese-text {
  line-break: loose;  /* 日语常用 loose 规则 */
}
```

## 6. 与 word-break 的区别

| 属性 | 主要控制 | 影响范围 |
|------|----------|----------|
| `line-break` | 亚洲语言标点处理 | CJK 文本 |
| `word-break` | 任意字符断行 | 所有文本 |

**组合使用**：

```css
.mixed-text {
  line-break: strict;        /* 先处理 CJK 标点 */
  word-break: break-word;    /* 再处理英文单词 */
  overflow-wrap: break-word;
}
```

## 7. 浏览器兼容性

| 属性值 | Chrome | Firefox | Safari | Edge |
|--------|--------|---------|--------|------|
| `auto` | ✅ | ✅ | ✅ | ✅ |
| `loose` | ✅ | ✅ | ✅ | ✅ |
| `normal` | ✅ | ✅ | ✅ | ✅ |
| `strict` | ✅ | ✅ | ✅ | ✅ |
| `anywhere` | ✅ 58+ | ✅ 69+ | ✅ 15.4+ | ✅ |

## 8. 相关主题

- [word-break 属性](./word-break.md)
- [white-space 属性](./white-space.md)
- [overflow-wrap 属性](./word-break.md)

## 9. 参考资源

- [MDN: line-break](https://developer.mozilla.org/en-US/docs/Web/CSS/line-break)
- [CSS Text Module Level 3 规范](https://drafts.csswg.org/css-text/#line-break-property)
- [Can I Use: line-break](https://caniuse.com/css-line-break)
