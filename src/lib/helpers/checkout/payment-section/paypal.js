import { navigate } from 'gatsby'
import { store } from '../../../../redux/store'
import { getOrder, reportToSentry } from '../global'
import { getRemainingTotal, getInfoWithGiftAndFinance } from '../payment-section/payment-section'
import { setOrder, setCheckoutStep } from '../../../../redux/modules/checkout'
import { getAddressSpecificBody } from '../shipping-section'
import { getDeliverySpecificBody } from '../delivery-section'
import { updateAddress, updateDelivery, updatePayment } from '../../../services/checkout'
import { addToDataLayer, checkoutStepAnalytics } from '../../google-tag-manager'
import { checkShippingZip } from '../shipping-section'
import { setDeliveryCalendar } from '../delivery-section'

export const getPayPalEmail = order => {
  if (order && order.paymentInfo) {
    const pp = order.paymentInfo.filter(payment => payment.paymentType === 'PALV2')[0]
    if (pp && pp.paymentProperties && pp.paymentProperties.payerEmail) {
      return pp.paymentProperties.payerEmail
    }
  }
  return ''
}

export const getPayPalTotal = total => {
  let order = getOrder()
  let ppTotal
  if (order && order.orderId && (total > 0 || order.total > 0)) {
    const applyFinance =
      order &&
      order.paymentInfo &&
      order.paymentInfo.filter(
        payment => payment.paymentType === 'FIN' && payment.paymentProperties && payment.paymentProperties.hasPayments
      ).length > 0
    ppTotal = Math.floor((getRemainingTotal(true, null, true, applyFinance).total || total) * 100) / 100
  }
  return ppTotal
}

export const createOrder = (data, actions, total, isCheckout) => {
  addToDataLayer('click', 'cart', 'paypal')
  return actions.order.create({
    purchase_units: [
      {
        amount: {
          value: total,
        },
      },
    ],
    application_context: {
      user_action: 'CONTINUE',
      shipping_preference: isCheckout ? 'NO_SHIPPING' : 'GET_FROM_FILE',
    },
  })
}

export const onApprove = (data, actions, isCheckout, setLoading) => {
  return actions.order.get().then(data => {
    let shippingAddress
    if (
      data.purchase_units &&
      data.purchase_units.length > 0 &&
      data.purchase_units[0].shipping &&
      data.purchase_units[0].shipping.address
    ) {
      shippingAddress = data.purchase_units[0].shipping.address
    }
    const paymentObj = {
      paid: true,
      cancelled: false,
      paypalOrderId: data.id,
      name: data.payer.name,
      shippingAddress: shippingAddress,
      address: data.payer.address,
      email: data.payer.email_address,
      phone: data.payer.phone.phone_number.national_number.replace(/-/g, ''),
      payer_status: data.status,
    }
    setInfo(paymentObj, isCheckout, setLoading)
  })
}

const setInfo = async (payment, isCheckout, setLoading) => {
  setLoading(true)
  let order = {
    ...getOrder(),
  }
  if (order) {
    order.payer = {
      firstName: payment.name.given_name,
      lastName: payment.name.surname,
      email: payment.email,
      phone: payment.phone,
    }
    order.billingAddress = {
      ...order.billingAddress,
      address1: payment.address.address_line_1,
      address2: payment.address.address_line_2 ? payment.address.address_line_2 : '',
      city: payment.address.admin_area_2,
      state: payment.address.admin_area_1,
      zip: payment.address.postal_code,
    }
    store.dispatch(setOrder(order))
    if (!isCheckout) {
      order.contact = {
        firstName: payment.name.given_name,
        lastName: payment.name.surname,
        email: payment.email,
        phone: payment.phone,
      }
      order.shippingAddress = {
        ...order.shippingAddress,
        address1: payment.shippingAddress ? payment.shippingAddress.address_line_1 : payment.address.address_line_1,
        address2: payment.shippingAddress
          ? payment.shippingAddress.address_line_2
            ? payment.shippingAddress.address_line_2
            : ''
          : payment.address.address_line_2
          ? payment.address.address_line_2
          : '',
        city: payment.shippingAddress ? payment.shippingAddress.admin_area_2 : payment.address.admin_area_2,
        state: payment.shippingAddress ? payment.shippingAddress.admin_area_1 : payment.address.admin_area_1,
        zip: payment.shippingAddress ? payment.shippingAddress.postal_code : payment.address.postal_code,
      }
      let okayState = true
      okayState = await checkShippingZip(
        payment.shippingAddress ? payment.shippingAddress.postal_code : payment.address.postal_code
      ).catch(() => {
        okayState = false
      })
      if (okayState) {
        let addrOrder = await updateAddress(getAddressSpecificBody(order, true)).catch(err => {
          setLoading(false)
          reportToSentry(err, addrOrder, 'updateAddress', 'paypal express shipping')
        })
        if (addrOrder.deliveryCalendar.length > 0) {
          const calendar = setDeliveryCalendar(
            addrOrder.deliveryCalendar,
            addrOrder.pickupCalendar,
            addrOrder.expressDeliveryDate,
            false
          )
          addrOrder.deliveryDate =
            calendar.filter(date => date.isStandardDelivery && !date.isExpressDelivery)[0].date || calendar[0].date
        }
        updateDelivery(getDeliverySpecificBody(addrOrder))
          .then(() => {
            updatePayment({
              paymentInfo: [
                {
                  paymentType: 'PALV2',
                  paymentProperties: {
                    payer_status: payment.payer_status,
                    paypalOrderId: payment.paypalOrderId,
                    payerEmail: payment.email,
                  },
                },
              ],
              orderId: order.orderId,
            })
              .then(finalOrder => {
                store.dispatch(setOrder(finalOrder))
                store.dispatch(setCheckoutStep('review'))
                checkoutStepAnalytics('review')
                setTimeout(navigate('/checkout'), 1000)
              })
              .catch(err => {
                reportToSentry(err, order, 'updatePayment', 'paypal express')
              })
          })
          .catch(err => {
            reportToSentry(err, order, 'updateDelivery', 'paypal express')
          })
      } else {
        window && window.location.reload()
      }
    } else {
      let ppPaymentInfo = []
      const giftFin = getInfoWithGiftAndFinance()
      if (giftFin && giftFin.length > 0) {
        ppPaymentInfo = giftFin
      }
      ppPaymentInfo.push({
        paymentType: 'PALV2',
        paymentProperties: {
          payer_status: payment.payer_status,
          paypalOrderId: payment.paypalOrderId,
          payerEmail: payment.email,
        },
      })
      updatePayment({
        paymentInfo: ppPaymentInfo,
        orderId: order.orderId,
      })
        .then(finalOrder => {
          setLoading(false)
          store.dispatch(setOrder(finalOrder))
          store.dispatch(setCheckoutStep('review'))
          checkoutStepAnalytics('review')
        })
        .catch(err => {
          setLoading(false)
          reportToSentry(err, order, 'updatePayment', 'paypal checkout')
        })
    }
  }
}
