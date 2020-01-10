import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles'
import AceEditor from 'react-ace'
import Button from '@material-ui/core/Button'


import "ace-builds/src-noconflict/mode-jsx";

const languages = [
  "javascript",
  "json",
  "yaml"
];

const themes = [
  "monokai",
];

languages.forEach(lang => {
  require(`ace-builds/src-noconflict/mode-${lang}`);
  require(`ace-builds/src-noconflict/snippets/${lang}`);
});

themes.forEach(theme => require(`ace-builds/src-noconflict/theme-${theme}`));

import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";


const styles = theme => {
  return {
    button: {
      marginRight: theme.spacing.unit * 2,
    },
    editor: {
      margin: theme.spacing.unit * 3,
    },
  }
}

class TextEditor extends Component {

  onChange(newValue) {
    this.setState({
      value: newValue
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.customInput === 0 ? this.props.inputYaml : this.props.customInput
    };
    this.onChange = this.onChange.bind(this);
  }

  render() {
    const {
      cancel,
      save,
      classes,
      customInput
    } = this.props

    return (
      <div>
        <div className={classes.editor}>
          <AceEditor
            width='90%'
            placeholder="Enter custom YAML here."
            mode="yaml"
            theme="monokai"
            name="yamleditor"
            onLoad={this.onLoad}
            onChange={this.onChange}
            value={this.state.value}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              useWorker: false,
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2
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