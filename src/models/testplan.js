import {
  deleteTestPlan,
  executeTestPlan,
  followTestPlan,
  insertTestPlan,
  listTestPlan,
  listTestPlanCaseTree,
  unFollowTestPlan,
  updateTestPlan
} from "@/services/testplan";
import auth from "@/utils/auth";

export default {
  namespace: `testplan`,
  state: {
    planData: [],
    planRecord: {},
    planName: '',
    caseMap: {},

    // 测试计划编辑窗口
    visible: false,
    // 对话框title
    title: '',
    // 当前步骤
    currentStep: 0,
    treeData: [],
    selectedCaseData: [],
  },

  reducers: {
    save(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    }
  },

  effects: {
    * listTestPlan({payload}, {call, put}) {
      const res = yield call(listTestPlan, payload);
      if (auth.response(res)) {
        yield put({
          type: 'save',
          payload: {
            planData: res.data,
          }
        })
      }
    },

    * insertTestPlan({payload}, {call, put}) {
      const res = yield call(insertTestPlan, payload);
      return auth.response(res, true);
    },

    * updateTestPlan({payload}, {call}) {
      const res = yield call(updateTestPlan, payload);
      return auth.response(res, true)
    },

    * deleteTestPlan({payload}, {call}) {
      const res = yield call(deleteTestPlan, payload);
      return auth.response(res, true)
    },

    * executeTestPlan({payload}, {call}) {
      const res = yield call(executeTestPlan, payload);
      return auth.response(res)
    },

    /**
     * 关注测试计划
     * @param payload
     * @param call
     * @param put
     */
    * followTestPlan({payload}, {call}) {
      const res = yield call(followTestPlan, payload);
      return auth.response(res, true)
    },

    /**
     * 取关测试计划
     * @param payload
     * @param call
     * @param put
     */
    * unFollowTestPlan({payload}, {call}) {
      const res = yield call(unFollowTestPlan, payload);
      return auth.response(res, true)
    },

    * listTestCaseTreeWithProjectId({payload}, {call, put}) {
      const res = yield call(listTestPlanCaseTree, payload);
      if (auth.response(res)) {
        yield put({
          type: 'save',
          payload: {
            treeData: res.data.tree,
            caseMap: res.data.case_map,
          }
        })
      }
    }
  }
}
