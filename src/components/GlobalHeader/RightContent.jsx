import {Badge, Tag, Tooltip} from 'antd';
import {NotificationOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import React, {useState} from 'react';
import {connect} from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import Version from "@/components/Drawer/Version";

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight = (props) => {
  const {theme, layout} = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const [visible, setVisible] = useState(false);

  return (
    <div className={className}>
      {/*<HeaderSearch*/}
      {/*  className={`${styles.action} ${styles.search}`}*/}
      {/*  placeholder="站内搜索"*/}
      {/*  defaultValue="umi ui"*/}
      {/*  options={[*/}
      {/*    {*/}
      {/*      label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>,*/}
      {/*      value: 'umi ui',*/}
      {/*    },*/}
      {/*    {*/}
      {/*      label: <a href="next.ant.design">Ant Design</a>,*/}
      {/*      value: 'Ant Design',*/}
      {/*    },*/}
      {/*    {*/}
      {/*      label: <a href="https://protable.ant.design/">Pro Table</a>,*/}
      {/*      value: 'Pro Table',*/}
      {/*    },*/}
      {/*    {*/}
      {/*      label: <a href="https://prolayout.ant.design/">Pro Layout</a>,*/}
      {/*      value: 'Pro Layout',*/}
      {/*    },*/}
      {/*  ]} // onSearch={value => {*/}
      {/*  //   //console.log('input', value);*/}
      {/*  // }}*/}
      {/*/>*/}
      <Version visible={visible} setVisible={setVisible}/>
      <Tooltip title="版本更新">
        <a
          onClick={() => {
            setVisible(true)
            localStorage.setItem("read", "ok");
          }}
          style={{
            color: 'inherit',
          }}
          className={styles.action}
        >
          <Badge dot={localStorage.getItem("read") !== 'ok'}>
            <NotificationOutlined/>
          </Badge>
        </a>
      </Tooltip>
      <Tooltip title="使用文档">
        <a
          style={{
            color: 'inherit',
          }}
          target="_blank"
          href="https://pity.readthedocs.io"
          rel="noopener noreferrer"
          className={styles.action}
        >
          <QuestionCircleOutlined/>
        </a>
      </Tooltip>
      <Avatar menu/>
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
      {/*<SelectLang className={styles.action} />*/}
    </div>
  );
};

export default connect(({settings}) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
