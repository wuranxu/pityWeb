import getComponent from '@/components/PityForm';
import PostmanForm from '@/components/Postman/PostmanForm';
import { Form, Row, Col } from 'antd';

const FormItem = Form.Item;

export default ({form, layout, formName, record, onFinish, fields, body, setBody, headers, setHeaders}) => {
  return (
    <>
      <h3 style={{ borderLeft: '3px solid #ecb64a', padding: '3px 8px' }}>用例信息</h3>
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
                          [{ required: item.required, message: item.message }]
                        } name={item.name} valuePropName={item.valuePropName || 'value'}
              >
                {getComponent(item.type, item.placeholder, item.component)}
              </FormItem>
            </Col>)
          }
        </Row>
        <Row gutter={[8, 8]}>
          <h3 style={{ borderLeft: '3px solid #ecb64a', padding: '3px 8px' }}>请求信息</h3>
          <Col span={24}>
            <PostmanForm form={form} body={body} setBody={setBody} headers={headers} setHeaders={setHeaders} />
          </Col>
        </Row>
      </Form>
    </>
  );
}
