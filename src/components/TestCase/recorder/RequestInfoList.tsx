import React, {useRef, useState} from "react";
import type {InputRef} from "antd";
import {Button, Input, Modal, Space, Table, Tag, Tooltip} from 'antd';
import SyntaxHighlighter from "react-syntax-highlighter";
import {vs2015} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import type {FilterConfirmProps} from 'antd/lib/table/interface';
import {TableRowSelection} from "antd/lib/table/interface";
import NoRecord from "@/components/NotFound/NoRecord";
import RequestInfo from "../../../types/RequestInfo";
import type {ColumnsType, ColumnType} from 'antd/lib/table';
import {DeleteTwoTone, SearchOutlined} from "@ant-design/icons";
import Highlighter from 'react-highlight-words';


interface RequestInfoProps {
  dataSource: Array<RequestInfo>;
  rowKey?: string;
  rowSelection: TableRowSelection<any>;
  loading?: boolean;
  dispatch: Function,
  emptyText?: string | '暂无数据';
}

type DataIndex = keyof RequestInfoProps;

interface TagProps {
  color: string;
  fontColor: string;
}

const tagColor = (method: string): TagProps => {
  switch (method.toUpperCase()) {
    case "GET":
      return {color: 'rgb(235, 249, 244)', fontColor: 'rgb(47, 177, 130)'}
    case "POST":
      return {color: 'rgb(242, 244, 248)', fontColor: 'rgb(5, 112, 175)'}
    case "PUT":
      return {color: 'rgb(255, 247, 230)', fontColor: 'rgb(255, 174, 0)'}
    case "DELETE":
      return {color: 'rgb(253, 244, 246)', fontColor: 'rgb(222, 72, 108)'}
    default:
      return {color: 'rgb(243, 251, 254)', fontColor: 'rgb(166, 187, 210)'}
  }
}

const MethodTag = ({color, text, fontColor}) => {
  return <Tag style={{color: fontColor, borderRadius: 12, padding: '0 12px'}} color={color}>{text}</Tag>
}

const Detail = ({name, record}) => {
  return <a onClick={() => {
    Modal.info({
      title: name,
      width: 700,
      bodyStyle: {padding: -12},
      content: <SyntaxHighlighter language="json" style={vs2015}>{record[name]}</SyntaxHighlighter>
    })
  }}>详细</a>
}

const RequestInfoList: React.FC<RequestInfoProps> = ({dataSource, dispatch, loading, ...restProps}) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };
  // @ts-ignore
  // @ts-ignore
  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<RequestInfo> => ({
    filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
      <div style={{padding: 8}}>
        <Input
          ref={searchInput}
          placeholder={`搜索 ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{marginBottom: 8, display: 'block'}}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined/>}
            size="small"
            style={{width: 90}}
          >
            查找
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{width: 90}}
          >
            重置
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({closeDropdown: false});
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            过滤
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    ellipsis: true,
    render: text =>
      searchedColumn === dataIndex ? (
        <Tooltip title={text}>
          <Highlighter
            highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        </Tooltip>
      ) : (
        <Tooltip title={text}>
          <a href={text}>{text.slice(0, 48)}</a>
        </Tooltip>
      ),
  });

  const onRemoveRecord = index => {
    dispatch({
      type: 'recorder/remove',
      payload: index,
    })
  }


  const columns: ColumnsType<RequestInfo> = [
    {
      title: '编号',
      key: 'index',
      render: (text, record) => `${record.index + 1}`
    },
    {
      title: '请求地址',
      key: 'url',
      dataIndex: 'url',
      width: '20%',
      // render: url => <Tooltip title={url}><a href={url}>{url.slice(0, 48)}</a> </Tooltip>,
      ...getColumnSearchProps('url'),
    },
    {
      title: '请求方式',
      key: 'request_method',
      dataIndex: 'request_method',
      render: md => <MethodTag fontColor={tagColor(md).fontColor} color={tagColor(md).color} text={md}/>
    },
    {
      title: '请求headers',
      key: 'request_headers',
      dataIndex: 'request_headers',
      render: (request_headers, record): React.ReactNode => {
        return <Detail name="request_headers" record={record}/>
      }
    },
    {
      title: '请求参数',
      key: 'body',
      dataIndex: 'body',
      render: (body, record) => {
        if (!body) {
          return '-'
        }
        return <Detail name="body" record={record}/>
      }
    },
    {
      title: '返回headers',
      key: 'response_headers',
      dataIndex: 'response_headers',
      render: (response_headers, record) => {
        if (!response_headers) {
          return '-'
        }
        return <Detail name="response_headers" record={record}/>
      }
    },
    {
      title: 'response',
      key: 'response_content',
      dataIndex: 'response_content',
      render: (response_content, record) => {
        if (!response_content) {
          return '-'
        }
        return <Detail name="response_content" record={record}/>
      }
    },
    {
      key: 'ops',
      title: '操作',
      render: (_, record) => <Tooltip title="点击可删除录制数据(不推荐)"><DeleteTwoTone twoToneColor="#F56C6C" onClick={() => {
        onRemoveRecord(record.index)
      }}/></Tooltip>
    }
  ]


  return (
    <Table columns={columns} dataSource={dataSource}
           rowSelection={restProps.rowSelection} rowKey={record => record[restProps.rowKey]}
           loading={loading} locale={{emptyText: <NoRecord desc={restProps.emptyText} height={150}/>}}/>
  )
}

export default RequestInfoList;
