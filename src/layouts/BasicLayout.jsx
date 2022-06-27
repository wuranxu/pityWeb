/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 *
 * @see You can view component api by: https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, {DefaultFooter, getMenuData, ProBreadcrumb} from '@ant-design/pro-layout';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {connect, history, Link, useIntl} from 'umi';
import {GithubOutlined} from '@ant-design/icons';
import {Button, ConfigProvider, Empty, notification, Result} from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import {getMatchMenu} from '@umijs/route-utils';
import logo from '../assets/logo.svg';
import {CONFIG} from "@/consts/config";
import NoTableData from "@/assets/NoSearch.svg";
import NProgress from "nprogress";
import 'nprogress/nprogress.css'

// Spin.setDefaultIndicator(<IconFont type="icon-icon-1" spin style={{fontSize: 36}}/>)

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

/** Use Authorized check all menu item */
const menuDataRender = (menuList) =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null);
  });

const defaultFooterDom = (
  <DefaultFooter
    copyright={<span>{new Date().getFullYear()} woody个人出品 <a
      href="https://beian.miit.gov.cn">鄂ICP备20001602号</a></span>}
    links={[
      {
        key: 'pityWeb',
        title: 'pityWeb',
        href: 'http://47.112.32.195/',
        blankTarget: true,
      },
      {
        key: 'github',
        title: <GithubOutlined/>,
        href: 'https://github.com/wuranxu/pityWeb',
        blankTarget: true,
      },
      {
        key: 'pity',
        title: 'pity',
        href: 'https://github.com/wuranxu/pity',
        blankTarget: true,
      },
    ]}
  />
);

NProgress.configure({showSpinner: true});

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    recorder,
    settings,
    location = {
      pathname: '/',
    },
    noticeCount,
  } = props;
  const {currentUser} = props.user;
  const menuDataRef = useRef([]);
  const [currentHref, setCurrentHref] = useState('');

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
    if (currentUser) {
      const ws = new WebSocket(`${CONFIG.WS_URL}/${currentUser.id}`);
      ws.onmessage = function (event) {
        event.preventDefault()
        const messages = event.data;
        const msg = JSON.parse(messages)
        if (msg.type === 0) {
          dispatch({
            type: 'global/save',
            payload: {
              noticeCount: msg.total ? msg.count : msg.count + noticeCount,
            }
          })
        } else if (msg.type === 1) {
          notification.info({
            message: msg.title,
            description: msg.content
          })
        } else if (msg.type === 2) {
          // 说明是录制消息
          dispatch({
            type: 'recorder/readRecord',
            payload: {
              data: JSON.parse(msg.record_msg),
            }
          })
        } else if (msg.type === 3) {
          // 心跳包，忽略
        }
      };
    }
  }, []);
  /** Init variables */

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority


  const {route = {routes: [],},} = props;
  const {routes = []} = route
  const menu = getMenuData(routes)

  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menu.menuData).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );
  const {formatMessage} = useIntl();

  const {ld} = props;
  const {href} = window.location; // 浏览器地址栏中地址
  if (currentHref !== href) {
    NProgress.start();
    if (!ld.global) {
      NProgress.done();
      setCurrentHref(href);
    }
  }

  return (

    <ConfigProvider renderEmpty={() => <Empty image={NoTableData} imageStyle={{height: 160}}
                                              description="暂无数据"/>}>
      <ProLayout
        logo={logo}
        SiderMenuProps={{mode: 'horizontal'}}
        // formatMessage={formatMessage}
        {...props}
        {...settings}
        onCollapse={handleMenuCollapse}
        onMenuHeaderClick={() => history.push('/')}
        headerContentRender={() => {
          return <ProBreadcrumb/>;
        }}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (
            menuItemProps.isUrl ||
            !menuItemProps.path ||
            location.pathname === menuItemProps.path
          ) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
            }),
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        footerRender={() => {
          if (settings.footerRender || settings.footerRender === undefined) {
            return defaultFooterDom;
          }

          return null;
        }}
        menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent/>}
        postMenuData={(menuData) => {
          menuDataRef.current = menuData || [];
          return menuData || [];
        }}
        iconfontUrl={CONFIG.ICONFONT}
        // layout='top'
      >
        <Authorized authority={authorized.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
    </ConfigProvider>
  );
};

export default connect(({user, global, settings, recorder, loading}) => ({
  collapsed: global.collapsed,
  noticeCount: global.noticeCount,
  settings,
  recorder,
  user,
  ld: loading,
}))(BasicLayout);
