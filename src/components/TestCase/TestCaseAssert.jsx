import {Button, Col, Divider, Modal, Row, Table} from "antd";
import {ExclamationCircleOutlined, PlusOutlined} from "@ant-design/icons";
import FormForModal from "@/components/PityForm/FormForModal";
import fields from "@/consts/fields";
import React, {useState} from "react";
import {connect} from 'umi';
import auth from "@/utils/auth";
import NoRecord from "@/components/NotFound/NoRecord";
import {CONFIG} from "@/consts/config";

const TestCaseAssert = ({dispatch, testcase, caseId, createMode}) => {
  const [assertModal, setAssertModal] = useState(false);
  const [record, setRecord] = useState({});

  const {asserts} = testcase;

  const onDeleteAsserts = async record => {
    const res = await dispatch({
      type: 'testcase/deleteTestCaseAsserts',
      payload: {id: record.id}
    })
    if (res) {
      dispatch({
        type: 'testcase/save',
        payload: {
          asserts: asserts.filter(v => v.id !== record.id)
        }
      })
    }
  }

  const onDeleteLocalAsserts = record => {
    const newData = [...asserts]
    newData.splice(record.index, 1)
    dispatch({
      type: 'testcase/save',
      payload: {
        asserts: newData
      }
    })
  }

  const columns = [
    {
      title: '#',
      key: 'index',
      render: (_, record, index) => index+1 ,
    },
    {
      title: '校验内容',
      key: 'name',
      dataIndex: 'name'
    },
    {
      title: '类型',
      key: 'assert_type',
      dataIndex: 'assert_type',
      render: text => CONFIG.ASSERT_TYPE_TAG[text]
    },
    {
      title: '预期结果',
      key: 'expected',
      dataIndex: 'expected',
      ellipse: true,
    },
    {
      title: '实际结果',
      key: 'actually',
      dataIndex: 'actually',
      ellipse: true,
    },
    {
      title: '操作',
      key: 'ops',
      render: (_, record, index) => <>
        <a onClick={() => {
          setAssertModal(true)
          setRecord({...record, index});
        }}>编辑</a>
        <Divider type="vertical"/>
        <a onClick={() => {
          Modal.confirm({
            title: '你确定要删除这条断言数据吗?',
            icon: <ExclamationCircleOutlined/>,
            content: '删除后不可恢复，请谨慎~',
            okText: '确定',
            okType: 'danger',
            cancelText: '点错了',
            onOk: async () => {
              if (createMode) {
                onDeleteLocalAsserts({...record, index})
              } else {
                await onDeleteAsserts(record)
              }
            },
          });
        }}>删除</a>
      </>
    }
  ]

  const onSaveAssert = async values => {
    const data = {case_id: caseId, ...values};
    let res;
    if (createMode) {
      // 说明是本地存储
      let newData;
      if (record.index !== undefined) {
        // 说明是编辑
        newData = [...asserts]
        newData.splice(record.index, 1, {...data})
      } else {
        newData = [...asserts, {...data}]
      }
      await dispatch({
        type: 'testcase/save',
        payload: {
          asserts: newData
        }
      })
      setAssertModal(false);

    } else {
      if (record.id) {
        res = await dispatch({
          type: 'testcase/updateTestCaseAsserts',
          payload: {...data, id: record.id}
        })
        if (auth.response(res, true)) {
          setAssertModal(false);
          const newData = [...asserts];
          const index = newData.findIndex((item) => record.id === item.id);
          const item = newData[index]
          newData.splice(index, 1, {...item, ...res.data});
          await dispatch({
            type: 'testcase/save',
            payload: {
              asserts: newData,
            }
          })
        }
      } else {
        res = await dispatch({
          type: 'testcase/insertTestCaseAsserts',
          payload: data
        })
        if (auth.response(res, true)) {
          setAssertModal(false);
          await dispatch({
            type: 'testcase/save',
            payload: {
              asserts: [...asserts, res.data]
            }
          })
        }
      }
    }


  }

  return (
    <Row gutter={8}>
      <Col span={24}>
        <FormForModal visible={assertModal} fields={fields.CaseAsserts} title='用例断言' left={6} right={18}
                      onFinish={onSaveAssert} onCancel={() => setAssertModal(false)} record={record}/>
        <Row style={{marginBottom: 16}}>
          <Col span={8}>
            <Button type="primary" onClick={() => {
              setAssertModal(true)
              setRecord({})
            }}><PlusOutlined/>添加断言</Button>
          </Col>
        </Row>
        <Table columns={columns} dataSource={asserts} rowKey={record => record.id}
               locale={{emptyText: <NoRecord height={150}/>}}/>
      </Col>
    </Row>
  )
}

export default connect(({testcase, loading}) => ({testcase, loading}))(TestCaseAssert);
