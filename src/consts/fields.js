import {CONFIG} from '@/consts/config';
import {AutoComplete, Badge, Input, Select} from 'antd';

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
      label: '用例名称',
      required: true,
      message: '请输入用例名称',
      type: 'input',
      placeholder: '请输入用例名称',
      component: null,
      span: 8,
    },
    {
      name: 'priority',
      label: '优先级',
      required: true,
      component: <Select>
        {CONFIG.PRIORITY.map(v => <Option key={v} value={v}>{v}</Option>)}
      </Select>,
      type: 'select',
      span: 8,
    },
    {
      name: 'status',
      label: '用例状态',
      required: true,
      component: <Select>
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
      component: <Select>
        {Object.keys(CONFIG.REQUEST_TYPE).map(key => <Option key={key} value={key}
                                                             disabled={key !== '1'}>{CONFIG.REQUEST_TYPE[key]}</Option>)}
      </Select>,
      type: 'select',
      span: 8,
    },
    {
      name: 'tag',
      label: '用例标签',
      required: false,
      component: <Select mode='tags' placeholder='请输入用例标签'>
      </Select>,
      type: 'select',
      span: 8,
    },
    {
      name: 'case_type',
      label: '用例类型',
      required: true,
      component: <Select placeholder='请选择用例类型'>
        <Option value={0}>普通用例</Option>
        <Option value={1}>前置用例</Option>
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
  ]
};
