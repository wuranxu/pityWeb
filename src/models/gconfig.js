import {deleteGConfig, insertGConfig, listEnvironment, listGConfig, updateGConfig} from '@/services/configure';
import auth from '@/utils/auth';
import {message} from 'antd';

export default {
  namespace: 'gconfig',
  state: {
    data: [],
    currentEnv: 0,
    name: '',
    envList: [],
    envMap: {},
    pagination: {
      current: 1,
      pageSize: 8,
      total: 0,
    },
    key_type: {
      0: 'string',
      1: 'json',
      2: 'yaml',
    },
  },
  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    * fetchGConfig({payload}, {call, put, select}) {
      const state = yield select(state => state.gconfig);
      const res = yield call(listGConfig, payload);
      if (!auth.response(res)) {
        message.error(res.msg);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          data: res.data,
          pagination: {
            ...state.pagination,
            current: payload.page,
            total: res.total,
          },
        },
      });
    },

    * insertConfig({payload}, {call, put, select}) {
      const state = yield select(state => state.gconfig);
      const res = yield call(insertGConfig, payload);
      if (auth.response(res, true)) {
        yield put({
          type: 'save',
          payload: {modal: false},
        });
      }
      yield put({
        type: 'fetchGConfig',
        payload: {
          page: state.pagination.current,
          size: state.pagination.pageSize,
          env: state.currentEnv,
          key: state.name,
        },
      });
    },

    * updateGConfig({payload}, {call, put, select}) {
      const res = yield call(updateGConfig, payload);
      const state = yield select(state => state.gconfig);
      if (auth.response(res, true)) {
        yield put({
          type: 'save',
          payload: {modal: false},
        });
      }
      yield put({
        type: 'fetchGConfig',
        payload: {
          page: state.pagination.current,
          size: state.pagination.pageSize,
          env: state.currentEnv,
          key: state.name,
        },
      });
    },

    * deleteGConfig({payload}, {call, put, select}) {
      const res = yield call(deleteGConfig, payload);
      const state = yield select(state => state.gconfig);
      if (auth.response(res, true)) {
        yield put({
          type: 'fetchGConfig',
          payload: {
            page: state.pagination.current,
            size: state.pagination.pageSize,
            env: state.currentEnv,
            key: state.name,
          },
        });
      }

    },

    * fetchEnvList({payload}, {call, put}) {
      const res = yield call(listEnvironment, payload);
      if (!auth.response(res)) {
        message.error(res.msg);
        return;
      }
      const envMap = {};
      res.data.forEach(v => {
        envMap[v.id] = v.name;
      });
      yield put({
        type: 'save',
        payload: {
          envList: res.data,
          envMap,
        },
      });
    },
  },
};
