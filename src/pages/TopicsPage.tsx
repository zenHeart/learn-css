import React, { useState, useEffect } from 'react'
import MdxRenderer from '../components/MdxRenderer'
import Sidebar from '../components/Sidebar'

// 导入虚拟模块数据
import { sidebarData, allDocsData, allPlaygroundsData } from 'virtual:doc-data'

interface DocItem {
  id: string
  title: string
  path: string
  category: string
  tags: string[]
  description: string
  frontmatter: Record<string, any>
  playgrounds: PlaygroundItem[]
}

interface PlaygroundItem {
  id: string
  mode: 'demo' | 'exercise' | 'test'
  initialCode: Record<string, string>
  solutionCode?: Record<string, string>
}

const TopicsPage: React.FC = () => {
  const [currentDoc, setCurrentDoc] = useState<DocItem | null>(null)
  const [docs, setDocs] = useState<DocItem[]>(allDocsData || [])
  const [playgrounds, setPlaygrounds] = useState<Record<string, PlaygroundItem>>(allPlaygroundsData || {})

  // 监听虚拟模块数据变化
  useEffect(() => {
    setDocs(allDocsData || [])
    setPlaygrounds(allPlaygroundsData || {})
  }, [allDocsData, allPlaygroundsData])

  // 默认显示第一个文档
  useEffect(() => {
    if (docs.length > 0 && !currentDoc) {
      setCurrentDoc(docs[0])
    }
  }, [docs, currentDoc])

  // 处理文档切换
  const handleDocChange = (docId: string) => {
    const doc = docs.find(d => d.id === docId)
    if (doc) {
      setCurrentDoc(doc)
    }
  }

  // 获取当前文档的 Playground 数据
  const getCurrentPlaygrounds = () => {
    if (!currentDoc) return []
    
    return currentDoc.playgrounds.map(playground => ({
      ...playground,
      initialCode: playground.initialCode
    }))
  }

  if (!currentDoc) {
    return (
      <div className="topics-page">
        <Sidebar depth={3} onDocChange={handleDocChange} />
        <div className="content">
          <div className="loading">加载中...</div>
        </div>
      </div>
    )
  }

  // 生成 MDX 内容（后续将通过真实 MDX 解析）
  const mdxContent = `
<h1>${currentDoc.title}</h1>

<p>${currentDoc.description}</p>

<h2>文档信息</h2>

<ul>
  <li><strong>分类：</strong>${currentDoc.category}</li>
  <li><strong>标签：</strong>${currentDoc.tags.join(', ')}</li>
  <li><strong>路径：</strong>${currentDoc.path}</li>
</ul>

<h2>内容预览</h2>

<p>这是文档 "${currentDoc.title}" 的内容预览。实际内容将从 MDX 文件中加载。</p>

<h2>交互式演示</h2>

<p>下面包含 ${currentDoc.playgrounds.length} 个交互式演示：</p>

${currentDoc.playgrounds.map(playground => 
  `<div class="playground-placeholder" data-playground-id="${playground.id}" data-playground-mode="${playground.mode}"></div>`
).join('')}

<h2>小贴士</h2>

<ul>
  <li>这是一个自动生成的文档预览</li>
  <li>实际内容将从 MDX 文件中解析</li>
  <li>Playground 示例已自动加载</li>
</ul>
  `

  const frontmatter = {
    title: currentDoc.title,
    category: currentDoc.category,
    tags: currentDoc.tags,
    description: currentDoc.description,
    keywords: currentDoc.tags.join(', ')
  }

  return (
    <div className="topics-page">
      <Sidebar depth={3} onDocChange={handleDocChange} />
      
      <div className="content">
        <MdxRenderer 
          content={mdxContent} 
          frontmatter={frontmatter}
          playgrounds={getCurrentPlaygrounds()}
        />
      </div>
    </div>
  )
}

export default TopicsPage 