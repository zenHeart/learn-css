import React, { useMemo, useEffect, useState, useRef } from 'react'
import Playground from './Playground'
import Prism from 'prismjs'

// 导入基础组件和常用语言（按依赖顺序）
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-sql'

// 导入GitHub主题样式
import 'prismjs/themes/prism.css'

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

// 处理 Markdown 表格
const processMarkdownTables = (html: string): string => {
  const lines = html.split('\n')
  const processedLines: string[] = []
  let i = 0
  
  while (i < lines.length) {
    const line = lines[i].trim()
    
    // 检查是否是表格行（包含 | 分隔符）
    if (line.includes('|') && line.length > 0) {
      // 寻找完整的表格
      const tableLines: string[] = []
      let j = i
      
      // 收集连续的表格行
      while (j < lines.length && lines[j].trim().includes('|')) {
        const tableLine = lines[j].trim()
        if (tableLine) {
          tableLines.push(tableLine)
        }
        j++
      }
      
      if (tableLines.length >= 2) {
        // 转换表格
        const tableHtml = convertTableToHtml(tableLines)
        processedLines.push(tableHtml)
        i = j // 跳过已处理的表格行
      } else {
        // 不是有效表格，保持原样
        processedLines.push(lines[i])
        i++
      }
    } else {
      processedLines.push(lines[i])
      i++
    }
  }
  
  return processedLines.join('\n')
}

// 将表格行转换为 HTML
const convertTableToHtml = (tableLines: string[]): string => {
  if (tableLines.length < 2) return tableLines.join('\n')
  
  // 第一行是标题行
  const headerLine = tableLines[0]
  const headerCells = headerLine.split('|').map(cell => cell.trim()).filter(cell => cell !== '')
  
  // 第二行通常是分隔符行（检查是否包含 - 字符）
  const separatorLine = tableLines[1]
  const isSeparatorLine = separatorLine.includes('-')
  
  let dataStartIndex = 1
  let hasHeader = false
  let columnAlignments: string[] = []
  
  if (isSeparatorLine) {
    hasHeader = true
    dataStartIndex = 2
    
    // 解析列对齐信息
    const separatorCells = separatorLine.split('|').map(cell => cell.trim()).filter(cell => cell !== '')
    columnAlignments = separatorCells.map(cell => {
      if (cell.startsWith(':') && cell.endsWith(':')) {
        return 'center'
      } else if (cell.endsWith(':')) {
        return 'right'
      } else {
        return 'left'
      }
    })
  }
  
  // 构建表格 HTML
  let tableHtml = '<table>\n'
  
  // 添加表头
  if (hasHeader) {
    tableHtml += '  <thead>\n'
    tableHtml += '    <tr>\n'
    headerCells.forEach((cell, index) => {
      const alignment = columnAlignments[index] || 'left'
      const alignClass = alignment !== 'left' ? ` class="align-${alignment}"` : ''
      tableHtml += `      <th${alignClass}>${cell}</th>\n`
    })
    tableHtml += '    </tr>\n'
    tableHtml += '  </thead>\n'
    tableHtml += '  <tbody>\n'
  } else {
    tableHtml += '  <tbody>\n'
    // 如果没有分隔符行，第一行也作为数据行处理
    tableHtml += '    <tr>\n'
    headerCells.forEach(cell => {
      tableHtml += `      <td>${cell}</td>\n`
    })
    tableHtml += '    </tr>\n'
  }
  
  // 添加数据行
  for (let i = dataStartIndex; i < tableLines.length; i++) {
    const dataLine = tableLines[i]
    const dataCells = dataLine.split('|').map(cell => cell.trim()).filter(cell => cell !== '')
    
    if (dataCells.length > 0) {
      tableHtml += '    <tr>\n'
      dataCells.forEach((cell, index) => {
        const alignment = columnAlignments[index] || 'left'
        const alignClass = alignment !== 'left' ? ` class="align-${alignment}"` : ''
        tableHtml += `      <td${alignClass}>${cell}</td>\n`
      })
      tableHtml += '    </tr>\n'
    }
  }
  
  tableHtml += '  </tbody>\n'
  tableHtml += '</table>'
  
  return tableHtml
}

// 语言别名映射
const languageAliases: Record<string, string> = {
  'js': 'javascript',
  'ts': 'typescript',
  'jsx': 'jsx',
  'tsx': 'tsx',
  'html': 'markup',
  'htm': 'markup',
  'xml': 'markup',
  'svg': 'markup',
  'markup': 'markup',
  'css': 'css',
  'json': 'json',
  'yml': 'yaml',
  'yaml': 'yaml',
  'md': 'markup',
  'markdown': 'markup',
  'bash': 'bash',
  'sh': 'bash',
  'zsh': 'bash',
  'shell': 'bash',
  'console': 'bash',
  'terminal': 'bash',
  'py': 'python',
  'python': 'python',
  'java': 'java',
  'c': 'c',
  'cpp': 'cpp',
  'c++': 'cpp',
  'cxx': 'cpp',
  'sql': 'sql',
  'mysql': 'sql',
  'postgresql': 'sql',
  'sqlite': 'sql',
  'text': '',
  'txt': '',
  'plain': ''
}

// 规范化语言名称
const normalizeLang = (lang: string): string => {
  if (!lang) return ''
  const lower = lang.toLowerCase().trim()
  return languageAliases[lower] || lower
}

// HTML转义函数
const escapeHtml = (text: string): string => {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }
  
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char)
}

// 简单的 Markdown 到 HTML 转换器
const markdownToHtml = (markdown: string, tocItems: TocItem[]): string => {
  let html = markdown

  // 首先处理表格（在保护其他元素之前）
  html = processMarkdownTables(html)

  // 然后标记需要保护的元素（避免被段落包裹）
  const protectedElements: { placeholder: string; content: string }[] = []
  let placeholderIndex = 0

  // 保护代码块并应用语法高亮
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `__PROTECTED_ELEMENT_${placeholderIndex++}__`
    
    // 处理语言别名
    const normalizedLang = normalizeLang(lang)
    const trimmedCode = code.trim()
    
    let highlightedCode = trimmedCode
    
    // 如果指定了语言且Prism支持该语言，则进行语法高亮
    if (normalizedLang && normalizedLang !== '' && Prism.languages[normalizedLang]) {
      try {
        highlightedCode = Prism.highlight(trimmedCode, Prism.languages[normalizedLang], normalizedLang)
      } catch (e) {
        console.warn(`语法高亮失败 (${normalizedLang}):`, e)
        highlightedCode = escapeHtml(trimmedCode)
      }
    } else {
      // 如果不支持语法高亮，则转义HTML字符
      highlightedCode = escapeHtml(trimmedCode)
    }
    
    const langClass = (normalizedLang && normalizedLang !== '') ? `language-${normalizedLang}` : 'language-text'
    protectedElements.push({
      placeholder,
      content: `<pre class="code-block"><code class="${langClass}">${highlightedCode}</code></pre>`
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

  // 保护表格（已经转换为HTML的表格）
  html = html.replace(/<table[\s\S]*?<\/table>/g, (match) => {
    const placeholder = `__PROTECTED_TABLE_${placeholderIndex++}__`
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

  // 处理粗体、斜体和删除线
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/~~(.*?)~~/g, '<del>$1</del>')

  // 处理行内代码（需要转义HTML字符）
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    return `<code>${escapeHtml(code)}</code>`
  })

  // 处理链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  // 处理任务列表和无序列表
  html = html.replace(/^\s*[-*+]\s+\[\s*x\s*\]\s+(.*)$/gim, '<li class="task-list-item"><input type="checkbox" checked disabled> $1</li>')
  html = html.replace(/^\s*[-*+]\s+\[\s*\]\s+(.*)$/gim, '<li class="task-list-item"><input type="checkbox" disabled> $1</li>')
  html = html.replace(/^\s*[-*+]\s+(.*)$/gim, '<li>$1</li>')
  html = html.replace(/(<li.*?<\/li>(?:\s*<li.*?<\/li>)*)/gs, '<ul>$1</ul>')

  // 处理引用块
  html = html.replace(/^>\s*(.*)$/gim, '<blockquote-line>$1</blockquote-line>')
  html = html.replace(/(<blockquote-line>.*?<\/blockquote-line>(?:\s*<blockquote-line>.*?<\/blockquote-line>)*)/gs, (match) => {
    const content = match.replace(/<\/?blockquote-line>/g, '').trim()
    return `<blockquote>${content}</blockquote>`
  })

  // 处理水平分割线
  html = html.replace(/^(\s*[-*_]){3,}\s*$/gim, '<hr>')

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
    if (line.match(/^<(h[1-6]|ul|li|pre|div|table|blockquote|hr|__PROTECTED_ELEMENT_|__PROTECTED_TABLE_)/) || line.match(/^\{\s*\/\*\s*@playground/)) {
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
          <span className="toc-hamburger-line"></span>
          <span className="toc-hamburger-line"></span>
          <span className="toc-hamburger-line"></span>
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

  // 应用语法高亮
  useEffect(() => {
    if (contentRef.current) {
      // 为没有通过Prism处理的代码块应用高亮
      const codeBlocks = contentRef.current.querySelectorAll('pre code:not(.token)')
      codeBlocks.forEach((block) => {
        const codeElement = block as HTMLElement
        const pre = codeElement.parentElement
        
        if (pre && !pre.classList.contains('code-block')) {
          const lang = Array.from(codeElement.classList)
            .find(cls => cls.startsWith('language-'))
            ?.replace('language-', '')
          
          if (lang && lang !== 'text' && Prism.languages[lang]) {
            try {
              const highlighted = Prism.highlight(codeElement.textContent || '', Prism.languages[lang], lang)
              codeElement.innerHTML = highlighted
              pre.classList.add('code-block')
            } catch (e) {
              console.warn(`语法高亮失败 (${lang}):`, e)
            }
          } else {
            // 对于纯文本，只需要添加code-block类和转义HTML
            codeElement.innerHTML = escapeHtml(codeElement.textContent || '')
            pre.classList.add('code-block')
          }
        }
      })
    }
  }, [contentElements])

  return (
    <div className="mdx-content-wrapper">
      <div className="mdx-content">
        {frontmatter && (
          <div className="mdx-frontmatter">
            {frontmatter.title && <h1>{frontmatter.title}</h1>}
            {frontmatter.description && <p className="description">{frontmatter.description}</p>}
            {Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0 && (
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