// 侧边栏导航项的数据结构
export interface SidebarItem {
  title: string
  path: string
  children?: SidebarItem[]
  frontmatter?: {
    title?: string
    category?: string
    tags?: string[]
    description?: string
  }
  sortWeight?: number // 用于数字前缀排序的权重
}

// 侧边栏根数据结构
export interface SidebarData {
  items: SidebarItem[]
  depth: number
} 