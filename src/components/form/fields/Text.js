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
      form,
      error,
      touched,
      item,
      disabled,
    } = this.props

    const inputProps = item.inputProps || {}
    const extraProps = item.extraProps || {}

    const onKeyDown = (e) => {
      if (e.key === 'Enter') {
        form.submitForm()
      }
    }

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
        onKeyDown={ onKeyDown }
        disabled={ disabled }
        { ...inputProps }
        { ...extraProps }
      />
    )
  }
}

export default Text