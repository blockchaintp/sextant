import * as React from 'react';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/Update';
import RemoveIcon from '@mui/icons-material/Remove';
import { makeStyles } from '@mui/styles';

type Action = 'create' | 'update' | 'delete';

interface TaskActionIconProps {
  action: Action;
  actionLabel: string;
}

const useStyles = makeStyles((theme) => ({
  chip: {
    height: '38px',
    borderRadius: '36px',
  },
}));

const TaskActionIcon: React.FC<TaskActionIconProps> = ({
  action,
  actionLabel,
}) => {
  const classes = useStyles();

  if (action === 'create') {
    return (
      <Chip className={classes.chip} icon={<AddIcon />} label={actionLabel} />
    );
  }
  if (action === 'update') {
    return (
      <Chip className={classes.chip} icon={<UpdateIcon />} label={actionLabel} />
    );
  }
  if (action === 'delete') {
    return (
      <Chip className={classes.chip} icon={<RemoveIcon />} label={actionLabel} />
    );
  }
  return null;
};

export default TaskActionIcon;
