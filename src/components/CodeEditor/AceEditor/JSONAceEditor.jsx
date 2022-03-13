// import 'ace-builds/src-noconflict/worker-json'; // pg模式包
import React, {Component} from 'react';
import "ace-builds";
import AceEditor from "react-ace";
import jsonWorkerUrl from "file-loader!ace-builds/src-noconflict/worker-json";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-spellcheck";
import './MaterialOneDark'; // pg模式包
import {addCompleter} from 'ace-builds/src-noconflict/ext-language_tools';
import "ace-builds/src-noconflict/mode-json"

ace.config.setModuleUrl("ace/mode/json_worker", jsonWorkerUrl)


export default class JSONAceEditor extends Component {

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
    const {value, onChange, height, readOnly, theme} = this.props;
    return (
      <AceEditor
        ref="aceEditor"
        mode='json'
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
          useWorker: true,
        }}
      />
    )
  }
}


