import * as React from 'react'
import { styled } from '@mui/system'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'

interface TaskStatusIconProps {
  error: string | null;
  status: 'created' | 'running' | 'finished' | 'error';
}

const StyledChip = styled(Chip)({
  height: '38px',
  borderRadius: '36px',
});

const TaskStatusIcon: React.FC<TaskStatusIconProps> = ({
  error = null,
  status,
}) => {
  if (status === 'running' || status === 'created') {
    return (
      <StyledChip
        icon={<CircularProgress size={18} />}
        sx={{ paddingLeft: '6px' }}
        label={status}
      />
    )
  }
  if (status === 'error') {
    return (
      <Tooltip title={error}>
        <StyledChip
          icon={<ErrorIcon />}
          label="error"
          color="error"
        />
      </Tooltip>
    )
  }
  if (status === 'finished') {
    return (
      <StyledChip
        icon={<CheckCircleIcon />}
        label={status}
      />
    )
  }
  return null
}

export default TaskStatusIcon
