import {message, notification} from 'antd';
import type {PityResponse} from '@/services/user';
import {NotificationPlacement} from "antd/es/notification/interface";
import {listUsers} from "@/services/user";
import {RequestOptions} from "@@/plugin-request/request";

interface headers {
  token: string;
  "Content-Type"?: string;
}

export default {
  headers: (json = true): RequestOptions => {
    const token = localStorage.getItem('pityToken') || '';
    const header: headers = {token};
    if (json) {
      header['Content-Type'] = 'application/json';
    }
    return header;
  },
  notificationResponse: (res: PityResponse, info = false, position: NotificationPlacement = 'topRight') => {
    if (!res || res.code === undefined) {
      notification.error({message: "网络开小差了，请稍后重试", placement: position})
      return false;
    }
    if (res.code === 0) {
      if (info) {
        notification.success({
          message: res.msg,
          placement: position,
        });
      }
      return true;
    }
    if (res.code === 401) {
      // 说明用户未认证
      // message.info(res.msg);
      localStorage.deleteItem('pityToken');
      localStorage.deleteItem('pityUser');
      const href = window.location.href;
      if (href.indexOf("/user/login") === -1) {
        const uri = href.split("redirect=")
        window.location.href = `/#/user/login?redirect=${uri[uri.length - 1]}`
        // window.open(`/#/user/login?redirect=${href}`)
      }
      notification.info({
        message: res.msg,
        placement: position,
      });
      return false;
    }
    notification.error({message: res.msg, placement: position})
    return false;
  },
  response: (res: PityResponse, info = false) => {
    if (!res || res.code === undefined) {
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
      localStorage.deleteItem('pityToken');
      localStorage.deleteItem('pityUser');
      const href = window.location.href;
      if (href.indexOf("/user/login") === -1) {
        const uri = href.split("redirect=")
        window.location.href = `/#/user/login?redirect=${uri[uri.length - 1]}`
        // window.open(`/#/user/login?redirect=${href}`)
      }
      message.info(res.msg);
      return false;
    }
    message.error(res.msg);
    return false;
  },
  getUserMap: async () => {
    const user = await listUsers();
    const temp: Record<any, any> = {};
    user.forEach((item: any) => {
      temp[item?.id] = item;
    });
    return temp;
  }
};
