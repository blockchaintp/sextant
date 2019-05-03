import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'

import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

const styles = theme => {

  return {
    icon: {
      color: theme.palette.text.hint,
    },
  }
}

class TaskActionIcon extends React.Component {

  render() {
    const {
      classes,
      action,
    } = this.props

    if(action == 'create') {
      return (
        <AddIcon 
          className={ classes.icon }
        />
      )
    }
    else if(action == 'update') {
      return (
        <EditIcon 
          className={ classes.icon }
        />
      )
    }
    else if(action == 'delete') {
      return (
        <DeleteIcon 
          className={ classes.icon }
        />
      )
    }
    else {
      return null
    }
  }
}

TaskActionIcon.propTypes = {
  classes: PropTypes.object.isRequired,
  action: PropTypes.oneOf(['create', 'update', 'delete']).isRequired,
}

export default withStyles(styles)(TaskActionIcon)