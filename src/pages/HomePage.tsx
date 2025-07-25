import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { siteConfig } from '../site.config'
import SearchModal from '../components/SearchModal'

const HomePage: React.FC = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  // 搜索弹窗处理
  const openSearchModal = () => setIsSearchModalOpen(true)
  const closeSearchModal = () => setIsSearchModalOpen(false)

  // 监听 Command+K 快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        openSearchModal()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <div className="home-page">
        <div className="hero">
          <h1>{siteConfig.title}</h1>
          <p>{siteConfig.description}</p>
        </div>
        
        <div className="quick-nav">
          <h2>快速导航</h2>
          <div className="nav-buttons">
            <Link to="/topics/01.basics-01.concept-01.intro" className="nav-button">开始学习</Link>
            <button onClick={openSearchModal} className="nav-button">搜索文档 (⌘+K)</button>
            <Link to="/playground/grid-concept" className="nav-button">代码实践</Link>
          </div>
        </div>
        
        <div className="features">
          <h2>核心特性</h2>
          <ul>
            <li>📚 结构化的 CSS 知识体系</li>
            <li>💻 交互式代码实践环境</li>
            <li>🔍 全局搜索与分类索引</li>
            <li>📱 响应式设计，支持多设备</li>
          </ul>
        </div>
        
        <div className="github-section">
          <h2>开源项目</h2>
          <p>这是一个开源项目，欢迎贡献和反馈。</p>
          <a 
            href={siteConfig.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            📖 在 GitHub 上查看源码
          </a>
        </div>
      </div>

      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
      />
    </>
  )
}

export default HomePage 