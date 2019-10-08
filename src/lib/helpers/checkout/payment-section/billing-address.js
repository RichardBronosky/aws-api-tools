import { store } from '../../../../redux/store'
import { setOrder } from '../../../../redux/modules/checkout'
import { getOrder, reportToSentry, checkManualAddress } from '../global'
import { getInfoWithGiftAndFinance } from './payment-section'
import { abbreviateState } from '../../geo-location'
import { validateZip } from '../..//string-helper'
import { updateAddress, updatePayment } from '../../../services/checkout'
import { getAddressSpecificBody } from '../shipping-section'

export const setBillingAddressInfo = (info, field = null) => {
  let order = getOrder()
  if (info.state) {
    info.state = abbreviateState(info.state)
  } else if (field === 'state') {
    info = abbreviateState(info)
  }
  if (field) {
    order = {
      ...order,
      billingAddress: {
        ...order.billingAddress,
        [field]: info,
      },
    }
  } else {
    order = {
      ...order,
      billingAddress: {
        ...order.billingAddress,
        ...info,
      },
    }
  }
  store.dispatch(setOrder(order))
}

export const validateBillingAddress = async order => {
  const entries = Object.entries(Object.assign({}, order.payer, order.billingAddress))
  let invalidFields = []
  for (let i = 0; i < entries.length; i++) {
    const entryKey = entries[i][0]
    const entryData = entries[i][1]
    if ((entryData === '' || entryData === null) && entryKey !== 'address2') {
      if (entryKey === 'address1') {
        invalidFields.push('street')
      } else {
        invalidFields.push(entryKey)
      }
    } else {
      if (entryKey === 'zip') {
        !validateZip(entryData) && invalidFields.push('zip')
      }
    }
  }
  if (invalidFields.length < 1) {
    invalidFields = await checkManualAddress(order, invalidFields, true)
  }
  return invalidFields
}

export const submitBillingAddress = setBillingState => {
  const order = getOrder()
  setBillingState({ invalidFields: [], loading: true })
  updateAddress(getAddressSpecificBody(order, true))
    .then(order => {
      let newPaymentInfo = []
      const giftFin = getInfoWithGiftAndFinance()
      if (giftFin && giftFin.length > 0) {
        newPaymentInfo = giftFin
      }
      updatePayment({
        paymentInfo: newPaymentInfo,
        orderId: order.orderId,
      })
        .then(data => {
          store.dispatch(
            setOrder({
              ...data,
              payer: {
                ...data.payer,
                billingDifferent: true,
                billingSubmitted: true,
              },
              acceptManual: false,
            })
          )
          setBillingState({ loading: false, invalidFields: [] })
        })
        .catch(err => {
          reportToSentry(err, order, 'updatePayment', 'billing change')
          setBillingState({ loading: false })
        })
    })
    .catch(err => {
      reportToSentry(err, order, 'updateAddress', 'billing change')
      setBillingState({ loading: false })
    })
}

export const onChangeBillingDifferent = (event, order) => {
  order = {
    ...order,
    payer: {
      ...order.payer,
      billingDifferent: !event.target.checked,
    },
  }
  if (order && order.payer) {
    if (order.payer.billingSubmitted) {
      store.dispatch(
        setOrder({
          ...order,
          cyberSourceSignature: null,
        })
      )
      updateAddress(getAddressSpecificBody(order, !event.target.checked))
        .then(() => {
          let newPaymentInfo = []
          const giftCards = order.paymentInfo.filter(payment => payment.paymentType === 'GIFT')
          if (giftCards.length > 0) {
            newPaymentInfo = giftCards
          }
          updatePayment({
            paymentInfo: newPaymentInfo,
            orderId: order.orderId,
          })
            .then(data => {
              store.dispatch(
                setOrder({
                  ...data,
                  payer: {
                    ...order.payer,
                    ...data.payer,
                  },
                })
              )
            })
            .catch(err => {
              reportToSentry(err, order, 'updatePayment', 'billing change')
            })
        })
        .catch(err => {
          reportToSentry(err, order, 'updateAddress', 'billing change')
        })
    } else {
      store.dispatch(setOrder(order))
    }
  }
}

export const onBillingStateChange = event => {
  event.target.value !== 'none' && setBillingAddressInfo(event.target.value, 'state')
}
