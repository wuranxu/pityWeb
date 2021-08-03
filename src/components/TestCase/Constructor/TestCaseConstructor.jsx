import {Cascader, Select, Switch, Tooltip} from "antd";
import QuestionOutlined from '@ant-design/icons';
import CodeEditor from "@/components/Postman/CodeEditor";
import React, {useEffect} from "react";
import CommonForm from "@/components/PityForm/CommonForm";

const {Option} = Select;

export default ({data, form, dispatch, testcaseData, constructorType}) => {

  useEffect(() => {
    dispatch({
      type: 'construct/getTestCaseListTree',
    })
  }, [])

  console.log(data);


  const fields = [
    {
      name: 'type',
      label: '数据类型',
      required: true,
      initialValue: data.type,
      component: <Select disabled defaultValue={constructorType}>
        <Option value={0}>测试用例</Option>
        <Option value={1}>sql</Option>
        <Option value={2}>Redis</Option>
      </Select>,
    },
    {
      name: 'name',
      label: '名称',
      required: true,
      type: 'input',
      placeholder: '请输入构造名称',
      initialValue: data.name,
    },
    {
      name: 'case_id',
      label: '测试用例',
      required: true,
      placeholder: '请输入构造名称',
      component: <Cascader options={testcaseData} placeholder="请选择用例"/>,
    },
    {
      name: 'params',
      label: '动态参数',
      required: false,
      component: <CodeEditor language='json' theme='vs-dark' height={200} options={{lineNumbers: 'off'}}/>,
    },
    {
      name: 'value',
      label: '返回值',
      required: false,
      type: 'input',
      initialValue: data.value,
    },
    {
      name: 'public',
      label: <span><Tooltip title="开启共享后, 其他人可使用你的数据构造器"><QuestionOutlined/></Tooltip> 共享</span>,
      required: true,
      component: <Switch/>,
      valuePropName: 'checked',
      initialValue: data.public,
    },
    {
      name: 'enable',
      label: '启用',
      required: true,
      component: <Switch/>,
      valuePropName: 'checked',
      initialValue: data.enable,
    },

  ];


  return (
    <CommonForm fields={fields} left={4} right={20} record={data} pForm={form}/>
  )
}
