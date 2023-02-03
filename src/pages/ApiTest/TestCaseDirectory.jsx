import {PageContainer} from "@ant-design/pro-components";
import {REQUEST_TYPE} from '@/components/Common/global';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Form,
  Input,
  Menu as AMenu,
  message,
  Modal,
  Result,
  Row,
  Select,
  Spin,
  Table,
  Tag,
  Tooltip,
  TreeSelect
} from "antd";
import {connect} from "@umijs/max";
import React, {memo, useEffect, useState} from "react";
import SplitPane from 'react-split-pane';
import "./TestCaseDirectory.less";
import {
  CameraTwoTone,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  ExportOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  RocketOutlined,
  SearchOutlined
} from "@ant-design/icons";
import 'react-contexify/dist/ReactContexify.css';
import NoRecord from "@/components/NotFound/NoRecord";
import FormForModal from "@/components/PityForm/FormForModal";
import CONFIG from "@/consts/config";
import auth from "@/utils/auth";
import TestResult from "@/components/TestCase/TestResult";
import UserLink from "@/components/Button/UserLink";
import noResult from "@/assets/NoData.svg";
import UserSelect from "@/components/User/UserSelect";
import SearchTree from "@/components/Tree/SearchTree";
import ScrollCard from "@/components/Scrollbar/ScrollCard";
import emptyWork from "@/assets/emptyWork.svg";
import AddTestCaseComponent from "@/pages/ApiTest/AddTestCaseComponent";
import RecorderDrawer from "@/components/TestCase/recorder/RecorderDrawer";
import {Switch} from "@icon-park/react";

const {Option} = Select;


const TestCaseDirectory = ({testcase, gconfig, project, user, loading, dispatch}) => {

  const {projects, project_id} = project;
  const {envList} = gconfig;
  const {userList, userMap} = user;
  const {directory, currentDirectory, testcases, testResult, selectedRowKeys, pagination} = testcase;
  const [currentNode, setCurrentNode] = useState(null);
  const [rootModal, setRootModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [record, setRecord] = useState({});
  const [modalTitle, setModalTitle] = useState('新建目录');
  const [addCaseVisible, setAddCaseVisible] = useState(false);
  const [form] = Form.useForm();
  const [resultModal, setResultModal] = useState(false);
  const [name, setName] = useState('');
  const [moveModal, setMoveModal] = useState(false);
  const [recorderModal, setRecorderModal] = useState(false);

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedRowKeys => {
      saveCase({
        selectedRowKeys
      })
    }
  };

  const execute = async (record, env) => {
    const result = await dispatch({
      type: 'testcase/executeTestcase',
      payload: {
        case_id: record.id,
        env,
      }
    })
    if (result) {
      setResultModal(true);
      setName(record.name);
    }
  };

  const onExecute = async env => {
    const res = await dispatch({
      type: 'testcase/executeSelectedCase',
      payload: {
        case_list: selectedRowKeys,
        env,
      }
    })
    if (auth.response(res)) {
      Modal.confirm({
        title: '用例正在后台执行, 去报告页面查看任务状态🔔',
        icon: <QuestionCircleOutlined/>,
        onOk() {
          window.open(`/#/record/list`)
        },
        onCancel() {
        },
      });
    }
  }

  const menu = record => (
    envList.length === 0 ?
      <Card>
        <div>
          <Empty image={noResult} imageStyle={{height: 90, width: 90, margin: '0 auto'}}
                 description={<p>还没有任何环境, 去<a href="/#/config/environment" target="_blank">添加一个</a>?</p>}/>
        </div>
      </Card> :
      <AMenu>
        {envList.map(item => <AMenu.Item key={item.id}>
          <a onClick={async () => {
            if (record) {
              await execute(record, item.id)
            } else {
              await onExecute(item.id)
            }
          }}>{item.name}</a>
        </AMenu.Item>)}
      </AMenu>
  );

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: 'name',
      // 自动省略多余数据
      ellipsis: true,
    },
    {
      title: "请求协议",
      dataIndex: "request_type",
      key: 'request_type',
      width: 110,
      render: request_type => REQUEST_TYPE[request_type]
    },
    {
      title: "优先级",
      dataIndex: "priority",
      key: 'priority',
      width: 90,
      render: priority => <Tag color={CONFIG.CASE_TAG[priority]}>{priority}</Tag>
    },
    {
      title: "状态",
      dataIndex: "status",
      key: 'status',
      width: 110,
      render: status => <Badge {...CONFIG.CASE_BADGE[status]} />
    },
    {
      title: "创建人",
      dataIndex: "create_user",
      key: 'create_user',
      width: 160,
      ellipsis: true,
      render: create_user => <UserLink user={userMap[create_user]}/>
    },
    {
      title: "更新时间",
      dataIndex: "updated_at",
      key: 'updated_at',
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'ops',
      width: 130,
      key: 'ops',
      render: (_, record) => <>
        <a href={`/#/apiTest/testcase/${currentDirectory[0]}/${record.id}`}>详情</a>
        <Divider type="vertical"/>
        <Dropdown overlay={menu(record)}>
          <a onClick={e => {
            e.stopPropagation();
          }}>执行 <DownOutlined/></a>
        </Dropdown>
      </>
    }
  ]

  const listProjects = () => {
    dispatch({
      type: 'project/listProject',
    })
  }

  const listTestcaseTree = () => {
    if (project_id) {
      dispatch({
        type: 'testcase/listTestcaseDirectory',
        payload: {project_id, move: true}
      })
    }
  }

  const listUsers = () => {
    dispatch({
      type: 'user/fetchUserList'
    })
  }

  const listEnv = () => {
    dispatch({
      type: 'gconfig/fetchEnvList'
    })
  }

  const listTestcase = async () => {
    const values = await form.getFieldsValue();
    if (currentDirectory.length > 0) {
      dispatch({
        type: 'testcase/listTestcase',
        payload: {
          directory_id: currentDirectory[0],
          name: values.name || '',
          create_user: values.create_user !== null && values.create_user !== undefined ? values.create_user : '',
        },
      })
    }
  }

  useEffect(() => {
    listProjects();
    listUsers();
    listEnv();
  }, [])

  useEffect(() => {
    listTestcaseTree();
  }, [project_id])

  useEffect(() => {
    listTestcase();
  }, [currentDirectory])

  const save = data => {
    dispatch({
      type: 'project/save',
      payload: data,
    })
    dispatch({
      type: 'testcase/save',
      payload: {currentDirectory: []}
    })
    // 把项目id写入localStorage
    localStorage.setItem("project_id", data.project_id)
  }

  const saveCase = data => {
    dispatch({
      type: 'testcase/save',
      payload: data,
    })
  }

  const onCreateDirectory = async values => {
    const params = {
      name: values.name,
      project_id,
      parent: currentNode,
    }
    let result;
    if (record.id) {
      result = await dispatch({
        type: 'testcase/updateTestcaseDirectory',
        payload: {...params, id: record.id},
      })
    } else {
      result = await dispatch({
        type: 'testcase/insertTestcaseDirectory',
        payload: params,
      })
    }
    if (result) {
      setRootModal(false);
      saveCase({
        selectedRowKeys: []
      })
      listTestcaseTree();
    }
  }

  const onMove = async values => {
    const res = await dispatch({
      type: 'testcase/moveTestCaseToDirectory',
      payload: {
        id_list: selectedRowKeys,
        directory_id: values.directory_id,
        project_id,
      },
    })
    if (res) {
      setMoveModal(false);
      saveCase({
        selectedRowKeys: []
      })
      listTestcase();
    }
  }

  const onDeleteDirectory = async key => {
    const res = await dispatch({
      type: 'testcase/deleteTestcaseDirectory',
      payload: {id: key},
    })
    if (res) {
      listTestcaseTree();
    }
  }

  const onDeleteTestcase = async () => {
    const res = await dispatch({
      type: 'testcase/deleteTestcase',
      payload: selectedRowKeys,
    })
    if (res) {
      listTestcase();
    }
  }

  const onMoveTestCase = () => {
    setMoveModal(true);
  }

  const handleItemClick = (key, node) => {
    if (key === 1) {
      // 新增目录
      setCurrentNode(node.key)
      setModalTitle("新增目录");
      setRecord({name: ''})
      setRootModal(true)
    } else if (key === 2) {
      setRecord({name: node.title.props.children[2], id: node.key});
      setModalTitle("编辑目录");
      setRootModal(true)
    } else if (key === 3) {
      Modal.confirm({
        title: '你确定要删除这个目录吗?',
        icon: <ExclamationCircleOutlined/>,
        content: '删除后，目录下的case也将不再可见！！！',
        okText: '确定',
        okType: 'danger',
        cancelText: '点错了',
        onOk() {
          onDeleteDirectory(node.key);
        },
      });
    }
  };

  const fields = [
    {
      name: 'name',
      label: '目录名称',
      required: true,
      placeholder: "请输入目录名称, 不超过18个字符",
      type: 'input',
    }
  ];

  const moveFields = [
    {
      name: 'directory_id',
      label: '目标目录',
      required: true,
      placeholder: "请选择要移动到的目录",
      type: 'select',
      component: <TreeSelect treeData={directory} showSearch treeDefaultExpandAll/>
    }
  ]

  const getProject = () => {
    if (projects.length === 0) {
      return 'loading...'
    }
    const filter_project = projects.filter(p => p.id === project_id)
    if (filter_project.length === 0) {
      save({project_id: projects[0].id})
      return projects[0]
    }
    return filter_project[0]
  }

  const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
  };

  // menu
  const content = node => <AMenu>
    <AMenu.Item key="1">
      <a onClick={e => {
        e.stopPropagation();
        handleItemClick(2, node)
      }}><EditOutlined/> 编辑目录</a>
    </AMenu.Item>
    <AMenu.Item key="2" danger>
      <a onClick={e => {
        e.stopPropagation();
        handleItemClick(3, node)
      }}><DeleteOutlined/> 删除目录</a>
    </AMenu.Item>
  </AMenu>

  const AddDirectory = <Tooltip title="点击可新建根目录, 子目录需要在树上新建">
    <a className="directoryButton" onClick={() => {
      setRootModal(true)
      setRecord({name: ''})
      setModalTitle("新建根目录");
      setCurrentNode(null);
    }}>
      <PlusOutlined/>
    </a>
  </Tooltip>

  const onAddTestCase = () => {
    if (!currentDirectory[0]) {
      message.info("请先创建或选择用例目录~")
      return;
    }
    setAddCaseVisible(true)
    dispatch({
      type: 'testcase/save',
      payload: {
        asserts: [],
        postConstructor: [],
        preConstructor: [],
        outParameters: [{key: 0, source: 1}],
        caseInfo: {},
        testData: {},
      }
    })
  }

  const AddCaseMenu = <AMenu>
    <AMenu.Item key="1">
      <a onClick={() => {
        onAddTestCase()
      }}><RocketOutlined/> 普通用例</a>
    </AMenu.Item>
    <AMenu.Item key="2">
      <a onClick={() => setRecorderModal(true)}><CameraTwoTone/> 录制用例<Tag color="red" style={{
        fontSize: 12,
        margin: '0 4px',
        lineHeight: '12px',
        padding: 2
      }}>新</Tag></a>
    </AMenu.Item>
  </AMenu>

  return (
    <PageContainer title={false} breadcrumb={null}>
      <TestResult width={1000} modal={resultModal} setModal={setResultModal} response={testResult}
                  caseName={name} single={false}/>
      <FormForModal title="移动用例" onCancel={() => setMoveModal(false)}
                    fields={moveFields} onFinish={onMove}
                    open={moveModal} left={6} right={18} width={500} formName="move"/>
      {
        projects.length === 0 ? <Result status="404"
                                        subTitle={<span>你还没有添加任何项目, <a target="_blank"
                                                                                 href="/#/apiTest/project">添加项目</a>后才能编写Case</span>}/> :

          <Card style={{height: '100%', minHeight: 600}} bodyStyle={{padding: 0}} bordered={false}>
            <Row>
              <FormForModal title={modalTitle} onCancel={() => setRootModal(false)}
                            fields={fields} onFinish={onCreateDirectory} record={record}
                            open={rootModal} left={6} right={18} width={400} formName="root"/>
              <Drawer bodyStyle={{padding: 0}} open={addCaseVisible} width={1300} title="添加用例"
                      onClose={() => setAddCaseVisible(false)} maskClosable={false}>
                <AddTestCaseComponent listTestcase={listTestcase} directory_id={currentDirectory[0]}
                                      setAddCaseVisible={setAddCaseVisible}/>
              </Drawer>
              <RecorderDrawer directory={directory} open={recorderModal} setVisible={setRecorderModal}/>
              <SplitPane className="pitySplit" split="vertical" minSize={260} defaultSize={300} maxSize={800}>
                <ScrollCard className="card" hideOverflowX={true}>
                  <Row gutter={8}>
                    <Col span={24}>
                      <div style={{height: 40, lineHeight: '40px'}}>
                        {
                          editing ? <Select style={{marginLeft: 32, width: 150}} showSearch allowClear
                                            placeholder="请选择项目" value={project_id} autoFocus={true}
                                            onChange={e => {
                                              if (e !== undefined) {
                                                save({project_id: e})
                                              }
                                              setEditing(false);
                                            }}
                                            filterOption={(input, option) =>
                                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }>
                              {projects.map(v => <Option key={v.id} value={v.id}>{v.name}</Option>)}
                            </Select> :
                            <div onClick={() => setEditing(true)}>
                              <Avatar style={{marginLeft: 8, marginRight: 6}} size="large"
                                      src={getProject().avatar || CONFIG.PROJECT_AVATAR_URL}/>
                              <span style={{
                                display: 'inline-block',
                                marginLeft: 12,
                                fontWeight: 400,
                                fontSize: 14
                              }}>{getProject().name}</span>
                              <Switch style={{marginLeft: 12, cursor: 'pointer', lineHeight: '40px'}}
                                      theme="outline" size="16" fill="#7ed321"/>
                            </div>
                        }
                      </div>
                    </Col>
                  </Row>
                  <div style={{marginTop: 24}}>
                    <Spin spinning={loading.effects['testcase/listTestcaseDirectory']}>
                      {directory.length > 0 ?
                        <SearchTree treeData={directory} menu={content}
                                    addDirectory={AddDirectory}
                                    onSelect={keys => {
                                      saveCase({
                                        currentDirectory: keys[0] === currentDirectory[0] ? [] : keys,
                                        selectedRowKeys: [],
                                      })
                                    }} onAddNode={node => {
                          setCurrentNode(node.key)
                          handleItemClick(1, node)
                        }} selectedKeys={currentDirectory}
                        />
                        : <NoRecord height={180} desc={<span>
                        还没有目录，<a onClick={() => {
                          setRootModal(true)
                          setRecord({name: ''})
                          setModalTitle("新建根目录");
                          setCurrentNode(null);
                        }}>添加</a>一个吧~
                      </span>}/>
                      }
                    </Spin>
                  </div>
                </ScrollCard>
                <ScrollCard className="card" hideOverflowX={true}>
                  {
                    currentDirectory.length > 0 ? <>
                      <Form form={form}>
                        <Row gutter={6}>
                          <Col span={8}>
                            <Form.Item label="用例名称"  {...layout} name="name">
                              <Input placeholder="输入用例名称"/>
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item label="创建人"  {...layout} name="create_user">
                              <UserSelect users={userList} placeholder="请选择创建用户"/>
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <div style={{float: 'right'}}>
                              <Button type="primary" onClick={async () => {
                                await listTestcase();
                              }}><SearchOutlined/> 查询</Button>
                              <Button style={{marginLeft: 8}} onClick={async () => {
                                form.resetFields();
                                await listTestcase();
                              }}><ReloadOutlined/> 重置</Button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                      <Row gutter={8} style={{marginTop: 4}}>
                        <Col span={24}>
                          <Dropdown overlay={AddCaseMenu} trigger="click">
                            <Button type="primary"><PlusOutlined/> 添加用例</Button>
                          </Dropdown>
                          {selectedRowKeys.length > 0 ?
                            <Dropdown overlay={menu()} trigger={['hover']}>
                              <Button style={{marginLeft: 8}} icon={<PlayCircleOutlined/>} onClick={(e) => {
                                e.stopPropagation()
                              }}>执行用例 <DownOutlined/></Button>
                            </Dropdown>
                            : null}
                          {selectedRowKeys.length > 0 ?
                            <Button type="dashed" style={{marginLeft: 8}} icon={<ExportOutlined/>}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onMoveTestCase();
                                    }}>移动用例</Button>
                            : null}
                          {selectedRowKeys.length > 0 ?
                            <Button danger style={{marginLeft: 8}} icon={<DeleteOutlined/>}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onDeleteTestcase();
                                    }}>删除用例</Button>
                            : null}
                        </Col>
                      </Row>
                      <Row style={{marginTop: 16}}>
                        <Col span={24}>
                          <Table columns={columns} rowKey={record => record.id} rowSelection={rowSelection}
                                 pagination={pagination}
                                 bordered
                                 onChange={pg => {
                                   saveCase({pagination: {...pagination, current: pg.current}})
                                 }}
                                 dataSource={testcases}
                                 loading={loading.effects['testcase/listTestcase'] || loading.effects['testcase/executeTestcase']}/>
                        </Col>
                      </Row>
                    </> : <Empty image={emptyWork} imageStyle={{height: 230}}
                                 description="快选中左侧的目录畅享用例之旅吧~"/>
                  }
                </ScrollCard>
              </SplitPane>
            </Row>
          </Card>
      }
    </PageContainer>
  )
}

export default connect(({testcase, gconfig, project, user, loading}) => ({
  loading,
  gconfig,
  user,
  project,
  testcase,
}))(memo(TestCaseDirectory))
