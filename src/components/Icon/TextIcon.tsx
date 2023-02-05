import {IconFont} from "@/components/Icon/IconFont";
import {MouseEventHandler} from "react";

interface TextIconProps {
  font: number | 13;
  onClick?: MouseEventHandler;
  back?: boolean | true;
  style?: Record<string, string | number>;
  icon: string;
  text: string;
}

export default ({icon, text, font = 13, style, onClick, back = true}: TextIconProps) => {
  return back ?
    <span onClick={onClick} style={{...style}}>
        <IconFont type={icon} style={{fontSize: font}}/> {text}
    </span> : <span onClick={onClick} style={{...style}}>
         {text} <IconFont style={{fontSize: font}} type={icon}/></span>

}
