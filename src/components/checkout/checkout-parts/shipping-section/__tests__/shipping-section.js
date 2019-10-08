import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { store } from '../../../../../redux/store'
import ShippingSection from '../shipping-section'
import { order1 } from '../../../../../lib/mocks/checkoutDataMocks'

describe('ShippingSection', () => {
  let testProps = {
    order: order1,
    checkoutStep: 'shipping',
    invalidFields: [],
  }

  it('renders correctly with default props', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <ShippingSection { ...testProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with invalid fields', () => {
    const newTestProps = {
      ...testProps,
      invalidFields: ['phone'],
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <ShippingSection { ...newTestProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when showing successful addressLookup', () => {
    const newTestProps = {
      ...testProps,
      order: {
        ...testProps.order,
        shippingAddress: {
          ...testProps.order.shippingAddress,
          addressLookup: 'Test Address',
          addressLookupSuccess: true,
          showAddressLookup: true,
        },
      },
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <ShippingSection { ...newTestProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when showing pending addressLookup', () => {
    const newTestProps = {
      ...testProps,
      order: {
        ...testProps.order,
        shippingAddress: {
          ...testProps.order.shippingAddress,
          addressLookup: 'Test Address',
          addressLookupSuccess: false,
          showAddressLookup: true,
        },
      },
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <ShippingSection { ...newTestProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when hiding addressLookup', () => {
    const newTestProps = {
      ...testProps,
      order: {
        ...testProps.order,
        shippingAddress: {
          ...testProps.order.shippingAddress,
          addressLookupSuccess: false,
          showAddressLookup: false,
        },
      },
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <ShippingSection { ...newTestProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders shipping condensed when checkoutStep is not shipping', () => {
    const newTestProps = {
      ...testProps,
      checkoutStep: 'delivery',
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <ShippingSection { ...newTestProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
