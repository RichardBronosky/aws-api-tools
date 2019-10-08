import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { store } from '../../../redux/store'
import { StaticQuery } from 'gatsby'
import PromotionContentGroup from '../promotion-content-group'
import { Banner1 } from '../../../lib/mocks/contentfulDataMocks'
import * as financeHelper from '@helpers/finance'

beforeEach(() => {
  StaticQuery.mockImplementationOnce(({ render }) => render(Banner1))
  financeHelper.getFinancePlans = jest.fn(() => [{ promoMessage: "Test Promo Message" }])
})

describe('PromotionContentGroup', () => {
  const testProps = {
    targetSkus: ['92820084', '92820072', '92820060', '92820058', '92820046', '92820034', '92820022'],
  }

  it('renders correctly with targetSkus', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <PromotionContentGroup { ...testProps } />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it("doesn't render without targetSkus", () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <PromotionContentGroup />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
