# MongoDB 测试数据存储指南

## 目标

为 learn-css 仓库添加 MongoDB 测试数据存储的学习文档和交互式演示，帮助开发者掌握：

1. MongoDB 测试数据创建方法（insert/factory/seeding）
2. @shelf/jest-mongodb 等测试工具集成
3. 常用工具：mongofill（测试数据生成）、mongo-seeding（JSON/JS文件播种）
4. Node.js + MongoDB 完整示例代码

## 验收标准

### 文档要求

- [x] 创建 `docs/topics/mongodb-test-data/index.md` 完整技术文档
- [x] 包含 MongoDB 测试数据创建方法（insert/factory/seeding）
- [x] 包含 @shelf/jest-mongodb 集成示例
- [x] 包含 mongofill 和 mongo-seeding 工具介绍
- [x] 包含 Node.js + MongoDB 完整示例代码
- [x] 包含性能优化和最佳实践

### 示例要求

- [x] 创建 `examples/css/demos/mongodb-test-data/index.html` 交互式演示页
- [x] 演示 Factory 模式创建测试数据
- [x] 演示 mongo-seeding 数据播种流程
- [x] 包含实时操作界面和结果展示
- [x] 响应式设计，移动端友好

### Git 要求

- [x] 提交到 `feature/mongodb-test-data` 分支
- [x] 创建 PR 到 `master` 分支
- [x] PR 标题格式：`docs: 添加 MongoDB 测试数据存储指南`

## 文档结构

```
docs/topics/mongodb-test-data/
└── index.md          # 技术文档

examples/css/demos/mongodb-test-data/
└── index.html        # 交互式演示
```

## 技术栈

- MongoDB
- Node.js
- jest / @shelf/jest-mongodb
- mongofill
- mongo-seeding
