import {BellOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {useEmotionCss} from '@ant-design/use-emotion-css';
import {history, useModel} from '@umijs/max';
import {Badge, Tooltip} from 'antd';
import React from 'react';
import Avatar from './AvatarDropdown';
import "./index.less"

const GlobalHeaderRight = () => {
  const className = useEmotionCss(() => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      gap: 8,
    };
  });

  const actionClassName = useEmotionCss(({token}) => {
    return {
      display: 'flex',
      float: 'right',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      cursor: 'pointer',
      padding: '0 12px',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  const badgeClassName = useEmotionCss(() => {
    return {
      lineHeight: '48px',
      color: 'inherit',
    }
  })

  const {initialState} = useModel('@@initialState');
  const {noticeCount} = useModel('notice')

  if (!initialState || !initialState.settings) {
    return null;
  }

  return (
    <div className={className}>
      <Tooltip title="消息中心">
        <span className={actionClassName}
              onClick={() => {
                history.push("/notification")
              }}
        >
          <Badge className={badgeClassName} showZero={false} count={noticeCount || 0} size="small">
              <BellOutlined/>
          </Badge>
        </span>
      </Tooltip>
      <span
        className={actionClassName}
        onClick={() => {
          // https://wuranxu.github.io/pityDoc/
          window.open('https://www.siyuai.xyz/');
        }}
      >
        <QuestionCircleOutlined/>
      </span>
      <Avatar/>
      {/*<SelectLang className={actionClassName} />*/}
    </div>
  );
};

export default GlobalHeaderRight;
