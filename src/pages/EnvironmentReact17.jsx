import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Col, Divider, Input, Row, Spin, Table } from 'antd';
import { useEffect, useState } from 'react';
import { insertEnvironment, listEnvironment, updateEnvironment } from '@/services/configure';
import auth from '@/utils/auth';
import FormForModal from '@/components/PityForm/FormForModal';
import fields from '@/consts/fields';
import { listUsers } from '@/services/user';


export default () => {
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const [record, setRecord] = useState({id: 0});
  const [users, setUsers] = useState({});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({current: 1, pageSize: 8, total: 0});

  const getUsers = async () => {
    const user = await listUsers();
    const temp = {};
    user.forEach((item) => {
      temp[item.id] = item.name;
    });
    setUsers(temp);
  };

  const init = async () => {
    await fetchEnvironmentList();
    await getUsers();
  }



  const fetchEnvironmentList = async (page=pagination.current, size=pagination.pageSize, name=name) => {
    setLoading(true);
    const res = await listEnvironment({page, size, name})
    if (auth.response(res)) {
      setData(res.data);
      setPagination({...pagination, total: res.data});
    }
    setLoading(false);
  }

  useEffect(init, []);

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "环境名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "备注",
      key: "remarks",
      dataIndex: "remarks",
    },
    {
      title: "创建人",
      key: "create_user",
      render: (_, record) =>  users[record.create_user.toString()] || '加载中...'
    },
    {
      title: "更新时间",
      dataIndex: "updated_at",
      key: "updated_at",
    },
    {
      title: "操作",
      key: "operation",
      render: (_, record) => <>
        <a onClick={()=>{
          setRecord(record);
          setVisible(true);
        }}>编辑</a>
        <Divider type="vertical"/>
        <a>删除</a>
      </>
    },
  ]

  const onHandleSearch = value => {

  }

  const onChange = page => {

  }

  const onFinish = async values => {
    const params = {...values, id: record.id}
    let res;
    if (record.id === 0) {
      // 说明是新增
      res = await insertEnvironment(params);
    } else {
      res = await updateEnvironment(params);
    }
    if (auth.response(res, true)) {
      setVisible(false);
    }
    await fetchEnvironmentList();
  }

  return (
    <PageContainer title="环境配置" breadcrumb={false}>
      <Spin spinning={loading}>
        <FormForModal visible={visible} onCancel={()=>setVisible(false)}
                      title="环境管理" left={6} right={18} width={500} record={record} onFinish={onFinish} fields={fields.Environment}
        />
        <Card>
          <Row>
            <Col span={6}>
              <Button type="primary" onClick={()=>setVisible(true)}>新增环境</Button>
            </Col>
            <Col span={12}/>
            <Col span={6}>
              <Input.Search value={name} onChange={e=>setName(e.target.value)} onSearch={onHandleSearch} placeholder="请输入环境名"/>
            </Col>
          </Row>
          <Row style={{marginTop: 12}}>
            <Col span={24}>
              <Table columns={columns} dataSource={data} pagination={onChange}/>
            </Col>
          </Row>
        </Card>
      </Spin>
    </PageContainer>
  )
}
