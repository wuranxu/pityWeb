import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {connect} from 'umi';
import {Avatar} from "antd";
import styles from './Workspace.less';

const getWelcome = user => {
  const now = new Date()
  const hour = now.getHours()
  if (hour < 6) {
    return `Hi, ${user}! 😪凌晨了, 工作的同时要注意休息哦!`
  } else if (hour < 9) {
    return `早上好, ${user}!`
  } else if (hour < 12) {
    return `上午好, ${user}!`
  } else if (hour < 14) {
    return `中午好, ${user}!`
  } else if (hour < 17) {
    return `下午好, ${user}!`
  } else if (hour < 24) {
    return `晚上好, ${user}! 不早了，喝杯热牛奶🥛再去休息吧~`
  }
}

const getContent = currentUser => {
  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large"
                src={currentUser.avatar || 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'}/>
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          {getWelcome(currentUser.name)}
        </div>
        <div>
          {currentUser.email} {currentUser.nickname}
        </div>
      </div>
    </div>
  )
}

const Workspace = ({user, dispatch}) => {
  const {currentUser} = user;
  return <PageHeaderWrapper content={getContent(currentUser)}>
  </PageHeaderWrapper>
}

export default connect(({user}) => ({user}))(Workspace);
