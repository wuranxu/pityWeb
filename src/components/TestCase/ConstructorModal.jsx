import {Button, Col, Drawer, Row, Steps} from "antd";
import {connect} from "@umijs/max";
import {IconFont} from "@/components/Icon/IconFont";
import TestCaseConstructorData from "@/components/TestCase/Constructor/ConstructorData";
import {SaveOutlined} from "@ant-design/icons";
import {useState} from "react";
import DatabaseConstructor from "@/components/TestCase/Constructor/DatabaseConstructor";
import {CheckCard} from '@ant-design/pro-card';
import RedisConstructor from "@/components/TestCase/Constructor/RedisConstructor";
import PythonConstructor from "@/components/TestCase/Constructor/PythonConstructor";
import HTTPConstructor from "@/components/TestCase/Constructor/HTTPConstructor";
import common from "@/utils/common";


const {Step} = Steps;

const ConstructorModal = ({
                            modal,
                            form,
                            setModal,
                            caseId,
                            dispatch,
                            construct,
                            testcase,
                            width,
                            fetchData,
                            record,
                            suffix = false,
                            createMode = false, // 默认非创建模式
                          }) => {

  const {currentStep, totalStep, constructorType, testCaseConstructorData} = construct;
  const {preConstructor, postConstructor} = testcase;
  const [headers, setHeaders] = useState([]);
  const [body, setBody] = useState('');
  const [bodyType, setBodyType] = useState(0);

  const save = payload => {
    dispatch({
      type: 'construct/save',
      payload,
    })
  }

  const getConstructorJson = (values) => {
    switch (testCaseConstructorData.type) {
      case 0:
        return JSON.stringify({
          // project_id: values.case_id[0],
          constructor_case_id: values.constructor_case_id,
          params: values.params
        })
      case 1:
        return JSON.stringify({
          database: values.database,
          sql: values.sql,
        })
      case 2:
        return JSON.stringify({
          redis: values.redis,
          command: values.command,
        })
      case 3:
        return JSON.stringify({
          command: values.command
        })
      case 4:
        return JSON.stringify({
          body,
          headers: common.translateHeaders(headers),
          base_path: values.base_path,
          url: values.url,
          request_method: values.request_method,
          body_type: bodyType,
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
    if (!createMode) {
      // 说明是编辑
      if (record.id) {
        result = await dispatch({
          type: 'construct/update',
          payload: {
            ...params,
            id: record.id,
            suffix,
          }
        })
      } else {
        result = await dispatch({
          type: 'construct/insert',
          payload: {
            ...params,
            suffix,
          }
        })
      }
      if (result) {
        fetchData();
      }
    } else {
      // 说明是临时
      const newData = [...(!suffix ? preConstructor : postConstructor)]
      if (record.tempIndex === undefined) {
        // 说明是新增
        newData.push({...params, suffix, index: newData.length})
      } else {
        // 说明是编辑
        newData.splice(record.tempIndex, 1, {...params, suffix})
      }
      dispatch({
        type: 'testcase/save',
        payload: {
          [!suffix ? 'preConstructor' : 'postConstructor']: newData,
          constructorModal: false,
        }
      })
    }
  }


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

  const getContent = () => {
    if (currentStep === 0) {
      return <Row gutter={[12, 12]} style={{marginTop: 36}}>
        <Col span={8}>
          <CheckCard
            avatar={<IconFont type="icon-yongliliebiao" style={{fontSize: 32}}/>}
            title="测试场景"
            description="测试场景可以复用, 并传递用例的数据给下一个场景"
            onClick={() => onSelectType(0)}
          />
        </Col>
        <Col span={8}>
          <CheckCard
            avatar={<IconFont type="icon-mysql11" style={{fontSize: 32}}/>}
            title="SQL语句"
            description="通过执行SQL语句，可以造出/恢复用例场景需要的数据"
            onClick={() => onSelectType(1)}
          />
        </Col>
        <Col span={8}>
          <CheckCard
            avatar={<IconFont type="icon-redis2" style={{fontSize: 32}}/>}
            title="Redis操作"
            description="通过操作Redis，可以获取或者校验缓存中的数据"
            onClick={() => onSelectType(2)}
          />
        </Col>
        <Col span={8}>
          <CheckCard
            avatar={<IconFont type="icon-python" style={{fontSize: 32}}/>}
            title="Python方法"
            description="需要自定义造数方法的，可以使用Python编写对应的核心方法"
            onClick={() => onSelectType(3)}
          />
        </Col>
        <Col span={8}>
          <CheckCard
            avatar={<IconFont type="icon-qingqiu" style={{fontSize: 32}}/>}
            title="HTTP请求"
            description="依赖于第三方的接口，推荐使用HTTP请求，如通过百度api识别对应图片验证码"
            onClick={() => onSelectType(4)}
          />
        </Col>

      </Row>
    }
    if (currentStep === 1) {
      if (constructorType === 0) {
        return <TestCaseConstructorData form={form} suffix={suffix}/>
      }
      if (constructorType === 1) {
        return <DatabaseConstructor form={form} suffix={suffix}/>
      }
      if (constructorType === 2) {
        return <RedisConstructor form={form} suffix={suffix}/>
      }
      if (constructorType === 3) {
        return <PythonConstructor form={form} suffix={suffix}/>
      }
      if (constructorType === 4) {
        return <HTTPConstructor suffix={suffix} form={form} headers={headers} bodyType={bodyType}
                                setBodyType={setBodyType}
                                setHeaders={setHeaders} body={body} setBody={setBody}/>
      }
    }
  }

  const prev = () => {
    save({currentStep: currentStep - 1})
  }

  // const next = () => {
  //   save({currentStep: currentStep + 1})
  // }


  return (
    <Drawer title={suffix ? '后置步骤' : '前置步骤'} width={width || 800} open={modal} onClose={() => setModal(false)}
            footer={null}>
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

export default connect(({construct, testcase, loading}) => ({
  construct,
  loading,
  testcase,
}))(ConstructorModal)
