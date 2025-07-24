import React from 'react'
import { Link } from 'react-router'
import { siteConfig } from '../site.config'

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="hero">
        <h1>{siteConfig.title}</h1>
        <p>{siteConfig.description}</p>
      </div>
      
      <div className="quick-nav">
        <h2>快速导航</h2>
        <div className="nav-buttons">
          <Link to="/topics" className="nav-button">开始学习</Link>
          <Link to="/reference" className="nav-button">参考索引</Link>
          <Link to="/playground" className="nav-button">代码实践</Link>
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
      
      <div className="roadmap-placeholder">
        <h2>CSS 学习路线图</h2>
        <p>这里将显示交互式的 CSS 学习路线图，帮助您规划学习路径。</p>
        <div className="roadmap-preview">
          <div className="roadmap-node">基础概念</div>
          <div className="roadmap-arrow">→</div>
          <div className="roadmap-node">布局技术</div>
          <div className="roadmap-arrow">→</div>
          <div className="roadmap-node">高级技巧</div>
        </div>
      </div>
    </div>
  )
}

export default HomePage 