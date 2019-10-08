import React from 'react'
import renderer from 'react-test-renderer'
import GiftCardAccordions from '../index'
import { Provider } from 'react-redux'
import { store } from '@redux/store'

describe('GiftCardAccordions', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <GiftCardAccordions />
        </Provider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
