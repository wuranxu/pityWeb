import React, {useEffect, useState} from "react";
import {PageContainer} from '@ant-design/pro-layout';
import {Card, Col, List, Menu, Modal, Row} from "antd";
import {connect} from 'umi';
import UserLink from "@/components/Button/UserLink";
import TooltipIcon from "@/components/Icon/TooltipIcon";
import {CloseOutlined, EyeTwoTone} from "@ant-design/icons";

const Notification = ({global, loading, user, dispatch}) => {

  const [current, setCurrent] = useState("0");
  const [activeTab, setActiveTab] = useState("1");
  const {userMap} = user;

  const tabListNoTitle = [
    {
      key: "1",
      tab: '未读消息',
    },
    {
      key: "2",
      tab: '已读消息',
    }
  ];

  const handleClick = e => {
    setCurrent(e.key);
  };

  const {notices} = global;

  useEffect(async () => {
    await dispatch({
      type: 'global/fetchNotices',
      payload: {
        msg_status: activeTab,
        msg_type: current,
      }
    });

    if (activeTab === '1') {
      await dispatch({
        type: 'global/readNotices',
      })
      await dispatch({
        type: 'global/save',
        payload: {
          noticeCount: 0,
        }
      })
    }
  }, [activeTab, current])

  const onDelete = async id => {
    await dispatch({
      type: 'global/deleteNotice',
      payload: {
        idList: [id]
      }
    })

    await dispatch({
      type: 'global/fetchNotices',
      payload: {
        msg_status: activeTab,
        msg_type: current,
      }
    });
  }

  return (
    <PageContainer breadcrumb={null} title="消息中心">
      <Row gutter={18}>
        <Col span={1}/>
        <Col span={5}>
          <div style={{minHeight: 480, background: '#fff'}}>
            <Menu
              theme="light"
              mode="inline"
              onClick={handleClick}
              defaultOpenKeys={[current]}
              selectedKeys={[current]}
            >
              <Menu.Item key="0">全部消息</Menu.Item>
              <Menu.Item key="1">系统通知</Menu.Item>
              <Menu.Item key="2">用户消息</Menu.Item>
            </Menu>
          </div>
        </Col>
        <Col span={16}>
          <Card
            style={{width: '100%'}}
            bodyStyle={{minHeight: 500}}
            tabList={tabListNoTitle}
            activeTabKey={activeTab}
            onTabChange={key => {
              setActiveTab(key);
            }}
          >
            <List
              itemLayout="horizontal"
              dataSource={notices}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<UserLink user={userMap[item.sender]}/>}
                    title={<a href={item.link}>{item.msg_title}</a>}
                    description={item.created_at}
                  />
                  <div style={{marginRight: 12}}>
                    {/*<TooltipIcon title="点击已读" font={16} icon={<CheckOutlined style={{color: '#22ff22'}}/>}/>*/}
                    {
                      item.msg_content ?
                        <TooltipIcon title="查看更多" style={{marginLeft: 8}} font={16} icon={<EyeTwoTone/>}
                                     onClick={() => {
                                       if (item.msg_content) {
                                         return Modal.info({
                                           content: item.msg_content,
                                           title: item.msg_title,
                                         })
                                       }
                                     }}/> : null
                    }
                    {
                      item.msg_type !== 1 ? <TooltipIcon title="删除该消息" style={{marginLeft: 8}} font={16}
                                                         onClick={async () => {
                                                           await onDelete(item.id)
                                                         }}
                                                         icon={<CloseOutlined style={{color: '#ff3b3b'}}/>}/> : null
                    }
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

      </Row>

    </PageContainer>
  )
}

export default connect(({global, user, loading}) => ({global, user, loading}))(Notification);
