import {Col, Dropdown, Input, Row, Tree} from 'antd';
import React, {useState} from "react";
import './SearchTree.less';
import {FolderTwoTone, MoreOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import {FolderCode} from "@icon-park/react";

const dataList = [];

export default ({treeData: gData, blockNode = true, onAddNode, menu, selectedKeys, onSelect, addDirectory}) => {
  const generateList = data => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const {key, title} = node;
      dataList.push({key, title});
      if (node.children) {
        generateList(node.children);
      }
    }
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

  generateList(gData);

  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [nodeKey, setNodeKey] = useState(null);

  const onExpand = expandedKeys => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = e => {
    const {value} = e.target;
    const expandedKeys = dataList.map(item => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, gData);
      }
      return null;
    })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(expandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const loop = data =>
    data.map(item => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
              {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
            </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return {title, key: item.key, children: loop(item.children)};
      }

      return {
        title,
        key: item.key,
      };
    });
  return (
    <div>
      <Row gutter={8}>
        <Col span={18}>
          <Input size="small" className="treeSearch" placeholder="输入要查找的目录" onChange={onChange}
                 prefix={<SearchOutlined/>}/>
        </Col>
        <Col span={6}>
          {addDirectory}
        </Col>
      </Row>
      <Tree
        onExpand={onExpand}
        defaultExpandAll
        blockNode={blockNode}
        selectedKeys={selectedKeys}
        onSelect={onSelect}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={loop(gData)}
        titleRender={(node) => {
          return (
            <div onMouseOver={() => setNodeKey(node.key)} onMouseLeave={() => setNodeKey(null)}>
              {/*<FolderTwoTone className="folder" twoToneColor="rgb(255, 173, 210)"/>*/}
              <FolderCode theme="outline" size="15" className="folder"/>
              {node.title}
              {
                nodeKey === node.key ? <span className="suffixButton">
                <PlusOutlined onClick={event => {
                  event.stopPropagation();
                  onAddNode(node)
                }} className="icon-left"/>
                    <Dropdown overlay={menu(node)} trigger="click">
                      <MoreOutlined className="icon-right" onClick={e => {
                        e.stopPropagation()
                      }}/>
                    </Dropdown>
              </span> : null
              }
            </div>
          )
        }}
      />
    </div>
  );

}

