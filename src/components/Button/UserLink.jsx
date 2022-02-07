import React from 'react';
import {Avatar, Tooltip} from "antd";
import styles from "@/components/GlobalHeader/index.less";
import {CONFIG} from "@/consts/config";
import logo from '@/assets/logo.svg';

export default ({user, size = 24, marginLeft = 4}) => {
  if (user === undefined) {
    return <Avatar size={size}
                   src={logo} alt="avatar"/>
  }
  // 是否和左边有距离，有的话则为2
  return (
    <>
      <Avatar size={size} className={styles.avatar}
              src={user.avatar || `${CONFIG.AVATAR_URL}${user.name}`} alt="avatar"/>
      <Tooltip title="点击可查看用户资料">
        {
          user.deleted_at ?
            <del><a style={{marginLeft: marginLeft, fontSize: 14, color: "#ccc"}} href={`/#/member/${user.id}`}
                    target="_blank"
                    rel="noreferrer">{user.name}</a></del> :
            <a style={{marginLeft: marginLeft, fontSize: 14}} href={`/#/member/${user.id}`} target="_blank"
               rel="noreferrer">{user.name}</a>
        }

      </Tooltip>
    </>
  )
}
