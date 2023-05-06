import defaultSettings from "../../config/defaultSettings";
const isDev = () => {
  return window.location.href.indexOf("localhost") > -1 || window.location.href.indexOf("127.0.0.1") > -1;
}

const dev = isDev()

const getUrl = () => {
  if (defaultSettings.apiUrl) {
    return defaultSettings.apiUrl;
  }
  return dev ? 'http://localhost:7777' : 'http://45.143.233.102:7777'
}

const URL = getUrl();

const getWss = () => {
  if (defaultSettings.wssUrl) {
    return defaultSettings.wssUrl;
  }
  return dev ? 'ws://127.0.0.1:7777/ws' : 'wss://api.pity.fun/ws'
}

const CONFIG = {
  URL,
  WS_URL: getWss(),
  ICONFONT: defaultSettings.iconfontUrl,
  OSS_URL: "http://oss.pity.fun/pity",
  AVATAR_URL: 'https://www.siyuai.xyz/sylogo.png',
  DOCUMENT_URL: 'https://wuranxu.github.io/pityDoc',
  PROJECT_AVATAR_URL: 'https://static.pity.fun/picture/20220809232253.png',
  ROLE: {
    0: 'user',
    1: 'admin',
    2: 'superAdmin',
  },
  USER_ROLE: {
    0: '普通用户',
    1: '组长',
    2: '超级管理员',
  },
  USER_ROLE_TAG: {
    0: 'default',
    1: 'blue',
    2: 'success',
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
  CONFIG_TYPE_TAG: {
    JSON: 'green',
    Yaml: 'pink',
    String: 'blue',
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
    'text_in': '文本包含于',
    'not_in': '不包含于',
    'text_not_in': '文本不包含于',
    'contain': '包含',
    'not_contain': '不包含',
    'length_eq': '长度等于',
    'length_lt': '长度小于',
    'length_gt': '长度大于',
    'length_le': '长度小于等于',
    'length_ge': '长度大于等于',
    'json_equal': 'JSON等于'
  },
  CASE_STATUS: {
    1: '调试中',
    2: '暂时关闭',
    3: '正常运行',
  },
  CASE_TAG: {
    'P0': 'magenta',
    'P1': 'red',
    'P2': 'volcano',
    'P3': 'orange',
    'P4': 'green',
  },
  CASE_CONSTRUCTOR: {
    0: '测试场景',
    1: 'SQL语句',
    2: 'Redis命令',
    4: 'HTTP请求',
    3: 'Python方法'
  },
  CASE_CONSTRUCTOR_COLOR: {
    0: 'success',
    1: 'blue',
    2: 'error',
    3: 'warning',
    4: 'orange',
  },
  CASE_BADGE: {
    1: {
      status: 'processing',
      text: '调试中',
    },
    2: {
      status: 'error',
      text: '已停用',
    },
    3: {
      status: 'success',
      text: '正常',
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
  SWITCH_LAYOUT: {
    labelCol: {span: 16},
    wrapperCol: {span: 8},
  },
  SQL_LAYOUT: {
    labelCol: {span: 4},
    wrapperCol: {span: 20},
  },
  CONSTRUCTOR_TYPE: {
    0: '测试场景',
    1: 'SQL语句',
    2: 'Redis语句',
    4: 'HTTP请求',
    3: 'Python方法'
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
  WECHAT_URL: "https://static.pity.fun/picture/20220813204341.png",
}

export default CONFIG;
