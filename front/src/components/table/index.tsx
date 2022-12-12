/**
 * <Table
 *   // 配置ref用于调用父组件方法获取数据
 *   ref={tableRef}
 *
 *   // getData 接口函数获取数据，必须返回一个axios Promise 同时处理好数据
 *   getTableData={getData}
 *
 *   columns={tableColumns}
 * />
 */

import React, { FC, useEffect } from 'react';
import './style.scss';
import { message, Table } from 'antd';
import type { TableProps } from 'antd';
import { AxiosPromise } from 'axios';
import useKeepState from 'use-keep-state';
import Toolbar from './Toolbar';
import useDebounceFn from '@/hooks/useDebounceFn';

interface Props extends TableProps<any> {
  getTableData: (data: any, headers?: any) => Promise<Record<string, any>>;
  onTableChange?: (pagination: any, filters: any, sorter: any) => void;
  onDelete?: (id: string) => AxiosPromise;
  onAdd?: () => void;
  toolbar?: React.ReactChild;
  [key: string]: any;
}

interface State {
  tableHeight: number;
  tableDataSource: any[];
  isLoading: boolean;
  pagination: Record<string, any>;
  selectedRowKeys: string[];
  columns: any[];
}

const DEFAULT_PAGE_SIZE = 50;

const initialState: State = {
  tableHeight: 0,
  tableDataSource: [],
  isLoading: false,
  pagination: {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    showSizeChanger: true,
    total: 0,
    pageSizeOptions: ['30', '50', '70', '100', '200'],
  },
  selectedRowKeys: [],
  columns: [],
};

function showTotal(total: number) {
  return `共有 ${total} 条`;
}

const TableFC: FC<Props> = ({
  getTableData,
  onTableChange,
  onDelete,
  onAdd,
  forwardedRef: tableRef,
  columns,
  toolbar,
  ...props
}) => {
  let rowSelection;
  const showRowSelection = onDelete;
  const [state, setState] = useKeepState(initialState);

  const { run: getData } = useDebounceFn(
    (headers = {}) => {
      setState({ isLoading: true });
      const { page, pageSize } = tableRef.current;
      // 调用父组件函数获取数据
      getTableData({
        page,
        pageSize,
      }, headers)
        .then(res => {
          if(res.code === -1) {
            message.error(res.msg);
            return;
          }
          setState({
            pagination: {
              ...state.pagination,
              total: res.data.count,
              pageSize,
            },
            tableDataSource: res.data.rows,
          });
        })
        .finally(() => {
          setState({ isLoading: false });
        });
    },
    { wait: 500, leading: true }
  );

  function onChange(pagination: any, filters: any, sorter: any) {
    const page = pagination.current;
    const pageSize = pagination.pageSize;
    setState({
      pagination: {
        ...state.pagination,
        page,
        pageSize,
      },
    });
    tableRef.current.page = page;
    tableRef.current.pageSize = pageSize;
    onTableChange?.(pagination, filters, sorter);
    setTimeout(() => {
      getData();
    });
  }

  useEffect(() => {
    if (!tableRef.current) {
      tableRef.current = {};
    }
    // 新增方法给父组件调用
    tableRef.current.getTableData = getData;
  });

  useEffect(() => {
    tableRef.current.page = 1;
    tableRef.current.pageSize = DEFAULT_PAGE_SIZE;
  }, [tableRef]);

  useEffect(() => {
    // 设置表格的高度
    setTimeout(() => {
      const tableEl = document.querySelector('.ant-table-wrapper');
      if (tableEl) {
        setState({ tableHeight: parseInt(getComputedStyle(tableEl).height) - 120 });
      }
    }, 500);
  }, []);

  useEffect(() => {
    if (Array.isArray(columns)) {
      setState({
        columns: [
          {
            title: '序号',
            width: 60,
            render: (_: any, $: any, i: number) => i + 1,
            align: 'center',
          },
        ].concat(columns as []),
      });
    }
  }, [columns]);

  function handleDelete() {
    if (!onDelete) return null;
    const selectedRowKeys = state.selectedRowKeys.join(',');
    onDelete(selectedRowKeys).then(() => {
      setState({ selectedRowKeys: [] });
      getData();
    });
  }

  if (showRowSelection) {
    rowSelection = {
      onChange(selectedRowKeys: string[]) {
        setState({ selectedRowKeys });
      },
    };
  }

  return (
    <React.Fragment>
      <Toolbar
        selectedRowKeys={state.selectedRowKeys}
        toolbar={toolbar}
        onDelete={onDelete && handleDelete}
        onAdd={onAdd}
      />

      <Table
        {...(props as any)}
        rowKey="id"
        loading={state.isLoading}
        columns={state.columns}
        dataSource={state.tableDataSource}
        scroll={{ y: state.tableHeight + 'px', x: 1200 }}
        showHeader={state.tableDataSource.length}
        onChange={onChange}
        rowSelection={rowSelection}
        pagination={{
          ...state.pagination,
          size: 'small',
          showTotal,
        }}
      />
    </React.Fragment>
  );
};

const forwardedTable = React.forwardRef((props: any, ref) => (
  <TableFC {...props} forwardedRef={ref} />
));

export default React.memo(forwardedTable);
