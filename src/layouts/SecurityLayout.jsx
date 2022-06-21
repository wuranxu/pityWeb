import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect } from 'umi';
import { stringify } from 'querystring';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  async componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    if (window.location.href.indexOf("?code=") > -1) {
      // 说明是github登录
      const code = window.location.href.split("?code=")[1];
      await dispatch({
        type: 'user/getGithubToken',
        payload: {code}
      });
    } else {
      if (dispatch) {
        dispatch({
          type: 'user/fetchCurrent',
        });
      }
    }

  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props; // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    // const isLogin = currentUser && currentUser.userid;
    const isLogin = currentUser && currentUser.id;
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!isLogin && window.location.href.indexOf('/user/login') === -1) {
      return <Redirect to={`/#/user/login?${queryString}`} />;
    }

    return children;
  }
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
