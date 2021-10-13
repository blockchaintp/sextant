import React from 'react'
import PropTypes from 'prop-types'

import Chip from '@mui/material/Chip'
import withStyles from '@mui/styles/withStyles'

import AddIcon from '@mui/icons-material/AddCircle'
import UpdateIcon from '@mui/icons-material/Update'
import RemoveIcon from '@mui/icons-material/RemoveCircle'

const styles = (theme) => ({
  icon: {
    color: theme.palette.text.disabled,
  },
  chip: {
    height: '38px',
    borderRadius: '36px',
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
        <Chip className={classes.chip} icon={<AddIcon />} label={action} />
      )
    }
    if (action === 'update') {
      return (
        <Chip className={classes.chip} icon={<UpdateIcon />} label={action} />
      )
    }
    if (action === 'delete') {
      return (
        <Chip className={classes.chip} icon={<RemoveIcon />} label={action} />
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
