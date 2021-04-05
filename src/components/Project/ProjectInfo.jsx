import React, {useEffect} from 'react';
import {Row, Col, Select} from 'antd';
import CustomForm from "@/components/EagleForm/CustomForm";
import {connect} from 'umi';


const {Option} = Select;

const ProjectInfo = ({data, user, dispatch}) => {

  useEffect(() => {
    dispatch({
      type: 'user/fetch'
    })
  }, [])

  const onFinish = (values) => {
    const project = {
      ...data,
      ...values,
      avatar: data.avatar,
    }
    dispatch({
      type: 'project/update',
      payload: project,
    })
  }

  const opt = <Select placeholder="请选择项目组长">
    {
      user.users.map(item => <Option value={item.value}>{item.label}</Option>)
    }
  </Select>

  const fields = [
    {
      name: 'projectName',
      label: '项目名称',
      required: true,
      message: "请输入项目名称",
      type: 'input',
      placeholder: "请输入项目名称",
      component: null,
    },
    {
      name: 'gitlabUrl',
      label: 'gitlab ID',
      required: true,
      message: "请输入gitlab项目id, 如有多个用,隔开",
      type: 'input',
      placeholder: "请输入gitlab项目id",
    },
    {
      name: 'owner',
      label: '项目组长',
      required: true,
      component: opt,
      type: 'select',
    },
    {
      name: 'description',
      label: '项目描述',
      required: false,
      message: "请输入项目描述",
      type: 'textarea',
      placeholder: "请输入项目描述",
    },
  ]
  return (
    <Row gutter={8}>
      <Col span={24}>
        <CustomForm left={6} right={18} record={data} onFinish={onFinish} fields={fields}/>
      </Col>
    </Row>
  )
}

export default connect(({project, user}) => ({project, user}))(ProjectInfo);
