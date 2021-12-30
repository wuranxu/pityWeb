import {DefaultFooter, getMenuData, getPageTitle} from '@ant-design/pro-layout';
import {HelmetProvider} from 'react-helmet-async';
import {connect, FormattedMessage, Link, useIntl} from 'umi';
import React from 'react';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';
import {Col, Row} from "antd";

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
    <HelmetProvider>
      {/*<Helmet>*/}
      {/*  <title>{title}</title>*/}
      {/*  <meta name="description" content={title} />*/}
      {/*</Helmet>*/}
      <div className={styles.container}>
        {/*<div className={styles.lang}>*/}
        {/*  <SelectLang />*/}
        {/*</div>*/}
        <div className={styles.content}>
          <Row>
            <Col span={16}>
              <div className={styles.left_content}>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.right_content}>
                <div className={styles.top}>
                  <div className={styles.header}>
                    <Link to="/">
                      <img alt="logo" className={styles.logo} src={logo}/>
                      <span className={styles.title}>Pity</span>
                    </Link>
                  </div>
                  <div className={styles.desc}>
                    <FormattedMessage
                      id="pages.layouts.userLayout.title"
                      defaultMessage="Pity是一款开源且自由的接口自动化平台"
                    />
                  </div>
                </div>
                {children}
                <DefaultFooter copyright={`${new Date().getFullYear()} woody个人出品`} links={false} style={{
                  background: '#f8f8f8'
                }}/>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default connect(({settings}) => ({...settings}))(UserLayout);
