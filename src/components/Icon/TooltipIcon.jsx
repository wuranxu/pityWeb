import {Tooltip} from "antd";

export default ({icon, title, font, style, onClick}) => {
  return <Tooltip title={title}>
    <span onClick={onClick} style={{cursor: 'pointer', fontSize: font, ...style}}>{icon}</span>
  </Tooltip>
}
