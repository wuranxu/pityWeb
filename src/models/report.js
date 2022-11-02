import {listTestReport} from "@/services/report";
import auth from "@/utils/auth";

export default {
  namespace: 'report',
  state: {
    reportData: [],
    pagination: {
      pageSize: 8,
      current: 1,
      total: 0,
      showTotal: total => `共${total}条记录`
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
    * fetchReportList({payload}, {call, put, select}) {
      const {pagination} = yield select(state => state.report);
      const res = yield call(listTestReport, payload);
      if (auth.response(res)) {
        yield put({
          type: 'save',
          payload: {
            reportData: res.data.data,
            pagination: {
              ...pagination,
              total: res.data.total,
            }
          }
        })
      }
    }
  }
}
