import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { allDocsData } from 'virtual:doc-data'

interface DocItem {
  id: string
  title: string
  path: string
  category: string
  tags: string[]
  description: string
  frontmatter: Record<string, any>
  playgrounds: PlaygroundItem[]
}

interface PlaygroundItem {
  id: string
  mode: 'demo' | 'exercise' | 'test'
  initialCode: Record<string, string>
  solutionCode?: Record<string, string>
}

const ReferencePage: React.FC = () => {
  const [docs, setDocs] = useState<DocItem[]>(allDocsData || [])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // 监听虚拟模块数据变化
  useEffect(() => {
    setDocs(allDocsData || [])
  }, [allDocsData])

  // 按分类组织文档
  const docsByCategory = docs.reduce((acc, doc) => {
    const category = doc.category || '未分类'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(doc)
    return acc
  }, {} as Record<string, DocItem[]>)

  // 获取所有分类
  const categories = Object.keys(docsByCategory).sort()

  // 过滤文档
  const filteredDocs = docs.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // 按分类过滤的文档
  const filteredDocsByCategory = filteredDocs.reduce((acc, doc) => {
    const category = doc.category || '未分类'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(doc)
    return acc
  }, {} as Record<string, DocItem[]>)

  return (
    <div className="reference-page">
      <div className="reference-header">
        <h1>CSS 参考索引</h1>
        <p>按分类组织的 CSS 属性、概念和技巧索引</p>
      </div>

      <div className="reference-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索文档、标签或描述..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">所有分类</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="reference-content">
        {Object.keys(filteredDocsByCategory).length === 0 ? (
          <div className="no-results">
            <p>没有找到匹配的文档</p>
          </div>
        ) : (
          Object.entries(filteredDocsByCategory).map(([category, categoryDocs]) => (
            <div key={category} className="category-section">
              <h2 className="category-title">{category}</h2>
              <div className="category-docs">
                {categoryDocs.map((doc) => (
                  <div key={doc.id} className="doc-item">
                    <div className="doc-header">
                      <h3 className="doc-title">
                        <Link to={`/topics#${doc.id}`} className="doc-link">
                          {doc.title}
                        </Link>
                      </h3>
                      <div className="doc-meta">
                        <span className="doc-path">{doc.path}</span>
                        {doc.playgrounds.length > 0 && (
                          <span className="playground-count">
                            {doc.playgrounds.length} 个示例
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {doc.description && (
                      <p className="doc-description">{doc.description}</p>
                    )}
                    
                    {doc.tags.length > 0 && (
                      <div className="doc-tags">
                        {doc.tags.map((tag, index) => (
                          <span key={index} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ReferencePage 