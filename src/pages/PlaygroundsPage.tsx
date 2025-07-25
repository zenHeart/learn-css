import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import Playground from '../components/Playground'
import SearchModal from '../components/SearchModal'
import { allPlaygroundsData, allDocsData } from 'virtual:doc-data'

interface PlaygroundItem {
  id: string
  title: string
  docTitle: string
  category: string
  mode: 'demo' | 'exercise' | 'test'
  initialCode: Record<string, string>
  solutionCode?: Record<string, string>
}

const PlaygroundsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [playgroundsWithMeta, setPlaygroundsWithMeta] = useState<PlaygroundItem[]>([])
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  
  // 从虚拟模块获取数据
  const allDocs = allDocsData || []

  // 构建带完整信息的 Playground 列表
  useEffect(() => {
    const playgrounds: PlaygroundItem[] = []
    
    // 遍历所有文档，收集 Playground 信息
    allDocs.forEach(doc => {
      doc.playgrounds.forEach(playground => {
        playgrounds.push({
          id: playground.id,
          title: playground.id.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          docTitle: doc.title,
          category: doc.category,
          mode: playground.mode,
          initialCode: playground.initialCode,
          solutionCode: playground.solutionCode
        })
      })
    })

    // 按分类和标题排序
    playgrounds.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category)
      }
      return a.title.localeCompare(b.title)
    })

    setPlaygroundsWithMeta(playgrounds)
    
    // 如果没有指定 ID 或 ID 不存在，导航到第一个 playground
    if (!id && playgrounds.length > 0) {
      navigate(`/playground/${playgrounds[0].id}`, { replace: true })
    } else if (id && !playgrounds.find(p => p.id === id)) {
      console.warn(`Playground ${id} not found`)
      if (playgrounds.length > 0) {
        navigate(`/playground/${playgrounds[0].id}`, { replace: true })
      }
    }
  }, [allDocs, id, navigate])

  // 获取当前选中的 Playground
  const currentPlayground = playgroundsWithMeta.find(p => p.id === id)

  // 按分类组织 Playground
  const playgroundsByCategory = playgroundsWithMeta.reduce((acc, playground) => {
    if (!acc[playground.category]) {
      acc[playground.category] = []
    }
    acc[playground.category].push(playground)
    return acc
  }, {} as Record<string, PlaygroundItem[]>)

  // 搜索弹窗处理
  const openSearchModal = () => setIsSearchModalOpen(true)
  const closeSearchModal = () => setIsSearchModalOpen(false)

  // 监听 Command+K 快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        openSearchModal()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // 处理 playground 切换
  const handlePlaygroundSelect = (playgroundId: string) => {
    navigate(`/playground/${playgroundId}`)
  }

  if (playgroundsWithMeta.length === 0) {
    return (
      <>
        <div className="topics-page">
          <div className="playground-loading">
            <h2>加载中...</h2>
            <p>正在加载示例数据</p>
          </div>
        </div>

        <SearchModal 
          isOpen={isSearchModalOpen}
          onClose={closeSearchModal}
        />
      </>
    )
  }

  return (
    <>
      <div className="topics-page">
        {/* 左侧导航 - 与 Sidebar 保持一致的布局 */}
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-header-top">
              <Link to="/" className="home-button">
                ← 返回首页
              </Link>
              <button 
                className="search-button" 
                onClick={openSearchModal}
                title="搜索文档 (⌘+K)"
              >
                🔍
              </button>
            </div>
          </div>
          
          <div className="sidebar-content">
            {Object.entries(playgroundsByCategory).map(([category, playgrounds]) => (
              <div key={category} className="playground-category">
                <h4 className="playground-category-title">{category}</h4>
                <div className="playground-category-items">
                  {playgrounds.map((playground) => (
                    <button
                      key={playground.id}
                      className={`playground-nav-item ${id === playground.id ? 'active' : ''}`}
                      onClick={() => handlePlaygroundSelect(playground.id)}
                    >
                      <div className="playground-nav-content">
                        <span className="playground-nav-title">{playground.title}</span>
                        <span className="playground-nav-doc">{playground.docTitle}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 右侧内容区 - 与 TopicsPage 保持一致的布局 */}
        <div className="content">
          {currentPlayground ? (
            <div className="playground-content">
              <div className="playground-header">
                <div className="playground-breadcrumb">
                  <span className="category-badge">{currentPlayground.category}</span>
                  <span className="breadcrumb-separator">›</span>
                  <span className="doc-title">{currentPlayground.docTitle}</span>
                  <span className="breadcrumb-separator">›</span>
                  <span className="playground-title">{currentPlayground.title}</span>
                </div>
                
                <div className="playground-meta">
                  <span className={`mode-badge mode-${currentPlayground.mode}`}>
                    {currentPlayground.mode === 'demo' ? '示例' : 
                     currentPlayground.mode === 'exercise' ? '练习' : '测试'}
                  </span>
                </div>
              </div>
              
              <Playground
                id={currentPlayground.id}
                mode={currentPlayground.mode}
                initialCode={currentPlayground.initialCode}
                solutionCode={currentPlayground.solutionCode}
                showConsole={true}
                onCodeChange={(files) => {
                  console.log(`Playground ${currentPlayground.id} 代码已更改:`, files)
                }}
              />
            </div>
          ) : (
            <div className="playground-not-found">
              <h2>示例未找到</h2>
              <p>抱歉，找不到 ID 为 "{id}" 的示例。</p>
              <div className="suggestions">
                <p>可用的示例：</p>
                <ul>
                  {playgroundsWithMeta.slice(0, 5).map(playground => (
                    <li key={playground.id}>
                      <button
                        onClick={() => handlePlaygroundSelect(playground.id)}
                        className="suggestion-link"
                      >
                        {playground.title} ({playground.category})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
      />
    </>
  )
}

export default PlaygroundsPage 