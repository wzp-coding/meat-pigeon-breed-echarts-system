import React from 'react';
import { serviceCreatePigeonHouse, serviceUpdatePigeonHouse } from '@/services';
import { Modal, Form, Input, DatePicker, InputNumber } from 'antd';
import { clearEmptyObject, trimInputValue, trimObjectValue } from '@/utils';
import { useSetState } from 'ahooks';
import moment from 'moment';
type Props = {
  visible: boolean;
  rowData?: Record<string, any> | null;
  onSuccess: () => void;
  onCancel: () => void;
};

const initialState = {
  confirmLoading: false,
  name: '',
  lastCleanTime: '',
  lastFeedTime: '',
  cleanGap: undefined,
  feedGap: undefined,
};

const _Modal: React.FC<Props> = function ({
  visible,
  onSuccess,
  onCancel,
  rowData,
}) {
  const [form] = Form.useForm<PigeonHouseType.CreateReq>();
  const [state, setState] = useSetState(initialState);

  const handleSubmitForm = async () => {
    try {
      setState({ confirmLoading: true });
      const values = await form.validateFields();
      const params = clearEmptyObject(trimObjectValue(values));
      params.lastCleanTime &&
        (params.lastCleanTime = params.lastCleanTime.format(
          'YYYY-MM-DD HH:mm:ss'
        ));

      params.lastFeedTime &&
        (params.lastFeedTime = params.lastFeedTime.format(
          'YYYY-MM-DD HH:mm:ss'
        ));

      (!rowData
        ? serviceCreatePigeonHouse(params)
        : serviceUpdatePigeonHouse(rowData.id, params)
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
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
      >
        <Form.Item
          label="鸽舍名"
          name="name"
          initialValue={rowData?.name}
          rules={[
            {
              required: true,
              type: 'string',
              message: '鸽舍名长度在1～25字符之间',
              min: 1,
              max: 25,
            },
          ]}
          getValueFromEvent={trimInputValue}
        >
          <Input placeholder="请输入鸽舍名" />
        </Form.Item>
        <Form.Item
          label="上次清洁时间"
          name="lastCleanTime"
          initialValue={
            rowData?.lastCleanTime &&
            moment(rowData.lastCleanTime, 'YYYY-MM-DD HH:mm:ss')
          }
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="上次投喂时间"
          name="lastFeedTime"
          initialValue={
            rowData?.lastFeedTime &&
            moment(rowData.lastFeedTime, 'YYYY-MM-DD HH:mm:ss')
          }
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="清洁间隔"
          name="cleanGap"
          initialValue={rowData?.cleanGap}
          rules={[
            {
              type: 'number',
              required: true,
              message: '请输入清洁间隔',
            },
          ]}
        >
          <InputNumber min={0} style={{ width: '100%' }} addonAfter={'天'} />
        </Form.Item>
        <Form.Item
          label="投喂间隔"
          name="feedGap"
          initialValue={rowData?.feedGap}
          rules={[
            {
              type: 'number',
              required: true,
              message: '请输入投喂间隔',
            },
          ]}
        >
          <InputNumber min={0} style={{ width: '100%' }} addonAfter={'小时'} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default React.memo(_Modal);
