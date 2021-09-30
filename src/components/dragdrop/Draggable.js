import React from 'react'

import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'

import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore'

class Draggable extends React.Component {
  render() {
    const {
      isDragging,
      children,
    } = this.props

    return (
      <div style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
      >
        <ListItem>
          <ListItemIcon>
            <UnfoldMoreIcon />
          </ListItemIcon>
          { children }
        </ListItem>
      </div>
    )
  }
}

export default Draggable
