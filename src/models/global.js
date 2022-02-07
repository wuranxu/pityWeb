import {deleteNotice, queryNotices, updateNotices} from '@/services/user';
import auth from "@/utils/auth";

const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    noticeCount: 0,
  },
  effects: {
    * fetchNotices({payload}, {call, put}) {
      const data = yield call(queryNotices, payload);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
    },

    * clearNotices({payload}, {put, select}) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select((state) => state.global.notices.length);
      const unreadCount = yield select(
        (state) => state.global.notices.filter((item) => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },

    * readNotices({_}, {call, put, select}) {
      const notices = yield select((state) =>
        state.global.notices)
      const broadcast = notices.filter(item => item.msg_type === 1).map(item => item.id)
      const personal = notices.filter(item => item.msg_type === 2).map(item => item.id)
      const res = yield call(updateNotices, {
        broadcast,
        personal,
      })
      auth.response(res)
    },

    * deleteNotice({payload}, {call, put}) {
      const res = yield call(deleteNotice, payload.idList)
      auth.response(res, true)
    }
  },
  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      {payload},
    ) {
      return {...state, collapsed: payload};
    },

    saveNotices(state, {payload}) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      {payload},
    ) {
      return {
        ...state,
        collapsed: false,
        notices: state.notices.filter((item) => item.type !== payload),
      };
    },
  },
};
export default GlobalModel;
