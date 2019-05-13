import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
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

class RadioField extends React.Component {
  render() {
    const {
      field: {
        name,
        value,
        onChange,
        onBlur
      },
      error,
      touched,
      item,
      classes,
    } = this.props

    const title = item.title || name
    const extraProps = item.extraProps || {}

    return (
      <FormControl component="fieldset" className={ classes.root }>
        <FormLabel component="legend">{ title }</FormLabel>
        <RadioGroup
          aria-label={ title }
          name={ name }
          value={ value }
          onChange={ onChange }
          row={ item.row ? true : false }
        >
          {
            (item.options || []).map((option, i) => {
              option = typeof(option) === 'string' ? {
                title: option,
                value: option,
              } : option

              return (
                <FormControlLabel
                  key={ i }
                  label={ option.title }
                  control={
                    <Radio 
                      checked={ option.value == value }
                      value={ option.value }
                      { ...extraProps } 
                    />
                  }
                />
              )
            })
          }
        </RadioGroup>
        <HelperText
          helperText={ item.helperText }
          error={ error ? true : false }
          touched={ touched }
        />
      </FormControl>
    )
  }
}

export default withStyles(styles)(RadioField)