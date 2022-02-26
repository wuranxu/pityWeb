import {Avatar} from 'antd';
import React from 'react';
import {CONFIG} from "@/consts/config";

export default ({data}) => {
  if (data === null) {
    return null;
  }
  return <Avatar size={96} src={data.avatar || CONFIG.PROJECT_AVATAR_URL}/>
};
