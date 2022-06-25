import {PageContainer} from "@ant-design/pro-layout";
import {
  AndroidOutlined,
  AppleOutlined,
  DownOutlined,
  LaptopOutlined,
  StopOutlined,
  ToolOutlined,
  VideoCameraOutlined,
  VideoCameraTwoTone,
  WindowsOutlined
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  notification,
  Row,
  Select,
  TreeSelect
} from "antd";
import React, {useEffect, useState} from "react";
import {connect} from "umi";
import RequestInfoList from "@/components/TestCase/recorder/RequestInfoList";
import {CONFIG} from "@/consts/config";

const {Option} = Select;

const TestCaseRecorder = ({dispatch, project, recorder, testcase, loading}) => {

  const {
    recordStatus,
    recordLists,
    regex
  } = recorder;

  const {projects} = project;
  const {directory} = testcase;

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [url, setUrl] = useState(regex);
  const [visible, setVisible] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [form] = Form.useForm();

  const rowSelection = {
    selectedRowKeys,
    onChange: keys => {
      setSelectedRowKeys(keys)
    }
  };

  const listTestcaseTree = () => {
    if (projectId) {
      dispatch({
        type: 'testcase/listTestcaseDirectory',
        payload: {project_id: projectId, move: true}
      })
    }
  }

  useEffect(() => {
    dispatch({
      type: 'recorder/queryRecordStatus',
    })
  }, [])

  useEffect(() => {
    setUrl(regex)
  }, [regex])

  useEffect(() => {
    dispatch({
      type: 'project/listProject',
    })
  }, [])

  useEffect(() => {
    setProjectId(null)
    listTestcaseTree()
  }, [projectId])

  const startRecord = () => {
    if (!url) {
      notification.error({
        message: '建议填写过滤url，否则数据会较多'
      })
      return;
    }
    dispatch({
      type: 'recorder/startRecord',
      payload: {
        regex: url
      }
    })
  }

  const stopRecord = () => {
    dispatch({
      type: 'recorder/stopRecord',
    })
  }

  const onGenerateCase = async () => {
    const values = await form.validateFields()
    const res = await dispatch({
      type: 'recorder/generateCase',
      payload: {
        directory_id: values.directory_id,
        name: values.name,
        requests: selectedRowKeys.map(key => ({
          request_headers: JSON.parse(recordLists[key].request_headers),
          response_headers: JSON.parse(recordLists[key].response_headers),
          cookies: JSON.parse(recordLists[key].cookies),
          request_cookies: JSON.parse(recordLists[key].request_cookies),
          response_content: recordLists[key].response_content,
          request_method: recordLists[key].request_method,
          url: recordLists[key].url,
          body: recordLists[key].body,
          status_code: recordLists[key].status_code,
        }))
      }
    })
    if (res) {
      setVisible(false)
      setSelectedRowKeys([])
      notification.success({
        message: "用例生成成功",
        description: <span>点击<a
          href={`/#/apiTest/testcase/${res.data.directory_id}/${res.data.id}`}>链接</a>可跳转至测试用例</span>
      })
    }
  }

  const getDownloadUrl = (cert) => {
    return `${CONFIG.URL}/request/cert?cert=${cert}`
  }

  const menu = <Menu>
    <Menu.Item key="windows"><WindowsOutlined/>
      <a href={getDownloadUrl(0)}> Windows</a>
    </Menu.Item>
    <Menu.Item key="linux"><LaptopOutlined/>
      <a href={getDownloadUrl(1)}> Linux</a>
    </Menu.Item>
    <Menu.Item key="macos"><AppleOutlined/>
      <a href={getDownloadUrl(2)}> Mac OS</a>
    </Menu.Item>
    <Menu.Item key="ios"><AppleOutlined/>
      <a href={getDownloadUrl(3)}> IOS</a>
    </Menu.Item>
    <Menu.Item key="android"><AndroidOutlined/>
      <a href={getDownloadUrl(4)}> Android</a>
    </Menu.Item>
  </Menu>

  return (
    <PageContainer breadcrumb={null}
                   title={<span className="ant-page-header-heading-title">用例录制 <VideoCameraTwoTone/></span>}>
      <Card>
        <Modal title={<span>生成用例 - 已选中{selectedRowKeys.length}条数据</span>} visible={visible}
               onOk={onGenerateCase}
               onCancel={() => setVisible(false)}>
          <Form form={form} {...CONFIG.LAYOUT}>
            <Form.Item label="项目">
              <Select placeholder="请选择项目" onChange={e => {
                setProjectId(e)
              }}>
                {projects.map(v => <Option key={v.id} value={v.id}>{v.name}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item label="用例目录" name="directory_id" rules={[{required: true, message: '请选择用例目录'}]}>
              <TreeSelect placeholder="先选择项目，然后选择你要生成的用例目录" treeLine treeData={directory}/>
            </Form.Item>
            <Form.Item label="用例名称" name="name" rules={[{required: true, message: '请输入用例名称'}]}>
              <Input placeholder="请输入用例名称"/>
            </Form.Item>
          </Form>
        </Modal>
        <Row gutter={12}>
          <Col span={10}>
            <Alert type="info" banner closable message={<span>
            录制接口之前，请先配置好app/web代理<a href="https://docs.mitmproxy.org/stable/overview-getting-started/"
                                    target="_blank" rel="noreferrer"> 参考文档</a>
          </span>}/>
          </Col>
          <Col span={8}>
            <Dropdown overlay={menu}>
              <a onClick={e => e.preventDefault()}>
                下载证书 <DownOutlined/>
              </a>
            </Dropdown>
            <Input placeholder="请输入要匹配的url(正则表达式)" value={url} onChange={e => {
              setUrl(e.target.value)
            }} style={{width: '75%', marginLeft: 12}}/>
          </Col>
          <Col span={6}>
            <Button style={{float: 'right', marginRight: 8}} onClick={() => setVisible(true)}
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
                             dataSource={recordLists} dispatch={dispatch}
                             loading={loading.effects['recorder/queryRecordStatus']}/>
          </Col>
        </Row>
      </Card>
    </PageContainer>)
}

export default connect(({loading, recorder, project, testcase, global}) => ({
  global,
  recorder,
  testcase,
  project,
  loading
}))(TestCaseRecorder);
