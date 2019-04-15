import React from 'react'
import TextField from './Text'

class TextArea extends React.Component {
  render() {

    const props = this.props
    const item = props.item
    const inputProps = props.inputProps || {}

    inputProps.multiline = true
    inputProps.rows = item.rows || inputProps.rows || 5

    return (
      <TextField
        { ...props }
        inputProps={ inputProps }
      />
    )
  }
}

export default TextArea