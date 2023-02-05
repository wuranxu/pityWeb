// @ts-ignore
import {getPageQuery} from "@/utils/utils";
import type {PityResponse} from "@/services/auth";
import {login} from "@/services/auth";
import {useState} from "react";


export default () => {
  const [status, setStatus] = useState<string | undefined>(undefined);

  const changeLoginStatus = (response: PityResponse) => {
    // 写入用户信息
    if (response.code === 0 && response.data !== undefined) {
      localStorage.setItem('pityToken', response.data.token);
      localStorage.setItem('pityUser', JSON.stringify(response.data.user));
      localStorage.setItem('pityExpire', response.data.expire.toString())
    }
    // setAuthority(payload.currentAuthority);
    // setAuthority(CONFIG.ROLE[payload.data.user.role]);
    setStatus(response.code === 0 ? 'ok' : 'error')
  }

  const loginPity = async (payload: Record<string, string | undefined>) => {
    const resp = await login(payload);
    changeLoginStatus(resp)
    return resp;
    // if (resp.code === 0) {
    //   const urlParams = new URL(window.location.href);
    //   const params = getPageQuery();
    //   message.success('🎉 🎉 🎉  登录成功！');

    //   let {redirect} = params;
    //   if (redirect) {
    //     const redirectUrlParams = new URL(redirect);
    //
    //     if (redirectUrlParams.origin === urlParams.origin) {
    //       redirect = redirect.substr(urlParams.origin.length);
    //
    //       if (redirect.match(/^\/.*#/)) {
    //         redirect = redirect.substr(redirect.indexOf('#') + 1);
    //       }
    //     } else {
    //       window.location.href = '/';
    //       return;
    //     }
    //   }
    //   if (history !== undefined) {
    //     history.replace(redirect || '/');
    //   } else {
    //     window.location.href = '/';
    //   }
    // } else {
    //   message.error(resp.msg || '网络开小差了，请稍后重试');
    // }
  }

  return {status, loginPity};
};
