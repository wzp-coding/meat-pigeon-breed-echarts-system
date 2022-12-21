import NumberRange from '@/components/number-range';
import { Button, Col, Collapse, DatePicker, Form, Row, Select } from 'antd';
import React from 'react';
import { CATEGORY_LIST, Conditions } from './const';
import { useSetState } from 'ahooks';
import { clearEmptyObject } from '@/utils';

const { Panel } = Collapse;

interface Props {
  onSearch: (conditions: Conditions) => void;
  onClear: (conditions: Conditions) => void;
}

const initialState: Conditions = {
  categeory: '',
  puchaseTime: [],
  produceTime: [],
  purchaseAmount: [],
  currentAmount: [],
  shelfLife: [],
};
const Condition: React.FC<Props> = ({ onSearch, onClear }) => {
  const [form] = Form.useForm();
  const [conditions, setConditions] = useSetState(initialState);
  const handleSubmitForm = async () => {
    const values: Conditions = await form.validateFields();
    onSearch(clearEmptyObject(values));
  };

  const handleClearForm = async () => {
    form.resetFields();
    const values: Conditions = await form.validateFields();
    onClear(clearEmptyObject(values));
  };

  const rangeValidator = (_: any, value: number[]) => {
    if (value && value[0] > value[1]) {
      return Promise.reject(new Error('请输入合法的范围'));
    }
    return Promise.resolve();
  };

  return (
    <Collapse bordered={false} expandIcon={() => ''}>
      <Panel header={<a>高级搜索</a>} key="condition" >
        <Form
          form={form}
          preserve={false}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="种类" name="category">
                <Select options={CATEGORY_LIST} placeholder="请选择饲料种类" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="进货日期" name="purchaseTime">
                <DatePicker.RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="生产日期" name="produceTime">
                <DatePicker.RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                label="进货量"
                name="purchaseAmount"
                rules={[
                  {
                    validator: rangeValidator,
                  },
                ]}
              >
                <NumberRange
                  onChange={values => setConditions({ purchaseAmount: values })}
                  unit="g"
                  defaultValues={[]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="当前存量"
                name="currentAmount"
                rules={[
                  {
                    validator: rangeValidator,
                  },
                ]}
              >
                <NumberRange
                  onChange={values => setConditions({ currentAmount: values })}
                  unit="g"
                  defaultValues={[]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="保质期"
                name="shelfLife"
                rules={[
                  {
                    validator: rangeValidator,
                  },
                ]}
              >
                <NumberRange
                  onChange={values => setConditions({ shelfLife: values })}
                  unit="天"
                  defaultValues={[]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right'}}>
              <Button type="primary" onClick={handleSubmitForm}>
                搜索
              </Button>
              <Button onClick={handleClearForm} style={{ margin: '0 45px 0 15px'}}>清空</Button>
            </Col>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default Condition;
