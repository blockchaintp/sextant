import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'

import settings from '../settings'
import store from '../store'
import clusterModule from '../store/cluster'

import withRouter from '../utils/withRouter'

import GenericTable from '../components/GenericTable'

const styles = theme => {
  return {
    
  }

}

@connectStore({
  cluster: clusterModule,
})
class ClusterList extends React.Component {
  
  componentDidMount(){
    this.props.cluster.loadList()
  }

  render() {
    const { classes, cluster } = this.props
  
    const fields =[{
      title: 'Id',
      name: 'id',
    },{
      title: 'Name',
      name: 'name',
    }]

    const data = cluster.list.map(clusterData => {
      return {
        id: clusterData.id,
        name: clusterData.name,
      }
    })

    return (
      <GenericTable
        title="Cluster"
        noSelect
        data={ data }
        fields={ fields }
        onAdd={ cluster.add }
        onEdit={ () => null }
        onDelete={ () => null }
        getOptions={ () => null }
      /> 
    )
  }
}

ClusterList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClusterList)