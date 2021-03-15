import React from 'react';

import Editor from '@monaco-editor/react';

export default ({ language, value, setValue, height, theme }) => {
  const handleEditorChange = (data) => {
    setValue(data);
  };

  return (
    <Editor
      height={height || '20vh'}
      defaultLanguage={language || 'json'}
      theme={theme || 'light'}
      value={value}
      onChange={handleEditorChange}
    />
  );
};
