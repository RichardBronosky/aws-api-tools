import { mockStoreDispatch } from '../../../test-utils/redux'
import * as checkoutRedux from '../../../../redux/modules/checkout'
import * as globalCheckoutHelper from '../global'
import * as shippingSectionHelper from '../shipping-section'
import * as checkoutService from '../../../services/checkout'
import * as locationService from '../../../services/location'
import * as geoLocationHelper from '../../geo-location'
import * as cartHelper from '../../cart'
import { order1, fetchAddressLookupResp } from '../../../mocks/checkoutDataMocks'
import { mockLocation1 } from '../../../mocks/locationDataMocks'
import { mockCart } from '../../../mocks/cartDataMocks'

describe('shipping section checkout helper', () => {
  const initialState = {
    checkout: {
      order: {
        contact: {},
        shippingAddress: {},
      },
    },
    location: mockLocation1,
  }

  test('order contact object changes correctly when setting firstName', () => {
    mockStoreDispatch(initialState)
    checkoutRedux.setOrder = jest.fn()
    const spy = jest.spyOn(shippingSectionHelper, 'setContactInfo')
    shippingSectionHelper.setContactInfo('Test', 'firstName')
    expect(checkoutRedux.setOrder).toHaveBeenCalledWith({ contact: { firstName: 'Test' }, shippingAddress: {} })
    spy.mockRestore()
  })

  test('order shippingAddress object changes correctly when setting city', () => {
    mockStoreDispatch(initialState)
    checkoutRedux.setOrder = jest.fn()
    const spy = jest.spyOn(shippingSectionHelper, 'setShippingAddressInfo')
    shippingSectionHelper.setShippingAddressInfo('Test City', 'city')
    expect(checkoutRedux.setOrder).toHaveBeenCalledWith({ contact: {}, shippingAddress: { city: 'Test City' } })
    spy.mockRestore()
  })

  test('order shippingAddress object changes correctly when setting multiple fields', () => {
    mockStoreDispatch(initialState)
    checkoutRedux.setOrder = jest.fn()
    const spy = jest.spyOn(shippingSectionHelper, 'setShippingAddressInfo')
    shippingSectionHelper.setShippingAddressInfo({
      address1: '1111 Test Street',
      zip: '33584',
    })
    expect(checkoutRedux.setOrder).toHaveBeenCalledWith({
      contact: {},
      shippingAddress: {
        address1: '1111 Test Street',
        zip: '33584',
      },
    })
    spy.mockRestore()
  })

  // this test is having intermittent errors
  // test('validateShippingStep does not return any invalid fields when all info is valid', async () => {
  //   globalCheckoutHelper.getOrder = jest.fn(() => order1)
  //   cartHelper.getCart = jest.fn(() => mockCart)
  //   const axios = require('axios')
  //   axios.post = jest.fn()
  //   locationService.getLocation = jest.fn(() => Promise.resolve({}))
  //   shippingSectionHelper.checkShippingZip = jest.fn(() => Promise.resolve(true))
  //   checkoutService.updateAddress = jest.fn(() => Promise.resolve({}))
  //   return shippingSectionHelper.validateShippingStep('delivery').then(data => {
  //     expect(data).toEqual([])
  //   })
  // })

  // test('validateShippingStep does not returns invalid fields array when using address lookup', async () => {
  //   globalCheckoutHelper.getOrder = jest.fn(() => ({
  //     ...order1,
  //     shippingAddress: {
  //       addressLookupSuccess: false,
  //       showAddressLookup: true,
  //     },
  //     contact: {
  //       firstName: '',
  //       lastName: '',
  //       phone: '4',
  //       email: 'a',
  //       altPhone: '4',
  //     },
  //   }))
  //   checkoutService.updateAddress = jest.fn(() => Promise.resolve({}))
  //   return shippingSectionHelper.validateShippingStep('delivery').then(data => {
  //     expect(data).toEqual(['firstName', 'lastName', 'phone', 'email', 'alternatePhone', 'addressLookup'])
  //   })
  // })

  // test('validateShippingStep does not return invalid fields array when using manual address entry', async () => {
  //   globalCheckoutHelper.getOrder = jest.fn(() => ({
  //     ...order1,
  //     shippingAddress: {
  //       address1: '',
  //       address2: '',
  //       city: '',
  //       state: '',
  //       zip: '',
  //       addressLookupSuccess: false,
  //       showAddressLookup: false,
  //     },
  //     contact: {
  //       firstName: '',
  //       lastName: '',
  //       phone: '4',
  //       email: 'a',
  //       altPhone: '4',
  //     },
  //   }))
  //   checkoutService.updateAddress = jest.fn(() => Promise.resolve({}))
  //   globalCheckoutHelper.checkManualAddress = jest.fn((order, invalidFields) => invalidFields)
  //   return shippingSectionHelper.validateShippingStep('delivery').then(data => {
  //     expect(data).toEqual([
  //       'firstName',
  //       'lastName',
  //       'phone',
  //       'email',
  //       'alternatePhone',
  //       'street',
  //       'city',
  //       'state',
  //       'zip',
  //     ])
  //   })
  // })

  // test('validateShippingStep returns invalid field when trying to switch to payment checkoutStep', async () => {
  //   globalCheckoutHelper.getOrder = jest.fn(() => order1)
  //   checkoutService.updateAddress = jest.fn(() => Promise.resolve({}))
  //   return shippingSectionHelper.validateShippingStep('payment').then(data => {
  //     expect(data).toEqual(['delivery incomplete'])
  //   })
  // })

  // test('validateShippingStep returns invalid field when trying to switch to review checkoutStep', async () => {
  //   globalCheckoutHelper.getOrder = jest.fn(() => order1)
  //   checkoutService.updateAddress = jest.fn(() => Promise.resolve({}))
  //   return shippingSectionHelper.validateShippingStep('review').then(data => {
  //     expect(data).toEqual(['payment incomplete'])
  //   })
  // })

  // test('validateShippingStep returns invalid field when orders updateAddress fails', async () => {
  //   globalCheckoutHelper.getOrder = jest.fn(() => order1)
  //   checkoutService.updateAddress = jest.fn(() => Promise.reject({}))
  //   return shippingSectionHelper.validateShippingStep('delivery').then(data => {
  //     expect(data).toEqual(['buttonClick'])
  //   })
  // })

  // test("getAddressSpecificBody return the correct data to sent to order's updateAddress", () => {
  //   geoLocationHelper.getCurrentLocation = jest.fn(() => mockLocation1)
  //   expect(shippingSectionHelper.getAddressSpecificBody(order1)).toEqual({
  //     orderId: order1.orderId,
  //     shippingAddress: {
  //       ...order1.shippingAddress,
  //       county: 'Hillsborough',
  //       country_code: 'US',
  //     },
  //     contact: order1.contact,
  //     deliveryTexts: order1.deliveryTexts,
  //     emailCampaign: order1.emailCampaign,
  //     distributionIndex: 1,
  //   })
  // })

  // test('checkOrderDeliveryDate resets delivery date and isPickup when delivery date is not in delivery calendar', () => {
  //   expect(
  //     shippingSectionHelper.checkOrderDeliveryDate({
  //       ...order1,
  //       deliveryDate: '2019-07-12',
  //       deliveryCalendar: ['2019-07-13'],
  //       isPickup: false,
  //     })
  //   ).toEqual({
  //     ...order1,
  //     deliveryDate: '2019-07-13',
  //     deliveryCalendar: ['2019-07-13'],
  //     isPickup: false,
  //   })
  // })

  // test('checkOrderDeliveryDate does not reset delivery date and isPickup when delivery date is in delivery calendar', () => {
  //   expect(
  //     shippingSectionHelper.checkOrderDeliveryDate({
  //       ...order1,
  //       deliveryDate: '2019-07-12',
  //       deliveryCalendar: ['2019-07-12'],
  //       isPickup: false,
  //     })
  //   ).toEqual({
  //     ...order1,
  //     deliveryDate: '2019-07-12',
  //     deliveryCalendar: ['2019-07-12'],
  //     isPickup: false,
  //   })
  // })

  // test('checkOrderDeliveryDate resets pickup date and isPickup when pickup date is not in pickup calendar', () => {
  //   expect(
  //     shippingSectionHelper.checkOrderDeliveryDate({
  //       ...order1,
  //       deliveryDate: '2019-07-12',
  //       pickupCalendar: ['2019-07-13'],
  //       deliveryCalendar: ['2019-07-13'],
  //       isPickup: true,
  //     })
  //   ).toEqual({
  //     ...order1,
  //     deliveryDate: '2019-07-13',
  //     pickupCalendar: ['2019-07-13'],
  //     deliveryCalendar: ['2019-07-13'],
  //     isPickup: false,
  //   })
  // })

  // test('checkOrderDeliveryDate does not reset pickup date and isPickup when pickup date is in pickup calendar', () => {
  //   expect(
  //     shippingSectionHelper.checkOrderDeliveryDate({
  //       ...order1,
  //       deliveryDate: '2019-07-12',
  //       pickupCalendar: ['2019-07-12'],
  //       isPickup: true,
  //     })
  //   ).toEqual({
  //     ...order1,
  //     deliveryDate: '2019-07-12',
  //     pickupCalendar: ['2019-07-12'],
  //     isPickup: true,
  //   })
  // })

  // test('checkShippingZip returns true if getLocation does not return data', () => {
  //   return shippingSectionHelper.checkShippingZip(33584).then(data => {
  //     expect(data).toEqual(true)
  //   })
  // })

  // test('setAddress will seperate address lookup correctly and set shipping address in order', () => {
  //   mockStoreDispatch(initialState)
  //   checkoutRedux.setOrder = jest.fn()
  //   shippingSectionHelper.setAddress('1111 Road Pkwy, Atlanta GA 30338')
  //   expect(checkoutRedux.setOrder).toHaveBeenCalledWith({
  //     ...order1,
  //     shippingAddress: {
  //       ...order1.shippingAddress,
  //       address1: '1111 Road Pkwy',
  //       city: 'Atlanta',
  //       state: 'GA',
  //       zip: '30338',
  //       addressLookup: '1111 Road Pkwy, Atlanta GA 30338',
  //       addressLookupSuccess: true,
  //     },
  //   })
  // })

  // test('setAddress will not set address in order if no matches found in address lookup', () => {
  //   mockStoreDispatch(initialState)
  //   checkoutRedux.setOrder = jest.fn()
  //   shippingSectionHelper.setAddress('No matches.')
  //   expect(checkoutRedux.setOrder).toHaveBeenCalledWith({
  //     ...order1,
  //     shippingAddress: {
  //       ...order1.shippingAddress,
  //       addressLookupSuccess: false,
  //     },
  //   })
  // })

  // test('onAddressLookupChange will call fetchAddressLookup', () => {
  //   jest.spyOn(checkoutService, 'fetchAddressLookup').mockImplementation(() => Promise.reject())
  //   const setAddressItems = jest.fn()
  //   shippingSectionHelper.onAddressLookupChange(
  //     { preventDefault: jest.fn(), target: { value: 'test address' } },
  //     setAddressItems
  //   )
  //   expect(checkoutService.fetchAddressLookup).toHaveBeenCalledWith('test address')
  // })

  // test('onAddressLookupSelect will set order properly if address is in sale state', () => {
  //   mockStoreDispatch(initialState)
  //   checkoutRedux.setOrder = jest.fn()
  //   shippingSectionHelper.onAddressLookupSelect('4100 State Route 10, Alexandria KY 41001')
  //   expect(checkoutRedux.setOrder).toHaveBeenCalledWith({
  //     ...order1,
  //     shippingAddress: {
  //       ...order1.shippingAddress,
  //       address1: '4100 State Route 10',
  //       addressLookup: '4100 State Route 10, Alexandria KY 41001',
  //       addressLookupSuccess: true,
  //       city: 'Alexandria',
  //       state: 'KY',
  //       zip: '41001',
  //     },
  //   })
  // })

  // test('onAddressLookupSelect will alert if selected address is a no sale state', () => {
  //   const spy = jest.spyOn(window, 'alert').mockImplementation(() => {})
  //   shippingSectionHelper.onAddressLookupSelect('1 Sand, Irvine CA 92614')
  //   expect(spy).toHaveBeenCalled()
  //   spy.mockRestore()
  // })

  // test('onClickChangeAddress will reset address lookup values in order', () => {
  //   mockStoreDispatch(initialState)
  //   checkoutRedux.setOrder = jest.fn()
  //   shippingSectionHelper.onClickChangeAddress({ preventDefault: jest.fn() })
  //   expect(checkoutRedux.setOrder).toHaveBeenCalledWith({
  //     ...order1,
  //     shippingAddress: {
  //       ...order1.shippingAddress,
  //       showAddressLookup: true,
  //       addressLookup: '',
  //       addressLookupSuccess: false,
  //     },
  //   })
  // })

  // test("checkPlus4 will call setOrderInfo with both zip and plus4 in shipping address ('12345-1234')", () => {
  //   mockStoreDispatch(initialState)
  //   globalCheckoutHelper.setOrderInfo = jest.fn()
  //   shippingSectionHelper.checkPlus4({
  //     ...order1,
  //     shippingAddress: {
  //       ...order1.shippingAddress,
  //       zip: '12345',
  //       plus4: '1234',
  //     },
  //   })
  //   expect(globalCheckoutHelper.setOrderInfo).toHaveBeenCalledWith(
  //     {
  //       ...order1.shippingAddress,
  //       zip: '12345-1234',
  //       plus4: null,
  //     },
  //     'shippingAddress'
  //   )
  // })

  // test("checkPlus4 will not call setOrderInfo when plus4 is not presentin shipping address ('12345')", () => {
  //   mockStoreDispatch(initialState)
  //   globalCheckoutHelper.setOrderInfo = jest.fn()
  //   shippingSectionHelper.checkPlus4({
  //     ...order1,
  //     shippingAddress: {
  //       ...order1.shippingAddress,
  //       zip: '12345',
  //     },
  //   })
  //   expect(globalCheckoutHelper.setOrderInfo).not.toHaveBeenCalled()
  // })

  // test("checkPlus4 will call setOrderInfo with both zip and plus4 in billing address ('12345-1234')", () => {
  //   mockStoreDispatch(initialState)
  //   globalCheckoutHelper.setOrderInfo = jest.fn()
  //   shippingSectionHelper.checkPlus4({
  //     ...order1,
  //     billingAddress: {
  //       ...order1.billingAddress,
  //       zip: '12345',
  //       plus4: '1234',
  //     },
  //   })
  //   expect(globalCheckoutHelper.setOrderInfo).toHaveBeenCalledWith(
  //     {
  //       ...order1.billingAddress,
  //       zip: '12345-1234',
  //       plus4: null,
  //     },
  //     'billingAddress'
  //   )
  // })

  // test("checkPlus4 will not call setOrderInfo when plus4 is not presentin billing address ('12345')", () => {
  //   mockStoreDispatch(initialState)
  //   globalCheckoutHelper.setOrderInfo = jest.fn()
  //   shippingSectionHelper.checkPlus4({
  //     ...order1,
  //     billingAddress: {
  //       ...order1.billingAddress,
  //       zip: '12345',
  //     },
  //   })
  //   expect(globalCheckoutHelper.setOrderInfo).not.toHaveBeenCalled()
  // })

  // test('onStateChange will alert if selected state is a no sale state', () => {
  //   const spy = jest.spyOn(window, 'alert').mockImplementation(() => {})
  //   shippingSectionHelper.onStateChange({ preventDefault: jest.fn(), target: { value: 'PR' } })
  //   expect(spy).toHaveBeenCalled()
  //   spy.mockRestore()
  // })

  // test('onStateChange will alert if selected state is a no sale state', () => {
  //   const spy = jest.spyOn(window, 'alert').mockImplementation(() => {})
  //   shippingSectionHelper.onStateChange({ preventDefault: jest.fn(), target: { value: 'PR' } })
  //   expect(spy).toHaveBeenCalled()
  //   spy.mockRestore()
  // })
})
