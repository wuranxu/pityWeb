import {Col, Form, Row, Select, TreeSelect} from "antd";
import {connect} from 'umi';
import React, {useEffect} from "react";
import {CONFIG} from "@/consts/config";

const {Option} = Select;

const CopyTreeSelect = ({construct, dispatch, suffix = true}) => {

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
        constructor_type: constructorType,
        suffix,
      }
    })
  }

  useEffect(() => {
    getConstructorData();
  }, [constructorType])

  return (
    <Row style={{marginTop: 24}}>
      <Col span={24}>
        <Row gutter={8}>
          <Col span={12}>
            <Form.Item label="数据类型" name="type" {...CONFIG.SUB_LAYOUT}>
              <Select disabled defaultValue={constructorType}>
                {
                  Object.keys(CONFIG.CONSTRUCTOR_TYPE).map(key => <Option value={parseInt(key, 10)}
                                                                          key={key}>{CONFIG.CONSTRUCTOR_TYPE[key]}</Option>)
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="复制构造条件" {...CONFIG.SUB_LAYOUT}>
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
            </Form.Item>
          </Col>
        </Row>
      </Col>
    </Row>

  )
}

export default connect(({loading, construct}) => ({loading, construct}))(CopyTreeSelect);
