import { Spin, Row, Col, Card, Tooltip, Result, Dropdown, Menu, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import ProfessionalTree from '@/components/Tree/ProfessionalTree';
import { PlusOutlined, FolderTwoTone, BugTwoTone, FolderOutlined, RobotOutlined } from '@ant-design/icons';
import CaseForm from '@/components/TestCase/CaseForm';
import { createTestCase } from '@/services/testcase';
import auth from '@/utils/auth';
import TestCaseDetail from '@/components/TestCase/TestCaseDetail';
import CustomForm from '@/components/PityForm/CustomForm';
import fields from '@/consts/fields';
import FormForModal from '@/components/PityForm/FormForModal';

export default ({ loading, treeData, fetchData, projectData, userMap }) => {

  const [searchValue, setSearchValue] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [assertModal, setAssertModal] = useState(false);
  const [assertCaseId, setAssertCaseId] = useState(null);
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

  const caseMenu = key => (
    <Menu>
      <Menu.Item icon={<FolderOutlined />}>
        <a>
          添加前置条件
        </a>
      </Menu.Item>
      <Menu.Item icon={<FolderOutlined />}>
        <a>
          添加后置条件
        </a>
      </Menu.Item>
      <Menu.Item icon={<RobotOutlined />}>
        <a onClick={e => {
          setAssertModal(true);
          setAssertCaseId(key);
          e.stopPropagation();
        }}>
          添加断言
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
    if (key.indexOf('asserts') > -1) {
      return <RobotOutlined />;
    }
  };

  const Icon = (icon, title, operation, margin) => {
    return <Tooltip title={title}><span onClick={operation} style={{ marginLeft: margin }}>{icon}</span></Tooltip>;
  };

  // 后置icon
  const suffixMap = item => {
    if (item.key.indexOf('case') > -1) {
      return <>
        {Icon(
          <Dropdown overlay={caseMenu(item.key.split("_")[1])}>
            <a style={{ color: '#3cc64d' }}>
              <PlusOutlined style={{ fontSize: 16, marginTop: 4, cursor: 'pointer' }} />
            </a>
          </Dropdown>, null, () => {
            console.log('点击了');
          }, 24)}
      </>;
    }
  };

  // 新增断言
  const onSaveAssert = values => {
    const data = { case_id: assertCaseId, ...values };

  };

  const AddButton = <Dropdown overlay={menu}>
    <a style={{ marginLeft: 8 }}>
      <PlusOutlined style={{ fontSize: 16, marginTop: 4, cursor: 'pointer' }} />
    </a>
  </Dropdown>;

  return (
    <Spin spinning={loading} tip='努力加载中'>
      <CaseForm data={caseInfo} modal={drawer} setModal={setDrawer} onFinish={onCreateCase} />
      <FormForModal visible={assertModal} fields={fields.CaseAsserts} title='新增断言' left={6} right={18}
                    onFinish={onSaveAssert} />
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
              caseId === null ? <Result title='请选择左侧用例' status='info' /> :
                <TestCaseDetail caseId={caseId} userMap={userMap} />
            }
          </Card>
        </Col>
      </Row>
    </Spin>
  );
}
