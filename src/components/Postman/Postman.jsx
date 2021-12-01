import React, {useState} from 'react';
import {Button, Card, Col, Dropdown, Input, Menu, notification, Radio, Row, Select, Table, Tabs,} from 'antd';
import {DeleteTwoTone, DownOutlined, EditTwoTone, SendOutlined} from '@ant-design/icons';
import EditableTable from '@/components/Table/EditableTable';
import CodeEditor from '@/components/Postman/CodeEditor';
import {httpRequest} from '@/services/request';
import {connect} from 'umi'
import auth from '@/utils/auth';
import FormData from "@/components/Postman/FormData";

const {Option} = Select;
const {TabPane} = Tabs;

const STATUS = {
  200: {color: '#67C23A', text: 'OK'},
  401: {color: '#F56C6C', text: 'unauthorized'},
  400: {color: '#F56C6C', text: 'Bad Request'},
};

const tabExtra = (response) => {
  return response && response.response ? (
    <div style={{marginRight: 16}}>
      <span>
        Status:
        <span
          style={{
            color: STATUS[response.status_code] ? STATUS[response.status_code].color : '#F56C6C',
            marginLeft: 8,
            marginRight: 8,
          }}
        >
          {response.status_code}{' '}
          {STATUS[response.status_code] ? STATUS[response.status_code].text : ''}
        </span>
        <span style={{marginLeft: 8, marginRight: 8}}>
          Time: <span style={{color: '#67C23A'}}>{response.elapsed}</span>
        </span>
      </span>
    </div>
  ) : null;
};

const Postman = ({loading: gloading, gconfig, dispatch}) => {
  const [bodyType, setBodyType] = useState(0);
  const [rawType, setRawType] = useState('JSON');
  const [method, setMethod] = useState('GET');
  const [paramsData, setParamsData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [editableKeys, setEditableRowKeys] = useState(() => paramsData.map((item) => item.id));
  const [headersKeys, setHeadersKeys] = useState(() => headers.map((item) => item.id));
  const [body, setBody] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});
  const [formData, setFormData] = useState([]);

  const {ossFileList} = gconfig;

  // 请求url+params
  const [url, setUrl] = useState('');

  const selectBefore = (
    <Select
      value={method}
      onChange={(data) => setMethod(data)}
      style={{width: 120, fontSize: 16, textAlign: 'left'}}
    >
      <Option key="GET" value="GET">GET</Option>
      <Option key="POST" value="POST">POST</Option>
      <Option key="PUT" value="PUT">PUT</Option>
      <Option key="DELETE" value="DELETE">DELETE</Option>
    </Select>
  );

  const resColumns = [
    {
      title: 'KEY',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'VALUE',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const toTable = (field) => {
    if (response[field] === null || response[field] === undefined || response[field] === '{}') {
      return [];
    }
    const temp = JSON.parse(response[field]);
    return Object.keys(temp).map((key) => ({
      key,
      value: temp[key],
    }));
  };

  // 根据paramsData拼接url
  const joinUrl = (data) => {
    let tempUrl = url.split('?')[0];
    data.forEach((item, idx) => {
      if (item.key) {
        // 如果item.key有效
        if (idx === 0) {
          tempUrl = `${tempUrl}?${item.key}=${item.value || ''}`;
        } else {
          tempUrl = `${tempUrl}&${item.key}=${item.value || ''}`;
        }
      }
    });
    setUrl(tempUrl);
  };

  const splitUrl = (nowUrl) => {
    const split = nowUrl.split('?');
    if (split.length < 2) {
      setParamsData([]);
    } else {
      const params = split[1].split('&');
      const newParams = [];
      const keys = [];
      params.forEach((item, idx) => {
        const [key, value] = item.split('=');
        const now = Date.now();
        keys.push(now + idx + 10);
        newParams.push({key, value, id: now + idx + 10, description: ''});
      });
      setParamsData(newParams);
      setEditableRowKeys(keys);
    }
  };

  const onClickMenu = (key) => {
    setRawType(key);
  };

  // 处理headers
  const getHeaders = () => {
    const result = {};
    headers.forEach((item) => {
      if (item.key !== '') {
        result[item.key] = item.value;
      }
    });
    return result;
  };

  // 拼接http请求
  const onRequest = async () => {
    if (url === '') {
      notification.error({
        message: '请求Url不能为空',
      });
      return;
    }
    setLoading(true);
    const params = {
      method,
      url,
      body: bodyType === 2 ? JSON.stringify(formData): body,
      body_type: bodyType,
      headers: getHeaders(),
    };
    if (bodyType === 0) {
      params.body = null;
    }
    const res = await httpRequest(params);
    setLoading(false);
    if (auth.response(res, true)) {
      setResponse(res.data);
    }
  };

  const onDelete = (columnType, key) => {
    if (columnType === 'params') {
      const data = paramsData.filter((item) => item.id !== key);
      setParamsData(data);
      joinUrl(data);
    } else {
      const data = headers.filter((item) => item.id !== key);
      setHeaders(data);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="Text">
        <a
          onClick={() => {
            onClickMenu('Text');
          }}
        >
          Text
        </a>
      </Menu.Item>
      <Menu.Item key="JavaScript">
        <a
          onClick={() => {
            onClickMenu('JavaScript');
          }}
        >
          JavaScript
        </a>
      </Menu.Item>
      <Menu.Item key="JSON">
        <a
          onClick={() => {
            onClickMenu('JSON');
          }}
        >
          JSON
        </a>
      </Menu.Item>
      <Menu.Item key="HTML">
        <a
          onClick={() => {
            onClickMenu('HTML');
          }}
        >
          HTML
        </a>
      </Menu.Item>
      <Menu.Item key="XML">
        <a
          onClick={() => {
            onClickMenu('XML');
          }}
        >
          XML
        </a>
      </Menu.Item>
    </Menu>
  );

  const columns = (columnType) => {
    return [
      {
        title: 'KEY',
        key: 'key',
        dataIndex: 'key',
      },
      {
        title: 'VALUE',
        key: 'value',
        dataIndex: 'value',
      },
      {
        title: 'DESCRIPTION',
        key: 'description',
        dataIndex: 'description',
      },
      {
        title: '操作',
        valueType: 'option',
        render: (text, record) => {
          return (
            <>
              <EditTwoTone
                style={{cursor: 'pointer'}}
                onClick={() => {
                  setEditableRowKeys([record.id])
                }}
              />
              <DeleteTwoTone
                style={{cursor: 'pointer', marginLeft: 8}}
                onClick={() => {
                  onDelete(columnType, record.id);
                }}
                twoToneColor="#eb2f96"
              />
            </>
          );
        },
      },
    ];
  };

  const getBody = bd => {
    if (bd === 0) {
      return <div style={{height: '20vh', lineHeight: '20vh', textAlign: 'center'}}>
        This request does not have a body
      </div>
    }
    if (bd === 2) {
      return <FormData ossFileList={ossFileList} dataSource={formData} setDataSource={setFormData}/>
    }
    return <Row style={{marginTop: 12}}>
      <Col span={24}>
        <Card bodyStyle={{padding: 0}}>
          <CodeEditor value={body} onChange={e => setBody(e)} height="20vh"/>
        </Card>
      </Col>
    </Row>
  }

  return (
    <Card title="在线调试HTTP请求">
      <Row gutter={[8, 8]}>
        <Col span={18}>
          <Input
            size="large"
            value={url}
            addonBefore={selectBefore}
            placeholder="请输入要请求的url"
            onChange={(e) => {
              setUrl(e.target.value);
              splitUrl(e.target.value);
            }}
          />
        </Col>
        <Col span={6}>
          <Button
            onClick={onRequest}
            loading={loading}
            type="primary"
            size="large"
            style={{marginRight: 16, float: 'right'}}
          >
            <SendOutlined/>
            Send{' '}
          </Button>
        </Col>
      </Row>
      <Row style={{marginTop: 8}}>
        <Tabs defaultActiveKey="1" style={{width: '100%'}}>
          <TabPane tab="Params" key="1">
            <EditableTable
              columns={columns('params')}
              title="Query Params"
              dataSource={paramsData}
              setDataSource={setParamsData}
              extra={joinUrl}
              editableKeys={editableKeys}
              setEditableRowKeys={setEditableRowKeys}
            />
          </TabPane>
          <TabPane tab="Headers" key="2">
            <EditableTable
              columns={columns('headers')}
              title="Headers"
              dataSource={headers}
              setDataSource={setHeaders}
              editableKeys={headersKeys}
              setEditableRowKeys={setHeadersKeys}
            />
          </TabPane>
          <TabPane tab="Body" key="3">
            <Row>
              <Radio.Group
                defaultValue={0}
                value={bodyType}
                onChange={(e) => {
                  setBodyType(e.target.value)
                  if (e.target.value === 2) {
                    // 获取oss文件
                    dispatch({
                      type: 'gconfig/listOssFile'
                    })
                  }
                }}
              >
                <Radio value={0}>none</Radio>
                <Radio value={2}>form-data</Radio>
                <Radio value={3}>x-www-form-urlencoded</Radio>
                <Radio value={1}>raw</Radio>
                <Radio value={4}>binary</Radio>
                <Radio value={5}>GraphQL</Radio>
              </Radio.Group>
              {bodyType === 1 ? (
                <Dropdown style={{marginLeft: 8}} overlay={menu} trigger={['click']}>
                  <a onClick={(e) => e.preventDefault()}>
                    {rawType} <DownOutlined/>
                  </a>
                </Dropdown>
              ) : null}
            </Row>
            {getBody(bodyType)}
          </TabPane>
        </Tabs>
      </Row>
      <Row gutter={[8, 8]}>
        {Object.keys(response).length === 0 ? null : (
          <Tabs style={{width: '100%'}} tabBarExtraContent={tabExtra(response)}>
            <TabPane tab="Body" key="1">
              <CodeEditor
                language={response.response && response.response_headers.indexOf("json") > -1 ? 'json' : 'text'}
                value={response.response && typeof response.response === 'object' ? JSON.stringify(response.response, null, 2) : response.response || ''}
                height="30vh"
              />
            </TabPane>
            <TabPane tab="Cookie" key="2">
              <Table
                columns={resColumns}
                dataSource={toTable('cookies')}
                size="small"
                pagination={false}
              />
            </TabPane>
            <TabPane tab="Headers" key="3">
              <Table
                columns={resColumns}
                dataSource={toTable('response_headers')}
                size="small"
                pagination={false}
              />
            </TabPane>
          </Tabs>
        )}
      </Row>
    </Card>
  );
};

export default connect(({loading, gconfig}) => ({loading, gconfig}))(Postman);
