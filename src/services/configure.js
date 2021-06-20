import request from '@/utils/request';
import { CONFIG } from '@/consts/config';
import auth from '@/utils/auth';

export async function listEnvironment(params) {
  return request(`${CONFIG.URL}/config/environment/list`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function insertEnvironment(params) {
  return request(`${CONFIG.URL}/config/environment/insert`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function updateEnvironment(params) {
  return request(`${CONFIG.URL}/config/environment/update`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function deleteEnvironment(params) {
  return request(`${CONFIG.URL}/config/environment/delete`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}
