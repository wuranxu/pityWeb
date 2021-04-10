import request from '@/utils/request';
import { CONFIG } from '@/consts/config';
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
