# 任务：CSS Box Alignment 知识整理

## 目标
在 learn-css 仓库中创建 CSS Box Alignment 完整技术文档和交互式演示页面。

## 验收标准
1. 创建 `docs/css/box-alignment.md` — 完整技术文档
2. 创建 `examples/css/demos/box-alignment/box-alignment-demo.html` — 交互式演示页面
3. PR 链接已提交到 zenHeart/learn-css

## 仓库
zenHeart/learn-css

## 任务内容（来自 Jarvis）

CSS Box Alignment 模块定义了 CSS 中各种布局模型（Block/Flex/Grid/Table）的对齐规范。

### 1. 核心概念
- Box Alignment 模型统一了 Flexbox/Grid/Block 的对齐方式
- 两轴：对齐轴（alignment axis）和 justify 轴（justify axis）

### 2. 主要属性

| 属性 | 适用场景 | 说明 |
|------|---------|------|
| justify-content | flex/grid 主轴 | 主轴对齐 |
| align-items | flex/grid 交叉轴 | 交叉轴对齐 |
| justify-self | block/flex item | 自身主轴对齐 |
| align-self | block/flex item | 自身交叉轴对齐 |
| justify-items | grid 容器 | 网格项主轴对齐 |
| align-content | flex/grid 多行 | 整体对齐 |

### 3. 各布局系统中的对齐
- Block layout: 使用 justify-self, align-self
- Flexbox: 使用 justify-content, align-items, align-content
- Grid: 使用 justify-items, align-items, justify-self, align-self, place-*, gap
- Table: 有限的 alignment 支持

### 4. 关键值
- normal（默认）
- start / end
- center
- stretch（默认）
- baseline / first baseline / last baseline
- space-between / space-around / space-evenly

### 5. MDN 参考
- 总览：https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_alignment/Overview
- Block 布局：https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_alignment/In_block_abspos_tables
- 多列布局：https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_alignment/In_multi-column_layout

## 执行建议
1. 参考 MDN CSS Box Alignment 官方文档
2. 整理完整的 CSS Box Alignment 知识点
3. 包含代码示例和可视化说明
4. 对比各布局系统的对齐差异

## 输出要求
- 使用中文撰写
- 代码示例可直接运行
- 演示页面需包含可视化交互
