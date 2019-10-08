import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { store } from '../../../../../../redux/store'
import DeliveryCondensed from '../index'
import { mockCartItem1 } from '../../../../../../lib/mocks/cartDataMocks'
import { order1 } from '../../../../../../lib/mocks/checkoutDataMocks'

describe('DeliveryCondensed', () => {
  const testProps = {
    deliveryDate: '2019-07-02',
    order: order1,
    rtgDeliveryItems: order1.lineItems.filter(item => item.deliveryType === 'D'),
    vendorDeliveryItems: order1.lineItems.filter(item => item.deliveryType === 'O'),
    upsDeliveryItems: order1.lineItems.filter(item => item.deliveryType === 'U'),
    uspsDeliveryItems: order1.lineItems.filter(item => item.deliveryType === 'T'),
    isExpress: false,
    cart: {
      cartItems: [mockCartItem1],
    },
  }

  it('renders correctly all types of items', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliveryCondensed { ...testProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with all types of items and isExpress', () => {
    const newTestProps = {
      ...testProps,
      isExpress: true,
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliveryCondensed { ...newTestProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with all types of items and isPickup', () => {
    const newTestProps = {
      ...testProps,
      order: {
        ...order1,
        isPickup: true,
      },
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliveryCondensed { ...newTestProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with only rtg delivery items', () => {
    const newTestProps = {
      ...testProps,
      order: {
        ...order1,
      },
      vendorDeliveryItems: [],
      upsDeliveryItems: [],
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliveryCondensed { ...newTestProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
