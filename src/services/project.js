import request from '@/utils/request';
import { CONFIG } from '@/consts/config';
import auth from '@/utils/auth';

export async function listProject(params) {
  return request(`${CONFIG.URL}/project/list`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}
