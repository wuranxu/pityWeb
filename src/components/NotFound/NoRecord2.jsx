import noRecord from '@/assets/NoRecord2.svg';
import {Empty} from "antd";

export default ({desc, height = 180}) => {
  return <Empty
    image={noRecord}
    imageStyle={{
      height,
    }}
    description={desc || '暂无数据'}
  >
  </Empty>
}