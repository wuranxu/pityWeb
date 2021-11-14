import {PageContainer} from "@ant-design/pro-layout";
import {connect} from 'umi';
import {Badge, Button, Card, Col, Divider, Form, Input, Row, Select, Table, Tag, Tooltip} from "antd";
import React, {useEffect} from "react";
import {CONFIG} from "@/consts/config";
import {PlusOutlined} from "@ant-design/icons";
import TestPlanForm from "@/components/TestCase/TestPlanForm";

const {Option} = Select;

const TestPlan = ({testplan, dispatch, loading, gconfig, user, project}) => {

  const {planData} = testplan;
  const {userList, userMap} = user;
  const {projectsMap, projects} = project;
  // form查询条件
  const [form] = Form.useForm();

  const getStatus = record => {
    if (record.state === 2) {
      return <Tooltip title="定时任务可能添加失败, 请尝试重新添加"><Badge status="error" text="出错"/></Tooltip>
    }
    if (record.state === 3) {
      return <Tooltip title="任务已暂停"><Badge status="warning" text="已暂停"/></Tooltip>
    }
    if (record.state === 1) {
      return <Tooltip title="任务正在执行中"><Badge status="processing" text="执行中"/></Tooltip>
    }
    return <Tooltip title={`下次运行时间: ${record.next_run}`}>
      <Badge status="success" text="等待中"/>
    </Tooltip>
  }

  const onSave = data => {
    dispatch({
      type: 'testplan/save',
      payload: data
    })
  }

  const onEdit = record => {
    onSave({
      visible: true,
      currentStep: 0,
      title: `编辑测试计划: ${record.name}`,
      planRecord: {
        ...record,
        msg_type: record.msg_type === '' ? [] : record.msg_type.split(","),
        receiver: record.receiver === '' ? [] : record.receiver.split(",").map(v => parseInt(v, 10)),
        env: record.env === '' ? [] : record.env.split(",").map(v => parseInt(v, 10)),
        case_list: record.case_list === '' ? [] : record.case_list.split(",").map(v => `testcase_${v}`),
      },

    })
  }
  const fetchTestPlan = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'testplan/listTestPlan',
      payload: {
        page: 1,
        size: 10,
        ...values,
      }
    })
  }

  const onDelete = async id => {
    const res = await dispatch({
      type: 'testplan/deleteTestPlan',
      payload: {id}
    })
    if (res) {
      fetchTestPlan();
    }
  }

  const columns = [
    {
      title: '项目',
      key: 'project_id',
      dataIndex: 'project_id',
      render: projectId => <a href={`/#/apiTest/project/${projectId}`}
                              target="_blank" rel="noreferrer">{projectsMap[projectId] || 'loading'}</a>
    },
    {
      title: '测试计划',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: '优先级',
      key: 'priority',
      dataIndex: 'priority',
      render: priority => <Tag color={CONFIG.CASE_TAG[priority]}>{priority}</Tag>
    },
    {
      title: 'cron表达式',
      key: 'cron',
      dataIndex: 'cron',
    },
    {
      title: '顺序执行',
      key: 'ordered',
      dataIndex: 'ordered',
      render: bool => bool ? <Tag color="blue">是</Tag> : <Tag>否</Tag>
    },
    {
      title: '用例数量',
      key: 'case_list',
      dataIndex: 'case_list',
      render: caseList => caseList.split(",").length,
    },
    {
      title: '状态',
      key: 'next_run',
      dataIndex: 'next_run',
      render: (_, record) => getStatus(record)
    },
    {
      title: '创建人',
      key: 'create_user',
      dataIndex: 'create_user',
      // eslint-disable-next-line camelcase
      render: create_user => userMap[create_user] !== undefined ? userMap[create_user].name : '加载中...'
    },
    {
      title: '操作',
      key: 'ops',
      render: (_, record) => <>
        <a onClick={() => {
          onEdit(record)
        }}>编辑</a>
        <Divider type="vertical"/>
        <a onClick={async () => {
          await onDelete(record.id)
        }}>删除</a>
      </>
    },


  ]


  const spin = loading.effects['testplan/listTestPlan'] || loading.effects['project/listProject']


  const fetchProjectList = () => {
    dispatch({
      type: 'project/listProject',
    })
  }

  const fetchUsers = () => {
    if (userList.length === 0) {
      dispatch({
        type: 'user/fetchUserList',
      })
    }
  }

  const fetchEnvList = () => {
    dispatch({
      type: 'gconfig/fetchEnvList',
      payload: {
        page: 1,
        size: 1000,
        exactly: true // 全部获取
      }
    })
  }


  useEffect(() => {
    fetchEnvList()
    fetchUsers()
    fetchProjectList()
    fetchTestPlan()
  }, [])

  return (
    <PageContainer title={false} breadcrumb={false}>
      <Card>
        <TestPlanForm fetchTestPlan={fetchTestPlan}/>
        <Form form={form} {...CONFIG.LAYOUT} onValuesChange={() => {
          fetchTestPlan();
        }}>
          <Row gutter={[12, 12]}>
            <Col span={6}>
              <Form.Item label="项目" name="project_id">
                <Select allowClear showSearch placeholder="选择项目">
                  {projects.map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="名称" name="name">
                <Input placeholder="输入测试计划名称"/>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="优先级" name="priority">
                <Select placeholder="选择优先级" allowClear>
                  {CONFIG.PRIORITY.map(v => <Option key={v} value={v}>{v}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="创建人" name="state">
                <Select placeholder="选择创建人" showSearch allowClear>
                  {userList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row style={{marginBottom: 12}}>
          <Button type="primary" onClick={() => {
            onSave({visible: true, title: '新增测试计划', planRecord: {}, currentStep: 0,})
          }}><PlusOutlined/> 添加计划</Button>
        </Row>
        <Table columns={columns} dataSource={planData} rowKey={row => row.id} loading={spin}/>
      </Card>
    </PageContainer>
  )
}


export default connect(({testplan, project, user, loading, gconfig}) => ({
  testplan,
  project,
  loading,
  user,
  gconfig,
}))(TestPlan);
