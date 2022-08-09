import React from 'react';
import {Area} from '@ant-design/plots';

export default ({data, xField, yField, height=260}) => {

  const config = {
    data,
    xField: xField,
    yField: yField,
    height,
    xAxis: {
      range: [0, 1],
    },
  };

  return <Area {...config} />;
};
