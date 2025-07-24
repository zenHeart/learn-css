import React from 'react'

const ReferencePage: React.FC = () => {
  return (
    <div className="reference-page">
      <h1>CSS 参考索引</h1>
      <p>这里将显示按分类组织的 CSS 属性、概念和技巧索引</p>
      
      <div className="categories">
        <div className="category">
          <h2>布局基础</h2>
          <p>盒模型、定位、浮动等基础布局概念</p>
        </div>
        
        <div className="category">
          <h2>Flexbox</h2>
          <p>弹性布局相关的属性和技巧</p>
        </div>
        
        <div className="category">
          <h2>Grid</h2>
          <p>网格布局相关的属性和技巧</p>
        </div>
      </div>
    </div>
  )
}

export default ReferencePage 