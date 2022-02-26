import {IconFont} from "@/components/Icon/IconFont";

export default ({icon, text, font=13, style, onClick, back = true}) => {
  return back ?
    <span onClick={onClick} style={{...style}}>
        <IconFont type={icon} style={{fontSize: font}}/> {text}
    </span> : <span onClick={onClick} style={{...style}}>
         {text} <IconFont style={{fontSize: font}} type={icon}/></span>

}
