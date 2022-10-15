import {Card, Col, Empty, message, Row, Select, Spin, Table, Tabs, Tree} from "antd";
import React, {useEffect, useState} from 'react';
import {connect} from 'umi';
import SqlAceEditor from "@/components/CodeEditor/AceEditor/SqlAceEditor";
import emptyWork from '@/assets/emptyWork.svg';
import {CopyTwoTone, PlayCircleTwoTone} from "@ant-design/icons";
import {IconFont} from "@/components/Icon/IconFont";
import TooltipIcon from "@/components/Icon/TooltipIcon";
import {CONFIG} from "@/consts/config";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import noResult from '@/assets/NoData.svg';
import {Data, HistoryQuery, InsertTable, Key, ListView} from "@icon-park/react";
import SqlHistory from "@/components/Online/SqlHistory";

const {DirectoryTree} = Tree;
const {Option} = Select;
const {TabPane} = Tabs;
const SqlOnline = ({online, dispatch, loading, leftHeight, cardHeight, tableHeight, imageHeight, editorHeight}) => {

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
  const [theme, setTheme] = useState('material-one-dark');
  const [pagination, setPagination] = useState({
    current: 1,
    total: testResults.length,
    pageSize: 4,
    pageSizeOptions: [4, 10, 50],
    showTotal: total => `共${total}条数据`
  })

  useEffect(() => {
    dispatch({
      type: 'online/fetchDatabaseSource',
      payload: {}
    })
  }, [])

  useEffect(() => {
    getTree(databaseSource);
  }, [databaseSource])

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
        databaseSource[i].icon =
          databaseSource[i].primary_key ?
            <Key theme="outline" size="15" fill="#f8e725" style={{marginRight: 2}}/> :
            <ListView theme="outline" size="15" fill="#333" style={{marginRight: 2}}/>
        databaseSource[i].title = <span>{databaseSource[i].title} <span
          style={{fontSize: 12, fontWeight: 200, marginLeft: 8}}>{databaseSource[i].type}</span></span>;
      } else if (databaseSource[i].key.indexOf('table') > -1) {
        databaseSource[i].icon = <InsertTable theme="outline" size="15" fill="#7ed321" style={{marginRight: 2}}/>
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

  const fetchTables = async (data) => {
    return await dispatch({
      type: 'online/fetchTables',
      payload: data
    })
  }

  const onLoadData = ({key, children, data, title, sql_type}) => {
    return new Promise(async (resolve) => {
      if (!key.startsWith("database_") || !children) {
        resolve();
        return;
      }
      const child = await fetchTables(data)
      const ans = [...databaseSource]
      ans.forEach(item => {
        const idx = item.children?.findIndex(v => v.key === `database_${data.id}`)
        if (idx > -1) {
          item.children[idx].children = child
        }
      })
      dispatch({
        type: 'online/save',
        payload: {
          databaseSource: ans,
          currentDatabaseTitle: title,
          currentDatabaseSqlType: sql_type
        }
      })
      resolve();
    });

  }

  const actions = currentDatabase === null ? null : <>
    <div>
      <span style={{marginRight: 8}}>模式</span>
      <Select size="small" style={{width: 90, marginRight: 12}} value={sqlMode} onSelect={e => setSqlMode(e)}>
        <Option key="mysql" value="mysql">MySQL</Option>
        <Option key="psql" value="psql">Postgres</Option>
      </Select>
      <span style={{marginRight: 8}}>主题 </span>
      <Select size="small" style={{marginRight: 16, width: 170}} value={theme} onSelect={e => {
        setTheme(e);
      }}>
        {
          CONFIG.EDITOR_THEME.map(v => <Option value={v}>{v}</Option>)
        }
      </Select>
      <TooltipIcon icon={<PlayCircleTwoTone twoToneColor="#67C23A"/>}
                   title="点击可执行全部SQL，如果选中SQL则执行选中的SQL" font={13}
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

    <Spin spinning={!!(loading.effects['online/fetchDatabaseSource'] || loading.effects['online/onlineExecuteSQL'])}
          tip="数据加载中, 请耐心等待..." size="large">
      <Row gutter={12}>
        <Col span={8} style={{display: 'table-cell'}}>
          <Card title="数据库列表" bodyStyle={{height: leftHeight || 676, overflowY: 'auto'}} size="small">
            <DirectoryTree treeData={databaseSource}
                           loadData={onLoadData}
                           onSelect={(e, data) => {
                             if (e.length > 0 && e[0].indexOf('database_') === 0) {
                               const id = parseInt(e[0].split("_")[1], 10)
                               const tables = Array.from(new Set(table_map[id]));
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
          <Card bodyStyle={{height: cardHeight || 288, overflowY: 'auto', padding: 0}}
                title={currentDatabase !== null ? <span>{<IconFont style={{fontSize: 14, marginRight: 4}}
                                                                   type={currentDatabaseSqlType === 0 ? 'icon-mysql6' : 'icon-PostgreSQL'}/>}
                    {currentDatabaseTitle}</span> :
                  <IconFont type="icon-sharpicons_database"/>}
                size="small" extra={actions}>
            {
              currentDatabase !== null ? <SqlAceEditor height={editorHeight || 280} tables={tables}
                                                       setEditor={setEditor}
                                                       language={sqlMode} theme={theme} value={sqlValue}
                                                       onChange={data => {
                                                         setSqlValue(data)
                                                       }}/> :
                <Empty image={emptyWork} imageStyle={{height: imageHeight || 190, marginTop: 32}}
                       description="选中左侧的『数据库连接』开启sql之旅吧~"/>
            }

          </Card>
          <Card style={{marginTop: 12}}
                bodyStyle={{height: tableHeight || 370, overflowY: 'auto', padding: "8px 24px"}}>
            <Tabs defaultActiveKey="1">
              <TabPane key="1" tab={<span><Data theme="outline" size="13" fill="#333"/> 执行结果</span>}>
                {
                  testResults.length === 0 ?
                    <Empty image={noResult} imageStyle={{height: imageHeight || 180}}
                           description="没有『查询结果』哦, 快去执行SQL吧~"/> :
                    <Table columns={getColumns(sqlColumns)} dataSource={testResults} size="small"
                           scroll={{x: sqlColumns.length > 8 ? 2000 : 1000, y: 190}} bordered={true}
                           pagination={pagination} onChange={pg => setPagination({
                      ...pagination,
                      current: pg.current,
                      pageSize: pg.pageSize,
                    })} rowKey={(record, index) => record.id || index}
                           loading={loading.effects['online/onlineExecuteSQL']}/>
                }
              </TabPane>
              <TabPane key="2" tab={<span><HistoryQuery theme="outline" size="13" fill="#333"/> 历史记录</span>}>
                <SqlHistory/>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </Spin>
  )
}

export default connect(({online, loading}) => ({loading, online}))(SqlOnline);
