import React, {useEffect} from "react";
import {AutoComplete} from "antd";
import {connect} from "umi";

const GConfigInput = ({placeholder, onChange, value, gconfig, dispatch}) => {

  const {options} = gconfig;

  useEffect(() => {
    dispatch({
      type: 'gconfig/fetchAllGConfig',
      payload: {},
    })
  })

  return (
    <AutoComplete placeholder={placeholder} onChange={onChange} value={value} options={options}/>
  )
}

export default connect(({gconfig}) => ({
  gconfig: gconfig,
}))(GConfigInput);
