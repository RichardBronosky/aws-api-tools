import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { store } from '../../../../redux/store'
import CheckoutEmpty from '../checkout-empty'

describe('CheckoutEmpty', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CheckoutEmpty />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
