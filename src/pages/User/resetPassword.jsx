import {connect, history, useLocation} from "umi";
import {useEffect, useState} from "react";
import styles from "@/pages/User/login/index.less";
import {Alert, Button, Form, Input, notification} from "antd";
import {CONFIG} from "@/consts/config";

const ResetPassword = ({dispatch, login}) => {
  const location = useLocation();
  const {currentEmail} = login;
  const [form] = Form.useForm()
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'login/checkResetUrl',
      payload: location.query?.token,
    })
  }, [])

  const onSubmit = async () => {
    const values = await form.validateFields()
    const res = await dispatch({
      type: 'login/doResetPassword',
      payload: {
        token: location.query?.token, password: values.password,
      }
    })
    if (res) {
      setDisable(true)
      notification.success({
        message: "恭喜，您的密码已经重置成功！",
        description: <span>将在3秒后进入登录界面，点击<a
          href="https://pity.fun/#/user/login">此处</a>可跳转至登录页面</span>
      })
      setTimeout(() => {
        history.push("/user/login")
      }, 3000)
    }
  }

  return (
    <div className={styles.main}>
      <Alert type="warning" message="请谨慎操作" showIcon
             description={`你正在为${currentEmail}重置密码`}
      />
      <Form {...CONFIG.LAYOUT} style={{marginTop: 12}} form={form}>
        <Form.Item label="新密码" name="password" rules={[
          {
            required: true,
            message: '请输入新密码!',
          },
        ]} hasFeedback>
          <Input type="password"/>
        </Form.Item>
        <Form.Item name="confirm"
                   label="确认密码"
                   dependencies={['password']}
                   hasFeedback
                   rules={[
                     {
                       required: true,
                       message: '请确认你的密码!',
                     },
                     ({getFieldValue}) => ({
                       validator(_, value) {
                         if (!value || getFieldValue('password') === value) {
                           return Promise.resolve();
                         }
                         return Promise.reject(new Error('二次密码不一致!'));
                       },
                     }),
                   ]}>
          <Input type="password"/>
        </Form.Item>
        <Form.Item {...{
          labelCol: {span: 0},
          wrapperCol: {span: 24},
        }}>
          <Button disabled={disable} block type="primary" onClick={onSubmit}> 确认</Button>
        </Form.Item>
      </Form>
    </div>

  )
}

export default connect(({login, loading}) => ({login, loading}))(ResetPassword);
