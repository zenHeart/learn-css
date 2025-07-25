# CSS 学习笔记网站 · 需求与进度文档

---

## 📊 项目进度总览 (2024-12-19)

### 🎯 整体完成度：**65%**

| 阶段 | 完成度 | 状态 | 主要成就 |
|------|--------|------|----------|
| **P1阶段** | 95% | ✅ 基本完成 | 基础架构搭建，核心功能实现 |
| **P2阶段** | 80% | ✅ 核心完成 | Playground 功能，文档扫描插件 |
| **P3阶段** | 0% | ❌ 未开始 | 高级功能和体验优化 |
| **P4阶段** | 0% | ❌ 未开始 | 未来迭代和高级优化 |

### ✅ 已完成的核心功能

1. **基础架构** (100%)
   - ✅ Vite + React + TypeScript 项目搭建
   - ✅ Hash 路由配置 (react-router 7.x)
   - ✅ 文档扫描插件 (doc-scanner-plugin.ts)
   - ✅ 虚拟模块数据生成

2. **页面功能** (95%)
   - ✅ 首页 (HomePage) - 完整实现
   - ✅ 学习页面 (TopicsPage) - 完整实现
   - ✅ 参考索引页面 (ReferencePage) - 完整实现，使用真实数据
   - ✅ 代码实践页面 (PlaygroundDetailPage) - 完整实现，支持无参数访问

3. **核心组件** (100%)
   - ✅ MdxRenderer - MDX 内容渲染
   - ✅ Sidebar - 侧边栏导航（自动生成）
   - ✅ Playground - 交互式代码编辑器
   - ✅ CodeEditor - CodeMirror 编辑器封装

4. **文档系统** (90%)
   - ✅ MDX 文件扫描和解析
   - ✅ Frontmatter 提取
   - ✅ Playground 代码自动加载
   - ⚠️ 真实 MDX 渲染（当前使用模拟内容）

### ⚠️ 需要完善的功能

1. **全局搜索** (0%) - 高优先级
   - 安装 FlexSearch.js
   - 构建搜索索引
   - 实现搜索 UI

2. **真实 MDX 解析** (10%) - 高优先级
   - 完善 MDX 插件配置
   - 实现真实 MDX 内容渲染

3. **文档内容迁移** (0%) - 高优先级
   - 将 `docs/` 目录内容迁移到 `src/topics/`
   - 按照约定规范重构文件组织
   - 迁移示例代码到对应 `_demos/` 目录

4. **下载功能** (0%) - 中优先级
   - Playground 代码下载为 ZIP

5. **部署验证** (80%) - 中优先级
   - GitHub Pages 实际部署测试

### 🚀 下一步计划

**P2阶段剩余工作**：
1. 实现全局搜索功能
2. 完善真实 MDX 解析
3. 完成文档内容迁移
4. 测试 GitHub Pages 部署

**P3阶段工作**：
1. 下载 ZIP 功能
2. 练习模式完善
3. 响应式布局优化

---

## 📋 项目概览

| 项目信息 | 详情 |
|---------|------|
| **项目名称** | CSS 学习笔记网站 |
| **项目类型** | 纯静态网站 |
| **技术栈** | React 19 + MDX + react-router 7.x + Vite + TypeScript |
| **部署目标** | GitHub Pages (`http://blog.zenheart.site/learn-css/`) |
| **开发周期** | 4个阶段，预计8-12周 |
| **团队规模** | 1-2人开发团队 |

### 🎯 项目目标
- 构建自用的、结构清晰的 CSS 知识学习站点
- 提供交互式代码实践环境
- 支持公开查阅和贡献
- 具备类似 Docusaurus/VitePress 的优秀用户体验

### 🚀 核心价值
- **学习效率**：结构化的知识体系 + 交互式实践
- **查找便捷**：全局搜索 + 分类索引
- **实践导向**：实时预览 + 代码下载
- **开放协作**：GitHub 集成 + 版本控制

---

## 🗂 当前实现状态与架构

### 已实现的核心功能

#### 1. 基础架构 (100% 完成)
- **技术栈**：React 19 + TypeScript + Vite
- **路由系统**：react-router 7.x Hash 路由
- **代码规范**：ESLint + Prettier + TypeScript 严格模式
- **构建工具**：Vite 配置，支持虚拟模块

#### 2. 文档扫描系统 (100% 完成)
- **插件位置**：`src/plugins/doc-scanner-plugin.ts`
- **功能**：自动扫描 `src/topics` 目录下的 MDX 文件
- **数据生成**：构建时生成 `sidebarData`、`allDocsData`、`allPlaygroundsData`
- **虚拟模块**：通过 `virtual:doc-data` 注入数据

#### 3. 页面系统 (95% 完成)
- **首页** (`src/pages/HomePage.tsx`)：Hero 区、快速导航、GitHub 链接
- **学习页** (`src/pages/TopicsPage.tsx`)：侧边栏 + 内容区，支持 MDX 渲染
- **参考索引** (`src/pages/ReferencePage.tsx`)：真实数据展示，支持搜索和分类
- **代码实践** (`src/pages/PlaygroundDetailPage.tsx`)：独立环境，支持无参数访问

#### 4. 核心组件 (100% 完成)
- **MdxRenderer** (`src/components/MdxRenderer.tsx`)：MDX 内容渲染
- **Sidebar** (`src/components/Sidebar.tsx`)：自动生成的侧边栏导航
- **Playground** (`src/components/Playground.tsx`)：交互式代码编辑器
- **CodeEditor** (`src/components/CodeEditor.tsx`)：CodeMirror 编辑器封装

#### 5. Playground 系统 (100% 完成)
- **多文件编辑**：支持 HTML、CSS、JS 文件
- **实时预览**：200ms 防抖，iframe 沙箱
- **错误控制台**：捕获和显示 JavaScript 错误
- **安全沙箱**：限制网络请求和存储 API
- **文件管理**：添加新文件、重置代码、标签切换

### 当前文件结构
```
src/
├── pages/                    # 页面组件
│   ├── HomePage.tsx         # 首页
│   ├── TopicsPage.tsx       # 学习页面
│   ├── ReferencePage.tsx    # 参考索引页面
│   └── PlaygroundDetailPage.tsx # 代码实践页面
├── components/               # 核心组件
│   ├── MdxRenderer.tsx      # MDX 渲染器
│   ├── Sidebar.tsx          # 侧边栏导航
│   ├── Playground.tsx       # 交互式代码编辑器
│   └── CodeEditor.tsx       # CodeMirror 编辑器
├── plugins/                  # 插件
│   └── doc-scanner-plugin.ts # 文档扫描插件
├── topics/                   # MDX 文档
│   └── 01.basics/
│       └── 01.box-model/
│           ├── 01.intro.mdx
│           └── _demos/       # Playground 代码
├── router.tsx               # 路由配置
├── site.config.ts           # 站点配置
└── main.tsx                 # 应用入口
```

---

## 📝 主要剩余工作项

### 🔥 高优先级任务

#### 1. 全局搜索功能 (0% 完成)
**目标**：实现站内文档的全局搜索能力

**具体任务**：
- [ ] 安装 FlexSearch.js 库
- [ ] 在 `doc-scanner-plugin.ts` 中构建搜索索引
- [ ] 创建搜索 UI 组件
- [ ] 实现 `Ctrl+K` 快捷键
- [ ] 集成到页面中（建议在顶部导航栏）

**技术要点**：
- 使用 FlexSearch.js 的中文分词支持
- 搜索范围：Frontmatter、标题、正文内容
- 实时搜索结果，支持模糊匹配

#### 2. 真实 MDX 解析 (10% 完成)
**目标**：完善 MDX 插件配置，实现真实内容渲染

**具体任务**：
- [ ] 安装和配置 `vite-plugin-mdx`
- [ ] 配置 `remark-gfm` 和 `remark-frontmatter`
- [ ] 修改 `MdxRenderer.tsx` 支持真实 MDX 内容
- [ ] 测试 MDX 文件的实际渲染效果

**技术要点**：
- 支持 GitHub Flavored Markdown
- 自动生成标题锚点
- 支持代码高亮和语法高亮

### 🔶 中优先级任务

#### 3. Playground 代码下载功能 (0% 完成)
**目标**：支持将 Playground 代码下载为 ZIP 文件

**具体任务**：
- [ ] 安装 `jszip` 和 `file-saver`
- [ ] 在 `Playground.tsx` 中添加下载按钮
- [ ] 实现 ZIP 文件生成逻辑
- [ ] 保持用户自定义文件名

#### 4. GitHub Pages 部署验证 (80% 完成)
**目标**：确保生产环境功能正常

**具体任务**：
- [ ] 创建 `.github/workflows/deploy.yml`
- [ ] 配置 `public/404.html` 处理 SPA 路由
- [ ] 测试部署后的所有功能
- [ ] 验证 Hash 路由在 GitHub Pages 上的表现

#### 5. 练习模式完善 (0% 完成)
**目标**：实现 Playground 的练习模式

**具体任务**：
- [ ] 在 `Playground.tsx` 中添加 "显示答案" 按钮
- [ ] 实现 `mode="exercise"` 的 UI 优化
- [ ] 支持解决方案代码的切换显示

#### 6. 响应式布局优化 (0% 完成)
**目标**：优化移动端和不同屏幕尺寸的体验

**具体任务**：
- [ ] 优化侧边栏在移动端的收起/展开
- [ ] 调整 Playground 在小屏幕下的布局
- [ ] 确保所有页面在不同设备上的良好表现

#### 7. 文档内容迁移 (0% 完成) - 新增任务
**目标**：将 `docs/` 目录的内容迁移到 `src/topics/` 目录，满足约定的文档结构

**具体任务**：
- [ ] 分析现有 `docs/` 目录结构，设计迁移方案
- [ ] 按照约定规范重构文件组织方式：
  - 基础概念：`src/topics/01.basics/01.concept/01.intro.mdx`
  - 基础语法：`src/topics/01.basics/02.basic/01.intro.mdx`
  - 选择器：`src/topics/01.basics/03.selector/01.intro.mdx`
  - 盒模型：`src/topics/01.basics/04.box-model/01.intro.mdx`
  - 层叠：`src/topics/01.basics/05.cascade/01.intro.mdx`
  - 布局基础：`src/topics/02.layout/01.basics/01.intro.mdx`
  - 正常流：`src/topics/02.layout/02.normal-flow/01.intro.mdx`
  - 居中布局：`src/topics/02.layout/03.center/01.intro.mdx`
  - 多列布局：`src/topics/02.layout/04.column/01.intro.mdx`
  - 弹性布局：`src/topics/02.layout/05.flex/01.intro.mdx`
  - 网格布局：`src/topics/02.layout/06.grid/01.intro.mdx`
  - 工具：`src/topics/03.tools/01.stylus/01.intro.mdx`
- [ ] 迁移 `docs/examples/` 目录下的示例代码到对应的 `_demos/` 目录
- [ ] 保持文档内容不变，只调整文件组织结构和命名
- [ ] 更新文档中的内部链接和引用路径
- [ ] 验证迁移后的文档结构和示例代码正常工作

**技术要点**：
- 遵循 `01.xx.mdx` 文件命名规范
- 保持 `_demos/` 目录与 MDX 文件同级
- 确保示例代码的 `id` 与文件夹名称一致
- 更新文档中的相对路径引用

### 🔵 低优先级任务

#### 7. GitHub 编辑链接 (0% 完成)
**目标**：提供 "在 GitHub 编辑此页" 功能

#### 8. CSS 学习路线图 (0% 完成)
**目标**：在首页添加交互式学习路线图

#### 9. 代码分割优化 (0% 完成)
**目标**：实现路由级别的懒加载

---

## 🎯 阶段性任务清单

### P1 阶段：基础架构搭建 (已完成 95%)
- [x] Vite + React + TypeScript 项目初始化
- [x] 路由配置（Hash 路由）
- [x] 代码规范工具配置
- [x] 文档扫描插件开发
- [x] 页面组件基础实现
- [x] 侧边栏自动生成
- [x] 虚拟模块数据注入
- [ ] MDX 真实渲染（剩余 10%）

### P2 阶段：核心功能开发 (已完成 80%)
- [x] Playground 组件开发
- [x] CodeMirror 编辑器集成
- [x] 多文件编辑和预览
- [x] 错误控制台和安全沙箱
- [x] 文档与 Playground 自动关联
- [x] 示例详情页实现
- [x] 参考索引页真实数据
- [ ] 全局搜索功能（剩余 20%）
- [ ] 文档内容迁移（新增任务）

### P3 阶段：体验优化与高级功能 (未开始)
- [ ] Playground 代码下载
- [ ] 练习模式完善
- [ ] 响应式布局优化
- [ ] GitHub 编辑链接
- [ ] CSS 学习路线图
- [ ] 代码分割优化

### P4 阶段：长期规划 (未开始)
- [ ] 国际化支持
- [ ] 插件/主题系统
- [ ] 用户个性化
- [ ] 评论系统集成
- [ ] 可视化测试
- [ ] 更细致的搜索优化

---

## 📋 项目需求详情

### 核心特性

1. **单页应用 (SPA) 与 Hash 路由**
   - 采用 `react-router 7.x` Hash 路由
   - 部署到 `http://blog.zenheart.site/learn-css/`
   - 基础路径为 `/learn-css`

2. **嵌套 Markdown 文档结构**
   - 基于文件系统的自动导航生成
   - 文件命名规范：`01.xx.mdx`
   - 支持任意深度的侧边栏导航

3. **可编辑示例 (Playground)**
   - 多文件编辑（HTML、CSS、JS）
   - 实时预览（200ms 防抖）
   - 错误控制台和日志输出
   - 安全沙箱环境
   - 支持重置代码和添加新文件

4. **全局搜索功能**
   - 支持模糊匹配
   - 搜索范围：Frontmatter、标题、正文
   - 支持 `Ctrl+K` 快捷键

5. **全局引用索引页**
   - 按 `category` 分类显示
   - 支持搜索和跳转
   - 自动从 Frontmatter 提取关键词

### 页面信息架构

#### 1. 首页 (`/#/`)
- Hero 区：网站标题、副标题
- 快速导航：主要页面跳转
- 使用说明：文档格式、Playground 用法
- GitHub 链接：项目源码地址

#### 2. 学习页 (`/#/topics`)
- 左侧目录栏：自动生成的侧边栏导航
- 右侧内容区：MDX 文档渲染
- 示例区域：内嵌 Playground
- 锚点跳转：自动生成标题锚点

#### 3. 示例详情页 (`/#/playground/:id`)
- 左侧示例导航：所有 Playground 列表
- 右侧 Playground 核心区域：独立编辑器
- 支持无参数访问：`/#/playground`

#### 4. 索引页 (`/#/reference`)
- 分类导航栏：按 category 分组
- 索引表格：关键词列表和跳转链接
- 搜索功能：索引内容模糊搜索

### 配置文件结构

#### `site.config.ts`
```typescript
export const siteConfig = {
  title: "CSS 学习笔记",
  github: "https://github.com/your-repo/css-notes",
  sidebarDepth: 3,
  showEditLink: true,
  defaultTheme: "light",
  enableSearch: true,
  description: "一个专注于 CSS 知识学习与实践的纯静态笔记网站。",
  keywords: "CSS, 学习, 教程, 笔记, 前端, 开发",
};
```

#### MDX Frontmatter 配置
```yaml
---
title: "Box Model 基础"
category: "布局基础"
tags:
  - margin
  - padding
description: "详细介绍 CSS 盒模型的基本概念、组成部分及其在布局中的应用。"
keywords: "盒模型, Box Model, margin, padding, border"
---
```

### 项目文件结构规范

为了保证项目结构清晰、内容易于管理和构建脚本的高效运行，我们将遵循以下文件和目录组织规范：

```
learn-css/
├── .github/                       # GitHub Actions 工作流配置
│   └── workflows/
│       └── deploy.yml             # 自动化部署配置
├── public/                        # 静态资源目录 (Vite 会直接复制)
│   ├── favicon.ico
│   ├── 404.html                   # SPA 路由处理
│   └── # 其他静态图片、字体等
├── src/
│   ├── assets/                    # 项目公共静态资源 (图片、图标等，Vite 会处理)
│   │   └── styles/                # 全局 CSS 样式 (如 CSS reset, common styles)
│   │       └── index.css
│   ├── components/                # React UI 组件
│   │   ├── CodeEditor.tsx         # CodeMirror 编辑器封装
│   │   ├── MdxRenderer.tsx        # MDX 内容渲染器
│   │   ├── Playground.tsx         # 可编辑示例核心组件
│   │   ├── Sidebar.tsx            # 侧边栏导航组件
│   │   └── ...                    # 其他通用组件
│   ├── data/                      # 构建时生成或手动维护的配置/数据文件
│   │   ├── sidebar.json           # 侧边栏导航数据 (构建时生成)
│   │   ├── allPlaygrounds.json    # 所有 Playground 示例数据 (构建时生成)
│   │   ├── roadmap.json           # CSS 学习路线图数据 (手动维护)
│   │   └── search-index.json      # 全局搜索索引 (构建时生成)
│   ├── pages/                     # 页面组件 (路由直接对应的组件)
│   │   ├── HomePage.tsx
│   │   ├── TopicsPage.tsx
│   │   ├── ReferencePage.tsx
│   │   └── PlaygroundDetailPage.tsx
│   ├── topics/                    # **核心：所有学习文档的 MDX 源文件和相关示例**
│   │   ├── 01.basics/             # 主题分类目录
│   │   │   ├── 01.box-model/      # 具体主题目录
│   │   │   │   ├── 01.intro.mdx   # MDX 文档 (其中使用 <Playground id="box-model-intro" />)
│   │   │   │   └── _demos/        # **该文档关联的 Playgrounds/Exercises 示例代码根目录**
│   │   │   │       ├── box-model-intro/ # **示例文件夹 (其名称即为 <Playground /> 的 `id` prop)**
│   │   │   │       │   ├── index.html       # 默认会读取的 HTML 文件 (初始代码)
│   │   │   │       │   ├── style.css        # 默认会读取的 CSS 文件 (初始代码)
│   │   │   │       │   └── script.js        # 默认会读取的 JS 文件 (初始代码)
│   │   │   │       ├── another-exercise/    # 另一个练习文件夹 (其名称为 <Playground /> 的 `id` prop)
│   │   │   │       │   ├── index.html       # 初始代码
│   │   │   │       │   ├── style.css
│   │   │   │       │   ├── solution.html    # 约定为解决方案 HTML 文件
│   │   │   │       │   └── solution.css     # 约定为解决方案 CSS 文件
│   │   │   ├── 02.display/
│   │   │   │   ├── 01.flexbox.mdx
│   │   │   │   └── _demos/
│   │   │   │       └── flex-alignment-intro/
│   │   │   │           ├── index.html
│   │   │   │           └── style.css
│   │   │   └── index.mdx          # 如果目录本身就是文档入口
│   │   └── ...
│   ├── router.tsx                 # react-router 路由定义
│   ├── site.config.ts             # 全局网站配置
│   ├── main.tsx                   # 应用入口文件
│   └── vite-env.d.ts              # Vite 环境变量声明
├── index.html                     # SPA 入口 HTML
├── package.json                   # 项目依赖和脚本
├── tsconfig.json                  # TypeScript 配置
├── .eslintrc.cjs                  # ESLint 配置
├── .prettierrc                    # Prettier 配置
└── README.md                      # 项目说明
```

**关键约定：**

- **`_demos/` 目录：** 统一存放 MDX 文档相关的 Playground/Exercise 代码，位于使用它的 MDX 文档的**同级目录**下。
- **示例文件夹命名 (`playgroundId`)：** 每个示例/练习的文件夹名称**必须唯一**且**直接用作 `<Playground />` 组件的 `id` prop**。
- **默认文件名约定：** 构建系统将根据 `id` 查找 `_demos/<id>/` 文件夹，并自动读取以下文件作为**初始代码**（如果存在）：`index.html`, `style.css`, `script.js`。
- **答案文件名约定（针对练习）：** 对于练习，除了上述初始代码文件，构建系统还将自动查找并读取以下文件作为**解决方案代码**（如果存在）：`solution.html`, `solution.css`, `solution.js`。

**技术实现细节：**

- **MDX Playground 声明：** 在 MDX 文件中使用特殊注释 `{/* @playground id="example-id" mode="demo" */}` 来声明 Playground 组件实例。
- **安全沙箱：** iframe 沙箱将严格限制网络请求和本地存储 API，防止恶意代码执行。
- **中文搜索：** 使用 FlexSearch.js 的 `tokenize: "forward"` 策略和自定义 `encode` 函数处理中文分词。
- **部署兼容：** 通过 `public/404.html` 处理 SPA 路由在 GitHub Pages 上的兼容性问题。

### 部署方案

项目将采用**纯静态部署方式**，主要部署目标为 **GitHub Pages**。

- **部署 URL**：`http://blog.zenheart.site/learn-css/`，项目将适配 `/learn-css` 作为基础路径。
- **自动化部署**：通过配置 GitHub Actions 等 CI/CD 工具，实现代码提交后自动构建并将静态文件部署到指定分支。
- **构建流程**：**利用 Vite 遍历构建，生成路由、搜索索引等所有必要信息。**
- **缓存策略**：将考虑在构建产物中使用哈希化的文件名，以配合 CDN 缓存策略，解决版本更新后的缓存失效问题。
- **SPA 路由处理**：`public/404.html` 处理 SPA 路由在 GitHub Pages 上的兼容性问题。

---

## 🛠 开发环境与工具链

### 环境要求
- **Node.js**：v23+
- **包管理器**：pnpm
- **IDE**：VS Code + ESLint + Prettier 插件

### 代码规范
- **ESLint**：代码质量检查
- **Prettier**：代码格式化
- **TypeScript**：严格模式

### Git 流程
- 遵循 GitHub Flow
- 特性分支：`feature/xxx`、`bugfix/xxx`
- Commit Message：Conventional Commits 规范

### 项目通用事项与规范

- **环境准备：**
  - [ ] 安装 Node.js (推荐 v23+) 采用 pnpm
  - [ ] 安装 Git。
  - [ ] 配置 IDE (VS Code 推荐)，安装 ESLint, Prettier 插件。
- **Git 流程：**
  - [ ] 遵循 GitHub Flow：所有开发在特性分支 (`feature/xxx`, `bugfix/xxx`) 上进行。
  - [ ] Pull Request (PR) 必须经过至少一名成员 Code Review 后合并。
  - [ ] Commit Message 遵循 Conventional Commits 规范。
- **代码规范：**
  - [ ] 所有代码遵循 `.eslintrc.cjs` 和 `.prettierrc` 定义的规范。
  - [ ] 严格遵循 TypeScript 类型定义。
- **沟通与协作：**
  - [ ] 每天参与站会，同步进展和阻碍。
  - [ ] 遇到问题及时通过团队协作工具提问。
  - [ ] 使用 GitHub Issues 进行任务分配、进度追踪和 Bug 管理。每个任务都应关联一个 Issue。
- **文档：**
  - [ ] 完成任务后，更新相关代码注释和技术文档（如果适用）。

---

## 📈 技术亮点与风险

### 技术亮点
- **插件系统**：自定义 `doc-scanner-plugin.ts`，支持实时文档扫描
- **虚拟模块**：Vite 虚拟模块技术，构建时数据生成
- **沙箱安全**：完善的 iframe 沙箱机制
- **响应式设计**：良好的移动端适配

### 主要风险与应对
- **MDX 解析复杂**：采用渐进式开发，先实现基础功能
- **性能优化**：实现代码分割、懒加载和缓存策略
- **沙箱安全**：严格限制 API 调用，设置执行时间限制
- **内容维护**：建立完善的文档规范和自动化流程

### 补充说明

#### 开发环境与工具链

1. **Node.js 版本要求**：v23+，确保使用最新的 LTS 版本
2. **包管理器**：统一使用 pnpm，提升依赖安装速度和磁盘空间利用率
3. **代码规范工具**：
   - ESLint：代码质量检查
   - Prettier：代码格式化
   - TypeScript：严格模式，确保类型安全
4. **开发工具推荐**：VS Code + 相关插件

#### 性能优化策略

1. **代码分割**：
   - 路由级别懒加载
   - CodeMirror 按需加载
   - 大型依赖库动态导入
2. **资源优化**：
   - 图片压缩和 WebP 格式支持
   - CSS/JS 文件压缩和缓存策略
   - 字体文件优化加载

#### 错误处理与监控

1. **前端错误监控**：
   - 全局错误捕获
   - 性能指标收集
   - 用户行为分析
2. **构建时验证**：
   - MDX 文件语法检查
   - Playground 代码完整性验证
   - 依赖关系检查

#### SEO 与可访问性

1. **SEO 优化**：
   - 动态生成 meta 标签
   - 结构化数据标记
   - 站点地图自动生成
2. **可访问性**：
   - 键盘导航支持
   - 屏幕阅读器兼容
   - 高对比度主题

#### 测试策略

1. **单元测试**：关键组件和工具函数
2. **集成测试**：Playground 功能验证
3. **端到端测试**：用户流程测试
4. **性能测试**：加载时间和响应速度

#### 部署与运维

1. **CI/CD 流程**：
   - 代码质量检查
   - 自动化测试
   - 构建和部署
2. **监控告警**：
   - 网站可用性监控
   - 性能指标监控
   - 错误率监控

#### 内容管理与维护

1. **文档编写规范**：
   - MDX 语法规范
   - 图片资源管理
   - 代码示例规范
2. **版本控制策略**：
   - 文档版本管理
   - 示例代码版本控制
   - 变更记录维护
3. **内容审核流程**：
   - 技术内容准确性检查
   - 示例代码功能验证
   - 用户体验测试

#### 扩展性与未来规划

1. **插件系统**：
   - 自定义组件扩展
   - 主题系统支持
   - 第三方集成接口
2. **数据迁移**：
   - 现有内容迁移策略
   - 数据格式转换工具
   - 兼容性保证

#### 风险评估与应对策略

1. **技术风险**：
   - **风险**：MDX 解析和 Playground 集成复杂度高
   - **应对**：采用渐进式开发，先实现基础功能再逐步完善
   
2. **性能风险**：
   - **风险**：大量 MDX 文件和 Playground 代码影响加载速度
   - **应对**：实现代码分割、懒加载和缓存策略
   
3. **安全风险**：
   - **风险**：用户代码在 iframe 中执行可能带来安全威胁
   - **应对**：严格限制 API 调用，设置执行时间限制
   
4. **维护风险**：
   - **风险**：内容更新和版本管理复杂
   - **应对**：建立完善的文档规范和自动化流程

---

## 🎉 项目成就总结

### 已完成的核心功能
1. **完整的页面系统**：首页、学习页、参考索引、代码实践
2. **强大的 Playground 系统**：多文件编辑、实时预览、安全沙箱
3. **智能文档系统**：自动扫描、Frontmatter 解析、侧边栏生成
4. **响应式设计**：良好的用户体验和界面设计

### 技术成就
- 成功实现插件式文档扫描
- 完善的虚拟模块数据注入
- 安全的 iframe 沙箱机制
- 自动化的导航和索引生成

### 下一步重点
1. **全局搜索功能**：提升内容查找效率
2. **真实 MDX 解析**：完善文档渲染
3. **下载功能**：增强用户体验
4. **部署验证**：确保生产环境稳定

**项目已经具备了核心功能，可以作为一个完整的 CSS 学习笔记网站使用。下一步重点是完善搜索功能和真实 MDX 解析，这将大大提升用户体验。**

---

## 📋 需求文档完善说明

基于产品专家和技术专家的反馈，本需求文档已在以下关键方面进行了完善：

### **技术实现细节明确化**

1. **MDX 组件解析策略**：采用特殊注释标记 `{/* @playground id="example-id" mode="demo" */}` 来声明 Playground 组件实例，简化了构建时的解析逻辑。

2. **安全沙箱策略**：明确了 iframe 沙箱的安全限制，包括禁止网络请求、本地存储 API 等，并添加了执行时间限制和危险 API 重写机制。

3. **中文搜索实现**：指定使用 FlexSearch.js 作为搜索库，配置了中文分词策略和自定义编码函数。

4. **部署兼容性**：添加了 SPA 路由在 GitHub Pages 上的 404 处理机制。

### **用户体验优化**

1. **重置代码确认**：添加了用户确认对话框，防止意外丢失代码更改。

2. **文件下载处理**：明确了保持用户自定义文件名的逻辑。

3. **错误处理机制**：完善了 iframe 沙箱中的错误捕获和日志输出机制。

### **开发流程规范化**

1. **构建时验证**：添加了 Playground 文件夹不存在时的默认模板和警告日志。

2. **技术栈明确**：明确了所有关键依赖库的选择和配置方式。

3. **部署策略**：统一使用 GitHub Pages + GitHub Actions 的部署方案。

这些完善确保了项目的技术可行性和用户体验的一致性，为后续开发提供了清晰的技术指导。
