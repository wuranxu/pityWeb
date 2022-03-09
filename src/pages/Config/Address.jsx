import React, {memo, useEffect} from 'react';
import {PageContainer} from "@ant-design/pro-layout";
import {connect} from "umi";
import {Card, Col, Divider, Form, Input, Row, Select, Table} from "antd";
import {CONFIG} from "@/consts/config";
import TooltipTextIcon from "@/components/Icon/TooltipTextIcon";

const {Option} = Select;

const Address = ({loading, gconfig, dispatch}) => {

  const [form] = Form.useForm();
  const {envList, envMap, addressList} = gconfig;

  const fetchEnvList = () => {
    dispatch({
      type: 'gconfig/fetchEnvList',
      payload: {
        page: 1,
        size: 1000,
        exactly: true
      }
    })
  }

  const fetchAddress = () => {
    const values = form.getFieldsValue()
    dispatch({
      type: 'gconfig/fetchAddress',
      payload: values,
    })
  }

  const isLoading = loading.effects['gconfig/fetchAddress'] || loading.effects['gconfig/fetchEnvList']

  useEffect(() => {
    fetchEnvList()
    fetchAddress()
  }, []);

  const columns = [
    {
      title: '环境',
      key: 'env',
      dataIndex: 'env',
      render: env => envMap[env],
    },
    {
      title: '地址名称',
      key: 'env',
      dataIndex: 'env',
      render: env => envMap[env],
    },
    {
      title: <TooltipTextIcon title="地址一般是服务的基础地址，比如https://api.baidu.com, 用例中的地址简写即可" text="地址"/>,
      key: 'host',
      dataIndex: 'host',
      render: text => <a href={text}>{text}</a>,
      ellipsis: true
    },
    {
      title: '操作',
      key: 'operation',
      render: (_, record) =>
        <>
          <a>编辑</a>
          <Divider type="vertical"/>
          <a>删除</a>
        </>

    }
  ]

  return (
    <PageContainer breadcrumb={null} title="请求地址管理">
      <Card>
        <Form form={form} {...CONFIG.LAYOUT} onValuesChange={fetchAddress}>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item label="环境" name="env">
                <Select allowClear showSearch placeholder="选择对应的环境">
                  {envList.map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="名称" name="name">
                <Input placeholder="输入对应的地址名称"/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="地址" name="url">
                <Input placeholder="输入对应的url"/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table columns={columns} loading={isLoading} rowKey={record => record.id} dataSource={addressList}/>
      </Card>
    </PageContainer>
  )
}

export default connect(({gconfig, user, loading}) => ({gconfig, user, loading}))(memo(Address));
