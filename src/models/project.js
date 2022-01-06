import {listProject, updateAvatar} from "@/services/project";
import auth from "@/utils/auth";

const getProjectId = () => {
  const projectId = localStorage.getItem("project_id")
  if (projectId === undefined || projectId === null) {
    return undefined;
  }
  return parseInt(projectId, 10);
}

export default {
  namespace: 'project',
  state: {
    projects: [],
    projectsMap: {},
    project_id: getProjectId(),
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
    * listProject({payload}, {call, put, select}) {
      const res = yield call(listProject, {page: 1, size: 10000});
      if (auth.response(res)) {
        const projects = {}
        res.data.forEach(item => {
          projects[item.id] = item.name;
        })
        let projId = yield select(state => state.project.project_id)
        if (projId === undefined) {
          projId = res.data.length > 0 ? res.data[0].id : undefined
        }
        console.log(projId)
        yield put({
          type: 'save',
          payload: {
            projects: res.data,
            projectsMap: projects,
            project_id: projId,
          }
        })
      }
    },

    * uploadFile({payload}, {call, put}) {
      const res = yield call(updateAvatar, payload)
      if (auth.response(res, true)) {
        return res.data;
      }
      return null;
    }
  },
}
