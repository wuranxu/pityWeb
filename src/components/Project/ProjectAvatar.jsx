import {Avatar} from "antd";
import conf from "@/consts/const";
import React from "react";

export default ({data}) => {
  if (data === null) {
    return null;
  }
  return data.avatar !== null ? <Avatar size={64} src={`${conf.PIC_URL}${data.avatar}`}/> :
    <Avatar style={{backgroundColor: '#87d068'}} size={64}
    >{data.projectName.slice(0, 3)}</Avatar>
}
