import React from 'react'
import { styled } from '@mui/system';
import {
  Paper,
  Grid,
  Typography,
  Button,
} from '@mui/material'

import FormWrapper from 'components/form/Wrapper'

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}))

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}))
class Login extends React.Component {
  render() {
    const {
      login,
      error,
      loading,
      initialValues,
      schema,
    } = this.props

    return (
      <Root>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Login
              </Typography>
              <FormWrapper
                schema={schema}
                initialValues={initialValues}
                error={error}
                onSubmit={login}
                renderButtons={
                  ({
                    handleSubmit,
                  }) => (
                    <Button
                      _ci="submitButton"
                      id="submitButton"
                      type="button"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      onClick={handleSubmit}
                    >
                      Login
                    </Button>
                  )
                }
              />
            </StyledPaper>
          </Grid>
        </Grid>
      </Root>
    )
  }
}

export default Login
