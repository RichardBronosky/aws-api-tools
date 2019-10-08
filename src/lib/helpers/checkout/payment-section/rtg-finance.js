import { store } from '../../../../redux/store'
import { getOrder, reportToSentry } from '../global'
import { setOrder, setCheckoutStep } from '../../../../redux/modules/checkout'
import { validateZip } from '../../../../lib/helpers/string-helper'
import { updatePayment } from '../../../../lib/services/checkout'
import { checkoutStepAnalytics } from '../../google-tag-manager'

export const getRTGFinance = () => {
  const order = getOrder()
  let rtgFin
  if (order && order.paymentInfo) {
    const rtgFins = order.paymentInfo.filter(payment => payment.paymentType === 'FIN')
    if (rtgFins && rtgFins.length > 0) {
      rtgFin = rtgFins[0]
    }
  }
  return rtgFin
}

export const setOrderFinancePlanInfo = (info, field) => {
  let order = getOrder()
  if (field) {
    order = {
      ...order,
      financePlan: {
        ...order.financePlan,
        [field]: info,
      },
    }
  } else {
    order = {
      ...order,
      financePlan: {
        ...info,
      },
    }
  }
  store.dispatch(setOrder(order))
}

export const getFinanceCodeFromOrder = () => {
  const order = getOrder()
  let finCode
  if (order && order.paymentInfo) {
    const fin = order.paymentInfo.filter(payment => payment.paymentType === 'FIN')
    if (fin && fin.length > 0) {
      finCode = fin[0].paymentProperties.financePlan
    }
  }
  return finCode
}

export const validateRTGCreditInfo = async (event, plan, rtgCreditInfo, setRTGCreditState) => {
  event.preventDefault()
  await setRTGCreditState(true, 'loading', async () => {
    const order = getOrder()
    let entries
    let invalidFields = []
    entries = Object.entries(rtgCreditInfo)
    for (let i = 0; i < entries.length; i++) {
      const entryKey = entries[i][0]
      const entryData = entries[i][1]
      if (entryData === '') {
        invalidFields.push(entryKey)
      } else {
        if (entryKey === 'cardNumber') {
          ;(entryData.length < 16 || isNaN(entryData.toString())) && invalidFields.push('cardNumber')
        } else if (entryKey === 'zip') {
          !validateZip(entryData) && invalidFields.push('zip')
        } else if (entryKey === 'acknowledge') {
          !entryData && invalidFields.push('acknowledge')
        } else if (entryKey === 'terms') {
          !entryData && invalidFields.push('terms')
        }
      }
    }
    setRTGCreditState({ loading: invalidFields < 1, invalidFields })
    if (invalidFields.length < 1) {
      try {
        let rtgPaymentInfo = []
        const giftCards = order.paymentInfo.filter(payment => payment.paymentType === 'GIFT')
        if (giftCards.length > 0) {
          rtgPaymentInfo = giftCards
        }
        rtgPaymentInfo.push({
          paymentType: 'FIN',
          paymentProperties: {
            accountNumber: rtgCreditInfo.cardNumber,
            financePlan: plan.financeCode,
            zip: rtgCreditInfo.zip,
            hasPayments: plan.downPaymentRequired,
          },
        })
        const data = await updatePayment({
          paymentInfo: rtgPaymentInfo,
          orderId: order ? order.orderId : null,
        }).catch(err => {
          const message = err.response.data.error.message
          if (err.response.data.error.message.includes('exceeds')) {
            const messageArr = message.split(' ')
            setRTGCreditState([`exceeds ${ messageArr[messageArr.length - 1] }`], 'invalidFields')
          } else {
            throw err
          }
          setRTGCreditState(false, 'loading')
          reportToSentry(err, order, 'updatePayment', 'apply RTG financing')
        })
        setRTGCreditState({
          rtgCreditInfo: {
            name: '',
            cardNumber: '',
            zip: '',
            acknowledge: false,
            terms: false,
          },
        })
        if (data && data.orderId) {
          const fin = data.paymentInfo.filter(payment => payment.paymentType === 'FIN')[0]
          if (data.amountDue <= 0) {
            store.dispatch(setOrder(data))
            store.dispatch(setCheckoutStep('review'))
            checkoutStepAnalytics('review')
          } else if (fin && fin.authorizedAmount === 0) {
            throw 'No available credit balance remaining.'
          } else {
            store.dispatch(
              setOrder({
                ...data,
                selectedPaymentType: 'Credit',
              })
            )
            setRTGCreditState({
              success: true,
              loading: false,
            })
          }
        }
      } catch (err) {
        setRTGCreditState({
          invalidFields: ['failure'],
          errorMsg: err.toString().includes('remaining') ? err : 'Unable to submit Rooms To Go credit card.',
          loading: false,
        })
      }
    }
  })
}

export const removeFinancingPlan = async setLoading => {
  setLoading(true)
  const order = getOrder()
  if (order && order.paymentInfo) {
    let paymentInfo = []
    const payments = order.paymentInfo.filter(
      payment => payment.paymentType !== 'FIN' && payment.paymentType !== 'CYBERV2'
    )
    if (payments.length > 0) {
      paymentInfo = payments
    }
    const data = await updatePayment({
      paymentInfo: paymentInfo,
      orderId: order.orderId,
    }).catch(err => {
      setLoading(false)
      reportToSentry(err, order, 'updatePayment', 'remove RTG financing')
    })
    store.dispatch(
      setOrder({
        ...data,
        selectedPaymentType: 'Credit',
      })
    )
    setLoading(false)
  }
}
