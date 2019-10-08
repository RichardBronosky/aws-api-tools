import { mockStoreDispatch } from '../../../test-utils/redux'
import * as checkoutRedux from '../../../../redux/modules/checkout'
import * as checkoutService from '../../../services/checkout'
import * as globalCheckoutHelper from '../global'
import * as shippingSectionHelper from '../shipping-section'
import * as deliverySectionHelper from '../delivery-section'
import * as paymentSectionHelper from '../payment-section/payment-section'
import * as billingHelper from '../payment-section/billing-address'
import { order1 } from '@mocks/checkoutDataMocks'

describe('global checkout helper', () => {
  test('setOrderInfo changes order correctly when setting emailCampaign field to false', () => {
    const initialState = {
      checkout: {
        order: {
          emailCampaign: true,
        },
      },
    }
    mockStoreDispatch(initialState)
    checkoutRedux.setOrder = jest.fn()
    const spy = jest.spyOn(globalCheckoutHelper, 'setOrderInfo')
    globalCheckoutHelper.setOrderInfo(false, 'emailCampaign')
    expect(checkoutRedux.setOrder).toHaveBeenCalledWith({ emailCampaign: false })
    spy.mockRestore()
  })

  test('setCheckoutStep changes checkout step from shipping to delivery when required fields are valid', () => {
    const initialState = {
      checkout: {
        checkoutStep: 'shipping',
      },
    }
    mockStoreDispatch(initialState)
    checkoutRedux.setCheckoutStep = jest.fn()
    checkoutRedux.setCheckoutStepLoading = jest.fn()
    shippingSectionHelper.validateShippingStep = jest.fn(() => [])
    globalCheckoutHelper
      .setCheckoutStep(null, 'shipping', 'delivery')
      .then(() => expect(checkoutRedux.setCheckoutStep).toHaveBeenCalledWith('delivery'))
  })

  test('setCheckoutStep does not change checkout step from shipping to delivery when required fields are invalid', () => {
    const initialState = {
      checkout: {
        checkoutStep: 'shipping',
      },
    }
    mockStoreDispatch(initialState)
    checkoutRedux.setCheckoutStep = jest.fn()
    checkoutRedux.setCheckoutStepLoading = jest.fn()
    shippingSectionHelper.validateShippingStep = jest.fn(() => ['firstName'])
    globalCheckoutHelper.setCheckoutStep(null, 'shipping', 'delivery')
    expect(checkoutRedux.setCheckoutStep).not.toHaveBeenCalled()
  })

  test('setCheckoutStep does not change checkout step from payment to review when required fields are invalid', () => {
    const initialState = {
      checkout: {
        checkoutStep: 'payment',
      },
    }
    mockStoreDispatch(initialState)
    checkoutRedux.setCheckoutStep = jest.fn()
    checkoutRedux.setCheckoutStepLoading = jest.fn()
    paymentSectionHelper.validatePaymentStep = jest.fn(() => ['bad field'])
    globalCheckoutHelper.setCheckoutStep(null, 'payment', 'review')
    expect(checkoutRedux.setCheckoutStep).not.toHaveBeenCalled()
  })

  test('setCheckoutStep does not change checkout step from shipping to payment', () => {
    const initialState = {
      checkout: {
        checkoutStep: 'shipping',
      },
    }
    mockStoreDispatch(initialState)
    checkoutRedux.setCheckoutStep = jest.fn()
    checkoutRedux.setCheckoutStepLoading = jest.fn()
    globalCheckoutHelper.setCheckoutStep(null, 'shipping', 'payment')
    expect(checkoutRedux.setCheckoutStep).not.toHaveBeenCalled()
  })

  test('setCheckoutStep does not change checkout step from shipping to review', () => {
    const initialState = {
      checkout: {
        checkoutStep: 'shipping',
      },
    }
    mockStoreDispatch(initialState)
    checkoutRedux.setCheckoutStep = jest.fn()
    checkoutRedux.setCheckoutStepLoading = jest.fn()
    globalCheckoutHelper.setCheckoutStep(null, 'shipping', 'review')
    expect(checkoutRedux.setCheckoutStep).not.toHaveBeenCalled()
  })

  test('setCheckoutStep changes checkout step from delivery to payment when required fields are valid', () => {
    const initialState = {
      checkout: {
        checkoutStep: 'delivery',
      },
    }
    mockStoreDispatch(initialState)
    checkoutRedux.setCheckoutStep = jest.fn()
    checkoutRedux.setCheckoutStepLoading = jest.fn()
    deliverySectionHelper.validateDeliveryStep = jest.fn(() => [])
    globalCheckoutHelper
      .setCheckoutStep(null, 'delivery', 'payment')
      .then(() => expect(checkoutRedux.setCheckoutStep).toHaveBeenCalledWith('payment'))
  })

  test('setCheckoutStep does not change checkout step from delivery to review', () => {
    const initialState = {
      checkout: {
        checkoutStep: 'delivery',
      },
    }
    mockStoreDispatch(initialState)
    checkoutRedux.setCheckoutStep = jest.fn()
    checkoutRedux.setCheckoutStepLoading = jest.fn()
    globalCheckoutHelper.setCheckoutStep(null, 'delivery', 'review')
    expect(checkoutRedux.setCheckoutStep).not.toHaveBeenCalled()
  })

  test('setCheckoutStep calls validateShippingStep when checkoutStep is shipping', () => {
    shippingSectionHelper.validateShippingStep = jest.fn(() => [])
    globalCheckoutHelper.setCheckoutStep(null, 'shipping', 'delivery')
    expect(shippingSectionHelper.validateShippingStep).toHaveBeenCalled()
  })

  test('setCheckoutStep calls validateDeliveryStep when checkoutStep is delivery', () => {
    deliverySectionHelper.validateDeliveryStep = jest.fn(() => [])
    globalCheckoutHelper.setCheckoutStep(null, 'delivery', 'payment')
    expect(deliverySectionHelper.validateDeliveryStep).toHaveBeenCalled()
  })

  test('checkManualAddress returns original invalid fields if order acceptManual is true', () => {
    globalCheckoutHelper.checkManualAddress({ ...order1, acceptManual: true }, []).then(out => expect(out).toEqual([]))
  })

  test('checkManualAddress calls addressSuggestion if total matches from inital qas call is greater than 0', () => {
    checkoutService.fetchAddressLookup = jest.fn(() =>
      Promise.resolve({
        totalMatches: 1,
      })
    )
    globalCheckoutHelper.addressSuggestion = jest.fn()
    globalCheckoutHelper
      .checkManualAddress(order1, [])
      .then(() => expect(globalCheckoutHelper.addressSuggestion).toHaveBeenCalled())
  })

  test('checkManualAddress calls addressSuggestion if address zip code includes plus4', () => {
    checkoutService.fetchAddressLookup = jest.fn(() =>
      Promise.resolve({
        totalMatches: 0,
      })
    )
    globalCheckoutHelper.addressSuggestion = jest.fn()
    globalCheckoutHelper
      .checkManualAddress({ ...order1, shippingAddress: { zip: '30328-1234' } }, [])
      .then(() => expect(globalCheckoutHelper.addressSuggestion).toHaveBeenCalled())
  })

  test('checkManualAddress calls addressSuggestion if no qas matches', () => {
    checkoutService.fetchAddressLookup = jest.fn(() =>
      Promise.resolve({
        totalMatches: 0,
      })
    )
    globalCheckoutHelper.addressSuggestion = jest.fn()
    globalCheckoutHelper
      .checkManualAddress(order1, [])
      .then(() => expect(globalCheckoutHelper.addressSuggestion).toHaveBeenCalled())
  })

  test('checkManualAddress returns unable to verify if qas call fails', () => {
    checkoutService.fetchAddressLookup = jest.fn(() => Promise.reject())
    globalCheckoutHelper
      .checkManualAddress({ ...order1, acceptManual: false }, [])
      .then(out => expect(out).toEqual(['unable to verify']))
  })

  test('closeSuggestionModal clears shippingInvalidFields and suggestedAddress from order', () => {
    const initialState = {
      checkout: {
        order: {
          ...order1,
          suggestedAddress: 'Test Address',
        },
      },
    }
    mockStoreDispatch(initialState)
    checkoutRedux.setOrder = jest.fn()
    checkoutRedux.setShippingInvalidFields = jest.fn()
    globalCheckoutHelper.closeSuggestionModal()
    expect(checkoutRedux.setOrder).toHaveBeenCalledWith(order1)
    expect(checkoutRedux.setShippingInvalidFields).toHaveBeenCalledWith([])
  })

  test('acceptAddressSuggestion works correctly for shipping addresses', () => {
    shippingSectionHelper.setAddress = jest.fn()
    const setBillingState = jest.fn()
    billingHelper.submitBillingAddress = jest.fn()
    globalCheckoutHelper.acceptAddressSuggestion('test', false, setBillingState)
    expect(shippingSectionHelper.setAddress).toHaveBeenCalled()
    expect(billingHelper.submitBillingAddress).not.toHaveBeenCalled()
  })

  test('acceptAddressSuggestion works correctly for billing addresses', () => {
    shippingSectionHelper.setAddress = jest.fn()
    const setBillingState = jest.fn()
    billingHelper.submitBillingAddress = jest.fn()
    globalCheckoutHelper.acceptAddressSuggestion('test', true, setBillingState)
    expect(shippingSectionHelper.setAddress).toHaveBeenCalled()
    expect(billingHelper.submitBillingAddress).toHaveBeenCalled()
  })

  test('declineAddressSuggestion works correctly for shipping address', () => {
    const initialState = {
      checkout: {
        checkoutStep: 'shipping',
        order: order1,
      },
    }
    mockStoreDispatch(initialState)
    checkoutRedux.setOrder = jest.fn()
    billingHelper.submitBillingAddress = jest.fn()
    globalCheckoutHelper.declineAddressSuggestion(false, jest.fn())
    expect(checkoutRedux.setOrder).toHaveBeenCalledWith(order1)
    expect(billingHelper.submitBillingAddress).not.toHaveBeenCalled()
  })

  test('declineAddressSuggestion works correctly for billing address', () => {
    const initialState = {
      checkout: {
        checkoutStep: 'payment',
        order: order1,
      },
    }
    mockStoreDispatch(initialState)
    checkoutRedux.setOrder = jest.fn()
    billingHelper.submitBillingAddress = jest.fn()
    globalCheckoutHelper.declineAddressSuggestion(true, jest.fn())
    expect(checkoutRedux.setOrder).toHaveBeenCalledWith(order1)
    expect(billingHelper.submitBillingAddress).toHaveBeenCalled()
  })
})
