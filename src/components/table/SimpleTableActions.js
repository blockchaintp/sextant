import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';

import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

const styles = () => ({
  root: {
    whiteSpace: 'nowrap',
  },
})

class SimpleTableActions extends React.Component {
  render() {
    const { classes, item, actions } = this.props

    return (
      <div className={classes.root}>
        {
          actions
            .filter((action) => {
              if (action.shouldDisplay) return action.shouldDisplay(item)
              return true
            })
            .map((action, i) => {
              const IconClass = action.getIcon ? action.getIcon(item) : action.icon
              const title = action.getTitle ? action.getTitle(item) : action.title
              const visibility = action.disabled ? action.disabled : false

              const button = (
                <IconButton
                  _ci={`${item.username}${title}`}
                  id={`action_${item.username || item.name}${title}`}
                  onClick={(event) => {
                    event.stopPropagation()
                    if (action.handler) {
                      action.handler(item)
                    }
                  }}
                  disabled={visibility}
                  style={action.style}
                  size="large"
                >
                  <IconClass />
                </IconButton>
              )

              const renderButton = action.wrapButton ? action.wrapButton(button, item) : button
              return (
                <Tooltip disableFocusListener key={i} title={title}>
                  { renderButton }
                </Tooltip>
              )
            })
        }
      </div>
    );
  }
}

SimpleTableActions.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SimpleTableActions)
