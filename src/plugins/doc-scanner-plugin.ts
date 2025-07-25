import { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

export interface DocItem {
  id: string
  title: string
  path: string
  category: string
  tags: string[]
  description: string
  frontmatter: Record<string, any>
  content: string // 添加完整的 MDX 内容
  playgrounds: PlaygroundItem[]
}

export interface PlaygroundItem {
  id: string
  mode: 'demo' | 'exercise' | 'test'
  initialCode: Record<string, string>
  solutionCode?: Record<string, string>
}

export interface SidebarItem {
  title: string
  path: string
  children?: SidebarItem[]
  frontmatter?: Record<string, any>
  sortWeight?: number // 添加排序权重字段
}

class DocScanner {
  private topicsDir: string
  private demosDir: string

  constructor() {
    this.topicsDir = path.resolve('src/topics')
    this.demosDir = '_demos'
  }

  // 提取数字前缀的辅助函数
  private extractSortWeight(name: string): number {
    const match = name.match(/^(\d+)\./)
    return match ? parseInt(match[1], 10) : 9999
  }

  // 扫描所有文档
  async scanAllDocs(): Promise<DocItem[]> {
    const docs: DocItem[] = []
    
    if (!fs.existsSync(this.topicsDir)) {
      console.warn('Topics directory not found:', this.topicsDir)
      return docs
    }

    await this.scanDirectory(this.topicsDir, '', docs)
    return docs
  }

  // 递归扫描目录
  private async scanDirectory(dirPath: string, relativePath: string, docs: DocItem[]): Promise<void> {
    const items = fs.readdirSync(dirPath, { withFileTypes: true })
    
    // 按名称排序（支持 01.xx.mdx 格式）
    items.sort((a, b) => {
      // 提取数字前缀的函数
      const extractNumber = (name: string): number => {
        const match = name.match(/^(\d+)\./)
        return match ? parseInt(match[1], 10) : 9999
      }
      
      // 获取数字前缀
      const numA = extractNumber(a.name)
      const numB = extractNumber(b.name)
      
      // 先按数字前缀排序
      if (numA !== numB) {
        return numA - numB
      }
      
      // 如果数字前缀相同，按文件类型排序（目录优先）
      if (a.isDirectory() && b.isFile()) return -1
      if (a.isFile() && b.isDirectory()) return 1
      
      // 同类型按名称排序
      return a.name.localeCompare(b.name)
    })

    for (const item of items) {
      const fullPath = path.join(dirPath, item.name)
      const itemRelativePath = path.join(relativePath, item.name)

      if (item.isDirectory()) {
        // 扫描子目录
        await this.scanDirectory(fullPath, itemRelativePath, docs)
      } else if (item.isFile() && item.name.endsWith('.mdx')) {
        // 处理 MDX 文件
        const doc = await this.processMdxFile(fullPath, itemRelativePath)
        if (doc) {
          docs.push(doc)
        }
      }
    }
  }

  // 处理单个 MDX 文件
  private async processMdxFile(filePath: string, relativePath: string): Promise<DocItem | null> {
    try {
      const rawContent = fs.readFileSync(filePath, 'utf-8')
      const frontmatter = this.extractFrontmatter(rawContent)
      const mdxContent = this.extractMdxContent(rawContent)
      
      // 生成文档 ID
      const docId = this.generateDocId(relativePath)
      
      // 扫描 Playground
      const playgrounds = await this.scanPlaygrounds(filePath, docId)
      
      return {
        id: docId,
        title: frontmatter.title || this.generateTitle(relativePath),
        path: relativePath,
        category: frontmatter.category || this.extractCategory(relativePath),
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        description: frontmatter.description || '',
        frontmatter,
        content: mdxContent, // 添加完整的 MDX 内容
        playgrounds
      }
    } catch (error) {
      console.error('Error processing MDX file:', filePath, error)
      return null
    }
  }

  // 提取 Frontmatter
  private extractFrontmatter(content: string): Record<string, any> {
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/)
    if (!frontmatterMatch) {
      return {}
    }

    const frontmatterStr = frontmatterMatch[1]
    const frontmatter: Record<string, any> = {}
    
    frontmatterStr.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':')
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim()
        const value = line.substring(colonIndex + 1).trim()
        
        // 处理数组类型的值
        if (value.startsWith('[') && value.endsWith(']')) {
          const arrayContent = value.slice(1, -1).trim()
          if (arrayContent) {
            frontmatter[key] = arrayContent.split(',').map(v => v.trim().replace(/['"]/g, '')).filter(v => v !== '')
          } else {
            frontmatter[key] = []
          }
        } else {
          frontmatter[key] = value.replace(/['"]/g, '')
        }
      }
    })

    return frontmatter
  }

  // 提取 MDX 内容（去除 frontmatter）
  private extractMdxContent(content: string): string {
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/)
    if (frontmatterMatch) {
      // 返回去除 frontmatter 后的内容
      return content.substring(frontmatterMatch[0].length).trim()
    }
    // 如果没有 frontmatter，返回整个内容
    return content.trim()
  }

  // 生成文档 ID
  private generateDocId(relativePath: string): string {
    let id = relativePath
      .replace(/\.mdx$/, '')
      .replace(/[\/\\]/g, '-')
      .toLowerCase()
    
    // 如果是 index.mdx 文件，使用其父目录作为 ID
    if (id.endsWith('-index')) {
      id = id.replace(/-index$/, '')
    }
    
    return id
  }

  // 生成标题
  private generateTitle(relativePath: string): string {
    const fileName = path.basename(relativePath, '.mdx')
    
    // 如果是 index，使用父目录名称
    if (fileName === 'index') {
      const parentDir = path.dirname(relativePath)
      if (parentDir && parentDir !== '.') {
        const dirName = path.basename(parentDir)
        return dirName
          .replace(/^\d+\./, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase())
      }
    }
    
    return fileName
      .replace(/^\d+\./, '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
  }

  // 提取分类
  private extractCategory(relativePath: string): string {
    const parts = relativePath.split(path.sep)
    if (parts.length >= 2) {
      return parts[0].replace(/^\d+\./, '')
    }
    return '未分类'
  }

  // 扫描 Playground
  private async scanPlaygrounds(mdxPath: string, docId: string): Promise<PlaygroundItem[]> {
    const playgrounds: PlaygroundItem[] = []
    const mdxDir = path.dirname(mdxPath)
    const demosPath = path.join(mdxDir, this.demosDir)
    
    if (!fs.existsSync(demosPath)) {
      return playgrounds
    }

    const rawContent = fs.readFileSync(mdxPath, 'utf-8')
    const mdxContent = this.extractMdxContent(rawContent)
    const playgroundMatches = mdxContent.matchAll(/\{\s*\/\*\s*@playground\s+id="([^"]+)"\s+mode="([^"]+)"\s*\*\/\s*\}/g)
    
    for (const match of playgroundMatches) {
      const [, playgroundId, mode] = match
      
      // 优先查找单文件（.html）
      const singleFilePath = path.join(demosPath, `${playgroundId}.html`)
      if (fs.existsSync(singleFilePath)) {
        const playground = await this.loadPlaygroundFromSingleFile(singleFilePath, playgroundId, mode as any)
        if (playground) {
          playgrounds.push(playground)
        }
        continue
      }
      
      // 如果没有单文件，查找文件夹
      const playgroundDir = path.join(demosPath, playgroundId)
      if (fs.existsSync(playgroundDir)) {
        const playground = await this.loadPlaygroundFromDirectory(playgroundDir, playgroundId, mode as any)
        if (playground) {
          playgrounds.push(playground)
        }
      }
    }

    return playgrounds
  }

  // 从文件夹加载 Playground 代码
  private async loadPlaygroundFromDirectory(playgroundDir: string, playgroundId: string, mode: string): Promise<PlaygroundItem | null> {
    try {
      const initialCode: Record<string, string> = {}
      const solutionCode: Record<string, string> = {}

      // 读取初始代码文件
      const initialFiles = ['index.html', 'style.css', 'script.js']
      for (const fileName of initialFiles) {
        const filePath = path.join(playgroundDir, fileName)
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8')
          initialCode[fileName] = content
        }
      }

      // 如果是练习模式，读取解决方案代码
      if (mode === 'exercise') {
        const solutionFiles = ['solution.html', 'solution.css', 'solution.js']
        for (const fileName of solutionFiles) {
          const filePath = path.join(playgroundDir, fileName)
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8')
            solutionCode[fileName] = content
          }
        }
      }

      return {
        id: playgroundId,
        mode: mode as any,
        initialCode,
        solutionCode: Object.keys(solutionCode).length > 0 ? solutionCode : undefined
      }
    } catch (error) {
      console.warn(`无法加载 Playground ${playgroundId}:`, error)
      return null
    }
  }

  // 规范化代码格式（移除多余缩进和空行）
  private normalizeCode(code: string): string {
    if (!code || !code.trim()) return ''
    
    const lines = code.split('\n')
    
    // 移除开头和结尾的空行
    while (lines.length > 0 && !lines[0].trim()) {
      lines.shift()
    }
    while (lines.length > 0 && !lines[lines.length - 1].trim()) {
      lines.pop()
    }
    
    if (lines.length === 0) return ''
    
    // 找到最小缩进级别（忽略空行）
    let minIndent = Infinity
    for (const line of lines) {
      if (line.trim()) {
        const match = line.match(/^(\s*)/)
        if (match) {
          minIndent = Math.min(minIndent, match[1].length)
        }
      }
    }
    
    // 如果所有行都有相同的最小缩进，移除这个缩进
    if (minIndent > 0 && minIndent !== Infinity) {
      return lines
        .map(line => line.startsWith(' '.repeat(minIndent)) ? line.slice(minIndent) : line)
        .join('\n')
        .trim()
    }
    
    return lines.join('\n').trim()
  }

  // 格式化 CSS 代码
  private formatCssCode(cssCode: string): string {
    if (!cssCode || !cssCode.trim()) return ''
    
    // 先进行基础规范化
    let formatted = this.normalizeCode(cssCode)
    
    // CSS 特定的格式化
    const lines = formatted.split('\n')
    const formattedLines: string[] = []
    let indentLevel = 0
    const indentSize = 2 // CSS 使用 2 空格缩进
    
    for (let line of lines) {
      line = line.trim()
      if (!line) continue
      
      // 处理闭合大括号
      if (line === '}') {
        indentLevel = Math.max(0, indentLevel - 1)
        formattedLines.push(' '.repeat(indentLevel * indentSize) + line)
        continue
      }
      
      // 添加当前行（带缩进）
      formattedLines.push(' '.repeat(indentLevel * indentSize) + line)
      
      // 处理开放大括号
      if (line.endsWith('{')) {
        indentLevel++
      }
    }
    
    return formattedLines.join('\n')
  }

  // 格式化 JavaScript 代码
  private formatJsCode(jsCode: string): string {
    if (!jsCode || !jsCode.trim()) return ''
    
    // 先进行基础规范化
    let formatted = this.normalizeCode(jsCode)
    
    // JavaScript 特定的格式化
    const lines = formatted.split('\n')
    const formattedLines: string[] = []
    let indentLevel = 0
    const indentSize = 2 // JavaScript 使用 2 空格缩进
    
    for (let line of lines) {
      line = line.trim()
      if (!line) continue
      
      // 处理闭合大括号和小括号
      if (line.startsWith('}') || line.startsWith(')')) {
        indentLevel = Math.max(0, indentLevel - 1)
      }
      
      // 添加当前行（带缩进）
      formattedLines.push(' '.repeat(indentLevel * indentSize) + line)
      
      // 处理开放大括号和小括号
      if (line.endsWith('{') || line.endsWith('(')) {
        indentLevel++
      }
      
      // 处理函数声明和控制结构
      if (line.includes('function') && line.endsWith('{')) {
        // 已经在上面处理了
      } else if (['if', 'for', 'while', 'try', 'catch'].some(keyword => line.startsWith(keyword))) {
        if (line.endsWith('{')) {
          // 已经在上面处理了
        }
      }
    }
    
    return formattedLines.join('\n')
  }

  // 格式化完整的 HTML 文档
  private formatHtmlDocument(htmlContent: string, playgroundId: string): string {
    // 简单的 HTML 格式化，确保基本的缩进结构
    const lines = htmlContent.split('\n')
    const formattedLines: string[] = []
    let indentLevel = 0
    const indentSize = 4
    
    for (let line of lines) {
      line = line.trim()
      if (!line) continue
      
      // 检查是否是闭合标签
      if (line.startsWith('</')) {
        indentLevel = Math.max(0, indentLevel - 1)
      }
      
      // 添加当前行（带缩进）
      if (line) {
        formattedLines.push(' '.repeat(indentLevel * indentSize) + line)
      }
      
      // 检查是否是开始标签（但不是自闭合标签）
      if (line.startsWith('<') && !line.startsWith('</') && !line.endsWith('/>') && !line.includes('<!DOCTYPE')) {
        const tagMatch = line.match(/<(\w+)/)
        if (tagMatch) {
          const tagName = tagMatch[1].toLowerCase()
          // 对于需要增加缩进的标签
          if (['html', 'head', 'body', 'div', 'section', 'article', 'nav', 'header', 'footer', 'main', 'aside'].includes(tagName)) {
            indentLevel++
          }
        }
      }
    }
    
    return formattedLines.join('\n')
  }

  // 从单个 HTML 文件加载 Playground 代码
  private async loadPlaygroundFromSingleFile(filePath: string, playgroundId: string, mode: string): Promise<PlaygroundItem | null> {
    try {
      const htmlContent = fs.readFileSync(filePath, 'utf-8')
      const initialCode: Record<string, string> = {}
      
      // 提取 CSS 样式
      const styleMatches = htmlContent.match(/<style[^>]*>([\s\S]*?)<\/style>/gi)
      if (styleMatches) {
        const cssContent = styleMatches
          .map(match => {
            const content = match.replace(/<\/?style[^>]*>/gi, '')
            return this.formatCssCode(content)
          })
          .filter(content => content.trim())
          .join('\n\n')
        
        if (cssContent) {
          initialCode['style.css'] = cssContent
        }
      }
      
      // 提取 JavaScript
      const scriptMatches = htmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/gi)
      if (scriptMatches) {
        const jsContent = scriptMatches
          .map(match => {
            const content = match.replace(/<\/?script[^>]*>/gi, '')
            return this.formatJsCode(content)
          })
          .filter(content => content.trim()) // 过滤空脚本
          .join('\n\n')
        
        if (jsContent) {
          initialCode['script.js'] = jsContent
        }
      }
      
      // 清理 HTML 内容（移除 style 和 script 标签）
      let cleanHtml = htmlContent
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      
      // 如果 HTML 是完整文档，提取 body 内容并重新构建
      const bodyMatch = cleanHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
      if (bodyMatch) {
        const bodyContent = this.normalizeCode(bodyMatch[1])
        const indentedBodyContent = bodyContent
          .split('\n')
          .map(line => line.trim() ? '    ' + line : line)
          .join('\n')
        
        cleanHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${playgroundId}</title>
</head>
<body>
${indentedBodyContent}
</body>
</html>`
      } else if (!cleanHtml.includes('<!DOCTYPE html>')) {
        // 如果不是完整文档，包装成完整的 HTML
        const normalizedContent = this.normalizeCode(cleanHtml)
        const indentedContent = normalizedContent
          .split('\n')
          .map(line => line.trim() ? '    ' + line : line)
          .join('\n')
        
        cleanHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${playgroundId}</title>
</head>
<body>
${indentedContent}
</body>
</html>`
      } else {
        // 如果已经是完整的 HTML 文档，只需要规范化格式
        cleanHtml = this.formatHtmlDocument(cleanHtml, playgroundId)
      }
      
      initialCode['index.html'] = cleanHtml
      
      return {
        id: playgroundId,
        mode: mode as any,
        initialCode,
        solutionCode: undefined
      }
    } catch (error) {
      console.warn(`无法加载单文件 Playground ${playgroundId}:`, error)
      return null
    }
  }

  // 检查目录是否只包含 index.mdx
  private checkDirectoryHasOnlyIndex(dirPath: string): boolean {
    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true })
      const mdxFiles = items.filter(item => item.isFile() && item.name.endsWith('.mdx'))
      
      // 只有一个 MDX 文件且是 index.mdx
      return mdxFiles.length === 1 && mdxFiles[0].name === 'index.mdx'
    } catch {
      return false
    }
  }

  // 生成侧边栏数据
  async generateSidebar(): Promise<SidebarItem[]> {
    const docs = await this.scanAllDocs()
    const root: SidebarItem[] = []
    
    // 创建路径到节点的映射
    const pathToNode = new Map<string, SidebarItem>()
    
    // 按路径排序，确保父目录在子项目之前处理
    docs.sort((a, b) => a.path.localeCompare(b.path))
    
    docs.forEach(doc => {
      const pathParts = doc.path.split(path.sep)
      let currentPath = ''
      let currentLevel = root
      
      // 检查是否是 index.mdx 文件
      const isIndexFile = pathParts[pathParts.length - 1] === 'index.mdx'
      
      // 如果是 index.mdx 文件，检查其父目录是否只包含这一个 MDX 文件
      if (isIndexFile && pathParts.length > 1) {
        const parentDirPath = path.join(this.topicsDir, ...pathParts.slice(0, -1))
        const hasOnlyIndex = this.checkDirectoryHasOnlyIndex(parentDirPath)
        
        if (hasOnlyIndex) {
          // 只创建到父目录级别，将其作为文档项
          const parentPathParts = pathParts.slice(0, -1)
          
          parentPathParts.forEach((part, index) => {
            const isLastPart = index === parentPathParts.length - 1
            currentPath = currentPath ? path.join(currentPath, part) : part
            
            // 查找当前层级中是否已有此项目
            let existingItem = currentLevel.find(item => {
              if (isLastPart) {
                return item.path === doc.id
              } else {
                return item.title === this.generateTitle(part) && !item.path
              }
            })
            
            if (!existingItem) {
              // 创建新项目
              const newItem: SidebarItem = {
                title: isLastPart ? doc.title : this.generateTitle(part),
                path: isLastPart ? doc.id : '',
                children: isLastPart ? undefined : [],
                frontmatter: isLastPart ? doc.frontmatter : undefined,
                sortWeight: this.extractSortWeight(part)
              }
              
              currentLevel.push(newItem)
              pathToNode.set(currentPath, newItem)
              existingItem = newItem
            }
            
            // 移动到下一层级
            if (!isLastPart) {
              if (!existingItem.children) {
                existingItem.children = []
              }
              currentLevel = existingItem.children
            }
          })
          
          return // 跳过正常的文件处理逻辑
        }
      }
      
      // 正常的文件处理逻辑
      pathParts.forEach((part, index) => {
        const isFile = index === pathParts.length - 1 && part.endsWith('.mdx')
        currentPath = currentPath ? path.join(currentPath, part) : part
        
        // 查找当前层级中是否已有此项目
        let existingItem = currentLevel.find(item => {
          // 对于文件，比较完整路径；对于目录，比较标题
          if (isFile) {
            return item.path === doc.id
          } else {
            return item.title === this.generateTitle(part) && !item.path
          }
        })
        
        if (!existingItem) {
          // 创建新项目
          const newItem: SidebarItem = {
            title: isFile ? doc.title : this.generateTitle(part),
            path: isFile ? doc.id : '',
            children: [],
            frontmatter: isFile ? doc.frontmatter : undefined,
            sortWeight: this.extractSortWeight(part)
          }
          
          currentLevel.push(newItem)
          pathToNode.set(currentPath, newItem)
          existingItem = newItem
        }
        
        // 移动到下一层级
        if (!isFile) {
          if (!existingItem.children) {
            existingItem.children = []
          }
          currentLevel = existingItem.children
        }
      })
    })
    
    // 递归排序和清理空目录
    const sortAndClean = (items: SidebarItem[]): SidebarItem[] => {
      return items
        .filter(item => {
          // 如果是文件，保留
          if (item.path) return true
          // 如果是目录且有子项目，保留
          if (item.children && item.children.length > 0) {
            item.children = sortAndClean(item.children)
            return item.children.length > 0
          }
          // 空目录，移除
          return false
        })
        .sort((a, b) => {
          // 首先按照数字前缀排序
          const weightA = a.sortWeight ?? 9999
          const weightB = b.sortWeight ?? 9999
          
          if (weightA !== weightB) {
            return weightA - weightB
          }
          
          // 如果数字前缀相同，目录在前，文件在后
          if (!a.path && b.path) return -1
          if (a.path && !b.path) return 1
          
          // 同类型按标题排序
          return a.title.localeCompare(b.title)
        })
    }
    
    return sortAndClean(root)
  }

  // 生成所有 Playground 数据
  async generateAllPlaygrounds(): Promise<Record<string, PlaygroundItem>> {
    const docs = await this.scanAllDocs()
    const allPlaygrounds: Record<string, PlaygroundItem> = {}

    docs.forEach(doc => {
      doc.playgrounds.forEach(playground => {
        allPlaygrounds[playground.id] = playground
      })
    })

    return allPlaygrounds
  }
}

export function docScannerPlugin(): Plugin {
  let server: any = null
  const scanner = new DocScanner()
  const VIRTUAL_MODULE_ID = 'virtual:doc-data'
  const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

  // 生成虚拟模块内容的函数
  async function generateVirtualModuleContent() {
    try {
      // 扫描所有文档
      const docs = await scanner.scanAllDocs()
      console.log(`扫描到 ${docs.length} 个文档`)
      
      // 生成侧边栏数据
      const sidebar = await scanner.generateSidebar()
      console.log(`生成侧边栏数据，包含 ${sidebar.length} 个根项目`)
      
      // 生成所有 Playground 数据
      const allPlaygrounds = await scanner.generateAllPlaygrounds()
      console.log(`生成 Playground 数据，包含 ${Object.keys(allPlaygrounds).length} 个示例`)
      
      // 生成路由数据
      const routes = docs.map(doc => ({
        id: doc.id,
        title: doc.title,
        path: doc.path,
        category: doc.category,
        playgrounds: doc.playgrounds.map(p => p.id)
      }))
      
      const generatedData = {
        sidebar: { items: sidebar },
        allDocs: docs,
        allPlaygrounds: allPlaygrounds,
        routes
      }
      
      console.log('文档扫描完成！')
      
      // 添加时间戳确保内容变化
      const timestamp = Date.now()
      
      return `
        // 生成时间: ${timestamp}
        export const sidebarData = ${JSON.stringify(generatedData.sidebar, null, 2)};
        export const allDocsData = ${JSON.stringify(generatedData.allDocs, null, 2)};
        export const allPlaygroundsData = ${JSON.stringify(generatedData.allPlaygrounds, null, 2)};
        export const routesData = ${JSON.stringify(generatedData.routes, null, 2)};
        
        export default {
          sidebar: sidebarData,
          allDocs: allDocsData,
          allPlaygrounds: allPlaygroundsData,
          routes: routesData
        };
      `
    } catch (error) {
      console.error('扫描文档时出错:', error)
      // 返回基本配置以避免前端错误
      return `
        export const sidebarData = { items: [] };
        export const allDocsData = [];
        export const allPlaygroundsData = {};
        export const routesData = [];
        
        export default {
          sidebar: sidebarData,
          allDocs: allDocsData,
          allPlaygrounds: allPlaygroundsData,
          routes: routesData
        };
      `
    }
  }

  return {
    name: 'doc-scanner',

    configureServer(_server) {
      server = _server

      // 监听 topics 目录的变化
      const watcher = server.watcher
      const topicsPath = path.resolve('src/topics')
      watcher.add(topicsPath)

      // 当 topics 目录下的文件发生变化时，重新加载虚拟模块
      watcher.on('add', handleFileChange)
      watcher.on('change', handleFileChange)
      watcher.on('unlink', handleFileChange)

      function handleFileChange(file: string) {
        // 检查变化的文件是否在 topics 目录下
        if (file.startsWith(topicsPath)) {
          console.log(
            `[doc-scanner] 文档文件变化: ${path.relative(topicsPath, file)}`,
          )
          
          // 获取虚拟模块
          const virtualModule = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID)
          if (virtualModule) {
            // 使虚拟模块失效
            server.moduleGraph.invalidateModule(virtualModule)
            
            // 使所有依赖虚拟模块的模块失效
            const importers = Array.from(virtualModule.importers || [])
            importers.forEach((importer: any) => {
              server.moduleGraph.invalidateModule(importer)
            })
            
            // 通知客户端更新
            if (importers.length > 0) {
              server.ws.send({
                type: 'update',
                updates: importers.map((importer: any) => ({
                  type: 'js-update',
                  path: importer.url,
                  acceptedPath: importer.url,
                }))
              })
            }
          }
        }
      }
    },

    async buildStart() {
      console.log('开始扫描文档...')
    },

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }
      return null
    },

    async load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return await generateVirtualModuleContent()
      }
      return null
    }
  }
} 