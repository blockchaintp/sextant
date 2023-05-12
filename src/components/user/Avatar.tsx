import React from 'react'
import { styled } from '@mui/system';
import {
  Avatar,
  Chip,
} from '@mui/material'
import { Theme } from '@mui/material/styles'
import settings from '../../settings'

const UserIcon = settings.icons.user

const StyledChip = styled(Chip)(({ theme }) => ({
  cursor: 'pointer',
  margin: theme.spacing(1),
}))

const chipStyles = {
  '& .MuiAvatar-root': (theme: Theme) => ({
    color: theme.palette.primary.main,
    backgroundColor: `${theme.palette.getContrastText(theme.palette.primary.main)} !important`,
  }),
  '& .MuiChip-label': (theme: Theme) => ({
    color: theme.palette.getContrastText(theme.palette.primary.main),
    textTransform: 'none !important',
  }),
  '&.MuiChip-outlined': (theme: Theme) => ({
    borderColor: `${theme.palette.getContrastText(theme.palette.primary.main)} !important`,
  }),
}

interface UserAvatarProps {
  user: {
    username: string,
  },
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {

  return (
    <StyledChip
      variant="outlined"
      avatar={(
        <Avatar>
          <UserIcon color="primary" />
        </Avatar>
      )}
      label={user.username}
      sx={chipStyles}
    />
  )
}

export default UserAvatar
