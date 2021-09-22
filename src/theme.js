import React from 'react'
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles'
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
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      { children }
    </MuiThemeProvider>
  );
}

export default Theme
