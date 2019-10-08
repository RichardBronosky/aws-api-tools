import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { store } from '../../../redux/store'
import * as financeHelper from '@helpers/finance'
import CreditCardBanner from '../cart-parts/credit-card-banner'

describe('CreditCardBanner', () => {
  it('renders correctly', () => {
    financeHelper.getFinanceMarketingMessageData = jest.fn(() => ({
      siteFriendlyLabel: '36 Months Test Plan',
      marketingMessage: 'Test marketing message',
    }))
    financeHelper.getFinancePlans = jest.fn(() => [{ promoMessage: "Test Promo Message" }])
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CreditCardBanner />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
