# 需求说明

## 项目需求

本项目旨在构建一个**纯静态 CSS 学习笔记网站**，采用 **React + MDX** 技术栈，以提供一个**自用的、结构清晰、便于查阅和练习的 CSS 知识站点**。该站点也将**支持公开查阅**，并具备类似 **Docusaurus/VitePress 的用户体验，包括跳转至 GitHub 编辑文档的能力**。

### 整体概述

* **项目名称：** CSS 学习笔记网站
* **项目愿景：** 旨在构建一个自用的、结构清晰、便于查阅和练习的纯静态 CSS 知识站点，同时支持公开查阅，并具备类似 Docusaurus/VitePress 的优秀用户体验。
* **技术栈：**
  1. React 19
  2. MDX
  3. @tanstack/react-router
  4. Vite
  5. CodeMirror
  6. TypeScript
  7. CSS 方案：Tailwind CSS
  8. 搜索库：FlexSearch.js 支持中文分词器集成
* **部署目标：** GitHub Pages (`http://blog.zenheart.site/learn-css/`)
* **开发方法：** 敏捷开发（迭代与增量交付）

### 📌 核心特性

本网站将具备以下核心功能，旨在解决传统学习资料分散、缺乏交互实践和查找效率低下的痛点，并提供良好的用户体验：

1. **单页应用 (SPA) 与 Hash 路由**：
      * 网站将完全由静态资源组成，不依赖任何后端服务，支持高效部署和访问。
      * **采用 `@tanstack/react-router` 作为路由库，并明确使用 Hash 路由（例如 `#/topics`），以确保在纯静态环境（如 GitHub Pages）下的可靠性。**
      * **站点将部署到 `http://blog.zenheart.site/learn-css/`，基础路径 (base path) 为 `/learn-css`。所有内部链接和资源引用将正确处理此基础路径。**
      * 考虑到 SPA 首屏加载性能，将\*\*预留代码分割（Code Splitting）\*\*的优化空间。
2. **嵌套 Markdown 文档结构**：
      * 内容组织将基于本地文件系统的文件夹结构，自动生成多层级的导航目录，确保知识体系的清晰与易于管理。
      * **文件命名规范采用 `01.xx.mdx` 形式**，确保目录和内容的有序排列。
      * **导航目录支持任意深度**，文档的侧边栏（`sidebar`）深度可配置。侧边栏位于右侧，用户无需记忆目录的展开/折叠状态。
      * **MDX 解析和渲染将方便扩展，可参考 Docusaurus 的实现。**
      * MDX 解析和渲染将方便扩展，可参考 Docusaurus 的实现。具体包括集成 rehype-autolink-headings 和 rehype-slug 以自动生成标题锚点。
3. **可编辑示例 (Playground)**：
      * 每篇文档均可嵌入交互式的代码示例区域。
      * 该区域支持多文件编辑（如 `index.html`, `style.css`, `script.js`），文件间可相互引用。
      * **代码编辑器采用 CodeMirror。**
      * 提供**实时预览**功能，用户代码修改将即时反映在预览区，**采用 200ms 的防抖处理**。
      * 预览区域将具备**自适应**展示能力，方便测试不同设备下的效果。
      * **文件内容将打包为内联形式**，例如 CSS 会作为 `<style>` 标签内容注入，JavaScript 作为 `<script>` 标签内容注入。
      * **提供“独立打开 (Open Sandbox)”功能**，将当前示例在新标签页中打开，**跳转到专属的“示例详情页”(`/#/playground/:id`)**，提供更广阔和独立的编辑空间。
      * 具备**错误控制台 (`showConsole`) 和正常日志输出**机制，帮助用户发现并修正代码问题。
      * 支持**重置代码**功能，一键恢复到文档定义的初始示例状态。
      * 支持通过“+”号添加新的 HTML、CSS、JS 文件，**新建文件会在内存中保存，并支持用户自定义文件名**。
      * **支持将 Playground 中的代码下载到本地为 ZIP 文件。**
      * **目前不支持分享特定代码状态的功能。**
      * **沙箱环境必须保证安全，避免 XSS 或非预期代码执行。**
      * 技术实现将自定义开发，不直接依赖第三方库 Sandpack，但会借鉴其核心理念，基于 iframe 沙箱机制构建。建议 CodeMirror 考虑按需加载，以减少初始包体积。
4. **主题测试 (检测模式)**：
      * 作为 Playground 的延伸功能，允许在文档中嵌入考核性质的“小练习”模式。
      * 提供预填代码骨架，用户需在此基础上完成任务。
      * **目前不考虑复杂的测试运行（如单元测试），但将预留类似 `WebTest` 的口子**，方便未来扩展用于验证浏览器对某些 CSS 能力的支持。
      * 可配置显示答案功能。
5. **全局引用索引页 (`/#/reference`)**：
      * 自动汇总所有文档中通过 Frontmatter 字段（如 `category`、`tags`）定义的关键词、CSS 属性、值等信息。
      * 提供分类导航栏，按 `category` 字段对关键词进行聚类分组。
      * 每个分类内的关键词按字母顺序排列。
      * 点击索引项可快速跳转到对应的学习文档页面。
      * **关键词将从文档的 YAML 配置中自动提取，如果未配置，则使用文件名作为关键词。**
      * **搜索结果将直接显示一段文案匹配的列表，点击可跳转到文档。**
6. **全局搜索功能**：
      * 提供站内文档的全局搜索能力，支持模糊匹配。
      * 搜索范围包括 MDX 文档的 YAML Frontmatter（`title`, `category`, `tags`）、各级标题和正文内容。
      * 搜索结果实时显示，并能精准跳转到匹配关键词的文档及内容区域。
      * 支持 `Ctrl+K` 等快捷键快速唤出搜索面板。
      * **技术上将选择对中文支持最好的前端搜索库**，在构建时生成搜索索引。
7. **集中配置管理**：所有网站的元配置信息（如标题、GitHub 链接、侧边栏深度、默认主题、搜索开关等）统一维护在 `site.config.ts` 文件中，并**必须支持 TypeScript 类型安全**。
8. **国际化 (i18n) 兼容性**：
      * 项目架构设计将预留国际化能力，未来可方便地支持多语言内容。
      * **目前默认语言为中文。**
      * **国际化实现将参考 Docusaurus 的模式。**
9. **非功能需求**
      1. 可维护性： 遵循组件化、模块化原则，代码结构清晰。
      2. 可访问性： (可选，长期目标) 遵循 WCAG 基础规范。
      3. SEO： (可选，长期目标) 考虑生成 sitemap.xml，MDX Frontmatter 增加 description, keywords。

### 🗂 页面信息架构

#### 1\. 首页 (`/` 或 `/#/`)

作为网站的入口，旨在快速引导用户了解网站定位、结构和使用方法。

* **模块结构**：
  * **Hero 区**：展示网站标题、副标题及简要介绍。
  * **网站结构说明**：通过图示（**包含一个交互式 CSS 学习路线图 / Roadmap**）或文字介绍各页面功能。
  * **快速导航**：提供主要入口页面（如 `/#/topics`, `/#/reference`, `/#/playground`）的跳转按钮。
  * **使用说明**：简要阐述文档格式、Playground 用法、搜索方式等。
  * **GitHub 链接**：提供项目源码地址，并支持用户直接点击跳转到 GitHub 编辑当前文档的能力。

#### 2\. 学习页 (`/#/topics`)

网站的核心内容展示区域，以结构化的文档形式呈现 CSS 知识。

* **模块结构**：
  * **左侧目录栏**：根据 `src/topics` 目录结构（按 `01.xx.mdx` 文件名排序）自动生成，支持任意深度嵌套和展开/折叠，并具备**响应式收起**功能。
  * **右侧内容区**：渲染 MDX 文档内容，包括文本、图片、代码块、内嵌 Playground/检测模式。
  * **示例区域 (Playground/检测模式)**：如“核心特性”中所述，提供可编辑、可测试的交互式代码环境，并包含\*\*“独立打开 (Open Sandbox)”按钮，将当前示例加载到`/#/playground/:id`页面。\*\*
  * **锚点跳转**：自动为标题生成锚点，支持文档内部与全局跳转，并支持平滑滚动。
  * **快捷键面板**：支持 `Ctrl+K` 快速打开搜索面板等快捷操作。

#### 3\. 示例详情页 (`/#/playground/:id`)

为用户提供一个专注于代码实践和调试的独立环境，承载从学习页跳转而来的特定示例。

* **模块结构**：
  * **左侧示例导航**：\*\*按照类似 `/topics` 的目录结构，展示所有可用的 Playground 示例列表。\*\*用户可以在此页面左侧导航切换不同的示例。
  * **右侧 Playground 核心区域**：
    * 提供**更大、更独立的 CodeMirror 编辑器和预览区域**，减少干扰。
    * 完整复用学习页内嵌 Playground 的所有功能：多文件编辑、实时预览、错误提示、重置代码、添加新文件、下载代码（ZIP）等。
    * **提供 `showConsole` 开关以控制控制台输出显示。**
  * **独立 URL**：每个示例在该页面都有唯一的 URL (`/#/playground/:id`)，便于分享和直接访问。

#### 4\. 索引页 (`/#/reference`)

一个自动汇总和分类的 CSS 知识参考字典，便于快速查阅。

* **模块结构**：
  * **分类导航栏**：根据文档 Frontmatter `category` 字段对关键词进行分组。
  * **索引表格**：每组关键词按字母排序，显示其所属文档、简要描述和跳转链接。
  * **搜索功能**：支持对索引页内容的模糊搜索，快速定位关键词。
  * **数据来源展示**：显示每个关键词在原始文档中的出处（文件路径、上下文段落），点击可跳转到文档内精确位置。

### ⚙️ 配置文件结构

所有站点的元配置将统一维护在 `site.config.ts` 文件中，并强制支持 TypeScript 类型安全。示例结构如下：

```typescript
export const siteConfig = {
  title: 'CSS 学习笔记',
  github: 'https://github.com/your-repo/css-notes', // 替换为实际仓库地址
  sidebarDepth: 3, // 侧边栏显示的标题深度
  showEditLink: true, // 是否显示跳转到 GitHub 编辑的链接
  defaultTheme: 'light',
  enableSearch: true,
  // [新增] SEO 相关元信息
  description: '一个专注于 CSS 知识学习与实践的纯静态笔记网站。',
  keywords: 'CSS, 学习, 教程, 笔记, 前端, 开发',
  // 国际化相关配置预留，例如：
  // i18n: {
  //   defaultLang: 'zh-CN',
  //   langs: ['zh-CN', 'en-US']
  // }
}
```

### 📄 文档 Frontmatter 配置

每个 `.mdx` 文件都可包含一个 YAML Frontmatter 区域，用于定义文档元信息和 Playground 示例的特定配置，示例结构如下：

```yaml
---
title: "Box Model 基础"
category: "布局基础" # 用于索引页的分类
tags:
  - margin
  - padding # 用于索引页的标签
---
```

### 🚀 部署方案

项目将采用**纯静态部署方式**，主要部署目标为 **GitHub Pages**。

* **部署 URL**：`http://blog.zenheart.site/learn-css/`，项目将适配 `/learn-css` 作为基础路径。
* **自动化部署**：通过配置 GitHub Actions 等 CI/CD 工具，实现代码提交后自动构建并将静态文件部署到指定分支。
* **构建流程**：**利用 Vite 遍历构建，生成路由、搜索索引等所有必要信息。**
* **缓存策略**：将考虑在构建产物中使用哈希化的文件名，以配合 CDN 缓存策略，解决版本更新后的缓存失效问题。

## **项目通用事项与规范**

* **环境准备：**
  * [ ] 安装 Node.js (推荐 v23+) 采用 pnpm
  * [ ] 安装 Git。
  * [ ] 配置 IDE (VS Code 推荐)，安装 ESLint, Prettier 插件。
* **Git 流程：**
  * [ ] 遵循 GitHub Flow：所有开发在特性分支 (`feature/xxx`, `bugfix/xxx`) 上进行。
  * [ ] Pull Request (PR) 必须经过至少一名成员 Code Review 后合并。
  * [ ] Commit Message 遵循 Conventional Commits 规范。
* **代码规范：**
  * [ ] 所有代码遵循 `.eslintrc.cjs` 和 `.prettierrc` 定义的规范。
  * [ ] 严格遵循 TypeScript 类型定义。
* **沟通与协作：**
  * [ ] 每天参与站会，同步进展和阻碍。
  * [ ] 遇到问题及时通过团队协作工具提问。
  * [ ] 使用 GitHub Issues 进行任务分配、进度追踪和 Bug 管理。每个任务都应关联一个 Issue。
* **文档：**
  * [ ] 完成任务后，更新相关代码注释和技术文档（如果适用）。

-----

## **P1 阶段：基础架构搭建与核心文档展示 (MVP)**

**目标：** 构建项目的骨架，实现静态 MDX 文档的加载、渲染和基本导航，完成初步的 GitHub Pages 部署。

### 1\. **项目初始化与基础配置**

```
* [ ] **初始化 Vite 项目：**
    * 执行 `npm create vite@latest my-css-notes -- --template react-ts`。
    * 进入项目目录 `cd my-css-notes`。
    * 安装依赖 `npm install`。
* [ ] **清理默认模板代码：** 移除 Vite 默认生成的多余文件和示例代码。
* [ ] **配置 `vite.config.ts`：**
    * 配置 `base: '/learn-css/'` 以适配 GitHub Pages 部署路径。
    * 集成 MDX 插件配置（后续任务完成具体集成）。
* [ ] **配置代码规范工具：**
    * 创建 `.prettierrc` 文件，配置代码格式化规则。
    * 创建 `.eslintrc.cjs` 文件，配置 ESLint 代码检查规则。
    * 安装 VS Code 相关的 ESLint 和 Prettier 插件。
* [ ] **初步运行验证：**
    * 执行 `npm run dev` 启动开发服务器。
    * 验证浏览器访问 `localhost:5173/learn-css/` （或相应端口及路径）能显示空白页面或基本内容。
```

### 2\. **路由配置 (`@tanstack/react-router`)**

```
* [ ] **安装路由库：**
    * 安装 `@tanstack/react-router` 及相关依赖。
* [ ] **定义路由结构：**
    * 创建 `src/routes.ts` 文件。
    * 使用 `createHashRouter` 定义以下基础路由：
        * 根路由：`/` 或 `/#/` (对应 `HomePage` 组件)
        * 学习页路由：`/topics` 或 `/#/topics` (对应 `TopicsPage` 组件)
        * 索引页路由：`/reference` 或 `/#/reference` (对应 `ReferencePage` 组件)
        * 示例详情页路由：`/playground/:id` 或 `/#/playground/:id` (对应 `PlaygroundDetailPage` 组件)
* [ ] **集成到主应用：**
    * 在 `src/main.tsx` 中使用 `RouterProvider` 渲染根路由。
* [ ] **初步路由验证：**
    * 验证浏览器能通过 Hash 形式（例如 `/#/topics`）访问到对应的页面组件。
    * 验证页面刷新后，当前 Hash 路由状态能正确保持。
```

### 3\. **MDX 加载与基础渲染**

```
* [ ] **安装 MDX 插件：**
    * 安装 `vite-plugin-mdx` (或选定的其他 Vite MDX 插件)。
    * 安装 `remark-gfm` (支持 GitHub Flavored Markdown)。
    * 安装 `remark-frontmatter` (解析 YAML Frontmatter)。
* [ ] **配置 `vite.config.ts`：**
    * 在 Vite 配置中添加 MDX 插件并配置 `remark` 插件。
* [ ] **创建 MDX 内容：**
    * 在 `src/topics/` 目录下创建示例 MDX 文件 (例如 `src/topics/01.basics/01.box-model.mdx`)，包含标题、段落、列表、代码块、YAML Frontmatter。
* [ ] **开发 MDX 渲染组件：**
    * 创建 `src/components/MdxRenderer.tsx` 组件，用于接收 MDX 内容并渲染。
    * 在该组件中处理 MDX 内容的渲染，确保 Markdown 语法正确解析。
* [ ] **在学习页加载 MDX：**
    * 在 `TopicsPage` 组件中，尝试导入并渲染一个 MDX 文件，验证内容显示。
```

### 4\. **侧边栏导航自动生成与渲染**

```
* [ ] **设计侧边栏数据结构：**
    * 定义一个 TypeScript 接口来描述侧边栏导航项的数据结构，包含 `title`, `path`, `children` 等。
* [ ] **构建时生成侧边栏数据：**
    * 编写 Vite 插件或 Node.js 脚本，在构建时遍历 `src/topics/` 目录。
    * 根据文件路径和 `01.xx.mdx` 的命名规范，收集所有 MDX 文件的 Frontmatter (`title`) 和路径。
    * 将收集到的数据按照目录结构组织成嵌套的 JSON 格式（例如 `src/data/sidebar.json`）。
* [ ] **开发侧边栏组件：**
    * 创建 `src/components/Sidebar.tsx` 组件。
    * 从 `src/data/sidebar.json` 读取导航数据。
    * 使用递归组件渲染嵌套菜单，实现点击展开/折叠功能（无需记忆状态）。
    * 使用 `@tanstack/react-router` 的 `<Link>` 组件生成导航链接，确保适配 Hash 路由和 base path。
* [ ] **集成到学习页：**
    * 在 `TopicsPage` 组件中集成 `Sidebar` 组件和 `MdxRenderer` 组件，实现左右两栏布局。
* [ ] **配置侧边栏深度：**
    * 在 `site.config.ts` 中添加 `sidebarDepth: number` 配置项。
    * 修改 `Sidebar` 组件，根据 `sidebarDepth` 控制侧边栏的展示层级。
```

### 5\. **首页 (`/#/`) 基础搭建**

```
* [ ] **创建首页组件：**
    * 创建 `src/pages/HomePage.tsx` 组件。
* [ ] **实现 Hero 区：**
    * 显示网站标题、副标题，从 `site.config.ts` 获取。
* [ ] **实现快速导航：**
    * 添加按钮或链接，跳转到 `/#/topics`, `/#/reference`, `/#/playground`。
* [ ] **集成 GitHub 链接：**
    * 显示 GitHub 仓库链接，从 `site.config.ts` 获取。
* [ ] **占位符：**
    * 为“网站结构说明”和“CSS 学习路线图”添加占位符文本或区块。
```

### 6\. **GitHub Pages 自动化部署**

```
* [ ] **创建 GitHub Actions Workflow：**
    * 在项目根目录创建 `.github/workflows/deploy.yml` 文件。
* [ ] **配置部署步骤：**
    * 使用 `actions/checkout@v4` 检出代码。
    * 使用 `actions/setup-node@v4` 设置 Node.js 环境。
    * 安装依赖并运行 `npm run build`。
    * 使用 `peaceiris/actions-gh-pages@v3` 部署到 `gh-pages` 分支。
* [ ] **验证部署：**
    * 将代码推送到 GitHub `main` 分支，观察 Actions 运行情况。
    * 验证网站能通过 `http://blog.zenheart.site/learn-css/` 访问。
    * 验证所有路由和资源加载正常。
```

-----

## **P2 阶段：交互式 Playground 与基础搜索 (核心功能)**

**目标：** 实现内嵌 Playground、独立的示例详情页以及网站的全局搜索功能。

### 7\. **CodeMirror 编辑器集成**

```
* [ ] **安装 CodeMirror 库：**
    * 安装 `@codemirror/state`, `@codemirror/view`, `@codemirror/lang-html`, `@codemirror/lang-css`, `@codemirror/lang-javascript` 等核心包和语言支持。
* [ ] **创建 CodeMirror 组件：**
    * 创建 `src/components/CodeEditor.tsx` 组件。
    * 使用 `React.useRef` 和 `React.useEffect` 封装 CodeMirror 实例。
    * 组件接收 `value: string`, `language: 'html' | 'css' | 'javascript'`, `onChange: (newValue: string) => void` 等 props。
    * 实现代码高亮。
* [ ] **验证：**
    * 在测试页面渲染 `CodeEditor`，验证代码编辑和高亮功能。
```

### 8\. **自定义 Playground 模块核心开发**

```
* [ ] **设计 Playground 组件 API：**
    * 定义 `Playground` 组件的 Props 接口，例如 `files: Record<string, string>`, `initialActiveFile?: string`, `showConsole?: boolean`, `onCodeChange?: (files: Record<string, string>) => void`。
* [ ] **实现 `iframe` 沙箱：**
    * 在 `Playground` 组件中渲染一个 `iframe` 元素。
    * 实现将 `files` 内容动态组合成单个 HTML 字符串（包含内联 `<style>` 和 `<script>` 标签）并设置到 `iframe.srcdoc`。
* [ ] **实现实时预览与防抖：**
    * 监听 CodeMirror 组件的 `onChange` 事件。
    * 使用 200ms 防抖函数来触发 `iframe` 内容的更新。
* [ ] **实现错误控制台与日志输出：**
    * 在 `iframe` 内部注入 JS 脚本，劫持 `window.onerror` 和 `console` 方法。
    * 通过 `window.parent.postMessage` 将错误和日志信息发送给父组件。
    * 在 `Playground` 组件中接收 `postMessage`，并在 UI 上显示错误/日志。
    * 实现 `showConsole` 开关控制控制台区域显示。
* [ ] **实现多文件标签切换：**
    * 根据 `files` prop 渲染文件标签页。
    * 点击标签切换当前激活文件，更新 CodeMirror 的 `value`。
* [ ] **实现重置代码功能：**
    * 按钮点击时，将 CodeMirror 内容恢复到 `initialFiles` 状态。
* [ ] **实现添加新文件与自定义文件名：**
    * “+”按钮允许用户添加新的 `.html`, `.css`, `.js` 文件。
    * 用户输入文件名后，将新文件添加到 `Playground` 内部状态的 `files` 中。
* [ ] **安全加固：**
    * 对 `iframe` 添加必要的 `sandbox` 属性，限制不必要的权限（如 `allow-scripts`, `allow-same-origin` 等，根据需求细化）。
* [ ] **验证：**
    * 创建包含 HTML/CSS/JS 的复杂示例，验证所有功能。
```

### 9\. **MDX 中的 Playground 集成与 Frontmatter 解析**

```
* [ ] **细化 MDX 解析器配置：**
    * 在 `vite.config.ts` 中，确保 MDX 插件能正确处理自定义 JSX 组件（例如 `<Playground />`）。
    * 确认 Frontmatter 的解析器 (如 `remark-frontmatter` 配合 `gray-matter`) 能正确提取 `playgroundId`, `playgroundMode`, `initialCode`, `solutionCode`。
* [ ] **在 `MdxRenderer` 中渲染 Playground：**
    * 修改 `MdxRenderer` 组件，识别 MDX 内容中的特定标记（如 `<Playground />` 组件）。
    * 将从 Frontmatter 中解析到的 `initialCode`, `playgroundMode` 等 Props 传递给 `Playground` 组件。
    * 确保 MDX 中的其他内容和 Playground 组件能和谐共存。
```

### 10\. **示例详情页 (`/#/playground/:id`) 开发**

```
* [ ] **数据收集：**
    * 修改构建时脚本（或 Vite 插件），遍历所有 MDX 文件。
    * 提取所有包含 `playgroundId` 的 Frontmatter 数据（`id`, `title`, `initialCode`, `solutionCode`, `category` 等）。
    * 生成一个汇总所有 Playground 示例的 JSON 文件 (例如 `src/data/allPlaygrounds.json`)。
* [ ] **创建示例详情页组件：**
    * 创建 `src/pages/PlaygroundDetailPage.tsx`。
    * 使用 `@tanstack/react-router` 获取 URL 中的 `:id` 参数。
    * 根据 `:id` 从 `allPlaygrounds.json` 中查找并加载对应的示例代码。
* [ ] **实现左侧示例导航：**
    * 在 `PlaygroundDetailPage` 中，根据 `allPlaygrounds.json` 和 MDX 的主题目录结构，渲染左侧导航。
    * 导航应按主题分组，可嵌套，点击能切换示例并更新 URL。
* [ ] **集成 Playground 核心区域：**
    * 在右侧区域渲染 `Playground` 组件，传递加载到的示例代码。
    * 确保此处的 Playground 拥有所有核心功能（编辑、预览、错误等）。
* [ ] **实现 `Open Sandbox` 按钮功能：**
    * 在内嵌 Playground 组件中，实现点击按钮后跳转到 `/#/playground/:id` 的逻辑。
```

### 11\. **全局搜索功能实现**

```
* [ ] **搜索库选型与安装：**
    * 调研并选择对中文支持最好的前端搜索库 (例如 `FlexSearch.js`，需要了解其分词配置)。
    * 安装选定的库。
* [ ] **构建搜索索引：**
    * 编写 Vite 插件或 Node.js 脚本。
    * 在构建时遍历所有 MDX 文件，提取 Frontmatter、标题和正文内容。
    * 使用选定的搜索库生成一个优化的搜索索引 JSON 文件。
* [ ] **搜索 UI 开发：**
    * 设计并开发全局搜索框组件 (可作为顶栏的一部分或弹窗)。
    * 实现 `Ctrl+K` 快捷键打开搜索面板。
* [ ] **搜索逻辑实现：**
    * 在前端加载搜索索引 JSON。
    * 监听用户输入，使用搜索库进行实时模糊匹配查询 (200ms 防抖)。
    * 渲染搜索结果列表，显示文档标题和匹配的上下文摘要。
* [ ] **跳转与高亮：**
    * 点击搜索结果，使用 `@tanstack/react-router` 跳转到对应文档。
    * 在目标文档页面，使用 JavaScript 高亮显示匹配的关键词。
```

-----

## **P3 阶段：高级功能与体验优化 (完善与优化)**

**目标：** 完善索引页、引入练习模式、提供下载功能，并进行整体优化。

### 12\. **索引页 (`/#/reference`) 数据与 UI**

```
* [ ] **数据收集与处理：**
    * 修改构建时脚本，遍历所有 MDX 文件。
    * 提取 Frontmatter 中的 `category` 和 `tags`。如果 `category` 未定义，使用文件名作为默认类别。
    * 生成一个 JSON 文件，包含按 `category` 分组、按字母排序的文档列表及相关链接。
* [ ] **创建索引页组件：**
    * 创建 `src/pages/ReferencePage.tsx`。
    * 渲染分类导航栏和索引表格/列表。
    * 实现点击索引项跳转到对应文档。
* [ ] **索引页搜索功能：**
    * 在索引页内添加搜索框，实现对索引列表中关键词的过滤。
```

### 13\. **Playground 下载为 ZIP 功能**

```
* [ ] **安装库：**
    * 安装 `jszip` 和 `file-saver`。
* [ ] **实现下载逻辑：**
    * 在 `Playground` 组件内添加“下载代码”按钮。
    * 点击按钮时，获取当前 `files` 中所有文件的内容。
    * 使用 `jszip` 创建 ZIP 文件，将文件添加进去。
    * 使用 `file-saver` 触发浏览器下载，文件名如 `playground-example.zip`。
```

### 14\. **“小练习”模式实现**

```
* [ ] **修改 Playground 组件：**
    * 根据 `playgroundMode` prop（从 Frontmatter 获取），切换 Playground 的显示模式。
    * 当 `playgroundMode` 为 `"test"` 时，初始显示 `initialCode`。
    * 添加“显示答案”按钮。
    * 点击“显示答案”时，将编辑器内容切换为 `solutionCode`。
    * **不实现自动测试运行，仅做代码切换。**
* [ ] **预留 `WebTest` 接口：**
    * 在代码中添加注释或简单接口定义，表明未来可在此处集成更复杂的浏览器能力验证逻辑。
```

### 15\. **响应式布局优化**

```
* [ ] **整体布局调整：**
    * 使用 CSS Media Queries 确保页面的主体布局在不同尺寸下保持良好。
    * 确保内容区在所有屏幕尺寸下不出现横向滚动条（代码块除外）。
* [ ] **侧边栏响应式：**
    * 在窄屏幕下 (例如 `max-width: 768px`)，默认隐藏左侧侧边栏。
    * 实现一个汉堡菜单按钮，点击可唤出侧边栏。
    * 确保侧边栏弹出/收回动画流畅。
* [ ] **Playground 区域响应式：**
    * 确保编辑器和预览区域在小屏幕下能合理自适应，例如堆叠显示或缩小比例。
```

### 16\. **GitHub 编辑链接功能**

```
* [ ] **修改学习页布局：**
    * 在 `TopicsPage` 或 `MdxRenderer` 中，在文档标题附近添加“在 GitHub 编辑此页”的按钮/链接。
* [ ] **生成编辑 URL：**
    * 根据当前 MDX 文件的相对路径和 `site.config.ts` 中的 `github` 仓库地址，动态生成对应的 GitHub 编辑 URL。
    * URL 格式应为 `https://github.com/your-repo/edit/main/src/topics/path/to/your-doc.mdx`。
```

### 17\. **CSS 学习路线图 (Roadmap)**

```
* [ ] **设计 Roadmap 数据结构：**
    * 定义一个 JSON 文件（例如 `src/data/roadmap.json`）来描述 Roadmap 的节点和连接关系，包含 `title`, `link`, `description` 等。
* [ ] **开发 Roadmap 组件：**
    * 在首页 (`HomePage`) 中创建或引用 `Roadmap` 组件。
    * 使用 SVG 结合 React 渲染 Roadmap 的图形结构。
    * 为每个 Roadmap 节点添加点击事件，使其能够跳转到对应的学习页 (`/#/topics/path-to-doc`)。
```

### 18\. **代码分割 (Code Splitting)**

```
* [ ] **识别分割点：**
    * 分析项目结构，识别出适合进行代码分割的模块，例如：
        * 路由级别分割（每个页面组件）。
        * 大型库（如 CodeMirror）的按需加载。
* [ ] **配置 Vite/Rollup：**
    * 利用 Vite 的动态导入 (`import()`) 功能，实现路由组件的懒加载。
    * 验证打包产物中是否存在分割后的 JS chunk。
```

-----

## **P4 阶段：未来迭代与高级优化 (长期规划)**

**目标：** 这些是当前版本不强制要求完成，但已在架构中预留接口或在设计时考虑其可扩展性的功能。

* [ ] **国际化 (i18n) 完整支持：**
  * 细化语言文件结构（参考 Docusaurus）。
  * 实现语言切换 UI。
  * 为所有 UI 文本和 MDX 内容提供多语言版本。
* [ ] **WebAssembly/Web Worker 集成：**
  * 调研在浏览器端运行 SCSS/PostCSS 编译或更复杂测试的可行方案。
  * 初步实现概念验证 (POC)。
* [ ] **用户个性化：**
  * 实现浏览器本地存储（LocalStorage/IndexedDB）来保存学习进度。
  * 允许用户收藏文档或 Playground 示例。
  * 允许用户本地保存自定义的 Playground 代码。
* [ ] **评论系统集成：**
  * 调研并集成轻量级评论系统 (如 Giscus, Utterances)。
* [ ] **更细致的搜索优化：**
  * 增加拼写纠错功能。
  * 支持同义词搜索。
* [ ] **可视化测试：**
  * 结合 Playground 验证 CSS 渲染效果是否符合预期，可能需要更专业的测试框架或工具。
