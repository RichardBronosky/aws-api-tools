import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { store } from '../../../../../redux/store'
import DeliveryTypeSection from '../delivery-type-section'
import { mockCartItem1 } from '../../../../../lib/mocks/cartDataMocks'
import { order1 } from '../../../../../lib/mocks/checkoutDataMocks'

describe('DeliveryTypeSection', () => {
  const testProps = {
    deliveryItems: order1.lineItems,
    ups: false,
    cart: {
      cartItems: [mockCartItem1],
    },
  }

  it('renders correctly when not ups', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliveryTypeSection { ...testProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when ups', () => {
    const newTestProps = {
      ...testProps,
      ups: true,
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliveryTypeSection { ...newTestProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
