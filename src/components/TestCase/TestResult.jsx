import {Badge, Descriptions, Drawer, Row, Table, Tabs} from "antd";
import React, {useEffect, useState} from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import {vs2015} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import TreeXmind from "@/components/G6/TreeXmind";
import {queryXmindData} from "@/services/testcase";
import auth from "@/utils/auth";
import NoRecord from "@/components/NotFound/NoRecord";
import {IconFont} from "@/components/Icon/IconFont";
import JSONAceEditor from "@/components/CodeEditor/AceEditor/JSONAceEditor";
import PityAceEditor from "@/components/CodeEditor/AceEditor";

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
export default ({response, caseName, width, modal, setModal, single = true}) => {

  const [xmindData, setXmindData] = useState(null);
  const [xmindDataList, setXmindDataList] = useState([]);
  const [graph, setGraph] = useState({});
  const [editor, setEditor] = useState(null);

  const getBrain = async (case_id = response.case_id, single = true) => {
    const res = await queryXmindData({case_id})
    if (auth.response(res)) {
      if (single) {
        setXmindData(res.data)
      } else {
        const temp = Object.keys(response).map(k => res.data)
        setXmindDataList(temp)
      }
    }
  }

  const getResponse = async () => {
    if (single) {
      if (response.case_id !== undefined) {
        await getBrain();
      }
    } else {
      for (const key of Object.keys(response)) {
        if (response[key].case_id !== undefined) {
          await getBrain(response[key].case_id, false);
        }
        return
      }
    }
  }

  useEffect(() => {
    getResponse()
  }, [response])

  const toTable = (field, resp = response) => {
    if (resp[field] === null || resp[field] === undefined || resp[field] === '{}') {
      return [];
    }
    const temp = JSON.parse(resp[field]);
    return Object.keys(temp).map((key) => ({
      key,
      value: temp[key],
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

  const getSource = (res = response) => {
    if (res.asserts === undefined || !res.asserts) {
      return [];
    }
    const temp = JSON.parse(res.asserts)
    const result = [];
    Object.keys(temp).forEach(k => {
      if (typeof temp[k].msg === "string") {
        result.push({
          status: temp[k].status,
          msg: temp[k].msg,
        })
      } else {
        temp[k].msg.forEach(v => {
          result.push({
            status: temp[k].status,
            msg: v,
          })
        })
      }
    })
    return result;
  }

  return (
    <Drawer title={<span>[<strong>{caseName}</strong>] 执行详情</span>} width={width || 1000}
            open={modal} placement="right"
            onClose={() => setModal(false)}>
      <Row gutter={[8, 8]}>
        {
          !single ? <Tabs style={{width: '100%', minHeight: 460}}>
            {
              Object.keys(response).map((name, index) => <TabPane tab={name} key={index.toString()}>
                <Tabs style={{width: '100%'}} tabPosition="left">
                  <TabPane tab={<span><IconFont type="icon-yongliliebiao"/>基本信息</span>} key="1">
                    <Descriptions column={2} bordered size="middle">
                      <Descriptions.Item label="测试结果">
                        <Badge status={response[name].status ? "success" : "error"}
                               text={response[name].status ? "成功" : "失败"}/>
                      </Descriptions.Item>
                      <Descriptions.Item label="请求方式">
                        {response[name].request_method}
                      </Descriptions.Item>
                      <Descriptions.Item label="HTTP状态码">
                  <span
                    style={{
                      color: STATUS[response[name].status_code] ? STATUS[response[name].status_code].color : '#F56C6C',
                      marginLeft: 8,
                      marginRight: 8,
                    }}
                  >
                    {response[name].status_code}{' '}
                    {STATUS[response[name].status_code] ? STATUS[response[name].status_code].text : ''}
                  </span>
                      </Descriptions.Item>
                      <Descriptions.Item label="执行时间">
                  <span style={{marginLeft: 8, marginRight: 8}}>
                    <span style={{color: '#67C23A'}}>{response[name].cost}</span>
                  </span>
                      </Descriptions.Item>
                      <Descriptions.Item label="请求url" span={2}>
                        {response[name].url}
                      </Descriptions.Item>
                      <Descriptions.Item label="请求body" span={2}>
                        {
                          response[name].request_data ? <SyntaxHighlighter language='json' style={vs2015}>
                            {response[name].request_data}
                          </SyntaxHighlighter> : <NoRecord height={120}/>
                        }
                      </Descriptions.Item>
                    </Descriptions>
                  </TabPane>
                  <TabPane tab={<span><IconFont type="icon-duanyan"/>断言</span>} key="3">
                    <Table
                      columns={assertTable}
                      dataSource={getSource(response[name])}
                      size="small"
                      pagination={false}
                    />
                  </TabPane>
                  <TabPane tab={<span><IconFont type="icon-rizhi"/>执行日志</span>} key="2">
                    <PityAceEditor
                      language="html"
                      setEditor={setEditor}
                      readOnly={true}
                      value={response[name]?.logs}
                      height="80vh"
                    />
                    {/*<div style={{height: '80vh', overflow: 'auto'}}>*/}
                    {/*  <SyntaxHighlighter language='html' style={vs2015}>*/}
                    {/*    {response[name].logs}*/}
                    {/*  </SyntaxHighlighter>*/}
                    {/*</div>*/}
                  </TabPane>
                  <TabPane tab={<span><IconFont type="icon-header"/>Request Headers</span>} key="5">
                    <Table
                      columns={resColumns}
                      dataSource={toTable('request_headers', response[name])}
                      size="small"
                      pagination={false}
                    />
                  </TabPane>
                  <TabPane tab={<span><IconFont type="icon-cookies-1"/>Cookie</span>} key="6">
                    <Table
                      columns={resColumns}
                      dataSource={toTable('cookies', response[name])}
                      size="small"
                      pagination={false}
                    />
                  </TabPane>
                  <TabPane tab={<span><IconFont type="icon-header"/>Response Headers</span>} key="7">
                    <Table
                      columns={resColumns}
                      dataSource={toTable('response_headers', response[name])}
                      size="small"
                      pagination={false}
                    />
                  </TabPane>
                  <TabPane tab={<span><IconFont type="icon-xiangying"/>Response</span>} key="4">
                    <JSONAceEditor
                      setEditor={setEditor}
                      readOnly={true}
                      value={response[name].response ? response[name].response : ''}
                      height="80vh"
                    />
                  </TabPane>
                  <TabPane tab={<span><IconFont type="icon-tounaofengbao"/>脑图</span>} key="8">
                    <div id={`container_${index}`}>
                      <TreeXmind data={xmindDataList[index]} graph={graph[`container_${index}`]} setGraph={setGraph}
                                 container_id={`container_${index}`}/>
                    </div>
                  </TabPane>
                </Tabs>
              </TabPane>)
            }
          </Tabs> : <Tabs style={{width: '100%', minHeight: 460}} tabPosition="left">
            <TabPane tab={<span><IconFont type="icon-yongliliebiao"/>基本信息</span>} key="1">
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
                    <span style={{color: '#67C23A'}}>{response.cost}</span>
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="请求url" span={2}>
                  {response.url}
                </Descriptions.Item>
                <Descriptions.Item label="请求body" span={2}>
                  {
                    response.request_data ? <SyntaxHighlighter language='json' style={vs2015}>
                      {response.request_data}
                    </SyntaxHighlighter> : <NoRecord height={120}/>
                  }
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab={<span><IconFont type="icon-duanyan"/>断言</span>} key="3">
              <Table
                columns={assertTable}
                dataSource={getSource()}
                size="small"
                pagination={false}
              />
            </TabPane>
            <TabPane tab={<span><IconFont type="icon-rizhi"/>执行日志</span>} key="2">
              <PityAceEditor
                language="html"
                setEditor={setEditor}
                readOnly={true}
                value={response.logs}
                height="80vh"
              />
              {/*<div style={{height: '80vh', overflow: 'auto'}}>*/}
              {/*  <SyntaxHighlighter language='html' style={vs2015}>*/}
              {/*    {response.logs}*/}
              {/*  </SyntaxHighlighter>*/}
              {/*</div>*/}
            </TabPane>
            <TabPane tab={<span><IconFont type="icon-header"/>Request Headers</span>} key="5">
              <Table
                columns={resColumns}
                dataSource={toTable('request_headers')}
                size="small"
                pagination={false}
              />
            </TabPane>
            <TabPane tab={<span><IconFont type="icon-cookies-1"/>Cookie</span>} key="6">
              <Table
                columns={resColumns}
                dataSource={toTable('cookies')}
                size="small"
                pagination={false}
              />
            </TabPane>
            <TabPane tab={<span><IconFont type="icon-header"/>Response Headers</span>} key="7">
              <Table
                columns={resColumns}
                dataSource={toTable('response_headers')}
                size="small"
                pagination={false}
              />
            </TabPane>
            <TabPane tab={<span><IconFont type="icon-xiangying"/>Response</span>} key="4">
              <JSONAceEditor
                readOnly={true}
                setEditor={setEditor}
                value={response.response ? response.response : ''}
                height="80vh"
              />
            </TabPane>
            <TabPane tab={<span><IconFont type="icon-tounaofengbao"/>脑图</span>} key="8">
              <div id="container">
                <TreeXmind data={xmindData} graph={graph['container']} setGraph={setGraph}/>
              </div>
            </TabPane>
          </Tabs>
        }
      </Row>
    </Drawer>
  )

}
