import {stringify} from 'querystring';
import {history} from 'umi';
import {checkUrl, generateResetLink, login, register, resetPwd} from '@/services/login';
import {setAuthority} from '@/utils/authority';
import {getPageQuery} from '@/utils/utils';
import {message, notification} from 'antd';
import {CONFIG} from '@/consts/config';
import auth from "@/utils/auth";

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    currentEmail: '',
  },
  effects: {
    * register({payload}, {call, _}) {
      const response = yield call(register, {
        username: payload.username,
        password: payload.password,
        name: payload.name,
        email: payload.email,
      });
      if (response.code !== 0) {
        message.error(response.msg);
        return;
      }
      payload.setType('account');
      message.success(response.msg);

    },

    * login({payload}, {call, put}) {
      // const response = yield call(fakeAccountLogin, payload);
      const response = yield call(login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.code === 0) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success('🎉 🎉 🎉  登录成功！');
        let {redirect} = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        if (history !== undefined) {
          history.replace(redirect || '/');
        } else {
          window.location.href = '/';
        }
      } else {
        message.error(response.msg || '网络开小差了，请稍后重试');
      }
    },

    logout() {
      const {redirect} = getPageQuery(); // Note: There may be security issues, please note
      if (window.location.pathname !== '/#/user/login' && !redirect) {
        localStorage.removeItem("pityToken");
        localStorage.removeItem("pityUser");
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },

    * resetPwd({payload}, {call, put}) {
      const res = yield call(generateResetLink, payload);
      if (auth.response(res)) {
        notification.success({
          message: `正在发送重置密码邮件`,
          description: `我们正在为${payload}发送重置密码邮件, 如果您已注册过pity，请注意查收邮件。`
        })
      }
    },

    * doResetPassword({payload}, {call, put}) {
      const res = yield call(resetPwd, payload);
      return auth.response(res)
    },

    * checkResetUrl({payload}, {call, put}) {
      const res = yield call(checkUrl, payload);
      if (!auth.notificationResponse(res)) {
        return
      }
      yield put({
        type: 'save',
        payload: {
          currentEmail: res.data
        }
      })
    }
  },
  reducers: {
    changeLoginStatus(state, {payload}) {
      // 写入用户信息
      localStorage.setItem('pityToken', payload.data.token);
      localStorage.setItem('pityUser', JSON.stringify({
        email: payload.data.email,
        name: payload.data.name,
        id: payload.data.id,
        role: payload.data.role,
        avatar: payload.data.avatar,
      }));
      localStorage.setItem('pityExpire', payload.data.expire)
      // setAuthority(payload.currentAuthority);
      setAuthority(CONFIG.ROLE[payload.data.role]);
      return {...state, status: payload.code === 0 ? 'ok' : 'error', type: 'account'};
    },
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    }
  },
};
export default Model;
