import {PageContainer} from "@ant-design/pro-layout";
import {Card, Col, Empty, message, Row, Select, Spin, Table, Tree} from "antd";
import React, {useEffect, useState} from 'react';
import {connect} from 'umi';
import PityAceEditor from "@/components/CodeEditor/PityAceEditor";
import emptyWork from '@/assets/emptyWork.svg';
import {CopyTwoTone, PlayCircleTwoTone} from "@ant-design/icons";
import IconFont from "@/components/Icon/IconFont";
import TooltipIcon from "@/components/Icon/TooltipIcon";
import {CONFIG} from "@/consts/config";
import {CopyToClipboard} from 'react-copy-to-clipboard';

import noResult from '@/assets/noResult.svg';

const {DirectoryTree} = Tree;
const {Option} = Select;
const SqlOnline = ({online, dispatch, loading}) => {

  const {
    databaseSource,
    testResults,
    tables,
    table_map,
    sqlColumns,
    currentDatabase,
    currentDatabaseSqlType,
    currentDatabaseTitle
  } = online;
  const [editor, setEditor] = useState(null);
  const [sqlMode, setSqlMode] = useState('mysql');
  const [sqlValue, setSqlValue] = useState('');
  const [theme, setTheme] = useState('xcode');
  const [pagination, setPagination] = useState({
    current: 1,
    total: testResults.length,
    pageSize: 6,
    showTotal: total => `共${total}条数据`
  })


  useEffect(async () => {
    const data = await dispatch({
      type: 'online/fetchDatabaseSource',
    })
    getTree(data);
  }, [])

  const save = data => {
    dispatch({
      type: 'online/save',
      payload: {...data}
    })
  }

  const getColumns = () => {
    return sqlColumns.map(k => ({
      title: k,
      key: k,
      dataIndex: k,
      render: text => text === null ? <span style={{fontWeight: '100'}}>{"<null>"}</span> : text
    }))
  }

  const parseNewTree = databaseSource => {
    for (let i in databaseSource) {
      if (databaseSource[i].key.indexOf('column') > -1) {
        databaseSource[i].icon = <IconFont style={{fontSize: 15, marginRight: 2}}
                                           type={databaseSource[i].primary_key ? "icon-zhujian1" : "icon-shujuziduanliebiao"}/>;
        databaseSource[i].title = <span>{databaseSource[i].title} <span
          style={{fontSize: 12, fontWeight: 200, marginLeft: 8}}>{databaseSource[i].type}</span></span>;
      } else if (databaseSource[i].key.indexOf('table') > -1) {
        databaseSource[i].icon = <IconFont style={{fontSize: 15, marginRight: 2}} type="icon-se-shujubiao-Filled1"/>
      } else if (databaseSource[i].key.indexOf('database') > -1) {
        databaseSource[i].icon = <IconFont style={{fontSize: 15, marginRight: 2}}
                                           type={databaseSource[i].sql_type === 0 ? 'icon-mysql6' : 'icon-PostgreSQL'}/>
      }
      if (databaseSource[i].children !== undefined && databaseSource[i].children.length > 0) {
        parseNewTree(databaseSource[i].children)
      }
    }
  }

  const getTree = data => {
    parseNewTree(data)
    save({
      databaseSource: data,
    })
  }

  const onExecute = () => {
    if (!sqlValue) {
      message.warning("请输入sql语句!!!");
      return;
    }
    const value = editor.aceEditor.editor.getSelectedText();
    const real = value || sqlValue;
    dispatch({
      type: 'online/onlineExecuteSQL',
      payload: {
        id: currentDatabase,
        sql: real,
      }
    })
    setPagination({
      ...pagination,
      current: 1,
    })
  }

  const actions = currentDatabase === null ? null : <>
    <div>
      <span style={{marginRight: 8}}>模式</span>
      <Select size="small" style={{width: 90, marginRight: 12}} value={sqlMode} onSelect={e => setSqlMode(e)}>
        <Option value="mysql">MySQL</Option>
        <Option value="psql">Postgres</Option>
      </Select>
      <span style={{marginRight: 8}}>主题 </span>
      <Select size="small" style={{marginRight: 16, width: 180}} value={theme} onSelect={e => {
        setTheme(e);
      }}>
        {
          CONFIG.EDITOR_THEME.map(v => <Option value={v}>{v}</Option>)
        }
      </Select>
      <TooltipIcon icon={<PlayCircleTwoTone twoToneColor="#67C23A"/>} title="点击可执行全部SQL，如果选中SQL则执行选中的SQL" font={13}
                   style={{marginRight: 16}} onClick={onExecute}/>
      <TooltipIcon icon={
        <CopyToClipboard text={sqlValue}
                         onCopy={() => {
                           message.success("复制SQL成功")
                         }}>
          <CopyTwoTone/>
        </CopyToClipboard>
      } title="点击可复制全部SQL" font={13} style={{marginRight: 48}}/>
    </div>
  </>

  return (
    <PageContainer title={false}>
      <Spin spinning={loading.effects['online/fetchDatabaseSource']}
            tip="数据加载中, 请耐心等待..."
            indicator={<IconFont type="icon-loading1" spin style={{fontSize: 32}}/>} size="large">
        <Row gutter={[12]}>
          <Col span={8} style={{display: 'table-cell'}}>
            <Card title="数据库列表" bodyStyle={{height: 686, overflowY: 'auto'}} size="small">
              <DirectoryTree treeData={databaseSource} onSelect={(e, data) => {
                if (e.length > 0 && e[0].indexOf('database_') === 0) {
                  const id = parseInt(e[0].split("_")[1], 10)
                  const tables = table_map[id];
                  save({
                    tables,
                    currentDatabase: id,
                    currentDatabaseTitle: data.node.title,
                    currentDatabaseSqlType: data.node.sql_type,
                  })
                }
              }}/>
            </Card>
          </Col>
          <Col span={16} style={{display: 'table-cell'}}>
            <Card bodyStyle={{height: 288, overflowY: 'auto', padding: 0}}
                  title={currentDatabase !== null ? <span>{<IconFont style={{fontSize: 14, marginRight: 4}}
                                                                     type={currentDatabaseSqlType === 0 ? 'icon-mysql6' : 'icon-PostgreSQL'}/>}
                      {currentDatabaseTitle}</span> :
                    <IconFont type="icon-sharpicons_database"/>}
                  size="small" extra={actions}>
              {
                currentDatabase !== null ? <PityAceEditor height={280} tables={tables}
                                                          setEditor={setEditor}
                                                          language={sqlMode} theme={theme} value={sqlValue}
                                                          onChange={data => {
                                                            setSqlValue(data)
                                                          }}/> :
                  <Empty image={emptyWork} imageStyle={{height: 200, marginTop: 32}} description="选中左侧的『数据库』开启sql之旅吧~"/>
              }

            </Card>
            <Card style={{marginTop: 12}} bodyStyle={{height: 380, overflowY: 'auto'}}>
              {
                testResults.length === 0 ?
                  <Empty image={noResult} imageStyle={{height: 150}} description="没有『查询结果』哦, 快去执行SQL吧~"/> :
                  <Table columns={getColumns(sqlColumns)} dataSource={testResults} size="small"
                         scroll={{x: sqlColumns.length > 8 ? 2000 : 1000}}
                         pagination={pagination} onChange={pg => setPagination({
                    ...pagination,
                    current: pg.current,
                  })} rowKey={(record, index) => record.id || index}
                         loading={loading.effects['online/onlineExecuteSQL']}/>
              }
            </Card>
          </Col>
        </Row>

      </Spin>
    </PageContainer>
  )
}

export default connect(({online, loading}) => ({loading, online}))(SqlOnline);
