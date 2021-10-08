import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'

import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import AutoComplete from 'components/autocomplete/AutoComplete';

const styles = (theme) => ({
  formControl: {
    width: '100%',
    marginBottom: theme.spacing(1),
  },
  spacer: {
    height: theme.spacing(4),
  },
})

class RoleForm extends React.Component {
  render() {
    const {
      classes,
      title,
      open,
      level,
      search,
      userList,
      setSearch,
      setLevel,
      loadUsers,
      clearUsers,
      onCancel,
      onConfirm,
    } = this.props

    return (
      <Dialog
        open={open}
        onClose={onCancel}
        fullWidth
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Add
          {' '}
          { title }
        </DialogTitle>
        <DialogContent>
          <AutoComplete
            suggestions={userList}
            getSuggestionValue={(user) => user.username}
            loadSuggestions={loadUsers}
            clearSuggestions={clearUsers}
            value={search}
            onChange={setSearch}
            inputProps={{
              placeholder: 'Search for user',
              label: 'User',
            }}
            highlightClasses={{
              highlight: classes.highlightText,
              normal: classes.normalText,
            }}
            renderSuggestion={({
              suggestion,
              query,
              getHighlightedText,
              isHighlighted,
            }) => (
              <ListItem
                selected={isHighlighted}
                component="div"
              >
                <ListItemText
                  primary={getHighlightedText(suggestion.username, query)}
                  secondary={suggestion.permission}
                />
              </ListItem>
            )}
          />
          <FormHelperText>Search for the user to add access control for</FormHelperText>
          <div className={classes.spacer} />
          <FormControl className={classes.formControl}>
            <InputLabel>
              Access Level
            </InputLabel>
            <Select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              displayEmpty
              name="accessLevel"
            >
              <MenuItem value="read">Read</MenuItem>
              <MenuItem value="write">Write</MenuItem>
            </Select>
            <FormHelperText>Set the level of access you want to give this user</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            color="primary"
            autoFocus
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

RoleForm.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
}

export default withStyles(styles)(RoleForm)
