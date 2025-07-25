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
  const isLeaf = !!item.path && (!item.children || item.children.length === 0)
  const isActive = isLeaf && location.pathname === `/topics/${item.path}`

  const handleToggle = () => {
    if (!isLeaf && item.children && item.children.length > 0) {
      setIsExpanded(!isExpanded)
    }
  }

  const handleDocClick = () => {
    if (onDocChange && isLeaf && item.path) {
      onDocChange(item.path)
    }
  }

  return (
    <div className={`sidebar-item level-${level}`}>
      <div className={`sidebar-item-header ${isActive ? 'active' : ''}`}>
        {!isLeaf && item.children && item.children.length > 0 && (
          <button
            className={`expand-button ${isExpanded ? 'expanded' : ''}`}
            onClick={handleToggle}
            aria-label={isExpanded ? '收起' : '展开'}
          >
            ▶
          </button>
        )}
        {isLeaf ? (
          <Link
            to={`/topics/${item.path}`}
            className="sidebar-link"
            onClick={handleDocClick}
          >
            {item.title}
          </Link>
        ) : (
          <span className="sidebar-title" onClick={handleToggle} style={{ cursor: 'pointer' }}>
            {item.title}{item.path === '' ? ' (目录)' : ''}
          </span>
        )}
      </div>
      {item.children && isExpanded && (
        <div className="sidebar-children">
          {item.children.map((child, index) => (
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