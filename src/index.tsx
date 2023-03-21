/* eslint-disable import/first */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line camelcase
// eslint-disable-next-line no-undef
__webpack_public_path__ = window.SEXTANT_ROOT_BASE_PATH // NOSONAR

import './assets/index.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import Store from './store'
import Router from './router'

const RootAppComponent = require('./root').default

const router = Router()
const store = Store(router, window.__INITIAL_STATE__)
const rootEl = document.querySelector('#root')

const render = () => {
  ReactDOM.render(
    <RootAppComponent
      store={store}
      router={router}
    />,
    rootEl,
  )
}

if (module.hot) {
  module.hot.accept('./root', () => {
    setTimeout(render)
  })
}

render()
