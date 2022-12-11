import request from '@/utils/request';
import {CONFIG} from '@/consts/config';
import auth from '@/utils/auth';

export async function queryStatistics(data) {
  return request(`${CONFIG.URL}/dashboard/statistics`, {
    method: 'POST',
    data: data || {},
    headers: auth.headers(),
  });
}
