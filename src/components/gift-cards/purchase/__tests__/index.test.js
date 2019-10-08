import React from 'react'
import renderer from 'react-test-renderer'
import GiftCardPurchase from '../index'
import { Provider } from 'react-redux'
import { store } from '@redux/store'

describe('GiftCardPurchase', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <GiftCardPurchase />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
