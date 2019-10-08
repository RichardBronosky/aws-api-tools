import * as Sentry from '@sentry/browser'
import { store } from '../../../redux/store'
import {
  setOrder,
  setCheckoutStep as setCheckoutStepRedux,
  setCheckoutStepLoading,
  initialState,
  setShippingInvalidFields,
  setDeclineModalInfo,
} from '../../../redux/modules/checkout'
import { validateShippingStep, setAddress } from './shipping-section'
import { validateDeliveryStep, canSkipDelivery } from './delivery-section'
import { validatePaymentStep } from './payment-section/payment-section'
import { redactCCFromOrder } from './payment-section/credit-card'
import { validateReviewStep, placeOrderReview } from './review-section'
import { checkoutStepAnalytics } from '../google-tag-manager'
import { getRegionZone } from '../geo-location'
import { getCart } from '../cart'
import { fetchAddressLookup } from '../../services/checkout'
import { submitBillingAddress } from './payment-section/billing-address'

export const getOrder = () => {
  return store.getState().checkout.order
}

export const setOrderInfo = (info, field) => {
  const order = getOrder()
  const newOrder = {
    ...order,
    [field]: info,
  }
  store.dispatch(setOrder(newOrder))
}

export const setCheckoutStep = async (e, checkoutStep, nextStep, placeOrder = false) => {
  e && e.preventDefault()
  store.dispatch(setCheckoutStepLoading(true))
  const invalidFields = await validateCheckoutStep(checkoutStep, nextStep)
  if (!invalidFields || invalidFields.length < 1) {
    if (placeOrder) {
      await placeOrderReview()
    } else {
      if (checkoutStep === 'shipping' && nextStep === 'delivery') {
        const canSkip = await canSkipDelivery()
        if (canSkip) {
          store.dispatch(setCheckoutStepRedux('payment'))
          checkoutStepAnalytics('payment', canSkip)
        } else {
          store.dispatch(setCheckoutStepRedux('delivery'))
          checkoutStepAnalytics('delivery')
        }
      } else {
        store.dispatch(setCheckoutStepRedux(nextStep))
        checkoutStepAnalytics(nextStep)
      }
    }
    if (checkoutStep !== nextStep) {
      if (typeof window !== 'undefined') {
        let checkoutStepEl = document.querySelector('#' + nextStep)
        if (checkoutStepEl) {
          let topOfElement = checkoutStepEl.offsetTop - 85
          try {
            window.scroll({ top: topOfElement, behavior: 'smooth', block: 'start' })
          } catch {
            //do nothing
          }
        }
      }
    }
  }
  store.dispatch(setCheckoutStepLoading(false))
}

export const validateCheckoutStep = (checkoutStep, nextStep) => {
  if (checkoutStep === 'shipping') {
    return validateShippingStep(nextStep)
  }
  if (checkoutStep === 'delivery') {
    return validateDeliveryStep(nextStep)
  }
  if (checkoutStep === 'payment') {
    return validatePaymentStep(nextStep)
  }
  if (checkoutStep === 'review' && !nextStep) {
    return validateReviewStep()
  }
}

export const reportToSentry = (err, order, callName, eventLabel) => {
  Sentry.configureScope(scope => {
    try {
      scope.setExtra('order', redactCCFromOrder(order))(err && !err.response) &&
        scope.setExtra('err', err)(err && err.response) &&
        scope.setExtra('API error response', err.response)
    } catch (e) {}
  })
  Sentry.captureException(`Checkout Error (${ callName } ${ eventLabel })`)
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
        if (
          giftCards.length > 0 &&
          giftCards[0].authorizedAmount > 0 &&
          order.giftCardInfo &&
          order.giftCardInfo.useGiftCard
        ) {
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

export const clearCheckoutState = (clearOrderId = false) => {
  const order = getOrder()
  let newOrder = {
    ...initialState.order,
    shippingAddress: {
      ...order.shippingAddress,
    },
    contact: {
      ...order.contact,
    },
    lineItems: [],
    total: 0,
    tax: 0,
    totalDeliveryCharge: 0,
  }
  if (!clearOrderId) {
    newOrder.orderId = order.orderId
  } else {
    newOrder.orderId = null
  }
  store.dispatch(setOrder(newOrder))
  store.dispatch(setCheckoutStepRedux('shipping'))
}

export const setDeclineModalClose = () => {
  store.dispatch(
    setDeclineModalInfo({
      ...initialState.declineModalInfo,
    })
  )
}

export const getLineItems = () => {
  const cart = getCart()
  let lineItems = []
  if (cart && cart.cartItems) {
    for (let i = 0, n = cart.cartItems.length; i < n; i++) {
      const index = lineItems.findIndex(product => product.sku === cart.cartItems[i].sku)
      if (index > -1) {
        lineItems[index].quantity = lineItems[index].quantity + cart.cartItems[i].quantity
      } else {
        lineItems.push({
          sku: cart.cartItems[i].sku,
          quantity: parseInt(cart.cartItems[i].quantity),
          childItems: getProductChildren(cart.cartItems[i]),
          deliveryType: cart.cartItems[i].product.delivery_type,
          title: cart.cartItems[i].product.title,
          category: cart.cartItems[i].product.category,
          unitPrice: cart.cartItems[i].product.unitPrice,
          addons:
            cart.cartItems[i].activeAddons &&
            cart.cartItems[i].activeAddons.map(addon => ({
              sku: addon.sku,
              quantity: addon.quantity,
              required:
                cart.cartItems[i].product.addon_items &&
                cart.cartItems[i].product.addon_items.filter(addon_item => addon_item.sku === addon.sku)[0]
                  .addon_required,
            })),
        })
      }
      if (
        !cart.cartItems[i].activeAddons ||
        (cart.cartItems[i].activeAddons && cart.cartItems[i].activeAddons.length > 0)
      ) {
        const requiredAddons =
          cart.cartItems[i].product.addon_items &&
          cart.cartItems[i].product.addon_items.filter(addon => addon.addon_required)
        if (requiredAddons) {
          for (let x = 0, y = requiredAddons.length; x < y; x++) {
            if (
              requiredAddons &&
              requiredAddons.length > 0 &&
              (!cart.cartItems[i].activeAddons ||
                (cart.cartItems[i].activeAddons &&
                  cart.cartItems[i].activeAddons.filter(addon => addon.sku === requiredAddons[x].sku).length < 1))
            ) {
              const index = lineItems.findIndex(product => product.sku === '99999925')
              if (index > -1) {
                lineItems[index].quantity += cart.cartItems[i].quantity * requiredAddons[x].quantity
              } else {
                lineItems.push({
                  sku: '99999925',
                  quantity: parseInt(cart.cartItems[i].quantity * requiredAddons[x].quantity),
                  deliveryType: 'D',
                  required: true,
                })
              }
            }
          }
        }
        if (cart.cartItems[i].activeAddons) {
          for (let x = 0, y = cart.cartItems[i].activeAddons.length; x < y; x++) {
            const index = lineItems.findIndex(product => product.sku === cart.cartItems[i].activeAddons[x].sku)
            if (index > -1) {
              lineItems[index].quantity += cart.cartItems[i].activeAddons[x].quantity
            } else {
              lineItems.push({
                sku: cart.cartItems[i].activeAddons[x].sku,
                quantity: parseInt(cart.cartItems[i].quantity * cart.cartItems[i].activeAddons[x].quantity),
                deliveryType: cart.cartItems[i].activeAddons[x].delivery_type,
                required: true,
                title: cart.cartItems[i].activeAddons[x].title,
                category: cart.cartItems[i].activeAddons[x].category,
              })
            }
          }
        }
      }
    }
  }
  return lineItems
}

export const getProductChildren = item => {
  let children = item.product.package_skus
  let childArr = []
  if (children) {
    const region = getRegionZone().region
    children = children[region]
    if (children) {
      for (let i = 0, n = children.length; i < n; i++) {
        childArr.push({ ...children[i], quantity: parseInt(children[i].quantity) })
      }
    }
  }
  return childArr
}

export const checkManualAddress = async (order, invalidFields, billing = false) => {
  if (!order.acceptManual) {
    const address = billing ? order.billingAddress : order.shippingAddress
    const manualAddressQAS = await fetchAddressLookup(
      `${ address.address1 }, ${ address.city } ${ address.state } ${ address.zip }`
    )
    if (manualAddressQAS && manualAddressQAS.totalMatches > 0) {
      invalidFields = await addressSuggestion(order, invalidFields, manualAddressQAS, billing)
    } else if (address.zip.includes('-')) {
      const manualAddressQASNoPlus4 = await fetchAddressLookup(
        `${ address.address1 }, ${ address.city } ${ address.state } ${ address.zip.split('-')[0] }`
      )
      invalidFields = await addressSuggestion(order, invalidFields, manualAddressQASNoPlus4, billing, true)
    } else if (manualAddressQAS && manualAddressQAS.totalMatches <= 0) {
      const manualAddressQASNoMatches = await fetchAddressLookup(address.address1)
      invalidFields = await addressSuggestion(order, invalidFields, manualAddressQASNoMatches, billing, true)
    } else {
      invalidFields = ['unable to verify']
    }
  }
  return invalidFields
}

export const closeSuggestionModal = () => {
  let order = getOrder()
  order['suggestedAddress'] = null
  store.dispatch(setOrder(order))
  store.dispatch(setShippingInvalidFields([]))
}

export const addressSuggestion = async (order, invalidFields, manualAddressQAS, billing, badPlus4 = false) => {
  if (
    manualAddressQAS &&
    manualAddressQAS.results &&
    manualAddressQAS.results[0] &&
    manualAddressQAS.results[0].suggestion
  ) {
    let suggestion = manualAddressQAS.results[0].suggestion.toLowerCase()
    const address = billing ? order.billingAddress : order.shippingAddress
    if (
      !suggestion.includes(address.address1.toLowerCase()) ||
      !suggestion.includes(address.city.toLowerCase()) ||
      !suggestion.includes(address.state.toLowerCase()) ||
      (!address.zip.includes(suggestion.substr(suggestion.length - 5)) || badPlus4)
    ) {
      const suggestedAddress = await fetchAddressLookup(address.address1)
      if (
        suggestedAddress &&
        suggestedAddress.results &&
        suggestedAddress.results[0] &&
        suggestedAddress.results[0].suggestion
      ) {
        order['suggestedAddress'] = suggestedAddress.results[0].suggestion
      } else {
        order['suggestedAddress'] = null
      }
      return ['unable to verify']
    }
  } else {
    order['suggestedAddress'] = null
    return ['unable to verify']
  }
  store.dispatch(setOrder(order))
  return invalidFields
}

export const acceptAddressSuggestion = (suggestedAddress, billing = false, setBillingState = null) => {
  setAddress(suggestedAddress, billing)
  closeSuggestionModal()
  billing && setBillingState ? submitBillingAddress(setBillingState) : setCheckoutStep(null, 'shipping', 'delivery')
}

export const declineAddressSuggestion = (billing = false, setBillingState = null) => {
  let order = getOrder()
  store.dispatch(setOrder({ ...order, acceptManual: true }))
  closeSuggestionModal()
  billing && setBillingState ? submitBillingAddress(setBillingState) : setCheckoutStep(null, 'shipping', 'delivery')
}
