export const siteConfig = {
  title: "CSS 学习笔记",
  description: "一个专注于 CSS 知识学习与实践的网站。",
  keywords: "CSS, 学习, 教程, 笔记, 前端, 开发",
  github: "https://github.com/zenHeart/learn-css",
  sidebarDepth: 3,
  showEditLink: true,
  defaultTheme: "light",
  enableSearch: true,
  basePath: "/learn-css/",
  deployUrl: "http://blog.zenheart.site/learn-css/",
} as const

export type SiteConfig = typeof siteConfig 