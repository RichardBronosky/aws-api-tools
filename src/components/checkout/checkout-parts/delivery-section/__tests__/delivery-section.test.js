import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { store } from '@redux/store'
import DeliverySection from '../delivery-section'
import { mockCart } from '@mocks/cartDataMocks'
import { order1 } from '@mocks/checkoutDataMocks'

describe('DeliverySection', () => {
  const testProps = {
    order: order1,
    checkoutStep: 'delivery',
    checkoutStepsCompleted: {
      shipping: true,
      delivery: false,
      payment: false,
    },
    cart: mockCart,
    deliveryCalendar: [
      {
        date: '2019-06-04',
        readable: 'June 4',
        dayOfWeek: 'Sat',
        isPickup: false,
        isStandardDelivery: true,
        isExpressDelivery: false,
      },
    ],
    invalidFields: [],
  }

  it('renders correctly with default props', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliverySection { ...testProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with weekly calendar type', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliverySection { ...{ ...testProps, order: { ...order1, calendarType: 'weekly' } } } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when not shipping is current checkout step', () => {
    const newTestProps = {
      ...testProps,
      checkoutStep: 'shipping',
      checkoutStepsCompleted: {
        shipping: false,
        delivery: false,
        payment: false,
      },
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliverySection { ...newTestProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when not payment is current checkout step', () => {
    const newTestProps = {
      ...testProps,
      checkoutStep: 'payment',
      checkoutStepsCompleted: {
        shipping: true,
        delivery: true,
        payment: false,
      },
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliverySection { ...newTestProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when updateDelivery error', () => {
    const newTestProps = {
      ...testProps,
      invalidFields: ['buttonClick'],
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliverySection { ...newTestProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when pickup date selected', () => {
    const newTestProps = {
      ...testProps,
      deliveryCalendar: [
        {
          date: '2019-06-04',
          readable: 'June 4',
          dayOfWeek: 'Sat',
          isPickup: true,
          isStandardDelivery: true,
          isExpressDelivery: false,
        },
      ],
      order: {
        ...order1,
        isPickup: true,
      },
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliverySection { ...newTestProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when express date selected', () => {
    const newTestProps = {
      ...testProps,
      deliveryCalendar: [
        {
          date: '2019-06-04',
          readable: 'June 4',
          dayOfWeek: 'Sat',
          isPickup: false,
          isStandardDelivery: true,
          isExpressDelivery: true,
        },
      ],
      order: {
        ...order1,
      },
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliverySection { ...newTestProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
