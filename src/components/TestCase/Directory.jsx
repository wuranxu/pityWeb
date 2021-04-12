import {Spin, Row, Col, Card, Dropdown, Menu} from 'antd';
import React, {useState} from 'react';
import ProfessionalTree from '@/components/Tree/ProfessionalTree';
import {PlusOutlined,FolderTwoTone, BugTwoTone, FolderOutlined} from '@ant-design/icons';

export default ({loading, treeData}) => {

  const [searchValue, setSearchValue] = useState("");

  const menu = (
    <Menu>
      <Menu.Item icon={<FolderOutlined />}>
        <a>
          添加用例
        </a>
      </Menu.Item>
    </Menu>
  );

  const iconMap = key => {
    if (key.indexOf('cat') > -1) {
      return <FolderTwoTone twoToneColor="#ffc519"/>;
    }
    if (key.indexOf('case') > -1) {
      return <BugTwoTone twoToneColor='#13CE66'/>;
    }
  };

  const AddButton = <Dropdown overlay={menu}>
    <a style={{ marginLeft: 8 }}><PlusOutlined style={{ fontSize: 16, marginTop: 4, cursor: 'pointer' }} /></a>
  </Dropdown>;

  return (
    <Spin spinning={loading} tip='努力加载中'>
      <Row gutter={[8, 8]}>
        <Col span={7}>
          <Card bodyStyle={{ padding: 12, minHeight: 500, maxHeight: 500, overflowY: 'auto' }}>
            <ProfessionalTree gData={treeData} checkable={false} AddButton={AddButton}
                              searchValue={searchValue}
                              setSearchValue={setSearchValue}
                              iconMap={iconMap} suffixMap={()=>{return null}} />
          </Card>
        </Col>
        <Col span={17}>
          <Card bodyStyle={{ padding: 12, minHeight: 500, maxHeight: 500, overflowY: 'auto' }}>
          </Card>
        </Col>
      </Row>
    </Spin>
  )
}
