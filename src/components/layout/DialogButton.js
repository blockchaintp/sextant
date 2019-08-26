import React from 'react';
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import HorizontalCard from 'components/layout/HorizontalCard'
//import hyperledgerSawtoothLogoBlack from'assets/hyperledger-sawtooth-logo-black.svg'
//import logo from 'assets/logo.png'

const styles = (theme) => ({

})

class DialogButton extends React.Component {
  state = {
    open: false,
    items: null
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  clickItem = (item) => {
    const {
      openPage,
    } = this.props

    if(item.items) {
      this.setState({
        items: item.items,
      })
      if(item.handler) {
        item.handler()
      }
      return
    }

    if(typeof(item.handler) === 'string') {
      openPage(item.handler)
      this.handleClose()
    }
    else if(typeof(item.handler) === 'function') {
      item.handler()
      this.handleClose()
    }
    else {
      throw new Error(`unknown AppBarMenu item handler for ${item.title}`)
    }
  }

  render() {
    const {
      classes,
      theme,
      title,
      icon,
      buttonProps,
      disabled,
      items
    } = this.props

    const deploymentCards = items.map((option, i) => {
      return(
        <div key={ i }>
            {option.items.map((version, j) => {
              return(
                <DialogContent key={ j+1 } >
                  <HorizontalCard
                    classes={classes}
                    theme={theme}
                    optionIcon={option.icon || "/large-logo-outline-roundel.svg"}
                    optionTitle={option.title}
                    optionVersion={version.title}
                    versionSummary={version.description}
                    onClick={ () => this.clickItem(version) }
                  />
                </DialogContent>
              )
            })
            }
        </div>
      )
    })

    const deploymentOptions = items.map((option, i) => {
      return(
        <div>
          <DialogTitle key={ i } >{ option.title }</DialogTitle>
          <DialogContent key={ i+1 }>
            {option.items.map((version, i) => {
              return(
                <Button
                  key={ i }
                  onClick={ () => this.clickItem(version) }
                >
                { version.title }
                </Button>
              )
            })
            }
          </DialogContent>
        </div>
      )
    })

    const ButtonIcon = icon

    return (
      <div>
        <Button
          disabled={ disabled }
          {...buttonProps}
          onClick={this.handleClickOpen}
        >
          { title }
          { ButtonIcon && (
            <ButtonIcon />
          ) }
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
        >
          { deploymentCards }
        </Dialog>
      </div>
    )
  }
}

DialogButton.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
}


export default withStyles(styles)(DialogButton)
