import React from 'react'
import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

const theme = createTheme({
  typography: {
    fontSize: 18,
  },
  palette: {

  },
})

function Theme({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      { children }
    </ThemeProvider>
  );
}

export default Theme
