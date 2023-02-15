import TextField from './Text'
import TextAreaField from './TextArea'
import RadioField from './Radio'
import CheckboxField from './Checkbox'
import MultipleCheckboxField from './MultipleCheckbox'
import SelectField from './Select'
import FormDialog from './FormDialog'

const fields = {
  text: TextField,
  textarea: TextAreaField,
  radio: RadioField,
  checkbox: CheckboxField,
  multipleCheckbox: MultipleCheckboxField,
  select: SelectField,
  formdialog: FormDialog,
}

export const defaultValues = {
  text: '',
  textarea: '',
  radio: '',
  checkbox: false,
  multipleCheckbox: {},
  select: '',
  formdialog: {},
}

export default fields
