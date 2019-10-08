import React from 'react'
import renderer from 'react-test-renderer'
import RemoveFromCart from '../cart-parts/remove-from-cart'
import * as cartHelper from '../../../lib/helpers/cart'
import { mockProduct1 } from '../../../lib/mocks/productDataMocks'

describe('RemoveFromCart', () => {
  const testProps = {
    product: mockProduct1,
    index: 1,
  }

  it('renders correctly', () => {
    const tree = renderer.create(<RemoveFromCart { ...testProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when in header', () => {
    const tree = renderer.create(<RemoveFromCart { ...testProps } headerCart />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('run removeFromCart when remove from cart clicked', () => {
    const tree = renderer.create(<RemoveFromCart { ...testProps } />)
    cartHelper.removeFromCart = jest.fn()
    tree.root.findByProps({ className: 'remove-btn' }).props.onClick()
    expect(cartHelper.removeFromCart).toHaveBeenCalled()
  })
})
