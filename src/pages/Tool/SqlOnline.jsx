import SqlOnline from "@/components/Online/SqlOnline";
import {PageContainer} from "@ant-design/pro-components";

export default () => {
  return (
    <PageContainer title={false} breadcrumb={null}>
      <SqlOnline/>
    </PageContainer>
  )
}
