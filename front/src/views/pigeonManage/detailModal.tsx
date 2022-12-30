import React from 'react';
import { Modal, Form, Button } from 'antd';

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
      <Form preserve={false} labelCol={{ span: 5 }} wrapperCol={{ span: 20 }}>
        {rowData?.category && (
          <Form.Item label="种类" name="category">
            <div>{rowData?.category}</div>
          </Form.Item>
        )}
        {rowData?.yearEggs && (
          <Form.Item label="年产卵" name="yearEggs">
            <div>{rowData?.yearEggs} 个</div>
          </Form.Item>
        )}
        {rowData?.fourAgeWeight && (
          <Form.Item label="四周龄体重" name="fourAgeWeight">
            <div>{rowData?.fourAgeWeight} g</div>
          </Form.Item>
        )}
        {rowData?.adultWeight && (
          <Form.Item label="成年体重" name="adultWeight">
            <div>{rowData?.adultWeight} g</div>
          </Form.Item>
        )}
        {rowData?.feature && (
          <Form.Item label="特征" name="feature">
            <div>{rowData?.feature}</div>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default React.memo(_Modal);
