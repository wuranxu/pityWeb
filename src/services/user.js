import request from '@/utils/request';
import {CONFIG} from '@/consts/config';
import auth from '@/utils/auth';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function listUsers(params) {
  const res = await request(`${CONFIG.URL}/auth/listUser`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
  if (auth.response(res)) {
    return res.data;
  }
  return [];
}

export async function updateUsers(data) {
  return await request(`${CONFIG.URL}/auth/update`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function deleteUsers(params) {
  return await request(`${CONFIG.URL}/auth/delete`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function listUserActivities(params) {
  return await request(`${CONFIG.URL}/operation/count`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

// 根据用户id查询用户操作记录
export async function listUserOperationLog(params) {
  return await request(`${CONFIG.URL}/operation/list`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function loginGithub(params) {
  return await request(`${CONFIG.URL}/auth/github/login`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}
