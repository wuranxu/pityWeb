import {Card, Col, Form, Input, Row, Switch} from "antd";
import React, {useEffect} from "react";
import {connect} from "umi";
import {CONFIG} from "@/consts/config";
import CopyTreeSelect from "@/components/TestCase/Constructor/ConstructorCopy";
import PostmanBody from "@/components/Postman/PostmanBody";
import ShareTooltip from "@/components/PityForm/ShareTooltip";


const HTTPConstructor = ({
                           form,
                           dispatch,
                           construct,
                           suffix,
                           headers,
                           setHeaders,
                           body,
                           setBody,
                           bodyType,
                           setBodyType
                         }) => {
  const {testCaseConstructorData} = construct;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(testCaseConstructorData)
    if (testCaseConstructorData.body_type) {
      setBodyType(testCaseConstructorData.body_type)
    }
    if (testCaseConstructorData.headers) {
      setHeaders(testCaseConstructorData.headers || [])
    }
    setBody(testCaseConstructorData.body)
  }, [testCaseConstructorData])

  return (
    <Row gutter={8}>
      <Col span={24}>
        <CopyTreeSelect suffix={suffix}/>
        <Form {...CONFIG.SUB_LAYOUT} form={form}>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item label="名称" name="name" rules={[{required: true, message: '请输入http请求名称'}]}
                         initialValue={testCaseConstructorData.name}>
                <Input placeholder="请输入http请求名称"/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="返回值" name="value">
                <Input placeholder="请填写造数后的返回值，可不填"/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item {...CONFIG.SUB_LAYOUT}
                         label={<ShareTooltip/>}
                         rules={[{required: true, message: '请选择是否共享'}]}
                         initialValue={testCaseConstructorData.public || true}
                         valuePropName="checked"
                         name="public">
                <Switch/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...CONFIG.SUB_LAYOUT} label="启用" name="enable"
                         rules={[{required: true, message: '请选择是否启用'}]}
                         initialValue={testCaseConstructorData.enable || true}
                         valuePropName="checked">
                <Switch/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={24}>
              <Card bordered>
                <PostmanBody bodyType={bodyType} setBodyType={setBodyType} form={form} caseInfo={{}} body={body}
                             setBody={setBody} headers={headers} setHeaders={setHeaders} save={false}/>
              </Card>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  )
}

export default connect(({construct, loading}) => ({
  construct,
  loading,
}))(HTTPConstructor)
