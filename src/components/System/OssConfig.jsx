import {Col, Form, Input, Row, Select} from "antd";
import {CONFIG} from "@/consts/config";

export default ({form}) => {
  return (
    <Row gutter={8}>
      <Col span={4}/>
      <Col span={16}>
        <Form form={form} {...CONFIG.LAYOUT}>
          <Form.Item label="类型" name="oss_type" rules={[{required: true, message: '请选择oss类型'}]}>
            <Select placeholder="请选择oss类型">
              <Select.Option value="aliyun">阿里云</Select.Option>
              <Select.Option value="gitee">gitee</Select.Option>
              <Select.Option value="cos">腾讯云</Select.Option>
              <Select.Option value="qiniu">七牛云</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="access_id" name="access_key_id" rules={[{required: true, message: '请输入access_key_id'}]}>
            <Input placeholder="请输入access_key_id"/>
          </Form.Item>
          <Form.Item label="access_secret" name="access_key_secret" rules={[{required: true, message: '请输入access_secret'}]}>
            <Input placeholder="请输入access_secret"/>
          </Form.Item>
          <Form.Item label="bucket" name="bucket" rules={[{required: true, message: '请输入bucket'}]}>
            <Input placeholder="请输入bucket"/>
          </Form.Item>
          <Form.Item label="endpoint" name="endpoint">
            <Input placeholder="请输入endpoint, 可不填"/>
          </Form.Item>
        </Form>
      </Col>
      <Col span={4}/>
    </Row>

  )
}
