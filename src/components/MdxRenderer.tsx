import React from 'react'
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

const MdxRenderer: React.FC<MdxRendererProps> = ({ content, frontmatter, playgrounds = [] }) => {
  // 简单的 Playground 组件渲染
  const renderPlayground = (id: string, mode: string = 'demo') => {
    const playground = playgrounds.find(p => p.id === id)
    
    if (!playground) {
      return <div className="playground-error">Playground "{id}" 未找到</div>
    }
    
    return (
      <Playground
        id={playground.id}
        mode={playground.mode}
        showConsole={true}
        onCodeChange={(files) => {
          console.log('Playground 代码已更改:', files)
        }}
      />
    )
  }
  
  // 处理内容中的 Playground 标记
  const processedContent = content.replace(
    /{\/\*\s*@playground\s+id="([^"]+)"\s+mode="([^"]+)"\s*\*\/}/g,
    (match, id, mode) => {
      return `<div class="playground-placeholder" data-playground-id="${id}" data-playground-mode="${mode}"></div>`
    }
  )

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
          <div key={playground.id} className="playground-section">
            <h3>交互式演示: {playground.id}</h3>
            <Playground
              id={playground.id}
              mode={playground.mode}
              showConsole={true}
              onCodeChange={(files) => {
                console.log('Playground 代码已更改:', files)
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MdxRenderer 