import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import Playground from '../components/Playground'
import { allPlaygroundsData, allDocsData } from 'virtual:doc-data'

interface PlaygroundItem {
  id: string
  title: string
  category: string
  mode: 'demo' | 'exercise' | 'test'
  initialCode: Record<string, string>
  solutionCode?: Record<string, string>
}

const PlaygroundDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [selectedPlayground, setSelectedPlayground] = useState(id || '')
  const [playgroundsWithMeta, setPlaygroundsWithMeta] = useState<PlaygroundItem[]>([])

  // 从虚拟模块获取数据
  const allPlaygrounds = allPlaygroundsData || {}
  const allDocs = allDocsData || []

  // 构建带完整信息的 Playground 列表
  useEffect(() => {
    const playgrounds: PlaygroundItem[] = []
    
    // 遍历所有文档，收集 Playground 信息
    allDocs.forEach(doc => {
      doc.playgrounds.forEach(playground => {
        playgrounds.push({
          id: playground.id,
          title: `${doc.title} - ${playground.id}`,
          category: doc.category,
          mode: playground.mode,
          initialCode: playground.initialCode,
          solutionCode: playground.solutionCode
        })
      })
    })

    setPlaygroundsWithMeta(playgrounds)
    
    // 如果没有指定 ID，默认选择第一个
    if (!id && playgrounds.length > 0) {
      setSelectedPlayground(playgrounds[0].id)
    } else if (id) {
      setSelectedPlayground(id)
    }
  }, [allPlaygrounds, allDocs, id])

  // 获取当前选中的 Playground
  const currentPlayground = playgroundsWithMeta.find(p => p.id === selectedPlayground)

  // 按分类组织 Playground
  const playgroundsByCategory = playgroundsWithMeta.reduce((acc, playground) => {
    if (!acc[playground.category]) {
      acc[playground.category] = []
    }
    acc[playground.category].push(playground)
    return acc
  }, {} as Record<string, PlaygroundItem[]>)

  return (
    <div className="playground-detail-page">
      <div className="playground-nav">
        <div className="nav-header">
          <h3>示例导航</h3>
          <p>选择要练习的示例</p>
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
              <div className="playground-meta">
                <span className="mode-badge">{currentPlayground.mode}</span>
                <span className="category-badge">{currentPlayground.category}</span>
              </div>
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
            {playgroundsWithMeta.length > 0 && (
              <div className="suggestions">
                <p>可用的示例：</p>
                <ul>
                  {playgroundsWithMeta.slice(0, 5).map(playground => (
                    <li key={playground.id}>
                      <button
                        onClick={() => setSelectedPlayground(playground.id)}
                        className="suggestion-link"
                      >
                        {playground.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlaygroundDetailPage 