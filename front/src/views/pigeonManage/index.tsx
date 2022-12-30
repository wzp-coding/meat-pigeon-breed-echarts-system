import { useEffect, useRef, useState } from 'react';
import useKeepState from 'use-keep-state';
import Table from '@/components/table';
import FormModal from './formModal';
import DetailModal from './detailModal';
import { serviceGetPigeonList, serviceDeletePigeon } from '@/services';
import { Button, Form, Popconfirm, Tag, TagProps } from 'antd';
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

const getStandardTag = (range: string, value: number) => {
  const [min, max] = range.split('~');
  if(value < +min) {
    return <Tag color='error'>未达标</Tag>
  }else if(value <= +max) {
    return <Tag color='success'>达标</Tag>
  }else {
    return <Tag color='warning'>超标</Tag>
  }
}

const PigeonCategoryList = () => {
  const [form] = Form.useForm();
  const [state, setState] = useKeepState(initState);
  const tableRef = useRef<any>();
  const [keywords, setKeywords] = useState('');

  const tableColumns = [
    {
      title: '肉鸽编号',
      dataIndex: 'pigeonId',
      width: 80,
    },
    {
      title: '种类',
      dataIndex: ['categoryInfo', 'category'],
      width: 80,
    },
    {
      title: '鸽舍',
      dataIndex: ['houseInfo', 'name'],
      width: 80,
    },
    {
      title: '饲养天数',
      dataIndex: 'feedDays',
      width: 80,
    },
    {
      title: '喂养次数',
      dataIndex: 'feedCount',
      width: 80,
    },
    {
      title: '体重(g)',
      dataIndex: 'weight',
      width: 80,
    },
    {
      title: '产卵(个）',
      dataIndex: 'eggs',
      width: 80,
      render: (value: number, row: PigeonType.Data) => {
        const months = row.feedDays / 30 | 0;
        const standardTag = getStandardTag(row.categoryInfo.yearEggs, (value / months | 0) * 12);
        return <div>{value}&nbsp;{standardTag}</div>;
      }
    },
    {
      title: '健康状况',
      dataIndex: 'health',
      width: 80,
      render: (_: any, row: any) => {
        if (row.illnesses.length) {
          return <Tag color='error'>亚健康</Tag>;
        }
        return <Tag color='success'>健康</Tag>;
      },
    },
    {
      title: '饲养情况',
      dataIndex: 'isFinished',
      width: 80,
      render: (value: any) => {
        if(value) {
          return <Tag color='success'>已完成</Tag>
        }
        return <Tag color='warning'>饲养中</Tag>
      },
    },
    {
      title: '操作',
      width: 150,
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
        serviceDeletePigeon(row.id).then(res => {
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
  };

  return (
    <div className="today-task">
      <Table
        ref={tableRef}
        getTableData={serviceGetPigeonList}
        columns={tableColumns}
        onPaginationChange={onPaginationChange}
        onAdd={() =>
          setState({
            showModal: true,
            currentRowData: null,
          })
        }
        toolbar={
          <Search
            style={{ width: 400 }}
            placeholder="请输入鸽子编号/鸽舍名/种类名"
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

export default PigeonCategoryList;
