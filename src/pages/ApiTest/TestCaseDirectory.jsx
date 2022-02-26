import {PageContainer} from "@ant-design/pro-layout";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Empty,
  Form,
  Input,
  Menu as AMenu,
  message,
  Modal,
  Row,
  Select,
  Spin,
  Table,
  Tag,
  Tooltip,
  Tree
} from "antd";
import {connect} from "umi";
import React, {useEffect, useState} from "react";
import SplitPane from 'react-split-pane';
import "./TestCaseDirectory.less";
import {
  DeleteOutlined,
  DeleteTwoTone,
  DownOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FolderAddTwoTone,
  PlayCircleOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SearchOutlined
} from "@ant-design/icons";
import {Item, Menu, useContextMenu} from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import NoRecord from "@/components/NotFound/NoRecord";
import FormForModal from "@/components/PityForm/FormForModal";
import IconFont from "@/components/Icon/IconFont";
import {CONFIG} from "@/consts/config";
import auth from "@/utils/auth";
import TestResult from "@/components/TestCase/TestResult";
import UserLink from "@/components/Button/UserLink";
import noResult from "@/assets/noResult.svg";

const {Option} = Select;
const {DirectoryTree} = Tree;


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
  const [form] = Form.useForm();
  const [resultModal, setResultModal] = useState(false);
  const [name, setName] = useState('');

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
      title: "#",
      dataIndex: "id",
      key: 'id',
      width: 65,
    },
    {
      title: "用例名称",
      dataIndex: "name",
      key: 'name',
      // 自动省略多余数据
      ellipsis: true,
    },
    {
      title: "请求类型",
      dataIndex: "request_type",
      key: 'request_type',
      render: request_type => CONFIG.REQUEST_TYPE[request_type]
    },
    {
      title: "优先级",
      dataIndex: "priority",
      key: 'priority',
      render: priority => <Tag color={CONFIG.CASE_TAG[priority]}>{priority}</Tag>
    },
    {
      title: "用例状态",
      dataIndex: "status",
      key: 'status',
      render: status => <Badge {...CONFIG.CASE_BADGE[status]} />
    },
    {
      title: "创建人",
      dataIndex: "create_user",
      key: 'create_user',
      width: 100,
      render: create_user => <UserLink user={userMap[create_user]}/>
    },
    {
      title: "更新时间",
      dataIndex: "updated_at",
      key: 'updated_at',
      width: 180,
    },
    {
      title: '操作',
      dataIndex: 'ops',
      width: 130,
      key: 'ops',
      render: (_, record) => <>
        <a href={`/#/apiTest/testcase/${currentDirectory[0]}/${record.id}`} target="_blank">详情</a>
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
        payload: {project_id}
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

  useEffect(async () => {
    await listTestcase();
  }, [currentDirectory])

  const save = data => {
    dispatch({
      type: 'project/save',
      payload: data,
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
      listTestcaseTree();
    }
  }

  const {show} = useContextMenu({
    id: "directory",
  });

  const onDeleteDirectory = async () => {
    const res = await dispatch({
      type: 'testcase/deleteTestcaseDirectory',
      payload: {id: currentNode},
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

  const handleItemClick = key => {
    if (key === 1) {
      // 新增目录
      setModalTitle("新增目录");
      setRecord({name: ''})
      setRootModal(true)
    } else if (key === 2) {
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
        async onOk() {
          await onDeleteDirectory();
        },
      });
    }
  };

  function handleContextMenu(event) {
    event.preventDefault();
    show(event, {
      props: {
        key: 'value'
      }
    })
  }

  const fields = [
    {
      name: 'name',
      label: '目录名称',
      required: true,
      placeholder: "请输入目录名称, 不超过18个字符",
      type: 'input',
    }
  ];

  const getProject = () => {
    if (projects.length === 0) {
      return 'loading...'
    }
    return projects.filter(p => p.id === project_id)[0]
  }

  const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
  };


  return (
    <PageContainer title="接口用例管理" breadcrumb={null}>
      <TestResult width={1000} modal={resultModal} setModal={setResultModal} response={testResult}
                  caseName={name} single={false}/>
      <Row gutter={16}>
        <FormForModal title={modalTitle} onCancel={() => setRootModal(false)}
                      fields={fields} onFinish={onCreateDirectory} record={record}
                      visible={rootModal} left={6} right={18} width={400} formName="root"

        />
        <SplitPane className="pitySplit" split="vertical" minSize={260} defaultSize={360} maxSize={800}>
          <div>
            <Card title={
              <Row gutter={8}>
                <Col span={18}>
                  {
                    editing ? <Select style={{marginLeft: 32, width: 120}} showSearch
                                      placeholder="请选择项目" value={project_id} autoFocus={true}
                                      onChange={e => {
                                        save({project_id: e})
                                        setEditing(false);
                                      }}
                                      filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                      }>
                      {projects.map(v => <Option value={v.id}>{v.name}</Option>)}
                    </Select> : <>
                      <Avatar style={{marginLeft: 8, marginRight: 6}}
                              src={getProject().avatar || `https://api.prodless.com/avatar.png`}/>
                      <a onClick={() => setEditing(true)}>{getProject().name}</a>
                      <IconFont type="icon-qiehuan2" onClick={() => setEditing(true)}
                                style={{fontSize: 15, marginLeft: 8}}/>
                    </>
                  }
                </Col>
                <Col span={6}>
                  <Tooltip title="新建根目录">
                    <FolderAddTwoTone
                      onClick={() => {
                        setRootModal(true)
                        setRecord({name: ''})
                        setModalTitle("新建根目录");
                        setCurrentNode(null);
                      }}
                      style={{
                        float: "right",
                        fontSize: 22,
                        lineHeight: '32px',
                        margin: '0 8px',
                        cursor: 'pointer'
                      }}
                      twoToneColor="#67C23A"/>
                  </Tooltip>
                </Col>
              </Row>}
                  bodyStyle={{height: 550, overflow: 'auto'}}
            >
              <Spin spinning={loading.effects['testcase/listTestcaseDirectory']}>
                {directory.length > 0 ?
                  <>
                    <DirectoryTree treeData={directory} onContextMenu={handleContextMenu}
                                   onSelect={keys => {
                                     saveCase({
                                       currentDirectory: keys[0] === currentDirectory[0] ? [] : keys,
                                     })
                                   }}
                                   selectedKeys={currentDirectory}
                                   onRightClick={e => {
                                     setCurrentNode(e.node.key);
                                     setRecord({name: e.node.title, id: e.node.key});
                                   }}/>
                    <Menu id="directory" theme="dark">
                      <Item onClick={() => {
                        handleItemClick(1);
                      }}><PlusOutlined style={{margin: '0 8px', fontSize: 16}}/> 添加目录</Item>
                      <Item onClick={() => {
                        handleItemClick(2);
                      }}><EditOutlined style={{margin: '0 8px', fontSize: 16}}/> 编辑目录</Item>
                      <Item onClick={() => {
                        handleItemClick(3);
                      }}><DeleteTwoTone twoToneColor="#F56C6C" style={{margin: '0 8px', fontSize: 16}}/> <span
                        style={{color: '#F56C6C'}}>删除目录</span></Item>
                    </Menu>
                  </> : <NoRecord height={180} desc="暂无数据，点击绿色文件夹『添加』一个吧~"/>
                }
              </Spin>
            </Card>
          </div>
          <div>
            <Card bodyStyle={{minHeight: 615, overflow: 'auto'}}>
              <Form form={form}>
                <Row gutter={6}>
                  <Col span={8}>
                    <Form.Item label="用例名称"  {...layout} name="name">
                      <Input placeholder="输入用例名称"/>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="创建人"  {...layout} name="create_user">
                      <Select placeholder="选择创建用户" allowClear>
                        {userList.map(v => <Option key={v.id} value={v.id}><Avatar size="small"
                                                                                   src={v.avatar || CONFIG.AVATAR_URL + v.name}/> {v.name}
                        </Option>)}
                      </Select>
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
                <Row gutter={8} style={{marginTop: 4}}>
                  <Col span={24}>
                    <Button type="primary" onClick={() => {
                      if (!currentDirectory[0]) {
                        message.info("请先创建或选择用例目录~")
                        return;
                      }
                      window.open(`/#/apiTest/testcase/${currentDirectory[0]}/add`)
                    }}><PlusOutlined/> 添加用例</Button>
                    {selectedRowKeys.length > 0 ?
                      <Dropdown overlay={menu()} trigger={['hover']}>
                        <Button style={{marginLeft: 8}} icon={<PlayCircleOutlined/>} onClick={(e) => {
                          e.stopPropagation()
                        }}>执行用例 <DownOutlined/></Button>
                      </Dropdown>
                      : null}
                    {selectedRowKeys.length > 0 ?
                      <Button type="primary" danger style={{marginLeft: 8}} icon={<DeleteOutlined/>}
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
                           pagination={pagination} size="small"
                           onChange={pg => {
                             saveCase({pagination: {...pagination, current: pg.current}})
                           }}
                           dataSource={testcases}
                           loading={loading.effects['testcase/listTestcase'] || loading.effects['testcase/executeTestcase']}/>
                  </Col>
                </Row>
              </Form>
            </Card>
          </div>
        </SplitPane>
      </Row>
    </PageContainer>
  )
}

export default connect(({testcase, gconfig, project, user, loading}) => ({
  loading,
  gconfig,
  user,
  project,
  testcase,
}))(TestCaseDirectory)
