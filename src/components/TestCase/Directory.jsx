import {Alert, Card, Col, Dropdown, Menu, Row, Spin, Tooltip} from 'antd';
import React, {useState} from 'react';
import ProfessionalTree from '@/components/Tree/ProfessionalTree';
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  FolderOutlined,
  FolderTwoTone,
  PlusOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import CaseForm from '@/components/TestCase/CaseForm';
import {createTestCase, insertTestCaseAsserts} from '@/services/testcase';
import auth from '@/utils/auth';
import TestCaseDetail from '@/components/TestCase/TestCaseDetail';
import fields from '@/consts/fields';
import FormForModal from '@/components/PityForm/FormForModal';
import Asserts from '@/components/TestCase/Asserts';
import ConstructorModal from "@/components/TestCase/ConstructorModal";
import {IconFont} from "@/components/Icon/IconFont";

export default ({loading, treeData, fetchData, projectData, userMap}) => {

  const [searchValue, setSearchValue] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [assertModal, setAssertModal] = useState(false);
  const [constructorModal, setConstructorModal] = useState(false);
  const [assertCaseId, setAssertCaseId] = useState(null);
  const [constructorCaseId, setConstructorCaseId] = useState(null);
  const [caseInfo, setCaseInfo] = useState({request_type: '1'});
  // 0 说明是默认状态 1说明是case 2说明是用例
  const [mode, setMode] = useState(0);
  const [caseId, setCaseId] = useState(null);
  const [assertId, setAssertId] = useState(null);
  const [executeStatus, setExecuteStatus] = useState(null);
  const [checkedKeys, setCheckedKeys] = useState(null);

  const menu = (
    <Menu>
      <Menu.Item icon={<FolderOutlined/>}>
        <a onClick={() => {
          setDrawer(true);
        }}>
          新建场景
        </a>
      </Menu.Item>
    </Menu>
  );

  const caseMenu = key => (
    <Menu>
      <Menu.Item icon={<FolderOutlined/>}>
        <a onClick={() => {
          setConstructorModal(true);
          setConstructorCaseId(key);
        }}>
          添加前置步骤
        </a>
      </Menu.Item>
      <Menu.Item icon={<FolderOutlined/>}>
        <a>
          添加后置步骤
        </a>
      </Menu.Item>
      <Menu.Item icon={<RobotOutlined/>}>
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

  const toInt = keys => {
    return parseInt(keys[0].split('_')[1], 10);
  };

  const onSelectKeys = keys => {
    if (keys.length === 0) {
      setCaseId(null);
      setAssertId(null);
      setMode(0);
      return;
    }
    if (keys[0].indexOf('case_') > -1) {
      // 说明是case
      setMode(1);
      setCaseId(toInt(keys));
    } else if (keys[0].indexOf('asserts_') > -1) {
      setMode(2);
      setAssertId(toInt(keys));
    } else {
      setMode(0);
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
      return <FolderTwoTone twoToneColor='#ffc519'/>;
    }
    if (key.indexOf('case') > -1) {
      return <IconFont type="icon-testcase-copy"/>;
    }
    if (key.indexOf('asserts') > -1) {
      return <RobotOutlined/>;
    }
  };

  const Icon = (icon, title, operation, margin) => {
    return <Tooltip title={title}><span onClick={operation} style={{marginLeft: margin}}>{icon}</span></Tooltip>;
  };

  // 后置icon
  const suffixMap = item => {
    if (item.key.indexOf('case') > -1) {
      return <>
        {Icon(
          <Dropdown overlay={caseMenu(item.key.split('_')[1])}>
            <a style={{color: '#3cc64d'}}>
              <PlusOutlined style={{fontSize: 16, marginTop: 4, cursor: 'pointer'}}/>
            </a>
          </Dropdown>, null, () => {
          }, 24)}
      </>;
    }
    // if (item.key.indexOf('asserts_') > -1) {
    //   const id = item.key.split('_')[1];
    //   if (executeStatus === null) {
    //     return null;
    //   }
    //   return executeStatus[id] !== undefined ? <>
    //     {Icon(
    //       executeStatus[id].status ? <CheckCircleTwoTone twoToneColor='#52c41a' /> :
    //         <CloseCircleTwoTone twoToneColor='red' />, null, () => {
    //       }, 4)}
    //   </>: null;
    // }
  };

  const parseStatus = key => {
    if (key.indexOf('asserts_') > -1) {
      if (executeStatus === null) {
        return '';
      }
      const id = key.split('_')[1];
      return executeStatus[id] !== undefined ? <>
        {Icon(
          executeStatus[id].status ? <CheckCircleTwoTone twoToneColor='#52c41a'/> :
            <CloseCircleTwoTone twoToneColor='red'/>, null, () => {
          }, 4)}
      </> : '';
    }
    return '';
  };

  // 新增断言
  const onSaveAssert = async values => {
    const data = {case_id: assertCaseId, ...values};
    const res = await insertTestCaseAsserts(data);
    if (auth.response(res, true)) {
      setAssertModal(false);
      await fetchData();
    }
  };

  const RenderView = () => {
    if (mode === 1) {
      return <TestCaseDetail caseId={caseId} userMap={userMap} setExecuteStatus={setExecuteStatus}
                             project={projectData} checkedKeys={checkedKeys}/>;
    }
    if (mode === 2) {
      return <Asserts/>;
    }
    return <Alert
      closable
      message='欢迎使用Pity测试平台!'
      description={
        <div>
          <strong>Tips: </strong>
          <p/>
          <p>1. 左侧是用例树，展示的是用例和用例的相关信息。</p>
          <p>2. 我们可以选择用例/断言/前置/后置步骤进行查看和修改，这些详情会在右侧展示。</p>
          <p>{'3. 用例的生命周期是[变量替换]->[前置步骤执行]->[用例执行]->[后置步骤执行]->[断言执行]'}。</p>
          <p>4. 页面可在线调试对应的接口，选中多个用例可将他们将入测试集。</p>
          <p>5. 更多功能等待作者慢慢完善吧。</p>
        </div>
      }
      type='info'
      showIcon
    />;
  };

  const AddButton = <Dropdown menu={menu}>
    <a style={{marginLeft: 8}}>
      <PlusOutlined style={{fontSize: 16, marginTop: 4, cursor: 'pointer'}}/>
    </a>
  </Dropdown>;

  return (
    <Spin spinning={loading} tip='努力加载中'>
      <CaseForm data={caseInfo} modal={drawer} setModal={setDrawer} onFinish={onCreateCase}/>
      <ConstructorModal width={1050} modal={constructorModal} setModal={setConstructorModal} caseId={constructorCaseId}
                        fetchData={fetchData}/>
      <FormForModal open={assertModal} fields={fields.CaseAsserts} title='新增断言' left={6} right={18}
                    onFinish={onSaveAssert} onCancel={() => setAssertModal(false)}/>
      <Row style={{marginTop: -8}}>
        <Col span={8}>
          <Card bodyStyle={{padding: 12, minHeight: 800, maxHeight: 800, overflowY: 'auto'}} style={{border: "none"}}>
            <ProfessionalTree gData={treeData} checkable={true} AddButton={AddButton}
                              searchValue={searchValue} onSelect={onSelectKeys}
                              setSearchValue={setSearchValue} checkedKeys={checkedKeys}
                              onCheck={keys => setCheckedKeys(keys)}
                              iconMap={iconMap} suffixMap={suffixMap} parseStatus={parseStatus}/>
          </Card>
        </Col>
        <Col span={16}>
          <Card style={{marginTop: -8, borderRight: 'none', borderBottom: 'none', borderTop: 'none'}}
                bodyStyle={{padding: 12, minHeight: 800, maxHeight: 800, overflowY: 'auto'}}>
            {
              RenderView(mode)
            }
          </Card>
        </Col>
      </Row>
    </Spin>
  );
}


