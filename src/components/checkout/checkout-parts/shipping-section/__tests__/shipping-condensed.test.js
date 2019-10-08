import React from 'react'
import renderer from 'react-test-renderer'
import ShippingCondensed from '../shipping-condensed'
import { order1 } from '../../../../../lib/mocks/checkoutDataMocks'

describe('ShippingCondensed', () => {
  let testProps = {
    order: order1,
  }

  it('renders correctly when address looked up from QAS', () => {
    testProps.order.shippingAddress = {
      addressLookup: '1111 Test Street, Test City FL 33584',
      addressLookupSuccess: true,
      showAddressLookup: true,
    }

    const tree = renderer.create(<ShippingCondensed { ...testProps } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when address entered manually', () => {
    testProps.order.shippingAddress = {
      address1: '1111 Test Street',
      city: 'Test City',
      state: 'FL',
      zip: '33584',
      addressLookup: '',
    }

    const tree = renderer.create(<ShippingCondensed { ...testProps } />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
