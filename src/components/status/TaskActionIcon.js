import React from 'react'
import PropTypes from 'prop-types'

import withStyles from '@mui/styles/withStyles';

import AddIcon from '@mui/icons-material/AddCircle'
import EditIcon from '@mui/icons-material/Edit'
import RemoveIcon from '@mui/icons-material/RemoveCircle'

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
