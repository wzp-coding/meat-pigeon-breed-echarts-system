import { useRoutes } from 'react-router-dom';
import PrivateRoute from '@/components/private-route';

import Login from '@/views/login/index';
import Layout from '@/views/layout/index';
import Index from '@/views/index/index';
import UserManage from '@/views/userManage/index';
import IllnessManage from '@/views/illnessManage/index';
import PigeonCategoryManage from '@/views/pigeonCategoryManage/index';
import FeedManage from '@/views/feedManage/index';
import PigeonHouseManage from '@/views/pigeonHouseManage/index';
import PigeonManage from '@/views/pigeonManage/index';
import { MenuName } from '@/constants';

export function MainRoutes() {
  const _Login = (
    <PrivateRoute
      element={Login}
      meta={{
        title: '登录',
      }}
    />
  );

  const elements = useRoutes([
    {
      path: '/',
      element: _Login,
    },
    {
      path: '/login',
      element: _Login,
    },
    {
      path: '/home',
      element: <Layout />,
      children: [
        {
          path: 'index',
          element: (
            <PrivateRoute
              element={Index}
              meta={{
                requiresAuth: true,
                title: MenuName.数据大屏,
              }}
            />
          ),
        },
        {
          path: 'disease',
          element: (
            <PrivateRoute
              element={IllnessManage}
              meta={{
                requiresAuth: true,
                title: MenuName.疾病防治,
              }}
            />
          ),
        },
        {
          path: 'userManage',
          element: (
            <PrivateRoute
              element={UserManage}
              meta={{
                requiresAuth: true,
                title: MenuName.用户管理,
              }}
            />
          ),
        },
        {
          path: 'pigeonCategory',
          element: (
            <PrivateRoute
              element={PigeonCategoryManage}
              meta={{
                requiresAuth: true,
                title: MenuName.鸽类管理,
              }}
            />
          ),
        },
        {
          path: 'pigeonHouse',
          element: (
            <PrivateRoute
              element={PigeonHouseManage}
              meta={{
                requiresAuth: true,
                title: MenuName.鸽舍管理,
              }}
            />
          ),
        },
        {
          path: 'feed',
          element: (
            <PrivateRoute
              element={FeedManage}
              meta={{
                requiresAuth: true,
                title: MenuName.饲料管理,
              }}
            />
          ),
        },
        {
          path: 'pigeon',
          element: (
            <PrivateRoute
              element={PigeonManage}
              meta={{
                requiresAuth: true,
                title: MenuName.肉鸽管理,
              }}
            />
          ),
        },
      ],
    },
  ]);

  return elements;
}
