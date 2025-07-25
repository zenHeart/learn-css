import { createHashRouter } from 'react-router'
import HomePage from './pages/HomePage'
import TopicsPage from './pages/TopicsPage'
import ReferencePage from './pages/ReferencePage'
import PlaygroundDetailPage from './pages/PlaygroundDetailPage'
import PlaygroundTestPage from './pages/PlaygroundTestPage'

// 定义路由结构
const router = createHashRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/topics',
    element: <TopicsPage />,
  },
  {
    path: '/reference',
    element: <ReferencePage />,
  },
  {
    path: '/playground',
    element: <PlaygroundDetailPage />,
  },
  {
    path: '/playground/:id',
    element: <PlaygroundDetailPage />,
  },
  {
    path: '/playground-test',
    element: <PlaygroundTestPage />,
  },
])

export default router