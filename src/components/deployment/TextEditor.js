/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import withStyles from '@mui/styles/withStyles';
import AceEditor from 'react-ace'
import Button from '@mui/material/Button'

import 'ace-builds/src-noconflict/mode-jsx';

import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-min-noconflict/ext-language_tools';

require('ace-builds/src-noconflict/mode-javascript');
require('ace-builds/src-noconflict/snippets/javascript');

require('ace-builds/src-noconflict/mode-json');
require('ace-builds/src-noconflict/snippets/json');

require('ace-builds/src-noconflict/mode-yaml');
require('ace-builds/src-noconflict/snippets/yaml');

require('ace-builds/src-noconflict/theme-monokai')

const styles = (theme) => ({
  button: {
    marginRight: theme.spacing(2),
  },
  editor: {
    margin: theme.spacing(3),
  },
})

class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.yamlInput === 0 ? this.props.customYaml : this.props.yamlInput,
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(newValue) {
    this.setState({
      value: newValue,
    });
  }

  render() {
    const {
      cancel,
      save,
      classes,
    } = this.props

    return (
      <div>
        <div className={classes.editor}>
          <AceEditor
            width="90%"
            placeholder="Enter custom YAML here."
            mode="yaml"
            theme="monokai"
            name="yamleditor"
            onLoad={this.onLoad}
            onChange={this.onChange}
            value={this.state.value}
            fontSize={14}
            showPrintMargin
            showGutter
            highlightActiveLine
            setOptions={{
              useWorker: false,
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </div>
        <Button
          className={classes.button}
          type="button"
          variant="contained"
          onClick={cancel}
        >
          Cancel
        </Button>
        <Button
          className={classes.button}
          type="button"
          variant="contained"
          color="primary"
          disabled={false}
          onClick={() => { save(this.state.value) }}
        >
          Save
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(TextEditor)
