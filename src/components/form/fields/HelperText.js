import React from 'react'
import FormHelperText from '@mui/material/FormHelperText'

class HelperText extends React.Component {
  render() {
    const {
      helperText,
      error,
      touched,
    } = this.props

    if (!error && !helperText) return null

    const hasError = touched && error

    return (
      <FormHelperText
        error={hasError}
      >
        { helperText }
      </FormHelperText>
    )
  }
}

export default HelperText
