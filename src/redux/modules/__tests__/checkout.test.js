import reducer, {
  initialState,
  SET_ORDER,
  SET_CHECKOUT_STEP,
  SET_CHECKOUT_STEPS_COMPLETED,
  SET_CHECKOUT_STEP_LOADING,
  SET_SHIPPING_INVALID_FIELDS,
  SET_DELIVERY_INVALID_FIELDS,
  SET_PAYMENT_INVALID_FIELDS,
  SET_DELIVERY_CALENDAR,
} from '../checkout'
import { order1 } from '../../../lib/mocks/checkoutDataMocks'

describe('checkout reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, initialState)).toEqual(initialState)
  })

  it('should handle SET_ORDER when order is empty', () => {
    expect(
      reducer(initialState, {
        type: SET_ORDER,
        order: order1,
      })
    ).toEqual({
      ...initialState,
      order: {
        ...initialState.order,
        ...order1,
      },
    })
  })

  it('should handle SET_CHECKOUT_STEP when user changes checkout step from shipping to delivery', () => {
    expect(
      reducer(initialState, {
        type: SET_CHECKOUT_STEP,
        checkoutStep: 'delivery',
      })
    ).toEqual({
      ...initialState,
      checkoutStep: 'delivery',
      checkoutStepsCompleted: {
        ...initialState.checkoutStepsCompleted,
        shipping: true,
      },
    })
  })

  it('should handle SET_CHECKOUT_STEP when user changes checkout step from delivery to payment', () => {
    expect(
      reducer(
        {
          ...initialState,
          checkoutStep: 'delivery',
        },
        {
          type: SET_CHECKOUT_STEP,
          checkoutStep: 'payment',
        }
      )
    ).toEqual({
      ...initialState,
      checkoutStep: 'payment',
      checkoutStepsCompleted: {
        ...initialState.checkoutStepsCompleted,
        shipping: true,
        delivery: true,
      },
    })
  })

  it('should handle SET_CHECKOUT_STEP when user changes checkout step from payment to review', () => {
    expect(
      reducer(
        {
          ...initialState,
          checkoutStep: 'payment',
        },
        {
          type: SET_CHECKOUT_STEP,
          checkoutStep: 'review',
        }
      )
    ).toEqual({
      ...initialState,
      checkoutStep: 'review',
      checkoutStepsCompleted: {
        shipping: true,
        delivery: true,
        payment: true,
      },
    })
  })

  it('should handle SET_CHECKOUT_STEP_LOADING when user changes checkout step', () => {
    expect(
      reducer(initialState, {
        type: SET_CHECKOUT_STEP_LOADING,
        loading: true,
      })
    ).toEqual({
      ...initialState,
      loading: true,
    })
  })

  it('should handle SET_CHECKOUT_STEPS_COMPLETED when user changes checkout steps completed', () => {
    expect(
      reducer(initialState, {
        type: SET_CHECKOUT_STEPS_COMPLETED,
        checkoutStepsCompleted: {
          shipping: true,
          delivery: true,
          payment: false,
        },
      })
    ).toEqual({
      ...initialState,
      checkoutStepsCompleted: {
        shipping: true,
        delivery: true,
        payment: false,
      },
    })
  })

  it('should handle SET_SHIPPING_INVALID_FIELDS when there are invalid fields in checkout shipping step', () => {
    expect(
      reducer(initialState, {
        type: SET_SHIPPING_INVALID_FIELDS,
        shippingInvalidFields: ['firstName', 'lastName'],
      })
    ).toEqual({
      ...initialState,
      shippingInvalidFields: ['firstName', 'lastName'],
    })
  })

  it('should handle SET_DELIVERY_INVALID_FIELDS when there are invalid fields in checkout delivery step', () => {
    expect(
      reducer(initialState, {
        type: SET_DELIVERY_INVALID_FIELDS,
        deliveryInvalidFields: ['payment incomplete'],
      })
    ).toEqual({
      ...initialState,
      deliveryInvalidFields: ['payment incomplete'],
    })
  })

  it('should handle SET_PAYMENT_INVALID_FIELDS when there are invalid fields in checkout payment step', () => {
    expect(
      reducer(initialState, {
        type: SET_PAYMENT_INVALID_FIELDS,
        paymentInvalidFields: ['bad field'],
      })
    ).toEqual({
      ...initialState,
      paymentInvalidFields: ['bad field'],
    })
  })

  it('should handle SET_DELIVERY_CALENDAR when delivery dates are needed for checkout', () => {
    expect(
      reducer(initialState, {
        type: SET_DELIVERY_CALENDAR,
        deliveryCalendar: [
          {
            date: '2019-07-26',
            dayOfWeek: 'Fri',
            isExpressDelivery: false,
            isPickup: true,
            isStandardDelivery: true,
            readable: 'July 26',
          },
        ],
      })
    ).toEqual({
      ...initialState,
      deliveryCalendar: [
        {
          date: '2019-07-26',
          dayOfWeek: 'Fri',
          isExpressDelivery: false,
          isPickup: true,
          isStandardDelivery: true,
          readable: 'July 26',
        },
      ],
    })
  })
})
