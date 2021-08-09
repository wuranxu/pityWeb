import { stringify } from 'querystring';
import { history } from 'umi';
import { login, register } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
import { CONFIG } from '@/consts/config';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    * register({ payload }, { call, _ }) {
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

    * login({ payload }, { call, put }) {
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
        let { redirect } = params;
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
        message.error(response.msg);
      }
    },

    logout() {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note

      if (window.location.pathname !== '/user/login' && !redirect) {
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
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      // 写入用户信息
      localStorage.setItem('pityToken', payload.data.token);
      localStorage.setItem('pityUser', JSON.stringify(payload.data.user));
      // setAuthority(payload.currentAuthority);
      setAuthority(CONFIG.ROLE[payload.data.user.role]);
      return { ...state, status: payload.code === 0 ? 'ok' : 'error', type: 'account' };
    },
  },
};
export default Model;
