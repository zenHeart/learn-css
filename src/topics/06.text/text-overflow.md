# CSS text-overflow 文本溢出

## 概述

`text-overflow` 属性指定当文本溢出包含元素时的显示方式。

## 必须同时满足的条件

`text-overflow` 必须与以下属性配合使用才能生效：

```css
.text-overflow {
  /* 1. 禁止换行 */
  white-space: nowrap;
  
  /* 2. 隐藏溢出 */
  overflow: hidden;
  
  /* 3. 溢出显示方式 */
  text-overflow: ellipsis;
}
```

## 语法

```css
text-overflow: clip | ellipsis | <string>;
```

## 值

### clip
默认值，简单地裁剪溢出的文本：

```css
.text-clip {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip; /* 默认值 */
}
```

### ellipsis
显示省略号 `...`：

```css
.text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### \<string\>
自定义省略符（浏览器支持有限）：

```css
.text-string {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: "***";
}
```

## 多行文本溢出

### 使用 line-clamp（推荐）

```css
.multi-line {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 限制行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### 兼容性写法

```css
.multi-line-compatible {
  position: relative;
  max-height: 4.5em; /* line-height * 行数 */
  overflow: hidden;
}

.multi-line-compatible::after {
  content: "...";
  position: absolute;
  right: 0;
  bottom: 0;
  padding-left: 0.5em;
  background: linear-gradient(to right, transparent, #fff 50%);
}
```

## 双方向溢出

```css
.both-direction {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-overflow: ellipsis ellipsis; /* 同时控制两个方向 */
}
```

## 与 flexbox 配合

```css
.flex-item {
  display: flex;
  min-width: 0; /* 重要：允许收缩 */
}

.flex-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

## 与 grid 配合

```css
.grid-item {
  display: grid;
}

.grid-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

## 实用示例

### 单行省略

```html
<div class="title-ellipsis">这是一段很长的标题文字，超出容器宽度时会显示省略号</div>
```

```css
.title-ellipsis {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### 多行省略

```html
<div class="desc-ellipsis">
  这是一段很长的描述文字，
  会限制在指定的行数内，
  超出部分显示省略号。
</div>
```

```css
.desc-ellipsis {
  width: 300px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### 卡片标题

```css
.card-title {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

## 浏览器支持

| 属性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| text-overflow | 1+ | 7+ | 1+ | 12+ |
| -webkit-line-clamp | 1+ |不支持 | 1+ | 不支持 |
| text-overflow: \<string\> | 不支持 | 9+ | 不支持 | 不支持 |

## 注意事项

1. **必须设置 overflow**: 否则省略号不会显示
2. **必须设置 white-space**: nowrap 禁止换行
3. **min-width 问题**: 在 flex 子元素中可能需要设置 `min-width: 0`
4. **line-clamp 兼容性**: 是非标准属性，需要 -webkit- 前缀

## 相关属性

- [white-space](./white-space.md)
- [overflow](./overflow.md)
- [line-clamp](./line-clamp.md)

## 参考资源

- [MDN text-overflow](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow)
- [CSS Overflow Module Level 3](https://www.w3.org/TR/css-overflow-3/)
