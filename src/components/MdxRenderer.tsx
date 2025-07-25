import React, { useMemo } from 'react'
import Playground from './Playground'

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

// 简单的 Markdown 到 HTML 转换器
const markdownToHtml = (markdown: string): string => {
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

  // 处理标题
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>')
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>')
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>')
  html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>')
  html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>')

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

const MdxRenderer: React.FC<MdxRendererProps> = ({ content, frontmatter, playgrounds = [] }) => {
  const contentRef = React.useRef<HTMLDivElement>(null)
  
  // 解析内容并构建包含 React 组件的元素数组
  const contentElements = useMemo(() => {
    // 转换 Markdown 到 HTML（playground 标记已被保护和恢复）
    let htmlContent = markdownToHtml(content)
    
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
  }, [content])

  return (
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
  )
}

export default MdxRenderer 