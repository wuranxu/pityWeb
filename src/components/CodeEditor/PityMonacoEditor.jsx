import React, {memo, useState} from "react";
import Editor, {loader} from "@monaco-editor/react";

// you can change the source of the monaco files
loader.config({paths: {vs: "/monaco/vs"}});

const CodeEditor = ({language="json", value, height, theme, options, onChange}) => {
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  function customPrompt(monaco) {
    const suggestions = ["XID", "XML", "XOR", "YEAR", "YEAR_MONTH", "ZEROFILL", "我是自定义的"].map((item) => {
      return {
        insertText: item,
        kind: monaco.languages.CompletionItemKind.Function, // 对应提示图标的不同
        label: item,
      };
    });
    monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems() {
        return {
          suggestions,
        };
      },
      quickSuggestions: true, // 默认提示关闭
      triggerCharacters: ["$", ".", "=", ":"], // 触发提示的字符 可以定义多个
    });
  }


  function handleEditorWillMount(monaco) {
    import("./themes/material-theme.json").then((data) => {
      monaco.editor.defineTheme("material", data);
      customPrompt(monaco);
      setIsThemeLoaded(true)
    });
  }

  return (
    <div>
      <Editor
        width="100%"
        height={height || '20vh'}
        value={value}
        onChange={onChange}
        options={options}
        language={language}
        theme={isThemeLoaded ? "material" : theme}
        beforeMount={handleEditorWillMount}
      />
    </div>
  );
};

export default memo(CodeEditor);
