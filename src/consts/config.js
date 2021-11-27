import {Tag} from "antd";
import React from "react";

export const CONFIG = {
  // URL: 'http://121.5.2.74:7777',
  URL: 'http://localhost:7777',
  // URL: '',
  ICONFONT: '//at.alicdn.com/t/font_915840_xhtofa1czc7.js',
  ROLE: {
    0: 'user',
    1: 'admin',
    2: 'superAdmin',
  },
  EDITOR_THEME: ["material-one-dark", 'atom-one-dark', 'vs-dark', 'ambiance', 'chrome', 'dracula', 'eclipse', 'github', 'merbivore', 'merbivore_soft', 'monokai', 'terminal', 'xcode'],
  PIC_URL: 'https://cdn.pity.fun/',
  PROJECT_ROLE: {
    OWNER: '负责人',
    ADMIN: '组长',
    MEMBER: '组员',
  },
  PROJECT_ROLE_TO_ID: {
    OWNER: '2',
    MEMBER: '0',
    ADMIN: '1',
  },
  PROJECT_TAG: {
    OWNER: 'purple',
    MEMBER: 'pink',
  },
  PROJECT_ROLE_MAP: {
    1: '组长',
    0: '组员',
    // 2: "负责人"
  },
  PRIORITY: ['P0', 'P1', 'P2', 'P3', 'P4'],
  ASSERT_TYPE: {
    'equal': '等于',
    'not_equal': '不等于',
    'in': '包含于',
    'not_in': '不包含于',
    'contain': '包含',
    'not_contain': '不包含',
    'length_eq': '长度等于',
    'length_lt': '长度小于',
    'length_gt': '长度大于',
    'length_le': '长度小于等于',
    'length_ge': '长度大于等于',
    'json_equal': 'JSON等于'
  },
  ASSERT_TYPE_TAG: {
    'equal': <Tag color="success">等于</Tag>,
    'not_equal': <Tag color="danger">不等于</Tag>,
    'in': <Tag color="pink">包含于</Tag>,
    'not_in': <Tag color="blue">不包含于</Tag>,
    'contain': <Tag color="purple">包含</Tag>,
    'not_contain': <Tag color="orange">不包含</Tag>,
    'length_eq': <Tag color="orange">长度等于</Tag>,
    'length_lt': <Tag color="skyblue">长度小于</Tag>,
    'length_gt': <Tag color="green">长度大于</Tag>,
    'length_le': <Tag color="deeppink">长度小于等于</Tag>,
    'length_ge': <Tag>长度大于等于</Tag>,
    'json_equal': <Tag color="pink">JSON等于</Tag>,
  },
  // 用例状态
  CASE_STATUS: {
    1: '调试中',
    2: '暂时关闭',
    3: '正常运行',
  },
  REQUEST_TYPE: {
    1: 'Http',
    2: 'Grpc',
    3: 'Dubbo',
  },
  REQUEST_TYPE_TAG: {
    1: <Tag color="success">HTTP</Tag>,
    2: <Tag color="orange">GRPC</Tag>,
    3: <Tag color="blue">DUBBO</Tag>,
  },
  CASE_TAG: {
    'P0': 'magenta',
    'P1': 'red',
    'P2': 'volcano',
    'P3': 'orange',
    'P4': 'green',
  },
  REPORT_MODE: {
    0: <Tag>普通</Tag>,
    1: <Tag color="blue">测试计划</Tag>,
    2: <Tag color="success">CI</Tag>,
    3: <Tag>其他</Tag>,
  },
  CASE_TYPE: {
    0: <Tag color="success" style={{marginLeft: 8}}>普通</Tag>,
    1: <Tag color="blue" style={{marginLeft: 8}}>前置</Tag>,
    2: <Tag color="warning" style={{marginLeft: 8}}>数据工厂</Tag>,
  },
  CASE_CONSTRUCTOR: {
    0: '测试用例',
    1: 'SQL语句',
    2: 'Redis命令',
    3: 'HTTP请求',
    4: 'Python方法'
  },
  CASE_CONSTRUCTOR_COLOR: {
    0: 'success',
    1: 'blue',
    2: 'error',
    3: 'warning'
  },
  CASE_BADGE: {
    1: {
      status: 'processing',
      text: '调试中',
    },
    2: {
      status: 'default',
      text: '暂时关闭',
    },
    3: {
      status: 'success',
      text: '正常运行',
    },
  },
  SQL_TYPE: {
    0: 'MySQL',
    1: 'Postgresql'
  },
  LAYOUT: {
    labelCol: {span: 6},
    wrapperCol: {span: 18},
  },
  SUB_LAYOUT: {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
  },
  SQL_LAYOUT: {
    labelCol: {span: 4},
    wrapperCol: {span: 20},
  },
  CONSTRUCTOR_TYPE: {
    0: '测试用例',
    1: 'SQL语句',
    2: 'Redis语句',
    3: 'HTTP请求',
    4: 'Python方法'
  },
  MSG_TYPE: {
    0: '邮件',
    1: '钉钉',
    2: '企业微信',
    3: '飞书',
  },
  MSG_ICON: {
    0: "icon-dianziyoujian",
    1: 'icon-dingding01',
    2: 'icon-qiyeweixin',
    3: 'icon-feishu',
  },
  DEFAULT_AVATAR:
    'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn1.itc.cn%2Fimg8%2Fwb%2Frecom%2F2015%2F11%2F24%2F144832579376786755.jpeg&refer=http%3A%2F%2Fn1.itc.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620401980&t=9ee0f5e56b90bb80cfde8f7cc81c81ae',
};
