import {fetchDatabaseSource, fetchTables, listHistory, onlineExecuteSQL} from "@/services/online";
import auth from "@/utils/auth";
import React from 'react';

export default {
  namespace: 'online',
  state: {
    databaseSource: [],
    table_map: {},
    tables: [],
    currentDatabase: null,
    currentDatabaseTitle: '',
    currentDatabaseSqlType: 0,
    testResults: [],
    sqlColumns: [],

    historyPage: {
      current: 1,
      pageSize: 4,
      showTotal: total => `共${total}条历史数据`,
      total: 0,
    },
    historyData: []

  },
  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    }
  },

  effects: {
    * fetchDatabaseSource({payload}, {call, put}) {
      const res = yield call(fetchDatabaseSource);
      if (auth.response(res)) {
        yield put({
          type: 'save',
          payload: {
            databaseSource: res.data,
          }
        })
        return res.data;
      }
    },

    * fetchTables({payload}, {call, put, select}) {
      const res = yield call(fetchTables, payload);
      if (auth.response(res)) {
        const online = yield select(state => state.online)
        yield put({
          type: 'save',
          payload: {
            table_map: {
              ...online.table_map,
              [payload.id]: res.data.tables,
            },
            tables: res.data.tables,
            currentDatabase: payload.id,
          }
        })
        return res.data.children
      }

    },

    * onlineExecuteSQL({payload}, {call, put, select}) {
      const res = yield call(onlineExecuteSQL, payload);
      if (auth.response(res, true)) {
        yield put({
          type: 'save',
          payload: {
            sqlColumns: res.data.columns,
            testResults: res.data.result,
          }
        })
        const online = yield select(state => state.online)
        yield put({
          type: 'fetchHistorySQL',
          payload: {
            page: online.historyPage.current,
            size: online.historyPage.pageSize,
          }
        })
      }
    },

    * fetchHistorySQL({payload}, {call, put, select}) {
      const res = yield call(listHistory, payload);
      if (auth.response(res)) {
        const online = yield select(state => state.online)
        yield put({
          type: 'save',
          payload: {
            historyData: res.data.data,
            historyPage: {
              ...online.historyPage,
              total: res.data.total,
            }
          }
        })
      }
    }
  }
}
