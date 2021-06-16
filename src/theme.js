import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

const theme = createMuiTheme({
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
