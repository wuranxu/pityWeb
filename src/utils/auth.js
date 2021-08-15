import { message } from 'antd';
import { listUsers } from '@/services/user';

export default {
  headers: (json = true) => {
    const token = localStorage.getItem('pityToken');
    const headers = { token };
    if (json) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  },
  response: (res, info = false) => {
    if (!res) {
      message.error("网络开小差了，请稍后重试")
      return false;
    }
    if (res.code === 0) {
      if (info) {
        message.success(res.msg);
      }
      return true;
    }
    if (res.code === 401) {
      // 说明用户未认证
      // message.info(res.msg);
      localStorage.setItem('pityToken', null);
      localStorage.setItem('pityUser', null);
      window.location.href = '/#/user/login';
      message.info(res.msg);
      return false;
    }
    message.error(res.msg);
    return false;
  },
  getUserMap: async () => {
    const user = await listUsers();
    const temp = {};
    user.forEach((item) => {
      temp[item.id] = item.name;
    });
    return temp;
  }
};
