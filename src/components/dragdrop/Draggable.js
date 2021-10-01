import React from 'react'

import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'

import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'

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
