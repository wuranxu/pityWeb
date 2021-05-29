import React, { useEffect, useState } from 'react';
import { Input, Select, Row, Col, Spin, Tooltip, Tree, Empty} from 'antd';

const { TreeNode } = Tree;
const { Option } = Select;

export default (props) => {

  const [expandedKeys, setExpandedKeys] = useState(props.expandedKeys);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [currentKey, setCurrentKey] = useState(null);

  let dataList = [];

  const onExpand = expandedKeys => {
    setAutoExpandParent(false);
    if (props.onExpand) {
      props.onExpand(expandedKeys);
      return;
    }
    setExpandedKeys(expandedKeys);
  };

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const parseTitle = (key, title, suffix) => {
    const index = title.toLowerCase()
      .indexOf(props.searchValue.toLowerCase());
    const beforeStr = title.substr(0, index);
    const afterStr = title.substr(index + props.searchValue.length);
    return props.searchValue !== '' && index > -1 ? (
      <span>
          {<span>{beforeStr}</span>}
        <span style={{ color: '#f50' }}>{title.substr(index, props.searchValue.length)}</span>
        {afterStr} {key === currentKey ? suffix : null}
        </span>
    ) : <span onMouseLeave={() => setCurrentKey(null)}
              onMouseEnter={() => setCurrentKey(key)}>
      <Tooltip title={title}>{title.length > 16 ? `${title.slice(0, 16)  }...` : title}
      {key === currentKey ? suffix : null} {props.parseStatus(key)}</Tooltip></span>;
  };

  const parseDirectory = (key, title, requestType) => {
    const index = title.toLowerCase()
      .indexOf(props.searchValue.toLowerCase());
    const beforeStr = title.substr(0, index);
    const afterStr = title.substr(index + props.searchValue.length);
    return props.searchValue !== '' && index > -1 ? (
      <span>
          {<span>{beforeStr}</span>}
        <span style={{ color: '#f50' }}>{title.substr(index, props.searchValue.length)}</span>
        {afterStr}
        </span>
    ) : <span><Tooltip title={title}>{requestType !== undefined ? requestType === 0 ?
      <a style={{ color: '#DEB946' }}>RPC</a>
      : <a style={{ color: '#f540c9' }}>MSG</a> : null
    } {title.length > 16 ? `${title.slice(0, 16)  }...` : title}</Tooltip></span>;
  };

  const onChange = e => {
    if (props.onChange) {
      props.onChange(e);
      return;
    }
    const { value } = e.target;
    dataList = [];
    generateList(props.gData);
    const expKeys = dataList.map(item => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, props.gData);
      }
      return null;
    })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    props.setSearchValue(value);
    setAutoExpandParent(true);
    if (props.onExpand) {
      props.onExpand(expandedKeys.length > 0 ? expandedKeys : []);
    } else if (expKeys.length > 0) {
        setExpandedKeys(expKeys);
      } else {
        setExpandedKeys([]);
      }
  };

  const generateList = data => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key } = node;
      dataList.push({
        key,
        title: node.title,
      });
      if (node.children) {
        generateList(node.children);
      }
    }
  };



  useEffect(() => {
    generateList(props.gData);
  }, []);

  const loop = data => data.map(item => {
    if (item.children !== undefined) {
      return (
        <TreeNode key={item.key} icon={props.iconMap(item.key)}
                  title={<span
                    onMouseLeave={() => setCurrentKey(null)}
                    onMouseEnter={() => setCurrentKey(item.key)}>
                    {parseDirectory(item.key, item.title, item.requestType)} ({item.total})
                    {item.key === currentKey ? props.suffixMap(item) : null}</span>
                  }>
          {loop(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.key} icon={props.iconMap(item.key)} onMouseEnter={() => setCurrentKey(item.key)}
                     title={parseTitle(item.key, item.title, props.suffixMap(item))} />;
  });

  return (
    <Spin spinning={props.loading ? props.loading : false}>
      <Row style={{ padding: 8, marginBottom: 4 }}>
        <Col span={22}>
          <Input placeholder='请输入用例名称' style={{ width: '100%' }} onChange={onChange} size='small'
                 enterButton={false} allowClear value={props.searchValue} />
        </Col>
        <Col span={2}>
          {props.AddButton}
        </Col>
      </Row>
      {
        props.gData.length > 0 ? <Tree
          // selectable={props.selectable}
          size="large"
          blockNode
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          checkable={props.checkable}
          // onCheck={props.onCheck}
          onSelect={props.onSelect}
          // checkedKeys={props.checkedKeys}
          // defaultExpandAll
          showIcon
          defaultExpandParent
        >
          {loop(props.gData)}
        </Tree>: <Empty/>
      }
    </Spin>
  );
}
