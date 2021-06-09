import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import FormLabel from '@material-ui/core/FormLabel';

import HelperText from './HelperText'

const styles = (theme) => ({
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
      disabled,
      formProps,
    } = this.props

    // filter through the consensus options, find the selected consensus, return the corresponding blurb
    const blurbText = (selectedConsensus) => {
      for (let i = 0; i < item.options.length; i += 1) {
        if (item.options[i].value === selectedConsensus) {
          return item.options[i].blurb
        }
      }
      return undefined;
    }

    const title = item.title || name
    const extraProps = item.extraProps || {}

    return (
      <FormControl component="fieldset" className={classes.root} error={!!(touched && error)}>
        <FormLabel htmlFor={name}>{ title }</FormLabel>
        <Select
          _ci={name}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
          inputProps={{
            name,
            id: name,
          }}
          {...extraProps}
        >
          {
            (item.options || []).map((option, i) => {
              option = typeof (option) === 'string' ? {
                title: option,
                value: option,
              } : option

              return (
                <MenuItem
                  key={i}
                  value={option.value}
                >
                  { option.title }
                </MenuItem>
              )
            })
          }
        </Select>
        <HelperText
          helperText={error || (item.alternateText ? blurbText(formProps.values.sawtooth.consensus) : item.helperText)}
          error={!!error}
          touched={touched}
        />

      </FormControl>
    )
  }
}

export default withStyles(styles)(SelectField)
