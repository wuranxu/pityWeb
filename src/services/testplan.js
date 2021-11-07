// 编辑测试数据
import request from "@/utils/request";
import {CONFIG} from "@/consts/config";
import auth from "@/utils/auth";

export async function listTestPlan(params) {
  return request(`${CONFIG.URL}/testcase/plan/list`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}


export async function listTestPlanCaseTree(params) {
  return request(`${CONFIG.URL}/testcase/tree`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function insertTestPlan(params) {
  return request(`${CONFIG.URL}/testcase/plan/insert`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function updateTestPlan(params) {
  return request(`${CONFIG.URL}/testcase/plan/update`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function deleteTestPlan(params) {
  return request(`${CONFIG.URL}/testcase/plan/delete`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}
