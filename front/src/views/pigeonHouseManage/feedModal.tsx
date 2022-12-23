import React, { useEffect, useMemo, useRef, useState } from 'react';
import { serviceGetFeedListByGroup, servicePostFeedPigeon } from '@/services';
import {
  Modal,
  Form,
  Button,
  Space,
  Select,
  InputNumber,
  Tag,
  Alert,
  Divider,
  message,
  DatePicker,
} from 'antd';
import { trimObjectValue } from '@/utils';
import { useSetState } from 'ahooks';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
type Props = {
  visible: boolean;
  rowData: Record<string, any>;
  onSuccess: () => void;
  onCancel: () => void;
};

const initialState = {
  confirmLoading: false,
};

const tagOptions = {
  willExpired: (days: number) => {
    if (days <= 3) {
      return <Tag color="warning">还有{days}天过期</Tag>;
    }
    return <Tag color="success">{days}天内过期</Tag>;
  },
  expired: <Tag color="error">已过期</Tag>,
};

const _Modal: React.FC<Props> = function ({
  visible,
  onSuccess,
  onCancel,
  rowData,
}) {
  const [form] = Form.useForm();
  const [state, setState] = useSetState(initialState);

  const handleSubmitForm = async () => {
    try {
      setState({ confirmLoading: true });
      const values = await form.validateFields();
      const params = trimObjectValue(values);
      params.lastFeedTime = params.lastFeedTime.format(
        'YYYY-MM-DD HH:mm:ss'
      )
      if (!params.feeds) {
        message.warning('请添加饲料');
        return;
      }
      servicePostFeedPigeon({
        houseId: rowData.id,
        ...params,
      })
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
  const calcLeaveDays = (produceTime: string, shelfLife: number) => {
    const alreadyDays = moment().diff(produceTime, 'days');
    return shelfLife - alreadyDays;
  };

  const [optionsData, setOptionsData] = useState([]);
  const [selectOptionsOpen, setSelectOptionsOpen] = useState(false);

  /** 1. 过滤已过期的饲料
   *  2. 禁用已经选中的饲料
   */
  const feedsOptions = useMemo(() => {
    const values = form.getFieldsValue();
    const selectIds = values.feeds?.map((item: any) => item && item.id) || [];
    return optionsData.map((item: any) => ({
      ...item,
      options: item.options
        .filter(
          (item2: any) => calcLeaveDays(item2.produceTime, item2.shelfLife) > 0
        )
        .map((item2: any) => ({
          label: (
            <div>
              存量：{item2.currentAmount}g&nbsp;{item2.name}&nbsp;
              {tagOptions.willExpired(
                calcLeaveDays(item2.produceTime, item2.shelfLife)
              )}
            </div>
          ),
          value: item2.id,
          currentAmount: item2.currentAmount,
          disabled: selectIds.includes(item2.id),
        })),
    }));
  }, [optionsData, selectOptionsOpen]);

  const init = async () => {
    const { code, data = [], msg } = await serviceGetFeedListByGroup();
    if (code !== 1) {
      console.error(msg);
      return;
    }
    setOptionsData(data);
  };

  useEffect(() => {
    if(visible){
      init();
    }
  }, [visible]);

  const currentAmountArr = useRef<number[]>([]);
  const handleFeedChange = (option: any, index: number) => {
    const { currentAmount } = option;
    currentAmountArr.current[index] = currentAmount;
    form.validateFields();
  };

  return (
    <Modal
      width={600}
      title={'投喂'}
      visible={visible}
      onOk={handleSubmitForm}
      onCancel={onCancel}
      confirmLoading={state.confirmLoading}
      destroyOnClose
    >
      <Form
        name="dynamic_form_nest_item"
        form={form}
        autoComplete="off"
        preserve={false}
      >
        <Form.List name="feeds">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                return (
                  <Space
                    key={key}
                    style={{ display: 'flex', marginBottom: 8 }}
                    align="center"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'id']}
                      rules={[{ required: true, message: '请选择饲料' }]}
                    >
                      <Select
                        placeholder="请选择饲料"
                        style={{ width: 300 }}
                        options={feedsOptions}
                        onDropdownVisibleChange={open =>
                          setSelectOptionsOpen(open)
                        }
                        onChange={(_, option) => handleFeedChange(option, key)}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'amount']}
                      rules={[
                        { required: true, message: '请输入投喂量' },
                        {
                          validator: (_, value) => {
                            if (value > currentAmountArr.current[key]) {
                              return Promise.reject(new Error('存量不足'));
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        addonAfter={'g'}
                        placeholder="请输入投喂量"
                      />
                    </Form.Item>
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{ marginBottom: '28px' }}
                    />
                  </Space>
                );
              })}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  {fields.length < 1 ? '' : '继续'}添加饲料
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item
          label="投喂时间"
          name="lastFeedTime"
          rules={[
            {
              required: true,
              message: '请输入投喂时间',
            },
          ]}
        >
          <DatePicker showTime style={{ width: '100%' }} />
        </Form.Item>
      </Form>
      <Alert
        message={
          <a href="http://www.boqii.com/article/177959.html" target="_blank">
            配料推荐
          </a>
        }
        description={
          <div style={{ height: '200px', overflow: 'scroll' }}>
            <p>鸽子夏季饲料配方（多给饮水）：</p>
            <p>1）豌豆30%，玉米20%，大麦20%，绿豆10%，麻籽10%</p>
            <p>2）豌豆30%，绿豆30%，玉米20%，荞麦10%，麻籽10%</p>
            <Divider />
            <p>鸽子冬季饲料配方（饲料量加大）：</p>
            <p>1）玉米40%，豌豆20%，糙米10%，小麦10%，高粱10%，麻籽10%</p>
            <p>2）玉米40%，豌豆30%，糙米10%，高粱10%，麻籽10%</p>
            <p>3）麦子50%，玉米20%，豌豆15%，糙米5%，绿豆5%，花生5%</p>
            <Divider />
            <p>
              成年鸽日常饲料配比：玉米40％、小麦20％、豌豆10％、高梁10％、糙米10%、葵花籽8%、绿豆2%；
            </p>
            <p>
              幼鸽的日常饲料配比：玉米25％、豌豆15％、小麦15％、糙米10％、高梁10％、大麦10%、莱籽2％、绿豆3％、火麻子：5%、葵花籽5%
            </p>
          </div>
        }
        type="info"
      />
    </Modal>
  );
};

export default React.memo(_Modal);
