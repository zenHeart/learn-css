import React from 'react'
import MdxRenderer from '../components/MdxRenderer'

const TopicsPage: React.FC = () => {
  // 模拟 MDX 内容（后续将通过 Vite 插件加载）
  const mockMdxContent = `
    <h1>CSS 盒模型基础</h1>
    <p>CSS 盒模型是 CSS 布局的基础概念，理解它对于掌握 CSS 布局至关重要。</p>
    
    <h2>什么是盒模型？</h2>
    <p>盒模型描述了 HTML 元素如何在页面上占据空间。每个 HTML 元素都被视为一个矩形盒子，这个盒子由以下部分组成：</p>
    
    <ul>
      <li><strong>内容区域 (Content)</strong>：显示文本、图像等实际内容</li>
      <li><strong>内边距 (Padding)</strong>：内容周围的空白区域</li>
      <li><strong>边框 (Border)</strong>：内边距周围的边框</li>
      <li><strong>外边距 (Margin)</strong>：边框周围的空白区域</li>
    </ul>
    
    <h2>盒模型的组成部分</h2>
    <pre><code>.box {
  width: 200px;
  height: 100px;
  padding: 20px;
  border: 2px solid #333;
  margin: 10px;
}</code></pre>
  `

  const mockFrontmatter = {
    title: "CSS 盒模型基础",
    category: "布局基础",
    tags: ["box-model", "margin", "padding", "border"],
    description: "详细介绍 CSS 盒模型的基本概念、组成部分及其在布局中的应用。",
    keywords: "盒模型, Box Model, margin, padding, border, content-box, border-box"
  }

  return (
    <div className="topics-page">
      <div className="sidebar">
        <h3>学习目录</h3>
        <p>侧边栏导航将在这里显示</p>
      </div>
      
      <div className="content">
        <MdxRenderer 
          content={mockMdxContent} 
          frontmatter={mockFrontmatter}
        />
      </div>
    </div>
  )
}

export default TopicsPage 