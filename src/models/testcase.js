import auth from "@/utils/auth";
import {
  createTestCase, createTestCaseV2,
  deleteTestcase,
  deleteTestCaseAsserts,
  deleteTestcaseData,
  deleteTestcaseDirectory,
  insertTestCaseAsserts,
  insertTestcaseData,
  insertTestcaseDirectory,
  listTestcase,
  listTestcaseTree,
  moveTestCase,
  onlinePyScript,
  queryTestCase,
  queryTestcaseDirectory,
  updateTestCase,
  updateTestCaseAsserts,
  updateTestcaseData,
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
    casePermission: false,
    testcases: [],
    testResult: {},
    editing: false,
    caseInfo: {},
    constructRecord: {},
    asserts: [],
    // constructors: [],
    postConstructor: [],
    preConstructor: [],
    testData: {},
    envActiveKey: '',
    constructors_case: {},
    constructorModal: false,
    activeKey: '1',

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
            casePermission: true
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

    * moveTestCaseToDirectory({payload}, {call, put}) {
      const res = yield call(moveTestCase, payload);
      return auth.response(res, true);
    },

    * deleteTestcaseDirectory({payload}, {call, put}) {
      const res = yield call(deleteTestcaseDirectory, payload);
      return auth.response(res, true);
    },

    /**
     * 删除测试用例
     * @param payload
     * @param call
     * @param put
     * @returns {Generator<*, boolean, *>}
     */
    * deleteTestcase({payload}, {call, put}) {
      const res = yield call(deleteTestcase, payload);
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
            // 2022-04-23 拆分前后置条件
            preConstructor: res.data.constructors.filter(v => v.suffix === false).map((v, index) => ({...v, index})),
            postConstructor: res.data.constructors.filter(v => v.suffix === true).map((v, index) => ({...v, index})),
            // constructors: res.data.constructors.map((v, index) => ({...v, index})),
            constructors_case: res.data.constructors_case,
            testData: res.data.test_data,
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

    * createTestCase({payload}, {call, put}) {
      const res = yield call(createTestCaseV2, payload);
      return auth.response(res, true)
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
        return true;
      }
      return false;
    },

    * executeSelectedCase({payload}, {call, put}) {
      return yield call(executeSelectedCase, payload);
    },

    // 新增testcase assert
    * insertTestCaseAsserts({payload}, {call, put}) {
      return yield call(insertTestCaseAsserts, payload)
    },
    * updateTestCaseAsserts({payload}, {call, put}) {
      return yield call(updateTestCaseAsserts, payload)
    },
    * deleteTestCaseAsserts({payload}, {call, put}) {
      const res = yield call(deleteTestCaseAsserts, payload)
      return auth.response(res, true);
    },

    // 执行测试用例
    * onExecuteTestCase({payload}, {call, put}) {
      return yield call(executeCase, payload);
    },

    // 测试数据相关
    * insertTestcaseData({payload}, {call, put, select}) {
      const {testData} = yield select(state => state.testcase)
      const {env} = payload;
      const res = yield call(insertTestcaseData, payload);
      if (auth.response(res, true)) {
        const newData = {...testData};
        if (newData[parseInt(env, 10)] === undefined) {
          newData[parseInt(env, 10)] = [res.data]
        } else {
          newData[parseInt(env, 10)].push(res.data);
        }
        yield put({
          type: 'save',
          payload: {testData: newData}
        })
        return true;
      }
      return false;
    },

    * updateTestcaseData({payload}, {call, put, select}) {
      const {testData} = yield select(state => state.testcase)
      const {env} = payload;
      const res = yield call(updateTestcaseData, payload);
      if (auth.response(res, true)) {
        const newData = {...testData};
        const temp = newData[parseInt(env, 10)]
        const index = temp.findIndex((item) => res.data.id === item.id);
        const item = temp[index]
        temp.splice(index, 1, {...item, ...res.data});
        yield put({
          type: 'save',
          payload: {testData: newData}
        })
        return true;
      }
      return false;
    },


    * deleteTestcaseData({payload}, {call, _}) {
      const res = yield call(deleteTestcaseData, payload);
      return auth.response(res, true);
    },

    * onlinePyScript({payload}, {call, _}) {
      const res = yield call(onlinePyScript, payload);
      if (auth.response(res, false)) {
        return res.data
      }
      return "None"
    }

  },
}
