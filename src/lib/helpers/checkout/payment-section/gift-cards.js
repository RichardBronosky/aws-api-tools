import { store } from '../../../../redux/store'
import { setOrder } from '../../../../redux/modules/checkout'
import { getOrder, reportToSentry } from '../global'
import { updatePayment } from '../../../services/checkout'
import { hasIn } from 'lodash'

export const getGiftCards = order => {
  order = order || getOrder()
  let giftCards = []
  if (order && order.paymentInfo) {
    const cards = order.paymentInfo.filter(payment => payment.paymentType === 'GIFT')
    if (cards && cards.length > 0) {
      for (let i = 0, n = cards.length; i < n; i++) {
        if (cards[i].paymentProperties) {
          giftCards.push({
            giftCardNumber: cards[i].paymentProperties.cardNumber,
            giftCardPin: cards[i].paymentProperties.pin,
            authorizedAmount: cards[i].authorizedAmount,
            balance: cards[i].paymentProperties.balance,
          })
        }
      }
    }
  }
  return giftCards
}

export const setOrderGiftCardInfo = (info, field) => {
  let order = getOrder()
  if (field) {
    order = {
      ...order,
      giftCardInfo: {
        ...order.giftCardInfo,
        [field]: info,
      },
    }
  } else {
    order = {
      ...order,
      giftCardInfo: {
        ...order.giftCardInfo,
        ...info,
      },
    }
  }
  store.dispatch(setOrder(order))
}

export const validateGiftCard = (order, setGiftCardState = null) => {
  let invalidFields = []
  if (order.giftCardInfo.giftCardNumber === '' || order.giftCardInfo.giftCardNumber.length !== 16) {
    invalidFields.push('giftCardNumber')
  }
  if (order.giftCardInfo.giftCardPin === '') {
    invalidFields.push('giftCardPin')
  }
  setGiftCardState && setGiftCardState(invalidFields, 'invalidFields')
  return invalidFields.length < 1
}

export const onApplyGiftCard = (order, setGiftCardState) => {
  setGiftCardState(
    {
      invalidFields: [],
      unableToAddMessage: '',
    },
    null,
    () => {
      const valid = validateGiftCard(order, setGiftCardState)
      if (valid) {
        setGiftCardState(true, 'loading')
        let appliedAlready = false
        const giftCards = getGiftCards(order)
        const giftCardsExist = giftCards.length > 0
        if (giftCardsExist) {
          for (let i = 0, n = giftCards.length; i < n; i++) {
            if (giftCards[i].giftCardNumber === order.giftCardInfo.giftCardNumber) {
              appliedAlready = true
            }
          }
        }
        if (!appliedAlready) {
          let orderPaymentInfo = [
            {
              paymentType: 'GIFT',
              paymentProperties: {
                cardNumber: order.giftCardInfo.giftCardNumber,
                pin: order.giftCardInfo.giftCardPin,
              },
            },
          ]
          if (order.paymentInfo && order.paymentInfo.length > 0) {
            const giftCards = order.paymentInfo.filter(payment => payment.paymentType === 'GIFT')
            if (giftCards.length > 0) {
              for (let i = 0, n = giftCards.length; i < n; i++) {
                orderPaymentInfo.unshift(giftCards[i])
              }
            }
          }
          updatePayment({
            orderId: order.orderId,
            paymentInfo: orderPaymentInfo,
          })
            .then(data => {
              store.dispatch(setOrder(data))
              let giftCardInfo = getGiftCards(data)
              const giftCards = data.paymentInfo.filter(payment => payment.paymentType === 'GIFT')
              const orderCard = giftCards.filter(
                card =>
                  card.paymentProperties.cardNumber && card.paymentProperties.cardNumber === giftCardInfo.giftCardNumber
              )[0]
              if (orderCard && orderCard.paymentProperties) {
                const newOrderInfo = {
                  ...order,
                  giftCardInfo: {
                    giftCards: giftCardInfo,
                    addAnotherCard: false,
                    giftCardNumber: '',
                    giftCardPin: '',
                    useGiftCard: true,
                  },
                }
                store.dispatch(setOrder(newOrderInfo))
                setGiftCardState({
                  unableToAddMessage: '',
                  loading: false,
                })
              } else {
                setGiftCardState(false, 'loading')
              }
            })
            .catch(err => {
              let errorMessage = 'Unable to add card'
              if (hasIn(err, 'response.request.responseText')) {
                const returnedErrorMessage = JSON.parse(err.response.request.responseText).error.message

                if (returnedErrorMessage === 'Can not use a gift card to pay for a gift card.') {
                  errorMessage = returnedErrorMessage
                }
              }

              setGiftCardState({
                unableToAddMessage: errorMessage,
                loading: false,
              })

              reportToSentry(err, order, 'updatePayment', 'apply gift card')
            })
        } else {
          setGiftCardState({
            unableToAddMessage: 'Gift card has already been applied.',
            loading: false,
          })
        }
      }
    }
  )
}

export const onAddAnotherCard = order => {
  if (order) {
    const newOrderInfo = {
      ...order,
      giftCardInfo: {
        ...order.giftCardInfo,
        addAnotherCard: true,
      },
    }
    store.dispatch(setOrder(newOrderInfo))
  }
}

export const onChangeUseGiftCard = (order, checked) => {
  setOrderGiftCardInfo({
    useGiftCard: checked,
    addAnotherCard: false,
  })
  if (checked) {
    const giftCards = getGiftCards(order)
    if (order && giftCards && giftCards.length > 0) {
      let newGiftCards = []
      for (let i = 0, n = giftCards.length; i < n; i++) {
        newGiftCards.push({
          paymentType: 'GIFT',
          paymentProperties: {
            cardNumber: giftCards[i].giftCardNumber,
            pin: giftCards[i].giftCardPin,
          },
        })
      }
      updatePayment({
        paymentInfo: newGiftCards,
        orderId: order.orderId,
      })
        .then(data => {
          store.dispatch(setOrder(data))
        })
        .catch(err => reportToSentry(err, order, 'updatePayment', 'change use gift card'))
    }
  } else if (order.selectedPaymentType === 'Credit') {
    store.dispatch(
      setOrder({
        ...order,
        giftCardInfo: {
          ...order.giftCardInfo,
          useGiftCard: false,
          addAnotherCard: false,
        },
        cyberSourceSignature: null,
      })
    )
  }
}

export const onRemoveGiftCard = (order, giftCard, setGiftCardState) => {
  setGiftCardState(true, 'removing')
  const giftCards = getGiftCards(order)
  if (order && order.paymentInfo && giftCards) {
    store.dispatch(
      setOrder({
        ...order,
        cyberSourceSignature: null,
      })
    )
    const orderGiftInfo = order.paymentInfo.filter(payment => payment.paymentType === 'GIFT')
    const newOrderGiftInfo = orderGiftInfo.filter(gift => gift.paymentProperties.cardNumber !== giftCard.giftCardNumber)
    let newOrderPaymentInfo = []
    if (newOrderGiftInfo.length > 0) {
      for (let i = 0, n = newOrderGiftInfo.length; i < n; i++) {
        newOrderPaymentInfo.push(newOrderGiftInfo[i])
      }
    }
    updatePayment({
      orderId: order.orderId,
      paymentInfo: newOrderPaymentInfo,
    })
      .then(data => {
        const newGiftCards = getGiftCards(data)
        data = {
          ...data,
          giftCardInfo: {
            ...order.giftCardInfo,
            giftCards: newGiftCards,
            giftCardNumber: '',
            giftCardPin: '',
            addAnotherCard: false,
            useGiftCard: newGiftCards.length > 0,
          },
        }
        store.dispatch(setOrder(data))
        setGiftCardState(false, 'removing')
      })
      .catch(err => reportToSentry(err, order, 'updatePayment', 'remove gift card'))
  }
}
