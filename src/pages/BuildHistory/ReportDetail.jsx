import {connect, useParams} from "umi";
import {Badge, Card, Col, Descriptions, Input, Row, Spin, Statistic, Table, Tabs, Tag} from "antd";
import {PageContainer} from "@ant-design/pro-layout";
import React, {useEffect, useState} from "react";
import {queryReport} from "@/services/report";
import auth from "@/utils/auth";
import styles from './ReportDetail.less';
import './ReportDetail.less';
import {
  AlertTwoTone,
  CheckCircleOutlined,
  CheckCircleTwoTone,
  CloseCircleOutlined,
  CloseCircleTwoTone,
  FrownTwoTone,
  LikeTwoTone,
  SearchOutlined
} from "@ant-design/icons";
import {IconFont} from "@/components/Icon/IconFont";
import reportConfig from "@/consts/reportConfig";
import common from "@/utils/common";
import Pie from "@/components/Charts/Pie";
import NoRecord from "@/components/NotFound/NoRecord";
import TestResult from "@/components/TestCase/TestResult";
import UserLink from "@/components/Button/UserLink";

const {TabPane} = Tabs;

const ReportDetail = ({dispatch, loading, user, gconfig}) => {
  const params = useParams();
  const reportId = params.id;
  const [reportDetail, setReportDetail] = useState({});
  const [planName, setPlanName] = useState('');
  const [caseModal, setCaseModal] = useState(false);
  const [response, setResponse] = useState({});
  const [caseName, setCaseName] = useState('');
  const [caseList, setCaseList] = useState([]);
  const [currentCaseList, setCurrentCaseList] = useState([]);
  const {envMap, envList} = gconfig;
  const {userMap, userNameMap} = user;

  const getTag = () => {
    if (reportDetail.failed_count === 0 && reportDetail.error_count === 0 && reportDetail.success_count > 0) {
      return <Tag icon={<CheckCircleOutlined/>} color="success">
        通过
      </Tag>
    }
    return <Tag icon={<CloseCircleOutlined/>} color="error">
      未通过
    </Tag>
    // return <Tag icon={<SyncOutlined spin/>} color="processing">
    //   加载中
    // </Tag>
  }

  const fetchEnv = () => {
    if (envList.length === 0) {
      dispatch({
        type: 'gconfig/fetchEnvList',
      })
    }
  }

  const fetchUsers = () => {
    dispatch({
      type: 'user/fetchUserList',
    })
  }

  const getPieData = () => {
    if (!reportDetail.success_count && !reportDetail.failed_count && !reportDetail.error_count) {
      return [];
    }
    const total = reportDetail.success_count + reportDetail.failed_count + reportDetail.error_count + reportDetail.skipped_count;
    return [
      {name: '成功', count: reportDetail.success_count, percent: common.calPiePercent(reportDetail.success_count, total)},
      {name: '失败', count: reportDetail.failed_count, percent: common.calPiePercent(reportDetail.failed_count, total)},
      {name: '错误', count: reportDetail.error_count, percent: common.calPiePercent(reportDetail.error_count, total)},
      {name: '跳过', count: reportDetail.skipped_count, percent: common.calPiePercent(reportDetail.skipped_count, total)},
    ]
  }

  const getReport = record => {
    return {
      case_id: record.case_id,
      url: record.url,
      request_method: record.request_method,
      request_data: record.body,
      request_headers: record.request_headers,
      response: record.response,
      logs: record.case_log,
      response_headers: record.response_headers,
      status_code: record.status_code,
      cookies: record.cookies,
      asserts: record.asserts,
      cost: record.cost,
      status: record.status === 0,
    }
  }

  const onSearchCase = e => {
    const {value} = e.target;
    const temp = caseList.filter(item => item.data_name.indexOf(value) > -1 || item.case_name.indexOf(value) > -1);
    setCurrentCaseList(temp)
  }

  useEffect(async () => {
    fetchEnv();
    fetchUsers();
    const res = await queryReport({id: reportId})
    if (auth.response(res)) {
      setCaseList(res.data.case_list);
      setCurrentCaseList(res.data.case_list);
      setReportDetail(res.data.report);
      setPlanName(res.data.plan_name);
    }
  }, [])

  const columns = [
    {
      title: '用例id',
      dataIndex: 'case_id',
      key: 'case_id',
    },
    {
      title: '用例名称',
      dataIndex: 'case_name',
      key: 'case_name',
      render: text => <a>{text}</a>
    },
    {
      title: '数据描述',
      dataIndex: 'data_name',
      key: 'data_name',
    },
    {
      title: '重试次数',
      dataIndex: 'retry',
      key: 'retry',
    },
    {
      title: '执行状态',
      dataIndex: 'status',
      key: 'status',
      render: status => <Badge status={reportConfig.EXECUTE_BADGE_STATUS[status]}
                               text={reportConfig.EXECUTE_STATUS[status]}/>
    },
    {
      title: '请求方式',
      dataIndex: 'request_method',
      key: 'method',
      render: method => reportConfig.METHOD_TAG[method]
    },
    {
      title: '开始时间',
      dataIndex: 'start_at',
      key: 'start_at',
    },
    {
      title: '结束时间',
      dataIndex: 'finished_at',
      key: 'finished_at',
    },
    {
      title: '操作',
      key: 'operation',
      render: (_, record) => <>
        <a onClick={() => {
          setResponse(getReport(record))
          setCaseModal(true)
          setCaseName(record.case_name)
        }}>更多</a>
      </>
    }
  ]

  return (
    <PageContainer title={false} breadcrumb={null}>
      <TestResult width={1000} setModal={setCaseModal} modal={caseModal} caseName={caseName} response={response}/>
      <Spin spinning={loading.effects["gconfig/fetchEnvList"]}>
        <Card title={`测试报告#${reportId}`}>
          <Row gutter={[8, 8]}>
            <Col span={17}>
              <Row gutter={8}>
                <Col span={4}>
                  <Card hoverable bordered={false} className={styles.statisticCard}>
                    <Statistic title="用例总数" valueStyle={{marginLeft: 8}}
                               value={reportDetail.failed_count + reportDetail.success_count + reportDetail.error_count}
                               prefix={<IconFont type="icon-yongliliebiao"/>}/>
                  </Card>
                </Col>
                <Col span={4}>
                  <Card hoverable bordered={false} className={styles.statisticCard}>
                    <Statistic title="成功数"
                               value={reportDetail.success_count}
                               prefix={<CheckCircleTwoTone twoToneColor='rgb(63, 205, 127)'/>}/>
                  </Card>
                </Col>
                <Col span={4}>
                  <Card hoverable bordered={false} className={styles.statisticCard}>
                    <Statistic title="失败数" valueStyle={{marginLeft: 8}}
                               value={reportDetail.failed_count}
                               prefix={<CloseCircleTwoTone twoToneColor='rgb(230, 98, 97)'/>}/>
                  </Card>
                </Col>
                <Col span={4}>
                  <Card hoverable bordered={false} className={styles.statisticCard}>
                    <Statistic title="错误数" valueStyle={{marginLeft: 8}}
                               value={reportDetail.error_count}
                               prefix={<AlertTwoTone twoToneColor="rgb(250, 207, 76)"/>}/>
                  </Card>
                </Col>
                <Col span={5}>
                  <Card hoverable bordered={false} className={styles.statisticCard}>
                    <Statistic title="测试通过率" suffix="%"
                               value={common.calPercent(reportDetail.success_count, reportDetail.failed_count + reportDetail.success_count + reportDetail.error_count)}
                               prefix={common.calPercent(reportDetail.success_count, reportDetail.failed_count + reportDetail.success_count + reportDetail.error_count) > 90
                                 ? <LikeTwoTone/> : <FrownTwoTone/>}/>
                  </Card>
                </Col>
                <Col span={3}/>
              </Row>
              <Descriptions>
                <Descriptions.Item label="测试环境">
                  <Tag icon={<IconFont type="icon-huanjing"/>}>{envMap[reportDetail.env]}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="测试结果">
                  {getTag()}
                </Descriptions.Item>
                <Descriptions.Item label="执行人">
                  {reportDetail.executor === 0 ? 'CPU' : <UserLink user={userMap[reportDetail.executor]} size={16}/>}
                </Descriptions.Item>
                <Descriptions.Item label="执行方式">
                  {reportConfig.EXECUTE_METHOD[reportDetail.mode]}
                </Descriptions.Item>
                <Descriptions.Item label="用例跳过数">
                  {reportDetail.skipped_count}
                </Descriptions.Item>
                <Descriptions.Item label="测试计划">
                  {planName || '无'}
                  {/*{reportDetail.plan_id || '无'}*/}
                </Descriptions.Item>
                <Descriptions.Item label="开始时间">
                  {reportDetail.start_at}
                </Descriptions.Item>
                <Descriptions.Item label="结束时间">
                  {reportDetail.finished_at}
                </Descriptions.Item>
                <Descriptions.Item label="耗时">
                  {parseFloat(reportDetail.cost) > 60 ? `${Math.round(parseFloat(reportDetail.cost) / 60)}分` : reportDetail.cost + '秒'}
                </Descriptions.Item>
              </Descriptions>

            </Col>
            <Col span={7}>
              <Pie height={230} data={getPieData()} name="name" value="percent"/>
            </Col>
          </Row>
        </Card>
        <Card className={styles.bottomCard} title="用例列表">
          <Row gutter={[8, 8]}>
            <Col span={18}/>
            <Col span={6}>
              <Input prefix={<SearchOutlined/>} placeholder="请输入用例名称" className="borderSearch" onPressEnter={onSearchCase}/>
            </Col>
          </Row>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Table columns={columns} dataSource={currentCaseList}
                     locale={{emptyText: <NoRecord height={200}/>}}/>
            </Col>
          </Row>
        </Card>
      </Spin>


    </PageContainer>
  )

}

export default connect(({gconfig, user, loading}) => ({
  gconfig: gconfig,
  loading: loading,
  user,
}))(ReportDetail)
