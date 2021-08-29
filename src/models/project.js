import {listProject} from "@/services/project";
import auth from "@/utils/auth";

export default {
  namespace: 'project',
  state: {
    projects: [],
    project_id: undefined
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
    * listProject({payload}, {call, put}) {
      const res = yield call(listProject, {page: 1, size: 200});
      if (auth.response(res)) {
        yield put({
          type: 'save',
          payload: {
            projects: res.data,
            project_id: res.data.length > 0 ? res.data[0].id : undefined,
          }
        })
      }
    },
  },
}
