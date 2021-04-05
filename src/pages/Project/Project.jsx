import React, {PureComponent} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import {Spin, Empty, Avatar, Card, Tooltip, Popover, Row, Input, Col, Button, Select} from "antd";
import {connect} from "@/.umi/plugin-dva/exports";
import conf from '@/consts/const';
import {QuestionCircleOutlined} from '@ant-design/icons';
import FormForModal from "@/components/EagleForm/FormForModal";
import {history} from 'umi';
import NProgress from "nprogress";

const {Search} = Input;
const {Option} = Select;

@connect(({project, loading, user}) => ({
  project, loading, user
}))
export default class Project extends PureComponent {

  async componentDidMount() {
    NProgress.start();
    await this.props.dispatch({
      type: 'user/fetch'
    })
    await this.props.dispatch({
      type: 'project/fetch',
      payload: {page: 1, size: 1000}
    })
    NProgress.done();
  }

  onSearchProject = projectName => {
    this.props.dispatch({
      type: 'project/fetch',
      payload: {page: 1, size: 1000, projectName}
    })
  }

  onHandleModal = status => {
    this.props.dispatch({
      type: 'project/save',
      payload: {visible: status}
    })
  }

  onHandleCreate = values => {
    this.props.dispatch({
      type: 'project/insert',
      payload: values,
    })
  }

  render() {
    const {data, visible} = this.props.project;
    const {users, userMap} = this.props.user;
    const {loading} = this.props;
    const content = (item) => {
      return <div>
        <p>负责人: {userMap[item.owner].nickname}</p>
        <p>简介: {item.description || '无'}</p>
        <p>更新时间: {item.updateTime}</p>
      </div>
    };

    const opt = <Select placeholder="请选择项目组长">
      {
        users.map(item => <Option value={item.value}>{item.label}</Option>)
      }
    </Select>
    const fields = [
      {
        name: 'projectName',
        label: '项目名称',
        required: true,
        message: "请输入项目名称",
        type: 'input',
        placeholder: "请输入项目名称",
      },
      {
        name: 'gitlabUrl',
        label: 'gitlab ID',
        required: true,
        message: "请输入gitlab项目id, 如有多个用,隔开",
        type: 'input',
        placeholder: "请输入gitlab项目id",
      },
      {
        name: 'owner',
        label: '项目组长',
        required: true,
        component: opt,
        type: 'select',
      },
      {
        name: 'description',
        label: '项目描述',
        required: false,
        message: "请输入项目描述",
        type: 'textarea',
        placeholder: "请输入项目描述",
      },
    ]
    return (
      <PageContainer title={false}>
        <FormForModal width={600} title="添加项目" left={6} right={18} record={{}}
                      visible={visible} onCancel={() => {
          this.onHandleModal(false)
        }} fields={fields} loading={loading.effects['project/insert']} onFinish={this.onHandleCreate}
        />
        <Row gutter={8} style={{marginBottom: 16}}>
          <Col span={18}>
            <Button type="primary" onClick={() => {
              this.onHandleModal(true)
            }}>创建项目
              <Tooltip title="只有超级管理员可以创建项目"><QuestionCircleOutlined/></Tooltip>
            </Button>
          </Col>
          <Col span={6}>
            <Search onSearch={this.onSearchProject} style={{float: 'right'}} placeholder="请输入项目名称"/>
          </Col>
        </Row>
        <Spin spinning={loading.effects['project/fetch']}>
          <Row gutter={16}>
            {
              data.length === 0 ? <Col span={24} style={{textAlign: 'center', marginBottom: 12}}>
                  <Card><Empty description="暂无项目, 快点击『创建项目』创建一个吧!"/></Card>
                </Col> :
                data.map(item =>
                  <Col span={4} style={{marginBottom: 12}}>
                    <Popover content={content(item)} placement="rightTop">
                      <Card hoverable bordered={false} style={{borderRadius: 16, textAlign: 'center'}}
                            bodyStyle={{padding: 16}} onClick={() => {
                        history.push(`/project/${item.id}`);
                      }}>
                        {
                          item.avatar !== null ? <Avatar size={64} src={`${conf.PIC_URL}${item.avatar}`}/> :
                            <Avatar style={{backgroundColor: '#87d068'}} size={64}
                            >{item.projectName.slice(0, 3)}</Avatar>
                        }
                        <p style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: 18,
                          marginTop: 8
                        }}>{item.projectName}</p>
                      </Card>
                    </Popover>
                  </Col>
                )
            }
          </Row>
        </Spin>
      </PageContainer>
    )
  }
}
