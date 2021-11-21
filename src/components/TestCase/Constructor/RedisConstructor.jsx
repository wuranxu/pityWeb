import {Col, Form, Input, message, notification, Row, Select, Switch, Tabs, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {connect} from "umi";
import {CONFIG} from "@/consts/config";
import PityAceEditor from "@/components/CodeEditor/PityAceEditor";
import {PlayCircleTwoTone, QuestionCircleOutlined} from "@ant-design/icons";

const {TabPane} = Tabs;
const {Option} = Select;

const RedisConstructor = ({form, dispatch, construct, gconfig}) => {

  const [editor, setEditor] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const {testCaseConstructorData, constructorType} = construct;
  const {redisConfig, envMap} = gconfig;


  useEffect(async () => {
    dispatch({
      type: 'gconfig/fetchRedisConfig'
    })
  }, [])

  useEffect(async () => {
    form.resetFields();
    form.setFieldsValue(testCaseConstructorData)
    setCurrentId()
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
    notification.info({
      message: '执行完成',
      description: data,
    })
  }

  return (
    <Row gutter={8}>
      <Col span={24}>
        <Row gutter={8} style={{marginTop: 32}}>
          <Col span={3}/>
          <Col span={18}>
            <Form {...CONFIG.SQL_LAYOUT} form={form}>
              <Form.Item label="数据类型" name="type">
                <Select disabled defaultValue={constructorType}>
                  {
                    Object.keys(CONFIG.CONSTRUCTOR_TYPE).map(key => <Option value={parseInt(key, 10)}
                                                                            key={key}>{CONFIG.CONSTRUCTOR_TYPE[key]}</Option>)
                  }
                </Select>
              </Form.Item>
              <Form.Item label="名称" name="name" rules={[{required: true, message: '请输入数据构造器名称'}]}
                         initialValue={testCaseConstructorData.name}>
                <Input placeholder="请输入数据构造器名称"/>
              </Form.Item>
              <Form.Item label={<Tooltip title="测试的时候可以选中对应环境的redis，否则可以随便选一个名称符合的redis">Redis <QuestionCircleOutlined /></Tooltip>} name="redis" initialValue={testCaseConstructorData.redis}
                         rules={[{required: true, message: '请选择Redis连接名称, 如果没有请去【Redis配置】页面添加'}]}>
                <Select showSearch placeholder="请选择Redis连接名称" onSelect={(_, node) => {
                  setCurrentId(node.key)
                }}>
                  {redisConfig.map(item => <Option key={item.id}
                                                   value={item.name}>{item.name}({envMap[item.env]})</Option>)}
                </Select>
              </Form.Item>
              <Form.Item label={<Tooltip title="点击可执行Redis命令">Redis命令
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
                <PityAceEditor language="text" height={100} setEditor={setEditor}/>
              </Form.Item>
              <Form.Item label="返回值" name="value">
                <Input placeholder="请填写造数后的返回值，可不填"/>
              </Form.Item>
              <Row>
                <Col span={12}>
                  <Form.Item {...CONFIG.SUB_LAYOUT}
                             label={<Tooltip
                               title="开启共享后, 其他人可使用你的数据构造器"><span>共享 <QuestionCircleOutlined/></span></Tooltip>}
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
            </Form>
          </Col>
          <Col span={3}/>
        </Row>
      </Col>
    </Row>
  )
}

export default connect(({construct, gconfig, loading}) => ({
  construct: construct,
  gconfig: gconfig,
  loading: loading,
}))(RedisConstructor)
