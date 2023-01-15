import React from 'react';
import {UploadOutlined} from '@ant-design/icons';
import {Button, Form, Upload} from 'antd';
import ProForm, {ProFormText,} from '@ant-design/pro-form';
import {connect} from '@umijs/max';
import styles from './BaseView.less';
import CONFIG from "@/consts/config";

const validatorPhone = (rule, value, callback) => {
  callback();
}; // 头像组件 方便以后独立，增加裁剪之类的功能

const AvatarView = ({avatar, dispatch}) => (
  <>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar"/>
    </div>
    <Upload showUploadList={false} customRequest={fileData => {
      dispatch({
        type: 'user/avatar',
        payload: {
          file: fileData.file,
        }
      })
    }} fileList={[]}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined/>
          更换头像
        </Button>
      </div>
    </Upload>
  </>
);

const BaseView = ({user, loading, dispatch}) => {
  const {currentUser} = user;
  const [form] = Form.useForm();

  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }
      return CONFIG.AVATAR_URL;
    }

    return '';
  };

  const handleFinish = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'user/updateUser',
      payload: {
        ...values,
        id: currentUser.id,
      },
    })
    dispatch({
      type: 'user/fetchCurrent'
    })
  };

  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
                submitButtonProps: {
                  children: '更新基本信息',
                },
              }}
              initialValues={{...currentUser, phone: currentUser?.phone}}
              hideRequiredMark
            >
              <ProFormText
                width="md"
                name="name"
                label="姓名"
                rules={[
                  {
                    required: true,
                    message: '请输入您的姓名!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="email"
                label="邮箱"
                rules={[
                  {
                    required: true,
                    message: '请输入您的邮箱!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="phone"
                label="联系电话"
                placeholder="输入电话后可接收钉钉/企业微信通知哦"
                rules={[
                  {
                    required: false,
                    message: '请输入您的联系电话!',
                  },
                  {
                    validator: validatorPhone,
                  },
                ]}
              />
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()} dispatch={dispatch}/>
          </div>
        </>
      )}
    </div>
  );
};

export default connect(({user}) => ({user}))(BaseView);
