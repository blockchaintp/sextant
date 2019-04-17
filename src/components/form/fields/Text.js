import React from 'react'
import TextField from '@material-ui/core/TextField'

class Text extends React.Component {
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
    } = this.props

    const inputProps = item.inputProps || {}
    const extraProps = item.extraProps || {}

    return (
      <TextField
        fullWidth
        id={ name }
        name={ name }
        label={ item.title || item.id }
        helperText={ touched && error ? error : item.helperText }
        error={ touched && Boolean(error) }
        value={ value || '' }
        onChange={ onChange }
        onBlur={ onBlur }
        { ...inputProps }
        { ...extraProps }
      />
    )
  }
}

export default Text