// 构建历史记录
import moment from 'moment';
import {PageContainer} from "@ant-design/pro-layout";
import {Button, Card, Col, DatePicker, Form, Row, Select, Table, Tag} from "antd";
import {CheckCircleTwoTone, CloseCircleTwoTone, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import NoRecord from "@/components/NotFound/NoRecord";
import {connect} from "umi";
import {useEffect} from "react";
import reportConfig from "@/consts/reportConfig";
import styles from './ReportList.less';


const {RangePicker} = DatePicker;
const {Option} = Select;

const ReportList = ({user, report, loading, dispatch}) => {
  const [form] = Form.useForm()

  const {userNameMap} = user;
  const {reportData, pagination} = report;


  useEffect(async () => {
    dispatch({
      type: 'user/fetchUserList',
    })
    await fetchReport();
  }, [pagination.current])

  const columns = [
    {
      title: '构建id',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => {
        if (record.failed_count === 0 && record.error_count === 0 && record.success_count > 0) {
          return <span><CheckCircleTwoTone twoToneColor="#52c41a" style={{fontSize: 13}}/> #{text}</span>
        }
        return <span><CloseCircleTwoTone twoToneColor="#eb2f96" style={{fontSize: 13}}/> #{text}</span>
      }
    },
    {
      title: '执行人',
      dataIndex: 'executor',
      key: 'executor',
      render: executor => executor === 0 ? 'CPU' : userNameMap[executor] || '未知',
    },
    {
      title: '执行总数',
      key: 'total',
      render: (_, record) =>
        <Tag
          className={styles.countTag}>{record.success_count + record.failed_count + record.skipped_count + record.error_count}</Tag>,
    },
    {
      title: '成功',
      dataIndex: 'success_count',
      key: 'success_count',
      render: success_count => <Tag color="success" className={styles.countTag}>{success_count}</Tag>,
    },
    {
      title: '失败',
      dataIndex: 'failed_count',
      key: 'failed_count',
      render: failed_count => <Tag color="error" className={styles.countTag}>{failed_count}</Tag>,
    },
    {
      title: '出错',
      dataIndex: 'error_count',
      key: 'error_count',
      render: error_count => <Tag color="warning" className={styles.countTag}>{error_count}</Tag>,
    },
    {
      title: '跳过',
      dataIndex: 'skipped_count',
      key: 'skipped_count',
      render: skipped_count => <Tag color="blue" className={styles.countTag}>{skipped_count}</Tag>,
    },
    {
      title: '开始时间',
      key: 'start_at',
      dataIndex: 'start_at',

    },
    {
      title: '结束时间',
      key: 'finish_at',
      dataIndex: 'finished_at',
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      key: 'status',
      render: status => reportConfig.STATUS[status],
    },
    {
      title: '操作',
      key: 'operation',
      render: (_, record) => <><Button type="link" href={`/#/record/report/${record.id}`}>查看</Button></>
    }
  ]

  const fetchReport = async () => {
    const value = await form.getFieldsValue();
    const start_time = value.date[0].format("YYYY-MM-DD HH:mm:ss")
    const end_time = value.date[1].format("YYYY-MM-DD HH:mm:ss")
    dispatch({
      type: 'report/fetchReportList',
      payload: {
        start_time,
        end_time,
        ...value,
        page: pagination.current,
        size: pagination.pageSize,
      }
    })
  }

  const onReset = async () => {
    form.setFieldsValue({date: [moment().startOf('week'), moment().endOf('week')]})
    await fetchReport();
  }

  return (
    <PageContainer title="构建历史">
      <Card>
        <Form form={form}>
          <Row gutter={[8, 8]}>

            <Col span={8}>
              <Form.Item label="执行人" name="executor">
                <Select placeholder="选择执行人" style={{width: '90%'}} allowClear>
                  {
                    Object.keys(userNameMap).map(v => (<Option value={v}>{userNameMap[v]}</Option>))
                  }
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="执行时间" name="date"
                         rules={[{required: true, message: '请选择开始/结束时间'}]}
                         initialValue={[moment().startOf('week'), moment().endOf('week')]}>
                <RangePicker
                  ranges={{
                    '今天': [moment(), moment()],
                    '本周': [moment().startOf('week'), moment().endOf('week')],
                    '本月': [moment().startOf('month'), moment().endOf('month')],
                  }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <div style={{float: 'right'}}>
                <Button type="primary" onClick={fetchReport}><SearchOutlined/> 查询</Button>
                <Button style={{marginLeft: 8}} onClick={onReset}><ReloadOutlined/> 重置</Button>
              </div>
            </Col>
            <Col span={8}>
            </Col>
          </Row>

        </Form>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Table columns={columns} locale={{emptyText: <NoRecord height={200}/>}} dataSource={reportData}
                   pagination={pagination}
                   loading={loading.effects['report/fetchReportList']}
                   onChange={pg => {
                     dispatch({
                       type: 'report/save',
                       payload: {pagination: {...pagination, current: pg.current}}
                     })
                   }}/>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  )
}


export default connect(({report, user, loading}) => ({
  report,
  loading,
  user,
}))(ReportList)
