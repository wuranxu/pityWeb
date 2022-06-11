import {QuestionCircleOutlined} from "@ant-design/icons";
import {Tooltip} from "antd";
import React from "react";

export default () => {
  return <Tooltip
    title="开启共享后, 其他人可使用你的数据构造器"><span>共享 <QuestionCircleOutlined/></span></Tooltip>
}
