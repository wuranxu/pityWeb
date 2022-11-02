import request from "@/utils/request";
import {CONFIG} from "@/consts/config";
import auth from "@/utils/auth";

// 获取构造方法树
export async function listConstructorData(data) {
  return request(`${CONFIG.URL}/testcase/listConstructor`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function queryConstructorData(data) {
  return request(`${CONFIG.URL}/testcase/queryConstructor`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}


export async function insertConstructorData(data) {
  return request(`${CONFIG.URL}/testcase/insertConstructor`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function updateConstructorData(data) {
  return request(`${CONFIG.URL}/testcase/updateConstructor`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function deleteConstructorData(data) {
  return request(`${CONFIG.URL}/testcase/deleteConstructor`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function updateConstructorOrder(data) {
  return request(`${CONFIG.URL}/testcase/reorderConstructor`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}
