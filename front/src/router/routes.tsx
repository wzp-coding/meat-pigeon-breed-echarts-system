import { useRoutes } from 'react-router-dom'
import PrivateRoute from '@/components/private-route'

import Login from '@/views/login/index'
import Layout from '@/views/layout/index'
import Index from '@/views/index/index'

export function MainRoutes() {
  const _Login = <PrivateRoute element={Login} meta={{
    title: '登录'
  }} />
  
  const elements = useRoutes([
    {
      path: '/',
      element: _Login
    },
    {
      path: '/login',
      element: _Login
    },
    {
      path: '/home',
      element: <Layout />,
      children: [
        {
          path: 'index',
          element: <PrivateRoute element={Index} meta={{
            requiresAuth: true,
            title: '首页'
          }} />,
        }
      ]
    }
  ])

  return elements
}
