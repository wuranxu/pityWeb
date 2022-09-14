import request from '@/utils/request';
import {CONFIG} from '@/consts/config';

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function login(params) {
  return request(`${CONFIG.URL}/v1/user/login`, {
    method: 'POST',
    data: params,
  });
}

export async function generateResetLink(params) {
  return request(`${CONFIG.URL}/auth/reset/generate/${params}`, {
    method: 'GET',
  });
}


export async function checkUrl(params) {
  return request(`${CONFIG.URL}/auth/reset/check/${params}`, {
    method: 'GET',
  });
}

// 重置密码接口
export async function resetPwd(data) {
  return request(`${CONFIG.URL}/auth/reset`, {
    method: 'POST',
    data,
  });
}

// 注册接口
export async function register(params) {
  return request(`${CONFIG.URL}/auth/register`, {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
