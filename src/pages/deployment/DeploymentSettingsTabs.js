import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

const styles = theme => ({
  root: {
    
  },
  paper: {
    padding: theme.spacing.unit * 5,
  },
})

const PAGES = [{
  id: 'keys',
  title: 'Permissions',
  index: 0,
}, {
  id: 'damlParties',
  title: 'DAML Parties',
  index: 1,
}, {
  id: 'damlArchives',
  title: 'DAML Archives',
  index: 2,
}, {
  id: 'damlTimeService',
  title: 'DAML Time Service',
  index: 3,
}]

class DeploymentSettings extends React.Component {

  render() {
    const {
      classes,
      cluster,
      id,
      route,
      onViewPage,
      children,
    } = this.props

    const [ _, pageName ] = route.name.split('.')
    const PAGE = PAGES.find(p => p.id == pageName)

    return (
      <div className={ classes.root }>
        <AppBar position="static"  color="default">
          <Tabs
            value={ PAGE.index }
            onChange={ (ev, value) => {
              const NEXT_PAGE = PAGES[value]
              onViewPage(cluster, id, NEXT_PAGE.id)
            }}
            indicatorColor="primary"
            textColor="primary"
          >
            {
              PAGES.map((page, i) => (
                <Tab label={ page.title } key={ i } />
              ))
            }
          </Tabs>
        </AppBar>
        { children }
      </div>
    )
  }
}

DeploymentSettings.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(DeploymentSettings)