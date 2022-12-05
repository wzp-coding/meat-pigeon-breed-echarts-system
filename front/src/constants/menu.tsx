import {
  AreaChartOutlined,
  BugOutlined,
  UserOutlined,
  ApartmentOutlined
} from '@ant-design/icons'

export const HOME_SIDER_MENU_LIST = [
  {
    path: '/home/index',
    icon: <AreaChartOutlined />,
    name: '数据大屏'
  },
  {
    path: '',
    icon: <ApartmentOutlined />,
    name: '养殖中心',
    children: [
      {
        path: '/home/feed',
        name: '饲料管理'
      },
      {
        path: '/home/pigeonCategory',
        name: '鸽类管理'
      },
      {
        path: '/home/pigeon',
        name: '肉鸽管理'
      },
    ]
  },
  {
    path: '/home/disease',
    icon: <BugOutlined />,
    name: '疾病防治'
  },
  {
    path: '/home/user',
    icon: <UserOutlined />,
    name: '个人中心',
    children: [
      {
        path: '/home/base',
        name: '个人中心'
      },
      {
        path: '/home/innerMessage',
        name: '消息中心'
      },
      {
        path: '/home/notification',
        name: '消息通知'
      },
      {
        path: '/home/account',
        name: '账号设置'
      },
    ]
  },
]

export const SETTING_SIDER_MENU_LIST = [
  {
    path: '/home/base',
    name: '个人中心'
  },
  {
    path: '/home/innerMessage',
    name: '消息中心'
  },
  {
    path: '/home/notification',
    name: '消息通知'
  },
  {
    path: '/home/account',
    name: '账号设置'
  },
]
