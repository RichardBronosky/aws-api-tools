import React from 'react'
import renderer from 'react-test-renderer'
import GiftCards from '../gift-cards'
import * as giftCardHelper from '../../../../../../lib/helpers/checkout/payment-section/gift-cards'
import { order1, giftCards1 } from '../../../../../../lib/mocks/checkoutDataMocks'

describe('GiftCards', () => {
  let testProps = {
    order: {
      ...order1,
      giftCardInfo: {
        ...order1.giftCardInfo,
        useGiftCard: true,
      },
    },
    removing: false,
    loading: false,
    invalidFields: [],
    giftCards: giftCards1,
    paymentProperties: true,
    setGiftCardState: jest.fn(),
    unableToAddMessage: '',
  }

  it('renders correctly with default props', () => {
    const tree = renderer.create(<GiftCards { ...testProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when not using gift card', () => {
    const tree = renderer
      .create(
        <GiftCards { ...{ ...testProps, order: { giftCardInfo: { ...order1.giftCardInfo, useGiftCard: false } } } } />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with invalid fields', () => {
    const tree = renderer.create(<GiftCards { ...{ ...testProps, invalidFields: ['test field'] } } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly no other gift cards', () => {
    const tree = renderer.create(<GiftCards { ...{ ...testProps, giftCards: [] } } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly ability to add another card', () => {
    const tree = renderer
      .create(
        <GiftCards { ...{ ...testProps, order: { giftCardInfo: { ...order1.giftCardInfo, addAnotherCard: true } } } } />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('calls onChangeUseGiftCard when simulating clicking use gift card checkbox', () => {
    giftCardHelper.onChangeUseGiftCard = jest.fn()
    const tree = renderer.create(<GiftCards { ...testProps } />)
    tree.root.findByProps({ name: 'Use Gift Card' }).props.onChange({ target: { checked: false } })
    expect(giftCardHelper.onChangeUseGiftCard).toHaveBeenCalled()
  })
})
