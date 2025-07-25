import React, { useState } from 'react'
import { useParams } from 'react-router'
import Playground from '../components/Playground'

// 模拟 Playground 数据
const mockPlaygrounds = [
  {
    id: 'box-model-intro',
    title: 'CSS 盒模型基础演示',
    category: '布局基础',
    mode: 'demo' as const,
    initialCode: {
      'index.html': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS 盒模型示例</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body>
    <div class="box-model-demo">
        <h1>CSS 盒模型演示</h1>
        
        <div class="box-container">
            <div class="box content-box">
                <div class="content">内容区域</div>
            </div>
            
            <div class="box border-box">
                <div class="content">内容区域</div>
            </div>
        </div>
        
        <div class="info">
            <p>左侧：标准盒模型 (content-box)</p>
            <p>右侧：IE 盒模型 (border-box)</p>
        </div>
    </div>
    
    <script src="./script.js"></script>
</body>
</html>`,
      'style.css': `body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

.box-model-demo {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
}

.box-container {
    display: flex;
    gap: 30px;
    margin-bottom: 30px;
}

.box {
    flex: 1;
    padding: 20px;
    border: 2px solid #007bff;
    position: relative;
}

.content-box {
    box-sizing: content-box;
    background-color: #e3f2fd;
}

.border-box {
    box-sizing: border-box;
    background-color: #f3e5f5;
}

.content {
    background-color: #fff;
    padding: 15px;
    border: 1px solid #ddd;
    text-align: center;
    font-weight: 500;
}

.box::before {
    content: attr(class);
    position: absolute;
    top: -10px;
    left: 10px;
    background: #333;
    color: white;
    padding: 2px 8px;
    font-size: 12px;
    border-radius: 3px;
}

.info {
    text-align: center;
    color: #666;
}

.info p {
    margin: 5px 0;
}`,
      'script.js': `// CSS 盒模型演示脚本
document.addEventListener('DOMContentLoaded', function() {
    console.log('盒模型演示已加载');
    
    // 获取两个盒子元素
    const contentBox = document.querySelector('.content-box');
    const borderBox = document.querySelector('.border-box');
    
    // 显示盒子的尺寸信息
    function showBoxInfo(element, name) {
        const rect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);
        
        console.log(\`\${name} 盒子信息:\`);
        console.log(\`- 总宽度: \${rect.width}px\`);
        console.log(\`- 总高度: \${rect.height}px\`);
        console.log(\`- 内边距: \${computedStyle.padding}\`);
        console.log(\`- 边框: \${computedStyle.borderWidth}\`);
        console.log(\`- box-sizing: \${computedStyle.boxSizing}\`);
    }
    
    // 显示两个盒子的信息
    showBoxInfo(contentBox, '标准盒模型');
    showBoxInfo(borderBox, 'IE 盒模型');
    
    // 添加点击事件来显示详细信息
    contentBox.addEventListener('click', function() {
        alert('标准盒模型 (content-box)\\n总宽度 = 内容宽度 + 内边距 + 边框');
    });
    
    borderBox.addEventListener('click', function() {
        alert('IE 盒模型 (border-box)\\n总宽度 = 设定的宽度\\n内边距和边框包含在宽度内');
    });
});`
    }
  },
  {
    id: 'flexbox-demo',
    title: 'Flexbox 布局演示',
    category: '布局技术',
    mode: 'demo' as const,
    initialCode: {
      'index.html': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flexbox 演示</title>
    <link rel="stylesheet" href="./style.css">
</head>
<body>
    <div class="flex-demo">
        <h1>Flexbox 布局演示</h1>
        
        <div class="flex-container">
            <div class="flex-item">项目 1</div>
            <div class="flex-item">项目 2</div>
            <div class="flex-item">项目 3</div>
        </div>
        
        <div class="controls">
            <button id="justify-center">居中对齐</button>
            <button id="justify-between">两端对齐</button>
            <button id="justify-around">环绕对齐</button>
        </div>
    </div>
    
    <script src="./script.js"></script>
</body>
</html>`,
      'style.css': `body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

.flex-demo {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
}

.flex-container {
    display: flex;
    background-color: #e3f2fd;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    min-height: 100px;
}

.flex-item {
    background-color: #2196f3;
    color: white;
    padding: 15px 20px;
    margin: 5px;
    border-radius: 4px;
    text-align: center;
    min-width: 80px;
}

.controls {
    text-align: center;
}

.controls button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    margin: 5px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.controls button:hover {
    background-color: #0056b3;
}`,
      'script.js': `// Flexbox 演示脚本
document.addEventListener('DOMContentLoaded', function() {
    console.log('Flexbox 演示已加载');
    
    const container = document.querySelector('.flex-container');
    const centerBtn = document.getElementById('justify-center');
    const betweenBtn = document.getElementById('justify-between');
    const aroundBtn = document.getElementById('justify-around');
    
    centerBtn.addEventListener('click', function() {
        container.style.justifyContent = 'center';
        console.log('设置为居中对齐');
    });
    
    betweenBtn.addEventListener('click', function() {
        container.style.justifyContent = 'space-between';
        console.log('设置为两端对齐');
    });
    
    aroundBtn.addEventListener('click', function() {
        container.style.justifyContent = 'space-around';
        console.log('设置为环绕对齐');
    });
});`
    }
  }
]

const PlaygroundDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [selectedPlayground, setSelectedPlayground] = useState(id || 'box-model-intro')

  // 获取当前选中的 Playground
  const currentPlayground = mockPlaygrounds.find(p => p.id === selectedPlayground)

  // 按分类组织 Playground
  const playgroundsByCategory = mockPlaygrounds.reduce((acc, playground) => {
    if (!acc[playground.category]) {
      acc[playground.category] = []
    }
    acc[playground.category].push(playground)
    return acc
  }, {} as Record<string, typeof mockPlaygrounds>)

  return (
    <div className="playground-detail-page">
      <div className="playground-nav">
        <div className="nav-header">
          <h3>示例导航</h3>
        </div>
        
        <div className="nav-content">
          {Object.entries(playgroundsByCategory).map(([category, playgrounds]) => (
            <div key={category} className="nav-category">
              <h4 className="category-title">{category}</h4>
              <div className="category-items">
                {playgrounds.map((playground) => (
                  <button
                    key={playground.id}
                    className={`nav-item ${selectedPlayground === playground.id ? 'active' : ''}`}
                    onClick={() => setSelectedPlayground(playground.id)}
                  >
                    {playground.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="playground-main">
        {currentPlayground ? (
          <div className="playground-container">
            <div className="playground-header">
              <h2>{currentPlayground.title}</h2>
              <p className="playground-description">
                这是一个独立的 Playground 环境，专注于代码实践和调试。
              </p>
            </div>
            
            <Playground
              id={currentPlayground.id}
              mode={currentPlayground.mode}
              showConsole={true}
              onCodeChange={(files) => {
                console.log('Playground 代码已更改:', files)
              }}
            />
          </div>
        ) : (
          <div className="playground-not-found">
            <h2>示例未找到</h2>
            <p>抱歉，找不到 ID 为 "{id}" 的示例。</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlaygroundDetailPage 