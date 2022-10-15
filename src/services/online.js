import request from "@/utils/request";
import {CONFIG} from "@/consts/config";
import auth from "@/utils/auth";

export async function fetchDatabaseSource(data) {
  return request(`${CONFIG.URL}/config/listDbTree`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function fetchTables(data) {
  return request(`${CONFIG.URL}/config/listDbTables`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}


export async function onlineExecuteSQL(data) {
  return request(`${CONFIG.URL}/config/runSQL`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function listHistory(data) {
  return request(`${CONFIG.URL}/config/querySQLHistory`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}
