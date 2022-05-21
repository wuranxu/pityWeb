import {connect} from 'umi';
import React, {useEffect, useState} from "react";
import {Col, Form, Row} from "antd";
import TestCaseEditor from "@/components/TestCase/TestCaseEditor";
import TestResult from "@/components/TestCase/TestResult";
import ConstructorModal from "@/components/TestCase/ConstructorModal";
import "./TestCaseComponent.less";
import common from "@/utils/common";


const AddTestCaseComponent = ({
                                loading,
                                listTestcase,
                                dispatch,
                                user,
                                testcase,
                                gconfig,
                                directory_id,
                                setAddCaseVisible
                              }) => {
  const {
    caseInfo,
    editing,
    constructRecord,
    constructorModal,
    asserts,
    testData,
    preConstructor,
    outParameters,
    postConstructor
  } = testcase;
  const [resultModal, setResultModal] = useState(false);
  const [testResult, setTestResult] = useState({});
  const [form] = Form.useForm();
  const [constructorForm] = Form.useForm();
  const [body, setBody] = useState('');
  const [bodyType, setBodyType] = useState(0);
  const [headers, setHeaders] = useState([]);
  const [formData, setFormData] = useState([]);
  const [suffix, setSuffix] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'testcase/queryTestcaseDirectory',
      payload: {
        directory_id,
      }
    })

    // 获取环境信息
    dispatch({
      type: 'gconfig/fetchEnvList',
      payload: {
        page: 1,
        exactly: true // 全部获取
      }
    })

    dispatch({
      type: 'user/fetchUserList'
    })
  }, [])

  useEffect(() => {
    setHeaders(common.parseHeaders(caseInfo.request_headers))
    setBody(caseInfo.body);
    setBodyType(caseInfo.body_type)
  }, [caseInfo, editing])

  const filterOutParameters = () => {
    return outParameters.filter(v => {
      if (v.id) {
        return true;
      }
      if (v.source === 4) {
        return v.name;
      }
      return !(!v.match_index || !v.name || !v.expression);
    })

  }


  const onSubmit = async (isCreate = false) => {
    const values = await form.validateFields()
    const params = {
      ...values,
      request_type: parseInt(values.request_type, 10),
      status: parseInt(values.status, 10),
      tag: values.tag ? values.tag.join(',') : null,
      directory_id,
      body_type: bodyType,
      request_headers: common.translateHeaders(headers),
      body: bodyType === 2 ? JSON.stringify(formData) : body,
    };
    // if (!editing && !isCreate) {
    //   params.priority = caseInfo.priority;
    //   params.name = caseInfo.name;
    //   params.status = caseInfo.status;
    //   params.tag = caseInfo.tag !== null ? typeof caseInfo.tag === 'object' ?
    //     caseInfo.tag.join(',') : caseInfo.tag ? caseInfo.tag : null : null;
    //   params.request_type = caseInfo.request_type;
    // }
    let tempData = []
    Object.values(testData).forEach(v => {
      tempData = tempData.concat(v)
    })
    const data = {
      "case": params,
      "asserts": asserts,
      "data": tempData,
      "constructor": [...preConstructor, ...postConstructor],
      "out_parameters": filterOutParameters(),
    }
    const res = await dispatch({
      type: 'testcase/createTestCase',
      payload: data
    })
    if (res) {
      setAddCaseVisible(false);
      listTestcase()
    }
  }

  return (
    <>
      <TestResult width={1000} modal={resultModal} setModal={setResultModal} response={testResult}
                  caseName={caseInfo.name} single={false}/>
      <Row>
        <Col span={24}>
          <ConstructorModal width={1100} modal={constructorModal} setModal={e => {
            dispatch({type: 'testcase/save', payload: {constructorModal: e}})
          }} form={constructorForm} record={constructRecord} createMode
                            suffix={suffix}/>
          <TestCaseEditor directoryId={directory_id} form={form} body={body} setBody={setBody}
                          create
                          formData={formData} setFormData={setFormData}
                          bodyType={bodyType} setBodyType={setBodyType} setSuffix={setSuffix}
                          headers={headers} setHeaders={setHeaders} onSubmit={onSubmit}/>
        </Col>
      </Row>
    </>
  )
}

export default connect((
  {
    user, testcase, loading, gconfig
  }
) => (
  {
    testcase, user, loading, gconfig
  }
))(AddTestCaseComponent);
