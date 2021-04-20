import React, {useEffect, useState} from 'react';
import { queryTestCase } from '@/services/testcase';
import auth from '@/utils/auth';
import {Row, Col, Descriptions, Badge, Tag} from 'antd';
import { CONFIG } from '@/consts/config';

export default ({ caseId, userMap }) => {
  const [data, setData] = useState({status: 1, tag: ''});
  console.log(userMap)

  useEffect(async () => {
    if (caseId === null) {
      return;
    }
    const res = await queryTestCase({caseId: caseId});
    if (auth.response(res)) {
      setData(res.data);
    }

  }, [caseId]);

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Descriptions title="用例详情" bordered size="small">
          <Descriptions.Item label="用例名称"><a>{data.name}</a></Descriptions.Item>
          <Descriptions.Item label="用例目录">{data.catalogue}</Descriptions.Item>
          <Descriptions.Item label="用例优先级">{<Tag color={CONFIG.CASE_TAG[data.priority]}>{data.priority}</Tag>}</Descriptions.Item>
          <Descriptions.Item label="请求类型">{CONFIG.REQUEST_TYPE[data.request_type]}</Descriptions.Item>
          <Descriptions.Item label="请求方式">
            {data.request_method}
          </Descriptions.Item>
          <Descriptions.Item label="用例状态">{<Badge {...CONFIG.CASE_BADGE[data.status]}/>}</Descriptions.Item>
          <Descriptions.Item label="用例标签" span={2}>{
            <div style={{textAlign: 'center'}}>
              {data.tag.split(",").map(v => <Tag style={{marginRight: 4}} color="blue">{v}</Tag>)}
            </div>
          }</Descriptions.Item>
          <Descriptions.Item label="创建人">{userMap[data.create_user] !== undefined ? userMap[data.create_user].name: 'loading...'}</Descriptions.Item>
          <Descriptions.Item label="更新人">{userMap[data.update_user] !== undefined ? userMap[data.update_user].name: 'loading...'}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{data.created_at}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{data.updated_at}</Descriptions.Item>
          <Descriptions.Item label="请求url" span={3}>
            <a href={data.url}>{data.url}</a>
          </Descriptions.Item>
          <Descriptions.Item label="请求Headers" span={3}>
            <pre>{data.request_header}</pre>
          </Descriptions.Item>
          <Descriptions.Item label="请求body" span={3}>
            <pre>{data.body}</pre>
          </Descriptions.Item>
        </Descriptions>
      </Col>
    </Row>
  );

}
