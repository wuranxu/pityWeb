import {Button, Result} from 'antd';
import React from 'react';
import {history} from 'umi';

const Building = () => (
  <Result
    status="403"
    title="努力建设中..."
    subTitle="请再给我一点点时间..."
    extra={
      <Button type="primary" onClick={() => history.push('/#/index')}>
        返回首页
      </Button>
    }
  />
);

export default Building;
