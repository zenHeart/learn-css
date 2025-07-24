import React, { useState } from 'react'
import { Link, useLocation } from 'react-router'
import type { SidebarItem } from '../types/sidebar'
import sidebarData from '../data/sidebar.json'

interface SidebarProps {
  depth?: number
}

interface SidebarItemProps {
  item: SidebarItem
  level: number
  maxDepth: number
}

const SidebarItemComponent: React.FC<SidebarItemProps> = ({ item, level, maxDepth }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0)
  const location = useLocation()
  const isActive = location.pathname === item.path
  const hasChildren = item.children && item.children.length > 0
  const canExpand = level < maxDepth && hasChildren

  const handleToggle = () => {
    if (canExpand) {
      setIsExpanded(!isExpanded)
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
          <Link to={item.path} className="sidebar-link">
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
            />
          ))}
        </div>
      )}
    </div>
  )
}

const Sidebar: React.FC<SidebarProps> = ({ depth = 3 }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>学习目录</h3>
      </div>
      
      <div className="sidebar-content">
        {sidebarData.items.map((item, index) => (
          <SidebarItemComponent
            key={index}
            item={item}
            level={0}
            maxDepth={depth}
          />
        ))}
      </div>
    </div>
  )
}

export default Sidebar 