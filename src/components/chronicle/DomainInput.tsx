import React, { useState } from "react"
import { styled } from "@mui/system"

import Autocomplete from "@mui/material/Autocomplete"
import Button from "@mui/material/Button"
import { AutocompleteRenderOptionState } from '@mui/material/Autocomplete'
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import FormGroup from "@mui/material/FormGroup"
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
      setInputValue(inputValue)
    }
  }

  const handleOptionRemove = (option: string) => {
    onOptionRemove(option)
  }

  return (
    <FormGroup row onSubmit={handleSubmit} sx={{}}>
        <Autocomplete
            freeSolo
            options={options}
            sx={{ flex: 1 }}
            value={inputValue}
            onInputChange={handleInputChange}
            renderOption={(props, option, state: AutocompleteRenderOptionState) => (
                <MenuItem {...props} sx={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    {option}
                    <IconButton size="small" onClick={() => handleOptionRemove(option as string)}>
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
                                <InputAdornment sx={{ }} position="start">
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
    </FormGroup>
  )
}

export default DomainInput
