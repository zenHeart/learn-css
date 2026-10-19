# CSS 省略号与空格间距控制完全指南

> text-overflow / white-space / letter-spacing / word-spacing 深度学习

## 目录

- [省略号生效的前提条件](#省略号生效的前提条件)
- [white-space 与省略号](#white-space-与省略号)
- [省略号与空格的关系](#省略号与空格的关系)
- [letter-spacing 与 word-spacing](#letter-spacing-与-word-spacing)
- [line-clamp 多行截断](#line-clamp-多行截断)
- [常见问题与解决方案](#常见问题与解决方案)
- [浏览器兼容性](#浏览器兼容性)

---

## 省略号生效的前提条件

CSS 省略号（`text-overflow: ellipsis`）的显示需要同时满足以下 **三个条件**：

```css
.ellipsis {
  /* 1. 强制不换行 — 必须！ */
  white-space: nowrap;

  /* 2. 隐藏溢出内容 — 必须！ */
  overflow: hidden;

  /* 3. 显示省略号 — 核心属性 */
  text-overflow: ellipsis;
}
```

### 常见错误

```css
/* ❌ 错误：缺少 white-space: nowrap，省略号不会显示 */
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis; /* 无效 */
}

/* ✅ 正确：三个条件缺一不可 */
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

---

## white-space 与省略号

### 取值对省略号的影响

| 值 | 换行 | 空格处理 | 省略号生效 |
|---|------|----------|-----------|
| `normal` | ✅ 自动换行 | 合并 | ❌ 不生效 |
| `nowrap` | ❌ 不换行 | 合并 | ✅ 生效 |
| `pre` | ❌ 不换行 | 保留 | ⚠️ 截断但不显示省略号 |
| `pre-wrap` | ✅ 换行 | 保留 | ❌ 不生效 |
| `pre-line` | ✅ 换行 | 合并 | ❌ 不生效 |
| `break-word` | ✅ 自动换行 | 合并 | ❌ 不生效 |

### 为什么 `normal` 不生效？

```css
/* normal：文本在容器边界自动换行，根本不会触发 overflow */
.normal-text {
  white-space: normal;  /* 文本会换行，不溢出 */
  overflow: hidden;
  text-overflow: ellipsis; /* 永远看不到，因为没溢出 */
}
```

### nowrap：单行省略号的唯一选择

```css
/* 单行省略号 — 唯一正确写法 */
.single-line {
  white-space: nowrap;  /* 强制不换行 */
  overflow: hidden;      /* 隐藏溢出 */
  text-overflow: ellipsis; /* 显示省略号 */
}
```

---

## 省略号与空格的关系

### 空格会被截断吗？

**会的**。省略号截断的是**字符序列**，包括空格。

```html
<div class="box">
  Hello   World    CSS    Tricks
</div>
```

```css
.box {
  width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

渲染结果：`Hello   Wor…` — 注意末尾的 **3个空格** 全部被截断，**不会保留**。

### 单词中间的空格

```html
<div class="box">
  HelloWorld CSS Tricks
</div>
```

```css
.box {
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

渲染结果：`HelloWorld C…` — 单词间的空格在溢出点被截断。

### 单词边界与截断

省略号在**任意字符位置**截断，不保证在单词边界：

```html
<!-- 最坏情况：单词中间截断 -->
<div class="box">
  Supercalifragilisticexpialidocious
</div>
```

```css
.box {
  width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

渲染结果：`Supercalifragilisticexpiali…`

### 解决方案：word-break 与连字符

```css
/* 允许在任意字符处换行（影响正常文本流） */
.word-break-all {
  word-break: break-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 只在单词边界换行（大多数情况） */
.word-break-keep {
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

---

## letter-spacing 与 word-spacing

### letter-spacing（字符间距）对省略号的影响

```css
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 2px; /* 增加字符间距 */
}
```

**关键点**：`letter-spacing` 作用于**所有字符**，包括省略号 `…`。

- 正值 `letter-spacing`：省略号位置会更靠右（因为字符间距挤占了内容）
- 负值 `letter-spacing`：省略号位置会更靠左
- 省略号本身也受 `letter-spacing` 影响

### word-spacing（单词间距）对省略号的影响

```css
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-spacing: 10px; /* 增加单词间距 */
}
```

**关键点**：`word-spacing` 只作用于**空格字符**，省略号 `…` 不是空格，所以**不受影响**。

### 实际场景：控制省略号前的间距

有时希望在省略号前保留一点间距，使视觉上更舒适：

```css
/* 方法1：给文本容器加 padding-right */
.ellipsis-wrapper {
  padding-right: 8px; /* 省略号不会紧贴边框 */
}
.ellipsis-inner {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 方法2：使用伪元素 */
.ellipsis-pseudo::after {
  content: '';
  display: inline-block;
  width: 8px;
}

/* 方法3：利用 letter-spacing（影响所有字符） */
.ellipsis-letter {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 4px; /* 简单有效 */
}
```

---

## line-clamp 多行截断

### 标准 `line-clamp`（Firefox 121+ 支持）

```css
.line-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  line-clamp: 3;  /* 最多显示 3 行 */
  overflow: hidden;
}
```

### WebKit 前缀版本（Safari / Chrome 旧版）

```css
.line-clamp-webkit {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;  /* WebKit 前缀版 */
  overflow: hidden;
}
```

### 多行省略号与空格

多行截断时，省略号出现在**最后一行**，空格处理规则与单行相同：

```html
<div class="multi-line">
  第一行文本
  第二行文本
  第三行文本很长很长很长很长
</div>
```

```css
.multi-line {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
```

渲染：第一行 + 第二行末尾 `…`

### 多行省略号的完整写法（兼容性最佳）

```css
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  /* 同时写两种属性，兼容新旧浏览器 */
  line-clamp: 3;
}
```

---

## 常见问题与解决方案

### Q1：省略号不显示，但文本明显溢出了

```css
/* 检查清单 */
.ellipsis {
  white-space: nowrap;  /* ← 这一行最容易忘记！ */
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### Q2：希望显示自定义字符而不是 `…`

```css
/* 使用 CSS 自定义属性 */
.ellipsis-custom {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* 注意：自定义字符串只能是单个字符或 CSS content 支持的值 */
}

/* 伪元素方案：显示自定义省略符号 */
.ellipsis-dash::before {
  content: '— ';
}
.ellipsis-dash {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 14px; /* 为伪元素留空间 */
}
```

### Q3：hover 时显示完整文本（tooltip）

```css
.ellipsis:hover {
  white-space: normal;     /* 临时恢复换行 */
  overflow: visible;
  text-overflow: clip;
  /* 或者：使用 title 属性自动实现 */
}
```

```html
<div class="ellipsis" title="这是完整的长文本...">
  这是完整的长文本...
</div>
```

### Q4：flex 布局中省略号失效

```css
/* flex 子元素需要确保不被压缩 */
.parent {
  display: flex;
}
.ellipsis-child {
  flex-shrink: 0;  /* 防止被压缩 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;     /* 关键：flex 子元素默认 min-width: auto 会阻止收缩 */
}

/* 或者 */
.ellipsis-child {
  flex: 1;
  min-width: 0;     /* 允许收缩到 0 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### Q5：省略号与图标/按钮同行

```css
/* 布局：文字左 + 图标右 + 省略号 */
.container {
  display: flex;
  align-items: center;
}
.text {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.icon {
  flex-shrink: 0;
  margin-left: 8px;
}
```

---

## 浏览器兼容性

### text-overflow: ellipsis

| 浏览器 | 版本 | 支持 |
|--------|------|------|
| Chrome | 1+ | ✅ |
| Firefox | 7+ | ✅ |
| Safari | 3+ | ✅ |
| Edge | 12+ | ✅ |
| IE | 6+ | ✅（ms-text-overflow） |

### line-clamp

| 属性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| `-webkit-line-clamp` | ✅ 1+ | ❌ | ✅ 3+ | ✅ 17+ |
| `line-clamp` (标准) | ❌ | ✅ 121+ | ❌ | ❌ |

### min-width: auto 在 flex 子元素

| 浏览器 | 行为 | 解决方案 |
|--------|------|----------|
| IE/Edge旧版 | 默认 `min-width: auto` | 设置 `min-width: 0` |
| Chrome/Firefox/Safari | 同上 | 同上 |

---

## 最佳实践清单

```css
/* ✅ 单行省略号（最常用） */
.single-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ✅ flex 容器中的省略号 */
.flex-ellipsis {
  flex: 1;
  min-width: 0;                  /* 关键！ */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ✅ 多行省略号（兼容性写法） */
.multi-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}

/* ✅ 省略号前保留间距 */
.ellipsis-padded {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 8px;            /* 视觉缓冲 */
}
```

---

## 相关资源

- [MDN: text-overflow](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow)
- [MDN: white-space](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space)
- [MDN: line-clamp](https://developer.mozilla.org/en-US/docs/Web/CSS/line-clamp)
- [CSS Tricks: text-overflow](https://css-tricks.com/snippets/css/css-text-overflow/)
