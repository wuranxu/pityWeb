import {PageContainer} from "@ant-design/pro-layout";
import {useState} from "react";
import Helper from './help';
import "./index.less"
import Header from "@/pages/datafactory/header";
import Body from "@/pages/datafactory/body";
import {Alert} from "antd";

export default () => {

  const [helpVisible, setHelperVisible] = useState(true);

  return (
    <PageContainer title={false} breadcrumb={null}>
      <Alert type="warning" banner message="龟速开发中..." style={{marginBottom: 12}}/>
      {/*  头部*/}
      <Helper visible={helpVisible} onCancel={() => setHelperVisible(false)}/>
      <Header/>
      <Body/>
    </PageContainer>
  )
}
