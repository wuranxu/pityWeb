import 'ace-builds/src-noconflict/ace'; // mysql模式的包
import 'ace-builds/src-noconflict/mode-mysql'; // mysql模式的包
import 'ace-builds/src-noconflict/mode-pgsql'; // pg模式包
// 主题样式
import 'ace-builds/src-noconflict/theme-ambiance';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-eclipse';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-merbivore';
import 'ace-builds/src-noconflict/theme-merbivore_soft';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-pastel_on_dark';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/theme-xcode';


import React from 'react';
import PityAceEditor from "@/components/CodeEditor/AceEditor/index";

export default function SqlAceEditor(props) {
  return <PityAceEditor {...props} theme="material-one-dark"/>;
}

