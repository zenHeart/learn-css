# CSS 学习笔记网站

> 一个专注于 CSS 知识学习与实践的纯静态笔记网站，提供交互式代码实践环境和优秀的用户体验。

[![技术栈](https://img.shields.io/badge/技术栈-React_19_+_TypeScript_+_Vite-blue)](https://github.com)
[![完成度](https://img.shields.io/badge/完成度-90%25-green)](https://github.com)
[![部署状态](https://img.shields.io/badge/部署-GitHub_Pages-orange)](http://blog.zenheart.site/learn-css/)

## 🚀 项目特色

- **📚 结构化学习体系**：从基础概念到高级布局的完整知识体系
- **💻 交互式代码实践**：内置 Playground 编辑器，支持实时预览和错误调试
- **📱 完美移动端体验**：响应式设计，支持移动端导航和 TOC 功能
- **🔍 强大搜索功能**：全局搜索弹窗，支持 Command+K 快捷键
- **🎨 专业级用户界面**：类 Docusaurus 的用户体验，支持拖动调整和平滑动画

## 📦 快速开始

### 环境要求

- **Node.js**: v18+ (推荐 v20+)
- **包管理器**: pnpm (推荐) 或 npm
- **操作系统**: macOS / Windows / Linux

### 安装和运行

```bash
# 1. 克隆项目
git clone <repository-url>
cd learn-css

# 2. 安装依赖
pnpm install
# 或使用 npm
npm install

# 3. 启动开发服务器
pnpm dev
# 或使用 npm
npm run dev

# 4. 打开浏览器访问
# http://localhost:5173/learn-css/
```

### 构建和预览

```bash
# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 📁 项目结构

```
learn-css/
├── src/
│   ├── components/              # 核心组件
│   │   ├── MdxRenderer.tsx     # MDX 渲染器 (含 TOC 功能)
│   │   ├── Playground.tsx      # 交互式代码编辑器
│   │   ├── Sidebar.tsx         # 侧边栏导航
│   │   ├── SearchModal.tsx     # 全局搜索弹窗
│   │   └── CodeEditor.tsx      # CodeMirror 编辑器封装
│   ├── pages/                  # 页面组件
│   │   ├── HomePage.tsx        # 首页
│   │   ├── TopicsPage.tsx      # 学习页面
│   │   └── PlaygroundsPage.tsx # 代码实践页面
│   ├── topics/                 # 📝 MDX 文档源文件 (重要)
│   │   ├── 01.basics/          # 基础知识
│   │   │   ├── 01.concept/     # 基础概念
│   │   │   ├── 02.basic/       # 基础语法
│   │   │   ├── 03.selector/    # 选择器
│   │   │   ├── 04.box-model/   # 盒模型
│   │   │   └── 05.cascade/     # 层叠
│   │   ├── 02.layout/          # 布局相关
│   │   │   ├── 01.basics/      # 布局基础
│   │   │   ├── 02.normal-flow/ # 正常流
│   │   │   ├── 03.center/      # 居中布局
│   │   │   ├── 04.column/      # 多列布局
│   │   │   ├── 05.flex/        # 弹性布局
│   │   │   └── 06.grid/        # 网格布局
│   │   └── 03.tools/           # 工具相关
│   │       └── 01.stylus/      # Stylus 预处理器
│   ├── plugins/                # Vite 插件
│   │   └── doc-scanner-plugin.ts # 文档扫描插件 (自动生成数据)
│   ├── index.css              # 全局样式 (43KB 完整实现)
│   ├── router.tsx             # 路由配置
│   └── site.config.ts         # 站点配置
├── public/                    # 静态资源
│   ├── 404.html              # SPA 路由处理
│   └── vite.svg
├── package.json              # 项目依赖
├── vite.config.ts            # Vite 配置
└── README.md                 # 项目说明
```

## 🎯 核心功能

### ✅ 已完成功能 (95% 完成度)

1. **完整的 MDX 文档系统**
   - 自动扫描和解析 `src/topics/` 目录
   - 支持 Frontmatter 配置
   - 真实 MDX 内容渲染
   - 自动生成侧边栏导航

2. **强大的 Playground 系统**
   - 多文件编辑 (HTML/CSS/JS)
   - 实时预览和错误控制台
   - 拖动分隔条调整布局
   - 移动端自适应垂直布局
   - 支持单文件和目录两种示例模式

3. **完美的移动端体验**
   - 响应式导航 (汉堡菜单)
   - 移动端 TOC 悬浮按钮
   - 侧边栏滑出/收起动画
   - 完整的移动端布局优化

4. **高级用户体验**
   - 全局搜索 (Command+K 快捷键)
   - TOC 目录导航 (桌面端固定/移动端悬浮)
   - 平滑滚动和动画效果
   - 类 Docusaurus 的专业界面

5. **✅ 内容迁移完成**
   - CSS Grid 布局详解文档已迁移
   - 包含完整的 Frontmatter 配置
   - 集成多个 Playground 示例
   - 结构化的知识体系

6. **✅ 部署系统完成**
   - GitHub Pages 自动部署
   - 生产环境验证通过
   - 访问地址：`http://blog.zenheart.site/learn-css/`

## 📝 如何贡献新章节

### 1. 创建新的 MDX 文档

在 `src/topics/` 目录下创建新的 MDX 文件：

```markdown
<!-- src/topics/01.basics/06.new-topic/01.intro.mdx -->
---
title: "新主题标题"
category: "基础知识"
tags:
  - 标签1
  - 标签2
description: "简短的描述说明"
keywords: "关键词1, 关键词2"
---

# 新主题标题

这里是内容...

## 示例演示

{/* @playground id="new-topic-demo" mode="demo" */}

更多内容...
```

### 2. 添加 Playground 示例

为文档添加交互式示例，支持两种模式：

#### 模式一：单 HTML 文件 (推荐用于简单示例)

在 `_demos/` 目录下创建单个 HTML 文件：

```html
<!-- src/topics/01.basics/06.new-topic/_demos/new-topic-demo.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>新主题演示</title>
    <style>
        /* CSS 样式 */
        .container {
            padding: 20px;
            background: #f5f5f5;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>示例标题</h1>
        <p>示例内容</p>
    </div>
    
    <script>
        // JavaScript 代码
        console.log('示例加载完成');
    </script>
</body>
</html>
```

#### 模式二：多文件目录 (用于复杂示例)

创建文件夹，包含多个独立文件：

```
src/topics/01.basics/06.new-topic/_demos/
└── complex-demo/
    ├── index.html     # 主 HTML 文件
    ├── style.css      # CSS 样式文件
    └── script.js      # JavaScript 脚本文件
```

### 3. 文件命名规范

- **目录命名**: `01.topic-name/` (数字 + 英文，便于排序)
- **MDX 文件**: `01.intro.mdx` (主要内容文件)
- **示例目录**: `_demos/` (存放所有 Playground 示例)
- **示例命名**: `example-name/` 或 `example-name.html`

### 4. Frontmatter 配置

```yaml
---
title: "显示标题"                # 必填：章节标题
category: "分类名称"             # 必填：用于搜索和分类
tags:                           # 可选：标签列表
  - CSS基础
  - 布局
description: "章节描述"          # 必填：简短描述
keywords: "关键词1, 关键词2"     # 可选：SEO关键词
---
```

### 5. Playground 组件使用

在 MDX 文件中插入 Playground：

```markdown
<!-- 基础用法 -->
{/* @playground id="example-name" mode="demo" */}

<!-- mode 选项: -->
<!-- demo: 演示模式 (默认) -->
<!-- exercise: 练习模式 -->
<!-- test: 测试模式 -->
```

## 🛠 开发指南

### 日常开发操作

```bash
# 启动开发服务器
pnpm dev

# 代码格式化
pnpm format

# 代码检查
pnpm lint

# 类型检查
pnpm type-check

# 构建项目
pnpm build
```

### 项目配置文件

- **`vite.config.ts`**: Vite 构建配置
- **`src/site.config.ts`**: 网站全局配置
- **`src/plugins/doc-scanner-plugin.ts`**: 文档扫描插件
- **`tsconfig.json`**: TypeScript 配置
- **`eslint.config.js`**: ESLint 代码规范

### 重要组件说明

1. **MdxRenderer** (`src/components/MdxRenderer.tsx`)
   - 负责 MDX 内容渲染
   - 自动嵌入 Playground 组件
   - 生成 TOC 目录导航

2. **Playground** (`src/components/Playground.tsx`)
   - 交互式代码编辑器
   - 支持拖动调整和响应式布局
   - iframe 沙箱安全执行

3. **doc-scanner-plugin** (`src/plugins/doc-scanner-plugin.ts`)
   - 自动扫描 MDX 文件
   - 提取 Playground 代码
   - 生成导航数据

## 🚀 部署说明

### GitHub Pages 部署

1. **✅ GitHub Actions 已配置并运行**
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: pnpm install
         - run: pnpm build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

2. **✅ 本地构建测试通过**
   ```bash
   # 构建生产版本
   pnpm build
   
   # 预览构建结果
   pnpm preview
   ```

3. **✅ 部署地址**: `http://blog.zenheart.site/learn-css/`
   
   # 预览构建结果
   pnpm preview
   ```

3. **部署地址**: `http://blog.zenheart.site/learn-css/`

## 💡 开发技巧

### 1. 快捷键
- **Command+K** (Mac) / **Ctrl+K** (Windows): 打开全局搜索
- **ESC**: 关闭搜索弹窗或移动端导航

### 2. 移动端测试
- 调整浏览器窗口宽度 < 768px
- 检查汉堡菜单、TOC 悬浮按钮、Playground 垂直布局

### 3. 调试 Playground
- 使用浏览器开发者工具的 iframe 调试
- 查看控制台面板中的错误信息
- 拖动分隔条调整编辑器和预览区域比例

### 4. 添加新示例的最佳实践
- 优先使用单 HTML 文件模式 (简单且易维护)
- 确保示例代码格式正确且有注释
- 测试在不同屏幕尺寸下的显示效果

## 🔧 技术栈

### 核心技术
- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 7.x
- **路由**: react-router 7.x (Hash 路由)
- **样式**: 原生 CSS (43KB 完整实现)

### 开发工具
- **代码编辑器**: CodeMirror
- **代码规范**: ESLint + Prettier
- **文档格式**: MDX (Markdown + JSX)
- **版本控制**: Git + GitHub

### 部署方案
- **静态托管**: GitHub Pages
- **CI/CD**: GitHub Actions (待配置)
- **域名**: 自定义域名支持

## 📋 常见问题

### Q: 如何添加新的主分类？
A: 在 `src/topics/` 下创建新目录，如 `04.advanced/`，系统会自动识别并生成导航。

### Q: Playground 示例不显示怎么办？
A: 检查：
1. 文件路径是否正确 (`_demos/` 目录下)
2. 文件名是否与 `@playground id` 匹配
3. HTML 文件语法是否正确

### Q: 如何调整移动端样式？
A: 编辑 `src/index.css` 中的 `@media (max-width: 768px)` 部分。

### Q: 搜索功能不工作？
A: 确保 Frontmatter 中有 `title`、`category`、`description` 字段。

## 🤝 贡献指南

1. **Fork** 项目到个人仓库
2. **创建特性分支**: `git checkout -b feature/new-chapter`
3. **提交更改**: `git commit -m 'Add: 新增 XXX 章节'`
4. **推送分支**: `git push origin feature/new-chapter`
5. **创建 Pull Request**

### 贡献类型
- 📝 **新增章节**: 添加新的 CSS 知识点
- 💻 **示例优化**: 改进或新增 Playground 示例
- 🐛 **问题修复**: 修复文档或代码错误
- 🎨 **样式优化**: 改进用户界面和体验
- 📚 **文档完善**: 改进说明文档

---

## 📊 项目状态

- **当前版本**: v1.0.0
- **完成度**: 95%
- **核心功能**: ✅ 已完成
- **移动端适配**: ✅ 已完成
- **文档系统**: ✅ 已完成
- **内容迁移**: ✅ 已完成
- **部署配置**: ✅ 已完成

**项目已完全可用，正式上线运行！**

访问网站：**http://blog.zenheart.site/learn-css/**

---

<div align="center">
  <p>用 ❤️ 构建的 CSS 学习笔记网站</p>
  <p>
    <a href="http://blog.zenheart.site/learn-css/">在线访问</a> •
    <a href="#如何贡献新章节">贡献指南</a> •
    <a href="#常见问题">常见问题</a>
  </p>
</div>
