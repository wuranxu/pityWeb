import {
  deleteConstructorData,
  insertConstructorData,
  listConstructorData,
  queryConstructorData,
  updateConstructorData,
  updateConstructorOrder
} from "@/services/constructor";
import auth from "@/utils/auth";
import {listTestCaseTree} from "@/services/testcase";
import common from "@/utils/common";

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
    constructorData: [],
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
      const res = yield call(insertConstructorData, payload);
      if (auth.response(res, true)) {
        yield put({
          type: 'testcase/save',
          payload: {
            constructorModal: false,
          }
        })
        return true;
      }
      return false;
    },

    * update({payload}, {call, put}) {
      const res = yield call(updateConstructorData, payload);
      if (auth.response(res, true)) {
        yield put({
          type: 'testcase/save',
          payload: {
            constructorModal: false,
          }
        })
        return true;
      }
      return false;
    },

    * delete({payload}, {call, put}) {
      const res = yield call(deleteConstructorData, payload);
      return auth.response(res, true);
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
        let ans = {
          value: res.data.value,
          enable: res.data.enable,
          type: res.data.type,
          public: res.data.public,
          name: res.data.name,
        };
        if (res.data.type === 0) {
          // case
          ans = {
            ...ans,
            params: json_data.params,
            constructor_case_id: json_data.constructor_case_id,
          }
        } else if (res.data.type === 1) {
          ans = {
            ...ans,
            database: json_data.database,
            sql: json_data.sql,
          }
        } else if (res.data.type === 2) {
          ans = {
            ...ans,
            command: json_data.command,
            redis: json_data.redis,
          }
        } else if (res.data.type === 3) {
          ans = {
            ...ans,
            command: json_data.command,
          }
        } else if (res.data.type === 4) {
          ans = {
            ...ans,
            body: json_data.body,
            headers: common.parseHeaders(json_data.headers),
            base_path: json_data.base_path,
            url: json_data.url,
            request_method: json_data.request_method,
            body_type: json_data.body_type,
          }
        }
        yield put({
          type: 'save',
          payload: {
            testCaseConstructorData: ans
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

