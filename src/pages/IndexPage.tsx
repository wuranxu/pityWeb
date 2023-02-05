import CONFIG from '@/consts/config';
import {useModel} from '@umijs/max';
import React, {useEffect} from 'react';
import {notification} from "antd";


// @ts-ignore
const IndexPage: React.FC = () => {
  const {initialState} = useModel('@@initialState');
  const {noticeCount, setNoticeCount} = useModel("notice");
  const { currentUser } = initialState ?? {};

  useEffect(() => {
    if (currentUser && currentUser.id) {
      const ws = new WebSocket(`${CONFIG.WS_URL}/${currentUser.id}`);
      ws.onmessage = function (event) {
        event.preventDefault()
        const messages = event.data;
        const msg = JSON.parse(messages)
        if (msg.type === 0) {
          setNoticeCount(msg.total ? msg.count : msg.count + noticeCount)
        } else if (msg.type === 1) {
          notification.info({
            message: msg.title,
            description: msg.content
          })
        } else if (msg.type === 2) {
          // 说明是录制消息
          // dispatch({
          //   type: 'recorder/readRecord',
          //   payload: {
          //     data: JSON.parse(msg.record_msg),
          //   }
          // })
        } else if (msg.type === 3) {
          // 心跳包，忽略
        }
      };
    }
  }, []);

  return (
    <></>
  );
};

export default IndexPage;
