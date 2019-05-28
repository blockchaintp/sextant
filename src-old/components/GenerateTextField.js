import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import TextField from './TextField'

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: '1',
  },
  button: {
    flex: '0',
    marginLeft: '20px',
  },
})

const GenerateTextField = ({
  generateValue,
  generateTitle,
  classes,
  ...props,
}) => {
  return (
    <div className={ classes.container }>
      <div className={ classes.input }>
        <TextField {...props} />
      </div>
      <div className={ classes.button }>
        <Button
          color="primary"
          size="small"
          variant="outlined"
          onClick={ () => props.input.onChange(generateValue()) }
          disabled={ props.disabled }
        >
          { generateTitle || 'Generate' }
        </Button>
      </div>
    </div>
  )
}

export default withStyles(styles)(GenerateTextField)