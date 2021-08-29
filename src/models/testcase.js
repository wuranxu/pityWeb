import auth from "@/utils/auth";
import {
  createTestCase,
  deleteTestcaseDirectory,
  insertTestcaseDirectory,
  listTestcase,
  listTestcaseTree,
  queryTestCase,
  queryTestcaseDirectory,
  updateTestCase,
  updateTestcaseDirectory
} from "@/services/testcase";
import {executeCase, executeSelectedCase} from "@/services/request";

export default {
  namespace: 'testcase',
  state: {
    directory: [],
    currentDirectory: [],
    selectedRowKeys: [],
    directoryName: '加载中...',
    testcases: [],
    testResult: {},
    editing: false,
    caseInfo: {},
    asserts: [],
    constructors: [],
    constructors_case: {},

    pagination: {
      current: 1,
      total: 0,
      showTotal: total => `共${total}条用例`,
      pageSize: 8,
    }
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
    * listTestcaseDirectory({payload}, {call, put}) {
      const res = yield call(listTestcaseTree, payload);
      if (auth.response(res)) {
        yield put({
          type: 'save',
          payload: {
            directory: res.data,
            currentDirectory: res.data.length > 0 ? [res.data[0].key] : []
          }
        })
      }
    },

    * listTestcase({payload}, {call, put, select}) {
      const res = yield call(listTestcase, payload);
      if (auth.response(res)) {
        const {pagination} = yield select(state => state.testcase);
        yield put({
          type: 'save',
          payload: {
            testcases: res.data,
            pagination: {...pagination, total: res.data.length, current: 1}
          }
        })
      }
    },

    * queryTestcaseDirectory({payload}, {call, put}) {
      const res = yield call(queryTestcaseDirectory, payload);
      if (auth.response(res)) {
        yield put({
          type: 'save',
          payload: {
            directoryName: res.data.name,
          }
        })
      }
    },

    * insertTestcaseDirectory({payload}, {call, put}) {
      const res = yield call(insertTestcaseDirectory, payload);
      return auth.response(res, true);
    },

    * updateTestcaseDirectory({payload}, {call, put}) {
      const res = yield call(updateTestcaseDirectory, payload);
      return auth.response(res, true);
    },

    * deleteTestcaseDirectory({payload}, {call, put}) {
      const res = yield call(deleteTestcaseDirectory, payload);
      return auth.response(res, true);
    },

    * queryTestcase({payload}, {call, put}) {
      const res = yield call(queryTestCase, payload);
      if (auth.response(res)) {
        yield put({
          type: 'save',
          payload: {
            caseInfo: res.data.case,
            asserts: res.data.asserts,
            constructors: res.data.constructors,
            constructors_case: res.data.constructors_case,
          }
        })
      }
    },

    * insertTestcase({payload}, {call, put}) {
      const res = yield call(createTestCase, payload);
      if (auth.response(res, true)) {
        const caseId = res.data;
        window.location.href = `/#/apiTest/testcase/${payload.directory_id}/${caseId}`
      }
    },

    * updateTestcase({payload}, {call, put}) {
      const res = yield call(updateTestCase, payload);
      if (auth.response(res, true)) {
        yield put({
          type: 'save',
          payload: {
            caseInfo: res.data,
            editing: false,
          }
        })
      }
    },
    * executeTestcase({payload}, {call, put}) {
      const res = yield call(executeCase, payload);
      if (auth.response(res, true)) {
        yield put({
          type: 'save',
          payload: {
            testResult: res.data,
          }
        })
      }
    },

    * executeSelectedCase({payload}, {call, put}) {
      return yield call(executeSelectedCase, payload.case_list);
    }

  },
}
