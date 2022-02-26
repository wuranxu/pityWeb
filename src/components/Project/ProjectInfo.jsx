import React from 'react';
import {Col, Row, Select, Tooltip} from 'antd';
import {updateProject} from '@/services/project';
import auth from '@/utils/auth';
import UserLink from "@/components/Button/UserLink";
import ProjectForm from "@/components/PityForm/ProjectForm";
import UserSelect from "@/components/User/UserSelect";


const {Option} = Select;

export default ({data, users, reloadData}) => {

  const onFinish = async (values) => {
    const project = {
      ...data,
      ...values,
    };
    const res = await updateProject(project);
    auth.response(res, true);
    await reloadData();
  };

  const opt = <Select placeholder='请选择项目组长' showSearch filterOption={(input, option) =>
    option.children.props.user.name.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.children.props.user.email.toLowerCase().indexOf(input.toLowerCase()) >= 0
  } allowClear>
    {
      users.map(item => <Option key={item.value} value={item.id}><Tooltip
        title={item.email}><UserLink user={item}/></Tooltip></Option>)
    }
  </Select>;

  const fields = [
    {
      name: 'name',
      label: '项目名称',
      required: true,
      message: '请输入项目名称',
      type: 'input',
      placeholder: '请输入项目名称',
      component: null,
    },
    {
      name: 'app',
      label: '服务名',
      required: true,
      message: '请输入项目对应服务名称',
      type: 'input',
      placeholder: '请输入项目对应服务名称',
      component: null,
    },
    {
      name: 'owner',
      label: '项目负责人',
      required: true,
      component: <UserSelect users={users} placeholder="选择项目负责人"/>,
      type: 'select',
    },
    {
      name: 'description',
      label: '项目描述',
      required: false,
      message: '请输入项目描述',
      type: 'textarea',
      placeholder: '请输入项目描述',
    },
    {
      name: 'private',
      label: '是否私有',
      required: true,
      message: '请选择项目是否私有',
      type: 'switch',
      valuePropName: 'checked',
    },
  ];
  return (
    <Row gutter={8}>
      <Col span={24}>
        <ProjectForm left={6} right={18} record={data} onFinish={onFinish} fields={fields} reloadData={reloadData}/>
      </Col>
    </Row>
  );
}

