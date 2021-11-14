import SqlOnline from "@/components/Online/SqlOnline";
import {PageContainer} from "@ant-design/pro-layout";

export default () => {
  return (
    <PageContainer title={false} breadcrumb={false}>
      <SqlOnline/>
    </PageContainer>
  )
}
