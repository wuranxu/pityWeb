import {Card, Col, Row} from "antd";

export default () => {
  return (
    <Row gutter={12} className="factory-body">
      <Col span={6}>
        <Card type="inner" className="scene-card" hoverable>
          场景一
        </Card>
      </Col>
      <Col span={6}>
        <Card type="inner" className="scene-card" hoverable>
          场景一
        </Card>
        <Card type="inner" className="scene-card" hoverable>
          场景一
        </Card>
      </Col>
      <Col span={6}>
        <Card type="inner" className="scene-card" hoverable>
          场景一
        </Card>
        <Card type="inner" className="scene-card" hoverable>
          场景一
        </Card>
      </Col>
      <Col span={6}></Col>
    </Row>
  )
}
