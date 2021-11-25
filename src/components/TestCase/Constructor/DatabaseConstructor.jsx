import {Col, Form, Input, Menu, Row, Select, Switch, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {connect} from "umi";
import SqlOnline from "@/components/Online/SqlOnline";
import {CONFIG} from "@/consts/config";
import PityAceEditor from "@/components/CodeEditor/PityAceEditor";
import {QuestionCircleOutlined} from "@ant-design/icons";
import CopyTreeSelect from "@/components/TestCase/Constructor/ConstructorCopy";

const {Option} = Select;

const DatabaseConstructor = ({form, dispatch, construct, gconfig}) => {

  const [currentKey, setCurrentKey] = useState('1');
  const [_, setEditor] = useState(null);
  const {testCaseConstructorData, constructorType} = construct;
  const {dbConfigData} = gconfig;

  const getDbConfigData = () => {
    const temp = dbConfigData.map(v => v.name)
    return Array.from(new Set(temp))
  }

  const handleClick = e => {
    setCurrentKey(e.key);
  };

  useEffect(async () => {
    dispatch({
      type: 'gconfig/fetchDbConfig'
    })
  }, [])

  useEffect(async () => {
    form.resetFields();
    form.setFieldsValue(testCaseConstructorData)
  }, [testCaseConstructorData])

  return (
    <Row gutter={8}>
      <Col span={24}>
        <CopyTreeSelect />
        <Row gutter={8}>
          <Col span={3}>
            <Menu
              onClick={handleClick}
              style={{width: 128}}
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['1']}
              mode="inline"
            >
              <Menu.Item key="1">编辑SQL</Menu.Item>
              <Menu.Item key="2">调试SQL</Menu.Item>
            </Menu>
          </Col>
          {
            currentKey !== '1' ? <Col span={21}>
              <SqlOnline leftHeight={420} cardHeight={130} tableHeight={272} editorHeight={130}
                         imageHeight={60}/>
            </Col> : <>
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
                  <Form.Item label="数据库" name="database" initialValue={testCaseConstructorData.database}
                             rules={[{required: true, message: '请选择数据库连接名称, 如果没有请去【数据库配置】页面添加'}]}>
                    <Select showSearch placeholder="请选择数据库连接名称, 会根据环境自动寻找对应的数据库">
                      {getDbConfigData().map(item => <Option key={item} value={item}>{item}</Option>)}
                    </Select>
                  </Form.Item>
                  <Form.Item label={<Tooltip title="切换左侧菜单可进入SQL编辑器">SQL语句 <QuestionCircleOutlined/></Tooltip>}
                             name="sql"
                             rules={[{required: true, message: '请填写SQL语句'}]}
                             initialValue={testCaseConstructorData.sql}>
                    <PityAceEditor language="mysql" height={120} setEditor={setEditor}/>
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
            </>
          }
        </Row>
      </Col>
    </Row>
  )
}

export default connect(({construct, gconfig, loading}) => ({
  construct: construct,
  gconfig: gconfig,
  loading: loading,
}))(DatabaseConstructor)
