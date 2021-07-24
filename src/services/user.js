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

export async function loginGithub(params) {
  return await request(`${CONFIG.URL}/auth/github/login`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}
