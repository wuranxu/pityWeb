import {Select, Switch, Tooltip} from "antd";
import QuestionOutlined from '@ant-design/icons';
import CodeEditor from "@/components/Postman/CodeEditor";
import React, {useEffect} from "react";
import CommonForm from "@/components/PityForm/CommonForm";
import {CONFIG} from "@/consts/config";

const {Option} = Select;

export default ({data, form, dispatch, testcaseData, constructorType}) => {

  useEffect(() => {
    dispatch({
      type: 'construct/getTestCaseListTree',
    })
  }, [])


  const fields = [
    {
      name: 'type',
      label: '数据类型',
      required: true,
      initialValue: data.type,
      component: <Select disabled defaultValue={constructorType}>
        {
          Object.keys(CONFIG.CONSTRUCTOR_TYPE).map(key => <Option value={parseInt(key, 10)}
                                                                  key={key}>{CONFIG.CONSTRUCTOR_TYPE[key]}</Option>)
        }
      </Select>,
    },
    {
      name: 'name',
      label: '名称',
      required: true,
      type: 'input',
      placeholder: '请输入数据构造器名称',
      initialValue: data.name,
    },
    {
      name: 'case_id',
      label: '测试用例',
      required: true,
      placeholder: '请选择用例',
      component: <Select placeholder="请选择用例">
        {
          testcaseData.map(v => <Option key={v.id} value={v.id}>{v.name}</Option>)
        }
      </Select>,
    },
    {
      name: 'params',
      label: '动态参数',
      required: false,
      component: <CodeEditor language='json' theme='vs-dark' height={100} options={{lineNumbers: 'off'}}/>,
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
      label: <Tooltip title="开启共享后, 其他人可使用你的数据构造器"><span>共享<QuestionOutlined/></span></Tooltip>,
      required: true,
      component: <Switch/>,
      valuePropName: 'checked',
      initialValue: data.public,
      span: 12,
      layout: {
        labelCol: {span: 8},
        wrapperCol: {span: 16},
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
        labelCol: {span: 6},
        wrapperCol: {span: 18},
      }
    },

  ];


  return (
    <CommonForm fields={fields} left={4} right={20} record={data} pForm={form}/>
  )
}
