import React from 'react';
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'

import HorizontalCard from 'components/layout/HorizontalCard'

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

    // returns an array of divs. Each div contains dialog content for a deployment version
    const getDeploymentCards = (deploymentTypes) => {
      let cards = []
      deploymentTypes.forEach((deployment, i) => {
        const versions = deployment.versions
        versions.forEach((version) => {
          cards.push(
            <div key={ i }>
              <DialogContent >
                <HorizontalCard
                  classes={classes}
                  theme={theme}
                  optionIcon={version.icon || "/large-logo-outline-roundel.svg"}
                  optionTitle={version.title}
                  optionVersion={version.version}
                  versionSummary={version.description}
                  onClick={ () => this.clickItem(version) }
                />
              </DialogContent>
            </div>
          )
        })
      })
      return cards
    }

    const deploymentCards = getDeploymentCards(items)

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
          fullWidth={true}
          maxWidth={'md'}
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
