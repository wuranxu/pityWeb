import React from 'react';
import {Avatar, List, Tag} from 'antd';
import styles from './OperationLog.less';
import {Scrollbars} from 'react-custom-scrollbars';


const OperationType = {
  0: <span className={styles.operationType}>添加了</span>,
  1: <span className={styles.operationType}>更新了</span>,
  2: <span className={styles.operationType}>删除了</span>,
  3: <span className={styles.operationType}>执行了</span>,
  4: <span className={styles.operationType}>终止了</span>,
}


export default ({userMap, userId, record}) => {
  const getTitle = item => {
    const {title} = item;
    const data = title.split("&")
    const titles = data.map(v => {
      const [key, value] = v.split("=");
      return `${key}: ${value}`
      // return <span>{key} <strong>{value}</strong></span>
    })
    const realTitle = titles.join("　")
    return <div>
      <span><Tag color="green">{item.tag}</Tag></span>
      <span className={styles.userName}>{userMap[item.user_id].name}</span>
      <span>{OperationType[item.mode]}</span>
      <span>{realTitle}</span>
    </div>
  }

  const convertBool = (value) => {
    if (value === true) {
      return "是"
    } else if (value === false) {
      return "否"
    }
    return value;
  }

  const getDescription = (item, index) => {
    const desc = JSON.parse(item.description);
    return <div>
      {desc.length > 0 ? desc.map(v => {
        if (v.old == null) {
          return <div className={styles.desc} key={index}>
            <span className={styles.field}>{v.name}:</span>
            <strong className={styles.newField}>{v.now}</strong></div>
        }
        // 否则则说明是编辑字段
        return <div className={styles.desc} key={index}>
          <span className={styles.field}>{v.name}</span> 由 <del>{convertBool(v.old)}</del> 变更为
          <strong className={styles.newField}>{convertBool(v.now)}</strong>
        </div>
      }): "未发生变动"}
    </div>
  }

  return (
    <Scrollbars autoHide
                autoHideTimeout={1000}
                autoHideDuration={200} style={{width: '100%', height: 300}}>
      <List
        itemLayout="horizontal"
        dataSource={record}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar
                src={userMap[userId].avatar || `https://joeschmoe.io/api/v1/${userMap[userId].name || 'unknown'}`}/>}
              title={getTitle(item)}
              description={getDescription(item)}
            />
            <div>{item.operate_time}</div>
          </List.Item>
        )}
      />
    </Scrollbars>

  )
}
