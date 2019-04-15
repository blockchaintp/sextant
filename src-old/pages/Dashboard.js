import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'

const styles = theme => {
  return {
    
  }
}

class Dashboard extends React.Component {

  render() {
    return (
      <div>Dashboard</div>
    )
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard)