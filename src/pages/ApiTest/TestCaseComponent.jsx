import {PageContainer} from "@ant-design/pro-layout";
import {connect, useParams} from 'umi';
import React, {useEffect, useState} from "react";
import {Badge, Button, Card, Col, Descriptions, Form, Row, Spin, Tabs, Tag, Timeline} from "antd";
import TestCaseEditor from "@/components/TestCase/TestCaseEditor";
import TestResult from "@/components/TestCase/TestResult";
import {CONFIG} from "@/consts/config";
import IconFont from "@/components/Icon/IconFont";
import NoRecord from "@/components/NotFound/NoRecord";
import ConstructorModal from "@/components/TestCase/ConstructorModal";
import SortedTable from "@/components/Table/SortedTable";
import {DeleteTwoTone, EditTwoTone, PlusOutlined} from "@ant-design/icons";
import PostmanForm from "@/components/Postman/PostmanForm";
import common from "@/utils/common";

const {TabPane} = Tabs;

const TestCaseComponent = ({loading, dispatch, user, testcase}) => {
  const params = useParams();
  const directory_id = params.directory;
  const case_id = params.case_id;
  const {
    directoryName,
    caseInfo,
    editing,
    constructors,
    activeKey,
    asserts,
    constructors_case,
    constructorModal
  } = testcase;
  const {userMap} = user;
  const [resultModal, setResultModal] = useState(false);
  const [testResult, setTestResult] = useState({});
  const [form] = Form.useForm();
  const [constructorForm] = Form.useForm();
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState([]);


  useEffect(async () => {
    await dispatch({
      type: 'testcase/queryTestcaseDirectory',
      payload: {
        directory_id,
      }
    })

    await dispatch({
      type: 'user/fetchUserList'
    })

    await fetchTestCaseInfo();

  }, [])

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(caseInfo);
    setHeaders(common.parseHeaders(caseInfo.request_headers))
  }, [caseInfo, editing])

  const fetchTestCaseInfo = async () => {
    if (case_id) {
      await dispatch({
        type: 'testcase/queryTestcase',
        payload: {
          caseId: case_id,
        }
      })
    }
  }

  const load = !!(loading.effects['testcase/queryTestcaseDirectory']
    || loading.effects['testcase/queryTestcase']
    || loading.effects['testcase/fetchUserList'])


  const getDesc = item => {
    if (item.type !== 0) {
      return null;
    }
    const data = JSON.parse(item.constructor_json)
    const result = constructors_case[data['case_id']]
    if (!result) {
      return null
    }
    return <p>用例: <a href={`/#/apiTest/testcase/${result['directory_id']}/${result['id']}`}
                     target="_blank">{result['name']}</a></p>
  }

  const getTag = tag => {
    if (typeof tag === 'object' && tag.length > 0) {
      return tag.map(v => <Tag
        style={{marginRight: 8}}
        color='blue'>{v}</Tag>)
    }
    return caseInfo.tag ? caseInfo.tag.split(',').map(v => <Tag
      style={{marginRight: 8}}
      color='blue'>{v}</Tag>) : '无'
  }

  const onSubmit = async () => {
    const values = await form.validateFields()
    let params = {
      ...values,
      request_type: parseInt(values.request_type, 10),
      status: parseInt(values.status, 10),
      tag: values.tag ? values.tag.join(',') : null,
      directory_id: directory_id,
      request_headers: common.translateHeaders(headers),
      body
    };
    if (!editing) {
      params.priority = caseInfo.priority;
      params.name = caseInfo.name;
      params.status = caseInfo.status;
      params.tag = typeof caseInfo.tag === 'object' ? caseInfo.tag.join(',') : caseInfo.tag ? caseInfo.tag : null;
      params.request_type = caseInfo.request_type;
    }
    if (caseInfo.id) {
      // 说明是编辑case
      params.id = caseInfo.id;
      dispatch({
        type: 'testcase/updateTestcase',
        payload: params,
      })
    } else {
      // 说明是新增Case
      dispatch({
        type: 'testcase/insertTestcase',
        payload: params,
      })
    }
  }

  const columns = [
    {
      title: '名称',
      key: 'name',
      dataIndex: 'name',
      render: (text, record) => <a onClick={() => {
        onEditConstructor(record)
      }}>{text}</a>,
      className: 'drag-visible',
    },
    {
      title: '类型',
      key: 'type',
      dataIndex: 'type',
      render: tag => <Tag color={CONFIG.CASE_CONSTRUCTOR_COLOR[tag]}>{CONFIG.CASE_CONSTRUCTOR[tag]}</Tag>,
      className: 'drag-visible',
    },
    {
      title: '状态',
      key: 'enable',
      dataIndex: 'enable',
      render: enable => <Badge
        status={enable ? 'processing' : 'error'}
        text={enable ? '开启' : '关闭'}/>,
      className: 'drag-visible',
    },
    {
      title: '返回值',
      key: 'value',
      dataIndex: 'value',
      className: 'drag-visible',
    },
    {
      title: '操作',
      key: 'ops',
      className: 'drag-visible',
      render: (_, record) => <>
        <a onClick={() => {
          onEditConstructor(record)
        }}><EditTwoTone/></a>
        <a style={{marginLeft: 8}}><DeleteTwoTone twoToneColor="red"/></a>
      </>
    },
  ]

  const onCreateConstructor = () => {
    dispatch({
      type: 'testcase/save',
      payload: {constructorModal: true}
    })
  }

  const onEditConstructor = record => {
    dispatch({
      type: 'construct/save',
      payload: {currentStep: 1}
    })
    dispatch({
      type: 'testcase/save',
      payload: {constructorModal: true}
    })
    constructorForm.setFieldsValue(record);
  }

  return (
    <PageContainer title={<>{directoryName} {caseInfo.name ? " / " + caseInfo.name : ''}</>}>
      <Spin spinning={load} tip="努力加载中" indicator={<IconFont type="icon-loading1" spin style={{fontSize: 32}}/>}
            size="large">
        {
          !case_id ? <TestCaseEditor directoryId={directory_id} create={true} form={form} body={body} setBody={setBody}
                                     headers={headers} setHeaders={setHeaders} onSubmit={onSubmit}
            /> :
            <Row>
              <Col span={24}>
                <ConstructorModal width={800} modal={constructorModal} setModal={e => {
                  dispatch({type: 'testcase/save', payload: {constructorModal: e}})
                }} caseId={case_id} form={constructorForm}
                                  fetchData={fetchTestCaseInfo}/>
                <TestResult width={900} modal={resultModal} setModal={setResultModal} response={testResult}
                            caseName={caseInfo.name}/>
                {
                  editing ? <TestCaseEditor directoryId={directory_id} form={form} body={body} setBody={setBody}
                                            headers={headers} setHeaders={setHeaders} onSubmit={onSubmit}/> :
                    <Card title="用例详情" extra={<a onClick={() => {
                      console.log(caseInfo)
                      dispatch({
                        type: 'testcase/save',
                        payload: {
                          editing: true,
                          caseInfo: {
                            ...caseInfo,
                            status: caseInfo.status.toString(),
                            request_type: caseInfo.request_type.toString(),
                            tag: typeof caseInfo.tag !== 'object' ? caseInfo.tag ? caseInfo.tag.split(",") : [] : caseInfo.tag
                          },
                          activeKey: '2',
                        }
                      })
                    }}>编辑</a>}>
                      <Descriptions size='small' column={4}>
                        <Descriptions.Item label='用例名称'><a>{caseInfo.name}</a></Descriptions.Item>
                        <Descriptions.Item label='请求类型'>{CONFIG.REQUEST_TYPE[caseInfo.request_type]}</Descriptions.Item>
                        <Descriptions.Item label='请求方式'>
                          {caseInfo.request_method}
                        </Descriptions.Item>
                        <Descriptions.Item label='用例等级'>{<Tag
                          color={CONFIG.CASE_TAG[caseInfo.priority]}>{caseInfo.priority}</Tag>}</Descriptions.Item>
                        <Descriptions.Item label='用例状态'>{
                          <Badge {...CONFIG.CASE_BADGE[caseInfo.status]} />}</Descriptions.Item>
                        <Descriptions.Item label='请求url' span={2}>
                          <a href={caseInfo.url} style={{fontSize: 14}}>{caseInfo.url}</a>
                        </Descriptions.Item>
                        <Descriptions.Item label='用例标签'>{
                          <div style={{textAlign: 'center'}}>
                            {getTag(caseInfo.tag)}
                          </div>
                        }</Descriptions.Item>
                        <Descriptions.Item
                          label='创建人'>{userMap[caseInfo.create_user] !== undefined ? userMap[caseInfo.create_user].name : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item
                          label='更新人'>{userMap[caseInfo.update_user] !== undefined ? userMap[caseInfo.update_user].name : 'loading...'}</Descriptions.Item>
                        <Descriptions.Item label='创建时间'>{caseInfo.created_at}</Descriptions.Item>
                        <Descriptions.Item label='更新时间'>{caseInfo.updated_at}</Descriptions.Item>
                      </Descriptions>
                    </Card>
                }
                <Row gutter={8} style={{marginTop: 12}}>
                  <Col span={24}>
                    <Card>
                      <Tabs activeKey={activeKey} onChange={key => {
                        dispatch({
                          type: 'testcase/save',
                          payload: {activeKey: key}
                        })
                      }}>
                        <TabPane key="1" tab={<span><IconFont type="icon-DependencyGraph_16x"/>数据构造器</span>}>
                          {
                            constructors.length === 0 ?
                              <NoRecord height={180}
                                        desc={<p>没有数据构造器, 这不 <a onClick={onCreateConstructor}>添加一个</a>?</p>}/> :
                              <Row gutter={12}>
                                <Col span={16}>
                                  <Row>
                                    <Col span={24}>
                                      <Button type="dashed" block style={{
                                        marginBottom: 16,
                                      }} onClick={onCreateConstructor}><PlusOutlined/>添加</Button>
                                    </Col>
                                  </Row>
                                  <SortedTable columns={columns} dataSource={constructors} setDataSource={data => {
                                    dispatch({
                                      type: 'testcase/save',
                                      payload: {constructors: data}
                                    })
                                  }} dragCallback={async newData => {
                                    return await dispatch({
                                      type: 'construct/orderConstructor',
                                      payload: newData.map((v, index) => ({id: v.id, index}))
                                    })
                                  }}/>
                                </Col>
                                <Col span={8}>
                                  <Card style={{height: 400}} hoverable bordered={false}>
                                    <Timeline>
                                      {
                                        constructors.map((item, index) => <Timeline.Item>
                                          <p><Badge count={index + 1}
                                                    style={{backgroundColor: '#a6d3ff'}}/> 名称: {item.type === 0 ?
                                            <a>{item.name}</a> : item.name}</p>
                                          {getDesc(item)}
                                        </Timeline.Item>)
                                      }
                                    </Timeline>
                                  </Card>
                                </Col>
                              </Row>

                          }
                        </TabPane>
                        <TabPane key="2" tab={<span><IconFont type="icon-qingqiu"/>接口请求</span>}>
                          <Row gutter={[8, 8]}>
                            <Col span={24}>
                              <PostmanForm form={form} body={body} setBody={setBody} headers={headers}
                                           setHeaders={setHeaders}
                                           bordered={false} save={onSubmit}/>
                            </Col>
                          </Row>
                        </TabPane>
                        <TabPane key="3" tab={<span><IconFont type="icon-duanyan"/>断言</span>}>

                        </TabPane>
                        <TabPane key="4" tab={<span><IconFont type="icon-qingliwuliuliang"/>数据清理器</span>}>

                        </TabPane>
                      </Tabs>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
        }
      </Spin>
    </PageContainer>
  )
}

export default connect((
  {
    user, testcase, loading
  }
) => (
  {
    testcase, user, loading
  }
))(TestCaseComponent);
