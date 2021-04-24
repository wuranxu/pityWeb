import { Spin, Row, Col, Card, Tooltip, Result, Dropdown, Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import ProfessionalTree from '@/components/Tree/ProfessionalTree';
import { PlusOutlined, FolderTwoTone, BugTwoTone, FolderOutlined } from '@ant-design/icons';
import CaseForm from '@/components/TestCase/CaseForm';
import { createTestCase } from '@/services/testcase';
import auth from '@/utils/auth';
import TestCaseDetail from '@/components/TestCase/TestCaseDetail';

export default ({ loading, treeData, fetchData, projectData, userMap }) => {

  const [searchValue, setSearchValue] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [caseInfo, setCaseInfo] = useState({ request_type: '1' });
  const [caseId, setCaseId] = useState(null);

  const menu = (
    <Menu>
      <Menu.Item icon={<FolderOutlined />}>
        <a onClick={() => {
          setDrawer(true);
        }}>
          添加用例
        </a>
      </Menu.Item>
    </Menu>
  );

  const onSelectKeys = keys => {
    if (keys.length > 0 && keys[0].indexOf('case_') > -1) {
      // 说明是case
      setCaseId(parseInt(keys[0].split('_')[1], 10));
    } else {
      setCaseId(null);
    }
  };

  const onCreateCase = async (values) => {
    const res = await createTestCase({
      ...values,
      request_type: parseInt(values.request_type, 10),
      status: parseInt(values.status, 10),
      tag: values.tag !== undefined ? values.tag.join(',') : null,
      project_id: projectData.id,
    });
    if (auth.response(res, true)) {
      setDrawer(false);
      await fetchData();
    }
  };

  const iconMap = key => {
    if (key.indexOf('cat') > -1) {
      return <FolderTwoTone twoToneColor='#ffc519' />;
    }
    if (key.indexOf('case') > -1) {
      return <BugTwoTone twoToneColor='#13CE66' />;
    }
  };

  const Icon = (icon, title, operation, margin) => {
    return <Tooltip title={title}><span onClick={operation} style={{ marginLeft: margin }}>{icon}</span></Tooltip>;
  };

  // 后置icon
  const suffixMap = item => {
    if (item.key.indexOf('case') > -1) {
      return <>
        {Icon(<a style={{ color: '#3cc64d' }}><PlusOutlined /></a>, '添加前置操作', () => {
          console.log("点击了")
        }, 24)}
      </>
    }
  }

  const AddButton = <Dropdown overlay={menu}>
    <a style={{ marginLeft: 8 }}>
      <PlusOutlined style={{ fontSize: 16, marginTop: 4, cursor: 'pointer' }} />
    </a>
  </Dropdown>;

  return (
    <Spin spinning={loading} tip='努力加载中'>
      <CaseForm data={caseInfo} modal={drawer} setModal={setDrawer} onFinish={onCreateCase} />
      <Row gutter={[8, 8]}>
        <Col span={6}>
          <Card bodyStyle={{ padding: 12, minHeight: 800, maxHeight: 800, overflowY: 'auto' }}>
            <ProfessionalTree gData={treeData} checkable={false} AddButton={AddButton}
                              searchValue={searchValue} onSelect={onSelectKeys}
                              setSearchValue={setSearchValue}
                              iconMap={iconMap} suffixMap={suffixMap} />
          </Card>
        </Col>
        <Col span={18}>
          <Card bodyStyle={{ padding: 12, minHeight: 800, maxHeight: 800, overflowY: 'auto' }}>
            {
              caseId === null ? <Result title='请选择左侧用例' status='info' /> : <TestCaseDetail caseId={caseId} userMap={userMap} />
            }
          </Card>
        </Col>
      </Row>
    </Spin>
  );
}
