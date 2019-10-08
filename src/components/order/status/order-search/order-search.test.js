import React from 'react'
import renderer from 'react-test-renderer'
import OrderSearch from './order-search'
import { orderStatus } from '@mocks/orderStatusDataMocks'
import * as orderStatusHelper from '../order-status-helper'

describe('OrderStatus', () => {
  const testProps = {
    orderId: orderStatus.OrderNumber,
    phoneNumber: '813-555-1234',
    err: null,
    loading: false,
    setOrderStatusState: jest.fn(),
    setOrderSearchState: jest.fn(),
  }

  it('renders correctly with default props', () => {
    const tree = renderer.create(<OrderSearch { ...testProps } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when invalid phone number', () => {
    const tree = renderer.create(<OrderSearch { ...{ ...testProps, err: 'Invalid phone number.' } } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when other error', () => {
    const tree = renderer.create(<OrderSearch { ...{ ...testProps, err: 'We are unable.' } } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when loading', () => {
    const tree = renderer.create(<OrderSearch { ...{ ...testProps, loading: true } } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('calls getRelatedOrders on find order click', () => {
    const tree = renderer.create(<OrderSearch { ...testProps } />)
    orderStatusHelper.getRelatedOrders = jest.fn()
    tree.root.findByProps({ className: 'primary' }).props.onClick()
    expect(orderStatusHelper.getRelatedOrders).toHaveBeenCalled()
  })

  it('calls setOrderSearchState on order number input change', () => {
    const tree = renderer.create(<OrderSearch { ...testProps } />)
    tree.root.findByProps({ id: 'order_status_number' }).props.onChange({ target: { value: 'test' } })
    expect(testProps.setOrderSearchState).toHaveBeenCalled()
  })

  it('calls setOrderSearchState on phone number input change', () => {
    const tree = renderer.create(<OrderSearch { ...testProps } />)
    tree.root.findByProps({ name: 'order_phone_number' }).props.onChange({ target: { value: 'test' } })
    expect(testProps.setOrderSearchState).toHaveBeenCalled()
  })
})
