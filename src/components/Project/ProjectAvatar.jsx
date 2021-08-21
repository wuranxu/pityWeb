import { Avatar } from 'antd';
import React from 'react';

export default ({ data }) => {
  if (data === null) {
    return null;
  }
  return <Avatar style={{ backgroundColor: '#87d068' }} size={64}>
    {data.name.slice(0, 2)}
  </Avatar>
};
