import React from 'react'
import renderer from 'react-test-renderer'
import Cart from '../cart'
import * as cartHelper from '../../../lib/helpers/cart'
import { mockCart } from '../../../lib/mocks/cartDataMocks'

jest.mock('../cart-parts/cart-product', () => 'CartProduct')
jest.mock('../cart-parts/cart-empty', () => 'CartEmpty')
jest.mock('../cart-parts/payment-methods', () => 'PaymentMethods')
jest.mock('../cart-parts/credit-card-banner', () => 'CreditCardBanner')
jest.mock('../../checkout/checkout-sticky/checkout-sticky', () => 'CheckoutSticky')
jest.mock('../../shared/condensed-contact-links', () => 'CondensedContact')
jest.mock('../../shared/promotion-content-group', () => 'PromotionContentGroup')

describe('Cart', () => {
  let testProps = {
    cart: mockCart,
    discount: 0,
    skusNotAvailable: [],
    isMobile: false,
    onAddActiveAddon: jest.fn(),
    onRemoveActiveAddon: jest.fn(),
    showPayPal: false,
    promoTargetSkus: [],
    setCartState: jest.fn(),
  }

  it('renders correctly when all skus available', () => {
    const tree = renderer.create(<Cart { ...testProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when skus not available', () => {
    const tree = renderer.create(<Cart { ...{ ...testProps, skusNotAvailable: ['23122360'] } } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('calls removeUnavailableItems in right sticky when remove is clicked', () => {
    cartHelper.removeUnavailableItems = jest.fn()
    const tree = renderer.create(<Cart { ...{ ...testProps, skusNotAvailable: ['23122360'] } } />)
    tree.root.findByProps({ rightSticky: true }).props.removeUnavailableItems()
    expect(cartHelper.removeUnavailableItems).toHaveBeenCalled()
  })

  it('calls removeUnavailableItems in right sticky when remove is clicked and is mobile', () => {
    cartHelper.removeUnavailableItems = jest.fn()
    const tree = renderer.create(<Cart { ...{ ...testProps, skusNotAvailable: ['23122360'], isMobile: true } } />)
    tree.root.findByProps({ onlyButtons: true }).props.removeUnavailableItems()
    expect(cartHelper.removeUnavailableItems).toHaveBeenCalled()
  })

  it('renders correctly when cart is empty', () => {
    const tree = renderer.create(<Cart { ...{ ...testProps, cart: null } } />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
