# CSS 布局与排版学习指南

> 本文档整理学习 CSS 布局和排版的系统方法论，帮助建立完整的知识体系。

## 一、CSS 布局核心概念

### 1.1 盒模型（Box Model）

CSS 布局的基础，一切皆盒。

```
┌─────────────────────────────────────┐
│              Margin                 │
│  ┌───────────────────────────────┐  │
│  │            Border             │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │        Padding          │  │  │
│  │  │  ┌───────────────────┐  │  │  │
│  │  │  │     Content       │  │  │  │
│  │  │  └───────────────────┘  │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

**核心属性**：
- `width` / `height`：内容区域尺寸
- `padding`：内边距
- `border`：边框
- `margin`：外边距
- `box-sizing`：盒尺寸计算方式（`content-box` vs `border-box`）

**学习要点**：
- `box-sizing: border-box` 是现代布局的标配
- Margin 折叠（Margin Collapse）规则
- 负 margin 的妙用

### 1.2 布局模式演进

| 时代 | 技术 | 特点 |
|------|------|------|
| 史前 | Table 布局 | 结构即布局，死板 |
| 古典 | Float + Position | 灵活性增加，但复杂 |
| 现代 | Flexbox | 一维布局，强大灵活 |
| 当代 | CSS Grid | 二维布局，划时代 |
| 未来 | Container Queries | 组件自适应 |

## 二、CSS 排版核心概念

### 2.1 文本处理

**核心属性**：
- `font-size`：字号
- `line-height`：行高（推荐 1.5-1.8）
- `letter-spacing`：字间距
- `word-spacing`：词间距
- `text-align`：文本对齐

**书写模式**：
- `writing-mode`: `horizontal-tb` | `vertical-rl` | `vertical-lr`

### 2.2 文本换行

```
┌────────────────────────────────────────┐
│ CSS 属性         │ 作用                │
├─────────────────┼────────────────────┤
│ white-space     │ 处理空白符和换行     │
│ word-break      │ 单词内断行规则       │
│ overflow-wrap   │ 长单词溢出处理       │
│ text-wrap       │ 文本换行模式         │
│ line-break      │ 文本行断行规则       │
└────────────────────────────────────────┘
```

**常见组合**：
```css
/* 防止文本溢出 */
.overflow-protect {
  overflow-wrap: break-word;
  word-break: normal;
}

/* 保持空白符 */
.preserve-whitespace {
  white-space: pre-wrap;
}

/* 禁止换行 */
.no-wrap {
  white-space: nowrap;
}
```

## 三、学习路径（推荐）

### 阶段一：基础（1-2 周）

1. **盒模型**：理解 content/padding/border/margin
2. **display 属性**：`block` / `inline` / `inline-block`
3. **position 定位**：`static` / `relative` / `absolute` / `fixed` / `sticky`
4. **浮动**：理解浮动和清除浮动

### 阶段二：进阶（2-3 周）

1. **Flexbox**：主轴、交叉轴、对齐、分布
2. **Flex 经典案例**：导航栏、居中布局、Sticky Footer
3. **Grid 入门**：网格定义、fr 单位、auto-fill/auto-fit

### 阶段三：实战（持续）

1. **经典布局**：
   - 单栏布局
   - 两栏布局（侧边栏固定/自适应）
   - 三栏布局（圣杯/双飞翼）
   - 栅格系统

2. **组件布局**：
   - 卡片组件
   - 列表组件
   - 表单布局

### 阶段四：深入（长期）

1. **盒对齐**：Box Alignment 规范
2. **层叠上下文**：z-index 深入理解
3. **逻辑属性**：inline/logical vs physical
4. **容器查询**：Container Queries 革命

## 四、核心思维模型

### 4.1 布局算法选择决策树

```
布局需求
    │
    ├─ 一维布局？（单向流动）
    │   └─ Flexbox
    │
    ├─ 二维布局？（行列同时控制）
    │   └─ CSS Grid
    │
    ├─ 需要文字环绕？
    │   └─ Float / Shape Outside
    │
    └─ 固定位置？
        └─ Position
```

### 4.2 布局问题排查清单

- [ ] 是否设置了 `box-sizing: border-box`？
- [ ] 父元素高度是否足够（Flex/Grid 子项需要空间）？
- [ ] 是否有意外的 `overflow` 设置？
- [ ] Flex/Gird 的 `gap` 是否满足需求？
- [ ] 是否有 margin 折叠干扰？
- [ ] 父容器是否有明确的宽高约束？

## 五、推荐资源

### 文档

- [MDN CSS Layout](https://developer.mozilla.org/en-US/docs/Learn/CSS/Layout) - 权威教程
- [CSS Tricks - A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) - Flexbox 速查
- [CSS Tricks - A Complete Guide to Grid](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) - Grid 速查

### 交互式学习

- [Flexbox Froggy](https://flexboxfroggy.com/) - 游戏化学 Flexbox
- [Grid Garden](https://cssgridgarden.com/) - 游戏化学 Grid
- [CSS Battle](https://cssbattle.dev/) - CSS 挑战

### 工具

- [CSS Grid Generator](https://cssgrid-generator.netlify.app/) - Grid 可视化生成
- [Figma](https://figma.com) - 设计转 CSS（学习阶段）

## 六、常见问题速查

### Q1：Flex 子项不换行？

```css
.container {
  display: flex;
  flex-wrap: wrap; /* 默认是 nowrap，需要显式设置 */
}
```

### Q2：Flex 元素被压缩？

```css
.item {
  flex-shrink: 0; /* 禁止压缩 */
  flex-basis: 200px; /* 最小基准 */
}
```

### Q3：Grid 间隙不一致？

```css
.grid {
  display: grid;
  gap: 16px; /* 行列统一间隙 */
}
```

### Q4：绝对定位元素居中？

```css
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

## 七、实践方法

### 7.1 临摹练习法

1. 找一份设计稿（从简单的开始）
2. 只用 HTML + CSS 实现
3. 对比差异，分析原因
4. 记录问题和解决方案

### 7.2 组件重构法

1. 选择一个现有组件
2. 尝试用不同布局方式实现
3. 对比代码量和可维护性
4. 总结各方案优劣

### 7.3 知识卡片法

为每个布局知识点创建一张卡片：

```
┌─────────────────────────────┐
│ 知识点：Flexbox 主轴对齐    │
├─────────────────────────────┤
│ 属性：justify-content       │
│ 值：flex-start | center    │
│       | flex-end |         │
│       | space-between |     │
│       | space-around |      │
│       | space-evenly       │
├─────────────────────────────┤
│ 示例代码：                  │
│ .container {               │
│   justify-content: center; │
│ }                          │
├─────────────────────────────┤
│ 记忆口诀：                  │
│ 主轴对齐用 justify         │
└─────────────────────────────┘
```

## 八、进阶方向

### 8.1 布局新特性

- **CSS Subgrid**：Grid 嵌套新解
- **CSS Nesting**：原生嵌套语法
- **Container Queries**：组件级响应式
- **Cascade Layers**：层叠层级控制

### 8.2 性能优化

- 避免布局抖动（Layout Thrashing）
- 优先使用 `transform` 和 `opacity`
- 使用 `content-visibility` 优化长列表

### 8.3 无障碍性

- 语义化 HTML 配合布局
- 尊重 `prefers-reduced-motion`
- 键盘导航顺序检查

---

## 总结

CSS 布局学习的关键：

1. **理解盒模型**：一切布局的基础
2. **掌握 Flexbox**：解决 80% 的一维布局问题
3. **理解 Grid**：应对复杂的二维布局
4. **多练习**：布局是实践性极强的技能
5. **善用工具**：DevTools 是最好的老师

> 学习 CSS 布局没有捷径，但有正确的方法。多练，多想，多总结。
