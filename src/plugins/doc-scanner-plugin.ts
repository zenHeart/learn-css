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
}

class DocScanner {
  private topicsDir: string
  private demosDir: string

  constructor() {
    this.topicsDir = path.resolve('src/topics')
    this.demosDir = '_demos'
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
      if (a.isDirectory() && b.isDirectory()) {
        return a.name.localeCompare(b.name)
      }
      if (a.isFile() && b.isFile()) {
        return a.name.localeCompare(b.name)
      }
      return a.isDirectory() ? -1 : 1
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
        tags: frontmatter.tags || [],
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
          frontmatter[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''))
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
    return relativePath
      .replace(/\.mdx$/, '')
      .replace(/[\/\\]/g, '-')
      .toLowerCase()
  }

  // 生成标题
  private generateTitle(relativePath: string): string {
    const fileName = path.basename(relativePath, '.mdx')
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
    const playgroundMatches = mdxContent.matchAll(/{\/\*\s*@playground\s+id="([^"]+)"\s+mode="([^"]+)"\s*\*\/}/g)
    
    for (const match of playgroundMatches) {
      const [, playgroundId, mode] = match
      const playgroundDir = path.join(demosPath, playgroundId)
      
      if (fs.existsSync(playgroundDir)) {
        const playground = await this.loadPlayground(playgroundDir, playgroundId, mode as any)
        if (playground) {
          playgrounds.push(playground)
        }
      }
    }

    return playgrounds
  }

  // 加载 Playground 代码
  private async loadPlayground(playgroundDir: string, playgroundId: string, mode: string): Promise<PlaygroundItem | null> {
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

  // 生成侧边栏数据
  async generateSidebar(): Promise<SidebarItem[]> {
    const docs = await this.scanAllDocs()
    const sidebarMap = new Map<string, SidebarItem>()

    // 按路径组织文档
    docs.forEach(doc => {
      const pathParts = doc.path.split(path.sep)
      let currentPath = ''
      
      pathParts.forEach((part, index) => {
        const isFile = index === pathParts.length - 1 && part.endsWith('.mdx')
        const itemPath = currentPath ? path.join(currentPath, part) : part
        
        if (!sidebarMap.has(itemPath)) {
          const title = isFile ? doc.title : this.generateTitle(part)
          sidebarMap.set(itemPath, {
            title,
            path: isFile ? doc.id : '',
            children: [],
            frontmatter: isFile ? doc.frontmatter : undefined
          })
        }
        
        if (index < pathParts.length - 1) {
          const parentPath = currentPath
          const parent = sidebarMap.get(parentPath)
          const current = sidebarMap.get(itemPath)
          
          if (parent && current && !parent.children?.find(child => child.path === current.path)) {
            if (!parent.children) parent.children = []
            parent.children.push(current)
          }
        }
        
        currentPath = itemPath
      })
    })

    // 返回根级别的项目
    return Array.from(sidebarMap.values()).filter(item => 
      !item.path.includes(path.sep)
    )
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