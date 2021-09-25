import {Button} from "antd";
import {useState} from "react";

export default ({text, style, icon, onClick}) => {

  const [loading, setLoading] = useState(false);

  const click = async value => {
    setLoading(true);
    await onClick(value);
    setLoading(false);
  }

  return <Button onClick={click} style={style} loading={loading}>{icon} {text}</Button>
}
