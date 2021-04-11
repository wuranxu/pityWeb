import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Avatar, Card, Tabs } from 'antd';
import { useParams } from 'umi';
import { process } from '@/utils/utils';
import { queryProject } from '@/services/project';
import auth from '@/utils/auth';
import ProjectInfo from '@/components/Project/ProjectInfo';
import { listUsers } from '@/services/user';
import ProjectRole from '@/components/Project/ProjectRole';

const { TabPane } = Tabs;


export default () => {
  const params = useParams();
  const projectId = params.id;
  const [projectData, setProjectData] = useState({});
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const fetchUsers = async () => {
    const res = await listUsers();
    setUsers(res);
  };

  const fetchData = async () => {
    await fetchUsers();
    const res = await queryProject({ projectId });
    if (auth.response(res)) {
      setProjectData(res.data.project);
      setRoles(res.data.roles);
    }
  };

  useEffect(async () => {
    await process(fetchData);
  }, []);


  return (
    <PageContainer title={<span>
      <Avatar
        style={{ backgroundColor: '#87d068' }}>{projectData.name === undefined ? 'loading...' : projectData.name.slice(0, 2)}</Avatar>{projectData.name}</span>}>
      <Card>
        <Tabs defaultActiveKey='1'>
          <TabPane tab='用例列表' key='1'>
            这里没有用例，暂时替代一下
          </TabPane>
          <TabPane tab='成员列表' key='2'>
            <ProjectRole users={users} project={projectData} roles={roles} fetchData={fetchData}/>
          </TabPane>
          <TabPane tab='项目设置' key='3'>
            <ProjectInfo data={projectData} users={users} reloadData={fetchData} />
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};



