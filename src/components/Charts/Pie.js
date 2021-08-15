import React from 'react';
import {Axis, Chart, Coordinate, getTheme, Interaction, Interval, Tooltip} from 'bizcharts';

export default ({data, height, name}) => {
  const cols = {
    percent: {
      formatter: val => {
        val = val * 100 + '%';
        return val;
      },
    },
  };

  return (
    <Chart height={height} data={data} scale={cols} autoFit>
      <Coordinate type="theta" radius={0.75}/>
      <Tooltip showTitle={false}/>
      <Axis visible={false}/>
      <Interval
        position="percent"
        adjust="stack"
        color={[name, ["#67C23A", "#F56C6C", "#E6A23C", "#409EFF"]]}
        style={{
          lineWidth: 1,
          stroke: '#fff',
        }}
        label={['count', {
          content: (data) => {
            return `${data[name]}: ${data.percent * 100}%(${data.count})`;
          },
        }]}
        state={{
          selected: {
            style: (t) => {
              const res = getTheme().geometries.interval.rect.selected.style(t);
              return {...res, fill: 'red'}
            }
          }
        }}
      />
      <Interaction type='element-single-selected'/>
    </Chart>
  );
}
