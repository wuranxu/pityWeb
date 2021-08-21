import {Button, Card, Col, Form, Modal, Row, Steps} from "antd";
import {connect} from "umi";
import IconFont from "@/components/Icon/IconFont";
import TestCaseConstructorData from "@/components/TestCase/Constructor/ConstructorData";
import {SaveOutlined} from "@ant-design/icons";

const {Meta} = Card;
const {Step} = Steps;

const ConstructorModal = ({modal, setModal, caseId, dispatch, construct, width, fetchData}) => {
  const [form] = Form.useForm();

  const {currentStep, totalStep, constructorType} = construct;

  const save = payload => {
    dispatch({
      type: 'construct/save',
      payload,
    })
  }

  const getContent = () => {
    if (currentStep === 0) {
      return <Row gutter={[24, 24]} style={{marginTop: 16}}>
        <Col span={8}>
          <Card
            hoverable
            bordered={false}
            cover={<IconFont type="icon-yongliliebiao" style={{fontSize: 72, paddingTop: 32}}
                             onClick={() => onSelectType(0)}/>}
          >
            <Meta title="测试用例" style={{textAlign: 'center', fontWeight: 'bold', color: "#1890ff"}}/>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            bordered={false}
            cover={<IconFont type="icon-mysql11" style={{fontSize: 72, paddingTop: 32}}
                             onClick={() => onSelectType(1)}/>}
          >
            <Meta title="SQL语句" style={{textAlign: 'center', fontWeight: 'bold', color: "#1890ff"}}/>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            bordered={false}
            cover={<IconFont type="icon-redis2" onClick={() => onSelectType(2)}
                             style={{fontSize: 72, paddingTop: 32}}/>}
          >
            <Meta title="Redis语句" style={{textAlign: 'center', fontWeight: 'bold', color: "#1890ff"}}/>
          </Card>
        </Col>
      </Row>
    }
    if (currentStep === 1) {
      if (constructorType === 0) {
        return <TestCaseConstructorData form={form}/>
      }
    }
  }

  const prev = () => {
    save({currentStep: currentStep - 1})
  }

  // const next = () => {
  //   save({currentStep: currentStep + 1})
  // }

  const onSelectType = constructorType => {
    save({
      constructorType,
      testCaseConstructorData: {
        type: constructorType,
        public: true,
        enable: true,
      },
      currentStep: currentStep + 1,
    })
  }

  return (
    <Modal title="数据构造器" width={width || 800} visible={modal} onCancel={() => setModal(false)} footer={null}
           style={{marginTop: -80}}>
      <>
        <Row>
          <Col span={6}/>
          <Col span={12}>
            <Steps current={currentStep} size="small">
              <Step key="type" title="选择类型"/>
              <Step key="type" title="构造数据"/>
            </Steps>
          </Col>
          <Col span={6}/>
        </Row>
        {getContent()}
        <div style={{marginTop: 24, textAlign: 'center'}}>
          {/*{0 < currentStep < totalStep - 1 && (*/}
          {/*  <Button type="primary" onClick={() => next()}>*/}
          {/*    下一步*/}
          {/*  </Button>*/}
          {/*)}*/}
          {currentStep === totalStep && (
            <Button type="primary" onClick={async () => {
              const values = await form.validateFields();
              dispatch({
                type: 'construct/insert',
                payload: {
                  params: {
                    value: values.value,
                    type: values.type,
                    name: values.name,
                    constructor_json: JSON.stringify({
                      project_id: values.case_id[0],
                      case_id: values.case_id[1],
                      params: values.params
                    }),
                    enable: values.enable,
                    case_id: caseId,
                    public: values.public,
                  },
                  fetchData: fetchData,
                }
              })
            }}>
              <SaveOutlined/> 完成
            </Button>
          )}
          {currentStep > 0 && (
            <Button style={{margin: '0 8px'}} onClick={() => prev()}>
              <IconFont type="icon-shangyibu1"/> 上一步
            </Button>
          )}
        </div>
      </>
    </Modal>
  )
}

export default connect(({construct, loading}) => ({
  construct: construct,
  loading: loading,
}))(ConstructorModal)
