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
      <Form preserve={false} labelCol={{ span: 6 }} wrapperCol={{ span: 20 }}>
        {rowData?.name && (
          <Form.Item label="鸽舍名" name="name">
            <div>{rowData?.name}</div>
          </Form.Item>
        )}
        {rowData?.lastCleanTime && (
          <Form.Item label="上次清洁时间" name="lastCleanTime">
            <div>{rowData?.lastCleanTime}</div>
          </Form.Item>
        )}
        {rowData?.lastFeedTime && (
          <Form.Item label="上次投喂时间" name="lastFeedTime">
            <div>{rowData?.lastFeedTime}</div>
          </Form.Item>
        )}
        {rowData?.cleanGap && (
          <Form.Item label="清洁间隔" name="cleanGap">
            <div>{rowData?.cleanGap} 天</div>
          </Form.Item>
        )}
        {rowData?.feedGap && (
          <Form.Item label="投喂间隔" name="feedGap">
            <div>{rowData?.feedGap} 小时</div>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default React.memo(_Modal);
