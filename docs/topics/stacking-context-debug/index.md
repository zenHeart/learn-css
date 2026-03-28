# CSS 层叠上下文调试指南 (Stacking Context Debug)

## 概述

CSS 层叠上下文（Stacking Context）是 CSS 渲染模型的核心概念。理解层叠上下文对于调试 z-index 问题、解决元素遮挡、实现复杂图层效果至关重要。

## 一、Chrome DevTools Layers 面板调试方法

### 1.1 如何打开 Layers 面板

1. 打开 Chrome DevTools（`F12` 或 `Cmd+Option+I`）
2. 点击右上角的 `⋮` 菜单
3. 选择 `More tools` → `Layers`
4. 或者使用快捷键：`Cmd+Shift+P` 打开命令面板，输入 "Layers"

### 1.2 查看图层结构

Layers 面板显示当前页面的所有图层：

- **图层列表**：按深度排序，显示每个图层的名称、尺寸和内存占用
- **图层信息**：悬停时可查看图层的详细信息
- **缩放控制**：使用底部滑块缩放图层视图

### 1.3 使用 Rendering → Layer borders 显示层边界

1. 打开命令面板（`Cmd+Shift+P`）
2. 输入 "Rendering"
3. 选择 "Show Layer Borders"
4. 页面上的每个图层会显示彩色边框：
   - 橙色边框：合成图层（Compositor Layer）
   - 蓝色边框：GBD 纹理图层

### 1.4 Elements 面板检查 z-index 和 position

1. 在 Elements 面板中选中目标元素
2. 查看右侧 Styles 面板：
   - `position` 属性（`static`/`relative`/`absolute`/`fixed`/`sticky`）
   - `z-index` 值
   - `opacity` 值
   - `transform` 属性
   - `filter` 属性
3. 勾选 `:hov` → `Force element state` 可强制显示状态

---

## 二、CSS 层叠上下文（Stacking Context）触发条件

### 2.1 根元素

根元素 `<html>` 本身就是一个层叠上下文，所有其他元素都在它之上层叠。

### 2.2 position + z-index

```css
/* 当 z-index 不为 auto 时，position 为 relative/absolute/fixed/sticky 的元素会创建新层叠上下文 */
.element {
  position: relative;
  z-index: 1; /* 创建层叠上下文 */
}
```

### 2.3 opacity < 1

```css
/* opacity 小于 1 时触发新层叠上下文 */
.element {
  opacity: 0.9; /* 创建层叠上下文 */
}
```

### 2.4 transform / filter / backdrop-filter

```css
/* 任何非 none 的 transform 值 */
.element {
  transform: translateZ(0); /* 创建层叠上下文 */
}

/* 任何非 none 的 filter 值 */
.element {
  filter: blur(1px); /* 创建层叠上下文 */
}

/* backdrop-filter */
.element {
  backdrop-filter: blur(10px); /* 创建层叠上下文 */
}
```

### 2.5 CSS Grid / Flex + z-index

```css
/* Flex 或 Grid 容器中，z-index 不为 auto 的子元素 */
.container {
  display: flex;
}
.container > .item {
  z-index: 1; /* 即使父元素没有创建层叠上下文，子元素也会创建 */
}
```

### 触发条件汇总表

| 条件 | 示例 | 说明 |
|------|------|------|
| 根元素 | `<html>` | 默认创建 |
| position + z-index | `position: relative; z-index: 1` | z-index 不为 auto |
| opacity | `opacity: 0.9` | 值小于 1 |
| transform | `transform: translateZ(0)` | 非 none |
| filter | `filter: blur(1px)` | 非 none |
| backdrop-filter | `backdrop-filter: blur(10px)` | 非 none |
| -webkit-overflow-scrolling | `-webkit-overflow-scrolling: touch` | iOS 特有 |
| contain | `contain: layout` | 布局包含 |
| opacity | `opacity: 0.99` | 值小于 1 |

---

## 三、调试步骤流程

### 步骤 1：打开 DevTools Elements 面板

按 `F12` 打开 Chrome DevTools，切换到 Elements 面板。

### 步骤 2：定位问题元素，检查 z-index

1. 使用选择工具（左上角箭头）点击问题元素
2. 在 Styles 面板中检查：
   - `position` 属性
   - `z-index` 值
   - 是否设置了 `transform`、`filter` 等属性

### 步骤 3：检查父元素的层叠上下文

1. 在 Elements 面板中向上遍历父元素
2. 检查每个父元素是否创建了层叠上下文：
   - 是否有 `position` + `z-index`
   - 是否有 `transform`
   - 是否有 `opacity < 1`
   - 是否有 `filter`
3. 找到最近的层叠上下文祖先

### 步骤 4：使用 Layers 面板验证图层顺序

1. 打开 Layers 面板（`Cmd+Shift+P` → "Layers"）
2. 找到问题元素所在的图层
3. 验证图层的堆叠顺序是否正确
4. 使用 "Show Layer Borders" 可视化图层边界

### 调试流程图

```
发现问题元素层级异常
        ↓
    检查 z-index
        ↓
    检查 position
        ↓
是否有 transform/filter/opacity？
    ↓ YES           ↓ NO
查找父元素层叠上下文    检查是否在根层叠上下文中
        ↓
    确认层叠上下文边界
        ↓
    验证图层顺序
```

---

## 四、常见踩坑点

### 4.1 transform 导致层叠上下文

**问题**：给元素添加 `transform` 后，其子元素的 `z-index` 不再相对于根层叠上下文。

**示例**：

```html
<div class="parent" style="position: relative;">
  <div class="child" style="position: absolute; z-index: 100;">
    我在 parent 内部
  </div>
</div>
<div class="target" style="position: relative; z-index: 50;">
  我想盖住上面的元素
</div>
```

**问题**：如果 `.parent` 有 `transform`，则 `.child` 的 `z-index: 100` 只相对于 `.parent` 内部。

**解决**：

```css
.parent {
  transform: none; /* 移除不必要的 transform */
}
/* 或 */
.parent {
  transform: translateZ(0); /* 明确创建新的层叠上下文 */
}
```

### 4.2 z-index 在不同层叠上下文中的相对性

**问题**：`z-index: 100` 在一个层叠上下文中可能比 `z-index: 1` 在另一个层叠上下文中更低。

**示例**：

```html
<div style="position: relative; z-index: 1; transform: scale(1);">
  <!-- 创建层叠上下文 A -->
  <div style="position: absolute; z-index: 1000;">
    层叠上下文 A 内的元素
  </div>
</div>
<div style="position: relative; z-index: 2;">
  <!-- 层叠上下文 B -->
</div>
```

**解释**：
- 层叠上下文 A 的根 `z-index: 1`
- 层叠上下文 B 的根 `z-index: 2`
- 层叠上下文 A 内的 `z-index: 1000` 元素，永远在层叠上下文 B 之下
- 因为 **层叠上下文之间的比较只看根的 z-index**

**解决**：将需要比较的元素放在同一个层叠上下文中。

---

## 五、实战调试案例

### 案例 1：模态框被背景遮挡

**症状**：模态框弹出后，部分内容被背景元素遮挡。

**排查**：

1. 检查模态框的 `z-index` 是否足够高
2. 检查模态框父元素是否创建了层叠上下文
3. 检查背景元素的 `z-index` 和层叠上下文

**解决**：

```css
.modal-overlay {
  position: fixed;
  z-index: 1000;
}
.modal-content {
  position: relative;
  z-index: 1001; /* 比 overlay 高 */
}
/* 确保 modal-overlay 的父元素没有创建层叠上下文 */
```

### 案例 2：下拉菜单被其他内容覆盖

**症状**：下拉菜单展开时，被页面上其他元素遮挡。

**排查**：

1. 检查下拉菜单容器的 `position` 和 `z-index`
2. 检查父元素的层叠上下文
3. 检查是否有 `transform` 属性

**解决**：

```css
.dropdown {
  position: relative;
  z-index: 100; /* 足够高的 z-index */
}
/* 避免父元素的 transform */
```

---

## 六、最佳实践

1. **避免不必要的 transform**：仅在需要动画或 3D 效果时使用
2. **明确层级结构**：使用清晰的 z-index 值（100, 200, 300...）
3. **限制层叠上下文数量**：过多层叠上下文影响渲染性能
4. **使用 CSS 变量管理 z-index**：便于统一调整

```css
:root {
  --z-dropdown: 100;
  --z-modal: 1000;
  --z-tooltip: 1100;
}
.dropdown { z-index: var(--z-dropdown); }
.modal { z-index: var(--z-modal); }
```

---

## 七、相关资源

- [MDN: Stacking Context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)
- [Chrome DevTools Layers Panel](https://developer.chrome.com/docs/devtools/css/layers/)
- [What No One Told You About Z-Index](https://philipwalton.com/articles/what-no-one-told-you-about-z-index/)
