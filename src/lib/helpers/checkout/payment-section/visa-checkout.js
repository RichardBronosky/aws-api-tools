import { store } from '../../../../redux/store'
import { updatePayment } from '../../../services/checkout'
import { reportToSentry, getOrder } from '../global'
import { getRemainingTotal, getInfoWithGiftAndFinance } from './payment-section'
import { setOrder, setCheckoutStep } from '../../../../redux/modules/checkout'
import { checkoutStepAnalytics } from '../../google-tag-manager'

export const visaCheckoutSetup = async order => {
  const applyFinance =
    order &&
    order.paymentInfo &&
    order.paymentInfo.filter(
      payment => payment.paymentType === 'FIN' && payment.paymentProperties && payment.paymentProperties.hasPayments
    ).length > 0
  if (typeof window !== 'undefined' && typeof window.V !== 'undefined') {
    window.V.init({
      apikey: process.env.GATSBY_VISA_CHECKOUT_API_KEY,
      paymentRequest: {
        currencyCode: 'USD',
        subtotal: Math.floor(getRemainingTotal(true, null, true, applyFinance).total * 100) / 100,
        displayName: 'RoomsToGo',
      },
    })
    window.V.on('payment.success', payment => onVisaCheckoutSuccess(payment))
    window.V.on('payment.error', () => alert('Visa Checkout unable to complete.'))
  }
}

export const onVisaCheckoutSuccess = payment => {
  const order = {
    ...getOrder(),
    billingAddress: {
      address1: '',
      address2: '',
      city: '',
      country_code: 'US',
      county: '',
      plus4: '',
      state: '',
      zip: payment.partialShippingAddress.postalCode,
    },
  }
  if (order) {
    let vcPaymentInfo = []
    const giftFin = getInfoWithGiftAndFinance()
    if (giftFin && giftFin.length > 0) {
      vcPaymentInfo = giftFin
    }
    vcPaymentInfo.push({
      paymentType: 'VISA',
      paymentProperties: {
        vc_order_id: payment.callid,
        merchant_ref_number: order.orderId,
      },
    })
    updatePayment({
      paymentInfo: vcPaymentInfo,
      orderId: order.orderId,
    })
      .then(data => {
        store.dispatch(setOrder(data))
        store.dispatch(setCheckoutStep('review'))
        checkoutStepAnalytics('review')
      })
      .catch(err => reportToSentry(err, order, 'updatePayment', 'affirm'))
  }
}
