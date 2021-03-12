import React, { useState } from 'react';
import { Card, Col, Row, Input, Select, Button, Tabs, Radio, Dropdown, Menu } from 'antd';
import { DownOutlined, SendOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

const selectBefore = (
  <Select defaultValue='GET' style={{ width: 120, fontSize: 16, fontWeight: 400, textAlign: 'left' }}>
    <Option value='GET'>GET</Option>
    <Option value='POST'>POST</Option>
    <Option value='PUT'>PUT</Option>
    <Option value='DELETE'>DELETE</Option>
  </Select>
);



export default () => {
  const [bodyType, setBodyType] = useState('none');
  const [rawType, setRawType] = useState('JSON')

  const onClickMenu = key => {
    setRawType(key);
  }

  const menu = (
    <Menu>
      <Menu.Item key="Text">
        <a onClick={()=>{onClickMenu("Text")}}>Text</a>
      </Menu.Item>
      <Menu.Item key="JavaScript">
        <a onClick={()=>{onClickMenu("JavaScript")}}>JavaScript</a>
      </Menu.Item>
      <Menu.Item key="JSON">
        <a onClick={()=>{onClickMenu("JSON")}}>JSON</a>
      </Menu.Item>
      <Menu.Item key="HTML">
        <a onClick={()=>{onClickMenu("HTML")}}>HTML</a>
      </Menu.Item>
      <Menu.Item key="XML">
        <a onClick={()=>{onClickMenu("XML")}}>XML</a>
      </Menu.Item>

    </Menu>
  );

  return (
    <Card>
      <Row gutter={[8, 8]}>
        <Col span={18}>
          <Input size='large' addonBefore={selectBefore} defaultValue='mysite' />
        </Col>
        <Col span={6}>
          <Button type='primary' size='large' style={{ marginRight: 16, float: 'right' }}><SendOutlined />Send </Button>
        </Col>
      </Row>
      <Row style={{ marginTop: 8 }}>
        <Tabs defaultActiveKey='1'>
          <TabPane tab='Params' key='1'>
            这是params
          </TabPane>
          <TabPane tab='Headers' key='2'>
            这是Headers
          </TabPane>
          <TabPane tab='Body' key='3'>
            <Row>
              <Radio.Group defaultValue='none' value={bodyType} onChange={e => setBodyType(e.target.value)}>
                <Radio value='none'>none</Radio>
                <Radio value='form-data'>form-data</Radio>
                <Radio value='x-www-form-urlencoded'>x-www-form-urlencoded</Radio>
                <Radio value='raw'>raw</Radio>
                <Radio value='binary'>binary</Radio>
                <Radio value='GraphQL'>GraphQL</Radio>
              </Radio.Group>
              {
                bodyType === 'raw' ? <Dropdown style={{marginLeft: 8}} overlay={menu} trigger={['click']}>
                  <a onClick={e => e.preventDefault()}>
                    {rawType} <DownOutlined />
                  </a>
                </Dropdown>: null
              }
            </Row>
          </TabPane>
        </Tabs>
      </Row>
    </Card>
  );
}
