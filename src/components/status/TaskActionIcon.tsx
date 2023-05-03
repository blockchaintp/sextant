import * as React from 'react';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/Update';
import RemoveIcon from '@mui/icons-material/Remove';
import { styled } from '@mui/system';

type Action = 'create' | 'update' | 'delete';

interface TaskActionIconProps {
  action: Action;
  actionLabel: string;
}

const StyledChip = styled(Chip)({
  height: '38px',
  borderRadius: '36px',
});

const TaskActionIcon: React.FC<TaskActionIconProps> = ({
  action,
  actionLabel,
}) => {
  if (action === 'create') {
    return (
      <StyledChip icon={<AddIcon />} label={actionLabel} />
    );
  }
  if (action === 'update') {
    return (
      <StyledChip icon={<UpdateIcon />} label={actionLabel} />
    );
  }
  if (action === 'delete') {
    return (
      <StyledChip icon={<RemoveIcon />} label={actionLabel} />
    );
  }
  return null;
};

export default TaskActionIcon;
