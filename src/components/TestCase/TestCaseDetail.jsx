import React, { useEffect, useState } from 'react';
import { queryTestCase, updateTestCase } from '@/services/testcase';
import auth from '@/utils/auth';
import { Badge, Button, Col, Descriptions, Form, Row, Spin, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { CONFIG } from '@/consts/config';
import CaseDetail from '@/components/Drawer/CaseDetail';
import fields from '@/consts/fields';
import { executeCase } from '@/services/request';
import HeaderTable from '@/components/Table/HeaderTable';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import styles from './TestCaseDetail.less';


export default ({ caseId, userMap, setExecuteStatus, project }) => {
  const [data, setData] = useState({ status: 1, tag: '' });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState([]);
  const [form] = Form.useForm();

  const execute = async () => {
    const res = await executeCase({ case_id: caseId });
    setExecuteStatus(res.data.asserts);
  };
  const parseHeaders = headerString => {
    if (!headerString) {
      return;
    }
    const header = JSON.parse(headerString);
    const temp = [];
    Object.keys(header).forEach(k => {
      temp.push({ key: k, value: header[k] });
    });
    setHeaders(temp);

  };

  const CaseTitle = <div>
    <span>用例详情</span>
    <Button type='danger' className={styles.inlineButton}><DeleteOutlined />删除</Button>
    <Button type='primary' className={styles.inlineButton} onClick={execute}><PlayCircleOutlined />执行</Button>
    <Button className={styles.inlineButton} onClick={() => {
      setEditing(true);
      parseHeaders(data.request_header);
    }}><EditOutlined />修改</Button>
  </div>;

  const init = async () => {
    if (caseId === null) {
      return;
    }
    setLoading(true);
    const res = await queryTestCase({ caseId });
    if (auth.response(res)) {
      setData(res.data);
    }
    setLoading(false);
  }

  useEffect(init, [caseId]);

  const translateHeaders = () => {
    const hd = {};
    for (const h in headers) {
      hd[headers[h].key] = headers[h].value;
    }
    return JSON.stringify(hd, null, 2);
  };

  const onFinish = async () => {
    const values = await form.validateFields();
    const params = {
      ...values,
      request_type: parseInt(values.request_type, 10),
      status: parseInt(values.status, 10),
      tag: values.tag !== undefined ? values.tag.join(',') : null,
      project_id: project.id,
      id: caseId,
      request_header: translateHeaders(), body
    };
    const res = await updateTestCase(params);
    auth.response(res, true);
    setEditing(false);
    await init()
  };


  return (
    <Spin spinning={loading}>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          {
            !editing ? <Descriptions title={CaseTitle} bordered size='middle' span={3}>
              <Descriptions.Item label='用例名称'><a>{data.name}</a></Descriptions.Item>
              <Descriptions.Item label='用例目录'>{data.catalogue}</Descriptions.Item>
              <Descriptions.Item label='用例优先级'>{<Tag
                color={CONFIG.CASE_TAG[data.priority]}>{data.priority}</Tag>}</Descriptions.Item>
              <Descriptions.Item label='请求类型'>{CONFIG.REQUEST_TYPE[data.request_type]}</Descriptions.Item>
              <Descriptions.Item label='请求方式'>
                {data.request_method}
              </Descriptions.Item>
              <Descriptions.Item label='用例状态'>{<Badge {...CONFIG.CASE_BADGE[data.status]} />}</Descriptions.Item>
              <Descriptions.Item label='用例标签' span={2}>{
                <div style={{ textAlign: 'center' }}>
                  {data.tag ? data.tag.split(',').map(v => <Tag style={{ marginRight: 4 }}
                                                                color='blue'>{v}</Tag>) : '无'}
                </div>
              }</Descriptions.Item>
              <Descriptions.Item
                label='创建人'>{userMap[data.create_user] !== undefined ? userMap[data.create_user].name : 'loading...'}</Descriptions.Item>
              <Descriptions.Item
                label='更新人'>{userMap[data.update_user] !== undefined ? userMap[data.update_user].name : 'loading...'}</Descriptions.Item>
              <Descriptions.Item label='创建时间'>{data.created_at}</Descriptions.Item>
              <Descriptions.Item label='更新时间'>{data.updated_at}</Descriptions.Item>
              <Descriptions.Item label='请求url' span={3}>
                <a href={data.url} style={{ fontSize: 16 }}>{data.url}</a>
              </Descriptions.Item>
              <Descriptions.Item label='请求Headers' span={3}>
                <HeaderTable headers={data.request_header} />
              </Descriptions.Item>
              <Descriptions.Item label='请求body' span={3}>
                {
                  data.body ? <SyntaxHighlighter language='json' style={vs2015}>
                    {data.body}
                  </SyntaxHighlighter> : null
                }
              </Descriptions.Item>
            </Descriptions> : <div>
              <CaseDetail form={form} layout={{
                labelCol: { span: 6 },
                wrapperCol: { span: 18 },
              }} formName='case' record={{
                ...data,
                request_type: data.request_type ? data.request_type.toString() : null,
                status: data.status ? data.status.toString() : null,
                tag: data.tag ? data.tag.split(',') : [],
              }}
                          onFinish={onFinish} fields={fields.CaseDetail} body={body} setBody={setBody}
                          headers={headers}
                          setHeaders={setHeaders} />
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <Button onClick={() => setEditing(false)}>取消</Button>
                <Button type='primary' style={{ marginLeft: 8 }} onClick={onFinish}>保存</Button>
              </div>
            </div>
          }

        </Col>
      </Row>
    </Spin>
  );

}
