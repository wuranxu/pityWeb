import request from '@/utils/request';
import {CONFIG} from '@/consts/config';
import auth from '@/utils/auth';

export async function listProject(params) {
  return request(`${CONFIG.URL}/project/list`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function insertProject(params) {
  return request(`${CONFIG.URL}/project/insert`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function queryProject(data) {
  return request(`${CONFIG.URL}/project/query`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function updateProject(data) {
  return request(`${CONFIG.URL}/project/update`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function insertProjectRole(data) {
  return request(`${CONFIG.URL}/project/insertRole`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function updateProjectRole(data) {
  return request(`${CONFIG.URL}/project/updateRole`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function deleteProjectRole(data) {
  return request(`${CONFIG.URL}/project/deleteRole`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function updateAvatar(data) {
  const reader = new FileReader();
  reader.readAsDataURL(data.file)
  reader.onload = async () => {
    const res = await request(`${CONFIG.URL}/project/updateAvatar`, {
      method: 'POST',
      data: {
        filename: data.file.name,
        content: reader.result,
        project_id: data.project_id
      },
      headers: auth.headers(),
    });
    if (auth.response(res, true)) {
      await data.reloadData()
    }
    return res.data
  }
}

/**
 * 删除项目
 */
export async function deleteProject(data) {
  return request(`${CONFIG.URL}/project/delete`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}
