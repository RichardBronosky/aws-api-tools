import { getOrderList } from '@services/order-status'
import { announce } from '@helpers/aria-announce'
import { validatePhone } from '@helpers/string-helper'

export const getRelatedOrders = (e, orderId, phoneNumber, loading, setState, setSearchState, ref) => {
  e.preventDefault()
  if (!loading) {
    setSearchState({ loading: true })
    const validPhone = validatePhone(phoneNumber)
    if (validPhone) {
      getOrderList({ orderId: orderId, phoneNumber: phoneNumber.replace(/[^0-9]/g, '') })
        .then(orderList => {
          setState({ orderList: orderList })
          ref && window.scrollTo(0, ref.current.clientHeight)
          setSearchState({ err: null, loading: false })
        })
        .catch(err => {
          const error =
            err && err.message && err.message.data && err.message.data.error && err.response.data.error.message
              ? err.response.data.error.message
              : 'We are unable to retrieve your order, please try again later.'
          announce(error)
          setState({ orderList: {} })
          setSearchState({ err: error, loading: false })
        })
    } else {
      const error = 'Invalid phone number.'
      announce(error)
      setState({ orderList: {} })
      setSearchState({ err: error, loading: false })
    }
  }
}

export const viewOrderList = setState => {
  setState({ orderDetails: null })
}

export const viewOrderDetails = (order, setState) => {
  setState({ orderDetails: order })
  window.scrollTo(0, 0)
}

export const getFinDepositTotal = deposits => {
  let total = 0
  if (deposits.length > 0) {
    for (let i = 0, n = deposits.length; i < n; i++) {
      total += deposits[i].AuthorizedAmount
    }
  }
  return total
}

export const getOtherPayments = order => {
  let otherPayments = []
  if (order) {
    if (order.Deposits && order.Deposits.Deposit.length > 0) {
      otherPayments = [...otherPayments, ...order.Deposits.Deposit]
    }
    if (order.GCDeposits && order.GCDeposits.Deposit.length > 0) {
      otherPayments = [...otherPayments, ...order.GCDeposits.Deposit]
    }
  }
  return otherPayments
}

export const getPaymentType = dep => {
  switch (dep.CashCode) {
    case 'MC':
      return 'Master Card'
    case 'VA':
      return 'Visa'
    case 'DV':
      return 'Discover'
    case 'AMX':
      return 'American Express'
    case 'GC':
      return 'Gift Card'
    case 'PAL':
      return 'PayPal'
    case 'AFF':
      return 'Affirm'
  }
}
