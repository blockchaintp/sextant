import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import HelperText from './HelperText'

const styles = theme => ({
  root: {
    display: 'flex',
    marginTop: theme.spacing.unit * 2,
  },
})

class CheckboxField extends React.Component {
  render() {
    const {
      field: {
        name,
        value,
        onChange,
      },
      error,
      touched,
      item,
      classes,
    } = this.props

    const title = item.title || name

    return (
      <FormControl component="fieldset" className={ classes.root }>
        <FormLabel component="legend">{ title }</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                name={ name }
                checked={ value ? true : false }
                onChange={ onChange }
                value={ name }
              />
            }
            label={ title }
          />
        </FormGroup>
        <HelperText
          helperText={ item.helperText }
          error={ error }
          touched={ touched }
        />
      </FormControl>
    )
  }
}

export default withStyles(styles)(CheckboxField)