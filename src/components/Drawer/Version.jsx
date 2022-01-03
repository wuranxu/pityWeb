import {Drawer} from "antd";
import Markdown from "@/components/CodeEditor/Markdown";

const md = `
## 2022-01-03 更新日志:

#### 🎃 1. 新增个人资料设置, 现在可以换上你的头像咯
#### 👓 2. 新增个人中心页面
#### 🎁 3. oss数据入库
#### 🎉 4. 数据库表放入缓存，速度更快
`


export default ({visible, setVisible}) => {
  return (
    <Drawer visible={visible} onClose={() => setVisible(false)} width={500}>
      <Markdown value={md}/>
    </Drawer>
  )
}
