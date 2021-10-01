import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import withStyles from '@mui/styles/withStyles';
import Snackbar from '@mui/material/Snackbar'
import SnackbarContent from '@mui/material/SnackbarContent'
import IconButton from '@mui/material/IconButton'

import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import ErrorIcon from '@mui/icons-material/Error'
import InfoIcon from '@mui/icons-material/Info'

import { amber, green } from '@mui/material/colors'

import settings from 'settings'

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
}

const styles = (theme) => ({
  fullHeight: {
    height: '100%',
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  close: {
    padding: theme.spacing(0.5),
  },
  success: {
    backgroundColor: green[600],
  },
  warning: {
    backgroundColor: amber[700],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  margin: {
    margin: theme.spacing(1),
  },
})

class SnackbarWrapper extends React.Component {
  render() {
    const {
      classes,
      open,
      text,
      type,
      onClose,
      children,
    } = this.props

    const Icon = variantIcon[type]

    return (
      <div className={classes.fullHeight}>
        { children }
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={open}
          autoHideDuration={settings.snackbarAutoHide}
          onClose={onClose}
        >
          <SnackbarContent
            className={classNames(classes[type], classes.margin)}
            aria-describedby="client-snackbar"
            message={(
              <span id="client-snackbar" className={classes.message}>
                {
                  Icon && (
                    <Icon
                      className={classNames(classes.icon, classes.iconVariant)}
                    />
                  )
                }
                { text }
              </span>
            )}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={onClose}
                size="large">
                <CloseIcon />
              </IconButton>,
            ]}
          />
        </Snackbar>
      </div>
    );
  }
}

SnackbarWrapper.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default withStyles(styles)(SnackbarWrapper)
