import request from '@/utils/request';
import { CONFIG } from '@/consts/config';
import auth from '@/utils/auth';

export async function httpRequest(params) {
  return request(`${CONFIG.URL}/request/http`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function executeCase(params) {
  return request(`${CONFIG.URL}/request/run`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function executeSelectedCase(params) {
  return request(`${CONFIG.URL}/request/run/multiple`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}
