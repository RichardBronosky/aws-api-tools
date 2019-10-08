import React from 'react'
import renderer from 'react-test-renderer'
import PaymentMethods from '../cart-parts/payment-methods'

describe('PaymentMethods', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<PaymentMethods />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
