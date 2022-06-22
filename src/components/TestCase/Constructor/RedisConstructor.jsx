import {Col, Form, Input, message, notification, Row, Select, Switch, Tabs, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {connect} from "umi";
import {CONFIG} from "@/consts/config";
import PityAceEditor from "@/components/CodeEditor/AceEditor/index";
import {PlayCircleTwoTone, QuestionCircleOutlined} from "@ant-design/icons";
import CopyTreeSelect from "@/components/TestCase/Constructor/ConstructorCopy";
import ShareTooltip from "@/components/PityForm/ShareTooltip";

const {TabPane} = Tabs;
const {Option} = Select;

const RedisConstructor = ({form, dispatch, construct, gconfig, suffix}) => {

  const [editor, setEditor] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const {testCaseConstructorData, constructorType} = construct;
  const {redisConfig, envMap} = gconfig;


  useEffect(() => {
    dispatch({
      type: 'gconfig/fetchRedisConfig'
    })
  }, [])

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(testCaseConstructorData)
  }, [testCaseConstructorData])

  const onExecuteCommand = async (command) => {
    if (!currentId || !command) {
      message.info("请选择redis或完善Redis命令")
      return;
    }
    const data = await dispatch({
      type: 'gconfig/onlineRedisCommand',
      payload: {
        id: currentId,
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
        <Row gutter={8}>
          <Col span={24}>
            <Form {...CONFIG.SUB_LAYOUT} form={form}>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item label="名称" name="name" rules={[{required: true, message: '请输入Redis语句名称'}]}
                             initialValue={testCaseConstructorData.name}>
                    <Input placeholder="请输入Redis语句名称"/>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={<Tooltip
                    title="测试的时候可以选中对应环境的redis，否则可以随便选一个名称符合的redis">Redis <QuestionCircleOutlined/></Tooltip>}
                             name="redis" initialValue={testCaseConstructorData.redis}
                             rules={[{required: true, message: '请选择Redis连接名称, 如果没有请去【Redis配置】页面添加'}]}>
                    <Select showSearch placeholder="请选择Redis连接名称" onSelect={(_, node) => {
                      setCurrentId(node.key)
                    }}>
                      {redisConfig.map(item => <Option key={item.id}
                                                       value={item.name}>{item.name}({envMap[item.env]})</Option>)}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item label="返回值" name="value">
                    <Input placeholder="请填写造数后的返回值，可不填"/>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item {...CONFIG.SWITCH_LAYOUT}
                             label={<ShareTooltip/>}
                             rules={[{required: true, message: '请选择是否共享'}]}
                             initialValue={testCaseConstructorData.public || true}
                             valuePropName="checked"
                             name="public">
                    <Switch/>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item {...CONFIG.SWITCH_LAYOUT} label="启用" name="enable"
                             rules={[{required: true, message: '请选择是否启用'}]}
                             initialValue={testCaseConstructorData.enable || true}
                             valuePropName="checked">
                    <Switch/>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item {...CONFIG.SQL_LAYOUT} label={<Tooltip title="点击可执行Redis命令">Redis命令
                <PlayCircleTwoTone twoToneColor="#67C23A"
                                   onClick={async () => {
                                     await onExecuteCommand(form.getFieldValue("command"))
                                   }}
                                   style={{
                                     margin: '0 4px',
                                     fontSize: 16,
                                     cursor: 'pointer'
                                   }}/></Tooltip>}
                         name="command" colon={false}
                         rules={[{required: true, message: '请填写redis执行语句'}]}
                         initialValue={testCaseConstructorData.command}>
                <PityAceEditor language="text" height={150} setEditor={setEditor}/>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default connect(({construct, gconfig, loading}) => ({
  construct,
  gconfig,
  loading,
}))(RedisConstructor)
