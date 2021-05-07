import { CONFIG } from '@/consts/config';
import { Select, Badge } from 'antd';

const { Option } = Select;
// const Option = Select.Option;

export default {
  CaseAsserts: [
    {
      name: 'name',
      label: '标题',
      required: true,
      message: '请输入断言标题',
      type: 'input',
      placeholder: '请输入断言标题',
      component: null,
      span: 24,
    },
    {
      name: 'assert_type',
      label: '校验方式',
      required: true,
      component: <Select>
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
      type: 'input',
      placeholder: '请输入预期结果，支持变量',
      component: null,
      span: 24,
    },
    {
      name: 'actually',
      label: '实际结果',
      required: true,
      message: '请输入实际结果',
      type: 'input',
      placeholder: '请输入实际结果，支持变量',
      component: null,
      span: 24,
    },
  ],

  CaseDetail: [
    {
      name: 'catalogue',
      label: '用例目录',
      required: true,
      message: '请输入用例目录',
      type: 'input',
      placeholder: '请输入用例目录',
      component: null,
      span: 12,
    },
    {
      name: 'name',
      label: '用例名称',
      required: true,
      message: '请输入用例名称',
      type: 'input',
      placeholder: '请输入用例名称',
      component: null,
      span: 12,
    },
    {
      name: 'priority',
      label: '用例优先级',
      required: true,
      component: <Select>
        {CONFIG.PRIORITY.map(v => <Option value={v}>{v}</Option>)}
      </Select>,
      type: 'select',
      span: 12,
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
      span: 12,
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
      span: 12,
    },
    {
      name: 'tag',
      label: '用例标签',
      required: false,
      component: <Select mode='tags' placeholder='请输入用例标签'>
      </Select>,
      type: 'select',
      span: 12,
    },
  ],
};
