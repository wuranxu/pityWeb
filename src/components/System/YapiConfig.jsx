import {Button, Col, Form, Input, Row} from "antd";
import CONFIG from "@/consts/config";

export default ({form}) => {
  return (
    <Row gutter={8}>
      <Col span={4}/>
      <Col span={16}>
        <Form form={form} {...CONFIG.LAYOUT}>
          <Form.Item label="token" name="token">
            <Input placeholder="请输入yapi token"/>
          </Form.Item>
        </Form>
      </Col>
      <Col span={4}/>
    </Row>

  )
}
