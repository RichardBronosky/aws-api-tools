import React from 'react'
import renderer, { act } from 'react-test-renderer'
import OrderDetails from '../order-details'
import { orderStatus } from '@mocks/orderStatusDataMocks'
import * as orderStatusHelper from '../order-status-helper'

describe('OrderDetails', () => {
  const testProps = {
    order: orderStatus,
    setOrderStatusState: jest.fn(),
  }

  const setState = jest.fn()
  let useStateSpy

  beforeEach(() => {
    useStateSpy = jest.spyOn(React, 'useState')
    useStateSpy.mockImplementation(init => [init, setState])
  })

  afterAll(() => {
    useStateSpy.mockRestore()
  })

  it('renders correctly when order exists', () => {
    const tree = renderer.create(<OrderDetails { ...testProps } />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when order exists and payment details expanded', () => {
    const spy = jest.spyOn(React, 'useState').mockImplementation(() => [true, jest.fn()])
    const tree = renderer.create(<OrderDetails { ...testProps } />).toJSON()
    expect(tree).toMatchSnapshot()
    spy.mockRestore()
  })

  it("renders correctly when order doesn't have other payment methods", () => {
    const tree = renderer.create(
      <OrderDetails { ...{ ...testProps, order: { ...testProps.order, GCDeposits: null, Deposits: null } } } />
    )
    expect(tree.toJSON()).toMatchSnapshot()
  })

  it('calls viewOrderList on back to orders click', () => {
    const tree = renderer.create(<OrderDetails { ...testProps } />)
    orderStatusHelper.viewOrderList = jest.fn()
    tree.root.findByProps({ className: 'primary' }).props.onClick()
    expect(orderStatusHelper.viewOrderList).toHaveBeenCalled()
  })

  it('updates state when clicking on other payment details expander button', () => {
    const tree = renderer.create(<OrderDetails { ...testProps } />)
    tree.root.findByProps({ className: 'other-payment-details-expander' }).props.onClick()
    expect(setState).toHaveBeenCalled()
  })

  it('updates state when clicking on finance details expander button', () => {
    const tree = renderer.create(<OrderDetails { ...testProps } />)
    tree.root.findByProps({ className: 'finance-details-expander' }).props.onClick()
    expect(setState).toHaveBeenCalled()
  })
})
