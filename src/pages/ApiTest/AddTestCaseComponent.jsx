import {connect} from '@umijs/max';
import React, {useEffect, useState} from "react";
import {Col, Form, Row} from "antd";
import TestCaseEditor from "@/components/TestCase/TestCaseEditor";
import TestResult from "@/components/TestCase/TestResult";
import ConstructorModal from "@/components/TestCase/ConstructorModal";
import "./TestCaseComponent.less";
import common from "@/utils/common";


const AddTestCaseComponent = ({
                                dispatch,
                                testcase,
                                directory_id,
                                bodyType,
                                setBodyType,
                                formData,
                                setFormData,
                                body,
                                setBody,
                                headers,
                                setHeaders,
                                onSubmit,
                                form
                              }) => {
  const {
    caseInfo,
    editing,
    constructRecord,
    constructorModal,
  } = testcase;
  const [resultModal, setResultModal] = useState(false);
  const [testResult, setTestResult] = useState({});
  const [constructorForm] = Form.useForm();
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

  return (
    <>
      <TestResult width={1000} modal={resultModal} setModal={setResultModal} response={testResult}
                  caseName={caseInfo.name} single={false}/>
      <Row>
        <Col span={24}>
          <ConstructorModal width={1050} modal={constructorModal} setModal={e => {
            dispatch({type: 'testcase/save', payload: {constructorModal: e}})
          }} form={constructorForm} record={constructRecord} createMode
                            suffix={suffix}/>
          <TestCaseEditor directoryId={directory_id} form={form} body={body} setBody={setBody}
                          create={true}
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
