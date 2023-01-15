import {request} from '@umijs/max';
import CONFIG from "@/consts/config";
import auth from "@/utils/auth";

export interface PityResponse {
  code: number;
  data?: any;
  msg?: string;
}

export interface LoginResponse {
  token: string;
  expire: number;
  user: LoginUser;
}

export interface LoginUser {
  id: number;
  username: string;
  name: string;
  email: string;

  avatar: string;
  created_at: string;
  deleted_at: number;

  is_valid: boolean;
  last_login_at: string;

  phone: string | null;
  role: number;
  update_user: number | null;
  updated_at: string;
}

export async function login(params: Record<string, string | undefined>) {
  return request<PityResponse>(`${CONFIG.URL}/auth/login`, {
    method: 'POST',
    data: params,
  });
}

export async function generateResetLink(params: Record<string, any>) {
  return request<{
    data: API.CurrentUser;
  }>(`${CONFIG.URL}/auth/reset/generate/${params}`, {
    method: 'GET',
  });
}

export async function currentUser(params: Record<string, string>) {
  return request<{
    data: LoginUser;
    msg?: string;
    code: number;
  }>(`${CONFIG.URL}/auth/query`, {
    method: 'GET',
    params,
  });
}

// export async function checkUrl(params) {
//   return request(`${CONFIG.URL}/auth/reset/check/${params}`, {
//     method: 'GET',
//   });
// }
//
// // 重置密码接口
// export async function resetPwd(data) {
//   return request(`${CONFIG.URL}/auth/reset`, {
//     method: 'POST',
//     data,
//   });
// }
//
// // 注册接口
// export async function register(params) {
//   return request(`${CONFIG.URL}/auth/register`, {
//     method: 'POST',
//     data: params,
//   });
// }
//
// export async function getFakeCaptcha(mobile) {
//   return request(`/api/login/captcha?mobile=${mobile}`);
// }
// 根据用户id查询用户操作记录
export async function listUserOperationLog(params?: Record<string, string>) {
  return await request(`${CONFIG.URL}/operation/list`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function loginGithub(params?: Record<string, string>) {
  return await request(`${CONFIG.URL}/auth/github/login`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function queryUserStatistics(params?: Record<string, string>) {
  return await request(`${CONFIG.URL}/workspace/`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function queryFollowTestPlanData(params?: Record<string, string>) {
  return await request(`${CONFIG.URL}/workspace/testplan`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}


export async function listUsers(params?: Record<string, string>) {
  const res = await request(`${CONFIG.URL}/auth/listUser`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
  if (auth.response(res)) {
    return res.data;
  }
  return [];
}

export async function updateUsers(data: any) {
  return await request(`${CONFIG.URL}/auth/update`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function updateAvatar(data: any) {
  const formData = new FormData();
  formData.append("file", data.file)
  return await request(`${CONFIG.URL}/oss/avatar`, {
    method: 'POST',
    data: formData,
    requestType: 'form',
    headers: auth.headers(false),
  });
}

export async function deleteUsers(params?: Record<string, string>) {
  return await request(`${CONFIG.URL}/auth/delete`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function listUserActivities(params?: Record<string, string>) {
  return await request(`${CONFIG.URL}/operation/count`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}
