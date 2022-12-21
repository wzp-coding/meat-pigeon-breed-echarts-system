import React from 'react';
import { useSetState } from 'ahooks';
import { serviceCreateFeed, serviceUpdateFeed } from '@/services';
import { Modal, Form, Input, DatePicker, InputNumber, Select } from 'antd';
import { transformTimeUnit, transformWeightUnit, trimInputValue, trimObjectValue } from '@/utils';
import { CATEGORY_LIST } from './const';
import moment from 'moment';
import { useEffect } from 'react';
import useUnitSelect from '@/hooks/useUnitSelect';

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
  const {
    comp: shelfLifeUnitSelect,
    value: shelfLifeUnit,
    setValue: setShelfLifeUnit,
  } = useUnitSelect([
    {
      label: '天',
      value: 'day',
    },
    {
      label: '月',
      value: 'month',
    },
    {
      label: '年',
      value: 'year',
    },
  ]);
  const {
    comp: currentAmountUnitSelect,
    value: currentAmountUnit,
    setValue: setCurrentAmountUnit,
  } = useUnitSelect(['g', 'kg']);
  const {
    comp: purchaseAmountUnitSelect,
    value: purchaseAmountUnit,
    setValue: setPurchaseAmountUnit,
  } = useUnitSelect(['g', 'kg']);

  // rowData变化时重置单位
  useEffect(() => {
    setShelfLifeUnit('day');
    setCurrentAmountUnit('g');
    setPurchaseAmountUnit('g');
  }, [rowData]);

  const handleSubmitForm = async () => {
    try {
      setState({ confirmLoading: true });
      const values = await form.validateFields();
      const params = trimObjectValue(values);
      params.purchaseTime = params.purchaseTime.format('YYYY-MM-DD');
      params.produceTime = params.produceTime.format('YYYY-MM-DD');
      params.purchaseAmount = transformWeightUnit(params.purchaseAmount, purchaseAmountUnit as 'kg' | 'g');
      params.currentAmount = transformWeightUnit(params.currentAmount, currentAmountUnit as 'kg' | 'g') || params.purchaseAmount;
      params.shelfLife = transformTimeUnit(params.shelfLife, shelfLifeUnit as 'month' | 'day' | 'year');
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
          label="饲料名称"
          name="name"
          initialValue={rowData?.name}
          rules={[
            {
              required: true,
              message: '请输入饲料名称',
            },
          ]}
          getValueFromEvent={trimInputValue}
        >
          <Input placeholder="请输入饲料名称" />
        </Form.Item>
        <Form.Item
          label="饲料种类"
          name="category"
          initialValue={rowData?.category}
          rules={[
            {
              required: true,
              message: '请选择饲料种类',
            },
          ]}
        >
          <Select
            defaultValue={rowData?.category}
            style={{ width: '100%' }}
            options={CATEGORY_LIST}
            placeholder="请选择饲料种类"
          />
        </Form.Item>
        <Form.Item
          label="进货日期"
          name="purchaseTime"
          initialValue={
            rowData?.purchaseTime && moment(rowData.purchaseTime, 'YYYY-MM-DD')
          }
          rules={[
            {
              required: true,
              message: '请选择进货日期',
            },
            ({ getFieldValue, validateFields, isFieldValidating }) => ({
              validator: (_, value) => {
                const produceTime = getFieldValue('produceTime');
                if (produceTime && !value.isSameOrAfter(produceTime, 'day')) {
                  return Promise.reject(
                    new Error('进货日期不能在生产日期之前')
                  );
                }
                if (produceTime && !isFieldValidating(['produceTime'])) {
                  validateFields(['produceTime']);
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="进货量"
          name="purchaseAmount"
          initialValue={rowData?.purchaseAmount || 0}
          rules={[
            {
              required: true,
              message: '请输入进货量',
            },
            ({ getFieldValue, validateFields, isFieldValidating }) => ({
              validator: (_, value) => {
                const currentAmount = getFieldValue('currentAmount');
                if (currentAmount && value < currentAmount) {
                  return Promise.reject(new Error('进货量不能少于当前存量'));
                }
                if (currentAmount && !isFieldValidating(['currentAmount'])) {
                  validateFields(['currentAmount']);
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <InputNumber min={0} style={{ width: '100%' }} addonAfter={purchaseAmountUnitSelect} />
        </Form.Item>
        {rowData?.currentAmount && (
          <Form.Item
            label="当前存量"
            name="currentAmount"
            initialValue={rowData?.currentAmount || 0}
            rules={[
              {
                required: true,
                message: '请输入当前存量',
              },
              ({ getFieldValue, validateFields, isFieldValidating }) => ({
                validator: (_, value) => {
                  const purchaseAmount = getFieldValue('purchaseAmount');
                  if (purchaseAmount && value > purchaseAmount) {
                    return Promise.reject(new Error('当前存量不能超过进货量'));
                  }
                  if (!isFieldValidating(['purchaseAmount'])) {
                    validateFields(['purchaseAmount']);
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} addonAfter={currentAmountUnitSelect} />
          </Form.Item>
        )}
        <Form.Item
          label="生产日期"
          name="produceTime"
          initialValue={
            rowData?.produceTime && moment(rowData.produceTime, 'YYYY-MM-DD')
          }
          rules={[
            {
              required: true,
              message: '请选择生产日期',
            },
            ({ getFieldValue, validateFields, isFieldValidating }) => ({
              validator: (_, value) => {
                const purchaseTime = getFieldValue('purchaseTime');
                if (purchaseTime && value.isAfter(purchaseTime, 'day')) {
                  return Promise.reject(
                    new Error('生产日期不能在进货日期之后')
                  );
                }
                if (purchaseTime && !isFieldValidating(['purchaseTime'])) {
                  validateFields(['purchaseTime']);
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="保质期"
          name="shelfLife"
          initialValue={rowData?.shelfLife || 0}
          rules={[
            {
              required: true,
              message: '请输入保质期',
            },
          ]}
        >
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            addonAfter={shelfLifeUnitSelect}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default React.memo(_Modal);
