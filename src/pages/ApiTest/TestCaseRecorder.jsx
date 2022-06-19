import {PageContainer} from "@ant-design/pro-layout";
import {StopOutlined, ToolOutlined, VideoCameraOutlined, VideoCameraTwoTone} from "@ant-design/icons";
import {Alert, Button, Card, Col, Input, notification, Row} from "antd";
import React, {useEffect, useState} from "react";
import {connect} from "umi";
import RequestInfoList from "@/components/TestCase/recorder/RequestInfoList";


const TestCaseRecorder = ({dispatch, recorder, loading}) => {

  const {
    recordStatus,
    recordLists,
    regex
  } = recorder;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: keys => {
      setSelectedRowKeys(keys)
    }
  };

  useEffect(() => {
    dispatch({
      type: 'recorder/queryRecordStatus',
    })
  }, [])

  const startRecord = () => {
    if (!regex) {
      notification.error({
        message: '建议填写过滤url，否则数据会较多'
      })
      return;
    }
    dispatch({
      type: 'recorder/startRecord',
      payload: {
        regex
      }
    })
  }

  const stopRecord = () => {
    dispatch({
      type: 'recorder/stopRecord',
    })
  }

  const onGenerateCase = async () => {
    const res = await dispatch({
      type: 'recorder/generateCase',
      payload: {
        directory_id: 5,
        requests: selectedRowKeys.map(key => ({
          request_headers: JSON.parse(recordLists[key].request_headers),
          response_headers: JSON.parse(recordLists[key].response_headers),
          cookies: JSON.parse(recordLists[key].cookies),
          request_cookies: recordLists[key].request_cookies,
          response_content: recordLists[key].response_content,
          request_method: recordLists[key].request_method,
          url: recordLists[key].url,
          body: recordLists[key].body,
          status_code: recordLists[key].status_code,

        }))
      }
    })
    if (res) {
      notification.success({
        message: "用例生成成功",
        description: <span>点击<a
          href={`/#/apiTest/testcase/${res.data.directory_id}/${res.data.id}`}>链接</a>可跳转至测试用例</span>
      })
    }
  }

  return (
    <PageContainer breadcrumb={null}
                   title={<span className="ant-page-header-heading-title">用例录制 <VideoCameraTwoTone/></span>}>
      <Card>
        <Row gutter={8}>
          <Col span={12}>
            <Alert type="info" banner closable message={<span>
            录制接口之前，请先配置好app/web代理<a href="https://docs.mitmproxy.org/stable/overview-getting-started/"
                                    target="_blank" rel="noreferrer"> 参考文档</a>
          </span>}/>
          </Col>
          <Col span={1}/>
          <Col span={5}>
            <Input placeholder="请输入要匹配的url(正则表达式)" onChange={e => {
              dispatch({
                type: 'recorder/save', payload: {regex: e.target.value}
              })
            }} value={regex} style={{float: 'right'}}/>
          </Col>
          <Col span={6}>
            <Button style={{float: 'right', marginRight: 8}} onClick={onGenerateCase}
                    disabled={selectedRowKeys.length === 0}><ToolOutlined/>生成用例</Button>
            {
              recordStatus ? <Button onClick={stopRecord} type="danger"
                                     style={{float: 'right', marginRight: 8}}><StopOutlined/>停止录制</Button> :
                <Button type="primary" style={{float: 'right', marginRight: 8}} onClick={startRecord}
                        loading={recordStatus}><VideoCameraOutlined/>{recordLists.length === 0 ? '开始录制' : '重新录制'}
                </Button>
            }

          </Col>
        </Row>
        <Row gutter={8} style={{marginTop: 12}}>
          <Col span={24}>
            <RequestInfoList rowSelection={rowSelection} rowKey="index" emptyText="点击录制按钮即可开始录制app/web的接口请求"
                             dataSource={recordLists} loading={loading.effects['recorder/queryRecordStatus']}/>
          </Col>
        </Row>
      </Card>
    </PageContainer>)
}

export default connect(({loading, recorder, global}) => ({global, recorder, loading}))(TestCaseRecorder);
