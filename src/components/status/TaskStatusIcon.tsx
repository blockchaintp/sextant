import * as React from 'react'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import CircularProgressIcon from '@mui/material/CircularProgress'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { Theme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { green } from '@mui/material/colors'

interface TaskStatusIconProps {
  error: string;
  status: 'created' | 'running' | 'finished' | 'error';
}

const useStyles = makeStyles((theme: Theme) => ({
  success: {
    color: green[600],
  },
  error: {
    color: theme.palette.error.dark,
  },
  chip: {
    height: '38px',
    borderRadius: '36px',
  },
  progress: {
    marginLeft: '5px',
  },
}))

const TaskStatusIcon: React.FC<TaskStatusIconProps> = ({
  error,
  status,
}) => {
  const classes = useStyles()
  if (status === 'running' || status === 'created') {
    return (
      <Chip
        className={classes.chip}
        icon={<CircularProgressIcon size={18} />}
        sx={{ paddingLeft: '6px' }}
        label={status}
      />
    )
  }
  if (status === 'error') {
    return (
      <Tooltip title={error}>
        <Chip
          className={classes.chip}
          icon={<ErrorIcon />}
          label="error"
          color="error"
        />
      </Tooltip>
    )
  }
  if (status === 'finished') {
    return (
      <Chip
        className={classes.chip}
        icon={<CheckCircleIcon />}
        label={status}
      />
    )
  }
  return null
}

export default TaskStatusIcon
