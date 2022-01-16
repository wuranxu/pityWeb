import {Col, Form, Input, Row} from "antd";
import {CONFIG} from "@/consts/config";

export default ({form}) => {
  return (
    <Row gutter={8}>
      <Col span={4}/>
      <Col span={16}>
        <Form form={form} {...CONFIG.LAYOUT}>
          <Form.Item label="发件人" name="sender" rules={[{required: true, message: '请输入发件人邮箱'}]}>
            <Input placeholder="请输入发件人邮箱"/>
          </Form.Item>
          <Form.Item label="host" name="host" rules={[{required: true, message: '请输入服务器host'}]}>
            <Input placeholder="请输入服务器host"/>
          </Form.Item>
          <Form.Item label="邮箱秘钥" name="password" rules={[{required: true, message: '请输入邮箱秘钥'}]}>
            <Input placeholder="请输入邮箱秘钥"/>
          </Form.Item>
          <Form.Item label="收件人名称" name="to" rules={[{required: true, message: '请输入收件人名称'}]}>
            <Input placeholder="请输入收件人名称"/>
          </Form.Item>
        </Form>
      </Col>
      <Col span={4}/>
    </Row>

  )
}
