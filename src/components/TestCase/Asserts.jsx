import { Tab, Row } from 'antd';
import { useState } from 'react';

const {TabPane} = Tab;

export default () => {
  const [editing, setEditing] = useState(false);


  return (
    <>
      <h3 style={{ borderLeft: '3px solid #ecb64a', padding: '3px 8px' }}>标题</h3>
      <Row gutter={[8, 8]}>
        <Col></Col>
      </Row>
    </>
  )
}
