import {Settings as LayoutSettings} from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: LayoutSettings & {
  pwa?: boolean;
  https?: boolean;
  logo?: string;
  apiUrl?: string;
  wssUrl?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1677ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '玩转接口测试',
  pwa: false,
  logo: '/logo.svg',
  iconfontUrl: '//at.alicdn.com/t/font_915840_kom9s5w2t6k.js',
  apiUrl: '127.0.0.1:7777',
  wssUrl: 'ws://127.0.0.1:7777',
  https: false,
};

export default Settings;
