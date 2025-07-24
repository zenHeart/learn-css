import { Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

interface PlaygroundData {
  id: string
  mode: 'demo' | 'exercise' | 'test'
  initialCode: Record<string, string>
  solutionCode?: Record<string, string>
}

export function playgroundLoader(): Plugin {
  return {
    name: 'playground-loader',
    
    // 在构建时扫描 MDX 文件
    buildStart() {
      this.addWatchFile(path.resolve('src/topics'))
    },
    
    // 处理 MDX 文件中的 Playground 组件
    async transform(code: string, id: string) {
      if (!id.endsWith('.mdx')) return null
      
      // 查找 Playground 注释标记
      const playgroundRegex = /{\/\*\s*@playground\s+id="([^"]+)"\s+mode="([^"]+)"\s*\*\/}/g
      const matches = [...code.matchAll(playgroundRegex)]
      
      if (matches.length === 0) return null
      
      const playgrounds: PlaygroundData[] = []
      
      for (const match of matches) {
        const [, playgroundId, mode] = match
        const playgroundData = await this.loadPlaygroundCode(id, playgroundId, mode as any)
        if (playgroundData) {
          playgrounds.push(playgroundData)
        }
      }
      
      // 生成 Playground 数据
      if (playgrounds.length > 0) {
        const playgroundDataCode = `export const playgrounds = ${JSON.stringify(playgrounds, null, 2)};`
        return {
          code: code + '\n' + playgroundDataCode,
          map: null
        }
      }
      
      return null
    },
    
    // 加载 Playground 代码文件
    async loadPlaygroundCode(mdxPath: string, playgroundId: string, mode: string): Promise<PlaygroundData | null> {
      const mdxDir = path.dirname(mdxPath)
      const playgroundDir = path.join(mdxDir, '_demos', playgroundId)
      
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
  }
} 