import React from 'react'
import TextField from './Text'

class TextArea extends React.Component {
  render() {
    const { props } = this
    const { item } = props

    const rows = item.rows || props.rows || 5

    const extraProps = {
      ...item.extraProps,
      multiline: true,
      rows,
    }

    const useItem = { ...item, extraProps }

    const useProps = { ...props, item: useItem }

    return (
      <TextField
        {...useProps}
      />
    )
  }
}

export default TextArea
