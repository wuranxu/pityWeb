import {Col, Form, Input, message, notification, Row, Switch, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {connect} from "umi";
import {CONFIG} from "@/consts/config";
import {PlayCircleTwoTone} from "@ant-design/icons";
import CopyTreeSelect from "@/components/TestCase/Constructor/ConstructorCopy";
import PythonAceEditor from "@/components/CodeEditor/AceEditor/PythonAceEditor";
import ShareTooltip from "@/components/PityForm/ShareTooltip";


const PythonConstructor = ({form, dispatch, construct, suffix}) => {

  const [_, setEditor] = useState(null);
  const {testCaseConstructorData} = construct;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(testCaseConstructorData)
  }, [testCaseConstructorData])

  const onExecuteCommand = async () => {
    const command = form.getFieldValue("command")
    const value = form.getFieldValue("value")
    if (!command) {
      message.info("脚本内容不能为空")
      return;
    }
    const data = await dispatch({
      type: 'testcase/onlinePyScript',
      payload: {
        value,
        command,
      }
    })
    notification.success({
      message: '执行完成',
      description: data,
    })
  }

  return (
    <Row gutter={8}>
      <Col span={24}>
        <CopyTreeSelect suffix={suffix}/>
        <Form {...CONFIG.SUB_LAYOUT} form={form}>
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item label="名称" name="name" rules={[{required: true, message: '请输入Python脚本名称'}]}
                         initialValue={testCaseConstructorData.name}>
                <Input placeholder="请输入Python脚本名称"/>
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
          <Form.Item label={<Tooltip title="点击可测试Python脚本">Python脚本
            <PlayCircleTwoTone twoToneColor="#67C23A"
                               onClick={async () => {
                                 await onExecuteCommand(form.getFieldValue("command"))
                               }}
                               style={{
                                 margin: '0 4px',
                                 fontSize: 16,
                                 cursor: 'pointer'
                               }}/></Tooltip>}
                     name="command" colon={false} {...CONFIG.SQL_LAYOUT}
                     initialValue={testCaseConstructorData.command}
                     rules={[{required: true, message: '请输入python代码'}]}>
            <PythonAceEditor language="python" height={180} setEditor={setEditor}/>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  )
}

export default connect(({construct, loading}) => ({
  construct,
  loading,
}))(PythonConstructor)
