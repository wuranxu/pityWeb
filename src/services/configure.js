import request from '@/utils/request';
import {CONFIG} from '@/consts/config';
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

// 获取gconfig列表
export async function listDbConfig(params) {
  return request(`${CONFIG.URL}/config/dbconfig/list`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function insertDbConfig(params) {
  return request(`${CONFIG.URL}/config/dbconfig/insert`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function updateDbConfig(params) {
  return request(`${CONFIG.URL}/config/dbconfig/update`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function onTestDbConfig(params) {
  return request(`${CONFIG.URL}/config/dbconfig/connect`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function deleteDbConfig(params) {
  return request(`${CONFIG.URL}/config/dbconfig/delete`, {
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

// redis配置
export async function listRedisConfig(params) {
  return request(`${CONFIG.URL}/config/redis/list`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function insertRedisConfig(params) {
  return request(`${CONFIG.URL}/config/redis/insert`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function updateRedisConfig(params) {
  return request(`${CONFIG.URL}/config/redis/update`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function deleteRedisConfig(params) {
  return request(`${CONFIG.URL}/config/redis/delete`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function onlineRedisCommand(params) {
  return request(`${CONFIG.URL}/config/redis/command`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function uploadFile(params) {
  const formData = new FormData();
  formData.append("file", params.files[0].originFileObj)
  return request(`${CONFIG.URL}/oss/upload`, {
    method: 'POST',
    params: {filepath: params.filepath},
    data: formData,
    requestType: 'form',
    headers: auth.headers(false),
  });
}

export async function listFile() {
  return request(`${CONFIG.URL}/oss/list`, {
    method: 'GET',
    headers: auth.headers(),
  });
}

export async function deleteFile(params) {
  return request(`${CONFIG.URL}/oss/delete`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function getSystemConfig() {
  return request(`${CONFIG.URL}/config/system`, {
    method: 'GET',
    headers: auth.headers(),
  });
}

export async function updateSystemConfig(data) {
  return request(`${CONFIG.URL}/config/system/update`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}



