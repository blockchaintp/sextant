import * as React from "react"
import { useState } from "react"
import { styled } from "@mui/system"

import {
    Autocomplete,
    Button,
    MenuItem,
    IconButton,
    InputAdornment,
    TextField,
    FormGroup,
} from "@mui/material"

import { AutocompleteRenderOptionState } from '@mui/material/Autocomplete'

import DeleteIcon from '@mui/icons-material/Delete'
import PublicIcon from '@mui/icons-material/Public'

interface DomainInputProps {
    options: string[]
    onOptionAdd: (newOption: string) => void
    onOptionRemove: (optionToRemove: string) => void
}

const StyledTextField = styled(TextField)({
    "& fieldset": {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
    }
})

const StyledButton = styled(Button)({
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
})

const DomainInput: React.FC<DomainInputProps> = ({ options, onOptionAdd, onOptionRemove }) => {
  const [inputValue, setInputValue] = useState<string | null>("")

  const handleInputChange = (event: React.ChangeEvent<{}>, newInputValue: string | null) => {
    setInputValue(newInputValue)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (inputValue && urlRegex.test(inputValue)) {
      onOptionAdd(inputValue)
      setInputValue('')
    }
  }

  const handleOptionRemove = (option: string) => {
    onOptionRemove(option)
  }

  return (
    <FormGroup row sx={{}}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
            <Autocomplete
                freeSolo
                options={options}
                sx={{ flex: 1 }}
                value={inputValue}
                onInputChange={handleInputChange}
                renderOption={(props, option, state: AutocompleteRenderOptionState) => (
                    <MenuItem {...props} sx={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        {option}
                        <IconButton size="small" onClick={() => handleOptionRemove(option)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </MenuItem>
                )}
                renderInput={(params) => { return (
                    <StyledTextField
                        {...params}
                        label="URL"
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <>
                                    <InputAdornment position="start">
                                        <PublicIcon />
                                    </InputAdornment>
                                    {params.InputProps.startAdornment}
                                </>
                            )
                        }}
                    />
                )}}
            />
            <StyledButton type="submit" variant="contained">
                Add
            </StyledButton>
        </form>
    </FormGroup>
  )
}

export default DomainInput
