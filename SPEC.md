# SPEC: scroll 滚动详解

## 目标
在 learn-css 仓库创建 CSS 滚动完整技术文档和交互式演示页面。

## 验收标准
1. 产出 `docs/topics/scroll/index.md` — 完整技术文档（中文）
2. 产出 `examples/css/demos/scroll/index.html` — 交互式演示页面（中文）
3. 文档涵盖以下知识点：
   - CSS overflow 属性（visible/hidden/scroll/auto/clip）详解
   - overflow-x 和 overflow-y 的区别和使用场景
   - scroll-behavior 属性实现平滑滚动
   - 移动端滚动性能优化（-webkit-overflow-scrolling、scroll-snap）
   - 隐藏滚动条但保持滚动功能的各种方案
   - 常见踩坑点
4. 演示页面可直接在浏览器中运行，包含可交互的 Demo
5. PR 必须提交到 zenHeart/learn-css 仓库

## 约束
- 仅使用 Claude Code 完成开发，禁止手动编写代码
- 所有文件必须在 D:/chengle/code/github/learn-css 目录下创建
- 完成后必须创建 PR（目标分支 master）
- 遵循仓库现有的文档格式和风格