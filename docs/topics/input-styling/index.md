# Input 样式完全指南

## 概述

表单输入元素（`<input>`、`<textarea>`、`<select>`）是 Web 界面中最常见的交互元素。浏览器为这些元素提供了默认样式，但通常与设计稿不符。本文档全面介绍如何自定义 input 样式，实现各种视觉效果。

## Input 类型与默认样式

### 常见 Input 类型

| 类型 | 用途 | 默认样式特征 |
|------|------|-------------|
| `text` | 单行文本输入 | 边框 + 内边距 + 字体 |
| `password` | 密码输入 | 圆点遮蔽字符 |
| `email` | 邮箱输入 | 与 text 相同，浏览器可能验证格式 |
| `number` | 数字输入 | 带上下箭头（不同浏览器表现不同） |
| `tel` | 电话号码 | 与 text 相同，移动端可能调起数字键盘 |
| `url` | URL 输入 | 与 text 相同，浏览器可能验证 URL 格式 |
| `search` | 搜索框 | 带清除按钮，部分浏览器有圆角 |
| `range` | 范围滑块 | 原生滑块控件 |
| `checkbox` | 复选框 | 方框 + 对勾 |
| `radio` | 单选框 | 圆框 + 圆点 |
| `file` | 文件选择 | 按钮 + 文件名显示区 |
| `submit/button` | 按钮 | 可点击的按钮样式 |
| `hidden` | 隐藏字段 | 不可见 |

## 重置默认样式

### 完全重置 Input

```css
/* 重置所有 input */
input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: none;
  outline: none;
  background: transparent;
  font: inherit;
  color: inherit;
  padding: 0;
  margin: 0;
}

/* 更保守的重置（保留边框等基本样式） */
input {
  appearance: none;
  -webkit-appearance: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
}
```

## Pseudo-classes 伪类

### 交互状态

```css
/* 默认状态 */
input {
  border: 1px solid #ccc;
  background: #fff;
}

/* 悬停状态 */
input:hover {
  border-color: #999;
}

/* 聚焦状态 */
input:focus {
  border-color: #007aff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.25);
}

/* 禁用状态 */
input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f5f5f5;
}

/* 只读状态 */
input:read-only {
  background: #f9f9f9;
  cursor: default;
}
```

### 输入验证状态

```css
/* 有效输入 */
input:valid {
  border-color: #34c759;
}

/* 无效输入 */
input:invalid {
  border-color: #ff3b30;
}

/* 占位符可见时（部分浏览器支持） */
input:placeholder-shown {
  border-color: #ffcc00;
}

/* 必填字段 */
input:required {
  border-color: #ff9500;
}

/* 可选字段 */
input:optional {
  border-color: #ccc;
}

/* 输入中（正在输入） */
input:placeholder-shown:not(:focus) {
  font-style: italic;
  color: #999;
}
```

### Checkbox 与 Radio 特殊状态

```css
/* Checkbox 选中状态 */
input[type="checkbox"]:checked {
  background-color: #007aff;
  border-color: #007aff;
}

/* Radio 选中状态 */
input[type="radio"]:checked {
  border-color: #007aff;
}

/* Checkbox 不确定状态（indeterminate） */
input[type="checkbox"]:indeterminate {
  background-color: #007aff;
  border-color: #007aff;
}

/* Checkbox 禁用 */
input[type="checkbox"]:disabled:checked {
  opacity: 0.5;
}
```

### 其他状态

```css
/* 启用状态（默认） */
input:enabled {
  cursor: text;
}

/* 聚焦可见（:focus-visible 选择性聚焦样式） */
input:focus:not(:focus-visible) {
  outline: none;
}

input:focus-visible {
  outline: 2px solid #007aff;
  outline-offset: 2px;
}

/* 正在填充（Autofill 状态）Chrome 特有 */
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 100px #fff inset;
  -webkit-text-fill-color: #000;
}
```

## Pseudo-elements 伪元素

### 占位符样式

```css
/* WebKit/Blink 浏览器 */
input::placeholder {
  color: #999;
  font-style: italic;
  opacity: 1; /* Firefox 需要 */
}

/* Firefox */
input::-webkit-input-placeholder {
  color: #999;
  font-style: italic;
}

/* 聚焦时占位符样式变化 */
input:focus::placeholder {
  color: #ccc;
}
```

### 选中文本样式

```css
input::selection {
  background: rgba(0, 122, 255, 0.3);
  color: inherit;
}
```

### 输入区样式（仅部分浏览器支持）

```css
/* Chrome/Safari - 输入区域的样式 */
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input::-webkit-outer-spin-button {
  -webkit-appearance: none;
}

/* 搜索框清除按钮 */
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  height: 16px;
  width: 16px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23999"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>') no-repeat center;
}

/* 搜索框-decoration */
input[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}
```

## 常见 Input 类型样式

### 1. 文本输入框

```css
.input-text {
  width: 100%;
  max-width: 400px;
  height: 44px;
  padding: 0 16px;
  border: 1px solid #d1d1d6;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-text:hover {
  border-color: #b1b1b6;
}

.input-text:focus {
  border-color: #007aff;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.15);
}

.input-text::placeholder {
  color: #c7c7cc;
}
```

### 2. 搜索框

```css
.input-search {
  width: 100%;
  max-width: 320px;
  height: 36px;
  padding: 0 12px 0 36px;
  border: 1px solid #e5e5ea;
  border-radius: 18px;
  background: #f2f2f7 url('search-icon.svg') no-repeat 12px center;
  font-size: 14px;
  transition: background-color 0.2s, border-color 0.2s;
}

.input-search:focus {
  background-color: #fff;
  border-color: #007aff;
  outline: none;
}

/* 移除浏览器默认搜索框样式 */
.input-search {
  appearance: none;
  -webkit-appearance: none;
}
```

### 3. 密码输入框

```css
.input-password {
  position: relative;
  width: 100%;
  max-width: 320px;
}

.input-password input {
  width: 100%;
  height: 44px;
  padding: 0 44px 0 16px;
  border: 1px solid #d1d1d6;
  border-radius: 8px;
  font-size: 16px;
}

.input-password button.toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  border: none;
  background: url('eye-icon.svg') no-repeat center;
  cursor: pointer;
}

.input-password button.toggle.show {
  background-image: url('eye-off-icon.svg');
}
```

### 4. 数字输入框

```css
.input-number {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.input-number input {
  width: 120px;
  height: 36px;
  padding: 0 36px;
  text-align: center;
  border: 1px solid #d1d1d6;
  border-radius: 6px;
  font-size: 14px;
  /* 移除浏览器默认箭头 */
  -moz-appearance: textfield;
}

.input-number input::-webkit-inner-spin-button,
.input-number input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-number button {
  position: absolute;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: #f2f2f7;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.input-number button.decrease {
  left: 4px;
}

.input-number button.increase {
  right: 4px;
}

.input-number button:hover {
  background: #e5e5ea;
}
```

### 5. Checkbox 自定义样式

```css
.checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-wrapper input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-wrapper .checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d1d6;
  border-radius: 4px;
  margin-right: 10px;
  position: relative;
  transition: all 0.2s;
}

.checkbox-wrapper input[type="checkbox"]:checked + .checkmark {
  background: #007aff;
  border-color: #007aff;
}

.checkbox-wrapper .checkmark::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.2s;
}

.checkbox-wrapper input[type="checkbox"]:checked + .checkmark::after {
  opacity: 1;
}

.checkbox-wrapper:hover .checkmark {
  border-color: #007aff;
}
```

### 6. Radio 自定义样式

```css
.radio-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.radio-wrapper input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.radio-wrapper .radiomark {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d1d6;
  border-radius: 50%;
  margin-right: 10px;
  position: relative;
  transition: all 0.2s;
}

.radio-wrapper input[type="radio"]:checked + .radiomark {
  border-color: #007aff;
}

.radio-wrapper .radiomark::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #007aff;
  transition: transform 0.2s;
}

.radio-wrapper input[type="radio"]:checked + .radiomark::after {
  transform: translate(-50%, -50%) scale(1);
}

.radio-wrapper:hover .radiomark {
  border-color: #007aff;
}
```

### 7. Switch/Toggle 开关

```css
.switch-wrapper {
  display: flex;
  align-items: center;
}

.switch-wrapper input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.switch {
  width: 51px;
  height: 31px;
  background: #e9e9eb;
  border-radius: 16px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
}

.switch::after {
  content: '';
  position: absolute;
  left: 2px;
  top: 2px;
  width: 27px;
  height: 27px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s;
}

.switch-wrapper input[type="checkbox"]:checked + .switch {
  background: #34c759;
}

.switch-wrapper input[type="checkbox"]:checked + .switch::after {
  transform: translateX(20px);
}
```

### 8. Range/Slider 滑块

```css
.range-wrapper {
  width: 100%;
  max-width: 300px;
}

input[type="range"] {
  width: 100%;
  height: 4px;
  background: #e5e5ea;
  border-radius: 2px;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  background: #007aff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 122, 255, 0.4);
  transition: transform 0.1s;
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

input[type="range"]::-webkit-slider-thumb:active {
  transform: scale(0.95);
}

/* Firefox */
input[type="range"]::-moz-range-thumb {
  width: 24px;
  height: 24px;
  background: #007aff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}
```

### 9. Select 下拉框

```css
.select-wrapper {
  position: relative;
  width: 200px;
}

.select-wrapper select {
  width: 100%;
  height: 40px;
  padding: 0 36px 0 12px;
  border: 1px solid #d1d1d6;
  border-radius: 8px;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
}

.select-wrapper::after {
  content: '';
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid #8e8e93;
  pointer-events: none;
}

.select-wrapper select:focus {
  border-color: #007aff;
  outline: none;
}
```

### 10. Textarea 多行文本

```css
textarea {
  width: 100%;
  min-height: 120px;
  padding: 12px 16px;
  border: 1px solid #d1d1d6;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.5;
  resize: vertical; /* 允许垂直调整大小 */
  transition: border-color 0.2s, box-shadow 0.2s;
}

textarea:hover {
  border-color: #b1b1b6;
}

textarea:focus {
  border-color: #007aff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.15);
}

/* 禁止调整大小 */
textarea.no-resize {
  resize: none;
}

/* 只允许水平调整 */
textarea.horizontal-resize {
  resize: horizontal;
}

/* 只允许垂直调整（默认） */
textarea.vertical-resize {
  resize: vertical;
}
```

## File Input 自定义

### 方法一：包装 + 隐藏原生 input

```css
.file-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-wrapper input[type="file"] {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

.file-wrapper .file-label {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  background: #007aff;
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.file-wrapper .file-label:hover {
  background: #0056cc;
}

.file-wrapper .file-name {
  color: #666;
  font-size: 14px;
}
```

### 方法二：按钮触发

```html
<div class="upload-area" id="uploadArea">
  <input type="file" id="fileInput" hidden>
  <button type="button" id="uploadBtn">选择文件</button>
  <span id="fileName"></span>
</div>

<style>
  .upload-area {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px;
    border: 2px dashed #d1d1d6;
    border-radius: 12px;
    transition: border-color 0.2s, background-color 0.2s;
  }

  .upload-area:hover,
  .upload-area.dragover {
    border-color: #007aff;
    background: rgba(0, 122, 255, 0.05);
  }
</style>

<script>
  const fileInput = document.getElementById('fileInput');
  const uploadBtn = document.getElementById('uploadBtn');
  const fileName = document.getElementById('fileName');

  uploadBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      fileName.textContent = fileInput.files[0].name;
    }
  });
</script>
```

## 高级技巧

### 1. 浮动标签（Floating Label）

```css
.float-label {
  position: relative;
}

.float-label input,
.float-label textarea {
  width: 100%;
  padding: 20px 16px 8px;
  border: 1px solid #d1d1d6;
  border-radius: 8px;
  font-size: 16px;
}

.float-label label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #8e8e93;
  pointer-events: none;
  transition: all 0.2s;
}

.float-label textarea ~ label {
  top: 24px;
}

.float-label input:focus ~ label,
.float-label input:not(:placeholder-shown) ~ label,
.float-label textarea:focus ~ label,
.float-label textarea:not(:placeholder-shown) ~ label {
  top: 8px;
  transform: none;
  font-size: 12px;
  color: #007aff;
}
```

### 2. 输入框添加图标

```css
.input-with-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.input-with-icon input {
  padding-left: 40px;
}

.input-with-icon .icon {
  position: absolute;
  left: 12px;
  width: 20px;
  height: 20px;
  color: #8e8e93;
  pointer-events: none;
}

.input-with-icon input:focus ~ .icon {
  color: #007aff;
}
```

### 3. 渐进式显示密码

```html
<div class="password-field">
  <input type="password" id="password" placeholder="请输入密码">
  <button type="button" class="toggle" aria-label="切换密码可见性">
    <svg class="icon-show" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
    <svg class="icon-hide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  </button>
</div>

<style>
.password-field {
  position: relative;
}
.password-field input {
  padding-right: 48px;
}
.password-field .toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}
.password-field input[type="text"] ~ .toggle .icon-show { display: none; }
.password-field input[type="text"] ~ .toggle .icon-hide { display: block; }
</style>

<script>
document.querySelector('.toggle').addEventListener('click', function() {
  const input = document.getElementById('password');
  if (input.type === 'password') {
    input.type = 'text';
  } else {
    input.type = 'password';
  }
});
</script>
```

### 4. 验证反馈动画

```css
.input-wrapper {
  position: relative;
}

.input-wrapper input {
  transition: border-color 0.3s;
}

.input-wrapper input.valid {
  border-color: #34c759;
  animation: shake 0.3s;
}

.input-wrapper input.invalid {
  border-color: #ff3b30;
  animation: shake 0.3s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.input-wrapper .validation-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
}

.input-wrapper input.valid ~ .validation-icon::after {
  content: '✓';
  color: #34c759;
}

.input-wrapper input.invalid ~ .validation-icon::after {
  content: '✗';
  color: #ff3b30;
}
```

## 无障碍性（Accessibility）

### 1. 确保足够的对比度

```css
/* 对比度至少 4.5:1（普通文本）或 3:1（大文本） */
input {
  color: #333; /* 浅灰色文字在白色背景上对比度约 12:1 */
  background: #fff;
}

/* 避免使用纯灰色文字 */
input::placeholder {
  color: #767676; /* 符合 WCAG AA */
}
```

### 2. 聚焦样式

```css
/* 始终为:focus 提供可见样式 */
input:focus {
  outline: 2px solid #007aff;
  outline-offset: 2px;
}

/* :focus-visible 仅在键盘导航时显示聚焦样式 */
input:focus:not(:focus-visible) {
  outline: none;
}

input:focus-visible {
  outline: 2px solid #007aff;
  outline-offset: 2px;
}
```

### 3. 标签关联

```html
<!-- 方法一：label 的 for 属性 -->
<label for="username">用户名</label>
<input type="text" id="username">

<!-- 方法二：包装 -->
<label>
  用户名
  <input type="text">
</label>

<!-- 方法三：aria-label -->
<input type="text" aria-label="用户名">
```

### 4. 错误提示

```html
<label for="email">邮箱地址</label>
<input type="email" id="email" aria-describedby="email-hint email-error">
<span id="email-hint">请输入有效的邮箱地址</span>
<span id="email-error" role="alert" style="color: #ff3b30;">
  请输入有效的邮箱地址
</span>

<style>
input[aria-invalid="true"] {
  border-color: #ff3b30;
}
</style>
```

## 浏览器兼容性

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|--------|--------|------|
| `appearance: none` | ✅ | ✅ | ✅ | ✅ |
| `::placeholder` | ✅ | ✅ | ✅ | ✅ |
| `:focus-visible` | ✅ 119+ | ✅ 4+ | ✅ | ✅ 119+ |
| `:indeterminate` | ✅ | ✅ | ✅ | ✅ |
| `::-webkit-slider-thumb` | ✅ | ❌ | ✅ | ✅ |
| `::selection` | ✅ | ✅ | ✅ | ✅ |
| `:autofill` | ✅ | ✅ | ✅ | ✅ |

### 前缀兼容性写法

```css
input {
  /* 移除默认样式 */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* Placeholder */
input::-webkit-input-placeholder {
  color: #999;
}
input:-moz-placeholder {
  color: #999;
}
input::-moz-placeholder {
  color: #999;
}

/* Range Slider */
input[type="range"] {
  -webkit-appearance: none;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
}
```

## 性能注意事项

### 1. 避免过度重绘

```css
/* 差：每次输入都触发重绘 */
input {
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s, border-color 0.3s;
}

/* 好：只改变需要改变的属性 */
input {
  border: 1px solid #ccc;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #007aff;
  box-shadow: 0 0 0 3px rgba(0,122,255,0.15);
}
```

### 2. 使用 `will-change` 优化动画

```css
.switch {
  will-change: background-color;
  transition: background-color 0.3s;
}

.switch::after {
  will-change: transform;
  transition: transform 0.3s;
}
```

### 3. 减少复杂选择器

```css
/* 差：复杂选择器 */
form.main-form div.container div.input-group input[type="text"].form-control:focus {
  border-color: #007aff;
}

/* 好：简洁选择器 */
.form-input:focus {
  border-color: #007aff;
}
```

## 常见问题

### 1. iOS 圆角和阴影

```css
input {
  -webkit-appearance: none;
  border-radius: 8px;
}

/* iOS 上的 input 可能不会继承父元素字体 */
input {
  font-family: inherit;
}
```

### 2. Chrome 自动填充背景色

```css
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 100px #fff inset;
  -webkit-text-fill-color: #000;
}

/* 过渡效果 */
input {
  transition: background-color 0.25s, color 0.25s;
}
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 100px #fff inset;
  -webkit-text-fill-color: #000;
  transition: background-color 5000s ease-in-out;
}
```

### 3. 移动端点击高亮

```css
input, textarea, select {
  -webkit-tap-highlight-color: transparent;
}
```

### 4. 禁用 iOS 样式缩放

```html
<!-- 在 head 中添加 viewport meta -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

## 总结

| 类别 | 关键点 |
|------|--------|
| **重置样式** | 使用 `appearance: none` 清除默认样式 |
| **交互状态** | `:hover`, `:focus`, `:disabled` 提供视觉反馈 |
| **验证状态** | `:valid`, `:invalid`, `:required` 显示输入验证结果 |
| **伪元素** | `::placeholder`, `::selection` 自定义特定部分样式 |
| **自定义控件** | Checkbox、Radio、Switch 使用包装器 + 隐藏原生元素 |
| **无障碍** | 足够的对比度、键盘可聚焦、ARIA 标签 |
| **兼容性** | 使用前缀 `-webkit-`, `-moz-` 确保跨浏览器支持 |

## 参考资源

- [MDN: <input>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
- [CSS Input Styling Guide](https://moderncss.dev/)
- [Customizing Checkboxes and Radio Buttons](https://coder-coder.com/custom-checkbox-radio-input/)
