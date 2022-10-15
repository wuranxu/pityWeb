import {PageContainer} from '@ant-design/pro-layout';
import {Badge, Button, Card, Col, Divider, Input, Modal, Row, Select, Switch, Table, Tag} from 'antd';
import React, {useEffect, useState} from 'react';
import {connect} from 'umi';

import {PlusOutlined} from '@ant-design/icons';
import FormForModal from '@/components/PityForm/FormForModal';
import {vs2015} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";
import UserLink from "@/components/Button/UserLink";
import PityAceEditor from "@/components/CodeEditor/AceEditor/index";
import {CONFIG} from "@/consts/config";

const {Option} = Select;
const GConfig = ({gconfig, user, loading, dispatch}) => {
  const {data, envList, key_type, envMap, modal, currentEnv, name, pagination} = gconfig;
  const {userMap} = user;
  const [record, setRecord] = useState({id: 0, key_type: 0});
  const [language, setLanguage] = useState(0);
  const [editor, setEditor] = useState(null);

  const getType = () => {
    if (language === 1) {
      return 'yaml';
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
      render: env => <Tag>{envMap[env]}</Tag>,
    },
    {
      title: '类型',
      dataIndex: 'key_type',
      key: 'key_type',
      render: key => <Tag color={CONFIG.CONFIG_TYPE_TAG[key_type[key]]}>{key_type[key]}</Tag>,
    },
    {
      title: 'key',
      dataIndex: 'key',
      key: 'keyword',
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
      name: 'env',
      label: '环境',
      required: true,
      component: <Select defaultValue={currentEnv} placeholder="选择对应环境">
        {
          envList.map(v => <Option value={v.id}>{v.name}</Option>)
        }
      </Select>,
      type: 'select',
    },
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
      component: <PityAceEditor language={getType()} setEditor={setEditor} height={250}/>,
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

  const getEnvList = async () => {
    await dispatch({
      type: 'gconfig/fetchEnvList',
      payload: {},
    });
  };

  const fetchUserList = () => {
    dispatch({
      type: 'user/fetchUserList',
    });
  }

  const getConfig = (page = pagination.current, size = pagination.pageSize) => {
    dispatch({
      type: 'gconfig/fetchGConfig',
      payload: {
        page,
        size,
        env: currentEnv ? currentEnv: 0,
        key: name,
      },
    });
  };

  useEffect(() => {
    getEnvList();
  }, [])

  useEffect(() => {
    fetchUserList()
    getConfig();
  }, [currentEnv, name, pagination.current]);

  const onFinish = async values => {
    const params = {
      ...record,
      ...values,
      // env: currentEnv,
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
            <Button type='primary'
                    onClick={() => {
                      save({modal: true});
                      setRecord({id: 0, key_type: 0, env: currentEnv !== null ? currentEnv : currentEnv})
                    }}><PlusOutlined/>添加变量</Button>
          </Col>
          <Col span={4}/>
          <Col span={8}>
            <Input addonBefore={<Select allowClear placeholder="选择对应环境" value={currentEnv} style={{width: 120}}
                                        onChange={e => {
                                          save({currentEnv: e});
                                        }}>
              {
                envList.map(v => <Option value={v.id}>{v.name}</Option>)
              }
            </Select>} placeholder='请输入key' value={name} onChange={e => {
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
