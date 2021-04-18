import React, {useState} from 'react';
import { Button, Col, Drawer, Form, Row } from 'antd';
import getComponent from '@/components/PityForm/index';
import PostmanForm from '@/components/Postman/PostmanForm';

const {Item: FormItem} = Form;

export default ({title, width, left, right, formName, record, onFinish, loading, fields, visible, onCancel}) => {
  const [form] = Form.useForm();
  const [headers, setHeaders] = useState([]);
  const [body, setBody] = useState('');

  const onOk = () => {
    form.validateFields().then((values) => {
      onFinish({ ...values, request_header: translateHeaders(), body });
    })
  }

  const translateHeaders = () => {
    const hd = {}
    for (let h in headers) {
      hd[headers[h].key] = headers[h].value;
    }
    return JSON.stringify(hd, null, 2);
  }

  const layout = {
    labelCol: {span: left},
    wrapperCol: {span: right},
  }
  return (
    <Drawer
      destroyOnClose confirmLoading={loading}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={()=>{
            onCancel()
            form.resetFields();
          }} style={{ marginRight: 8 }}>

            取消
          </Button>
          <Button onClick={onOk} type="primary">
            提交
          </Button>
        </div>
      }
      title={title} width={width} visible={visible} onOk={onOk} onCancel={()=>{
      onCancel();
      form.resetFields();
    }} onClose={()=>{
      onCancel();
      form.resetFields();
    }}>
      <h3 style={{borderLeft: '3px solid #ecb64a', padding: '3px 8px'}}>用例信息</h3>
      <Form
        form={form}
        {...layout}
        name={formName}
        initialValues={record}
        onFinish={onFinish}
      >
        <Row gutter={[8, 8]}>
          {
            fields.map(item => <Col span={item.span || 24}>
              <FormItem label={item.label} colon={item.colon || true}
                        rules={
                          [{required: item.required, message: item.message}]
                        } name={item.name} valuePropName={item.valuePropName || 'value'}
              >
                {getComponent(item.type, item.placeholder, item.component)}
              </FormItem>
            </Col>)
          }
        </Row>
        <Row gutter={[8, 8]}>
          <h3 style={{borderLeft: '3px solid #ecb64a', padding: '3px 8px'}}>请求信息</h3>
          <Col span={24}>
            <PostmanForm form={form} body={body} setBody={setBody} headers={headers} setHeaders={setHeaders}/>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )

}
