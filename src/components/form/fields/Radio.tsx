import * as React from 'react'
import { styled } from '@mui/system'
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material'
import { RadioGroupProps } from '@mui/material/RadioGroup'
import { RadioProps } from '@mui/material/Radio'

import HelperText from './HelperText'

type Option = {
  row?: boolean
  title: string
  value: string
}

type Item = {
  title: string
  row?: boolean
  options: Option[]
  extraProps?: object
  helperText?: string
}

interface RadioFieldProps {
  field: {
    name: string
    value: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  },
  error: string
  touched: boolean
  item: Item
  disabled?: boolean
}

interface CIRadioGroupProps extends RadioGroupProps {
  _ci?: string
}

const CIRadioGroup = ({ _ci, ...rest }: CIRadioGroupProps) => {
  return <RadioGroup {...rest} />;
}

interface CIRadioProps extends RadioProps {
  _ci?: string
}

const CIRadio = ({ _ci, ...rest }: CIRadioProps) => {
  return <Radio {...rest} />;
}

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(2),
}))

const RadioField: React.FC<RadioFieldProps> = ({
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
    <StyledFormControl>
      <FormLabel component="legend">{ title }</FormLabel>
      <CIRadioGroup
        _ci={`${name}radio`}
        aria-label={title}
        name={name}
        value={value}
        onChange={onChange}
        row={!!item.row}
      >
        {
          (item.options || []).map((option, i) => {
            option = typeof (option) === 'string' ? {
              title: option,
              value: option,
            } : option

            return (
              <FormControlLabel
                key={i}
                label={option.title}
                control={(
                  <CIRadio
                    _ci={`${option.value}radio`}
                    checked={option.value.toString() === value.toString()}
                    value={option.value}
                    disabled={disabled}
                    {...extraProps}
                  />
                )}
              />
            )
          })
        }
      </CIRadioGroup>
      <HelperText
        helperText={item.helperText}
        error={!!error}
        touched={touched}
      />
    </StyledFormControl>
  )
}

export default RadioField
