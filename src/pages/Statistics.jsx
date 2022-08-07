import React, {useEffect, useState} from 'react';
import {PageContainer} from "@ant-design/pro-layout";
import {StatisticCard} from '@ant-design/pro-components';
import {Avatar, Badge, Card, Col, List, Progress, Row, Skeleton} from "antd";
import {TinyArea} from "@ant-design/charts";
import {queryStatistics} from "@/services/statistics";
import auth from "@/utils/auth";
import './Statistics.less';
import {ProjectTwoTone} from "@ant-design/icons";
import {IconFont} from "@/components/Icon/IconFont";
import {ErrorComputer, Jump, MessageFailed, Plan, Success, User} from "@icon-park/react";
import {listUsers} from "@/services/user";
import {CONFIG} from "@/consts/config";


const MiniProgress = ({rate}) => {
  const config = {
    height: 18,
    autoFit: false,
    percent: rate,
    color: ['#5B8FF9', '#E8EDF3'],
  };
  return <Progress {...config} />;
};

const Area = ({data, field, color, fill}) => {
  const config = {
    height: 48,
    autoFit: true,
    line: {
      color: color
    },
    data: data.map(item => item[field] || 0),
    smooth: true,
    areaStyle: {
      fill: fill || '#d6e3fd',
    },
  };
  return <TinyArea {...config} />;
};


export default () => {
  const [count, setCount] = useState({});
  const [reportData, setReportData] = useState([]);
  const [data, setData] = useState([])
  const [report, setReport] = useState({})
  const [rank, setRank] = useState([])
  const [users, setUsers] = useState({})
  const [clients, setClients] = useState({})
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    const res = await listUsers();
    const temp = {}
    res.forEach(item => {
      temp[item.id] = item
    })
    setUsers(temp)
  };

  const getBonus = (item) => {
    if (item.rank === 1) {
      return <span className="rank-item"><IconFont type="icon-jin"/> <span
        className="rank-content-top">{item.count}</span></span>
    }
    if (item.rank === 2) {
      return <span className="rank-item"><IconFont type="icon-yinpai"/> <span
        className="rank-content-top">{item.count}</span></span>
    }
    if (item.rank === 3) {
      return <span className="rank-item"><IconFont type="icon-tongpai"/> <span
        className="rank-content-top">{item.count}</span></span>
    }
    return <span className="rank-content">{item.count}</span>
  }

  useEffect(() => {
    setLoading(true)
    fetchUsers()
    queryStatistics().then(res => {
      setLoading(false)
      if (auth.response(res)) {
        setData(res.data.data)
        setCount(res.data.count)
        setRank(res.data.rank)
        setClients(res.data.clients)
        setReportData(res.data.report.data)
        setReport(res.data.report)
      }
    })
  }, [])


  return <PageContainer title="平台数据统计" breadcrumb={null}>
    <Row gutter={16}>
      <Col span={6}>
        <Skeleton loading={loading} active>
          <StatisticCard className="statistics-card" title="用户总数及近一周新增趋势" statistic={{
            value: count?.user,
            prefix: <User theme="outline" size="24" fill="#9013fe" strokeLinecap="square"/>
          }} chart={
            <Area data={data} field="user" color="rgb(158, 105, 230)" fill="rgb(227, 212, 248)"/>
          }/>
        </Skeleton>
      </Col>
      <Col span={6}>
        <Skeleton loading={loading} active>
          <StatisticCard className="statistics-card" title="项目总数及近一周新增趋势" statistic={{
            value: count?.project,
            prefix: <ProjectTwoTone twoToneColor="#f5a623"/>
          }} chart={
            <Area data={data} field="project" color="#f5a623" fill="#ede6da"/>
          }/>
        </Skeleton>
      </Col>
      <Col span={6}>
        <Skeleton loading={loading} active>
          <StatisticCard className="statistics-card" title="测试用例总数及近一周新增趋势" statistic={{
            value: count?.testcase,
            prefix: <IconFont type="icon-yongliliebiao"/>
          }} chart={
            <Area data={data} field="testcase"/>
          }/>
        </Skeleton>
      </Col>
      <Col span={6}>
        <Skeleton loading={loading} active>
          <StatisticCard className="statistics-card" title="测试计划总数及近一周新增趋势" statistic={{
            value: count?.testplan,
            prefix: <Plan theme="outline" size="24" fill="#7ed321" strokeLinecap="square"/>
          }} chart={
            <Area data={data} field="testplan" color="#7ed321" fill="rgb(234, 243, 244)"/>
          }/>
        </Skeleton>
      </Col>
    </Row>
    <Row style={{marginTop: 16}} gutter={16}>
      <Col span={16}>
        <Row gutter={16}>
          <Col span={12}>
            <Skeleton loading={loading} active>
              <StatisticCard className="statistics-card-large" title="近一周用例通过率(%)" statistic={{
                value: report?.rate,
                description: <MiniProgress rate={report?.rate}/>
              }} chart={
                <Area data={reportData} field="rate"/>
              }/>
            </Skeleton>
          </Col>
          <Col span={12}>
            <Skeleton loading={loading} active>
              <StatisticCard className="statistics-card-large" title={
                <span>{<Success theme="outline" size="15" fill="#b8e986"
                                strokeLinecap="square"/>} 近一周用例失败个数 </span>
              } statistic={{
                value: report?.count,
              }} chart={
                <Area data={reportData} field="count"/>
              }/>
            </Skeleton>
          </Col>
        </Row>
        <Row gutter={16} style={{marginTop: 16}}>
          <Col span={12}>
            <Skeleton loading={loading} active>
              <StatisticCard className="statistics-card-large" title={
                <span>{<MessageFailed theme="outline" size="15" fill="#d0021b"
                                      strokeLinecap="square"/>} 近一周用例失败个数 </span>
              } statistic={{
                value: report?.failed,
                valueStyle: {color: 'rgb(230, 98, 97)'}
              }} chart={
                <Area data={reportData} field="failed" color="rgb(230, 98, 97)" fill="#f1dddd"/>
              }/>
            </Skeleton>
          </Col>
          <Col span={12}>
            <Skeleton loading={loading} active>
              <StatisticCard className="statistics-card-large" title={
                <span>{<ErrorComputer theme="outline" size="15" fill="#f5a623"
                                      strokeLinecap="square"/>} 近一周用例错误个数</span>
              } statistic={{
                value: report?.error,
                valueStyle: {color: 'rgb(250, 207, 76)'}
              }} chart={
                <Area data={reportData} field="error" fill="#efe5d1" color='rgb(250, 207, 76)'/>
              }/>
            </Skeleton>
          </Col>
        </Row>
        <Row gutter={16} style={{marginTop: 16}}>
          <Col span={12}>
            <Skeleton loading={loading} active>
              <StatisticCard className="statistics-card-large" title={
                <span>{<Success theme="outline" size="15" fill="#7ed321"
                                strokeLinecap="square"/>} 近一周用例成功个数 </span>
              } statistic={{
                value: report?.success,
                valueStyle: {color: 'rgb(63, 205, 127)'}
              }} chart={
                <Area data={reportData} field="success" color="#7ed321" fill="rgb(234, 243, 244)"/>
              }/>
            </Skeleton>
          </Col>
          <Col span={12}>
            <Skeleton loading={loading} active>
              <StatisticCard className="statistics-card-large" title={
                <span>{<Jump theme="outline" size="15" fill="#4a90e2"
                             strokeLinecap="square"/>} 近一周用例跳过个数 </span>
              } statistic={{
                value: report?.skip,
                valueStyle: {color: 'rgb(86, 97, 235)'}
              }} chart={
                <Area data={reportData} field="skip"/>
              }/>
            </Skeleton>
          </Col>
        </Row>

      </Col>
      <Col span={8}>
        <Skeleton active loading={loading}>
          <Card title="用例数量排行Top10" className="rank">
            <List
              itemLayout="horizontal"
              dataSource={rank.slice(0, 10)}
              renderItem={item => (
                <List.Item actions={[getBonus(item)]}>
                  <Skeleton active loading={loading}>
                    <List.Item.Meta
                      avatar={<Avatar src={users[item.id]?.avatar || CONFIG.PROJECT_AVATAR_URL}/>}
                      title={
                        <span>
                        {users[item.id]?.name
                        } <Badge style={{marginLeft: 8}} status={clients[item.id] ? "success" : 'default'}
                                 text={clients[item.id] ? "在线" : '离线'}/>
                      </span>
                      }
                      description={users[item.id]?.email}
                    />
                  </Skeleton>

                </List.Item>
              )}
            />
          </Card>
        </Skeleton>
      </Col>
    </Row>
  </PageContainer>
}
