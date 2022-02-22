import {Badge, Tag} from "antd";

export default {
  STATUS: {
    0: <Badge status="default" text="准备中"/>,
    1: <Badge status="processing" text="运行中"/>,
    2: <Badge status="error" text="已停止"/>,
    3: <Badge status="success" text="已完成"/>,
  },
  EXECUTE_METHOD: {
    0: '手动',
    1: '自动',
    2: '测试计划',
    3: 'PIPELINE',
    4: '其他'
  },
  EXECUTE_STATUS: {
    0: '成功',
    1: '失败',
    2: '出错',
    3: '跳过',
  },
  EXECUTE_BADGE_STATUS: {
    0: 'success',
    1: 'error',
    2: 'warning',
    3: 'default',
  },
  METHOD_TAG: {
    "GET": <Tag color="success">GET</Tag>,
    "POST": <Tag color="blue">POST</Tag>,
    "PUT": <Tag color="purple">PUT</Tag>,
    "DELETE": <Tag color="red">DELETE</Tag>,
  }
}
