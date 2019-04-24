import React from 'react'
import TextField from './Text'

class TextArea extends React.Component {
  render() {

    const props = this.props
    const item = props.item

    const rows = item.rows || inputProps.rows || 5

    const extraProps = Object.assign({}, item.extraProps, {
      multiline: true,
      rows,
    })

    const useItem = Object.assign({}, item, {
      extraProps,
    })

    const useProps = Object.assign({}, props, {
      item: useItem,
    })

    return (
      <TextField
        { ...useProps }
      />
    )
  }
}

export default TextArea