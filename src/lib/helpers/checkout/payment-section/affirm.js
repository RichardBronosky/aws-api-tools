import { store } from '../../../../redux/store'
import { updatePayment } from '../../../services/checkout'
import { reportToSentry, getOrder } from '../global'
import { getRemainingTotal, getInfoWithGiftAndFinance } from './payment-section'
import { setOrder, setCheckoutStep } from '../../../../redux/modules/checkout'
import { checkoutStepAnalytics } from '../../google-tag-manager'

export const affirmAllowed = order => {
  if (order && order.paymentInfo) {
    return (
      order.paymentInfo.filter(
        payment => payment.paymentType === 'FIN' && payment.paymentProperties && payment.paymentProperties.hasPayments
      ).length < 1
    )
  }
  return true
}

export const getAffirmBody = () => {
  const order = getOrder()
  const applyFinance =
    order &&
    order.paymentInfo &&
    order.paymentInfo.filter(
      payment => payment.paymentType === 'FIN' && payment.paymentProperties && payment.paymentProperties.hasPayments
    ).length > 0
  let body
  if (order) {
    body = {
      order_id: order.orderId,
      merchant: {
        user_cancel_url: window.location.href,
        user_confirmation_url: window.location.href,
        user_confirmation_url_action: 'GET',
      },
      shipping: {
        name: {
          first: order.contact.firstName,
          last: order.contact.lastName,
        },
        address: {
          line1: order.shippingAddress.address1,
          line2: order.shippingAddress.address2,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          zipcode: order.shippingAddress.zip,
        },
        email: order.contact.email,
        phone_number: order.contact.phone,
      },
      billing: {
        name: {
          first: order.payer ? order.payer.firstName : order.contact.firstName,
          last: order.payer ? order.payer.lastName : order.contact.lastName,
        },
        address: {
          line1: order.billingAddress ? order.billingAddress.address1 : order.shippingAddress.address1,
          line2: order.billingAddress ? order.billingAddress.address2 : order.shippingAddress.address2,
          city: order.billingAddress ? order.billingAddress.city : order.shippingAddress.city,
          state: order.billingAddress ? order.billingAddress.state : order.shippingAddress.state,
          zipcode: order.billingAddress ? order.billingAddress.zip : order.shippingAddress.zip,
        },
        email: order.contact.email,
        phone_number: order.contact.phone,
      },
      items: getAffirmLineItems(order.lineItems),
      discounts: {},
      currency: 'USD',
      shipping_amount: order.totalDeliveryCharge,
      tax_amount: order.tax,
      total: Math.floor(getRemainingTotal(true, null, true, applyFinance).total * 100),
    }
  }
  return body
}

const getAffirmLineItems = lineItems => {
  let affirmItems = []
  for (let i = 0, n = lineItems.length; i < n; i++) {
    affirmItems.push({
      sku: lineItems[i].sku,
      display_name: lineItems[i].title || 'unknown',
      unit_price: lineItems[i].unitPrice,
      qty: lineItems.quantity,
    })
  }
  return affirmItems
}

export const handleAffirm = () => {
  const index = window.location.href.indexOf('?checkout_token')
  if (index > 0) {
    const af = window.location.href.slice(index + 16)
    window.history.replaceState({}, document.title, '/checkout')
    const order = getOrder()
    if (order) {
      let afPaymentInfo = []
      const giftFin = getInfoWithGiftAndFinance()
      if (giftFin && giftFin.length > 0) {
        afPaymentInfo = giftFin
      }
      afPaymentInfo.push({
        paymentType: 'AFF',
        paymentProperties: {
          checkout_token: af,
          order_id: order.orderId,
        },
      })
      updatePayment({
        paymentInfo: afPaymentInfo,
        orderId: order.orderId,
      })
        .then(data => {
          store.dispatch(setOrder(data))
          store.dispatch(setCheckoutStep('review'))
          checkoutStepAnalytics('review')
        })
        .catch(err => reportToSentry(err, order, 'updatePayment', 'componentDidMount payment section'))
    }
  }
}
