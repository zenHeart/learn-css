import React, { useState } from 'react'
import { Link, useLocation } from 'react-router'
import type { SidebarItem } from '../types/sidebar'
import { sidebarData } from 'virtual:doc-data'

interface SidebarProps {
  depth?: number
  onDocChange?: (docId: string) => void
}

interface SidebarItemProps {
  item: SidebarItem
  level: number
  maxDepth: number
  onDocChange?: (docId: string) => void
}

const SidebarItemComponent: React.FC<SidebarItemProps> = ({ item, level, maxDepth, onDocChange }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0)
  const location = useLocation()
  const isActive = location.pathname === `/topics/${item.path}`
  const hasChildren = item.children && item.children.length > 0
  const canExpand = level < maxDepth && hasChildren

  const handleToggle = () => {
    if (canExpand) {
      setIsExpanded(!isExpanded)
    }
  }

  const handleDocClick = () => {
    if (onDocChange && item.path) {
      onDocChange(item.path)
    }
  }

  return (
    <div className={`sidebar-item level-${level}`}>
      <div className={`sidebar-item-header ${isActive ? 'active' : ''}`}>
        {canExpand && (
          <button
            className={`expand-button ${isExpanded ? 'expanded' : ''}`}
            onClick={handleToggle}
            aria-label={isExpanded ? '收起' : '展开'}
          >
            ▶
          </button>
        )}
        
        {hasChildren ? (
          <span className="sidebar-title">{item.title}</span>
        ) : (
          <Link 
            to={`/topics/${item.path}`}
            className="sidebar-link"
            onClick={handleDocClick}
          >
            {item.title}
          </Link>
        )}
      </div>
      
      {canExpand && isExpanded && (
        <div className="sidebar-children">
          {item.children!.map((child, index) => (
            <SidebarItemComponent
              key={index}
              item={child}
              level={level + 1}
              maxDepth={maxDepth}
              onDocChange={onDocChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const Sidebar: React.FC<SidebarProps> = ({ depth = 3, onDocChange }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>学习目录</h3>
      </div>
      
      <div className="sidebar-content">
        {(sidebarData?.items || []).map((item, index) => (
          <SidebarItemComponent
            key={index}
            item={item}
            level={0}
            maxDepth={depth}
            onDocChange={onDocChange}
          />
        ))}
      </div>
    </div>
  )
}

export default Sidebar 