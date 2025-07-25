import { createHashRouter } from 'react-router'
import HomePage from './pages/HomePage'
import TopicsPage from './pages/TopicsPage'
import PlaygroundDetailPage from './pages/PlaygroundDetailPage'

// 定义路由结构
const router = createHashRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/topics/:docId',
    element: <TopicsPage />,
  },
  {
    path: '/playground/:id',
    element: <PlaygroundDetailPage />,
  },
])

export default router