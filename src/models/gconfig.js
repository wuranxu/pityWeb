import {
  deleteDbConfig,
  deleteFile,
  deleteGConfig,
  deleteRedisConfig,
  insertDbConfig,
  insertGConfig,
  insertRedisConfig,
  listDbConfig,
  listEnvironment,
  listFile,
  listGConfig,
  listRedisConfig,
  onlineRedisCommand,
  onTestDbConfig,
  updateDbConfig,
  updateGConfig,
  updateRedisConfig,
  uploadFile
} from '@/services/configure';
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
    options: [],
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

    ossFileList: [],
    searchOssFileList: [],

    dbConfigData: [],
    redisConfig: [],
    // 数据库配置modal
    databaseModal: false,
    databaseRecord: {sql_type: 0},

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
    // 获取数据库配置
    * fetchDbConfig({payload}, {call, put}) {
      const res = yield call(listDbConfig, payload);
      if (auth.response(res)) {
        yield put({
          type: 'save',
          payload: {
            dbConfigData: res.data,
          },
        });
      }
    },

    // 新增数据库配置
    * insertDbConfig({payload}, {call, put}) {
      const res = yield call(insertDbConfig, payload);
      if (auth.response(res, true)) {
        yield put({
          type: 'save',
          payload: {
            databaseModal: false,
          },
        });
        return true;
      }
      return false;
    },

    * onTestDbConfig({payload}, {call, put}) {
      const res = yield call(onTestDbConfig, payload);
      auth.response(res, true);
    },

    * updateDbConfig({payload}, {call, put}) {
      const res = yield call(updateDbConfig, payload);
      if (auth.response(res, true)) {
        yield put({
          type: 'save',
          payload: {
            databaseModal: false,
          },
        });
        return true;
      }
      return false;
    },

    * deleteDbConfig({payload}, {call, put}) {
      const res = yield call(deleteDbConfig, payload);
      return auth.response(res, true);
    },


    // 获取gconfig列表
    * fetchGConfig({payload}, {call, put, select}) {
      const state = yield select(state => state.gconfig);
      const res = yield call(listGConfig, payload);
      if (auth.response(res)) {
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
      }

    },

    * fetchAllGConfig({payload}, {call, put}) {
      const res = yield call(listGConfig, {page: 1, size: 1000});
      if (!auth.response(res)) {
        message.error(res.msg);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          options: res.data.map(v => (
            {label: v, value: `$\{${v.key}\}`, key: v.id}
          ))
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

    * fetchRedisConfig({payload}, {call, put}) {
      const res = yield call(listRedisConfig, payload);
      if (!auth.response(res)) {
        message.error(res.msg);
        return;
      }
      yield put({
        type: 'save',
        payload: {
          redisConfig: res.data,
        },
      });
    },

    * insertRedisConfig({payload}, {call, put}) {
      const res = yield call(insertRedisConfig, payload);
      return auth.response(res, true);
    },

    * updateRedisConfig({payload}, {call, put}) {
      const res = yield call(updateRedisConfig, payload);
      return auth.response(res, true);
    },

    * deleteRedisConfig({payload}, {call, put}) {
      const res = yield call(deleteRedisConfig, payload);
      return auth.response(res, true);

    },

    * onlineRedisCommand({payload}, {call, put}) {
      const res = yield call(onlineRedisCommand, payload);
      if (auth.response(res)) {
        return res.data;
      }
      return res.msg;
    },

    * uploadFile({payload}, {call}) {
      const res = yield call(uploadFile, payload);
      return auth.response(res, true);
    },

    * removeOssFile({payload}, {call, put}) {
      const res = yield call(deleteFile, payload);
      if (auth.response(res, true)) {
        yield put({
          type: 'listOssFile',
        })
      }
    },

    * listOssFile({_}, {call, put}) {
      const res = yield call(listFile);
      if (auth.response(res)) {
        yield put({
          type: 'save',
          payload: {
            ossFileList: res.data,
            searchOssFileList: res.data,
          }
        })
      }
    }
  },
};
