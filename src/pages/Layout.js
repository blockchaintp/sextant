import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import SideMenu from 'components/layout//SideMenu'
import AppBarMenu from 'components/layout//AppBarMenu'

const styles = theme => ({
  root: {
    // makes a container that is 100% of veiwport height and relative so children can be absolute
    position: 'relative',
    minHeight: '100vh',
  },
  appbar: {
    flexGrow: 1,
    flex: 1,
  },
  line: {
    marginRight: theme.spacing.unit * 2
  },
  text: {
    flex: 1,
    marginTop: theme.spacing.unit * .5
  },
  logoText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1
  },
  toolbar: {
    margin: theme.spacing.unit * 1
  },
  flex: {
    flex: 1,
  },
  logo: {
    height: '42px',
    marginRight: '20px',
    flex: 0,
  },
  content: {
    height: 'calc(100% - 64px)',
    //minHeight: 'calc(100% - 200px)'
  },
  box: {
    // padding that is the height of the footer - ensures enough space for footer in shared container
    paddingBottom: '4rem'
  },
  footer: {
    // absolute postion within the root container set to the bottom
    position: 'absolute',
    bottom: '0',
    width: '100%',
    height: '4rem'
  },
})

class Layout extends React.Component {

  render() {
    const {
      classes,
      title,
      user,
      sideMenuItems,
      appBarMenuItems,
      openPage,
      children,
      header
    } = this.props

    return (
      <div className={ classes.root }>
        <div className={ classes.appbar }>
          <AppBar position="static">
            <Toolbar className={ classes.toolbar }>
              <SideMenu
                testId='sidemenu'
                user={ user }
                items={ sideMenuItems }
                openPage={ openPage }
              />
              <img src={header.logo} className={ classes.logo } />
              <div className={ classes.logoText }>
              <Typography
                variant="h4"
                color="inherit"
                className={ classes.line }
              >|
              </Typography>
              <Typography
                variant="h5"
                color="inherit"
                className={ classes.text }
              >{header.text}
              </Typography>
              </div>
              <AppBarMenu
                user={ user }
                items={ appBarMenuItems }
                openPage={ openPage }
                classname={ classes.appbarMenu }
              />
            </Toolbar>
          </AppBar>
        </div>
        <div className={ classes.box }>
        <div className={ classes.content }>
          { children }
        </div>
        <div >
          <Toolbar className={ classes.footer }>
            <Typography variant='caption' color='textSecondary'>
              &copy; 2018-2019 <a href="https://blockchaintp.com/" target="_blank">Blockchain Technology Partners</a> All rights reserved : <a href="https://blockchaintp.com/sextant/support" target="_blank">Support page</a>
            </Typography>
          </Toolbar>
        </div>
        </div>
      </div>
    )
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  user: PropTypes.object,
  sideMenuItems: PropTypes.array.isRequired,
  appBarMenuItems: PropTypes.array.isRequired,
  openPage: PropTypes.func.isRequired,
}

export default withStyles(styles)(Layout)
