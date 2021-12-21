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
  components: {
    MuiDialogContent: {
      styleOverrides: {
        root: {
          paddingTop: '0.25rem !important',
        },
      },
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
