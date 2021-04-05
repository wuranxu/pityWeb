import React, {useEffect} from "react";
import {PageContainer} from '@ant-design/pro-layout';
import {Tabs, Card, Avatar} from 'antd';
import {connect, useParams} from "umi";
import conf from "@/consts/const";
import ProjectInfo from "@/components/Project/ProjectInfo";
import ProjectRole from "@/components/Project/ProjectRole";
import NProgress from "nprogress";

const {TabPane} = Tabs;


const ProjectDetail = ({dispatch, project}) => {
  const params = useParams();
  const {projectData} = project;

  useEffect(() => {
    NProgress.start();
    const projectId = params.id;
    dispatch({
      type: 'project/queryProject',
      payload: {
        projectId,
      }
    })
    NProgress.done();
  }, [])

  return (
    <PageContainer title={<span>{
      projectData.avatar !== null ? <Avatar src={`${conf.PIC_URL}${projectData.avatar}`}/> :
        <Avatar style={{backgroundColor: '#87d068'}}>{projectData.projectName.slice(0, 3)}</Avatar>
    } {project.currentProject}</span>}>
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="用例列表" key="1">
            Content of Tab Pane 1
          </TabPane>
          <TabPane tab="成员列表" key="2">
            <ProjectRole/>
          </TabPane>
          <TabPane tab="设置" key="3">
            <ProjectInfo data={projectData}/>
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  )
}

export default connect(({project, loading, user, routing}) => ({
  project, loading, user, routing
}))(ProjectDetail);


