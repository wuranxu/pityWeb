// import React, {memo, useState} from "react";
// import Editor, {loader} from "@monaco-editor/react";
//
// // you can change the source of the monaco files
// loader.config({paths: {vs: "/monaco/vs"}});
//
// const CodeEditor = ({language = "json", value, height, theme, options, onChange, tables}) => {
//   const [isThemeLoaded, setIsThemeLoaded] = useState(false);
//
//   function customPrompt(monaco) {
//     let suggestions = [];
//     if (tables) {
//       suggestions = tables.map(table => {
//         return {
//           label: table,
//           kind: monaco.languages.CompletionItemKind.Keyword,
//           insertText: table,
//           insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
//           documentation: table,
//           detail: table,
//           sortText: table
//         }
//       });
//     } else if (language.toLowerCase() === 'python') {
//       suggestions = ["import", 'print', "if", "def", "__name__", "for", "while", "True", "False", "any", "return", "break", "continue"].map(table => {
//         return {
//           label: table,
//           kind: monaco.languages.CompletionItemKind.Keyword,
//           insertText: table,
//         }
//       });
//     }
//     monaco.languages.registerCompletionItemProvider(language, {
//       provideCompletionItems() {
//         return {
//           suggestions,
//         };
//       },
//       suggestOnTriggerCharacters: true,
//       // quickSuggestions: true, // 默认提示关闭
//       triggerCharacters: ["$", ".", "=", ":"], // 触发提示的字符 可以定义多个
//     });
//   }
//
//
//   function handleEditorWillMount(monaco) {
//     import("./themes/material-theme.json").then((data) => {
//       monaco.editor.defineTheme("material", data);
//       customPrompt(monaco);
//       setIsThemeLoaded(true)
//     });
//   }
//
//   return (
//     <div>
//       <Editor
//         width="100%"
//         height={height || '20vh'}
//         value={value}
//         onChange={onChange}
//         options={options}
//         language={language}
//         theme={isThemeLoaded ? "material" : theme}
//         beforeMount={handleEditorWillMount}
//       />
//     </div>
//   );
// };
//
// export default memo(CodeEditor);
