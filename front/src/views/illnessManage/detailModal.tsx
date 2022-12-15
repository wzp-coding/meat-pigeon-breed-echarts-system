import React from 'react';
import { Modal, Form } from 'antd';
import TencentOssUpload from '@/components/tencent-oss-upload';

type Props = {
  visible: boolean;
  rowData: Record<string, any>;
  onCancel: () => void;
};

const _Modal: React.FC<Props> = function ({ visible, onCancel, rowData }) {
  return (
    <Modal title={'详情'} visible={visible} onCancel={onCancel} destroyOnClose>
      <Form preserve={false} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        {rowData?.name && (
          <Form.Item label="疾病名称" name="name">
            <div>{rowData?.name}</div>
          </Form.Item>
        )}
        {rowData?.description && (
          <Form.Item label="症状描述" name="description">
            <div>{rowData?.description}</div>
          </Form.Item>
        )}
        {rowData?.treatment && (
          <Form.Item label="治疗方法" name="treatment">
            <div>{rowData?.treatment}</div>
          </Form.Item>
        )}
        {rowData?.pictures && (
          <Form.Item label="图片描述" name="pictures">
            <TencentOssUpload
              values={rowData.pictures.split(',')}
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
