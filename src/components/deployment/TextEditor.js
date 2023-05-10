/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { styled } from '@mui/system';
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

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
}));

const EditorWrapper = styled('div')(({ theme }) => ({
  margin: theme.spacing(3),
}))

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
    } = this.props

    return (
      <div>
        <EditorWrapper>
          <AceEditor
            width="100%"
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
        </EditorWrapper>
        <StyledButton
          type="button"
          variant="contained"
          onClick={cancel}
        >
          Cancel
        </StyledButton>
        <StyledButton
          type="button"
          variant="contained"
          color="primary"
          disabled={false}
          onClick={() => { save(this.state.value) }}
        >
          Save
        </StyledButton>
      </div>
    );
  }
}

export default TextEditor
