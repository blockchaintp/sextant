/* eslint-disable import/no-unresolved */
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import withStyles from '@mui/styles/withStyles';
import { Helmet } from 'react-helmet'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import SideMenu from 'components/layout/SideMenu'
import AppBarMenu from 'components/layout/AppBarMenu'
import Loading from 'components/system/Loading'

import favIcon from '../assets/small-logo-blue.png'

const styles = (theme) => ({
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
    marginRight: theme.spacing(2),
  },
  text: {
    flex: 1,
    marginTop: theme.spacing(0.5),
  },
  logoText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  toolbar: {
    margin: theme.spacing(1),
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
    // minHeight: 'calc(100% - 200px)'
  },
  box: {
    // padding that is the height of the footer -
    // ensures enough space for footer in shared container
    paddingBottom: '4rem',
    // minHeight: 'calc(100vh - 4rem)',
  },
  footer: {
    // absolute postion within the root container set to the bottom
    position: 'absolute',
    bottom: '0',
    width: '100%',
    height: '4rem',
  },
  globalLoadingContainer: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  globalLoading: {
    width: '200px',
    textAlign: 'center',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '20px',
  },
})

class Layout extends React.Component {
  render() {
    const {
      classes,
      user,
      sideMenuItems,
      appBarMenuItems,
      openPage,
      children,
      header,
      globalLoading,
    } = this.props

    return (
      <div className={classnames(classes.root, 'main-layout-root')}>
        <Helmet>
          <link rel="shortcut icon" type="image/png" href={favIcon} />
        </Helmet>
        <div className={classnames(classes.appbar, 'main-layout-appbar')}>
          <AppBar position="static">
            <Toolbar className={classes.toolbar}>
              <SideMenu
                _ci="sidemenu"
                user={user}
                items={sideMenuItems}
                openPage={openPage}
              />
              <img src={header.logo} alt="" className={classes.logo} />
              <div className={classes.logoText}>
                <Typography
                  variant="h4"
                  color="inherit"
                  className={classes.line}
                >
                  |
                </Typography>
                <Typography
                  variant="h5"
                  color="inherit"
                  className={classes.text}
                >
                  {header.text}
                </Typography>
              </div>
              <AppBarMenu
                user={user}
                items={appBarMenuItems}
                openPage={openPage}
                classname={classes.appbarMenu}
              />
            </Toolbar>
          </AppBar>
        </div>
        <div className={classnames(classes.box, 'main-layout-box')}>
          <div className={classnames(classes.content, 'main-layout-content')}>
            { children }
          </div>
          <div className={classnames('main-layout-footer')}>
            <Toolbar className={classes.footer}>
              <Typography variant="caption" color="textSecondary">
                &copy; 2018-2022
                {' '}
                <a href="https://blockchaintp.com/" target="_blank" rel="noreferrer">Blockchain Technology Partners</a>
                {' '}
                All rights reserved :
                {' '}
                <a href="https://blockchaintp.com/sextant/support" target="_blank" rel="noreferrer">Support page</a>
              </Typography>
            </Toolbar>
          </div>
        </div>
        {
          globalLoading && (
            <div className={classes.globalLoadingContainer}>
              <div className={classes.globalLoading}>
                <Loading />
              </div>
            </div>
          )
        }
      </div>
    )
  }
}

Layout.defaultProps = {
  user: {},
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
  sideMenuItems: PropTypes.array.isRequired,
  appBarMenuItems: PropTypes.array.isRequired,
  openPage: PropTypes.func.isRequired,
}

export default withStyles(styles)(Layout)
