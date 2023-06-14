import React from 'react';
import { styled } from '@mui/system';
import {
  Snackbar,
  SnackbarContent,
  IconButton,
} from '@mui/material/'
import { amber, green } from '@mui/material/colors';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

import settings from '../settings';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

interface SnackbarWrapperProps {
  open: boolean;
  text: string;
  type: keyof typeof variantIcon;
  onClose: () => void;
  children: React.ReactNode;
}

const StyledSnackbarContent = styled(SnackbarContent)<{ type: keyof typeof variantIcon }>(
  ({ theme, type }) => ({
    backgroundColor: {
      success: green[600],
      warning: amber[700],
      error: theme.palette.error.dark,
      info: theme.palette.primary.dark,
    }[type],
    margin: theme.spacing(1),
  })
);

const SnackbarWrapper: React.FC<SnackbarWrapperProps> = ({ open, text, type, onClose, children }) => {
  const Icon = variantIcon[type];

  return (
    <div style={{ height: '100%' }}>
      {children}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={settings.snackbarAutoHide}
        onClose={onClose}
      >
        <StyledSnackbarContent
          type={type}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" style={{ display: 'flex', alignItems: 'center' }}>
              {Icon && <Icon style={{ fontSize: 20, opacity: 0.9, marginRight: 8 }} />}
              {text}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              style={{ padding: 4 }}
              onClick={onClose}
              size="large"
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </Snackbar>
    </div>
  );
};

export default SnackbarWrapper;
