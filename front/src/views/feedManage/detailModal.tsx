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
      <Form preserve={false} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        {rowData?.name && (
          <Form.Item label="饲料名称" name="name">
            <div>{rowData?.name}</div>
          </Form.Item>
        )}
        {rowData?.category && (
          <Form.Item label="饲料种类" name="category">
            <div>{rowData?.category}</div>
          </Form.Item>
        )}
        {rowData?.purchaseTime && (
          <Form.Item label="进货日期" name="purchaseTime">
            <div>{rowData?.purchaseTime}</div>
          </Form.Item>
        )}
        {rowData?.purchaseAmount && (
          <Form.Item label="进货量" name="purchaseAmount">
            <div>{rowData?.purchaseAmount}g</div>
          </Form.Item>
        )}
        {rowData?.currentAmount && (
          <Form.Item label="当前存量" name="currentAmount">
            <div>{rowData?.currentAmount}g</div>
          </Form.Item>
        )}
        {rowData?.produceTime && (
          <Form.Item label="生产日期" name="produceTime">
            <div>{rowData?.produceTime}</div>
          </Form.Item>
        )}
        {rowData?.shelfLife && (
          <Form.Item label="保质期" name="shelfLife">
            <div>{rowData?.shelfLife}天</div>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default React.memo(_Modal);
