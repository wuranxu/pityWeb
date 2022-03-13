import React, {Component} from 'react';
// import "ace-builds";
import AceEditor from 'react-ace';
import {addCompleter} from 'ace-builds/src-noconflict/ext-language_tools';
import './MaterialOneDark';
import './AtomOneDark';
import '../themes/VsDark';
import "./editor.less";
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-text';

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
    const {value, language, onChange, height, readOnly, theme, useWorker} = this.props;
    return (
      <AceEditor
        ref="aceEditor"
        mode={language || 'json'}
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
          readOnly: readOnly || false,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
          showLineNumbers: true,
          tabSize: 4,
          // useWorker: useWorker === undefined ? useWorker: true,
          useWorker: false,
        }}
      />
    )
  }
}
