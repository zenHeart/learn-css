# text-wrap 属性详解

> CSS Text Module Level 4 新属性，控制文本换行模式

## 1. 核心概念

`text-wrap` 是 CSS Text Module Level 4 引入的新属性，用于控制文本的换行模式，与 `white-space` 互补。

```css
text-wrap: wrap;    /* 默认值，正常换行 */
```

## 2. 属性值

```css
text-wrap: wrap;          /* 正常换行 */
text-wrap: nowrap;        /* 不换行 */
text-wrap: balance;       /* 均衡换行，优化阅读体验 */
text-wrap: pretty;        /* 优化换行，减少孤行 */
```

## 3. 各值详解

### 3.1 `wrap`（默认值）

```css
text-wrap: wrap;
```

正常换行行为，文本在容器边界自动换行。

### 3.2 `nowrap`

```css
text-wrap: nowrap;
```

文本不换行，与 `white-space: nowrap` 效果类似。

### 3.3 `balance`（实验性）

**均衡换行**：将文本分成若干行，使每行的宽度尽可能均衡，提升阅读体验。

```css
text-wrap: balance;
```

**场景**：
- 标题
- 短文本块
- 需要视觉均衡的排版

```css
h1 {
  text-wrap: balance;
}
```

**限制**：
- Chrome 117+ 支持
- Firefox 121+ 支持
- Safari 需要前缀 `-webkit-`

### 3.4 `pretty`（实验性）

**优化换行**：采取更激进的换行策略，减少"孤儿"（单独一行的单词）和"寡居"（单独一行的短语）。

```css
text-wrap: pretty;
```

**场景**：
- 长段落文本
- 需要高质量排版的场景

```css
.article-content {
  text-wrap: pretty;
}
```

## 4. balance vs pretty 对比

| 特性 | `balance` | `pretty` |
|------|-----------|----------|
| 目标 | 行宽均衡 | 减少孤寡行 |
| 适用 | 标题、短文本 | 长段落 |
| 性能影响 | 较小 | 较大 |
| 浏览器支持 | 有限 | 有限 |

## 5. 实际应用

### 5.1 标题均衡排版

```css
.headline {
  text-wrap: balance;
  max-width: 60ch;  /* 限制宽度以获得最佳效果 */
}
```

```html
<h1 class="headline">CSS 文本换行控制详解</h1>
```

### 5.2 长文章优化

```css
.article-body {
  text-wrap: pretty;
  max-width: 65ch;  /* 最佳阅读宽度 */
}
```

### 5.3 组合使用

```css
.combined {
  text-wrap: balance;         /* 先均衡换行 */
  white-space: pre-wrap;       /* 保持原始空白 */
  word-break: break-word;      /* 处理长单词 */
}
```

## 6. 浏览器兼容性

| 属性值 | Chrome | Firefox | Safari | Edge |
|--------|--------|---------|--------|------|
| `wrap` | ✅ | ✅ | ✅ | ✅ |
| `nowrap` | ✅ | ✅ | ✅ | ✅ |
| `balance` | ✅ 117+ | ✅ 121+ | ✅ 18.2+ | ✅ |
| `pretty` | ✅ 117+ | ✅ 121+ | ❌ | ✅ |

**注意事项**：
- `balance` 和 `pretty` 仍为实验性属性
- 建议配合 `@supports` 使用

```css
.headline {
  text-wrap: balance;
}

@supports not (text-wrap: balance) {
  .headline {
    /* 回退方案 */
  }
}
```

## 7. 与现有属性的关系

`text-wrap` 与现有换行属性互补：

| 属性 | 控制内容 | CSS Level |
|------|----------|------------|
| `white-space` | 空白符 + 换行 | CSS 1 |
| `word-break` | 断行规则 | CSS 3 |
| `overflow-wrap` | 长单词断行 | CSS 3 |
| `line-break` | 亚洲语言断行 | CSS 3 |
| **`text-wrap`** | **换行模式** | **CSS 4** |

## 8. 相关主题

- [word-break 属性](./word-break.md)
- [white-space 属性](./white-space.md)
- [overflow-wrap 属性](./word-break.md)
- [line-break 属性](./line-break.md)

## 9. 参考资源

- [MDN: text-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap)
- [CSS Text Module Level 4 规范](https://drafts.csswg.org/css-text-4/#text-wrap)
- [Chrome Blog: CSS text-wrap: balance](https://developer.chrome.com/blog/css-text-wrap-balance/)
- [Can I Use: text-wrap](https://caniuse.com/css-text-wrap)
