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
                redirect: '/request',
              },
              {
                path: '/request',
                name: '调试页面',
                icon: 'rocket',
                component: './Request',
              },
              {
                path: '/project',
                name: '项目列表',
                icon: 'book',
                component: './Project/Project',
              },
              {
                path: '/project/:id',
                hideInMenu: true,
                component: './project/ProjectDetail',
              },
              {
                path: '/config',
                icon: 'rocket',
                name: '配置中心',
                // authority: ['admin', 'user'],
                routes: [
                  {
                    path: '/config/environment',
                    name: '环境管理',
                    component: './Environment',
                  },
                  {
                    path: '/config/gconfig',
                    name: '全局变量',
                    component: './GConfig',
                  },
                ],
              },
              // {
              //   path: '/welcome',
              //   name: 'welcome',
              //   icon: 'smile',
              //   component: './Welcome',
              // },
              // {
              //   path: '/admin',
              //   name: 'admin',
              //   icon: 'crown',
              //   component: './Admin',
              //   authority: ['admin'],
              //   routes: [
              //     {
              //       path: '/admin/sub-page',
              //       name: 'sub-page',
              //       icon: 'smile',
              //       component: './Welcome',
              //       authority: ['admin'],
              //     },
              //   ],
              // },
              // {
              //   name: 'list.table-list',
              //   icon: 'table',
              //   path: '/list',
              //   component: './TableList',
              // },
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
