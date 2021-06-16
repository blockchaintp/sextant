import React from 'react'

import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class Text extends React.Component {
  render() {
    const {
      field: {
        name,
        value,
        onChange,
        onBlur,
      },
      error,
      touched,
      item,
      disabled,
    } = this.props

    const inputProps = item.inputProps || {}
    const extraProps = item.extraProps || {}

    return (
      item.hidden ? (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{item.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              id={name}
              name={name}
              label={item.title || item.id}
              helperText={touched && error ? error : item.helperText}
              error={(touched && Boolean(error)) || item.warning}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              {...inputProps}
              {...extraProps}
            />
          </AccordionDetails>
        </Accordion>
      ) : (
        <TextField
          fullWidth
          id={name}
          name={name}
          label={item.title || item.id}
          helperText={touched && error ? error : item.helperText}
          error={touched && Boolean(error)}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          {...inputProps}
          {...extraProps}
        />
      )

    )
  }
}

export default Text
