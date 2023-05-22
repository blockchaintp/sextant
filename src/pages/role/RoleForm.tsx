import React from 'react'
import PropTypes from 'prop-types'
import { styled } from '@mui/system';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  ListItemButton,
  ListItemText,
} from '@mui/material'

import AutoComplete from '../../components/autocomplete/AutoComplete'

interface RenderSuggestionParams {
  suggestion: User;
  query: string;
  getHighlightedText: (text: string, query: string) => string;
  isHighlighted: boolean;
}


export interface User {
  id: number
  permission: string
  username: string
  meta: Object
}

interface RoleFormProps {
  title: string
  open: boolean
  level: string
  search: string | ""
  userList: User[]
  setSearch: (search: string) => void
  setLevel: (level: string) => void
  loadUsers: (search: string) => void
  clearUsers: () => void
  onCancel: () => void
  onConfirm: () => void
}

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  width: '100%',
}))

const Spacer = styled('div')(({ theme }) => ({
  height: theme.spacing(4),
}))

const RoleForm: React.FC<RoleFormProps> = ({
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
}) => {

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="sm"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      onKeyPress={(event) => {
        if (event.key === '13' || event.key === 'Enter') {
          event.preventDefault();
        }
      }}
    >
      <DialogTitle id="alert-dialog-title">
        Add
        {' '}
        { title }
      </DialogTitle>
      <DialogContent>
        <AutoComplete
          suggestions={userList}
          getSuggestionValue={(user: User) => user.username}
          loadSuggestions={loadUsers}
          clearSuggestions={clearUsers}
          value={search}
          onChange={setSearch}
          inputProps={{
            placeholder: 'Search for user',
            label: 'User',
          }}
          renderSuggestion={({
            suggestion,
            query,
            getHighlightedText,
            isHighlighted,
          }: RenderSuggestionParams) => (
            <ListItemButton
              selected={isHighlighted}
              component="div"
            >
              <ListItemText
                primary={getHighlightedText(suggestion.username, query)}
                secondary={suggestion.permission}
              />
            </ListItemButton>
          )}
        />
        <FormHelperText>Search for the user to add access control for</FormHelperText>
        <Spacer />
        <StyledFormControl>
          <InputLabel id="accessLevel">
            Access Level
          </InputLabel>
          <Select
            labelId="accessLevel"
            value={level}
            label="Access Level"
            onChange={(e) => setLevel(e.target.value)}
            displayEmpty
            name="accessLevel"
          >
            <MenuItem value="read">Read</MenuItem>
            <MenuItem value="write">Write</MenuItem>
          </Select>
          <FormHelperText>Set the level of access you want to give this user</FormHelperText>
        </StyledFormControl>
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

export default RoleForm
