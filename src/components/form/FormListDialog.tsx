import * as React from 'react'
import { styled } from '@mui/system'
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    } from '@mui/material'
import { ButtonProps } from '@mui/material/Button'
import FormWrapper from "./Wrapper"

type FormListDialogProps = {
    open: boolean
    onCancel: () => void
    onSave: (values?: any) => void
    schema: unknown
    initialValues: unknown
    title: string
}

export interface CIButtonProps extends ButtonProps {
  _ci?: string
}

const StyledButton = styled(Button)(({ theme }) => ({
    marginRight: theme.spacing(2),
  }))

const CIButton = ({ _ci, ...rest }: CIButtonProps) => {
  return <StyledButton {...rest} />;
}

const FormListDialogInner: React.FC<FormListDialogProps> = ({
    open,
    onCancel,
    onSave,
    schema,
    initialValues,
    title,
}) => {

    return (
    <Dialog
        open={open}
        onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id={title.replace(/\s+/g, '')}>{ title }</DialogTitle>
        <DialogContent>
        <FormWrapper
            schema={schema}
            initialValues={initialValues}
            onSubmit={onSave}
            renderButtons={
            ({ handleSubmit }: { handleSubmit: () => void }) => (
                <>
                <CIButton
                    _ci={`${title.replace(/\s+/g, '')}cancelBttn`}
                    type="button"
                    variant="contained"
                    onClick={onCancel}
                >
                    Cancel
                </CIButton>
                <CIButton
                    _ci={`${title.replace(/\s+/g, '')}saveBttn`}
                    type="button"
                    variant="contained"
                    color="primary"
                    disabled={false}
                    onClick={handleSubmit}
                >
                    Save
                </CIButton>
                </>
            )
            }
        />
        </DialogContent>
    </Dialog>
    )
  }

  const FormListDialog = FormListDialogInner

  export default FormListDialog
