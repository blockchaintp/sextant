import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'

import AddIcon from '@material-ui/icons/AddCircle'
import EditIcon from '@material-ui/icons/Edit'
import RemoveIcon from '@material-ui/icons/RemoveCircle'

const styles = (theme) => ({
  icon: {
    color: theme.palette.text.hint,
  },
})

class TaskActionIcon extends React.Component {
  render() {
    const {
      classes,
      action,
    } = this.props

    if (action === 'create') {
      return (
        <AddIcon
          className={classes.icon}
        />
      )
    }
    if (action === 'update') {
      return (
        <EditIcon
          className={classes.icon}
        />
      )
    }
    if (action === 'delete') {
      return (
        <RemoveIcon
          className={classes.icon}
        />
      )
    }
    return null
  }
}

TaskActionIcon.propTypes = {
  classes: PropTypes.object.isRequired,
  action: PropTypes.oneOf(['create', 'update', 'delete']).isRequired,
}

export default withStyles(styles)(TaskActionIcon)
