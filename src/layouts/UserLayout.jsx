import {DefaultFooter, getMenuData, getPageTitle} from '@ant-design/pro-layout';
import {connect, FormattedMessage, Link, useIntl} from 'umi';
import React from 'react';
import login from '../assets/login.svg';
import logo from '../assets/logo.svg';
import './index.css';
import styles from './UserLayout.less';

const UserLayout = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const {routes = []} = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const {formatMessage} = useIntl();
  const {breadcrumb} = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (

    <div className="container">
      <div className="form-warp">
        <div>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo}/>
                <span className={styles.title}>pity</span>
              </Link>
            </div>
            <div className={styles.desc}>
              <FormattedMessage
                id="pages.layouts.userLayout.title"
                defaultMessage="pity是一款开源且自由的接口自动化平台"
              />
            </div>
          </div>
        </div>
        {children}
        <DefaultFooter copyright={
          <span>{new Date().getFullYear()} woody个人出品 <a
            href="https://beian.miit.gov.cn">鄂ICP备20001602号</a></span>} links={false} style={{
          background: '#ffffff'
        }}/>
      </div>
      <div className="desc-warp">
        <div className="desc-warp-item sign-up-desc">
          <div className="content">
          </div>
          <img className="image" src={login} alt=""/>
        </div>
      </div>
    </div>
  );
};

export default connect(({settings}) => ({...settings}))(UserLayout);
