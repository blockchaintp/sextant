import * as React from 'react'
import { styled } from '@mui/system';
import {
  CircularProgress,
  Typography,
  Paper,
  Grid,
} from '@mui/material'

const StyledContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}))

const StyledItem = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
}))

const RestartWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
})

interface RestartingProps {
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  message: string
}

const Restarting: React.FC<RestartingProps> = ({ color, message }) => {

  return (
    <StyledContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledPaper>
            <RestartWrapper>
              <CircularProgress
                color={color}
              />
              {
              message && (
                <StyledItem
                  variant="subtitle1"
                  color={color}
                >
                  {message}
                </StyledItem>
              )
            }
            </RestartWrapper>
          </StyledPaper>
        </Grid>
      </Grid>
    </StyledContainer>
  )
}

export default Restarting
