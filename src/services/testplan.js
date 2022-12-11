// 编辑测试数据
import request from "@/utils/request";
import {CONFIG} from "@/consts/config";
import auth from "@/utils/auth";

export async function listTestPlan(data) {
  return request(`${CONFIG.URL}/testcase/listTestPlan`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}


export async function listTestPlanCaseTree(data) {
  return request(`${CONFIG.URL}/testcase/queryTestCaseTree`, {
    method: 'POST',
    data,
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


export async function executeTestPlan(params) {
  return request(`${CONFIG.URL}/testcase/plan/execute`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

/**
 * 关注测试计划
 * @param params
 * @returns {Promise<*>}
 */
export async function followTestPlan(params) {
  return request(`${CONFIG.URL}/testcase/plan/follow`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

/**
 * 取关测试计划
 * @param params
 * @returns {Promise<*>}
 */
export async function unFollowTestPlan(params) {
  return request(`${CONFIG.URL}/testcase/plan/unfollow`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}
