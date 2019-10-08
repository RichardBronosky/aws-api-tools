import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { store } from '../../../../../redux/store'
import DeliveryProduct from '../delivery-product'
import { mockProduct1 } from '../../../../../lib/mocks/productDataMocks'

describe('DeliveryProduct', () => {
  const testProps = {
    product: mockProduct1,
    productCount: 2,
    quantity: 2,
    index: 1,
    noImage: false,
    requiredAddon: false,
  }

  it('renders correctly when product is not last index of cart', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliveryProduct { ...testProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when product is last index of cart', () => {
    const newTestProps = {
      ...testProps,
      index: 2,
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliveryProduct { ...newTestProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when product does not have an image', () => {
    const newTestProps = {
      ...testProps,
      noImage: true,
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliveryProduct { ...newTestProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when product is a required add-on', () => {
    const newTestProps = {
      ...testProps,
      requiredAddon: true,
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <DeliveryProduct { ...newTestProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
