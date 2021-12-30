import React from 'react';
import {Avatar} from "antd";
import styles from "@/components/GlobalHeader/index.less";
import {CONFIG} from "@/consts/config";
import {Tooltip} from "antd";

export default ({user, size = 24, marginLeft = 4}) => {
  if (user === undefined) {
    return '加载中...'
  }
  // 是否和左边有距离，有的话则为2
  return (
    <>
      <Avatar size={size} className={styles.avatar}
              src={user.avatar || `${CONFIG.AVATAR_URL}${user.name}`} alt="avatar"/>
      <Tooltip title="点击可查看用户资料">
        <a style={{marginLeft: marginLeft}} href={`/#/member/${user.id}`} target="_blank"
           rel="noreferrer">{user.name}</a>
      </Tooltip>
    </>
  )
}
