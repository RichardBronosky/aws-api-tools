import reducer, { SET_SHIPPING_ADDRESS, SET_LOCATION } from '../location'
import { mockLocation1, mockLocation2 } from '../../../lib/mocks/locationDataMocks'

const initialState = {
  shipping_address: 'Seffner, FL',
  rtg_location: mockLocation1,
}

describe('location reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle SET_SHIPPING_ADDRESS when set to Atlanta, GA', () => {
    expect(
      reducer(initialState, {
        type: SET_SHIPPING_ADDRESS,
        shipping_address: 'Atlanta, GA',
      })
    ).toEqual({
      shipping_address: 'Atlanta, GA',
      rtg_location: initialState.rtg_location,
    })
  })

  it('should handle SET_LOCATION when set to new location', () => {
    expect(
      reducer(initialState, {
        type: SET_LOCATION,
        rtg_location: mockLocation2,
      })
    ).toEqual({
      shipping_address: 'Seffner, FL',
      rtg_location: mockLocation2,
    })
  })
})
