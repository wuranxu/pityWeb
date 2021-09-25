import {Col, Row, TreeSelect} from "antd";
import {useEffect} from "react";
import {connect} from "umi";
import TestCaseConstructor from "@/components/TestCase/Constructor/TestCaseConstructor";

const TestCaseConstructorData = ({caseId, construct, dispatch, form, onFinish}) => {

  const {constructorData, searchConstructor, testcaseData, testCaseConstructorData, constructorType} = construct;

  const getConstructorData = () => {
    dispatch({
      type: 'construct/getConstructorTree',
    })
  }

  const save = (data) => {
    dispatch({
      type: 'construct/save',
      payload: data,
    })
  }

  useEffect(() => {
    getConstructorData();
  }, [])


  return (
    <Row style={{marginTop: 24}} gutter={[8, 8]}>
      <Col span={24}>
        <Row>
          <Col span={3}/>
          <Col span={18}>
            <Row>
              <Col span={4}/>
              <Col span={20}>
                <TreeSelect
                  allowClear
                  showSearch
                  style={{width: '100%'}}
                  value={searchConstructor}
                  filterTreeNode={(inputValue, treeNode) => {
                    return treeNode.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
                  }}
                  dropdownStyle={{maxHeight: 600, overflow: 'auto'}}
                  treeData={constructorData}
                  placeholder="通过搜索构造条件，可以快速复制参数哦！"
                  treeDefaultExpandAll
                  onChange={(e) => {
                    save({searchConstructor: e})
                    if (e !== undefined) {
                      dispatch({
                        type: 'construct/getConstructorData',
                        payload: {id: e.split("_")[1]}
                      })
                    } else {
                      dispatch({
                        type: 'construct/save',
                        payload: {testCaseConstructorData: {type: 0, public: true, enable: true}},
                      })
                    }
                  }}
                />
              </Col>
            </Row>

          </Col>
          <Col span={3}/>
        </Row>
        <Row style={{marginTop: 16}}>
          <Col span={24}>
            <Row>
              <Col span={3}/>
              <Col span={18}>
                <TestCaseConstructor data={testCaseConstructorData} dispatch={dispatch} testcaseData={testcaseData}
                                     constructorType={constructorType} form={form}/>
              </Col>
              <Col span={3}/>
            </Row>

          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default connect(({construct, loading}) => ({
  construct: construct,
  loading: loading,
}))(TestCaseConstructorData)
