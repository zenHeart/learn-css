import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { allDocsData } from 'virtual:doc-data'

interface DocItem {
  id: string
  title: string
  path: string
  category: string
  tags: string[]
  description: string
  frontmatter: Record<string, any>
  content: string
  playgrounds: PlaygroundItem[]
}

interface PlaygroundItem {
  id: string
  mode: 'demo' | 'exercise' | 'test'
  initialCode: Record<string, string>
  solutionCode?: Record<string, string>
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const [docs, setDocs] = useState<DocItem[]>(allDocsData || [])
  const [searchTerm, setSearchTerm] = useState('')

  // 监听虚拟模块数据变化
  useEffect(() => {
    try {
      setDocs(allDocsData || [])
    } catch (error) {
      console.error('加载文档数据失败:', error)
      setDocs([])
    }
  }, [allDocsData])

  // 处理文档跳转
  const handleDocClick = (docId: string) => {
    console.log('跳转到文档:', docId)
    navigate(`/topics/${docId}`)
    onClose() // 关闭弹窗
  }

  // 过滤文档
  const filteredDocs = docs.filter(doc => {
    // 确保 tags 是数组
    const tags = Array.isArray(doc.tags) ? doc.tags : []
    
    return searchTerm === '' || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  // 按分类组织过滤后的文档
  const filteredDocsByCategory = filteredDocs.reduce((acc, doc) => {
    const category = doc.category || '未分类'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(doc)
    return acc
  }, {} as Record<string, DocItem[]>)

  // ESC 键关闭弹窗
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // 防止背景滚动
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // 清空搜索条件
  const clearSearch = () => {
    setSearchTerm('')
  }

  // 弹窗打开时重置搜索
  useEffect(() => {
    if (isOpen) {
      clearSearch()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        {/* 弹窗头部 */}
        <div className="search-modal-header">
          <h2>搜索文档</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* 搜索控制区 */}
        <div className="search-modal-controls">
          <div className="search-box">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="搜索文档、标签或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                autoFocus
              />
              {searchTerm && (
                <button 
                  className="clear-input-btn"
                  onClick={clearSearch}
                  title="清空搜索"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 搜索结果 */}
        <div className="search-modal-content">
          {docs.length === 0 ? (
            <div className="no-results">
              <p>正在加载文档数据...</p>
            </div>
          ) : Object.keys(filteredDocsByCategory).length === 0 ? (
            <div className="no-results">
              <p>没有找到匹配的文档</p>
              {searchTerm ? (
                <p className="search-hint">
                  尝试修改搜索关键词："<span className="search-term">{searchTerm}</span>"
                </p>
              ) : (
                <p className="search-hint">
                  输入关键词开始搜索文档标题、描述或标签
                </p>
              )}
            </div>
          ) : (
            Object.entries(filteredDocsByCategory).map(([category, categoryDocs]) => (
              <div key={category} className="search-category-section">
                <h3 className="search-category-title">{category}</h3>
                <div className="search-category-docs">
                  {categoryDocs.map((doc) => (
                    <div 
                      key={doc.id} 
                      className="search-doc-item"
                      onClick={() => handleDocClick(doc.id)}
                    >
                      <div className="search-doc-header">
                        <h4 className="search-doc-title">
                          {doc.title}
                        </h4>
                        <div className="search-doc-meta">
                          <span className="search-doc-path">{doc.path}</span>
                          {doc.playgrounds.length > 0 && (
                            <span className="search-playground-count">
                              {doc.playgrounds.length} 个示例
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {doc.description && (
                        <p className="search-doc-description">{doc.description}</p>
                      )}
                      
                      {Array.isArray(doc.tags) && doc.tags.length > 0 && (
                        <div className="search-doc-tags">
                          {doc.tags.map((tag, index) => (
                            <span key={index} className="search-tag">
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

        {/* 弹窗底部提示 */}
        <div className="search-modal-footer">
          <div className="search-shortcuts">
            <span className="shortcut">
              <kbd>⌘</kbd> <kbd>K</kbd> 打开搜索
            </span>
            <span className="shortcut">
              <kbd>ESC</kbd> 关闭
            </span>
            <span className="search-stats">
              {searchTerm ? `找到 ${filteredDocs.length} 个结果` : `共有 ${docs.length} 个文档`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchModal 