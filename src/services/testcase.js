import request from '@/utils/request';
import { CONFIG } from '@/consts/config';
import auth from '@/utils/auth';

export async function createTestCase(params) {
  return request(`${CONFIG.URL}/testcase/insert`, {
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
