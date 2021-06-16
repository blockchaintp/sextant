import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const styles = (theme) => ({
  toolbarRoot: {
    paddingRight: theme.spacing(1),
  },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    display: 'flex',
    justifyContent: 'right',
    alignItems: 'flex-end',
  },
  title: {
    // flex: '0 0 auto',
  },
})

class SimpleTableHeader extends React.Component {
  render() {
    const {
      classes,
      className,
      title,
      getTitle,
      getActions,
      titleVariant,
      titleClassname,
    } = this.props

    const useClassname = `${classes.toolbarRoot} ${className || ''}`

    return (
      <Toolbar
        className={useClassname}
      >
        <div className={classes.title}>
          {
            getTitle ? (
              getTitle()
            ) : (
              <Typography noWrap className={titleClassname} variant={titleVariant || 'h6'}>{ title }</Typography>
            )
          }
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {
            getActions ? getActions() : null
          }
        </div>
      </Toolbar>
    )
  }
}

SimpleTableHeader.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SimpleTableHeader)
