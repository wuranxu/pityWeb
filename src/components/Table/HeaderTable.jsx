import {Table} from 'antd';
import {useEffect, useState} from "react";

export default ({headers}) => {
  const [data, setData] = useState([]);

  useEffect(()=>{
    if (headers) {
      const header = JSON.parse(headers);
      const temp = Object.keys(header).map(k => ({
        key: k, value: header[k]
      }))
      setData(temp);
    }
  }, [headers]);
  const columns = [
    {
      title: 'key',
      dataIndex: 'key',
      key: 'key',
      width: '30%',
      fixed: 'left',
    },
    {
      title: 'value',
      dataIndex: 'value',
      key: 'value',
      width: '70%',
      ellipsis: true,
    }
  ]
  return (
    <Table dataSource={data} columns={columns} pagination={false}/>
  )
}
