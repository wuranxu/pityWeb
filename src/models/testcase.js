import auth from "@/utils/auth";
import {
  createTestCase,
  createTestCaseV2,
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
  queryRecordStatus,
  queryTestCase,
  queryTestcaseDirectory,
  retryCase,
  startRecord,
  stopRecord,
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

    // 重试结果
    retryResult: {},
    envActiveKey: '',
    constructors_case: {},
    constructorModal: false,
    activeKey: '3',

    pagination: {
      current: 1,
      total: 0,
      showTotal: total => `共${total}条用例`,
      pageSize: 8,
    },

    // 默认出参
    outParameters: [],

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
            outParameters: [...res.data.out_parameters.map((item, index) => ({...item, key: index})), {
              key: res.data.out_parameters.length,
              source: 0
            }]
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
            caseInfo: res.data.case_info,
            outParameters: [...res.data.out_parameters.map((item, index) => ({...item, key: index})), {
              key: res.data.out_parameters.length,
              source: 0
            }],
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

    * retryCase({payload}, {call, put}) {
      const res = yield call(retryCase, payload);
      if (auth.response(res, true)) {
        return res.data
      }
    },

    * onlinePyScript({payload}, {call, _}) {
      const res = yield call(onlinePyScript, payload);
      if (auth.response(res, false)) {
        return res.data
      }
      return "None"
    },

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
    }

  },
}
