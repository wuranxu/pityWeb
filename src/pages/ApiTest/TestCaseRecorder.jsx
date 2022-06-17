import {PageContainer} from "@ant-design/pro-layout";
import {StopOutlined, ToolOutlined, VideoCameraOutlined, VideoCameraTwoTone} from "@ant-design/icons";
import {Alert, Button, Card, Col, Input, Modal, notification, Row, Table, Tag, Tooltip} from "antd";
import NoRecord from "@/components/NotFound/NoRecord";
import React, {useEffect, useState} from "react";
import {connect} from "umi";
import SyntaxHighlighter from "react-syntax-highlighter";
import {vs2015} from "react-syntax-highlighter/dist/cjs/styles/hljs";


const tagColor = method => {
  switch (method.toUpperCase()) {
    case "GET":
      return {color: 'rgb(235, 249, 244)', fontColor: 'rgb(47, 177, 130)'}
    case "POST":
      return {color: 'rgb(242, 244, 248)', fontColor: 'rgb(5, 112, 175)'}
    case "PUT":
      return {color: 'rgb(255, 247, 230)', fontColor: 'rgb(255, 174, 0)'}
    case "DELETE":
      return {color: 'rgb(253, 244, 246)', fontColor: 'rgb(222, 72, 108)'}
    default:
      return {color: 'rgb(243, 251, 254)', fontColor: 'rgb(166, 187, 210)'}
  }
}

const MethodTag = ({color, text, fontColor}) => {
  return <Tag style={{color: fontColor, borderRadius: 12, padding: '0 12px'}} color={color}>{text}</Tag>
}

const Detail = ({name, record}) => {
  return <a onClick={() => {
    Modal.info({
      title: name,
      width: 700,
      bodyStyle: {padding: -12},
      content: <SyntaxHighlighter language="json" style={vs2015}>{record[name]}</SyntaxHighlighter>
    })
  }}>详细</a>
}

const TestCaseRecorder = ({dispatch, testcase, global, loading}) => {

  const {
    recordStatus,
    recordLists,
    regex
  } = testcase;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const rowSelection = {
    selectedRowKeys,
    onChange: keys => {
      setSelectedRowKeys(keys)
    }
  };

  useEffect(() => {
    dispatch({
      type: 'testcase/queryRecordStatus',
    })
  }, [])


  const columns = [
    {
      title: '编号',
      key: 'index',
      render: (text, record, index) => `${index + 1}`
    },
    {
      title: '请求地址',
      key: 'url',
      dataIndex: 'url',
      width: '20%',
      render: url => <Tooltip title={url}><a href={url}>{url.slice(0, 48)}</a> </Tooltip>
    },
    {
      title: '请求方式',
      key: 'request_method',
      dataIndex: 'request_method',
      render: md => <MethodTag fontColor={tagColor(md).fontColor} color={tagColor(md).color} text={md}/>
    },
    {
      title: '请求headers',
      key: 'request_headers',
      dataIndex: 'request_headers',
      render: (request_headers, record) => {
        return <Detail name="request_headers" record={record}/>
      }
    },
    {
      title: '请求参数',
      key: 'body',
      dataIndex: 'body',
      render: (body, record) => {
        if (!body) {
          return '-'
        }
        return <Detail name="body" record={record}/>
      }
    },
    {
      title: '返回headers',
      key: 'response_headers',
      dataIndex: 'response_headers',
      render: (response_headers, record) => {
        if (!response_headers) {
          return '-'
        }
        return <Detail name="response_headers" record={record}/>
      }
    },
    {
      title: 'response',
      key: 'response_content',
      dataIndex: 'response_content',
      render: (response_content, record) => {
        if (!response_content) {
          return '-'
        }
        return <Detail name="response_content" record={record}/>
      }
    },
    {
      title: '状态码',
      key: 'status_code',
      dataIndex: 'status_code',
      render: status_code => status_code
    },
  ]

  const startRecord = () => {
    if (!regex) {
      notification.error({
        message: '建议填写过滤url，否则数据会较多'
      })
      return;
    }
    dispatch({
      type: 'testcase/startRecord',
      payload: {
        regex
      }
    })
  }

  const stopRecord = () => {
    dispatch({
      type: 'testcase/stopRecord',
    })
  }

  const onGenerateCase = async () => {
    const res = await dispatch({
      type: 'testcase/generateCase',
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
        description: <span>点击<a href={`/#/apiTest/testcase/${res.data.directory_id}/${res.data.id}`}>链接</a>可跳转至测试用例</span>
      })
    }
  }

  return (<PageContainer breadcrumb={null}
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
              type: 'testcase/save', payload: {regex: e.target.value}
            })
          }} value={regex} style={{float: 'right'}}/>
        </Col>
        <Col span={6}>
          <Button style={{float: 'right', marginRight: 8}} onClick={onGenerateCase}
                  disabled={recordLists.length === 0}><ToolOutlined/>生成用例</Button>
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
          <Table columns={columns} pagination={false} dataSource={recordLists}
                 rowSelection={rowSelection} rowKey={record => record.index}
                 loading={loading.effects['testcase/queryRecordStatus']}
                 locale={{emptyText: <NoRecord desc="点击录制按钮即可开始录制app/web的接口请求" height={150}/>}}/>
        </Col>
      </Row>
    </Card>
  </PageContainer>)
}

export default connect(({loading, testcase, global}) => ({global, testcase, loading}))(TestCaseRecorder);
