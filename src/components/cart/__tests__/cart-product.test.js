import React from 'react'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import { store } from '../../../redux/store'
import CartProduct from '../cart-parts/cart-product'
import { mockProduct1 } from '../../../lib/mocks/productDataMocks'
import * as financeHelper from '../../../lib/helpers/finance'

describe('CartProduct', () => {
  const testProps = {
    product: mockProduct1,
    index: 1,
    productCount: 1,
    quantity: 2,
    price: 279.99,
    onAddActiveAddon: jest.fn(),
    onRemoveActiveAddon: jest.fn(),
  }

  financeHelper.productFinancing = jest.fn().mockReturnValue({
    financeAmount: 15,
    showFinance: true,
  })

  it('renders correctly with finance', () => {
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CartProduct { ...testProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly without finance', () => {
    financeHelper.productFinancing = jest.fn().mockReturnValue({
      financeAmount: 0,
      showFinance: false,
    })
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CartProduct { ...testProps } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when product unavailable due to stock', () => {
    const props = {
      ...testProps,
      unavailableItem: {
        sku: '23122360',
        reason: 'stock',
      },
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CartProduct { ...props } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when product unavailable due to region', () => {
    const props = {
      ...testProps,
      unavailableItem: {
        sku: '23122360',
        reason: 'region',
      },
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CartProduct { ...props } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when product has active add-ons', () => {
    const props = {
      ...testProps,
      activeAddons: [
        {
          category: 'bedroom',
          delivery_type: 'K',
          list_price: 49.99,
          price: 49.99,
          quantity: 2,
          sku: '50222606',
          title: 'Twin Bunkie Boards',
        },
      ],
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CartProduct { ...props } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when product has items in room', () => {
    const props = {
      ...testProps,
      product: {
        ...mockProduct1,
        items_in_room: [
          {
            ...mockProduct1,
            sku: 'mockSku',
          },
        ],
      },
    }
    const tree = renderer
      .create(
        <Provider store={ store }>
          <CartProduct { ...props } />
        </Provider>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})
