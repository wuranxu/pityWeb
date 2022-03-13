import {Card} from 'antd';
import {Scrollbars} from 'react-custom-scrollbars';
import React, {memo} from 'react';

const ScrollCard = (props) => {
  return <Card {...props} bodyStyle={{padding: props.bodyPadding || 24, height: '100%', overflowX: 'hidden'}}>
    {
      props.hideOverflowX ?
        <Scrollbars autoHide
                    autoHideTimeout={1000}
                    renderTrackHorizontal={props => <div {...props}
                                                         style={{display: props.hideOverflowX ? 'hidden' : 'block'}}
                                                         className="track-horizontal"/>}
                    autoHideDuration={200} style={{
          width: '100%', height: 'inherit',
        }}>
          {props.children}
        </Scrollbars> :
        <Scrollbars autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200} style={{
          width: '100%', height: 'inherit',
        }}>
          {props.children}
        </Scrollbars>
    }
  </Card>
}

export default memo(ScrollCard)
