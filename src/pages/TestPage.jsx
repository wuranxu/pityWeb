import {PageContainer} from "@ant-design/pro-layout";
import CodeEditor from "@/components/CodeEditor/PityMonacoEditor";
import {useState} from "react";

export default () => {
  const [content, setContent] = useState('');

  return <PageContainer>
    <CodeEditor content={content} setContent={setContent}/>
  </PageContainer>
}
