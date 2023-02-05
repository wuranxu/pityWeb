import React, {useEffect} from 'react';
import {Badge, Table, Tag, Typography} from "antd";
import UserLink from "@/components/Button/UserLink";
import {connect} from "@umijs/max";

const {Text} = Typography;

const SqlHistory = ({dispatch, user, online, loading}) => {
  const {historyPage: pagination, historyData: data} = online;
  const {userMap} = user;

  useEffect(() => {
    if (Object.keys(userMap).length === 0) {
      dispatch({
        type: 'user/fetchUserList'
      })
    }
  }, [])

  const columns = [
    {
      title: '环境',
      key: 'env',
      render: (_, record) => <Tag>{record.database.env_info.name}</Tag>,
    },
    {
      title: '数据库',
      key: 'database',
      render: (_, record) => record.database.name
    },
    {
      title: 'SQL',
      dataIndex: 'sql',
      ellipse: true,
      render: sql => <Text copyable ellipsis={true}>{sql}</Text>
    },
    {
      title: '耗时',
      dataIndex: 'elapsed',
      render: elapsed => <Badge status={elapsed > 200 ? "error" : "success"} text={`${elapsed}ms`}/>
    },
    {
      title: '执行人',
      dataIndex: "create_user",
      render: user => <UserLink user={userMap[user]}/>
    },
    {
      title: '执行时间',
      dataIndex: "created_at"
    }
  ]

  const fetchData = () => {
    dispatch({
      type: 'online/fetchHistorySQL',
      payload: {
        page: pagination.current,
        size: pagination.pageSize,
      }
    })
  }

  useEffect(() => {
    fetchData()
  }, [pagination.current, pagination.pageSize])

  return (
    <Table size="small" columns={columns} pagination={pagination} dataSource={data}
           loading={loading.effects['online/fetchHistorySQL']}
           onChange={pg => {
             dispatch({
               type: 'online/save',
               payload: {
                 historyPage: {
                   ...pagination,
                   current: pg.current,
                   pageSize: pg.pageSize
                 }
               }
             })
           }} rowKey={record => record.id}/>
  )
}

export default connect(({user, loading, online}) => ({user, loading, online}))(SqlHistory)
