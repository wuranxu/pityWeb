import React, {useEffect, useState} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Avatar, Button, Card, Col, Empty, Input, Popover, Row, Select, Spin, Tooltip } from 'antd';
import { CONFIG } from '@/consts/config';
import { QuestionCircleOutlined } from '@ant-design/icons';
import FormForModal from '@/components/PityForm/FormForModal';
import { history } from 'umi';
import { listProject } from '@/services/project';
import auth from '@/utils/auth';
import { process } from '@/utils/utils';

const {Search} = Input;
const {Option} = Select;

export default () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0});
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [userMap, setUserMap] = useState({});

  useEffect(async () => {
    await process(async ()=> {
      const res = await listProject({page: pagination.current, size: pagination.size});
      if (auth.response(res)) {
        setData(res.data)
        setPagination({...pagination, total: res.total})
      }
    });
  }, [])

  const onSearchProject = projectName => {
    // this.props.dispatch({
    //   type: 'project/fetch',
    //   payload: {page: 1, size: 1000, projectName}
    // })
  }

  const onHandleModal = status => {
    setVisible(status);
  }

  const onHandleCreate = values => {
    // this.props.dispatch({
    //   type: 'project/insert',
    //   payload: values,
    // })
  }


  const content = (item) => {
    return <div>
      {/* <p>负责人: {userMap[item.owner].name}</p> */}
      {/* <p>简介: {item.description || '无'}</p> */}
      {/* <p>更新时间: {item.updateTime}</p> */}
    </div>
  };

  const opt = <Select placeholder="请选择项目组长">
    {
      users.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)
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
        name: 'owner',
        label: '项目负责人',
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
      {
        name: 'private',
        label: '是否私有',
        required: true,
        message: "请选择项目是否私有",
        type: 'switch',
        valuePropName: "checked",
      },
    ]
    return (
      <PageContainer title={false}>
        <FormForModal width={600} title="添加项目" left={6} right={18} record={{}}
                      visible={visible} onCancel={() => {
          onHandleModal(false)
        }} fields={fields} onFinish={onHandleCreate}
        />
        <Row gutter={8} style={{marginBottom: 16}}>
          <Col span={18}>
            <Button type="primary" onClick={() => {
              onHandleModal(true)
            }}>创建项目
              <Tooltip title="只有超级管理员可以创建项目"><QuestionCircleOutlined/></Tooltip>
            </Button>
          </Col>
          <Col span={6}>
            <Search onSearch={onSearchProject} style={{float: 'right'}} placeholder="请输入项目名称"/>
          </Col>
        </Row>
        <Spin spinning={false}>
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
                          item.avatar !== null ? <Avatar size={64} src={`${CONFIG.PIC_URL}${item.avatar}`}/> :
                            <Avatar style={{backgroundColor: '#87d068'}} size={64}
                            >{item.name.slice(0, 3)}</Avatar>
                        }
                        <p style={{
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: 18,
                          marginTop: 8
                        }}>{item.name}</p>
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
