import {Popconfirm} from "antd";

export default ({title, text, onConfirm}) => {
  return <Popconfirm title={title} onConfirm={onConfirm}>
    <a>{text}</a>
  </Popconfirm>
}
