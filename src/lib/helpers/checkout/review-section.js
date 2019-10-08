import Cookies from 'universal-cookie'
import * as Sentry from '@sentry/browser'
import { navigate } from 'gatsby'
import { store } from '../../../redux/store'
import { setOrder, setReviewInvalidFields, setDeclineModalInfo } from '../../../redux/modules/checkout'
import { clearCart } from '../../../redux/modules/cart'
import { reportToSentry, getOrder, clearCheckoutState } from './global'
import { placeOrder as placeOrderAPI } from '../../services/checkout'
import { placeOrderAnalytics } from '../google-tag-manager'
import { redactCCFromOrder } from './payment-section/credit-card'

const cookies = new Cookies()

export const setReviewInfo = (info, field) => {
  const order = getOrder()
  store.dispatch(
    setOrder({
      ...order,
      reviewInfo: {
        ...order.reviewInfo,
        [field]: info,
      },
    })
  )
}

export const validateReviewStep = async () => {
  const order = getOrder()
  let invalidFields = []
  const entries = Object.entries(order.reviewInfo)
  let validated = false
  if (entries[0][1] === true && (entries[1][1] === true || !order.isPickup)) {
    validated = true
  }
  if (!validated) {
    invalidFields.push('accept')
  }
  store.dispatch(setReviewInvalidFields(invalidFields))
  return invalidFields
}

export const placeOrderReview = async () => {
  const order = getOrder()
  const TL_RTG = cookies.get('TL_RTG')
  const session = cookies.get('session_id')
  const res = await placeOrderAPI(order.orderId, session, TL_RTG).catch(err => {
    if (
      err.response &&
      err.response.data &&
      err.response.data.error &&
      err.response.data.error.message &&
      order &&
      order.paymentInfo
    ) {
      if (
        err.response.data.error.message.includes('Credit Card was declined') &&
        order.paymentInfo.filter(payment => payment.paymentType === 'CYBERV2').length > 0
      ) {
        store.dispatch(
          setDeclineModalInfo({
            declineModalOpen: true,
            declineCloseLoading: false,
            declineType: 'credit card',
          })
        )
        store.dispatch(
          setOrder({
            ...order,
            reviewInfo: {
              acceptTerms: false,
              acceptPickupTerms: false,
            },
          })
        )
      } else if (
        err.response.data.error.message.includes('RGE declined authorization') &&
        order.paymentInfo.filter(payment => payment.paymentType === 'FIN').length > 0
      ) {
        store.dispatch(
          setDeclineModalInfo({
            declineModalOpen: true,
            declineCloseLoading: false,
            declineType: 'Rooms To Go financing',
          })
        )
        store.dispatch(
          setOrder({
            ...order,
            reviewInfo: {
              acceptTerms: false,
              acceptPickupTerms: false,
            },
          })
        )
      } else {
        store.dispatch(
          setDeclineModalInfo({
            reviewInvalidFields: ['order'],
            declineCloseLoading: false,
          })
        )
        store.dispatch(
          setOrder({
            ...order,
            reviewInfo: {
              acceptTerms: false,
              acceptPickupTerms: false,
            },
          })
        )
      }
      reportToSentry(err, order, 'placeOrder', 'failure')
    }
  })
  if (res) {
    placeOrderAnalytics(res)
    store.dispatch(clearCart())
    Sentry.configureScope(scope => {
      scope.setExtra('placeOrder', redactCCFromOrder(order))
    })
    Sentry.captureMessage(`Checkout Success`)
    navigate(`/order/success/${ order.orderId }`)
    clearCheckoutState(true)
  }
}
