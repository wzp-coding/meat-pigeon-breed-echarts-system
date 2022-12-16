import React from 'react';
import { useSetState } from 'ahooks';
import {
  serviceCheckAccount,
  serviceCreateUser,
  serviceUpdateUser,
} from '@/services';
import { isEmpty } from 'lodash';
import { Modal, Form, Input } from 'antd';
import { encrypto, trimInputValue, trimObjectValue } from '@/utils';
import TencentOssUpload from '@/components/tencent-oss-upload';

type Props = {
  visible: boolean;
  rowData?: Record<string, any> | null;
  onSuccess: () => void;
  onCancel: () => void;
};

const initialState: {avatar: string[], [key: string]: any} = {
  confirmLoading: false,
  account: '',
  name: '',
  password: '',
  avatar: [],
  phone: '',
  email: '',
};

const _Modal: React.FC<Props> = function ({
  visible,
  onSuccess,
  onCancel,
  rowData,
}) {
  const [form] = Form.useForm();
  const [state, setState] = useSetState(initialState);
  // const removeFns = useRef<Function[]>([]);

  const handleSubmitForm = async () => {
    try {
      setState({ confirmLoading: true });
      const values = await form.validateFields();
      const params = trimObjectValue(values);
      params.avatar = params?.avatar?.[0] || '';
      if (isEmpty(params.password)) {
        delete params.password;
      }else {
        params.password = encrypto(params.password);
      }
      (!rowData
        ? serviceCreateUser(params)
        : serviceUpdateUser(rowData.id, params)
      )
        .then(() => {
          onSuccess();
        })
        .finally(() => {
          setState({ confirmLoading: false });
        });
    } catch (error) {
      console.error(error);
    } finally {
      setState({ confirmLoading: false });
    }
  }

  return (
    <Modal
      title={rowData ? '编辑' : '新增'}
      visible={visible}
      onOk={handleSubmitForm}
      onCancel={onCancel}
      confirmLoading={state.confirmLoading}
      destroyOnClose
    >
      <Form
        form={form}
        preserve={false}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label="账号"
          name="account"
          initialValue={rowData?.account}
          rules={[
            {
              required: true,
              type: 'string',
              message: '账号长度在3～25字符之间',
              min: 3,
              max: 25,
            },
            {
              validator: async (_, value) => {
                if (!value || rowData) {
                  return Promise.resolve();
                }
                const { code } = await serviceCheckAccount({ account: value });
                if (code === 1) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('账号已存在'));
              },
            },
          ]}
          getValueFromEvent={trimInputValue}
        >
          <Input disabled={rowData ? true : false} placeholder="请输入账号" />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: rowData ? false : true,
              message: '密码长度在3～25字符之间',
              min: 3,
              max: 25,
            },
          ]}
          getValueFromEvent={trimInputValue}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        <Form.Item
          label="用户名"
          name="name"
          initialValue={rowData?.name}
          rules={[
            {
              type: 'string',
              message: '用户名长度在2～25字符之间',
              min: 2,
              max: 25,
            },
          ]}
          getValueFromEvent={trimInputValue}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="手机"
          initialValue={rowData?.phone}
          rules={[
            {
              pattern: new RegExp(
                /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
              ),
              message: '请输入合法的手机号',
            },
          ]}
          getValueFromEvent={trimInputValue}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          initialValue={rowData?.email}
          rules={[
            {
              type: 'email',
              message: '请输入合法的邮箱',
            },
          ]}
          getValueFromEvent={trimInputValue}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item
          label="头像"
          name="avatar"
          initialValue={rowData ? [rowData.avatar] : []}
        >
          <TencentOssUpload
            values={rowData?.avatar ? [rowData.avatar] : []}
            onChange={values => setState({ avatar: values })}
            // removeFns={removeFns}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default React.memo(_Modal);
