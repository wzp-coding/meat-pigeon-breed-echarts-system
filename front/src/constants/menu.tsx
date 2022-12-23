import {
  AreaChartOutlined,
  BugOutlined,
  UserOutlined,
  ApartmentOutlined,
  BankOutlined,
} from '@ant-design/icons';
export const MenuName = {
  数据大屏: '数据大屏',
  饲料管理: '饲料管理',
  鸽类管理: '鸽类管理',
  肉鸽管理: '肉鸽管理',
  疾病防治: '疾病防治',
  个人中心: '个人中心',
  消息中心: '消息中心',
  消息通知: '消息通知',
  账号设置: '账号设置',
  用户管理: '用户管理',
  养殖中心: '养殖中心',
  鸽舍管理: '鸽舍管理'
};

export const HOME_SIDER_MENU_LIST = [
  {
    path: '/home/index',
    icon: <AreaChartOutlined />,
    name: MenuName.数据大屏,
  },
  {
    path: '',
    icon: <ApartmentOutlined />,
    name: MenuName.养殖中心,
    children: [
      {
        path: '/home/feed',
        name: MenuName.饲料管理,
      },
      {
        path: '/home/pigeonCategory',
        name: MenuName.鸽类管理,
      },
      {
        path: '/home/pigeon',
        name: MenuName.肉鸽管理,
      },
      {
        path: '/home/pigeonHouse',
        name: MenuName.鸽舍管理,
      },
    ],
  },
  {
    path: '/home/disease',
    icon: <BugOutlined />,
    name: MenuName.疾病防治,
  },
  {
    path: '/home/user',
    icon: <BankOutlined />,
    name: MenuName.个人中心,
    children: [
      {
        path: '/home/base',
        name: MenuName.个人中心,
      },
      {
        path: '/home/innerMessage',
        name: MenuName.消息中心,
      },
      {
        path: '/home/notification',
        name: MenuName.消息通知,
      },
      {
        path: '/home/account',
        name: MenuName.账号设置,
      },
    ],
  },
  {
    path: '/home/userManage',
    name: MenuName.用户管理,
    icon: <UserOutlined />
  },
];

export const SETTING_SIDER_MENU_LIST = [
  {
    path: '/home/base',
    name: MenuName.个人中心,
  },
  {
    path: '/home/innerMessage',
    name: MenuName.消息中心,
  },
  {
    path: '/home/notification',
    name: MenuName.消息通知,
  },
  {
    path: '/home/account',
    name: MenuName.账号设置,
  },
];
