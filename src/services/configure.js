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


export async function insertGConfig(params) {
  return request(`${CONFIG.URL}/config/gconfig/insert`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

// 获取gconfig列表
export async function listGConfig(params) {
  return request(`${CONFIG.URL}/config/gconfig/list`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function updateGConfig(params) {
  return request(`${CONFIG.URL}/config/gconfig/update`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}


export async function deleteGConfig(params) {
  return request(`${CONFIG.URL}/config/gconfig/delete`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}
