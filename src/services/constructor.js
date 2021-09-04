import request from "@/utils/request";
import {CONFIG} from "@/consts/config";
import auth from "@/utils/auth";

// 获取构造方法树
export async function listConstructorData(params) {
  return request(`${CONFIG.URL}/testcase/constructor/tree`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function queryConstructorData(params) {
  return request(`${CONFIG.URL}/testcase/constructor`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}


export async function insertConstructorData(params) {
  return request(`${CONFIG.URL}/testcase/constructor/insert`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function updateConstructorOrder(params) {
  return request(`${CONFIG.URL}/testcase/constructor/order`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}
