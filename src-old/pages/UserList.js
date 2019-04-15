import React from 'react'
import PropTypes from 'prop-types'
import { connectStore } from 'redux-box'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { lighten } from '@material-ui/core/styles/colorManipulator'

import CircularProgress from '@material-ui/core/CircularProgress'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

import settings from '../settings'
import userModule from '../store/user'
import authModule from '../store/auth'
import snackbarModule from '../store/snackbar'

import withRouter from '../utils/withRouter'

import GenericTable from '../components/GenericTable'
import ConfirmDeleteUserDialog from '../components/ConfirmDeleteUserDialog'

const styles = theme => {
  return {
    progressContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    progress: {
      margin: theme.spacing.unit * 2,
    },
    deleteConfirmTextBox: {
      width: '100%'
    }
  }

}

@connectStore({
  user: userModule,
  auth: authModule,
  snackbar: snackbarModule,
})
class UserList extends React.Component {
  
  state = {
    deleteUser: null,
  }

  componentDidMount(){
    this.props.user.loadList()
  }

  onDeleteClick(ids) {
    const { 
      user,
      auth,
      snackbar,
    } = this.props
    const id = ids[0]
    if(id == auth.userData.username) {
      snackbar.setError(`You cannot delete yourself`)
      return
    }
    const deleteUser = user.list.filter(u => u.username == id)[0]
    this.setState({
      deleteUser,
    })
  }

  onDeleteClose() {
    this.setState({
      deleteUser: null,
    })
  }

  onDeleteConfirm() {
    const { 
      user,
    } = this.props
    user.delete(this.state.deleteUser.username)
    this.onDeleteClose()
  }

  render() {
    const { 
      classes,
      user,
      auth,
    } = this.props
  
    const fields =[{
      title: 'Username',
      name: 'id',
    },{
      title: 'Type',
      name: 'type',
    }]

    const currentUserData = auth.userData || {}

    const data = user.list.map(userData => {
      return {
        id: `${userData.username}`,
        type: `${userData.type} ${userData.username == currentUserData.username ? ' (you)' : ''}`,
      }
    })

    return (
      <div>
        <ConfirmDeleteUserDialog
          user={ this.state.deleteUser }
          onClose={ this.onDeleteClose.bind(this) }
          onConfirm={ this.onDeleteConfirm.bind(this) }
        />
        <GenericTable
          title="User"
          noSelect
          data={ data }
          fields={ fields }
          onAdd={ user.add }
          tooltips={{
            edit: 'View'
          }}
          onEdit={ (id) => user.edit(id) }
          getOptions={ () => null }
          onDeleteClick={ this.onDeleteClick.bind(this) }
        />
      </div>
    )
  }
}

UserList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserList)