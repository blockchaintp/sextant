import React from 'react';

import withStyles from '@mui/styles/withStyles';
import Button from '@mui/material/Button'

const styles = () => ({

})

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

export default withStyles(styles)(RedirectButton)
