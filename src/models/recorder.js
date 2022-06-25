import {generateCase, importFile, queryRecordStatus, removeRecord, startRecord, stopRecord} from "@/services/testcase";
import auth from "@/utils/auth";

export default {
  namespace: "recorder",
  state: {
    // 录制用例数据
    recordStatus: false,
    recordLists: [],
    regex: ''
  },
  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
    readRecord(state, {payload}) {
      return {
        ...state,
        recordLists: [...state.recordLists, {
          ...payload.data,
          index: state.recordLists.length,
          cookies: JSON.stringify(payload.data.cookies, null, 2),
          response_headers: JSON.stringify(payload.data.response_headers, null, 2),
          request_headers: JSON.stringify(payload.data.request_headers, null, 2),
        }]
      }
    }
  },
  effects: {

    * queryRecordStatus({payload}, {call, put}) {
      const res = yield call(queryRecordStatus, payload);
      if (auth.response(res)) {
        yield put({
          type: 'save',
          payload: {
            recordStatus: res.data.status,
            recordLists: res.data.data.map((v, idx) => ({
              ...v,
              index: idx,
              cookies: JSON.stringify(v.cookies, null, 2),
              request_cookies: JSON.stringify(v.request_cookies, null, 2),
              response_headers: JSON.stringify(v.response_headers, null, 2),
              request_headers: JSON.stringify(v.request_headers, null, 2),
            })),
            regex: res.data.regex,
          }
        })
      }
    },

    * startRecord({payload}, {call, put}) {
      yield put({
        type: 'save',
        payload: {
          recordLists: [],
        }
      })
      const res = yield call(startRecord, payload);
      if (auth.response(res, true)) {
        yield put({
          type: 'save',
          payload: {
            recordStatus: true,
            recordLists: [],
          }
        })
      }
    },

    * stopRecord({payload}, {call, put}) {
      const res = yield call(stopRecord, payload);
      if (auth.response(res, true)) {
        yield put({
          type: 'save',
          payload: {
            recordStatus: false,
          }
        })
      }
    },

    * generateCase({payload}, {call, put}) {
      const res = yield call(generateCase, payload);
      if (auth.response(res)) {
        return res
      }
      return false
    },

    * import({payload}, {call, put}) {
      const res = yield call(importFile, payload)
      if (auth.response(res)) {
        return res.data.map((v, index) => ({
          ...v,
          index,
          request_headers: JSON.stringify(v.request_headers, null, 2),
          response_headers: JSON.stringify(v.response_headers, null, 2),
          cookies: JSON.stringify(v.cookies, null, 2),
          request_cookies: JSON.stringify(v.request_cookies, null, 2),
        }));
      }
      return [];
    },

    * remove({payload}, {call, put, select}) {
      const recorder = yield select(state => state.recorder)
      const res = yield call(removeRecord, payload)
      if (auth.response(res, true)) {
        const data = recorder.recordLists.filter((v, idx) => idx !== payload).map((item, k) => ({
          ...item, index: k,
        }))
        yield put({
          type: "save",
          payload: {
            recordLists: data
          }
        })
      }
    }
  }
}
