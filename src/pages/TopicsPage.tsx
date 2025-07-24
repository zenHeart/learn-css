import React from 'react'
import MdxRenderer from '../components/MdxRenderer'
import Sidebar from '../components/Sidebar'

const TopicsPage: React.FC = () => {
  // 模拟从 MDX 文件加载的内容
  const mdxContent = `
# CSS 盒模型基础

CSS 盒模型是 CSS 布局的基础概念，理解它对于掌握 CSS 布局至关重要。

## 什么是盒模型？

盒模型描述了 HTML 元素如何在页面上占据空间。每个 HTML 元素都被视为一个矩形盒子，这个盒子由以下部分组成：

- **内容区域 (Content)**：显示文本、图像等实际内容
- **内边距 (Padding)**：内容周围的空白区域
- **边框 (Border)**：内边距周围的边框
- **外边距 (Margin)**：边框周围的空白区域

## 盒模型的组成部分

\`\`\`css
.box {
  width: 200px;
  height: 100px;
  padding: 20px;
  border: 2px solid #333;
  margin: 10px;
}
\`\`\`

## 盒模型类型

CSS 中有两种盒模型：

1. **标准盒模型 (content-box)**：默认模式
2. **IE 盒模型 (border-box)**：更直观的模式

\`\`\`css
/* 标准盒模型 */
.box-standard {
  box-sizing: content-box;
  width: 200px; /* 只包含内容宽度 */
}

/* IE 盒模型 */
.box-border {
  box-sizing: border-box;
  width: 200px; /* 包含内容、内边距和边框 */
}
\`\`\`

## 实际应用

理解盒模型对于以下场景特别重要：

- 精确控制元素尺寸
- 创建响应式布局
- 调试布局问题
- 实现设计稿要求

## 交互式演示

下面是一个交互式的盒模型演示，你可以看到两种盒模型的区别：

<div class="playground-placeholder" data-playground-id="box-model-intro" data-playground-mode="demo"></div>

## 小贴士

- 使用 \`box-sizing: border-box\` 可以让布局更直观
- 外边距可以重叠，内边距不会重叠
- 边框会增加元素的实际尺寸
  `

  const frontmatter = {
    title: "CSS 盒模型基础",
    category: "布局基础",
    tags: ["box-model", "margin", "padding", "border"],
    description: "详细介绍 CSS 盒模型的基本概念、组成部分及其在布局中的应用。",
    keywords: "盒模型, Box Model, margin, padding, border, content-box, border-box"
  }

  // 模拟 Playground 数据
  const playgrounds = [
    {
      id: "box-model-intro",
      mode: "demo" as const,
      initialCode: {
        "index.html": `<!DOCTYPE html>
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
        "style.css": `body {
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
        "script.js": `// CSS 盒模型演示脚本
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
    }
  ]

  return (
    <div className="topics-page">
      <Sidebar depth={3} />
      
      <div className="content">
        <MdxRenderer 
          content={mdxContent} 
          frontmatter={frontmatter}
          playgrounds={playgrounds}
        />
      </div>
    </div>
  )
}

export default TopicsPage 