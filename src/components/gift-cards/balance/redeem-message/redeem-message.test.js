import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { store } from '@redux/store'
import RedeemMessage from './index'

describe('RedeemMessage', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <RedeemMessage />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
