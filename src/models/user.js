import {listUsers, loginGithub, query as queryUsers} from '@/services/user';
import {history} from 'umi';
import {getPageQuery} from "@/utils/utils";
import {message} from "antd";
import {stringify} from "querystring";

// const client_id = `c46c7ae33442d13498cd`;
// const key = `c79fafe58ff45f6b5b51ddde70d2d645209e38b9`;

const getUserMap = data => {
  const temp = {}
  const userNameMap = {}
  data.forEach(item => {
    temp[item.id] = item
    userNameMap[item.id] = item.name
  })
  return {userMap: temp, userNameMap};
}

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    userList: [],
    userMap: {},
    userNameMap: {},
  },
  effects: {
    * fetch(_, {call, put}) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    * fetchUserList(_, {call, put}) {
      const response = yield call(listUsers);
      const {userMap, userNameMap} = getUserMap(response);
      yield put({
        type: 'save',
        payload: {
          userList: response,
          userMap,
          userNameMap
        },
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
        // history.push("/user/login");
        // history.replace({
        //   pathname: '/user/login',
        // });
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
    save(state, {payload}) {
      return {...state, ...payload}
    },

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
