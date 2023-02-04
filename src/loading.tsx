import { PageLoading } from "@ant-design/pro-components"
import { Loading } from "@icon-park/react"
import "@icon-park/react/styles/index.css"

export default () => {
    return <PageLoading indicator={<Loading spin={true} theme="outline" size="36" fill="#4a90e2" strokeLinecap="butt" />} />
}