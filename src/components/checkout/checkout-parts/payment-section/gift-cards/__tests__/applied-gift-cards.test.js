import React from 'react'
import renderer from 'react-test-renderer'
import AppliedGiftCards from '../applied-gift-cards'
import * as giftCardHelper from '../../../../../../lib/helpers/checkout/payment-section/gift-cards'
import { order1, giftCards1 } from '../../../../../../lib/mocks/checkoutDataMocks'

describe('AppliedGiftCards', () => {
  let testProps = {
    giftCards: giftCards1,
    order: order1,
    removing: false,
    setGiftCardState: jest.fn(),
  }

  it('renders correctly with default props', () => {
    const tree = renderer.create(<AppliedGiftCards { ...testProps } />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('calls onRemoveGiftCard when simulating remove gift card click', () => {
    giftCardHelper.onRemoveGiftCard = jest.fn()
    const tree = renderer.create(<AppliedGiftCards { ...testProps } />)
    tree.root.findByProps({ className: 'remove-card' }).props.onClick()
    expect(giftCardHelper.onRemoveGiftCard).toHaveBeenCalled()
  })

  it('calls onAddAnotherCard when simulating add another gift card click', () => {
    giftCardHelper.onAddAnotherCard = jest.fn()
    const tree = renderer.create(
      <AppliedGiftCards
        { ...{
          ...testProps,
          order: { ...order1, amountDue: 100, giftCardInfo: { ...order1.giftCardInfo, addAnotherCard: false } },
        } }
      />
    )
    tree.root.findByProps({ className: 'add-another-card' }).props.onClick()
    expect(giftCardHelper.onAddAnotherCard).toHaveBeenCalled()
  })

  it('renders correctly when removing gift card', () => {
    const tree = renderer.create(<AppliedGiftCards { ...{ ...testProps, removing: true } } />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
