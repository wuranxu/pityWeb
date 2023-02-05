import CONFIG from '@/consts/config';
import {AutoComplete, Badge, Input, Select} from 'antd';
import {REQUEST_TYPE} from "@/components/Common/global";

const {Option} = Select;
const {TextArea} = Input;

const options = [
  {
    label: "${response}",
    value: "${response}",
  },
  {
    label: "${status_code}",
    value: "${status_code}",
  },
]

export default {
  CaseAsserts: [
    {
      name: 'name',
      label: '验证点',
      required: true,
      message: '请输入验证点',
      type: 'input',
      placeholder: '请输入验证点',
      component: null,
      span: 24,
    },
    {
      name: 'assert_type',
      label: '校验方式',
      required: true,
      component: <Select placeholder="选择校验方式，支持JSON深层次判断">
        {Object.keys(CONFIG.ASSERT_TYPE).map(v => <Option key={v} value={v}>{CONFIG.ASSERT_TYPE[v]}</Option>)}
      </Select>,
      type: 'select',
      span: 24,
    },
    {
      name: 'expected',
      label: '预期结果',
      required: true,
      message: '请输入预期结果',
      component: <AutoComplete
        options={[]}
      >
        <TextArea
          placeholder="请输入预期结果，支持变量哦"
        />
      </AutoComplete>,
      span: 24,
    },
    {
      name: 'actually',
      label: '实际结果',
      required: true,
      message: '请输入实际结果',
      component: <AutoComplete
        options={options}
      >
        <TextArea
          placeholder="请输入实际结果，支持变量哦"
        />
      </AutoComplete>,
      span: 24,
    },
  ],

  CaseDetail: [
    {
      name: 'name',
      label: '场景名称',
      required: true,
      message: '请输入场景名称',
      type: 'input',
      placeholder: '请输入场景名称',
      component: null,
      span: 8,
    },
    {
      name: 'priority',
      label: '优先级',
      required: true,
      component: <Select placeholder="请选择优先级">
        {CONFIG.PRIORITY.map(v => <Option key={v} value={v}>{v}</Option>)}
      </Select>,
      type: 'select',
      span: 8,
    },
    {
      name: 'status',
      label: '状态',
      required: true,
      component: <Select placeholder="请选择当前场景状态">
        {Object.keys(CONFIG.CASE_STATUS).map(key => <Option key={key} value={key}>{
          <Badge {...CONFIG.CASE_BADGE[key]} />}</Option>)}
      </Select>,
      type: 'select',
      span: 8,
    },
    {
      name: 'request_type',
      label: '请求类型',
      required: true,
      component: <Select placeholder="请选择请求协议">
        {Object.keys(REQUEST_TYPE).map(key => <Option key={key} value={key}
                                                             disabled={key !== '1'}>{REQUEST_TYPE[key]}</Option>)}
      </Select>,
      type: 'select',
      span: 8,
    },
    {
      name: 'tag',
      label: '场景标签',
      required: false,
      component: <Select mode='tags' placeholder='请输入场景标签'>
      </Select>,
      type: 'select',
      span: 8,
    },
    {
      name: 'case_type',
      label: '场景类型',
      required: true,
      component: <Select placeholder='请选择场景类型'>
        <Option value={0}>普通场景</Option>
        <Option value={1}>前置场景</Option>
        <Option value={2}>数据工厂</Option>
      </Select>,
      type: 'select',
      span: 8,
    },
  ],

  Environment: [
    {
      name: 'name',
      label: '环境名称',
      required: true,
      message: '请输入环境名称',
      type: 'input',
      placeholder: '请输入环境名称',
      component: null,
      span: 24,
    },
    {
      name: 'remarks',
      label: '备注',
      required: false,
      message: '请输入备注',
      placeholder: '请输入备注',
      component: <Input.TextArea maxLength={200}/>,
      span: 24,
    },
  ],
};
