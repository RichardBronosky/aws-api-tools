import React from 'react'
import renderer from 'react-test-renderer'
import OrderProductInfoList from '../order-product-info-list-item'
import { orderStatus } from '@mocks/orderStatusDataMocks'

describe('OrderProductInfoList', () => {
  const testProps = {
    order: orderStatus,
  }

  it('renders correctly with default props', () => {
    const tree = renderer.create(<OrderProductInfoList { ...testProps } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when orderStatus does not exist', () => {
    const tree = renderer.create(<OrderProductInfoList order={ null } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when orderStatus does not have line items', () => {
    const tree = renderer.create(<OrderProductInfoList order={ { ...orderStatus, LineItems: null } } />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
