import React from 'react';

import Editor from '@monaco-editor/react';

export default ({ language, value, setValue, height, theme }) => {
  const handleEditorChange = (value, event) => {
    setValue(value);
  };

  return (
    <Editor
      height={height || '50vh'}
      defaultLanguage={language || 'json'}
      defaultValue=''
      theme={theme || 'light'}
      onChange={handleEditorChange}
    />
  );
}
