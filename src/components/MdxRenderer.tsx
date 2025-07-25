import React, { useMemo, useEffect, useState, useRef } from 'react'
import Playground from './Playground'

interface TocItem {
  id: string
  text: string
  level: number
}

interface MdxRendererProps {
  content: string
  frontmatter?: {
    title?: string
    category?: string
    tags?: string[]
    description?: string
    keywords?: string
  }
  playgrounds?: Array<{
    id: string
    mode: 'demo' | 'exercise' | 'test'
    initialCode: Record<string, string>
    solutionCode?: Record<string, string>
  }>
}

// 从文本生成ID
const generateId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/g, '') // 保留中文、英文、数字
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// 提取标题并生成TOC
const extractTocFromMarkdown = (markdown: string): TocItem[] => {
  const tocItems: TocItem[] = []
  const lines = markdown.split('\n')
  
  lines.forEach(line => {
    const match = line.match(/^(#{1,6})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      const id = generateId(text)
      
      tocItems.push({
        id,
        text,
        level
      })
    }
  })
  
  return tocItems
}

// 简单的 Markdown 到 HTML 转换器
const markdownToHtml = (markdown: string, tocItems: TocItem[]): string => {
  let html = markdown

  // 首先标记需要保护的元素（避免被段落包裹）
  const protectedElements: { placeholder: string; content: string }[] = []
  let placeholderIndex = 0

  // 保护代码块
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `__PROTECTED_ELEMENT_${placeholderIndex++}__`
    protectedElements.push({
      placeholder,
      content: `<pre><code class="language-${lang}">${code.trim()}</code></pre>`
    })
    return placeholder
  })

  // 保护 iframe
  html = html.replace(/<iframe[\s\S]*?<\/iframe>/g, (match) => {
    const placeholder = `__PROTECTED_ELEMENT_${placeholderIndex++}__`
    protectedElements.push({
      placeholder,
      content: match
    })
    return placeholder
  })

  // 保护 playground 标记（防止被 Markdown 处理破坏）
  html = html.replace(/\{\s*\/\*\s*@playground\s+id="([^"]+)"\s+mode="([^"]+)"\s*\*\/\s*\}/g, (match) => {
    const placeholder = `__PROTECTED_PLAYGROUND_${placeholderIndex++}__`
    protectedElements.push({
      placeholder,
      content: match
    })
    return placeholder
  })

  // 处理标题 - 添加ID属性
  html = html.replace(/^# (.*$)/gim, (match, title) => {
    const id = generateId(title)
    return `<h1 id="${id}">${title}</h1>`
  })
  html = html.replace(/^## (.*$)/gim, (match, title) => {
    const id = generateId(title)
    return `<h2 id="${id}">${title}</h2>`
  })
  html = html.replace(/^### (.*$)/gim, (match, title) => {
    const id = generateId(title)
    return `<h3 id="${id}">${title}</h3>`
  })
  html = html.replace(/^#### (.*$)/gim, (match, title) => {
    const id = generateId(title)
    return `<h4 id="${id}">${title}</h4>`
  })
  html = html.replace(/^##### (.*$)/gim, (match, title) => {
    const id = generateId(title)
    return `<h5 id="${id}">${title}</h5>`
  })
  html = html.replace(/^###### (.*$)/gim, (match, title) => {
    const id = generateId(title)
    return `<h6 id="${id}">${title}</h6>`
  })

  // 处理粗体和斜体
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // 处理行内代码
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // 处理链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  // 处理无序列表
  html = html.replace(/^\s*[-*+]\s+(.*)$/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*?<\/li>(?:\s*<li>.*?<\/li>)*)/gs, '<ul>$1</ul>')

  // 处理段落 - 改进的段落处理
  const lines = html.split('\n')
  const processedLines: string[] = []
  let inParagraph = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (!line) {
      // 空行
      if (inParagraph) {
        processedLines.push('</p>')
        inParagraph = false
      }
      continue
    }

    // 检查是否是块级元素或 playground 标记
    if (line.match(/^<(h[1-6]|ul|li|pre|div|__PROTECTED_ELEMENT_)/) || line.match(/^\{\s*\/\*\s*@playground/)) {
      // 如果当前在段落中，先关闭段落
      if (inParagraph) {
        processedLines.push('</p>')
        inParagraph = false
      }
      processedLines.push(line)
    } else {
      // 普通文本行
      if (!inParagraph) {
        processedLines.push('<p>')
        inParagraph = true
      }
      processedLines.push(line)
    }
  }

  // 如果最后还在段落中，关闭段落
  if (inParagraph) {
    processedLines.push('</p>')
  }

  html = processedLines.join('\n')

  // 恢复保护的元素
  protectedElements.forEach(({ placeholder, content }) => {
    html = html.replace(placeholder, content)
  })

  // 清理多余的空段落和格式
  html = html.replace(/<p>\s*<\/p>/g, '')
  html = html.replace(/<p>(<[h1-6])/g, '$1')
  html = html.replace(/(<\/[h1-6]>)<\/p>/g, '$1')
  html = html.replace(/<p>(<ul)/g, '$1')
  html = html.replace(/(<\/ul>)<\/p>/g, '$1')

  return html
}

// TOC 组件
const TOC: React.FC<{ items: TocItem[]; activeId: string; isMobile: boolean }> = ({ 
  items, 
  activeId, 
  isMobile 
}) => {
  const [isOpen, setIsOpen] = useState(false)

  if (items.length === 0) return null

  const handleItemClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
      if (isMobile) {
        setIsOpen(false)
      }
    }
  }

  const toggleToc = () => {
    setIsOpen(!isOpen)
  }

  if (isMobile) {
    return (
      <div className="toc-mobile">
        {/* 悬浮的TOC图标按钮 */}
        <button 
          className={`toc-mobile-toggle ${isOpen ? 'active' : ''}`}
          onClick={toggleToc}
          title="目录"
        >
          <span className="toc-icon">📋</span>
        </button>
        
        {/* 展开的目录内容 */}
        {isOpen && (
          <>
            <div className="toc-mobile-overlay" onClick={toggleToc} />
            <div className="toc-mobile-content">
              <div className="toc-mobile-header">
                <span>目录</span>
                <button className="toc-close-btn" onClick={toggleToc}>×</button>
              </div>
              <ul className="toc-list">
                {items.map((item) => (
                  <li 
                    key={item.id}
                    className={`toc-item toc-level-${item.level} ${activeId === item.id ? 'active' : ''}`}
                  >
                    <button
                      className="toc-link"
                      onClick={() => handleItemClick(item.id)}
                      title={item.text}
                    >
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    )
  }

  // 桌面端TOC
  return (
    <div className="toc-container">
      <div className="toc-content">
        <div className="toc-header">
          <span>目录</span>
        </div>
        <ul className="toc-list">
          {items.map((item) => (
            <li 
              key={item.id}
              className={`toc-item toc-level-${item.level} ${activeId === item.id ? 'active' : ''}`}
            >
              <button
                className="toc-link"
                onClick={() => handleItemClick(item.id)}
                title={item.text}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const MdxRenderer: React.FC<MdxRendererProps> = ({ content, frontmatter, playgrounds = [] }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [activeHeading, setActiveHeading] = useState<string>('')
  const [isMobile, setIsMobile] = useState(false)
  
  // 检测移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 提取TOC
  const tocItems = useMemo(() => {
    return extractTocFromMarkdown(content)
  }, [content])
  
  // 解析内容并构建包含 React 组件的元素数组
  const contentElements = useMemo(() => {
    // 转换 Markdown 到 HTML（playground 标记已被保护和恢复）
    let htmlContent = markdownToHtml(content, tocItems)
    
    // 分割内容，找到 playground 标记的位置
    const playgroundRegex = /\{\s*\/\*\s*@playground\s+id="([^"]+)"\s+mode="([^"]+)"\s*\*\/\s*\}/g
    const parts: (string | { type: 'playground'; id: string; mode: string })[] = []
    let lastIndex = 0
    let match
    
    while ((match = playgroundRegex.exec(htmlContent)) !== null) {
      // 添加匹配前的内容
      if (match.index > lastIndex) {
        const beforeContent = htmlContent.slice(lastIndex, match.index)
        if (beforeContent.trim()) {
          parts.push(beforeContent)
        }
      }
      
      // 添加 playground 标记
      parts.push({
        type: 'playground',
        id: match[1],
        mode: match[2]
      })
      
      lastIndex = match.index + match[0].length
    }
    
    // 添加剩余内容
    if (lastIndex < htmlContent.length) {
      const remainingContent = htmlContent.slice(lastIndex)
      if (remainingContent.trim()) {
        parts.push(remainingContent)
      }
    }
    
    // 如果没有找到 playground 标记，返回原始内容
    if (parts.length === 0) {
      parts.push(htmlContent)
    }
    
    return parts
  }, [content, tocItems])

  // 监听滚动，更新当前激活的标题
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current || tocItems.length === 0) return

      const headings = tocItems.map(item => document.getElementById(item.id)).filter(Boolean)
      
      let current = ''
      const scrollTop = window.scrollY + 100 // 偏移量

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i]
        if (heading && heading.offsetTop <= scrollTop) {
          current = heading.id
          break
        }
      }

      setActiveHeading(current)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 初始调用
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [tocItems])

  return (
    <div className="mdx-content-wrapper">
      <div className="mdx-content">
        {frontmatter && (
          <div className="mdx-frontmatter">
            {frontmatter.title && <h1>{frontmatter.title}</h1>}
            {frontmatter.description && <p className="description">{frontmatter.description}</p>}
            {frontmatter.tags && frontmatter.tags.length > 0 && (
              <div className="tags">
                {frontmatter.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="mdx-body" ref={contentRef}>
          {contentElements.map((element, index) => {
            if (typeof element === 'string') {
              // 渲染 HTML 内容
              return (
                <div 
                  key={`content-${index}`}
                  dangerouslySetInnerHTML={{ __html: element }} 
                />
              )
            } else if (element.type === 'playground') {
                           // 渲染 Playground 组件
               const playground = playgrounds.find(p => p.id === element.id)
               if (playground) {
                 return (
                   <Playground
                     key={`playground-${element.id}`}
                     id={playground.id}
                     mode={playground.mode}
                     initialCode={playground.initialCode}
                     solutionCode={playground.solutionCode}
                     showConsole={true}
                     onCodeChange={(files) => {
                       console.log('Playground 代码已更改:', files)
                     }}
                   />
                 )
              } else {
                // 如果找不到对应的 playground 数据，显示占位符
                return (
                  <div key={`placeholder-${element.id}`} className="playground-error">
                    <p>⚠️ 未找到 Playground: {element.id}</p>
                    <p>请检查 _demos 目录中是否存在对应的文件。</p>
                  </div>
                )
              }
            }
            return null
          })}
        </div>
      </div>
      
      {tocItems.length > 0 && (
        <TOC 
          items={tocItems} 
          activeId={activeHeading}
          isMobile={isMobile}
        />
      )}
    </div>
  )
}

export default MdxRenderer 