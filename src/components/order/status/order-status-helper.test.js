import * as orderStatusHelper from './order-status-helper'
import * as announceHelper from '@helpers/aria-announce'
import { orderStatus } from '@mocks/orderStatusDataMocks'

describe('order status helper', () => {
  const e = { preventDefault: jest.fn() }
  const orderId = orderStatus.OrderNumber
  const phoneNumber = '4044044040'
  const loading = false
  const setState = jest.fn()
  const setSearchState = jest.fn()
  const ref = { current: { clientHeight: 452 } }

  it('getRelatedOrders does nothing if loading', () => {
    expect(orderStatusHelper.getRelatedOrders(e, orderId, phoneNumber, true, setState, setSearchState, ref)).toEqual(
      undefined
    )
  })

  it('getRelatedOrders calls setSearchState if not loading', () => {
    orderStatusHelper.getRelatedOrders(e, orderId, phoneNumber, loading, setState, setSearchState, ref)
    expect(setSearchState).toHaveBeenCalled()
  })

  it('getRelatedOrders errors if invalid phone number', () => {
    announceHelper.announce = jest.fn()
    orderStatusHelper.getRelatedOrders(e, orderId, 'bad phone', loading, setState, setSearchState, ref)
    expect(announceHelper.announce).toHaveBeenCalledWith('Invalid phone number.')
    expect(setState).toHaveBeenCalled()
    expect(setSearchState).toHaveBeenCalled()
  })

  it('viewOrderList calls setOrderStatusState', () => {
    const setOrderStatusState = jest.fn()
    orderStatusHelper.viewOrderList(setOrderStatusState)
    expect(setOrderStatusState).toHaveBeenCalled()
  })

  it('viewOrderDetails calls setOrderStatusState', () => {
    const setOrderStatusState = jest.fn()
    window.scrollTo = jest.fn()
    orderStatusHelper.viewOrderDetails(orderStatus, setOrderStatusState)
    expect(setOrderStatusState).toHaveBeenCalled()
    expect(window.scrollTo).toHaveBeenCalled()
  })

  it('getFinDepositTotal returns total from order finance deposits', () => {
    expect(Number(orderStatusHelper.getFinDepositTotal(orderStatus.FinDeposits.Deposit))).toEqual(600)
  })

  it('getOtherPayments returns all other payments as an array from order status', () => {
    expect(orderStatusHelper.getOtherPayments(orderStatus)).toEqual([
      ...orderStatus.Deposits.Deposit,
      ...orderStatus.GCDeposits.Deposit,
    ])
  })

  it('getOtherPayments returns all other payments as an array from order status when no gift cards', () => {
    expect(orderStatusHelper.getOtherPayments({ ...orderStatus, GCDeposits: null })).toEqual([
      ...orderStatus.Deposits.Deposit,
    ])
  })

  it('getOtherPayments returns all other payments as an array from order status when only gift cards', () => {
    expect(orderStatusHelper.getOtherPayments({ ...orderStatus, Deposits: null })).toEqual([
      ...orderStatus.GCDeposits.Deposit,
    ])
  })

  it('getPaymentType returns Master Card for MC cash code', () => {
    expect(orderStatusHelper.getPaymentType({ CashCode: 'MC' })).toEqual('Master Card')
  })

  it('getPaymentType returns Visa for VA cash code', () => {
    expect(orderStatusHelper.getPaymentType({ CashCode: 'VA' })).toEqual('Visa')
  })

  it('getPaymentType returns Discover for DV cash code', () => {
    expect(orderStatusHelper.getPaymentType({ CashCode: 'DV' })).toEqual('Discover')
  })

  it('getPaymentType returns American Express for AMX cash code', () => {
    expect(orderStatusHelper.getPaymentType({ CashCode: 'AMX' })).toEqual('American Express')
  })

  it('getPaymentType returns Gift Card for PAL cash code', () => {
    expect(orderStatusHelper.getPaymentType({ CashCode: 'GC' })).toEqual('Gift Card')
  })

  it('getPaymentType returns PayPal for PAL cash code', () => {
    expect(orderStatusHelper.getPaymentType({ CashCode: 'PAL' })).toEqual('PayPal')
  })

  it('getPaymentType returns Affirm for AFF cash code', () => {
    expect(orderStatusHelper.getPaymentType({ CashCode: 'AFF' })).toEqual('Affirm')
  })
})
