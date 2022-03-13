// import React from 'react';


import React from 'react';
import {Pie} from '@ant-design/plots';

export default ({data, height, name, value = 'count'}) => {
  const config = {
    appendPadding: 16,
    data,
    theme: {
      colors10: ["rgb(63, 205, 127)", "rgb(230, 98, 97)", "rgb(250, 207, 76)", "rgb(86, 97, 235)"]
    },
    angleField: value,
    colorField: name,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({percent}) => `${(percent * 100).toFixed(0)}%`,
      style: {
        // textAlign: 'center',
        fontSize: 14,
      },
    },
    tooltip: {
      title: (title) => `${(title * 100).toFixed(0)}%`
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    height,
    autoFit: true,
  };
  return <Pie {...config} />;
};

