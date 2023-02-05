import {Col, Row} from "antd";
import React from "react";
import {connect} from "@umijs/max";
import TestCaseConstructor from "@/components/TestCase/Constructor/TestCaseConstructor";
import CopyTreeSelect from "@/components/TestCase/Constructor/ConstructorCopy";

const TestCaseConstructorData = ({caseId, construct, dispatch, form, onFinish, suffix}) => {

  const {testcaseData, testCaseConstructorData, constructorType} = construct;

  return (
    <Row style={{marginTop: 24}} gutter={[8, 8]}>
      <Col span={24}>
        <CopyTreeSelect suffix={suffix}/>
        <Row gutter={8}>
          <Col span={24}>
            <TestCaseConstructor data={testCaseConstructorData} dispatch={dispatch} testcaseData={testcaseData}
                                 constructorType={constructorType} form={form}/>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default connect(({construct, loading}) => ({
  construct,
  loading,
}))(TestCaseConstructorData)
