import {PageContainer} from "@ant-design/pro-layout";
import {connect, useParams} from 'umi';
import {Avatar, Card, Col, Empty, Row, Statistic} from "antd";
import styles from './UserInfo.less';
import HeatMap from "@/components/Charts/HeatMap";
import React, {useEffect} from "react";
import moment from 'moment';
import OperationLog from "@/components/Operation/OperationLog";
import noRecord from "@/assets/no_record.svg";
import {LikeOutlined, UserOutlined} from "@ant-design/icons";
import LoadingFailed from '@/assets/LoadingFailed.svg';
import {CONFIG} from "@/consts/config";

const today = new Date()

const shiftDate = (date, numDays) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}


const Workspace = ({user, dispatch}) => {
  const params = useParams();
  const userId = params.user_id;
  const {userMap, operationLog, activities} = user;

  const getContent = currentUser => {
    if (currentUser === undefined || currentUser === null) {
      return <Empty description="努力加载中..." image={LoadingFailed}/>
    }
    return (
      <>
        <div className={styles.pageHeaderContent}>
          <div className={styles.avatar}>
            <Avatar size="large"
                    src={currentUser?.avatar || CONFIG.AVATAR_URL}/>
          </div>
          <div className={styles.content}>
            <div className={styles.contentTitle}>
              {currentUser.name} {currentUser.deleted_at ? "(已注销)" : null}
            </div>
            <div>
              {currentUser.email} {currentUser.nickname}
            </div>
            <div className={styles.lastLogin}>
              <span>上次登录</span> {currentUser.last_login_at}
            </div>
          </div>
        </div>

      </>
    )
  }

  const fetchUserActivities = () => {
    dispatch({
      type: 'user/fetchUserActivities',
      payload: {
        start_time: moment(shiftDate(today, -365)).format('YYYY-MM-DD'),
        end_time: moment(shiftDate(today, 1)).format('YYYY-MM-DD'),
        user_id: userId
      }
    })
  }

  const fetchUserRecord = () => {
    // 算了，还是先只能看一个月内的用户记录吧
    dispatch({
      type: 'user/fetchUserRecord',
      payload: {
        user_id: userId,
        start_time: moment(shiftDate(today, -30)).format('YYYY-MM-DD'),
        end_time: moment(shiftDate(today, 1)).format('YYYY-MM-DD'),
      }
    })
  }

  const fetchUsers = () => {
    dispatch({
      type: 'user/fetchUserList',
    })
  }

  const getRegisterDays = currentUser => {
    if (currentUser === undefined) {
      return 0;
    }
    const now = Date.parse(new Date());
    const register_time = Date.parse(new Date(currentUser.created_at));
    return Math.abs(parseInt((now - register_time) / 1000 / 3600 / 24))
  }

  useEffect(() => {
    fetchUsers()
    fetchUserActivities()
    fetchUserRecord()
  }, [userId])


  return <PageContainer breadcrumb={null} title={false}>
    <Row gutter={24}>
      <Col span={8}>
        <Card title="用户资料" className={styles.userBody}>
          {getContent(userMap[userId])}
          <Row gutter={16} className={styles.statisticsCard}>
            <Col span={12}>
              <Statistic title="注册时间" valueStyle={{color: '#1890ff'}} value={getRegisterDays(userMap[userId])}
                         prefix={<UserOutlined/>} suffix="天"/>
            </Col>
            <Col span={12}>
              <Statistic title="参与项目" value={0} prefix={<LikeOutlined/>}/>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={16}>
        <Card title="最近1年操作记录统计" className={styles.heatMap}>
          <Row>
            <Col span={24}>
              {
                activities.length === 0 ? <Empty description="暂无数据" image={noRecord} imageStyle={{height: 120}}/> :
                  <HeatMap startDate={shiftDate(today, -365)} endDate={shiftDate(today, 1)}
                           values={activities}/>
              }
            </Col>
          </Row>
        </Card>
        <Card title="最近30天动态" className={styles.userRecord}>
          <Row>
            <Col span={24}>
              <OperationLog userMap={userMap} userId={userId} record={operationLog}/>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  </PageContainer>
}

export default connect(({user}) => ({user}))(Workspace);
