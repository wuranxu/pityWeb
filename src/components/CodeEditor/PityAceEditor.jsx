import AceEditor from 'react-ace';
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
import './MaterialOneDark';
import './AtomOneDark';
import './VsDark';
import "./editor.less";
import 'ace-builds/src-noconflict/ext-language_tools';
import {addCompleter} from 'ace-builds/src-noconflict/ext-language_tools';


import React, {Component} from 'react';

export default class PityAceEditor extends Component {


  componentDidMount() {
    this.props.setEditor(this.refs);
    addCompleter({
      getCompletions: (editor, session, pos, prefix, callback) => {
        callback(null, (this.props.tables || []).map(v => (
          {name: v, value: v}
        )));
      }
    });
  }

  render() {
    const {value, language, onChange, height, theme} = this.props;
    return (
      <AceEditor
        ref="aceEditor"
        mode={language}
        theme={theme || 'material-one-dark'}
        fontSize={14}
        showGutter
        showPrintMargin={false}
        onChange={onChange}
        value={value}
        wrapEnabled
        highlightActiveLine
        enableSnippets
        style={{width: '100%', height: height || 300}}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 4,
          useWorker: true,
        }}
      />
    )
  }
}
