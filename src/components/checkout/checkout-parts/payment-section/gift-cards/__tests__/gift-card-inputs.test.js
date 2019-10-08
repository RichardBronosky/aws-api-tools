import React from 'react'
import renderer from 'react-test-renderer'
import GiftCardInputs from '../gift-card-inputs'
import * as giftCardHelper from '../../../../../../lib/helpers/checkout/payment-section/gift-cards'
import { order1 } from '../../../../../../lib/mocks/checkoutDataMocks'

describe('GiftCardInputs', () => {
  let testProps = {
    order: order1,
    unabletoAddMessage: '',
    invalidFields: [],
    loading: false,
    setGiftCardState: jest.fn(),
  }

  it('renders correctly with default props', () => {
    const tree = renderer.create(<GiftCardInputs { ...testProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with unableToAddMessage', () => {
    const tree = renderer.create(<GiftCardInputs { ...{ ...testProps, unableToAddMessage: 'test message' } } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with invalid fields', () => {
    const tree = renderer
      .create(<GiftCardInputs { ...{ ...testProps, invalidFields: ['test invalid field'] } } />)
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when loading', () => {
    const tree = renderer.create(<GiftCardInputs { ...{ ...testProps, loading: true } } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when able to cancel adding card', () => {
    const tree = renderer
      .create(
        <GiftCardInputs
          { ...{ ...testProps, order: { ...order1, giftCardInfo: { ...order1.giftCardInfo, addAnotherCard: true } } } }
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('calls setOrderGiftCardInfo when simulating gift card number change', () => {
    giftCardHelper.setOrderGiftCardInfo = jest.fn()
    const tree = renderer.create(<GiftCardInputs { ...testProps } />)
    tree.root.findByProps({ className: 'gift-card-number' }).props.onChange({ target: { value: 'test' } })
    expect(giftCardHelper.setOrderGiftCardInfo).toHaveBeenCalled()
  })

  it('calls setOrderGiftCardInfo when simulating gift card pin change', () => {
    giftCardHelper.setOrderGiftCardInfo = jest.fn()
    const tree = renderer.create(<GiftCardInputs { ...testProps } />)
    tree.root.findByProps({ className: 'gift-card-pin' }).props.onChange({ target: { value: 'test' } })
    expect(giftCardHelper.setOrderGiftCardInfo).toHaveBeenCalled()
  })

  it('calls onApplyGiftCard when simulating apply gift card click', () => {
    giftCardHelper.onApplyGiftCard = jest.fn()
    const tree = renderer.create(<GiftCardInputs { ...testProps } />)
    tree.root.findByProps({ className: 'apply-gift-card-btn small-12 medium-3' }).props.onClick()
    expect(giftCardHelper.onApplyGiftCard).toHaveBeenCalled()
  })

  it('calls setOrderGiftCardInfo when simulating cancel click', () => {
    giftCardHelper.setOrderGiftCardInfo = jest.fn()
    const tree = renderer.create(
      <GiftCardInputs
        { ...{ ...testProps, order: { ...order1, giftCardInfo: { ...order1.giftCardInfo, addAnotherCard: true } } } }
      />
    )
    tree.root
      .findByProps({ className: 'apply-gift-card-btn cancel small-12 medium-1' })
      .props.onClick({ target: { value: 'test' } })
    expect(giftCardHelper.setOrderGiftCardInfo).toHaveBeenCalled()
  })
})
