/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    title: '玩转接口测试',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/',
    redirect: '/dashboard/workspace',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    routes: [
      {
        path: '/dashboard/workspace',
        name: 'workspace',
        component: './Dashboard/Workspace',
      },
      {
        path: '/dashboard/statistics',
        name: 'statistics',
        component: "./Statistics"
      },
    ]
  },
  {
    path: '/account/settings',
    name: '个人设置',
    component: './account/settings',
    hideInMenu: true,
  },
  {
    path: '/member/:user_id',
    name: '用户资料',
    component: './UserInfo',
    hideInMenu: true,
  },
  {
    path: '/project',
    name: '项目管理',
    icon: 'icon-Project',
    component: './ApiTest/Project',
  },
  {
    path: '/project/:id',
    hideInMenu: true,
    name: '项目详情',
    component: './ApiTest/ProjectDetail',
  },
  {
    path: '/apiTest',
    name: '接口测试',
    icon: 'api',
    routes: [
      {
        path: '/apiTest/testcase',
        name: '接口用例',
        component: "./ApiTest/TestCaseDirectory"
      },
      {
        path: '/apiTest/record',
        name: '用例录制',
        component: "./ApiTest/TestCaseRecorder"
      },
      {
        path: '/apiTest/testcase/:directory/add',
        name: '添加用例',
        hideInMenu: true,
        component: "./ApiTest/TestCaseComponent"
      },
      {
        path: '/apiTest/testcase/:directory/:case_id',
        name: '编辑用例',
        hideInMenu: true,
        component: "./ApiTest/TestCaseComponent"
      },
      {
        path: '/apiTest/testplan',
        name: '测试计划',
        component: './ApiTest/TestPlan'
      }
    ]
  },
  {
    path: '/record',
    icon: 'icon-jilu1',
    name: '测试报告',
    routes: [
      {
        path: '/record/list',
        name: '构建历史',
        component: './BuildHistory/ReportList',
      },
      {
        path: '/record/report/:id',
        hideInMenu: true,
        name: '测试报告',
        component: './BuildHistory/ReportDetail',
      },
    ],
  },
  {
    path: '/notification',
    name: '消息中心',
    hideInMenu: true,
    component: './Notification'
  },
  {
    path: '/config',
    icon: 'icon-config',
    name: '测试配置',
    authority: ['superAdmin', 'admin'],
    routes: [
      {
        path: '/config/environment',
        name: '环境管理',
        component: './Config/Environment',
      },
      {
        path: '/config/address',
        name: '地址管理',
        component: './Config/Address',
      },
      {
        path: '/config/gconfig',
        name: '全局变量',
        component: './Config/GConfig',
      },
      {
        path: '/config/database',
        name: '数据库配置',
        component: './Config/Database',
      },
      {
        path: '/config/redis',
        name: 'Redis配置',
        component: './Config/Redis',
      },
      {
        path: '/config/oss',
        name: 'oss文件',
        component: './Config/Oss',
      },
    ]
  },
  {
    path: '/system',
    icon: 'lock',
    name: '后台管理',
    authority: ['superAdmin'],
    routes: [
      {
        path: '/system/configure',
        name: '系统设置',
        component: './Config/SystemConfig',
      },
      {
        path: '/system/user',
        name: '用户管理',
        component: './Manager/UserList',
        authority: ['superAdmin'],
      },
    ],
  },
  {
    path: '/mock',
    icon: 'icon-mockplus_doc',
    name: 'Mock配置',
    component: "./Building"
  },
  {
    path: '/tool',
    name: '实用工具',
    icon: 'tool',
    routes: [
      {
        path: '/tool/request',
        name: 'HTTP测试',
        icon: 'icon-yunhang',
        component: './Tool/Request',
      },
      {
        path: '/tool/sql',
        name: 'SQL客户端',
        icon: 'database',
        component: './Tool/SqlOnline',
      },
      {
        path: '/tool/redis',
        name: 'Redis客户端',
        icon: 'redis',
        component: './Tool/RedisOnline',
      },
    ]
  },
  {
    path: '/ci',
    icon: 'icon-CI',
    name: '持续集成',
    component: "./Building"
  },
  {
    path: '/precise',
    icon: 'icon-jingzhun',
    name: '精准测试',
    component: "./Building"
  },
  {
    path: '/datafactory',
    icon: 'icon-hebingxingzhuang',
    name: '数据工厂',
    component: "./datafactory"
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
