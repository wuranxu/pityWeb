import {PageContainer} from "@ant-design/pro-components";
import {Button, Card, Col, Form, message, Row, Spin, Tabs} from "antd";
import OssConfig from "@/components/System/OssConfig";
import EmailConfig from "@/components/System/EmailConfig";
import YapiConfig from "@/components/System/YapiConfig";
import {SaveOutlined} from "@ant-design/icons";
import {connect} from "@umijs/max";
import {useEffect} from "react";

const {TabPane} = Tabs;

const SystemConfig = ({dispatch, gconfig, loading}) => {

  const [form] = Form.useForm()
  const {configuration} = gconfig;

  const onSetField = () => {
    const {email, oss, yapi} = configuration;
    form.setFieldsValue(email);
    form.setFieldsValue(oss);
    form.setFieldsValue(yapi);
  }

  useEffect(() => {
    dispatch({
      type: 'gconfig/fetchSystemConfig'
    })
  }, [])

  useEffect(() => {
    // 这里批量变更表单数据
    onSetField()
  }, [configuration])

  const onSubmit = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch (e) {
      message.info("有必填字段未填写，请检查")
      return;
    }
    const requestData = {
      email: {
        "sender": values.sender,
        "password": values.password,
        "host": values.host,
        "to": values.to
      },
      yapi: {
        "token": values.token,
      },
      oss: {
        "oss_type": values.oss_type,
        "access_key_id": values.access_key_id,
        "access_key_secret": values.access_key_secret,
        "bucket": values.bucket,
        "endpoint": values.endpoint
      }
    }
    dispatch({
      type: "gconfig/updateConfiguration",
      payload: requestData,
    })
  }

  return (
    <PageContainer title="系统设置" breadcrumb={null}>
      <Spin spinning={loading.effects['gconfig/updateConfiguration'] || loading.effects['gconfig/fetchSystemConfig']}>
        <Card>
          <Row>
            <Col span={24}>
              <Tabs tabPosition="left">
                <TabPane key="1" tab="邮件设置" forceRender>
                  <EmailConfig form={form}/>
                </TabPane>
                <TabPane key="2" tab="OSS设置" forceRender>
                  <OssConfig form={form}/>
                </TabPane>
                <TabPane key="3" tab="Yapi设置" forceRender>
                  <YapiConfig form={form}/>
                </TabPane>
              </Tabs>
            </Col>
          </Row>
          <Row>
            <div style={{margin: '16px auto'}}>
              <Button type="primary" icon={<SaveOutlined/>} onClick={onSubmit}>保存</Button>
            </div>
          </Row>
        </Card>
      </Spin>
    </PageContainer>
  )
}

export default connect(({gconfig, loading}) => ({gconfig, loading}))(SystemConfig);
