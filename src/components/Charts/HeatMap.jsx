import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import ReactTooltip from 'react-tooltip';


import React from 'react';


export default ({values, startDate, endDate}) => {
  return (
    <>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={values}
        showWeekdayLabels={true}
        tooltipDataAttrs={value => {
          return value.date === null ? null : {
            'data-tip': `${value.date} 操作记录: ${
              value.count
            }`,
          };
        }}
      />
      <ReactTooltip/>
    </>
  )
}
