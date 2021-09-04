import {
  insertConstructorData,
  listConstructorData,
  queryConstructorData,
  updateConstructorOrder
} from "@/services/constructor";
import auth from "@/utils/auth";
import {listTestCaseTree} from "@/services/testcase";

export default {
  namespace: 'construct',
  state: {
    currentStep: 0,
    totalStep: 1,
    constructorType: 0,
    searchConstructor: undefined,
    testCaseConstructorData: {
      public: true,
      enable: true,
    },
    testcaseData: [],
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
    * insert({payload}, {call, put}) {
      const res = yield call(insertConstructorData, payload.params);
      if (auth.response(res, true)) {
        payload.fetchData();
        yield put({
          type: 'testcase/save',
          payload: {
            constructorModal: false,
          }
        })
      }
    },

    * orderConstructor({payload}, {call, put}) {
      const res = yield call(updateConstructorOrder, payload);
      return auth.response(res, true);
    },

    * getConstructorTree({payload}, {call, put}) {
      const res = yield call(listConstructorData, payload);
      if (auth.response(res)) {
        yield put({
          type: 'save',
          payload: {
            constructorData: res.data,
          }
        })
      }
    },

    * getConstructorData({payload}, {call, put}) {
      const res = yield call(queryConstructorData, payload);
      if (auth.response(res)) {
        const json_data = JSON.parse(res.data.constructor_json);
        yield put({
          type: 'save',
          payload: {
            testCaseConstructorData: {
              params: json_data.params,
              case_id: [json_data.project_id, json_data.case_id],
              value: res.data.value,
              enable: res.data.enable,
              type: res.data.type,
              public: res.data.public,
              name: res.data.name,
            }
          }
        })
      }
    },

    * getTestCaseListTree({payload}, {call, put}) {
      const res = yield call(listTestCaseTree, payload);
      if (auth.response(res)) {
        yield put({
          type: 'save',
          payload: {
            testcaseData: res.data,
          }
        })
      }
    }
  }
}

