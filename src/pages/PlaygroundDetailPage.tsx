import React from 'react'

const PlaygroundDetailPage: React.FC = () => {
  return (
    <div className="playground-detail-page">
      <div className="playground-nav">
        <h3>示例导航</h3>
        <p>左侧将显示所有可用的 Playground 示例列表</p>
      </div>
      
      <div className="playground-main">
        <h1>代码实践环境</h1>
        <p>这里将显示独立的 CodeMirror 编辑器和预览区域</p>
        
        <div className="editor-placeholder">
          <h3>代码编辑器</h3>
          <p>CodeMirror 编辑器将在这里显示</p>
        </div>
        
        <div className="preview-placeholder">
          <h3>实时预览</h3>
          <p>iframe 预览区域将在这里显示</p>
        </div>
      </div>
    </div>
  )
}

export default PlaygroundDetailPage 