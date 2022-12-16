import React from 'react';
import {
  serviceCreatePigeonCategory,
  serviceUpdatePigeonCategory,
} from '@/services';
import { Modal, Form, Input } from 'antd';
import { trimInputValue, trimObjectValue } from '@/utils';
import NumberRange from '@/components/number-range';
import { useSetState } from 'ahooks';

type Props = {
  visible: boolean;
  rowData?: Record<string, any> | null;
  onSuccess: () => void;
  onCancel: () => void;
};

const initialState = {
  confirmLoading: false,
  category: '',
  yearEggs: [0, 0],
  fourAgeWeight: [0, 0],
  adultWeight: [0, 0],
  feature: '',
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
      params.yearEggs = params.yearEggs.join('~');
      params.fourAgeWeight = params.fourAgeWeight.join('~');
      params.adultWeight = params.adultWeight.join('~');
      (!rowData
        ? serviceCreatePigeonCategory(params)
        : serviceUpdatePigeonCategory(rowData.id, params)
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
  const rangeValidator = (_: any, value: number[]) => {
    if (value && value[0] < value[1]) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('请输入合法的范围'));
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
          label="种类"
          name="category"
          initialValue={rowData?.category}
          rules={[
            {
              required: true,
              type: 'string',
              message: '种类名长度在1～25字符之间',
              min: 1,
              max: 25,
            },
          ]}
          getValueFromEvent={trimInputValue}
        >
          <Input placeholder="请输入种类名" />
        </Form.Item>
        <Form.Item
          label="年产卵"
          name="yearEggs"
          initialValue={rowData?.yearEggs.split('~')}
          required
          rules={[
            {
              validator: rangeValidator,
            },
          ]}
        >
          <NumberRange
            defaultValues={rowData?.yearEggs.split('~')}
            onChange={values => setState({ yearEggs: values })}
          />&nbsp;个
        </Form.Item>
        <Form.Item
          label="四周龄体重"
          name="fourAgeWeight"
          initialValue={rowData?.fourAgeWeight.split('~')}
          required
          rules={[
            {
              validator: rangeValidator,
            },
          ]}
        >
          <NumberRange
            defaultValues={rowData?.fourAgeWeight.split('~')}
            onChange={values => setState({ fourAgeWeight: values })}
          />
          &nbsp;g
        </Form.Item>
        <Form.Item
          label="成年体重"
          name="adultWeight"
          initialValue={rowData?.adultWeight.split('~')}
          required
          rules={[
            {
              validator: rangeValidator,
            },
          ]}
        >
          <NumberRange
            defaultValues={rowData?.adultWeight.split('~')}
            onChange={values => setState({ adultWeight: values })}
          />
          &nbsp;g
        </Form.Item>
        <Form.Item
          label="特征"
          name="feature"
          initialValue={rowData?.feature}
          getValueFromEvent={trimInputValue}
          required
          rules={[
            {
              required: true,
              message: '请输入特征',
            },
          ]}
        >
          <Input.TextArea
            placeholder="请输入特征"
            autoSize={{ minRows: 1, maxRows: 5 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default React.memo(_Modal);
