import React from 'react'
import withStyles from '@mui/styles/withStyles';
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import HelperText from './HelperText'

const styles = (theme) => ({
  root: {
    display: 'flex',
    marginTop: theme.spacing(2),
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
      <FormControl component="fieldset" className={classes.root}>
        <FormLabel component="legend">{ title }</FormLabel>
        <FormGroup
          row={!!item.row}
        >
          {
            (item.options || []).map((option, i) => {
              option = typeof (option) === 'string' ? {
                title: option,
                value: option,
              } : option

              const checked = !!useValue[option.value]

              return (
                <FormControlLabel
                  key={i}
                  control={(
                    <Checkbox
                      name={`${name}-${i}`}
                      checked={checked}
                      disabled={disabled}
                      onChange={() => {
                        const newValue = { ...useValue }
                        if (!checked) {
                          newValue[option.value] = true
                        } else {
                          delete (newValue[option.value])
                        }
                        setFieldValue(name, newValue)
                      }}
                      value={`${name}-${i}`}
                      {...extraProps}
                    />
                  )}
                  label={option.title}
                />
              )
            })
          }
        </FormGroup>
        <HelperText
          helperText={item.helperText}
          error={!!error}
          touched={touched}
        />
      </FormControl>
    )
  }
}

export default withStyles(styles)(MultipleCheckboxField)
