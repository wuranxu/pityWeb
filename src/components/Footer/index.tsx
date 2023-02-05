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
      copyright={<span>{currentYear} woody个人出品 <a
            href="https://beian.miit.gov.cn">鄂ICP备20001602号</a></span>}
      links={false}
    />
  );
};

export default Footer;
