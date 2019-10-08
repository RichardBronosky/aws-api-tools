import Cookies from 'universal-cookie'
import { mockLocation1 } from '../../lib/mocks/locationDataMocks'
const cookies = new Cookies()

// Actions
export const SET_SHIPPING_ADDRESS = 'SET_SHIPPING_ADDRESS'
export const SET_LOCATION = 'SET_LOCATION'

// Action Creators
export function setShippingAddress(shipping_address) {
  return { type: SET_SHIPPING_ADDRESS, shipping_address }
}

export function setLocation(rtg_location) {
  if (!rtg_location) {
    rtg_location = { ...initialState.rtg_location }
  }
  const cookieLoc = cookies.get('rtg_location')
  const cookieReg = cookies.get('rtg_region')
  const cookieZip = cookies.get('rtg_zip')
  const cookieDist = cookies.get('rtg_distribution_index')
  if (!cookieLoc || rtg_location !== cookieLoc) {
    cookies.set('rtg_location', rtg_location, { path: '/' })
  }
  if (!cookieReg || rtg_location.zip !== cookieReg) {
    cookies.set('rtg_region', rtg_location.region, { path: '/' })
  }
  if (!cookieZip || rtg_location.zip !== cookieZip) {
    cookies.set('rtg_zip', rtg_location.zip, { path: '/' })
  }
  if (!cookieDist || rtg_location.distribution_index !== cookieDist) {
    cookies.set('rtg_distribution_index', rtg_location.distribution_index, { path: '/' })
  }
  return { type: SET_LOCATION, rtg_location }
}

// Reducer
const initialState = {
  shipping_address: 'Seffner, FL',
  rtg_location: mockLocation1,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SHIPPING_ADDRESS:
      return {
        ...state,
        shipping_address: action.shipping_address,
      }
    case SET_LOCATION:
      let newState = { ...state }
      newState.rtg_location = action.rtg_location
      return {
        ...state,
        rtg_location: newState.rtg_location,
      }
    default:
      return state
  }
}
