import {Send} from "@icon-park/react";
import TextIcon from '@/components/Icon/TextIcon';
import React from "react";
import {Tag} from "antd";

export const REQUEST_TYPE = {
  // 1: <TextIcon font={18} icon="icon-http3" text="HTTP"/>,
  1: <span><Send theme="outline" size="14" fill="#7ed321"/> HTTP</span>,
  2: <TextIcon font={14} icon="icon-GRPC" text="GRPC"/>,
  3: <TextIcon font={14} icon="icon-a-dubbo1" text="Dubbo"/>,
}


export const REQUEST_TYPE_TAG = {
  1: <Tag color="success">HTTP</Tag>,
  2: <Tag color="orange">GRPC</Tag>,
  3: <Tag color="blue">DUBBO</Tag>,
}

export const REQUEST_METHOD = {
  'GET': <Tag color="success">GET</Tag>,
  'POST': <Tag color="blue">POST</Tag>,
  'PUT': <Tag color="cyan">PUT</Tag>,
  'DELETE': <Tag color="error">DELETE</Tag>,
}

export const REPORT_MODE = {
  0: <Tag>普通</Tag>,
  1: <Tag color="blue">测试计划</Tag>,
  2: <Tag color="success">CI</Tag>,
  3: <Tag>其他</Tag>,
}

export const CASE_TYPE = {
  0: <Tag color="success" style={{marginLeft: 8}}>普通</Tag>,
  1: <Tag color="blue" style={{marginLeft: 8}}>前置</Tag>,
  2: <Tag color="warning" style={{marginLeft: 8}}>数据工厂</Tag>,
}
