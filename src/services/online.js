import request from "@/utils/request";
import {CONFIG} from "@/consts/config";
import auth from "@/utils/auth";

export async function fetchDatabaseSource(params) {
  return request(`${CONFIG.URL}/online/database/list`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}

export async function fetchTables(data) {
  return request(`${CONFIG.URL}/online/tables/list`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}


export async function onlineExecuteSQL(params) {
  return request(`${CONFIG.URL}/online/sql`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}

export async function listHistory(params) {
  return request(`${CONFIG.URL}/online/history/query`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}
