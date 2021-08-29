import {connect} from 'umi';
import {Button, Card, Col, Form, Row} from "antd";
import styles from "@/components/Drawer/CaseDetail.less";
import getComponent from "@/components/PityForm";
import PostmanForm from "@/components/Postman/PostmanForm";
import fields from "@/consts/fields";
import {useEffect, useState} from "react";
import {SaveOutlined} from "@ant-design/icons";

const FormItem = Form.Item;

const TestCaseEditor = ({dispatch, user, testcase, loading, directoryId}) => {

  const {caseInfo} = testcase;
  const [form] = Form.useForm();
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState([]);

  const translateHeaders = () => {
    const hd = {};
    for (const h in headers) {
      hd[headers[h].key] = headers[h].value;
    }
    return JSON.stringify(hd, null, 2);
  };

  const onSubmit = async () => {
    const values = await form.validateFields()
    console.log(values)
    const params = {
      ...values,
      request_type: parseInt(values.request_type, 10),
      status: parseInt(values.status, 10),
      tag: values.tag !== undefined ? values.tag.join(',') : null,
      directory_id: directoryId,
      request_headers: translateHeaders(), body
    };
    if (caseInfo.id) {
      // 说明是编辑case
      params.id = caseInfo.id;
      dispatch({
        type: 'testcase/updateTestcase',
        payload: params,
      })
    } else {
      // 说明是新增Case
      dispatch({
        type: 'testcase/insertTestcase',
        payload: params,
      })
    }
  }

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
            extra={<Button type="primary" onClick={onSubmit}><SaveOutlined/> 提交</Button>}>
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
      <Card title={<span className={styles.caseTitle}>请求信息</span>} style={{marginTop: 16}}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <PostmanForm form={form} body={body} setBody={setBody} headers={headers} setHeaders={setHeaders}
                         bordered={false}/>
          </Col>
        </Row>
      </Card>
    </Form>

  )

}

export default connect(({user, testcase, loading}) => ({testcase, user, loading}))(TestCaseEditor);
