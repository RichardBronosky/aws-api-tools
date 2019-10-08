// Actions
export const SET_ORDER = 'SET_ORDER'
export const SET_CHECKOUT_STEP = 'SET_CHECKOUT_STEP'
export const SET_CHECKOUT_STEPS_COMPLETED = 'SET_CHECKOUT_STEPS_COMPLETED'
export const SET_CHECKOUT_STEP_LOADING = 'SET_CHECKOUT_STEP_LOADING'
export const SET_SHIPPING_INVALID_FIELDS = 'SET_SHIPPING_INVALID_FIELDS'
export const SET_DELIVERY_INVALID_FIELDS = 'SET_DELIVERY_INVALID_FIELDS'
export const SET_PAYMENT_INVALID_FIELDS = 'SET_PAYMENT_INVALID_FIELDS'
export const SET_REVIEW_INVALID_FIELDS = 'SET_REVIEW_INVALID_FIELDS'
export const SET_DELIVERY_CALENDAR = 'SET_DELIVERY_CALENDAR'
export const SET_DECLINE_MODAL = 'SET_DECLINE_MODAL'

// Action Creators
export function setOrder(order) {
  return { type: SET_ORDER, order }
}

export function setCheckoutStep(checkoutStep) {
  return { type: SET_CHECKOUT_STEP, checkoutStep }
}

export function setCheckoutStepsCompleted(checkoutStepsCompleted) {
  return { type: SET_CHECKOUT_STEPS_COMPLETED, checkoutStepsCompleted }
}

export function setCheckoutStepLoading(loading) {
  return { type: SET_CHECKOUT_STEP_LOADING, loading }
}

export function setShippingInvalidFields(shippingInvalidFields) {
  return { type: SET_SHIPPING_INVALID_FIELDS, shippingInvalidFields }
}

export function setDeliveryInvalidFields(deliveryInvalidFields) {
  return { type: SET_DELIVERY_INVALID_FIELDS, deliveryInvalidFields }
}

export function setPaymentInvalidFields(paymentInvalidFields) {
  return { type: SET_PAYMENT_INVALID_FIELDS, paymentInvalidFields }
}

export function setReviewInvalidFields(reviewInvalidFields) {
  return { type: SET_REVIEW_INVALID_FIELDS, reviewInvalidFields }
}

export function setDeliveryCalendar(deliveryCalendar) {
  return { type: SET_DELIVERY_CALENDAR, deliveryCalendar }
}

export function setDeclineModalInfo(declineModalInfo) {
  return { type: SET_DECLINE_MODAL, declineModalInfo }
}

// Reducer
export const initialState = {
  order: {
    acceptManual: false,
    contact: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      altPhone: '',
    },
    shippingAddress: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country_code: 'US',
      addressLookup: '',
      addressLookupSuccess: false,
      showAddressLookup: true,
    },
    billingAddress: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country_code: 'US',
    },
    payer: {
      billingSubmitted: false,
      billingDifferent: false,
    },
    emailCampaign: true,
    deliveryTexts: true,
    additionalDirections: '',
    selectedPaymentType: 'Credit',
    giftCardInfo: {
      giftCards: [],
      useGiftCard: false,
      giftCardNumber: '',
      giftCardPin: '',
      addAnotherCard: false,
    },
    financePlan: {
      code: '',
      hasPayments: true,
    },
    reviewInfo: {
      acceptTerms: false,
      acceptPickupTerms: false,
    },
  },
  checkoutStep: 'shipping',
  shippingInvalidFields: [],
  deliveryCalendar: [],
  deliveryInvalidFields: [],
  paymentInvalidFields: [],
  reviewInvalidFields: [],
  loading: false,
  checkoutStepsCompleted: {
    shipping: false,
    delivery: false,
    payment: false,
  },
  declineModalInfo: {
    declineModalOpen: false,
    declineCloseLoading: false,
    declineType: 'Credit',
  },
}

export default (state = initialState, action) => {
  const newState = { ...state }
  switch (action.type) {
    case SET_ORDER:
      newState.order = {
        ...newState.order,
        ...action.order,
        shippingAddress: {
          ...newState.order.shippingAddress,
          ...action.order.shippingAddress,
        },
        payer: {
          ...newState.order.payer,
          ...action.order.payer,
        },
      }
      sessionStorage.setItem('order', JSON.stringify(newState.order))
      return {
        ...newState,
        order: newState.order,
      }
    case SET_CHECKOUT_STEP:
      let checkoutStepsCompleted
      if (action.checkoutStep === 'shipping') {
        checkoutStepsCompleted = {
          shipping: false,
          delivery: false,
          payment: false,
        }
      } else if (action.checkoutStep === 'delivery') {
        checkoutStepsCompleted = {
          shipping: true,
          delivery: false,
          payment: false,
        }
      } else if (action.checkoutStep === 'payment') {
        checkoutStepsCompleted = {
          shipping: true,
          delivery: true,
          payment: false,
        }
      } else if (action.checkoutStep === 'review') {
        checkoutStepsCompleted = {
          shipping: true,
          delivery: true,
          payment: true,
        }
      }
      sessionStorage.setItem('checkoutStepsCompleted', JSON.stringify(checkoutStepsCompleted))
      sessionStorage.setItem('checkoutStep', action.checkoutStep)
      const order = { ...newState.order, acceptManual: false }
      sessionStorage.setItem('order', JSON.stringify(order))
      return {
        ...newState,
        checkoutStep: action.checkoutStep,
        checkoutStepsCompleted: {
          ...checkoutStepsCompleted,
        },
        order,
      }
    case SET_CHECKOUT_STEPS_COMPLETED:
      return {
        ...newState,
        checkoutStepsCompleted: {
          ...action.checkoutStepsCompleted,
        },
      }
    case SET_CHECKOUT_STEP_LOADING:
      return {
        ...newState,
        loading: action.loading,
      }
    case SET_SHIPPING_INVALID_FIELDS:
      return {
        ...newState,
        shippingInvalidFields: action.shippingInvalidFields,
      }
    case SET_DELIVERY_INVALID_FIELDS:
      return {
        ...newState,
        deliveryInvalidFields: action.deliveryInvalidFields,
      }
    case SET_PAYMENT_INVALID_FIELDS:
      return {
        ...newState,
        paymentInvalidFields: action.paymentInvalidFields,
      }
    case SET_DELIVERY_CALENDAR:
      return {
        ...newState,
        deliveryCalendar: action.deliveryCalendar,
      }
    case SET_REVIEW_INVALID_FIELDS:
      return {
        ...newState,
        reviewInvalidFields: action.reviewInvalidFields,
      }
    case SET_DECLINE_MODAL:
      return {
        ...newState,
        declineModalInfo: {
          ...state.declineModalInfo,
          ...action.declineModalInfo,
        },
      }
    default:
      return state
  }
}
