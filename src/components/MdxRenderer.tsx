import React from 'react'

interface MdxRendererProps {
  content: string
  frontmatter?: {
    title?: string
    category?: string
    tags?: string[]
    description?: string
    keywords?: string
  }
}

const MdxRenderer: React.FC<MdxRendererProps> = ({ content, frontmatter }) => {
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
        {/* 这里将使用 MDX 解析器渲染内容 */}
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  )
}

export default MdxRenderer 