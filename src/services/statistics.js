import request from '@/utils/request';
import {CONFIG} from '@/consts/config';
import auth from '@/utils/auth';

export async function queryStatistics(params) {
  return request(`${CONFIG.URL}/workspace/statistics`, {
    method: 'GET',
    params,
    headers: auth.headers(),
  });
}
