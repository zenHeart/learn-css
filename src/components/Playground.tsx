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

    // 如果有提供初始代码，则使用提供的代码
    if (initialCode && Object.keys(initialCode).length > 0) {
      const files: FileData[] = []
      
      // 处理 HTML 文件
      if (initialCode['index.html']) {
        files.push({
          name: 'index.html',
          content: initialCode['index.html'],
          language: 'html'
        })
      }
      
      // 处理 CSS 文件
      if (initialCode['style.css']) {
        files.push({
          name: 'style.css',
          content: initialCode['style.css'],
          language: 'css'
        })
      }
      
      // 处理 JS 文件
      if (initialCode['script.js']) {
        files.push({
          name: 'script.js',
          content: initialCode['script.js'],
          language: 'javascript'
        })
      }
      
      // 如果没有任何文件，返回默认文件
      return files.length > 0 ? files : defaultFiles
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
    const htmlFile = files.find(f => f.name.endsWith('.html'))
    const cssFile = files.find(f => f.name.endsWith('.css'))
    const jsFile = files.find(f => f.name.endsWith('.js'))

    if (!htmlFile) return ''

    let html = htmlFile.content

    // 注入 CSS
    if (cssFile) {
      const styleTag = `<style>${cssFile.content}</style>`
      html = html.replace('</head>', `${styleTag}\n</head>`)
    }

    // 注入 JavaScript
    if (jsFile) {
      const scriptTag = `<script>${jsFile.content}</script>`
      html = html.replace('</body>', `${scriptTag}\n</body>`)
    }

    // 注入控制台重写
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
      <div className="playground-header">
        {isVerticalLayout ? (
          // 移动端：预览/编辑切换 tabs
          <div className="mobile-tabs">
            <button
              className={`mobile-tab ${mobileActiveTab === 'preview' ? 'active' : ''}`}
              onClick={() => setMobileActiveTab('preview')}
            >
              预览
            </button>
            <button
              className={`mobile-tab ${mobileActiveTab === 'editor' ? 'active' : ''}`}
              onClick={() => setMobileActiveTab('editor')}
            >
              编辑
            </button>
          </div>
        ) : (
          // 桌面端：文件 tabs
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
        
        {/* 控制按钮只在配置开启时显示 */}
        {showControl && (
          <div className="playground-actions">
            <button onClick={resetCode} className="action-btn">重置</button>
            {showConsole && <button onClick={clearConsole} className="action-btn">清空控制台</button>}
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
                <div className="mobile-file-tabs">
                  {files.map((file, index) => (
                    <button
                      key={file.name}
                      className={`mobile-file-tab ${index === activeFileIndex ? 'active' : ''}`}
                      onClick={() => setActiveFileIndex(index)}
                    >
                      {file.name}
                    </button>
                  ))}
                </div>
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