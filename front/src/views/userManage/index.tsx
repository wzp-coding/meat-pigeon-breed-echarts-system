/**
 * 活动清单
 */
import { useEffect, useRef } from 'react'
import useKeepState from 'use-keep-state'
import Table from '@/components/table'
import FormModal from './formModal'
import { serviceGetUserList, serviceDeleteUser } from '@/services'
import { Button, Form, Popconfirm } from 'antd'

interface State {
  showModal: boolean
  currentRowData: Record<string, any> | null
}

const initState: State = {
  showModal: false,
  currentRowData: null
}

const UserList = () => {
  const [form] = Form.useForm()
  const [state, setState] = useKeepState(initState)
  const tableRef = useRef<any>()
  const tableColumns = [
    {
      title: '账号',
      dataIndex: 'account',
      width: 140
    },
    {
      title: '用户名',
      dataIndex: 'name',
      width: 140
    },
    {
      title: '手机',
      dataIndex: 'phone',
      width: 140
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 140
    },
    {
      title: '操作',
      width: 140,
      fixed: 'right',
      render: (row: any) => (
        <>
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
      )
    }
  ]

  function initParams() {
    form.resetFields()
    tableRef?.current?.getTableData()
  }

  function toggleModal() {
    setState({ showModal: !state.showModal })
  }

  const handleSuccess = function() {
    toggleModal()
    tableRef.current.getTableData()
  }

  function handleActionButton(buttonType: number, row: any) {
    switch (buttonType) {
      // 编辑
      case 0:
        setState({ showModal: true, currentRowData: row })
        break
      // 删除
      case 1:
        serviceDeleteUser(row.id)
        .then(res => {
          tableRef.current.getTableData()
        })
        break
      default:
    }
  }

  useEffect(() => {
    initParams()
  }, [])

  return (
    <div className="today-task">
      <Table
        ref={tableRef}
        getTableData={serviceGetUserList}
        columns={tableColumns}
        onAdd={() => setState({
          showModal: true,
          currentRowData: null
        })}
      />

      <FormModal
        visible={state.showModal}
        onSuccess={handleSuccess}
        onCancel={toggleModal}
        rowData={state.currentRowData}
      />
    </div>
  )
}

export default UserList
