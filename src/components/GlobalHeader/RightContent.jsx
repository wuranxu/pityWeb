import {Badge, Modal, Tag, Tooltip} from 'antd';
import {BellOutlined, QuestionCircleOutlined, WechatOutlined} from '@ant-design/icons';
import React, {useState} from 'react';
import {connect, history} from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import Version from "@/components/Drawer/Version";
import {CONFIG} from "@/consts/config";

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
  const {noticeCount} = props.global;

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
      <Tooltip title="联系作者">
        <a
          onClick={() => {
            Modal.info({
              title: '联系作者',
              width: 600,
              style: {
                marginTop: -80,
              },
              bodyStyle: {
                marginLeft: 0,
              },
              content: (
                <div style={{textAlign: 'center'}}>
                  <img height={400} width={300} src={CONFIG.WECHAT_URL} alt=""/>
                </div>
              )
            })
          }}
          style={{
            color: '#52c41a',
          }}
          className={styles.action}
        >
          <WechatOutlined style={{fontSize: 16}}/>
        </a>
      </Tooltip>
      <Tooltip title="消息中心">
        <a
          onClick={() => {
            history.push("/notification")
          }}
          style={{
            color: 'inherit',
          }}
          className={styles.action}
        >
          <Badge showZero={false} size="small" count={noticeCount}>
            <BellOutlined style={{fontSize: 16}}/>
          </Badge>
        </a>
      </Tooltip>
      <Tooltip title="使用文档">
        <a
          style={{
            color: 'inherit',
          }}
          target="_blank"
          href="https://wuranxu.github.io/pityDoc"
          rel="noopener noreferrer"
          className={styles.action}
        >
          <QuestionCircleOutlined style={{fontSize: 16}}/>
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

export default connect(({settings, global}) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  global,
}))(GlobalHeaderRight);
