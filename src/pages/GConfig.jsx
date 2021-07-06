import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Divider, Input, Switch, Row, Tag, Pagination, Badge, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';

import { PlusOutlined } from '@ant-design/icons';
import FormForModal from '@/components/PityForm/FormForModal';

const { Option } = Select;
const GConfig = ({ gconfig, loading, dispatch }) => {
  const { data, envList, key_type, envMap, pagination } = gconfig;
  const [modal, setModal] = useState(false);
  const [currentEnv, setCurrentEnv] = useState(0);
  const [record, setRecord] = useState({ id: 0 });
  const [name, setName] = useState('');

  const columns = [
    {
      title: '环境',
      key: 'env',
      dataIndex: 'env',
      render: env => env === 0 ? <Tag color='blue'>全部</Tag> : <Tag>{envMap[env]}</Tag> || <Tag color='red'>未知</Tag>,
    },
    {
      title: 'key',
      dataIndex: 'key',
      key: 'keyword',
    },
    {
      title: '类型',
      dataIndex: 'key_type',
      key: 'key_type',
      render: key => key_type[key],
    },
    {
      title: 'value',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: '是否可用',
      dataIndex: 'enable',
      key: 'enable',
      render: text => <Badge status={text ? 'processing' : 'default'} text={text ? '使用中' : '已禁止'} />,
    },
    {
      title: '操作',
      key: 'operation',
      render: (_, record) => <>
        <a onClick={() => {
          setModal(true);
          setRecord(record);
        }}>编辑</a>
        <Divider type='vertical' />
        <a>删除</a>
      </>,
    },
  ];

  const fields = [
    {
      name: 'key',
      label: 'key',
      required: true,
      type: 'input',
    },
    {
      name: 'key_type',
      label: '类型',
      required: true,
      component: <Select>
        <Option value={0}>String</Option>
        <Option value={1}>JSON</Option>
        <Option value={2}>XML</Option>
      </Select>,
      type: 'select',
    },
    {
      name: 'value',
      label: 'value',
      required: true,
      component: <Input.TextArea />,
    },
    {
      name: 'enable',
      label: '是否可用',
      required: true,
      component: <Switch />,
      valuePropName: 'checked',
      initialValue: true,
    },
  ];

  const getEnvList = () => {
    dispatch({
      type: 'gconfig/fetchEnvList',
      payload: {
        page: 1,
        size: 10000,
      },
    });
  };

  const getConfig = async (page = pagination.current, size = pagination.pageSize) => {
    await dispatch({
      type: 'gconfig/fetchGConfig',
      payload: {
        page,
        size,
        env: currentEnv,
        key: name,
      },
    });
  };

  const initial = async () => {
    if (envList.length === 0) {
      getEnvList();
    }
    await getConfig();
  };

  useEffect(async () => {
    await initial();
  }, [currentEnv, name, pagination.current]);

  const onFinish = async values => {
    const params = {
      ...record,
      ...values,
      env: currentEnv,
    };
    if (record.id === 0) {
      dispatch({
        type: 'gconfig/insertConfig',
        payload: params,
      });
    } else {
      dispatch({
        type: 'gconfig/updateGConfig',
        payload: params,
      });
    }
    setModal(false);
    await getConfig();
  };

  return (
    <PageContainer title='全局变量'>
      <Card>
        <FormForModal
          fields={fields} visible={modal} left={4} right={20} onFinish={onFinish}
          onCancel={() => setModal(false)} title='编辑变量' record={record} width={600} />
        <Row gutter={[8, 8]}>
          <Col span={12}>
            当前环境:
            <Select value={currentEnv} style={{ width: 180, marginLeft: 16 }} onChange={e => setCurrentEnv(e)}>
              <Option value={0}>全部</Option>
              {
                envList.map(v => <Option value={v.id}>{v.name}</Option>)
              }
            </Select>
            <Button style={{ marginLeft: 16 }} type='primary'
                    onClick={() => setModal(true)}><PlusOutlined />添加变量</Button>
          </Col>
          <Col span={6} />
          <Col span={6}>
            <Input placeholder='请输入key' value={name} onChange={e => {
              setName(e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{ marginTop: 8 }}>
          <Col span={24}>
            <Table dataSource={data} columns={columns} pagination={pagination}
                   rowKey={record => record.id} loading={loading.effects['gconfig/fetchGConfig']}
                   onChange={pg => {
                     dispatch({
                       type: 'gconfig/save',
                       payload: { pagination: pg },
                     });
                   }} />
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default connect(({ gconfig, loading }) => ({
  gconfig: gconfig,
  loading: loading,
}))(GConfig);
