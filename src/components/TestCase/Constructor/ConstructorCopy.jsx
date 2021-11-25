import {Col, Row, TreeSelect} from "antd";
import {connect} from 'umi';
import {useEffect} from "react";

const CopyTreeSelect = ({construct, dispatch}) => {

  const {constructorData, searchConstructor, constructorType} = construct;


  const save = (data) => {
    dispatch({
      type: 'construct/save',
      payload: data,
    })
  }

  const getConstructorData = () => {
    dispatch({
      type: 'construct/getConstructorTree',
      payload: {
        constructor_type: constructorType
      }
    })
  }

  useEffect(() => {
    getConstructorData();
  }, [constructorType])

  return (
    <Row style={{marginTop: 24, marginBottom: 24}}>
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
                    payload: {testCaseConstructorData: {type: constructorType, public: true, enable: true}},
                  })
                }
              }}
            />
          </Col>
        </Row>

      </Col>
      <Col span={3}/>
    </Row>

  )
}

export default connect(({loading, construct}) => ({loading, construct}))(CopyTreeSelect);
