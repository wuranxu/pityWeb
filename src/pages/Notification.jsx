import React, {useEffect, useState} from "react";
import {PageContainer} from '@ant-design/pro-components';
import {Avatar, Card, Col, List, Menu, Modal, Row} from "antd";
import {connect, useModel} from '@umijs/max';
import TooltipIcon from "@/components/Icon/TooltipIcon";
import {CloseOutlined, EyeTwoTone} from "@ant-design/icons";
import Markdown from "@/components/CodeEditor/Markdown";
import "./UserInfo.less";
import UserLink from "@/components/Button/UserLink";

const Notification = ({user, dispatch}) => {

  const [current, setCurrent] = useState("0");
  const [activeTab, setActiveTab] = useState("1");
  const [title, setTitle] = useState("");
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState("");
  const {userMap} = user;
  const {fetchNotices, setNoticeCount, deleteNotices, readNotices, notices} = useModel('notice');

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

  const getNotices = async (currentTab) => {
    const data = await fetchNotices({
      msg_status: currentTab,
      msg_type: current,
    })
    if (currentTab === '1') {
      await readNotices(data)
      setNoticeCount(0)
    }
  }

  useEffect(() => {
    getNotices(activeTab)
    if (Object.keys(userMap).length === 0) {
      dispatch({
        type: 'user/fetchUserList'
      })
    }
  }, [activeTab, current])

  const onDelete = async id => {
    await deleteNotices({idList: [id]})
    await fetchNotices({
      msg_status: activeTab,
      msg_type: current,
    })
  }

  return (
    <PageContainer breadcrumb={null} title="消息中心">
      <Modal title={title} open={visible} footer={null} onCancel={() => {
        setVisible(false)
      }}>
        <Markdown value={content}/>
      </Modal>
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
                    avatar={<UserLink user={userMap[item.sender]} size={32}/>}
                    title={<span><a href={item.link}>{item.msg_title}</a></span>}
                    description={item.created_at}
                  />
                  <div style={{marginRight: 12}}>
                    {/*<TooltipIcon title="点击已读" font={16} icon={<CheckOutlined style={{color: '#22ff22'}}/>}/>*/}
                    {
                      item.msg_content ?
                        <TooltipIcon title="查看更多" style={{marginLeft: 8}} font={16} icon={<EyeTwoTone/>}
                                     onClick={() => {
                                       if (item.msg_content) {
                                         setContent(item.msg_content)
                                         setVisible(true)
                                         setTitle(item.msg_title)
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

export default connect(({user}) => ({user}))(Notification);
