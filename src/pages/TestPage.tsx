import React, { useState } from 'react'
import CodeEditor from '../components/CodeEditor'

const TestPage: React.FC = () => {
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html>
<head>
  <title>测试页面</title>
</head>
<body>
  <h1>Hello World</h1>
  <p>这是一个测试页面。</p>
</body>
</html>`)

  const [cssCode, setCssCode] = useState(`body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f0f0f0;
}

h1 {
  color: #333;
  text-align: center;
}

p {
  color: #666;
  line-height: 1.6;
}`)

  const [jsCode, setJsCode] = useState(`// JavaScript 代码
console.log('Hello from JavaScript!');

function greet(name) {
  return \`Hello, \${name}!\`;
}

document.addEventListener('DOMContentLoaded', () => {
  console.log(greet('World'));
});`)

  return (
    <div className="test-page">
      <h1>CodeEditor 测试页面</h1>
      
      <div className="editor-grid">
        <div className="editor-section">
          <h3>HTML 编辑器</h3>
          <CodeEditor
            value={htmlCode}
            language="html"
            onChange={setHtmlCode}
          />
        </div>
        
        <div className="editor-section">
          <h3>CSS 编辑器</h3>
          <CodeEditor
            value={cssCode}
            language="css"
            onChange={setCssCode}
          />
        </div>
        
        <div className="editor-section">
          <h3>JavaScript 编辑器</h3>
          <CodeEditor
            value={jsCode}
            language="javascript"
            onChange={setJsCode}
          />
        </div>
      </div>
    </div>
  )
}

export default TestPage 