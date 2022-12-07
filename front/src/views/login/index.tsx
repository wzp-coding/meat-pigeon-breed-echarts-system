import { useState, useEffect, useMemo } from 'react';
import './style.scss';
import config from '@/config';
import { Button, Input, Form, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '@/assets/img/common/logo.png';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { serviceLogin } from '@/services/user';
import qs from 'query-string';
import { useAppDispatch } from '@/hooks';
import { SET_USER_INFO } from '@/store/userSlice';

export default function () {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const redirectUrl = useMemo(() => {
    const url = qs.parse(location.search).redirectUrl as string;
    return url || '/home/index';
  }, []);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    setLoading(true);
    const { userInfo = {}, code } = await serviceLogin({
      account: values.account.trim(),
      password:values.password.trim()
    });
    setLoading(false);
    if(code === 1) {
      dispatch(SET_USER_INFO(userInfo));
      navigate(redirectUrl);
    }
  };

  useEffect(() => {
    if (config.isDevelopment) {
      form.setFieldsValue({
        account: 'admin',
        password: 'admin',
      });
    }
  }, []);

  return (
    <section className="login-page">
      <div className="wrap">
        <div>
          <div className="logo-wrap">
            <img src={logo} className="logo" alt="" />
            <em>{config.title}</em>
          </div>

          <Form form={form}>
            <Form.Item
              name="account"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            >
              <Input
                placeholder="用户名"
                prefix={<UserOutlined />}
                maxLength={32}
                autoComplete="off"
                onPressEnter={handleSubmit}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
              ]}
            >
              <Input
                placeholder="密码"
                prefix={<LockOutlined />}
                maxLength={32}
                type="password"
                autoComplete="off"
                onPressEnter={handleSubmit}
              />
            </Form.Item>
          </Form>

          <Button
            type="primary"
            style={{ marginTop: '20px' }}
            size="large"
            loading={loading}
            block
            onClick={handleSubmit}
          >
            {loading ? '登 录 中...' : '登 录'}
          </Button>
          <div className="register">
            <span>注册账号</span>
          </div>
        </div>
      </div>
    </section>
  );
}
