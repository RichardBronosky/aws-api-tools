import React from 'react'
import renderer from 'react-test-renderer'
import OrderListItem from '../order-list-item'
import { orderStatus } from '@mocks/orderStatusDataMocks'
import * as orderStatusHelper from '../order-status-helper'

describe('OrderListItem', () => {
  const testProps = {
    order: orderStatus,
    setOrderStatusState: jest.fn(),
  }

  it('renders correctly when order exists', () => {
    const tree = renderer.create(<OrderListItem { ...testProps } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when order does not exist', () => {
    const tree = renderer.create(<OrderListItem { ...{ ...testProps, order: null } } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('calls viewOrderDetails on view details click', () => {
    const tree = renderer.create(<OrderListItem { ...testProps } />)
    orderStatusHelper.viewOrderDetails = jest.fn()
    tree.root.findByProps({ className: 'primary' }).props.onClick()
    expect(orderStatusHelper.viewOrderDetails).toHaveBeenCalled()
  })
})
