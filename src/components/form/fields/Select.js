import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import FormLabel from '@material-ui/core/FormLabel';

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
      disabled,
      formProps
    } = this.props

    const selectedConsensus = formProps.values.sawtooth.consensus
    // returns the helper text associated with the selected consensus algorithm
    const blurbText = () => {
      for (let i = 0; i < item.options.length; i ++) {
        if (item.options[i].value === selectedConsensus)
        return item.options[i].blurb
      }
    }

    const title = item.title || name
    const extraProps = item.extraProps || {}
    console.log("Do I have formProps?", this.props.formProps);
    return (
      <FormControl component="fieldset" className={ classes.root }>
        <FormLabel htmlFor={ name }>{ title }</FormLabel>
        <Select
          value={ value || '' }
          onChange={ onChange }
          disabled={ disabled }
          inputProps={{
            name,
            id: name,
          }}
          { ...extraProps }
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
        {item.alternateText ? (
          <HelperText helperText={ blurbText() }
            error={ error ? true : false }
            touched={ touched }>
            </HelperText>) : (
          <HelperText
          helperText={ item.helperText }
          error={ error ? true : false }
          touched={ touched }
        />
      )}

      </FormControl>
    )
  }
}

export default withStyles(styles)(SelectField)
