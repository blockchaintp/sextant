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
      disabled,
      classes,
    } = this.props

    const title = item.title || name
    const extraProps = item.extraProps || {}

    return (
      <FormControl component="fieldset" className={classes.root}>
        <FormLabel component="legend">{ title }</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={(
              <Checkbox
                name={name}
                checked={!!value}
                onChange={onChange}
                disabled={disabled}
                value={name}
                {...extraProps}
              />
            )}
            label={title}
          />
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

export default withStyles(styles)(CheckboxField)
