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

  // 处理代码块
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`
  })

  // 处理链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  // 处理无序列表
  html = html.replace(/^\s*[-*+]\s+(.*)$/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
  html = html.replace(/<\/li>\s*<li>/g, '</li><li>')

  // 处理段落
  html = html.replace(/\n\n+/g, '\n</p><p>\n')
  html = html.replace(/^(?!<[h1-6]|<ul|<pre|<div)(.+)$/gm, '<p>$1</p>')

  // 清理多余的空段落
  html = html.replace(/<p>\s*<\/p>/g, '')
  html = html.replace(/<p>(<[h1-6])/g, '$1')
  html = html.replace(/(<\/[h1-6]>)<\/p>/g, '$1')

  return html
}

const MdxRenderer: React.FC<MdxRendererProps> = ({ content, frontmatter, playgrounds = [] }) => {
  // 使用 useMemo 来缓存处理后的内容
  const processedContent = useMemo(() => {
    // 先转换 Markdown 到 HTML
    let htmlContent = markdownToHtml(content)
    
    // 处理 Playground 标记
    htmlContent = htmlContent.replace(
      /{\/\*\s*@playground\s+id="([^"]+)"\s+mode="([^"]+)"\s*\*\/}/g,
      (match, id, mode) => {
        return `<div class="playground-placeholder" data-playground-id="${id}" data-playground-mode="${mode}"></div>`
      }
    )

    return htmlContent
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
      
      <div className="mdx-body">
        <div dangerouslySetInnerHTML={{ __html: processedContent }} />
        
        {/* 渲染 Playground 组件 */}
        {playgrounds.map((playground) => (
          <Playground
            key={playground.id}
            id={playground.id}
            mode={playground.mode}
            showConsole={true}
            onCodeChange={(files) => {
              console.log('Playground 代码已更改:', files)
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default MdxRenderer 