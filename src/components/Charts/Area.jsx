import React from 'react';
import {Area} from '@ant-design/plots';

export default ({data, xField, yField}) => {

  const config = {
    data,
    xField: xField,
    yField: yField,
    xAxis: {
      range: [0, 1],
    },
  };

  return <Area {...config} />;
};
