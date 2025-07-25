import React, { useState, useEffect } from 'react'
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
  parentCollapsed?: boolean
}

const SidebarItemComponent: React.FC<SidebarItemProps> = ({ 
  item, 
  level, 
  maxDepth, 
  onDocChange, 
  parentCollapsed = false 
}) => {
  const location = useLocation()
  const isLeaf = !!item.path && (!item.children || item.children.length === 0)
  // 修复路径匹配逻辑
  const currentPath = location.pathname
  const itemPath = item.path ? `/topics/${item.path}` : ''
  const isActive = isLeaf && currentPath === itemPath

  // 判断当前节点的任意子节点是否被激活
  const hasActiveChild = (children?: SidebarItem[], currentPath: string): boolean => {
    if (!children) return false
    return children.some(child => {
      if (child.path && `/topics/${child.path}` === currentPath) {
        return true
      }
      return hasActiveChild(child.children, currentPath)
    })
  }
  const childActive = hasActiveChild(item.children, currentPath)
  
  // 简化展开状态管理
  const getInitialExpandedState = () => {
    // 如果父级折叠，默认折叠
    if (parentCollapsed) return false
    // 顶级节点默认展开
    if (level === 0) return true
    // 有活跃子节点时展开
    return childActive
  }

  const [isExpanded, setIsExpanded] = useState(getInitialExpandedState)

  // 监听路由变化和父级折叠状态
  useEffect(() => {
    if (parentCollapsed) {
      setIsExpanded(false)
    } else {
      // 路由变化时，如果有活跃子节点就展开
      if (childActive || level === 0) {
        setIsExpanded(true)
      }
    }
  }, [childActive, parentCollapsed, level])

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsExpanded(prev => !prev)
  }

  // 先判断是否有可显示的子项目
  const hasValidChildren = (children?: SidebarItem[]): boolean => {
    if (!children || children.length === 0) return false
    return children.some(child => {
      // 如果是叶子节点（有path），直接返回true
      if (child.path) return true
      // 如果是目录，递归检查是否有有效的子项目
      return hasValidChildren(child.children)
    })
  }

    const hasChildren = !isLeaf && hasValidChildren(item.children)

  // 如果是目录但没有有效的子项目，不渲染
  if (!isLeaf && !hasChildren) return null

  // 递归渲染 children
  const renderedChildren = item.children
    ? item.children
        .map((child, index) => (
          <SidebarItemComponent
            key={child.path || `folder-${index}`}
            item={child}
            level={level + 1}
            maxDepth={maxDepth}
            onDocChange={onDocChange}
            parentCollapsed={parentCollapsed || !isExpanded}
          />
        ))
        .filter(Boolean)
    : []

  return (
    <div className={`sidebar-item level-${level}`}>
      <div
        className={`sidebar-item-header${isActive ? ' active' : ''}${childActive ? ' active-parent' : ''}${!isLeaf ? ' directory' : ''}`}
        style={{ paddingLeft: `${level * 1.5}em` }}
      >
        {/* 统一的按钮区域，确保所有项目对齐 */}
        <div className="expand-button-area">
          {hasChildren ? (
            <button
              className={`expand-button ${isExpanded ? 'expanded' : ''}`}
              onClick={handleToggle}
              aria-label={isExpanded ? '收起' : '展开'}
              type="button"
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          ) : (
            <span className="expand-button-placeholder"></span>
          )}
        </div>
        
        {isLeaf ? (
          <Link
            to={`/topics/${item.path}`}
            className="sidebar-link"
            onClick={() => onDocChange && onDocChange(item.path)}
          >
            {item.title}
          </Link>
        ) : (
          <span 
            className="sidebar-title" 
            onClick={hasChildren ? handleToggle : undefined}
            style={{ cursor: hasChildren ? 'pointer' : 'default' }}
          >
            {item.title}
          </span>
        )}
      </div>
      
      {hasChildren && isExpanded && (
        <div className="sidebar-children">
          {renderedChildren}
        </div>
      )}
    </div>
  )
}

const Sidebar: React.FC<SidebarProps> = ({ depth = 3, onDocChange }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="home-button">
          ← 返回首页
        </Link>
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