import request from "@/utils/request";
import {CONFIG} from "@/consts/config";
import auth from "@/utils/auth";

export async function listTestReport(data) {
  return request(`${CONFIG.URL}/testcase/listTestReport`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}

export async function queryReport(data) {
  return request(`${CONFIG.URL}/testcase/queryTestReport`, {
    method: 'POST',
    data,
    headers: auth.headers(),
  });
}
