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
}

const SidebarItemComponent: React.FC<SidebarItemProps> = ({ item, level, maxDepth, onDocChange }) => {
  const location = useLocation()
  const isLeaf = !!item.path && (!item.children || item.children.length === 0)
  const isActive = isLeaf && location.pathname === `/topics/${item.path}`

  // 判断当前节点的任意子节点是否被激活
  const hasActiveChild = (children?: SidebarItem[]): boolean => {
    if (!children) return false
    return children.some(child =>
      (!!child.path && `/topics/${child.path}` === location.pathname) ||
      hasActiveChild(child.children)
    )
  }
  const childActive = hasActiveChild(item.children)
  // 初始展开：有激活子节点或是顶级目录
  const [isExpanded, setIsExpanded] = useState(level === 0 || childActive)
  // 用户手动操作后不再自动响应路由
  const [userToggled, setUserToggled] = useState(false)

  useEffect(() => {
    if (!userToggled && childActive) setIsExpanded(true)
  }, [childActive, userToggled])

  const handleToggle = () => {
    setIsExpanded(expanded => !expanded)
    setUserToggled(true)
  }

  // 递归渲染 children，过滤掉没有文档的目录
  const renderedChildren = item.children
    ? item.children
        .map((child, index) => (
          <SidebarItemComponent
            key={index}
            item={child}
            level={level + 1}
            maxDepth={maxDepth}
            onDocChange={onDocChange}
          />
        ))
        .filter(Boolean)
    : []

  if (!isLeaf && renderedChildren.length === 0) return null

  return (
    <div className={`sidebar-item level-${level}`}>
      <div
        className={`sidebar-item-header${isActive ? ' active' : ''}${childActive ? ' active-parent' : ''}${!isLeaf ? ' directory' : ''}`}
        style={{ paddingLeft: `${level * 1.5}em` }}
      >
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
            onClick={() => onDocChange && onDocChange(item.path)}
          >
            {item.title}
          </Link>
        ) : (
          <span className="sidebar-title" onClick={handleToggle} style={{ cursor: 'pointer' }}>
            {item.title}
          </span>
        )}
      </div>
      {item.children && isExpanded && (
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