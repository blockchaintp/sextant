import React from 'react'
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme({
  typography: {
    fontSize: 18,
  },
  palette: {
    primary: {
      main: '#3D4897',
    },
    secondary: {
      main: '#E12843',
    },
  },
})

function Theme({ children }) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        { children }
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default Theme
