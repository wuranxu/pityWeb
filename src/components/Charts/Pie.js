// import React from 'react';


import React from 'react';
import {Pie} from '@ant-design/plots';

export default ({data, height, name, value = 'count'}) => {
  const config = {
    appendPadding: 10,
    data,
    theme: {
      colors10: ["#67C23A", "#F56C6C", "#E6A23C", "#409EFF"]
    },
    angleField: value,
    colorField: name,
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: ({percent}) => `${(percent * 100).toFixed(0)}%`,
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    tooltip: {
      title: (title) => `${(title * 100).toFixed(0)}%`
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: 14,
        },
        content: '执行统计',

      },
    },
    height,
    autoFit: true,
  };
  return <Pie {...config} />;
};

