import { Col, Row } from 'antd';
import { useState } from 'react';
import styles from './index.less';


export default () => {
  const [editing, setEditing] = useState(false);


  return (
    <>
      <p className={styles.title}>断言详情</p>
      <Row gutter={[8, 8]}>
        <Col span={24}>

        </Col>
      </Row>
    </>
  );
}
