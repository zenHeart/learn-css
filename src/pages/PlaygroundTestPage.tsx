import React from 'react'
import Playground from '../components/Playground'

const PlaygroundTestPage: React.FC = () => {
  const handleCodeChange = (files: Record<string, string>) => {
    console.log('代码已更改:', files)
  }

  return (
    <div className="playground-test-page">
      <h1>Playground 测试页面</h1>
      <p>这是一个完整的 Playground 示例，包含代码编辑器和实时预览功能。</p>
      
      <Playground
        id="test-playground"
        mode="demo"
        showConsole={true}
        onCodeChange={handleCodeChange}
      />
      
      <div className="playground-info">
        <h2>功能说明</h2>
        <ul>
          <li>✅ 左侧代码编辑器支持 HTML、CSS、JavaScript 语法高亮</li>
          <li>✅ 右侧实时预览，代码修改后立即生效</li>
          <li>✅ 文件标签切换，支持多文件编辑</li>
          <li>✅ 控制台输出捕获和显示</li>
          <li>✅ 重置和清空控制台功能</li>
        </ul>
      </div>
    </div>
  )
}

export default PlaygroundTestPage 