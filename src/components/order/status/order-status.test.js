import React from 'react'
import renderer from 'react-test-renderer'
import OrderStatus from './order-status'
import { orderStatus, orderStatusList } from '@mocks/orderStatusDataMocks'

describe('OrderStatus', () => {
  const testProps = {
    orderDetails: orderStatus,
    orderList: orderStatusList,
    setOrderStatusState: jest.fn(),
  }

  it('renders correctly with default props', () => {
    const tree = renderer.create(<OrderStatus { ...testProps } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when orderDetails does not exist', () => {
    const tree = renderer.create(<OrderStatus { ...{ ...testProps, orderDetails: null } } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when orderList does not exist', () => {
    const tree = renderer.create(<OrderStatus { ...{ ...testProps, orderList: null } } />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
