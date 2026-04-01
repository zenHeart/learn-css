# CSS Overview 面板

Chrome DevTools CSS Overview 面板提供 CSS 统计信息，适合重构和规范化样式。

## 启用方式

1. **开启实验功能**：Cmd/Ctrl + Shift + P → `Show Experiments` → 勾选 CSS Overview
2. **打开面板**：Cmd/Ctrl + Shift + P → `Show CSS Overview`

## 核心功能

| 面板 | 说明 |
|------|------|
| **Overview Summary** | CSS 整体指标（元素数、样式表数、class vs ID 选择器数量） |
| **Colors** | 背景色、文本色、填充色、边框色的视觉预览，点击可定位元素 |
| **Font info** | 字体使用统计（font-weight、line-height），点击定位受影响元素 |
| **Unused declarations** | 未使用的 CSS 声明，可点击跳转并删除 |
| **Media queries** | 媒体查询断点统计（min/max-width），点击跳转到 Sources 面板 |

## 适用场景

- **重构代码**：识别散布的相似颜色（如"主色"的多个变体）
- **检查断点**：确保媒体查询覆盖目标屏幕尺寸
- **清理冗余**：Unused declarations 可提升渲染性能
- **团队沟通**：向新成员展示 CSS 状态和优化方向

## 与 Lighthouse 的区别

| 工具 | 范围 |
|------|------|
| CSS Overview | 仅 CSS |
| Lighthouse | 全站（包含 JavaScript） |

## 参考

- [Chrome DevTools CSS Overview](https://developer.chrome.com/docs/devtools/css-overview)
- [umaar.com Dev Tips](https://umaar.com/dev-tips/240-css-overview-improved/)
