import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'

import settings from '../settings'
import clusterModule from '../store/cluster'

const styles = theme => {
  return {
    
  }

}

@connectStore({
  cluster: clusterModule,
})
class ClusterAddExisting extends React.Component {
  
  render() {
    const { classes, cluster } = this.props

    return (
      <div>
        Add existing
      </div>
    )
  }
}

ClusterAddExisting.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClusterAddExisting)