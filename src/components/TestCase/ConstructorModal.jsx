import {Button, Card, Col, Drawer, Row, Steps} from "antd";
import {connect} from "umi";
import IconFont from "@/components/Icon/IconFont";
import TestCaseConstructorData from "@/components/TestCase/Constructor/ConstructorData";
import {SaveOutlined} from "@ant-design/icons";
import styles from './ConstructorModal.less';
import {useEffect} from "react";
import DatabaseConstructor from "@/components/TestCase/Constructor/DatabaseConstructor";

const {Meta} = Card;
const {Step} = Steps;

const ConstructorModal = ({modal, form, setModal, caseId, dispatch, construct, width, fetchData, record}) => {

  const {currentStep, totalStep, constructorType, testCaseConstructorData} = construct;

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(record);
  }, [record])

  const save = payload => {
    dispatch({
      type: 'construct/save',
      payload,
    })
  }

  const getConstructorJson = (values) => {
    if (testCaseConstructorData.type === 0) {
      // 说明是用例
      return JSON.stringify({
        project_id: values.case_id[0],
        case_id: values.case_id[1],
        params: values.params
      })
    } else if (testCaseConstructorData.type === 1) {
      // 说明是sql构造方法
      return JSON.stringify({
        database: values.database,
        sql: values.sql,
      })
    }
  }

  const onSubmit = async () => {
    const values = await form.validateFields();
    const params = {
      value: values.value,
      type: testCaseConstructorData.type,
      name: values.name,
      constructor_json: getConstructorJson(values),
      enable: values.enable,
      case_id: caseId,
      public: values.public,
    }
    let result;
    if (record.id) {
      result = await dispatch({
        type: 'construct/update',
        payload: {
          ...params,
          id: record.id,
        }
      })
    } else {
      result = await dispatch({
        type: 'construct/insert',
        payload: params
      })
    }
    if (result) {
      fetchData();
    }
  }

  const getContent = () => {
    if (currentStep === 0) {
      return <Row gutter={[24, 24]} style={{marginTop: 16}}>
        <Col span={8}>
          <Card
            hoverable
            className={styles.mycard}
            bodyStyle={{background: '#ffffff', padding: 16}}
            cover={<IconFont type="icon-yongliliebiao" className={styles.icons}
                             onClick={() => onSelectType(0)}/>}
          >
            <Meta title="测试用例" style={{textAlign: 'center', fontWeight: 'bold', color: "#1890ff"}}/>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            className={styles.mycard}
            bodyStyle={{background: '#ffffff', padding: 16}}
            cover={<IconFont type="icon-mysql11" className={styles.icons}
                             onClick={() => onSelectType(1)}/>}
          >
            <Meta title="SQL语句" className={styles.metadata}/>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            className={styles.mycard}
            bodyStyle={{background: '#ffffff', padding: 16}}
            cover={<IconFont type="icon-redis2" onClick={() => onSelectType(2)}
                             className={styles.icons}/>}
          >
            <Meta title="Redis语句" className={styles.metadata}/>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            bodyStyle={{background: '#ffffff', padding: 16}}
            hoverable
            className={styles.mycard}
            cover={<IconFont type="icon-qingqiu" onClick={() => onSelectType(3)}
                             className={styles.icons}/>}
          >
            <Meta title="HTTP请求" className={styles.metadata}/>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            bodyStyle={{background: '#ffffff', padding: 16}}
            hoverable
            className={styles.mycard}
            cover={<IconFont type="icon-python" onClick={() => onSelectType(4)}
                             className={styles.icons}/>}
          >
            <Meta title="Python方法" className={styles.metadata}/>
          </Card>
        </Col>

      </Row>
    }
    if (currentStep === 1) {
      if (constructorType === 0) {
        return <TestCaseConstructorData form={form}/>
      }
      if (constructorType === 1) {
        return <DatabaseConstructor form={form}/>
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
    <Drawer title="数据构造器" width={width || 1100} visible={modal} onClose={() => setModal(false)} footer={null}>
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
            <Button type="primary" onClick={onSubmit}>
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
    </Drawer>
  )
}

export default connect(({construct, loading}) => ({
  construct: construct,
  loading: loading,
}))(ConstructorModal)
