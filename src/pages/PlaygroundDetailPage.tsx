import React, { useState } from 'react'
import { useParams } from 'react-router'
import Playground from '../components/Playground'
import { allPlaygroundsData } from 'virtual:doc-data'

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

  // 从虚拟模块获取 Playground 数据
  const allPlaygrounds = allPlaygroundsData || {}
  
  // 转换为带标题和分类的格式
  const playgroundsWithMeta: PlaygroundItem[] = Object.entries(allPlaygrounds).map(([playgroundId, playground]) => ({
    id: playgroundId,
    title: `Playground: ${playgroundId}`,
    category: '示例',
    mode: playground.mode,
    initialCode: playground.initialCode,
    solutionCode: playground.solutionCode
  }))

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