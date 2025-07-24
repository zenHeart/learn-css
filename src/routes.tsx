import { createFileRoute } from '@tanstack/react-router'
import HomePage from './pages/HomePage'
import TopicsPage from './pages/TopicsPage'
import ReferencePage from './pages/ReferencePage'
import PlaygroundDetailPage from './pages/PlaygroundDetailPage'

// 根路由
export const Route = createFileRoute('/')({
  component: HomePage,
})

// 学习页路由
export const TopicsRoute = createFileRoute('/topics')({
  component: TopicsPage,
})

// 索引页路由
export const ReferenceRoute = createFileRoute('/reference')({
  component: ReferencePage,
})

// 示例详情页路由
export const PlaygroundRoute = createFileRoute('/playground/$id')({
  component: PlaygroundDetailPage,
}) 