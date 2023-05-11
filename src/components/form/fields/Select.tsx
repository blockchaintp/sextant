import * as React from 'react'
import { styled } from '@mui/system';
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import FormLabel from '@mui/material/FormLabel';

import HelperText from './HelperText'

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(2),
}))

interface Option {
  title: string
  value: string
  blurb?: string
}

interface Item {
  alternateText: string
  helperText: string
  title: string
  options: Option[]
  extraProps?: object
}

interface SelectFieldProps {
  field: {
    name: string
    value: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  }
  error: string
  touched: boolean
  item: Item
  disabled: boolean
  formProps: {
    touched: boolean
    values: {
      [key: string]: {
        [key: string]: string
      }
    }
    errors: {
      [key: string]: string
    }
    hooks: {
      disabled: boolean
      validate: boolean
      hidden: {
        [key: string]: string | boolean
      }
    }
  }
}

const SelectField: React.FC<SelectFieldProps> = ({
  field: {
    name,
    value,
    onChange,
  },
  error,
  touched,
  item,
  disabled,
  formProps,
}) => {

    // filter through the consensus options, find the selected consensus, return the corresponding blurb
    const blurbText = (selectedConsensus: string) => {
      for (const option of item.options) {
        if (option.value === selectedConsensus) {
          return option.blurb
        }
      }
      return undefined;
    }

    const title = item.title || name
    const extraProps = item.extraProps || {}

    return (
      <StyledFormControl error={!!(touched && error)}>
        <FormLabel htmlFor={name}>{ title }</FormLabel>
        <Select
          // @ts-ignore
          _ci={name}
          id={`select_${name}`}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
          inputProps={{
            name,
            id: name,
          }}
          {...extraProps}
        >
          {
            (item.options || []).map((option, i) => {
              option = typeof (option) === 'string' ? {
                title: option,
                value: option,
              } : option

              return (
                <MenuItem
                  key={i}
                  value={option.value}
                >
                  { option.title }
                </MenuItem>
              )
            })
          }
        </Select>
        <HelperText
          helperText={error || (item.alternateText ? blurbText(formProps.values.sawtooth.consensus) : item.helperText)}
          error={!!error}
          touched={touched}
        />

      </StyledFormControl>
    )
}

export default SelectField
