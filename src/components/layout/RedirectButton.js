import React from 'react';

import Button from '@mui/material/Button'

class RedirectButton extends React.Component {
  state = {}

  render() {
    const {
      cluster,
      title,
      onClick,
      icon,
      buttonProps,
      disabled,
    } = this.props

    const ButtonIcon = icon

    return (
      <div>
        <Button
          disabled={disabled}
          {...buttonProps}
          onClick={() => onClick(cluster)}
        >
          {title}
          {ButtonIcon && (
            <ButtonIcon />
          )}
        </Button>
      </div>
    )
  }
}

export default RedirectButton
