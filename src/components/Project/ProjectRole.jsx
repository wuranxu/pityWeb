import React, {useEffect, useState} from 'react';
import {Avatar, Button, List, Select, Popconfirm, Skeleton, Tag} from 'antd';
import {connect, useParams} from 'umi';
import conf from '@/consts/const';
import {PlusOutlined, DeleteTwoTone} from '@ant-design/icons';
import FormForModal from "@/components/EagleForm/FormForModal";
import NProgress from 'nprogress' // 引入nprogress插件
import 'nprogress/nprogress.css'  // 这个nprogress样式必须引入

const {Option} = Select;

const ProjectRole = ({user, dispatch, project, loading}) => {
  const params = useParams();
  const [modal, setModal] = useState(false);

  const onUpdateRole = (item, value) => {
    dispatch({
      type: 'project/updateRole',
      payload: {
        ...item,
        projRole: value,
      },
    })
  }

  const onFinish = (values) => {
    const info = {
      ...values,
      projectId: params.id,
    }
    dispatch({
      type: 'project/addRole',
      payload: info,
    })
    setModal(false);
  }

  const confirm = (item) => {
    dispatch({
      type: 'project/deleteRole',
      payload: item
    })
  }

  useEffect(() => {
    NProgress.start();
    dispatch({
      type: 'user/fetch'
    })
    dispatch({
      type: 'project/listProjectRole',
      payload: {
        projectId: params.id,
      }
    })
    NProgress.done();
  }, [])


  const {userMap, users} = user;

  const permission = (item) => {
    if (item.projRole === 'OWNER') {
      return [<Tag color='blue' size="large">负责人</Tag>];
    }
    return [
      <Select style={{width: 80}} value={conf.PROJECT_ROLE_TO_ID[item.projRole]} onChange={(data) => {
        onUpdateRole(item, data);
      }}>
        {
          Object.keys(conf.PROJECT_ROLE_MAP).map(key => <Option value={key}>{conf.PROJECT_ROLE_MAP[key]}</Option>)
        }
      </Select>,
      <Popconfirm
        title="确定要删除该角色吗?"
        onConfirm={() => {
          confirm(item)
        }}
        okText="确定"
        cancelText="取消"
      >
        <DeleteTwoTone twoToneColor="red" style={{cursor: 'pointer'}}/>
      </Popconfirm>
    ]
  }
  const opt = <Select placeholder="请选择用户">
    {
      users.map(item => <Option value={item.value}>{item.label}</Option>)
    }
  </Select>

  const roleList = <Select placeholder="请选择角色">
    {
      Object.keys(conf.PROJECT_ROLE_MAP).map(key => <Option value={key}>{conf.PROJECT_ROLE_MAP[key]}</Option>)
    }
  </Select>

  const fields = [
    {
      name: 'userId',
      label: '用户',
      required: true,
      component: opt,
      type: 'select'
    },
    {
      name: 'projRole',
      label: '角色',
      required: true,
      component: roleList,
      type: 'select'
    },
  ]

  const data = [
    {
      userId: project.projectData.owner,
      projRole: 'OWNER',
    },
    ...project.roles,
  ]

  return (
    <div>
      <FormForModal title="添加成员" left={6} right={18} width={500} record={{}} onFinish={onFinish} fields={fields}
                    onCancel={() => setModal(false)} visible={modal}
      />
      <div style={{marginBottom: 16}}>
        <Button size="small" type="primary" onClick={() => setModal(true)}><PlusOutlined/>添加成员</Button>
      </div>
      <div>
        <List
          itemLayout="horizontal"
          size="small"
          dataSource={data}
          loading={loading.effects['project/listProjectRole']}
          renderItem={item => (
            <List.Item actions={permission(item)}>
              <Skeleton avatar title={false} loading={item.loading} active>
                <List.Item.Meta
                  avatar={<Avatar
                    src={item.avatar || "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"}/>}
                  title={userMap[item.userId] ? userMap[item.userId].nickname : 'loading'}
                  description={userMap[item.userId] ? userMap[item.userId].email : 'loading'}/>
              </Skeleton>
            </List.Item>
          )}
        />
      </div>
    </div>
  )
}

export default connect(({project, user, loading}) => ({project, user, loading}))(ProjectRole);
