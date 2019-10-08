import React from 'react'
import { Provider } from 'react-redux'
import { createStore, compose, combineReducers } from 'redux'

import global from './modules/global'
import location from './modules/location'
import cart from './modules/cart'
import checkout from './modules/checkout'

const rootReducer = combineReducers({
  global,
  location,
  cart,
  checkout,
})

// Redux DevTools
const windowObject = typeof window !== 'undefined' && window
const reduxDevTools =
  process.env.NODE_ENV === 'development' && windowObject.devToolsExtension
    ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    : _ => _

const configureStore = initialState => createStore(rootReducer, initialState, compose(reduxDevTools))

export const store = configureStore()

// eslint-disable-next-line react/display-name,react/prop-types
export default ({ element }) => <Provider store={ store }>{ element }</Provider>
