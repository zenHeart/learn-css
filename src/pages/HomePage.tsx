import React from 'react'

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="hero">
        <h1>CSS 学习笔记网站</h1>
        <p>一个专注于 CSS 知识学习与实践的纯静态笔记网站</p>
      </div>
      
      <div className="quick-nav">
        <h2>快速导航</h2>
        <div className="nav-buttons">
          <a href="#/topics" className="nav-button">开始学习</a>
          <a href="#/reference" className="nav-button">参考索引</a>
          <a href="#/playground" className="nav-button">代码实践</a>
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
    </div>
  )
}

export default HomePage 