import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';

import Tooltip from '@mui/material/Tooltip'
import Fab from '@mui/material/Fab'
import ClipboardIcon from '@mui/icons-material/FileCopy'

import { CopyToClipboard } from 'react-copy-to-clipboard'

const styles = (theme) => ({
  codeblock: {
    width: '100%',
    overflowX: 'auto',
    backgroundColor: '#000',
    color: '#fff',
    fontFamily: 'Courier',
    fontSize: '0.8em',
    padding: theme.spacing(1),
    minHeight: '48px',
  },
  root: {
    position: 'relative',
  },
  clipboardButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  fab: {
    width: '30px',
    height: '30px',
    minHeight: '30px',
  },
  icon: {
    width: '15px',
    height: '15px',
  },
})

/*

        <Tooltip title="Copy to clipboard" placement="top">
            <CopyToClipboard
              text={ code }
              onCopy={() => {
                //snackbar.setMessage('Copied to clipboard')
                console.log('--------------------------------------------')
                console.log('copied')
              }}
            >

            </CopyToClipboard>
          </Tooltip>

*/
class CodeBlock extends React.Component {
  render() {
    const {
      classes,
      code,
      clipboard,
      snackbarMessage,
    } = this.props

    return (
      <div className={classes.root}>
        {
          clipboard && (
            <div className={classes.clipboardButton}>
              <CopyToClipboard
                text={code}
                onCopy={() => {
                  snackbarMessage('Copied to clipboard')
                }}
              >
                <Tooltip title="Copy to clipboard" placement="top">
                  <Fab
                    size="small"
                    color="secondary"
                    aria-label="Add"
                    className={classes.fab}
                  >
                    <ClipboardIcon
                      className={classes.icon}
                    />
                  </Fab>
                </Tooltip>
              </CopyToClipboard>
            </div>
          )
        }
        <pre className={classes.codeblock}>
          <code>
            { code }
          </code>
        </pre>
      </div>

    )
  }
}

CodeBlock.propTypes = {
  classes: PropTypes.object.isRequired,
  code: PropTypes.string.isRequired,
  clipboard: PropTypes.bool.isRequired,
  snackbarMessage: PropTypes.func.isRequired,
}

export default withStyles(styles)(CodeBlock)
