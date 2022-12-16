import React from 'react';
import { useSetState } from 'ahooks';
import { serviceCreateFeed, serviceUpdateFeed } from '@/services';
import { Modal, Form, Input, DatePicker, InputNumber } from 'antd';
import { trimInputValue, trimObjectValue } from '@/utils';
import TencentOssUpload from '@/components/tencent-oss-upload';

type Props = {
  visible: boolean;
  rowData?: Record<string, any> | null;
  onSuccess: () => void;
  onCancel: () => void;
};

const initialState = {
  confirmLoading: false,
  category: '',
  purchaseTime: '',
  purchaseAmount: 0,
  currentAmount: 0,
  produceTime: '',
  shelfLife: 0,
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
      console.log('params: ', params);
      return;
      (!rowData
        ? serviceCreateFeed(params)
        : serviceUpdateFeed(rowData.id, params)
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
  };

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
        wrapperCol={{ span: 18 }}
      >
        <Form.Item
          label="饲料种类"
          name="category"
          initialValue={rowData?.category}
          rules={[
            {
              required: true,
              type: 'string',
              message: '饲料种类名长度在1～25字符之间',
              min: 1,
              max: 25,
            },
          ]}
          getValueFromEvent={trimInputValue}
        >
          <Input placeholder="请输入饲料种类名" />
        </Form.Item>
        <Form.Item
          label="进货日期"
          name="purchaseTime"
          initialValue={rowData?.purchaseTime}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="进货量"
          name="purchaseAmount"
          initialValue={rowData?.purchaseAmount}
        >
          <InputNumber min={0}  />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default React.memo(_Modal);
