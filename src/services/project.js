import request from '@/utils/request';
import {CONFIG} from '@/consts/config';
import auth from '@/utils/auth';

export async function listProject(params) {
  return request(`${CONFIG.URL}/project/list`, {
    method: 'GET',
    params,
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

export async function queryProject(params) {
  return request(`${CONFIG.URL}/project/query`, {
    method: 'GET',
    params,
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
  return request(`${CONFIG.URL}/project/role/insert`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function updateProjectRole(data) {
  return request(`${CONFIG.URL}/project/role/update`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function deleteProjectRole(data) {
  return request(`${CONFIG.URL}/project/role/delete`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function updateAvatar(data) {
  const formData = new FormData();
  formData.append("file", data.file)
  return await request(`${CONFIG.URL}/project/avatar/${data.project_id}`, {
    method: 'POST',
    data: formData,
    requestType: 'form',
    headers: auth.headers(false),
  });
}

/**
 * 删除项目
 */
export async function deleteProject(params) {
  return request(`${CONFIG.URL}/project/delete`, {
    method: 'DELETE',
    params,
    headers: auth.headers(),
  });
}
