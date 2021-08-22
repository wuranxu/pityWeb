import request from "@/utils/request";
import {CONFIG} from "@/consts/config";
import auth from "@/utils/auth";

export async function fetchDatabaseSource(params) {
  return request(`${CONFIG.URL}/online/tables`, {
    method: 'GET',
    params,
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
