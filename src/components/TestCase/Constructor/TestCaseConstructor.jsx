import {Select, Switch, Tooltip} from "antd";
import QuestionOutlined from '@ant-design/icons';
import React, {useEffect, useState} from "react";
import CommonForm from "@/components/PityForm/CommonForm";
import {CONFIG} from "@/consts/config";
import JSONAceEditor from "@/components/CodeEditor/AceEditor/JSONAceEditor";

const {Option} = Select;

export default ({data, form, dispatch, testcaseData, constructorType}) => {

  const [_, setEditor] = useState(null);

  useEffect(() => {
    dispatch({
      type: 'construct/getTestCaseListTree',
    })
  }, [])


  const fields = [
    {
      name: 'name',
      label: '名称',
      required: true,
      type: 'input',
      placeholder: '请输入数据构造器名称',
      initialValue: data.name,
      span: 12,
      layout: {
        labelCol: {span: 8},
        wrapperCol: {span: 16},
      }
    },
    {
      name: 'constructor_case_id',
      label: '测试用例',
      required: true,
      initialValue: data.constructor_case_id,
      placeholder: '请选择用例',
      component: <Select placeholder="请选择用例">
        {
          testcaseData.map(v => <Option key={v.id} value={v.id}>{v.name}</Option>)
        }
      </Select>,
      span: 12,
      layout: {
        labelCol: {span: 8},
        wrapperCol: {span: 16},
      }
    },
    {
      name: 'value',
      label: '返回值',
      placeholder: "请填写返回变量名称，不需要可不填",
      required: false,
      type: 'input',
      initialValue: data.value,
      span: 12,
      layout: {
        labelCol: {span: 8},
        wrapperCol: {span: 16},
      }
    },
    {
      name: 'public',
      label: <Tooltip title="开启共享后, 其他人可使用你的数据构造器"><span>共享<QuestionOutlined/></span></Tooltip>,
      required: true,
      component: <Switch/>,
      valuePropName: 'checked',
      initialValue: data.public,
      span: 6,
      layout: {
        labelCol: {span: 16},
        wrapperCol: {span: 8},
      }
    },
    {
      name: 'enable',
      label: '启用',
      required: true,
      component: <Switch/>,
      valuePropName: 'checked',
      initialValue: data.enable,
      span: 6,
      layout: {
        labelCol: {span: 16},
        wrapperCol: {span: 8},
      }
    },
    {
      name: 'params',
      label: '动态参数',
      required: false,
      component: <JSONAceEditor height={150} setEditor={setEditor}/>,
    },


  ];


  return (
    <CommonForm fields={fields} left={4} right={20} record={data} pForm={form}/>
  )
}
