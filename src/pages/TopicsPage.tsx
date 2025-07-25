import React, { useState, useEffect } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router'
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
  content: string // 添加真实的 MDX 内容
  playgrounds: PlaygroundItem[]
}

interface PlaygroundItem {
  id: string
  mode: 'demo' | 'exercise' | 'test'
  initialCode: Record<string, string>
  solutionCode?: Record<string, string>
}

const TopicsPage: React.FC = () => {
  const location = useLocation()
  const params = useParams()
  const navigate = useNavigate()
  const [currentDoc, setCurrentDoc] = useState<DocItem | null>(null)
  const [docs, setDocs] = useState<DocItem[]>(allDocsData || [])
  const [playgrounds, setPlaygrounds] = useState<Record<string, PlaygroundItem>>(allPlaygroundsData || {})
  const [error, setError] = useState<string | null>(null)

  // 监听虚拟模块数据变化
  useEffect(() => {
    try {
      setDocs(allDocsData || [])
      setPlaygrounds(allPlaygroundsData || {})
      setError(null)
    } catch (err) {
      console.error('加载文档数据失败:', err)
      setError('加载文档数据失败')
    }
  }, [allDocsData, allPlaygroundsData])

  // 根据文档ID查找文档
  const findDocById = (docId: string) => {
    if (!docId) return null
    
    // 尝试多种匹配方式
    const doc = docs.find(doc => 
      doc.id === docId || 
      doc.path === docId ||
      doc.id.replace(/[\/\\]/g, '-') === docId ||
      doc.path.replace(/[\/\\]/g, '-') === docId
    )
    
    return doc
  }

  // 处理文档切换
  const handleDocChange = (docId: string) => {
    try {
      const doc = findDocById(docId)
      if (doc) {
        setCurrentDoc(doc)
        // 导航到对应的路由
        navigate(`/topics/${doc.id}`)
        setError(null)
      } else {
        console.warn(`未找到文档: ${docId}`)
        setError(`未找到文档: ${docId}`)
      }
    } catch (err) {
      console.error('切换文档失败:', err)
      setError('切换文档失败')
    }
  }

  // 监听路由参数变化和文档数据变化
  useEffect(() => {
    try {
      const docId = params.docId
      
      if (docId && docs.length > 0) {
        const doc = findDocById(docId)
        if (doc) {
          setCurrentDoc(doc)
          setError(null)
          return
        } else {
          console.warn(`URL中的文档ID未找到: ${docId}`)
          setError(`文档未找到: ${docId}`)
        }
      }
      
      // 如果没有指定文档，重定向到第一个文档
      if (docs.length > 0 && !currentDoc) {
        const firstDoc = docs[0]
        setCurrentDoc(firstDoc)
        // 重定向到第一个文档的路由
        navigate(`/topics/${firstDoc.id}`, { replace: true })
        setError(null)
      }
    } catch (err) {
      console.error('处理文档切换失败:', err)
      setError('处理文档切换失败')
    }
  }, [docs, params.docId, currentDoc, navigate])

  // 获取当前文档的 Playground 数据
  const getCurrentPlaygrounds = () => {
    if (!currentDoc) return []
    
    return currentDoc.playgrounds.map(playground => ({
      ...playground,
      initialCode: playground.initialCode
    }))
  }

  // 错误状态显示
  if (error) {
    return (
      <div className="topics-page">
        <Sidebar depth={3} onDocChange={handleDocChange} />
        <div className="content">
          <div className="error-message">
            <h2>出错了！</h2>
            <p>{error}</p>
            <p>可用文档:</p>
            <ul>
              {docs.map(doc => (
                <li key={doc.id}>
                  <button 
                    onClick={() => handleDocChange(doc.id)}
                    style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}
                  >
                    {doc.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
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

  return (
    <div className="topics-page">
      <Sidebar depth={3} onDocChange={handleDocChange} />
      
      <div className="content">
        <MdxRenderer 
          content={currentDoc.content} // 使用真实的 MDX 内容
          frontmatter={currentDoc.frontmatter} // 使用真实的 frontmatter
          playgrounds={getCurrentPlaygrounds()}
        />
      </div>
    </div>
  )
}

export default TopicsPage 