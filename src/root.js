import React from 'react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router5'

import Theme from './theme'
import SnackbarWrapper from './containers/SnackbarWrapper'
import Router from './router/Router'
import edition from './edition'

const header = edition.header

class Root extends React.Component {
  render() {

    const {
      store,
      router,
    } = this.props

    document.title = `Sextant for ${header.text}`

    return (
      <Provider store={ store }>
        <Theme>
          <SnackbarWrapper>
            <RouterProvider router={ router }>
              <Router />
            </RouterProvider>
          </SnackbarWrapper>
        </Theme>
      </Provider>
    )
  }
}

export default Root
