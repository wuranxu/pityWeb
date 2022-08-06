import {Card, Radio} from "antd";
import {useState} from "react";
import {IconFont} from "@/components/Icon/IconFont";
import {FireOutlined, LikeOutlined, StarOutlined, WindowsOutlined} from "@ant-design/icons";

export default () => {
  const options = [
    {
      label: '全部场景',
      value: '0',
    },
    {
      label: '收藏场景',
      value: '1',
    },
    {
      label: '热门场景',
      value: '2',
    },
    {
      label: '高赞场景',
      value: '3',
    },
  ]

  const [mode, setMode] = useState('0');

  return (
    <Card>
      <Radio.Group
        onChange={e => {
          setMode(e.target.value)
        }}
        value={mode}
        buttonStyle="solid"
      >
      <Radio.Button value="0"><WindowsOutlined /> 全部</Radio.Button>
      <Radio.Button value="1"><StarOutlined /> 收藏</Radio.Button>
      <Radio.Button value="2"><FireOutlined /> 最热</Radio.Button>
      <Radio.Button value="3"><LikeOutlined /> 最赞</Radio.Button>
    </Radio.Group>
    </Card>
  )
}
