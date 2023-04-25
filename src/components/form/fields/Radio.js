import React from 'react'
import withStyles from '@mui/styles/withStyles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
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

class RadioField extends React.Component {
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
      disabled,
      classes,
    } = this.props

    const title = item.title || name
    const extraProps = item.extraProps || {}

    return (
      <FormControl component="fieldset" className={classes.root}>
        <FormLabel component="legend">{ title }</FormLabel>
        <RadioGroup
          aria-label={title}
          name={name}
          value={value}
          onChange={onChange}
          row={!!item.row}
          _ci={`${name}radio`}
        >
          {
            (item.options || []).map((option, i) => {
              option = typeof (option) === 'string' ? {
                title: option,
                value: option,
              } : option

              return (
                <FormControlLabel
                  key={i}
                  label={option.title}
                  control={(
                    <Radio
                      checked={option.value.toString() === value.toString()}
                      value={option.value}
                      disabled={disabled}
                      {...extraProps}
                    />
                  )}
                />
              )
            })
          }
        </RadioGroup>
        <HelperText
          helperText={item.helperText}
          error={!!error}
          touched={touched}
        />
      </FormControl>
    )
  }
}

export default withStyles(styles)(RadioField)
