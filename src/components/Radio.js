import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
})

class RadioField extends React.Component {

  render() {
    const {
      input,
      label,
      type,
      name,
      classes,
      inputProps,
      description,
      disabled,
      meta: { touched, error, warning },
      options,
    } = this.props

    const value = input.value || []

    return (
      <FormControl 
        component="fieldset"
        className={classes.formControl}
      >
        <FormLabel component="legend">{ label }</FormLabel>
        <RadioGroup
          aria-label={ label }
          name={ name }
          className={ classes.group }
          value={ input.value }
          onChange={ input.onChange }
        >
          {
            options.map((option, i) => (
              <FormControlLabel 
                key={ i }
                value={ option.value }
                control={
                  <Radio 
                    disabled={ this.props.disabled } 
                  />
                }
                label={ option.title }
              />
            ))
          }
        </RadioGroup>
        {
          touched && error ? (
            <FormHelperText id={ name + "-helper" }>
              { error }
            </FormHelperText>
          ) : null
        }
        {
          description ? (
            <FormHelperText error={ false } id={ name + "-description" }>
              { description }
            </FormHelperText>
          ) : null
        }
      </FormControl>
    )
  }
}

export default withStyles(styles)(RadioField)