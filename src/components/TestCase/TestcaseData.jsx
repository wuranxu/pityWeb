import {connect} from "umi";
import {Alert, Button, Card, Col, Divider, Modal, Row, Table} from "antd";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import FormForModal from "@/components/PityForm/FormForModal";
import JSONAceEditor from "@/components/CodeEditor/AceEditor/JSONAceEditor";
import NoRecord from "@/components/NotFound/NoRecord";

const TestcaseData = ({caseId, testcase, loading, dispatch, currentEnv}) => {

  const {testData} = testcase;
  const [pagination, setPagination] = useState({current: 1, total: 0, pageSize: 5})
  const [dataSource, setDataSource] = useState([]);
  const [record, setRecord] = useState({});
  const [modal, setModal] = useState(false);
  const [editor, setEditor] = useState(null);

  useEffect(async () => {
    const current = parseInt(currentEnv, 10);
    const temp = testData[current]
    if (temp) {
      setDataSource([...temp]);
      setPagination({...pagination, current: 1, total: temp.length})
    } else {
      setDataSource([]);
      setPagination({...pagination, current: 1, total: 0})
    }

  }, [currentEnv, testData])

  const onDeleteTestData = async id => {
    const res = await dispatch({
      type: "testcase/deleteTestcaseData",
      payload: {
        id,
      }
    })
    if (res) {
      const newData = {...testData};
      const temp = newData[parseInt(currentEnv, 10)]
      newData[parseInt(currentEnv, 10)] = temp.filter(item => item.id !== id)
      await dispatch({
        type: 'testcase/save',
        payload: {
          testData: newData,
        }
      })
    }
  }


  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: '场景名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '测试数据',
      dataIndex: 'json_data',
      key: 'json_data',
      ellipse: true,
    },
    {
      title: '操作',
      key: 'ops',
      render: (_, record) => <>
        <a onClick={() => {
          setRecord(record)
          setModal(true);
        }}>编辑</a>
        <Divider type="vertical"/>
        <a onClick={() => {
          Modal.confirm({
            title: '你确定要删除这条测试数据吗?',
            icon: <ExclamationCircleOutlined/>,
            content: '删除后不可恢复，请谨慎~',
            okText: '确定',
            okType: 'danger',
            cancelText: '点错了',
            onOk: async () => {
              await onDeleteTestData(record.id)
            },
          });
        }}>删除</a>
      </>
    },

  ]

  const onFinish = async values => {
    let result;
    if (!record.id) {
      // 新增
      result = await dispatch({
        type: "testcase/insertTestcaseData",
        payload: {
          case_id: caseId,
          env: currentEnv,
          ...values,
        }
      })
    } else {
      result = await dispatch({
        type: 'testcase/updateTestcaseData',
        payload: {
          id: record.id,
          case_id: caseId,
          env: currentEnv,
          ...values,
        }
      })
    }
    if (result) {
      setModal(false);
    }

  }

  const fields = [
    {
      name: 'name',
      label: '测试场景',
      required: true,
      type: 'input',
      placeholder: '请输入测试场景',
      initialValue: record.name,
    },
    {
      name: 'json_data',
      label: 'JSON数据',
      required: true,
      placeholder: '请输入测试场景',
      initialValue: record.name,
      component: <JSONAceEditor height={200} setEditor={setEditor} theme="material-one-dark"/>
    },
  ]

  return (
    <Row gutter={8}>
      <FormForModal title="测试数据" record={record} onCancel={() => {
        setModal(false)
      }} left={4} right={20} width={650}
                    visible={modal} onFinish={onFinish} fields={fields}>
        <Alert closable type="info" style={{marginBottom: 12}} message="数据管理接受一串key-value的数据，供大家在case里面使用这些变量，用${变量}的方式。" showIcon/>
      </FormForModal>
      <Col span={24}>
        <Card bordered={false}>
          <Row gutter={8}>
            <Col span={6}>
              <Button type="primary" onClick={() => {
                setModal(true)
                setRecord({})
              }}><PlusOutlined/> 添加数据</Button>
            </Col>
          </Row>
          <Row gutter={8} style={{marginTop: 12}}>
            <Col span={24}>
              <Table columns={columns} pagination={pagination} rowKey={record => record.id}
                     loading={loading.effects['testcase/insertTestcaseData'] || loading.effects['testcase/updateTestcaseData'] ||
                     loading.effects['testcase/deleteTestcaseData']
                     }
                     dataSource={dataSource} size="small" locale={{emptyText: <NoRecord height="150"/>}}
                     onChange={pg => setPagination({...pagination, current: pg.current})}/>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )

}

export default connect(({testcase, loading}) => ({testcase, loading}))(TestcaseData);
