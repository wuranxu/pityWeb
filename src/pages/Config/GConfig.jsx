import {PageContainer} from '@ant-design/pro-layout';
import {Badge, Button, Card, Col, Divider, Input, Modal, Row, Select, Switch, Table, Tag} from 'antd';
import React, {useEffect, useState} from 'react';
import {connect} from 'umi';

import {PlusOutlined} from '@ant-design/icons';
import FormForModal from '@/components/PityForm/FormForModal';
import CodeEditor from '@/components/Postman/CodeEditor';
import {vs2015} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";
import UserLink from "@/components/Button/UserLink";

const {Option} = Select;
const GConfig = ({gconfig, user, loading, dispatch}) => {
  const {data, envList, key_type, envMap, modal, currentEnv, name, pagination} = gconfig;
  const {userMap} = user;
  const [record, setRecord] = useState({id: 0, key_type: 0});
  const [language, setLanguage] = useState(0);

  const getType = () => {
    if (language === 1) {
      return 'json';
    }
    if (language === 2) {
      return 'yaml';
    }
    return 'text';
  };

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
      render: (text, record) => {
        if (record.key_type === 0) {
          return text;
        }
        if (record.key_type === 1) {
          return <a onClick={() => {
            Modal.info({
              title: `${record.key}`,
              width: 500,
              bodyStyle: {padding: -12},
              content: <SyntaxHighlighter language="json" style={vs2015}>{record.value}</SyntaxHighlighter>
            })
          }}>查看</a>
        }
        // yaml
        if (record.key_type === 2) {
          return <a onClick={() => {
            Modal.info({
              title: `${record.key}`,
              width: 500,
              bodyStyle: {padding: -12},
              content: <SyntaxHighlighter language="yaml" style={vs2015}>{record.value}</SyntaxHighlighter>
            })
          }}>查看</a>
        }
      }
    },
    {
      title: '是否可用',
      dataIndex: 'enable',
      key: 'enable',
      render: text => <Badge status={text ? 'processing' : 'default'} text={text ? '使用中' : '已禁止'}/>,
    },
    {
      title: "创建人",
      key: "create_user",
      render: (_, record) => <UserLink user={userMap[record.create_user.toString()]}/>
    },
    {
      title: '操作',
      key: 'operation',
      render: (_, record) => <>
        <a onClick={() => {
          save({modal: true})
          setRecord(record);
          setLanguage(record.key_type);
        }}>编辑</a>
        <Divider type='vertical'/>
        <a onClick={() => {
          dispatch({type: 'gconfig/deleteGConfig', payload: {id: record.id}})
        }}>删除</a>
      </>,
    },
  ];

  const fields = [
    {
      name: 'key_type',
      label: '类型',
      required: true,
      component: <Select onSelect={e => {
        setLanguage(e);
      }
      }>
        <Option value={0}>String</Option>
        <Option value={1}>JSON</Option>
        <Option value={2}>YAML</Option>
      </Select>,
      type: 'select',
    },
    {
      name: 'key',
      label: 'key',
      required: true,
      type: 'input',
      placeholder: '请输入key',
    },
    {
      name: 'value',
      label: 'value',
      required: true,
      component: <CodeEditor language={getType()} theme='vs-dark' height={250} options={{lineNumbers: 'off'}}/>,
    },
    {
      name: 'enable',
      label: '是否可用',
      required: true,
      component: <Switch/>,
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

  const fetchUserList = () => {
    dispatch({
      type: 'user/fetchUserList',
    });
  }

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
    fetchUserList()
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
  };

  const save = data => {
    dispatch({
      type: 'gconfig/save',
      payload: data,
    });
  };

  return (
    <PageContainer title='全局变量' breadcrumb={null}>
      <Card>
        <FormForModal fields={fields} visible={modal} left={4} right={20} onFinish={onFinish}
                      onCancel={() => {
                        save({modal: false});
                      }} title='编辑变量' record={record} width={600} offset={-60}/>
        <Row gutter={[8, 8]}>
          <Col span={12}>
            当前环境:
            <Select value={currentEnv} style={{width: 180, marginLeft: 16}} onChange={e => {
              save({currentEnv: e});
            }}>
              <Option value={0}>全部</Option>
              {
                envList.map(v => <Option value={v.id}>{v.name}</Option>)
              }
            </Select>
            <Button style={{marginLeft: 16}} type='primary'
                    onClick={() => {
                      save({modal: true});
                    }}><PlusOutlined/>添加变量</Button>
          </Col>
          <Col span={6}/>
          <Col span={6}>
            <Input placeholder='请输入key' value={name} onChange={e => {
              save({name: e.target.value});
            }}/>
          </Col>
        </Row>
        <Row style={{marginTop: 12}}>
          <Col span={24}>
            <Table dataSource={data} columns={columns} pagination={pagination} rowKey={record => record.id}
                   loading={loading.effects['gconfig/fetchGConfig']} onChange={pg => {
              save({pagination: pg});
            }}/>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default connect(({gconfig, user, loading}) => ({
  gconfig, user,
  loading,
}))(GConfig);
