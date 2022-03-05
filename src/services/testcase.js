import request from '@/utils/request';
import {CONFIG} from '@/consts/config';
import auth from '@/utils/auth';

export async function listTestCaseTree(params) {
  return request(`${CONFIG.URL}/testcase/list`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function createTestCase(params) {
  return request(`${CONFIG.URL}/testcase/insert`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function updateTestCase(params) {
  return request(`${CONFIG.URL}/testcase/update`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function listTestcase(params) {
  return request(`${CONFIG.URL}/testcase/list`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function queryTestCase(params) {
  return request(`${CONFIG.URL}/testcase/query`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

// 新增断言
export async function insertTestCaseAsserts(data) {
  return request(`${CONFIG.URL}/testcase/asserts/insert`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

// 编辑断言
export async function updateTestCaseAsserts(data) {
  return request(`${CONFIG.URL}/testcase/asserts/update`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

// 删除断言
export async function deleteTestCaseAsserts(data) {
  return request(`${CONFIG.URL}/testcase/asserts/delete`, {
    method: 'GET',
    params: data,
    headers: auth.headers(),
  });
}

export async function queryXmindData(params) {
  return request(`${CONFIG.URL}/testcase/xmind`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

// 获取测试用例树
export async function listTestcaseTree(params) {
  return request(`${CONFIG.URL}/testcase/directory`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function queryTestcaseDirectory(params) {
  return request(`${CONFIG.URL}/testcase/directory/query`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

// 新增目录
export async function insertTestcaseDirectory(params) {
  return request(`${CONFIG.URL}/testcase/directory/insert`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

// 修改目录
export async function updateTestcaseDirectory(params) {
  return request(`${CONFIG.URL}/testcase/directory/update`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

/**
 * 移动用例到新目录
 * @param params
 * @returns {Promise<any>}
 */
export async function moveTestCase(params) {
  return request(`${CONFIG.URL}/testcase/move`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

// 删除目录
export async function deleteTestcaseDirectory(params) {
  return request(`${CONFIG.URL}/testcase/directory/delete`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

/**
 * 删除测试用例
 * @param params
 * @returns {Promise<any>}
 */
export async function deleteTestcase(params) {
  return request(`${CONFIG.URL}/testcase/delete`, {
    method: 'DELETE',
    data: params,
    headers: auth.headers(),
  });
}

// 新增测试数据
export async function insertTestcaseData(params) {
  return request(`${CONFIG.URL}/testcase/data/insert`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

// 编辑测试数据
export async function updateTestcaseData(params) {
  return request(`${CONFIG.URL}/testcase/data/update`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

// 删除测试数据
export async function deleteTestcaseData(params) {
  return request(`${CONFIG.URL}/testcase/data/delete`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

// 在线执行py脚本
export async function onlinePyScript(params) {
  return request(`${CONFIG.URL}/online/script`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}
