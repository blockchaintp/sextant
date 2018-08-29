import React from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

const theme = createMuiTheme({
  palette: {
    /*primary: {
      light: purple[300],
      main: purple[500],
      dark: purple[700],
    },
    secondary: {
      light: green[300],
      main: green[500],
      dark: green[700],
    },*/
  },
})

function Theme(props) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      { props.children }
    </MuiThemeProvider>
  );
}

export default Theme