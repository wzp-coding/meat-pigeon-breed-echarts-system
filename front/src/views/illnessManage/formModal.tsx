import React from 'react';
import useKeepState from 'use-keep-state';
import {
  serviceCreateIllness,
  serviceUpdateIllness,
} from '@/services';
import { Modal, Form, Input } from 'antd';
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
  name: '',
  description: '',
  treatment: '',
  pictures: [],
};

const _Modal: React.FC<Props> = function ({
  visible,
  onSuccess,
  onCancel,
  rowData,
}) {
  const [form] = Form.useForm();
  const [state, setState] = useKeepState(initialState);
  // const removeFns = useRef<Function[]>([]);

  const handleSubmitForm = async () => {
    try {
      setState({ confirmLoading: true });
      const values = await form.validateFields();
      const params = trimObjectValue(values);
      params.pictures = params?.pictures?.join(',') || ''
      console.log('params: ', params);
      (!rowData
        ? serviceCreateIllness(params)
        : serviceUpdateIllness(rowData.id, params)
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
        wrapperCol={{ span: 18 }}
      >
        <Form.Item
          label="疾病名称"
          name="name"
          initialValue={rowData?.name}
          rules={[
            {
              required: true,
              type: 'string',
              message: '疾病名称长度在1～25字符之间',
              min: 1,
              max: 25,
            }
          ]}
          getValueFromEvent={trimInputValue}
        >
          <Input placeholder="请输入疾病名称"/>
        </Form.Item>
        <Form.Item
          label="症状描述"
          name="description"
          initialValue={rowData?.description}
          getValueFromEvent={trimInputValue}
        >
          <Input.TextArea placeholder="请输入症状描述" autoSize={{ minRows: 1, maxRows: 5 }}/>
        </Form.Item>
        <Form.Item
          label="治疗方法"
          name="treatment"
          initialValue={rowData?.treatment}
          getValueFromEvent={trimInputValue}
        >
          <Input.TextArea placeholder="请输入治疗方法" autoSize={{ minRows: 1, maxRows: 5 }}/>
        </Form.Item>
        <Form.Item
          label="图片描述"
          name="pictures"
          initialValue={rowData?.pictures ? rowData.pictures.split(',') : []}
        >
          <TencentOssUpload
            values={rowData?.pictures ? rowData.pictures.split(',') : []}
            onChange={values => setState({ pictures: values })}
            max={4}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default React.memo(_Modal);
