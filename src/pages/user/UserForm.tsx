import React from 'react'
import { styled } from '@mui/system'
import {
  Paper,
  Grid,
  Typography,
  Button,
} from '@mui/material'
import { TypographyProps } from '@mui/material/Typography'
import { ButtonProps } from '@mui/material/Button'

import FormWrapper from '../../components/form/Wrapper'

type MethodTuple = [string, string] | [string, string, string];

interface UserFormProps {
  title: string
  submitTitle: string
  submitForm: () => void
  schema: {
    component: string
    helperText: string
    id: string
    title: string
    validate: {
      methods: MethodTuple[]
    }
  }
  initialValues: {
    confirmPassword: string
    password: string
    username: string
    permission: string
  }
  error: () => void
  submitting: boolean
  onCancel: () => void
  dbId: string
}

interface RenderButtonsProps {
  handleSubmit: () => void;  // adjust the type as needed
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

export interface CITypographyProps extends TypographyProps {
  id?: string
}

const CITypography = ({ id, ...rest }: CITypographyProps) => {
  return <Typography {...rest} />
}

export interface CIButtonProps extends ButtonProps {
  id?: string
}

const CIButton = ({ id, ...rest }: CIButtonProps) => {
  return <StyledButton {...rest} />
}

const UserForm: React.FC<UserFormProps> = ({
  title = 'User Details',
  submitTitle = 'Save',
  submitForm,
  schema,
  initialValues,
  error,
  submitting,
  onCancel,
  dbId,
}) => {

  return (
    <Root>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StyledPaper>
            <CITypography id="formheader" variant="h6" gutterBottom>
              { title }
            </CITypography>
            <FormWrapper
              dbId={dbId}
              schema={schema}
              initialValues={initialValues}
              error={error}
              onSubmit={submitForm}
              renderButtons={
                ({
                  handleSubmit,
                }: RenderButtonsProps) => (
                  <>
                    {
                      onCancel && (
                        <StyledButton
                          id="cancelButton"
                          type="button"
                          variant="contained"
                          onClick={onCancel}
                        >
                          Cancel
                        </StyledButton>
                      )
                    }
                    <CIButton
                      id="submitButton"
                      type="button"
                      variant="contained"
                      color="primary"
                      disabled={submitting}
                      onClick={handleSubmit}
                    >
                      { submitTitle }
                    </CIButton>
                  </>

                )
              }
            />
          </StyledPaper>
        </Grid>
      </Grid>
    </Root>
  )
}

export default UserForm
