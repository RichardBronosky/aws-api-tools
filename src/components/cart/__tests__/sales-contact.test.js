import React from 'react'
import renderer from 'react-test-renderer'
import SalesContact from '../cart-parts/sales-contact'

describe('SalesContact', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<SalesContact />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
