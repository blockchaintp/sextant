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

class MultipleCheckboxField extends React.Component {

  render() {
    const {
      field: {
        name,
        value,
      },
      form: {
        setFieldValue,
      },
      error,
      touched,
      item,
      disabled,
      classes,
    } = this.props

    const title = item.title || name
    const useValue = value || {}
    const extraProps = item.extraProps || {}

    return (
      <FormControl component="fieldset" className={ classes.root }>
        <FormLabel component="legend">{ title }</FormLabel>
        <FormGroup
          row={ item.row ? true : false }
        >
          {
            (item.options || []).map((option, i) => {
              option = typeof(option) === 'string' ? {
                title: option,
                value: option,
              } : option

              const checked = useValue[option.value] ? true : false

              return (
                <FormControlLabel
                  key={ i }
                  control={
                    <Checkbox
                      name={ `${name}-${i}` }
                      checked={ checked }
                      disabled={ disabled }
                      onChange={ () => {
                        const newValue = Object.assign({}, useValue)
                        if(!checked) {
                          newValue[option.value] = true
                        }
                        else {
                          delete(newValue[option.value])
                        }
                        setFieldValue(name, newValue)
                      }}
                      value={ `${name}-${i}` }
                      { ...extraProps }
                    />
                  }
                  label={ option.title }
                />
              )
            })
          }
        </FormGroup>
        <HelperText
          helperText={ item.helperText }
          error={ error ? true : false }
          touched={ touched }
        />
      </FormControl>
    )
  }
}

export default withStyles(styles)(MultipleCheckboxField)