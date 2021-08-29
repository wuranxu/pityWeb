import {PageContainer} from "@ant-design/pro-layout";
import {connect, useParams} from 'umi';
import React, {useEffect, useState} from "react";
import {Badge, Card, Col, Descriptions, Row, Spin, Tag, Timeline} from "antd";
import TestCaseEditor from "@/components/TestCase/TestCaseEditor";
import TestResult from "@/components/TestCase/TestResult";
import {CONFIG} from "@/consts/config";
import IconFont from "@/components/Icon/IconFont";
import SyntaxHighlighter from "react-syntax-highlighter";
import {vs2015} from "react-syntax-highlighter/dist/cjs/styles/hljs";

const TestCaseComponent = ({loading, dispatch, user, testcase}) => {
  const params = useParams();
  const directory_id = params.directory;
  const case_id = params.case_id;
  const {directoryName, caseInfo, editing, constructors, asserts, constructors_case} = testcase;
  const {userMap} = user;
  const [resultModal, setResultModal] = useState(false);
  const [testResult, setTestResult] = useState({});


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
    if (case_id) {
      await dispatch({
        type: 'testcase/queryTestcase',
        payload: {
          caseId: case_id,
        }
      })
    }
  }, [])

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
    return <p>用例: <a href={`/#/apiTest/testcase/${result['directory_id']}/${result['id']}`} target="_blank">{result['name']}</a></p>
  }

  return (
    <PageContainer title={<>{directoryName} {caseInfo.name ? " / " + caseInfo.name : ''}</>}>
      <Spin spinning={load} tip="努力加载中" indicator={<IconFont type="icon-loading1" spin style={{fontSize: 32}}/>}
            size="large">
        {
          !case_id ? <TestCaseEditor directoryId={directory_id}/> :
            !editing ? <Row>
              <Col span={24}>
                <TestResult width={900} modal={resultModal} setModal={setResultModal} response={testResult}
                            caseName={caseInfo.name}/>
                <Card title="用例详情" extra={<a onClick={() => {
                  dispatch({
                    type: 'testcase/save',
                    payload: {
                      editing: true,
                      caseInfo: {
                        ...caseInfo,
                        status: caseInfo.status.toString(),
                        request_type: caseInfo.request_type.toString(),
                        tag: caseInfo.tag.split(",")
                      }
                    }
                  })
                }}>编辑</a>}>
                  <Descriptions size='middle' column={4}>
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
                        {caseInfo.tag ? caseInfo.tag.split(',').map(v => <Tag style={{marginRight: 4}}
                                                                              color='blue'>{v}</Tag>) : '无'}
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
                <Row style={{marginTop: 16}} gutter={16}>
                  <Col span={7}>
                    <Card title="数据构造器" style={{height: 480, overflow: 'auto'}}>
                      <Timeline>
                        {
                          constructors.map((item, index) => <Timeline.Item>
                            <p>类型: <Tag
                              color={CONFIG.CASE_CONSTRUCTOR_COLOR[item.type]}>{CONFIG.CASE_CONSTRUCTOR[item.type]}</Tag>
                              <Badge count={index + 1} style={{backgroundColor: '#3e3e3e'}}/></p>
                            {getDesc(item)}
                            <p>描述: {item.type === 0 ? <a>{item.name}</a> : item.name}</p>
                            <p>返回值: <strong>{item.value}</strong></p>
                            <p>状态: <Badge status={item.enable ? 'processing' : 'error'} text="启用中"/></p>
                          </Timeline.Item>)
                        }
                      </Timeline>
                    </Card>
                  </Col>
                  <Col span={1}>
                    <div style={{textAlign: 'center', height: 480, lineHeight: '480px'}}>
                      <IconFont type="icon-cs-xy-1" style={{fontSize: 28}}/>
                    </div>
                  </Col>
                  <Col span={8}>
                    <Card title="接口请求" style={{height: 480, overflow: 'auto'}}>
                      {
                        caseInfo.body ? <SyntaxHighlighter language='json' style={vs2015}>
                          {caseInfo.body}
                        </SyntaxHighlighter> : null
                      }
                    </Card>
                  </Col>
                  <Col span={1}>
                    <div style={{textAlign: 'center', height: 480, lineHeight: '480px'}}>
                      <IconFont type="icon-cs-xy-1" style={{fontSize: 28}}/>
                    </div>
                  </Col>
                  <Col span={7}>
                    <Card title="后置条件" style={{height: 480, overflow: 'auto'}}>

                    </Card>
                  </Col>
                </Row>
              </Col>

            </Row> : <TestCaseEditor directoryId={directory_id}/>
        }
      </Spin>
    </PageContainer>
  )
}

export default connect(({user, testcase, loading}) => ({testcase, user, loading}))(TestCaseComponent);
