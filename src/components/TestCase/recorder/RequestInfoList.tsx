import React from "react";
import type {ColumnsType} from "antd/lib/table/Table";
import {Modal, Table, Tag, Tooltip} from "antd";
import SyntaxHighlighter from "react-syntax-highlighter";
import {vs2015} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import {TableRowSelection} from "antd/lib/table/interface";
import NoRecord from "@/components/NotFound/NoRecord";
import RequestInfo from "../../../types/RequestInfo";


// interface RequestProps {
//   index: number;
//   url: string;
//   request_method: string;
//   status_code: number | string;
//   response_headers: string;
//   request_headers: string;
//   body: string;
// }


interface RequestInfoProps {
  dataSource: Array<RequestInfo>;
  rowKey?: string;
  rowSelection: TableRowSelection<any>;
  loading?: boolean;
  emptyText?: string | '暂无数据';
}

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

const RequestInfoList: React.FC<RequestInfoProps> = ({dataSource, loading, ...restProps}) => {
  const columns: ColumnsType<RequestInfo> = [
    {
      title: '编号',
      key: 'index',
      render: (text, record, index) => `${index + 1}`
    },
    {
      title: '请求地址',
      key: 'url',
      dataIndex: 'url',
      width: '20%',
      render: url => <Tooltip title={url}><a href={url}>{url.slice(0, 48)}</a> </Tooltip>
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
  ]


  return (
    <Table columns={columns} pagination={false} dataSource={dataSource}
           rowSelection={restProps.rowSelection} rowKey={record => record[restProps.rowKey]}
           loading={loading} locale={{emptyText: <NoRecord desc={restProps.emptyText} height={150}/>}}/>
  )
}

export default RequestInfoList;
