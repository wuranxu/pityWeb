import {PageContainer} from "@ant-design/pro-layout";
import {Button, Card, Col, Divider, Form, Input, Modal, Row, Table, Upload} from "antd";
import {InboxOutlined, PlusOutlined} from "@ant-design/icons";
import {CONFIG} from "@/consts/config";
import {useEffect, useState} from "react";
import {connect} from 'umi';
import UserLink from "@/components/Button/UserLink";

const Oss = ({loading, dispatch, gconfig, user}) => {

  const [form] = Form.useForm();
  const {ossFileList, searchOssFileList} = gconfig;
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState('');
  const {userMap} = user;

  const fetchUserLists = () => {
    dispatch({
      type: 'user/fetchUserList'
    })
  }

  const onDeleteFile = record => {
    dispatch({
      type: 'gconfig/removeOssFile',
      payload: {
        filepath: record.file_path
      }
    })
  }

  const listFile = () => {
    dispatch({
      type: 'gconfig/listOssFile',
    })
  }

  const columns = [
    {
      title: '文件路径',
      key: 'file_path',
      dataIndex: 'file_path',
      render: (file_path, record) => <a href={`${CONFIG.OSS_URL}/${file_path}`}
                                        target="_blank">{file_path}</a>
    },
    {
      title: '大小',
      key: 'file_size',
      dataIndex: 'file_size',
      // render: size => size === 0 ? '不提供此功能' : `${Math.round(size / 1024)}kb`
    },
    {
      title: '创建人',
      key: 'create_user',
      dataIndex: 'create_user',
      render: createUser => <UserLink user={userMap[createUser]}/>
      // render: lastModified => lastModified === null ? '不提供此功能' : moment(lastModified * 1000).subtract(moment().utcOffset() / 60 - 8, 'hours').format('YYYY-MM-DD HH:mm:ss')

    },
    {
      title: '更新时间',
      key: 'updated_at',
      dataIndex: 'updated_at',
      // render: lastModified => lastModified === null ? '不提供此功能' : moment(lastModified * 1000).subtract(moment().utcOffset() / 60 - 8, 'hours').format('YYYY-MM-DD HH:mm:ss')

    },
    {
      title: '操作',
      key: 'ops',
      render: (record) => <>
        <a onClick={() => {
          window.open(`${CONFIG.OSS_URL}/${file_path}`)
        }}>下载</a>
        <Divider type="vertical"/>
        <a onClick={() => {
          onDeleteFile(record);
        }}>删除</a>
      </>
    },
  ]
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const onUpload = async () => {
    const values = await form.validateFields();
    const res = dispatch({
      type: 'gconfig/uploadFile',
      payload: values,
    })
    if (res) {
      setVisible(false)
      setValue('')
      listFile();
    }
  }

  useEffect(() => {
    if (value === '') {
      dispatch({
        type: 'gconfig/save',
        payload: {searchOssFileList: ossFileList}
      })
    } else {
      dispatch({
        type: 'gconfig/save',
        payload: {searchOssFileList: ossFileList.filter(v => v.file_path.toLowerCase().indexOf(value.toLowerCase()) > -1)}
      })
    }
  }, [value])


  useEffect(() => {
    listFile();
    fetchUserLists();
  }, [])


  return (
    <PageContainer title="OSS文件管理" breadcrumb={null}>
      <Card>
        <Modal width={600} title="上传文件" visible={visible} onCancel={() => setVisible(false)} onOk={onUpload}>
          <Form form={form} {...CONFIG.SQL_LAYOUT}>
            <Form.Item label="文件路径" name="filepath"
                       rules={[{required: true, message: '请输入文件要存储的路径, 目录用/隔开'}]}>
              <Input placeholder="请输入文件要存储的路径, 目录用/隔开"/>
            </Form.Item>
            <Form.Item label="文件" required>
              <Form.Item name="files" valuePropName="fileList" getValueFromEvent={normFile} noStyle
                         rules={[{required: true, message: '请至少上传一个文件'}]}>
                <Upload.Dragger name="files" maxCount={1} beforeUpload={() => false}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined/>
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件到此区域上传🎉</p>
                </Upload.Dragger>
              </Form.Item>
            </Form.Item>
          </Form>
        </Modal>
        <Row gutter={[8, 8]} style={{marginBottom: 12}}>
          <Col span={6}>
            <Button type="primary" onClick={() => setVisible(true)}><PlusOutlined/>添加文件</Button>
          </Col>
          <Col span={12}/>
          <Col span={6}>
            <Input placeholder="输入要查找的文件名" value={value} onChange={e => {
              setValue(e.target.value);
            }}/>
          </Col>
        </Row>
        <Table rowKey={record => record.key} dataSource={searchOssFileList} columns={columns}
               loading={loading.effects['gconfig/listOssFile']}/>
      </Card>
    </PageContainer>
  )
}

export default connect(({loading, gconfig, user}) => ({loading, gconfig, user}))(Oss);
