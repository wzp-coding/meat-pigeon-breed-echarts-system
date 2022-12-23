import { useEffect, useRef, useState } from 'react';
import useKeepState from 'use-keep-state';
import Table from '@/components/table';
import FormModal from './formModal';
import DetailModal from './detailModal';
import { serviceGetPigeonHouseList, serviceDeletePigeonHouse } from '@/services';
import { Button, Form, Popconfirm, Tag } from 'antd';
import Search from 'antd/lib/input/Search';
import FeedModal from './feedModal';
import moment from 'moment';

interface State {
  showModal: boolean;
  showDetailModal: boolean;
  showFeedModal: boolean;
  currentRowData: Record<string, any> | null;
}

const initState: State = {
  showModal: false,
  showDetailModal: false,
  showFeedModal: false,
  currentRowData: null,
};

const getCleanTag = (days: number) => {
  if(days <= 0) {
    return (<Tag color="warning">请及时清洁</Tag>)
  }else if(days === 1) {
    return (<Tag color="success">明天清洁</Tag>)
  }else if(days === 2) {
    return (<Tag color="success">后天清洁</Tag>)
  }else {
    return (<Tag color="success">{days}天后清洁</Tag>)
  }
}

const getFeedTag = (hour: number) => {
  if(hour <= 0) {
    return (<Tag color="warning">请及时喂养</Tag>)
  } else {
    return (<Tag color="success">{hour}小时后喂养</Tag>)
  }
}

const PigeonHouseList = () => {
  const [form] = Form.useForm();
  const [state, setState] = useKeepState(initState);
  const tableRef = useRef<any>();
  const [keywords, setKeywords] = useState('');

  const tableColumns = [
    {
      title: '鸽舍名',
      dataIndex: 'name',
      width: 80,
    },
    {
      title: '上次清洁时间',
      dataIndex: 'lastCleanTime',
      width: 120,
    },
    {
      title: '上次投喂时间',
      dataIndex: 'lastFeedTime',
      width: 120,
    },
    {
      title: '清洁间隔(天)',
      dataIndex: 'cleanGap',
      width: 100,
      render: (value: number, row: any) => {
        const alreadyDays = moment().diff(row.lastCleanTime, 'days');
        const leaveDays = value - alreadyDays;
        return <div>{value}&nbsp;{getCleanTag(leaveDays)}</div>
      }
    },
    {
      title: '投喂间隔(小时)',
      dataIndex: 'feedGap',
      width: 100,
      render: (value: number, row: any) => {
        const alreadyHours = moment().diff(row.lastFeedTime, 'hours');
        const leaveHours = value - alreadyHours;
        return <div>{value}&nbsp;{getFeedTag(leaveHours)}</div>
      }
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (row: any) => (
        <>
          <Button type="primary" onClick={handleActionButton.bind(null, 3, row)}>投喂</Button>
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

  const toggleFeedModal = () => {
    setState({ showFeedModal: !state.showFeedModal });
  };

  const handleSuccess = () => {
    toggleModal();
    tableRef.current.getTableData({ keywords }, { successAlert: false });
  };

  const handleFeedSuccess = () => {
    toggleFeedModal();
    tableRef.current.getTableData({ keywords }, { successAlert: false });
  }

  const handleActionButton = (buttonType: number, row: any) => {
    switch (buttonType) {
      // 编辑
      case 0:
        setState({ showModal: true, currentRowData: row });
        break;
      // 删除
      case 1:
        serviceDeletePigeonHouse(row.id).then(res => {
          tableRef.current.getTableData({ keywords }, { successAlert: false });
        });
        break;
      // 详情
      case 2:
        setState({ showDetailModal: true, currentRowData: row });
        break;
      // 投喂
      case 3:
        setState({ showFeedModal: true, currentRowData: row });
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
        getTableData={serviceGetPigeonHouseList}
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
            placeholder="请输入鸽舍名"
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
      <FeedModal
        visible={state.showFeedModal}
        onSuccess={handleFeedSuccess}
        onCancel={toggleFeedModal}
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

export default PigeonHouseList;
