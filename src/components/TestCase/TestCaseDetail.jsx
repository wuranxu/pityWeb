import React, {useEffect, useState} from 'react';
import {queryTestCase, updateTestCase} from '@/services/testcase';
import auth from '@/utils/auth';
import {Badge, Button, Col, Descriptions, Dropdown, Form, Menu, Modal, Row, Spin, Tabs, Tag} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
  SketchOutlined
} from '@ant-design/icons';
import CONFIG from '@/consts/config';
import CaseDetail from '@/components/Drawer/CaseDetail';
import fields from '@/consts/fields';
import {executeCase, executeSelectedCase} from '@/services/request';
import HeaderTable from '@/components/Table/HeaderTable';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {vs2015} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import styles from './TestCaseDetail.less';
import TestResult from "@/components/TestCase/TestResult";
import {REQUEST_TYPE} from "@/components/Common/global";

const TabPane = Tabs.TabPane;
const {confirm} = Modal;

export default ({caseId, userMap, setExecuteStatus, project, checkedKeys}) => {
  const [data, setData] = useState({status: 1, tag: ''});
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState([]);
  const [form] = Form.useForm();
  const [resultModal, setResultModal] = useState(false);
  const [testResult, setTestResult] = useState({});

  const execute = async () => {
    setLoading(true);
    const res = await executeCase({case_id: caseId});
    if (auth.response(res, true)) {
      setTestResult(res.data);
      setExecuteStatus(res.data.asserts);
      setResultModal(true);
    }
    setLoading(false);
  };

  const executeMany = async () => {
    setLoading(true);
    const case_list = checkedKeys.filter(v => v.indexOf("case_") > -1).map(v => parseInt(v.replace("case_", ""), 10))
    const res = await executeSelectedCase(case_list)
    if (auth.response(res, true)) {
      confirm({
        title: '用例执行完毕, 是否跳转到报告页面?',
        icon: <QuestionCircleOutlined/>,
        onOk() {
          window.open(`/#/record/report/${res.data}`)
        },
        onCancel() {
        },
      });
    }
    setLoading(false);
  }

  const parseHeaders = headerString => {
    if (!headerString) {
      return;
    }
    const header = JSON.parse(headerString);
    const temp = [];
    Object.keys(header).forEach((k, index) => {
      temp.push({key: k, value: header[k], id: index.toString()});
    });
    setHeaders(temp);
  };

  const menu = (
    <Menu onClick={async item => {
      if (item.key === "1") {
        await executeMany();
      }
    }}>
      <Menu.Item key="1" icon={<SketchOutlined/>}>
        执行选中
      </Menu.Item>
    </Menu>
  );

  const CaseTitle = <Col span={24}>
    <span style={{fontWeight: 'bold', fontSize: 16}}>用例详情</span>
    <Button type='danger' className={styles.inlineButton}><DeleteOutlined/>删除</Button>
    <Dropdown.Button className={styles.inlineButton} type="primary" onClick={execute} overlay={menu}>
      <PlayCircleOutlined/> 执行
    </Dropdown.Button>
    <Button className={styles.inlineButton} onClick={() => {
      setEditing(true);
      parseHeaders(data.request_headers);
      setBody(data.body);
    }}><EditOutlined/>修改</Button>
  </Col>;

  const init = async () => {
    if (caseId === null) {
      return;
    }
    setLoading(true);
    const res = await queryTestCase({caseId});
    if (auth.response(res)) {
      setData(res.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    init()
  }, [caseId]);

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
      request_headers: translateHeaders(), body
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
            !editing ?
              <Row>
                {CaseTitle}
                <Col span={24}>
                  <TestResult width={1000} modal={resultModal} setModal={setResultModal} response={testResult}
                              caseName={data.name}/>
                  <Tabs defaultActiveKey="1" style={{marginTop: 12}}>
                    <TabPane key="1" tab="基础信息">
                      <Descriptions bordered size='middle' column={2}>
                        <Descriptions.Item label='用例名称'><a>{data.name}</a></Descriptions.Item>
                        <Descriptions.Item label='用例目录'>{data.catalogue}</Descriptions.Item>
                        <Descriptions.Item label='优先级'>{<Tag
                          color={CONFIG.CASE_TAG[data.priority]}>{data.priority}</Tag>}</Descriptions.Item>
                        <Descriptions.Item label='请求协议'>{REQUEST_TYPE[data.request_type]}</Descriptions.Item>
                        <Descriptions.Item label='请求方式'>
                          {data.request_method}
                        </Descriptions.Item>
                        <Descriptions.Item label='用例状态'>{
                          <Badge {...CONFIG.CASE_BADGE[data.status]} />}</Descriptions.Item>
                        <Descriptions.Item label='请求url' span={2}>
                          <a href={data.url} style={{fontSize: 14}}>{data.url}</a>
                        </Descriptions.Item>
                        <Descriptions.Item
                          label='创建人'>{userMap[data.create_user] !== undefined ? userMap[data.create_user].name : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item
                          label='更新人'>{userMap[data.update_user] !== undefined ? userMap[data.update_user].name : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item label='创建时间'>{data.created_at}</Descriptions.Item>
                        <Descriptions.Item label='更新时间'>{data.updated_at}</Descriptions.Item>
                        <Descriptions.Item label='用例标签' span={2}>{
                          <div style={{textAlign: 'center'}}>
                            {data.tag ? data.tag.split(',').map(v => <Tag style={{marginRight: 4}}
                                                                          color='blue'>{v}</Tag>) : '无'}
                          </div>
                        }</Descriptions.Item>
                      </Descriptions>
                    </TabPane>
                    <TabPane key="2" tab="请求Headers">
                      <HeaderTable headers={data.request_headers}/>
                    </TabPane>
                    <TabPane key="3" tab="请求body">
                      {
                        data.body ? <SyntaxHighlighter language='json' style={vs2015}>
                          {data.body}
                        </SyntaxHighlighter> : null
                      }
                    </TabPane>
                  </Tabs>
                </Col>

              </Row>
              :


              <div>
                <CaseDetail form={form} layout={{
                  labelCol: {span: 6},
                  wrapperCol: {span: 18},
                }} formName='case' record={{
                  ...data,
                  request_type: data.request_type ? data.request_type.toString() : null,
                  status: data.status ? data.status.toString() : null,
                  tag: data.tag ? data.tag.split(',') : [],
                }}
                            onFinish={onFinish} fields={fields.CaseDetail} body={body} setBody={setBody}
                            headers={headers}
                            setHeaders={setHeaders}/>
                <div style={{textAlign: 'center', marginTop: 16}}>
                  <Button onClick={() => setEditing(false)}>取消</Button>
                  <Button type='primary' style={{marginLeft: 8}} onClick={onFinish}>保存</Button>
                </div>
              </div>
          }

        </Col>
      </Row>
    </Spin>
  );

}
