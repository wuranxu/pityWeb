import {getGithubUser, loginGithub, query as queryUsers} from '@/services/user';
import {history} from 'umi';
import {getPageQuery} from "@/utils/utils";
import {message} from "antd";

const client_id = `c46c7ae33442d13498cd`;
const key = `c79fafe58ff45f6b5b51ddde70d2d645209e38b9`;

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    * fetch(_, {call, put}) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    * getGithubToken({payload}, {call, put}) {
      const response = yield call(loginGithub, payload);
      if (response.code === 0) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success('🎉 🎉 🎉  登录成功！');
        yield put({
          type: 'login/changeLoginStatus',
          payload: response,
        }); // Login successfully
        yield put({
          type: 'fetchCurrent',
        })
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

        history.replace(redirect || '/');
      } else {
        message.error(response.msg);
      }

    },

    * fetchCurrent(_, {call, put}) {
      // const response = yield call(queryCurrent);
      const token = localStorage.getItem("pityToken")
      const userInfo = localStorage.getItem("pityUser")
      if (!token || !userInfo) {
        window.location.href = "/"
        return;
      }
      const info = JSON.parse(userInfo)
      yield put({
        type: 'saveCurrentUser',
        payload: info,
      });
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return {...state, currentUser: action.payload || {}};
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
