import React, { useEffect, useState, useMemo } from 'react';
import './style.scss';
import Avatar from '@/components/avatar';
import moment from 'moment';
import config from '@/config';
import { Layout, Badge, Popover, Empty, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { HomeMainState } from '@/views/layout/index';
import { useAppDispatch, useAppSelector } from '@/hooks';
// import { serviceGetInnerMessage } from '@/services'
import { fullscreen, exitFullscreen } from '@/utils';
import {
  PoweroffOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellFilled,
  BugFilled,
  GithubOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { LOCAL_STORAGE } from '@/constants';
import { SET_USER_INFO } from '@/store/userSlice';

const { Header } = Layout;
const popoverList = [
  { name: '个人中心', path: '/home/setting/base' },
  { name: '消息通知', path: '/home/setting/notification' },
  { name: '账号设置', path: '/home/setting/account' },
];

type Props = HomeMainState;

const PopoverContent = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const logout = () => {
    dispatch(SET_USER_INFO({}));
    message.info('注销登录成功');
    navigate('/');
  };
  return (
    <div className="popover-content">
      {popoverList.map(el => (
        <Link to={el.path} key={el.name} className="ls">
          {el.name}
        </Link>
      ))}
      <div className="ls sign-out" onClick={logout}>
        <PoweroffOutlined style={{ fontSize: '14px', marginRight: '5px' }} />
        退出
      </div>
    </div>
  );
};

const HomeHeader: React.FC<Props> = function ({ collapsed, setCollapsed }) {
  const [messageList, setMessageList] = useState([]);
  const [unReadCount, setUnReadCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem(LOCAL_STORAGE.USER)!) || {};

  useEffect(() => {}, []);

  const MessageContent = useMemo(
    () => (
      <div className="message-popover">
        <div className="msg-header item-block">
          <span className="left">站内消息通知</span>
          <Link className="right" to="/home/setting/notification">
            消息接收管理
          </Link>
        </div>
        {messageList.length > 0 ? (
          <>
            {messageList.map((item: any) => (
              <div className="item-block ls" key={item.id}>
                <div className="content">{item.content}</div>
                <div className="date">{item.createdAt}</div>
              </div>
            ))}
            <Link className="item-block ls" to="/home/setting/innerMessage">
              查看更多
            </Link>
          </>
        ) : (
          <Empty style={{ padding: '20px 0' }} />
        )}
      </div>
    ),
    [messageList]
  );

  function handleFullscreen() {
    setIsFullscreen(isFullscreen => {
      isFullscreen ? exitFullscreen() : fullscreen();
      return !isFullscreen;
    });
  }

  return (
    <Header>
      <div className="left">
        {collapsed ? (
          <MenuUnfoldOutlined
            onClick={setCollapsed}
            style={{ cursor: 'pointer', fontSize: '20px' }}
          />
        ) : (
          <MenuFoldOutlined
            onClick={setCollapsed}
            style={{ cursor: 'pointer', fontSize: '20px' }}
          />
        )}
      </div>
      <ul className="right">
        <Popover content={MessageContent}>
          <li>
            <Badge dot={unReadCount > 0}>
              <BellFilled />
            </Badge>
          </li>
        </Popover>
        <li onClick={handleFullscreen}>
          {isFullscreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
        </li>
        <Popover placement="bottomRight" content={PopoverContent}>
          <li>
            <Avatar src={userInfo.avatar || ''} />
            <span className="username">{userInfo.name || ''}</span>
          </li>
        </Popover>
      </ul>
    </Header>
  );
};

export default HomeHeader;
