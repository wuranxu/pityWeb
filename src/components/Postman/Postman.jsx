import React from 'react';
import { Card, Col, Row, Input, Select, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';

const { Option } = Select;

const selectBefore = (
  <Select defaultValue='http://' className='select-before'>
    <Option value='http://'>http://</Option>
    <Option value='https://'>https://</Option>
  </Select>
);


export default () => {
  return (
    <Card>
      <Row gutter={[8, 8]}>
        <Col span={18}>
          <Input size='large' addonBefore={selectBefore} defaultValue='mysite' />
        </Col>
        <Col span={6}>
          <Button type='primary' size="large" style={{ marginRight: 16, float: 'right' }}><SendOutlined />Send </Button>
        </Col>
      </Row>
    </Card>
  );
}
