import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { store } from '../../../../redux/store'
import CheckoutStep from '../checkout-step'
import ShippingSection from '../shipping-section'
import DeliverySection from '../delivery-section'
import PaymentSection from '../payment-section'
import ReviewSection from '../review-section'

describe('CheckoutStep', () => {
  const shippingProps = {
    sectionTitle: 'Shipping Address',
    sectionType: 'shipping',
    sectionNumber: '1',
    nextSection: 'delivery',
  }

  it('renders shipping step correctly', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CheckoutStep { ...shippingProps }>
            <ShippingSection />
          </CheckoutStep>
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  const deliveryProps = {
    sectionTitle: 'Delivery',
    sectionType: 'delivery',
    sectionNumber: '2',
    previousSection: 'shipping',
    nextSection: 'payment',
  }

  it('renders delivery step correctly', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CheckoutStep { ...deliveryProps }>
            <DeliverySection />
          </CheckoutStep>
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  const paymentProps = {
    sectionTitle: 'Payment',
    sectionType: 'payment',
    sectionNumber: '3',
    previousSection: 'delivery',
    nextSection: 'review',
  }

  it('renders payment step correctly', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CheckoutStep { ...paymentProps }>
            <PaymentSection />
          </CheckoutStep>
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  const reviewProps = {
    sectionTitle: 'Review Order',
    sectionType: 'review',
    sectionNumber: '4',
    previousSection: 'payment',
  }

  it('renders review step correctly', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CheckoutStep { ...reviewProps }>
            <ReviewSection />
          </CheckoutStep>
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
