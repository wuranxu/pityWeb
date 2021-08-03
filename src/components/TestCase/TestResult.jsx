import {Badge, Col, Descriptions, Modal, Row, Table, Tabs} from "antd";
import HeaderTable from "@/components/Table/HeaderTable";
import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {vs2015} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import CodeEditor from "@/components/Postman/CodeEditor";

const TabPane = Tabs.TabPane;
const STATUS = {
  200: {color: '#67C23A', text: 'OK'},
  401: {color: '#F56C6C', text: 'unauthorized'},
  400: {color: '#F56C6C', text: 'Bad Request'},
};
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
export default ({response, caseName, width, modal, setModal}) => {

  const toTable = (field) => {
    if (!response[field]) {
      return [];
    }
    return Object.keys(response[field]).map((key) => ({
      key,
      value: response[field][key],
    }));
  };

  const assertTable = [
    {
      title: '断言信息',
      key: 'msg',
      dataIndex: 'msg'
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: text => <Badge status={text ? 'success' : 'error'} text={text ? '通过' : '未通过'}/>
    },
  ]

  const getSource = () => {
    if (!response.asserts) {
      return [];
    }
    return Object.keys(response.asserts).map(k => (
      {
        status: response.asserts[k].status,
        msg: response.asserts[k].msg,
      }
    ))
  }

  return (
    <Modal style={{marginTop: -80}} title={<span>Test Report:　<strong>{caseName}</strong></span>} width={width || 1000}
           visible={modal}
           onCancel={() => setModal(false)}>
      <Row gutter={[8, 8]}>
        <Tabs style={{width: '100%'}} tabPosition="left">
          <TabPane tab="执行结果" key="1">
            <Descriptions column={2} bordered size="middle">
              <Descriptions.Item label="测试结果">
                <Badge status={response.status ? "success" : "error"} text={response.status ? "成功" : "失败"}/>
              </Descriptions.Item>
              <Descriptions.Item label="请求方式">
                {response.request_method}
              </Descriptions.Item>
              <Descriptions.Item label="HTTP状态码">
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
              </Descriptions.Item>
              <Descriptions.Item label="执行时间">
                  <span style={{marginLeft: 8, marginRight: 8}}>
                    <span style={{color: '#67C23A'}}>{response.elapsed}</span>
                  </span>
              </Descriptions.Item>
              <Descriptions.Item label="请求url" span={2}>
                {response.url}
              </Descriptions.Item>
              <Descriptions.Item label="请求body" span={2}>
                {
                  response.request_data ? <SyntaxHighlighter language='json' style={vs2015}>
                    {response.request_data}
                  </SyntaxHighlighter> : null
                }
              </Descriptions.Item>
              <Descriptions.Item label="请求headers" span={2}>
                <HeaderTable headers={JSON.stringify(response.request_header)} size="small"/>
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
          <TabPane tab="执行日志" key="2">
            <CodeEditor
              language="text"
              value={response.logs}
              height="45vh"
            />
          </TabPane>
          <TabPane tab="断言" key="3">
            <Table
              columns={assertTable}
              dataSource={getSource()}
              size="small"
              pagination={false}
            />
          </TabPane>
          <TabPane tab="Response" key="4">
            <CodeEditor
              value={response.response ? JSON.stringify(response.response, null, 2) : ''}
              height="45vh"
            />
          </TabPane>
          <TabPane tab="Cookie" key="5">
            <Table
              columns={resColumns}
              dataSource={toTable('cookies')}
              size="small"
              pagination={false}
            />
          </TabPane>
          <TabPane tab="Response Headers" key="6">
            <Table
              columns={resColumns}
              dataSource={toTable('response_header')}
              size="small"
              pagination={false}
            />
          </TabPane>
        </Tabs>
      </Row>
    </Modal>
  )
}
