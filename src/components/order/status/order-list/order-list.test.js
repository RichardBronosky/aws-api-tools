import React from 'react'
import renderer from 'react-test-renderer'
import OrderList from '../order-list'
import { orderStatusList } from '@mocks/orderStatusDataMocks'

describe('OrderList', () => {
  const testProps = {
    orderList: orderStatusList,
    heading: 'test heading',
    setOrderStatusState: jest.fn(),
  }

  it('renders correctly with default props', () => {
    const tree = renderer.create(<OrderList { ...testProps } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when orderList does not exist', () => {
    const tree = renderer.create(<OrderList { ...{ ...testProps, orderList: null } } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when heading does not exist', () => {
    const tree = renderer.create(<OrderList { ...{ ...testProps, heading: null } } />).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
