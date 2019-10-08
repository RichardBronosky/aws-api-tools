import { store } from '../../../../redux/store'
import { setOrder, setPaymentInvalidFields } from '../../../../redux/modules/checkout'
import { getOrder } from '../global'
import { getGiftCards } from './gift-cards'
import { validateZip } from '../../string-helper'

export const canShowBilling = order => {
  let showBilling
  const orderValues = getRemainingTotal(true, null, true)
  const cyber = order && order.paymentInfo && order.paymentInfo.filter(payment => payment.paymentType === 'CYBERV2')
  const giftCards = getGiftCards()
  if (cyber && cyber.length > 0 && cyber[0].paymentProperties && cyber[0].paymentProperties.token) {
    showBilling = true
  } else {
    showBilling =
      order.selectedPaymentType !== 'Credit' &&
      orderValues.total >= 0 &&
      giftCards.length !==
        (order && order.paymentInfo && order.paymentInfo.filter(payment => payment.paymentType !== 'CYBERV2').length)
  }
  return showBilling
}

export const getCreditCardType = order => {
  let cardType
  if (order && order.paymentInfo) {
    const credit = order.paymentInfo.filter(payment => payment.paymentType === 'CYBERV2')[0]
    if (
      credit &&
      credit.paymentProperties &&
      credit.paymentProperties.token &&
      credit.paymentProperties.token.cardType
    ) {
      cardType = credit.paymentProperties.token.cardType
    }
  }
  return cardType
}

export const getActualPaymentType = order => {
  if (order && order.paymentInfo && order.paymentInfo.length > 0) {
    let cc = order.paymentInfo.filter(payment => payment.paymentType === 'CYBERV2')
    if (cc.length > 0) {
      cc = cc[0]
      if (cc && cc.paymentProperties && cc.paymentProperties.token) return 'Credit'
    }
    const paypal = order.paymentInfo.filter(payment => payment.paymentType === 'PALV2')
    if (paypal.length > 0) return 'PayPal'
    const visa = order.paymentInfo.filter(payment => payment.paymentType === 'VISA')
    if (visa.length > 0) return 'Visa Checkout'
    const affirm = order.paymentInfo.filter(payment => payment.paymentType === 'AFF')
    if (affirm.length > 0) return 'Affirm'
    const fin = order.paymentInfo.filter(payment => payment.paymentType === 'FIN')
    if (fin.length > 0) return 'Rooms To Go Finance'
  }
}

export const getPaymentCondensedAddressInfo = (order, actualPaymentType) => {
  let addressInfo = {
    firstName: order.contact.firstName,
    lastName: order.contact.lastName,
    address1: order.shippingAddress.address1,
    address2: order.shippingAddress.address2,
    city: order.shippingAddress.city,
    state: order.shippingAddress.state,
    zip: order.shippingAddress.zip,
  }
  if ((order.payer.billingDifferent && order.payer.billingSubmitted) || actualPaymentType === 'PayPal') {
    addressInfo = {
      firstName: order.payer.firstName,
      lastName: order.payer.lastName,
      address1: order.billingAddress.address1,
      address2: order.billingAddress.address2,
      city: order.billingAddress.city,
      state: order.billingAddress.state,
      zip: order.billingAddress.zip,
    }
  }
  return addressInfo
}

export const getRemainingTotal = (
  deliveryComplete = true,
  prevTotal = null,
  isCheckout = false,
  applyFinance = true,
  shippingComplete = true
) => {
  const order = getOrder()
  let total = 0
  let appliedGiftCards = 0
  let appliedFinance = 0
  if (prevTotal) {
    total = prevTotal
  }
  if (order && order.total && shippingComplete && isCheckout) {
    total = order.total
    if (!deliveryComplete && order.tax) {
      total -= order.tax
    }
    if (deliveryComplete) {
      if (order.paymentInfo && order.paymentInfo.length > 0) {
        const giftCards = order.paymentInfo.filter(payment => payment.paymentType === 'GIFT')
        if (giftCards.length > 0 && giftCards[0].authorizedAmount > 0) {
          for (let i = 0, n = giftCards.length; i < n; i++) {
            appliedGiftCards = appliedGiftCards + giftCards[i].authorizedAmount
          }
          total = total - appliedGiftCards
        }
        const rtgFin = order.paymentInfo.filter(payment => payment.paymentType === 'FIN')
        if (rtgFin.length > 0 && applyFinance) {
          appliedFinance = rtgFin[0].authorizedAmount
          total = total - appliedFinance
        }
      }
    }
  }
  return {
    total: total,
    gift: appliedGiftCards,
    fin: appliedFinance,
    tax: order && order.tax,
    deliveryCost: order && order.totalDeliveryCharge,
    totalSavings: order && order.promotions && order.promotions.totalSavings,
  }
}

export const getInfoWithGiftAndFinance = () => {
  const order = getOrder()
  let giftFin
  if (order && order.paymentInfo) {
    giftFin = order.paymentInfo.filter(
      payment =>
        payment.paymentType === 'GIFT' ||
        (payment.paymentType === 'FIN' && payment.paymentProperties && payment.paymentProperties.hasPayments)
    )
  }
  return giftFin
}

export const setPayerInfo = (info, field) => {
  let order = getOrder()
  if (field) {
    order = {
      ...order,
      payer: {
        ...order.payer,
        [field]: info,
      },
    }
  } else {
    order = {
      ...order,
      payer: {
        ...order.payer,
        ...info,
      },
    }
  }
  store.dispatch(setOrder(order))
}

export const validatePaymentStep = nextStep => {
  let order = getOrder()
  let invalidFields = []
  if (order && order.payer && order.payer.billingDiffferent && nextStep === 'review') {
    entries = Object.entries({
      ...order.billingAddress,
      ...order.payer,
    })
    for (let i = 0; i < entries.length; i++) {
      const entryKey = entries[i][0]
      const entryData = entries[i][1]
      if (
        (entryData === '' || entryData === null) &&
        entryKey !== 'address2' &&
        entryKey !== 'phone' &&
        entryKey !== 'email'
      ) {
        invalidFields.push(entryKey)
      } else {
        if (entryKey === 'email') {
          !validateEmail(entryData) && invalidFields.push('email')
        }
        if (entryKey === 'zip') {
          !validateZip(entryData) && invalidFields.push('zip')
        }
      }
    }
  }
  let validated = true
  order && order.amountDue > 0 && nextStep === 'review' && (validated = false)
  invalidFields.length > 0 && (validated = false)
  invalidFields.length > 0 ? invalidFields : !validated ? ['A payment has not been submitted.'] : [],
    store.dispatch(setPaymentInvalidFields(invalidFields))
  return invalidFields
}

export const shouldShowPayments = order => {
  if (order && order.total && order.paymentInfo && order.paymentInfo.length > 0) {
    let appliedPayments = 0
    const giftCards = order.paymentInfo.filter(payment => payment.paymentType === 'GIFT')
    if (giftCards.length > 0 && giftCards[0].authorizedAmount) {
      for (let i = 0, n = giftCards.length; i < n; i++) {
        appliedPayments += giftCards[i].authorizedAmount
      }
    }
    if (order.total <= appliedPayments) {
      return !order.giftCardInfo.useGiftCard
    } else {
      return true
    }
  } else {
    return true
  }
}
