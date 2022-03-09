import {Avatar, Select} from "antd";
import {CONFIG} from "@/consts/config";
import React from "react";

const {Option} = Select;

export default ({users, placeholder = "请选择人员", onChange, value, mode = null}) => {
  return <Select allowClear onChange={onChange} value={value} showSearch placeholder={placeholder}
                 mode={mode}
                 filterOption={(value, info) => {
                   return info.props.children[2].toLowerCase().indexOf(value.toLowerCase()) > -1 || info.props.children[4].toLowerCase().indexOf(value.toLowerCase()) > -1
                 }}>
    {
      users.map(v => <Option key={v.id} value={v.id}><Avatar size={14}
                                                             src={v.avatar || CONFIG.AVATAR_URL + v.name}/> {v.name}({v.email})</Option>)
    }
  </Select>
}
