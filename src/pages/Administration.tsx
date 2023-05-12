import * as React from 'react'
import { styled } from '@mui/system';
import {
  Paper,
  Grid,
  Typography,
  Button,
} from '@mui/material'

const Wrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
}))

const StyledButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(2),
  margin: theme.spacing(2),
}))

interface AdministrationProps {
  title: string
  onRestart: () => void
}

const Administration: React.FC<AdministrationProps> = ({ title, onRestart }) => {

  return (
    <Wrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={onRestart}
            >
              restart
            </StyledButton>
            <Typography variant="caption" gutterBottom>
              Clicking this button will restart the Sextant application container
            </Typography>
          </StyledPaper>
        </Grid>
      </Grid>
    </Wrapper>
  )
}

export default Administration
