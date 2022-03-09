import {fetchDatabaseSource, onlineExecuteSQL} from "@/services/online";
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
        const {database, tables} = res.data;
        yield put({
          type: 'save',
          payload: {
            databaseSource: database,
            table_map: tables,
          }
        })
        return database;
      }
    },

    * onlineExecuteSQL({payload}, {call, put}) {
      const res = yield call(onlineExecuteSQL, payload);
      if (auth.response(res, true)) {
        yield put({
          type: 'save',
          payload: {
            sqlColumns: res.data.columns,
            testResults: res.data.result,
          }
        })

      }
    }
  }
}
