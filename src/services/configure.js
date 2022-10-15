import request from '@/utils/request';
import {CONFIG} from '@/consts/config';
import auth from '@/utils/auth';

export async function listEnvironment(data) {
  return request(`${CONFIG.URL}/config/listEnvironment`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function insertEnvironment(data) {
  return request(`${CONFIG.URL}/config/insertEnvironment`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function updateEnvironment(data) {
  return request(`${CONFIG.URL}/config/updateEnvironment`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function deleteEnvironment(data) {
  return request(`${CONFIG.URL}/config/deleteEnvironment`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}


export async function insertGConfig(data) {
  return request(`${CONFIG.URL}/config/insertGConfig`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

// 获取gconfig列表
export async function listGConfig(data) {
  return request(`${CONFIG.URL}/config/listGConfig`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

// 获取gconfig列表
export async function listDbConfig(data) {
  return request(`${CONFIG.URL}/config/listDbConfig`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function insertDbConfig(data) {
  return request(`${CONFIG.URL}/config/insertDbConfig`, {
    method: 'POST',
    data: data,
    headers: auth.headers(),
  });
}

export async function updateDbConfig(data) {
  return request(`${CONFIG.URL}/config/updateDbConfig`, {
    method: 'POST',
    data: data,
    headers: auth.headers(),
  });
}

export async function onTestDbConfig(data) {
  return request(`${CONFIG.URL}/config/testDbConfig`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function deleteDbConfig(data) {
  return request(`${CONFIG.URL}/config/deleteDbConfig`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function updateGConfig(data) {
  return request(`${CONFIG.URL}/config/updateGConfig`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}


export async function deleteGConfig(data) {
  return request(`${CONFIG.URL}/config/deleteGConfig`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

// redis配置
export async function listRedisConfig(data) {
  return request(`${CONFIG.URL}/config/listRedis`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function insertRedisConfig(data) {
  return request(`${CONFIG.URL}/config/insertRedis`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

/**
 * 获取网关地址
 * @param params
 * @returns {Promise<any>}
 */
export async function listGateway(data) {
  return request(`${CONFIG.URL}/config/listGateway`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

/**
 * 添加服务地址
 * @param data
 * @returns {Promise<any>}
 */
export async function insertGateway(data) {
  return request(`${CONFIG.URL}/config/insertGateway`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

/**
 * 修改服务地址
 * @param data
 * @returns {Promise<any>}
 */
export async function updateGateway(data) {
  return request(`${CONFIG.URL}/config/updateGateway`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function deleteGateway(data) {
  return request(`${CONFIG.URL}/config/deleteGateway`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}


export async function updateRedisConfig(data) {
  return request(`${CONFIG.URL}/config/updateRedis`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function deleteRedisConfig(data) {
  return request(`${CONFIG.URL}/config/deleteRedis`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function onlineRedisCommand(data) {
  return request(`${CONFIG.URL}/config/runRedisCommand`, {
    method: 'POST',
    data,
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



