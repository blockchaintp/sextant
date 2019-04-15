import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'

import HelperText from './HelperText'

const styles = theme => ({
  root: {
    display: 'flex',
    marginTop: theme.spacing.unit * 2,
  },
})

class SelectField extends React.Component {

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
        <InputLabel htmlFor={ name }>{ title }</InputLabel>
        <Select
          value={ value || '' }
          onChange={ onChange }
          inputProps={{
            name,
            id: name,
          }}
        >
          {
            (item.options || []).map((option, i) => {
              option = typeof(option) === 'string' ? {
                title: option,
                value: option,
              } : option

              return (
                <MenuItem
                  key={ i }
                  value={ option.value }
                >
                  { option.title }
                </MenuItem>
              )
            })
          }
        </Select>
        <HelperText
          helperText={ item.helperText }
          error={ error }
          touched={ touched }
        />
      </FormControl>
    )
  }
}

export default withStyles(styles)(SelectField)