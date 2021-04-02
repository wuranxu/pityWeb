import request from '@/utils/request';
import { CONFIG } from '@/consts/config';
import auth from '@/utils/auth';

export async function httpRequest(params) {
  return request(`${CONFIG.URL}/request/http`, {
    method: 'POST',
    data: params,
    headers: auth.headers(),
  });
}
