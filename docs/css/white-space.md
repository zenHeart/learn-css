# white-space 属性详解

> 控制空白符处理和换行符行为的 CSS 属性

## 1. 核心概念

`white-space` 属性决定了元素中的空白符（空格、Tab、换行）如何处理，以及是否自动换行。

```css
white-space: normal;    /* 默认行为：合并空格，自动换行 */
```

## 2. 属性值概览

| 属性值 | 空格处理 | 换行处理 | 自动换行 | 结尾空格 |
|--------|----------|----------|----------|----------|
| `normal` | 合并 | 合并 | ✅ 是 | 删除 |
| `nowrap` | 合并 | 合并 | ❌ 否 | 删除 |
| `pre` | 保留 | 保留 | ❌ 否 | 保留 |
| `pre-wrap` | 保留 | 保留 | ✅ 是 | 保留 |
| `pre-line` | 合并 | 保留 | ✅ 是 | 删除 |

## 3. 各值详解

### 3.1 `normal`（默认值）

```css
white-space: normal;
```

**行为**：
- 连续的空白符被合并为一个空格
- 遇到容器边界自动换行
- 行首空格被删除

```html
<p class="normal">
  前导空格    中间多个空格
  换行符被合并。
</p>
```

**效果**：`前导空格 中间多个空格 换行符被合并。`

### 3.2 `nowrap`

```css
white-space: nowrap;
```

**行为**：
- 连续的空白符被合并
- **不自动换行**，所有内容在一行显示
- 常与 `overflow: hidden` 和 `text-overflow: ellipsis` 配合实现单行省略

```css
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### 3.3 `pre`

```css
white-space: pre;
```

**行为**：
- 保留所有空白符和换行符
- **不自动换行**
- 效果类似于 `<pre>` 标签

```html
<pre class="pre">
  第一行
  第二行（缩进被保留）

  连续空格被保留。
</pre>
```

### 3.4 `pre-wrap`

```css
white-space: pre-wrap;
```

**行为**：
- 保留所有空白符和换行符
- **自动换行**
- 行尾空格保留

**场景**：代码块需要保持缩进，同时在窄屏幕上自动换行。

### 3.5 `pre-line`

```css
white-space: pre-line;
```

**行为**：
- 合并连续空格
- **保留换行符**
- **自动换行**
- 行尾空格删除

```html
<p class="pre-line">
  第一行
  第二行（换行被保留）

  多个空格被合并为一个。
</p>
```

## 4. 换行行为对比

```
┌─────────────┬──────────┬──────────┬──────────┬──────────┐
│   属性值    │ 空格合并 │ 换行保留 │ 自动换行 │ 行尾空格 │
├─────────────┼──────────┼──────────┼──────────┼──────────┤
│ normal      │    ✅    │    ❌    │    ✅    │    ❌    │
├─────────────┼──────────┼──────────┼──────────┼──────────┤
│ nowrap      │    ✅    │    ❌    │    ❌    │    ❌    │
├─────────────┼──────────┼──────────┼──────────┼──────────┤
│ pre         │    ❌    │    ✅    │    ❌    │    ✅    │
├─────────────┼──────────┼──────────┼──────────┼──────────┤
│ pre-wrap    │    ❌    │    ✅    │    ✅    │    ✅    │
├─────────────┼──────────┼──────────┼──────────┼──────────┤
│ pre-line    │    ✅    │    ✅    │    ✅    │    ❌    │
└─────────────┴──────────┴──────────┴──────────┴──────────┘
```

## 5. 实际应用场景

### 5.1 单行文本省略

```css
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

```html
<div class="ellipsis" style="width: 200px;">
  这是一段很长的文本内容超出容器宽度时会显示省略号。
</div>
```

### 5.2 代码块保持格式

```css
.code-block {
  white-space: pre-wrap;
  word-break: break-all;
  overflow-wrap: break-word;
}
```

```html
<div class="code-block">
  function hello() {
    console.log('保持缩进格式');
  }
</div>
```

### 5.3 诗歌词式排版

```css
.lyrics {
  white-space: pre-line;
}
```

```html
<p class="lyrics">
  第一句歌词
  第二句歌词
  第三句歌词
</p>
```

## 6. 与其他换行属性的关系

| 属性 | 控制范围 | 优先级 |
|------|----------|--------|
| `white-space` | 空白符 + 换行 + 溢出换行 | 高 |
| `word-break` | 断行规则（任意字符/CJK） | 中 |
| `overflow-wrap` | 长单词断行 | 低 |
| `line-break` | 亚洲语言断行 | 中 |

**组合使用**：

```css
/* 完整换行控制 */
.comprehensive {
  white-space: pre-wrap;       /* 1. 先确定空白符处理 */
  word-break: break-word;      /* 2. 再确定断行规则 */
  overflow-wrap: break-word;   /* 3. 最后处理长单词 */
}
```

## 7. 浏览器兼容性

| 属性值 | Chrome | Firefox | Safari | Edge |
|--------|--------|---------|--------|------|
| `normal` | ✅ | ✅ | ✅ | ✅ |
| `nowrap` | ✅ | ✅ | ✅ | ✅ |
| `pre` | ✅ | ✅ | ✅ | ✅ |
| `pre-wrap` | ✅ | ✅ | ✅ | ✅ |
| `pre-line` | ✅ | ✅ | ✅ | ✅ |

## 8. 相关主题

- [word-break 属性](./word-break.md)
- [line-break 属性](./line-break.md)
- [text-overflow 属性](./text-overflow.md)

## 9. 参考资源

- [MDN: white-space](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space)
- [CSS Text Module Level 3 规范](https://drafts.csswg.org/css-text/#white-space-property)
- [Can I Use: white-space](https://caniuse.com/css-white-space)
