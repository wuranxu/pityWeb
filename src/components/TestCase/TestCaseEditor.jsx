import {connect} from 'umi';
import {Button, Card, Col, Form, Row} from "antd";
import styles from "@/components/Drawer/CaseDetail.less";
import getComponent from "@/components/PityForm";
import PostmanForm from "@/components/Postman/PostmanForm";
import fields from "@/consts/fields";
import {useEffect} from "react";
import {SaveOutlined} from "@ant-design/icons";

const FormItem = Form.Item;

const TestCaseEditor = ({
                          dispatch,
                          user,
                          form,
                          testcase,
                          loading,
                          directoryId,
                          body,
                          setBody,
                          headers,
                          setHeaders,
                          onSubmit,
                          create = false
                        }) => {

  const {caseInfo} = testcase;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(caseInfo);
  }, [caseInfo])

  return (
    <Form
      form={form}
      name="addCase"
      initialValues={caseInfo}
    >
      <Card title={<span className={styles.caseTitle}>用例信息</span>}
            extra={<>
              <Button type="primary" onClick={onSubmit}><SaveOutlined/> 提交</Button>
              <Button style={{marginLeft: 8}} onClick={() => {
                dispatch({
                  type: 'testcase/save',
                  payload: {editing: false}
                })
              }}><SaveOutlined/> 取消</Button>
            </>}>
        <Row gutter={[8, 8]}>
          {
            fields.CaseDetail.map(item => <Col span={item.span || 24}>
              <FormItem label={item.label} colon={item.colon || true}
                        labelCol={{span: 8}} wrapperCol={{span: 16}}
                        rules={
                          [{required: item.required, message: item.message}]
                        } name={item.name} valuePropName={item.valuePropName || 'value'}
              >
                {getComponent(item.type, item.placeholder, item.component)}
              </FormItem>
            </Col>)
          }
        </Row>
      </Card>
      {
        create ? <Card title={<span className={styles.caseTitle}>请求信息</span>} style={{marginTop: 16}}>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <PostmanForm form={form} body={body} setBody={setBody} headers={headers} setHeaders={setHeaders}
                           bordered={false}/>
            </Col>
          </Row>
        </Card> : null
      }
    </Form>

  )

}

export default connect(({
  user, testcase, loading
}
) => (
{
  testcase, user, loading
}
))(TestCaseEditor);
