import * as React from 'react'
import { styled } from '@mui/system';
import {
  Paper,
  Grid,
  Typography,
  Button,
} from '@mui/material'
import CodeBlock from '../../components/code/CodeBlock'

interface AccessTokenPageProps {
  accessToken: string
  refreshToken: () => void
  submitting: boolean
  snackbarMessage: () => void
}

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
}))

const StyledButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(2),
}))

const AccessTokenPage: React.FC<AccessTokenPageProps> = ({
  accessToken,
  refreshToken,
  submitting,
  snackbarMessage,
}) => {

  return (
    <Root>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Your Access Token is shown below - use it to access the sextant REST api.
            </Typography>
            <CodeBlock
              code={accessToken}
              clipboard
              snackbarMessage={snackbarMessage}
            />
            <StyledButton
              type="button"
              variant="contained"
              color="primary"
              disabled={submitting}
              onClick={refreshToken}
            >
              Refresh Access Token
            </StyledButton>
          </StyledPaper>
        </Grid>
      </Grid>
    </Root>
  )
}

export default AccessTokenPage
