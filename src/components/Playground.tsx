import React, { useState, useEffect, useCallback } from 'react'
import CodeEditor from './CodeEditor'

interface PlaygroundProps {
  id: string
  mode?: 'demo' | 'exercise' | 'test'
  showConsole?: boolean
  showControl?: boolean
  initialCode?: Record<string, string>
  solutionCode?: Record<string, string>
  onCodeChange?: (files: Record<string, string>) => void
}

interface FileData {
  name: string
  content: string
  language: 'html' | 'css' | 'javascript'
}

const Playground: React.FC<PlaygroundProps> = ({
  id,
  mode = 'demo',
  showConsole = false,
  showControl = false,
  initialCode,
  solutionCode,
  onCodeChange
}) => {
  // 生成初始文件列表
  const generateInitialFiles = useCallback((): FileData[] => {
    const defaultFiles = [
      {
        name: 'index.html',
        content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playground</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body>
    <div class="container">
        <h1>Hello World</h1>
        <p>这是一个 Playground 示例。</p>
        <button id="btn">点击我</button>
    </div>
    <script src="./script.js"></script>
</body>
</html>`,
        language: 'html' as const
      },
      {
        name: 'style.css',
        content: `body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

.container {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
    color: #333;
    margin-bottom: 20px;
}

p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 20px;
}

button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
}

button:hover {
    background-color: #0056b3;
}`,
        language: 'css' as const
      },
      {
        name: 'script.js',
        content: `// JavaScript 代码
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('btn');
    
    btn.addEventListener('click', function() {
        alert('Hello from JavaScript!');
    });
    
    console.log('Playground 已加载');
});`,
        language: 'javascript' as const
      }
    ]

    // 如果有提供初始代码，直接使用
    if (initialCode && Object.keys(initialCode).length > 0) {
      const files: FileData[] = []
      
      // 确定文件语言类型
      const getLanguage = (fileName: string): 'html' | 'css' | 'javascript' => {
        if (fileName.endsWith('.html')) return 'html'
        if (fileName.endsWith('.css')) return 'css'
        if (fileName.endsWith('.js')) return 'javascript'
        return 'html' // 默认
      }
      
      // 按文件名排序，确保 index.html 在前面
      const sortedFiles = Object.entries(initialCode).sort(([a], [b]) => {
        if (a.includes('index.html')) return -1
        if (b.includes('index.html')) return 1
        return a.localeCompare(b)
      })
      
      for (const [fileName, content] of sortedFiles) {
        files.push({
          name: fileName,
          content: content,
          language: getLanguage(fileName)
        })
      }
      
      return files
    }
    
    return defaultFiles
  }, [initialCode])

  const [files, setFiles] = useState<FileData[]>(generateInitialFiles)
  const [activeFileIndex, setActiveFileIndex] = useState(0)
  const [previewHtml, setPreviewHtml] = useState('')
  const [consoleMessages, setConsoleMessages] = useState<string[]>([])
  const [editorWidth, setEditorWidth] = useState(50) // 编辑器宽度百分比
  const [isDragging, setIsDragging] = useState(false)
  const [isVerticalLayout, setIsVerticalLayout] = useState(false)
  const [mobileActiveTab, setMobileActiveTab] = useState<'preview' | 'editor'>('preview') // 移动端活动 tab

  // 当 initialCode 变化时，重新初始化文件
  useEffect(() => {
    const newFiles = generateInitialFiles()
    setFiles(newFiles)
    setActiveFileIndex(0)
  }, [generateInitialFiles])

  // 生成预览 HTML
  const generatePreviewHtml = useCallback((files: FileData[]) => {
    // 查找主 HTML 文件
    let htmlFile = files.find(f => f.name === 'index.html')
    if (!htmlFile) {
      htmlFile = files.find(f => f.name.endsWith('.html'))
    }
    
    if (!htmlFile) return ''

    let html = htmlFile.content

    // 如果只有一个 HTML 文件，直接使用（单文件模式）
    if (files.length === 1 && htmlFile.name.endsWith('.html')) {
      // 注入控制台重写代码
      const consoleOverride = `
        <script>
          (function() {
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            
            console.log = function(...args) {
              originalLog.apply(console, args);
              window.parent.postMessage({
                type: 'console',
                level: 'log',
                message: args.join(' ')
              }, '*');
            };
            
            console.error = function(...args) {
              originalError.apply(console, args);
              window.parent.postMessage({
                type: 'console',
                level: 'error',
                message: args.join(' ')
              }, '*');
            };
            
            console.warn = function(...args) {
              originalWarn.apply(console, args);
              window.parent.postMessage({
                type: 'console',
                level: 'warn',
                message: args.join(' ')
              }, '*');
            };
          })();
        </script>
      `
      html = html.replace('</body>', `${consoleOverride}\n</body>`)
      return html
    }

    // 多文件模式：替换外部引用为内联内容
    const cssFiles = files.filter(f => f.name.endsWith('.css'))
    const jsFiles = files.filter(f => f.name.endsWith('.js'))

    // 处理 CSS 文件：替换 link 标签和 style 标签的 src 属性
    for (const cssFile of cssFiles) {
      // 替换 <link rel="stylesheet" href="./filename.css"> 
      const linkRegex = new RegExp(`<link[^>]*href=["']\\.\/${cssFile.name}["'][^>]*>`, 'gi')
      html = html.replace(linkRegex, `<style>${cssFile.content}</style>`)
      
      // 替换 <style src="./filename.css"></style> (虽然这不是标准用法，但可能存在)
      const styleRegex = new RegExp(`<style[^>]*src=["']\\.\/${cssFile.name}["'][^>]*></style>`, 'gi')
      html = html.replace(styleRegex, `<style>${cssFile.content}</style>`)
    }

    // 处理 JavaScript 文件：改进的模块处理
    const processedJsFiles = new Set<string>()
    const allModuleFiles: { name: string; content: string }[] = []
    const entryModules: string[] = []

    // 第一步：识别所有可能的模块文件（包含 import 或 export）
    jsFiles.forEach(jsFile => {
      const hasExport = jsFile.content.includes('export ')
      const hasImport = jsFile.content.includes('import ')
      
      if (hasExport || hasImport) {
        allModuleFiles.push({ name: jsFile.name, content: jsFile.content })
        processedJsFiles.add(jsFile.name)
      }
    })

    // 第二步：处理 HTML 中的脚本引用
    for (const jsFile of jsFiles) {
      const scriptRegex = new RegExp(`<script([^>]*?)src=["']\\.\/${jsFile.name}["']([^>]*?)></script>`, 'gi')
      
      html = html.replace(scriptRegex, (_match, beforeSrc, afterSrc) => {
        const allAttributes = (beforeSrc + afterSrc).trim()
        const isModule = allAttributes.includes('type="module"')
        
        if (isModule) {
          // 如果是模块但还没被识别为模块文件，添加到模块列表
          if (!processedJsFiles.has(jsFile.name)) {
            allModuleFiles.push({ name: jsFile.name, content: jsFile.content })
            processedJsFiles.add(jsFile.name)
          }
          entryModules.push(jsFile.name)
          return `<!-- MODULE_PLACEHOLDER_${jsFile.name} -->`
        } else {
          // 普通脚本直接内联
          const scriptTag = allAttributes ? `<script ${allAttributes}>${jsFile.content}</script>` : `<script>${jsFile.content}</script>`
          processedJsFiles.add(jsFile.name)
          return scriptTag
        }
      })
    }

    // 第三步：生成模块脚本
    if (allModuleFiles.length > 0) {
      let moduleScript = '(function() {\n'
      moduleScript += '  const modules = {};\n\n'
      
      // 处理每个模块
      allModuleFiles.forEach(moduleFile => {
        const moduleKey = moduleFile.name.replace('.js', '')
        let moduleContent = moduleFile.content
        
        // 替换 import 语句
        moduleContent = moduleContent.replace(/import\s+\{([^}]+)\}\s+from\s+['"]\.\/([^'"]+)(?:\.js)?['"]/g, 
          (_, imports, moduleName) => {
            return `const { ${imports} } = modules['${moduleName}'] || {};`
          })
        
        // 替换 export 语句
        moduleContent = moduleContent.replace(/export\s+function\s+(\w+)/g, 'function $1')
        moduleContent = moduleContent.replace(/export\s+const\s+(\w+)/g, 'const $1')
        moduleContent = moduleContent.replace(/export\s+let\s+(\w+)/g, 'let $1')
        moduleContent = moduleContent.replace(/export\s+var\s+(\w+)/g, 'var $1')
        
        // 收集导出的标识符
        const exportNames: string[] = []
        const exportMatches = moduleFile.content.match(/export\s+(function\s+(\w+)|const\s+(\w+)|let\s+(\w+)|var\s+(\w+))/g) || []
        exportMatches.forEach(match => {
          const funcMatch = match.match(/function\s+(\w+)/)
          const constMatch = match.match(/const\s+(\w+)/)
          const letMatch = match.match(/let\s+(\w+)/)
          const varMatch = match.match(/var\s+(\w+)/)
          const name = funcMatch?.[1] || constMatch?.[1] || letMatch?.[1] || varMatch?.[1]
          if (name) exportNames.push(name)
        })
        
        // 处理 export { ... } 语法
        const namedExportMatch = moduleFile.content.match(/export\s+\{([^}]+)\}/)
        if (namedExportMatch) {
          const namedExports = namedExportMatch[1].split(',').map(name => name.trim())
          exportNames.push(...namedExports)
        }
        
        moduleContent = moduleContent.replace(/export\s+\{[^}]+\}/g, '')
        
        moduleScript += `  // Module: ${moduleFile.name}\n`
        moduleScript += `  modules['${moduleKey}'] = (function() {\n`
        moduleScript += `    ${moduleContent.split('\n').map(line => '    ' + line).join('\n')}\n`
        if (exportNames.length > 0) {
          moduleScript += `    return { ${exportNames.join(', ')} };\n`
        } else {
          moduleScript += `    return {};\n`
        }
        moduleScript += `  })();\n\n`
      })
      
      moduleScript += '})();\n'
      
      // 替换第一个模块占位符
      let replaced = false
      entryModules.forEach(entryModule => {
        if (!replaced) {
          html = html.replace(`<!-- MODULE_PLACEHOLDER_${entryModule} -->`, 
            `<script type="module">${moduleScript}</script>`)
          replaced = true
        } else {
          html = html.replace(`<!-- MODULE_PLACEHOLDER_${entryModule} -->`, '')
        }
      })
    }

    // 如果还有未替换的 CSS 文件，添加到 head 中
    const remainingCss = cssFiles.filter(cssFile => {
      const fileName = cssFile.name
      return !html.includes(`<style>${cssFile.content}</style>`) && 
             !html.match(new RegExp(`<link[^>]*href=["']\\.\/${fileName}["']`, 'i'))
    })
    
    if (remainingCss.length > 0) {
      const allRemainingCss = remainingCss.map(f => f.content).join('\n\n')
      const styleTag = `<style>${allRemainingCss}</style>`
      html = html.replace('</head>', `${styleTag}\n</head>`)
    }

    // 如果还有未替换的 JS 文件，添加到 body 末尾
    const remainingJs = jsFiles.filter(jsFile => {
      return !processedJsFiles.has(jsFile.name) && 
             !allModuleFiles.some((mf: { name: string; content: string }) => mf.name === jsFile.name)
    })
    
    if (remainingJs.length > 0) {
      const allRemainingJs = remainingJs.map(f => f.content).join('\n\n')
      const scriptTag = `<script>${allRemainingJs}</script>`
      html = html.replace('</body>', `${scriptTag}\n</body>`)
    }

    // 注入控制台重写代码
    const consoleOverride = `
      <script>
        (function() {
          const originalLog = console.log;
          const originalError = console.error;
          const originalWarn = console.warn;
          
          console.log = function(...args) {
            originalLog.apply(console, args);
            window.parent.postMessage({
              type: 'console',
              level: 'log',
              message: args.join(' ')
            }, '*');
          };
          
          console.error = function(...args) {
            originalError.apply(console, args);
            window.parent.postMessage({
              type: 'console',
              level: 'error',
              message: args.join(' ')
            }, '*');
          };
          
          console.warn = function(...args) {
            originalWarn.apply(console, args);
            window.parent.postMessage({
              type: 'console',
              level: 'warn',
              message: args.join(' ')
            }, '*');
          };
        })();
      </script>
    `
    html = html.replace('</body>', `${consoleOverride}\n</body>`)

    return html
  }, [])

  // 更新预览
  useEffect(() => {
    const html = generatePreviewHtml(files)
    setPreviewHtml(html)
  }, [files, generatePreviewHtml])

  // 处理文件内容变化
  const handleFileChange = (index: number, content: string) => {
    const newFiles = [...files]
    newFiles[index].content = content
    setFiles(newFiles)
    
    if (onCodeChange) {
      const filesObj: Record<string, string> = {}
      newFiles.forEach(file => {
        filesObj[file.name] = file.content
      })
      onCodeChange(filesObj)
    }
  }

  // 处理 iframe 消息
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'console') {
        setConsoleMessages(prev => [...prev, `[${event.data.level.toUpperCase()}] ${event.data.message}`])
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // 监听窗口大小变化，决定是否使用垂直布局
  useEffect(() => {
    const handleResize = () => {
      const shouldUseVertical = window.innerWidth < 768
      setIsVerticalLayout(shouldUseVertical)
    }

    handleResize() // 初始检查
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 处理拖动分隔条
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isVerticalLayout) return
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    
    // 添加全局样式，防止拖拽时选中文本和鼠标样式变化
    document.body.classList.add('dragging-divider')
  }, [isVerticalLayout])

  useEffect(() => {
    if (!isDragging || isVerticalLayout) return

    let animationFrameId: number | null = null
    let lastUpdateTime = 0
    const throttleDelay = 16 // 约60fps

    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = Date.now()
      
      // 节流处理，减少更新频率
      if (currentTime - lastUpdateTime < throttleDelay) {
        return
      }
      
      // 使用 requestAnimationFrame 来优化性能，减少卡顿
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      
      animationFrameId = requestAnimationFrame(() => {
        const container = document.querySelector('.playground-content') as HTMLElement
        if (!container) return

        const rect = container.getBoundingClientRect()
        const x = e.clientX - rect.left
        
        // 计算百分比，设置合理的边界值
        const percentage = Math.min(Math.max((x / rect.width) * 100, 15), 85)
        setEditorWidth(percentage)
        lastUpdateTime = currentTime
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      
      // 清理全局样式
      document.body.classList.remove('dragging-divider')
      
      // 清理动画帧
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }

    // 监听全局鼠标事件，确保拖拽时鼠标移出组件区域也能正常工作
    document.addEventListener('mousemove', handleMouseMove, { passive: false })
    document.addEventListener('mouseup', handleMouseUp, { once: true })
    
    // 处理鼠标离开窗口的情况
    document.addEventListener('mouseleave', handleMouseUp, { once: true })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseUp)
      
      // 清理样式和动画帧
      document.body.classList.remove('dragging-divider')
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [isDragging, isVerticalLayout])

  // 清空控制台
  const clearConsole = () => {
    setConsoleMessages([])
  }

  // 重置代码
  const resetCode = () => {
    // 这里可以重置为初始代码
    console.log('重置代码功能待实现')
  }

  return (
    <div className={`playground ${isVerticalLayout ? 'vertical' : 'horizontal'}`}>
      <div className={`playground-header ${isVerticalLayout && mobileActiveTab === 'preview' ? 'preview-mode' : ''}`}>
        {/* 桌面端文件tabs */}
        {!isVerticalLayout && (
          <div className="file-tabs">
            {files.map((file, index) => (
              <button
                key={file.name}
                className={`file-tab ${index === activeFileIndex ? 'active' : ''}`}
                onClick={() => setActiveFileIndex(index)}
              >
                {file.name}
              </button>
            ))}
          </div>
        )}
        
        {/* 移动端文件tabs - 只在编辑模式显示 */}
        {isVerticalLayout && mobileActiveTab === 'editor' && (
          <div className="file-tabs mobile-file-tabs-header">
            {files.map((file, index) => (
              <button
                key={file.name}
                className={`file-tab ${index === activeFileIndex ? 'active' : ''}`}
                onClick={() => setActiveFileIndex(index)}
              >
                {file.name}
              </button>
            ))}
          </div>
        )}
        
        {/* 控制按钮区域 */}
        {(isVerticalLayout || showControl) && (
          <div className="playground-actions">
            {/* 移动端预览/编辑切换按钮 */}
            {isVerticalLayout && (
              <button 
                onClick={() => setMobileActiveTab(mobileActiveTab === 'preview' ? 'editor' : 'preview')} 
                className="action-btn mobile-toggle"
              >
                {mobileActiveTab === 'preview' ? '编辑' : '预览'}
              </button>
            )}
            
            {/* 原有控制按钮只在配置开启时显示 */}
            {showControl && (
              <>
                <button onClick={resetCode} className="action-btn">重置</button>
                {showConsole && <button onClick={clearConsole} className="action-btn">清空控制台</button>}
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="playground-content">
        {isVerticalLayout ? (
          // 移动端布局：根据 tab 显示不同内容
          <div className="mobile-content">
            {mobileActiveTab === 'preview' ? (
              // 预览模式
              <div className="mobile-preview-panel">
                <div className="preview-content">
                  <iframe
                    srcDoc={previewHtml}
                    title="Preview"
                    sandbox="allow-scripts allow-same-origin"
                    className="preview-iframe"
                  />
                </div>
                
                {showConsole && (
                  <div className="console-panel">
                    <div className="console-header">
                      <span>控制台</span>
                      <button onClick={clearConsole} className="clear-btn">清空</button>
                    </div>
                    <div className="console-content">
                      {consoleMessages.length === 0 ? (
                        <div className="console-empty">控制台输出将显示在这里...</div>
                      ) : (
                        consoleMessages.map((message, index) => (
                          <div key={index} className="console-message">
                            {message}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // 编辑模式
              <div className="mobile-editor-panel">
                <div className="mobile-editor-content">
                  <CodeEditor
                    value={files[activeFileIndex].content}
                    language={files[activeFileIndex].language}
                    onChange={(content) => handleFileChange(activeFileIndex, content)}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          // 桌面端布局：保持原有布局
          <>
            <div 
              className="editor-panel"
              style={{ width: `${editorWidth}%` }}
            >
              <CodeEditor
                value={files[activeFileIndex].content}
                language={files[activeFileIndex].language}
                onChange={(content) => handleFileChange(activeFileIndex, content)}
              />
            </div>
            
            <div 
              className={`playground-divider ${isDragging ? 'dragging' : ''}`}
              onMouseDown={handleMouseDown}
            >
              <div className="divider-handle"></div>
            </div>
            
            <div 
              className="preview-panel"
              style={{ width: `${100 - editorWidth}%` }}
            >
              <div className="preview-content">
                <iframe
                  srcDoc={previewHtml}
                  title="Preview"
                  sandbox="allow-scripts allow-same-origin"
                  className="preview-iframe"
                />
              </div>
              
              {showConsole && (
                <div className="console-panel">
                  <div className="console-header">
                    <span>控制台</span>
                    <button onClick={clearConsole} className="clear-btn">清空</button>
                  </div>
                  <div className="console-content">
                    {consoleMessages.length === 0 ? (
                      <div className="console-empty">控制台输出将显示在这里...</div>
                    ) : (
                      consoleMessages.map((message, index) => (
                        <div key={index} className="console-message">
                          {message}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Playground 