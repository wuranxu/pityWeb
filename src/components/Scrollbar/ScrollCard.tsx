import {Card} from 'antd';
// @ts-ignore
import {Scrollbars} from 'react-custom-scrollbars';
import React, {memo, PropsWithChildren} from 'react';

type Props = {
  children?: React.ReactNode
};

interface ScrollCardProps {
  bodyPadding?: number | 24;
  hideOverflowX?: boolean;
}

const ScrollCard: React.FC<PropsWithChildren<ScrollCardProps>> = (props: ScrollCardProps & Props) => {
  return <Card {...props} bodyStyle={{height: '100%', overflowX: 'hidden'}}>
    {
      props.hideOverflowX ?
        <Scrollbars autoHide
                    autoHideTimeout={1000}
                    renderTrackHorizontal={(props: any) => <div {...props}
                                                         style={{display: props.hideOverflowX ? 'hidden' : 'block'}}
                                                         className="track-horizontal"/>}
                    autoHideDuration={200} style={{
          width: '100%', height: 'inherit',
        }}>
          {props.children}
        </Scrollbars> :
        <Scrollbars autoHide={true}
                    autoHideTimeout={1000}
                    autoHideDuration={200} style={{
          width: '100%', height: 'inherit',
        }}>
          {props.children}
        </Scrollbars>
    }
  </Card>
}

export default memo(ScrollCard);
