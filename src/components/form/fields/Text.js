import React from 'react'

import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
