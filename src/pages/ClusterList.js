import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'

import settings from '../settings'
import store from '../store'
import siteModule from '../store/site'
import fileModule from '../store/file'
import userModule from '../store/user'

import withRouter from '../utils/withRouter'

import GenericTable from '../components/GenericTable'

const styles = theme => {
  return {
    folderLink: {
      color: theme.palette.primary.main,
      fontWeight: 'bold',
      cursor: 'pointer',
    },
  }

}

@connectStore({
  site: siteModule,
  file: fileModule,
  user: userModule,
})
@withRouter()
class ClusterList extends React.Component {
  
  componentDidMount(){
    this.props.site.loadList()
    this.props.site.setSelected([])
  }

  render() {
    const { classes, site, user, file } = this.props
  
    const fields =[{
      title: 'Name',
      name: 'name',
    },{
      title: 'URL',
      name: 'url',
    },{
      title: 'Drive Folder',
      name: 'folderid',
    }]

    const data = site.listData.map(website => {
      return {
        id: website.id,
        name: website.name,
        url: website.meta.url,
        folderid: (
          <a 
            className={ classes.folderLink } 
            onClick={ () => file.openDriveFile(website.meta.folderId, 'folder') }
          >
            { website.meta.folderId }
          </a>
        )
      }
    })

    return (
      <GenericTable
        title="Website"
        data={ data }
        fields={ fields }
        selected={ site.selected }
        setSelected={ site.setSelected }
        onAdd={ site.add }
        onEdit={ site.edit }
        onDelete={ site.delete }
        getOptions={ () => null }
      /> 
    )
  }
}

ClusterList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClusterList)