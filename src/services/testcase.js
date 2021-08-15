import request from '@/utils/request';
import { CONFIG } from '@/consts/config';
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

export async function queryTestCase(params) {
  return request(`${CONFIG.URL}/testcase/query`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function insertTestCaseAsserts(data) {
  return request(`${CONFIG.URL}/testcase/asserts/insert`, {
    method: 'POST',
    data,
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
