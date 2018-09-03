import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
})

const SelectInput = ({
  input,
  label,
  type,
  name,
  classes,
  inputProps,
  description,
  meta: { touched, error, warning },
  options,
}) => {

  return (
    <FormControl
      fullWidth
      className={classes.margin}
      aria-describedby={ name + "-helper" }
      error={ touched && error ? true : false }
    >
      <InputLabel 
        htmlFor={ name }>{ label }</InputLabel>
      <Select
        id={ name }
        key={ name }
        value={ input.value }
        onChange={ input.onChange }
        inputProps={{
          name,
          id: name,
        }}
      >
        {
          options.map((option, i) => (
            <MenuItem
              key={ i }
              value={option.value}
            >
              { option.title }
            </MenuItem>
          ))
        }
      </Select>
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

export default withStyles(styles)(SelectInput)