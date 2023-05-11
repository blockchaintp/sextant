import * as React from 'react'
import { styled } from '@mui/system';
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import HelperText from './HelperText'

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(2),
}))

interface Option {
  row?: boolean
  title: string
  value: string
}

interface Item {
  title: string
  row?: boolean
  options: Option[]
  extraProps?: object
  helperText?: string
}
interface MultipleCheckboxFieldProps {
  field: {
    name: string
    value: { [key: string]: boolean } | null;
  }
  form: {
    setFieldValue: (field: string, value: { [key: string]: boolean }) => void;
  }
  error: string
  touched: boolean
  item: Item
  disabled: boolean
}

const MultipleCheckboxField: React.FC<MultipleCheckboxFieldProps> = ({
  field: { name, value },
  form: { setFieldValue },
  error,
  touched,
  item,
  disabled,
}) => {
  const title = item.title || name;
  const useValue: {[key: string]: boolean} = value || {};
  const extraProps = item.extraProps || {};

  return (
    <StyledFormControl>
      <FormLabel component="legend">{title}</FormLabel>
      <FormGroup row={!!item.row}>
        {(item.options || []).map((option, i) => {
          if (typeof option === 'string') {
            option = {
              title: option,
              value: option,
            };
          }

          const checked = !!useValue[option.value];

          return (
            <FormControlLabel
              key={i}
              control={
                <Checkbox
                  name={`${name}-${i}`}
                  checked={checked}
                  disabled={disabled}
                  onChange={() => {
                    const newValue = { ...useValue };
                    if (!checked) {
                      newValue[option.value] = true;
                    } else {
                      delete newValue[option.value];
                    }
                    setFieldValue(name, newValue);
                  }}
                  value={`${name}-${i}`}
                  {...extraProps}
                />
              }
              label={option.title}
            />
          );
        })}
      </FormGroup>
      <HelperText
        helperText={item.helperText}
        error={!!error}
        touched={touched}
      />
    </StyledFormControl>
  );
};

export default MultipleCheckboxField;
