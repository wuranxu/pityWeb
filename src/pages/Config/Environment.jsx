import React, { Component } from 'react';
import { Button, Card, Col, Spin, Divider, Input, Row, Table } from 'antd';
import { PageContainer } from '@ant-design/pro-components';
import { PlusOutlined } from '@ant-design/icons';
import {
  deleteEnvironment,
  insertEnvironment,
  listEnvironment,
  updateEnvironment,
} from '@/services/configure';
import auth from '@/utils/auth';
import FormForModal from '@/components/PityForm/FormForModal';
import fields from '@/consts/fields';
import UserLink from '@/components/Button/UserLink';

class Environment extends Component {
  state = {
    data: [],
    users: {},
    pagination: {
      current: 1,
      pageSize: 8,
      total: 0,
    },
    name: '',
    visible: false,
    loading: false,
    record: { id: 0 },
  };

  async componentDidMount() {
    const users = await auth.getUserMap();
    this.setState({ users });
    await this.fetchEnvironmentList();
  }

  fetchEnvironmentList = async (
    page = this.state.pagination.current,
    size = this.state.pagination.pageSize,
    name = this.state.name,
  ) => {
    this.setState({ loading: true });
    const res = await listEnvironment({ page, size, name });
    if (auth.response(res)) {
      this.setState({
        data: res.data,
        pagination: { total: res.total, current: page, pageSize: size },
      });
    }
    this.setState({ loading: false });
  };

  onSearch = async (name) => {
    await this.fetchEnvironmentList(1, this.state.pagination.pageSize, name);
  };

  onFinish = async (values) => {
    const params = { ...values, id: this.state.record.id };
    let res;
    if (this.state.record.id === 0) {
      // 说明是新增
      res = await insertEnvironment(params);
    } else {
      res = await updateEnvironment(params);
    }
    if (auth.response(res, true)) {
      this.setState({ visible: false });
    }
    await this.fetchEnvironmentList();
  };

  onDelete = async (id) => {
    const res = await deleteEnvironment({ id });
    auth.response(res, true);
    await this.fetchEnvironmentList();
  };

  render() {
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '环境名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '备注',
        key: 'remarks',
        dataIndex: 'remarks',
      },
      {
        title: '创建人',
        key: 'create_user',
        // render: (_, record) => this.state.users[record.create_user.toString()] || '加载中...',
        render: (_, record) => <UserLink user={this.state.users[record.create_user.toString()]} />,
      },
      {
        title: '更新时间',
        dataIndex: 'updated_at',
        key: 'updated_at',
      },
      {
        title: '操作',
        key: 'operation',
        render: (_, record) => (
          <>
            <a
              onClick={() => {
                this.setState({ visible: true, record });
              }}
            >
              编辑
            </a>
            <Divider type="vertical" />
            <a
              onClick={async () => {
                await this.onDelete(record.id);
              }}
            >
              删除
            </a>
          </>
        ),
      },
    ];

    return (
      <PageContainer title="环境配置" breadcrumb={null}>
        <Spin spinning={this.state.loading}>
          <Card>
            <FormForModal
              open={this.state.visible}
              onCancel={() => {
                this.setState({ visible: false });
              }}
              title="环境管理"
              left={6}
              right={18}
              width={500}
              record={this.state.record}
              onFinish={this.onFinish}
              fields={fields.Environment}
            />
            <Row>
              <Col span={6}>
                <Button
                  type="primary"
                  onClick={() => {
                    this.setState({ visible: true, record: { id: 0 } });
                  }}
                >
                  <PlusOutlined />
                  新增环境
                </Button>
              </Col>
              <Col span={12} />
              <Col span={6}>
                <Input.Search
                  placeholder="请输入要查询的环境名称"
                  value={this.state.name}
                  onSearch={this.onSearch}
                  onChange={(e) => {
                    this.setState({ name: e.target.value });
                  }}
                />
              </Col>
            </Row>
            <Row style={{ marginTop: 12 }}>
              <Col span={24}>
                <Table
                  dataSource={this.state.data}
                  columns={columns}
                  onChange={async (pagination) => {
                    await this.fetchEnvironmentList(pagination.current, pagination.pageSize);
                  }}
                  pagination={this.state.pagination}
                  rowKey={(record) => record.id}
                />
              </Col>
            </Row>
          </Card>
        </Spin>
      </PageContainer>
    );
  }
}

export default Environment;
