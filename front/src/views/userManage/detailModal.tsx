import React from 'react';
import { Modal, Form, Button } from 'antd';
import TencentOssUpload from '@/components/tencent-oss-upload';

type Props = {
  visible: boolean;
  rowData: Record<string, any>;
  onCancel: () => void;
};

const _Modal: React.FC<Props> = function ({ visible, onCancel, rowData }) {
  return (
    <Modal
      title={'详情'}
      visible={visible}
      onCancel={onCancel}
      destroyOnClose
      footer={[
        <Button key="back" onClick={onCancel}>
          关闭
        </Button>,
      ]}
    >
      <Form preserve={false} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
        {rowData?.account && (
          <Form.Item label="账号" name="account">
            <div>{rowData?.account}</div>
          </Form.Item>
        )}
        {rowData?.name && (
          <Form.Item label="用户名" name="name">
            <div>{rowData?.name}</div>
          </Form.Item>
        )}
        {rowData?.phone && (
          <Form.Item name="phone" label="手机">
            <div>{rowData?.phone}</div>
          </Form.Item>
        )}
        {rowData?.email && (
          <Form.Item name="email" label="邮箱">
            <div>{rowData?.email}</div>
          </Form.Item>
        )}
        {rowData?.avatar && (
          <Form.Item label="头像" name="avatar">
            <TencentOssUpload
              values={[rowData.avatar]}
              uploadProps={{
                showUploadList: {
                  showRemoveIcon: false,
                },
              }}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default React.memo(_Modal);
