import {Card, Col, Modal, Row} from "antd";
import {connect} from "umi";
import IconFont from "@/components/Icon/IconFont";

const {Meta} = Card;

const ConstructorModal = ({modal, setModal, dispatch, testcase, width}) => {
  return (
    <Modal title="数据构造器" width={width || 800} visible={modal} onCancel={() => setModal(false)} footer={null}>
      <Row gutter={[24, 24]}>
        <Col span={2}/>
        <Col span={10}>
          <Card
            hoverable
            bordered={false}
            cover={<IconFont type="icon-ziyuanku" style={{fontSize: 96, paddingTop: 32}}/>}
          >
            <Meta title="选择已有的构造器" style={{textAlign: 'center', fontWeight: 'bold', color: "#1890ff"}}/>
          </Card>
        </Col>
        <Col span={10}>
          <Card
            hoverable
            bordered={false}
            cover={<IconFont type="icon-chuangjian" style={{fontSize: 96, paddingTop: 32}}/>}
          >
            <Meta title="创建新的构造器" style={{textAlign: 'center', fontWeight: 'bold', color: "#1890ff"}}/>
          </Card>
        </Col>
        <Col span={2}/>
      </Row>
    </Modal>
  )
}

export default connect(({testcase, loading}) => ({
  testcase: testcase,
  loading: loading,
}))(ConstructorModal)
