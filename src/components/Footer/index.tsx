import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      // @ts-ignore
      copyright={<span>{currentYear} web测试组接口测试平台 <a
            href="https://www.siyuai.xyz/">有疑问？向AI提问</a></span>}
      links={false}
    />
  );
};

export default Footer;
