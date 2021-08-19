export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/index',
              },
              {
                path: '/index',
                name: '工作台',
                icon: 'icon-gongzuotai2',
                component: './Dashboard/Workspace',
              },
              {
                path: '/apiTest',
                name: '接口测试',
                icon: 'icon-Project',
                routes: [
                  {
                    path: '/apiTest/project',
                    name: '项目列表',
                    component: './ApiTest/Project',
                  },
                  {
                    path: '/apiTest/project/:id',
                    hideInMenu: true,
                    component: './ApiTest/ProjectDetail',
                  },
                  {
                    path: '/apiTest/testcase',
                    name: '用例列表',
                  },
                  {
                    path: '/apiTest/testcase',
                    name: '定时任务',
                  },
                  {
                    path: '/apiTest/testcase',
                    name: '数据统计',
                  },
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
                    component: './BuildHistory/ReportDetail',
                  },
                ],
              },
              {
                path: '/precise',
                icon: 'icon-jingzhun',
                name: '精准测试',
              },
              {
                path: '/factory',
                icon: 'icon-hebingxingzhuang',
                name: '数据工厂',
              },
              {
                path: '/config',
                icon: 'icon-config',
                name: '管理中心',
                routes: [
                  {
                    path: '/config/environment',
                    name: '环境管理',
                    component: './Config/Environment',
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
                    path: '/config/user',
                    name: '用户管理',
                    component: './Config/UserList',
                  },
                ],
              },
              {
                path: '/tool',
                name: '实用工具',
                icon: 'tool',
                routes: [
                  {
                    path: '/Tool/request',
                    name: 'HTTP测试',
                    icon: 'icon-yunhang',
                    component: './Tool/Request',
                  },
                  {
                    path: '/tool/sql',
                    name: '执行SQL',
                    icon: 'database',
                    component: './Tool/SqlOnline',
                  },
                  {
                    path: '/tool/redis',
                    name: '执行Redis',
                    icon: 'redis',
                    component: './Tool/RedisOnline',
                  },
                ]
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
