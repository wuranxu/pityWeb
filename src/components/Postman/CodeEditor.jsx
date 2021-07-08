import React from 'react';

import Editor from '@monaco-editor/react';

export default ({ language, value, height, theme, options, onChange }) => {

  return (
    <Editor
      height={height || '20vh'}
      options={options}
      // defaultLanguage={language || 'json'}
      language={language || 'json'}
      theme={theme || 'light'}
      value={value}
      onChange={onChange}
    />
  );
};
