import 'ace-builds/src-noconflict/ace'; // mysql模式的包
import 'ace-builds/src-noconflict/mode-json'; // pg模式包
import '../themes/VsDark'; // pg模式包
// import 'ace-builds/src-noconflict/worker-json'; // pg模式包
import React from 'react';
import PityAceEditor from "@/components/CodeEditor/AceEditor/index";

export default function JSONAceEditor(props) {
  return <PityAceEditor {...props} langugae="json" theme="vs-dark"/>;
}

