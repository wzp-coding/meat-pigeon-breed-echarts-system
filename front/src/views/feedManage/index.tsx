import { useEffect, useRef, useState } from 'react';
import { useSetState } from 'ahooks';
import Table from '@/components/table';
import FormModal from './formModal';
import DetailModal from './detailModal';
import { serviceGetFeedList, serviceDeleteFeed } from '@/services';
import { Button, Form, Popconfirm } from 'antd';
import Search from 'antd/lib/input/Search';
import Condition from './condition';
import { Conditions } from './const';

interface State {
  showModal: boolean;
  showDetailModal: boolean;
  currentRowData: Record<string, any> | null;
}

const initState: State = {
  showModal: false,
  showDetailModal: false,
  currentRowData: null,
};

const FeedList = () => {
  const [form] = Form.useForm();
  const [state, setState] = useSetState(initState);
  const tableRef = useRef<any>();
  const conditionsRef = useRef<Conditions>({});
  const [keywords, setKeywords] = useState('');

  const tableColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: 100,
    },
    {
      title: '种类',
      dataIndex: 'category',
      width: 100,
    },
    {
      title: '进货日期',
      dataIndex: 'purchaseTime',
      width: 60,
    },
    {
      title: '进货量(g)',
      dataIndex: 'purchaseAmount',
      width: 60,
    },
    {
      title: '当前存量(g)',
      dataIndex: 'currentAmount',
      width: 60,
    },
    {
      title: '生产日期',
      dataIndex: 'produceTime',
      width: 60,
    },
    {
      title: '保质期(天)',
      dataIndex: 'shelfLife',
      width: 60,
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      render: (row: any) => (
        <>
          <Button onClick={handleActionButton.bind(null, 2, row)}>详情</Button>
          <Button onClick={handleActionButton.bind(null, 0, row)}>编辑</Button>
          <Popconfirm
            title="您确定要删除吗？"
            onConfirm={handleActionButton.bind(null, 1, row)}
            placement="bottomLeft"
            okType="danger"
          >
            <Button danger>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const initParams = () => {
    form.resetFields();
    tableRef?.current?.getTableData();
  };

  const toggleModal = () => {
    setState({ showModal: !state.showModal });
  };

  const toggleDetailModal = () => {
    setState({ showDetailModal: !state.showDetailModal });
  };

  const handleSuccess = () => {
    toggleModal();
    tableRef.current.getTableData({...conditionsRef.current, keywords}, { successAlert: false });
  };

  const handleActionButton = (buttonType: number, row: any) => {
    switch (buttonType) {
      // 编辑
      case 0:
        setState({ showModal: true, currentRowData: row });
        break;
      // 删除
      case 1:
        serviceDeleteFeed(row.id).then(res => {
          tableRef.current.getTableData({...conditionsRef.current, keywords}, { successAlert: false });
        });
        break;
      // 详情
      case 2:
        setState({ showDetailModal: true, currentRowData: row });
        break;
      default:
    }
  };

  const onSearch = (keywords: string) => {
    setKeywords(keywords);
    tableRef.current.getTableData({ keywords, ...conditionsRef.current });
  };

  useEffect(() => {
    initParams();
  }, []);

  const onAdvanceSearch = (conditions: Conditions) => {
    conditionsRef.current = conditions;
    tableRef.current.getTableData({ keywords, ...conditionsRef.current });
  }
  const onAdvanceClear = (conditions: Conditions) => {
    conditionsRef.current = conditions;
    tableRef.current.getTableData({ keywords, ...conditionsRef.current });
  }
  const onPaginationChange = () => {
    tableRef.current.getTableData({ keywords, ...conditionsRef.current });
  }

  return (
    <div className="today-task">
      <Condition onSearch={onAdvanceSearch} onClear={onAdvanceClear}/>
      <Table
        ref={tableRef}
        getTableData={serviceGetFeedList}
        columns={tableColumns}
        onAdd={() =>
          setState({
            showModal: true,
            currentRowData: null,
          })
        }
        onPaginationChange={onPaginationChange}
        toolbar={
          <Search
            style={{ width: 400 }}
            placeholder="请输入饲料名称/饲料种类"
            onSearch={onSearch}
            enterButton
            allowClear
          />
        }
      />

      <FormModal
        visible={state.showModal}
        onSuccess={handleSuccess}
        onCancel={toggleModal}
        rowData={state.currentRowData}
      />
      <DetailModal
        visible={state.showDetailModal}
        onCancel={toggleDetailModal}
        rowData={state.currentRowData!}
      />
    </div>
  );
};

export default FeedList;
