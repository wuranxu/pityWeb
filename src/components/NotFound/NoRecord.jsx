import {Empty} from "antd";

export default ({desc, height = 180, image = require('@/assets/noHistoryRecord.svg')}) => {
  return <Empty
    image={image}
    imageStyle={{
      height,
    }}
    description={desc || '暂无数据'}
  >
  </Empty>
}
