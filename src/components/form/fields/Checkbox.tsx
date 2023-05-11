import * as React from 'react'
import { styled } from '@mui/system'
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material'
import { FormControlProps } from '@mui/material/FormControl'
import HelperText from './HelperText'

interface CheckboxFieldProps {
  field: {
    name: string
    value: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  },
  error: string
  touched: boolean
  item: {
    title?: string
    helperText?: string
    extraProps?: object
  }
  disabled?: boolean
}

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(2),
}))

interface CIFormControlProps extends FormControlProps {
  _ci?: string
}

const CIFormControl = ({ _ci, ...rest }: CIFormControlProps) => {
  return <StyledFormControl {...rest} />;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  field: {
    name,
    value,
    onChange,
  },
  error,
  touched,
  item,
  disabled,
}) => {

    const title = item.title || name
    const extraProps = item.extraProps || {}

    return (
      <CIFormControl _ci="checkbox">
        <FormLabel component="legend">{ title }</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={(
              <Checkbox
                name={name}
                checked={!!value}
                onChange={onChange}
                disabled={disabled}
                value={name}
                {...extraProps}
              />
            )}
            label={title}
          />
        </FormGroup>
        <HelperText
          helperText={item.helperText}
          error={!!error}
          touched={touched}
        />
      </CIFormControl>
    )
  }

export default CheckboxField
