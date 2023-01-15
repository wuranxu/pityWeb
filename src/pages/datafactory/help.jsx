import {Card, Col, Empty, Modal, Row} from "antd";
import React from 'react';
import Study from '@/assets/datafactory/Study.svg';
import Design from '@/assets/datafactory/Design.svg';


export default ({visible, onCancel}) => {
  return <Modal open={visible} width={900} title="帮助文档" footer={null} bodyStyle={{minHeight: 360}} onCancel={onCancel}>
    <Row gutter={18}>
      <Col span={12}>
        <Card hoverable bordered={false} className="help-card-left">
          <Empty image={Study} imageStyle={{height: 200}} description={
            <span className="help-title">🎨了解数据工厂相关内容</span>
          }/>
        </Card>
      </Col>
      <Col span={12}>
        <Card hoverable bordered={false} className="help-card-right">
          <Empty image={Design} imageStyle={{height: 200}} description={
            <span className="help-title">🙋‍♂️学习创建一个场景</span>
          }/>
        </Card>
      </Col>
    </Row>
  </Modal>
}
