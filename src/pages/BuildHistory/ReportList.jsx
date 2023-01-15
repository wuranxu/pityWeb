// 构建历史记录
import moment from 'moment';
import {PageContainer} from "@ant-design/pro-components";
import {Button, Card, Col, DatePicker, Form, Row, Select, Table, Tag} from "antd";
import {CheckCircleTwoTone, CloseCircleTwoTone, ReloadOutlined, SearchOutlined} from "@ant-design/icons";
import NoRecord from "@/components/NotFound/NoRecord";
import {connect} from "@umijs/max";
import {useEffect} from "react";
import reportConfig from "@/consts/reportConfig";
import CONFIG from "@/consts/config";
import UserLink from "@/components/Button/UserLink";
import {IconFont} from "@/components/Icon/IconFont";
import {REPORT_MODE} from "@/components/Common/global";


const {RangePicker} = DatePicker;
const {Option} = Select;

const ReportList = ({user, report, loading, dispatch}) => {
  const [form] = Form.useForm()

  const {userMap} = user;
  const {reportData, pagination} = report;


  useEffect(() => {
    dispatch({
      type: 'user/fetchUserList',
    })
    fetchReport();
  }, [pagination.current])

  const columns = [
    {
      title: '构建id',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      render: (text, record) => {
        if (record.failed_count === 0 && record.error_count === 0 && record.success_count > 0) {
          return <span><CheckCircleTwoTone twoToneColor="#52c41a" style={{fontSize: 13}}/> #<a
            href={`/#/record/report/${record.id}`}>{text}</a></span>
        }
        return <span><CloseCircleTwoTone twoToneColor="#eb2f96" style={{fontSize: 13}}/> #<a
          href={`/#/record/report/${record.id}`}>{text}</a></span>
      }
    },
    {
      title: '类型',
      dataIndex: 'mode',
      key: 'mode',
      fixed: 'left',
      render: mode => REPORT_MODE[mode],
    },
    {
      title: '执行人',
      dataIndex: 'executor',
      key: 'executor',
      fixed: 'left',
      render: executor => executor === 0 ?
        <span>
          <IconFont style={{fontSize: 20}} type="icon-a-jiqirenrengongzhineng"/> pity机器人
        </span> : <UserLink user={userMap[executor]}/>,
    },
    {
      title: '总数',
      key: 'total',
      render: (_, record) =>
        <Tag> {record.success_count + record.failed_count + record.skipped_count + record.error_count} </Tag>,
    },
    {
      title: '成功 ✔',
      dataIndex: 'success_count',
      key: 'success_count',
      render: successCount => <Tag color="success"> {successCount} </Tag>,
    },
    {
      title: '失败 ❌',
      dataIndex: 'failed_count',
      key: 'failed_count',
      render: failedCount => <Tag color="error"> {failedCount} </Tag>,
    },
    {
      title: '出错 ⚠',
      dataIndex: 'error_count',
      key: 'error_count',
      render: errorCount => <Tag color="warning"> {errorCount} </Tag>,
    },
    {
      title: '跳过 🎉',
      dataIndex: 'skipped_count',
      key: 'skipped_count',
      render: skippedCount => <Tag color="blue"> {skippedCount} </Tag>,
    },
    {
      title: '开始时间',
      key: 'start_at',
      dataIndex: 'start_at',
    },
    // {
    //   title: '结束时间',
    //   key: 'finish_at',
    //   dataIndex: 'finished_at',
    // },
    {
      title: '任务状态',
      dataIndex: 'status',
      key: 'status',
      fixed: 'right',
      render: status => reportConfig.STATUS[status],
    },
    {
      title: '操作',
      key: 'operation',
      render: (_, record) => <><Button type="link" href={`/#/record/report/${record.id}`}>查看</Button></>
    }
  ]

  const fetchReport = () => {
    const value = form.getFieldsValue();
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
        date: null,
      }
    })
  }

  const onReset = () => {
    form.resetFields();
    form.setFieldsValue({date: [moment().startOf('week'), moment().endOf('week')]})
    fetchReport();
  }

  return (
    <PageContainer title="构建历史" breadcrumb={null}>
      <Card>
        <Form form={form}>
          <Row gutter={[8, 8]}>
            <Col span={8}>
              <Form.Item label="执行人" name="executor">
                <Select placeholder="选择执行人" style={{width: '90%'}} allowClear>
                  <Option value="pity机器人" key="CPU"><IconFont style={{fontSize: 20}}
                                                          type="icon-a-jiqirenrengongzhineng"/> pity机器人</Option>
                  {
                    Object.keys(userMap).map(v => (<Option key={v} value={v}><UserLink user={userMap[v]}/></Option>))
                  }
                </Select>
              </Form.Item>
            </Col>

            <Col span={10}>
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
            <Col span={6}>
              <div style={{float: 'right'}}>
                <Button type="primary" onClick={fetchReport}><SearchOutlined/> 查询</Button>
                <Button style={{marginLeft: 8}} onClick={onReset}><ReloadOutlined/> 重置</Button>
              </div>
            </Col>
          </Row>

        </Form>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Table columns={columns} dataSource={reportData}
                   pagination={pagination}
              // scroll={{ x: 1800 }}
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
