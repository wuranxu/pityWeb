import { Button, Col, Form, Row, Tooltip, Upload } from 'antd';
import React from 'react';
import ProjectAvatar from '@/components/Project/ProjectAvatar';
import { SaveOutlined } from '@ant-design/icons';


import getComponent from './index';

const {Item: FormItem} = Form;

export default ({left, right, formName, record, onFinish, fields, dispatch}) => {
  const [form] = Form.useForm();
  const layout = {
    labelCol: {span: left},
    wrapperCol: {span: right},
  }

  return (
    <Form
      form={form}
      {...layout}
      name={formName}
      initialValues={record}
      onFinish={onFinish}
    >
      <Row>
        <Col span={6}/>
        <Col span={12} style={{textAlign: 'center'}}>
          <Tooltip title="点击可修改头像" placement="rightTop">
            <Upload customRequest={async fileData => {
              await dispatch({
                type: 'project/uploadFile',
                payload: {
                  file: fileData.file,
                  project_id: record.id,
                }
              })
            }} fileList={[]}>
              <Row style={{textAlign: 'center', marginBottom: 16}}>
                <ProjectAvatar data={record}/>
              </Row>
            </Upload>
          </Tooltip>
        </Col>
        <Col span={6}/>
      </Row>
      {
        fields.map(item => <Row>
          <Col span={6}/>
          <Col span={12}>
            <FormItem label={item.label} colon={item.colon || true}
                      rules={
                        [{required: item.required, message: item.message}]
                      } name={item.name} valuePropName={item.valuePropName || 'value'}
            >
              {getComponent(item.type, item.placeholder, item.component)}
            </FormItem>
          </Col>
          <Col span={6}/>
        </Row>)
      }
      <Row>
        <Col span={6}/>
        <Col span={12} style={{textAlign: 'center'}}>
          <FormItem {...{
            labelCol: {span: 0},
            wrapperCol: {span: 24},
          }}>
            <Button htmlType="submit" type="primary"><SaveOutlined/>修改</Button>
          </FormItem>
        </Col>
        <Col span={6}/>
      </Row>
    </Form>
  )
}
