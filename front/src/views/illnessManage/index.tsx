import { useEffect, useRef, useState } from 'react';
import useKeepState from 'use-keep-state';
import Table from '@/components/table';
import FormModal from './formModal';
import DetailModal from './detailModal';
import { serviceGetIllnessList, serviceDeleteIllness } from '@/services';
import { Button, Form, Popconfirm } from 'antd';
import Search from 'antd/lib/input/Search';

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

const IllnessList = () => {
  const [form] = Form.useForm();
  const [state, setState] = useKeepState(initState);
  const tableRef = useRef<any>();
  const [keywords, setKeywords] = useState('');

  const tableColumns = [
    {
      title: '疾病名称',
      dataIndex: 'name',
      width: 50,
    },
    {
      title: '症状描述',
      dataIndex: 'description',
      width: 140,
      ellipsis: true,
    },
    {
      title: '治疗方法',
      dataIndex: 'treatment',
      width: 140,
      ellipsis: true,
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
    tableRef.current.getTableData({ keywords }, { successAlert: false });
  };

  const handleActionButton = (buttonType: number, row: any) => {
    switch (buttonType) {
      // 编辑
      case 0:
        setState({ showModal: true, currentRowData: row });
        break;
      // 删除
      case 1:
        serviceDeleteIllness(row.id).then(res => {
          tableRef.current.getTableData({ keywords }, { successAlert: false });
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
    tableRef.current.getTableData({ keywords });
  };

  useEffect(() => {
    initParams();
  }, []);

  const onPaginationChange = () => {
    tableRef.current.getTableData({ keywords });
  }

  return (
    <div className="today-task">
      <Table
        ref={tableRef}
        getTableData={serviceGetIllnessList}
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
            placeholder="请输入疾病名称/症状描述/治疗方法"
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
        rowData={state.currentRowData}
      />
    </div>
  );
};

export default IllnessList;
