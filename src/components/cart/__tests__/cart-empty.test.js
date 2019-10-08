import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { store } from '../../../redux/store'
import CartEmpty from '../cart-parts/cart-empty'

describe('CartEmpty', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CartEmpty />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
