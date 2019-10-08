import React from 'react'
import renderer from 'react-test-renderer'
import * as ariaHelper from '../../../lib/helpers/aria-announce'
import * as cartHelper from '../../../lib/helpers/cart'
import QuantityDropdown from '../cart-parts/quantity-dropdown/quantity-dropdown'
import { mockCart } from '../../../lib/mocks/cartDataMocks'

describe('QuantityDropdown', () => {
  const testProps = {
    cart: mockCart,
    quantity: 1,
    sku: '23122360',
    activeAddons: [],
    dropDownLimit: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  }

  it('renders correctly', () => {
    const tree = renderer.create(<QuantityDropdown { ...testProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('run setNewQuantity when simulating product quantity change', () => {
    ariaHelper.announce = jest.fn()
    const tree = renderer.create(<QuantityDropdown { ...testProps } />)
    cartHelper.setNewQuantity = jest.fn()
    tree.root.findByProps({ value: 1 }).props.onChange()
    expect(cartHelper.setNewQuantity).toHaveBeenCalled()
  })
})
