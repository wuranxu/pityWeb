import {PageContainer} from "@ant-design/pro-layout";
import {Button, Card, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Table, Tag} from "antd";
import {connect} from 'umi'
import React, {useEffect, useState} from 'react';
import {CONFIG} from "@/consts/config";
import {PlusOutlined} from "@ant-design/icons";
import PityPopConfirm from "@/components/Confirm/PityPopConfirm";

const {Option} = Select;

const Redis = ({gconfig, loading, dispatch}) => {

  const {envList, redisConfig, envMap} = gconfig;

  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState({});

  const fetchRedisConfig = () => {
    const value = form.getFieldsValue();
    dispatch({
      type: 'gconfig/fetchRedisConfig',
      payload: value
    })
  }

  const getEnv = () => {
    dispatch({
      type: 'gconfig/fetchEnvList',
      payload: {
      }
    })
  }

  const onDelete = async id => {
    const res = await dispatch({
      type: 'gconfig/deleteRedisConfig',
      payload: {
        id
      }
    })
    if (res) {
      fetchRedisConfig()
    }
  }

  useEffect(() => {
    fetchRedisConfig();
    getEnv();
  }, [])

  useEffect(() => {
    modalForm.resetFields();
    modalForm.setFieldsValue(record);
  }, [record])

  const columns = [
    {
      title: '环境',
      key: 'env',
      dataIndex: 'env',
      render: env => envMap[env],
    },
    {
      title: '名称',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '地址',
      key: 'addr',
      dataIndex: 'addr',
    },
    // {
    //   title: '用户名',
    //   key: 'username',
    //   dataIndex: 'username',
    // },
    {
      title: '密码',
      key: 'password',
      dataIndex: 'password',
    },
    {
      title: '类型',
      key: 'cluster',
      dataIndex: "cluster",
      render: cluster => cluster ? <Tag color="blue">集群</Tag> : <Tag color="green">实例</Tag>
    },
    {
      title: '操作',
      key: 'ops',
      render: (_, record) => <>
        <a onClick={() => {
          setRecord(record)
          setVisible(true)
        }}>编辑</a>
        <Divider type="vertical"/>
        <PityPopConfirm text="删除" title="你确定要删除该redis配置吗?" onConfirm={async () => {
          await onDelete(record.id)
        }}/>
      </>
    },
  ]

  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();

  const onFinish = async () => {
    const values = await modalForm.validateFields();
    let res;
    if (!record.id) {
      res = await dispatch({
        type: 'gconfig/insertRedisConfig',
        payload: {...values, db: values.db || 0},
      })
    } else {
      res = await dispatch({
        type: 'gconfig/updateRedisConfig',
        payload: {
          ...values,
          id: record.id,
          db: values.db || 0
        }
      })
    }
    if (res) {
      setVisible(false);
      fetchRedisConfig();
    }
  }

  return (
    <PageContainer title="Redis配置" breadcrumb={null}>
      <Card>
        <Form form={form} {...CONFIG.LAYOUT} onValuesChange={() => {
          fetchRedisConfig();
        }}>
          <Row gutter={[8, 8]}>
            <Col span={6}>
              <Form.Item label="环境" name="env">
                <Select placeholder="选择环境" allowClear>
                  {envList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="名称" name="name">
                <Input placeholder="输入redis名称"/>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="地址" name="addr">
                <Input placeholder="输入redis地址"/>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="类型" name="cluster">
                <Select placeholder="选择redis类型" allowClear>
                  <Option value={true}>集群</Option>
                  <Option value={false}>实例</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Button type="primary" style={{marginBottom: 8}} onClick={() => {
          setVisible(true);
          setRecord({});
        }}><PlusOutlined/>添加配置</Button>
        <Modal title="Redis配置" width={500} visible={visible} onCancel={() => setVisible(false)} onOk={onFinish}>
          <Form form={modalForm} initialValues={record} {...CONFIG.LAYOUT}>
            <Form.Item label="环境" name="env" rules={[
              {
                required: true,
                message: "请选择对应环境",
              }
            ]}>
              <Select placeholder="选择环境" allowClear>
                {envList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item label="redis名称" name="name" rules={[
              {
                required: true,
                message: "请输入对应redis名称",
              }
            ]}>
              <Input placeholder="输入redis名称"/>
            </Form.Item>
            <Form.Item label="地址" name="addr" rules={[
              {
                required: true,
                message: "输入redis连接地址，集群用英文逗号隔开",
              }
            ]}>
              <Input placeholder="输入redis连接地址, 集群用英文逗号隔开"/>
            </Form.Item>
            {/*<Form.Item label="用户名" name="username" rules={[*/}
            {/*  {*/}
            {/*    required: false,*/}
            {/*    message: "输入redis用户名",*/}
            {/*  }*/}
            {/*]}>*/}
            {/*  <Input placeholder="输入redis用户名"/>*/}
            {/*</Form.Item>*/}
            <Form.Item label="密码" name="password" rules={[
              {
                required: false,
                message: "输入redis密码",
              }
            ]}>
              <Input placeholder="输入redis密码"/>
            </Form.Item>
            <Form.Item label="db" name="db" rules={[
              {
                required: false,
                message: "输入redis密码",
              }
            ]}>
              <InputNumber placeholder="输入db，默认为0(集群不需要db)" style={{width: '100%'}}/>
            </Form.Item>
            <Form.Item label="类型" name="cluster" rules={[
              {
                required: true,
                message: "选择redis类型",
              }
            ]}>
              <Select placeholder="选择redis类型">
                <Option value={true}>集群</Option>
                <Option value={false}>实例</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        <Table columns={columns} dataSource={redisConfig} rowKey={record => record.id}
               loading={loading.effects['gconfig/listRedisConfig']}/>
      </Card>
    </PageContainer>
  )
}

export default connect(({gconfig, loading}) => ({gconfig, loading}))(Redis);
