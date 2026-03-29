# 0.5px 像素实现方法研究 - SPEC

## 1. 目标

创建 0.5px 像素实现的技术文档 + 交互式演示，覆盖 CSS 中实现 0.5px 像素的各种方法。

## 2. 内容覆盖

### 2.1 为什么 0.5px 有意义（Retina/DPI 背景）
- Retina 屏幕的 DPI 概念
- 为什么需要 0.5px 线条
- 物理像素 vs CSS 像素

### 2.2 5种实现方案

| 方案 | 方法 | 推荐度 |
|------|------|--------|
| 方案一（推荐） | `transform: scale(0.5)` | ⭐⭐⭐⭐⭐ |
| 方案二 | `box-shadow: 0 0 0 0.5px` | ⭐⭐⭐⭐ |
| 方案三 | `background-image + SVG` | ⭐⭐⭐ |
| 方案四 | `background: linear-gradient` | ⭐⭐⭐ |
| 方案五 | 直接写 `0.5px`（Chrome 89+） | ⭐⭐⭐⭐ |

### 2.3 各方案优缺点对比表
- 浏览器兼容性
- 渲染效果
- 适用场景
- 性能考虑

### 2.4 浏览器兼容性说明
- Chrome 89+ 原生支持
- Safari/Firefox 回退方案
- 移动端 WKWebView

### 2.5 适用场景推荐
- 边框线（分隔线、列表项）
- 头像描边
- 精细 UI 元素

## 3. 验收标准

- [ ] 文档完整覆盖 5 种方案
- [ ] 包含优缺点对比表
- [ ] 包含浏览器兼容性说明
- [ ] **可运行的 HTML 交互演示**（必须）
- [ ] 演示页面展示 5 种方案的实际渲染效果对比
- [ ] 文档使用中文撰写
- [ ] PR 提交到 zenHeart/learn-css

## 4. 文件结构

```
docs/topics/half-pixel/
├── SPEC.md                    # 本文件
└── index.md                   # 技术文档

examples/css/demos/half-pixel/
└── index.html                 # 交互式演示页面
```
