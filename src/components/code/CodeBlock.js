import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  codeblock: {
    width: '100%',
    overflowX: 'auto',
    backgroundColor: '#000',
    color: '#fff',
    fontFamily: 'Courier',
    padding: theme.spacing.unit,
  },
})

class CodeBlock extends React.Component {

  render() {
    const {
      classes,
      code,
      clipboard,
    } = this.props
    return (
      <pre className={ classes.codeblock }>
        <code>
          { code }
        </code>
      </pre>
    )
  }
}

CodeBlock.propTypes = {
  classes: PropTypes.object.isRequired,
  code: PropTypes.string.isRequired,
  clipboard: PropTypes.bool.isRequired, 
}

export default withStyles(styles)(CodeBlock)