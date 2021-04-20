import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Avatar,
  Button,
  Pagination,
  Card,
  Col,
  Empty,
  Input,
  Popover,
  Row,
  Select,
  Spin,
  Tooltip,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import FormForModal from '@/components/PityForm/FormForModal';
import { history } from 'umi';
import { insertProject, listProject } from '@/services/project';
import auth from '@/utils/auth';
import { process } from '@/utils/utils';
import { listUsers } from '@/services/user';

const { Search } = Input;
const { Option } = Select;

export default () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 8, total: 0 });
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState({});

  const fetchData = async (current = pagination.current, size = pagination.size) => {
    await process(async () => {
      const res = await listProject({ page: current, size });
      if (auth.response(res)) {
        setData(res.data);
        setPagination({ ...pagination, total: res.total });
      }
    });
  };

  const getUsers = async () => {
    const user = await listUsers();
    const temp = {};
    user.forEach((item) => {
      temp[item.id] = item;
    });
    setUsers(temp);
  };

  useEffect(async () => {
    await getUsers();
    await fetchData();
  }, []);

  const onSearchProject = async (projectName) => {
    await process(async () => {
      const res = await listProject({ page: 1, size: pagination.size, name: projectName });
      if (auth.response(res)) {
        setData(res.data);
        setPagination({ ...pagination, current: 1, total: res.total });
      }
    });
  };

  const onHandleCreate = async (values) => {
    const res = await insertProject(values);
    if (auth.response(res, true)) {
      setVisible(false);
      // 创建成功后自动获取第一页的数据, 因为项目会按创建时间排序
      await fetchData(1);
    }
  };

  const content = (item) => {
    return (
      <div>
        <p>负责人: {users[item.owner].name}</p>
        <p>简介: {item.description || '无'}</p>
        <p>更新时间: {item.updated_at}</p>
      </div>
    );
  };

  const opt = (
    <Select placeholder="请选择项目负责人">
      {Object.keys(users).map((id) => (
        <Option key={id} value={id}>
          {users[id].name}
        </Option>
      ))}
    </Select>
  );
  const fields = [
    {
      name: 'name',
      label: '项目名称',
      required: true,
      message: '请输入项目名称',
      type: 'input',
      placeholder: '请输入项目名称',
    },
    {
      name: 'app',
      label: '服务名',
      required: true,
      message: '请输入项目对应服务名称',
      type: 'input',
      placeholder: '请输入项目对应服务名称',
      component: null,
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
      message: '请输入项目描述',
      type: 'textarea',
      placeholder: '请输入项目描述',
    },
    {
      name: 'private',
      label: '是否私有',
      required: true,
      message: '请选择项目是否私有',
      type: 'switch',
      valuePropName: 'checked',
    },
  ];
  return (
    <PageContainer title={false}>
      <FormForModal
        width={600}
        title="添加项目"
        left={6}
        right={18}
        record={{private: false}}
        visible={visible}
        onCancel={() => setVisible(false)}
        fields={fields}
        onFinish={onHandleCreate}
      />
      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col span={18}>
          <Button type="primary" onClick={() => setVisible(true)}>
            创建项目
            <Tooltip title="只有超级管理员可以创建项目">
              <QuestionCircleOutlined />
            </Tooltip>
          </Button>
        </Col>
        <Col span={6}>
          <Search
            onSearch={onSearchProject}
            style={{ float: 'right' }}
            placeholder="请输入项目名称"
          />
        </Col>
      </Row>
      <Spin spinning={false}>
        <Row gutter={16}>
          {data.length === 0 ? (
            <Col span={24} style={{ textAlign: 'center', marginBottom: 12 }}>
              <Card>
                <Empty description="暂无项目, 快点击『创建项目』创建一个吧!" />
              </Card>
            </Col>
          ) : (
            data.map((item) => (
              <Col key={item.id} span={4} style={{ marginBottom: 12 }}>
                <Popover content={content(item)} placement="rightTop">
                  <Card
                    hoverable
                    bordered={false}
                    style={{ borderRadius: 16, textAlign: 'center' }}
                    bodyStyle={{ padding: 16 }}
                    onClick={() => {
                      history.push(`/project/${item.id}`);
                    }}
                  >
                    <Avatar style={{ backgroundColor: '#87d068' }} size={64}>
                      {item.name.slice(0, 2)}
                    </Avatar>
                    <p
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 18,
                        marginTop: 8,
                      }}
                    >
                      {item.name}
                    </p>
                  </Card>
                </Popover>
              </Col>
            ))
          )}
        </Row>
        <Row gutter={8}>
          <Col span={24}>
            <Pagination {...pagination} style={{ float: 'right' }} position="bottomRight" />
          </Col>
        </Row>
      </Spin>
    </PageContainer>
  );
};
