import React from 'react';
import {Card,} from 'antd';
import {connect} from 'umi';
import PostmanBody from "@/components/Postman/PostmanBody";

const PostmanForm = (props) => {
  return (
    <Card bordered={props.bordered}>
      <PostmanBody {...props}/>
    </Card>
  );
};

export default connect(({gconfig}) => ({gconfig}))(PostmanForm);
